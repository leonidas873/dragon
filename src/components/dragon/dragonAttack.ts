import { AnimatedSprite, Application, Assets } from "pixi.js";
import { createFramesFromSpriteSheet } from "../../utils/frameUtils";
import { setDragonProperties } from "./helpers";

export function getDragonAttackAnimation(app: Application): AnimatedSprite {
    const spriteSheetTexture = Assets.get("dragon_attack");
    const frames = createFramesFromSpriteSheet({ spriteSheetTexture, columns: 4, rows: 8, totalFrames: 30 });

    const flySprite = new AnimatedSprite(frames);
    flySprite.loop = false;
    setDragonProperties(app, flySprite)
    
    return flySprite;
}
    