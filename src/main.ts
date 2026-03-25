import { SceneManager } from "./pixi/core/SceneManager";
import { createGameCanvas } from "./pixi/createGameCanvas";
import { startGame } from "./pixi/startGame";

const ROOT_ID = "root";

document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById(ROOT_ID);
  if (!gameContainer) {
    alert("No root found");
    return;
  }

  const canvas = createGameCanvas(gameContainer);
  startGame(SceneManager, canvas);
});
