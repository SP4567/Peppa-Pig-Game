import { Game } from './Game.js';

console.log("main.js loaded");

window.addEventListener('load', () => {
    console.log("Window load event fired");
    try {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            throw new Error("Canvas element not found!");
        }
        const game = new Game(canvas);
        console.log("Game initialized");
    } catch (error) {
        console.error("Initialization failed:", error);
        alert("Initialization failed: " + error.message);
    }
});
