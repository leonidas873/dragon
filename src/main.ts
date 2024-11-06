import "./style.css";
import { Application, Container } from 'pixi.js';
import { initDevtools } from '@pixi/devtools';
import 'pixi.js/prepare';
import { preload } from "./utils/preloadAssets";
import { pauseGameIfPlayerLeavesTab } from "./utils/pauseGameIfPlayerLeavesTab";
import { Background } from "./components/background/background";
import { Way } from "./components/background/way";
import { Dragon } from "./components/dragon/dragon";
import { IceCubeManager } from "./components/ice/iceCubeSpawner";
import { BalanceManager } from "./components/prize/balanceMnager";
import { GameUI } from "./components/ui/setupUi";
import { addSideIce, addSideIce2, addSideIce3 } from "./components/ice/addSideIce";

const INITIAL_FLASH_BALANCE = 100;
const initial_COIN_BALANCE = 200;

const app = new Application();

async function setup() {
  await app.init({
    background: '#1029bb', width: 500, height: 700, antialias: false, resolution: window.devicePixelRatio || 1, autoDensity: true, 
  });
  initDevtools({ app })
  app.canvas.style.width = '500px';
  app.canvas.style.height = '700px';
  const canvas_contaienr = document.getElementById('canvas_container');
  if(canvas_contaienr){
    canvas_contaienr.style.width = '500px';
    canvas_contaienr.style.height = '700px';
  }
  if (canvas_contaienr) {
    canvas_contaienr.appendChild(app.canvas);
  }
}



// Asynchronous IIFE
(async () => {
  await setup();
  await preload(app);
  const balanceManager = new BalanceManager(initial_COIN_BALANCE, INITIAL_FLASH_BALANCE);
  const background = new Background(app);
  addSideIce(app);
  addSideIce3(app);
  const way = new Way(app);
  const dragon = new Dragon(app);
  
  

  // Create a container for the ice cube
  const iceCubeContainer = new Container();
  app.stage.addChild(iceCubeContainer);
 
  const iceCubeSpawner = new IceCubeManager(app, iceCubeContainer, dragon, balanceManager, handleUiEventsOnDeath);
  pauseGameIfPlayerLeavesTab(app,iceCubeSpawner);
  addSideIce2(app);
  const gameUI = new GameUI(app, balanceManager, iceCubeSpawner);

  function handleUiEventsOnDeath() {
    gameUI.handleReset();
    
  }
  gameUI.setCoinBalance(initial_COIN_BALANCE);
  gameUI.setFlashBalance(INITIAL_FLASH_BALANCE);  
  app.stage.addChild(gameUI.UIContainer);
  app.stage.addChild(gameUI.getUIContainer());


})();

