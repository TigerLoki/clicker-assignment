import { Text, TextStyle } from "pixi.js";

const DEFAULT_STYLE = new TextStyle({
  fontFamily: "Georgia, serif",
  fontSize: 16,
  fill: 0xffffff,
  align: "center",
});

export class GameText extends Text {
  constructor(text = "", style?: Partial<TextStyle>) {
    super({ text, style: new TextStyle({ ...DEFAULT_STYLE, ...style }) });
    this.anchor.set(0.5);
  }
}
