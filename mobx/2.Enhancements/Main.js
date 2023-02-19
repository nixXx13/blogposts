const { TimerView } = require('./TimerView');
const { Timer } = require('./Timer');

const myTimer = new Timer()
const title = { text:"Hi" };

TimerView({timer: myTimer, title});                                     // Title: Hi | secondsPassed: 0 | format: 24h              
myTimer.tick();                                                         // Title: Hi | secondsPassed: 1 | format: 24h  
myTimer.changeFormat('12h');                                            // Title: Hi | secondsPassed: 1 | format: 12h  

myTimer.tick();                                                         // Title: Hi | secondsPassed: 2 | format: 12h  
myTimer.changeName('mySuperTimer');                                     // no print 
TimerView({timer: myTimer, title: {...title, text:"Bye"} });            // Title: Bye | secondsPassed: 2 | format: 12h  
myTimer.tick();                                                         // Title: Bye | secondsPassed: 3 | format: 12h      
