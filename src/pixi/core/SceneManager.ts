import { Application, Container } from "pixi.js";
import { BackgroundScene } from "../scenes/BackgroundScene";
import { GameScene } from "../scenes/GameScene";
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from "./constants";

export { LOGICAL_WIDTH, LOGICAL_HEIGHT };

export class SceneManager {
  private backgroundScene: BackgroundScene;
  private gameScene: GameScene;
  private time = 0;

  constructor(
    private app: Application,
    bg: Container,
    private game: Container,
    private ui: Container,
  ) {
    this.backgroundScene = new BackgroundScene(bg);
    this.gameScene = new GameScene(game, ui, app);

    this.app.renderer.on("resize", this.resize);
    this.resize();

    this.app.ticker.add(this.update);
  }

  private resize = () => {
    const { width, height } = this.app.screen;
    const scale = Math.min(width / LOGICAL_WIDTH, height / LOGICAL_HEIGHT);

    for (const container of [this.game, this.ui]) {
      container.scale.set(scale);
      container.position.set(width / 2, height / 2);
      container.pivot.set(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2);
    }

    this.backgroundScene.resize(width, height);
    this.gameScene.resize(LOGICAL_WIDTH, LOGICAL_HEIGHT);
  };

  private update = (ticker: { deltaTime: number; elapsedMS: number }) => {
    this.time += ticker.elapsedMS / 1000;
    this.backgroundScene.update(ticker.deltaTime, this.time);
    this.gameScene.update(ticker.deltaTime, this.time);
  };
}
