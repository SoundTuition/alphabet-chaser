<template>
    <div id="divControls">
        <ion-button @mousedown="left" @mouseup="stopMoving" @touchstart="left" @touchend="stopMoving">Left</ion-button>
        <ion-button @mousedown="right" @mouseup="stopMoving" @touchstart="right" @touchend="stopMoving">Right</ion-button>
        <ion-button @mousedown="up" @mouseup="stopMoving" @touchstart="up" @touchend="stopMoving">Up</ion-button>
        <ion-button @mousedown="down" @mouseup="stopMoving" @touchstart="down" @touchend="stopMoving">Down</ion-button>
    </div>
</template>

<script setup>

import { IonButton } from '@ionic/vue';
import { useMovement } from '@/composables/useMovement';
import { onMounted, onUnmounted, ref } from 'vue';

const { left, right, up, down, stopMoving, movement } = useMovement();

function handleKeyDown(event) {
    console.log("Key pressed:", event.key);
    switch (event.key) {
        case 'ArrowLeft':
        case 'a':
            left();
            break;
        case 'ArrowRight':
        case 'd':
            right();
            break;
        case 'ArrowUp':
        case 'w':
            up();
            break;
        case 'ArrowDown':
        case 's':
            down();
            break;
    }
}

function handleKeyUp(event) {
    stopMoving();
}

onMounted(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
});

</script>

<style scoped>
#divControls {
    display: flex;
    justify-content: space-between;
}
</style>