(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["14"] = {
    id: "card14-parcerias-chave",
    titleHtml:
      "<span class='c-green f-number'>14</span> <br/> <h2 class='c-black t-title'>Parcerias-Chave</h2>",
    groups: [
      {
        // 14.1 — Sócios e percentuais
        titleHtml:
          "<span class='c-green f-number'>14.1</span> <br/>" +
          "<h3 class='c-black t-title'>Atualmente, qual é o número de sócios e percentual de participação de cada sócio no capital do empreendimento?</h3>",
        color: "success",
        fields: [
          {
            type: "textarea",
            name: "partnersShares",
            placeholder: "50% - Fulano de Tal\n50% - Ciclano de Tal"
          }
        ]
      },
      {
        // 14.2 — Principais parceiros (3 selects encadeados com “Outro”)
        titleHtml:
          "<span class='c-green f-number'>14.2</span> <br/>" +
          "<h3 class='c-black t-title'>Quem são seus principais parceiros para que seu empreendimento funcione? Escolha até 3 em ordem de importância, sendo a primeira a mais importante.</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "mainPartners1",
            placeholder: "Selecione uma opção",
            options: [
              { value: "centros_pesquisa_pdu", label: "Centros de pesquisa e desenvolvimento (P&D) ou universidades" },
              { value: "distribuidores_revendedores", label: "Distribuidores e revendedores" },
              { value: "entrada_novos_investidores", label: "Entrada de novos investidores" },
              { value: "entrada_socios", label: "Entrada de sócios" },
              { value: "fornecedores", label: "Fornecedores" },
              { value: "instituicoes_financeiras", label: "Instituições financeiras" },
              { value: "investidores_privados", label: "Investidores privados" },
              { value: "investidores_publicos", label: "Investidores públicos" },
              { value: "logistica", label: "Logística" },
              { value: "mkt_publicidade", label: "Empreendimentos de marketing e publicidade" },
              { value: "ongs_nao_governamentais", label: "Organizações não governamentais (ONGs)" },
              { value: "lideres_influenciadores", label: "Líderes ou influenciadores comunitários" },
              { value: "parceiros_tecnologia", label: "Parceiros de tecnologia (infraestrutura tecnológica, aplicativos ou plataformas online)" },
              { value: "pequenos_comerciantes_locais", label: "Pequenos comerciantes locais" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      }
    ]
  };
})();