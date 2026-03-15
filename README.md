# Peppa's Garden Adventure

A fun, browser-based platformer game for kids! Help Peppa jump over muddy puddles and collect Teddies across 4 unique levels.

## Features
- **4 Levels:** Garden, Deep Woods, Misty Mountains, and Grand Finale Park.
- **Music & Sound:** Fun background music and sound effects for jumping and collecting.
- **Platforms:** Now includes platforms to jump on in later levels!

## How to Play
1.  **Objective:** Move Peppa to the right to reach her House.
2.  **Collectibles:** Find all Teddies in each level to win!
3.  **Controls:**
    *   **Desktop:** Arrow Keys (Left/Right) to move, Space or Up Arrow to Jump.
    *   **Mobile/Tablet:** Use the on-screen buttons.

## Audio Assets
The game expects the following files in `assets/sounds/`:
- `music.mp3` (Background Music)
- `jump.mp3` (Jump Sound)
- `collect.mp3` (Teddy Collection Sound)
- `win.mp3` (Level Completion Sound)

*Note: If these files are missing, the game will still run without sound.*

## Setup & Running
Because this game uses modern JavaScript (ES Modules), you cannot just double-click `index.html`. You need a local web server.

### Option 1: VS Code (Recommended)
1.  Open this folder in VS Code.
2.  Install the "Live Server" extension.
3.  Right-click `index.html` and select "Open with Live Server".

### Option 2: Python
If you have Python installed:
1.  Open a terminal in this folder.
2.  Run `python -m http.server`.
3.  Open `http://localhost:8000` in your browser.

### Option 3: Node.js
1.  Run `npx serve`.
2.  Open the link shown.

## Customization (Assets)
You can replace the placeholder graphics with real images!

1.  **Images:** Add your images to `assets/images/`.
2.  **Code:** Edit `js/Entities.js` or `js/World.js` to use `drawImage` instead of drawing shapes.

Example in `js/Entities.js`:
```javascript
// Inside Player.draw(ctx)
const image = new Image();
image.src = 'assets/images/peppa.png';
ctx.drawImage(image, this.x, this.y, this.width, this.height);
```
Make sure to preload images for better performance!

## Credits
Built with HTML5 Canvas and Vanilla JavaScript.
