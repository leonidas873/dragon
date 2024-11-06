import { Application, Assets } from "pixi.js";
import { createLoadingScreen } from "../components/ui/createLoadingScreen";

export async function preload(app: Application) {
    const assets = [
        { alias: 'background_ice', src: '/Asets/Background_Ice.png' },
        { alias: 'background', src: '/Asets/Background.png' },
        { alias: 'way', src: '/Asets/Way.png' },
        { alias: 'ice_cube', src: '/Asets/Ice_Cube.png' },
        { alias: 'ice1', src: '/Asets/Ice_01.png' },
        { alias: 'ice2', src: '/Asets/Ice_02.png' },
        { alias: 'ice3', src: '/Asets/Ice_03.png' },
        { alias: 'dragon_flying', src: '/Dragon_Animation/dragon_flying.png' },
        { alias: 'dragon_death', src: '/Dragon_Animation/dragon_death.png' },
        { alias: 'dragon_attack', src: '/Dragon_Animation/dragon_attack.png' },
        { alias: 'lighting_attack', src: '/VFX/lighting_Attack.png' },
        { alias: 'fire', src: '/VFX/Fire.png' },
        { alias: 'ice_melting', src: '/VFX/Cube.png' },
        { alias: 'sparkles', src: '/VFX/sparkles.png' },
        { alias: 'ice_cube_effect_down', src: '/VFX/Ice_Cube_Effect_Down.png' },
        { alias: 'coin', src: '/Asets/Coin.png' },
        { alias: 'flash', src: 'Asets/Lightning.png' },
        { alias: 'broken_ice_1', src: 'Asets/Ice_Cube_Up_Broken.png' },
        { alias: 'broken_ice_2', src: 'Asets/Ice_Cube_Broken_01.png' },
        { alias: 'broken_ice_3', src: 'Asets/Ice_Cube_Broken_02.png' },
        { alias: 'Uv', src: '/Asets/Uv.png' },
        { alias: 'cash_out', src: '/Asets/Cash_Out_Botton.png' }
    ];

    // Create the loading screen
    const { container: loadingContainer, progressText } = createLoadingScreen(app);

    Assets.addBundle('gameAssets', assets);
    const bundle = Assets.loadBundle('gameAssets', (progress) => {
        progressText.text = `${Math.round(progress * 100)}%`;
        
    });
    const textureMap = await Assets.load(assets);
    const textures = assets.map(({ alias }) => textureMap[alias]);
  
    await app.renderer.prepare.upload(textures);
    await bundle;

    app.stage.removeChild(loadingContainer);
}
