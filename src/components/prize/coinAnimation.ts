import { Application, Sprite, Texture } from "pixi.js";
import { getIceSparklesAnimation } from "../ice/sparkles";

// Cubic Bezier function for smooth easing
function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
}

// Separate easing functions for x and y to control trajectory
function applyBezierEaseX(progress: number): number {
    return cubicBezier(progress, 0, 0.4, 0.7, 1);
}

function applyBezierEaseY(progress: number): number {
    return cubicBezier(progress, 0, 0.1, 0.9, 1);
}

interface PositionI {
    x: number;
    y: number;
}

interface CoinAnimationI {
    app: Application;
    start?: PositionI;
    end?: PositionI;
    duration?: number;
    type: 'coin' | 'flash';
    callback?: () => void;
    startScale?: number;
    maxScale?: number;
    endScale?: number;
}

export const coinAnimation = ({
    app,
    start = { x: 600, y: 800 },
    end = { x: 1000, y: 200 },
    duration = 500,
    type,
    callback,
    startScale = 0.02,
    maxScale = 0.05,
    endScale = 0.02
}: CoinAnimationI) => {
    const coinSprite = new Sprite(Texture.from(type));
    coinSprite.width = 30;
    coinSprite.height = 30;
    coinSprite.anchor.set(0.5);
    coinSprite.position.set(start.x, start.y);

    app.stage.addChild(coinSprite);

    const startTime = Date.now();
    let animationFrameId: number;

    const animate = () => {
        const elapsed = Date.now() - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);

        // Apply separate easing for x and y to achieve the desired curve
        const easedProgressX = applyBezierEaseX(rawProgress);
        const easedProgressY = applyBezierEaseY(rawProgress);

        // Calculate interpolated position with easing
        coinSprite.x = start.x + (end.x - start.x) * easedProgressX;
        coinSprite.y = start.y + (end.y - start.y) * easedProgressY;

        // Scale: interpolate between startScale, maxScale, and endScale
        const scale = rawProgress < 0.5
            ? startScale + (maxScale - startScale) * (rawProgress * 2)
            : maxScale - (maxScale - endScale) * ((rawProgress - 0.5) * 2);

        coinSprite.scale.set(scale);

        if (rawProgress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            app.stage.removeChild(coinSprite);
            coinSprite.destroy();

            // Add sparkles animation at the end position
            const sparkles = getIceSparklesAnimation();
            sparkles.position.set(end.x, end.y);
            sparkles.zIndex = 3432;
            sparkles.animationSpeed = 1;
            app.stage.addChild(sparkles);
            sparkles.play();
            sparkles.onComplete = () => {
                app.stage.removeChild(sparkles);
                sparkles.destroy();
            };

            if (callback) callback();
        }
    };

    // Start the animation
    animationFrameId = requestAnimationFrame(animate);

    return {
        cancel: () => {
            cancelAnimationFrame(animationFrameId);
            app.stage.removeChild(coinSprite);
            coinSprite.destroy();
        }
    };
};
