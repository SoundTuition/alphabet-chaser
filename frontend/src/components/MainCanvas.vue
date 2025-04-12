<template>
    <div id="MainCanvasMainDiv">
        <div id="divCanvas">
            <canvas id="mainCanvas"></canvas>
        </div>
    </div>
</template>

<script setup>
import { App } from '@capacitor/app';
import { IonButton, IonInput, IonRange, useBackButton, useIonRouter } from '@ionic/vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';

import { useMovement } from '@/composables/useMovement';
const { left, right, up, down, stopMoving, movement } = useMovement();

import { useMainStore } from '@/stores/mainStore';

// Back button to exit the app.
const ionRouter = useIonRouter();
useBackButton(-1, () => {
    if (!ionRouter.canGoBack()) {
        App.exitApp();
    }
});

//TODO 
// refactor loops using cleaner loops foreach for in for of etc
// refactor using spread ... for array assignments. 


// Store
const mainStore = useMainStore();


// Canvas
const mainCanvas = ref(null);
const canvasContext = ref(null)
//let bgImage = ref(null);
// Indexes
let globalIndex = 0;
// Letters
let colorCorrectLetters = 'blue';
let colorWrongLetters = 'orange';
// Board size
const tileSize = 40;
const rows = 13;
const cols = 9;
const fontSize = {
    large: tileSize + 10,
    medium: tileSize,
    small: tileSize - 10,
}

// Game State
let gameOver = false;
// Coordinates
let spriteCoords = {
    x: 0,
    y: tileSize,
    get row() { return Math.floor((this.x + (tileSize / 2)) / tileSize) },
    get col() { return Math.floor((this.y + (tileSize / 2)) / tileSize) }
};
let correctLetterCoords = {
    x: 100,
    y: 100,
    get row() { return Math.floor((this.x + (tileSize / 2)) / tileSize) },
    get col() { return Math.floor((this.y + (tileSize / 2)) / tileSize) }
};
// WrongLettersPositions structure.
// { x: null, y: null, get row() { return this.x / tileSize }, get col() { return this.y / tileSize } },
let wrongLettersPositions = [];
let amountOfWrongLetters = 10;

const props = defineProps(['spriteSpeed']);

let animationFrameRequestId = null;

onMounted(() => {
    console.log('spriteSpeed')
    console.log(props.spriteSpeed)
    mainCanvas.value = document.getElementById('mainCanvas');
    mainCanvas.value.width = cols * tileSize;
    mainCanvas.value.height = rows * tileSize;
    canvasContext.value = mainCanvas.value.getContext('2d');

    wrongLetterGenerator();
    correctLetterGenerator();

    animationLoop();
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrameRequestId);
});

function animationLoop() {
    movement(spriteCoords, mainStore.speed, tileSize, rows, cols)

    drawBackground();
    //drawWord();
    drawSprite();

    collisonWithCorrectLetter()
    collisonWithWrongLetter()

    drawWrongLetter();
    drawCorrectLetter();

    animationFrameRequestId = requestAnimationFrame(animationLoop);
}



function collisonWithCorrectLetter() {
    // Detect sprite hits the correct letter.
    // const collisionDistance = 0;
    if ((spriteCoords.row === correctLetterCoords.row) && (spriteCoords.col === correctLetterCoords.col)) {
        stopMoving();
        mainStore.score++;
        globalIndex++;

        if (globalIndex === mainStore.wordRelated.currentWordToLearn.length) {
            mainStore.level++;
            globalIndex = 0;
            mainStore.resetWord();
        }

        wrongLetterGenerator();
        correctLetterGenerator();
    }
}

function collisonWithWrongLetter() {
    // The inner if of the some() is so that an index can be passed to the removeWrongLetter() function.
    if (wrongLettersPositions.some((wrongLetter, index) => {
        if (wrongLetter.row === spriteCoords.row && wrongLetter.col === spriteCoords.col) {
            removeWrongLetter(index);
            return true;
        }
        return false;
    })) {
        stopMoving();
        bounceOffWrongLetter();
        mainStore.score--;
        //TODO check this works...
        levelDown();
    }
}

function removeWrongLetter(index) {
    let WrongLettersPositionsSpliced = wrongLettersPositions.splice(index, 1)
}



function bounceOffWrongLetter() {
    switch (mainStore.currentDirection) {
        case mainStore.direction.left:
            spriteCoords.x += tileSize / 2;
            break;
        case mainStore.direction.right:
            spriteCoords.x -= tileSize / 2;
            break;
        case mainStore.direction.up:
            spriteCoords.y += tileSize / 2;
            break;
        case mainStore.direction.down:
            spriteCoords.y -= tileSize / 2;
            break;
    }
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function correctLetterGenerator() {
    // Note this always needs calling after the wrong letter have been generated.
    // Otherwise the comparison is pointless.
    const startingCol = 0;
    //Rows starts at 2 to give space at the top of the canvas for the main word.
    const startingRow = 2;
    let tempX = (randomInteger(startingCol, (cols - 1)) * tileSize);
    let tempY = (randomInteger(startingRow, (rows - 2)) * tileSize);

    // TODO refactor the two while loops into one with better logic.
    // should I use the col and row getters instead of the pixel positions?
    while (wrongLettersPositions.some(element => element.x === tempX && element.y === tempY)) {
        tempX = (randomInteger(startingCol, (cols - 1)) * tileSize);
        tempY = (randomInteger(startingRow, (rows - 2)) * tileSize);
    }

    while (spriteCoords.x === tempX && spriteCoords.y === tempY) {
        tempX = (randomInteger(0, (cols - 1)) * tileSize);
        tempY = (randomInteger(2, (rows - 2)) * tileSize);
    }

    correctLetterCoords.x = tempX;
    correctLetterCoords.y = tempY;
}

function wrongLetterGenerator() {
    const uniqueCoordinates = [];
    const coordinateSet = new Set();

    // can I do something like this to prevent a wrong letter appearing ontop of the sprite?
    // const coordinateString = JSON.stringify(spriteCoords);
    // coordinateSet.add(coordinateString);

    let tempX = 0;
    let tempY = 0;

    const startingRow = 2;
    const endingingRow = rows - 2;
    const startingCol = 0;
    const endingCol = cols - 1;

    while (uniqueCoordinates.length <= amountOfWrongLetters) {
        tempX = (randomInteger(startingCol, endingCol) * tileSize);
        tempY = (randomInteger(startingRow, endingingRow) * tileSize);

        const coordinate = { x: tempX, y: tempY, get row() { return this.x / tileSize }, get col() { return this.y / tileSize } }; // Create a coordinate object

        const coordinateString = JSON.stringify(coordinate); // Convert to a string for Set comparison

        if (!coordinateSet.has(coordinateString)) {
            // If it's not already in the set, add it to the array and the set
            uniqueCoordinates.push(coordinate);
            coordinateSet.add(coordinateString);
        }
    }
    wrongLettersPositions = uniqueCoordinates;
}


//     for (const coord of wrongLettersPositions) {
//         // Generate random rows and cols
//         tempRow = randomInteger(2, (rows - 2));
//         tempCol = randomInteger(0, (cols - 1));
//         console.log(tempRow, tempCol)
//         while (
//             // Check each tempRow and Twmp Col against each other, the sprite, and the correct letters.
//             (tempCol === coord.col && tempRow === coord.row)
//             && (tempCol === correctLetterCoords.col && tempRow === correctLetterCoords.row)
//             && (tempCol === spriteCoords.col && tempRow === spriteCoords.row)
//         ) {
//             tempRow = randomInteger(2, (rows - 2));
//             tempCol = randomInteger(0, (cols - 1));
//         }
//         if (i < 10) {
//             wrongLettersPositions[i].x = tempX * tileSize;
//             wrongLettersPositions[i].y = tempY * tileSize;
//             i++;
//             console.log(wrongLettersPositions.x, wrongLettersPositions.y)
//         }
//     }
// }



//Drawing functions
function drawBackground() {
    canvasContext.value.fillStyle = 'green';
    canvasContext.value.fillRect(0, 0, cols * tileSize, rows * tileSize);
    // for (let i = 0; i < rows; i++){
    //     canvasContext.value.strokeRect(0, tileSize * i, tileSize, tileSize);

    // }
    //canvasContext.value.drawImage(bgImage.value, 0, 0, 300, 500);
}
function drawSprite() {
    canvasContext.value.fillStyle = 'red';
    canvasContext.value.fillRect(spriteCoords.x, spriteCoords.y, tileSize, tileSize);
    canvasContext.value.fillStyle = 'blue';
    canvasContext.value.fillRect(spriteCoords.x + (tileSize / 2) - 5, spriteCoords.y + (tileSize / 2) - 5, 10, 10);
}
function drawCorrectLetter() {
    const alignment = 8;
    const radii = 5;
    canvasContext.value.fillStyle = colorCorrectLetters;
    canvasContext.value.strokeStyle = colorCorrectLetters;
    canvasContext.value.font = `bold ${fontSize.small}px Arial`;
    canvasContext.value.textBaseline = "top";
    canvasContext.value.fillText(mainStore.wordRelated.currentWordToLearn[globalIndex], correctLetterCoords.x + alignment, correctLetterCoords.y);
    canvasContext.value.beginPath();
    canvasContext.value.roundRect(correctLetterCoords.x, correctLetterCoords.y, tileSize - 4, tileSize - 4, radii);
    canvasContext.value.stroke();
}
function drawWrongLetter() {
    const alignment = 10;
    const radii = 5;
    canvasContext.value.fillStyle = colorWrongLetters;
    canvasContext.value.strokeStyle = colorWrongLetters;
    canvasContext.value.font = `bold ${fontSize.small}px monospace`
    canvasContext.value.textBaseline = "top";
    wrongLettersPositions.forEach((wrongLetterPosition, index) => {
        canvasContext.value.fillText(mainStore.wordRelated.wrongLetters[index], wrongLetterPosition.x + alignment, wrongLetterPosition.y);
        canvasContext.value.beginPath();
        canvasContext.value.roundRect(wrongLetterPosition.x, wrongLetterPosition.y, tileSize - 4, tileSize - 4, radii);
        canvasContext.value.stroke();
    })
}

function levelDown() {
    if (mainStore.score < 3) {
        mainStore.level = 1;
        globalIndex = 0;
        mainStore.resetWord();
    }
}

</script>

<style scoped>
#MainCanvasMainDiv {
    display: grid;
}

#divTop {
    margin-left: auto;
    margin-right: auto;
    height: 10%;
    width: 80%;
    /* border: 2px solid green; */
}

ion-range {
    padding: 0px;
}

#mainCanvas {
    border: 2px solid gray;
}
</style>