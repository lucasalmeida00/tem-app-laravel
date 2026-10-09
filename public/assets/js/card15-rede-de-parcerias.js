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
    { v: "agencia_fomento", label: "Agência de fomento" },
    { v: "associacoes_profissionais", label: "Associações profissionais" },
    { v: "clientes_ex_clientes", label: "Clientes e ex-clientes" },
    { v: "comunidade_religiosa", label: "Comunidade religiosa" },
    {
      v: "comunidades_foruns_online",
      label: "Comunidades e fóruns online"
    },
    { v: "conhecidos_rede_profissional", label: "Conhecidos e rede profissional" },
    { v: "consultorias", label: "Consultorias" },
    {
      v: "coworking_espacos_compartilhados",
      label: "Coworking e espaços de trabalho compartilhado"
    },
    { v: "eventos_networking", label: "Eventos de networking" },
    { v: "eventos_setor", label: "Eventos do setor" },
    { v: "familia_amigos", label: "Família e amigos" },
    { v: "feiras_exposicoes", label: "Feiras e exposições" },
    {
      v: "fundos_investimento_capital_risco",
      label: "Fundos de investimento e capital de risco"
    },
    {
      v: "grupos_associacoes_comunitaria",
      label: "Grupos e associações comunitárias"
    },
    { v: "hackathons_competicoes", label: "Hackathons e competições" },
    { v: "incubadoras_aceleradoras", label: "Incubadoras e aceleradoras" },
    { v: "midias_sociais", label: "Mídias sociais (blog, YouTube, Vimeo etc.)" },
    { v: "novos_parceiros", label: "Novos parceiros" },
    { v: "programas_mentoria", label: "Programas de mentoria" },
    { v: "programas_televisao", label: "Programas de televisão" },
    { v: "redes_sociais", label: "Redes sociais (Facebook, LinkedIn, Instagram etc.)" },
    { v: "universidades_pesquisa", label: "Universidades e centros de pesquisa" },
    { v: "outro", label: "Outro" }
  ];

  const PARTNERSHIPS_BOOST_SALES_OPTIONS = [
    {
      v: "colaboracao_ongs_comunidade",
      label: "Colaboração com ONGs e organizações comunitárias"
    },
    {
      v: "colaboracao_organizacoes_empreendedorismo",
      label: "Colaboração com organizações de empreendedorismo"
    },
    {
      v: "descontos_beneficios_vizinhos",
      label: "Descontos ou benefícios para vizinhos e famílias do bairro"
    },
    {
      v: "parcerias_escolas_associacoes_igrejas",
      label: "Parcerias com escolas, associações de moradores, igrejas"
    },
    {
      v: "parcerias_influenciadores",
      label: "Parcerias com influenciadores"
    },
    {
      v: "parcerias_outros_empreendimentos",
      label: "Parcerias com outros empreendimentos para vendas conjuntas"
    },
    {
      v: "eventos_capacitacao_empoderamento",
      label: "Participação em eventos de capacitação e empoderamento comunitário"
    },
    {
      v: "promocoes_lancamento_parcerias",
      label:
        "Promoções de lançamento de produtos/serviços (parcerias com organizações ou outros negócios)"
    },
    {
      v: "venda_grupos_compras_coletivas",
      label: "Venda em grupos de compras coletivas e redes locais de consumo"
    },
    { v: "outro", label: "Outro" }
  ];

  const SALES_BOOST_OPPORTUNITIES_OPTIONS = [
    {
      v: "abordagens_diretas",
      label: "Abordagens diretas"
    },
    { v: "anuncios_publicidade", label: "Anúncios" },
    {
      v: "boca_a_boca_indicacao",
      label: "Boca a boca e indicação de clientes"
    },
    {
      v: "campanhas_marketing_digital",
      label: "Campanhas de marketing digital"
    },
    {
      v: "conteudo_digital",
      label: "Criação de conteúdo digital (blog, YouTube, podcasts)"
    },
    {
      v: "descontos_promocoes_sazonais",
      label: "Descontos e promoções sazonais"
    },
    {
      v: "amostras_gratis",
      label: "Distribuição de amostras grátis"
    },
    {
      v: "email_whatsapp_marketing",
      label: "E-mail marketing e WhatsApp marketing"
    },
    {
      v: "equipe_vendas_ativa",
      label: "Equipe de vendas ativa"
    },
    { v: "eventos_setor", label: "Eventos do setor" },
    { v: "feiras_exposicoes", label: "Feiras e exposições" },
    {
      v: "panfletagem_alto_movimento",
      label: "Panfletagem em locais de alto movimento"
    },
    {
      v: "conferencias_congressos",
      label: "Participação em conferências e congressos"
    },
    {
      v: "grupos_comunidades_online",
      label: "Participação em grupos e comunidades online"
    },
    {
      v: "hackathon_aceleracao",
      label: "Participação em hackathons e programas de aceleração"
    },
    {
      v: "licitacoes_concorrencias_publicas",
      label: "Participação em licitações e concorrências públicas"
    },
    {
      v: "programa_indicacao",
      label: "Programa de indicação (indique e ganhe)"
    },
    {
      v: "promocoes_clientes_atuais",
      label: "Promoções junto aos clientes atuais"
    },
    {
      v: "promocoes_personalizadas",
      label: "Promoções personalizadas (baseadas em dados de clientes)"
    },
    {
      v: "publicidade_redes_sociais",
      label: "Publicidade em redes sociais"
    },
    {
      v: "publicidade_revistas_jornais_radio",
      label:
        "Publicidade em revistas, jornais e rádio (incluindo rádios comunitárias)"
    },
    {
      v: "testes_gratuitos_novos_clientes",
      label: "Testes gratuitos para novos clientes"
    },
    {
      v: "webinares_lives",
      label: "Webinares e lives"
    },
    { v: "outro", label: "Outro" }
  ];

  const RECEPTIVITY_OPTIONS = [
    {
      v: "aceita_colaboracoes",
      label: "Aceita colaborações de potenciais parceiros"
    },
    {
      v: "aceita_sugestoes_limitacoes",
      label:
        "Aceita sugestões e parcerias, mas com limitações ou em áreas específicas do empreendimento"
    },
    {
      v: "avalia_novos_desenvolvimentos",
      label: "Avalia e considera novos desenvolvimentos"
    },
    {
      v: "avalia_interesse_planejamento_metas",
      label:
        "Avalia o interesse de novos parceiros com base na aderência ao planejamento e metas estabelecidas"
    },
    {
      v: "mais_resistente_foco",
      label: "Mais resistente por conta do foco"
    },
    {
      v: "prefere_atuar_sozinho_socios",
      label: "Prefere atuar sozinho ou somente com os sócios"
    },
    {
      v: "prefere_manter_foco_atuais",
      label: "Prefere manter o foco nas estratégias práticas atuais"
    },
    {
      v: "reune_incorpora_informacoes",
      label: "Reúne e incorpora novas informações"
    },
    { v: "outro", label: "Outro" }
  ];

  // ==== Builder genérico de select ====
  function buildSelect(name, options) {
    return $(`
      <div class="mb-1 pk-select-wrap card-select-row">
        <div class="row g-2 align-items-center">
          <div class="col card-select-col">
            <select class="form-select" name="${name}">
              <option value="">-- Selecione --</option>
              ${options.map(o => `<option value="${o.v}">${o.label}</option>`).join("")}
            </select>
          </div>
          <div class="col extra-${name}-other-inline d-none">
            <input type="text" class="form-control" name="${name}__other" placeholder="Especifique" style="width: 100%;">
          </div>
        </div>
      </div>
    `);
  }

  // Nenhuma opção pode ser repetida (incluindo "outro")
  function fillSelect($sel, chosenSet, options) {
    const keep = $sel.val();
    $sel.html(`<option value="">-- Selecione --</option>`);
    options.forEach(o => {
      // se já foi escolhido em outro select, só deixa se for o valor atual
      if (!chosenSet.has(o.v) || o.v === keep) {
        $sel.append(`<option value="${o.v}">${o.label}</option>`);
      }
    });
    if (keep && (!chosenSet.has(keep) || keep === $sel.val())) {
      $sel.val(keep);
    }
  }

  function wireOtherFor($wrap) {
    const $sel = $wrap.find("select");
    const name = $sel.attr("name");
    const $box = $wrap.find(`.extra-${name}-other-inline`);
    const $colSelect = $sel.closest(".card-select-col");
    function renderOther() {
      if ($sel.val() === "outro") {
        $wrap.addClass("has-other");
        $colSelect.removeClass("col").addClass("col-auto").css("max-width", "350px");
        $box.removeClass("d-none");
      } else {
        $wrap.removeClass("has-other");
        $colSelect.removeClass("col-auto").addClass("col").css("max-width", "");
        $box.addClass("d-none");
        // Limpa o valor do input quando "outro" é desmarcado
        $box.find("input").val("");
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
      $w1 = $(`<div class="mb-1 pk-select-wrap card-select-row"></div>`);
      const $rowDiv = $(`<div class="row g-2 align-items-center"></div>`);
      
      // Coluna do select
      const $colSelect = $(`<div class="col card-select-col"></div>`);
      $s1.after($w1);
      $s1.appendTo($colSelect);
      
      // Botão X para limpar
      // Coluna do input "outro"
      const $colOther = $(`<div class="col extra-${firstName}-other-inline d-none"></div>`);
      $colOther.html(`<input type="text" class="form-control" name="${firstName}__other" placeholder="Especifique" style="width: 100%;">`);
      
      $rowDiv.append($colSelect, $colOther);
      $w1.append($rowDiv);
    }
    $w1.parent().removeClass("mb-2").addClass("mb-1");

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

    // 4) "Outro" -> campo Especifique para todos
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
          const name = selects[i].attr("name");
          wrappers[i].find(`.extra-${name}-other-inline`).addClass("d-none");
        }
      }

      // atualiza "Especifique" e estado has-other/col (disparar no select para o handler delegado rodar)
      selects.forEach($s => $s.trigger("change.pkOther"));
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
