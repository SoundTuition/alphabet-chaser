import { difference, shuffled, takeRandom } from '@/utils/array';
import { defineStore } from 'pinia';

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
const DEFAULT_WORDS = ["hi", "bye"];

function createWordRelatedState(words = DEFAULT_WORDS) {
    if (!words.length) {
        throw new Error("expected words");
    }
    const randomWord = takeRandom(shuffled(words));
    const correctLetters = randomWord.split("");
    const wrongLetters = shuffled(difference(ALPHABET, correctLetters));
    
    return {
        currentWordToLearn: randomWord,
        mainListOfWords: [...words],
        wrongLetters,
    };
}

export const useMainStore = defineStore('mainStore', {
    state: () => ({

        // Directions and movement
        currentDirection: null,
        direction: {
            left: 0,
            right: 1,
            up: 2,
            down: 3,
        },
        isMoving: true,
        showLogin: false,
        showSettings: false,
        speed: 1,
        score: 0,
        level: 1,
        wordRelated: createWordRelatedState()  
    }),
    actions: {
        resetWord() {
            this.wordRelated = createWordRelatedState(this.wordRelated.mainListOfWords);
        }
    }
})





