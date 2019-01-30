var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var response = "";
var screens = new Array(11);
var comment = false;
var schedule = false;
var newComment;
var commentArea;
var indicator = document.getElementById("indicator");
var bg2 = false;

for (i = 0; i < screens.length; i++) {
  screens[i] = document.getElementById("screen"+i);
  console.log(screens[i]);
}

responsiveVoice.setDefaultVoice("UK English Female");

var phrases = [
  'show me my team time cards',
  "show me all missed punches",
  "clock in",
  "Shayne Bowman"
]

var diagnosticPara = document.querySelector('.output');

var submitBtn = document.getElementById("speakButton");
var textBtn = document.getElementById("textButton");
var textInput = document.getElementById("userInputText");
submitBtn.addEventListener('click', evalSpeech);
textBtn.addEventListener('click', evalText);

var userInput = "";


function evalText () {
  console.log(textInput.value);
  userInput = textInput.value;
  botResponse(userInput);
  document.getElementById("speakButton").style.display = "block";
  document.getElementById("textButton").style.display = "none";
}

function evalSpeech() {
  submitBtn.disabled = true;
  submitBtn.textContent = '...';

  var grammar = '#JSGF V1.0; grammar phrase;';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  indicator.style.backgroundColor = "gray";

  recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    userInput = event.results[0][0].transcript;
    indicator.style.backgroundColor = "lime";

    console.log('Confidence: ' + event.results[0][0].confidence);
    setTimeout(botResponse(userInput),1000);
    var element = document.getElementById("container");
    element.scrollTop = element.scrollHeight;
  }

  recognition.onspeechend = function() {
    recognition.stop();
    submitBtn.disabled = false;
    submitBtn.innerHTML = "<i class=\"material-icons\">keyboard_voice</i>" ;
  }

  recognition.onerror = function(event) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = "<i class=\"material-icons\">keyboard_voice</i>";
    console.log('Error occurred in recognition: ' + event.error);
    indicator.style.backgroundColor = "red";
    response = "Sorry I didn't get that.";
    newOutput(response);
    responsiveVoice.speak(response);
  }
}

function botResponse (userInput) {
  indicator.style.backgroundColor = "lime";

  if (!comment) newInput(userInput);

  if (comment) {
    commentArea.value = userInput;
    responsiveVoice.speak("Got it! You can clock in, edit, or cancel.");
    comment = false;

  } else if (userInput.includes("clock")) {
    response = "Preparing to clock in now at 10:30 AM. What would you like to say?";
    newOutput(response);
    responsiveVoice.speak(response);
    comment = true;
    newComment = document.createElement("div");
    newComment.className = "clockComment";
    document.getElementById("contentArea").appendChild(newComment);
    newComment.innerHTML = screens[1].innerHTML;
    commentArea = document.createElement("textarea");
    newComment.appendChild(commentArea);
    var clockButton = document.createElement("button");
    clockButton.textContent = "CLOCK IN";
    clockButton.className = "clockButton";
    newComment.appendChild(clockButton);

  } else if(userInput.includes("time card")) {
    response = "Here is a summary of your team's timecards: You have five timecards with exceptions, and eight ready to approve.";
    newOutput("Here is a summary of your team's timecards:");
    newScreen(screens[2]);
    responsiveVoice.speak(response);

  } else if (userInput.includes("missed punches")) {
    response = "You have 8 missed punches across five timecards. You can review and edit the exceptions directly.";
    newOutput("Here are your team's missed punches:");
    newScreen(screens[3]);
    responsiveVoice.speak(response);

  } else if (userInput.includes("time-off request") === true | userInput.includes("time off request") == true | userInput.includes("vacation request") == true | userInput.includes("time request") == true) {
    newOutput("Time Off Requests:");
    newScreen(screens[8]);
    responsiveVoice.speak("Kenneth Williamson has requested vacation on Monday, October 16th to Friday, October 20th. He left the following comment:");
    responsiveVoice.setDefaultVoice("US English Male");
    responsiveVoice.speak("I'm going to California for a dance competition.");
    responsiveVoice.setDefaultVoice("UK English Female");
    responsiveVoice.speak("You can: approve, reject, repeat, or skip.");

  } else if (userInput.includes("Greg Murphy's birthday") === true) {
    response = "Greg Murphy's birthday is November 3rd.";
    newOutput("Here's what I found from public employee information:");
    newScreen(screens[7]);
    responsiveVoice.speak(response);

  } else if (userInput.includes("vacation")) {
    response = "You have accrued 14 days of vacation. Would you like to put in a time-off request?";
    newOutput(response);
    responsiveVoice.speak(response);

  } else if (userInput.includes("Tuesday") | userInput.includes("tuesday")) {
    response = "OK, I'll put in a time-off request for Tuesday, August 11th, 2017. You can add a comment, or submit it.";
    newOutput(response);
    newScreen(screens[5]);
    responsiveVoice.speak(response);

  } else if (userInput.includes("schedule")) {
    schedule = true;
    response = "You are working today from 9 AM to 5 PM. Would you like a digest of your calendar?";
    newOutput(response);
    responsiveVoice.speak(response);

  } else if (userInput.includes("yes") && schedule) {
    schedule = false;
    response = "You have 2 meetings today: At 9 AM you have Team Grooming in the Boardroom 4th floor. At 3:30 PM you have a Benefits Research read out in Margaret Hamilton.";
    newOutput(response);
    responsiveVoice.speak(response);
    newScreen(screens[10]);

  } else {
    response = "Sorry I didn't get that.";
    newOutput(response);
    responsiveVoice.speak(response);
    newScreen(screens[9]);
    indicator.style.backgroundColor = "red";
  }

}

function punchEdit(clicked) {
  var contentDiv = clicked.parentNode;
  contentDiv.innerHTML = screens[4].innerHTML;
}

function punchCollapse(clicked){
  var contentDiv = clicked.parentNode;
    contentDiv.innerHTML = screens[3].innerHTML;
}

function vacationEdit(clicked) {
  var contentDiv = clicked.parentNode;
    contentDiv.innerHTML = screens[6].innerHTML;
}


function newInput(text) {
  var input = document.createElement("div");
  document.getElementById("contentArea").appendChild(input);
  input.className = "user-input";
  input.innerHTML = "<p>" + text + "</p>";
}

function newOutput(text) {
  var output = document.createElement("div");
  document.getElementById("contentArea").appendChild(output);
  output.className = "output";
  output.innerHTML = "<p>" + text + "</p>";
}

function newScreen(screenNum) {
  var newScreen = document.createElement("div");
  document.getElementById("contentArea").appendChild(newScreen);
  newScreen.innerHTML = screenNum.innerHTML;
}

document.getElementById("userInputText").addEventListener('change', textEntry);

function textEntry() {
  document.getElementById("speakButton").style.display = "none";
  document.getElementById("textButton").style.display = "block";
}

function changeBG() {
  if (bg2) {
    document.body.style.backgroundImage="url('img/background1.jpg')";
    bg2 = false;
  }
  else {
    document.body.style.backgroundImage="url('img/background2.jpg')";
    bg2 = true;
  }
}
