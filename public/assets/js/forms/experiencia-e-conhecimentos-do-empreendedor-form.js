// assets/js/forms/experiencia-e-conhecimentos-do-empreendedor.js
(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["3"] = {
    title: "",
    groups: [
      {
        // 3.1 — Formação
        titleHtml: "<span class='c-green f-number'>3.1</span> <br/> <h3 class='c-black t-title'>Formação</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "entrepreneurEducation",
            placeholder: "Selecione a formação",
            required: true,
            options: [
              { value: "doutorado", label: "Doutorado" },
              { value: "informal", label: "Informal" },
              { value: "mestrado", label: "Mestrado" },
              { value: "pos_graduacao", label: "Pós Graduação" },
              { value: "primeiro_grau", label: "Primeiro Grau" },
              { value: "segundo_grau", label: "Segundo Grau" },
              { value: "superior", label: "Superior" }
            ]
          }
        ]
      },
      {
        // 3.2 — Cargo no empreendimento (+Outro → especifique)
        titleHtml: "<span class='c-green f-number'>3.2</span> <br/> <h3 class='c-black t-title'>Cargo no empreendimento</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "entrepreneurRole",
            placeholder: "Selecione o cargo",
            required: true,
            options: [
              { value: "diretor", label: "Diretor" },
              { value: "presidente", label: "Presidente" },
              { value: "socio", label: "Sócio" },
              { value: "socio_investidor", label: "Sócio Investidor" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      },
      {
        // 3.3 — Funções (checkboxes) (+Outro → especifique)
        titleHtml: "<span class='c-green f-number'>3.3</span> <br/> <h3 class='c-black t-title'>Funções que exerce no empreendimento</h3>",
        color: "success",
        fields: [
          {
            type: "checkbox",
            name: "entrepreneurFunctions",
            required: true,
            options: [
              { value: "administracao", label: "Administração" },
              { value: "comunicacao", label: "Comunicação" },
              { value: "financas", label: "Finanças" },
              { value: "logistica", label: "Logística" },
              { value: "marketing_vendas", label: "Marketing e Vendas" },
              { value: "novos_produtos_servicos", label: "Novos Produtos e/ou Serviços" },
              { value: "operacao_producao", label: "Operação e/ou Produção" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      },
      {
        // 3.4 — Histórico como empreendedor (Sim/Não) — conteúdo condicional via JS
        titleHtml: "<span class='c-green f-number'>3.4</span> <br/> <h3 class='c-black t-title'>Histórico como empreendedor</h3>",
        color: "success",
        fields: [
          {
            type: "radio",
            name: "hasEntrepreneurExperience",
            labelHtml: "<p class='mb-1'>Você já tinha experiência como empreendedor?</p>",
            options: [
              { value: "sim", label: "Sim" },
              { value: "nao", label: "Não" }
            ]
          }
        ]
      },
      {
        // 3.5 — Motivação (+ “Justifique sua resposta” sempre)
        titleHtml: "<span class='c-green f-number'>3.5</span> <br/> <h3 class='c-black t-title'>O que motivou você a começar a empreender?</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "startMotivation",
            placeholder: "Selecione uma opção",
            options: [
              { value: "analise_previa", label: "Fiz uma análise antes de começar" },
              { value: "identifiquei_problema", label: "Identifiquei um problema" },
              { value: "caminho_novo", label: "Decidi seguir um caminho novo sem muitas certezas" },
              { value: "ideia_antiga", label: "Segui uma ideia que já tinha em mente há algum tempo" },
              { value: "ideia_explorar", label: "Tive uma ideia e quis explorar" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      },
      {
        // 3.6 — Situação ao decidir empreender (+Outro → especifique)
        titleHtml: "<span class='c-green f-number'>3.6</span> <br/> <h3 class='c-black t-title'>Qual era a sua situação quando decidiu empreender?</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "situationWhenStarted",
            placeholder: "Selecione uma opção",
            options: [
              { value: "desempregado", label: "Desempregado" },
              { value: "emprego_formal", label: "Emprego Formal (com CLT)" },
              { value: "trabalho_informal", label: "Trabalho Informal" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      },
      {
        // 3.7 — Três seleções encadeadas (com “Outro” especial)
        titleHtml: "<span class='c-green f-number'>3.7</span> <br/> <h3 class='c-black t-title'>Primeiros passos (escolha as 3 opções principais)</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "firstSteps1",
            placeholder: "Selecione uma opção",
            options: [
              { value: "aos_poucos_ajustes", label: "Comecei aos poucos e fui ajustando conforme necessário" },
              { value: "considerando_possibilidades", label: "Passei algum tempo considerando possibilidades" },
              { value: "conversei_amigos_familiares", label: "Conversei com amigos e/ou familiares" },
              { value: "conversei_setor", label: "Conversei com pessoas do setor" },
              { value: "entender_mercado_clientes", label: "Busquei entender o mercado e as necessidades dos clientes" },
              { value: "estrategias_iniciais", label: "Desenvolvi estratégias iniciais, estudei várias alternativas" },
              { value: "informal_ate_formalizar", label: "Fiz algo mais informal até formalizar" },
              { value: "impulso", label: "Foi um impulso e comecei imediatamente" },
              { value: "pesquisei_bastante", label: "Pesquisei bastante antes de iniciar" },
              { value: "recursos_informacoes", label: "Busquei recursos e informações" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      },
      {
        // 3.8 — Texto livre
        titleHtml: "<span class='c-green f-number'>3.8</span> <br/> <h3 class='c-black t-title'>Após a criação do empreendimento, conte como você resolveu de forma inovadora um problema da empresa.</h3>",
        color: "success",
        fields: [
          {
            type: "textarea",
            name: "postCreationInnovation",
            placeholder: "Insira sua resposta"
          }
        ]
      }
    ]
  };
})();