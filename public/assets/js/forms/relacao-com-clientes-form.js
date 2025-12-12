(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["10"] = {
    id: "card10-relacao-clientes",
    titleHtml:
      "<span class='c-green f-number'>10</span> <br/> <h2 class='c-black t-title'>Relação com Clientes</h2>",
    groups: [
      {
        // 10.1 — Fidelização / Fortalecimento
        titleHtml:
          "<span class='c-green f-number'>10.1</span> <br/>" +
          "<h3 class='c-black t-title'>Como fidelizar e fortalecer a relação com os clientes? Escolha todas as opções que utilizar, sendo a primeira a mais importante.</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "fidelRel1",
            placeholder: "Selecione uma opção",
            options: [
              { value: "automacao_autoatendimento", label: "Automação e autoatendimento" },
              { value: "atendimento_personalizado", label: "Atendimento personalizado" },
              { value: "boca_a_boca", label: "Incentivando o boca a boca e indicações" },
              { value: "comunidades_grupos", label: "Comunidades ou grupos online" },
              { value: "programas_fidelidade", label: "Programas de fidelidade" },
              { value: "suporte_24_7", label: "Suporte 24/7" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      },
      {
        // 10.2 — Captação / Manutenção
        titleHtml:
          "<span class='c-green f-number'>10.2</span> <br/>" +
          "<h3 class='c-black t-title'>Como você capta novos clientes e mantém a carteira de clientes atual? Escolha todas as opções que utilizar, sendo a primeira a mais importante.</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "captaRel1",
            placeholder: "Selecione uma opção",
            options: [
              { value: "publicidade_marketing_digital", label: "Através de publicidade e marketing digital" },
              { value: "redes_sociais_comunicacao", label: "Através de redes sociais e comunicação digital" },
              { value: "parcerias_locais", label: "Parcerias com outros empreendimentos locais" },
              { value: "parcerias_indicacoes", label: "Parcerias e indicações" },
              { value: "por_meio_atendimento", label: "Por meio de atendimento" },
              { value: "promocoes_descontos", label: "Oferecendo promoções e descontos" },
              { value: "promocoes_novos_clientes", label: "Promoções e descontos para novos clientes" },
              { value: "outros", label: "Outros" }
            ]
          }
        ]
      }
    ]
  };
})();