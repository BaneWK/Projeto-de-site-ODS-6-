// DADOS HISTÓRICOS DE CONSUMO DE ÁGUA (LITROS DIÁRIOS PER CAPITA) - 2017 A 2026
const dadosConsumoSP = {
    centro: [145, 142, 140, 138, 135, 131, 133, 129, 126, 122],
    norte:  [138, 135, 132, 133, 129, 125, 127, 123, 120, 118],
    sul:    [152, 150, 147, 143, 141, 138, 139, 135, 132, 129],
    leste:  [130, 128, 125, 122, 120, 117, 119, 115, 112, 110],
    oeste:  [160, 157, 155, 150, 148, 142, 145, 140, 137, 134],
    metropolitana: [141, 138, 136, 134, 131, 127, 129, 125, 122, 119]
};

const anosLabels = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];

// CONTROLE GLOBAL DE USUÁRIO
function initUserProfile() {
    const user = localStorage.getItem('h2o_user');
    const containers = document.querySelectorAll('.user-profile-container');
    
    containers.forEach(container => {
        if (user) {
            container.innerHTML = `
                <div class="user-profile" onclick="toggleProfileMenu(this)">
                    <span id="user-display">${user}</span>
                    <span>▼</span>
                </div>
                <div class="profile-menu hidden" id="profile-menu-${container.id}">
                    <div>Usuário: ${user}</div>
                    <button onclick="logout()" class="btn-logout">Deslogar</button>
                </div>
            `;
        } else {
            window.location.href = 'index.html';
        }
    });
}

// FUNÇÃO GLOBAL VOLTA AO INÍCIO
function goHome() {
    const user = localStorage.getItem('h2o_user');
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        if (user) switchSection('dashboard');
    } else {
        window.location.href = 'index.html';
    }
}

// MENU DE PERFIL DROPDOWN
function toggleProfileMenu(profileElement) {
    const menu = profileElement.nextElementSibling;
    menu.classList.toggle('hidden');
}

// CONTROLE DE AUTENTICAÇÃO (MOCK)
const authForm = document.getElementById('auth-form');
if (authForm) {
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('user-email').value;
        localStorage.setItem('h2o_user', email);
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('main-system').classList.remove('hidden');
        initUserProfile();
        updateChart();
    });
}

function logout() {
    localStorage.removeItem('h2o_user');
    location.reload();
}

// ALTERNA SEÇÕES DO DASHBOARD
function switchSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.add('hidden'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
   
    document.getElementById(`sec-${sectionId}`).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

// INJEÇÃO E ATUALIZAÇÃO DO GRÁFICO HISTÓRICO
function updateChart() {
    const chartBars = document.getElementById('chart-bars');
    if (!chartBars) return;
   
    const regiaoSelecionada = document.getElementById('region-select').value;
    const dados = dadosConsumoSP[regiaoSelecionada];
   
    chartBars.innerHTML = '';
   
    dados.forEach((valor, index) => {
        const barColumn = document.createElement('div');
        barColumn.className = 'chart-column';
       
        const alturaPercentual = (valor / 160) * 100;
       
        barColumn.innerHTML = `
            <div class="bar-value">${valor}L</div>
            <div class="bar-fill" style="height: ${alturaPercentual}%"></div>
            <div class="bar-label">${anosLabels[index]}</div>
        `;
        chartBars.appendChild(barColumn);
    });
}

// CALCULADORA HÍDRICA MELHORADA (COM ALERTA ONU)
function calcularConsumo() {
    const banho = parseFloat(document.getElementById('calc-banho').value) * 9;
    const torneira = parseFloat(document.getElementById('calc-torneira').value) * 6;
    const descarga = parseFloat(document.getElementById('calc-descarga').value) * 6;
    const roupa = (parseFloat(document.getElementById('calc-roupa').value) * 120) / 7;
   
    const totalDiario = Math.round(banho + torneira + descarga + roupa);
    const LIMITE_ONU = 110;
   
    document.getElementById('litros-num').innerText = totalDiario;
    const statusBox = document.getElementById('calc-status');
   
    if (totalDiario <= LIMITE_ONU) {
        statusBox.innerText = `Excelente! Seu consumo (${totalDiario}L) está dentro do recomendado pela ONU (${LIMITE_ONU}L/dia).`;
        statusBox.className = "status-badge excelente";
    } else if (totalDiario <= 170) {
        statusBox.innerText = `Atenção: Consumo moderado (${totalDiario}L). Recomendado ONU: ${LIMITE_ONU}L/dia. Pequenos ajustes podem evitar desperdício.`;
        statusBox.className = "status-badge moderado";
    } else {
        statusBox.innerText = `🚨 ALERTA: Consumo elevado (${totalDiario}L)! ONU recomenda apenas ${LIMITE_ONU}L/dia. Verifique vazamentos e reduza tempo de banho.`;
        statusBox.className = "status-badge crítico";
    }
   
    document.getElementById('calc-result').classList.remove('hidden');
}

// QUIZ REFACTORADO (PROGRESSO CORRIGIDO + RESULTADOS DETALHADOS)
const perguntasQuiz = [
    { q: "Qual o consumo diário de água recomendado por pessoa pela ONU?", o: ["50 litros", "110 litros", "250 litros", "500 litros"], a: 1 },
    { q: "Qual setor consome a maior quantidade de água potável globalmente?", o: ["Uso doméstico", "Indústrias", "Agropecuária", "Setor comercial"], a: 2 },
    { q: "O que representa o Objetivo de Desenvolvimento Sustentável 6 (ODS 6)?", o: ["Energia Limpa", "Fome Zero", "Água Potável e Saneamento", "Ação Climática"], a: 2 },
    { q: "Qual dessas práticas ajuda diretamente na redução do gasto de água?", o: ["Lavar calçada com mangueira", "Fechar a torneira ao escovar dentes", "Deixar chuveiro ligando antes do banho", "Lavar panos um por um"], a: 1 },
    { q: "O que é água de reuso?", o: ["Água mineral engarrafada", "Esgoto não tratado descartado", "Água residual tratada para fins não potáveis", "Água salinizada do mar"], a: 2 },
    { q: "Qual a porcentagem aproximada de água doce disponível acessível no planeta?", o: ["Menos de 1%", "Cerca de 10%", "Cerca de 25%", "Mais de 50%"], a: 0 },
    { q: "A captação de água da chuva é recomendada diretamente para:", o: ["Beber e cozinhar", "Descargas e regar plantas", "Higiene bucal", "Preparar alimentos"], a: 1 },
    { q: "Um banho de 15 minutos com registro aberto consome em média quanto?", o: ["30 litros", "60 litros", "135 litros", "300 litros"], a: 2 },
    { q: "O que indica a presença excessiva de coliformes na água?", o: ["Excesso de minerais benéficos", "Contaminação por esgoto doméstico", "Ótima qualidade hídrica", "Ausência de oxigênio"], a: 1 },
    { q: "Qual o impacto do desmatamento de matas ciliares nos rios?", o: ["Melhoria no fluxo da água", "Assoreamento e piora na qualidade", "Aumento de peixes nativos", "Estabilização das margens"], a: 1 },
    { q: "Qual torneira gotejando pode gastar em média por dia?", o: ["Cerca de 5 litros", "Até 46 litros", "Exatos 100 litros", "Mais de 500 litros"], a: 1 },
    { q: "Qual o principal agente poluidor urbano dos rios paulistas?", o: ["Esgoto doméstico não tratado", "Resíduos industriais radioativos", "Folhas das árvores", "Óleo extraído do asfalto"], a: 0 },
    { q: "A pegada hídrica mede o quê?", o: ["O volume de água que evaporou no mar", "O consumo direto e indireto de água de um produto/indivíduo", "O tamanho das tubulações urbanas", "A profundidade dos lençóis freáticos"], a: 1 },
    { q: "Qual a função do saneamento básico sustentável?", o: ["Apenas asfalto nas vias", "Garantir água limpa, esgoto e tratamento de resíduos", "Distribuir sacolas plásticas", "Monitorar o ar das metrópoles"], a: 1 },
    { q: "Como o monitoramento inteligente ajuda as comunidades?", o: ["Escondendo dados críticos", "Identificando padrões de desperdício e facilitando ações corretivas", "Aumentando tarifas arbitrariamente", "Impedindo o acesso à rede de esgoto"], a: 1 }
];

let indicePerguntaAtual = 0;
let pontuacaoFinal = 0;
let respostasUsuario = []; // RASTREAMENTO DAS ESCOLHAS

function startQuiz() {
    document.getElementById('quiz-intro').classList.add('hidden');
    document.getElementById('quiz-game').classList.remove('hidden');
    indicePerguntaAtual = 0;
    pontuacaoFinal = 0;
    respostasUsuario = [];
    showQuestion();
}

function showQuestion() {
    const perguntaObj = perguntasQuiz[indicePerguntaAtual];
    document.getElementById('current-q-num').innerText = indicePerguntaAtual + 1;
    document.getElementById('question-text').innerText = perguntaObj.q;
   
    // PROGRESSO CORRIGIDO: BASEADO EM PERGUNTAS RESPONDIDAS
    const fillPercent = ((indicePerguntaAtual) / 15) * 100;
    document.getElementById('progress-fill').style.width = `${fillPercent}%`;
   
    const optionsGrid = document.getElementById('options-container');
    optionsGrid.innerHTML = '';
   
    perguntaObj.o.forEach((opcao, idx) => {
        const btnOpcao = document.createElement('button');
        btnOpcao.className = 'btn-option';
        btnOpcao.innerText = opcao;
        btnOpcao.onclick = () => checkAnswer(idx);
        optionsGrid.appendChild(btnOpcao);
    });
}

function checkAnswer(indiceSelecionado) {
    respostasUsuario.push(indiceSelecionado);
    
    if (indiceSelecionado === perguntasQuiz[indicePerguntaAtual].a) {
        pontuacaoFinal++;
    }
   
    indicePerguntaAtual++;
    if (indicePerguntaAtual < perguntasQuiz.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    document.getElementById('quiz-game').classList.add('hidden');
    const resultsBox = document.getElementById('quiz-results');
    resultsBox.classList.remove('hidden');
   
    document.getElementById('quiz-score').innerText = pontuacaoFinal;
    const txtFeedback = document.getElementById('quiz-feedback-text');
   
    if (pontuacaoFinal >= 12) {
        txtFeedback.innerHTML = "<span style='color: #27ae60;'>Parabéns! Excelente conhecimento sobre a ODS 6 e conservação hídrica.</span>";
    } else if (pontuacaoFinal >= 7) {
        txtFeedback.innerHTML = "<span style='color: #f39c12;'>Bom desempenho! Revise os conteúdos e guias educativos para mitigar ainda mais o consumo.</span>";
    } else {
        txtFeedback.innerHTML = "<span style='color: #c0392b;'>Recomenda-se a leitura dos nossos manuais sobre reuso de água para aprimorar suas práticas cotidianas.</span>";
    }

    // LISTA DETALHADA DE RESULTADOS
    renderizarResultadosDetalhados();
}

function renderizarResultadosDetalhados() {
    const container = document.getElementById('quiz-detailed-results');
    let html = '<h3>📋 Detalhamento das Respostas:</h3><div style="max-height: 400px; overflow-y: auto;">';
    
    perguntasQuiz.forEach((pergunta, idx) => {
        const usuarioEscolheu = respostasUsuario[idx];
        const acertou = usuarioEscolheu === pergunta.a;
        const statusClass = acertou ? 'excelente' : 'crítico';
        const statusText = acertou ? '✅ Acertou!' : '❌ Errou';
        const respostaCorreta = pergunta.o[pergunta.a];
        
        html += `
            <div style="margin-bottom: 15px; padding: 12px; border-left: 4px solid var(--${statusClass === 'excelente' ? 'light-blue' : 'primary-blue'}); background: ${acertou ? '#d4edda' : '#f8d7da'};">
                <strong>P${idx + 1}:</strong> ${pergunta.q}<br>
                <small><strong>Sua resposta:</strong> "${pergunta.o[usuarioEscolheu]}"</small><br>
                <small><strong>${statusText}</strong> ${!acertou ? `(Correta: "${respostaCorreta}")` : ''}</small>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// AUTO-EXECUÇÃO
window.onload = function() {
    initUserProfile();
    
    if(localStorage.getItem('h2o_user') && document.getElementById('auth-screen')) {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('main-system').classList.remove('hidden');
        updateChart();
    }
};