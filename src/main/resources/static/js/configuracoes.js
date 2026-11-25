// Aguarda que todo o documento HTML seja carregado antes de associar os eventos
document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. REFERÊNCIAS AOS ELEMENTOS DA INTERFACE
  // =========================================================================
  const btnSalvar = document.getElementById('btn-salvar');
  const btnTestarEmail = document.getElementById('btn-testar-email');
  const inputTesteEmail = document.getElementById('teste-email');

  // =========================================================================
  // 2. EVENTO PARA GRAVAR AS CONFIGURAÇÕES
  // =========================================================================
  btnSalvar.addEventListener('click', () => {
    // NOTA: Futuramente, recolha os valores dos inputs aqui e envie via fetch()
    // para um endpoint @PostMapping ou @PutMapping no seu projeto Spring Boot.
    alert('Configurações gravadas com sucesso!');
  });

  // =========================================================================
  // 3. EVENTO PARA TESTAR O ENVIO DE E-MAIL (SPRING MAIL)
  // =========================================================================
  btnTestarEmail.addEventListener('click', () => {
    // Remove espaços em branco antes e depois do texto digitado
    const email = inputTesteEmail.value.trim();

    // Validação simples para garantir que o campo não está vazio
    if (!email) {
      alert('Insira um endereço de e-mail.');
      inputTesteEmail.focus(); // Coloca o cursor novamente no campo
      return;
    }

    // Exibe confirmação de disparo (substituir por chamada real à API Java)
    alert(`Voucher disparado com sucesso para ${email} via Spring Mail!`);
  });

});
