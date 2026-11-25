document.addEventListener("DOMContentLoaded", () => {
  // Elementos das abas e formulários
  const tabLogin = document.getElementById("tab-login");
  const tabCadastro = document.getElementById("tab-cadastro");
  const formLogin = document.getElementById("form-login");
  const formCadastro = document.getElementById("form-cadastro");

  // Elementos de alerta
  const alertaErro = document.getElementById("alerta-erro");
  const alertaSucesso = document.getElementById("alerta-sucesso");

  function mostrarErro(mensagem) {
    if (!alertaErro) return;
    alertaErro.textContent = mensagem;
    alertaErro.style.display = "block";
    if (alertaSucesso) alertaSucesso.style.display = "none";
  }

  function mostrarSucesso(mensagem) {
    if (!alertaSucesso) return;
    alertaSucesso.textContent = mensagem;
    alertaSucesso.style.display = "block";
    if (alertaErro) alertaErro.style.display = "none";
  }

  // Alternar entre as abas Entrar / Criar Conta
  if (tabLogin && tabCadastro) {
    tabLogin.addEventListener("click", () => {
      tabLogin.classList.add("active");
      tabCadastro.classList.remove("active");
      formLogin.style.display = "block";
      formCadastro.style.display = "none";
      if (alertaErro) alertaErro.style.display = "none";
      if (alertaSucesso) alertaSucesso.style.display = "none";
    });

    tabCadastro.addEventListener("click", () => {
      tabCadastro.classList.add("active");
      tabLogin.classList.remove("active");
      formCadastro.style.display = "block";
      formLogin.style.display = "none";
      if (alertaErro) alertaErro.style.display = "none";
      if (alertaSucesso) alertaSucesso.style.display = "none";
    });
  }

  // =========================================================================
  // 1. ENTRAR NO SISTEMA -> SALVA SESSÃO E REDIRECIONA PARA grade-horario.html
  // =========================================================================
  if (formLogin) {
    formLogin.addEventListener("submit", (event) => {
      event.preventDefault(); // Impede o recarregamento padrão da página

      const usuarioInput = document.getElementById("login-usuario").value.trim();
      const senhaInput = document.getElementById("login-senha").value.trim();

      if (!usuarioInput || !senhaInput) {
        mostrarErro("Preencha o usuário e a senha para entrar.");
        return;
      }

      // Verifica se existe uma conta criada no cadastro ou extrai o nome do e-mail
      const contaSalva = JSON.parse(localStorage.getItem("contaCadastrada"));
      let nomeExibicao = usuarioInput.includes("@")
        ? usuarioInput.split("@")[0]
        : usuarioInput;

      // Capitaliza a primeira letra (ex: "admin" -> "Admin")
      nomeExibicao = nomeExibicao.charAt(0).toUpperCase() + nomeExibicao.slice(1);

      if (contaSalva && contaSalva.email === usuarioInput) {
        nomeExibicao = contaSalva.nome;
      }

      // Salva os dados da sessão para aparecer no rodapé do menu (foto + nome)
      const dadosSessao = {
        nome: nomeExibicao,
        cargo: "Dono da Arena",
        foto: `https://ui-avatars.com{encodeURIComponent(nomeExibicao)}&background=22c55e&color=fff&bold=true`
      };

      localStorage.setItem("usuarioSessao", JSON.stringify(dadosSessao));

      // Redireciona imediatamente para a grade de horários
      window.location.href = "grade-horario.html";
    });
  }

  // =========================================================================
  // 2. CRIAR CONTA -> GUARDA OS DADOS E VOLTA PARA A ABA DE LOGIN
  // =========================================================================
  if (formCadastro) {
    formCadastro.addEventListener("submit", (event) => {
      event.preventDefault();

      const nome = document.getElementById("cad-nome").value.trim();
      const email = document.getElementById("cad-email").value.trim();
      const senha = document.getElementById("cad-senha").value;
      const confirmar = document.getElementById("cad-confirmar").value;

      if (senha !== confirmar) {
        mostrarErro("As senhas não coincidem.");
        return;
      }

      localStorage.setItem("contaCadastrada", JSON.stringify({ nome, email, senha }));

      mostrarSucesso("Conta criada com sucesso! Faça login para entrar.");
      formCadastro.reset();
      if (tabLogin) tabLogin.click();
      document.getElementById("login-usuario").value = email;
    });
  }
});
