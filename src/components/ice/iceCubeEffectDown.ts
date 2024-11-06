import { AnimatedSprite, Assets } from "pixi.js";
import { createFramesFromSpriteSheet } from "../../utils/frameUtils";

export function iceCubeEffectDownAnimation(): AnimatedSprite {
    const spriteSheetTexture = Assets.get("ice_cube_effect_down");
    const frames = createFramesFromSpriteSheet({
        spriteSheetTexture,
        rows: 6,
        columns: 4,
        totalFrames: 17,
    });

    const iceMelting = new AnimatedSprite(frames);
    iceMelting.width = 150;
    iceMelting.height = 150;
    iceMelting.anchor.set(0.5);
    iceMelting.loop = false;
    iceMelting.animationSpeed = 0.5;
    iceMelting.rotation = -Math.PI / 2;

    return iceMelting;
}
