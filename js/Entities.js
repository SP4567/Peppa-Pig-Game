export class Entity {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.markedForDeletion = false;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update(deltaTime) {}
}

export class Player extends Entity {
    constructor(game, charType = 'peppa') {
        const config = charType === 'peppa' 
            ? { width: 40, height: 40, color: '#FFC0CB', speed: 5, jump: -16 }
            : { width: 30, height: 30, color: '#87CEEB', speed: 6, jump: -18 };
        
        super(50, 200, config.width, config.height, config.color);
        this.charType = charType;
        this.game = game;
        this.vx = 0;
        this.vy = 0;
        this.speed = config.speed;
        this.jumpForce = config.jump;
        this.gravity = 0.8;
        this.grounded = false;
        this.hasUmbrella = false;
        this.isGliding = false;
        this.holdingFlower = null;
    }

    update(input) {
        const friction = this.game.world.data.friction || 1;
        if (input.left) this.vx = -this.speed * friction;
        else if (input.right) this.vx = this.speed * friction;
        else this.vx *= 0.8;

        this.x += this.vx;
        if (this.x < 0) this.x = 0;

        if (input.jump && this.grounded) {
            this.vy = this.jumpForce;
            this.grounded = false;
            this.game.audio.playSound('jump');
        }

        const gravityScale = this.game.world.data.gravityScale || 1;
        this.isGliding = this.hasUmbrella && input.jump && this.vy > 0;
        const currentGravity = this.isGliding ? (this.gravity * 0.2) : (this.gravity * gravityScale);

        this.vy += currentGravity;
        this.y += this.vy;

        if (this.y + this.height > this.game.world.groundLevel) {
            this.y = this.game.world.groundLevel - this.height;
            this.vy = 0;
            this.grounded = true;
        } else {
            this.grounded = false;
        }

        this.game.world.platforms.forEach(plat => {
            const platY = this.game.world.groundLevel + plat.y;
            
            // Vertical collision (landing on top)
            if (this.vy > 0 && 
                this.x + this.width > plat.x && 
                this.x < plat.x + plat.w &&
                this.y + this.height > platY && 
                this.y + this.height < platY + 20) {
                this.y = platY - this.height;
                this.vy = 0;
                this.grounded = true;
            }

            // Horizontal collision (blocking from sides)
            if (this.y + this.height > platY + 5 && this.y < platY + 20) {
                if (this.x + this.width > plat.x && this.x < plat.x + plat.w) {
                    if (this.vx > 0 && this.x < plat.x) {
                        this.x = plat.x - this.width;
                        this.vx = 0;
                    } else if (this.vx < 0 && this.x + this.width > plat.x + plat.w) {
                        this.x = plat.x + plat.w;
                        this.vx = 0;
                    }
                }
            }
        });
    }

    draw(ctx) {
        if (this.hasUmbrella) {
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y - 10, 30, Math.PI, 0);
            ctx.fill();
        }

        // Draw held flower
        if (this.holdingFlower) {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x + this.width/2, this.y - 10, 4, 20);
            ctx.fillStyle = this.holdingFlower.color;
            ctx.beginPath();
            ctx.arc(this.x + this.width/2 + 2, this.y - 10, 8, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.charType === 'peppa' ? '#FF69B4' : '#1E90FF';
        const snoutX = this.vx >= 0 ? (this.x + this.width - 5) : (this.x + 5);
        ctx.beginPath();
        ctx.ellipse(snoutX, this.y + this.height/3, 8, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'white';
        const eyeX = this.vx >= 0 ? (this.x + this.width/2 + 5) : (this.x + this.width/2 - 5);
        ctx.beginPath();
        ctx.arc(eyeX, this.y + this.height/4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(eyeX, this.y + this.height/4, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = this.charType === 'peppa' ? '#FF4500' : '#4169E1';
        ctx.fillRect(this.x, this.y + this.height*0.7, this.width, this.height*0.3);
    }
}

export class Teddy extends Entity {
    constructor(x, y) {
        super(x, y, 30, 30, '#8B4513');
        this.bobAngle = 0;
    }
    update() {
        this.bobAngle += 0.1;
        this.y += Math.sin(this.bobAngle) * 0.5;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 10, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 5, this.y + 5, 4, 0, Math.PI * 2);
        ctx.arc(this.x + 25, this.y + 5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(this.x + 10, this.y + 20, 10, 10);
    }
}

export class Apple extends Entity {
    constructor(x, y) {
        super(x, y, 25, 25, '#FF0000');
        this.bobAngle = Math.random() * Math.PI;
    }
    update() {
        this.bobAngle += 0.05;
        this.y += Math.sin(this.bobAngle) * 0.3;
    }
    draw(ctx) {
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(this.x + 12, this.y + 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#008000';
        ctx.beginPath();
        ctx.ellipse(this.x + 12, this.y + 2, 6, 3, Math.PI/4, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class MudPuddle extends Entity {
    constructor(x, y, width) {
        super(x, y + 20, width, 10, '#8B4513');
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x + this.width/2, this.y, this.width/2, 10, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class Trampoline extends Entity {
    constructor(x, y) {
        super(x, y, 60, 20, '#333');
    }
    draw(ctx) {
        ctx.fillStyle = '#555';
        ctx.fillRect(this.x, this.y + 10, this.width, 10);
        ctx.fillStyle = '#00F';
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, 5);
    }
}

export class Umbrella extends Entity {
    constructor(x, y) {
        super(x, y, 30, 30, '#F00');
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 15, 15, Math.PI, 0);
        ctx.fill();
    }
}

export class InteractiveObj extends Entity {
    constructor(x, y, width, height, color, type) {
        super(x, y, width, height, color);
        this.type = type;
        this.collected = false;
    }
}

export class Flower extends InteractiveObj {
    constructor(x, y, color) {
        super(x, y, 20, 40, color, 'flower');
    }
    draw(ctx) {
        if (this.collected) return;
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x + 8, this.y + 10, 4, 30);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 10, 10, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class Basket extends InteractiveObj {
    constructor(x, y, color) {
        super(x, y, 50, 40, color, 'basket');
        this.full = false;
    }
    draw(ctx) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y + 10, 50, 30);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y + 5, 50, 5);
        if (this.full) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x + 25, this.y, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

export class Gate extends Entity {
    constructor(x, y, totalRequired) {
        super(x, y, 20, 100, '#555');
        this.totalRequired = totalRequired;
        this.current = 0;
        this.open = false;
    }
    update() {
        if (this.current >= this.totalRequired) this.open = true;
    }
    draw(ctx) {
        if (this.open) return;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`${this.current}/${this.totalRequired}`, this.x - 20, this.y - 10);
    }
}
