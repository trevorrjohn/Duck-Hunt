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
var BOTTOM = can_height - .25*can_height;
var highSchores = new Array();
var FLYRIGHT = new Boolean();
var played = new Boolean();
    played = false;
/*duck location*/
  // Sprite Grid Info
  var duckH = 36;
  var duckW = 39;
  var x = 25;
  var y = 552;
  // Red Duck Locations
  var redRx = x;
  var redLx = x + 3 * duckW;
  var redY = y + duckH;
  var redRhitX = x;
  var redLhitX = x + duckW;
  var redHitY = y + 2 * duckH;
  var redRAwayX = x;
  var redAwayY = y;
  var redLAwayX = x + duckW * 3;
  var redFX = x + duckW * 2;
  var redFY = y + duckH * 2;
  // used duck settings
  var duckX = redRx;
  var duckY = redY;
  var awayX = redRAwayX;
  var awayY = redAwayY;
  var fallX = redFX;
  var fallY = redFY;
  var hitX = redRhitX;
  var hitY = redHitY;

  var duck_pos_x = -duckW;
  var duck_pos_y = Math.floor(Math.random()*150);
// Dog info
  var dogX = 25;
  var dogY = 301;
  var dogW = 59;
  var dogH = 53;
  var dcount = 0;
  var dogPos = 0;
  var dogYpos = can_height*.85;
  var perkDog = dogX + dogW*5;
  var jumpDog = dogX + dogW*6;
  var catchDog = dogX + dogW*8;
  var missDog = dogX + dogW*10;
  var jumpDogY = dogYpos;
  var jumpBool = new Boolean();
      jumpBool = false;
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

function dogJump() {
  background();
  if(jumpBool == false){
    ctx.drawImage(sprite, jumpDog, dogY, dogW, dogH, dogPos,
        jumpDogY, dogW, dogH);
    if(jumpDogY < BOTTOM){
      jumpBool = true;
    }
    jumpDogY -= 5;
  } else {
    ctx.drawImage(sprite, jumpDog, dogY, dogW, dogH,
        dogPos, jumpDogY, dogW, dogH);
    jumpDogY +=3;
    if(jumpDogY > BOTTOM){
      dogH -= 3;
      if(dogH < 0){
        clearInterval(timer);
        dogPos = 0;
        jumpDogY = dogYpos;
        jumpBool = false;
        dogH = 44;
        timer = setInterval(gameLoop, 1000/fps);
      }
    }
  }
}

function walkDog() {
  if (dcount == 5){
    dcount = 0;
  }
  background();
  ctx.drawImage(sprite, (dogX + dogW*dcount), dogY, dogW, dogH,
      dogPos, dogYpos, dogW, dogH);
  dcount++;
  dogPos += 13;
  if(dogPos > can_width/3){
    clearInterval(timer);
    dcount = 0;
    background();
    console.log(duckX + ", " + duckY)
    timer = setInterval(function(){
     // console.log((dogX+dogW*5) + ", " + ((dogY)));
      ctx.drawImage(sprite, perkDog, dogY, dogW, dogH,
        dogPos, dogYpos, dogW, dogH);
      dcount++;
      if(dcount == 7){
        clearInterval(timer);
        dcount = 0;
        timer = setInterval(dogJump, 1000/15);
      }
    }, 1000/fps);
  }
}

function hitDuck() {
  background();
  if(hitTimer < fps/2) {
    ctx.drawImage(sprite, hitX, hitY, duckW,
        duckH, duck_pos_x, duck_pos_y, duckW, duckH);
    hitTimer++;
  } else {
    clearInterval(timer);
    var fallCount = 0;
    timer = setInterval(function(){
      if(fallCount == 2){
        fallCount = 0;
      }
      background();
      ctx.drawImage(sprite, (fallX + duckW*fallCount), fallY, duckW,
        duckH, duck_pos_x, duck_pos_y, duckW, duckH);
      duck_pos_y += 25;
      fallCount++;
      if(duck_pos_y > BOTTOM) {
        duckH -= 15;
        if(duckH < 0) {
          duckH = 37;
          duck_pos_x += RIGHT; //sets greater then right edge so reroutes
          hitTimer=0; //reset hitTimer
          clearInterval(timer);
          timer = setInterval(gameLoop, 1000/fps);
        }
      }
    }, 1000/9);
  }
}

function hit() {
  score++;
  hitTimer = 0;
  clearInterval(timer);
  timer = self.setInterval(hitDuck, 1000/fps);
}

function flyAway() {
  if(duck_pos_y + duckH < TOP) {
    canvas.removeEventListener('click', arguments.callee, false);
    played = true;
    mainMenu();
    return;
  }
  slope = -10;
  speed = 15;
  fcount++;
  duck_pos_x += speed;
  duck_pos_y += slope;
  if(fcount == FRAME_MAX) {
    fcount = 0;
  }
  background();
  ctx.drawImage(sprite, awayX + fcount * duckW, awayY, duckW,
      duckH, duck_pos_x, duck_pos_y, duckW, duckH);
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
  console.log(gun_x + ", " + gun_y + ": " + duck_pos_x + ", " + duck_pos_y);
  var rightBoundary = duck_pos_x + duckW;
  var bottomBoundary = duck_pos_y + duckH;
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
  if(duck_pos_y < TOP || duck_pos_y + duckH > BOTTOM) {
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
  ctx.drawImage(sprite, duckX + fcount * duckW, duckY, duckW,
      duckH, duck_pos_x, duck_pos_y, duckW, duckH);
}

function startLoop() {
  walkDog();
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
  var bar_location_x = LEFT + can_width*.75;
  var bar_location_y = can_height*.95;
  var ammo_x = 262;
  var ammo_y = 49;
  var ammo_width = 8 * ammo;
  var ammo_height = 10;
  var ammo_loc_x = bar_location_x + bar_location_x * .007;
  var ammo_loc_y = bar_location_y + bar_location_y * .005;

  ctx.drawImage(sprite, bg_x, bg_y, bg_width, bg_height,
      0, 0, can_width, can_height);
  ctx.drawImage(sprite, bar_x, bar_y, bar_width, bar_height,
      bar_location_x, bar_location_y, bar_width, bar_height);
  ctx.drawImage(sprite, ammo_x, ammo_y, ammo_width, ammo_height,
      ammo_loc_x, ammo_loc_y, ammo_width, ammo_height);
  ctx.fillStyle = '#ffffff';
  ctx.font = "bold 10px inconsolata";
  ctx.fillText(score*10, (bar_location_x + bar_location_x*.5),
              (bar_location_y + bar_location_y * .01));
}

function start(event) {
  this.removeEventListener('click', arguments.callee, false);
  ammo=3;
  background();
  timer = self.setInterval(walkDog, 1000/fps);
}

function init() {
  sprite.onload = mainMenu();
}

function mainMenu() {
  if(document.cookie != "" && navigator.onLine) {
    var info = new Array();
    info = document.cookie.split("|");
    while(info.length != 0){
      var score = info.pop().toInteger();
      var user = info.pop().toString();

      $.post("http://score-app.heroku.com/api/v1/scores", {game: "Duck-Hunt", score: score*10, username: user});
    }
  }
  if(played){
    var username = prompt("Enter your score-app.heroku.com username to send your score:", "username");
    if(username != "" && navigator.onLine){
      $.post("http://score-app.heroku.com/api/v1/scores", {game: "Duck-Hunt", score: score*10, username: username});
    } else {
      var toBeSet = username + "|" + score.toString()
      document.cookie=toBeSet;
      console.log("Cookie set to:" + document.cookie);
    }
  }

  clearInterval(timer);
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
