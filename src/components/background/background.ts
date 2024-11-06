import { Application, Sprite, Texture, Ticker, TilingSprite } from "pixi.js";

export class Background {
    private app: Application;
    private iceMountainLayer: TilingSprite | null = null;

    constructor(app: Application) {
        this.app = app;

        // Add the static background and the moving ice mountain
        this.addStaticBackground();
        this.addIceMountainLayer();

        // Update the position of the ice mountain layer
        this.app.ticker.add(this.update.bind(this));
    }

    private addStaticBackground() {
        const background = new Sprite(Texture.from("background"));
        background.width = this.app.screen.width;
        background.height = this.app.screen.height;
        this.app.stage.addChild(background);
    }

    private addIceMountainLayer() {
        const iceMountainTexture = Texture.from("background_ice");
        
        // Create the TilingSprite with the texture and full screen width
        this.iceMountainLayer = new TilingSprite(
            {
                texture:iceMountainTexture,
                width: this.app.screen.width,
                height:iceMountainTexture.height * 4 / 5 -100
            }
        );

        // Position the ice mountain layer at the bottom of the screen
        this.iceMountainLayer.position.set(0, this.app.screen.height - iceMountainTexture.height * 4 / 5 + 100);

        // Add the ice mountain layer to the stage
        this.app.stage.addChild(this.iceMountainLayer);
    }

    private update(ticker: Ticker) {
        if (this.iceMountainLayer) {
            // Move the ice mountain layer to the left at a constant speed
            this.iceMountainLayer.tilePosition.x -= ticker.deltaTime * 1.1;
        }
    }
}
