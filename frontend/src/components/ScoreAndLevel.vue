<template>
    <div id="divMain">
        <ion-label>
            <h1>Score: {{ mainStore.score }}</h1>
        </ion-label>
        <ion-label id="level">
            <h1>Level: {{ mainStore.level }}</h1>
        </ion-label>
    </div>
</template>

<script setup>
import { App } from '@capacitor/app';
import { IonLabel } from '@ionic/vue';

import { useMainStore } from '../stores/mainStore';

const mainStore = useMainStore();
</script>

<style scoped>
#divMain {
    display: flex;
}

#level {
    margin-left: auto;
    margin-right: 0;
}
</style>