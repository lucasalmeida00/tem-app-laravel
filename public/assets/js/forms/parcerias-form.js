(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["20"] = {
    id: "card20-parcerias",
    titleHtml:
      "<span class='c-green f-number'>20</span> <br/>" +
      "<h2 class='c-black t-title'>Parcerias</h2>",
    groups: [
      {
        // 20.1 — Principais parcerias
        titleHtml:
          "<span class='c-green f-number'>20.1</span> <br/>" +
          "<h3 class='c-black t-title'>Informe quais são as principais parcerias do seu empreendimento por ano.</h3>",
        color: "success",
        fields: [
          {
            type: "textarea",
            name: "partnershipDescription",
            label: "Parceria (0/1000):",
            placeholder: "Especifique"
          },
          {
            type: "number",
            name: "partnershipYear",
            label: "Informe o ano:",
            placeholder: "2025"
          }
          // Botão "Adicionar" e lista de parcerias criados via JS
        ]
      }
    ]
  };
})();