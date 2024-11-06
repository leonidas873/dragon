import { AnimatedSprite, Application } from "pixi.js";

export const setDragonProperties = (app:Application, sprite:AnimatedSprite) => {
    sprite.animationSpeed = 0.7;
    sprite.anchor.set(0.5);
    sprite.x = app.screen.width/5 - 20;
    sprite.y = app.screen.height/2 - 20;
    sprite.scale.set(0.09);


    sprite.play();
    

}