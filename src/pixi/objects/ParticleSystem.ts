import { Application, Container, Graphics, Texture, Sprite } from "pixi.js";
import { GameText } from "./GameText.ts";

type Particle<T> = {
  object: T;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
};

export class ParticleSystem {
  private particles: Particle<Sprite>[] = [];
  private texts: Particle<Sprite>[] = [];

  private starTexture: Texture;
  private plusTexture: Texture;

  constructor(
    private container: Container,
    app: Application,
  ) {
    const star = new Graphics();
    star.star(0, 0, 5, 6).fill({ color: 0xffffff });
    this.starTexture = app.renderer.generateTexture(star);
    star.destroy();

    const plus = new GameText("+1", {
      fontSize: 28,
      fill: 0xffffff,
      fontWeight: "bold",
      stroke: { color: 0x000000, width: 3 },
    });
    this.plusTexture = app.renderer.generateTexture(plus);
    plus.destroy();
  }

  spawnBurst(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      const sprite = new Sprite(this.starTexture);
      sprite.eventMode = "none";
      sprite.anchor.set(0.5);
      sprite.tint = Math.random() * 0xffffff;
      sprite.x = x;
      sprite.y = y;

      const scale = (Math.random() * 6 + 3) / 6;
      sprite.scale.set(scale);

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;

      this.particles.push({
        object: sprite,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 40 + Math.random() * 20,
      });

      this.container.addChild(sprite);
    }
  }

  spawnPlusOne(x: number, y: number) {
    const sprite = new Sprite(this.plusTexture);
    sprite.eventMode = "none";
    sprite.anchor.set(0.5);

    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 20;
    sprite.x = x + Math.cos(angle) * r;
    sprite.y = y + Math.sin(angle) * r;

    this.texts.push({
      object: sprite,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -2 - Math.random() * 1.5,
      life: 0,
      maxLife: 40 + Math.random() * 10,
    });

    this.container.addChild(sprite);
  }

  update(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.life += dt;
      particle.object.x += particle.vx * dt;
      particle.object.y += particle.vy * dt;
      particle.vy += 0.15 * dt;
      particle.object.alpha = 1 - particle.life / particle.maxLife;
      if (particle.life >= particle.maxLife) {
        this.container.removeChild(particle.object);
        particle.object.destroy();
        this.particles.splice(i, 1);
      }
    }
    for (let i = this.texts.length - 1; i >= 0; i--) {
      const text = this.texts[i];
      text.life += dt;
      text.object.x += text.vx * dt;
      text.object.y += text.vy * dt;
      text.vy += 0.05 * dt;
      const t = text.life / text.maxLife;
      text.object.alpha = 1 - t;
      text.object.scale.set(1 + t * 0.3);
      if (t >= 1) {
        this.container.removeChild(text.object);
        text.object.destroy();
        this.texts.splice(i, 1);
      }
    }
  }
}
