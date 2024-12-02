let roles = ["Police", "King", "Minister", "Thief"];
let scores = {
    Police: 0,
    King: 5000,
    Minister: 3000,
    Thief: 0
};
let players = [];
let roomCode = "";
let myRole = "";
let chosenPlayer = "";

// Assign random roles
function assignRoles() {
    players = roles.map(role => ({ name: role, role, score: 0 }));
    players = players.sort(() => Math.random() - 0.5);
}

// Update UI for role assignment
function updateRoleUI() {
    const roleDisplay = document.getElementById("role");
    const player = players.find(p => p.name === myRole);
    roleDisplay.textContent = player.role;
}

// Create or Join Room
document.getElementById("create-room").onclick = () => {
    roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById("room-id").textContent = roomCode;
    document.getElementById("room-section").style.display = "none";
    document.getElementById("game-section").style.display = "block";

    assignRoles();
    myRole = players[0].name; // Assign first role
    updateRoleUI();
};

document.getElementById("join-room").onclick = () => {
    roomCode = document.getElementById("room-code").value.toUpperCase();
    if (roomCode) {
        document.getElementById("room-id").textContent = roomCode;
        document.getElementById("room-section").style.display = "none";
        document.getElementById("game-section").style.display = "block";

        assignRoles();
        myRole = players[1].name; // Assign a different role
        updateRoleUI();
    }
};

// Voting Logic
document.getElementById("action-section").addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
        chosenPlayer = event.target.dataset.player;
        document.getElementById("reveal").style.display = "block";
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