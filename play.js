
var canv = document.getElementById("myCanvas");
var ctx = canv.getContext("2d");

const fps = 30;
var cards_left = 0;
var imgWidth = 150;
var imgHeight = 150;
const tileWidth = 170;
const tileHeight = 170;
var timestop = true;
var clickedCard = null;
const one_card_open = 0;
const two_card_open = 1;
const no_card_open = 2;
const game_over = 3;

const OPEN = 0;
const CLOSED = 1;
const REMOVED = 2;

var gameState = game_over;

const images = [];

for (let i = 0; i < 8; i++) {
    images.push(new Image());
}

images[0].src = 'Images/clocks.jpg';
images[1].src = 'Images/Cat_man.jpg';
images[2].src = 'Images/dr_seuss.jpg';
images[3].src = 'Images/guitarist.jpg';
images[4].src = 'Images/mona_lisa.jpg';
images[5].src = 'Images/new_image.jpg';
images[6].src = 'Images/pharaoh.png';
images[7].src = 'Images/van_gogh.jpg';


var cards = [];

for (let i = 0; i < images.length * 2; i++) {

    let row = Math.floor(i / 4);
    let col = i % 4;
    let x = row * tileWidth;
    let y = col * tileHeight;
    let card = {
        'img': images[i % 8],
        xCoord: x,
        yCoord: y,
        state: CLOSED
    };
    cards.push(card);
}

cards_left = images.length * 2;

function shuffleCards() {
    var arr = [];
    cards.forEach(card => {
        arr.push({
            x: card.xCoord, y: card.yCoord
        });
    })
    shuffle(arr);

    for (let j = 0; j < cards.length; j++) {
        cards[j].xCoord = arr[j].x;
        cards[j].yCoord = arr[j].y;
    }
}

shuffleCards();

var newgame = false;
function checkGameState(){
    var first_element = document.getElementById("minutes");
    var second_element = document.getElementById("seconds");

    if(clickedCard == null){
        if(first_element.innerText>"0" && second_element.innerText>"0"){
            newgame = true;
        }
    }

    var btnready = document.getElementById('button-ready');
    btnready.addEventListener('click',stopTimer,false);
}
function newGame() {
    timer = 0;
    timestop = false;
    gameState = no_card_open;
    clickedCard = null;
    shuffleCards();
    cards.forEach(card => {
        card.state = CLOSED;
    })
}

const image = new Image();
image.src = "Images/memory_back.png";

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    clickedCard = (getClickedCard(x, y))
}

const canvas = document.querySelector('canvas')
canvas.addEventListener('mousedown', function (e) {
    getCursorPosition(canvas, e)
})

var firstOpenedCard = null;
var secondOpenedCard = null;

var frames = 0;
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function addToRanking() {
    var scores = null;
    scores = JSON.parse(localStorage.getItem("scores"));

    if (scores == null) {
      scores = [];
    }

    var obj = {"username":localStorage.getItem("username"),"score" : timer}
    scores.push(obj);

    localStorage.setItem("scores",JSON.stringify(scores));
  }

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState == no_card_open && clickedCard) {
        clickedCard.state = OPEN;
        firstOpenedCard = clickedCard;
        gameState = one_card_open;
    } else if (gameState == one_card_open && clickedCard && clickedCard != firstOpenedCard) {
        clickedCard.state = OPEN;
        secondOpenedCard = clickedCard;
        gameState = two_card_open;
    } else if (gameState == two_card_open) {
        frames++;
        if (frames >= 30) {
            gameState = no_card_open;
            firstOpenedCard.state = CLOSED;
            secondOpenedCard.state = CLOSED;
            frames = 0;
            clickedCard = null;

            if (firstOpenedCard.img == secondOpenedCard.img) {
                firstOpenedCard.state = REMOVED;
                secondOpenedCard.state = REMOVED;
                cards_left -= 2;
            }
        }
        console.log(cards_left);
        if(cards_left == 0){
            gameState = game_over;
            timestop = true;
            addToRanking();
        }
    }

    for (let i = 0; i < cards.length; i++) {
        if (cards[i].state == OPEN) {
            ctx.drawImage(cards[i].img, cards[i].xCoord, cards[i].yCoord, imgWidth, imgHeight);
        }
        else if (cards[i].state == CLOSED) {
            ctx.drawImage(image, cards[i].xCoord, cards[i].yCoord, imgWidth, imgHeight);
        }
    }

}

function getClickedCard(x, y) {

    for (let i = 0; i < cards.length; i++) {
        if ((x >= cards[i].xCoord && x <= cards[i].xCoord + imgWidth)
            && (y >= cards[i].yCoord && y <= cards[i].yCoord + imgHeight)) {
            if (cards[i].state == CLOSED) {
                return cards[i];
            }

        }

    }
    return null;
}

var timer = 0;
function time() {
    if(!timestop){
        timer++;
    }
    var first_element = document.getElementById("minutes");
    var second_element = document.getElementById("seconds");

    var seconds = Math.floor(timer % 60);
    if (seconds < 10) {
        second_element.innerText = "0" + seconds;
    } else {
        second_element.innerText = seconds;
    }

    var minutes = Math.floor(timer / 60);
    if (minutes < 10) {
        first_element.innerText = "0" + minutes;
    } else {
        first_element.innerText = minutes;
    }    
}


function increaseTimer() {
    setInterval(time, 1000);
}

increaseTimer();
setInterval(render, 1000 / fps);
