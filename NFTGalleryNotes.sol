// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title NFTGalleryNotes
 * @dev Simple contract to store notes for NFTs owned by users.
 *      Target Chain: Polygon Testnet (Amoy)
 */
contract NFTGalleryNotes {
    // Mapping: User Address -> NFT Contract Address -> Token ID -> Note String
    mapping(address => mapping(address => mapping(uint256 => string))) private _notes;

    // Event emitted when a note is saved
    event NoteUpdated(address indexed user, address indexed nftContract, uint256 indexed tokenId, string note);

    /**
     * @notice Save a note for a specific NFT
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID of the NFT
     * @param note The note content to save
     */
    function setNote(address nftContract, uint256 tokenId, string calldata note) external {
        _notes[msg.sender][nftContract][tokenId] = note;
        emit NoteUpdated(msg.sender, nftContract, tokenId, note);
    }

    /**
     * @notice Retrieve a note for a specific NFT
     * @param user Address of the user who made the note
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID of the NFT
     * @return The stored note
     */
    function getNote(address user, address nftContract, uint256 tokenId) external view returns (string memory) {
        return _notes[user][nftContract][tokenId];
    }
}
