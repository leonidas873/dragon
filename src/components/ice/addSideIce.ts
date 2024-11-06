import { Application, Sprite, Texture } from "pixi.js";

let ice1: Sprite;
let ice3: Sprite;

export const addSideIce = (app: Application) => {
    ice1 = new Sprite(Texture.from("ice1"));
    ice1.anchor.set(0.5);
    ice1.y = 460;
    ice1.x = app.screen.width + ice1.width;
    ice1.scale.set(0.25);
    
    app.stage.addChild(ice1);

    const speed = 1.2;

    const moveIce1 = () => {
        ice1.x -= speed;

        if (ice1.x + ice1.width < 0) {
            ice1.x = app.screen.width + 100;
        }

        if (ice3 && Math.abs(ice1.x - ice3.x) < 150) {
            ice3.x = ice1.x + 150; 
        }
    };

    app.ticker.add(moveIce1);
};

export const addSideIce3 = (app: Application) => {
    ice3 = new Sprite(Texture.from("ice3"));
    ice3.anchor.set(0.5);
    ice3.y = 460;
    ice3.x = app.screen.width / 2 + 400;
    ice3.scale.set(0.25);
    
    app.stage.addChild(ice3);

    const speed = 1.2;

    const moveIce3 = () => {
        ice3.x -= speed;

        if (ice3.x + ice3.width < 0) {
            ice3.x = app.screen.width + 600;
        }

        if (ice1 && Math.abs(ice3.x - ice1.x) < 150) {
            ice1.x = ice3.x - 150; 
        }
    };

    app.ticker.add(moveIce3);
};



export const addSideIce2 = (app: Application) => {
    const iceSprite = new Sprite(Texture.from("ice2"));
    iceSprite.anchor.set(0.5);
    iceSprite.y = 550;
    iceSprite.x = app.screen.width + iceSprite.width + 200;

    iceSprite.scale = 0.1;
    app.stage.addChild(iceSprite);

    const speed = 4;

    const moveIce = () => {
        iceSprite.x -= speed;

        if (iceSprite.x + iceSprite.width < 0) {
            iceSprite.x = app.screen.width + 800
        }
    };

    app.ticker.add(moveIce);
};