import { AnimatedSprite, Assets } from "pixi.js";
import { createFramesFromSpriteSheet } from "../../utils/frameUtils";

export function getIceMeltingAnimation(): AnimatedSprite {
    const spriteSheetTexture = Assets.get("ice_melting");
    const frames = createFramesFromSpriteSheet({
        spriteSheetTexture,
        rows: 8,
        columns: 4,
        totalFrames: 32,
    });

    const iceMelting = new AnimatedSprite(frames);
    iceMelting.width = 160;
    iceMelting.height = 80;
    iceMelting.anchor.set(0.5);
    iceMelting.loop = false;
    iceMelting.animationSpeed = 0.5;

    return iceMelting;
}
