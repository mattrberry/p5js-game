function setup() {
    createCanvas(500, 500);
}

var right = 0, left = 0, down = 0, up = 0;
var score = 0;

var player = {x: 50, y: 50, w: 50, h: 50, s: 5};

var walls = [{x: 0,   y: 0,   w: 500, h: 50 },
             {x: 0,   y: 450, w: 500, h: 50 },
             {x: 0,   y: 0,   w: 50,  h: 500},
             {x: 450, y: 0,   w: 50,  h: 500},
             {x: 50,  y: 100, w: 150, h: 50 },
             {x: 300, y: 350, w: 150, h: 50 },
             {x: 200, y: 200, w: 100, h: 100},
             {x: 100, y: 300, w: 50,  h: 50 },
             {x: 350, y: 150, w: 50,  h: 50 }];

var gold = [{x: 215, y: 180, w: 10, h: 10, v: 1},
            {x: 245, y: 180, w: 10, h: 10, v: 1},
            {x: 275, y: 180, w: 10, h: 10, v: 1},
            {x: 215, y: 310, w: 10, h: 10, v: 1},
            {x: 245, y: 310, w: 10, h: 10, v: 1},
            {x: 275, y: 310, w: 10, h: 10, v: 1},
            {x: 180, y: 215, w: 10, h: 10, v: 1},
            {x: 180, y: 245, w: 10, h: 10, v: 1},
            {x: 180, y: 275, w: 10, h: 10, v: 1},
            {x: 310, y: 215, w: 10, h: 10, v: 1},
            {x: 310, y: 245, w: 10, h: 10, v: 1},
            {x: 310, y: 275, w: 10, h: 10, v: 1}];

var bouncers = [{x: 50,  y: 160, w: 30, h: 30, s: 2, a: "h"},
                {x: 420, y: 310, w: 30, h: 30, s: 2, a: "h"},
                {x: 310, y: 50,  w: 30, h: 30, s: 2, a: "v"},
                {x: 160, y: 420, w: 30, h: 30, s: 2, a: "v"}];

var finish = {x: 400, y: 400, w: 50, h: 50};

var draw = function() {
    background(102, 205, 170);
    noStroke();

    drawWalls();
    drawFinish();
    drawGold();
    drawScore();
    drawBouncers();
    drawPlayer();

    moveBouncers();
    move(player, player.s);
};

var drawWalls = function() {
    for (var i = 0; i < walls.length; i++) {
        fill(0, 128, 128);
        rect(walls[i].x, walls[i].y, walls[i].w, walls[i].h);
    }
};

var drawFinish = function() {
    fill(32, 32, 32);
    rect(finish.x, finish.y, finish.w, finish.h);

    fill(223, 223, 223);
    rect(finish.x, finish.y+finish.h/3, finish.w/3, finish.h/3);
    rect(finish.x+finish.w/3, finish.y, finish.w/3, finish.h/3);
    rect(finish.x+finish.w/3, finish.y+2*finish.h/3, finish.w/3, finish.h/3);
    rect(finish.x+2*finish.w/3, finish.y+finish.h/3, finish.w/3, finish.h/3);

    if (checkFinish()) {
        reset(false);
    }
};

var drawGold = function() {
    for (var i = 0; i < gold.length; i++) {
        fill(224, 255, 255);

        if (collision(player, gold[i]) && gold[i].v == 1) {
            gold[i].v = 0;
            score++;
        }

        if (gold[i].v == 1) {
            rect(gold[i].x, gold[i].y, gold[i].w, gold[i].h);
        }
    }
};

var drawScore = function() {
    fill(102, 205, 170);
    textSize(30);
    text("Score: " + score, 190, 485);
};

var drawBouncers = function() {
    for (var i = 0; i < bouncers.length; i++) {
        fill(178, 34, 34);
        rect(bouncers[i].x, bouncers[i].y, bouncers[i].w, bouncers[i].h);
    }
};

var drawPlayer = function() {
    fill(127, 255, 212);
    rect(player.x, player.y, player.w, player.h);
};

var moveBouncers = function() {
    for (var i = 0; i < bouncers.length; i++) {
        if (bouncers[i].a == "h") {
            bouncers[i].x+=bouncers[i].s;
        } else if (bouncers[i].a = "v") {
            bouncers[i].y+=bouncers[i].s;
        }

        for (var j = 0; j < walls.length; j++) {
            if (collision(bouncers[i], walls[j])) {
                bouncers[i].s*=-1;
            }
        }

        if (collision(bouncers[i], player)) {
            reset(true);
        }
    }
}

var move = function(obj, speed) {
    if (right == 1) {
        obj.x+=speed;

        for (var i = 0; i < walls.length; i++) {
            while (collision(obj, walls[i])) {
                obj.x--;
            }
        }
    }
    if (left == 1) {
        obj.x-=speed;

        for (var i = 0; i < walls.length; i++) {
            while (collision(obj, walls[i])) {
                obj.x++;
            }
        }
    }
    if (down == 1) {
        obj.y+=speed;

        for (var i = 0; i < walls.length; i++) {
            while (collision(obj, walls[i])) {
                obj.y--;
            }
        }
    }
    if (up == 1) {
        obj.y-=speed;

        for (var i = 0; i < walls.length; i++) {
            while (collision(obj, walls[i])) {
                obj.y++;
            }
        }
    }
};

var collision = function(obj1, obj2) {
    return (obj1.x + obj1.w > obj2.x &&
            obj1.x < obj2.x + obj2.w &&
            obj2.y + obj2.h > obj1.y &&
            obj2.y < obj1.y + obj1.h);
};

var checkFinish = function() {
    return (player.x >= finish.x &&
            player.y >= finish.y &&
            player.x + player.w <= finish.x + finish.h &&
            player.y + player.h <= finish.y + finish.h &&
            score % 12 == 0);
}

var reset = function(resetScore) {
    if (resetScore) {
        score = 0;
    }

    player.x = 50;
    player.y = 50;

    for (var i = 0; i < gold.length; i++) {
        gold[i].v = 1;
    }
};

var keyPressed = function() {
    if (keyCode == RIGHT_ARROW) {
        right = 1;
    }
    if (keyCode == LEFT_ARROW) {
        left = 1;
    }
    if (keyCode == DOWN_ARROW) {
        down = 1;
    }
    if (keyCode == UP_ARROW) {
        up = 1;
    }
};

var keyReleased = function() {
    if (keyCode == RIGHT_ARROW) {
        right = 0;
    }
    if (keyCode == LEFT_ARROW) {
        left = 0;
    }
    if (keyCode == DOWN_ARROW) {
        down = 0;
    }
    if (keyCode == UP_ARROW) {
        up = 0;
    }
};
