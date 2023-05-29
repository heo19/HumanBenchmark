function startLevel() {
    //console.log("startLevel() isCalled");

    localStorage.setItem("level", 1);
    window.location.href = "numberLoading.html";
}

function checkCorrection(){
    //console.log("checkCorrection() isCalled");
    
    var generatedValue = localStorage.getItem("generatedValue");
    var currentInput = document.getElementById("userInput").value;
    currentInput = Number(currentInput);
    localStorage.setItem("userInput", currentInput);

    /* debugging ouput
    console.log("currentInput: " + currentInput);
    console.log("generatedValue: " + generatedValue);
    */

    if(currentInput == generatedValue){
        var currentLevel = localStorage.getItem("level");
        currentLevel = Number(currentLevel);
        localStorage.setItem("level", currentLevel + 1);
        window.location.href = "numberEnding.html";

        /* debugging ouput
        console.log(typeof currentLevel);
        console.log("Passed!");
        console.log("Level: " + localStorage.getItem("level"));
        console.log("currentInput: " + currentInput);
        console.log("generatedValue: " + generatedValue);
        */
    } else {
        localStorage.setItem("isCorrect", false);
        window.location.href = "numberWrong.html";

        /* debugging ouput
        console.log("Failed!");
        console.log("Level: " + localStorage.getItem("level"));
        console.log("currentInput: " + currentInput);
        console.log("generatedValue: " + generatedValue);
        */
    }
}