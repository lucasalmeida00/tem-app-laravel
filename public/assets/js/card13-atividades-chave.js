window.Card13 = (function () {
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
    a1: "actKey1",
    a2: "actKey2",
    a3: "actKey3"
  };

  // ==== Opções (espelho do schema) ====
  const AK_OPTIONS = [
    { v: "producao_produtos", label: "Produção de produtos" },
    { v: "prestacao_servicos", label: "Prestação de Serviços" },
    { v: "desenvolvimento_novos_produtos_servicos", label: "Desenvolvimento de novos produtos ou serviços" },
    { v: "marketing_vendas", label: "Marketing e Vendas" },
    { v: "logistica_distribuicao", label: "Logistica e distribuição" },
    { v: "producao_fornecimento_produtos_essenciais", label: "Produção ou fornecimento de produtos essenciais" },
    { v: "servicos_educacao_saude", label: "Prestação de serviços como educação ou saúde" },
    { v: "capacitacao_treinamento_moradores", label: "Capacitação ou treinamento de moradores de favela/comunidade" },
    { v: "engajamento_comunitario", label: "Engajamento comunitário" },
    { v: "acoes_vendas_locais", label: "Ações de vendas locais" },
    { v: "eventos_parcerias_locais", label: "Eventos e parcerias locais" },
    { v: "outro", label: "Outro" }
  ];

  // ==== Builders ====
  function buildSelect(name) {
    return $(`
      <div class="mb-2 ak-select-wrap">
        <select class="form-select" name="${name}">
          <option value="" disabled selected hidden>Selecione uma opção</option>
          ${AK_OPTIONS.map(o => `<option value="${o.v}">${o.label}</option>`).join("")}
        </select>
        <div class="mt-2 ak-other-box d-none"></div>
      </div>
    `);
  }

  // “outro” permanece sempre disponível
  function fillSelect($sel, chosenSet) {
    const keep = $sel.val();
    $sel.html(`<option value="" disabled selected hidden>Selecione uma opção</option>`);
    AK_OPTIONS.forEach(o => {
      if (!chosenSet.has(o.v) || o.v === "outro") {
        $sel.append(`<option value="${o.v}">${o.label}</option>`);
      }
    });
    if (keep && (!chosenSet.has(keep) || keep === "outro")) $sel.val(keep);
  }

  function wireOtherFor($wrap) {
    const $sel = $wrap.find("select");
    const $box = $wrap.find(".ak-other-box");
    function renderOther() {
      if ($sel.val() === "outro") {
        $box.removeClass("d-none").html(
          `<input type="text" class="form-control" name="${$sel.attr("name")}__other" placeholder="Especifique" />`
        );
      } else {
        $box.addClass("d-none").empty();
      }
    }
    $wrap.off("change.akOther").on("change.akOther", "select", renderOther);
    renderOther();
  }

  // ==== Inicialização (3 selects encadeados) ====
  function initKeyActivities($root) {
    const $s1 = $root.find(`select[name="${N.a1}"]`);
    if (!$s1.length) return;

    // garante wrapper para s1 (sem duplicar o select)
    let $w1 = $s1.closest(".ak-select-wrap");
    if (!$w1.length) {
      $w1 = $(`<div class="mb-2 ak-select-wrap"></div>`);
      $s1.after($w1);
      $w1.append($s1);
      $w1.append(`<div class="mt-2 ak-other-box d-none"></div>`);
    }

    const $wrap1 = wrapperFor($s1);
    const $selects = ensureContainer($wrap1, "ak-selects-container", true);

    // cria s2/s3
    let $w2 = $selects.find(`.ak-select-wrap:has(select[name="${N.a2}"])`);
    let $w3 = $selects.find(`.ak-select-wrap:has(select[name="${N.a3}"])`);
    if (!$w2.length) $w2 = buildSelect(N.a2).appendTo($selects);
    if (!$w3.length) $w3 = buildSelect(N.a3).appendTo($selects);

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
      $w1.triggerHandler("change.akOther");
      $w2.triggerHandler("change.akOther");
      $w3.triggerHandler("change.akOther");
    }

    // estado inicial
    fillSelect($s1, new Set());
    fillSelect($s2, new Set());
    fillSelect($s3, new Set());
    $w2.hide();
    $w3.hide();

    // binds
    $s1.off("change.ak_s1").on("change.ak_s1", sync);
    $selects.off("change.ak").on("change.ak", "select[name^='actKey']", sync);

    // primeira sincronização
    sync();
  }

  // ==== Bind público do Card 13 ====
  function bind($root) {
    if (!$root || !$root.length) return;
    //if ($root.data("card13Bound")) return;
    //$root.data("card13Bound", true);

    initKeyActivities($root); // 13.1
  }

  return { bind };
})();