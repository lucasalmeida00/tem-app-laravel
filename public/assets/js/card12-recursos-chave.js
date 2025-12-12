// assets/js/card12-recursos-chave.js
// Versão dinâmica: selects infinitos para Recursos-Chave (12.1)

window.Card12 = (function () {
  // ==== Utils (padrão dos outros cards) ===================================
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

  // ==== Opções (espelho do schema) ========================================
  const RC_OPTIONS = [
    { v: "capital_financeiro", label: "Capital financeiro (próprio ou de investidores)" },
    { v: "doadores", label: "Doadores" },
    { v: "patrocinadores_diretos", label: "Patrocinadores diretos" },
    { v: "patrocinadores_lei_incentivo", label: "Patrocinadores via lei de incentivo" },
    { v: "financiamento_coletivo", label: "Financiamento coletivo" },
    { v: "pessoas_assalariadas", label: "Pessoas assalariadas (equipe, expertise)" },
    { v: "voluntarios", label: "Voluntários" },
    { v: "conhecimento_comunidade", label: "Conhecimento sobre a comunidade e seus desafios" },
    { v: "parcerias_comercios_organizacoes", label: "Parcerias com comércios ou organizações locais" },
    { v: "mao_de_obra_local", label: "Mão de obra local (moradores da favela/comunidade)" },
    { v: "tecnologia", label: "Tecnologia (aplicativos, sites)" },
    { v: "infraestrutura", label: "Infraestrutura (prédio, lojas, espaço físico, equipamentos)" },
    { v: "pessoas_equipe", label: "Pessoas (Equipe, expertise)" },
    { v: "propriedade_intelectual", label: "Propriedade intelectual (patentes, marcas)" },
    { v: "outro", label: "Outro" },
  ];

  const FIRST_NAME = "keyRes1";
  const PREFIX = "keyRes";
  const OTHER_VALUE = "outro";

  // ==== Builders ===========================================================
  function buildSelect(name) {
    return $(`
      <div class="mb-2 rk-select-wrap">
        <select class="form-select" name="${name}">
          <option value="" disabled selected hidden>Selecione uma opção</option>
        </select>
        <div class="mt-2 rk-other-box d-none"></div>
      </div>
    `);
  }

  /**
   * Preenche um <select> com as opções disponíveis:
   * - nenhuma opção normal (≠ outro) é repetida entre selects
   * - "outro" sempre disponível (pode repetir infinito)
   */
  function fillSelectDynamic($sel, chosenNonOtherSet, currentValue) {
    const placeholder =
      '<option value="" disabled hidden>Selecione uma opção</option>';

    const html = RC_OPTIONS
      .map((o) => {
        const isOther = (o.v === OTHER_VALUE);
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

  // ==== "Outro" (input de texto, infinito) =================================

  function renderOtherBox($wrap, on) {
    const $box = $wrap.find(".rk-other-box");

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
      // Só esconde; NÃO apaga o conteúdo pra não perder o texto digitado
      $box.addClass("d-none");
    }
  }

  function wireOtherFor($wrap) {
    const $sel = $wrap.find("select");
    function update() {
      const val = $sel.val();
      renderOtherBox($wrap, val === OTHER_VALUE);
    }
    $wrap.off("change.rkOther").on("change.rkOther", "select", update);
    update(); // estado inicial
  }

  // ==== Inicialização dinâmica (selects infinitos) =========================

  function initKeyResources($root) {
    const $s1 = $root.find(`select[name="${FIRST_NAME}"]`);
    if (!$s1.length) return;

    // garante wrapper para o primeiro select
    let $w1 = $s1.closest(".rk-select-wrap");
    if (!$w1.length) {
      $w1 = $(`<div class="mb-2 rk-select-wrap"></div>`);
      $s1.after($w1);
      $w1.append($s1);
      $w1.append(`<div class="mt-2 rk-other-box d-none"></div>`);
    }

    const $wrap1 = wrapperFor($s1);
    const $container = ensureContainer($wrap1, "rk-selects-container", true);

    function allWraps() {
      return $w1.add($container.find(".rk-select-wrap"));
    }

    function getNextIndex() {
      let max = 0;
      allWraps().each(function () {
        const name = $(this).find("select").attr("name") || "";
        const m = name.match(/^keyRes(\d+)$/);
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
      const name = `${PREFIX}${idx}`;
      const $new = buildSelect(name).appendTo($container);
      wireOtherFor($new);
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
        if (v && v !== OTHER_VALUE) {
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
        fillSelectDynamic($sel, chosenNonOther, current);
      });

      // 5) atualiza caixas "Outro" de todos
      $wraps.each(function () {
        const $w = $(this);
        const val = $w.find("select").val();
        renderOtherBox($w, val === OTHER_VALUE);
      });
    }

    // ==== Estado inicial ===================================================

    // 1) "Outro" no primeiro select
    wireOtherFor($w1);

    // 2) Se já existirem selects adicionais no HTML, liga extras neles
    $container.find(".rk-select-wrap").each(function () {
      wireOtherFor($(this));
    });

    // 3) Cria linhas extras a partir dos dados salvos, se houver
    let maxIndexFromData = 1;
    if (window.temLoadAllData) {
      try {
        const allData = window.temLoadAllData();
        const cardData12 = allData["12"] || {};
        Object.keys(cardData12).forEach((key) => {
          const m = key.match(/^keyRes(\d+)$/);
          if (m) {
            const n = parseInt(m[1], 10);
            if (!isNaN(n) && n > maxIndexFromData) maxIndexFromData = n;
          }
        });
      } catch (e) {
        console.warn("Card12: erro ao ler dados salvos", e);
      }
    }

    while (allWraps().length < maxIndexFromData) {
      createNewRow();
    }

    // 4) Preenche selects com opções (estado inicial)
    allWraps().each(function () {
      const $sel = $(this).find("select");
      const current = $sel.val();
      fillSelectDynamic($sel, new Set(), current);
    });

    // 5) Binds: qualquer mudança em keyRes* dispara fullSync
    $root
      .off("change.rk_keyRes")
      .on("change.rk_keyRes", `select[name^="${PREFIX}"]`, function () {
        fullSync();
      });

    // 6) Primeira sync
    fullSync();
  }

  // ==== Bind público do Card 12 ============================================
  function bind($root) {
    if (!$root || !$root.length) return;
    initKeyResources($root); // 12.1
  }

  return { bind };
})();