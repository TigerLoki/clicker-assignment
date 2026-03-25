import { Application, Container } from "pixi.js";
import { Scene } from "../core/Scene";
import { CoinObject } from "../objects/CoinObject";
import { ParticleSystem } from "../objects/ParticleSystem";
import { HudDisplay } from "../objects/HudDisplay";
import { EventBus } from "../patterns/EventBus";
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from "../core/constants";

const LOGICAL_CENTER_X = LOGICAL_WIDTH / 2;
const LOGICAL_CENTER_Y = LOGICAL_HEIGHT / 2;
const MILESTONE_STEP = 50;
const HIGH_SCORE_KEY = "clicker:highScore";
const MILESTONE_DURATION_MS = 1800;
const IDLE_TIMEOUT = 2000;

export class GameScene extends Scene {
  private coin: CoinObject;
  private particles: ParticleSystem;
  private hud: HudDisplay;

  private score = 0;
  private highScore = 0;
  private milestoneTimer: ReturnType<typeof setTimeout> | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private bus = EventBus.getInstance();

  constructor(
    private game: Container,
    private ui: Container,
    private app: Application,
  ) {
    super();

    this.highScore = Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;

    this.coin = new CoinObject();
    this.coin.x = LOGICAL_CENTER_X;
    this.coin.y = LOGICAL_CENTER_Y;
    this.game.addChild(this.coin);

    this.particles = new ParticleSystem(this.game, this.app);

    this.hud = new HudDisplay();
    this.ui.addChild(this.hud);

    if (this.highScore > 0) {
      this.bus.publish("highscore:changed", { highScore: this.highScore });
    }

    this.bus.publish("phase:changed", { phase: "idle" });

    this.bus.on("coin:click", ({ x, y }) => {
      this.score++;

      const pos = this.game.toLocal({ x, y });
      this.particles.spawnBurst(pos.x, pos.y);
      this.particles.spawnPlusOne(pos.x, pos.y);

      this.bus.publish("score:changed", { score: this.score });

      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem(HIGH_SCORE_KEY, String(this.highScore));
        this.bus.publish("highscore:changed", { highScore: this.highScore });
      }

      if (this.idleTimer) clearTimeout(this.idleTimer);
      this.idleTimer = null;

      if (this.score % MILESTONE_STEP === 0) {
        this.bus.publish("milestone:reached", { score: this.score });
        this.bus.publish("phase:changed", { phase: "milestone" });

        if (this.milestoneTimer) clearTimeout(this.milestoneTimer);
        this.milestoneTimer = setTimeout(() => {
          this.bus.publish("phase:changed", { phase: "playing" });
          this.milestoneTimer = null;

          this.idleTimer = setTimeout(() => {
            this.bus.publish("phase:changed", { phase: "idle" });
            this.idleTimer = null;
          }, IDLE_TIMEOUT);
        }, MILESTONE_DURATION_MS);
      } else {
        this.bus.publish("phase:changed", { phase: "playing" });

        this.idleTimer = setTimeout(() => {
          this.bus.publish("phase:changed", { phase: "idle" });
          this.idleTimer = null;
        }, IDLE_TIMEOUT);
      }
    });
  }

  resize(width: number, height: number) {
    this.hud.layout(width, height);
  }

  update(dt: number, time: number) {
    this.coin.update(dt, time);
    this.particles.update(dt);
    this.hud.update(dt);
  }
}
