const board = document.querySelector('.board');
const startButton = document.querySelector('.start-btn');
const modal = document.querySelector('.modal');
const startGamemodal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.Game-Over');
const restartButton = document.querySelector('.restart-btn');
const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');
let direction = 'down';
const blockheight = 80;
const blockwidth = 80;
let highScoreFromStorage = localStorage.getItem('highScore') || 0;
highScoreElement.innerText = `High Score: ${highScoreFromStorage}`;
let highScore = parseInt(highScoreFromStorage) || 0;
let score = 0;
let time = "00:00";

let cols = 0;
let rows = 0;
let intervalId = null;
let timerId = null;
let food = {x: 0, y: 0};
let blocks = {};
let snake = [{x: 1, y: 3}];

function initBoard() {
    board.innerHTML = '';
    blocks = {};
    cols = Math.floor(board.clientWidth / blockwidth) || 10; 
    rows = Math.floor(board.clientHeight / blockheight) || 10;
    
    board.style.setProperty('--cols', cols);
    board.style.setProperty('--rows', rows);

    for (let row = 0; row < rows; row++){
        for (let col = 0; col < cols; col++){
            const block = document.createElement('div');
            block.classList.add("block");
            board.appendChild(block);
            blocks[`${row}-${col}`] = block;
        }
    }
    
    snake = [{x: 1, y: 3}];
    food = {x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};
}

window.addEventListener('load', initBoard);

window.addEventListener('resize', () => {
    clearInterval(intervalId);
    clearInterval(timerId);
    initBoard();
    modal.style.display = 'flex';
    startGamemodal.style.display = 'flex';
    gameOverModal.style.display = 'none';
    score = 0;
    time = "00:00";
    scoreElement.innerText = `Score: ${score}`;
    timeElement.innerText = `Time: ${time}`;
});
function render(){
    let head=null;
    blocks[`${food.x}-${food.y}`].classList.add('food');
    if(direction === 'left'){
        head = {x: snake[0].x, y: snake[0].y - 1};
    } else if(direction === 'right'){
        head = {x: snake[0].x, y: snake[0].y + 1};
    } else if(direction === 'up'){
        head = {x: snake[0].x - 1, y: snake[0].y};
    } else if(direction === 'down'){
        head = {x: snake[0].x + 1, y: snake[0].y};
    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
        clearInterval(intervalId);
        clearInterval(timerId);
        modal.style.display = 'flex';
        startGamemodal.style.display = 'none';
        gameOverModal.style.display = 'flex';
        return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)){
        clearInterval(intervalId);
        clearInterval(timerId);
        modal.style.display = 'flex';
        startGamemodal.style.display = 'none';
        gameOverModal.style.display = 'flex';
        return;
    }



    let ateFood = false;
    if (head.x === food.x && head.y === food.y){
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food = {x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};
        blocks[`${food.x}-${food.y}`].classList.add('food');
        ateFood = true;
        score++;
        scoreElement.innerText = `Score: ${score}`;
        if(score > highScore){
            highScore = score;
            localStorage.setItem('highScore', highScore.toString());
        }
    }

    snake.forEach(segment => {
         blocks[`${segment.x}-${segment.y}`].classList.remove('fill');  
    });

    snake.unshift(head);
    if (!ateFood) {
        snake.pop();
    }
    
    snake.forEach(segment => {
      blocks[`${segment.x}-${segment.y}`].classList.add('fill');  
    });
}

startButton.addEventListener('click', ()=>{
    initBoard();
    direction = 'down';
    modal.style.display = 'none';
    intervalId = setInterval(()=>{render()}, 400);
    timerId = setInterval(()=>{
        const currentTime = time.split(':');
        let minutes = parseInt(currentTime[0]);
        let seconds = parseInt(currentTime[1]);
        seconds++;
        if (seconds >= 60) {
            minutes++;
            seconds = 0;
        }
        time = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeElement.innerText = `Time: ${time}`;
    }, 1000);
});

restartButton.addEventListener('click', restartGame);

function restartGame(){
    clearInterval(intervalId);
    clearInterval(timerId);
    
    initBoard();
    
    score = 0;
    time = "00:00";
    scoreElement.innerText = `Score: ${score}`;
    timeElement.innerText = `Time: ${time}`;
    highScoreElement.innerText = `High Score: ${highScore}`;

    modal.style.display = 'none';
    direction = 'down';
    
    intervalId = setInterval(()=>{render()}, 400);
    timerId = setInterval(()=>{
        const currentTime = time.split(':');
        let minutes = parseInt(currentTime[0]);
        let seconds = parseInt(currentTime[1]);
        seconds++;
        if (seconds >= 60) {
            minutes++;
            seconds = 0;
        }
        time = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeElement.innerText = `Time: ${time}`;
    }, 1000);
}

  

document.addEventListener("keydown", (event)=>{
    if(event.key === 'ArrowUp' && direction !== 'down'){
        direction = 'up';
    }else if(event.key === 'ArrowDown' && direction !== 'up'){
        direction = 'down';
    } else if(event.key === 'ArrowLeft' && direction !== 'right'){
        direction = 'left';
    } else if(event.key === 'ArrowRight' && direction !== 'left'){
        direction = 'right';
    }
});