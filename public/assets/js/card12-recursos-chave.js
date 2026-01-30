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
      <div class="mb-3 rk-select-wrap">
        <div class="row g-2 align-items-center">
          <div class="col-auto" style="min-width: 250px; max-width: 350px;">
            <select class="form-select" name="${name}">
              <option value="" disabled selected hidden>Selecione uma opção</option>
            </select>
          </div>
          <div class="col extra-${name}-other-inline d-none">
            <input type="text" class="form-control" name="${name}__other" placeholder="Especifique" style="width: 100%;">
          </div>
        </div>
      </div>
    `);
  }

  /**
   * Preenche um <select> com as opções disponíveis:
   * - Nenhuma opção pode ser repetida entre selects (incluindo "outro").
   * - Se uma opção já foi escolhida em outro select, só aparece se for o valor atual deste select.
   * Retorna true se há opções disponíveis, false caso contrário.
   */
  function fillSelectDynamic($sel, chosenSet, currentValue) {
    const placeholder =
      '<option value="" disabled hidden>Selecione uma opção</option>';

    const html = RC_OPTIONS
      .map((o) => {
        // se já foi escolhido em outro select, só deixa se for o valor atual
        if (chosenSet.has(o.v) && o.v !== currentValue) {
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

    // Verifica se há opções disponíveis (além do placeholder)
    const hasOptions = $sel.find('option:not([value=""])').length > 0;
    return hasOptions;
  }

  // ==== "Outro" (input de texto, infinito) =================================

  function renderOtherBox($wrap, on) {
    const $sel = $wrap.find("select");
    const name = $sel.attr("name");
    const $box = $wrap.find(`.extra-${name}-other-inline`);

    if (on) {
      $box.removeClass("d-none");
    } else {
      $box.addClass("d-none");
      // Limpa o valor do input quando "outro" é desmarcado
      $box.find("input").val("");
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
      $w1 = $(`<div class="mb-3 rk-select-wrap"></div>`);
      const $rowDiv = $(`<div class="row g-2 align-items-center"></div>`);
      
      // Coluna do select
      const $colSelect = $(`<div class="col-auto" style="min-width: 250px; max-width: 350px;"></div>`);
      $s1.after($w1);
      $s1.appendTo($colSelect);
      
      // Botão X para limpar
      // Coluna do input "outro"
      const $colOther = $(`<div class="col extra-${FIRST_NAME}-other-inline d-none"></div>`);
      $colOther.html(`<input type="text" class="form-control" name="${FIRST_NAME}__other" placeholder="Especifique" style="width: 100%;">`);
      
      $rowDiv.append($colSelect, $colOther);
      $w1.append($rowDiv);
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

      // 1) PRESERVA todos os valores ANTES de qualquer atualização
      const savedValues = [];
      $wraps.each(function () {
        const $sel = $(this).find("select");
        savedValues.push($sel.val() || "");
      });

      // 2) Limpa vazios sobrando (após preservar valores)
      $wraps = cleanupTrailingEmpties();
      
      // 3) Recalcula savedValues após limpeza (mantém apenas os valores dos selects que restaram)
      const preservedValues = [];
      $wraps.each(function (idx) {
        // Se o índice existe no array salvo, usa ele; senão usa vazio
        preservedValues.push(savedValues[idx] || "");
      });

      // 4) Calcula quais opções já foram usadas (incluindo "outro")
      const chosen = new Set();
      preservedValues.forEach(v => {
        if (v) chosen.add(v);
      });

      // 5) Se o último tiver valor, cria mais um select vazio
      $wraps = allWraps();
      const lastVal = preservedValues[preservedValues.length - 1];
      if (lastVal) {
        createNewRow();
        $wraps = allWraps();
        // Adiciona valor vazio para o novo select criado
        preservedValues.push("");
      }

      // 6) Atualiza opções de todos os selects respeitando chosen (incluindo "outro")
      // e restaura os valores preservados
      $wraps.each(function (idx) {
        const $wrap = $(this);
        const $sel = $wrap.find("select");
        const savedValue = preservedValues[idx] || "";
        const hasOptions = fillSelectDynamic($sel, chosen, savedValue);
        
        // Oculta o wrapper se não houver opções disponíveis
        if (!hasOptions) {
          $wrap.hide();
        } else {
          $wrap.show();
        }
      });

      // 7) Atualiza caixas "Outro" de todos
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