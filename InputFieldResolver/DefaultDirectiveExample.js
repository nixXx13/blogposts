const defaultDirectiveExample = ( resolver ) => {
    const wrappedFunction = (...args) => {
        // args are resolver arguments - [parent, args, contextValue, info]
        console.log("defaultResolver before", args);
        const ret = resolver(...args);
        console.log("defaultResolver after");
        return ret;
    }
    return wrappedFunction;
}

module.exports = {
    defaultDirectiveExample
}