import { Application, Texture, Ticker, TilingSprite } from "pixi.js";

export class Way {
    private app: Application;
    private wayLayer: TilingSprite | null = null;

    constructor(app: Application) {
        this.app = app;
        this.addWayLayer();

        this.app.ticker.add(this.update.bind(this));
    }

    private addWayLayer() {
        const wayTexture = Texture.from("way");

        this.wayLayer = new TilingSprite({
            texture:wayTexture,
            width: this.app.screen.width,
            height: wayTexture.height / 2 - 10
            });
        this,this.wayLayer.anchor = 0;
        this.wayLayer.position.set(0, this.app.screen.height - wayTexture.height / 2 - 100);

        this.app.stage.addChild(this.wayLayer);
    }

    private update(ticker: Ticker) {
        if (this.wayLayer) {
            // Move the way layer to the left at a constant speed
            this.wayLayer.tilePosition.x -= ticker.deltaTime * 1.5;
        }
    }
}
