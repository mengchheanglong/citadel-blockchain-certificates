// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CertificateRegistry
 * @dev Smart contract for issuing, verifying, and revoking tamper-proof digital certificates on Ethereum.
 */
contract CertificateRegistry is Ownable {
    // Verification Status Codes:
    // 0 = NotFound
    // 1 = Valid
    // 2 = Expired
    // 3 = Revoked
    // 4 = HashMismatch
    uint8 public constant STATUS_NOT_FOUND = 0;
    uint8 public constant STATUS_VALID = 1;
    uint8 public constant STATUS_EXPIRED = 2;
    uint8 public constant STATUS_REVOKED = 3;
    uint8 public constant STATUS_HASH_MISMATCH = 4;

    struct CertificateRecord {
        bytes32 certHash;
        address issuer;
        uint256 issueTimestamp;
        uint256 expirationDate; // 0 for no expiration, otherwise Unix timestamp
        bool isRevoked;
        uint256 revokedTimestamp;
        bool exists;
    }

    // Mapping from certIdHash (keccak256 of certificate ID string) to CertificateRecord
    mapping(bytes32 => CertificateRecord) public certificates;

    // Mapping of authorized issuer addresses
    mapping(address => bool) public authorizedIssuers;

    // Events
    event CertificateIssued(
        bytes32 indexed certIdHash,
        bytes32 indexed certHash,
        address indexed issuer,
        uint256 expirationDate,
        uint256 issueTimestamp
    );

    event CertificateRevoked(
        bytes32 indexed certIdHash,
        address indexed revoker,
        uint256 revokedTimestamp
    );

    event IssuerAuthorized(address indexed issuer);
    event IssuerDeauthorized(address indexed issuer);

    /**
     * @dev Restricts access to authorized issuers only
     */
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender], "Not an authorized issuer");
        _;
    }

    /**
     * @dev Initializes contract and sets deployer as owner and initial authorized issuer
     */
    constructor() Ownable(msg.sender) {
        authorizedIssuers[msg.sender] = true;
        emit IssuerAuthorized(msg.sender);
    }

    /**
     * @dev Authorizes a new issuer address (Owner only)
     * @param _issuer Address to authorize
     */
    function  authorizeIssuer(address _issuer) external onlyOwner {
        require(_issuer != address(0), "Invalid issuer address");
        require(!authorizedIssuers[_issuer], "Issuer is already authorized");
        authorizedIssuers[_issuer] = true;
        emit IssuerAuthorized(_issuer);
    }

    /**
     * @dev Deauthorizes an issuer address (Owner only)
     * @param _issuer Address to deauthorize
     */
    function deauthorizeIssuer(address _issuer) external onlyOwner {
        require(_issuer != address(0), "Invalid issuer address");
        require(authorizedIssuers[_issuer], "Issuer is not authorized");
        authorizedIssuers[_issuer] = false;
        emit IssuerDeauthorized(_issuer);
    }

    /**
     * @dev Issues a new certificate on the blockchain
     * @param _certIdHash Keccak-256 hash of certificate identifier (e.g. CERT-2024-XXXX)
     * @param _certHash SHA-256 / Keccak-256 hash of certificate data payload
     * @param _expirationDate Unix timestamp when certificate expires (0 for permanent)
     */
    function issueCertificate(
        bytes32 _certIdHash,
        bytes32 _certHash,
        uint256 _expirationDate
    ) external onlyAuthorizedIssuer {
        require(_certIdHash != bytes32(0), "Invalid cert ID hash");
        require(_certHash != bytes32(0), "Invalid cert hash");
        require(!certificates[_certIdHash].exists, "Certificate already exists");
        if (_expirationDate != 0) {
            require(_expirationDate > block.timestamp, "Expiration date must be in future");
        }

        certificates[_certIdHash] = CertificateRecord({
            certHash: _certHash,
            issuer: msg.sender,
            issueTimestamp: block.timestamp,
            expirationDate: _expirationDate,
            isRevoked: false,
            revokedTimestamp: 0,
            exists: true
        });

        emit CertificateIssued(
            _certIdHash,
            _certHash,
            msg.sender,
            _expirationDate,
            block.timestamp
        );
    }

    /**
     * @dev Revokes an existing certificate. Can only be invoked by original issuer or owner.
     * @param _certIdHash Keccak-256 hash of certificate identifier
     */
    function revokeCertificate(bytes32 _certIdHash) external onlyAuthorizedIssuer {
        CertificateRecord storage cert = certificates[_certIdHash];
        require(cert.exists, "Certificate does not exist");
        require(!cert.isRevoked, "Certificate already revoked");
        require(
            msg.sender == cert.issuer || msg.sender == owner(),
            "Only original issuer or owner can revoke"
        );

        cert.isRevoked = true;
        cert.revokedTimestamp = block.timestamp;

        emit CertificateRevoked(_certIdHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Verifies certificate validity by checking existence, revocation status, expiration, and payload hash match.
     * @param _certIdHash Keccak-256 hash of certificate identifier
     * @param _certHash Keccak-256 / SHA-256 hash of certificate data payload to verify
     * @return isValid Boolean indicating if certificate is valid and active
     * @return status Verification status: 0=NotFound, 1=Valid, 2=Expired, 3=Revoked, 4=HashMismatch
     */
    function verifyCertificate(bytes32 _certIdHash, bytes32 _certHash)
        external
        view
        returns (bool isValid, uint8 status)
    {
        CertificateRecord memory cert = certificates[_certIdHash];

        if (!cert.exists) {
            return (false, STATUS_NOT_FOUND);
        }

        if (cert.isRevoked) {
            return (false, STATUS_REVOKED);
        }

        if (cert.expirationDate != 0 && cert.expirationDate <= block.timestamp) {
            return (false, STATUS_EXPIRED);
        }

        if (cert.certHash != _certHash) {
            return (false, STATUS_HASH_MISMATCH);
        }

        return (true, STATUS_VALID);
    }

    /**
     * @dev Retrieves all stored fields of a certificate record.
     * @param _certIdHash Keccak-256 hash of certificate identifier
     */
    function getCertificate(bytes32 _certIdHash)
        external
        view
        returns (
            bytes32 certHash,
            address issuer,
            uint256 issueTimestamp,
            uint256 expirationDate,
            bool isRevoked,
            uint256 revokedTimestamp,
            bool exists
        )
    {
        CertificateRecord memory cert = certificates[_certIdHash];
        return (
            cert.certHash,
            cert.issuer,
            cert.issueTimestamp,
            cert.expirationDate,
            cert.isRevoked,
            cert.revokedTimestamp,
            cert.exists
        );
    }
}
