/**
 * Development orchestrator.
 *
 * `npm run dev` should be the only command you need. When NETWORK_MODE is
 * "hardhat" the app talks to a local chain that lives entirely in memory, so
 * three things have to be true before Next.js is useful:
 *
 *   1. a Hardhat node is listening on 8545,
 *   2. CertificateRegistry is deployed on it,
 *   3. the deployed address matches CONTRACT_ADDRESS in .env.
 *
 * This script establishes all three, then starts Next.js. Any other
 * NETWORK_MODE (Sepolia, a hosted node) means the chain is somebody else's
 * problem and we go straight to Next.js.
 *
 * No new dependencies: plain node:child_process, node:net and fetch.
 */

import 'dotenv/config';
import { spawn } from 'node:child_process';
import net from 'node:net';
import fs from 'node:fs';
import path from 'node:path';

const RPC_PORT = 8545;
const RPC_URL = `http://127.0.0.1:${RPC_PORT}`;
const ARTIFACT = path.join(process.cwd(), 'src', 'contracts', 'CertificateRegistry.json');
const isWindows = process.platform === 'win32';

/** Children we started, newest last, so we can tear them down on exit. */
const children = [];

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const log = (msg) => console.log(`${c.dim('[dev]')} ${msg}`);

/**
 * Every child here is `node <local-cli-entrypoint>`, so no shell is involved.
 * That matters on Windows, where a shell would split process.execPath at the
 * space in "C:\Program Files\nodejs\node.exe".
 */
function run(command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    ...options,
  });
  children.push(child);
  return child;
}

/**
 * Tags the chain's output so it is distinguishable from Next.js in a shared
 * terminal, and folds away two kinds of noise: the twenty-account banner
 * printed at boot (well-known public test keys, and the one the app uses is
 * already in .env), and the bare JSON-RPC method names echoed for every call.
 * Transactions still print in full — deployment address, gas, block number.
 */
function pipePrefixed(child, label) {
  const skip =
    /^(Accounts\s*$|=+\s*$|WARNING: These accounts|Any funds sent|Account #\d|Private Key: |(eth|hardhat|web3|net|evm)_\w+( \(\d+\))?$)/;
  let suppressed = 0;
  let buffer = '';

  const write = (chunk) => {
    buffer += chunk;
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      // eslint-disable-next-line no-control-regex
      const plain = line.replace(/\x1b\[[0-9;]*m/g, '').trim();
      if (!plain) continue;
      if (skip.test(plain)) {
        suppressed += 1;
        continue;
      }
      if (suppressed > 0) {
        console.log(`${c.dim(label)} ${c.dim(`(${suppressed} noisy lines hidden)`)}`);
        suppressed = 0;
      }
      console.log(`${c.dim(label)} ${line}`);
    }
  };

  child.stdout?.setEncoding('utf8').on('data', write);
  child.stderr?.setEncoding('utf8').on('data', write);
}

function waitForExit(child) {
  return new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', resolve);
  });
}

/** True if something already holds the RPC port. */
function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' });
    const done = (result) => {
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(1000);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
  });
}

async function rpc(method, params = []) {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const body = await response.json();
  if (body.error) throw new Error(body.error.message);
  return body.result;
}

async function waitForRpc(timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await rpc('eth_chainId');
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  return false;
}

/** A contract "exists" only if the node reports bytecode at its address. */
async function hasContractCode(address) {
  if (!address) return false;
  try {
    const code = await rpc('eth_getCode', [address, 'latest']);
    return typeof code === 'string' && code !== '0x';
  } catch {
    return false;
  }
}

function shutdown(code = 0) {
  for (const child of children.reverse()) {
    if (child.exitCode === null && child.signalCode === null) {
      // On Windows, killing the npx wrapper leaves the real process behind.
      if (isWindows && child.pid) {
        spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
          stdio: 'ignore',
          shell: true,
        });
      } else {
        child.kill('SIGTERM');
      }
    }
  }
  process.exit(code);
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => shutdown(0));
}

function startNext() {
  log('starting Next.js');
  // Matches the previous "dev" script: the raw binary is invoked through node
  // so --max-http-header-size applies (Supabase auth cookies overflow the 16KB
  // default and the server answers HTTP 431).
  const next = run(process.execPath, [
    '--max-http-header-size=65536',
    './node_modules/next/dist/bin/next',
    'dev',
  ]);
  next.on('exit', (code) => shutdown(code ?? 0));
}

async function main() {
  const networkMode = (process.env.NETWORK_MODE || '').toLowerCase();

  if (networkMode !== 'hardhat') {
    log(`NETWORK_MODE=${networkMode || '(unset)'} — using a remote RPC, no local node needed`);
    startNext();
    return;
  }

  // --- 1. Node ------------------------------------------------------------
  if (await isPortOpen(RPC_PORT)) {
    log(`reusing the Hardhat node already listening on ${RPC_PORT}`);
  } else {
    log('starting the Hardhat node');
    const node = run(process.execPath, ['./node_modules/hardhat/internal/cli/bootstrap.js', 'node'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    pipePrefixed(node, '[chain]');

    if (!(await waitForRpc())) {
      console.error(c.red(`[dev] the Hardhat node never answered on ${RPC_URL}`));
      shutdown(1);
      return;
    }
    log(c.green(`Hardhat node ready on ${RPC_URL}`));
  }

  // --- 2. Contract --------------------------------------------------------
  const configured = process.env.CONTRACT_ADDRESS;

  if (await hasContractCode(configured)) {
    log(`CertificateRegistry already deployed at ${configured}`);
  } else {
    log('deploying CertificateRegistry');
    const deploy = run(
      process.execPath,
      ['./node_modules/hardhat/internal/cli/bootstrap.js', 'run', 'scripts/deploy.ts', '--network', 'localhost'],
      { stdio: 'inherit' }
    );
    const code = await waitForExit(deploy);
    if (code !== 0) {
      console.error(c.red('[dev] deployment failed — not starting Next.js'));
      shutdown(code ?? 1);
      return;
    }

    // --- 3. Address agreement --------------------------------------------
    // Deployment addresses are derived from the deployer's nonce. On a fresh
    // node the first deploy always lands on the address in .env; on a node
    // that has already seen transactions it will not, and every on-chain call
    // would then silently read an empty address.
    try {
      const deployed = JSON.parse(fs.readFileSync(ARTIFACT, 'utf8')).address;
      if (configured && deployed && deployed.toLowerCase() !== configured.toLowerCase()) {
        console.error(
          c.yellow(
            `\n[dev] ${c.bold('CONTRACT_ADDRESS in .env is out of date.')}\n` +
              `[dev]   .env      ${configured}\n` +
              `[dev]   deployed  ${deployed}\n` +
              `[dev] Update .env and restart, or on-chain verification will fail.\n`
          )
        );
      }
    } catch {
      // The deploy script reported success; a missing artifact is not fatal here.
    }
  }

  // --- 4. Next ------------------------------------------------------------
  startNext();
}

main().catch((error) => {
  console.error(c.red(`[dev] ${error?.message || error}`));
  shutdown(1);
});
