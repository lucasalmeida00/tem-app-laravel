window.Card10 = (function () {
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

  // ==== Nomes / Opções ====
  const N = {
    // 10.1 (fidelização)
    f1: "fidelRel1",
    f2: "fidelRel2",
    f3: "fidelRel3",
    // 10.2 (captação)
    c1: "captaRel1",
    c2: "captaRel2",
    c3: "captaRel3"
  };

  const FIDEL_OPTS = [
    { v: "atendimento_personalizado", label: "Atendimento personalizado" },
    { v: "programas_fidelidade", label: "programas de fidelidade" },
    { v: "suporte_24_7", label: "Suporte 24/7" },
    { v: "boca_a_boca", label: "Incentivando o boca a boca e indicações" },
    { v: "comunidades_grupos", label: "Comunidades ou grupos online" },
    { v: "automacao_autoatendimento", label: "Automação e autoatendimento" },
    { v: "outro", label: "Outro" }
  ];

  const CAPTA_OPTS = [
    { v: "publicidade_marketing_digital", label: "Através de publicidade e marketing digital" },
    { v: "parcerias_indicacoes", label: "Parcerias e indicações" },
    { v: "promocoes_descontos", label: "Oferecendo promoções e descontos" },
    { v: "por_meio_atendimento", label: "Por meio de atendimento" },
    { v: "redes_sociais_comunicacao", label: "Através de redes sociais e comunicação digital" },
    { v: "promocoes_novos_clientes", label: "Promoções e descontos para novos clientes" },
    { v: "parcerias_locais", label: "Parcerias com outros empreendimentos locais" },
    { v: "outros", label: "Outros" }
  ];

  // ==== Builders ====
  function buildSelect(name, options) {
    return $(`
      <div class="mb-2 rc-select-wrap">
        <select class="form-select" name="${name}">
          <option value="" disabled selected hidden>Selecione uma opção</option>
          ${options.map(o => `<option value="${o.v}">${o.label}</option>`).join("")}
        </select>
        <div class="mt-2 rc-other-box d-none"></div>
      </div>
    `);
  }

  // Mantém “outro/outros” sempre disponível
  function fillSelect($sel, chosenSet, options, otherValues /* array de strings */) {
    const keep = $sel.val();
    $sel.html(`<option value="" disabled selected hidden>Selecione uma opção</option>`);
    options.forEach(o => {
      if (!chosenSet.has(o.v) || otherValues.includes(o.v)) {
        $sel.append(`<option value="${o.v}">${o.label}</option>`);
      }
    });
    if (keep && (!chosenSet.has(keep) || otherValues.includes(keep))) {
      $sel.val(keep);
    }
  }

  function wireOtherFor($wrap, otherValues /* ["outro"] ou ["outros"] */) {
    const $sel = $wrap.find("select");
    const $box = $wrap.find(".rc-other-box");
    function renderOther() {
      const val = $sel.val();
      if (otherValues.includes(val)) {
        $box.removeClass("d-none").html(
          `<input type="text" class="form-control" name="${$sel.attr("name")}__other" placeholder="Especifique" />`
        );
      } else {
        $box.addClass("d-none").empty();
      }
    }
    $wrap.off("change.rcOther").on("change.rcOther", "select", renderOther);
    renderOther();
  }

  // ==== Inicialização genérica para uma seção de 3 selects ====
  function initTripleSelects($root, names, options, otherValues) {
    const $s1 = $root.find(`select[name="${names[0]}"]`);
    if (!$s1.length) return;

    // garante wrapper consistente para s1
    let $w1 = $s1.closest(".rc-select-wrap");
    if (!$w1.length) {
      $w1 = $(`<div class="mb-2 rc-select-wrap"></div>`);
      $s1.after($w1);
      $w1.append($s1);
      $w1.append(`<div class="mt-2 rc-other-box d-none"></div>`);
    }

    const $wrap1 = wrapperFor($s1);
    const $selects = ensureContainer($wrap1, `rc-selects-container-${names[0]}`, true);

    // cria s2/s3
    let $w2 = $selects.find(`.rc-select-wrap:has(select[name="${names[1]}"])`);
    let $w3 = $selects.find(`.rc-select-wrap:has(select[name="${names[2]}"])`);
    if (!$w2.length) $w2 = buildSelect(names[1], options).appendTo($selects);
    if (!$w3.length) $w3 = buildSelect(names[2], options).appendTo($selects);

    const $s2 = $w2.find("select");
    const $s3 = $w3.find("select");

    wireOtherFor($w1, otherValues);
    wireOtherFor($w2, otherValues);
    wireOtherFor($w3, otherValues);

    function getChosen() {
      const vals = [];
      const v1 = $s1.val(); if (v1) vals.push(v1);
      const v2 = $s2.val(); if (v2) vals.push(v2);
      const v3 = $s3.val(); if (v3) vals.push(v3);
      return new Set(vals);
    }

    function sync() {
      const chosen = getChosen();

      fillSelect($s2, new Set([...chosen].filter(v => v !== $s2.val())), options, otherValues);
      fillSelect($s3, new Set([...chosen].filter(v => v !== $s3.val())), options, otherValues);

      // encadeamento
      $w2.toggle(!!$s1.val());
      if (!$s1.val()) $s2.val("");

      $w3.toggle(!!$s2.val());
      if (!$s2.val()) $s3.val("");

      // atualiza “Especifique”
      $w1.triggerHandler("change.rcOther");
      $w2.triggerHandler("change.rcOther");
      $w3.triggerHandler("change.rcOther");
    }

    // estado inicial
    fillSelect($s1, new Set(), options, otherValues);
    fillSelect($s2, new Set(), options, otherValues);
    fillSelect($s3, new Set(), options, otherValues);
    $w2.hide();
    $w3.hide();

    // binds
    $s1.off(`change.rc_${names[0]}`).on(`change.rc_${names[0]}`, sync);
    $selects
      .off(`change.rc_${names[0]}_child`)
      .on(`change.rc_${names[0]}_child`, "select", sync);

    // primeira sync
    sync();
  }

  // ==== Bind público do Card 10 ====
  function bind($root) {
    if (!$root || !$root.length) return;
    //if ($root.data("card10Bound")) return;
    //$root.data("card10Bound", true);

    // 10.1 — “Outro” persistente
    initTripleSelects($root, [N.f1, N.f2, N.f3], FIDEL_OPTS, ["outro"]);

    // 10.2 — “Outros” persistente
    initTripleSelects($root, [N.c1, N.c2, N.c3], CAPTA_OPTS, ["outros"]);
  }

  return { bind };
})();