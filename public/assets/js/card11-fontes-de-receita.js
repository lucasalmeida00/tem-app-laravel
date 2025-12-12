// assets/js/card11-fontes-de-receita.js
// Versão dinâmica: selects infinitos para 11.1 e 11.2 (outro infinito)

window.Card11 = (function () {
  // ==== Utils (padrão dos cards) ===========================================
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
  const REV_OPTS = [
    { v: "venda_direta_produtos", label: "Venda direta de produtos" },
    { v: "prestacao_servicos", label: "Prestação de serviços" },
    { v: "assinatura_adesao", label: "Modelos de assinatura ou adesão" },
    { v: "taxas_transacao_comissoes", label: "Taxas de transação ou comissões" },
    { v: "publicidade", label: "Publicidade" },
    { v: "licensiamento", label: "Licensiamento" },
    { v: "patrocinio_direto", label: "Patrocínio direito" },
    { v: "patrocinio_lei_incentivo", label: "Patrocínio via lei de incentivo" },
    { v: "doacao", label: "Doação" },
    { v: "outro", label: "Outro" }
  ];

  const MONET_OPTS = [
    { v: "venda_unica", label: "Venda única" },
    { v: "assinatura_recorrente", label: "Assinatura recorrente" },
    { v: "freemium", label: "Modelo Freemium (gratuito com opções pagas)" },
    { v: "taxa_transacao_uso", label: "Taxa pro transação de uso" },
    { v: "outro", label: "Outro" }
  ];

  // Config de cada grupo: 11.1 e 11.2
  const GROUPS = [
    {
      // 11.1 — Fontes de receita
      firstName: "revSource1",
      prefix: "revSource",
      options: REV_OPTS,
      otherValue: "outro",
      containerClass: "fr-selects-container-rev"
    },
    {
      // 11.2 — Modelos de monetização
      firstName: "monetModel1",
      prefix: "monetModel",
      options: MONET_OPTS,
      otherValue: "outro",
      containerClass: "fr-selects-container-monet"
    }
  ];

  // ==== Builders ===========================================================
  function buildSelect(name) {
    return $(`
      <div class="mb-2 fr-select-wrap">
        <select class="form-select" name="${name}">
          <option value="" disabled selected hidden>Selecione uma opção</option>
        </select>
        <div class="mt-2 fr-other-box d-none"></div>
      </div>
    `);
  }

  /**
   * Preenche um <select> com as opções disponíveis:
   * - nenhuma opção normal (≠ outro) se repete entre selects
   * - "outro" sempre disponível (pode repetir infinito)
   */
  function fillSelectDynamic($sel, chosenNonOtherSet, options, otherValue, currentValue) {
    const placeholder =
      '<option value="" disabled hidden>Selecione uma opção</option>';

    const html = options
      .map((o) => {
        const isOther = (o.v === otherValue);
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

  // ==== "Outro" (input de texto) ===========================================

  function renderOtherBox($wrap, on, otherValue) {
    const $box = $wrap.find(".fr-other-box");

    if (on) {
      // Se já existe input "outro" pra esse select, só mostra
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
      // Só esconde; não apaga o conteúdo pra não perder o texto digitado
      $box.addClass("d-none");
    }
  }

  function wireExtrasFor($wrap, otherValue) {
    const $sel = $wrap.find("select");
    function update() {
      const val = $sel.val();
      renderOtherBox($wrap, val === otherValue, otherValue);
    }
    $wrap.off("change.frOther").on("change.frOther", "select", update);
    update(); // estado inicial
  }

  // ==== Inicializador de um grupo (11.1 ou 11.2) ===========================

  function initDynamicGroup($root, cfg) {
    const { firstName, prefix, options, otherValue, containerClass } = cfg;

    const $s1 = $root.find(`select[name="${firstName}"]`);
    if (!$s1.length) return;

    // garante wrapper para o primeiro select
    let $w1 = $s1.closest(".fr-select-wrap");
    if (!$w1.length) {
      $w1 = $(`<div class="mb-2 fr-select-wrap"></div>`);
      $s1.after($w1);
      $w1.append($s1);
      $w1.append(`<div class="mt-2 fr-other-box d-none"></div>`);
    }

    const $wrap1 = wrapperFor($s1);
    const $container = ensureContainer($wrap1, containerClass, true);

    function allWraps() {
      return $w1.add($container.find(".fr-select-wrap"));
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
      wireExtrasFor($new, otherValue);
      return $new;
    }

    function cleanupTrailingEmpties() {
      let $wraps = allWraps();

      const firstVal = $wraps.eq(0).find("select").val();
      if (!firstVal) {
        // se o primeiro está vazio, remove todos os demais
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

      // 1) limpa vazios sobrando
      $wraps = cleanupTrailingEmpties();

      // 2) conjunto de opções normais já usadas
      const chosenNonOther = new Set();
      $wraps.each(function () {
        const v = $(this).find("select").val();
        if (v && v !== otherValue) {
          chosenNonOther.add(v);
        }
      });

      // 3) se o último tiver valor, cria mais um select vazio
      $wraps = allWraps();
      const $last = $wraps.last();
      const lastVal = $last.find("select").val();
      if (lastVal) {
        createNewRow();
        $wraps = allWraps();
      }

      // 4) atualiza opções de todos os selects
      $wraps.each(function () {
        const $sel = $(this).find("select");
        const current = $sel.val();
        fillSelectDynamic($sel, chosenNonOther, options, otherValue, current);
      });

      // 5) atualiza caixas "Outro" de todos
      $wraps.each(function () {
        const $w = $(this);
        const val = $w.find("select").val();
        renderOtherBox($w, val === otherValue, otherValue);
      });
    }

    // ==== Estado inicial ===================================================

    // 1) liga "Outro" no primeiro select
    wireExtrasFor($w1, otherValue);

    // 2) se já existirem selects adicionais no HTML (edição), liga extras
    $container.find(".fr-select-wrap").each(function () {
      wireExtrasFor($(this), otherValue);
    });

    // 3) cria linhas extras a partir dos dados salvos, se houver
    let maxIndexFromData = 1;
    if (window.temLoadAllData) {
      try {
        const allData = window.temLoadAllData();
        const cardData11 = allData["11"] || {};
        Object.keys(cardData11).forEach((key) => {
          const m = key.match(new RegExp("^" + prefix + "(\\d+)$"));
          if (m) {
            const n = parseInt(m[1], 10);
            if (!isNaN(n) && n > maxIndexFromData) maxIndexFromData = n;
          }
        });
      } catch (e) {
        console.warn("Card11: erro ao ler dados salvos", e);
      }
    }

    while (allWraps().length < maxIndexFromData) {
      createNewRow();
    }

    // 4) preenche selects com opções (estado inicial)
    allWraps().each(function () {
      const $sel = $(this).find("select");
      const current = $sel.val();
      fillSelectDynamic($sel, new Set(), options, otherValue, current);
    });

    // 5) qualquer mudança em revSource*/monetModel* dispara fullSync
    $root
      .off("change.fr_" + prefix)
      .on("change.fr_" + prefix, `select[name^="${prefix}"]`, function () {
        fullSync();
      });

    // 6) primeira sync
    fullSync();
  }

  // ==== Bind público do Card 11 ============================================
  function bind($root) {
    if (!$root || !$root.length) return;

    GROUPS.forEach((cfg) => {
      initDynamicGroup($root, cfg);
    });
  }

  return { bind };
})();