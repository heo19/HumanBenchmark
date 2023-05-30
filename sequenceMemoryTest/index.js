let level = 1;
let isPassed = true;
let userClicked = false;
let isLevelEnded = false;
let isDisplayEnded = false;

function callStartPage(){
    level = 1;
    isPassed = true;
    userClicked = false;
    isLevelEnded = false;
    isDisplayEnded = false;

    var gameScreenRemove = document.getElementById("gameScreen");
    if (gameScreenRemove && gameScreenRemove.parentNode) {
        gameScreenRemove.parentNode.removeChild(gameScreenRemove);
    }

    var mainScreen = document.getElementById("mainScreen");

    var gameScreen = document.createElement('div');
    gameScreen.setAttribute("id", "gameScreen");

    var icon = document.createElement('i');
    icon.setAttribute('class', 'fa-solid fa-memory fa-fade fa-6x');

    var mainTitle = document.createElement('h1');
    mainTitle.setAttribute('id', 'mainTitle');
    mainTitle.innerHTML = "Sequence Memory Test";

    var mainDescription = document.createElement('h2');
    mainDescription.setAttribute('id', 'mainDescription');
    mainDescription.innerHTML = "Memorize the pattern";

    var startButton = document.createElement('button');
    startButton.setAttribute('id', 'startButton');
    startButton.setAttribute('onclick', 'callGamePage()');
    startButton.innerHTML = "Start";

    mainScreen.appendChild(gameScreen);
    gameScreen.appendChild(icon);
    gameScreen.appendChild(mainTitle);
    gameScreen.appendChild(mainDescription);
    gameScreen.appendChild(startButton);
}

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

    setTimeout(startGame, 500);
}

function callEndingPage(){
    var mainScreen = document.getElementById("mainScreen");

    mainScreen.classList.add('highlight');
    setTimeout(function(){
        mainScreen.classList.remove('highlight');
    }, 400);

    var gameScreenRemove = document.getElementById("gameScreen");
    if (gameScreenRemove && gameScreenRemove.parentNode) {
        gameScreenRemove.parentNode.removeChild(gameScreenRemove);
    }

    var gameScreen = document.createElement('div');
    gameScreen.setAttribute("id", "gameScreen");

    var icon = document.createElement('i');
    icon.setAttribute('class', 'fa-solid fa-memory fa-fade fa-6x');

    var endingTitle = document.createElement('p');
    endingTitle.setAttribute('id', 'endingTitle');
    endingTitle.innerHTML = "Sequence Memory";

    var endingLevel = document.createElement('p');
    endingLevel.setAttribute('id', 'endingLevel');
    endingLevel.innerHTML = "Level " + level.toString();

    var endingDescription = document.createElement('p');
    endingDescription.setAttribute('id', 'endingDescription');
    endingDescription.innerHTML = "Save your score to see how you compare.";

    var endingButton = document.createElement('button');
    endingButton.setAttribute('id', 'endingButton');
    endingButton.setAttribute('onclick', 'callStartPage()');
    endingButton.innerHTML = "Try again";

    mainScreen.appendChild(gameScreen);
    gameScreen.appendChild(icon);
    gameScreen.appendChild(endingTitle);
    gameScreen.appendChild(endingLevel);
    gameScreen.appendChild(endingDescription);
    gameScreen.appendChild(endingButton);
}

async function startGame(){
    var answerArray = [];
    var boxSet = document.getElementsByClassName('gameBox');

    while(isPassed){
        isLevelEnded = false;
        isDisplayEnded = false;
        answerArray.push(generatedRandomNumber(answerArray));
        console.log(answerArray[level-1]);

        giveSequenceOfLight(answerArray, boxSet);
        await waitForDisplayToFisnish();
        getUserInput(answerArray, boxSet);
        await waitForUserInputToFinish();

        if(isPassed){
            level++;
            var levelNumber = document.getElementById("levelNumber");
            levelNumber.innerHTML = level;
        }
    }
    console.log("Game End!")
    callEndingPage();
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
     }, 400);
}

//switching from var to let solved a error of only blinking the second box.
function giveSequenceOfLight(answerArray, boxSet) {
    console.log("giving sequence of light");

    for(var i = 0; i < level; i++){
        let box = boxSet[answerArray[i]];
        setTimeout(function() {
            blink(box);
        }, 800 * (i+1));
    }
    isDisplayEnded = true;
}

async function getUserInput(answerArray, boxSet) {
    console.log("getting user Input");
    for(var i = 0; i < level; i++) {
        for(var j = 0; j < 9; j++) {
            if(j != answerArray[i]){
                boxSet[j].removeEventListener("click", wrongBox);
                boxSet[j].removeEventListener("click", correctBox);
                boxSet[j].addEventListener("click", wrongBox);
            } else {
                boxSet[j].removeEventListener("click", wrongBox);
                boxSet[j].removeEventListener("click", correctBox);
                boxSet[j].addEventListener("click", correctBox);
            }
        }
        userClicked = false;
        await waitForUserInput();
    }
    isLevelEnded = true;
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
    console.log('Waiting For Next User Input....');
    let boxSet = document.getElementsByClassName('gameBox');
    for(let i = 0; i < 9; i++) {
        boxSet[i].addEventListener("click", function() {
            blink(boxSet[i]);
        });
    }
    return new Promise((resolve) => {
      if (userClicked || !isPassed) {
        resolve(); // Resolve the promise immediately if the condition is already met
      } else {
        // Poll the condition periodically until it is met
        const intervalId = setInterval(() => {
          if (userClicked || !isPassed) {
            clearInterval(intervalId); // Stop polling
            resolve(); // Resolve the promise when the condition is met
          }
        }, 10); // Poll every 00.1 second
      }
    });
}

function waitForUserInputToFinish() {
    console.log('Waiting For User Input to finish....');
    return new Promise((resolve) => {
      if (isLevelEnded) {
        resolve(); // Resolve the promise immediately if the condition is already met
      } else {
        // Poll the condition periodically until it is met
        const intervalId = setInterval(() => {
          if (isLevelEnded) {
            clearInterval(intervalId); // Stop polling
            resolve(); // Resolve the promise when the condition is met
          }
        }, 500); // Poll every 0.5 second
      }
    });
}

function waitForDisplayToFisnish() {
    console.log('Waiting For Giving Sequence Of Light is Finished');
    return new Promise((resolve) => {
      if (isDisplayEnded) {
        resolve(); // Resolve the promise immediately if the condition is already met
      } else {
        // Poll the condition periodically until it is met
        const intervalId = setInterval(() => {
          if (isDisplayEnded) {
            clearInterval(intervalId); // Stop polling
            resolve(); // Resolve the promise when the condition is met
          }
        }, 1000); // Poll every 1 second
      }
    });
}