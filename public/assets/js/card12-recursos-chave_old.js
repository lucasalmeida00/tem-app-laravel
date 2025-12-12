window.Card12 = (function () {
  // ==== Utils (padrão dos outros cards) ====
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
    r1: "keyRes1",
    r2: "keyRes2",
    r3: "keyRes3"
  };

  // ==== Opções (espelho do schema) ====
  const RC_OPTIONS = [
    { v: "capital_financeiro", label: "Capital financeiro (próprio ou de investidores)" },
    { v: "doadores", label: "Doadores" },
    { v: "patrocinadores_diretos", label: "Patrocinadores diretos" },
    { v: "patrocinadores_lei_incentivo", label: "Patrocinadores via lei de incentivo" },
    { v: "financiamento_coletivo", label: "Financiamento coletivo" },
    { v: "pessoas_assalariadas", label: "Pessoas assalariadas (equipe, expertise)" },
    { v: "voluntarios", label: "Voluntários" },
    { v: "conhecimento_comunidade", label: "Conhecimento sobre a comunidade e seus desafios" },
    { v: "parcerias_comercios_organizacoes", label: "Parcerias com comércios ou organizações locais" },
    { v: "mao_de_obra_local", label: "Mão de obra local (moradores da favela/comunidade)" },
    { v: "tecnologia", label: "Tecnologia (aplicativos, sites)" },
    { v: "infraestrutura", label: "Infraestrutura (prédio, lojas, espaço físico, equipamentos)" },
    { v: "pessoas_equipe", label: "Pessoas (Equipe, expertise)" },
    { v: "propriedade_intelectual", label: "Propriedade intelectual (patentes, marcas)" },
    { v: "outro", label: "Outro" },
  ];

  // ==== Builders ====
  function buildSelect(name) {
    return $(`
      <div class="mb-2 rk-select-wrap">
        <select class="form-select" name="${name}">
          <option value="" disabled selected hidden>Selecione uma opção</option>
          ${RC_OPTIONS.map(o => `<option value="${o.v}">${o.label}</option>`).join("")}
        </select>
        <div class="mt-2 rk-other-box d-none"></div>
      </div>
    `);
  }

  // “outro” NUNCA sai das listas
  function fillSelect($sel, chosenSet) {
    const keep = $sel.val();
    $sel.html(`<option value="" disabled selected hidden>Selecione uma opção</option>`);
    RC_OPTIONS.forEach(o => {
      if (!chosenSet.has(o.v) || o.v === "outro") {
        $sel.append(`<option value="${o.v}">${o.label}</option>`);
      }
    });
    if (keep && (!chosenSet.has(keep) || keep === "outro")) $sel.val(keep);
  }

  function wireOtherFor($wrap) {
    const $sel = $wrap.find("select");
    const $box = $wrap.find(".rk-other-box");
    function renderOther() {
      if ($sel.val() === "outro") {
        $box.removeClass("d-none").html(
          `<input type="text" class="form-control" name="${$sel.attr("name")}__other" placeholder="Especifique" />`
        );
      } else {
        $box.addClass("d-none").empty();
      }
    }
    $wrap.off("change.rkOther").on("change.rkOther", "select", renderOther);
    renderOther();
  }

  // ==== Inicialização (3 selects encadeados) ====
  function initKeyResources($root) {
    const $s1 = $root.find(`select[name="${N.r1}"]`);
    if (!$s1.length) return;

    // garante wrapper para s1
    let $w1 = $s1.closest(".rk-select-wrap");
    if (!$w1.length) {
      $w1 = $(`<div class="mb-2 rk-select-wrap"></div>`);
      $s1.after($w1);
      $w1.append($s1);
      $w1.append(`<div class="mt-2 rk-other-box d-none"></div>`);
    }

    const $wrap1 = wrapperFor($s1);
    const $selects = ensureContainer($wrap1, "rk-selects-container", true);

    // cria s2/s3
    let $w2 = $selects.find(`.rk-select-wrap:has(select[name="${N.r2}"])`);
    let $w3 = $selects.find(`.rk-select-wrap:has(select[name="${N.r3}"])`);
    if (!$w2.length) $w2 = buildSelect(N.r2).appendTo($selects);
    if (!$w3.length) $w3 = buildSelect(N.r3).appendTo($selects);

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
      fillSelect($s2, new Set([...chosen].filter(v => v !== $s2.val())));
      fillSelect($s3, new Set([...chosen].filter(v => v !== $s3.val())));

      // encadeamento visual
      $w2.toggle(!!$s1.val());
      if (!$s1.val()) $s2.val("");

      $w3.toggle(!!$s2.val());
      if (!$s2.val()) $s3.val("");

      // atualiza “Especifique”
      $w1.triggerHandler("change.rkOther");
      $w2.triggerHandler("change.rkOther");
      $w3.triggerHandler("change.rkOther");
    }

    // estado inicial
    fillSelect($s1, new Set());
    fillSelect($s2, new Set());
    fillSelect($s3, new Set());
    $w2.hide();
    $w3.hide();

    // binds
    $s1.off("change.rk_s1").on("change.rk_s1", sync);
    $selects.off("change.rk").on("change.rk", "select[name^='keyRes']", sync);

    // primeira sincronização
    sync();
  }

  // ==== Bind público do Card 12 ====
  function bind($root) {
    if (!$root || !$root.length) return;
    //if ($root.data("card12Bound")) return;
    //$root.data("card12Bound", true);

    initKeyResources($root); // 12.1
  }

  return { bind };
})();