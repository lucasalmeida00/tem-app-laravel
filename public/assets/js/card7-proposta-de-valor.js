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
      <div class="mb-2 vp-select-wrap">
        <select class="form-select" name="${name}">
          <option value="" disabled selected hidden>Selecione uma opção</option>
          ${DIFF_OPTIONS.map(o => `<option value="${o.v}">${o.label}</option>`).join("")}
        </select>
        <div class="mt-2 vp-other-box d-none"></div>
      </div>
    `);
  }

  // “Outro” NUNCA sai da lista (como no Card 6)
  function fillSelect($sel, chosenSet) {
    const keep = $sel.val();
    $sel.html(`<option value="" disabled selected hidden>Selecione uma opção</option>`);
    DIFF_OPTIONS.forEach(o => {
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
    const $box = $wrap.find(".vp-other-box");
    function renderOther() {
      if ($sel.val() === "outro") {
        $box.removeClass("d-none").html(
          `<input type="text" class="form-control" name="${$sel.attr("name")}__other" placeholder="Especifique" />`
        );
      } else {
        $box.addClass("d-none").empty();
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
    $w1 = $(`<div class="mb-2 vp-select-wrap"></div>`);
    $s1.after($w1);           // insere o wrapper logo após o s1
    $w1.append($s1);          // move o s1 para dentro do wrapper
    $w1.append(`<div class="mt-2 vp-other-box d-none"></div>`);
  }

  const $wrap1 = wrapperFor($s1);
  // Container para s2 e s3, logo abaixo do primeiro
  const $selects = ensureContainer($wrap1, "vp-selects-container", true);

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
    fillSelect($s2, new Set([...chosen].filter(v => v !== $s2.val())));
    fillSelect($s3, new Set([...chosen].filter(v => v !== $s3.val())));

    // Encadeamento (usa SEMPRE $s1, não query global)
    $w2.toggle(!!$s1.val());
    if (!$s1.val()) $s2.val("");

    $w3.toggle(!!$s2.val());
    if (!$s2.val()) $s3.val("");

    // Atualiza “Especifique” dos 3 selects
    $w1.triggerHandler("change.vpOther");
    $w2.triggerHandler("change.vpOther");
    $w3.triggerHandler("change.vpOther");
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