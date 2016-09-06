So what are these bones anyway?  Basically bones are simple JavaScript files that perform some task, normally retrieving information, 
and return info back to the user via Alexa voice prompts.   The Alexa Skill Rover acts as the go-between by reading in the "bone" from the user's 
cloud drive (Google Drive, OneDrive, or DropBox), executing the code, and sending back the result to Alexa.  Rover allows users to
quickly test to see if their API calls are working without having to construct a whole new app.

Bones are currently limited to doing requires of a subset of the Node API found at https://nodejs.org/api/ and cannot do requires of additional
files in the same folder.  

Bones can be tested outside of Rover by using the node command line.  

node metro.js FetchIntent 704 

Make sure to grab the rover-alexa-skill module beforehand

npm install rover-alexa-skill

The Rover app expects to find a bones.json file in your bones folder.  The helps it tie together the invocation name (what the user says after 
the word "fetch") and what file to load in from the cloud drive.   The file also contains the intents that it will accept - which normally is
the FetchIntent followed by any of the other built-in Amazon intents like Yes or No.

In an effort to help Alexa identify bone utterances we've included some of the following as part of the interaction model.  Try using one
of these as your invocation name:

alpha
beta
delta
epsilon
omega
metro
dc
web
alexa
grabber
sleepy
grumpy
google
bing
zeta
theta
sigma
lambda
paris
london
miami
chicago
phoenix
arizona
california
munich
cairo
yosemite
lollipop
marshmellow
apricot
apple
banana
alabama
arkansas
colorado
carolina
delaware

