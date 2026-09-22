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
    { v: "acoes_vendas_locais", label: "Ações de vendas locais" },
    { v: "capacitacao_treinamento_moradores", label: "Capacitação ou treinamento de moradores de favela/comunidade" },
    { v: "desenvolvimento_novos_produtos_servicos", label: "Desenvolvimento de novos produtos ou serviços" },
    { v: "engajamento_comunitario", label: "Engajamento comunitário" },
    { v: "eventos_parcerias_locais", label: "Eventos e parcerias locais" },
    { v: "logistica_distribuicao", label: "Logistica e distribuição" },
    { v: "marketing_vendas", label: "Marketing e Vendas" },
    { v: "prestacao_servicos", label: "Prestação de Serviços" },
    { v: "servicos_educacao_saude", label: "Prestação de serviços como educação ou saúde" },
    { v: "producao_produtos", label: "Produção de produtos" },
    { v: "producao_fornecimento_produtos_essenciais", label: "Produção ou fornecimento de produtos essenciais" },
    { v: "outro", label: "Outro" }
  ];

  // ==== Builders ====
  function buildSelect(name) {
    return $(`
      <div class="mb-1 ak-select-wrap card-select-row">
        <div class="row g-2 align-items-center">
          <div class="col card-select-col">
            <select class="form-select" name="${name}">
              <option value="">-- Selecione --</option>
              ${AK_OPTIONS.map(o => `<option value="${o.v}">${o.label}</option>`).join("")}
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
  function fillSelect($sel, chosenSet) {
    const keep = $sel.val();
    $sel.html(`<option value="">-- Selecione --</option>`);
    AK_OPTIONS.forEach(o => {
      // se já foi escolhido em outro select, só deixa se for o valor atual
      if (!chosenSet.has(o.v) || o.v === keep) {
        $sel.append(`<option value="${o.v}">${o.label}</option>`);
      }
    });
    if (keep && (!chosenSet.has(keep) || keep === $sel.val())) $sel.val(keep);
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
      $w1 = $(`<div class="mb-1 ak-select-wrap card-select-row"></div>`);
      const $rowDiv = $(`<div class="row g-2 align-items-center"></div>`);
      
      // Coluna do select
      const $colSelect = $(`<div class="col card-select-col"></div>`);
      $s1.after($w1);
      $s1.appendTo($colSelect);
      
      // Botão X para limpar
      // Coluna do input "outro"
      const $colOther = $(`<div class="col extra-${N.a1}-other-inline d-none"></div>`);
      $colOther.html(`<input type="text" class="form-control" name="${N.a1}__other" placeholder="Especifique" style="width: 100%;">`);
      
      $rowDiv.append($colSelect, $colOther);
      $w1.append($rowDiv);
    }

    // Container para s2/s3, logo abaixo da primeira row (não dentro dela)
    const $selects = ensureContainer($w1, "ak-selects-container", true);
    $w1.parent().removeClass("mb-2").addClass("mb-1");

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
      $s1.trigger("change.akOther");
      $s2.trigger("change.akOther");
      $s3.trigger("change.akOther");
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