import React, { useMemo } from 'react';
import { Model } from 'react-native-filament';
import { AssetMap } from './AssetMap';
import { world } from '../ecs/World';
import { RenderState } from './RenderContext';
import { useDerivedValue } from 'react-native-reanimated';

// Component for moving entities (Player)
const PlayerModel = ({ entity }: { entity: any }) => {
    // Smooth Interpolated Transform Matrix for Player
    const transform = useDerivedValue(() => {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            RenderState.playerPos.x.value, RenderState.playerPos.y.value, RenderState.playerPos.z.value, 1
        ] as number[];
    });

    if (!entity.assetId || !AssetMap[entity.assetId]) return null;

    return (
        <Model 
            source={AssetMap[entity.assetId]} 
            transform={transform}
        />
    );
};

// Component for static entities (World)
    if (!entity.assetId || !AssetMap[entity.assetId]) return null;

    return (
        <>
            <Model 
                source={AssetMap[entity.assetId]} 
                transform={transform}
            />
            {entity.indicatorType === "QUEST_TARGET" && (
                <Model
                    source={AssetMap["CandleStick"]} // Placeholder marker
                    transform={[
                        0.5, 0, 0, 0,
                        0, 0.5, 0, 0,
                        0, 0, 0.5, 0,
                        entity.position.x, entity.position.y + 2.5, entity.position.z, 1
                    ]}
                />
            )}
        </>
    );
};

export const WorldRenderer = () => {
    const entities = world.entities;
    
    // Split into static and dynamic to optimize rendering
    // In a real production game, we would use Chunks/Visibility culling
    return (
        <>
            {entities.map((e, i) => {
                if (e.isPlayer) {
                    return <PlayerModel key={i} entity={e} />;
                }
                return <StaticModel key={i} entity={e} />;
            })}
        </>
    );
};
