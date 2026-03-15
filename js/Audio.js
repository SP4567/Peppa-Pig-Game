export class AudioManager {
    constructor() {
        this.ctx = null;
        this.loader = null;
        this.enabled = true;
    }

    init(loader) {
        this.loader = loader;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn("Web Audio not supported");
        }

        if (this.loader.sounds.music) {
            this.loader.sounds.music.loop = true;
            this.loader.sounds.music.volume = 0.3;
        }
    }

    playMusic() {
        if (!this.enabled || !this.loader || !this.loader.sounds.music) return;
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
        this.loader.sounds.music.play().catch(() => {});
    }

    stopMusic() {
        const music = this.loader?.sounds.music;
        if (music) {
            music.pause();
            music.currentTime = 0;
        }
    }

    playSound(name) {
        if (!this.enabled) return;
        const sound = this.loader?.sounds[name];
        if (sound && sound.readyState >= 2 && sound.duration > 0) {
            const clone = sound.cloneNode();
            clone.volume = 0.5;
            clone.play().catch(() => this.playProceduralBeep(name));
        } else {
            this.playProceduralBeep(name);
        }
    }

    playOpening() {
        if (!this.enabled || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        
        // Happy little jingle
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.connect(g);
            g.connect(this.ctx.destination);
            osc.frequency.setValueAtTime(freq, now + i * 0.15);
            g.gain.setValueAtTime(0.1, now + i * 0.15);
            g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);
            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 0.3);
        });
    }

    playProceduralBeep(type) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        const now = this.ctx.currentTime;
        if (type === 'jump') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'collect') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'win') {
            [440, 554, 659, 880].forEach((f, i) => {
                const nOsc = this.ctx.createOscillator();
                const nG = this.ctx.createGain();
                nOsc.type = 'sine';
                nOsc.frequency.setValueAtTime(f, now + i * 0.1);
                nOsc.connect(nG);
                nG.connect(this.ctx.destination);
                nG.gain.setValueAtTime(0.05, now + i * 0.1);
                nG.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
                nOsc.start(now + i * 0.1);
                nOsc.stop(now + i * 0.1 + 0.2);
            });
        }
    }
}
