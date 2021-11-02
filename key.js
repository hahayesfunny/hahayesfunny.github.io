const firebaseConfig = {
  apiKey: "AIzaSyAxY3cN37e2zJLTctiW4jK6c69cU9BS9Y8",
  authDomain: "pong-project-multiplayer.firebaseapp.com",
  projectId: "pong-project-multiplayer",
  storageBucket: "pong-project-multiplayer.appspot.com",
  messagingSenderId: "378586857063",
  appId: "1:378586857063:web:000cda57c40ba4658f5ec2",
  measurementId: "G-QDBWKR9BMB"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const rooms = database.ref("rooms");
const JOIN_BUTTON = document.getElementById("join");
const CREATE_BUTTON = document.getElementById("create");
const ALL_ELEMENTS = document.getElementById("delete");
const GAME = document.getElementById("game");
const CREATE_ID = document.getElementById("c");
const JOIN_ID = document.getElementById("j");
const DISPLAY = GAME.getContext("2d");
let gameData = {};
let in_game = false;
let allRooms = {};
let key = "";
let ball = {x: 400, y: 300, width: 15, height: 15};

let playerType = 0;

let keyboard = {wDown: false, sDown: false};

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function isTouching(rect1, rect2) {
    console.log(rect1);
    console.log(rect2);
    if (rect1.x != undefined && rect2 != undefined) {
        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y) {
             return true;
         }
         return false;
    }
    
}

document.addEventListener('keydown', (e)=> {
    switch (e.key) {
        case 'ArrowUp':
            keyboard.wDown = true;
            break;
        case 'ArrowDown':
            keyboard.sDown = true;
            break;
        case 's':
            keyboard.sDown = true;
            break;
        case 'w':
            keyboard.wDown = true;
            break;
    }
});

document.addEventListener('keyup', (e)=> {
    switch (e.key) {
        case 'ArrowUp':
            keyboard.wDown = false;
            break;
        case 'ArrowDown':
            keyboard.sDown = false;
            break;
        case 's':
            keyboard.sDown = false;
            break;
        case 'w':
            keyboard.wDown = false;
            break;
    }
});

function createRoom(id) {
    let winningScore = 12 /*prompt(
        "What do you want your winning score to be?"
    );*/

    let paddleColor = 'red'/*prompt(
        "What do you want your paddle color to be?"
    );
    */  
    gameData = {id: id, winningScore: parseInt(winningScore), player1: {score: 0, color: paddleColor, x: 30, y: 250, width: 20, height: 100}, player2: {score: 0, color: "white", x: 755, y: 250, width: 20, height: 100}, playerCount: 1, vx: getRandomInt(9) + 1, vy: getRandomInt(9) + 1};

    rooms.push(gameData)
    // Add x and y to player 1 paddle and player 2 paddle
    GAME.style.display = "block"
    ALL_ELEMENTS.remove();
    in_game = true;
    playerType = 1;
}

function joinRoom(id) {
    let paddleColor = 'blue' /* prompt("
        What do you want your paddle color to be?
    ")
    */

    for (let i = 0; i < Object.values(allRooms).length; i++) {
        if (Object.values(allRooms)[i].id == id) {
            key = Object.keys(allRooms)[i];
            let a = Object.values(allRooms)[i];
            let p2Data = a.player2;
            p2Data.color = paddleColor;
            rooms.child(key).set({
                id: a.id,
                playerCount: a.playerCount + 1,
                winningScore: a.winningScore,
                player1: a.player1,
                player2: p2Data,
                vx: a.vx,
                vy: a.vy,
            });
            gameData = {id: a.id, playerCount: a.playerCount + 1, winningScore: a.winningScore, player1: a.player1, player2: p2Data, vx: a.vx, vy: a.vy};
            in_game = true;
            GAME.style.display = "block"
            ALL_ELEMENTS.remove();
            playerType = 2;
        }
    }
}
rooms.on("value", listen, error);

CREATE_BUTTON.onclick = function() {
    createRoom(CREATE_ID.value);
}

JOIN_BUTTON.onclick = function() {
    joinRoom(JOIN_ID.value);
}

function listen(data) {
    let d = data.val();
    allRooms = d;
    let v = Object.values(d);
    if (in_game) {
        console.log(v);
        for (let i = 0; i < v.length; i++) {
            let room = v[i];
            if (room.id === gameData.id) {
                gameData = room;
                key = Object.keys(d)[i];
            }
        }
    }
}

function error(err) {
    console.log(err);
}

function drawRect(x, y, width, height, color) {
    DISPLAY.fillStyle = color;
    DISPLAY.fillRect(x, y, width, height);
}

function bounce(dir) {
    if (dir == "x") {
        rooms.child(key).set({
            id: gameData.id,
            playerCount: gameData.playerCount,
            winningScore: gameData.winningScore,
            player1: gameData.player1,
            player2: gameData.player2,
            vx: -gameData.vx,
            vy: gameData.vy,
        });
    } else if (dir == "y") {
        rooms.child(key).set({
            id: gameData.id,
            playerCount: gameData.playerCount,
            winningScore: gameData.winningScore,
            player1: gameData.player1,
            player2: gameData.player2,
            vx: gameData.vx,
            vy: -gameData.vy,
        });
    }
}

function draw() {
    DISPLAY.clearRect(0, 0, 800, 600)
    drawRect(0, 0, 800, 600, "black");
    if (in_game && gameData != {}) {
        drawRect(gameData.player1.x, gameData.player1.y, gameData.player1.width, gameData.player1.height, gameData.player1.color);
        drawRect(gameData.player2.x, gameData.player2.y, gameData.player2.width, gameData.player2.height, gameData.player2.color);
        drawRect(ball.x, ball.y, 15, 15, "white");
        if (gameData.playerCount == 2) {
            ball.x += gameData.vx;
            ball.y += gameData.vy;
            if (ball.x < 0 || ball.x > (800 - 15)) {
                bounce("x");
            }
            if (ball.y < 0 || ball.y > (600 - 15)) {
                bounce("y");
            }
            if (isTouching(ball, gameData.player1) || isTouching(ball, gameData.player2)) {
                bounce('x');
                bounce('y');
            }
        }
        if (keyboard.wDown) {
            console.log(gameData.key)
            const rr = database.ref("rooms/" + key);
            if (playerType == 1) {
                rr.child("/player" + playerType).set({
                    color: gameData.player1.color,
                    height: 100,
                    score: gameData.player1.score,
                    width: 20,
                    x: 30,
                    y: gameData.player1.y - 5
                });
            }
            if (playerType == 2) {
                console.log("hello world")
                rr.child("/player" + playerType).set({
                    color: gameData.player2.color,
                    height: 100,
                    score: gameData.player2.score,
                    width: 20,
                    x: 755,
                    y: gameData.player2.y - 5
                });
            }
        } else if (keyboard.sDown) {
            const rr = database.ref("rooms/" + key);
            if (playerType == 1) {
                rr.child("/player" + playerType).set({
                    color: gameData.player1.color,
                    height: 100,
                    score: gameData.player1.score,
                    width: 20,
                    x: 30,
                    y: gameData.player1.y + 5
                });
            }
            if (playerType == 2) {
                console.log("hello world")
                rr.child("/player" + playerType).set({
                    color: gameData.player2.color,
                    height: 100,
                    score: gameData.player2.score,
                    width: 20,
                    x: 755,
                    y: gameData.player2.y + 5
                });
            }
        }
    }
    requestAnimationFrame(draw);
}   

// Loop
draw();