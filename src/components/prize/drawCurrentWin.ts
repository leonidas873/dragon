import { Application, Container, Sprite, Text, TextStyle, Texture, Graphics } from "pixi.js";
import { BalanceManager } from "./balanceMnager";

let coinBalanceContainer: Container | null = null;
let flashBalanceContainer: Container | null = null;

export const drawCurrentWin = (app: Application, balanceManager: BalanceManager, type: 'coin' | 'flash') => {
    const currentBalance = type === 'coin' ? balanceManager.getCoinBalance() : balanceManager.getFlashBalance();
    const positionY = type === 'coin' ? 170 : 220;
    
    // Pass appropriate container reference for each type
    if (type === 'coin') {
        coinBalanceContainer = drawCurrentBalance(app, currentBalance, 'coin', positionY, coinBalanceContainer);
    } else {
        flashBalanceContainer = drawCurrentBalance(app, currentBalance, 'flash', positionY, flashBalanceContainer);
    }
};

const drawCurrentBalance = (
    app: Application,
    currentBalance: number,
    iconTextureAlias: string,
    positionY: number,
    balanceContainerRef: Container | null
): Container => {
    // Remove the previous balance container if it exists
    if (balanceContainerRef) {
        app.stage.removeChild(balanceContainerRef);
        balanceContainerRef.destroy({ children: true });
    }

    const balanceContainer = new Container();
    balanceContainer.x = app.screen.width - 80;
    balanceContainer.y = positionY;

    const background = new Graphics();
    background.roundRect(0, -25, 80, 40, 10);
    background.fill({color:'black', alpha: 0.7});

    const iconTexture = Texture.from(iconTextureAlias);
    const iconSprite = new Sprite(iconTexture);
    iconSprite.anchor.set(0.5);
    iconSprite.width = 25;
    iconSprite.height = 25;
    iconSprite.x = 65;
    iconSprite.y = -3;

    const textStyle = new TextStyle({
        fontFamily: 'Keons',
        fontSize: 20,
        fill: '#ffffff',
        stroke: '#000000',
    });

    const balanceText = new Text(currentBalance.toString(), textStyle);
    balanceText.x = 5;
    balanceText.y = -15;

    balanceContainer.addChild(background);
    balanceContainer.addChild(iconSprite);
    balanceContainer.addChild(balanceText);

    app.stage.addChild(balanceContainer);

    return balanceContainer;
};
// Function to destroy current win displays
export const destroyCurrentWins = (app: Application) => {
    if (coinBalanceContainer) {
        app.stage.removeChild(coinBalanceContainer);
        coinBalanceContainer.destroy({ children: true });
        coinBalanceContainer = null;
    }

    if (flashBalanceContainer) {
        app.stage.removeChild(flashBalanceContainer);
        flashBalanceContainer.destroy({ children: true });
        flashBalanceContainer = null;
    }
};
