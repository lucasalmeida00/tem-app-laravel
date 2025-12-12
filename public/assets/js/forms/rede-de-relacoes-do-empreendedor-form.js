(function () {
  window.FormSchemas = window.FormSchemas || {};

  window.FormSchemas["5"] = {
  id: "card5-rede-relacoes",
  titleHtml:
    "<span class='c-green f-number'>5</span> <br/> <h2 class='c-black t-title'>Rede de relações do empreendedor</h2>",
  groups: [
    {
      // 5.1
      titleHtml:
        "<span class='c-green f-number'>5.1</span> <br/>" +
        "<h3 class='c-black t-title'>Quem você conhece que se tornou parceiro, colaborador ou sócio do empreendimento na fase inicial do empreendimento? A seguir, detalhe a natureza dos contatos. Escolher 3 principais opções na fase inicial (até 5 anos)</h3>",
      color: "success",
      fields: [
        {
          type: "select",
          name: "relSelect1",
          placeholder: "Selecione uma opção",
          options: [
            { value: "amigos", label: "Amigos" },
            { value: "colegas", label: "Colegas ou Ex-colegas" },
            { value: "empregador", label: "Empregador (Antigo ou atual empregador que se torna parceiro, investidor ou sócio do empreendimento)" },
            { value: "familiares", label: "Familiares" },
            { value: "mentores", label: "Mentores ou conselheiros profissionais" },
            { value: "nenhumPrevio", label: "Nenhum contato prévio, pois encontrei pessoas durante o processo" },
            { value: "outrasRelacoes", label: "Outras relações (poder público, igreja, outras insituições, investidor, contatos via redes sociais etc.)" },
            { value: "outrosEmpreendedores", label: "Outros empreendedores" },
            { value: "parceirosFornecedores", label: "Parceiros ou fornecedores já conhecidos" }
          ]
        }
      ]
    },
    {
    // 5.2 — Pós-inicial (após 5 anos)
    titleHtml:
        "<span class='c-green f-number'>5.2</span> <br/>" +
        "<h3 class='c-black t-title'>Quem você conhece que se tornou parceiro, colaborador ou sócio do empreendimento na fase pós inicial do empreendimento? A seguir, detalhe a natureza dos contatos. Escolher 3 principais opções na fase pós inicial (após 5 anos)</h3>",
    color: "success",
    fields: [
        {
        type: "select",
        name: "relPostSelect1",
        placeholder: "Selecione uma opção",
        options: [
          { value: "amigos", label: "Amigos" },
          { value: "colegas", label: "Colegas ou Ex-colegas" },
          { value: "empregador", label: "Empregador (Antigo ou atual empregador que se torna parceiro, investidor ou sócio do empreendimento)" },
          { value: "familiares", label: "Familiares" },
          { value: "mentores", label: "Mentores ou conselheiros profissionais" },
          { value: "nenhumPrevio", label: "Nenhum contato prévio, pois encontrei pessoas durante o processo" },
          { value: "outrasRelacoes", label: "Outras relações (poder público, igreja, outras insituições, investidor, contatos via redes sociais etc.)" },
          { value: "outrosEmpreendedores", label: "Outros empreendedores" },
          { value: "parceirosFornecedores", label: "Parceiros ou fornecedores já conhecidos" }
        ]
        }
    ]
    }
    ]
  };
})();
