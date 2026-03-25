import { Container, DestroyOptions } from "pixi.js";
import { GameText } from "./GameText";
import { EventBus, GamePhase, Subscription } from "../patterns/EventBus";

const LABEL_GAP = 25;
const MARGIN = 20;

export class HudDisplay extends Container {
  private scoreLabel: GameText;
  private scoreValue: GameText;
  private highLabel: GameText;
  private highValue: GameText;
  private phaseText: GameText;

  private layoutX = 0;
  private layoutY = 0;
  private bus = EventBus.getInstance();
  private subscriptions: Subscription[] = [];

  constructor() {
    super();

    this.scoreLabel = new GameText("СЧЁТ", {
      fontSize: 11,
      fill: 0x6464b4,
      letterSpacing: 2,
    });
    this.scoreValue = new GameText("0", {
      fontSize: 16,
      fill: 0xb4a050,
      letterSpacing: 1,
    });
    this.highLabel = new GameText("РЕКОРД", {
      fontSize: 11,
      fill: 0x6464b4,
      letterSpacing: 2,
    });
    this.highValue = new GameText("0", {
      fontSize: 16,
      fill: 0xb4a050,
      letterSpacing: 1,
    });
    this.phaseText = new GameText("IDLE", {
      fontSize: 10,
      fill: 0x6666aa,
      letterSpacing: 3,
    });
    this.phaseText.alpha = 0.4;

    for (const gameText of [
      this.scoreLabel,
      this.scoreValue,
      this.highLabel,
      this.highValue,
      this.phaseText,
    ]) {
      gameText.anchor.set(1, 1);
      this.addChild(gameText);
    }

    this.subscriptions.push(
      this.bus.on("score:changed", ({ score }) => {
        this.scoreValue.text = score.toLocaleString("ru");
        this.scoreValue.scale.set(1.2);
      }),
    );

    this.subscriptions.push(
      this.bus.on("highscore:changed", ({ highScore }) => {
        this.highValue.text = highScore.toLocaleString("ru");
      }),
    );

    this.subscriptions.push(
      this.bus.on("phase:changed", ({ phase }) => {
        this._setPhase(phase as GamePhase);
      }),
    );
  }

  destroy(options?: DestroyOptions) {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.length = 0;
    super.destroy(options);
  }

  private _setPhase(phase: GamePhase) {
    this.phaseText.text = phase.toUpperCase();
    const configs = {
      idle: { fill: 0x6666aa, alpha: 0.4 },
      playing: { fill: 0x44aa66, alpha: 0.4 },
      milestone: { fill: 0xffd700, alpha: 0.9 },
    };
    const { fill, alpha } = configs[phase];
    this.phaseText.style.fill = fill;
    this.phaseText.alpha = alpha;
  }

  layout(width: number, height: number) {
    this.layoutX = width - MARGIN;
    this.layoutY = height - MARGIN;
  }

  update(dt: number) {
    const s =
      this.scoreValue.scale.x + (1 - this.scoreValue.scale.x) * 0.18 * dt;
    this.scoreValue.scale.set(s);

    const x = this.layoutX;
    const y = this.layoutY;

    this.phaseText.position.set(x, y);

    this.highValue.position.set(x, y - LABEL_GAP);
    this.highLabel.position.set(x - LABEL_GAP * 4, y - LABEL_GAP);

    this.scoreValue.position.set(x, y - LABEL_GAP * 2);
    this.scoreLabel.position.set(x - LABEL_GAP * 4, y - LABEL_GAP * 2);
  }
}
