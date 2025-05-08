const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');

// api getItem recupera a string que foi setada pelo setItem
// mas para ela ser recuperada de forma correta, é preciso usar o JSON.parse para transformar aquela string em um objeto JS complexo
// caso a localStorage estiver vazia (null), ou seja, caso seja a primeira execução do usuário, o comando OU (||) é ativado e cria um array vazio
const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

function criarElementoTarefa(tarefa){
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');
    
    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

    const paragrafo = document.createElement('p');
    //recupera o valor da propriedade descricao do objeto tarefa criado do evento de submit 
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');
    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', './imagens/edit.png');
    // append = acrescentar um elemento HTML dentro de outro elemento HTML, parecido com appendChild
    // a diferença dos 2 é que o append pode inserir a tag HTML + textContent (string) ou adicionar mais de uma tag de uma vez
    botao.append(imagemBotao);

    li.append(svg, paragrafo, botao);

    // deve haver um retorno do elemento pai desta criação, que no caso é o elemento li
    return li;
}

btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden'); // toggle (troca) = se não tiver coloca, se tiver tira
})

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    //criação de um objeto chamado 'tarefa' com uma propriedade chamada 'descricao' que recebe o .value da textarea
    const tarefa = {
        descricao: textarea.value
    }
    tarefas.push(tarefa);

    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);

    //localStorage é um objeto JS que permite "armazenar localmente" determinados valores para não serem perdidos quando a página for recarregada
    //para setar uma nova localStorage utiliza-se a API setItem, primeiro parâmetro é o nome da chave e o segundo é o valor da chave
    //porém o valor da chave não pode ser um array direto, deve ser um array que foi transformado em string
    //pois o localStorage só consegue armazenar dados no formato string
    //para isso, utiliza-se a API stringify do objeto JSON e dentro dos parênteses coloca-se o array desejado
    //o resultado disso é uma string que representa um array de objetos
    //utilizase o JSON neste caso, pois se posteriormente quiser transformar em objeto novamente é só usar o comando 'JSON.parse()'
    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    textarea.value = '';
    formAdicionarTarefa.classList.add('hidden');
});

//percorre cada elemento do array tarefas e aplica a função de criarElementoTarefa
//e também acrescenta o elemento criado pela função na ul já existente no .html
//se não fizer essa forEach, a lista de tarefas não é exibida
tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
});