export class SaveManager {
    constructor() {
        this.key = 'peppa_adventure_save';
        this.data = this.load();
    }

    load() {
        try {
            const saved = localStorage.getItem(this.key);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn("Could not access localStorage. Progress will not be saved.", e);
        }
        return {
            unlockedLevels: 1,
            totalTeddies: 0,
            bestScores: [0, 0, 0, 0],
            selectedCharacter: 'peppa'
        };
    }

    save(data = this.data) {
        this.data = data;
        try {
            localStorage.setItem(this.key, JSON.stringify(this.data));
        } catch (e) {
            console.warn("Could not save to localStorage.", e);
        }
    }

    unlockNextLevel(currentLevelIndex) {
        if (currentLevelIndex + 2 > this.data.unlockedLevels) {
            this.data.unlockedLevels = Math.min(4, currentLevelIndex + 2);
            this.save();
        }
    }

    updateScore(levelIndex, score) {
        if (score > this.data.bestScores[levelIndex]) {
            this.data.bestScores[levelIndex] = score;
            this.save();
        }
    }
}
