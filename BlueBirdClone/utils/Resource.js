const dummyData = new Map([
    [11, { id:11, details: "111" }],
    [22, { id:22, details: "222" }],
    [33, { id:33, details: "333" }],
])

class Resource {

    constructor(maxOpenConnections) {
        this.openConnections = 0;
        this.maxOpenConnections = maxOpenConnections;
    }

    async getData(
        id,
        delay = 1000,
    ) {
        this.openConnections += 1
        if (this.openConnections > this.maxOpenConnections) {
            throw new Error('Too many concurrent connections!')
        }
        const randomNum = await new Promise( resolve => {
            setTimeout(async () => {
                resolve( dummyData.get(id) );
            }, delay)
        });
        this.openConnections -= 1;
        return {
            id,
            data: randomNum,
        };
    }
}

module.exports = Resource;