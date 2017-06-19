
  var config = {
    apiKey: "AIzaSyAPFCD8q0p2Y6MNsQ1as2yZHOeg2KUD8-s",
    authDomain: "train-scheduler-71526.firebaseapp.com",
    databaseURL: "https://train-scheduler-71526.firebaseio.com",
    projectId: "train-scheduler-71526",
    storageBucket: "train-scheduler-71526.appspot.com",
    messagingSenderId: "631142739129"
  };

  firebase.initializeApp(config);
  var database = firebase.database();

  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = "";
  var nextArrival = "";
  var minutesAway = "";
  var html = "";

$("#submit-button").on("click", function(event) {
    event.preventDefault();

    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    frequency = $("#frequency").val().trim();
    firstTrainTime = $("#first-train").val().trim();


    database.ref().push({
    trainName: trainName,
    destination: destination,
    frequency: frequency,
    firstTrainTime: firstTrainTime,
    });

    $("#train-name").val('');
    $("#destination").val('');
    $("#frequency").val('');
    $("#first-train").val('');
  });


database.ref().orderByChild('employeeRole').on("child_added", function(snapshot) {

      var html = $('<div class="row">')

      firstTrainTime = snapshot.val().firstTrainTime;
      frequency = snapshot.val().frequency;

      nextTrainTime(firstTrainTime, frequency);

      html.append('<div class="column">' + (snapshot.val().trainName) + '</div>');
      html.append('<div class="column">' + (snapshot.val().destination) + '</div>');
      html.append('<div class="column">' + (snapshot.val().frequency) + '</div>');
      html.append('<div class="column">' + moment(nextArrival).format("hh:mm a") + '</div>');
      html.append('<div class="column">' + minutesAway + '</div>');
      $("#train-display").append(html);     
      });
        


  function nextTrainTime (firstTrainTime, frequency) {
    
    console.log(firstTrainTime);
    console.log(frequency);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTrainTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log(firstTrainTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder) -- [minutes since last train]
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    minutesAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    // Next Train
    nextArrival = moment().add(minutesAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));
  }

