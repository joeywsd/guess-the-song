/*
    Author: Johnathan Sutan
    Last Updated: 6/13/21    
    Files linked: main.html, main.css, audio_visual.js, main.js
    Purpose: - Guides the game contestant to interact with Alan AI's voice assistant
             - Communicates with other files within the web application
*/

// declaration of variable(s)
var nameOfUser = "";

// declaration of synonyms
const QUESTION_WORDS = [
    {id: "can",  aliases: ["may","would"]},
]

const START_WORDS = [
    {id: "start", aliases: ["begin", "play", "start playing", "begin playing"]}
]

const INDEFNITE_ARTICLE_WORDS = [
    {id: "the", aliases: ["a", "an", "this"]}
]

const QUESTION_INTENTS = _.flatten(QUESTION_WORDS.map(p => p.aliases.map(a => `${a}~${p.id}`))).join('|')
const START_INTENTS =  _.flatten(START_WORDS.map(p => p.aliases.map(a => `${a}~${p.id}`))).join('|')
const INDEFINITE_ARTICLE_INTENTS =  _.flatten(INDEFNITE_ARTICLE_WORDS.map(p => p.aliases.map(a => `${a}~${p.id}`))).join('|')

const userInput = context(() => {
    intent("$(I* .+)", p => p.resolve(p.I));
})

// popup message so the user knows to click the Alan button.
onUserEvent((p, e) => {
    console.info('EVENT', e.event);
    if (e.event == 'buttonReady') {
        p.showPopup({
            html: '<div class="info-popup"> <div class="info-popup_header"></div><div class="info-popup_body"> <div>Ask questions and perform other tasks with voice</div><div class="info-popup_pointer-button"> <div class="info-popup_pointer-button_bg"> <div class="info-popup_pointer-button_arrow"></div></div><div class="info-popup_pointer-button_text">Click here to speak!</div></div></div></div>',
            style: ".info-popup{max-width:394px;height:324px;max-height:324px;background:#fff;-webkit-box-shadow:0 5px 14px rgba(0,0,0,.25);box-shadow:0 5px 14px rgba(0,0,0,.25);overflow:hidden;border-radius:10px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.top .info-popup{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse}.top .info-popup_body{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse;-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end;padding-top:20px}.info-popup_header{height:191px;background-image:url(https://alan.app/assets/script-concepts/popup-image.png);background-repeat:no-repeat;background-position:center center;background-size:100% 100%}.info-popup_body{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;font-weight:400;font-size:16px;line-height:28px;text-align:center;color:#000;padding:6px 70px 0;height:133px}.info-popup_pointer-button{width:170px;height:36px;margin:7px auto 10px;position:relative}.right .info-popup_pointer-button{padding-right:16px}.left .info-popup_pointer-button{padding-left:16px}.info-popup_pointer-button_text{position:absolute;height:100%;width:100%;font-size:16px;line-height:36px;text-align:center;color:#fff}.info-popup_pointer-button_bg{position:absolute;height:100%;width:100%;background:#0D75FF;border-radius:7px}.info-popup_pointer-button_arrow{position:absolute;background-color:#0D75FF;text-align:left;top:3px;right:-10px;transform:rotate(-90deg) skewX(-30deg) scale(1,.866)}.info-popup_pointer-button_arrow:after,.info-popup_pointer-button_arrow:before{content:'';position:absolute;background-color:inherit}.info-popup_pointer-button_arrow,.info-popup_pointer-button_arrow:after,.info-popup_pointer-button_arrow:before{width:20px;height:20px;border-top-right-radius:30%}.info-popup_pointer-button_arrow:before{transform:rotate(-135deg) skewX(-45deg) scale(1.414,.707) translate(0,-50%)}.info-popup_pointer-button_arrow:after{transform:rotate(135deg) skewY(-45deg) scale(.707,1.414) translate(50%)}.left .info-popup_pointer-button_bg{-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg)}",
            overlay: true,
            buttonMarginInPopup: 15,
            force: true,
        });
    }
}); 

// Alan AI guides the user 
onUserEvent( async (p, e) => {
	console.info('event', JSON.stringify(e));
    if (e.event == 'firstActivate') {
        //if (diffFrom(e.userInfo.lastInteractionTs, 'days') < 1 ){//> 1) {
        p.play("(Hi|Hi there|Hello), I am Alan, game show host of Guess the Song. What's your name?");
        nameOfUser = await p.then(userInput); 
        p.play("Hi " + nameOfUser + "! Want to learn the rules of Guess the Song?")
        const learnRules = await p.then(userInput);
        if (learnRules == 'yes'){
            p.play("First, select a game mode. There are two game modes: infinite and normal. In the infinite game mode, 20 songs are played."); 
            p.play("In the normal game mode, 3 songs are played. Then, select a genre.");
            p.play("In both game modes, Each song will play for 5 seconds and after the song ends you have ten seconds to guess.");
            p.play("You may request for the song to continue playing. To exit the game, say EXIT. When you want to start playing, tell me!");
        }
        else{
            p.play('Alright, tell me if you want to start playing!')
        }
        
    }
});

// rules
intent('rules', 
       'repeat the rules',
       'How do I play',
       'What are the rules',
    p => {
    p.play("First, select a game mode. There are two game modes: infinite and normal. In the infinite game mode, 20 songs are played."); 
    p.play("In the normal game mode, 3 songs are played. Then, select a genre.");
    p.play("In both game modes, Each song will play for 5 seconds and after the song ends you have ten seconds to guess.");
    p.play("You may request for the song to continue playing. To exit the game, say EXIT. When you want to start playing, tell me!");
});
/*
var delayFlag = "OFF";
var pauseTimer;

function delay(){
    delayFlag = "ON";
    pauseTimer = setTimeout(function(){
        delayFlag = "OFF";
        console.log("delaying");
    },
    3000);
}
*/
async function infiniteGame(pObject){
    var p = pObject;
    p.play("Which genre do you want to play? Pop, Rock, or Rap?");
        var genre = await p.then(userInput);
        // while(genre.toUpperCase() != "POP" || genre.toUpperCase() != "ROCK" || genre.toUpperCase() != "RAP")
        while(genre != "Rock" && genre != "pop" && genre != "rap") // Use and here, NOT or!!!!
            {
                p.play("Please choose a provided genre: Pop, Rock, or Rap.");
                genre = await p.then(userInput);
            }
        p.play({command:'getItunesData', value: genre});

        p.play("Some " + genre + " music coming right up! Remember to say EXIT if you would like to end the game!");

        // p.play({command: "playsongquiz", value: genre});
        // p.play({command: "playsongquiz"});

        p.play({command:'resetpage'}); 

        var i = 1;
        
        for (i = 1; i < 21; i++)
        {
            /* p.play("Song number " + i + "!" ); */

            p.play({command:'playsong'});

            var listenLonger = await p.then(userInput);

            if (listenLonger == "play more") {
                p.play("Listen closely and then guess the name or artist of this song!");
                p.play({command: "continuesong"})
                const firstInput = await p.then(userInput);
                if(firstInput == "exit"){
                    p.play("Exiting the game!");
                    break;
                }
                // p.play({command: "checkanswer", value: firstInput});
                p.play({command: "checkanswer", value: listenLonger});
            }
            else if(listenLonger == "exit"){
                p.play("Exiting the game!");
                break;
            }
            else{
                //p.play("You seem confident! Try guessing the name or artist of this song!");
                p.play({command: "checkanswer", value: listenLonger});
            }
        }
        //}

    p.play({command: "finalthanks", value: nameOfUser});
}

async function normalGame(pObject){
    var p = pObject;
    p.play("Which genre do you want to play? Pop, Rock, or Rap?");
    var genre = await p.then(userInput);
    console.log(genre);
    // while(genre.toUpperCase() != "POP" || genre.toUpperCase() != "ROCK" || genre.toUpperCase() != "RAP")
    while(genre != "Rock" && genre != "pop" && genre != "rap") // Use and here, NOT or!!!!
        {
            p.play("Please choose a provided genre: Pop, Rock, or Rap.");
            genre = await p.then(userInput);
        }
    p.play({command:'getItunesData', value: genre});
        
    p.play("Some " + genre + " music coming right up!")       
    p.play("Don't forget that you can request for the song to continue playing by saying, play more!"); 
    for (var i = 0; i < 3; i++){
        
        p.play({command:'playsong'});
/*        
        if (i == 0){
            p.play("Alright! Let's move on to the second song!")
        }
        
        if (i == 1){
            p.play("Time to listen to the third and last song!")
        }
*/   
        var listenLonger = await p.then(userInput);
        
        if (listenLonger == "play more") {
            p.play("Listen closely and then guess the name or artist of this song!");
            p.play({command: "continuesong"})
            const firstInput = await p.then(userInput);
            if(firstInput == "exit"){
                p.play("Exiting the game!");
                break;
            }
            p.play({command: "checkanswer", value: firstInput});
            }
            else if(listenLonger == "exit"){
                p.play("Exiting the game!");
                break;
            }
            else{
                //p.play("You seem confident! Try guessing the name or artist of this song!");
                p.play({command: "checkanswer", value: listenLonger});
            }
        
    }
    //}
    
    p.play({command: "finalthanks", value: nameOfUser});
}

// Starting the game and processing the user's inputs.
intent(
    'Start the game',
    // 'yes',
    `$(ITEM ${START_INTENTS}) $(ITEM ${INDEFINITE_ARTICLE_INTENTS}) (game|game please)`,
    `I (would like|want) to begin playing`,
    `$(ITEM ${QUESTION_INTENTS}) you $(ITEM ${START_INTENTS}) $(ITEM ${INDEFINITE_ARTICLE_INTENTS}) (game|game please)`,
    `$(ITEM ${QUESTION_INTENTS}) I $(ITEM ${START_INTENTS}) $(ITEM ${INDEFINITE_ARTICLE_INTENTS}) (game|game please)`,
    async p => {        
        
    p.play({command:'resetpage'})
        
    p.play("Hello " + nameOfUser + ", welcome to the greatest game in the world: Guess the Song!");
        
    p.play("Which game mode do you want to play? Infinite or normal?");
    var gameMode = await p.then(userInput);
    
    while(gameMode != "infinite" && gameMode != "normal") // Use and here, NOT or!!!!
    {
        p.play("Please choose a provided game mode: Infinite or normal.");
        gameMode = await p.then(userInput);
    }
    if(gameMode == "infinite"){
        infiniteGame(p, nameOfUser);
    }
    else if(gameMode == "normal"){
        normalGame(p, nameOfUser);
    }
    else{
        console.log("Error!");
    }
        
});

// for testing purposes only
intent('play song', p => {
    p.play({command:'playsong'})
    p.play('Okay!')
});

intent(
    'Test',
    async p => {     
            
    p.play("Which genre do you want to play? Pop, Rock, or Rap?");
    var genre = await p.then(userInput);
    console.log(genre);
    // while(genre.toUpperCase() != "POP" || genre.toUpperCase() != "ROCK" || genre.toUpperCase() != "RAP")
    while(genre != "Rock" && genre != "pop" && genre != "rap") // Use and here, NOT or!!!!
        {
            p.play("Please choose a provided genre: Pop, Rock, or Rap.");
            genre = await p.then(userInput);
        }
    p.play({command:'getItunesData', value: genre});
        
    p.play("Some " + genre + " music coming right up!")
        
    // p.play({command: "playsongquiz", value: genre});
    // p.play({command: "playsongquiz"});
        
    p.play({command:'resetpage'})
        
    for (var i = 0; i < 3; i++){
        /*
        if (i == 1){
            p.play("Alright! Let's move on to the second song!")
        }
        
        if (i == 2){
            p.play("Time to listen to the third and last song!")
        }
        */
        p.play({command:'playsong'});
   
        const listenLonger = await p.then(userInput);
        
        if (listenLonger == "play more") {
            p.play("Listen closely and then guess the name or artist of this song!");
            p.play({command: "continuesong"})
            const firstInput = await p.then(userInput);
            p.play({command: "checkanswer", value: firstInput});
        }
        else{
            //p.play("You seem confident! Try guessing the name or artist of this song!");
            p.play({command: "checkanswer", value: listenLonger});
        }
        
    }
    //}
    
    p.play({command: "finalthanks", value: nameOfUser});
});

intent(
    'test scroll',
    async p => {    
            
        p.play("Which genre do you want to play? Pop, Rock, or Rap?");
        var genre = await p.then(userInput);
        // while(genre.toUpperCase() != "POP" || genre.toUpperCase() != "ROCK" || genre.toUpperCase() != "RAP")
        while(genre != "Rock" && genre != "pop" && genre != "rap") // Use and here, NOT or!!!!
            {
                p.play("Please choose a provided genre: Pop, Rock, or Rap.");
                genre = await p.then(userInput);
            }
        p.play({command:'getItunesData', value: genre});

        p.play("Some " + genre + " music coming right up!");

        // p.play({command: "playsongquiz", value: genre});
        // p.play({command: "playsongquiz"});

        p.play({command:'resetpage'}); 

        var flag = true;
        // var i = 1;
        
        while (flag)
        {
            /*
            if( delayFlag == "OFF"){
            }
            else if( delayFlag == "ON"){
                setInterval(function(){
                    console.log("delaying");
                }, 1000);
            }
            else{
                console.log("Error");
            }
            */

            // p.play("Song number " + i + "!" );
            // i++;
            
            p.play({command:'playsong'});

            var listenLonger = await p.then(userInput);

            if (listenLonger == "play more") {
                p.play("Listen closely and then guess the name or artist of this song!");
                p.play({command: "continuesong"})
                const firstInput = await p.then(userInput);
                p.play({command: "checkanswer", value: firstInput});
            }
            else if(listenLonger == "exit"){
                flag = false;
                p.play("Exiting the game!")
            }
            else{
                //p.play("You seem confident! Try guessing the name or artist of this song!");
                p.play({command: "checkanswer", value: listenLonger});                
            }
            /*delay();
            console.log("hello");*/
        }
        //}

    p.play({command: "finalthanks", value: nameOfUser});

});