
/*
    Author: Johnathan Sutan
    Last Updated: 7/16/21    
    File linked: index.html, main.css, main.js, audio_visual.js
*/

const artistIds = {
    pop: [
      262836961, // ADELE
      459885, // Avril Lavigne
      1419227, // Beyoncé
      217005, // Britney Spears
      64387566, // Katy Perry
      277293880, // Lady GaGa
      184932871 // MIKA
    ],
    rap: [
      1587965, // A Tribe Called Quest
      1971863, // Beastie Boys
      465802, // Cypress Hill
      384304, // EPMD
      289550, // OutKast
      13503763, // Swollen Members
      43680 // The Roots
    ],
    rock: [
      5040714, // AC/DC
      462006, // Bob Dylan
      994656, // Led Zeppelin
      3296287, // Queen
      562555, // The Beach Boys
      136975, // The Beatles
      62819 // The Jimi Hendrix Experience
    ]
  };
  

const limit = 5; // The number of songs to retrieve for each artist
const pop = artistIds.pop;
const rap = artistIds.rap;
const rock = artistIds.rock;

var tracks = [];
var artists = [];
var titles = [];

/*
var popTracks = [];
var popArtists = [];
var popTitles = [];
var rockTracks = [];
var rockArtists = [];
var rockTitles = [];
var rapTracks = [];
var rapArtists = [];
var rapTitles = [];
*/

var songCounter = 1;
var correct = 0;
var questionNumber = 0;
var randomNumber = 0;

var genre;

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
        else if( commandData.command === "getItunesData"){
          genreFromAlan = commandData.value.value;
          getDataFromItunes();
        }
        else if (commandData.command === "resetpage") {
            correct = 0;
          }
    },
    rootEl: document.getElementById("alan-btn"),
});

/*
function getRidOfParentheses(str){
  let parenthesis = '(';
  let resultStr = '';

  let index = str.indexOf(parenthesis);

  console.log(index);
  
  return str.substr(0, index);
}
*/

// function that checks each item of an array for a paranthesis and returns a new array
// without the parantheses and the characters within the parantheses.
function checkParenth(arrayStr){
  let parenthesis = '(';
  let newArray = [];

  arrayStr.forEach(function(item, index, array) {

  let firstParenth = item.indexOf(parenthesis);
  if( firstParenth != -1){
      item = item.substr(0, firstParenth - 1);
  }
    
  newArray.push(item);

  })
  return newArray;
}

// function that checks each item of an array for a "feat." and returns a new array
// without the parantheses and the characters within the parantheses.
function checkFeat(arrayStr){
  let feat = 'feat.';
  let newArray = [];

  arrayStr.forEach(function(item, index, array) {

  let firstFeat = item.indexOf(feat);
  if( firstFeat != -1){
      item = item.substr(firstFeat + 6);
  }
    
  newArray.push(item);

  })
  return newArray;
}


/*
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + 
      this.substr(index + replacement.length);
}

item.substr(0, index) + charE + 
      item.substr(index + replacement.length);

https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
(also similar to a hw ? in python book)
*/

// function that checks each item of an array for an "é" and returns a new array
// with the "é" replaced with a normal "e".
function replaceE(arrayStr){
  let charE = "é";
  let newE = "e";
  let newArray = [];

  arrayStr.forEach(function(item, index, array) {

  let indexE = item.indexOf(charE);
  if( indexE != -1){
      item = item.substr(0, indexE) + newE + 
      item.substr(indexE + newE.length);  }
    
  newArray.push(item);

  })
  return newArray;
}


// function that retrieves the songs, or specifically preview URLs, from iTunes
function getDataFromItunes(){

  genre = genreFromAlan;
  if(genre == "pop"){
    genre = pop;
  }
  else if(genre == "Rock"){
    genre = rock;
  }
  else if(genre == "rap"){
    genre = rap;
  }

  /*
  const xhr = new XMLHttpRequest();
  const url = 'https://bar.other/resources/public-data/';

  xhr.open('GET', url);
  xhr.onreadystatechange = someHandler;
  xhr.send();
  */
  
  const url = 'https://itunes.apple.com/lookup?id='+ genre.join() + '&entity=song&limit=' + limit;
          // https://itunes.apple.com/lookup?id=262836961           &entity=song&limit=5
  const cors = 'https://cors-anywhere.herokuapp.com/';
  console.log(cors + url);
  //let previewUrl = []
  //let tempArtist = '';

  fetch(cors + url) //fetch url and turn it into JSON then into HTML
  .then( data => data.json())
  .then( json => {
    console.log(json);

    //let finalHTML = '';
    json.results.forEach( song => {

      if(song.kind == "song"){
        //previewUrl = previewUrl.append(song.previewUrl);
        // tracks = song.previewUrl;
        tracks.push(song.previewUrl);
        titles.push(song.trackCensoredName);
        //tempArtist = checkFeat(song.trackCensoredName);
        //artists.push(song.artistName + " & " + tempArtist);
        artists.push(song.artistName);

      }

    })

    titles = checkParenth(titles);
    artists = replaceE(artists);

    // console.log(JSON.stringify(obj));
    console.log(tracks);
    console.log(titles);
    console.log(artists);
  })
  .catch( error => console.log(error))

}


/* function that plays the song for an initial 5 seconds */
function playSongQuiz(){
    randomNumber = Math.floor(Math.random() * ( limit * genre.length - songCounter)); 
    // "* pop.length" because there are 7 artists
    // "- songCounter" because a song is used each time, decreasing the array, 
    // so the random number selecting the song should be decremented.
    console.log(genre.length);

    var range = document.querySelector("#range");
    var isPlaying = false;

    /*
    if (genre.toUpperCase() === "POP"){
      tracks = popTracks;
      artists = popArtists;
      titles = popTitles;
    }
    else if(genre.toUpperCase() === "ROCK"){
      tracks = rockTracks;
      artists = rockArtists;
      titles = rockTitles;
    }
    else if(genre.toUpperCase() === "RAP"){
      tracks = rapTracks;
      artists = rapArtists;
      titles = rapTitles;
    }
    */
    var song = new Audio();
    song.src = tracks[randomNumber]; 
    
    document.getElementById("song_title_display_text").innerHTML = "Song #" 
    + songCounter;

    /* random number to get a random song */
    // randomNumber = Math.floor(Math.random() * 18) + 1;
    // randomNumber = Math.floor(Math.random() * ( 35 - songCounter ) );
    //console.log(3 - songCounter)
    //console.log(randomNumber);
    //music_name = "R&B_2010s/00" + randomNumber + ".mp3";
    console.log(song);
    console.log(randomNumber);
    
    console.log(artists[randomNumber], " and ", titles[randomNumber]);

    // let myArray = ['a', 'b', 'c', 'd'];
    // console.log(myArray.splice(2, 1));

    console.log(tracks);

    document.getElementById("after_submit").style.visibility = "hidden";
    document.getElementById("song_title_display_text").style.visibility = "visible";
    document.getElementById("svg").style.visibility = "visible";
    random_soundwave();

    /*
    var playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.then(_ => {
        // Automatic playback started!
        // Show playing UI.
      })
      .catch(error => {
        // Auto-play was prevented
        // Show paused UI.
      });
    }
    */

    var playPromise = song.play();

    if (playPromise !== undefined) {
      playPromise.then(_ => {
 
        isPlaying = true;
        total_time = 10; /* song.duration; */
        range.max = 10;  /* total_time; */
        
        setTimeout(function(){
            song.pause();
            document.getElementById("svg").style.visibility = "hidden";
        },
        5000); 
    
        if(!isPlaying){
            song.pause();
            isPlaying = false;
        }
    
        song.addEventListener('ended',function(){
            song.currentTime = 0
            song.pause();
            isPlaying = false;
            range.value = 0;
        })
        song.addEventListener('timeupdate',function(){
            range.value = song.currentTime; 
        })
        range.addEventListener('change',function(){
            song.currentTime = range.value;
        })

      })
      .catch(error => {
        // Auto-play was prevented
        // Show paused UI.
        console.log(error);
        console.log(tracks);
        console.log(randomNumber);
        console.log(tracks[randomNumber]);
      });
    }

  }

    /* function that plays the song for five more seconds if the user requests it */
    function continueSongQuiz(){

        var song = new Audio();
        song.src = tracks[randomNumber]; 

        document.getElementById("song_title_display_text").style.visibility = "visible";
        document.getElementById("svg").style.visibility = "visible";
    
        song.play();
    
        setTimeout(function(){
            song.pause();
            document.getElementById("svg").style.visibility = "hidden";
            /* document.getElementById("song_title_display_text").style.visibility = "hidden"; */
        },
        5000); 
    }

/* check function that uses user input from Alan AI */
function checkAnswer(){

    let answer = "wrong";
    let guess = answer_from_alan;
    let pictures = ["https://media.giphy.com/media/vtm4qejJIl1ERPIrbA/giphy.gif","Images/meh.jpeg", "https://media.giphy.com/media/l0Iy7zmLUiALbkna8/giphy.gif", "Images/win.gif"];
    let messages = ["Better Luck Next Time!", "Not Bad!", "Pretty Good!", "Great Job!"];


    questionNumber++;

    console.log(artists[randomNumber]);
    console.log(titles[randomNumber]);
    console.log(randomNumber);


    if (guess.toUpperCase() === artists[randomNumber].toUpperCase() || guess.toUpperCase() === titles[randomNumber].toUpperCase()){
          correct++;
          answer = "right";
    }

    tracks.splice(randomNumber, 1);
    artists.splice(randomNumber, 1);
    titles.splice(randomNumber, 1);

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

    songCounter++;

}