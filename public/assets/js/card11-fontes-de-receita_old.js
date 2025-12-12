window.Card11 = (function () {
  // ==== Utils (padrão dos cards) ====
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

  // ==== Nomes ====
  const N = {
    // 11.1
    r1: "revSource1",
    r2: "revSource2",
    r3: "revSource3",
    // 11.2
    m1: "monetModel1",
    m2: "monetModel2",
    m3: "monetModel3"
  };

  // ==== Opções ====
  const REV_OPTS = [
    { v: "venda_direta_produtos", label: "Venda direta de produtos" },
    { v: "prestacao_servicos", label: "Prestação de serviços" },
    { v: "assinatura_adesao", label: "Modelos de assinatura ou adesão" },
    { v: "taxas_transacao_comissoes", label: "Taxas de transação ou comissões" },
    { v: "publicidade", label: "Publicidade" },
    { v: "licensiamento", label: "Licensiamento" },
    { v: "patrocinio_direto", label: "Patrocínio direito" },
    { v: "patrocinio_lei_incentivo", label: "Patrocínio via lei de incentivo" },
    { v: "doacao", label: "Doação" },
    { v: "outro", label: "Outro" }
  ];

  const MONET_OPTS = [
    { v: "venda_unica", label: "Venda única" },
    { v: "assinatura_recorrente", label: "Assinatura recorrente" },
    { v: "freemium", label: "Modelo Freemium (gratuito com opções pagas)" },
    { v: "taxa_transacao_uso", label: "Taxa pro transação de uso" },
    { v: "outro", label: "Outro" }
  ];

  // ==== Builders ====
  function buildSelect(name, options) {
    return $(`
      <div class="mb-2 fr-select-wrap">
        <select class="form-select" name="${name}">
          <option value="" disabled selected hidden>Selecione uma opção</option>
          ${options.map(o => `<option value="${o.v}">${o.label}</option>`).join("")}
        </select>
        <div class="mt-2 fr-other-box d-none"></div>
      </div>
    `);
  }

  // Mantém “outro” sempre disponível
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
    const $box = $wrap.find(".fr-other-box");
    function render() {
      if ($sel.val() === "outro") {
        $box.removeClass("d-none").html(
          `<input type="text" class="form-control" name="${$sel.attr("name")}__other" placeholder="Especifique" />`
        );
      } else {
        $box.addClass("d-none").empty();
      }
    }
    $wrap.off("change.frOther").on("change.frOther", "select", render);
    render(); // estado inicial
  }

  // ==== Inicializador genérico (3 selects encadeados) ====
  function initTriple($root, names, options) {
    const $s1 = $root.find(`select[name="${names[0]}"]`);
    if (!$s1.length) return;

    // garante wrapper para s1
    let $w1 = $s1.closest(".fr-select-wrap");
    if (!$w1.length) {
      $w1 = $(`<div class="mb-2 fr-select-wrap"></div>`);
      $s1.after($w1);
      $w1.append($s1);
      $w1.append(`<div class="mt-2 fr-other-box d-none"></div>`);
    }

    const $wrap1 = wrapperFor($s1);
    const $selects = ensureContainer($wrap1, `fr-selects-container-${names[0]}`, true);

    // cria s2/s3
    let $w2 = $selects.find(`.fr-select-wrap:has(select[name="${names[1]}"])`);
    let $w3 = $selects.find(`.fr-select-wrap:has(select[name="${names[2]}"])`);
    if (!$w2.length) $w2 = buildSelect(names[1], options).appendTo($selects);
    if (!$w3.length) $w3 = buildSelect(names[2], options).appendTo($selects);

    const $s2 = $w2.find("select");
    const $s3 = $w3.find("select");

    // “Outro” -> “Especifique”
    wireOtherFor($w1);
    wireOtherFor($w2);
    wireOtherFor($w3);

    function getChosen() {
      const vals = [];
      const v1 = $s1.val(); if (v1) vals.push(v1);
      const v2 = $s2.val(); if (v2) vals.push(v2);
      const v3 = $s3.val(); if (v3) vals.push(v3);
      return new Set(vals);
    }

    function sync() {
      const chosen = getChosen();

      // s2/s3 excluem já escolhidos (mantendo “outro”)
      fillSelect($s2, new Set([...chosen].filter(v => v !== $s2.val())), options);
      fillSelect($s3, new Set([...chosen].filter(v => v !== $s3.val())), options);

      // encadeamento
      $w2.toggle(!!$s1.val());
      if (!$s1.val()) $s2.val("");

      $w3.toggle(!!$s2.val());
      if (!$s2.val()) $s3.val("");

      // atualiza “Especifique”
      $w1.triggerHandler("change.frOther");
      $w2.triggerHandler("change.frOther");
      $w3.triggerHandler("change.frOther");
    }

    // estado inicial
    fillSelect($s1, new Set(), options);
    fillSelect($s2, new Set(), options);
    fillSelect($s3, new Set(), options);
    $w2.hide();
    $w3.hide();

    // binds
    $s1.off(`change.fr_${names[0]}`).on(`change.fr_${names[0]}`, sync);
    $selects.off(`change.fr_${names[0]}_child`).on(`change.fr_${names[0]}_child`, "select", sync);

    // primeira sync
    sync();
  }

  // ==== Bind público do Card 11 ====
  function bind($root) {
    if (!$root || !$root.length) return;
    //if ($root.data("card11Bound")) return;
    //$root.data("card11Bound", true);

    // 11.1 — Fontes de receita (Outro persistente)
    initTriple($root, [N.r1, N.r2, N.r3], REV_OPTS);

    // 11.2 — Modelos de monetização (Outro persistente)
    initTriple($root, [N.m1, N.m2, N.m3], MONET_OPTS);
  }

  return { bind };
})();