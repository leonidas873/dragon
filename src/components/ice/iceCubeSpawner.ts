import { Application, Container } from "pixi.js";
import { IceCube, IceCubeState } from "./iceCube";
import { Dragon } from "../dragon/dragon";
import { coinAnimation } from "../prize/coinAnimation"; // Import coinAnimation
import { BalanceManager } from "../prize/balanceMnager";
import { destroyCurrentWins, drawCurrentWin } from "../prize/drawCurrentWin";
import { generatePrize } from "../prize/generatePrize";
import { playerLost } from "../../utils/playerLost";

export class IceCubeManager {
    private app: Application;
    private container: Container;
    private iceCubes: IceCube[] = [];
    private spawnInterval: number = 2000;
    private spawnIntervalId: number | null = null;
    private dragon: Dragon;
    private isPlaying: boolean = false;
    private balanceManager: BalanceManager;
    public multiplier: number = 1;
    public playerAlive: boolean = true;
    private handleUiEventsOnDeath: () => void;
    private coinAnimations: Array<{ cancel: () => void }> = [];

    constructor(app: Application, container: Container, dragon: Dragon, balanceManager: BalanceManager, handleUiEventsOnDeath: () => void) {
        this.app = app;
        this.balanceManager = balanceManager;
        this.container = container;
        this.dragon = dragon;
        this.app.ticker.add(this.checkForLoss, this);

        this.handleUiEventsOnDeath = handleUiEventsOnDeath;
    }

    public checkForLoss(): boolean {
        if (this.isPlaying && this.isIceCubeInAttackRange()) {
            return false; // Skip loss check if an ice cube is in range
        }

        if (this.isPlaying && playerLost() && this.playerAlive) {
            this.playerAlive = false;
            this.balanceManager.resetCurrentGameBalances();
            destroyCurrentWins(this.app);
            this.dragon.die();
            this.stopPlaying();
            this.handleUiEventsOnDeath();
            this.stopCoinAnimations();
            this.app.ticker.remove(this.checkForLoss, this);
            console.log("Player has died");

            return true;
        }
        return false;
    }

    private isIceCubeInAttackRange(): boolean {
        const dragonPos = this.dragon.getPosition();
        const attackRange = 320;

        return this.iceCubes.some(iceCube => {
            const iceCubePos = iceCube.getPosition();
            return (
                iceCubePos &&
                iceCube.state === IceCubeState.ALIVE &&
                Math.abs(iceCubePos.x - dragonPos.x) < attackRange
            );
        });
    }

    public setMultiplier(multiplier: number) {
        this.multiplier = multiplier;
    }

    public startSpawning() {

        this.isPlaying = true;
        this.playerAlive = true;
        this.spawnIntervalId = window.setInterval(() => {
            const iceCube = new IceCube(this.app, this.container);
            this.iceCubes.push(iceCube);
        }, this.spawnInterval);
        this.app.ticker.add(this.checkForLoss, this);

        this.app.ticker.add(this.update, this);
    }

    public stopPlaying() {

        this.isPlaying = false;
        this.stopSpawningIceCubes();
        this.app.ticker.remove(this.checkForLoss, this);
        this.app.ticker.remove(this.update, this);
        this.iceCubes.forEach(iceCube => iceCube.destroy());
        this.iceCubes = [];
    }

    private update() {
        this.checkDragonInteraction();
        this.cleanupIceCubes();
    }

    private checkDragonInteraction() {
        const dragonPos = this.dragon.getPosition();
        const attackRange = 220;

        this.iceCubes.forEach(iceCube => {
            const iceCubePos = iceCube.getPosition();
            if (
                iceCubePos &&
                iceCube.state === IceCubeState.ALIVE &&
                Math.abs(iceCubePos.x - dragonPos.x) < attackRange &&
                !iceCube.isAttacked
            ) {
                iceCube.isAttacked = true;
                this.dragon.attack(() => {
                    const prize = generatePrize();
                    iceCube.melt(this.multiplier, prize.value);
                    const prizeValue = this.multiplier * prize.value;

                    // Trigger coin animation after ice cube melts
                    const animation = coinAnimation({
                        app: this.app,
                        start: { x: iceCubePos.x, y: iceCubePos.y },
                        end: prize.type === 'coin' ? { x: 485, y: 167 } : { x: 485, y: 217 },
                        duration: 500,
                        type: prize.type,
                        callback: () => {
                            if (prize.type === 'coin') {
                                this.balanceManager.updateGameCoinBalance(prizeValue);
                            } else {
                                this.balanceManager.updateGameFlashBalance(prizeValue);
                            }
                            if (!this.balanceManager.isCashout) {
                                drawCurrentWin(this.app, this.balanceManager, prize.type);
                            }
                        }
                    });

                    // Add animation to list for possible cancellation
                    this.coinAnimations.push(animation);
                });
            }
        });
    }

    private stopCoinAnimations() {
        this.coinAnimations.forEach(animation => animation.cancel());
        this.coinAnimations = [];
    }

    private cleanupIceCubes() {
        this.iceCubes = this.iceCubes.filter(iceCube => {
            if (iceCube && iceCube.sprite && iceCube.isOffScreen()) {
                iceCube.destroy();
                return false;
            }
            return true;
        });
    }
    public pause() {
        this.stopSpawningIceCubes();
    }

    public resume() {
        if (this.spawnIntervalId === null) {
            this.startSpawning();
        }
    }
    public stopSpawningIceCubes() {
        if (this.spawnIntervalId !== null) {
            clearInterval(this.spawnIntervalId);
            this.spawnIntervalId = null;
        }
    }
}
