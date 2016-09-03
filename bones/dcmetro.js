/*
Sample bone for grabbing the common name for DC Metro bus routes.  Demonstrates the use of custom headers and turning XML data into JSON.
9/3/2016
techdad24.com

Can be run via the node command line.  First make sure to grab rover-alexa-skill

npm install rover-alexa-skill
npm install xml2js

node dcmetro.js FetchIntent L1
*/
var Rover=new (require('rover-alexa-skill'))(process);
var https=require('https');
var url=require('url');
var parseString = require('xml2js').parseString;


function metro(routeId,eventCallback) {
    
	var xurl=url.parse('https://api.wmata.com/Bus.svc/Routes');

	xurl.headers = {
		api_key:'6b700f7ea9db408e9745c207da7ca827'	
	};

	https.get(xurl, function(res) {
		var body = '';

		res.on('data', function (chunk) {
			body += chunk;
		});

		res.on('end', function () {
			parseString(body, {explicitArray:false,ignoreAttrs:true},function (err, result) {
				if (err) {
					return eventCallback({error:err});
				}
				else {
					var r=result.RoutesResp;
					if (r && r.Routes && r.Routes.Route && r.Routes.Route.length) {
						r=r.Routes.Route;
						var o;
						if (routeId) {
							routeId=routeId.replace(' ','').toUpperCase();  // force uppercase and remove spaces
						}
						for(var i=0;i<r.length && !o;i++) {
							if (r[i].RouteID && r[i].RouteID==routeId) {
								o=r[i];
							}
						}
						if (!o) {
							return eventCallback({error:'route not found'});							
						}
						else {
							o.display_name=o.Name;
							return eventCallback({content:o});							
						}
					}
					else {
						return eventCallback({error:'data not in expected format'});
					}
				}
			});
		});
	}).on('error', function (e) {
		return eventCallback({"error":e});				
	});
}


var useRoute=Rover.slot1;

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
		    metro(useRoute,function(res) {
		    	var info='Error locating info on route ' + useRoute;
		        if (res.error) {
		            return Rover.tellWithCard(info,
			            {title:'Washington DC Metro',
			            content:info
			            }		            
		            ); 
		        }
		        else {
		        	info='Route ' + useRoute + ' is known as: ' + res.content.display_name + '.';
		            return Rover.askWithCard(info + '  Will you be using the DC Metro soon?',
			            {title:'Washington DC Metro',
			            content:info
			            }
		            );
		        }
		    }
		    );
		}
				break;
	default: Rover.tell('Unhandled intent: ' + Rover.intent);
}


