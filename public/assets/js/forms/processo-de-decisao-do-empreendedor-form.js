(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["6"] = {
    id: "card6-processo-decisao",
    titleHtml:
      "<span class='c-green f-number'>6</span> <br/> <h2 class='c-black t-title'>Processo de decisão do empreendedor</h2>",
    groups: [
      {
        // 6.1
        titleHtml:
          "<span class='c-green f-number'>6.1</span> <br/>" +
          "<h3 class='c-black t-title'>Você é o principal tomador de decisões no seu empreendimento?</h3>",
        color: "success",
        fields: [
          {
            type: "radio",
            name: "decisionMain",
            options: [
              { value: "sim", label: "Sim" },
              { value: "nao", label: "Não" }
            ]
          }
          // Os 3 selects encadeados serão criados dinamicamente pelo card6-processo-decisao.js
        ]
      }
    ]
  };
})();
