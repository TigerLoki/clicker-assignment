import { Container, Graphics } from "pixi.js";
import { Scene } from "../core/Scene";

type Star = {
  graphics: Graphics;
  u: number;
  v: number;
  speed: number;
  twinkleSpeed: number;
  twinkleOffset: number;
};

export class BackgroundScene extends Scene {
  private stars: Star[] = [];
  private width = 0;
  private height = 0;

  constructor(
    private container: Container,
    count = 150,
  ) {
    super();

    for (let i = 0; i < count; i++) {
      const size = Math.random() * 1.5 + 0.5;
      const graphics = new Graphics();
      graphics.circle(0, 0, size).fill({ color: 0xffffff });

      this.stars.push({
        graphics: graphics,
        u: Math.random(),
        v: Math.random(),
        speed: 0.0002 + Math.random() * 0.0005,
        twinkleSpeed: 1 + Math.random() * 2,
        twinkleOffset: Math.random() * Math.PI * 2,
      });

      this.container.addChild(graphics);
    }
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;

    for (const star of this.stars) {
      star.graphics.x = star.u * width;
      star.graphics.y = star.v * height;
    }
  }

  update(dt: number, time: number) {
    for (const star of this.stars) {
      star.v += star.speed * dt;
      if (star.v > 1) {
        star.v = 0;
        star.u = Math.random();
        star.graphics.x = star.u * this.width;
      }

      star.graphics.y = star.v * this.height;

      const t = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
      star.graphics.alpha = 0.4 + (t * 0.5 + 0.5) * 0.6;
      star.graphics.scale.set(0.9 + (t * 0.5 + 0.5) * 0.2);
    }
  }
}
