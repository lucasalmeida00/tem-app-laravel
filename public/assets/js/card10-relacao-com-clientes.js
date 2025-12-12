// assets/js/card10-relacao-com-clientes.js
// Versão 10.x — lógica de selects dinâmicos ilimitados (igual Card 9)

window.Card10 = (function () {
  // ==== Utils (padrão) =====================================================
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

  // ==== Opções =============================================================
  const FIDEL_OPTS = [
    { v: "atendimento_personalizado", label: "Atendimento personalizado" },
    { v: "programas_fidelidade", label: "programas de fidelidade" },
    { v: "suporte_24_7", label: "Suporte 24/7" },
    { v: "boca_a_boca", label: "Incentivando o boca a boca e indicações" },
    { v: "comunidades_grupos", label: "Comunidades ou grupos online" },
    { v: "automacao_autoatendimento", label: "Automação e autoatendimento" },
    { v: "outro", label: "Outro" }
  ];

  const CAPTA_OPTS = [
    { v: "publicidade_marketing_digital", label: "Através de publicidade e marketing digital" },
    { v: "parcerias_indicacoes", label: "Parcerias e indicações" },
    { v: "promocoes_descontos", label: "Oferecendo promoções e descontos" },
    { v: "por_meio_atendimento", label: "Por meio de atendimento" },
    { v: "redes_sociais_comunicacao", label: "Através de redes sociais e comunicação digital" },
    { v: "promocoes_novos_clientes", label: "Promoções e descontos para novos clientes" },
    { v: "parcerias_locais", label: "Parcerias com outros empreendimentos locais" },
    { v: "outros", label: "Outros" }
  ];

  const GROUPS = [
    // 10.1 — fidelização
    {
      firstName: "fidelRel1",
      prefix: "fidelRel",
      options: FIDEL_OPTS,
      otherValues: ["outro"],
      containerClass: "rc-selects-container-fidel"
    },
    // 10.2 — captação
    {
      firstName: "captaRel1",
      prefix: "captaRel",
      options: CAPTA_OPTS,
      otherValues: ["outros"],
      containerClass: "rc-selects-container-capta"
    }
  ];

  // ==== Builders ===========================================================
  function buildSelect(name) {
    return $(`
      <div class="mb-2 rc-select-wrap">
        <select class="form-select" name="${name}">
          <option value="" disabled selected hidden>Selecione uma opção</option>
        </select>
        <div class="mt-2 rc-other-box d-none"></div>
      </div>
    `);
  }

  /**
   * Preenche um <select> com as opções disponíveis:
   * - nenhuma opção "normal" (≠ outro/outros) é repetida
   * - outro/outros ficam sempre disponíveis
   */
  function fillSelectDynamic($sel, chosenNonOtherSet, options, otherValues, currentValue) {
    const placeholder =
      '<option value="" disabled hidden>Selecione uma opção</option>';

    const html = options
      .map((o) => {
        const isOther = otherValues.includes(o.v);
        if (!isOther && chosenNonOtherSet.has(o.v) && o.v !== currentValue) {
          return "";
        }
        return `<option value="${o.v}">${o.label}</option>`;
      })
      .join("");

    $sel.html(placeholder + html);

    if (currentValue && $sel.find(`option[value="${currentValue}"]`).length) {
      $sel.val(currentValue);
    } else {
      $sel.val("");
    }
  }

  // ==== "Outro" (mesma ideia do Card 9) ====================================
  function renderOtherBox($wrap, on) {
    const $box = $wrap.find(".rc-other-box");

    if (on) {
      // já existe input? só mostra
      const existing = $box.find("input[type='text']");
      if (existing.length) {
        $box.removeClass("d-none");
        return;
      }

      const nameBase = $wrap.find("select").attr("name") + "__other";

      $box
        .removeClass("d-none")
        .html(
          `<input type="text" class="form-control"
                  name="${nameBase}"
                  placeholder="Especifique" />`
        );
    } else {
      // esconde, mas NÃO apaga o conteúdo (pra não perder o texto)
      $box.addClass("d-none");
    }
  }

  function wireExtrasFor($wrap, otherValues) {
    const $sel = $wrap.find("select");
    function update() {
      const val = $sel.val();
      renderOtherBox($wrap, otherValues.includes(val));
    }
    $wrap.off("change.rcOther").on("change.rcOther", "select", update);
    update(); // estado inicial
  }

  // ==== Inicialização de um grupo (fidel ou capta) =========================
  function initDynamicGroup($root, cfg) {
    const { firstName, prefix, options, otherValues, containerClass } = cfg;

    const $s1 = $root.find(`select[name="${firstName}"]`);
    if (!$s1.length) return;

    // Garante wrapper consistente pro primeiro select
    let $w1 = $s1.closest(".rc-select-wrap");
    if (!$w1.length) {
      $w1 = $(`<div class="mb-2 rc-select-wrap"></div>`);
      $s1.after($w1);
      $w1.append($s1);
      $w1.append(`<div class="mt-2 rc-other-box d-none"></div>`);
    }

    const $wrap1 = wrapperFor($s1);
    const $container = ensureContainer($wrap1, containerClass, true);

    function allWraps() {
      return $w1.add($container.find(".rc-select-wrap"));
    }

    function getNextIndex() {
      let max = 0;
      allWraps().each(function () {
        const name = $(this).find("select").attr("name") || "";
        const m = name.match(new RegExp("^" + prefix + "(\\d+)$"));
        if (m) {
          const n = parseInt(m[1], 10);
          if (!isNaN(n) && n > max) max = n;
        }
      });
      if (!max) max = 1;
      return max + 1;
    }

    function createNewRow() {
      const idx = getNextIndex();
      const name = `${prefix}${idx}`;
      const $new = buildSelect(name).appendTo($container);
      wireExtrasFor($new, otherValues);
      return $new;
    }

    function cleanupTrailingEmpties() {
      let $wraps = allWraps();

      const firstVal = $wraps.eq(0).find("select").val();
      if (!firstVal) {
        // se o primeiro está vazio, remove todos os outros
        for (let i = $wraps.length - 1; i >= 1; i--) {
          $wraps.eq(i).remove();
        }
        return allWraps();
      }

      // mantém apenas o primeiro vazio depois do primeiro preenchido
      let firstEmptyIndex = -1;
      $wraps.each(function (idx) {
        if (idx === 0) return;
        const v = $(this).find("select").val();
        if (!v) {
          firstEmptyIndex = idx;
          return false; // break
        }
      });

      if (firstEmptyIndex >= 0) {
        for (let i = $wraps.length - 1; i > firstEmptyIndex; i--) {
          $wraps.eq(i).remove();
        }
      }

      return allWraps();
    }

    function fullSync() {
      let $wraps = allWraps();

      // 1) Limpa vazios sobrando
      $wraps = cleanupTrailingEmpties();

      // 2) Conjunto de opções "normais" já usadas
      const chosenNonOther = new Set();
      $wraps.each(function () {
        const v = $(this).find("select").val();
        if (v && !otherValues.includes(v)) {
          chosenNonOther.add(v);
        }
      });

      // 3) Se o último tiver valor, cria mais um select vazio embaixo
      $wraps = allWraps();
      const $last = $wraps.last();
      const lastVal = $last.find("select").val();
      if (lastVal) {
        createNewRow();
        $wraps = allWraps();
      }

      // 4) Repreenche opções de todos os selects respeitando as escolhas
      $wraps.each(function () {
        const $sel = $(this).find("select");
        const current = $sel.val();
        fillSelectDynamic($sel, chosenNonOther, options, otherValues, current);
      });

      // 5) Atualiza caixas "Outro" de todos
      $wraps.each(function () {
        const $w = $(this);
        const val = $w.find("select").val();
        renderOtherBox($w, otherValues.includes(val));
      });
    }

    // ==== Estado inicial ===================================================

    // 1) Liga "Outro" no primeiro select
    wireExtrasFor($w1, otherValues);

    // 2) Se já existem selects adicionais no HTML (edição), liga extras neles
    $container.find(".rc-select-wrap").each(function () {
      wireExtrasFor($(this), otherValues);
    });

    // 3) Cria linhas extras a partir dos dados salvos (se houver)
    let maxIndexFromData = 1;
    if (window.temLoadAllData) {
      try {
        const allData = window.temLoadAllData();
        const cardData10 = allData["10"] || {};
        Object.keys(cardData10).forEach((key) => {
          const m = key.match(new RegExp("^" + prefix + "(\\d+)$"));
          if (m) {
            const n = parseInt(m[1], 10);
            if (!isNaN(n) && n > maxIndexFromData) maxIndexFromData = n;
          }
        });
      } catch (e) {
        console.warn("Card10: erro ao ler dados salvos", e);
      }
    }

    while (allWraps().length < maxIndexFromData) {
      createNewRow();
    }

    // 4) Preenche o primeiro select com opções (e qualquer outro existente)
    allWraps().each(function () {
      const $sel = $(this).find("select");
      const current = $sel.val();
      fillSelectDynamic($sel, new Set(), options, otherValues, current);
    });

    // 5) Binds: qualquer mudança em fidelRel*/captaRel* dispara fullSync
    $root
      .off("change.rc_" + prefix)
      .on("change.rc_" + prefix, `select[name^="${prefix}"]`, function () {
        fullSync();
      });

    // 6) Primeira sync
    fullSync();
  }

  // ==== Bind público do Card 10 ============================================
  function bind($root) {
    if (!$root || !$root.length) return;

    GROUPS.forEach((cfg) => {
      initDynamicGroup($root, cfg);
    });
  }

  return { bind };
})();