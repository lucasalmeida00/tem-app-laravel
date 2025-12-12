window.Card16 = (function () {
  // ==== Utils (mesmo padrão dos outros cards) ====
  function wrapperFor($el) {
    const $p = $el.closest(".form-field, .mb-2, .mb-3, .col, .col-12, .row");
    return $p.length ? $p : $el.parent();
  }

  function ensureContainer($wrap, cls, asSiblingAfter = false) {
    if (!$wrap || !$wrap.length) return $();
    let $c;
    if (asSiblingAfter) {
      $c = $wrap.nextAll("." + cls).first();
      if (!$c.length) {
        $c = $(`<div class="${cls}"></div>`).insertAfter($wrap);
      }
    } else {
      $c = $wrap.find("." + cls).first();
      if (!$c.length) {
        $c = $(`<div class="${cls}"></div>`).appendTo($wrap);
      }
    }
    return $c;
  }

  // ==== Nomes dos campos ====
  const N = {
    c1: "costChallenging1",
    c2: "costChallenging2",
    c3: "costChallenging3"
  };

  // ==== Opções (espelho do schema) ====
  const CS_OPTIONS = [
    { v: "producao", label: "Produção" },
    { v: "marketing_publicidade", label: "Marketing e Publicidade" },
    { v: "tecnologia_infraestrutura", label: "Tecnologia e Infraestrutura" },
    { v: "salarios_beneficios", label: "Salários e Benefícios" },
    { v: "manutencao_precos_acessiveis", label: "Manutenção de preços acessíveis" },
    { v: "investimento_logistica", label: "Investimento em Logística (entrega, transporte)" },
    { v: "contratacao_retencao_colaboradores", label: "Contratação e retenção de colaboradores qualificados" },
    { v: "custos_regulamentacoes_burocracia", label: "Custos com regulamentações e burocracia" },
    { v: "outro", label: "Outro" }
  ];

  // ==== Builders ====
  function buildSelect(name) {
    return $(`
      <div class="mb-2 cs-select-wrap">
        <select class="form-select" name="${name}">
          <option value="" disabled selected hidden>Selecione uma opção</option>
          ${CS_OPTIONS.map(o => `<option value="${o.v}">${o.label}</option>`).join("")}
        </select>
        <div class="mt-2 cs-other-box d-none"></div>
      </div>
    `);
  }

  // “outro” permanece sempre disponível
  function fillSelect($sel, chosenSet) {
    const keep = $sel.val();
    $sel.html(`<option value="" disabled selected hidden>Selecione uma opção</option>`);
    CS_OPTIONS.forEach(o => {
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
    const $box = $wrap.find(".cs-other-box");

    function renderOther() {
      if ($sel.val() === "outro") {
        $box
          .removeClass("d-none")
          .html(
            `<input type="text" class="form-control" name="${$sel.attr("name")}__other" placeholder="Especifique" />`
          );
      } else {
        $box.addClass("d-none").empty();
      }
    }

    $wrap.off("change.csOther").on("change.csOther", "select", renderOther);
    renderOther();
  }

  // ==== Inicialização (3 selects encadeados) ====
  function initCostStructure($root) {
    const $s1 = $root.find(`select[name="${N.c1}"]`);
    if (!$s1.length) return;

    // garante wrapper para s1 (sem duplicar o select)
    let $w1 = $s1.closest(".cs-select-wrap");
    if (!$w1.length) {
      $w1 = $(`<div class="mb-2 cs-select-wrap"></div>`);
      $s1.after($w1);
      $w1.append($s1);
      $w1.append(`<div class="mt-2 cs-other-box d-none"></div>`);
    }

    const $wrap1 = wrapperFor($s1);
    const $selects = ensureContainer($wrap1, "cs-selects-container", true);

    // cria s2/s3
    let $w2 = $selects.find(`.cs-select-wrap:has(select[name="${N.c2}"])`);
    let $w3 = $selects.find(`.cs-select-wrap:has(select[name="${N.c3}"])`);

    if (!$w2.length) $w2 = buildSelect(N.c2).appendTo($selects);
    if (!$w3.length) $w3 = buildSelect(N.c3).appendTo($selects);

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

      // s2/s3 excluem já escolhidos (mantendo “outro” sempre disponível)
      fillSelect($s2, new Set([...chosen].filter(v => v !== $s2.val())));
      fillSelect($s3, new Set([...chosen].filter(v => v !== $s3.val())));

      // encadeamento visual (mostra s2 só após s1, s3 só após s2)
      $w2.toggle(!!$s1.val());
      if (!$s1.val()) $s2.val("");

      $w3.toggle(!!$s2.val());
      if (!$s2.val()) $s3.val("");

      // atualiza campos "Especifique" de Outro
      $w1.triggerHandler("change.csOther");
      $w2.triggerHandler("change.csOther");
      $w3.triggerHandler("change.csOther");
    }

    // estado inicial
    fillSelect($s1, new Set());
    fillSelect($s2, new Set());
    fillSelect($s3, new Set());
    $w2.hide();
    $w3.hide();

    // binds
    $s1.off("change.cs_s1").on("change.cs_s1", sync);
    $selects.off("change.cs").on("change.cs", "select[name^='costChallenging']", sync);

    // primeira sincronização
    sync();
  }

  // ==== Bind público do Card 16 ====
  function bind($root) {
    if (!$root || !$root.length) return;
    //if ($root.data("card16Bound")) return;
    //$root.data("card16Bound", true);

    initCostStructure($root); // 16.1
  }

  return { bind };
})();