import React, { useMemo, useEffect } from 'react';
import { Model } from 'react-native-filament';
import { AssetMap } from './AssetMap';
import { world } from '../ecs/World';
import { useSharedValue, useFrameCallback } from 'react-native-reanimated';

const DynamicModel = ({ entity }: { entity: any }) => {
    // SharedValues for Transform
    const posX = useSharedValue(entity.position.x);
    const posY = useSharedValue(entity.position.y);
    const posZ = useSharedValue(entity.position.z);
    
    // Sync Loop
    useFrameCallback(() => {
        // This runs on UI thread. We need to read entity position (JS thread) -> SharedValue?
        // Reanimated `useFrameCallback` is UI thread.
        // We can't read `entity.position` (JS object) directly safely if logic runs on JS thread.
        // BUT we can use a standard JS loop to update shared values.
    });

    // JS Loop to push data to UI thread
    useEffect(() => {
        const interval = setInterval(() => {
            posX.value = entity.position.x;
            posY.value = entity.position.y;
            posZ.value = entity.position.z;
        }, 16); // 60 FPS
        return () => clearInterval(interval);
    }, [entity]);

    // Construct Transform Matrix from position? 
    // Filament <Model> might take `translate` prop if wrapped?
    // Native Filament Model usually takes `transform` matrix [16].
    
    // For MVP, just loading the model at initial position is progress.
    // I will skip animation logic for this step and just render STATIC world to verify assets.
    
    if (!entity.assetId || !AssetMap[entity.assetId]) return null;

    // Static render for now
    return (
        <Model 
            source={AssetMap[entity.assetId]} 
            transform={[
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                entity.position.x, entity.position.y, entity.position.z, 1
            ]}
        />
    );
};

export const WorldRenderer = () => {
    // Render everything statically for visual confirmation
    const entities = world.with("assetId", "position");
    // We need to force update when world changes.
    // Hack: useLayoutGenerator to populate world first.
    
    const entityList = useMemo(() => {
        const list: any[] = [];
        for (const e of entities) {
            list.push(e);
        }
        return list;
    }, [entities.size]); // Re-eval if size changes? Miniplex doesn't expose size observable easily.

    return (
        <>
            {entityList.map((e, i) => (
                <DynamicModel key={i} entity={e} />
            ))}
        </>
    );
};