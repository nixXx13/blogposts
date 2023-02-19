const { observer } = require('./MobxClone');

const TimerView = observer(({ timer, title }) => (
    console.log(`Title: ${title.text} | secondsPassed: ${timer.secondsPassed} | format: ${timer.format}`)
))

module.exports = { 
    TimerView,
}