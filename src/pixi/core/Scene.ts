export abstract class Scene {
  abstract update(delta: number, time: number): void;
  abstract resize(width: number, height: number): void;
}
