window.Card8 = (function () {
  // ==== Utils (mesmo padrão dos cards 5/6/7) ====
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
    // 8.1
    first: "firstClient",
    // 8.2
    s1: "segGroup1",
    s2: "segGroup2",
    s3: "segGroup3"
  };

  const SEG_OPTIONS = [
    { v: "faixa_etaria", label: "Consumidor final na faixa etária (jovens, adultos, idosos)" },
    { v: "tipo_renda", label: "Consumidor final por tipo de renda (baixa, média, alta)" },
    { v: "ocupacao", label: "Consumidor final por ocupação (trabalhadores informais, pequenos empresários, etc.)" },
    { v: "pequenas_empresas", label: "Pequenas Empresas" },
    { v: "grandes_empresas", label: "Grandes Empresas" },
    { v: "outro", label: "Outro" }
  ];

  // ==== 8.1 — Radio "Outro" -> Especifique ====
  function initFirstClient($root) {
    const $rad = $root.find(`input[name="${N.first}"]`);
    if (!$rad.length) return;

    // Encontra o radio button "outro"
    const $outroRadio = $root.find(`input[name="${N.first}"][value="outro"]`);
    if (!$outroRadio.length) return;

    function render() {
      const v = $root.find(`input[name="${N.first}"]:checked`).val();
      
      if (v === "outro") {
        // Encontra o container .form-check que contém o radio "outro"
        const $formCheck = $outroRadio.closest(".form-check");
        
        if ($formCheck.length) {
          // Estrutura padrão: .form-check contém input e label como irmãos
          // Adiciona o input ao lado do label dentro do .form-check
          let $inlineHolder = $formCheck.find(".first-client-other-inline");
          if (!$inlineHolder.length) {
            $inlineHolder = $(`<div class="first-client-other-inline mt-2"></div>`);
            // Adiciona após o .form-check (abaixo do radio)
            $formCheck.after($inlineHolder);
          }
          
          $inlineHolder.html(
            `<textarea class="form-control mx-auto" name="firstClientOther" placeholder="Especifique" rows="3" style="max-width: 700px; width: 100%; display: block;"></textarea>`
          );
        } else {
          // Fallback: tenta encontrar o label (caso a estrutura seja diferente)
          const $outroLabel = $outroRadio.closest("label");
          if ($outroLabel.length) {
            let $inlineHolder = $outroLabel.find(".first-client-other-inline");
            if (!$inlineHolder.length) {
              $inlineHolder = $(`<div class="first-client-other-inline mt-2"></div>`);
              $outroLabel.after($inlineHolder);
            }
            $inlineHolder.html(
              `<textarea class="form-control" name="firstClientOther" placeholder="Especifique" rows="3" style="max-width: 500px;"></textarea>`
            );
          }
        }
      } else {
        // Remove o holder inline quando outro radio é selecionado
        $root.find(".first-client-other-inline").remove();
      }
    }

    $root.off("change.fc").on("change.fc", `input[name="${N.first}"]`, render);
    render();
  }

  // ==== 8.2 — 3 selects encadeados com "Outro" permanente ====
  function buildSelect(name) {
    return $(`
      <div class="mb-3 sc-select-wrap">
        <div class="row g-2">
          <div class="col-auto" style="min-width: 250px; max-width: 350px;">
            <select class="form-select" name="${name}">
              <option value="" disabled selected hidden>Selecione uma opção</option>
              ${SEG_OPTIONS.map(o => `<option value="${o.v}">${o.label}</option>`).join("")}
            </select>
          </div>
          <div class="col-auto extra-${name}-other-inline d-none" style="min-width: 300px;">
            <textarea class="form-control" name="${name}__other" placeholder="Especifique" rows="3"></textarea>
          </div>
        </div>
      </div>
    `);
  }

  // “outro” nunca some (mesma regra dos cards 6/7)
  function fillSelect($sel, chosenSet) {
    const keep = $sel.val();
    $sel.html(`<option value="" disabled selected hidden>Selecione uma opção</option>`);
    SEG_OPTIONS.forEach(o => {
      if (!chosenSet.has(o.v) || o.v === "outro") {
        $sel.append(`<option value="${o.v}">${o.label}</option>`);
      }
    });
    if (keep && (!chosenSet.has(keep) || keep === "outro")) $sel.val(keep);
  }

  function wireOtherFor($wrap) {
    const $sel = $wrap.find("select");
    const name = $sel.attr("name");
    const $box = $wrap.find(`.extra-${name}-other-inline`);
    function renderOther() {
      if ($sel.val() === "outro") {
        $box.removeClass("d-none");
      } else {
        $box.addClass("d-none");
        // Limpa o valor do input quando "outro" é desmarcado
        $box.find("textarea").val("");
      }
    }
    $wrap.off("change.scOther").on("change.scOther", "select", renderOther);
    renderOther();
  }

  function initSegments($root) {
    const $s1 = $root.find(`select[name="${N.s1}"]`);
    if (!$s1.length) return;

    // garante wrapper para s1 (sem duplicar select)
    let $w1 = $s1.closest(".sc-select-wrap");
    if (!$w1.length) {
      $w1 = $(`<div class="mb-3 sc-select-wrap"></div>`);
      const $rowDiv = $(`<div class="row g-2"></div>`);
      
      // Coluna do select
      const $colSelect = $(`<div class="col-auto" style="min-width: 250px; max-width: 350px;"></div>`);
      $s1.after($w1);
      $s1.appendTo($colSelect);
      
      // Coluna do input "outro"
      const $colOther = $(`<div class="col-auto extra-${N.s1}-other-inline d-none" style="min-width: 250px;"></div>`);
      $colOther.html(`<textarea class="form-control" name="${N.s1}__other" placeholder="Especifique" rows="3"></textarea>`);
      
      $rowDiv.append($colSelect, $colOther);
      $w1.append($rowDiv);
    }

    const $wrap1 = wrapperFor($s1);
    const $selects = ensureContainer($wrap1, "sc-selects-container", true);

    // cria s2/s3
    let $w2 = $selects.find(`.sc-select-wrap:has(select[name="${N.s2}"])`);
    let $w3 = $selects.find(`.sc-select-wrap:has(select[name="${N.s3}"])`);
    if (!$w2.length) $w2 = buildSelect(N.s2).appendTo($selects);
    if (!$w3.length) $w3 = buildSelect(N.s3).appendTo($selects);

    const $s2 = $w2.find("select");
    const $s3 = $w3.find("select");

    // “Outro” -> Especifique
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

      fillSelect($s2, new Set([...chosen].filter(v => v !== $s2.val())));
      fillSelect($s3, new Set([...chosen].filter(v => v !== $s3.val())));

      // encadeamento visual
      $w2.toggle(!!$s1.val());
      if (!$s1.val()) $s2.val("");

      $w3.toggle(!!$s2.val());
      if (!$s2.val()) $s3.val("");

      // atualiza “Especifique”
      $w1.triggerHandler("change.scOther");
      $w2.triggerHandler("change.scOther");
      $w3.triggerHandler("change.scOther");
    }

    // estado inicial
    fillSelect($s1, new Set());
    fillSelect($s2, new Set());
    fillSelect($s3, new Set());
    $w2.hide();
    $w3.hide();

    // binds
    $s1.off("change.sc_s1").on("change.sc_s1", sync);
    $selects.off("change.sc").on("change.sc", "select[name^='segGroup']", sync);

    sync();
  }

  // ==== Bind público do Card 8 ====
  function bind($root) {
    if (!$root || !$root.length) return;
    //if ($root.data("card8Bound")) return;
    //$root.data("card8Bound", true);

    initFirstClient($root); // 8.1
    initSegments($root);    // 8.2
  }

  return { bind };
})();