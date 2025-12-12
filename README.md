# TEM – Plataforma de Formulários Dinâmicos (Laravel + JS)

Este projeto é uma plataforma dinâmica para preenchimento, salvamento e revisão de formulários complexos, composta por:

- Backend em **Laravel 10**
- Frontend em **HTML, CSS, Bootstrap 5 e JavaScript modular**
- Sistema de autosave usando **LocalStorage + Banco de Dados**
- Painel especial para **avaliadores (reviewers)**
- Geração de **PDF** customizado
- Proteção via **Google reCAPTCHA Invisible v3**

---

## 🚀 Requisitos

- PHP 8+
- Composer
- MySQL/MariaDB
- Node.js 16+
- Extensões PHP comuns (pdo_mysql, mbstring, etc.)

---

## 🔧 Como rodar o projeto localmente

### 1. Descompactar o ZIP em uma área do seu computador

Provávelmente você recebeu esse projeto em ZIP, sendo assim, descompacte a pasta tem-app em algum lugar do seu computador antes de prosseguir.

### 2. Instalar dependências

```
composer install
npm install
```

### 3. Atualizar o arquivo .env

Para ficar mais fácil, o arquivo .ENV foi enviado dentro do ZIP. Mas você pode criá-lo a partir do example.env

```
cp .env.example .env
php artisan key:generate
```

Não se esqueça de configurar os campos como:

```
DB_DATABASE=tem
DB_USERNAME=root
DB_PASSWORD=
```

E configure também o reCAPTCHA v3:

```
RECAPTCHA_SECRET=<sua-secret-key>
RECAPTCHA_SITEKEY=<sua-site-key>
```

As chaves podem ser obtidas em:

👉 https://www.google.com/recaptcha/admin/create

Selecione "reCAPTCHA v3 – Invisible"

### 4. Rodar as migrations

```
php artisan migrate
```

O código acima criará todas as tabelas necessárias para o sistema do TEM.

### 5. Iniciar o Servidor

```
php artisan serve
npm run dev
```

# 🚀 Visão Geral do Projeto

Este documento descreve a arquitetura e as principais funcionalidades do sistema, focado na gestão de empreendimentos por meio de formulários complexos e dinâmicos, com recursos avançados como salvamento automático, geração de PDF e perfis de acesso distintos.

---

## 🗂 Estrutura Principal do Projeto

A organização do código é modular, visando facilitar a manutenção e a extensão do sistema.

### 📁 `routes/web.php`

Define as rotas de acesso ao sistema:

* Rotas de login e dashboard.
* Rota de resumo: `dashboard/{url_hash}/resume`.
* Rota protegida para o perfil de `reviewer`.

### 📁 `app/Http/Controllers/DashboardController.php`

Responsável pela lógica de apresentação e controle de acesso:

* Renderização do dashboard normal do usuário.
* Dashboard exclusivo do `reviewer`.
* Renderização do resumo de qualquer empreendimento.
* Lógica que permite ao `reviewer` visualizar todos os resumos.

### 📁 `resources/views/`

Estrutura das _views_ (telas):

```
views/ ├── dashboard/ │ ├── dashboard.blade.php (painel normal do usuário) │ ├── reviewer.blade.php (painel do avaliador) │ ├── resume.blade.php (resumo do empreendimento) │ ├── auth/ (telas de login e autenticação) └── layouts/ (estrutura HTML base - master layout)
```

---

## 💻 Lógica Interativa (Frontend)

O diretório `public/js/` contém toda a lógica interativa e dinâmica dos cards.

### 📁 `public/js/` - Arquitetura Frontend

| Arquivo | Função |
| :--- | :--- |
| `app-carrosel.js` | Controla a navegação (carrossel) dos cards. |
| `app-navigation-buttons.js` | Lógica dos botões `próximo`/`anterior`/`salvar`/`finalizar`. |
| `app-save-later.js` | **Core:** Lógica de `autosave`, persistência no banco de dados e `localStorage`. |
| `app-card-status.js` | Controle visual do status de conclusão dos cards. |
| `forms-schema.js` | Schema geral (estrutura de dados) para todos os cards. |
| `form-renderer.js` | Renderiza dinamicamente cada formulário com base no schema. |

### Cards Específicos

Cada card possui seu próprio script de lógica dinâmica:

* `card1-...js` (e outros cards não listados)
* `card5-rede-relacoes.js`
* `card9-canais.js`
* `card10-relacao-com-clientes.js`
* `card11-fontes-de-receita.js`
* `card12-recursos-chave.js`
* `card19-trajetoria.js`
* `card20-parcerias.js`

Dentro de `public/js/form` você encontra outra parte da lógica responsável por armazenar a maior parte dos campos estáticos.

---

## ✔ Como Funciona a Lógica dos Formulários

Cada **Card** de formulário é composto por três partes principais:

1.  **Arquivo de Form (`cardX-nome-form.js`):**
    * Exemplo: `card9-canais-form.js`.
    * Responsável por **gerar o HTML** daquele card específico.

2.  **Arquivo de Lógica (`cardX-nome.js`):**
    * Exemplo: `card9-canais.js`.
    * Controla a **interação dinâmica** do card, como:
        * `selects` dinâmicos infinitos.
        * Campos "outro" que continuam abrindo.
        * `checkbox` especiais.
        * Edição de itens e ordenação (anos, datas, etc.).

3.  **Autosave (`app-save-later.js`):**
    * Função global chamada a cada interação importante:
        * Troca de card.
        * Clique em `próximo` ou `salvar`.
        * Mudança em qualquer campo do formulário.
    * **Funcionalidade Crítica:** Atualiza o `LocalStorage` imediatamente para **garantir que o usuário nunca perca dados**, mesmo fechando o navegador. O envio para o backend ocorre de forma otimizada.

---

## 🧠 Geração de PDF - `generate.php`

O arquivo `generate.php` é dedicado à criação do resumo final do empreendimento em formato PDF.

**Funcionalidades Principais:**

* Renderiza o resumo completo do empreendimento.
* Cria páginas separadas para seções chave (e.g., Linha do tempo, Modelo de Negócios, Parcerias).
* Aplica truncamento de texto (com `...`) para visualização resumida.
* Implementa um modal com texto completo (seção oculta/expandida) quando o truncamento é aplicado.

---

## 🔐 Segurança e Autenticação

### Google reCAPTCHA Invisible v3

O sistema utiliza o reCAPTCHA v3 invisível, que oferece proteção contra bots sem interromper a experiência do usuário.

**Configuração Necessária:**

1.  Crie as chaves em: [https://www.google.com/recaptcha/admin/create](https://www.google.com/recaptcha/admin/create)
2.  Selecione:
    * Tipo: **reCAPTCHA v3**
    * Ação: `login` / `register` / `submit` (ou conforme a necessidade).
    * Domínios: `localhost`, seu domínio de produção, etc.

**Validação Backend:**

A validação do token é feita via requisição à API do Google:

`https://www.google.com/recaptcha/api/siteverify`

### 👤 Perfis de Usuário

A tabela `users` gerencia os níveis de acesso com o campo:

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `is_reviewer` | `BOOLEAN DEFAULT 0` | `0` (Usuário Normal) ou `1` (Avaliador/Reviewer). |

* **Usuário Normal:** Vê e edita somente seus próprios negócios.
* **Reviewer:** Tem acesso a qualquer resumo (`url_hash`) e possui um dashboard especial de acompanhamento.

---

## 🧩 Estrutura do Banco de Dados (`business`)

A tabela `business` armazena os dados do empreendimento:

| Campo | Descrição |
| :--- | :--- |
| `id_user` | ID do dono do empreendimento (chave estrangeira). |
| `business_name` | Nome do empreendimento. |
| `url_hash` | Hash único e público para acesso ao resumo. |
| `business_data_json` | **JSON:** Dados completos de todos os cards. |
| `business_resume` | Resumo final gerado para disponibilização ao `reviewer`. |
| `timestamps` | `created_at` e `updated_at`. |

---

## 🎯 Conclusão

Este projeto é um sistema **modular, organizado e otimizado** para a gestão de formulários complexos que exigem:

* Salvamento automático (autosave) com alta resiliência (`LocalStorage`).
* Lógica e interação dinâmica por card.
* Geração de documentos avançados em PDF.
* Estrutura de acompanhamento por avaliadores (`reviewer`).

A arquitetura permite que qualquer desenvolvedor familiarizado com a stack estenda e mantenha o sistema rapidamente.# tem-app-laravel
