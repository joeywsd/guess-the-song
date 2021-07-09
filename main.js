/*
    Author: Johnathan Sutan
    Last Updated: 6/13/21    
    File linked: main.html, main.css, audio_visual.js
*/

// start of declaration section.

// Songs metadata dictionary.
// Top R & B songs around 2012
// Array starts at index zero.
var songs_list_singer = [""];
var songs_list_title = [""];
var songs_played_already = [];
songs_list_singer[1] = "WILLIAM"; // hard for alan ai to understand- WILL.I.AM pronounced Will I Am maybe do william or well I am instead
songs_list_title[1] = "Scream & Shout";
songs_list_singer[2] = "RIHANNA";
songs_list_title[2] = "Diamonds";
songs_list_singer[3] = "BRUNO Mars";
songs_list_title[3] = "Moonshine";

songs_list_singer[4] = "FLO Rida";
songs_list_title[4] = "Avalanche";
songs_list_singer[5] = "PITBULL";
songs_list_title[5] = "Global Warming";
songs_list_singer[6] = "NICKI Minaj";
songs_list_title[6] = "High School";

//Top R & B songs around 2013
songs_list_singer[7] = "MICHAEL Telo";
songs_list_title[7] = "Bare Bare"; //alan ai thinks that i say bear bear so i get it wrong
songs_list_singer[8] = "ONE Direction";
songs_list_title[8] = "Life While We're Young";
songs_list_singer[9] = "FUN";
songs_list_title[9] = "We Are Young";
songs_list_singer[10] = "MAROON 5";
songs_list_title[10] = "One More Night";

songs_list_singer[11] = "BRUNO Mars";
songs_list_title[11] = "Locked Out Of Heaven";
songs_list_singer[12] = "KATY Perry";
songs_list_title[12] = "Wide Awake";
songs_list_singer[13] = "ADELE";
songs_list_title[13] = "Skyfall";
songs_list_singer[14] = "PSY";
songs_list_title[14] = "Gangnam Style";

songs_list_singer[15] = "ALICIA Keys";
songs_list_title[15] = "New Day";
songs_list_singer[16] = "KESHA";
songs_list_title[16] = "C'mon";
songs_list_singer[17] = "TAYLOR Swift";
songs_list_title[17] = "Begin Again";
songs_list_singer[18] = "ARASH";
songs_list_title[18] = "Broken Angel";
songs_list_singer[19] = "FUN";
songs_list_title[19] = "Some Night";

var random_number = Math.floor(Math.random() * 18) + 1;
var song_counter = 0;
var music_name = "R&B_2010s/00" + random_number + ".mp3";
var correct = 0;
var questionNumber = 0;

let play_btn = document.querySelector("#play");
let prev_btn = document.querySelector("#pre");
let next_btn = document.querySelector("#next");
let range = document.querySelector("#range");
let play_img = document.querySelector("#play_img")
let total_time = 0;
let currentTime = 0;
let isPlaying = false;
let song = new Audio();

// end of declaration section.

/* Alan AI integrations */
var alanBtnInstance = alanBtn({
    key: "ed946c823a6809ab3fccf523146d98f52e956eca572e1d8b807a3e2338fdd0dc/stage",
    onCommand: function (commandData) {
        if (commandData.command === "go:back") {
        //call client code that will react on the received command
        }
        else if (commandData.command === "playsongquiz") {
            playSongQuiz();
        }
        else if (commandData.command === "continuesongquiz") {
            continueSongQuiz();
        }
        else if (commandData.command === "checkanswer") {
            answer_from_alan = commandData.value.value;
            checkAnswer();  
        }
        else if (commandData.command === "resetpage") {
            correct = 0;
          }
    },
    rootEl: document.getElementById("alan-btn"),
});

/* function that plays the song for an initial 5 seconds */
function playSongQuiz(){
    
    song_counter++;
    document.getElementById("song_title_display_text").innerHTML = "Song #" + song_counter;

    /* random number to get a random song */
    random_number = Math.floor(Math.random() * 18) + 1;
    music_name = "R&B_2010s/00" + random_number + ".mp3";
    song.src = music_name;
    console.log(song)
    
    document.getElementById("after_submit").style.visibility = "hidden";
    document.getElementById("song_title_display_text").style.visibility = "visible";
    document.getElementById("svg").style.visibility = "visible";
    random_soundwave();

    song.play();
    isPlaying = true;
    total_time = 10; /* song.duration; */
    range.max = 10;  /* total_time; */
    play_img.src = "images/pause.png";
    
    setTimeout(function(){
        song.pause();
        play_img.src = "images/play.png";
        document.getElementById("svg").style.visibility = "hidden";
    },
    5000); 
    }

    if(!isPlaying){
        {
        song.pause();
        isPlaying = false;
        play_img.src = "images/play.png";
    }

    song.addEventListener('ended',function(){
        song.currentTime = 0
        song.pause();
        isPlaying = false;
        range.value = 0;
        play_img.src = "images/play.png";
    })
    song.addEventListener('timeupdate',function(){
        range.value = song.currentTime; 
    })
    range.addEventListener('change',function(){
        song.currentTime = range.value;
    })

    /* function that plays the song for five more seconds if the user requests it */
    function continueSongQuiz(){

        document.getElementById("song_title_display_text").style.visibility = "visible";
        document.getElementById("svg").style.visibility = "visible";
    
        song.play();
        play_img.src = "images/pause.png";
    
        setTimeout(function(){
            song.pause();
            play_img.src = "images/play.png";
            document.getElementById("svg").style.visibility = "hidden";
            /* document.getElementById("song_title_display_text").style.visibility = "hidden"; */
        },
        5000); 
        }
}

/* check function that uses user input from Alan AI */
function checkAnswer(){
    var answer = "wrong";
	var question = answer_from_alan;

    questionNumber++;

	if (question.toUpperCase() === songs_list_title[random_number].toUpperCase() || question.toUpperCase() === songs_list_singer[random_number].toUpperCase()){
		correct++;
        answer = "right";
	}
	
	var pictures = ["https://media.giphy.com/media/vtm4qejJIl1ERPIrbA/giphy.gif","images/meh.jpeg", "https://media.giphy.com/media/l0Iy7zmLUiALbkna8/giphy.gif", "images/win.gif"];
	var messages = ["Better Luck Next Time!", "Not Bad!", "Pretty Good!", "Great Job!"];

	document.getElementById("after_submit").style.visibility = "visible";
    document.getElementById("score").style.visibility = "visible";

    if (answer === "wrong"){
        document.getElementById("message").innerHTML = "Next song for sure!";
        document.getElementById("picture").src = "https://media.giphy.com/media/l3vR3gvEdsdJl26oU/giphy.gif";
    }
    else if (answer === "right"){
        document.getElementById("message").innerHTML = "Wow, you're awesome!";
        document.getElementById("picture").src = "https://media.giphy.com/media/RJJzGXGV9o9gbwZUFn/giphy-downsized.gif";
    }

    // display the conclusion message and picture at the end of the game.
    if (questionNumber === 3){
        document.getElementById("message").innerHTML = messages[correct];
	    document.getElementById("picture").src = pictures[correct];    
    }

    document.getElementById("number_correct").innerHTML = "Your guess is " + answer + ".";
    document.getElementById("score").innerHTML = "Score: " + correct + " / 3";
    /* document.getElementById("number_correct").innerHTML = "You got " + correct + " correct.";
    document.getElementById("message").innerHTML = messages[correct];
	document.getElementById("picture").src = pictures[correct]; */
}