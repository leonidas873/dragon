import { Application } from "pixi.js";
import { IceCubeManager } from "../components/ice/iceCubeSpawner";

export const pauseGameIfPlayerLeavesTab = (app: Application, iceCubeManager: IceCubeManager) => {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            app.ticker.stop();
            iceCubeManager.pause();
        } else {
            app.ticker.start();
            iceCubeManager.resume();
        }
    });
};