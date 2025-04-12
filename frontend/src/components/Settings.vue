<template>
    <div id="SettingsMainDiv">
        <div id="divTopSettings">
            <ion-item
                class="ion-text-center custom-background"
                v-for="(word, index) in wordRelated.mainListOfWords"
                :key="index"
            >
                <ion-label>{{ word }}</ion-label>
            </ion-item>
        </div>
        <div id="divMiddleSettings">
            <ion-input
                class="custom-margin-top"
                @keydown.enter="saveWord"
                @focusout="saveWord"
                type="text"
                :clear-input="true"
                label="Enter your own word(s)"
                label-placement="floating"
                fill="outline"
            ></ion-input>
        </div>
    </div>
</template>

<script setup>
import { IonButton, IonIcon, IonInput, IonItem, IonLabel, useBackButton, useIonRouter } from '@ionic/vue';
import { ref, reactive, onMounted, } from 'vue';
import { useMainStore } from '@/stores/mainStore';

const emit = defineEmits(['backButton']);

// Back button to exit the app.
const ionRouter = useIonRouter();
useBackButton(-1, () => {
    emit('backButton');
});

const mainStore = useMainStore();
const wordRelated = mainStore.wordRelated

function saveWord(event){
    if(event.target.value.trim().length === 0) return;
    wordRelated.mainListOfWords.push(event.target.value) // TODO does this need sanatising?
    event.target.value = ''; // Clear input field
}

</script>

<style scoped>


#SettingsMainDiv {
    display: grid;
}

#divTopSettings {
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    height: 10%;
    width: 35%;
    /* border: 2px solid green; */
}

#divMiddleSettings {
    margin-left: auto;
    margin-right: auto;
    height: 10%;
    width: 85%;
    /* border: 2px solid green; */
}

.custom-margin-top {
    margin-top: 20px;
}

.custom-background {
    --background: transparent;
}
</style>
