
// Notes
// if left and up direction, the limit is 0
// if right and down direction, the limit is 3


console.log("hello world");

//miscellaneous functions
function getRandomNumber(min, max) {
    // Ensure that min and max are valid numbers
    if (typeof min !== 'number' || typeof max !== 'number' || isNaN(min) || isNaN(max)) {
        throw new Error('Both min and max must be valid numbers.');
    }

    // Calculate the random number within the range
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}

//movement action enum
const Direction = {
    Left: 1,
    Right: 2,
    Up: 3,
    Down: 4,
    None: 0,
};

let currentDirection = Direction.None;

// getting the action buttons as variables
const resetButton = document.getElementById("reset-button");

const leftMoveButton = document.getElementById("left-button");
const righMoveButton = document.getElementById("right-button");
const upMoveButton = document.getElementById("up-button");
const downMoveButton = document.getElementById("down-button");


// getting the table cell elements to store in an array;
let table2DArray = [];
let table2DElement = document.getElementById("game-table");

for (var i = 0; i < table2DElement.rows.length; i++) {
    var row = table2DElement.rows[i];
    table2DArray[i] = [];

    for (var j = 0; j < row.cells.length; j++) {
        var cell = row.cells[j];
        table2DArray[i][j] = cell;
    }
}


// initializing the data
function Block(position, value) {
    this.position = position; //array
    this.value = value;
}

let tableData = [];


//creating the first block;
let firstBlock = new Block([getRandomNumber(0, 3), getRandomNumber(0, 3)], 2);

tableData.push(firstBlock);

//displaying the tabledata;
updateDisplay();

//main functions 
function spawnBlock() {
    let position = [getRandomNumber(0, 3), getRandomNumber(0, 3)];
    while (!checkCellEmpty(position)) {
        if (tableData.length == 16) {
            return;
        }
        position = [getRandomNumber(0, 3), getRandomNumber(0, 3)];
    }
    let newBlock = new Block(position, getRandomNumber(1, 2) * 2);
    tableData.push(newBlock);
}

function updateDisplay() {
    for (let i = 0; i < table2DArray.length; i++) {
        for (let j = 0; j < table2DArray[i].length; j++) {
            let cellElement = table2DArray[i][j];
            cellElement.innerHTML = "";
        }
    }
    for (let i = 0; i < tableData.length; i++) {
        let block = tableData[i];
        let blockPosition = block.position;
        let blockValue = block.value;

        let cellElement = table2DArray[blockPosition[0]][blockPosition[1]]
        cellElement.innerHTML = blockValue
    }
}

function resetTable() {
    tableData = [];
    for (let i = 0; i < table2DArray.length; i++) {
        for (let j = 0; j < table2DArray[i].length; j++) {
            let cellElement = table2DArray[i][j];
            cellElement.innerHTML = "";
        }
    }
    let firstBlock = new Block([getRandomNumber(0, 3), getRandomNumber(0, 3)], 2);

    tableData.push(firstBlock);
}

function checkCellEmpty(position) {
    let x = position[0];
    let y = position[1];
    if (x < 0 || x > 3) { return false; }
    if (y < 0 || y > 3) { return false; }
    for (let i = 0; i < tableData.length; i++) {
        let block = tableData[i];
        if (arraysAreEqual(position, block.position)) {
            return false;
        }
    }
    return true;
}

function checkCellHasBlock(position) {
    let x = position[0];
    let y = position[1];
    if (x < 0 || x > 3) { return [false, null]; }
    if (y < 0 || y > 3) { return [false, null]; }
    for (let i = 0; i < tableData.length; i++) {
        let block = tableData[i];
        if (arraysAreEqual(position, block.position)) {
            return [true, block];
        }
    }
    return [false, null];
}


function checkMoveValid(block) {
    let position = block.position;
    let whatToCheck = currentDirection == Direction.Left || currentDirection == Direction.Up ? 0 : 1;
    let x = position[currentDirection == Direction.Left || currentDirection == Direction.Right ? 1 : 0];
    let newPosition = [...position];
    switch (currentDirection) {
        case Direction.Left:
            newPosition[1] = position[1] - 1;
            break;
        case Direction.Right:
            newPosition[1] = position[1] + 1;
            break;
        case Direction.Up:
            newPosition[0] = position[0] - 1;
            break;
        case Direction.Down:
            newPosition[0] = position[0] + 1;
            break;
        default:
            break;
    }
    if (!checkCellEmpty(newPosition)) {
        let potentialBlock = checkCellHasBlock(newPosition);
        if(potentialBlock[0] == true){
            let nextBlock = potentialBlock[1];
            if(block.value == nextBlock.value){
                block.value = block.value + nextBlock.value;
                nextBlock.value = 0;
                let indexOfNextBlock = tableData.indexOf(nextBlock);
                if(indexOfNextBlock != -1){
                    tableData.splice(indexOfNextBlock, 1);
                }
                return true;
            }
        }
        return false;
    }
    if (whatToCheck == 0) {
        return x == 0 ? false : true;
    } else {
        return x == 3 ? false : true;
    }
}

function moveBlocks() {
    for (let i = 0; i < tableData.length; i++) {
        let block = tableData[i];

        while (checkMoveValid(block)) {
            switch (currentDirection) {
                case Direction.Left:
                    block.position[1] = block.position[1] - 1;
                    break;
                case Direction.Right:
                    block.position[1] = block.position[1] + 1;
                    break;
                case Direction.Up:
                    block.position[0] = block.position[0] - 1;
                    break;
                case Direction.Down:
                    block.position[0] = block.position[0] + 1;
                    break;
                default:
                    break;
            }
        }


    }
    for (let i = tableData.length; i > 0; i--) {
        let block = tableData[i - 1];

        while (checkMoveValid(block)) {
            switch (currentDirection) {
                case Direction.Left:
                    block.position[1] = block.position[1] - 1;
                    break;
                case Direction.Right:
                    block.position[1] = block.position[1] + 1;
                    break;
                case Direction.Up:
                    block.position[0] = block.position[0] - 1;
                    break;
                case Direction.Down:
                    block.position[0] = block.position[0] + 1;
                    break;
                default:
                    break;
            }
        }


    }
    console.log(tableData)

}




// action listeners
resetButton.onclick = () => {
    console.log("Game was reset");
    resetTable();
    updateDisplay();
}


leftMoveButton.onclick = () => {
    currentDirection = Direction.Left;
    moveBlocks();
    spawnBlock();
    updateDisplay();
}

righMoveButton.onclick = () => {
    currentDirection = Direction.Right;
    moveBlocks();
    spawnBlock();
    updateDisplay();
}

upMoveButton.onclick = () => {
    currentDirection = Direction.Up;
    moveBlocks();
    spawnBlock();
    updateDisplay();
}

downMoveButton.onclick = () => {
    currentDirection = Direction.Down;
    moveBlocks();
    spawnBlock();
    updateDisplay();
}


document.addEventListener('keydown', function(event) {
    // Check if the pressed key is an arrow key
    if (event.key === "ArrowUp") {
        currentDirection = Direction.Up;
        moveBlocks();
        spawnBlock();
        updateDisplay();
    } else if (event.key === "ArrowDown") {
        currentDirection = Direction.Down;
        moveBlocks();
        spawnBlock();
        updateDisplay();
    } else if (event.key === "ArrowLeft") {
        currentDirection = Direction.Left;
        moveBlocks();
        spawnBlock();
        updateDisplay();
    } else if (event.key === "ArrowRight") {
        currentDirection = Direction.Right;
        moveBlocks();
        spawnBlock();
        updateDisplay();
    }
});

