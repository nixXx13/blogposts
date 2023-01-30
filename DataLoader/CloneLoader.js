
class CloneLoader {
    keys;
    resolvers;
    batchLoadingFunction;
    constructor(batchLoadingFunction) {
        this.keys = [];
        this.resolvers = [];
        this.batchLoadingFunction = batchLoadingFunction;
    }

    async load(key) {
        // this if makes sure fetchAndDispatch is executed only once per cycle
        if( this.keys.length === 0 ) {
            const fetchAndDispatch = async () => {
                const results = await this.batchLoadingFunction(this.keys);
                for ( let i=0; i<results.length; i++ ) {
                    const resolver = this.resolvers[i];
                    const result = results[i];
                    resolver(result);
                }
                // cleaning up
                this.keys = [];
                this.resolvers = [];
            }
            process.nextTick(fetchAndDispatch);
            // setImmediate(fetchAndDispatch);
        }
        this.keys.push(key);
        return new Promise( (resolve) => {
            this.resolvers.push(resolve);
        });
    }
}

module.exports = {
    CloneLoader
}