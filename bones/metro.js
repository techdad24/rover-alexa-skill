/*
Sample bone for grabbing the common name for LA Metro bus routes.
9/3/2016
techdad24.com

Can be run via the node command line.  First make sure to grab rover-alexa-skill

npm install rover-alexa-skill

node metro.js FetchIntent 704
*/

var Rover=new (require('rover-alexa-skill'))(process);
var http=require('http');

function metro(routeId,stopId,eventCallback) {
    
    var xurl="http://api.metro.net/agencies/lametro/routes/" + routeId + "/" +
    ((stopId) ? 'stops/' + stopId + '/':'');

	http.get(xurl, function(res) {
		var body = '';

		res.on('data', function (chunk) {
			body += chunk;
		});

		res.on('end', function () {
			var o;
			Rover.log('JSON returned is : ' + body);
			try {
				o = JSON.parse(body);
				return eventCallback({content:o});
			}
			catch(e) {
				o={"error":e};
				return eventCallback(o);
			}	
		});
	}).on('error', function (e) {
		return eventCallback({"error":e});				
	});
}


var useRoute=Rover.slot1;
var useStop=Rover.slot2;

switch(Rover.intent) {
	case 'AMAZON.YesIntent' : Rover.tell('Hope you enjoy your trip!');
	             break;
	case 'AMAZON.NoIntent'  : Rover.tell('Perhaps another time then.');
	             break;
	case 'FetchIntent'		:	
		if (!useRoute) {
		    Rover.ask('Missing route number, please provide a route number');
		}
		else {
			var lastReturnString=Rover.getAttribute('returnString');
			if (lastReturnString) {
				Rover.log('last time the return string was: ' + lastReturnString);
			}
		    metro(useRoute,useStop,function(res) {
		    	var info;
		        if (res.error) {
		        	info='Error locating info on ' + ((useStop) ? 'stop ' + useStop:'route ' + useRoute);
		            return Rover.tellWithCard(info,
			            {title:'LA Metro',
			            content:info
			            }		            
		            ); 
		        }
		        else {
		        	info=((useStop) ? 'Stop ' + useStop:'Route ' + useRoute) + ' is known as: ' + res.content.display_name + '.';
					Rover.setAttribute('returnString',info);
		            return Rover.askWithCard(info + '  Will you be using the Los Angeles Metro soon?',
			            {title:'LA Metro',
			            content:info
			            }
		            );
		        }
		    }
		    );
		}
				break;
	default:  Rover.tell('Unhandled intent: ' + Rover.intent);
}

