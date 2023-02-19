const { makeAutoObservable } = require('./MobxClone');

class Timer {
    secondsPassed = 0;
    format = '24h';
    name = 'myTimer';

    constructor() {
        makeAutoObservable(this);
    }

    tick() {
        this.secondsPassed += 1
    }

    changeFormat(format) {
        this.format = format;
    }

    changeName(name) { 
        this.name = name;
    }
}

module.exports = { 
    Timer,
}