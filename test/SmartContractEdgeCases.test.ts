import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { CertificateRegistry } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("CertificateRegistry - Advanced Edge Cases & Fuzz Testing", function () {
  let certificateRegistry: CertificateRegistry;
  let owner: HardhatEthersSigner;
  let issuer1: HardhatEthersSigner;
  let issuer2: HardhatEthersSigner;
  let attacker: HardhatEthersSigner;

  const Status = {
    NotFound: 0,
    Valid: 1,
    Expired: 2,
    Revoked: 3,
    HashMismatch: 4,
  };

  beforeEach(async function () {
    [owner, issuer1, issuer2, attacker] = await ethers.getSigners();

    const CertificateRegistryFactory = await ethers.getContractFactory("CertificateRegistry");
    certificateRegistry = (await CertificateRegistryFactory.deploy()) as CertificateRegistry;
    await certificateRegistry.waitForDeployment();

    // Authorize issuer1 and issuer2
    await certificateRegistry.connect(owner).authorizeIssuer(issuer1.address);
    await certificateRegistry.connect(owner).authorizeIssuer(issuer2.address);
  });

  describe("1. Time & Expiration Boundary Edge Cases", function () {
    it("should handle expiration 1 second in the future and transition to Expired precisely", async function () {
      const certId = ethers.keccak256(ethers.toUtf8Bytes("CERT-TIME-1S"));
      const certHash = ethers.keccak256(ethers.toUtf8Bytes("PAYLOAD-TIME-1S"));

      const latestTime = await time.latest();
      const expiry = latestTime + 10; // 10 seconds in future

      await certificateRegistry.connect(issuer1).issueCertificate(certId, certHash, expiry);

      // Verify currently Valid
      let [isValid, status] = await certificateRegistry.verifyCertificate(certId, certHash);
      expect(isValid).to.be.true;
      expect(status).to.equal(Status.Valid);

      // Advance time by 11 seconds
      await time.increase(11);

      // Now it must be Expired
      [isValid, status] = await certificateRegistry.verifyCertificate(certId, certHash);
      expect(isValid).to.be.false;
      expect(status).to.equal(Status.Expired);
    });

    it("should remain Valid after advancing 50 years for lifetime certificates (expiry = 0)", async function () {
      const certId = ethers.keccak256(ethers.toUtf8Bytes("CERT-LIFETIME-50Y"));
      const certHash = ethers.keccak256(ethers.toUtf8Bytes("PAYLOAD-LIFETIME-50Y"));

      await certificateRegistry.connect(issuer1).issueCertificate(certId, certHash, 0);

      // Advance time by 50 years (50 * 365 * 24 * 3600 seconds)
      const fiftyYearsInSeconds = 50 * 365 * 24 * 3600;
      await time.increase(fiftyYearsInSeconds);

      const [isValid, status] = await certificateRegistry.verifyCertificate(certId, certHash);
      expect(isValid).to.be.true;
      expect(status).to.equal(Status.Valid);
    });

    it("should support max uint256 as extreme future expiration timestamp", async function () {
      const certId = ethers.keccak256(ethers.toUtf8Bytes("CERT-MAX-EXPIRY"));
      const certHash = ethers.keccak256(ethers.toUtf8Bytes("PAYLOAD-MAX-EXPIRY"));

      const maxUint256 = ethers.MaxUint256;
      await certificateRegistry.connect(issuer1).issueCertificate(certId, certHash, maxUint256);

      const [isValid, status] = await certificateRegistry.verifyCertificate(certId, certHash);
      expect(isValid).to.be.true;
      expect(status).to.equal(Status.Valid);
    });

    it("should reject expiration timestamp exactly equal to block.timestamp", async function () {
      const certId = ethers.keccak256(ethers.toUtf8Bytes("CERT-EXACT-NOW"));
      const certHash = ethers.keccak256(ethers.toUtf8Bytes("PAYLOAD-EXACT-NOW"));

      const currentTime = await time.latest();
      await expect(
        certificateRegistry.connect(issuer1).issueCertificate(certId, certHash, currentTime)
      ).to.be.revertedWith("Expiration date must be in future");
    });
  });

  describe("2. Status Priority & Transition Edge Cases", function () {
    it("should prioritize Revoked status over Expired status if an expired cert is revoked", async function () {
      const certId = ethers.keccak256(ethers.toUtf8Bytes("CERT-EXP-THEN-REVOKE"));
      const certHash = ethers.keccak256(ethers.toUtf8Bytes("PAYLOAD-EXP-THEN-REVOKE"));

      const latestTime = await time.latest();
      const expiry = latestTime + 100;

      await certificateRegistry.connect(issuer1).issueCertificate(certId, certHash, expiry);

      // Advance time past expiration
      await time.increase(200);

      // Check it's Expired
      let [isValid, status] = await certificateRegistry.verifyCertificate(certId, certHash);
      expect(status).to.equal(Status.Expired);

      // Revoke the expired certificate
      await certificateRegistry.connect(issuer1).revokeCertificate(certId);

      // Now status must strictly be Revoked (status 3), not Expired (status 2)
      [isValid, status] = await certificateRegistry.verifyCertificate(certId, certHash);
      expect(isValid).to.be.false;
      expect(status).to.equal(Status.Revoked);
    });

    it("should return HashMismatch even if payload has only 1 bit different", async function () {
      const certId = ethers.keccak256(ethers.toUtf8Bytes("CERT-HASH-DIFF"));
      const certHash = ethers.keccak256(ethers.toUtf8Bytes("GENUINE_DATA"));

      await certificateRegistry.connect(issuer1).issueCertificate(certId, certHash, 0);

      // Mutate 1 character in the input payload
      const tamperedHash = ethers.keccak256(ethers.toUtf8Bytes("GENUINE_DATa")); // subtle casing change

      const [isValid, status] = await certificateRegistry.verifyCertificate(certId, tamperedHash);
      expect(isValid).to.be.false;
      expect(status).to.equal(Status.HashMismatch);
    });
  });

  describe("3. Access Control & Lifecycle Transitions", function () {
    it("should keep existing certificates Valid even after the issuing address is deauthorized", async function () {
      const certId = ethers.keccak256(ethers.toUtf8Bytes("CERT-ISSUER-DEAUTH"));
      const certHash = ethers.keccak256(ethers.toUtf8Bytes("PAYLOAD-DEAUTH"));

      await certificateRegistry.connect(issuer1).issueCertificate(certId, certHash, 0);

      // Deauthorize issuer1
      await certificateRegistry.connect(owner).deauthorizeIssuer(issuer1.address);
      expect(await certificateRegistry.authorizedIssuers(issuer1.address)).to.be.false;

      // Certificate issued before deauthorization must remain authentic and Valid
      const [isValid, status] = await certificateRegistry.verifyCertificate(certId, certHash);
      expect(isValid).to.be.true;
      expect(status).to.equal(Status.Valid);

      // Deauthorized issuer cannot issue new certificates
      const newCertId = ethers.keccak256(ethers.toUtf8Bytes("CERT-NEW-BLOCKED"));
      await expect(
        certificateRegistry.connect(issuer1).issueCertificate(newCertId, certHash, 0)
      ).to.be.revertedWith("Not an authorized issuer");
    });

    it("should allow newly transferred contract owner to revoke legacy certificates", async function () {
      const certId = ethers.keccak256(ethers.toUtf8Bytes("CERT-OWNERSHIP-TRANSFER"));
      const certHash = ethers.keccak256(ethers.toUtf8Bytes("PAYLOAD-OWNERSHIP"));

      await certificateRegistry.connect(issuer1).issueCertificate(certId, certHash, 0);

      // Transfer contract ownership to issuer2
      await certificateRegistry.connect(owner).transferOwnership(issuer2.address);
      expect(await certificateRegistry.owner()).to.equal(issuer2.address);

      // New owner should be able to revoke the certificate
      await certificateRegistry.connect(issuer2).revokeCertificate(certId);

      const [isValid, status] = await certificateRegistry.verifyCertificate(certId, certHash);
      expect(isValid).to.be.false;
      expect(status).to.equal(Status.Revoked);
    });
  });

  describe("4. Bulk Stress & Fuzz Testing", function () {
    it("should reliably handle rapid sequential issuance of 30 distinct certificates", async function () {
      const count = 30;
      const certIds: string[] = [];
      const certHashes: string[] = [];

      for (let i = 0; i < count; i++) {
        const id = ethers.keccak256(ethers.toUtf8Bytes(`BULK-CERT-${i}-${Date.now()}`));
        const hash = ethers.keccak256(ethers.toUtf8Bytes(`BULK-PAYLOAD-${i}`));
        certIds.push(id);
        certHashes.push(hash);

        await certificateRegistry.connect(issuer1).issueCertificate(id, hash, 0);
      }

      // Verify all 30 certificates in random order
      for (let i = count - 1; i >= 0; i--) {
        const [isValid, status] = await certificateRegistry.verifyCertificate(
          certIds[i],
          certHashes[i]
        );
        expect(isValid).to.be.true;
        expect(status).to.equal(Status.Valid);
      }
    });
  });
});
