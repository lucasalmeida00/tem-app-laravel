(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["13"] = {
    id: "card13-atividades-chave",
    titleHtml: "<span class='c-green f-number'>13</span> <br/> <h2 class='c-black t-title'>Atividades-Chave</h2>",
    groups: [{
      // 13.1
      titleHtml: "<span class='c-green f-number'>13.1</span> <br/>" +
        "<h3 class='c-black t-title'>Quais são as atividades principais para o empreendimento funcionar? Escolha até 3 opções, sendo a primeira a mais importante.</h3>",
      color: "success",
      fields: [{
        type: "select",
        name: "actKey1",
        placeholder: "Selecione uma opção",
        options: [{
            value: "acoes_vendas_locais",
            label: "Ações de vendas locais"
          },
          {
            value: "capacitacao_treinamento_moradores",
            label: "Capacitação ou treinamento de moradores de favela/comunidade"
          },
          {
            value: "desenvolvimento_novos_produtos_servicos",
            label: "Desenvolvimento de novos produtos ou serviços"
          },
          {
            value: "engajamento_comunitario",
            label: "Engajamento comunitário"
          },
          {
            value: "eventos_parcerias_locais",
            label: "Eventos e parcerias locais"
          },
          {
            value: "logistica_distribuicao",
            label: "Logistica e distribuição"
          },
          {
            value: "marketing_vendas",
            label: "Marketing e Vendas"
          },
          {
            value: "prestacao_servicos",
            label: "Prestação de Serviços"
          },
          {
            value: "servicos_educacao_saude",
            label: "Prestação de serviços como educação ou saúde"
          },
          {
            value: "producao_fornecimento_produtos_essenciais",
            label: "Produção ou fornecimento de produtos essenciais"
          },
          {
            value: "producao_produtos",
            label: "Produção de produtos"
          },
          {
            value: "outro",
            label: "Outro"
          }
        ]
      }]
    }]
  };
})();