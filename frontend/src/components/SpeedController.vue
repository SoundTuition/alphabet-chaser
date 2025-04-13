<template>
    <div id="speedControllerMainDiv">
        <ion-range @ionChange="ChangeSpeed($event)" :pin="true" :ticks="true" :snaps="true" :min="1" :max="8"
            label="Speed! "></ion-range>
    </div>
</template>

<script setup>
import { IonRange } from '@ionic/vue';
import { useMainStore } from '@/stores/mainStore';

const mainStore = useMainStore();

function ChangeSpeed($event){
    mainStore.speed = $event.detail.value;
}

</script>

<style>
#speedControllerMainDiv {
    display: grid;
}

ion-range {
    padding: 0px;
}

</style>