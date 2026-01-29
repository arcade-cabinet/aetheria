import { makeMutable } from 'react-native-reanimated';

// Production Render Context for High-Performance UI-Thread updates
export const RenderState = {
    playerPos: {
        x: makeMutable(0),
        y: makeMutable(0),
        z: makeMutable(0),
    },
    cameraPos: {
        x: makeMutable(0),
        y: makeMutable(10),
        z: makeMutable(10),
    }
};

export const syncPhysicsToRender = (entity: any) => {
    'worklet';
    if (entity.isPlayer && entity.position) {
        RenderState.playerPos.x.value = entity.position.x;
        RenderState.playerPos.y.value = entity.position.y;
        RenderState.playerPos.z.value = entity.position.z;
        
        // Simple TPS Camera Follow logic
        RenderState.cameraPos.x.value = entity.position.x;
        RenderState.cameraPos.y.value = entity.position.y + 8;
        RenderState.cameraPos.z.value = entity.position.z + 12;
    }
};
