(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["11"] = {
    id: "card11-fontes-receita",
    titleHtml:
      "<span class='c-green f-number'>11</span> <br/> <h2 class='c-black t-title'>Fontes de Receita</h2>",
    groups: [
      {
        // 11.1 — Fontes utilizadas (a 1ª é a mais rentável)
        titleHtml:
          "<span class='c-green f-number'>11.1</span> <br/>" +
          "<h3 class='c-black t-title'>De que forma o seu empreendimento gera receita e qual é o modelo de monetização mais importante atualmente? Escolha todas as fontes utilizadas, sendo a primeira mais rentável.</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "revSource1",
            placeholder: "Selecione uma opção",
            options: [
              { value: "assinatura_adesao", label: "Modelos de assinatura ou adesão" },
              { value: "doacao", label: "Doação" },
              { value: "licensiamento", label: "Licenciamento" },
              { value: "patrocinio_direto", label: "Patrocínio direito" },
              { value: "patrocinio_lei_incentivo", label: "Patrocínio via lei de incentivo" },
              { value: "prestacao_servicos", label: "Prestação de serviços" },
              { value: "publicidade", label: "Publicidade" },
              { value: "taxas_transacao_comissoes", label: "Taxas de transação ou comissões" },
              { value: "venda_direta_produtos", label: "Venda direta de produtos" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      },
      {
        // 11.2 — Modelo de monetização
        titleHtml:
          "<span class='c-green f-number'>11.2</span> <br/>" +
          "<h3 class='c-black t-title'>Qual é o modelo de monetização do seu produto/serviço? Escolha todas as fontes utilizadas, sendo a primeira a mais importante.</h3>",
        color: "success",
        fields: [
          {
            type: "select",
            name: "monetModel1",
            placeholder: "Selecione uma opção",
            options: [
              { value: "assinatura_recorrente", label: "Assinatura recorrente" },
              { value: "freemium", label: "Modelo Freemium (gratuito com opções pagas)" },
              { value: "taxa_transacao_uso", label: "Taxa pro transação de uso" },
              { value: "venda_unica", label: "Venda única" },
              { value: "outro", label: "Outro" }
            ]
          }
        ]
      }
    ]
  };
})();