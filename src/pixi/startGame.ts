import { Application, Assets, Container } from "pixi.js";
import { SceneManager } from "./core/SceneManager";

export async function startGame(
  SceneManagerClass: typeof SceneManager,
  canvas: HTMLCanvasElement,
) {
  const app = new Application();

  await app.init({
    resizeTo: window,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    canvas,
    background: "#0b0b14",
  });

  await Assets.load("/bitcoin.png");

  app.stage.sortableChildren = true;
  app.stage.eventMode = "static";

  const bg = new Container();
  const game = new Container();
  const ui = new Container();

  bg.zIndex = 0;
  game.zIndex = 1;
  ui.zIndex = 2;

  app.stage.addChild(bg, game, ui);

  return new SceneManagerClass(app, bg, game, ui);
}
