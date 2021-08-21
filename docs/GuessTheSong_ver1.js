/*
intent('Add $(NUMBER) $(INSTRUMENT trumpet_|guitar_|violin_) and $(NUMBER) $(INSTRUMENT trumpet_|guitar_|violin_)', p => {
    console.log('Numbers array:', p.NUMBER_);
    console.log('Instruments array:', p.INSTRUMENT_);
    p.play(`The first position of your order is: ${p.NUMBER_[0].number} ${p.INSTRUMENT_[0].value}`);
    p.play(`The second position of your order is: ${p.NUMBER_[1].number} ${p.INSTRUMENT_[1].value}`);
});

// Use this sample to create your own voice commands
intent('hello world', p => {
    p.play('(hello|hi there)');
});

// const itemName = p.ITEM.value;
// const item = menuItems.find(mi => mi.name.toLowerCase() === itemName.toLowerCase());
// p.play({command: 'addToCart', data: item});
intent('The song is $(ITEM)', p => {
    //p.play({"command": "addToCart", "item": p.ITEM.value});
    //p.play({command:'checkanswer', 'item': p.ITEM.value})
    const item = p.ITEM.value;
    p.play({command:'checkanswer', data: item})
    p.play('Lets check the answer')
});

/*
intent("I want to give feedback", async p => {
    p.play("Thank you! What do you think about our product?");
    const feedback = await p.then(userInput);
    p.play({command: "feedback", value: feedback});
    p.play(`Your feedback is: ${feedback}`);
});

const userInput = context(() => {
    intent("$(I* .+)", p => p.resolve(p.I));
})
// * /

intent(
    'Who\'s there',
    'What\'s your name',
    p => {
        p.play(
            'My name is Alan.',
            'It\'s Alan.',
        );
    },
);

intent(
    'What game can I play',
    'What games do you offer',
    p => {
        p.play(
            'We offer one great game: Guess the Song.',
            'Guess the Song, the best game on the planet',
        );
    },
);

// how to play 
question(
    'How does this work',
    'How to use this',
    'How to play',
    'What can I do here',
    'What (should I|can I|to) say',
    'What commands are available',
    'How do I play this game',
    reply('You will be guessing the name or artist of 3 songs. Each song will play for 5 seconds and after the song ends you have ten seconds to guess. Also, you may request for the song to continue playing. When you want to start playing, just tell me!'),
);

/*
intent('play song', p => {
    p.play({command:'playsongquiz'})
    p.play('Okay!')
});


intent("I want to guess the song", async p => {
    p.play("Awesome! What is the name or artist of this song?");
    const feedback = await p.then(userInput);
    p.play({command: "checkanswer", value: feedback});
    p.play(`Your guess is: ${feedback}`);
    p.play({command:'resetpage'})
});
//* /

const userInput = context(() => {
    intent("$(I* .+)", p => p.resolve(p.I));
})


//    var alanGuessedSongTitle = "NOT GUESSED";
//    var alanGuessedSongArtist = "NOT GUESSED";

/*
projectAPI.sendFeedback = function(p, param, callback) {   
    // p.userData.feedback = param.data;	
    param.data = p.userData.feedback;
    //	console.log(p.userData.feedback);
	console.log(param.data);
    p.play('Thank you for your feedback!');
    callback(null, 'Your answer is' + param.data);
}
*/

/*
const products = [
    {id: "cola",  aliases: ["cola","coca-cola", "soda", "coke"]},
    {id: "juice", aliases: ["juice", "fresh", "orange juice", "orange fresh"]}
]
// We have to construct following fuzzy parameters with all value~label items concatenated with |
// cola~cola|cola-cola~cola|soda~cola|coke~cola|juice~juice|fresh~juice|orange juice~juice|orange fresh~juice

const PROD_INTENTS = _.flatten(products.map(p => p.aliases.map(a => `${a}~${p.id}`))).join('|')

intent(`(I want|give me) $(ITEM ${PROD_INTENTS})`, p => {
    p.play(`We added ${p.ITEM.label} to your order`)
})
// * /
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


const userInputGame = context(() => {
    intent("$(I* .+)", p => p.resolve(p.I));
})
        
intent(
    'Start the game',
    `$(ITEM ${START_INTENTS}) $(ITEM ${INDEFINITE_ARTICLE_INTENTS}) (game|game please)`,
    `I (would like|want) to begin playing`,
    `$(ITEM ${QUESTION_INTENTS}) you $(ITEM ${START_INTENTS}) $(ITEM ${INDEFINITE_ARTICLE_INTENTS}) (game|game please)`,
    `$(ITEM ${QUESTION_INTENTS}) I $(ITEM ${START_INTENTS}) $(ITEM ${INDEFINITE_ARTICLE_INTENTS}) (game|game please)`,
    async p => {        
        
    p.play("Welcome to the greatest game in the world: Guess the Song!");
    for (var i = 0; i < 3; i++){
        p.play({command:'playsongquiz'});
   
        const listenLonger = await p.then(userInputGame);
        
        //if (listenLonger === "(can|may|would|will) you play (the|a|this) song (for a little longer|few more seconds|more)") {
        if (listenLonger == "(can|may) you play the song for a few more seconds") {
        //if (listenLonger == `$(ITEM ${QUESTION_INTENTS}) you (play|continue playing) $(ITEM ${INDEFINITE_ARTICLE_INTENTS}) song (for a few more seconds|for a little longer|more)`) {
            p.play("Listen closely and then guess the name or artist of this song!");
            p.play({command: "continuesongquiz"})
            const firstInput = await p.then(userInputGame);
            p.play({command: "checkanswer", value: firstInput});
        }
        else{
            //p.play("You seem confident! Try guessing the name or artist of this song!");
            p.play({command: "checkanswer", value: listenLonger});
        }
        
        //const firstGuess = await p.then(userInputGame);
        //p.play({command: "checkanswer", value: firstGuess});
        
        
        //projectAPI.sendFeedback();
        
        //let isCorrect = p.visual.screen;

        
        // let screen = p.visual.screen;
        //p.play(`Your guess is: ${firstGuess}`);
        
        // /*
        //const screen = await p.visual.screen;

        //let isCorrect = await p.visual.screen;
        
        // let screen = p.visual.screen;
        //p.play(`Your guess is: ${firstGuess}`);
        
        //for (var repetition = 0; repetition < 1000; repetition++){
        //    const screen = p.visual.screen;
        //}
        
        /*
        switch (isCorrect) {
            case "correct":
                p.play("Your guess is correct");
                break;
            case "wrong":
                p.play("Your guess is wrong");
                break;
            default:
                p.play("(Sorry,|) I could not get your answer");
        }
        */
        // */
        
        /*
        projectAPI.setClientData = function(p, param, callback) {
            p.userData.feedback = param.data;	
            console.log(p.userData.feedback);
            p.play('Thank you for your feedback!');
            callback(null, 'Feedback is received by Alan');
        };
        //* /
              
        // don't know how to communicate from this website to the file still....
        // if (screen === "wrong" //&& alanGuessedSongTitle === "NOT GUESSED"
        //   ){
        p.play("Would you like to guess again?");
        const guessAgain = await p.then(userInputGame);
        if (guessAgain.toUpperCase() === "YES" || guessAgain.toUpperCase() === "YEAH"){
            p.play("Let's hear your second guess!")
            const secondGuess = await p.then(userInputGame);
            p.play({command: "checkanswer", value: secondGuess});
            p.play(`Your guess is: ${secondGuess}`);
        }

    }
    //}
    
    p.play("That's all! Thanks for playing!")
    p.play({command:'resetpage'})
});

/*
//Wait for few seconds.
intent("Is it correct", p => {
    let screen = p.visual.screen;
    switch (screen) {
        case "correct":
            p.play("Your guess is correct");
            break;
        case "wrong":
            p.play("Your guess is wrong");
            break;
        default:
            p.play("(Sorry,|) I could not get your answer");
    }
});

const userInputGame = context(() => {
    intent("$(I* .+)", p => p.resolve(p.I));
})
*/