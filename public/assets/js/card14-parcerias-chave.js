window.Card14 = (function () {
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

  // ==== Nomes ====
  const N = {
    p1: "mainPartners1",
    p2: "mainPartners2",
    p3: "mainPartners3"
  };

  // ==== Opções (espelho do schema) ====
  const PARTNER_OPTIONS = [
    { v: "fornecedores", label: "Fornecedores" },
    { v: "distribuidores_revendedores", label: "Distribuidores e revendedores" },
    { v: "logistica", label: "Logística" },
    { v: "parceiros_tecnologia", label: "Parceiros de tecnologia (infraestrutura tecnológica, aplicativos ou plataformas online)" },
    { v: "instituicoes_financeiras", label: "Instituições financeiras" },
    { v: "mkt_publicidade", label: "Empreendimentos de marketing e publicidade" },
    { v: "centros_pesquisa_pdu", label: "Centros de pesquisa e desenvolvimento (P&D) ou universidades" },
    { v: "entrada_socios", label: "Entrada de sócios" },
    { v: "entrada_novos_investidores", label: "Entrada de novos investidores" },
    { v: "ongs_nao_governamentais", label: "Organizações não governamentais (ONGs)" },
    { v: "lideres_influenciadores", label: "Líderes ou influenciadores comunitários" },
    { v: "pequenos_comerciantes_locais", label: "Pequenos comerciantes locais" },
    { v: "investidores_publicos", label: "Investidores públicos" },
    { v: "investidores_privados", label: "Investidores privados" },
    { v: "outro", label: "Outro" }
  ];

  // ==== Builders ====
  function buildSelect(name) {
    return $(`
      <div class="mb-3 pk-select-wrap">
        <div class="row g-2 align-items-center">
          <div class="col-auto" style="min-width: 250px; max-width: 350px;">
            <select class="form-select" name="${name}">
              <option value="" disabled selected hidden>Selecione uma opção</option>
              ${PARTNER_OPTIONS.map(o => `<option value="${o.v}">${o.label}</option>`).join("")}
            </select>
          </div>
          <div class="col-auto pk-clear-btn d-none" style="cursor: pointer;" title="Limpar seleção">
            <button type="button" class="btn btn-sm btn-outline-danger" style="padding: 0.25rem 0.5rem;">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="col-auto extra-${name}-other-inline d-none" style="min-width: 250px;">
            <input class="form-control" name="${name}__other" placeholder="Especifique" />
          </div>
        </div>
      </div>
    `);
  }

  // Nenhuma opção pode ser repetida (incluindo "outro")
  function fillSelect($sel, chosenSet) {
    const keep = $sel.val();
    $sel.html(`<option value="" disabled selected hidden>Selecione uma opção</option>`);
    PARTNER_OPTIONS.forEach(o => {
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
    function renderOther() {
      if ($sel.val() === "outro") {
        $box.removeClass("d-none");
      } else {
        $box.addClass("d-none");
        // Limpa o valor do input quando "outro" é desmarcado
        $box.find("input").val("");
      }
    }
    $wrap.off("change.pkOther").on("change.pkOther", "select", renderOther);
    renderOther();
  }

  // ==== Lógica 3 selects encadeados ====
  function initPartners($root) {
  const $s1 = $root.find(`select[name="${N.p1}"]`);
  if (!$s1.length) return;

  // 1) garante wrapper pro s1 (sem duplicar select)
  let $w1 = $s1.closest(".pk-select-wrap");
  if (!$w1.length) {
    $w1 = $(`<div class="mb-3 pk-select-wrap"></div>`);
    const $rowDiv = $(`<div class="row g-2 align-items-center"></div>`);
    
    // Coluna do select
    const $colSelect = $(`<div class="col-auto" style="min-width: 250px; max-width: 350px;"></div>`);
    $s1.after($w1);
    $s1.appendTo($colSelect);
    
    // Botão X para limpar
    const $colClear = $(`<div class="col-auto pk-clear-btn d-none" style="cursor: pointer;" title="Limpar seleção"></div>`);
    $colClear.html(`<button type="button" class="btn btn-sm btn-outline-danger" style="padding: 0.25rem 0.5rem;"><span aria-hidden="true">&times;</span></button>`);
    
    // Coluna do input "outro"
    const $colOther = $(`<div class="col-auto extra-${N.p1}-other-inline d-none" style="min-width: 250px;"></div>`);
    $colOther.html(`<input class="form-control" name="${N.p1}__other" placeholder="Especifique" />`);
    
    $rowDiv.append($colSelect, $colClear, $colOther);
    $w1.append($rowDiv);
  }

  // 2) container dos filhos ANCORADO no wrapper do s1
  const $selects = ensureContainer($w1, "pk-selects-container", true);

  // 3) cria s2/s3
  let $w2 = $selects.find(`.pk-select-wrap:has(select[name="${N.p2}"])`);
  let $w3 = $selects.find(`.pk-select-wrap:has(select[name="${N.p3}"])`);
  if (!$w2.length) $w2 = buildSelect(N.p2).appendTo($selects);
  if (!$w3.length) $w3 = buildSelect(N.p3).appendTo($selects);

  const $s2 = $w2.find("select");
  const $s3 = $w3.find("select");

  // 4) "Outro" -> "Especifique" em cada select
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
    // ⚠️ sempre use a referência DIRETA $s1 (evita pegar um select oculto/duplicado)
    const chosen = getChosen();

    // popula s2/s3 excluindo repetidos (incluindo "outro")
    fillSelect($s2, new Set([...chosen].filter(v => v !== $s2.val())));
    fillSelect($s3, new Set([...chosen].filter(v => v !== $s3.val())));

    // encadeamento visual
    const hasS1 = !!$s1.val();
    const hasS2 = !!$s2.val();

    // mostre/esconda os wrappers
    $w2.toggle(hasS1);
    if (!hasS1) $s2.val("");

    $w3.toggle(hasS2);
    if (!hasS2) $s3.val("");

    // Mostra/oculta botão X baseado no valor selecionado
    [$w1, $w2, $w3].forEach(($wrap) => {
      const $sel = $wrap.find("select");
      const $clearBtn = $wrap.find(".pk-clear-btn");
      if ($sel.val()) {
        $clearBtn.removeClass("d-none");
      } else {
        $clearBtn.addClass("d-none");
      }
    });

    // atualiza campos "Especifique" quando "Outro"
    $w1.triggerHandler("change.pkOther");
    $w2.triggerHandler("change.pkOther");
    $w3.triggerHandler("change.pkOther");
  }

  // 5) estado inicial
  fillSelect($s1, new Set()); // não repovoe em sync(), só aqui
  fillSelect($s2, new Set());
  fillSelect($s3, new Set());
  $w2.hide();
  $w3.hide();

  // 6) binds robustos (direto + delegado)
  $s1.off("change.pk_s1 input.pk_s1").on("change.pk_s1 input.pk_s1", sync);
  $selects.off("change.pk").on("change.pk", `select[name="${N.p2}"], select[name="${N.p3}"]`, sync);

  // 7) Bind para o botão X (limpar seleção)
  $root
    .off("click.pk_clear")
    .on("click.pk_clear", `.pk-select-wrap:has(select[name^="mainPartners"]) .pk-clear-btn button`, function (e) {
      e.preventDefault();
      const $wrap = $(this).closest(".pk-select-wrap");
      const $sel = $wrap.find("select");
      $sel.val("");
      // Oculta o input "outro" imediatamente e limpa o valor
      const name = $sel.attr("name");
      const $otherInput = $wrap.find(`.extra-${name}-other-inline`);
      $otherInput.addClass("d-none");
      $otherInput.find("input").val("");
      sync();
    });

  // 8) primeira sync
  sync();
}


  // ==== Bind público do Card 14 ====
  function bind($root) {
    if (!$root || !$root.length) return;
    //if ($root.data("card14Bound")) return;
    //$root.data("card14Bound", true);

    initPartners($root); // 14.2
  }

  return { bind };
})();
