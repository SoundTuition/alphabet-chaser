<template>
    <div id="controlsMainDiv">
        <ion-button @mousedown="left" @mouseup="stopMoving" @touchstart="left" @touchend="stopMoving">Left</ion-button>
        <ion-button @mousedown="right" @mouseup="stopMoving" @touchstart="right" @touchend="stopMoving">Right</ion-button>
        <ion-button @mousedown="up" @mouseup="stopMoving" @touchstart="up" @touchend="stopMoving">Up</ion-button>
        <ion-button @mousedown="down" @mouseup="stopMoving" @touchstart="down" @touchend="stopMoving">Down</ion-button>
    </div>
</template>

<script setup>

import { IonButton } from '@ionic/vue';
import { useMovement } from '@/composables/useMovement';

const { left, right, up, down, stopMoving, movement } = useMovement();

</script>

<style scoped>
#controlsMainDiv {
    display: flex;
    justify-content: space-between;
}
</style>