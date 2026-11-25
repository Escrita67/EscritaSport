# 🎾⚽ EscritaSport - Gestão de Aluguer de Quadras

Sistema desenvolvido para gerir horários, espaços e reservas de arenas desportivas (como Beach Tennis e Futsal). A aplicação garante a integridade dos agendamentos evitando choques de horários e automatiza a comunicação com os clientes.

---

## 🚀 Funcionalidades

- **Gestão de Quadras (CRUD):** Cadastro, consulta, atualização e remoção de quadras contendo nome, tipo de piso (areia, sintético, taco, etc.) e valor por hora.
- **Gestão de Reservas:** Agendamento de horários informando data, hora de início, hora de término e dados do cliente.
- **Validação de Disponibilidade:** Ao tentar criar uma nova reserva, o sistema verifica automaticamente se a quadra já está ocupada no intervalo de tempo solicitado, impedindo reservas duplicadas.
- **Notificação por E-mail:** Envio automático de um e-mail de confirmação com os detalhes do agendamento assim que a reserva é concluída com sucesso.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** Java 17+
- **Framework:** Spring Boot (Spring Web, Spring Data JPA, Spring Validation)
- **Banco de Dados:** H2 Database (ambiente de testes/desenvolvimento) e MySQL (produção)
- **Mensageria/E-mail:** Spring Mail (JavaMailSender)
- **Documentação da API:** Swagger / OpenAPI *(opcional: remova se não utilizar)*

---

## 📋 Modelo de Dados (Entidades)

### 1. Quadra (`Court`)

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | Long | Identificador único |
| `nome` | String | Nome ou número da quadra (ex: "Quadra 01 - Areia") |
| `tipoPiso` | String | Tipo de superfície (ex: "Areia", "Grama Sintética") |
| `precoPorHora` | BigDecimal | Valor cobrado por cada hora de uso |

### 2. Reserva (`Booking`)

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | Long | Identificador único |
| `quadraId` | Long | Referência à quadra reservada |
| `nomeCliente` | String | Nome do responsável pela reserva |
| `emailCliente` | String | E-mail para envio da confirmação |
| `data` | LocalDate | Data do agendamento (`AAAA-MM-DD`) |
| `horaInicio` | LocalTime | Horário de início (`HH:mm`) |
| `horaFim` | LocalTime | Horário de término (`HH:mm`) |

---

## 🔌 Endpoints da API

### Quadras
- `POST /api/quadras` — Cadastra uma nova quadra.
- `GET /api/quadras` — Lista todas as quadras disponíveis.
- `GET /api/quadras/{id}` — Busca detalhes de uma quadra específica.
- `PUT /api/quadras/{id}` — Atualiza os dados de uma quadra.
- `DELETE /api/quadras/{id}` — Remove uma quadra.

### Reservas
- `POST /api/reservas` — Cria uma nova reserva (valida conflito de horário e envia e-mail).
- `GET /api/reservas` — Lista todas as reservas agendadas.
- `DELETE /api/reservas/{id}` — Cancela uma reserva.

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos
- JDK 17 ou superior instalado
- Maven instalado
- Uma conta de e-mail (ex: Gmail com Senha de App) para testar o envio de e-mails

### Passo a passo

1. **Clone o repositório:**
   ```bash
   https://github.com/Escrita67/EscritaSport.git
   cd escritasport
   ```

2. **Configure as variáveis de ambiente (E-mail e Banco):**
   No ficheiro `src/main/resources/application.properties`, configure os dados do servidor SMTP:
   ```properties
   spring.mail.host=://gmail.com
   spring.mail.port=587
   spring.mail.username=seu-email@gmail.com
   spring.mail.password=sua-senha-de-app
   spring.mail.properties.mail.smtp.auth=true
   spring.mail.properties.mail.smtp.starttls.enable=true
   ```

3. **Execute a aplicação:**
   ```bash
   mvn spring-boot:run
   ```

4. **Acesse a API:**
   - Aplicação: `http://localhost:8080`
   - Console H2 (se ativo): `http://localhost:8080/h2-console`

---

## 📌 Exemplo de Requisição (`POST /api/reservas`)

```json
{
  "quadraId": 1,
  "nomeCliente": "Carlos Silva",
  "emailCliente": "carlos.silva@email.com",
  "data": "2026-12-10",
  "horaInicio": "18:00",
  "horaFim": "19:30"
}
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para usar e modificar.
