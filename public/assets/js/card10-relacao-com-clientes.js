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
      <div class="mb-1 rc-select-wrap card-select-row">
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
   * - Nenhuma opção pode ser repetida entre selects (incluindo "outro"/"outros").
   * - Se uma opção já foi escolhida em outro select, só aparece se for o valor atual deste select.
   * Retorna true se há opções disponíveis, false caso contrário.
   */
  function fillSelectDynamic($sel, chosenSet, options, otherValues, currentValue) {
    const placeholder =
      '<option value="" disabled hidden>Selecione uma opção</option>';

    const html = options
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

  // ==== "Outro" (mesma ideia do Card 9) ====================================
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
      $w1 = $(`<div class="mb-1 rc-select-wrap card-select-row"></div>`);
      const $rowDiv = $(`<div class="row g-2 align-items-center"></div>`);
      
      // Coluna do select
      const $colSelect = $(`<div class="col-auto" style="min-width: 250px; max-width: 350px;"></div>`);
      $s1.after($w1);
      $s1.appendTo($colSelect);
      
      // Coluna do input "outro"
      const $colOther = $(`<div class="col extra-${firstName}-other-inline d-none"></div>`);
      $colOther.html(`<input type="text" class="form-control" name="${firstName}__other" placeholder="Especifique" style="width: 100%;">`);
      
      $rowDiv.append($colSelect, $colOther);
      $w1.append($rowDiv);
    }

    const $wrap1 = wrapperFor($s1);
    $wrap1.removeClass("mb-2").addClass("mb-1");
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

      // 4) Calcula quais opções já foram usadas (incluindo "outro"/"outros")
      const chosen = new Set();
      preservedValues.forEach(v => {
        if (v) chosen.add(v);
      });

      // 5) Se o último tiver valor, cria mais um select vazio embaixo
      $wraps = allWraps();
      const lastVal = preservedValues[preservedValues.length - 1];
      if (lastVal) {
        createNewRow();
        $wraps = allWraps();
        // Adiciona valor vazio para o novo select criado
        preservedValues.push("");
      }

      // 6) Repreenche opções de todos os selects respeitando chosen (incluindo "outro"/"outros")
      // e restaura os valores preservados
      $wraps.each(function (idx) {
        const $wrap = $(this);
        const $sel = $wrap.find("select");
        const savedValue = preservedValues[idx] || "";
        const hasOptions = fillSelectDynamic($sel, chosen, options, otherValues, savedValue);
        
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

  // ==== Bind público do Card 10
  function bind($root) {
    if (!$root || !$root.length) return;

    GROUPS.forEach((cfg) => {
      initDynamicGroup($root, cfg);
    });
  }

  return { bind };
})();