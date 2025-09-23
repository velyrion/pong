// HTML Elements
const canva = document.getElementById("canva");
const btnNewGame = document.getElementById("btnNewGame");
const labScore = document.getElementById("labScore");
const btnLeft = document.getElementById("btnLeft"), btnRight = document.getElementById("btnRight");
const context2D = canva.getContext("2d");
const resultat = document.getElementById("resultat");

// classes
class Player {
        x; y; width; height;
        static speed = 2.5;

        constructor(x, y, width, height) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
        }

        /**
         * @brief move the player
         * @param {*} direction -1/1
         */
        move(direction) {
                this.x += direction*Player.speed;

                // dont go out of canvas
                if (this.x < 0) this.x = 0;
                if (this.x + this.width > canva.width) this.x = canva.width-this.width;
        }

        display() {
                context2D.fillStyle = "#d5e4ecff"
                context2D.fillRect(this.x, this.y, this.width, this.height);
        }
}

class Ball {
        x; y; radius;
        dx; dy;
        isOut = false;
        static speed = 6.5;

        constructor(x, y, radius) {
                this.x = x;
                this.y = y;
                this.radius = radius;

                console.log(Ball.speed);

                this.dx = (Math.random() - 0.5) * 2;                
                this.dy = (Math.random() - 0.5) * 2;
                this.dx *= Ball.speed;
                this.dy *= Ball.speed;

        }

        move(player) {
                this.x += this.dx;
                this.y += this.dy;
                if (this.x < 0) {
                        this.x = 0;
                        this.dx *= -1;
                        this.dx += Math.random() - 0.5;
                } else if (this.x + this.radius > canva.width) {
                        this.x = canva.width - this.radius;
                        this.dx *= -1;
                        this.dx += Math.random() - 0.5;
                }

                if (this.y < 0) {
                        this.y = 0;
                        this.dy *= -1;
                } else if (this.y-this.radius > canva.height) {
                        this.isOut = true;
                        // stop the ball -> loose
                } else if (this.y >= player.y && this.x >= player.x && this.x <= player.x + player.width) {
                        this.y = player.y-this.dy;
                        this.dy *= -1;
                }
                
        }

        display() {
                context2D.fillStyle = "#d5e4ecff"
                context2D.beginPath();
                context2D.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                context2D.fill();
                context2D.closePath();
        }
}

// game variable
let player, ball;
let moveLeft = false, moveRight = false;
let startTime = null;


function displayItems() {
        context2D.clearRect(0, 0, canva.width, canva.height);
        player.display();
        ball.display();
}

function updateScore(timeStamp) {
        if (startTime == null) startTime = timeStamp;

        const elapse = (timeStamp - startTime) / 1000; // 1sec
        labScore.textContent = elapse.toFixed(0);
}

function newGame() {
        player = new Player(canva.width/2-38, canva.height-12, 76, 10);
        ball = new Ball(canva.width/2, canva.height/2, 5);
        startTime = null; 
        resultat.innerHTML = "";
        displayItems();
}

// movement
// pc
// Pour le bouton gauche
btnLeft.addEventListener("mousedown", () => {
  moveLeft = true;
});
btnLeft.addEventListener("mouseup", () => {
  moveLeft = false;
});
btnLeft.addEventListener("mouseleave", () => {
  moveLeft = false;
});

// Pour le bouton droit
btnRight.addEventListener("mousedown", () => {
  moveRight = true;
});
btnRight.addEventListener("mouseup", () => {
  moveRight = false;
});
btnRight.addEventListener("mouseleave", () => {
  moveRight = false;
});


// mobile
btnLeft.addEventListener("touchstart", () => {
  moveLeft = true;
});
btnLeft.addEventListener("touchend", () => {
  moveLeft = false;
});

btnRight.addEventListener("touchstart", () => {
  moveRight = true;
});
btnRight.addEventListener("touchend", () => {
  moveRight = false;
});

// move with arrows
document.addEventListener('keydown', (event) => {
        if (event.key == 'ArrowLeft') {
                moveLeft = true;
        } else if (event.key == 'ArrowRight') {
                moveRight = true;
        }
});
document.addEventListener('keyup', (event) => {
        if (event.key == 'ArrowLeft') {
                moveLeft = false;
        } else if (event.key == 'ArrowRight') {
                moveRight = false;
        }
});

btnNewGame.addEventListener('click', () => newGame());


function update(timeStamp) {
        if (player == null || ball == null) return;

        if (ball.isOut) {
                resultat.innerHTML = "Vous avez perdu";
        } else {
                if (moveLeft) player.move(-1);
                if (moveRight) player.move(1);
                ball.move(player);
                updateScore(timeStamp);
        }
        displayItems();

        requestAnimationFrame(update);
}

newGame();
update();
