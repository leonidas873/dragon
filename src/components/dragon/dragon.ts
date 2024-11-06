import { AnimatedSprite, Application, Graphics } from "pixi.js";
import { getDragonAttackAnimation } from "./dragonAttack";
import { getDragonFlyAnimation } from "./dragonFly";
import { getDragonDeathAnimation } from "./dragonDeath";
import { getFireAnimation } from "./fireEffect";
import { getLightningAttackAnimation } from "./lightningAttack";

export enum DragonState {
    FLYING = 'FLYING',
    DEAD = 'DEAD',
    ATTACK = 'ATTACK',
}

export class Dragon {
    private app: Application;
    private dragonState: DragonState = DragonState.FLYING;
    private sprite: AnimatedSprite;
    private attackAnimation: AnimatedSprite;
    private flyingAnimation: AnimatedSprite;
    private deathAnimation: AnimatedSprite;
    private dragonFire: AnimatedSprite;
    private fireTriggered = false;

    constructor(app: Application) {
        this.app = app;

        this.attackAnimation = getDragonAttackAnimation(app);
        this.flyingAnimation = getDragonFlyAnimation(app);
        this.deathAnimation = getDragonDeathAnimation(app);
        this.dragonFire = getFireAnimation();

        this.sprite = this.flyingAnimation;
        this.app.stage.addChild(this.sprite);
        this.playCurrentAnimation();
    }

    public setState(state: DragonState) {
        if (this.dragonState !== state) {
            this.dragonState = state;
            this.updateAnimation();
        }
    }

    private updateAnimation() {
        this.sprite.stop();
        this.app.stage.removeChild(this.sprite);

        switch (this.dragonState) {
            case DragonState.FLYING:
                this.sprite = this.flyingAnimation;
                this.fireTriggered = false;
                break;

            case DragonState.ATTACK:
                this.sprite = this.attackAnimation;
                this.sprite.gotoAndPlay(0);
                this.sprite.loop = false;

                this.sprite.onFrameChange = () => {
                    if (!this.fireTriggered && this.sprite.currentFrame === 15) {
                        this.startFireAnimation();
                        this.fireTriggered = true;
                    }
                };

                this.sprite.onComplete = () => this.setState(DragonState.FLYING);
                break;

            case DragonState.DEAD:
                this.sprite = this.deathAnimation;
                this.sprite.gotoAndPlay(0);
                this.sprite.loop = false;
                this.triggerLightningAttack();

                this.sprite.onComplete = () => {
                    this.setState(DragonState.FLYING);
                };
                break;
        }

        this.app.stage.addChild(this.sprite);
        this.playCurrentAnimation();
    }

    private startFireAnimation() {
        this.dragonFire.rotation = Math.PI / 4;
        this.dragonFire.position.set(this.sprite.x + 100, this.sprite.y + 80);
        this.app.stage.addChild(this.dragonFire);
        this.dragonFire.gotoAndPlay(0);

        this.dragonFire.loop = false;
        this.dragonFire.onComplete = () => {
            this.app.stage.removeChild(this.dragonFire);
            this.dragonFire.stop();
        };
    }

    private triggerLightningAttack() {
        const lightning = getLightningAttackAnimation(this.app, this.sprite.x, this.sprite.y - 90);
        this.app.stage.addChild(lightning);

        this.triggerFlashEffect();
    }

    private triggerFlashEffect() {
        const flash = new Graphics();
        flash.rect(0, 70, this.app.screen.width, this.app.screen.height - 186);
        flash.fill({color:'white'});
        flash.alpha = 0.8;
      
        this.app.stage.addChild(flash);

        // Fade out the flash effect
        this.app.ticker.add((delta) => {
            flash.alpha -= 0.1 * delta.deltaTime;
            if (flash.alpha <= 0) {
                this.app.stage.removeChild(flash);
                flash.destroy();
            }
        });
    }

    private playCurrentAnimation() {
        if (this.sprite instanceof AnimatedSprite) {
            this.sprite.play();
        }
    }

    public fly() {
        this.setState(DragonState.FLYING);
    }

    public attack(callback?: () => void) {
        this.setState(DragonState.ATTACK);
        if (callback) {
            this.sprite.onFrameChange = (currentFrame) => {
                if (currentFrame === 15) {
                    this.startFireAnimation();
                    callback();
                }
            };
        }
    }

    public die() {
        this.setState(DragonState.DEAD);
    }

    public getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    public setPosition(x: number, y: number) {
        this.sprite.position.set(x, y);
    }
}
