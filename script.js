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

const musica = new Audio('./sons/luna-rise-part-one.mp3');
const audioPlay = new Audio('./sons/play.wav');
const audioPause = new Audio('./sons/pause.mp3');
const audioBeep = new Audio('./sons/beep.mp3');

let tempoDecorridoEmSegundos = 1500; //25 min / 60 seg
let intervaloId = null; // irá armazenar os valores da função setInterval

musica.loop = true;
musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

focoBt.addEventListener('click', async () => {
    tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco');
    focoBt.classList.add('active');
})

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300; //5 min * 60 seg
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900; //15 min * 60 seg
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
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
        zerar();
        // comando para forçar o recarregamento da página
        location.reload();
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