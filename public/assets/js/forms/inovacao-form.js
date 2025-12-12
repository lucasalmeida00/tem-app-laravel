(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["17"] = {
    id: "card17-inovacao",
    titleHtml:
      "<span class='c-green f-number'>17</span> <br/> <h2 class='c-black t-title'>Inovação</h2>",
    groups: [
      {
        // 17.1 — Definição de inovação
        titleHtml:
          "<span class='c-green f-number'>17.1</span> <br/>" +
          "<h3 class='c-black t-title'>Defina em uma frase curta o que é inovação para você.</h3>",
        color: "success",
        fields: [
          {
            type: "text",
            name: "innovationDefinition",
            placeholder: "Inovação é..."
          }
        ]
      },

      {
        // 17.2 — Patentes registradas
        titleHtml:
          "<span class='c-green f-number'>17.2</span> <br/>" +
          "<h3 class='c-black t-title'>O empreendimento tem patentes registradas?</h3>",
        color: "success",
        fields: [
          {
            type: "radio",
            name: "hasPatents",
            options: [
              { value: "sim", label: "Sim" },
              { value: "nao", label: "Não" }
            ]
          },
          {
            type: "number",
            name: "patentsCount",
            label: "Quantas",
            placeholder: "Quantidade de patentes"
          }
        ]
      },

      {
        // 17.3 — Prêmio de inovação
        titleHtml:
          "<span class='c-green f-number'>17.3</span> <br/>" +
          "<h3 class='c-black t-title'>O empreendimento recebeu algum prêmio de inovação nos últimos três anos?</h3>",
        color: "success",
        fields: [
          {
            type: "radio",
            name: "hasInnovationAward",
            options: [
              { value: "sim", label: "Sim" },
              { value: "nao", label: "Não" }
            ]
          },
          {
            type: "text",
            name: "innovationAwardDescription",
            label: "Qual?",
            placeholder: "Descreva o prêmio"
          }
        ]
      },

      {
        // 17.4 — Quão inovador é o empreendimento
        titleHtml:
          "<span class='c-green f-number'>17.4</span> <br/>" +
          "<h3 class='c-black t-title'>Considerando que todo empreendimento inova de alguma forma, sendo 1 pouco e 5 muito, quão inovadora é o seu empreendimento?</h3>",
        color: "success",
        fields: [
          {
            type: "radio",
            name: "innovationLevel",
            options: [
              { value: "1", label: "1 - Pouco" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5 - Muito" }
            ]
          }
        ]
      },

      {
        // 17.5 — Quantos novos produtos lançou
        titleHtml:
          "<span class='c-green f-number'>17.5</span> <br/>" +
          "<h3 class='c-black t-title'>Quantos novos produtos o empreendimento lançou nos últimos três anos?</h3>",
        color: "success",
        fields: [
          {
            type: "textarea",
            name: "newProductsLaunchedLast3Years",
            placeholder: "Fale sobre"
          }
        ]
      },

      {
        // 17.6 — Percentual do faturamento de novos produtos
        titleHtml:
          "<span class='c-green f-number'>17.6</span> <br/>" +
          "<h3 class='c-black t-title'>Qual é o percentual do faturamento decorrente de novos produtos lançados nos últimos três anos?</h3>",
        color: "success",
        fields: [
          {
            type: "textarea",
            name: "newProductsRevenueShare",
            placeholder: "60% - Produto A\n40% - Produto B"
          }
        ]
      },

      {
        // 17.7 — Interação com universidades e institutos tecnológicos
        titleHtml:
          "<span class='c-green f-number'>17.7</span> <br/>" +
          "<h3 class='c-black t-title'>Na maioria das vezes, o seu empreendimento interage com universidades e centros / institutos tecnológicos?</h3>",
        color: "success",
        fields: [
          {
            type: "radio",
            name: "interactsUniversities",
            options: [
              { value: "sim", label: "Sim" },
              { value: "nao", label: "Não" }
            ]
          },
          {
            type: "radio",
            name: "universityInteractionType",
            label: "Como?",
            options: [
            { value: "capacitacao_pessoal", label: "Capacitação de pessoal" },
            { value: "consultoria_tecnica", label: "Consultoria técnica" },
            { value: "desenvolvimento_processo", label: "Desenvolvimento de processo" },
            { value: "desenvolvimento_produto", label: "Desenvolvimento de produto" },
            { value: "pesquisa_conjunta", label: "Pesquisa conjunta" },
            { value: "testes_analises_laboratoriais", label: "Testes e análises laboratoriais" },
            { value: "transferencia_licenciamento_tecnologia", label: "Transferência ou licenciamento de tecnologia" },
            { value: "outro", label: "Outro" }
          ]
          },
          {
            type: "text",
            name: "universityInteractionOther",
            label: "Especifique:",
            placeholder: "Descreva como é essa interação"
          }
        ]
      },

      {
        // 17.8 — Nível de crescimento do faturamento
        titleHtml:
          "<span class='c-green f-number'>17.8</span> <br/>" +
          "<h3 class='c-black t-title'>Qual o nível de crescimento do faturamento do empreendimento nos últimos três anos?</h3>",
        color: "success",
        fields: [
          {
            type: "radio",
            name: "revenueGrowthLevel",
            options: [
              { value: "1", label: "1 - Baixo" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5 - Alto" },
              { value: "nao_se_aplica", label: "Não se aplica" }
            ]
          }
        ]
      },

      {
        // 17.9 — Ação para superar prejuízos
        titleHtml:
          "<span class='c-green f-number'>17.9</span> <br/>" +
          "<h3 class='c-black t-title'>Quais as principais ações que são tomadas para superar prejuízos?</h3>",
        color: "success",
        fields: [
          {
            type: "checkbox",
            name: "lossesMainAction",
            options: [
              { value: "busca_novos_mercados", label: "Busca de novos mercados" },
              { value: "melhoria_desenvolvimento_produto", label: "Melhoria ou desenvolvimento de produto" },
              { value: "mudanca_processo_produtivo", label: "Mudança no processo produtivo" },
              { value: "reducao_custo", label: "Redução de custo" },
              { value: "outro", label: "Outro" }
            ]
          },
          {
            type: "text",
            name: "lossesMainActionOther",
            label: "Especifique:",
            placeholder: "Descreva a ação"
          }
        ]
      },

      {
        // 17.10 — Monitoramento de tendências tecnológicas
        titleHtml:
          "<span class='c-green f-number'>17.10</span> <br/>" +
          "<h3 class='c-black t-title'>É realizado monitoramento das últimas tendências tecnológicas do setor?</h3>",
        color: "success",
        fields: [
          {
            type: "radio",
            name: "monitorTechTrends",
            options: [
              { value: "sim", label: "Sim" },
              { value: "nao", label: "Não" }
            ]
          },
          {
            type: "radio",
            name: "monitorTechLevel",
            label: "O quanto é monitorado?",
            options: [
              { value: "1", label: "1 - Pouco" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5 - Muito" }
            ]
          }
        ]
      },

      {
        // 17.11 — Uso de conhecimento científico
        titleHtml:
          "<span class='c-green f-number'>17.11</span> <br/>" +
          "<h3 class='c-black t-title'>É utilizado conhecimento científico no desenvolvimento de seus produtos?</h3>",
        color: "success",
        fields: [
          {
            type: "radio",
            name: "usesScientificKnowledge",
            options: [
              { value: "sim", label: "Sim" },
              { value: "nao", label: "Não" }
            ]
          },
          {
            type: "text",
            name: "scientificKnowledgeSource",
            label: "Qual a fonte principal?",
            placeholder: "Fonte de conhecimento"
          }
        ]
      },

      {
        // 17.12 — Última ação que aumentou o lucro
        titleHtml:
          "<span class='c-green f-number'>17.12</span> <br/>" +
          "<h3 class='c-black t-title'>Qual foi a última ação tomada pelo empreendimento que resultou em aumento do lucro?</h3>",
        color: "success",
        fields: [
          {
            type: "textarea",
            name: "lastActionIncreasedProfit",
            placeholder: "Descreva a ação."
          }
        ]
      }
    ]
  };
})();