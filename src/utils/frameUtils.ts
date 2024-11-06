import { Texture, Rectangle } from "pixi.js";

interface FrameOptions {
    spriteSheetTexture: any;
    columns: number;
    rows: number;
    totalFrames: number;
}

/**
 * Utility function to create frames from a sprite sheet.
 * @param options - Object containing properties for creating frames.
 * @returns Array of textures for each frame.
 */


export function createFramesFromSpriteSheet(options: FrameOptions): Texture[] {
    const { spriteSheetTexture, columns, rows, totalFrames } = options;
    const frames = [];
    const frameWidth = spriteSheetTexture.width / columns;
    const frameHeight = spriteSheetTexture.height / rows;

    for (let i = 0; i < totalFrames; i++) {
        const x = i % columns;
        const y = Math.floor(i / columns);
        const rec = new Rectangle(x * frameWidth, y * frameHeight, frameWidth, frameHeight);
        const frame = new Texture({
            source: spriteSheetTexture,
            frame: rec
        });
        frames.push(frame);
    }

    return frames;
}
