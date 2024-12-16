import { useMainStore } from '@/stores/mainStore';

export function useMovement() {
    const mainStore = useMainStore();

    function left() {
        mainStore.isMoving = true;
        mainStore.currentDirection = mainStore.direction.left;
    }

    function right() {
        mainStore.isMoving = true;
        mainStore.currentDirection = mainStore.direction.right;
    }

    function up() {
        mainStore.isMoving = true;
        mainStore.currentDirection = mainStore.direction.up;
    }

    function down() {
        mainStore.isMoving = true;
        mainStore.currentDirection = mainStore.direction.down;
    }

    function stopMoving() {
        mainStore.isMoving = false;
    }

    function movement(spriteCoords, speed, tileSize, rows, cols) {
        if (mainStore.isMoving) {
            if (mainStore.currentDirection === mainStore.direction.up && spriteCoords.y > 0) {
                spriteCoords.y -= speed;
            } else if (mainStore.currentDirection === mainStore.direction.down && spriteCoords.y < tileSize * (rows - 1)) {
                spriteCoords.y += speed;
            } else if (mainStore.currentDirection === mainStore.direction.left && spriteCoords.x > 0) {
                spriteCoords.x -= speed;
            } else if (mainStore.currentDirection === mainStore.direction.right && spriteCoords.x < tileSize * (cols - 1)) {
                spriteCoords.x += speed;
            }
        }
    }

    return { left, right, up, down, stopMoving, movement };
}
