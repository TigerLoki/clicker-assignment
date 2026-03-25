import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { EventBus } from "../patterns/EventBus";

const BASE_RADIUS = 125;
const MAX_SCALE = 1.5;
const DECAY_RATE = 0.05;
const DECAY_DELAY_FRAMES = 60;

const GLOW_LAYERS = [
  { offset: 60, alpha: 0.08 },
  { offset: 40, alpha: 0.13 },
  { offset: 24, alpha: 0.18 },
  { offset: 12, alpha: 0.22 },
  { offset: 4, alpha: 0.2 },
];

export class CoinObject extends Container {
  private sprite: Sprite;
  private glow: Graphics;
  private baseScale: number;
  private bus = EventBus.getInstance();

  private energy = 0;
  private decayDelay = 0;
  private punchScale = 1;
  private bobOffsetY = 0;

  constructor() {
    super();

    this.glow = new Graphics();
    this.addChild(this.glow);

    const texture = Texture.from("/bitcoin.png");
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.eventMode = "static";
    this.sprite.cursor = "pointer";
    this.addChild(this.sprite);

    const longestSide = Math.max(texture.width, texture.height);
    this.baseScale = (BASE_RADIUS * 2) / longestSide;

    this.sprite.on("pointerdown", (e) => {
      this.energy = Math.min(1, this.energy + 0.05);
      this.punchScale = 1.05;
      this.decayDelay = DECAY_DELAY_FRAMES;
      this.bus.publish("coin:click", { x: e.global.x, y: e.global.y });
    });
  }

  private _drawGlow(animScale: number, energy: number) {
    this.glow.clear();

    const radius = BASE_RADIUS * animScale;
    const intensity = 0.4 + energy * 0.6;

    for (const layer of GLOW_LAYERS) {
      this.glow
        .circle(0, this.bobOffsetY, radius + layer.offset)
        .fill({ color: 0xffd700, alpha: layer.alpha * intensity });
    }
  }

  update(dt: number, time: number) {
    if (this.decayDelay > 0) {
      this.decayDelay -= dt;
    } else {
      this.energy = Math.max(0, this.energy - DECAY_RATE * dt);
    }

    const eased = 1 - (1 - this.energy) ** 2;
    const animScale = 1 + (MAX_SCALE - 1) * eased;
    this.punchScale += (1 - this.punchScale) * 0.25 * dt;

    const finalScale = animScale * this.punchScale;
    this.sprite.scale.set(this.baseScale * finalScale);

    this.bobOffsetY = Math.sin(time * 1.8) * 5;
    this.sprite.y = this.bobOffsetY;
    this.sprite.rotation = Math.sin(time * 0.9) * 0.014;

    this._drawGlow(finalScale, this.energy);
  }
}
