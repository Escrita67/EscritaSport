
// Dados simulando o banco de dados H2 / MySQL
let quadrasMock = [
  { id: 1, nome: "Quadra 1 - Beach Tennis Master", tipoPiso: "Areia Quartzo Especial", precoHora: 130.00 },
  { id: 2, nome: "Quadra 2 - Beach Tennis Sunset", tipoPiso: "Areia Lavada Premium", precoHora: 110.00 },
  { id: 3, nome: "Quadra 3 - Futsal Society Champions", tipoPiso: "Grama Sintética 50mm", precoHora: 160.00 },
  { id: 4, nome: "Quadra 4 - Arena Futsal Clássica", tipoPiso: "Parquet Flutuante Poliesportivo", precoHora: 140.00 }
];

let reservasMock = [
  { id: 101, quadraId: 1, cliente: "Mariana Prado Silveira", data: "2024-10-24", horaInicio: "18:00", horaFim: "19:30", emailEnviado: true },
  { id: 102, quadraId: 3, cliente: "Lucas D'Alessandro", data: "2024-10-24", horaInicio: "19:30", horaFim: "21:00", emailEnviado: true }
];

/**
 * Calcula o valor proporcional da reserva com base na hora de início, fim e preço/hora.
 * Suporta horas cheias e minutos fracionados (ex: 08:00 às 09:30 = 1.5h).
 */
function calcularValorReserva(horaInicio, horaFim, precoHora) {
  const [hIni, mIni] = horaInicio.split(":").map(Number);
  const [hFim, mFim] = horaFim.split(":").map(Number);

  const minutosInicio = (hIni * 60) + mIni;
  const minutosFim = (hFim * 60) + mFim;

  const diferencaMinutos = minutosFim - minutosInicio;

  if (diferencaMinutos <= 0) return 0;

  const horasFracionadas = diferencaMinutos / 60;
  const valorTotal = horasFracionadas * Number(precoHora);

  return Number(valorTotal.toFixed(2));
}

// Função auxiliar para formatar em Real (Ex: R$ 180,00)
function formatarMoedaBRL(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}
