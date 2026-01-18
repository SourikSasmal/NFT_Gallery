// ================= CONFIG =================
const ALCHEMY_API_KEY = "WZ8b9GyL-dgZDx-1oZgL_";
const ALCHEMY_URL = `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

const CONTRACT_ADDRESS = "0x211AD6FF1d85CFfB429503D23133e34094245410";

// ABI (matches your Solidity exactly)
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "nftContract", "type": "address" },
            { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
            { "indexed": false, "internalType": "string", "name": "note", "type": "string" }
        ],
        "name": "NoteUpdated",
        "type": "event"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "user", "type": "address" },
            { "internalType": "address", "name": "nftContract", "type": "address" },
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "getNote",
        "outputs": [{ "internalType": "string", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "nftContract", "type": "address" },
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
            { "internalType": "string", "name": "note", "type": "string" }
        ],
        "name": "setNote",
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// ================= STATE =================
let provider, signer, contract;
let currentAccount = null;
let nfts = [];

// ================= DOM =================
const connectWalletBtn = document.getElementById("connectWalletBtn");
const walletInput = document.getElementById("walletAddressInput");
const fetchBtn = document.getElementById("fetchNftsBtn");
const gallery = document.getElementById("gallerySection");
const errorMsg = document.getElementById("errorMsg");

// Modal
const modal = document.getElementById("nftModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalCollection = document.getElementById("modalCollection");
const modalTokenId = document.getElementById("modalTokenId");
const modalContract = document.getElementById("modalContract");
const noteInput = document.getElementById("nftNote");
const saveBtn = document.getElementById("saveNoteBtn");
const txStatus = document.getElementById("txStatus");

// ================= WALLET =================
connectWalletBtn.onclick = async () => {
    if (!window.ethereum) {
        showError("Install MetaMask");
        return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    currentAccount = accounts[0];

    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    connectWalletBtn.textContent =
        currentAccount.slice(0, 6) + "..." + currentAccount.slice(-4);

    walletInput.value = currentAccount;
    fetchBtn.disabled = false;
};

// ================= FETCH NFTS =================
fetchBtn.onclick = async () => {
    const address = walletInput.value.trim();

    if (!ethers.utils.isAddress(address)) {
        showError("Invalid wallet address");
        return;
    }

    try {
        gallery.innerHTML = "<p>Loading NFTs...</p>";

        const res = await fetch(
            `${ALCHEMY_URL}/getNFTs?owner=${address}&withMetadata=true`
        );
        const data = await res.json();

        nfts = data.ownedNfts || [];
        renderGallery();

    } catch (err) {
        console.error(err);
        showError("Failed to fetch NFTs");
    }
};

// ================= GALLERY =================
function renderGallery() {
    gallery.innerHTML = "";

    if (nfts.length === 0) {
        gallery.innerHTML = `<p>No NFTs found (this is OK on testnets)</p>`;
        return;
    }

    nfts.forEach((nft, i) => {
        const img =
            nft.media?.[0]?.gateway ||
            nft.metadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/") ||
            "https://via.placeholder.com/200";

        const card = document.createElement("div");
        card.className = "nft-card";
        card.innerHTML = `
            <div class="nft-image-container">
                <img src="${img}" alt="${nft.title}">
            </div>
            <div class="nft-details">
                <h3>${nft.title || "Unnamed NFT"}</h3>
                <p>${nft.contractMetadata?.name || "Unknown Collection"}</p>
            </div>
        `;

        card.onclick = () => openModal(i);
        gallery.appendChild(card);
    });
}

// ================= MODAL =================
async function openModal(i) {
    const nft = nfts[i];
    const tokenId = ethers.BigNumber.from(nft.id.tokenId).toString();
    const nftAddr = nft.contract.address;

    modal.classList.remove("hidden");
    // Small delay to allow display:flex to apply before opacity transition
    setTimeout(() => modal.classList.add("visible"), 10);
    modalTitle.textContent = nft.title || "Unnamed NFT";
    modalCollection.textContent = nft.contractMetadata?.name || "Unknown";
    modalTokenId.textContent = tokenId;
    modalContract.textContent = nftAddr.slice(0, 6) + "..." + nftAddr.slice(-4);

    noteInput.value = "Loading...";
    txStatus.textContent = "";

    try {
        const note = await contract.getNote(currentAccount, nftAddr, tokenId);
        noteInput.value = note;
    } catch {
        noteInput.value = "";
    }

    saveBtn.onclick = () => saveNote(nftAddr, tokenId);
}

// ================= SAVE NOTE =================
async function saveNote(nftAddr, tokenId) {
    try {
        saveBtn.disabled = true;
        txStatus.textContent = "Waiting for confirmation...";

        const tx = await contract.setNote(nftAddr, tokenId, noteInput.value);
        await tx.wait();

        txStatus.textContent = "Saved on-chain ✅";
    } catch (e) {
        console.error(e);
        txStatus.textContent = "Transaction failed ❌";
    } finally {
        saveBtn.disabled = false;
    }
}

// ================= UTILS =================
function showError(msg) {
    errorMsg.textContent = msg;
    setTimeout(() => (errorMsg.textContent = ""), 4000);
}

