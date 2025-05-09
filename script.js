const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const musicaFocoInput = document.querySelector('#alternar-musica');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const iconeIniciarOuPausarBt = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector('#timer');

//3 objetos JavaScript para ter mais controle sobre cada botao
const objetoBtnFoco = {
    nome: 'foco',
    tempo: 1500 //25 min * 60 seg
}
const objetoBtnDescansoCurto = {
    nome: 'descanso-curto',
    tempo: 300 //5 min * 60 seg
}
const objetoBtnDescansoLongo = {
    nome: 'descanso-longo',
    tempo: 900 //15 min * 60 seg
}

//array dos objetos para ser usado na forEach para recomeçar o contador
const objetosBtn = [objetoBtnFoco, objetoBtnDescansoCurto, objetoBtnDescansoLongo];

let botaoSelecionado = 'foco'; //pré-selecionado 'foco', se não quisesse pré-seleção, seria 'null'

const musica = new Audio('./sons/luna-rise-part-one.mp3');
const audioPlay = new Audio('./sons/play.wav');
const audioPause = new Audio('./sons/pause.mp3');
const audioBeep = new Audio('./sons/beep.mp3');

let tempoDecorridoEmSegundos = objetoBtnFoco.tempo; //pré-selecionado tempo do 'foco'
let intervaloId = null; // irá armazenar os valores da função setInterval

musica.loop = true;
musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = objetoBtnFoco.tempo;
    alterarContexto(objetoBtnFoco.nome);
    focoBt.classList.add('active');
    botaoSelecionado = objetoBtnFoco.nome;
})

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = objetoBtnDescansoCurto.tempo; 
    alterarContexto(objetoBtnDescansoCurto.nome);
    curtoBt.classList.add('active');
    botaoSelecionado = objetoBtnDescansoCurto.nome;
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = objetoBtnDescansoLongo.tempo; 
    alterarContexto(objetoBtnDescansoLongo.nome);
    longoBt.classList.add('active');
    botaoSelecionado = objetoBtnDescansoLongo.nome;
})

function alterarContexto(contexto) {
    zerar();
    mostrarTempo();
    iniciarOuPausarBt.textContent = 'Começar';
    //usa-se forEach para percorrer cada button da nodelist 'botoes' e remove a class active do botão que está sendo clicado
    //o nome dado a variável 'contexto' é relativo, pode ser qualquer nome, representa o elemento da nodelist que será percorrido
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');
    })
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);
    // lógica: troque o contexto caso for '...', após fazer, quebre (break), se não, o padrão é quebrar
    // break não quebra o código inteiro, somente as chaves do switch
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>
            `;
            break;
        
        case 'descanso-curto':
            titulo.innerHTML = `
            Que tal dar uma respirada? <br>
            <strong class="app__title-strong">Faça uma pausa curta.</strong>
            `;
            break;

        case 'descanso-longo':
            titulo.innerHTML = `
            Hora de voltar à superfície. <br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `;
            break;

        default:
            break;
    }
}

// forma alternativa de se criar uma função usando arrow function
const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos<= 0){
        audioBeep.play();
        alert('Tempo finalizado!');

        //será criado somente para o contexto de 'foco' pois é quando o usuário estará estudando, os outros contextos são para descanso
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'; //booleano
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado'); //cria um novo evento baseado em um objeto javascript
            document.dispatchEvent(evento); //broadcast -> transmite o novo evento criado para o DOM, para pode ser usado no método addEventListener
        }

        zerar();
        iniciarOuPausarBt.textContent = 'Recomeçar';
        //forEach para recomeçar o contador baseado no contexto que está selecionado
        objetosBtn.forEach(objeto => {
            if(objeto.nome === botaoSelecionado){
                tempoDecorridoEmSegundos = objeto.tempo;
            }
        });
        mostrarTempo();
        return;
    }
    // decrementação para simular contagem regressiva
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar(){
     if(intervaloId){
        audioPause.play();
        zerar();
        return;
    }
    audioPlay.play();
    // setInterval = executa um função a cada x milisegundos
    intervaloId = setInterval(contagemRegressiva, 1000);
    iniciarOuPausarBt.textContent = 'Pausar';
    iconeIniciarOuPausarBt.src = './imagens/pause.png';
}

function zerar() {
    // interrompe o setInterval, mas não zera a variável intervaloId
    clearInterval(intervaloId);
    iniciarOuPausarBt.textContent = 'Retomar';
    iconeIniciarOuPausarBt.src = './imagens/play_arrow.png';
    intervaloId = null;
}

// função que atualiza o contador para ser exibido da forma que estamos acostumados
function mostrarTempo() {
    // aqui se multiplica por 1000 porque sempre trabalhamos com milisegundos
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    // toLocaleString = exibe dados de data baseado no padrão do idioma
    const tempoFormato = tempo.toLocaleString('pt-Br', {
        minute: '2-digit',
        second: '2-digit'
    });
    tempoNaTela.innerHTML = `${tempoFormato}`;
}

mostrarTempo();