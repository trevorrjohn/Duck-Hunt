/*global image, audio and canvas*/
var canvas = document.getElementById("map");
var ctx = canvas.getContext('2d');
var sprite = new Image();
    sprite.src = "duck_hunt_sprites.png";
    canvas.width = document.width;
    canvas.height = document.height;
var can_width = canvas.width;
var can_height = canvas.height
var RIGHT = can_width;
var LEFT = 0;
var TOP = 0;
var BOTTOM = can_height- .185*can_height;

/*duck location*/
//black duck
  var bDuckR_x = 256;
  var bDuckR_y = 170;
  var bDuckL_x = 376;
  var bDuckL_y = 170;
  var bDuckAway_x;
  var bDuckAway_y;
  var bDuckHit;
  var bDuckF;
  // red duck
  var rDuckR_x = 15;
  var rDuckR_y = 550;
  var rDuckL_x = 166;
  var rDuckL_y = rDuckR_y;
  var rDuckAway_x = 15;
  var rDuckAway_y = 512;
  var rDuckHit;
  var rDuckF;
  // Pink/blue Duck
  var pDuckR_x = 17;
  var pDuckR_y = 674;
  var pDuckL_x = 166;
  var pDuckL_y = 674;
  var pDuckAway_x;
  var pDuckAway_y;
  var pDuckHit;
  var pDuckF;
  // used duck settings
  var duck_x = rDuckAway_x;
  var duck_y = rDuckAway_y;
  var duck_width = 37;
  var duck_height = 37;
  var duck_pos_x = -37;
  var duck_pos_y = Math.floor(Math.random()*150);

  // red duck
  var rduck_x = 5;
/*time and game variables*/
var timer;
var fps = 10;
var ammo = 3;
var score = 0;

/*duck variables*/
var speed = rndSpeed();
var slope = rndSlope();
var fcount = 0;
var FRAME_MAX = 3;
var hitTimer = 0;


function hitDuck() {
  var hit_x = 261;
  var hit_y = 211;
  var fall_x = 304;
  var fall_y = 211;
  var fall_width = 20;
  background();
  if(hitTimer < fps/2) {
    ctx.drawImage(sprite, hit_x, hit_y, duck_width,
        duck_height, duck_pos_x, duck_pos_y, duck_width, duck_height);
    hitTimer++;
  } else {
    ctx.drawImage(sprite, fall_x, fall_y, fall_width,
        duck_height, duck_pos_x, duck_pos_y, fall_width, duck_height);
    duck_pos_y += 25;
    if(duck_pos_y > BOTTOM) {
      duck_height -= 15;
      if(duck_height < 0) {
        duck_height = 37;
        duck_pos_x += RIGHT; //sets greater then right edge so reroutes
        hitTimer=0; //reset hitTimer
        clearInterval(timer);
        timer = setInterval(gameLoop, 1000/fps);
      }
    }
  }
}

function hit() {
  score++;
  hitTimer = 0;
  clearInterval(timer);
  timer = self.setInterval(hitDuck, 1000/fps);
}

function flyAway() {
  if(duck_pos_y + duck_height < TOP) {
    canvas.removeEventListener('click', arguments.callee, false);
    mainMenu();
    return;
  }
  slope = -10;
  speed = 15;
  var away_x = 257;
  var away_y = 132;
  fcount++;
  duck_pos_x += speed;
  duck_pos_y += slope;
  if(fcount == FRAME_MAX) {
    fcount = 0;
  }
  background();
  ctx.drawImage(sprite, away_x + fcount * duck_width, away_y, duck_width,
      duck_height, duck_pos_x, duck_pos_y, duck_width, duck_height);
}

function miss() {
  ammo--;
  if(ammo == 0) {
    ammo = 3;
    clearInterval(timer);
    timer = setInterval(flyAway, 1000/fps);
  }
 }

function fire(event) {
  var gun_x = event.clientX;
  var gun_y = event.clientY;
  var rightBoundary = duck_pos_x + duck_width;
  var bottomBoundary = duck_pos_y + duck_height;
  if(gun_x > duck_pos_x && gun_x < rightBoundary &&
      gun_y > duck_pos_y && gun_y < bottomBoundary) {
    hit();
  } else {
    miss();
  }
}

function rndSpeed() {
  return Math.floor(Math.random()*20+(2*score));
}

function rndSlope() {
  return Math.floor(Math.random()*13-6);
}

function reroute() {
  if(duck_pos_x > RIGHT) {
    speed = rndSpeed();
    slope = rndSlope();
    duck_pos_x = -37;
    duck_pos_y = Math.floor(Math.random()*150);
  }
  if(duck_pos_y < TOP || duck_pos_y + duck_height > BOTTOM) {
    slope = (-1)*slope; //change slope gonna hit ground or top
  }
}

function moveDuck() {
  background();
  duck_pos_x += speed;
  duck_pos_y += slope;
  fcount++;
  if(fcount == FRAME_MAX) {
    fcount =0;
  }
  ctx.drawImage(sprite, duck_x + fcount * duck_width, duck_y, duck_width,
      duck_height, duck_pos_x, duck_pos_y, duck_width, duck_height);
}

function gameLoop() {
  reroute(); //changes pos or slope of duck
  moveDuck(); //move the duck
  canvas.addEventListener('click', fire, false);
}

function background() {
  var bg_x = 913;
  var bg_y = 0;
  var bg_width = 2511-bg_x;
  var bg_height = 1197;
  var bar_x = 256;
  var bar_y = 75;
  var bar_width = 227;
  var bar_height = 23;
  var bar_location_x = LEFT + can_width*.25;
  var bar_location_y = can_height*.95;
  var ammo_x = 262;
  var ammo_y = 49;
  var ammo_width = 8 * ammo;
  var ammo_height = 10;
  var ammo_loc_x = bar_location_x + 6;
  var ammo_loc_y = bar_location_y + 3;

  ctx.drawImage(sprite, bg_x, bg_y, bg_width, bg_height,
      0, 0, can_width, can_height);
  ctx.drawImage(sprite, bar_x, bar_y, bar_width, bar_height,
      bar_location_x, bar_location_y, bar_width, bar_height);
  ctx.drawImage(sprite, ammo_x, ammo_y, ammo_width, ammo_height,
      ammo_loc_x, ammo_loc_y, ammo_width, ammo_height);
  ctx.fillStyle = '#ffffff';
  ctx.font = "bold 10px inconsolata";
  ctx.fillText(score*10, bar_location_x + 200, bar_location_y + 10);
}

function start(event) {
  this.removeEventListener('click', arguments.callee, false);
  ammo=3;
  background();
  timer = self.setInterval(gameLoop, 1000/fps);
}

function init() {
  sprite.onload = mainMenu();
}

function mainMenu() {
  clearInterval(timer);
  console.log("in menu");
    var menu_x = 0;
  var menu_y = 0;
  var menu_width = 240;
  var menu_height = 250;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, can_width, can_height);
  ctx.drawImage(sprite, menu_x, menu_y, menu_width, menu_height,
      can_width/2 -  menu_width/2, can_height/2 - menu_height/2, menu_width, menu_height);
  ctx.fillStyle = "#5ce430";
  ctx.font = "bold 12px inconsolata";
  ctx.fillText(score*10, can_width/2-menu_width/2 + 110, can_height/2- menu_height/2 + 137);
  score = 0;
  canvas.addEventListener('click', start, false);
}
