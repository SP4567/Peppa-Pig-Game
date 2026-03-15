export class InputHandler {
    constructor() {
        this.keys = {
            left: false,
            right: false,
            jump: false
        };

        this.touch = {
            left: false,
            right: false,
            jump: false
        };

        this.setupKeyboardListeners();
        this.setupTouchListeners();
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    this.keys.left = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.keys.right = true;
                    break;
                case 'Space':
                case 'ArrowUp':
                case 'KeyW':
                    this.keys.jump = true;
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch(e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.keys.right = false;
                    break;
                case 'Space':
                case 'ArrowUp':
                case 'KeyW':
                    this.keys.jump = false;
                    break;
            }
        });
    }

    setupTouchListeners() {
        const bindBtn = (id, key) => {
            const btn = document.getElementById(id);
            if (!btn) return;

            btn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this.touch[key] = true;
                btn.classList.add('active');
            });

            const stopAction = (e) => {
                e.preventDefault();
                this.touch[key] = false;
                btn.classList.remove('active');
            };

            btn.addEventListener('pointerup', stopAction);
            btn.addEventListener('pointerleave', stopAction);
            btn.addEventListener('pointercancel', stopAction);
        };

        bindBtn('btn-left', 'left');
        bindBtn('btn-right', 'right');
        bindBtn('btn-jump', 'jump');
    }

    get left() { return this.keys.left || this.touch.left; }
    get right() { return this.keys.right || this.touch.right; }
    get jump() { return this.keys.jump || this.touch.jump; }
}
