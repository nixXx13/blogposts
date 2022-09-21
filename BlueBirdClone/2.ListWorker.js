const Resource = require("./utils/Resource");
const Worker = require("./utils/Worker");

const start = Date.now();
const getTime = () => (Date.now() - start)/1000;

class ListWorker extends Worker{
    taskIdList
    constructor(taskIdList) {
        super()
        this.taskIdList = taskIdList;
        this.data = [];
    }

    async work() {
        const workerReference = this;
        const currentTaskId = this.taskIdList.shift();
        if ( !currentTaskId ) return;
        await new Promise( async (resolve) => {
            console.log(`${getTime()}s worker ${this.id}: starting ${currentTaskId}`);
            const currentData = await db.getData(
                currentTaskId,
                // makes even tasks duration 1 sec and odd tasks 2 sec
                currentTaskId%2 === 0 ? 1000 : 2000,
            );
            console.log(`${getTime()}s worker ${this.id}: finished ${currentTaskId}`);
            this.data.push(currentData);
            resolve(workerReference.work());
        })
        return this.data;
    }

}

const MAX_OPEN_CONNECTIONS = 2;
const db = new Resource(MAX_OPEN_CONNECTIONS);

async function map() {

    const taskIds = [11,22,33];
    const oddTaskIds = taskIds.filter( taskId => taskId%2 === 1);
    const evenTaskIds = taskIds.filter( taskId => taskId%2 === 0);

    const workers = [
        new ListWorker(oddTaskIds),
        new ListWorker(evenTaskIds),
    ];

    const data = await Promise.all(
        workers.map( worker => worker.work() )
    );

    console.log(`${getTime()}s all data was fetched ` ,data.flat());
    // need to re-organize results by original order
}

(async function() {
    await map();
}());