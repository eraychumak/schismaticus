// global game data.
const data = {
    canvas: {
        height: 300,
        width: 1000
    },
    ground: {
        x: 0,
        y: 250
    },
    players: [],
    obstacles: [],
    score: 0,
    // screens: {
    //     start: {
    //         status: true,
    //         load: load_screen("load")
    //     },
    //     options: {
    //         status: false,
    //         load: load_screen("options")
    //     },
    //     leaderboard: {
    //         status: false,
    //         load: load_screen("leaderboard")
    //     }
    // }
};

// Syntax: int, int, int, int, array[int, int, int].
class Obstacle {
    constructor(x, y, height, width, color) {
        this.x = x;
        this.y = y;
        this.speed = {
            x: -3,
            y: 0
        };
        this.height = height;
        this.width = width;
        this.color = {
            r: color[0],
            g: color[1],
            b: color[2]
        };
        this.spawn = function() {
            fill(this.color.r, this.color.g, this.color.b)
            const appearance = {
                main: rect(this.x, this.y, this.width, this.height)
            }
            return appearance;
        };
        this.update = function() {
            this.x += this.speed.x;
            if (this.x < -this.width) {
                this.x = data.canvas.width + this.width;
            }
        };
        data.obstacles.push(this);
    }
}


// default player textures, mechanics + physics. Syntax: int, int, array[int, int].
function Player(x, y, controls) {
    this.x = x;
    this.y = y;
    this.speed = {
        x: 0,
        y: 0
    };
    this.controls = {
        left: controls[0],
        right: controls[1]
    };
    this.height = 50;
    this.width = 20;
    this.jumping = false;
    this.spawn = function() {
        fill(100, 100, 100);
        const appearance = {
            main: [rect(this.x, this.y, this.width, this.height)]
        };
        return appearance;
    };
    this.update = function() {
        this.x += this.speed.x;
        this.y += this.speed.y;
        this.x = constrain(this.x, 0, data.canvas.width - 20);
        this.y = constrain(this.y, 0, data.canvas.height - 20);
        if (this.y + this.height > data.ground.y) {
            this.y = data.ground.y - this.height;
            this.speed.y = 0;
            this.jumping = false;
        } else this.speed.y++;
        data.obstacles.forEach(obstacle => {
            const distance = obstacle.x - this.x;
            const overlap = (this.width / 2) + (obstacle.width / 2);
            if (distance <= overlap && distance >= -overlap && this.y > obstacle.y - (obstacle.height / 2)) {
                this.x = 20;
                data.score = 0;
                obstacle.x = data.canvas.width + obstacle.width;
            } else data.score += 1;
            if (this.x > this.width * 2) {
                obstacle.speed.x = -(data.canvas.width / this.x) * 1.5;
            } else obstacle.speed.x = -3;
        });
    };
    this.load_kp = function() {
        if (!this.jumping && keyCode === 32) {
            this.speed.y = -15;    
            this.jumping = true;
        }
        if (keyCode === this.controls.left) this.speed.x = -5;
        if (keyCode === this.controls.right) this.speed.x = 5;
    };
    this.load_kr = function() {
        this.speed.x = 0;
    };
    data.players.push(this);
}

// player class instances. Syntax: x, y, [left, right].
const player = new Player(20, 0, [37, 39]);
const part_two = new Player(23, 0, [37, 39]);

// obstacle class instances + extends. Syntax: x, y, [r, g, b].
const obstacle = new Obstacle(data.canvas.width, data.ground.y - player.height, 50, 20, [20, 20, 20]);
const obstacle_01 = new Obstacle(data.canvas.width + 100, data.ground.y - player.height, 50, 20, [20, 20, 20]);

function setup() {
    createCanvas(data.canvas.width, data.canvas.height);
 }

function draw() {
    background(65);
    
    data.players.forEach(player => {
        player.spawn();
        player.update();
    });

    data.obstacles.forEach(obstacle => {
        obstacle.spawn();
        obstacle.update();
    });

    // displays score.
    textSize(32);
    noStroke();
    text(data.score, 50, 50);

    // displays ground.
    stroke(255);
    line(0, data.ground.y, data.canvas.width, data.ground.y);

    // game outlines.
    stroke(255);
    line(0, 0, data.canvas.width, 0);
    line(0, 0, 0, data.canvas.height);
    line(data.canvas.width - 1, 0, data.canvas.width - 1, data.canvas.height);
}

function keyPressed() {
    data.players.forEach(player => player.load_kp());
}
function keyReleased() {
    data.players.forEach(player => player.load_kr());
}