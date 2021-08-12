
/*
Author: Johnathan Sutan
Last Updated: 8/10/21    
File linked: index.html, main.css, main.js, audio_visual.js
*/

const artistIds = {
pop: [
    271256, // Drake
    966309175, // Post Malone
    183313439, // Ed Sheeran
    159260351, // Taylor Swift
    956078923, // Cardi B
    1082533559, // xxxtentacion // https://www.youtube.com/watch?v=QZz9zQQwo3E
    358714030, // Imagine Dragons
    278873078, // Bruno Mars
    883131348, // BTS
    935727853, // Camila Cabello      
],
rap: [
    368183298, // Kendrick Lamar
    271256, // Drake
    682277, // Pusha T
    953921140, // Kodak Black
    1082533559, // xxxtentacion // https://www.youtube.com/watch?v=QZz9zQQwo3E
    111051, // Eminem
    313865761, // Meek Mill
    440458549, // Tory Lanez
    3973268, // Offset
    1276656483, // Lil Baby
],
rock: [
    358714030, // Imagine Dragons
    167649475, // Portugal. The Man
    80456331, // Panic! At the Disco
    349736311, // Twenty One Pilots
    258875116, // Five Finger Death Punch
    3296287, // Queen
    414023649, // Foster The People
    646178956, // Greta Van Fleet
    3996865, // Metallica
    136975, // The Beatles
]
};


const limit = 5; // The number of songs to retrieve for each artist
const pop = artistIds.pop;
const rap = artistIds.rap;
const rock = artistIds.rock;

const volume = 0.4;

var tracks = [];
var artists = [];
var titles = [];
var pictures = [];
var urls = [];

var songCounter = 1;
var correct = 0;
var randomNumber = 0;
var nSongs = 0;

var song = new Audio();;
var genre;

var playedArtists = [];

var timerFlag = "OFF";
var pauseTimer;
var delayFlag = "OFF";
var display = "OFF";

// end of declaration section.

/* Alan AI integrations */
var alanBtnInstance = alanBtn({
key: "ed946c823a6809ab3fccf523146d98f52e956eca572e1d8b807a3e2338fdd0dc/stage",
onCommand: function (commandData) {
    if (commandData.command === "go:back") {
    //call client code that will react on the received command
    }
    else if (commandData.command === "playsong") {
        playSong();
    }
    else if (commandData.command === "continuesong") {
        continueSong();
    }
    else if (commandData.command === "checkanswer") {
        var answerFromAlan = commandData.value.value;
        checkAnswer(answerFromAlan);  
    }
    else if( commandData.command === "getItunesData"){
        var genreFromAlan = commandData.value.value;
        getDataFromItunes(genreFromAlan);
    }
    else if (commandData.command === "resetpage") {
        correct = 0;
        songCounter = 1;
        playedArtists = [];
        document.getElementById("song_number").style.visibility = "hidden";
        document.getElementById("score").style.visibility = "hidden";
        document.getElementById("after_submit").style.visibility = "hidden";
        document.getElementById("svg").style.visibility = "hidden";
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
function checkParenthArray(arrayStr){
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

// function that checks a string for a paranthesis and returns a new string
// without the parantheses and the characters within the parantheses.
function checkParenthStr(Str){
    let parenthesis = '(';
    let newStr = '';

	let firstParenth = Str.indexOf(parenthesis);
	if( firstParenth != -1){
		newStr = Str.substring(0, firstParenth - 1);
	}
	return firstParenth != -1 ? newStr : Str; 
    // returns the the new string if a '(' was found, else the original string
}


// function that checks each item of a string array for a "feat." and returns a new array
// without the parantheses and the characters within the parantheses.
function checkFeatArray(arrayStr){
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

// function that checks a string for a "feat." and returns a new string
// without the parantheses and the characters within the parantheses.
function checkFeatStr(str){
    let feat = 'feat.';
    let startParenthesis = '()';
    let endParenthesis = ')';
    let endBracket = ']';
    let newStr = '';

    let firstFeat = str.indexOf(feat);
    let firstStartParenthesis = str.indexOf(startParenthesis);
    let firstEndParenthesis = str.indexOf(endParenthesis);
    let firstEndBracket = str.indexOf(endBracket);

    if(firstFeat != -1){	  
    if(checkFeatStr(str.substring( firstStartParenthesis, firstEndParenthesis )) != ''){
        newStr = str.substring(firstFeat + 6, firstEndParenthesis);
    }
    else{
        newStr = str.substring(firstFeat + 6, firstEndBracket);
    }
    }
    return newStr;
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

// if an item in artists has an ampersand
// have two variables = the two artists & have the check statement check with the two variables for artists
function splitArtists( str ){
    let ast = "*";
    let mainStr = "";
    let featStr = "";
    var indexAst = str.indexOf(ast);

    if(indexAst != -1){
        mainStr = str.substring(0, indexAst - 2);
        featStr = str.substring(indexAst + 2);
    }
    else{
        mainStr = str;
    }

    return {
        main: mainStr,
        feat: featStr,
    };

}

// function that takes a string and return an array, separating the words between commas and ampersands
// Used to parse out ampersands and commas from the strings from splitArtists()
function featArtists( str ){
    let newArray = [];
    var indexAmp = str.indexOf("&");
    var indexCom = str.indexOf(",");

    while (indexAmp != -1 || indexCom != -1){

        console.log(indexAmp);
        console.log(indexCom);
        console.log(str);
        console.log(newArray);
        console.log("");


        if(indexCom == -1){
            newArray.push(str.substring(0, indexAmp - 1));
            str = str.substring(indexAmp + 2);
        }
        else if(indexAmp == -1){
            newArray.push(str.substring(0, indexCom));
            str = str.substring(indexCom + 2);
        }
        else if( indexAmp > indexCom){
            newArray.push(str.substring(0, indexCom));
            str = str.substring(indexCom + 2);
        }
        else if( indexCom > indexAmp){
            newArray.push(str.substring(0, indexAmp - 1));
            str = str.substring(indexAmp + 2);
        }

        indexAmp = str.indexOf("&");
        indexCom = str.indexOf(",");
    } 

    newArray.push(str);

    return newArray;
}

// featArtists("Drake & Water, chicken,, &* e && plus");
// console.log(splitArtists("Drake & Water, chicken &* e && plus"));
// featArtists( splitArtists("Drake & Water, chicken,, &* e && plus") );
/*
var strings = splitArtists("Drake & Water, chicken &* e && plus");
var main = strings.main;
var feat = strings.feat;

console.log(featArtists(main));
console.log(featArtists(feat));
*/
// console.log(featArtists('Drake & Water, chicken &'));

/*
function getValues() {
return {
    first: getFirstValue(),
    second: getSecondValue(),
};
}
And to access them:

var values = getValues();
var first = values.first;
var second = values.second;
*/

/*
// function that checks each item of an array for punctuation and replaces 
// the punctuation accordingly.
function removePunctDigArray(arrayStr){

    var newArray = [];

    arrayStr.forEach(function(item, index, array) {
        var interString = '';
        var middleString = '';
        var finalString = '';
        var punct = item;
        var punctuationless = '';

        punctuationless = punct.replace(/[.,!?1]/g,"");
        interString = punctuationless.replace(/\s{2,}/g," ");
        console.log(punctuationless);
        punctuationless = interString.replace(/[$]/g,"S");
        console.log(punctuationless);
        middleString = punctuationless.replace(/\s{2,}/g," ");
        punctuationless = middleString.replace(/[\u00E9]/g,"e");
        finalString = punctuationless.replace(/\s{2,}/g," ");

    newArray.push(finalString);
    })

    return newArray;
}
*/

// function that checks a string for punctuation and replaces 
// the punctuation accordingly.
function removePunctDigStr(Str){

    var finalString = '';
    var punctuationless = '';

    punctuationless = Str.replace(/[.,!?1]/g,"");
    finalString = punctuationless.replace(/\s{2,}/g," ");

    punctuationless = finalString.replace(/[$]/g,"S");
    finalString = punctuationless.replace(/\s{2,}/g," ");

    punctuationless = finalString.replace(/[\u00E9]/g,"e");
    finalString = punctuationless.replace(/\s{2,}/g," ");

	punctuationless = finalString.replace(/AA/g,"a");
    finalString = punctuationless.replace(/\s{2,}/g," ");
	
	punctuationless = finalString.replace(/II/g,"2");
    finalString = punctuationless.replace(/\s{2,}/g," ")	
	
	punctuationless = finalString.replace(/Pt/g,"Part");
    finalString = punctuationless.replace(/\s{2,}/g," ")

	punctuationless = finalString.replace(/'Till/g,"Till");
    finalString = punctuationless.replace(/\s{2,}/g," ")

	punctuationless = finalString.replace(/Luv/g,"Love");
    finalString = punctuationless.replace(/\s{2,}/g," ");

    return finalString;
}

//removePunctDigArray(["water..", "chicken!", "mercy.1", ".water32", "A$AP Rocky", "Beyoncé", "!#$%watér"]);

function songHistory(){

    var sectionCountdownSelector = document.querySelector('.song_list'); // select your div

    var docFragment = document.createDocumentFragment(); // to not redraw DOM every time

    var song_div = document.createElement('DIV'); // create a div elem
    song_div.setAttribute('class', 'song_played');

    var img_element = document.createElement('IMG'); 
    img_element.setAttribute('class', 'circle_pic');
    img_element.src = pictures[randomNumber];

    // bconsole.log(playedPictures[songCounter - 1])

    var text_div = document.createElement('DIV');
    text_div.setAttribute('class', 'flexbox'); 

    var title_p = document.createElement('P'); 
    title_p.setAttribute('class', 'played_title');
    title_p.innerHTML = titles[randomNumber];

    // console.log(playedTitles[songCounter - 1])

    var artist_p = document.createElement('P'); 
    artist_p.setAttribute('class', 'played_artist'); 
    artist_p.innerHTML = playedArtists[songCounter - 1];
    //playedArtists is different than the others because it may have to display "& more..."
    
    var url_element = document.createElement("A");
    url_element.setAttribute('class', 'track_url');
    url_element.href = urls[randomNumber];
    url_element.target = "_blank";

    var track_tab = document.createElement('P'); 
    track_tab.setAttribute('class', 'material-icons');
    track_tab.innerHTML = '&#xe89e;';

    /*
    <a href="https://www.tabletopgamingnews.com/category/board-games/" target="_blank"><p class="material-icons">&#xe89e;</p></a>
    */

    // console.log(playedArtists[songCounter - 1])

    docFragment.appendChild(song_div); // append div elem to your fragment
    song_div.appendChild(img_element); 
    song_div.appendChild(text_div);
    text_div.appendChild(title_p);
    text_div.appendChild(artist_p);
    song_div.appendChild(url_element);
    url_element.appendChild(track_tab);  

    sectionCountdownSelector.insertBefore(docFragment, sectionCountdownSelector.childNodes[0]); 
    // this appends the elem on your DOM
}

// function that retrieves the songs, or specifically preview URLs, from iTunes
function getDataFromItunes(genreResponse){

    tracks = [];
    artists = [];
    titles = [];
    urls = [];

    genre = genreResponse;
    if(genre == "pop"){
        genre = pop;
    }
    else if(genre == "Rock"){
        genre = rock;
    }
    else if(genre == "rap"){
        genre = rap;
    }

    console.log(genre.length);

    const url = 'https://itunes.apple.com/lookup?id='+ genre.join() + '&entity=song&limit=' + limit;
            // https://itunes.apple.com/lookup?id=262836961          &entity=song&
    // limit=5
    const cors = 'https://cors-anywhere.herokuapp.com/';
    console.log(cors + url);

    var featArtist = '';
    nSongs = 0;

    // change the genres back to string for comparison of song's primaryGenreName
    // uppercase here so uppercase function is not required a second time during comparison
    if(genre == pop){
        genre = "POP";
    }
    else if(genre == rock){
        genre = "ROCK";
    }
    else if(genre == rap){
        genre = "RAP";
    }
    fetch(cors + url) //fetch url and turn it into JSON then into HTML
    // fetch(url) //fetch url and turn it into JSON then into HTML
    .then( data => data.json())
    .then( json => {
    console.log(json);

        //let finalHTML = '';
        json.results.forEach( song => {

            if(song.kind == "song"){
                //previewUrl = previewUrl.append(song.previewUrl);
                // tracks = song.previewUrl;

                // checks for repeats
                var i = 0;
                var repeat = false;
                for(i; i < nSongs; i++){

                    if(removePunctDigStr(checkParenthStr(song.trackCensoredName) ) == removePunctDigStr( checkParenthStr(titles[i] ) ) ){
                        repeat = true;
                        }
                }

                // if not a repeat
                if(!repeat){

                    if(genre == "ROCK"){
                        
                        titles.push(song.trackCensoredName);
                        tracks.push(song.previewUrl);
                        nSongs++;
                        featArtist = checkFeatStr(song.trackCensoredName); 
                        pictures.push(song.artworkUrl60);
                        urls.push(song.trackViewUrl);
    
                        // if there's a feat artist, add it to the artists array with the corresponding correct artist for later parsing
                        if (featArtist != ""){
                            artists.push(song.artistName + " &* " + featArtist);
                        }
                        else{
                            artists.push(song.artistName);
                        }
                    }
                    // check if the song is actually a song of the chosen genre
                    //let's not check rock- rock artists mostly do rock/alternative/metal genre anyway
                    else if(song.primaryGenreName.toUpperCase().includes(genre) ){

                        titles.push(song.trackCensoredName);
                        tracks.push(song.previewUrl);
                        nSongs++;
                        featArtist = checkFeatStr(song.trackCensoredName); 
                        pictures.push(song.artworkUrl60);
                        urls.push(song.trackViewUrl);
    
                        if (featArtist != ""){
                            artists.push(song.artistName + " &* " + featArtist);
                        }
                        else{
                            artists.push(song.artistName);
                        }

                    }

                }

            }

        })

    // EASTER EGG (THANKS TO IAN FOR THE IDEA)
    artists.push("Rick Astley");
    titles.push("Never Gonna Give You Up");
    tracks.push("https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview124/v4/16/0e/1e/160e1e17-1b38-1980-06ac-ec5e21f85a06/mzaf_7101340016362413522.plus.aac.p.m4a");
    pictures.push("https://is4-ssl.mzstatic.com/image/thumb/Music115/v4/33/96/b2/3396b234-6916-4418-4bf1-526de38c8de8/source/60x60bb.jpg");
    urls.push("https://music.apple.com/us/album/never-gonna-give-you-up/1558533900?i=1558534271&uo=4");
    nSongs++;

    titles = checkParenthArray(titles);

    // console.log(JSON.stringify(obj));
    console.log(tracks);
    console.log(titles);
    console.log(artists);
    })
    .catch( error => console.log(error))

}

// function that pauses song after 5 seconds
function timer(){
    timerFlag = "ON",
    pauseTimer = setTimeout(function(){
        song.pause();
        timerFlag = "OFF";
    },
    5000); 
}

// function that plays the song for an initial 5 seconds
function playSong(){
    if( display == "ON"){
        setTimeout(function(){
            playSong();
        },
        3500);
        return;
    }

    randomNumber = Math.floor(Math.random() * ( nSongs - songCounter)); 
    // "* nSongs" because that's the total number of songs
    // "- songCounter" because a song is used each time, decreasing the array, 
    // so the random number selecting the song should be decremented.
    console.log(nSongs)

    var range = document.querySelector("#range");

    song.src = tracks[randomNumber]; 
    song.volume = volume;

    // disables the button on the slider, so user cannot control the music
    document.getElementsByClassName("buttons").disabled = true;

    document.getElementById("song_number").innerHTML = "Song #" 
    + songCounter;

    console.log(song);
    console.log(randomNumber);
    console.log(artists[randomNumber], " and ", titles[randomNumber]);
    console.log(tracks);

    document.getElementById("song_number").style.visibility = "visible";
    document.getElementById("svg").style.visibility = "visible";
    randomSoundwave();

    var playPromise = song.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {

        total_time = 10; /* song.duration; */
        range.max = 10;  /* total_time; */

        timer();
        // updates the button on the bar
        song.addEventListener('timeupdate',function(){
            range.value = song.currentTime; 
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
function continueSong(){

    // song.src = tracks[randomNumber]; 
    document.getElementById("song_number").style.visibility = "visible";
    document.getElementById("svg").style.visibility = "visible";

    song.play();

    timer();
}

// function that displays corresponding messages and gif longer after checking the user's answer
function displayLonger(){
    display = "ON";
    document.getElementById("after_submit").style.visibility ="visible";
    displayTimer = setTimeout(function(){
        document.getElementById("after_submit").style.visibility = "hidden";
        display = "OFF";
    },
    3500); 
}

/* check function that uses user input from Alan AI */
function checkAnswer(guessResponse){

    let answer = "wrong";
    let guess = guessResponse;
    // let pictures = ["https://media.giphy.com/media/vtm4qejJIl1ERPIrbA/giphy.gif","Images/meh.jpeg", "https://media.giphy.com/media/JLFq4Jh5bSJEDHZjSB/giphy.gif", "https://media.giphy.com/media/1APbU1fHHJpBi0EA4y/giphy.gif"];
    // let endMessages = ["No Sweat!", "Not Bad!", "Pretty Good!", "Great Job!"];
    let messages = ["C'mon!", "Awesome!", "*FEATURED artist*"];
    let verdict = 0;

    console.log(artists[randomNumber]);
    console.log(titles[randomNumber]);
    console.log(randomNumber);

    // if an item in artists has an ampersand
    // have two variables = the two artists & have the check statement check with the two variables for artists

    var strings = splitArtists(artists[randomNumber]);
    var main = strings.main;
    var feat = strings.feat;

    var mainArray = featArtists(main);
    var featArray = featArtists(feat);

    console.log(featArtists(main));
    console.log(featArtists(feat));

    if( timerFlag == "OFF"){
        ;
    }
    else if( timerFlag == "ON"){
        clearTimeout(pauseTimer);
        song.pause();
    }
    else{
        console.log("Error");
    }

    // loop to get every artist of mainArray
    let i = 0;
    for (i = 0; i < mainArray.length; i++) {

        console.log(mainArray[i]);

        if(removePunctDigStr(mainArray[i]).toUpperCase() == "XXXTENTACION"){
            if (guess.toUpperCase() === "XXXTENTACION" || guess.toUpperCase() === "XXX TENTACION" || guess.toUpperCase() === "XXXTENTATION" ){
                answer = "right";
            }
        }
        else if(removePunctDigStr(mainArray[i]).toUpperCase() == "BTS"){
            if (guess.toUpperCase() === "BTS" || guess.toUpperCase() === "B T S" || guess.toUpperCase() === "BBTS" || guess.toUpperCase() === "BEACHES" || guess.toUpperCase() === "BEETS" || guess.toUpperCase() === "DTS" ||guess.toUpperCase() === "80S"){
            answer = "right";
            }
        }
        else if(removePunctDigStr(mainArray[i]).toUpperCase() == "DESIIGNER"){
            if (guess.toUpperCase() === "DESIIGNER" || guess.toUpperCase() === "DESIGNER"){
            answer = "right";
            }
        }
        else if(removePunctDigStr(mainArray[i]).toUpperCase() == "MC EIHT"){
            if (guess.toUpperCase() === "MC EIGHT" || guess.toUpperCase() === "MC8" || guess.toUpperCase() === "MCA"){
            answer = "right";
            }
        }
        else if(removePunctDigStr(mainArray[i]).toUpperCase() == "NO FLOCKIN"){
            if (guess.toUpperCase() === "NO FLOCKIN" || guess.toUpperCase() === "NO FLOCKING"){
            answer = "right";
            }
        }
        else if (guess.toUpperCase() === removePunctDigStr(mainArray[i]).toUpperCase() ){
            answer = "right";
        }
    }

    // loop to get every artist of featArray
    for (i = 0 ; i < featArray.length; i++) {

        console.log(featArray[i]);

        if(removePunctDigStr(featArray[i]).toUpperCase() == "XXXTENTACION"){
            if (guess.toUpperCase() === "XXXTENTACION" || guess.toUpperCase() === "XXX TENTACION" || guess.toUpperCase() === "XXXTENTATION" ){
            answer = "close";
            }
        }
        else if(removePunctDigStr(featArray[i]).toUpperCase() == "BTS"){
            if (guess.toUpperCase() === "BTS" || guess.toUpperCase() === "B T S" || guess.toUpperCase() === "BBTS" || guess.toUpperCase() === "BEACHES" || guess.toUpperCase() === "BEETS" || guess.toUpperCase() === "DTS" ||guess.toUpperCase() === "80S"){
            answer = "close";
            }
        }
        else if(removePunctDigStr(featArray[i]).toUpperCase() == "RM OF BTS"){
            if (guess.toUpperCase() === "RM OF BTS" || guess.toUpperCase() === "RM" || guess.toUpperCase() === "RN" || guess.toUpperCase() === "RM OF BEACHES" || guess.toUpperCase() === "BTS" || guess.toUpperCase() === "B T S" || guess.toUpperCase() === "BBTS" || guess.toUpperCase() === "BEACHES" || guess.toUpperCase() === "BEETS" || guess.toUpperCase() === "DTS" ||guess.toUpperCase() === "80S"){
            answer = "close";
            }
        }
        else if(removePunctDigStr(featArray[i]).toUpperCase() == "DESIIGNER"){
            if (guess.toUpperCase() === "DESIIGNER" || guess.toUpperCase() === "DESIGNER"){
                answer = "close";
            }
        }
        else if(removePunctDigStr(featArray[i]).toUpperCase() == "MC EIHT"){
            if (guess.toUpperCase() === "MC EIGHT" || guess.toUpperCase() === "MC8" || guess.toUpperCase() === "MCA"){
                answer = "close";
            }
        }
        else if(removePunctDigStr(featArray[i]).toUpperCase() == "NO FLOCKIN"){
            if (guess.toUpperCase() === "NO FLOCKIN" || guess.toUpperCase() === "NO FLOCKING"){
                answer = "close";
            }
        }
        else if (guess.toUpperCase() === removePunctDigStr(featArray[i]).toUpperCase() ){
            answer = "close";
        }
    }

    if (guess.toUpperCase() === removePunctDigStr(titles[randomNumber]).toUpperCase() ){
        answer = "right";
    }

    // update the score, correct artist and title, and corresponding picture and messages
    if (answer === "wrong"){
        verdict = 0;
        document.getElementById("picture").src = "https://media.giphy.com/media/l3vR3gvEdsdJl26oU/giphy.gif";
    }
    else if (answer === "right"){
        verdict = 1;
        correct++;
        document.getElementById("picture").src = "https://media.giphy.com/media/RJJzGXGV9o9gbwZUFn/giphy-downsized.gif";
    }
    else if (answer === "close"){
        verdict = 2;
        document.getElementById("picture").src = "https://media.giphy.com/media/xThta485tRMnh08slq/giphy.gif";
    }


    document.getElementById("score").innerHTML = "Score: " + correct + " / " + songCounter;

    document.getElementById("is_correct").innerHTML = answer.toUpperCase() + "!"
    document.getElementById("message").innerHTML = messages[verdict];

    document.getElementById("song_title").innerHTML = titles[randomNumber];

    if( mainArray.length > 1){
        document.getElementById("song_artist").innerHTML = mainArray[0] + " & more...";
        playedArtists.push(mainArray[0] + " & more...");
    }
    else{
        document.getElementById("song_artist").innerHTML = mainArray[0];
        playedArtists.push(mainArray[0]);
    }

    // display the score, correct artist and title, and corresponding picture and messages
    // after_submit is the section comprising of: song, picture, and is_correct
    displayLonger();
    document.getElementById("score").style.visibility = "visible";

    delayFlag = "ON";
    alanBtnInstance.playText(answer + "!");
    alanBtnInstance.playText(" The song was " + titles[randomNumber] + " by " + mainArray[0]);
    delayFlag = "OFF";

    // splice removes the selected item from the array
    // removes the played song and prevents playing repeats, or the same song multiple times.
    songHistory();

    tracks.splice(randomNumber, 1);
    artists.splice(randomNumber, 1);
    titles.splice(randomNumber, 1);
    pictures.splice(randomNumber, 1);
    urls.splice(randomNumber, 1);

    songCounter++;
}