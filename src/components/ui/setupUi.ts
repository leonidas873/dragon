import { Application, Container, Sprite, Texture, Text, TextStyle, Graphics, SCALE_MODES } from "pixi.js";
import { cashOutAnimation } from "../prize/cashOutAnimation";
import { BalanceManager } from "../prize/balanceMnager";
import { destroyCurrentWins } from "../prize/drawCurrentWin";
import { IceCubeManager } from "../ice/iceCubeSpawner";

export class GameUI {
    private app: Application;
    public UIContainer: Container;
    private isStartButton: boolean = true;
    private startSprite!: Sprite;
    private cashOutSprite!: Sprite;
    private coinBalanceText!: Text;
    private flashBalanceText!: Text;
    private multiplierText!: Text;
    private multiplierModal!: Container;
    private balanceManager: BalanceManager;
    private iceCubeSpawner: IceCubeManager;
    private playereBtn!: Container;
    public betButton!: Container;

    constructor(app: Application, balanceManager: BalanceManager, iceCubeSpawner: IceCubeManager) {
        this.app = app;
        this.UIContainer = new Container();
        this.balanceManager = balanceManager;
        this.iceCubeSpawner = iceCubeSpawner;
        this.setupUI();
    }

    private setupUI() {
        const frame = new Sprite(Texture.from("Uv"));
        frame.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

        frame.width = this.app.screen.width;
        frame.height = this.app.screen.height;
        this.UIContainer.addChild(frame);

        const btnContainer = new Container();
        this.playereBtn = btnContainer;
        btnContainer.interactive = true;
        btnContainer.cursor = 'pointer';
        this.UIContainer.addChild(btnContainer);

        const buttonX = this.app.screen.width / 2 - 95;
        const buttonY = this.app.screen.height - 100;
        const buttonWidth = 190;
        const buttonHeight = 80;

        this.cashOutSprite = new Sprite(Texture.from("cash_out"));
        this.cashOutSprite.width = buttonWidth;
        this.cashOutSprite.height = buttonHeight;
        this.cashOutSprite.position.set(buttonX, buttonY);
        this.cashOutSprite.visible = false;
        btnContainer.addChild(this.cashOutSprite);

        this.startSprite = new Sprite(Texture.from("start"));
        this.startSprite.width = buttonWidth;
        this.startSprite.height = buttonHeight;
        this.startSprite.position.set(buttonX, buttonY);
        this.startSprite.visible = true;
        btnContainer.addChild(this.startSprite);

        const balanceTextStyle = new TextStyle({
            fontFamily: 'Keons',
            fontSize: 20,
            fill: '#ffffff',
            stroke: '#000000',
        });

        const coinBalanceContainer = new Container();
        this.coinBalanceText = new Text("0", balanceTextStyle);
        this.coinBalanceText.position.set(30, -1);
        coinBalanceContainer.addChild(this.coinBalanceText);
        coinBalanceContainer.position.set(40, this.app.screen.height - 50);
        this.UIContainer.addChild(coinBalanceContainer);

        const flashBalanceContainer = new Container();
        this.flashBalanceText = new Text("0", balanceTextStyle);
        this.flashBalanceText.position.set(30, 11);
        flashBalanceContainer.addChild(this.flashBalanceText);
        flashBalanceContainer.position.set(40, this.app.screen.height - 100);
        this.UIContainer.addChild(flashBalanceContainer);

        const multiplierContainer = new Container();
        const multiplierBackground = new Graphics();
        multiplierBackground.beginFill(0xf5a603);
        multiplierBackground.drawRect(0, 0, 30, 20);
        multiplierBackground.endFill();
        multiplierContainer.addChild(multiplierBackground);

        const multiplierTextStyle = new TextStyle({
            fontFamily: 'Keons',
            fontSize: 15,
            fill: '#ffffff',
        });
        this.multiplierText = new Text({text:`${this.iceCubeSpawner.multiplier}x`, style:multiplierTextStyle});
        this.multiplierText.anchor.set(0.5);
        this.multiplierText.position.set(multiplierBackground.width / 2, multiplierBackground.height / 2);
        multiplierContainer.addChild(this.multiplierText);
        
        multiplierContainer.position.set(
            this.app.screen.width - multiplierBackground.width - 53,
            this.app.screen.height - multiplierBackground.height - 69
        );

        multiplierContainer.interactive = true;
        multiplierContainer.cursor = 'pointer';

        const betButton = new Graphics()
        .rect(366,605,100,30)
        .fill({color:'black', alpha: 0});
        this.betButton = betButton;
        this.betButton.zIndex = 12;
        betButton.label = "bet"
        betButton.interactive = true;
        betButton.cursor = 'pointer';
        this.app.stage.addChild(betButton);
        betButton.on("pointerdown", () => this.showMultiplierModal());
        this.UIContainer.addChild(multiplierContainer);

        this.createMultiplierModal();
        btnContainer.on("pointerdown", this.handleButtonClick.bind(this));
    }

    private handleCashout() {
        this.balanceManager.setCashout();
        
        this.betButton.interactive = true;
        this.iceCubeSpawner.stopPlaying();

        const currentCoinBalance = this.balanceManager.getCoinBalance();
        const currentFlashBalance = this.balanceManager.getFlashBalance();

        this.balanceManager.addToGlobalCoinBalance(currentCoinBalance);
        this.balanceManager.addToGlobalFlashBalance(currentFlashBalance);

        this.balanceManager.resetCurrentGameBalances();
        destroyCurrentWins(this.app);

        const updatedGlobalCoinBalance = this.balanceManager.getGlobalCoinBalance();
        const updatedGlobalFlashBalance = this.balanceManager.getGlobalFlashBalance();

        this.setCoinBalance(updatedGlobalCoinBalance);
        this.setFlashBalance(updatedGlobalFlashBalance);

        if (currentCoinBalance > 0) {
            cashOutAnimation({ app: this.app, start: { x: 485, y: 167 }, end: { x: 50, y: this.app.screen.height - 50 }, type: 'coin' });
        }
        if (currentFlashBalance > 0) {
            cashOutAnimation({ app: this.app, start: { x: 485, y: 217 }, end: { x: 50, y: this.app.screen.height - 90 }, type: 'flash' });
        }
    }

    private handleStart() {
        const cost = this.iceCubeSpawner.multiplier;
        const currentGlobalCoinBalance = this.balanceManager.getGlobalCoinBalance() - cost;
    // Check if there's enough balance
    if (this.balanceManager.getGlobalCoinBalance() >= cost) {

        this.balanceManager.updateGlobalCoinBalance(-cost)

        this.setCoinBalance(currentGlobalCoinBalance);

        this.iceCubeSpawner.startSpawning();
        this.betButton.interactive = false;
        this.balanceManager.resetCashout();
    } else {
        console.log("Not enough balance to start the game.");
    }

    }

    public handleReset(){
        this.isStartButton = true;
        this.cashOutSprite.visible = false;
        this.startSprite.visible = true;
        this.betButton.interactive = true;
    }

    private checkPlayerLoss() {
        if (this.iceCubeSpawner.checkForLoss()) {
            this.handleReset();
        }
    }

    private handleButtonClick() {
        if (this.isStartButton) {
            this.handleStart();
            this.isStartButton = false;
            this.cashOutSprite.visible = true;
            this.startSprite.visible = false;
            this.app.ticker.add(this.checkPlayerLoss.bind(this));
            this.iceCubeSpawner.playerAlive = true;

        } else {
            if(!this.balanceManager.getCoinBalance() && !this.balanceManager.getFlashBalance()){
                return;
            }

            this.app.ticker.remove(this.checkPlayerLoss.bind(this));
            this.handleCashout();
            this.handleReset();
        }
    }

    
    private createMultiplierModal() {
        this.multiplierModal = new Container();
        this.multiplierModal.visible = false;
        const modalBackground = new Graphics();
        modalBackground.beginFill(0x000000, 0.8); // Black background with opacity
        modalBackground.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        modalBackground.endFill();
        this.multiplierModal.addChild(modalBackground);

        const multipliers = [1, 2, 3, 4, 5];
        const textStyle = new TextStyle({
            fontFamily: 'Keons',
            fontSize: 30,
            fill: 'black',
            stroke: '#000000',
        });

        multipliers.forEach((multiplier, index) => {
            const optionText = new Text(`${multiplier}x`, textStyle);
            optionText.anchor.set(0.5);
            optionText.position.set(this.app.screen.width / 2, 200 + index * 50);
            optionText.interactive = true;
            optionText.cursor = 'pointer';
        
            optionText.style.fill = 'black';
            
        
            optionText.on("pointerdown", () => this.selectMultiplier(multiplier));
            this.multiplierModal.addChild(optionText);
        });

        this.UIContainer.addChild(this.multiplierModal);
    }

    private showMultiplierModal() {
        this.multiplierModal.visible = true;
        this.playereBtn.interactive = false;

    }

    private hideMultiplierModal() {
        this.multiplierModal.visible = false;
        this.playereBtn.interactive = true;
    }

    private selectMultiplier(multiplier: number) {
        this.iceCubeSpawner.setMultiplier(multiplier);
        this.multiplierText.text = `${this.iceCubeSpawner.multiplier}x`;
        this.hideMultiplierModal();
    }

    public setCoinBalance(amount: number) {
        this.coinBalanceText.text = amount.toString();
    }

    public setFlashBalance(amount: number) {
        this.flashBalanceText.text = amount.toString();
    }

    public getUIContainer(): Container {
        return this.UIContainer;
    }

    public resetGameUI() {
        this.handleReset();
    }
}
