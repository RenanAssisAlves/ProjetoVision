var synth = window.speechSynthesis;

var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('.txt');

var vozes = [];

function populateVoiceList() {
    vozes = synth.getVoices().sort(function (a, b) {
        const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
        if ( aname < bname ) return -1;
        else if ( aname == bname ) return 0;
        else return +1;
    });
}

populateVoiceList();

function speak(){
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }

    if (inputTxt.value !== '') {
    var textoAFalar = new SpeechSynthesisUtterance(inputTxt.value);

    for(i = 0; i < vozes.length ; i++) {
      if(vozes[i].name === "Microsoft Daniel - Portuguese (Brazil)") {
        textoAFalar.voice = vozes[i];
        break;
      }
    }
    textoAFalar.pitch = 1;
    textoAFalar.rate = 1;
    synth.speak(textoAFalar);
  }
}

inputForm.onsubmit = function(event) {
    event.preventDefault();
  
    speak();
  }