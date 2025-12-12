window.Card15 = (function () {
  // ==== Utils (mesmo padrão dos cards anteriores) ====
  function wrapperFor($el) {
    const $p = $el.closest(".form-field, .mb-2, .mb-3, .col, .col-12, .row");
    return $p.length ? $p : $el.parent();
  }

  function ensureContainer($wrap, cls, asSiblingAfter = false) {
    if (!$wrap || !$wrap.length) return $();
    let $c;
    if (asSiblingAfter) {
      $c = $wrap.nextAll("." + cls).first();
      if (!$c.length) $c = $(`<div class="${cls}"></div>`).insertAfter($wrap);
    } else {
      $c = $wrap.find("." + cls).first();
      if (!$c.length) $c = $(`<div class="${cls}"></div>`).appendTo($wrap);
    }
    return $c;
  }

  // ==== Opções (espelho do schema) ====
  const HOW_PARTNER_OPTIONS = [
    { v: "feiras_exposicoes", label: "Feiras e Exposições" },
    { v: "eventos_setor", label: "Eventos do Setor" },
    { v: "hackathons_competicoes", label: "Hackathons e Competições" },
    { v: "conhecidos_rede_profissional", label: "Conhecidos e Rede Profissional" },
    { v: "familia_amigos", label: "Família e Amigos" },
    { v: "midias_sociais", label: "Mídias Sociais" },
    { v: "comunidade_religiosa", label: "Comunidade Religiosa" },
    { v: "novos_parceiros", label: "Novos Parceiros" },
    { v: "incubadoras_aceleradoras", label: "Incubadoras e Aceleradoras" },
    { v: "associacoes_profissionais", label: "Associações Profissionais" },
    { v: "universidades_pesquisa", label: "Universidades e centros de pesquisa" },
    { v: "consultorias", label: "Consultorias" },
    { v: "agencia_fomento", label: "Agência de Fomento" },
    {
      v: "coworking_espacos_compartilhados",
      label: "Coworking e Espaços de trabalho compartilhado"
    },
    {
      v: "comunidades_foruns_online",
      label: "Comunidades e Fóruns Online"
    },
    { v: "eventos_networking", label: "Eventos de Networking" },
    { v: "clientes_ex_clientes", label: "Clientes e Ex-Clientes" },
    {
      v: "grupos_associacoes_comunitaria",
      label: "Grupos e Associações Comunitária"
    },
    { v: "programas_mentoria", label: "Programas de Mentoria" },
    {
      v: "fundos_investimento_capital_risco",
      label: "Fundos de Investimento e Capital de Risco"
    },
    { v: "programas_televisao", label: "Programas de Televisão" },
    { v: "redes_sociais", label: "Redes Sociais" },
    { v: "outro", label: "Outro" }
  ];

  const PARTNERSHIPS_BOOST_SALES_OPTIONS = [
    {
      v: "parcerias_influenciadores",
      label: "Parcerias com Influenciadores"
    },
    {
      v: "parcerias_outros_empreendimentos",
      label: "Parcerias com Outros Empreendimentos para Vendas Conjuntas"
    },
    {
      v: "colaboracao_ongs_comunidade",
      label: "Colaboração com ONGs e Organizações Comunitárias"
    },
    {
      v: "eventos_capacitacao_empoderamento",
      label: "Participação em Eventos de Capitalização e Empoderamento Comunitário"
    },
    {
      v: "parcerias_escolas_associacoes_igrejas",
      label: "Parcerias com Escolas, Associações de Moradores, Igrejas"
    },
    {
      v: "descontos_beneficios_vizinhos",
      label: "Descontos ou Benefícios para Vizinhos e Famílias do Bairro"
    },
    {
      v: "promocoes_lancamento_parcerias",
      label:
        "Promoções de Lançamento de Produtos/Serviços (parcerias com organizações ou outros negócios)"
    },
    {
      v: "colaboracao_organizacoes_empreendedorismo",
      label: "Colaboração com Organizações de Empreendedorismo"
    },
    {
      v: "venda_grupos_compras_coletivas",
      label: "Venda em Grupos de Compras Coletivas e Redes Locais de Consumo"
    },
    { v: "outro", label: "Outro" }
  ];

  const SALES_BOOST_OPPORTUNITIES_OPTIONS = [
    { v: "feiras_exposicoes", label: "Feiras e Exposições" },
    { v: "eventos_setor", label: "Eventos do Setor" },
    {
      v: "promocoes_clientes_atuais",
      label: "Promoções junto aos clientes atuais"
    },
    {
      v: "campanhas_marketing_digital",
      label: "Campanhas de Marketing Digital"
    },
    {
      v: "publicidade_redes_sociais",
      label: "Publicidade em Redes Sociais"
    },
    {
      v: "email_whatsapp_marketing",
      label: "E-mail Marketing e Whatsapp Marketing"
    },
    {
      v: "descontos_promocoes_sazonais",
      label: "Descontos e Promoções Sazonais"
    },
    {
      v: "programa_indicacao",
      label: "Programa de Indicação (Indique e Ganhe)"
    },
    { v: "anuncios_publicidade", label: "Anúncios" },
    {
      v: "publicidade_revistas_jornais_radio",
      label:
        "Publicidade em Revistas, Jornais e Rádio (incluindo rádios comunitárias)"
    },
    {
      v: "conteudo_digital",
      label: "Criação de Conteúdo Digital (Blog, Youtube, Podcasts)"
    },
    {
      v: "conferencias_congressos",
      label: "Participação em Conferências e Congressos"
    },
    {
      v: "hackathon_aceleracao",
      label: "Participação em Hackathon e Programas de Aceleração"
    },
    {
      v: "amostras_gratis",
      label: "Distribuição de Amostras Grátis"
    },
    {
      v: "promocoes_personalizadas",
      label: "Promoções Personalizadas (baseadas em dados de clientes)"
    },
    {
      v: "testes_gratuitos_novos_clientes",
      label: "Testes Gratuitos para Novos Clientes"
    },
    { v: "webinares_lives", label: "Webinares e Lives" },
    {
      v: "grupos_comunidades_online",
      label: "Participação em Grupos e Comunidades Online"
    },
    {
      v: "panfletagem_alto_movimento",
      label: "Panfletagem em Locais de Alto Movimento"
    },
    {
      v: "boca_a_boca_indicacao",
      label: "Boca a Boca e Indicação de Clientes"
    },
    {
      v: "abordagens_diretas",
      label: "Abordagens Diretas"
    },
    {
      v: "equipe_vendas_ativa",
      label: "Equipe de Vendas Ativa"
    },
    {
      v: "licitacoes_concorrencias_publicas",
      label: "Participação em Licitações e Concorrências Públicas"
    },
    { v: "outro", label: "Outro" }
  ];

  const RECEPTIVITY_OPTIONS = [
    {
      v: "aceita_colaboracoes",
      label: "Aceita Colaborações de potenciais parceiros"
    },
    {
      v: "reune_incorpora_informacoes",
      label: "Reúne e incorpora Novas Informações"
    },
    {
      v: "avalia_novos_desenvolvimentos",
      label: "Avalia e considera novos desenvolvimentos"
    },
    {
      v: "mais_resistente_foco",
      label: "Mais resistente por conta do foco"
    },
    {
      v: "prefere_manter_foco_atuais",
      label: "Prefere manter o foco nas estratégias práticas atuais"
    },
    {
      v: "aceita_sugestoes_limitacoes",
      label:
        "Aceita sugestões e parcerias, mas com limitações ou em áreas específicas do empreendimento"
    },
    {
      v: "avalia_interesse_planejamento_metas",
      label:
        "Avalia o interesse de novos parceiros com base na aderência ao planejamento e metas estabelecidas"
    },
    {
      v: "prefere_atuar_sozinho_socios",
      label: "Prefere atuar sozinho ou somente com os sócios"
    },
    { v: "outro", label: "Outro" }
  ];

  // ==== Builder genérico de select ====
  function buildSelect(name, options) {
    return $(`
      <div class="mb-2 pk-select-wrap">
        <select class="form-select" name="${name}">
          <option value="" disabled selected hidden>Selecione uma opção</option>
          ${options.map(o => `<option value="${o.v}">${o.label}</option>`).join("")}
        </select>
        <div class="mt-2 pk-other-box d-none"></div>
      </div>
    `);
  }

  // “Outro” NUNCA sai da lista
  function fillSelect($sel, chosenSet, options) {
    const keep = $sel.val();
    $sel.html(`<option value="" disabled selected hidden>Selecione uma opção</option>`);
    options.forEach(o => {
      if (!chosenSet.has(o.v) || o.v === "outro") {
        $sel.append(`<option value="${o.v}">${o.label}</option>`);
      }
    });
    if (keep && (!chosenSet.has(keep) || keep === "outro")) {
      $sel.val(keep);
    }
  }

  function wireOtherFor($wrap) {
    const $sel = $wrap.find("select");
    const $box = $wrap.find(".pk-other-box");
    function renderOther() {
      if ($sel.val() === "outro") {
        $box
          .removeClass("d-none")
          .html(
            `<input type="text" class="form-control" name="${$sel.attr(
              "name"
            )}__other" placeholder="Especifique" />`
          );
      } else {
        $box.addClass("d-none").empty();
      }
    }
    $wrap.off("change.pkOther").on("change.pkOther", "select", renderOther);
    renderOther();
  }

  // ==== Multi-select genérico (N selects encadeados) ====
  function initMultiSelect($root, cfg) {
    const { firstName, extraNames, options, nsKey } = cfg;
    const allNames = [firstName].concat(extraNames || []);

    const $s1 = $root.find(`select[name="${firstName}"]`);
    if (!$s1.length) return;

    // 1) garante wrapper pro s1
    let $w1 = $s1.closest(".pk-select-wrap");
    if (!$w1.length) {
      $w1 = $(`<div class="mb-2 pk-select-wrap"></div>`);
      $s1.after($w1);
      $w1.append($s1);
      $w1.append(`<div class="mt-2 pk-other-box d-none"></div>`);
    }

    // 2) container dos filhos, ancorado no wrapper do s1
    const $selectsContainer = ensureContainer($w1, `pk-selects-container-${nsKey}`, true);

    const wrappers = [ $w1 ];
    const selects  = [ $s1 ];

    // 3) cria wrappers e selects extras
    for (let i = 1; i < allNames.length; i++) {
      const n = allNames[i];
      let $w = $selectsContainer.find(`.pk-select-wrap:has(select[name="${n}"])`);
      if (!$w.length) {
        $w = buildSelect(n, options).appendTo($selectsContainer);
      }
      const $sel = $w.find("select");
      wrappers.push($w);
      selects.push($sel);
    }

    // 4) “Outro” -> campo Especifique para todos
    wrappers.forEach(wireOtherFor);

    function getChosen() {
      const vals = [];
      selects.forEach($s => {
        const v = $s.val();
        if (v) vals.push(v);
      });
      return new Set(vals);
    }

    function sync() {
      const chosen = getChosen();

      // repovoa apenas selects 2..N (o primeiro fica estático)
      for (let i = 1; i < selects.length; i++) {
        const selfVal = selects[i].val();
        const chosenEx = new Set([...chosen].filter(v => v !== selfVal));
        fillSelect(selects[i], chosenEx, options);
      }

      // encadeamento visual: cada select aparece só se o anterior tiver valor
      for (let i = 1; i < wrappers.length; i++) {
        const hasPrev = !!selects[i - 1].val();
        wrappers[i].toggle(hasPrev);
        if (!hasPrev) {
          selects[i].val("");
          wrappers[i].find(".pk-other-box").addClass("d-none").empty();
        }
      }

      // atualiza “Especifique” em todos
      wrappers.forEach($w => $w.triggerHandler("change.pkOther"));
    }

    // 5) estado inicial
    fillSelect($s1, new Set(), options);
    for (let i = 1; i < selects.length; i++) {
      fillSelect(selects[i], new Set(), options);
    }
    for (let i = 1; i < wrappers.length; i++) {
      wrappers[i].hide();
    }

    // 6) binds
    $s1.off(`change.${nsKey} input.${nsKey}`).on(`change.${nsKey} input.${nsKey}`, sync);
    $selectsContainer
      .off(`change.${nsKey}`)
      .on(
        `change.${nsKey}`,
        allNames
          .slice(1)
          .map(n => `select[name="${n}"]`)
          .join(", "),
        sync
      );

    // 7) primeira sync
    sync();
  }

  // ==== Bind público do Card 15 ====
  function bind($root) {
    if (!$root || !$root.length) return;
    //if ($root.data("card15Bound")) return;
    //$root.data("card15Bound", true);

    // 15.3 — Como busca parceiros (5 selects)
    initMultiSelect($root, {
      nsKey: "howSeekPartners",
      firstName: "howSeekPartners1",
      extraNames: [
        "howSeekPartners2",
        "howSeekPartners3",
        "howSeekPartners4",
        "howSeekPartners5"
      ],
      options: HOW_PARTNER_OPTIONS
    });

    // 15.4 — Parcerias para impulsionar vendas (5 selects)
    initMultiSelect($root, {
      nsKey: "partnershipsBoostSales",
      firstName: "partnershipsBoostSales1",
      extraNames: [
        "partnershipsBoostSales2",
        "partnershipsBoostSales3",
        "partnershipsBoostSales4",
        "partnershipsBoostSales5"
      ],
      options: PARTNERSHIPS_BOOST_SALES_OPTIONS
    });

    // 15.4 — Vendas para impulsionar oportunidades (5 selects)
    initMultiSelect($root, {
      nsKey: "salesBoostOpportunities",
      firstName: "salesBoostOpportunities1",
      extraNames: [
        "salesBoostOpportunities2",
        "salesBoostOpportunities3",
        "salesBoostOpportunities4",
        "salesBoostOpportunities5"
      ],
      options: SALES_BOOST_OPPORTUNITIES_OPTIONS
    });

    // 15.5 — Receptividade para potenciais parceiros (3 selects)
    initMultiSelect($root, {
      nsKey: "receptivityPartners",
      firstName: "receptivityPartners1",
      extraNames: ["receptivityPartners2", "receptivityPartners3"],
      options: RECEPTIVITY_OPTIONS
    });
  }

  return { bind };
})();