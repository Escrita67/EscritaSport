// Aguarda que todo o DOM esteja carregado antes de executar a lógica
document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. SELEÇÃO DOS ELEMENTOS DO DOM
  // =========================================================================
  const container = document.getElementById("lista-quadras-cards");
  const kpiTotalQuadras = document.getElementById("kpi-total-quadras");
  const btnNovaQuadra = document.getElementById("btn-nova-quadra");

  // =========================================================================
  // 2. FUNÇÃO PARA DESENHAR OS CARTÕES DAS QUADRAS NA TELA
  // =========================================================================
  function renderGridQuadras() {
    container.innerHTML = "";

    // NOTA: quadrasMock é carregado a partir do ficheiro js/shared.js
    quadrasMock.forEach(quadra => {
      const card = document.createElement("div");
      card.className = "quadra-card";

      card.innerHTML = `
        <div class="quadra-banner">
          <span class="tag">Ativa</span>
          <span class="quadra-preco">R$ ${quadra.precoHora.toFixed(2)}/h</span>
        </div>
        <div class="quadra-details">
          <h3 class="quadra-nome">${quadra.nome}</h3>
          <div class="item-row">
            <span>Tipo de Piso</span>
            <span>${quadra.tipoPiso}</span>
          </div>
          <div class="item-row">
            <span>Iluminação LED</span>
            <span>Modo Noturno Habilitado</span>
          </div>
          <div class="quadra-actions">
            <a href="grade-horarios.html" class="btn btn-secondary btn-ver-grade">Ver Grade</a>
            <button type="button" class="btn btn-excluir" data-id="${quadra.id}">Excluir</button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Atualiza o indicador (KPI) com a quantidade atual de quadras
    kpiTotalQuadras.textContent = quadrasMock.length;
  }

  // =========================================================================
  // 3. FUNÇÃO PARA REMOVER UMA QUADRA PELO ID
  // =========================================================================
  function removerQuadraItem(id) {
    if (confirm("Remover esta quadra?")) {
      const indice = quadrasMock.findIndex(q => q.id === id);
      if (indice !== -1) {
        quadrasMock.splice(indice, 1);
        renderGridQuadras();
      }
    }
  }

  // =========================================================================
  // 4. EVENTOS DE CLIQUE (CADASTRAR E EXCLUIR)
  // =========================================================================

  // Evento do botão "+ Cadastrar Nova Quadra" no topo
  btnNovaQuadra.addEventListener("click", () => {
    const nome = prompt("Nome da Quadra:");
    if (!nome) return;

    const tipoPiso = prompt("Tipo de Piso:");
    const precoHora = parseFloat(prompt("Preço por hora (R$):", "120.00"));

    if (nome && tipoPiso && !isNaN(precoHora)) {
      quadrasMock.push({
        id: Date.now(),
        nome: nome.trim(),
        tipoPiso: tipoPiso.trim(),
        precoHora: precoHora
      });
      renderGridQuadras();
    }
  });

  // Delegação de evento para capturar cliques nos botões "Excluir" dos cartões
  container.addEventListener("click", (event) => {
    const botaoExcluir = event.target.closest(".btn-excluir");
    if (botaoExcluir) {
      const idQuadra = Number(botaoExcluir.dataset.id);
      removerQuadraItem(idQuadra);
    }
  });

  // Renderização inicial ao abrir a página
  renderGridQuadras();

});
