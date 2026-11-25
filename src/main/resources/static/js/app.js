// Dados iniciais (simulando persistência H2 / MySQL)
let quadras = [
  { id: 1, nome: "Quadra 1 - Beach Tennis Master", tipoPiso: "Areia Quartzo", precoHora: 120.00 },
  { id: 2, nome: "Quadra 2 - Padel Indoor", tipoPiso: "Grama Sintética", precoHora: 140.00 },
  { id: 3, nome: "Quadra 3 - Futsal & Vôlei", tipoPiso: "Madeira Flutuante", precoHora: 110.00 }
];

let reservas = [
  { id: 101, quadraId: 1, cliente: "Francisco António", data: "2026-11-24", horaInicio: "18:00", horaFim: "19:00", emailEnviado: true },
  { id: 102, quadraId: 2, cliente: "Desconhecido", data: "2027-10-24", horaInicio: "19:00", horaFim: "20:30", emailEnviado: true }
];

function formatMoeda(valor) {
  return "R$ " + Number(valor).toFixed(2).replace('.', ',');
}

// Renderiza o select do form e a tabela de quadras
function renderQuadras() {
  const select = document.getElementById("reserva-quadra");
  const tbody = document.querySelector("#tabela-quadras tbody");
  
  select.innerHTML = '<option value="">-- Selecione uma Quadra --</option>';
  tbody.innerHTML = "";

  quadras.forEach(q => {
    select.innerHTML += `<option value="${q.id}">${q.nome} (${formatMoeda(q.precoHora)}/h)</option>`;
    tbody.innerHTML += `
      <tr>
        <td><strong>${q.nome}</strong></td>
        <td>${q.tipoPiso}</td>
        <td>${formatMoeda(q.precoHora)}</td>
        <td><button class="btn-delete" onclick="removerQuadra(${q.id})">Excluir</button></td>
      </tr>`;
  });
}

// Renderiza a tabela de reservas
function renderReservas() {
  const tbody = document.querySelector("#tabela-reservas tbody");
  tbody.innerHTML = "";

  reservas.forEach(r => {
    const quadra = quadras.find(q => q.id === r.quadraId);
    const nomeQuadra = quadra ? quadra.nome : `Quadra #${r.quadraId}`;
    tbody.innerHTML += `
      <tr>
        <td><strong>${r.cliente}</strong></td>
        <td>${nomeQuadra}</td>
        <td>${r.data}</td>
        <td>${r.horaInicio} - ${r.horaFim}</td>
        <td><span style="color: #10b981; font-weight: 600;">✓ Enviado com Sucesso</span></td>
      </tr>`;
  });
}

// CRUD: Cadastro de Quadra
document.getElementById("form-quadra").addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("quadra-nome").value.trim();
  const tipoPiso = document.getElementById("quadra-piso").value.trim();
  const precoHora = parseFloat(document.getElementById("quadra-preco").value);

  if (!nome || !tipoPiso || isNaN(precoHora)) return;

  quadras.push({
    id: Date.now(),
    nome,
    tipoPiso,
    precoHora
  });

  e.target.reset();
  renderQuadras();
});

// CRUD: Exclusão de Quadra
function removerQuadra(id) {
  quadras = quadras.filter(q => q.id !== id);
  renderQuadras();
}

// CRUD & Validador de Conflito de Horário
document.getElementById("form-reserva").addEventListener("submit", (e) => {
  e.preventDefault();
  const alertaErro = document.getElementById("alerta-conflito");
  const alertaSucesso = document.getElementById("alerta-sucesso");
  alertaErro.style.display = "none";
  alertaSucesso.style.display = "none";

  const quadraId = parseInt(document.getElementById("reserva-quadra").value);
  const cliente = document.getElementById("reserva-cliente").value.trim();
  const data = document.getElementById("reserva-data").value;
  const inicio = document.getElementById("reserva-inicio").value;
  const fim = document.getElementById("reserva-fim").value;

  if (inicio >= fim) {
    alertaErro.innerHTML = "⚠️ A <strong>hora de início</strong> deve ser estritamente anterior à <strong>hora de fim</strong>.";
    alertaErro.style.display = "block";
    return;
  }

  // REGRA DO CRUD: Validar se a quadra já está ocupada no mesmo horário
  // Sobreposição: nova_inicio < existente_fim && nova_fim > existente_inicio
  const conflito = reservas.some(r => {
    if (r.quadraId !== quadraId || r.data !== data) return false;
    return (inicio < r.horaFim && fim > r.horaInicio);
  });

  if (conflito) {
    alertaErro.innerHTML = "⚠️ <strong>Conflito detectado!</strong> Esta quadra já está reservada no período selecionado.";
    alertaErro.style.display = "block";
    return;
  }

  // Se passou sem conflito: cadastra e simula envio do Spring Mail
  reservas.push({
    id: Date.now(),
    quadraId,
    cliente,
    data,
    horaInicio: inicio,
    horaFim: fim,
    emailEnviado: true
  });

  alertaSucesso.style.display = "block";
  e.target.reset();
  renderReservas();
});

// Inicialização
renderQuadras();
renderReservas();