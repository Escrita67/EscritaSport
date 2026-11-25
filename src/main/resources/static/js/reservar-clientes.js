const quadraSelecionada = quadrasMock.find(q => Number(q.id) === Number(quadraId));
const total = calcularValorReserva(horaInicio, horaFim, quadraSelecionada.precoHora);

console.log(formatarMoedaBRL(total)); // Exibe "R$ 180,00" para 1h30min

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#tabela-logs tbody");
  const inputFiltro = document.getElementById("filtro");
  const kpiCount = document.getElementById("kpi-count-reservas");

  // Elementos do Modal de Edição
  const modalEditar = document.getElementById("modal-editar-reserva");
  const formEditar = document.getElementById("form-editar-reserva");
  const btnFecharEditar = document.getElementById("btn-fechar-editar");
  const btnCancelarEditar = document.getElementById("btn-cancelar-editar");
  const alertaErro = document.getElementById("editar-alerta-erro");

  const editId = document.getElementById("edit-reserva-id");
  const editCliente = document.getElementById("edit-cliente");
  const editQuadra = document.getElementById("edit-quadra");
  const editData = document.getElementById("edit-data");
  const editHoraInicio = document.getElementById("edit-hora-inicio");
  const editHoraFim = document.getElementById("edit-hora-fim");

  function carregarOpcoesQuadras() {
    if (!editQuadra || typeof quadrasMock === "undefined") return;
    editQuadra.innerHTML = "";
    quadrasMock.forEach(q => {
      const opt = document.createElement("option");
      opt.value = q.id;
      opt.textContent = `${q.nome} (${q.tipoPiso})`;
      editQuadra.appendChild(opt);
    });
  }

  function obterNomeQuadra(quadraId) {
    if (typeof quadrasMock === "undefined") return `Quadra #${quadraId}`;
    const quadra = quadrasMock.find(q => Number(q.id) === Number(quadraId));
    return quadra ? quadra.nome : `Quadra #${quadraId}`;
  }

  function renderizarTabela(termoBusca = "") {
    if (!tbody || typeof reservasMock === "undefined") return;
    tbody.innerHTML = "";

    const termo = termoBusca.toLowerCase().trim();
    const filtradas = reservasMock.filter(r => {
      const nomeQuadra = obterNomeQuadra(r.quadraId).toLowerCase();
      return (
        r.cliente.toLowerCase().includes(termo) ||
        nomeQuadra.includes(termo)
      );
    });

    if (kpiCount) kpiCount.textContent = filtradas.length;

    filtradas.forEach(reserva => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>#${reserva.id}</td>
        <td><strong>${reserva.cliente}</strong></td>
        <td>${obterNomeQuadra(reserva.quadraId)}</td>
        <td>${reserva.data || "Hoje"}</td>
        <td>${reserva.horaInicio} - ${reserva.horaFim}</td>
        <td><span class="badge-mail">✔ Enviado</span></td>
        <td>
          <button type="button" class="btn-editar-row" data-id="${reserva.id}">Editar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Abre o modal já preenchido com os dados atuais daquela reserva
  function abrirModalEdicao(id) {
    const reserva = reservasMock.find(r => Number(r.id) === Number(id));
    if (!reserva) return;

    alertaErro.style.display = "none";
    editId.value = reserva.id;
    editCliente.value = reserva.cliente;
    editQuadra.value = reserva.quadraId;
    editData.value = reserva.data || new Date().toISOString().split("T");
    editHoraInicio.value = reserva.horaInicio;
    editHoraFim.value = reserva.horaFim;

    modalEditar.classList.add("active");
  }

  function fecharModalEdicao() {
    modalEditar.classList.remove("active");
  }

  // Clique no botão "Editar" da linha
  tbody.addEventListener("click", (event) => {
    const btnEditar = event.target.closest(".btn-editar-row");
    if (btnEditar) {
      abrirModalEdicao(btnEditar.dataset.id);
    }
  });

  // Atualiza a própria reserva existente
  formEditar.addEventListener("submit", (event) => {
    event.preventDefault();

    const id = Number(editId.value);
    const cliente = editCliente.value.trim();
    const quadraId = Number(editQuadra.value);
    const data = editData.value;
    const horaInicio = editHoraInicio.value;
    const horaFim = editHoraFim.value;

    if (horaFim <= horaInicio) {
      alertaErro.textContent = "A hora de fim deve ser posterior à hora de início.";
      alertaErro.style.display = "block";
      return;
    }

    // Valida conflito ignorando a própria reserva que está a ser editada (Number(r.id) !== id)
    const conflito = reservasMock.some(r =>
      Number(r.id) !== id &&
      Number(r.quadraId) === quadraId &&
      (r.data || data) === data &&
      (horaInicio < r.horaFim && horaFim > r.horaInicio)
    );

    if (conflito) {
      alertaErro.textContent = "Conflito: outra reserva já ocupa esta quadra neste horário.";
      alertaErro.style.display = "block";
      return;
    }

    // Localiza a reserva original e atualiza os dados dela no mesmo lugar
    const reservaExistente = reservasMock.find(r => Number(r.id) === id);
    if (reservaExistente) {
      reservaExistente.cliente = cliente;
      reservaExistente.quadraId = quadraId;
      reservaExistente.data = data;
      reservaExistente.horaInicio = horaInicio;
      reservaExistente.horaFim = horaFim;
    }

    fecharModalEdicao();
    renderizarTabela(inputFiltro ? inputFiltro.value : "");
  });

  btnFecharEditar.addEventListener("click", fecharModalEdicao);
  btnCancelarEditar.addEventListener("click", fecharModalEdicao);
  modalEditar.addEventListener("click", (e) => {
    if (e.target === modalEditar) fecharModalEdicao();
  });

  if (inputFiltro) {
    inputFiltro.addEventListener("input", () => renderizarTabela(inputFiltro.value));
  }

  carregarOpcoesQuadras();
  renderizarTabela();
});
