(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["16"] = {
    id: "card16-estrutura-de-custos",
    titleHtml:
      "<span class='c-green f-number'>16</span> <br/> <h2 class='c-black t-title'>Estrutura de Custos</h2>",
    groups: [
      {
        // 16.1
        titleHtml:
          "<span class='c-green f-number'>16.1</span> <br/>" +
          "<h3 class='c-black t-title'>Quais custos você considera mais desafiadores ou mais altos em seu empreendimento? Escolha até 3 opções, sendo a primeira a mais importante.</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "costChallenging1",
            placeholder: "Selecione uma opção",
            options: [
              { value: "contratacao_retencao_colaboradores", label: "Contratação e retenção de colaboradores qualificados" },
              { value: "custos_regulamentacoes_burocracia", label: "Custos com regulamentações e burocracia" },
              { value: "investimento_logistica", label: "Investimento em Logística (entrega, transporte)" },
              { value: "manutencao_precos_acessiveis", label: "Manutenção de preços acessíveis" },
              { value: "marketing_publicidade", label: "Marketing e Publicidade" },
              { value: "producao", label: "Produção" },
              { value: "salarios_beneficios", label: "Salários e Benefícios" },
              { value: "tecnologia_infraestrutura", label: "Tecnologia e Infraestrutura" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      }
    ]
  };
})();