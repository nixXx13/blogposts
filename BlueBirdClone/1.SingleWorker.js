const Resource = require("./utils/Resource");
const Worker = require("./utils/Worker");

const start = Date.now();
const getTime = () => (Date.now() - start)/1000;

class SingleWorker extends Worker{
    taskId
    constructor(taskId) {
        super();
        this.taskId = taskId;
    }

    async work() {
        console.log(`${getTime()}s worker ${this.id}: starting ${this.taskId}`);
        const data = await db.getData(this.userId);
        console.log(`${getTime()}s worker ${this.id}: finished ${this.taskId}`);
        return data;
    }

}

const MAX_OPEN_CONNECTIONS = 2;
const db = new Resource(MAX_OPEN_CONNECTIONS);

async function main() {

    const taskIds = [11,22,33];
    const workers = taskIds
        .map( taskId => new SingleWorker(taskId) );
    const data = await Promise.all(
        workers.map( worker => worker.work() )
    );

    console.log(`${getTime()}s all data was fetched ` ,data);
}

(async function() {
    await main();
}());