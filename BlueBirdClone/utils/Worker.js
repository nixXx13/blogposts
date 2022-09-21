class Worker {
    static existingWorkers = 0;
    id;
    constructor() {
        Worker.existingWorkers+=1;
        this.id = Worker.existingWorkers;
    }
}

module.exports = Worker;