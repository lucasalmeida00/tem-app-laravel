window.Card6 = (function () {
  // ==== Utils (mesmo padrão dos Cards 4/5) ====
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

  // ==== Nomes 6.1 ====
  const N = {
    main: "decisionMain",   // rádio Sim/Não
    who1: "decisionWho1",   // selects criados via JS
    who2: "decisionWho2",
    who3: "decisionWho3"
  };

  // Opções de quem decide junto (para os selects)
  const WHO_OPTIONS = [
    { v: "parceiros",  label: "Com parceiros ou colaboradores-chave" },
    { v: "familiares", label: "Com familiares ou amigos próximos" },
    { v: "mentores",   label: "Com mentores ou conselheiros" },
    { v: "equipe",     label: "Em conjunto com uma equipe de funcionários" },
    { v: "socios",     label: "Em conjunto com socios" },
    { v: "outro",      label: "Outro" }
  ];

  // ==== Builders dos selects + “Especifique” quando for “outro” ====
  function buildSelect(name) {
    return $(`
      <div class="mb-2 dm-select-wrap">
        <select class="form-select" name="${name}">
          <option value="" disabled selected hidden>Selecione uma opção</option>
          ${WHO_OPTIONS.map(o => `<option value="${o.v}">${o.label}</option>`).join("")}
        </select>
        <div class="mt-2 dm-other-box d-none"></div>
      </div>
    `);
  }

function fillSelect($sel, chosenSet) {
  const keep = $sel.val();

  // reset mantendo o placeholder
  $sel.html(`<option value="" disabled selected hidden>Selecione uma opção</option>`);

  WHO_OPTIONS.forEach(o => {
    // “outro” NUNCA sai da lista, mesmo que esteja em chosenSet
    if (!chosenSet.has(o.v) || o.v === "outro") {
      $sel.append(`<option value="${o.v}">${o.label}</option>`);
    }
  });

  // preserva o valor anterior se ainda for válido (e “outro” sempre será)
  if (keep && (!chosenSet.has(keep) || keep === "outro")) {
    $sel.val(keep);
  }
}


  function wireOtherFor($wrap) {
    const $sel = $wrap.find("select");
    const $box = $wrap.find(".dm-other-box");

    $wrap.off("change.dmOther").on("change.dmOther", "select", function () {
      if ($sel.val() === "outro") {
        $box.removeClass("d-none").html(
          `<input type="text" class="form-control" name="${$sel.attr("name")}__other" placeholder="Especifique" />`
        );
      } else {
        $box.addClass("d-none").empty();
      }
    });

    // estado inicial (edição)
    if ($sel.val() === "outro") {
      $box.removeClass("d-none").html(
        `<input type="text" class="form-control" name="${$sel.attr("name")}__other" placeholder="Especifique" />`
      );
    } else {
      $box.addClass("d-none").empty();
    }
  }

  // ==== Inicialização da lógica 6.1 ====
  function initDecisionMaking($root) {
    const $rad = $root.find(`input[name="${N.main}"]`);
    if (!$rad.length) return;

    // Holder dos 3 selects (logo abaixo do rádio)
    const $wrap = wrapperFor($rad.first());
    const $holder = ensureContainer($wrap, "dm-selects-container", true);

    // Cria (se ainda não houver) os 3 selects encadeados
    let $w1 = $holder.find(`.dm-select-wrap:has(select[name="${N.who1}"])`);
    let $w2 = $holder.find(`.dm-select-wrap:has(select[name="${N.who2}"])`);
    let $w3 = $holder.find(`.dm-select-wrap:has(select[name="${N.who3}"])`);
    if (!$w1.length) $w1 = buildSelect(N.who1).appendTo($holder);
    if (!$w2.length) $w2 = buildSelect(N.who2).appendTo($holder);
    if (!$w3.length) $w3 = buildSelect(N.who3).appendTo($holder);

    const $s1 = $w1.find("select");
    const $s2 = $w2.find("select");
    const $s3 = $w3.find("select");

    // “Outro” -> Especifique por select
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
      const isNo = $root.find(`input[name="${N.main}"]:checked`).val() === "nao";

      // mostra/oculta bloco conforme rádio
      $holder.toggle(isNo);

      if (!isNo) {
        // Se marcou “Sim”, limpa estado
        $s1.val(""); $s2.val(""); $s3.val("");
        $w1.find(".dm-other-box").addClass("d-none").empty();
        $w2.find(".dm-other-box").addClass("d-none").empty();
        $w3.find(".dm-other-box").addClass("d-none").empty();
        $w2.hide();
        $w3.hide();
        return;
      }

      const chosen = getChosen();

      // s2/s3 recebem opções excluindo já escolhidos
      fillSelect($s2, new Set([...chosen].filter(v => v !== $s2.val())));
      fillSelect($s3, new Set([...chosen].filter(v => v !== $s3.val())));

      // encadeamento visual
      $w2.toggle(!!$s1.val());
      if (!$s1.val()) $s2.val("");

      $w3.toggle(!!$s2.val());
      if (!$s2.val()) $s3.val("");

      // atualizar campos “Especifique” caso algum seja “outro”
      $w1.triggerHandler("change.dmOther");
      $w2.triggerHandler("change.dmOther");
      $w3.triggerHandler("change.dmOther");
    }

    // Estado inicial
    $holder.hide(); // só aparece se marcar “Não”
    fillSelect($s1, new Set());
    fillSelect($s2, new Set());
    fillSelect($s3, new Set());
    $w2.hide();
    $w3.hide();

    // Binds
    $root.off("change.dmRadio").on("change.dmRadio", `input[name="${N.main}"]`, sync);
    $holder.off("change.dmSelects").on("change.dmSelects", "select[name^='decisionWho']", sync);

    // Primeira sincronização
    sync();
  }

  // ==== Bind público do Card 6 ====
  function bind($root) {
    if (!$root || !$root.length) return;

    // REMOVER essas duas linhas:
    // if ($root.data("card6Bound")) return;
    // $root.data("card6Bound", true);

    initDecisionMaking($root); // 6.1
  }


  return { bind };
})();