export class AssetLoader {
    constructor() {
        this.images = {};
        this.sounds = {};
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.onProgress = null;
        this.onComplete = null;
    }

    loadImage(name, src) {
        this.totalAssets++;
        const img = new Image();
        img.src = src;
        img.onload = () => this.assetLoaded();
        img.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
            this.assetLoaded(); // Proceed anyway
        };
        this.images[name] = img;
    }

    // Sounds are background assets that shouldn't block the initial load
    loadSound(name, src) {
        const audio = new Audio();
        audio.src = src;
        audio.oncanplaythrough = () => {
            console.log(`Sound ready: ${name}`);
        };
        audio.onerror = () => {
            console.warn(`Sound missing or invalid: ${src}`);
        };
        this.sounds[name] = audio;
    }

    assetLoaded() {
        this.loadedAssets++;
        if (this.onProgress) {
            this.onProgress(this.loadedAssets / Math.max(1, this.totalAssets));
        }
        if (this.loadedAssets === this.totalAssets && this.onComplete) {
            this.onComplete();
        }
    }

    getImg(name) { return this.images[name]; }
    getSound(name) { return this.sounds[name]; }
}
