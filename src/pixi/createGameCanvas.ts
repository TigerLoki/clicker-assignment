export function createGameCanvas(target: HTMLElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    width: "100%",
    height: "100vh",
    position: "absolute",
    left: "0",
    top: "0",
  });
  target.appendChild(canvas);
  return canvas;
}
