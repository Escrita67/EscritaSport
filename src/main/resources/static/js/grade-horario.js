// Aguarda que todo o DOM esteja carregado antes de construir a grade
document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. DEFINIÇÃO DOS HORÁRIOS DE FUNCIONAMENTO E ELEMENTOS DO DOM
  // =========================================================================
  const horas = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

  const headerEl = document.getElementById("grade-header");
  const linhasEl = document.getElementById("grade-linhas");

  // =========================================================================
  // 2. CONSTRUÇÃO DO CABEÇALHO DE HORAS
  // =========================================================================
  horas.forEach(hora => {
    const col = document.createElement("div");
    col.textContent = hora;
    headerEl.appendChild(col);
  });

  // =========================================================================
  // 3. CONSTRUÇÃO DAS LINHAS POR QUADRA E VERIFICAÇÃO DE RESERVAS
  // =========================================================================
  // NOTA: quadrasMock e reservasMock vêm do ficheiro js/shared.js
  quadrasMock.forEach(quadra => {
    const row = document.createElement("div");
    row.className = "quadra-row";

    // Coluna inicial com o nome da quadra, tipo de piso e valor por hora
    let html = `
      <div class="quadra-info">
        <div class="quadra-title">${quadra.nome}</div>
        <div class="quadra-piso">${quadra.tipoPiso} • R$ ${quadra.precoHora}/h</div>
      </div>
    `;

    // Percorre cada horário do dia para verificar se a quadra está ocupada ou livre
    horas.forEach(hora => {
      const horaPrefixo = hora.substring(0, 2); // Ex: "08" de "08:00"
      const reserva = reservasMock.find(
        r => r.quadraId === quadra.id && r.horaInicio.startsWith(horaPrefixo)
      );

      if (reserva) {
        // Horário ocupado: exibe o nome do cliente e o intervalo reservado
        html += `
          <div class="slot-cell">
            <div class="booking-block">
              ${reserva.cliente}<br>
              <small>${reserva.horaInicio}-${reserva.horaFim}</small>
            </div>
          </div>
        `;
      } else {
        // Horário livre: guarda os dados nos atributos data-* para o clique
        html += `
          <div class="slot-cell">
            <div class="free-slot" data-quadra="${quadra.nome}" data-hora="${hora}">
              Livre
            </div>
          </div>
        `;
      }
    });

    row.innerHTML = html;
    linhasEl.appendChild(row);
  });

  // =========================================================================
  // 4. EVENTO DE CLIQUE NOS HORÁRIOS LIVRES (DELEGAÇÃO DE EVENTOS)
  // =========================================================================
  linhasEl.addEventListener("click", (event) => {
    // Verifica se o elemento clicado (ou seu pai) é um bloco livre (.free-slot)
    const slotLivre = event.target.closest(".free-slot");
    
    if (slotLivre) {
      const nomeQuadra = slotLivre.dataset.quadra;
      const horario = slotLivre.dataset.hora;
      alert(`Reservar ${nomeQuadra} às ${horario}`);
    }
  });

  // =========================================================================
  // 5. GESTÃO DE SESSÃO DO UTILIZADOR E BOTÃO SAIR
  // =========================================================================
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioSessao"));

  if (usuarioLogado) {
    const elNome = document.getElementById("sessao-nome");
    const elCargo = document.getElementById("sessao-cargo");
    const elFoto = document.getElementById("sessao-foto");

    if (elNome) elNome.textContent = usuarioLogado.nome || "Gestor";
    if (elCargo) elCargo.textContent = usuarioLogado.cargo || "Dono da Arena";
    if (elFoto && usuarioLogado.foto) elFoto.src = usuarioLogado.foto;
  }

  const btnSair = document.getElementById("btn-sair");
  if (btnSair) {
    btnSair.addEventListener("click", () => {
      if (confirm("Deseja realmente sair do sistema?")) {
        localStorage.removeItem("usuarioSessao");
        window.location.href = "login.html";
      }
    });
  }

});
