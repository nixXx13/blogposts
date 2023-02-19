const { observer } = require('./MobxClone');

const TimerView = observer((timer) => ( 
    console.log( `SecondsPassed: ${timer.secondsPassed}` )
))

module.exports = { 
    TimerView,
}