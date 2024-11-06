import { Application, Sprite, Texture } from "pixi.js";
import { getIceSparklesAnimation } from "../ice/sparkles";

interface Position {
    x: number;
    y: number;
}

interface CashOutAnimationOptions {
    app: Application;
    start: Position;
    end: Position;
    type?: "coin" | "flash";
    callback?: () => void;
}

export const cashOutAnimation = ({
    app,
    start,
    end,
    type = "coin",
    callback,
}: CashOutAnimationOptions) => {
    const duration = 500;
    const totalCoins = 15;

    const animateSprite = (sprite: Sprite) => {
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            sprite.x = start.x + (end.x - start.x) * progress;
            sprite.y = start.y + (end.y - start.y) * progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                app.stage.removeChild(sprite);
                sprite.destroy();

                const sparkles = getIceSparklesAnimation();
                sparkles.position.set(end.x, end.y);
                app.stage.addChild(sparkles);
                sparkles.play();
                sparkles.onComplete = () => {
                    app.stage.removeChild(sparkles);
                    sparkles.destroy();
                };

                if (--remainingCoins === 0 && callback) callback();
            }
        };

        animate();
    };

    let remainingCoins = totalCoins;
    for (let i = 0; i < totalCoins; i++) {
        const sprite = new Sprite(Texture.from(type === "coin" ? "coin" : "flash"));
        sprite.width = 25;
        sprite.height = 25;
        sprite.anchor.set(0.5);
        sprite.position.set(start.x, start.y);
        app.stage.addChild(sprite);

        const delay = Math.random() * 200;
        setTimeout(() => animateSprite(sprite), delay);
    }
};
