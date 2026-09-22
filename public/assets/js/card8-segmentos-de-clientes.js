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
    { v: "ocupacao", label: "Consumidor final por ocupação (trabalhadores informais, pequenos empresários, etc.)" },
    { v: "tipo_renda", label: "Consumidor final por tipo de renda (baixa, média, alta)" },
    { v: "grandes_empresas", label: "Grandes Empresas" },
    { v: "pequenas_empresas", label: "Pequenas Empresas" },
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
          // Transforma o parent do .form-check em flex container
          const $parent = $formCheck.parent();
          if (!$parent.hasClass("d-flex")) {
            $parent.addClass("d-flex align-items-start gap-2 flex-wrap");
          }
          
          // Cria ou encontra o holder inline
          let $inlineHolder = $parent.find(".first-client-other-inline");
          if (!$inlineHolder.length) {
            $inlineHolder = $(`<div class="first-client-other-inline" style="flex: 1 1 auto; min-width: 250px;"></div>`);
            $formCheck.after($inlineHolder);
          }
          
          $inlineHolder.html(
            `<input type="text" class="form-control" name="firstClientOther" placeholder="Especifique" style="width: 100%; display: block;">`
          );
        } else {
          // Fallback: tenta encontrar o label (caso a estrutura seja diferente)
          const $outroLabel = $outroRadio.closest("label");
          if ($outroLabel.length) {
            const $parent = $outroLabel.parent();
            if (!$parent.hasClass("d-flex")) {
              $parent.addClass("d-flex align-items-start gap-2 flex-wrap");
            }
            
            let $inlineHolder = $parent.find(".first-client-other-inline");
            if (!$inlineHolder.length) {
              $inlineHolder = $(`<div class="first-client-other-inline" style="flex: 1 1 auto; min-width: 250px;"></div>`);
              $outroLabel.after($inlineHolder);
            }
            $inlineHolder.html(
              `<input type="text" class="form-control" name="firstClientOther" placeholder="Especifique" style="width: 100%; display: block;">`
            );
          }
        }
      } else {
        // Remove o holder inline e as classes flex quando outro radio é selecionado
        $root.find(".first-client-other-inline").remove();
        // Remove as classes flex do parent se não for "outro"
        const $formCheck = $outroRadio.closest(".form-check");
        if ($formCheck.length) {
          const $parent = $formCheck.parent();
          $parent.removeClass("d-flex align-items-start gap-2 flex-wrap");
        }
      }
    }

    $root.off("change.fc").on("change.fc", `input[name="${N.first}"]`, render);
    render();
  }

  // ==== 8.2 — 3 selects encadeados com "Outro" permanente ====
  function buildSelect(name) {
    return $(`
      <div class="mb-1 sc-select-wrap card-select-row">
        <div class="row g-2 align-items-center">
          <div class="col card-select-col">
            <select class="form-select" name="${name}">
              <option value="">-- Selecione --</option>
              ${SEG_OPTIONS.map(o => `<option value="${o.v}">${o.label}</option>`).join("")}
            </select>
          </div>
          <div class="col extra-${name}-other-inline d-none">
            <input type="text" class="form-control" name="${name}__other" placeholder="Especifique" style="width: 100%;">
          </div>
        </div>
      </div>
    `);
  }

  // “outro” nunca some (mesma regra dos cards 6/7)
  function fillSelect($sel, chosenSet) {
    const keep = $sel.val();
    $sel.html(`<option value="">-- Selecione --</option>`);
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
    $wrap.off("change.scOther").on("change.scOther", "select", renderOther);
    renderOther();
  }

  function initSegments($root) {
    const $s1 = $root.find(`select[name="${N.s1}"]`);
    if (!$s1.length) return;

    // garante wrapper para s1 (sem duplicar select)
    let $w1 = $s1.closest(".sc-select-wrap");
    if (!$w1.length) {
      $w1 = $(`<div class="mb-1 sc-select-wrap card-select-row"></div>`);
      const $rowDiv = $(`<div class="row g-2 align-items-center"></div>`);
      
      // Coluna do select
      const $colSelect = $(`<div class="col card-select-col"></div>`);
      $s1.after($w1);
      $s1.appendTo($colSelect);
      
      // Coluna do input "outro"
      const $colOther = $(`<div class="col extra-${N.s1}-other-inline d-none"></div>`);
      $colOther.html(`<input type="text" class="form-control" name="${N.s1}__other" placeholder="Especifique" style="width: 100%;">`);
      
      $rowDiv.append($colSelect, $colOther);
      $w1.append($rowDiv);
    }

    // Container para s2/s3, logo abaixo da primeira row (não dentro dela)
    const $selects = ensureContainer($w1, "sc-selects-container", true);
    $w1.parent().removeClass("mb-2").addClass("mb-1");

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
      if (!$s1.val()) {
        $s2.val("");
        $w2.find(`.extra-${N.s2}-other-inline`).addClass("d-none").find("input").val("");
      }

      $w3.toggle(!!$s2.val());
      if (!$s2.val()) {
        $s3.val("");
        $w3.find(`.extra-${N.s3}-other-inline`).addClass("d-none").find("input").val("");
      }


      // atualiza “Especifique”
      $s1.trigger("change.scOther");
      $s2.trigger("change.scOther");
      $s3.trigger("change.scOther");
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