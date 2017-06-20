
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

// GLOBAL VARIABLES
  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var firstTrainTimeArray = [];
  var frequency = "";
  var frequencyArray = [];
  var nextArrival = "";
  var minutesAway = "";
  var html = "";
  var counter = 0;
  var isOn = true;

// PUSHES DATA TO DATABASE ON SUBMIT
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



//UPDATES TABLE ON LOAD AND WHEN CHILD IS ADDED, UPDATES NEXT ARRIVAL AND MINUTES AWAY EVERY 10 SECONDS
database.ref().orderByChild('employeeRole').on("child_added", function(snapshot) {

      var html = $('<div class="row">')

      firstTrainTime = snapshot.val().firstTrainTime;
      firstTrainTimeArray.push(firstTrainTime);

      frequency = snapshot.val().frequency;
      frequencyArray.push(frequency);

      nextTrainTime(firstTrainTime, frequency);

      html.append('<div class="column">' + (snapshot.val().trainName) + '</div>');
      html.append('<div class="column">' + (snapshot.val().destination) + '</div>');
      html.append('<div class="column">' + (snapshot.val().frequency) + '</div>');
      html.append('<div class="column" id="next-arrival-' + counter + '">' + moment(nextArrival).format("hh:mm a") + '</div>');
      html.append('<div class="column last" id="minutes-away-' + counter + '">' + minutesAway + '</div>');
      $("#train-display").append(html);
      counter++;
      });


//CALLS UPDATE EVERY 5 SECONDS
setInterval(update, 5000);

//TAKES FIRST TRAIN TIME AND FREQUENCY AS ARGUMENTS TO PRODUCE NEXT ARRIVAL TIME AND MINUTES AWAY
  function nextTrainTime(firstTrainTime, frequency) {

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTrainTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");

    // Time apart (remainder) -- [minutes since last train]
    var tRemainder = diffTime % frequency;

    // Minute Until Train
    minutesAway = frequency - tRemainder;

    // Next Train
    nextArrival = moment().add(minutesAway, "minutes");
  }

//UPDATES SCREEN WITH NEXT ARRIVAL TIME AND MINUTES AWAY FOR EACH TRAIN -- BASED ON LOCAL TIME
  function update() {
    for (var i = 0; i < counter; i++) {
      nextTrainTime(firstTrainTimeArray[i], frequencyArray[i]);
      $('#next-arrival-' + i).html(moment(nextArrival).format("hh:mm a"));
      $('#minutes-away-' + i).html(minutesAway);      
        };
  };


