var synth = window.speechSynthesis;

var vozes = [];

function listarVozes() {
    vozes = synth.getVoices().sort(function (a, b) {
        const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
        if ( aname < bname ) return -1;
        else if ( aname == bname ) return 0;
        else return +1;
    });
}

listarVozes();

function carregarCamera(){
    var imagem = document.querySelector("#camera");

    imagem.setAttribute('autoplay', '');
	imagem.setAttribute('muted', '');
	imagem.setAttribute('playsinline', '');

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({audio: false, video: {facingMode: 'environment'}})
        .then(function(stream) {
            imagem.srcObject = stream;
        })
        .catch(function(error){
            alert("Erro ao encontrar camera")
        });
    }
}

function tirarFoto(){
    var imagem = document.querySelector("#camera");

    var exibicao = document.createElement('canvas');
    exibicao.width = imagem.videoWidth;
    exibicao.height = imagem.videoHeight;

    var contexto = exibicao.getContext('2d');

    contexto.drawImage(imagem, 0, 0, exibicao.width, exibicao.height);

    var dataURI = exibicao.toDataURL('image/jpeg');
    //alert(dataURI);
    enviarFoto(dataURI);
}

function enviarFoto(base64){
    var imagem = base64;
    var base64ImageContent = imagem.replace("data:image/jpeg;base64,", "");

    var request = new XMLHttpRequest();
    var url = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyA6vfbOn2v66Mo4HraUNKyBCJbBV9jDcBA';
	request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var json = JSON.parse(request.responseText);
            //console.log(json)
            objetos = json.responses[0].localizedObjectAnnotations;
            processarObjetos(objetos);
        }
    };
    var data = JSON.stringify({"requests":[{"image":{"content": "" + base64ImageContent + ""},"features":[{"type":"OBJECT_LOCALIZATION","maxResults":10}]}]});
    request.send(data);
}

function processarObjetos(Array) {
    var objetos = Array;
    
    const nomes = [];
    for (var i = 0; i < objetos.length; i++)
            {
                // console.log(objetos[i].name);
                // console.log(objetos[i].score);
                console.log(objetos[i]);
                nomes.push(objetos[i].name);
            }
            console.log(nomes);
            traduzir(nomes);
}

function traduzir(Array) {
    var request = new XMLHttpRequest();
    var url = 'https://translation.googleapis.com/language/translate/v2?key=AIzaSyA6vfbOn2v66Mo4HraUNKyBCJbBV9jDcBA';
	request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var json = JSON.parse(request.responseText);
            ajustarTraducoes(json.data.translations);
            console.log(json.data.translations);
        }
    };
    var data = JSON.stringify({"q": Array, "source":"en","target":"pt"});
    request.send(data);
}

function ajustarTraducoes(Array) {
    traducoes = " ";

    for (let i = 0; i < Array.length; i++) {
        traducoes += " " + Array[i].translatedText;
    }

    traducoes = traducoes.replace("Principal", "Camiseta");
    traducoes = traducoes.replace("Tampo da mesa", "Mesa");
    traducoes = traducoes.replace("Confecções", "Roupas");
    console.log(traducoes);
    falar(traducoes);
}

function falar(String){
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }

    texto = String;
    if (texto !== '') {
        var textoAFalar = new SpeechSynthesisUtterance(texto);

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

carregarCamera();

function looping() {
  setTimeout(function() {
    tirarFoto();
    looping();
  }, 7000)
}

looping(); 