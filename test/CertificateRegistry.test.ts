import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { CertificateRegistry } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("CertificateRegistry", function () {
  let certificateRegistry: CertificateRegistry;
  let owner: HardhatEthersSigner;
  let issuer1: HardhatEthersSigner;
  let issuer2: HardhatEthersSigner;
  let unauthorizedUser: HardhatEthersSigner;

  // Verification status enum mapping
  const Status = {
    NotFound: 0,
    Valid: 1,
    Expired: 2,
    Revoked: 3,
    HashMismatch: 4,
  };

  // Helper to generate sample bytes32 hashes
  const sampleCertId1 = ethers.keccak256(ethers.toUtf8Bytes("CERT-2024-001"));
  const sampleCertHash1 = ethers.keccak256(ethers.toUtf8Bytes("CERT_DATA_PAYLOAD_1"));

  const sampleCertId2 = ethers.keccak256(ethers.toUtf8Bytes("CERT-2024-002"));
  const sampleCertHash2 = ethers.keccak256(ethers.toUtf8Bytes("CERT_DATA_PAYLOAD_2"));

  const nonExistentCertId = ethers.keccak256(ethers.toUtf8Bytes("CERT-DOES-NOT-EXIST"));
  const wrongCertHash = ethers.keccak256(ethers.toUtf8Bytes("WRONG_PAYLOAD_HASH"));

  beforeEach(async function () {
    [owner, issuer1, issuer2, unauthorizedUser] = await ethers.getSigners();

    const CertificateRegistryFactory = await ethers.getContractFactory("CertificateRegistry");
    certificateRegistry = (await CertificateRegistryFactory.deploy()) as CertificateRegistry;
    await certificateRegistry.waitForDeployment();
  });

  describe("Deployment & Initialization", function () {
    it("should set deployer as contract owner", async function () {
      expect(await certificateRegistry.owner()).to.equal(owner.address);
    });

    it("should initialize deployer as an authorized issuer", async function () {
      expect(await certificateRegistry.authorizedIssuers(owner.address)).to.be.true;
    });

    it("should return false for unauthorized accounts by default", async function () {
      expect(await certificateRegistry.authorizedIssuers(issuer1.address)).to.be.false;
      expect(await certificateRegistry.authorizedIssuers(unauthorizedUser.address)).to.be.false;
    });
  });

  describe("Issuer Management", function () {
    it("should allow owner to authorize a new issuer and emit IssuerAuthorized event", async function () {
      await expect(certificateRegistry.connect(owner).authorizeIssuer(issuer1.address))
        .to.emit(certificateRegistry, "IssuerAuthorized")
        .withArgs(issuer1.address);

      expect(await certificateRegistry.authorizedIssuers(issuer1.address)).to.be.true;
    });

    it("should reject authorizing issuer by non-owner", async function () {
      await expect(
        certificateRegistry.connect(unauthorizedUser).authorizeIssuer(issuer1.address)
      ).to.be.revertedWithCustomError(certificateRegistry, "OwnableUnauthorizedAccount");
    });

    it("should reject authorizing an already authorized issuer", async function () {
      await certificateRegistry.connect(owner).authorizeIssuer(issuer1.address);

      await expect(
        certificateRegistry.connect(owner).authorizeIssuer(issuer1.address)
      ).to.be.revertedWith("Issuer is already authorized");
    });

    it("should reject authorizing the zero address", async function () {
      await expect(
        certificateRegistry.connect(owner).authorizeIssuer(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid issuer address");
    });

    it("should allow owner to deauthorize an issuer and emit IssuerDeauthorized event", async function () {
      await certificateRegistry.connect(owner).authorizeIssuer(issuer1.address);
      expect(await certificateRegistry.authorizedIssuers(issuer1.address)).to.be.true;

      await expect(certificateRegistry.connect(owner).deauthorizeIssuer(issuer1.address))
        .to.emit(certificateRegistry, "IssuerDeauthorized")
        .withArgs(issuer1.address);

      expect(await certificateRegistry.authorizedIssuers(issuer1.address)).to.be.false;
    });

    it("should reject deauthorizing issuer by non-owner", async function () {
      await certificateRegistry.connect(owner).authorizeIssuer(issuer1.address);

      await expect(
        certificateRegistry.connect(unauthorizedUser).deauthorizeIssuer(issuer1.address)
      ).to.be.revertedWithCustomError(certificateRegistry, "OwnableUnauthorizedAccount");
    });

    it("should reject deauthorizing a non-authorized address", async function () {
      await expect(
        certificateRegistry.connect(owner).deauthorizeIssuer(issuer1.address)
      ).to.be.revertedWith("Issuer is not authorized");
    });

    it("should reject deauthorizing the zero address", async function () {
      await expect(
        certificateRegistry.connect(owner).deauthorizeIssuer(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid issuer address");
    });
  });

  describe("Certificate Issuance", function () {
    beforeEach(async function () {
      await certificateRegistry.connect(owner).authorizeIssuer(issuer1.address);
    });

    it("should allow authorized issuer to issue certificate with future expiration", async function () {
      const latestTime = await time.latest();
      const expirationDate = latestTime + 365 * 24 * 60 * 60; // 1 year later

      const tx = await certificateRegistry
        .connect(issuer1)
        .issueCertificate(sampleCertId1, sampleCertHash1, expirationDate);

      await expect(tx)
        .to.emit(certificateRegistry, "CertificateIssued")
        .withArgs(sampleCertId1, sampleCertHash1, issuer1.address, expirationDate, await time.latest());

      const cert = await certificateRegistry.getCertificate(sampleCertId1);
      expect(cert.certHash).to.equal(sampleCertHash1);
      expect(cert.issuer).to.equal(issuer1.address);
      expect(cert.expirationDate).to.equal(expirationDate);
      expect(cert.isRevoked).to.be.false;
      expect(cert.revokedTimestamp).to.equal(0);
      expect(cert.exists).to.be.true;
    });

    it("should allow authorized issuer to issue non-expiring certificate (expirationDate = 0)", async function () {
      await certificateRegistry
        .connect(issuer1)
        .issueCertificate(sampleCertId1, sampleCertHash1, 0);

      const cert = await certificateRegistry.getCertificate(sampleCertId1);
      expect(cert.certHash).to.equal(sampleCertHash1);
      expect(cert.issuer).to.equal(issuer1.address);
      expect(cert.expirationDate).to.equal(0);
      expect(cert.exists).to.be.true;
    });

    it("should reject certificate issuance from unauthorized accounts", async function () {
      const latestTime = await time.latest();
      const expirationDate = latestTime + 3600;

      await expect(
        certificateRegistry
          .connect(unauthorizedUser)
          .issueCertificate(sampleCertId1, sampleCertHash1, expirationDate)
      ).to.be.revertedWith("Not an authorized issuer");
    });

    it("should reject duplicate certificate issuance with the same certIdHash", async function () {
      await certificateRegistry
        .connect(issuer1)
        .issueCertificate(sampleCertId1, sampleCertHash1, 0);

      await expect(
        certificateRegistry
          .connect(issuer1)
          .issueCertificate(sampleCertId1, sampleCertHash2, 0)
      ).to.be.revertedWith("Certificate already exists");
    });

    it("should reject certificate issuance with zero certIdHash", async function () {
      await expect(
        certificateRegistry
          .connect(issuer1)
          .issueCertificate(ethers.ZeroHash, sampleCertHash1, 0)
      ).to.be.revertedWith("Invalid cert ID hash");
    });

    it("should reject certificate issuance with zero certHash", async function () {
      await expect(
        certificateRegistry
          .connect(issuer1)
          .issueCertificate(sampleCertId1, ethers.ZeroHash, 0)
      ).to.be.revertedWith("Invalid cert hash");
    });

    it("should reject certificate issuance with past expiration date", async function () {
      const latestTime = await time.latest();
      const pastExpiration = latestTime - 100;

      await expect(
        certificateRegistry
          .connect(issuer1)
          .issueCertificate(sampleCertId1, sampleCertHash1, pastExpiration)
      ).to.be.revertedWith("Expiration date must be in future");
    });
  });

  describe("Certificate Verification", function () {
    let validExpirationDate: number;

    beforeEach(async function () {
      await certificateRegistry.connect(owner).authorizeIssuer(issuer1.address);
      const latestTime = await time.latest();
      validExpirationDate = latestTime + 10000;

      await certificateRegistry
        .connect(issuer1)
        .issueCertificate(sampleCertId1, sampleCertHash1, validExpirationDate);
    });

    it("should verify a valid active certificate (status 1 = Valid)", async function () {
      const [isValid, status] = await certificateRegistry.verifyCertificate(
        sampleCertId1,
        sampleCertHash1
      );
      expect(isValid).to.be.true;
      expect(status).to.equal(Status.Valid);
    });

    it("should return status 0 (NotFound) for a non-existent certificate", async function () {
      const [isValid, status] = await certificateRegistry.verifyCertificate(
        nonExistentCertId,
        sampleCertHash1
      );
      expect(isValid).to.be.false;
      expect(status).to.equal(Status.NotFound);
    });

    it("should return status 4 (HashMismatch) when certHash does not match", async function () {
      const [isValid, status] = await certificateRegistry.verifyCertificate(
        sampleCertId1,
        wrongCertHash
      );
      expect(isValid).to.be.false;
      expect(status).to.equal(Status.HashMismatch);
    });

    it("should return status 2 (Expired) when expiration timestamp has passed", async function () {
      // Advance time past expirationDate
      await time.increaseTo(validExpirationDate + 10);

      const [isValid, status] = await certificateRegistry.verifyCertificate(
        sampleCertId1,
        sampleCertHash1
      );
      expect(isValid).to.be.false;
      expect(status).to.equal(Status.Expired);
    });

    it("should return status 3 (Revoked) when certificate has been revoked", async function () {
      await certificateRegistry.connect(issuer1).revokeCertificate(sampleCertId1);

      const [isValid, status] = await certificateRegistry.verifyCertificate(
        sampleCertId1,
        sampleCertHash1
      );
      expect(isValid).to.be.false;
      expect(status).to.equal(Status.Revoked);
    });
  });

  describe("Certificate Revocation", function () {
    beforeEach(async function () {
      await certificateRegistry.connect(owner).authorizeIssuer(issuer1.address);
      await certificateRegistry.connect(owner).authorizeIssuer(issuer2.address);

      await certificateRegistry
        .connect(issuer1)
        .issueCertificate(sampleCertId1, sampleCertHash1, 0);

      await certificateRegistry
        .connect(issuer2)
        .issueCertificate(sampleCertId2, sampleCertHash2, 0);
    });

    it("should allow the original issuer to revoke their certificate and emit CertificateRevoked", async function () {
      const tx = await certificateRegistry.connect(issuer1).revokeCertificate(sampleCertId1);

      await expect(tx)
        .to.emit(certificateRegistry, "CertificateRevoked")
        .withArgs(sampleCertId1, issuer1.address, await time.latest());

      const cert = await certificateRegistry.getCertificate(sampleCertId1);
      expect(cert.isRevoked).to.be.true;
      expect(cert.revokedTimestamp).to.be.greaterThan(0);
    });

    it("should allow the contract owner to revoke any certificate", async function () {
      // Owner revokes certificate issued by issuer1
      const tx = await certificateRegistry.connect(owner).revokeCertificate(sampleCertId1);

      await expect(tx)
        .to.emit(certificateRegistry, "CertificateRevoked")
        .withArgs(sampleCertId1, owner.address, await time.latest());

      const cert = await certificateRegistry.getCertificate(sampleCertId1);
      expect(cert.isRevoked).to.be.true;
    });

    it("should reject revocation by an authorized issuer who is not the original issuer nor owner", async function () {
      // Issuer2 attempts to revoke certificate issued by Issuer1
      await expect(
        certificateRegistry.connect(issuer2).revokeCertificate(sampleCertId1)
      ).to.be.revertedWith("Only original issuer or owner can revoke");
    });

    it("should reject revocation by an unauthorized user", async function () {
      await expect(
        certificateRegistry.connect(unauthorizedUser).revokeCertificate(sampleCertId1)
      ).to.be.revertedWith("Not an authorized issuer");
    });

    it("should reject revoking an already revoked certificate", async function () {
      await certificateRegistry.connect(issuer1).revokeCertificate(sampleCertId1);

      await expect(
        certificateRegistry.connect(issuer1).revokeCertificate(sampleCertId1)
      ).to.be.revertedWith("Certificate already revoked");
    });

    it("should reject revoking a non-existent certificate", async function () {
      await expect(
        certificateRegistry.connect(issuer1).revokeCertificate(nonExistentCertId)
      ).to.be.revertedWith("Certificate does not exist");
    });
  });

  describe("Certificate Retrieval (getCertificate)", function () {
    it("should return accurate certificate details for an existing certificate", async function () {
      const expiration = (await time.latest()) + 5000;
      await certificateRegistry.issueCertificate(sampleCertId1, sampleCertHash1, expiration);

      const cert = await certificateRegistry.getCertificate(sampleCertId1);
      expect(cert.certHash).to.equal(sampleCertHash1);
      expect(cert.issuer).to.equal(owner.address);
      expect(cert.expirationDate).to.equal(expiration);
      expect(cert.isRevoked).to.be.false;
      expect(cert.revokedTimestamp).to.equal(0);
      expect(cert.exists).to.be.true;
    });

    it("should return exists = false for non-existent certificate", async function () {
      const cert = await certificateRegistry.getCertificate(nonExistentCertId);
      expect(cert.exists).to.be.false;
      expect(cert.certHash).to.equal(ethers.ZeroHash);
      expect(cert.issuer).to.equal(ethers.ZeroAddress);
    });
  });
});
