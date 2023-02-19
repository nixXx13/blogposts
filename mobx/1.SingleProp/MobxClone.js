
let pendingObserver;

function makeAutoObservable(obj) {
    const propertyNames = Object.keys(obj);

    const objCopy = {};
    propertyNames.forEach(propertyName => objCopy[propertyName] = obj[propertyName] );

    const _observers = [];

    propertyNames.forEach( propertyName => {
        Object.defineProperty( obj, propertyName, {
            get(){
                if ( pendingObserver ) {
                    _observers.push(pendingObserver);
                }
                return objCopy[propertyName];
            },
            set(value){
                objCopy[propertyName] = value;
                _observers.forEach( observer => observer({[propertyName]:value}) );
                return value;
            }
        });
    })
}

function observer(_component) {

    let isMounted = false;
    const component = (props) => {
        if ( !isMounted ) {
            pendingObserver = component;
        }
        _component(props);
        if ( !isMounted ) {
            pendingObserver = null;
            isMounted = true;
        }
    }
    return component;
}


module.exports = {
    makeAutoObservable,
    observer,
}