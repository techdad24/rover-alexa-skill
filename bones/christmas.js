/*
Sample bone for returning the number of days until Christmas.   Simple bone that does not need to make any API calls.
9/3/2016
techdad24.com

Can be run via the node command line.  First make sure to grab rover-alexa-skill

npm install rover-alexa-skill

node christmas.js FetchIntent
*/
var Rover=new (require('rover-alexa-skill'))(process);
const msecperday=86400000;

function christmas() {
	var cdate=new Date();
	var day=cdate.getDate();
	var month=cdate.getMonth();
	var year=cdate.getFullYear();
	
	if (month==11 && day>25) { // if we are asking between December 26th and 31st
		year++;
	}
	var cmdate=new Date(year,11,25);  // Christmas
	var days=Math.floor((cmdate.getTime() - cdate.getTime())/msecperday);
	
	switch(days) {
		case 0: return 'Merry Christmas!';
		case 1: return 'One day to go, Santa is coming tonight!';
		default: return days + ' days until Christmas.';
	}
	
}

switch(Rover.intent) {
	case 'FetchIntent'		:	
					var info=christmas();
		            Rover.tellWithCard(info,
			            {title:'Days until Christmas',
			            content:info
			            }		            
		            ); 
                    break;
	default: Rover.tell('Unhandled intent: ' + Rover.intent);
}


