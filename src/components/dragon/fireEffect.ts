import { AnimatedSprite, Assets } from "pixi.js";
import { createFramesFromSpriteSheet } from "../../utils/frameUtils";

export function getFireAnimation(): AnimatedSprite {
    const spriteSheetTexture = Assets.get("fire");
    const frames = createFramesFromSpriteSheet({spriteSheetTexture, rows:12, columns:4, totalFrames: 48});

    const fireSprite = new AnimatedSprite(frames);
    fireSprite.animationSpeed = 2;
    fireSprite.loop = false;
    fireSprite.anchor.set(0.5);
    fireSprite.scale.set(0.2);
    fireSprite.label = "Fire Animation";
    return fireSprite;
}
