
import { AnimatedSprite, Application, Assets } from "pixi.js";
import { createFramesFromSpriteSheet } from "../../utils/frameUtils";

export function getLightningAttackAnimation(app: Application, x:number, y:number): AnimatedSprite {
    const lightingSpriteSheetTexture = Assets.get("lighting_attack");

    const lightingFrames = createFramesFromSpriteSheet({ spriteSheetTexture:lightingSpriteSheetTexture, columns: 4, rows: 5, totalFrames: 16 });

    const lightingSprite = new AnimatedSprite(lightingFrames);
    lightingSprite.animationSpeed = 0.5;
    lightingSprite.anchor.set(0.5);
    lightingSprite.play();
    lightingSprite.scale.set(0.2);
    lightingSprite.loop = false;
    lightingSprite.x = x;
    lightingSprite.y = y;

    lightingSprite.onComplete = () => {
        app.stage.removeChild(lightingSprite);
    }

    return lightingSprite;
}
