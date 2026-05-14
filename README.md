# 📌 Sistema de Chamados

Sistema web desenvolvido para gerenciamento de chamados técnicos, permitindo o controle de solicitações, acompanhamento de status e organização do fluxo de atendimento.

## 🚀 Sobre o Projeto

O **Sistema de Chamados** foi criado com o objetivo de facilitar o gerenciamento de atendimentos técnicos e solicitações internas, oferecendo uma interface intuitiva para abertura, acompanhamento e administração de chamados.

A aplicação permite:

* 📄 Abertura de chamados
* 👤 Gerenciamento de usuários
* 🛠️ Controle de status e prioridades
* 📊 Visualização de relatórios
* 🔎 Filtros e pesquisa de chamados
* ✅ Acompanhamento do fluxo de atendimento

---

## 🖼️ Demonstração

Adicione aqui prints ou gifs do sistema.

```md
![Dashboard](./screenshots/dashboard.png)
```

---

## 🧰 Tecnologias Utilizadas

### Frontend

* React
* JavaScript
* CSS
* Axios
* Lucide React

### Backend

* Python
* Flask
* PostgreSQL

### Ferramentas

* Git
* GitHub
* Railway / Render

---

## 📂 Estrutura do Projeto

```bash
Sistema-de-Chamados/
│
├── backend/
│   ├── database/
│   ├── routes/
│   ├── models/
│   └── app.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Como Executar o Projeto

### 🔧 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

* Node.js
* Python 3
* PostgreSQL
* Git

---

### 📥 Clone o repositório

```bash
git clone https://github.com/rntmarinho/Sistema-de-Chamados.git
```

Entre na pasta do projeto:

```bash
cd Sistema-de-Chamados
```

---

## ▶️ Executando o Backend

```bash
cd backend
```

Crie um ambiente virtual:

```bash
python -m venv venv
```

Ative o ambiente virtual:

### Windows

```bash
venv\Scripts\activate
```

### Linux/macOS

```bash
source venv/bin/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Execute o servidor:

```bash
python app.py
```

---

## 💻 Executando o Frontend

Abra outro terminal:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

---

## 🌐 Variáveis de Ambiente

Crie um arquivo `.env` no backend:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/database
SECRET_KEY=sua_chave_secreta
```

---

## 📊 Funcionalidades

* Cadastro e autenticação de usuários
* Abertura e edição de chamados
* Controle de prioridade
* Atualização de status
* Dashboard administrativo
* Relatórios de atendimento
* Histórico de chamados
* Interface responsiva

---

## 📈 Melhorias Futuras

* 🔔 Sistema de notificações
* 📧 Envio de e-mails automáticos
* 📱 Responsividade mobile aprimorada
* 📊 Relatórios avançados
* 🔐 Controle de permissões por perfil
* 🌙 Tema dark mode

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas.

1. Faça um fork do projeto
2. Crie uma branch para sua feature

```bash
git checkout -b minha-feature
```

3. Commit suas alterações

```bash
git commit -m "feat: minha nova feature"
```

4. Faça o push da branch

```bash
git push origin minha-feature
```

5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

Desenvolvido por **Renata Marinho**.

* GitHub: [rntmarinho](https://github.com/rntmarinho?utm_source=chatgpt.com)
* Projeto: [Sistema de Chamados](https://github.com/rntmarinho/Sistema-de-Chamados?utm_source=chatgpt.com)
