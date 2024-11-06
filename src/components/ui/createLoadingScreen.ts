import { Application, Text, Container, Graphics, TextStyle } from "pixi.js";

export function createLoadingScreen(app: Application): { container: Container; progressText: Text } {
    const loadingContainer = new Container();

    // Background overlay
    const background = new Graphics();
    background.rect(0, 0, app.screen.width, app.screen.height);
    background.fill({color:'black', alpha: 1});
    loadingContainer.addChild(background);
    const textStyle = new TextStyle({
        fontSize: 24,
        fill: '#ffffff',
        stroke: '#000000',
    });
    // Loading text
    const loadingText = new Text({text: "Loading...", style:textStyle});
    loadingText.anchor.set(0.5);
    loadingText.position.set(app.screen.width / 2, app.screen.height / 2 - 20);
    loadingContainer.addChild(loadingText);

    // Progress text
    const progressText = new Text({text:"0%", style:textStyle});
    progressText.anchor.set(0.5);
    progressText.position.set(app.screen.width / 2, app.screen.height / 2 + 20);
    loadingContainer.addChild(progressText);

    app.stage.addChild(loadingContainer);

    return { container: loadingContainer, progressText };
}