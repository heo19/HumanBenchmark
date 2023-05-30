let level = 1;
let isPassed = true;
let userClicked = false;

//Removed Elements in the main page and replace with game screen
function callGamePage(){
    var gameScreenRemove = document.getElementById("gameScreen");
    if (gameScreenRemove && gameScreenRemove.parentNode) {
        gameScreenRemove.parentNode.removeChild(gameScreenRemove);
    }

    var mainScreen = document.getElementById("mainScreen");

    var gameScreen = document.createElement('div');
    gameScreen.setAttribute("id", "gameScreen");

    var scoreBoard = document.createElement('div');
    scoreBoard.setAttribute('id', 'scoreBoard');

    var levelText = document.createElement('p');
    levelText.setAttribute("id", "levelText");
    levelText.innerHTML = "Level: ";
    
    var levelNumber = document.createElement('p');
    levelNumber.setAttribute("id", "levelNumber");
    levelNumber.innerHTML = level;

    mainScreen.appendChild(gameScreen);
    gameScreen.appendChild(scoreBoard);
    scoreBoard.appendChild(levelText);
    scoreBoard.appendChild(levelNumber);

    var gameBoard = document.createElement('div');
    gameBoard.setAttribute('id', "gameBoard");
    gameScreen.appendChild(gameBoard);

    for(var i = 0; i < 3; i++){
        var gameRow = document.createElement('div');
        gameRow.setAttribute('class', 'gameRow');
        gameBoard.appendChild(gameRow);

        for(var j = 0; j < 3; j++){
            var gameBox = document.createElement('div');
            gameBox.setAttribute('class', 'gameBox');
            gameRow.appendChild(gameBox);
        }
    }

    setTimeout(startGame, 1000);
}

function startGame(){
    var answerArray = [];
    var boxSet = document.getElementsByClassName('gameBox');

    while(isPassed){
        answerArray.push(generatedRandomNumber(answerArray));
        console.log(answerArray[level-1]);

        giveSequenceOfLight(answerArray, boxSet);
        //getUserInput(answerArray, boxSet);
        
        level++;
        var levelNumber = document.getElementById("levelNumber");
        levelNumber.innerHTML = level;
        isPassed = false;
    }
    console.log("Game End!")
}


//Return Random Number 0-8 that is the same as previous value
function generatedRandomNumber(answerArray) {
    var randomNumber = Math.floor(Math.random() * 9);
    if(answerArray.length >= 1){
        while(randomNumber == answerArray[level-1]){
            randomNumber = Math.floor(Math.random() * 9);
        }
    }

    return randomNumber;
}

function blink(box) {
     box.classList.add('highlight');
     setTimeout(function(){
        box.classList.remove('highlight');
     }, 500);
}

//switching from var to let solved a error of only blinking the second box.
function giveSequenceOfLight(answerArray, boxSet) {
    console.log("giving sequence of light");

    for(var i = 0; i < level; i++){
        let box = boxSet[answerArray[i]];
        setTimeout(function() {
            blink(box);
        }, 1000 * (i+1));
    }
}

function getUserInput(answerArray, boxSet) {
    console.log("getting user Input");
    for(var i = 0; i < level; i++) {
        for(var j = 0; j < 9; j++) {
            if(j != answerArray[i]){
                boxSet[j].addEventListener("click", wrongBox);
            } else {
                boxSet[j].addEventListener("click", correctBox);
            }
        }
        userClicked = false;
        waitAndResume();
    }
}

function wrongBox(){
    console.log("wrong box clicked");
    isPassed = false;
    userClicked = true;
}

function correctBox() {
    console.log("correct box clicked");
    userClicked = true;
}

function waitForUserInput() {
    console.log('Waiting....');
    return new Promise((resolve) => {
      if (userClicked) {
        resolve(); // Resolve the promise immediately if the condition is already met
      } else {
        // Poll the condition periodically until it is met
        const intervalId = setInterval(() => {
          if (userClicked) {
            clearInterval(intervalId); // Stop polling
            resolve(); // Resolve the promise when the condition is met
          }
        }, 1000); // Poll every 1 second
      }
    });
}

async function waitAndResume() {
    console.log('Waiting for user input...');
    await waitForUserInput(); // Wait for the condition to be met
    console.log('user clicked!');
}