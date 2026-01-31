// assets/js/card7-proposta-de-valor.js
window.Card7 = (function () {
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

  // ==== Nomes/constantes 7.2 ====
  const N = {
    d1: "valueDiff1",
    d2: "valueDiff2",
    d3: "valueDiff3"
  };

  const DIFF_OPTIONS = [
    { v: "qualidade_superior", label: "Qualidade Superior" },
    { v: "facilidade_uso", label: "Facilidade de Uso" },
    { v: "eficiencia_rapidez", label: "Maior eficiência ou rapidez" },
    { v: "nicho_especifico", label: "Atende a um nicho específico" },
    { v: "preco_acessivel", label: "Preço mais acessível" },
    { v: "facilidade_acesso", label: "Facilidade de acesso (presença local, sem necessidade de deslocamento)" },
    { v: "nao_ofertado_favela", label: "produto não ofertado na favela" },
    { v: "melhor_qualidade", label: "Produto/Serviço de melhor qualidade" },
    { v: "solucao_mais_rapida", label: "Solução mais rápida ou eficiente" },
    { v: "outro", label: "Outro" }
  ];

  // ==== Builders ====
  function buildSelect(name) {
    return $(`
      <div class="mb-1 vp-select-wrap card-select-row">
        <div class="row g-2 align-items-center">
          <div class="col card-select-col">
            <select class="form-select" name="${name}">
              <option value="" disabled selected hidden>Selecione uma opção</option>
              ${DIFF_OPTIONS.map(o => `<option value="${o.v}">${o.label}</option>`).join("")}
            </select>
          </div>
          <div class="col extra-${name}-other-inline d-none">
            <input type="text" class="form-control" name="${name}__other" placeholder="Especifique" style="max-width: 700px; width: 100%;">
          </div>
        </div>
      </div>
    `);
  }

  // “Outro” NUNCA sai da lista (como no Card 6)
  // Nenhuma opção pode ser repetida (incluindo "outro")
  function fillSelect($sel, chosenSet) {
    const keep = $sel.val();
    $sel.html(`<option value="" disabled selected hidden>Selecione uma opção</option>`);
    DIFF_OPTIONS.forEach(o => {
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
    $wrap.off("change.vpOther").on("change.vpOther", "select", renderOther);
    renderOther(); // estado inicial
  }

  // ==== Inicialização 7.2 ====
  function initValueProposition($root) {
  const $s1 = $root.find(`select[name="${N.d1}"]`);
  if (!$s1.length) return;

  // Garante que o s1 tenha um wrapper .vp-select-wrap (sem criar um novo select)
  let $w1 = $s1.closest('.vp-select-wrap');
  if (!$w1.length) {
    $w1 = $(`<div class="mb-1 vp-select-wrap card-select-row"></div>`);
    const $rowDiv = $(`<div class="row g-2 align-items-center"></div>`);
    
    // Coluna do select
    const $colSelect = $(`<div class="col card-select-col"></div>`);
    $s1.after($w1);           // insere o wrapper logo após o s1
    $s1.appendTo($colSelect); // move o s1 para dentro da coluna
    
    // Coluna do input "outro"
    const $colOther = $(`<div class="col extra-${N.d1}-other-inline d-none"></div>`);
    $colOther.html(`<input type="text" class="form-control" name="${N.d1}__other" placeholder="Especifique" style="max-width: 700px; width: 100%;">`);
    
    $rowDiv.append($colSelect, $colOther);
    $w1.append($rowDiv);
  }

  // Container para s2 e s3, logo abaixo da primeira row (não dentro dela)
  const $selects = ensureContainer($w1, "vp-selects-container", true);
  $w1.parent().removeClass("mb-2").addClass("mb-1");

  // Cria s2/s3 se não existirem
  let $w2 = $selects.find(`.vp-select-wrap:has(select[name="${N.d2}"])`);
  let $w3 = $selects.find(`.vp-select-wrap:has(select[name="${N.d3}"])`);
  if (!$w2.length) $w2 = buildSelect(N.d2).appendTo($selects);
  if (!$w3.length) $w3 = buildSelect(N.d3).appendTo($selects);

  const $s2 = $w2.find("select");
  const $s3 = $w3.find("select");

  // “Outro” -> “Especifique” por select
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

    // Preenche s2/s3 excluindo escolhidas (mantendo “outro”)
    // Para cada select, excluímos apenas os valores dos OUTROS selects
    fillSelect($s1, new Set([$s2.val(), $s3.val()].filter(Boolean)));
    fillSelect($s2, new Set([$s1.val(), $s3.val()].filter(Boolean)));
    fillSelect($s3, new Set([$s1.val(), $s2.val()].filter(Boolean)));

    // Encadeamento (usa SEMPRE $s1, não query global)
    // Mostra/oculta select 2 baseado no select 1, mas não limpa o valor
    $w2.toggle(!!$s1.val());
    
    // Se o select 2 está oculto (porque o select 1 está vazio), limpa apenas o select 2
    if (!$s1.val() && $s2.val()) {
      $s2.val("");
      // Limpa o input "outro" do select 2 quando o select 1 é limpo
      $w2.find(`.extra-${N.d2}-other-inline`).addClass("d-none").find("input").val("");
    }

    // Mostra/oculta select 3 baseado no select 2, mas não limpa o valor
    $w3.toggle(!!$s2.val());
    
    // Se o select 3 está oculto (porque o select 2 está vazio), limpa apenas o select 3
    if (!$s2.val() && $s3.val()) {
      $s3.val("");
      // Limpa o input "outro" do select 3 quando o select 2 é limpo
      $w3.find(`.extra-${N.d3}-other-inline`).addClass("d-none").find("input").val("");
    }

    // Atualiza “Especifique” dos 3 selects
    $s1.trigger("change.vpOther");
    $s2.trigger("change.vpOther");
    $s3.trigger("change.vpOther");
  }

  // Estado inicial
  fillSelect($s1, new Set()); // opcional; se não quiser reescrever s1, pode remover esta linha
  fillSelect($s2, new Set());
  fillSelect($s3, new Set());
  $w2.hide();
  $w3.hide();

  // Binds
  $s1.off("change.vp_s1").on("change.vp_s1", sync);                         // bind direto no s1 real
  $selects.off("change.vp").on("change.vp", "select[name^='valueDiff']", sync);

  // Primeira sincronização
  sync();
}


  // ==== Bind público do Card 7 ====
  function bind($root) {
    if (!$root || !$root.length) return;
    //if ($root.data("card7Bound")) return;
    //$root.data("card7Bound", true);

    initValueProposition($root); // 7.2
  }

  return { bind };
})();