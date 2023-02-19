const { makeAutoObservable } = require('./MobxClone');

class Timer {
    secondsPassed = 0;

    constructor() {
        makeAutoObservable(this);
    }

    tick() {
        this.secondsPassed += 1
    }
}

module.exports = { 
    Timer,
}