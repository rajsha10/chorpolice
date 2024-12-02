let roles = ["Police", "King", "Minister", "Thief"];
let players = [];
let roomCode = "";
let myRole = "";
let chosenPlayer = "";

// Assign random roles
function assignRoles() {
    players = roles.map(role => ({ 
        name: generatePlayerName(), 
        role, 
        score: getInitialScore(role) 
    }));
    players = players.sort(() => Math.random() - 0.5);
    setupPlayersUI();
}

// Generate unique player names
function generatePlayerName() {
    return `Player${Math.floor(Math.random() * 1000)}`;
}

// Get initial score based on role
function getInitialScore(role) {
    const initialScores = {
        Police: 1000,
        King: 5000,
        Minister: 3000,
        Thief: 0
    };
    return initialScores[role];
}

// Setup players UI dynamically
function setupPlayersUI() {
    const playersContainer = document.getElementById("players");
    playersContainer.innerHTML = players
        .filter(p => p.role !== myRole)
        .map(player => `
            <button data-player="${player.role}">
                ${player.name}
            </button>
        `).join('');
}

// Update UI for role assignment
function updateRoleUI() {
    const roleDisplay = document.getElementById("role");
    const player = players.find(p => p.name === myRole);
    roleDisplay.textContent = player.role;

    // Hide/show elements based on role
    const revealButton = document.getElementById("reveal");
    const instructions = document.getElementById("instructions");
    
    if (player.role === "Police") {
        instructions.textContent = "Select a player to catch!";
        revealButton.style.display = "block";
    } else {
        instructions.textContent = "Waiting for Police to make a decision...";
        revealButton.style.display = "none";
    }
}

// Create Room
document.getElementById("create-room").onclick = () => {
    roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById("room-id").textContent = roomCode;
    document.getElementById("room-section").style.display = "none";
    document.getElementById("game-section").style.display = "block";

    assignRoles();
    myRole = players[0].name;
    updateRoleUI();
};

// Join Room
document.getElementById("join-room").onclick = () => {
    roomCode = document.getElementById("room-code").value.toUpperCase();
    if (roomCode) {
        document.getElementById("room-id").textContent = roomCode;
        document.getElementById("room-section").style.display = "none";
        document.getElementById("game-section").style.display = "block";

        assignRoles();
        myRole = players[1].name;
        updateRoleUI();
    }
};

// Voting Logic
document.getElementById("action-section").addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON" && event.target.dataset.player) {
        chosenPlayer = event.target.dataset.player;
    }
});

// Reveal Results
document.getElementById("reveal").onclick = () => {
    const police = players.find(p => p.role === "Police");
    const king = players.find(p => p.role === "King");
    const minister = players.find(p => p.role === "Minister");
    const thief = players.find(p => p.role === "Thief");

    if (chosenPlayer === "Thief") {
        police.score += 1000;
        king.score += 5000;
        minister.score += 3000;
    } else if (chosenPlayer === "Minister") {
        minister.score += 1000;
        thief.score += 3000;
    } else if (chosenPlayer === "King") {
        police.score -= 1000;
        king.score += 1000;
        thief.score += 5000;
    }

    updateScoreboard();
};

// Update Scoreboard
function updateScoreboard() {
    const scoreBoard = document.getElementById("score-board");
    scoreBoard.innerHTML = players.map(player => `
        <li>${player.name} (${player.role}): ${player.score} points</li>
    `).join("");
    document.getElementById("results").style.display = "block";
}