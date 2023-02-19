const { TimerView } = require('./TimerView');
const { Timer } = require('./Timer');

const myTimer = new Timer()

TimerView(myTimer);     // SecondsPassed: 0
myTimer.tick();         // SecondsPassed: 1
myTimer.tick();         // SecondsPassed: 2
