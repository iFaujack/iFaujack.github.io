(function(){
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAsa4XEI1TEQbV-TPKM_KgYb6mL8Q2Z1BU",
        authDomain: "final-porject-hacktiv8.firebaseapp.com",
        databaseURL: "https://final-porject-hacktiv8.firebaseio.com",
        storageBucket: "final-porject-hacktiv8.appspot.com"
    };
    firebase.initializeApp(config);

    var database = firebase.database().ref();
})