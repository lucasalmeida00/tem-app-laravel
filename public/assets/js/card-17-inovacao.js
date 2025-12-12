window.Card17 = (function () {
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
      if (!$c.length) $c = $(`<div class="${cls}"></div>`).insertAfter($wrap);
    } else {
      $c = $wrap.find("." + cls).first();
      if (!$c.length) $c = $(`<div class="${cls}"></div>`).appendTo($wrap);
    }
    return $c;
  }

  // ==== 17.2 — Patentes registradas ====
  function initPatents($root) {
    const $radios = $root.find('input[type="radio"][name="hasPatents"]');
    const $input = $root.find('input[name="patentsCount"]');
    if (!$radios.length || !$input.length) return;

    const $wrap = wrapperFor($input);

    function sync() {
      const val = $radios.filter(":checked").val();
      const show = val === "sim";

      $wrap.toggle(!!show);
      if (!show) {
        $input.val("").prop("required", false);
      }
    }

    $radios.off("change.card17_patents").on("change.card17_patents", sync);
    // estado inicial
    sync();
  }

  // ==== 17.3 — Prêmio de inovação ====
  function initInnovationAward($root) {
    const $radios = $root.find('input[type="radio"][name="hasInnovationAward"]');
    const $input = $root.find('input[name="innovationAwardDescription"]');
    if (!$radios.length || !$input.length) return;

    const $wrap = wrapperFor($input);

    function sync() {
      const val = $radios.filter(":checked").val();
      const show = val === "sim";

      $wrap.toggle(!!show);
      if (!show) {
        $input.val("");
      }
    }

    $radios.off("change.card17_award").on("change.card17_award", sync);
    sync();
  }

  // ==== 17.7 — Interação com universidades / institutos ====
  function initUniversitiesInteraction($root) {
    const $mainRadios = $root.find('input[type="radio"][name="interactsUniversities"]');
    const $howRadios = $root.find('input[type="radio"][name="universityInteractionType"]');
    const $otherInput = $root.find('input[name="universityInteractionOther"]');

    if (!$mainRadios.length || !$howRadios.length || !$otherInput.length) return;

    const $howWrap = wrapperFor($howRadios.first());
    const $otherWrap = wrapperFor($otherInput);

    function sync() {
      const mainVal = $mainRadios.filter(":checked").val();
      const showDetail = mainVal === "sim";

      $howWrap.toggle(!!showDetail);
      if (!showDetail) {
        // se não interage, limpa tudo abaixo
        $howRadios.prop("checked", false);
        $otherWrap.hide();
        $otherInput.val("");
        return;
      }

      const detailVal = $howRadios.filter(":checked").val();
      const showOther = detailVal === "outro";

      $otherWrap.toggle(!!showOther);
      if (!showOther) {
        $otherInput.val("");
      }
    }

    $mainRadios.off("change.card17_univ_main").on("change.card17_univ_main", sync);
    $howRadios.off("change.card17_univ_how").on("change.card17_univ_how", sync);
    sync();
  }

  // ==== 17.9 — “Outro” nas ações para superar prejuízos ====
  function initLossesOther($root) {
    const $checks = $root.find('input[type="checkbox"][name="lossesMainAction"]');
    const $otherInput = $root.find('input[name="lossesMainActionOther"]');
    if (!$checks.length || !$otherInput.length) return;

    const $otherWrap = wrapperFor($otherInput);

    function sync() {
      const outroChecked = $checks.filter('[value="outro"]').is(":checked");
      $otherWrap.toggle(outroChecked);
      if (!outroChecked) {
        $otherInput.val("");
      }
    }

    $checks.off("change.card17_losses").on("change.card17_losses", sync);
    sync();
  }

  // ==== 17.10 — Monitoramento de tendências tecnológicas ====
  function initMonitorTech($root) {
    const $mainRadios = $root.find('input[type="radio"][name="monitorTechTrends"]');
    const $levelRadios = $root.find('input[type="radio"][name="monitorTechLevel"]');
    if (!$mainRadios.length || !$levelRadios.length) return;

    const $levelWrap = wrapperFor($levelRadios.first());

    function sync() {
      const val = $mainRadios.filter(":checked").val();
      const show = val === "sim";

      $levelWrap.toggle(!!show);
      if (!show) {
        $levelRadios.prop("checked", false);
      }
    }

    $mainRadios.off("change.card17_monitor").on("change.card17_monitor", sync);
    $levelRadios.off("change.card17_monitor_lvl").on("change.card17_monitor_lvl", sync);
    sync();
  }

  // ==== 17.11 — Uso de conhecimento científico ====
  function initScientificKnowledge($root) {
    const $radios = $root.find('input[type="radio"][name="usesScientificKnowledge"]');
    const $input = $root.find('input[name="scientificKnowledgeSource"]');
    if (!$radios.length || !$input.length) return;

    const $wrap = wrapperFor($input);

    function sync() {
      const val = $radios.filter(":checked").val();
      const show = val === "sim";

      $wrap.toggle(!!show);
      if (!show) {
        $input.val("");
      }
    }

    $radios.off("change.card17_science").on("change.card17_science", sync);
    sync();
  }

  // ==== Bind público do Card 17 ====
  function bind($root) {
    if (!$root || !$root.length) return;
    //if ($root.data("card17Bound")) return;
    //$root.data("card17Bound", true);

    initPatents($root);                // 17.2
    initInnovationAward($root);        // 17.3
    initUniversitiesInteraction($root);// 17.7
    initLossesOther($root);            // 17.9
    initMonitorTech($root);            // 17.10
    initScientificKnowledge($root);    // 17.11
  }

  return { bind };
})();