// Copyright techdad24.com and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/*
An external "driver" needs to implement the following to enable communication with the
given "bone".

process.argv[] =
0=Driver name
1=Bone filename
2=Intent name
3..n=slot values

process.env should contain existing and saved attributes

process.stdout - this stream will receive a JSON object of the actions to be taken

9/3/2016
techdad24.com

*/

'use strict';
const path = require('path');
const RoverVersion="1.00";

function Rover(process) {
    this.process=process;
    if (!this.process) {
        throw 'Rover requires a process object';
    }
    this.stdout=process.stdout;
    if (!this.stdout) {
        throw 'Rover requires a stdout object';
    }    
    
}

function setValues(rover,askQuestion,outputSpeech,card,reprompt) {
    rover.askQuestion  = askQuestion;
    rover.outputSpeech = outputSpeech;
    rover.card         = card;
    rover.reprompt     = reprompt;
    processOutput(rover);
}

function processOutput(rover) {

    var a={};
    var stream=rover.stdout;
    var prefix='rover_' + rover.bone + '_';
    var env=rover.process.env;
    
    for (var key in env) {
        if (key.startsWith(prefix)) {
            if (typeof env[key] !== "undefined") {
                a[key]=env[key];
            }
        }
    }
    
    var o= {
        "version": "1.0",
        "RoverVersion" : RoverVersion
    };
    
    o.sessionAttributes=a;
    o.response={};
    if (rover.outputSpeech) {
        o.response.outputSpeech=rover.outputSpeech;
    }
    if (rover.card) {
        o.response.card=rover.card;
    }    
    if (rover.reprompt) {
        o.response.reprompt=rover.reprompt;
    }    
    if (rover.debugLog) {
        o.response.debugLog=rover.debugLog;
    }  
    o.response.shouldEndSession = !rover.askQuestion;
       
    stream.write(JSON.stringify(o));

}

function createSpeechObject(optionsParam) {
    if (!optionsParam) {
        return optionsParam;
    }
    if (optionsParam.type=="SSML") {
        return {
            type:optionsParam.type,
            ssml:optionsParam.ssml
        };
    }
    else {
        return {
            type:optionsParam.type || 'PlainText',
            text:optionsParam.text || optionsParam
        };
    }
}

function createCardObject(optionsParam) {
    if (!optionsParam) {
        return optionsParam;
    }
    if (optionsParam.type=="Standard") {
        return {
            type:optionsParam.type,
            title:optionsParam.title,            
            text:optionsParam.text,
            image: {
                smallImageUrl:((optionsParam.image) ? optionsParam.image.smallImageUrl:optionsParam.image),
                largeImageUrl:((optionsParam.image) ? optionsParam.image.largeImageUrl:optionsParam.image)
            }
        };
    }
    else {
        return {
            type:optionsParam.type || 'Simple',
            title:optionsParam.title,               
            content:optionsParam.content || optionsParam
        };
    }
}


Object.defineProperty(Rover.prototype, "slot1", {
    get: function() {
            return this.process.argv[3];
    }
});

Object.defineProperty(Rover.prototype, "slot2", {
    get: function() {
            return this.process.argv[4];
    }
});

Object.defineProperty(Rover.prototype, "slot3", {
    get: function() {
            return this.process.argv[5];
    }
});

Object.defineProperty(Rover.prototype, "bone", {
    get: function() {
            return path.parse(this.process.argv[1]).name;
    }
});

Object.defineProperty(Rover.prototype, "intent", {
    get: function() {
            return this.process.argv[2] || 'FetchIntent';
    }
});

Object.defineProperty(Rover.prototype, "outputSpeech", {
    get: function() {
            return this.outputSpeech_;
    },
    set: function(value) {
            this.outputSpeech_ = createSpeechObject(value);
    },    
});

Object.defineProperty(Rover.prototype, "reprompt", {
    get: function() {
            return this.reprompt_;
    },
    set: function(value) {
            this.reprompt_ = createSpeechObject(value);
    },    
});

Object.defineProperty(Rover.prototype, "card", {
    get: function() {
            return this.card_;
    },
    set: function(value) {
            this.card_ = createCardObject(value);
    },    
});

Object.defineProperty(Rover.prototype, "askQuestion", {
    get: function() {
            return ((this.askQuestion_) ? true:false);
    },
    set: function(value) {
            this.askQuestion_ = value;
    },    
});

Object.defineProperty(Rover.prototype, "debugLog", {
    get: function() {
            return this.debugLog_;
    },
    set: function(value) {
            this.debugLog_ = value;
    },    
});



Rover.prototype.ask=function(outputSpeech,reprompt) {
    return setValues(this,true,outputSpeech,reprompt);    
};

Rover.prototype.askWithCard=function(outputSpeech,card,reprompt) {
    return setValues(this,true,outputSpeech,card,reprompt);        
};

Rover.prototype.tell=function(outputSpeech) {
    return setValues(this,false,outputSpeech);     
};

Rover.prototype.tellWithCard=function(outputSpeech,card) {
    return setValues(this,false,outputSpeech,card);      
};

Rover.prototype.createPlainTextSpeechObject=function(text) {
    return createSpeechObject({
        type:'PlainText',
        text:text
    }
        );    
};


Rover.prototype.createSSMLSpeechObject=function(text,addTags) {
    return createSpeechObject({
        type:'SSML',
        ssml:
        ((addTags) ? '<speak>':'') +
        text +
        ((addTags) ? '</speak>':'')        
    }
        );    
};

Rover.prototype.createSimpleCardObject=function(text,title) {
    return createCardObject({
        type:'Simple',
        title:title,
        content:text
    }
        );    
};

Rover.prototype.createStandardCardObject=function(text,title,smallImageUrl,largeImageUrl) {
    return createCardObject({
        type:'Standard',
        title:title,
        text:text,
        image: {
            smallImageUrl:smallImageUrl,
            largeImageUrl:largeImageUrl
        }
    }
        );    
};

Rover.prototype.getAttribute=function(attributeName) {
    var prefix='rover_' + this.bone + '_';
    return this.process.env[prefix + attributeName];     
};

Rover.prototype.setAttribute=function(attributeName,value) {
    var prefix='rover_' + this.bone + '_';    
    this.process.env[prefix + attributeName]=value;     
};

Rover.prototype.log=function(data) {
    if (process.env.roverdebug=='log') {
        this.debugLog =  (this.debugLog || '') +  (data + '\n');
    }
};

module.exports = exports = Rover;