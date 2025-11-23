// Seleciona o container dos cards usando o seletor de classe correto (".")
const cardContainer = document.querySelector(".card-container");
// Adiciona um seletor para o campo de busca que criamos no HTML
const campoBusca = document.querySelector("#busca");
// Adiciona um seletor para o botão de busca
const botaoBusca = document.querySelector("#botao-busca");
let dados = [];

// Chama a função para carregar os dados assim que a página carregar
iniciarBusca();

// Adiciona um "escutador" de eventos que aciona a busca ao clicar no botão
botaoBusca.addEventListener("click", (event) => {
    event.preventDefault(); // Impede o comportamento padrão do botão, caso esteja em um form
    buscar();
});
campoBusca.addEventListener("keyup", buscar); // Adiciona busca dinâmica ao digitar

async function iniciarBusca() {
    try {
        let resposta = await fetch("data.json");
        dados = await resposta.json();
        // A linha abaixo foi removida para que os cards não sejam exibidos na inicialização.
        // renderizarCards(dados);
    } catch (error) {
        console.error("Erro ao buscar ou renderizar os dados:", error);
    }
}

function buscar() {
    // Pega o valor digitado, em minúsculas para facilitar a comparação
    const termoBusca = campoBusca.value.toLowerCase();

    // Filtra os dados originais
    const dadosFiltrados = dados.filter(dado => {
        // Normaliza o termo de busca e os dados para comparação sem acentos e case-insensitive
        const normalizar = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const termoNormalizado = normalizar(termoBusca);

        // Verifica se o termo de busca existe no nome ou na descrição do clube
        return normalizar(dado.nome).includes(termoNormalizado) ||
               normalizar(dado.descrição).includes(termoNormalizado);
    });

    // Renderiza os cards com os dados já filtrados
    renderizarCards(dadosFiltrados);
}

function renderizarCards(dadosParaRenderizar) {
    cardContainer.innerHTML = ""; // Limpa o container antes de adicionar os novos cards

    if (dadosParaRenderizar.length === 0) {
        cardContainer.innerHTML = `<p class="no-results">Nenhum resultado encontrado.</p>`;
        return;
    }

    for (const dado of dadosParaRenderizar) {
        // Formata a lista de jogadores para exibição
        const jogadoresFormatados = dado.principais_jogadores?.join(', ') || 'Não informado';

        // Formata a lista de títulos para exibição
        const titulosFormatados = dado.titulos_importantes?.map(titulo => {
            return `${titulo.titulo} (${titulo.ano.join(', ')})`;
        }).join('; ') || 'Não informado';

        const article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
         <h2>${dado.nome}</h2>
         <p>${dado.descrição}</p>
         <p>Ano de fundação: ${dado.ano || 'Não informado'}</p>
         <p><strong>Principais jogadores:</strong> ${jogadoresFormatados}</p>
         <div>
            <p><strong>Títulos importantes:</strong></p> 
            <p>${titulosFormatados}</p>
         </div>
         <a href="${dado.link}" target="_blank" rel="noopener noreferrer">Site do clube</a>
         `;
        cardContainer.appendChild(article);
    }
}

