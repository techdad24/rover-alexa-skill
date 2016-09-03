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

