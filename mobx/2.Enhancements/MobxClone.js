
const pendingObserversMap = new Map();
const isMobx = Symbol("isMobx")

function makeAutoObservable(obj) {
    const propertyNames = Object.keys(obj)
        .filter( properyName => typeof obj[properyName] !== 'function' );

    const objCopy = {};
    propertyNames.forEach(propertyName => objCopy[propertyName] = obj[propertyName] );

    const propertyNameToObservers = new Map();

    propertyNames.forEach( propertyName => {
        Object.defineProperty( obj, propertyName, {
            get(){
                if ( pendingObserversMap.has(propertyName) ) {
                    const { observer, propName } = pendingObserversMap.get(propertyName);
                    if ( !propertyNameToObservers.has(propertyName) ) {
                        propertyNameToObservers.set(propertyName, []);
                    }
                    const observers = propertyNameToObservers.get(propertyName);
                    observers.push({ observer, propName } );
                }
                return objCopy[propertyName];
            },
            set(value){
                objCopy[propertyName] = value;
                const observers = propertyNameToObservers.get(propertyName) || [];
                observers.forEach( ({ observer, propName }) => observer({[propName]:obj}) );
                return value;
            }
        });
    })
    obj[isMobx] = true;
}

function observer(_component) {

    let isMounted = false;
    let _props = {}
    const component = (props) => {
        if ( !isMounted ) {
            const propNames = Object.keys(props);
            propNames.forEach(propName => {
                if (props[propName][isMobx]) {
                    const propFields = Object.keys(props[propName]);
                    propFields.forEach( propField => pendingObserversMap.set(propField, {observer: component, propName}) );
                }
            })
        }
        _props = { ..._props, ...props };
        _component(_props);
        if ( !isMounted ) {
            pendingObserversMap.clear();
            isMounted = true;
        }
    }
    return component;
}


module.exports = {
    makeAutoObservable,
    observer,
}