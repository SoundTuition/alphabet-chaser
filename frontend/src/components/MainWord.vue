<template>
    <div id="mainWordMainDiv">
        <ion-label>
            <h1>{{ mainStore.wordRelated.currentWordToLearn }}</h1>
        </ion-label>
    </div>
</template>

<script setup>
import { IonLabel } from '@ionic/vue';
import { ref, onMounted } from 'vue';

import { useMainStore } from '@/stores/mainStore';

const mainStore = useMainStore();

// TODO implement the logic for calculating the correct and wrong letter.
// does this already exist on the main convas and need moving into
// this component?
// 
// function calculateLetters(event) {
//     wordRelated.currentWordToLearn = event.detail.value === '' ? 'hi' : event.detail.value;
    
//     let alphabet = "abcdefghijklmnopqrstuvwxyz";
//     let tempAlphabet = "";
//     wordRelated.correctLetters = wordRelated.currentWordToLearn.split('').join('');

//     for (let i = 0; i < wordRelated.correctLetters.length; i++) {
//         tempAlphabet = alphabet.replace(wordRelated.correctLetters[i], '');
//         alphabet = tempAlphabet;
//     }

//     wordRelated.wrongLetters = alphabet.split('').join('');

//     wordRelated.mainListOfWords.push(wordRelated.currentWordToLearn);
// }

</script>

<style scoped>
#mainWordMainDiv {
    display: grid;
}
</style>