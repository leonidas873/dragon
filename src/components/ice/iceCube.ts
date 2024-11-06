import { Application, Container, Sprite, Texture, AnimatedSprite } from "pixi.js";
import { getIceMeltingAnimation } from "./iceMelting";
import { iceCubeEffectDownAnimation } from "./iceCubeEffectDown";
import { getIceSparklesAnimation } from "./sparkles";
import { prizeAnimation } from "../prize/prizeAnimation"; // Import prizeAnimation

export enum IceCubeState {
    ALIVE,
    MELTING,
    MELTED,
}

export class IceCube {
    private app: Application;
    private container: Container;
    public sprite: Sprite | null;
    private meltingAnimation: AnimatedSprite | null = null;
    private iceCubeEffectDown: AnimatedSprite | null = null;
    private sparklesEffect: AnimatedSprite | null = null;
    private speed: number = 1.5;
    public state: IceCubeState = IceCubeState.ALIVE;
    public isAttacked: boolean = false;

    constructor(app: Application, container: Container) {
        this.app = app;
        this.container = new Container();
        container.addChild(this.container);

        this.sprite = new Sprite(Texture.from("ice_cube"));
        this.sprite.width = 60;
        this.sprite.height = 60;
        this.sprite.anchor.set(0.5);

        this.resetPosition();
        this.container.addChild(this.sprite);
        this.app.ticker.add(this.update, this);
    }

    private update() {
        // Move the container instead of individual sprites
        this.container.x -= this.speed;

        // Check if the ice cube has gone off-screen
        if (this.isOffScreen()) {
            this.destroy();
        }
    }

    private resetPosition() {
        this.container.x = this.app.screen.width + this.sprite!.width / 2;
        this.container.y = this.app.screen.height - 230;
    }

    public isOffScreen(): boolean {
        return this.container.x < -this.sprite!.width;
    }

    public melt(multiplier: number, prize: number) {
        if (this.state === IceCubeState.ALIVE) {
            this.state = IceCubeState.MELTING;
            this.sprite!.visible = false;

            // Add and play the melting animation
            this.meltingAnimation = getIceMeltingAnimation();
            this.meltingAnimation.anchor.set(0.5);
            this.container.addChild(this.meltingAnimation);
            this.meltingAnimation.play();

            // Add and play the ice cube effect down animation
            this.iceCubeEffectDown = iceCubeEffectDownAnimation();
            this.iceCubeEffectDown.position.set(-5, -10);
            this.iceCubeEffectDown.anchor.set(0.5);
            this.container.addChild(this.iceCubeEffectDown);
            this.iceCubeEffectDown.play();

            // Add and play the sparkles effect
            this.sparklesEffect = getIceSparklesAnimation();
            this.sparklesEffect.position.set(-5, 0);
            this.sparklesEffect.anchor.set(0.5);
            this.container.addChild(this.sparklesEffect);
            this.sparklesEffect.play();

            // Trigger the prize animation after the ice cube melts
            prizeAnimation({
                app: this.app,
                multiplier,
                prize,
                startPosition: { x: this.container.x, y: this.container.y },
            });

            this.iceCubeEffectDown.onComplete = () => {
                if (this.iceCubeEffectDown) {
                    this.container.removeChild(this.iceCubeEffectDown);
                    this.iceCubeEffectDown.destroy();
                    this.iceCubeEffectDown = null;
                }
            };
            this.sparklesEffect.onComplete = () => {
                if (this.sparklesEffect) {
                    this.container.removeChild(this.sparklesEffect);
                    this.sparklesEffect.destroy();
                    this.sparklesEffect = null;
                }
            };
        }
    }

    public getPosition() {
        if (this.container && this.sprite) {
            return { x: this.container.x, y: this.container.y };
        }
        return null;
    }

    public destroy() {
        this.app.ticker.remove(this.update, this);

        if (this.container.parent) {
            this.container.parent.removeChild(this.container);
        }
        if (this.sprite) {
            this.container.removeChild(this.sprite);
            this.sprite.destroy();
            this.sprite = null;
        }
        if (this.meltingAnimation) {
            this.container.removeChild(this.meltingAnimation);
            this.meltingAnimation.destroy();
            this.meltingAnimation = null;
        }
        if (this.iceCubeEffectDown) {
            this.container.removeChild(this.iceCubeEffectDown);
            this.iceCubeEffectDown.destroy();
            this.iceCubeEffectDown = null;
        }
        if (this.sparklesEffect) {
            this.container.removeChild(this.sparklesEffect);
            this.sparklesEffect.destroy();
            this.sparklesEffect = null;
        }

        this.container.destroy();
    }
}
