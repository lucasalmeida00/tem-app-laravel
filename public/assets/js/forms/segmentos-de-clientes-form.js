(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["8"] = {
    id: "card8-segmentos-clientes",
    titleHtml:
      "<span class='c-green f-number'>8</span> <br/> <h2 class='c-black t-title'>Segmentos de Clientes</h2>",
    groups: [
      {
        // 8.1
        titleHtml:
          "<span class='c-green f-number'>8.1</span> <br/>" +
          "<h3 class='c-black t-title'>Quem foi o seu primeiro cliente?</h3>",
        color: "success",
        fields: [
          {
            type: "radio",
            name: "firstClient",
            options: [
              { value: "amigo_familiar", label: "Amigo ou familiar" },
              { value: "moradores_favela", label: "Moradores da favela (pessoas físicas)" },
              { value: "mercado_local", label: "Cliente de mercado local" },
              { value: "empreendimentos_locais", label: "Empreendimentos locais (comércio, pequenos empreendimentos)" },
              { value: "ongs", label: "ONGs ou organizações comunitárias" },
              { value: "pessoas_fisicas", label: "Pessoas físicas" },
              { value: "pessoas_juridicas", label: "Pessoas jurídicas" },
              { value: "publico_fora_favela", label: "Público fora da favela que se beneficia dos produtos/serviços" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      },
      {
        // 8.2
        titleHtml:
          "<span class='c-green f-number'>8.2</span> <br/>" +
          "<h3 class='c-black t-title'>Identifique grupos específicos que atualmente consomem seu produto/serviço? Escolha até 3 opções, sendo a primeira a mais importante.</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "segGroup1",
            placeholder: "Selecione uma opção",
            options: [
              { value: "faixa_etaria", label: "Consumidor final na faixa etária (jovens, adultos, idosos)" },
              { value: "tipo_renda", label: "Consumidor final por tipo de renda (baixa, média, alta)" },
              { value: "ocupacao", label: "Consumidor final por ocupação (trabalhadores informais, pequenos empresários, etc.)" },
              { value: "grandes_empresas", label: "Grandes Empresas" },
              { value: "pequenas_empresas", label: "Pequenas Empresas" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      }
    ]
  };
})();