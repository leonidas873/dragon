import { AnimatedSprite, Assets } from "pixi.js";
import { createFramesFromSpriteSheet } from "../../utils/frameUtils";

export function getIceSparklesAnimation(): AnimatedSprite {
    const spriteSheetTexture = Assets.get("sparkles");
    const frames = createFramesFromSpriteSheet({
        spriteSheetTexture,
        rows: 6,
        columns: 4,
        totalFrames: 19,
    });

    const iceMelting = new AnimatedSprite(frames);
    iceMelting.width = 100;
    iceMelting.height = 100;
    iceMelting.anchor.set(0.5);
    iceMelting.loop = false;
    iceMelting.animationSpeed = 0.5;

    return iceMelting;
}
