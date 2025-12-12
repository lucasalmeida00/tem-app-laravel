(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["12"] = {
    id: "card12-recursos-chave",
    titleHtml:
      "<span class='c-green f-number'>12</span> <br/> <h2 class='c-black t-title'>Recursos-Chave</h2>",
    groups: [
      {
        // 12.1
        titleHtml:
          "<span class='c-green f-number'>12.1</span> <br/>" +
          "<h3 class='c-black t-title'>Quais são os principais recursos-chave necessários para que empreendimento funcione? Escolha as opções, sendo a primeira a mais importante.</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "keyRes1",
            placeholder: "Selecione uma opção",
            options: [
              { value: "capital_financeiro", label: "Capital financeiro (próprio ou de investidores)" },
              { value: "conhecimento_comunidade", label: "Conhecimento sobre a comunidade e seus desafios" },
              { value: "doadores", label: "Doadores" },
              { value: "financiamento_coletivo", label: "Financiamento coletivo" },
              { value: "infraestrutura", label: "Infraestrutura (prédio, lojas, espaço físico, equipamentos)" },
              { value: "mao_de_obra_local", label: "Mão de obra local (moradores da favela/comunidade)" },
              { value: "parcerias_comercios_organizacoes", label: "Parcerias com comércios ou organizações locais" },
              { value: "patrocinadores_diretos", label: "Patrocinadores diretos" },
              { value: "patrocinadores_lei_incentivo", label: "Patrocinadores via lei de incentivo" },
              { value: "pessoas_assalariadas", label: "Pessoas assalariadas (equipe, expertise)" },
              { value: "pessoas_equipe", label: "Pessoas (Equipe, expertise)" },
              { value: "propriedade_intelectual", label: "Propriedade intelectual (patentes, marcas)" },
              { value: "tecnologia", label: "Tecnologia (aplicativos, sites)" },
              { value: "voluntarios", label: "Voluntários" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      }
    ]
  };
})();