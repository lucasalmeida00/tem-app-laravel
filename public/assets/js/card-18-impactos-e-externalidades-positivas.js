window.Card18 = (function () {
  // ==== Utils (seguindo o padrão dos outros cards) ====
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

  // ==== 18.1 — "Outro" no impacto principal ====
  function initMainImpactOther($root) {
    const $radios = $root.find('input[type="radio"][name="mainImpact"]');
    const $otherInput = $root.find('input[name="mainImpactOther"]');
    if (!$radios.length || !$otherInput.length) return;

    const $otherWrap = wrapperFor($otherInput);

    function sync() {
      const val = $radios.filter(":checked").val();
      const show = val === "outro";

      $otherWrap.toggle(!!show);
      if (!show) {
        $otherInput.val("");
      }
    }

    $radios.off("change.card18_mainImpact").on("change.card18_mainImpact", sync);
    // estado inicial
    sync();
  }

  // ==== 18.2 — Avaliação de impactos: tipo só se "Sim" ====
  function initImpactEvaluation($root) {
    const $mainRadios = $root.find(
      'input[type="radio"][name="impactEvaluationPerformed"]'
    );
    const $typeRadios = $root.find(
      'input[type="radio"][name="impactEvaluationType"]'
    );
    if (!$mainRadios.length || !$typeRadios.length) return;

    const $typeWrap = wrapperFor($typeRadios.first());

    function sync() {
      const val = $mainRadios.filter(":checked").val();
      const show = val === "sim";

      $typeWrap.toggle(!!show);
      if (!show) {
        $typeRadios.prop("checked", false);
      }
    }

    $mainRadios
      .off("change.card18_eval_main")
      .on("change.card18_eval_main", sync);
    $typeRadios
      .off("change.card18_eval_type")
      .on("change.card18_eval_type", sync);

    // estado inicial
    sync();
  }

  // ==== Bind público do Card 18 ====
  function bind($root) {
    if (!$root || !$root.length) return;
    //if ($root.data("card18Bound")) return;
    //$root.data("card18Bound", true);

    initMainImpactOther($root);     // 18.1
    initImpactEvaluation($root);    // 18.2
  }

  return { bind };
})();