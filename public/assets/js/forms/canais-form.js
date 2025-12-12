(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["9"] = {
    id: "card9-canais",
    titleHtml:
      "<span class='c-green f-number'>9</span> <br/> <h2 class='c-black t-title'>Canais</h2>",
    groups: [
      {
        // 9.1
        titleHtml:
          "<span class='c-green f-number'>9.1</span> <br/>" +
          "<h3 class='c-black t-title'>Quais são os principais canais de vendas e comunicação? Escolha todas as opções que utilizar, sendo a primeira a mais importante.</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "channels1",
            placeholder: "Selecione uma opção",
            options: [
              { value: "internet", label: "Internet" },
              { value: "anuncios", label: "Anúncios" },
              { value: "lojas_franquias_marketing", label: "Lojas físicas, franquias ou por meio de canais de marketing como redes sociais" },
              { value: "redes_sociais", label: "Redes sociais" },
              { value: "vendas_diretas_feiras_parcerias", label: "Vendas diretas de porta em porta, feiras locais ou parcerias com lideranças comunitárias" },
              { value: "outro", label: "Outros" }
            ]
          }
        ]
      }
    ]
  };
})();