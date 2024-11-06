import { Application, Text, TextStyle, Container } from "pixi.js";

interface PrizeAnimationOptions {
    app: Application;
    multiplier: number;
    prize: number;
    startPosition: { x: number; y: number}
}

export const prizeAnimation = ({ app, multiplier, prize, startPosition }: PrizeAnimationOptions) => {
    const container = new Container();
    container.x = startPosition.x;
    container.y = startPosition.y;

    const textStyle = new TextStyle({
        fontFamily: 'Keons',
        fontSize: 32,
        fill: '#FF5733',
        fontWeight: 'bold',
        align: 'center'
    });
    const text = new Text({text:`${multiplier} x ${prize}`, style:textStyle});
    text.anchor.set(0.5);
    container.addChild(text);

    app.stage.addChild(container);

    const duration = 600;
    const startTime = Date.now();
    const initialY = startPosition.y;
    const bounceScale = 1.5;

    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 0.5) {
            const scaleProgress = progress * 3;
            text.scale.set(1 + (bounceScale - 1) * scaleProgress);
        } else {
            const scaleProgress = (1 - progress) * 3;
            text.scale.set(1 + (bounceScale - 1) * scaleProgress);
        }

        text.alpha = 1 - progress * 0.5;
        container.y = initialY - progress * 50;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            app.stage.removeChild(container);
            container.destroy();
        }
    };

    animate();
};
