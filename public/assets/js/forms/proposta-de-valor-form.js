// assets/js/forms/proposta-de-valor-form.js
(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["7"] = {
    id: "card7-proposta-valor",
    titleHtml:
      "<span class='c-green f-number'>7</span> <br/> <h2 class='c-black t-title'>Proposta de Valor</h2>",
    groups: [
      {
        // 7.1
        titleHtml:
          "<span class='c-green f-number'>7.1</span> <br/>" +
          "<h3 class='c-black t-title'>Qual problema o seu empreendimento resolve? E seu principal produto?</h3>",
        color: "success",
        fields: [
          { type: "text", name: "vpProblem", placeholder: "Especifique" }
        ]
      },
      {
        // 7.2 (o JS cria os selects 2 e 3 e a lógica do "Outro")
        titleHtml:
          "<span class='c-green f-number'>7.2</span> <br/>" +
          "<h3 class='c-black t-title'>Como o seu produto/serviço se diferencia das soluções existentes? Escolha até 3 opções, sendo a primeira a mais importante.</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "valueDiff1",
            placeholder: "Selecione uma opção",
            options: [
              { value: "facilidade_acesso", label: "Facilidade de acesso (presença local, sem necessidade de deslocamento)" },
              { value: "facilidade_uso", label: "Facilidade de Uso" },
              { value: "eficiencia_rapidez", label: "Maior eficiência ou rapidez" },
              { value: "nicho_especifico", label: "Atende a um nicho específico" },
              { value: "nao_ofertado_favela", label: "Produto não ofertado na favela" },
              { value: "preco_acessivel", label: "Preço mais acessível" },
              { value: "qualidade_superior", label: "Qualidade Superior" },
              { value: "melhor_qualidade", label: "Produto/Serviço de melhor qualidade" },
              { value: "solucao_mais_rapida", label: "Solução mais rápida ou eficiente" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      }
    ]
  };
})();