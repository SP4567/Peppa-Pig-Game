import { InputHandler } from './Input.js';
import { Player } from './Entities.js';
import { World } from './World.js';
import { LEVELS } from './Levels.js';
import { AudioManager } from './Audio.js';
import { ParticleEmitter } from './Particles.js';
import { AssetLoader } from './AssetLoader.js';
import { SaveManager } from './SaveManager.js';
import { AuthManager } from './Auth.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width = window.innerWidth;
        this.height = canvas.height = window.innerHeight;
        
        this.loader = new AssetLoader();
        this.input = new InputHandler();
        this.audio = new AudioManager();
        this.particles = new ParticleEmitter();
        this.saveManager = new SaveManager();
        this.auth = new AuthManager();

        this.currentLevelIndex = 0;
        this.score = 0;
        this.gameOver = false;
        this.cameraX = 0;
        this.isLoaded = false;
        
        this.screens = {
            loading: document.getElementById('loading-screen'),
            auth: document.getElementById('auth-screen'),
            start: document.getElementById('start-screen'),
            charSelect: document.getElementById('character-screen'),
            settings: document.getElementById('settings-screen'),
            win: document.getElementById('win-screen'),
            levelComplete: document.getElementById('level-complete-screen')
        };

        this.ui = {
            hud: document.getElementById('hud'),
            dialogue: document.getElementById('dialogue-box'),
            dialogueText: document.getElementById('dialogue-text'),
            score: document.getElementById('score'),
            totalTeddies: document.getElementById('total-teddies'),
            levelName: document.getElementById('level-name'),
            touch: document.getElementById('touch-controls'),
            playerName: document.getElementById('player-name-display'),
            fact: document.getElementById('learning-fact')
        };

        this.initLoader();
        this.setupUI();
        this.setupResizeListener();
    }

    setupResizeListener() {
        window.addEventListener('resize', () => {
            this.width = this.canvas.width = window.innerWidth;
            this.height = this.canvas.height = window.innerHeight;
            if (this.world) {
                this.world.height = this.height;
                this.world.groundLevel = this.height - 50;
            }
        });
    }

    initLoader() {
        this.loader.loadSound('music', 'assets/sounds/music.mp3');
        this.loader.loadSound('jump', 'assets/sounds/jump.mp3');
        this.loader.loadSound('collect', 'assets/sounds/collect.mp3');
        this.loader.loadSound('win', 'assets/sounds/win.mp3');

        this.loader.onComplete = () => this.onAssetsReady();
        if (this.loader.totalAssets === 0) setTimeout(() => this.onAssetsReady(), 50);
    }

    onAssetsReady() {
        if (this.isLoaded) return;
        this.isLoaded = true;
        this.audio.init(this.loader);
        this.hideAllScreens();
        
        if (this.auth.isLoggedIn()) {
            this.showStartScreen();
        } else {
            if (this.screens.auth) this.screens.auth.classList.remove('hidden');
        }
    }

    hideAllScreens() {
        Object.values(this.screens).forEach(s => s && s.classList.add('hidden'));
    }

    showStartScreen() {
        this.hideAllScreens();
        if (this.ui.playerName && this.auth.currentUser) this.ui.playerName.innerText = this.auth.currentUser.name;
        if (this.screens.start) this.screens.start.classList.remove('hidden');
        this.audio.playOpening();
    }

    setupUI() {
        const bindUIBtn = (id, callback) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.onclick = (e) => { e.preventDefault(); callback(); };
                btn.ontouchend = (e) => { e.preventDefault(); callback(); };
            }
        };

        const authSubmit = document.getElementById('auth-submit-btn');
        const authInput = document.getElementById('auth-name');
        if (authSubmit && authInput) {
            authSubmit.onclick = (e) => {
                const name = authInput.value.trim();
                if (name) {
                    this.auth.signup(name, "pass");
                    this.showStartScreen();
                }
            };
        }

        bindUIBtn('play-btn', () => this.start(0));
        bindUIBtn('character-btn', () => {
            this.hideAllScreens();
            if (this.screens.charSelect) this.screens.charSelect.classList.remove('hidden');
        });
        bindUIBtn('settings-btn', () => {
            this.hideAllScreens();
            if (this.screens.settings) this.screens.settings.classList.remove('hidden');
        });
        bindUIBtn('close-settings-btn', () => this.showStartScreen());
        bindUIBtn('logout-btn', () => {
            this.auth.logout();
            location.reload();
        });
        bindUIBtn('settings-logout-btn', () => {
            this.auth.logout();
            location.reload();
        });
        bindUIBtn('confirm-char-btn', () => this.showStartScreen());
        bindUIBtn('next-btn', () => this.nextLevel());
        bindUIBtn('restart-btn', () => this.start(0));

        const cards = document.querySelectorAll('.char-card');
        cards.forEach(card => {
            const selectChar = () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.saveManager.data.selectedCharacter = card.dataset.char;
                this.saveManager.save();
            };
            card.onclick = selectChar;
            card.ontouchend = (e) => { e.preventDefault(); selectChar(); };
        });
    }

    start(levelIndex = 0) {
        if (!this.isLoaded) return;
        if (levelIndex >= LEVELS.length) levelIndex = 0;

        this.currentLevelIndex = levelIndex;
        const levelData = LEVELS[this.currentLevelIndex];
        if (!levelData) return;

        this.score = 0;
        this.gameOver = false;
        this.cameraX = 0;
        
        this.world = new World(this, levelData);
        this.player = new Player(this, this.saveManager.data.selectedCharacter);
        
        if (this.ui.score) this.ui.score.innerText = "0";
        
        const totalItems = (levelData.teddies ? levelData.teddies.length : 0) + 
                          (levelData.apples ? levelData.apples.length : 0) +
                          (levelData.flowers ? levelData.flowers.length : 0);
        
        if (this.ui.totalTeddies) this.ui.totalTeddies.innerText = totalItems;
        if (this.ui.levelName) this.ui.levelName.innerText = levelData.name;

        this.hideAllScreens();
        if (this.ui.hud) this.ui.hud.classList.remove('hidden');
        
        if (window.innerWidth < 1024 && this.ui.touch) {
            this.ui.touch.classList.remove('hidden');
            this.ui.touch.style.display = 'flex';
        } else if (this.ui.touch) {
            this.ui.touch.classList.add('hidden');
        }

        if (levelData.dialogue && this.ui.dialogue && this.ui.dialogueText && this.auth.currentUser) {
            this.ui.dialogue.classList.remove('hidden');
            this.ui.dialogueText.innerText = `${this.auth.currentUser.name}, ${levelData.dialogue}`;
            setTimeout(() => { if (this.ui.dialogue) this.ui.dialogue.classList.add('hidden'); }, 5000);
        }

        this.audio.playMusic();
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    loop(timestamp) {
        if (this.gameOver) return;
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.update(deltaTime);
        this.draw();
        requestAnimationFrame((ts) => this.loop(ts));
    }

    update(deltaTime) {
        if (!this.player || !this.world) return;
        this.player.update(this.input);
        this.world.update();
        this.particles.update();
        
        if (this.player.x > this.cameraX + this.width * 0.4) {
            this.cameraX = this.player.x - this.width * 0.4;
        }
        if (this.cameraX < 0) this.cameraX = 0;
        if (this.cameraX > this.world.width - this.width) this.cameraX = this.world.width - this.width;
        
        this.checkCollisions();
    }

    checkCollisions() {
        if (!this.world || !this.player) return;
        
        // Use Array.from or spread if there is any chance they aren't arrays, but here they are initialized
        const teddies = this.world.teddies || [];
        teddies.forEach((teddy) => {
            if (!teddy.markedForDeletion && this.checkRectCollision(this.player, teddy)) {
                teddy.markedForDeletion = true;
                this.score++;
                if (this.ui.score) this.ui.score.innerText = this.score;
                this.audio.playSound('collect');
                this.particles.emit(teddy.x + 15, teddy.y + 15, '#FFD700', 15);
            }
        });
        this.world.teddies = teddies.filter(t => !t.markedForDeletion);

        const apples = this.world.apples || [];
        apples.forEach((apple) => {
            if (!apple.markedForDeletion && this.checkRectCollision(this.player, apple)) {
                apple.markedForDeletion = true;
                this.score++;
                if (this.ui.score) this.ui.score.innerText = this.score;
                this.audio.playSound('collect');
                this.particles.emit(apple.x + 12, apple.y + 12, '#FF0000', 10);
                this.world.gates.forEach(gate => gate.current++);
            }
        });
        this.world.apples = apples.filter(a => !a.markedForDeletion);

        const flowers = this.world.flowers || [];
        flowers.forEach(flower => {
            if (!flower.collected && this.checkRectCollision(this.player, flower)) {
                flower.collected = true;
                this.player.holdingFlower = flower;
                this.audio.playSound('collect');
            }
        });

        const baskets = this.world.baskets || [];
        baskets.forEach(basket => {
            if (!basket.full && this.player.holdingFlower && this.checkRectCollision(this.player, basket)) {
                if (this.player.holdingFlower.color === basket.color) {
                    basket.full = true;
                    this.player.holdingFlower = null;
                    this.score++;
                    if (this.ui.score) this.ui.score.innerText = this.score;
                    this.audio.playSound('collect');
                    this.particles.emit(basket.x + 25, basket.y, basket.color, 20);
                    // Open the gate in Level 2
                    this.world.gates.forEach(gate => gate.current++);
                }
            }
        });

        const trampolines = this.world.trampolines || [];
        trampolines.forEach(t => {
            if (this.player.vy > 0 && this.checkRectCollision(this.player, t)) {
                this.player.vy = this.player.jumpForce * 1.8;
                this.audio.playSound('jump');
            }
        });
        
        const umbrellas = this.world.umbrellas || [];
        umbrellas.forEach(u => {
            if (!u.markedForDeletion && this.checkRectCollision(this.player, u)) {
                u.markedForDeletion = true;
                this.player.hasUmbrella = true;
                this.audio.playSound('collect');
            }
        });

        const puddles = this.world.puddles || [];
        puddles.forEach(puddle => {
            if (this.checkRectCollision(this.player, puddle)) {
                if (this.player.vy > 5) {
                    this.particles.emit(this.player.x + 20, this.world.groundLevel, '#8B4513', 5);
                }
                this.player.vx *= 0.4;
            }
        });

        const gates = this.world.gates || [];
        gates.forEach(gate => {
            if (!gate.open && 
                this.player.x + this.player.width > gate.x && 
                this.player.x < gate.x + gate.width &&
                this.player.y + this.player.height > gate.y) {
                this.player.x = gate.x - this.player.width;
            }
        });

        if (this.player.x > this.world.width - 150) {
            this.levelWin();
        }
    }

    checkRectCollision(rect1, rect2) {
        if (!rect1 || !rect2) return false;
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    draw() {
        if (!this.world || !this.player) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.save();
        this.ctx.translate(-this.cameraX, 0);
        this.world.draw(this.ctx);
        this.player.draw(this.ctx);
        this.particles.draw(this.ctx);
        this.ctx.restore();
    }

    levelWin() {
        if (this.gameOver) return;
        this.gameOver = true;
        this.audio.playSound('win');
        this.saveManager.updateScore(this.currentLevelIndex, this.score);
        this.saveManager.unlockNextLevel(this.currentLevelIndex);
        
        const currentLevel = LEVELS[this.currentLevelIndex];
        
        if (this.currentLevelIndex < LEVELS.length - 1) {
            if (this.screens.levelComplete) {
                if (this.ui.fact && currentLevel) this.ui.fact.innerText = currentLevel.learningFact;
                this.screens.levelComplete.classList.remove('hidden');
            }
        } else {
            if (this.screens.win) this.screens.win.classList.remove('hidden');
        }
    }

    nextLevel() {
        this.start(this.currentLevelIndex + 1);
    }
}
