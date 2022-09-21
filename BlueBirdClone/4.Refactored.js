const Resource = require("./utils/Resource");
const Worker = require("./utils/Worker");
const Promise = require("bluebird");

const start = Date.now();
const getTime = () => (Date.now() - start)/1000;

class PullWorker extends Worker{
    taskIdList
    getCurrentTaskIndex
    data
    mapper
    constructor(taskIdList, mapper, getCurrentTaskIndex, data) {
        super()
        this.taskIdList = taskIdList;
        this.getCurrentTaskIndex = getCurrentTaskIndex;
        this.data = data;
        this.mapper = mapper;
    }

    async work() {
        const workerReference = this;
        const currentTaskIndex = this.getCurrentTaskIndex();
        const currentTaskId = this.taskIdList[currentTaskIndex];
        if ( !currentTaskId ) return;
        await new Promise( async (resolve) => {
            console.log(`${getTime()} worker ${this.id}: starting ${currentTaskId}`);
            const currentData = await this.mapper(
                currentTaskId,
                // makes even tasks duration 1 sec and odd tasks 2 sec
                currentTaskId%2 === 0 ? 1000 : 2000,
            );
            console.log(`${getTime()} worker ${this.id}: finished ${currentTaskId}`);
            this.data[currentTaskIndex] = currentData;
            resolve(workerReference.work());
        })
        return this.data;
    }
}

class ClonedPromise {
    static async map(arr, mapper) {

        let currentTaskId = 0;
        const getCurrentTaskIndex = () => {
            currentTaskId+=1;
            return currentTaskId-1;
        }
        const data = new Array(arr.length).fill(null);
        const workers = [
            new PullWorker(arr, mapper, getCurrentTaskIndex, data),
            new PullWorker(arr, mapper, getCurrentTaskIndex, data),
        ]

        await Promise.all(
            workers.map( worker => worker.work() )
        );
        return data;
    }
}


const MAX_OPEN_CONNECTIONS = 2;
const db = new Resource(MAX_OPEN_CONNECTIONS);
const RUN_CLONE_PROMISE = true;

(async function() {
    const taskIds = [11,22,33];
    let data;

    if (RUN_CLONE_PROMISE) {
        const mapper = async (taskId, delay) => await db.getData(taskId, delay)
        data = await ClonedPromise.map(taskIds, mapper);
    } else {
        const mapper = async (taskId) => {
            const delay = taskId%2 === 0 ? 1000 : 2000;
            console.log(`${getTime()} starting ${taskId}`);
            const data = await db.getData(taskId, delay);
            console.log(`${getTime()} finished ${taskId}`);
            return data;
        }
        data = await Promise.map( taskIds, mapper, {
            concurrency: 2
        });
    }
    console.log(`${getTime()}s all data was fetched ` ,data);
}());