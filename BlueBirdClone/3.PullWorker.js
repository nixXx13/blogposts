const Resource = require("./utils/Resource");
const Worker = require("./utils/Worker");

const start = Date.now();
const getTime = () => (Date.now() - start)/1000;

class PullWorker extends Worker{
    taskIdList
    getCurrentTaskIndex
    data
    constructor(taskIdList, getCurrentTaskIndex, data) {
        super()
        this.taskIdList = taskIdList;
        this.getCurrentTaskIndex = getCurrentTaskIndex;
        this.data = data;
    }

    async work() {
        const currentTaskIndex = this.getCurrentTaskIndex();
        const currentTaskId = this.taskIdList[currentTaskIndex];
        if ( !currentTaskId ) return this.data;
        console.log(`${getTime()} worker ${this.id}: starting ${currentTaskId}`);
        const currentData = await db.getData(
            currentTaskId,
            // makes even tasks duration 1 sec and odd tasks 2 sec
            currentTaskId%2 === 0 ? 1000 : 2000,
        );
        console.log(`${getTime()} worker ${this.id}: finished ${currentTaskId}`);
        this.data[currentTaskIndex] = currentData;
        return this.work();
    }
}

const MAX_OPEN_CONNECTIONS = 2;
const db = new Resource(MAX_OPEN_CONNECTIONS);

async function main() {

    const taskIds = [11,22,33];
    let currentTaskId = 0;
    const getCurrentTaskIndex = () => {
        currentTaskId+=1;
        return currentTaskId-1;
    }
    const data = new Array(taskIds.length).fill(null);
    const workers = [
        new PullWorker(taskIds, getCurrentTaskIndex, data),
        new PullWorker(taskIds, getCurrentTaskIndex, data),
    ]

    await Promise.all(
        workers.map( worker => worker.work() )
    );

    console.log(`${getTime()}s all data was fetched ` ,data);
}

(async function() {
    await main();
}());