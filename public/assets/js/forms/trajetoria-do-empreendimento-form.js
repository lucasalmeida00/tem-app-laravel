(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["19"] = {
    id: "card19-trajetoria-do-empreendimento",
    titleHtml:
      "<span class='c-green f-number'>19</span> <br/>" +
      "<h2 class='c-black t-title'>Trajetória do Empreendimento</h2>",
    groups: [
      {
        // 19.1 — Marcos anuais
        titleHtml:
          "<span class='c-green f-number'>19.1</span> <br/>" +
          "<h3 class='c-black t-title'>Informe quais são os principais marcos (anuais) do seu empreendimento desde a sua criação até os dias atuais.</h3>" +
          "<button type='button' class='btn btn-link btn-sm p-0 align-baseline trajectory-order-hint-btn' " +
          "aria-expanded='false' aria-controls='trajectoryOrderHintText' " +
          "aria-label='Aviso sobre a ordem dos marcos'>" +
          "<i class='fas fa-info-circle'></i> Pode informar em qualquer ordem" +
          "</button>" +
          "<div id='trajectoryOrderHintText' class='trajectory-order-hint-text alert alert-info mt-2 mb-0 p-2 small d-none'>" +
          "Você pode informar os marcos em qualquer ordem de ano — o sistema organiza automaticamente do mais antigo para o mais recente." +
          "</div>",
        color: "success",
        fields: [
          {
            type: "textarea",
            name: "milestoneDescription",
            label: "Marco (0/1000):",
            placeholder: "Especifique"
          },
          {
            type: "number",
            name: "milestoneYear",
            label: "Informe o ano que ocorreu:",
            placeholder: "2025"
          }
          // O botão "Adicionar" e a lista de marcos serão criados via JS no card-19
        ]
      }
    ]
  };
})();
