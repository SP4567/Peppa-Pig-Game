export class AuthManager {
    constructor() {
        this.currentUser = null;
        this.usersKey = 'peppa_game_users';
        this.sessionKey = 'peppa_active_user';
        this.loadSession();
    }

    loadSession() {
        try {
            const active = localStorage.getItem(this.sessionKey);
            if (active) {
                this.currentUser = JSON.parse(active);
            }
        } catch (e) {
            console.warn("Auth session error", e);
        }
    }

    getUsers() {
        try {
            const users = localStorage.getItem(this.usersKey);
            return users ? JSON.parse(users) : [];
        } catch (e) {
            return [];
        }
    }

    signup(name, password) {
        const users = this.getUsers();
        if (users.find(u => u.name === name)) {
            return { success: false, message: "User already exists!" };
        }
        const newUser = { name, password, progress: 1 };
        users.push(newUser);
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        this.login(name, password);
        return { success: true };
    }

    login(name, password) {
        const users = this.getUsers();
        const user = users.find(u => u.name === name && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem(this.sessionKey, JSON.stringify(user));
            return { success: true };
        }
        return { success: false, message: "Invalid name or password." };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }
}
