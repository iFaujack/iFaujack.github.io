
var words = ['BOOK','COLOR','STICKY','CHARGER','SWEATER','DAGGER','CULTURE','regrettable','codification','ottoman']
var hints = ['a handwritten or printed work of fiction or nonfiction, usually on sheets of paper fastened or bound together within covers.',
        'the quality of an object or substance with respect to light reflected by the object, usually determined visually by measurement of hue, saturation, and brightness of the reflected light; saturation or chroma; hue.',
        'covered with adhesive or viscid matter:',
        'Pengisi laptop',
        'a knitted jacket or jersey, in pullover or cardigan style, with or without sleeves.',
        'a short, swordlike weapon with a pointed blade and a handle, used for stabbing.',
        'a particular form or stage of civilization, as that of a certain nation or period:',
        'causing or deserving regret; unfortunate; deplorable.',
        'the act, process, or result of arranging in a systematic form or code.',
        'a Turk of the family or tribe of Osman.'
    ]
var score = 0;
var index = 0;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAsa4XEI1TEQbV-TPKM_KgYb6mL8Q2Z1BU",
    authDomain: "final-porject-hacktiv8.firebaseapp.com",
    databaseURL: "https://final-porject-hacktiv8.firebaseio.com",
    storageBucket: "final-porject-hacktiv8.appspot.com"
};
firebase.initializeApp(config);

var database = firebase.database().ref();

database.orderByChild('score').limitToLast(5).on('child_added',function(data){
        console.log(data.val())
    })


guideJs()
getWord(words[index]);


function getWord(word){
    var a = word.split("");
    var randomWord= [];
    var i = a.length
    var j = 0;

    console.log('getword')

    while (i--){
        j = Math.floor(Math.random()*(i+1));
        randomWord.push(a[j]);
        a.splice(j,1);
    }
    console.log(randomWord.join(""))
    $('#random-word').text(randomWord.join(""));
    $('#hint').text(hints[index])
}


$('#submitAnswer').click(function(){
    var answer = $('#answer').val();
    answer = answer.toUpperCase ();
    $('#answer').val('');
    console.log(answer);

    if (answer == words[index].toUpperCase() ){
        score =  score + 1;
        console.log(score);
        playSound('coin'); 
        if (index >= words.length-1){
            console.log('Soal habis')
            // alertScore(score)
            leaderboard(score);
            restartGame();
        } else {
            index++;
            getWord(words[index]);
            
        }
        $('#score').text(score);
        
    } else {
        playSound('dead')
        console.log('jawaban Salah')
    }
})

$('#answer').keypress(function(e){
    if (e.keyCode==13){
        event.preventDefault();
        $('#submitAnswer').trigger("click");
    }
})

$('#next').click(function(){
    if (index >= words.length-1){
        console.log('Soal Habis');
        // alertScore(score)
        leaderboard(score)
        restartGame();
    } else {
        playSound('jump');
        index++;
        getWord(words[index])
    }

})



// function leaderboard(index){
//     Swal.fire({
//         title: 'Submit Your Username',
//         input: 'text',
//         confirmButtonText: 'Submit',
//         showLoaderOnConfirm: true,
//         preConfirm : function saveScore(login){
//             var arrayScore = [];
//             // var newScore = {};
//             // newScore.name = login;
//             // newScore.score = index;
//             database.push({
//                 username: login,
//                 score: index
//             })
//             database.orderByChild('score').limitToLast(5).on('child_added',function(data){
//                 console.log(data.val());
//                 arrayScore.push(data.val());  
//         })
//     }
// })
function guideJs(){
    Swal.fire(
        'Guide for your life!',
        '1. You must solve the random word to 1 word in english \n 2. if you want answer by your speak just click mic button. 3. 10 Question and answer it!',
        'Info'
      )
}

function leaderboard(index){
    Swal.fire({
    title: 'Submit your username',
    input: 'text',
    inputAttributes: {
        autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Look up',
    showLoaderOnConfirm: true,
    preConfirm: function saveScore(login){
        var arrayScore = [];
        database.push({
                username: login,
                score: index
            })
        database.orderByChild('score').limitToLast(5).on('child_added',function(data){
        // console.log(data.val());
        arrayScore.push(data.val()); 
    })
    return arrayScore;
    },
    allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        console.log(result);
        
        var template = `<ol type="1">
            <li> ${result.value[4].username}  ${result.value[4].score} </li>
            <li> ${result.value[3].username}  ${result.value[3].score} </li>
            <li> ${result.value[2].username}  ${result.value[2].score} </li>
            <li> ${result.value[1].username}  ${result.value[1].score} </li>
            <li> ${result.value[0].username}  ${result.value[0].score} </li>
            <ul>`
        
        Swal.fire({
            title:'Leaderboard',
            html:`${template}`,
        confirmButtonText:'COOL'
        })
    })
    restartGame()
}


function save(){
    var newScore = {};
    newScore.name = document.getElementById('name').value;
    newScore.score = parseInt(document.getElementById('score').value);
    console.log(newScore.name + newScore.score);
    firebase.database().ref().push({
        username : newScore.name,
        score: newScore.score
    })
}

function restartGame(){
    console.log("Reset score and question")
    index = 0;
    score = 0;
    $('#score').text(score);
    getWord(words[index]);
}



//Speech Recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = "en-ID";

recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('')

    console.log(transcript);
    $('#answer').val(transcript);
})

$('#microfon').click(function(e){
    recognition.start();
})

