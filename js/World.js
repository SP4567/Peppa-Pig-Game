import { Teddy, MudPuddle, Trampoline, Umbrella, Flower, Basket, Gate, Apple } from './Entities.js';

export class World {
    constructor(game, levelData) {
        this.game = game;
        this.data = levelData;
        this.width = levelData.width || 2000;
        this.height = game.height;
        this.groundLevel = this.height - 50;

        // Initialize all entity arrays to empty arrays to prevent "forEach" errors
        this.teddies = [];
        this.apples = [];
        this.puddles = [];
        this.trampolines = [];
        this.umbrellas = [];
        this.platforms = levelData.platforms || [];
        this.flowers = [];
        this.baskets = [];
        this.gates = [];
        this.clouds = [];
        
        this.layers = [
            { speed: 0.1, items: [] }, 
            { speed: 0.3, items: [] }, 
        ];

        this.initLevel();
    }

    initLevel() {
        // Background Parallax
        for(let i=0; i<10; i++) {
            this.layers[0].items.push({ x: i * 800, y: this.height - 400, w: 900, h: 400, color: this.data.groundColor || '#32CD32' });
            this.layers[1].items.push({ x: i * 400, y: this.height - 250, w: 100, h: 200, color: '#228B22' });
        }

        // Clouds
        for (let i = 0; i < 10; i++) {
            this.clouds.push({
                x: Math.random() * this.width,
                y: Math.random() * 200 + 20,
                size: Math.random() * 20 + 30,
                speed: Math.random() * 0.2 + 0.1
            });
        }

        // Safe property loading - always check if data exists before calling forEach
        if (this.data.puddles) {
            this.data.puddles.forEach(p => this.puddles.push(new MudPuddle(p.x, this.groundLevel, p.width)));
        }
        
        if (this.data.teddies) {
            this.data.teddies.forEach(t => this.teddies.push(new Teddy(t.x, this.groundLevel + t.y)));
        }
        
        if (this.data.apples) {
            this.data.apples.forEach(a => this.apples.push(new Apple(a.x, this.groundLevel + a.y)));
        }
        
        if (this.data.trampolines) {
            this.data.trampolines.forEach(tr => this.trampolines.push(new Trampoline(tr.x, this.groundLevel + tr.y)));
        }
        
        if (this.data.umbrellas) {
            this.data.umbrellas.forEach(u => this.umbrellas.push(new Umbrella(u.x, this.groundLevel + u.y)));
        }
        
        if (this.data.flowers) {
            this.data.flowers.forEach(f => this.flowers.push(new Flower(f.x, this.groundLevel + f.y, f.color)));
        }
        
        if (this.data.baskets) {
            this.data.baskets.forEach(b => this.baskets.push(new Basket(b.x, this.groundLevel + b.y, b.color)));
        }
        
        if (this.data.gates) {
            this.data.gates.forEach(g => this.gates.push(new Gate(g.x, this.groundLevel + g.y, g.required)));
        }
    }

    update() {
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.speed;
            if (cloud.x + cloud.size < 0) cloud.x = this.width + cloud.size;
        });
        this.teddies.forEach(teddy => teddy.update());
        this.apples.forEach(apple => apple.update());
        this.gates.forEach(gate => gate.update());
    }

    draw(ctx) {
        ctx.fillStyle = this.data.skyColor || '#87CEEB';
        ctx.fillRect(this.game.cameraX, 0, this.game.width, this.height);
        
        this.layers.forEach(layer => {
            ctx.save();
            ctx.translate(-this.game.cameraX * layer.speed, 0);
            layer.items.forEach(item => {
                ctx.fillStyle = item.color;
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(item.x + item.w/2, item.y + item.h, item.w/2, Math.PI, 0);
                ctx.fill();
            });
            ctx.restore();
        });

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.clouds.forEach(cloud => {
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.size * 0.5, cloud.y - cloud.size * 0.2, cloud.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.fillStyle = this.data.groundColor || '#7CFC00';
        ctx.fillRect(0, this.groundLevel, this.width, this.height - this.groundLevel);

        this.platforms.forEach(plat => {
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(plat.x, this.groundLevel + plat.y, plat.w, 20);
            if (plat.shape) {
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.font = '20px Arial';
                const label = plat.shape.toUpperCase();
                ctx.fillText(label, plat.x + plat.w/2 - 20, this.groundLevel + plat.y - 10);
            }
        });

        this.puddles.forEach(puddle => puddle.draw(ctx));
        this.trampolines.forEach(t => t.draw(ctx));
        this.umbrellas.forEach(u => u.draw(ctx));
        this.flowers.forEach(f => f.draw(ctx));
        this.baskets.forEach(b => b.draw(ctx));
        this.gates.forEach(g => g.draw(ctx));
        this.teddies.forEach(teddy => teddy.draw(ctx));
        this.apples.forEach(apple => apple.draw(ctx));

        this.drawHouse(ctx, this.width - 200, this.groundLevel - 150);
    }

    drawHouse(ctx, x, y) {
        ctx.fillStyle = '#FFFFE0';
        ctx.fillRect(x, y + 50, 150, 100);
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.moveTo(x - 20, y + 50);
        ctx.lineTo(x + 75, y);
        ctx.lineTo(x + 170, y + 50);
        ctx.fill();
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 60, y + 90, 30, 60);
    }
}
