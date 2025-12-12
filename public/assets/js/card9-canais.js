// assets/js/card9-canais.js
// Versão atualizada: 9.1 com selects dinâmicos ilimitados

window.Card9 = (function () {
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

  // ==== Constantes 9.1 ====
  const N = {
    c1: "channels1"
  };

  const CH_OPTIONS = [
    {
      v: "lojas_franquias_marketing",
      label:
        "Lojas físicas, franquias ou por meio de canais de marketing como redes sociais",
    },
    { v: "internet", label: "Internet" },
    { v: "anuncios", label: "Anúncios" },
    {
      v: "vendas_diretas_feiras_parcerias",
      label:
        "Vendas diretas de porta em porta, feiras locais ou parcerias com lideranças comunitárias",
    },
    { v: "redes_sociais", label: "Redes sociais" },
    { v: "outro", label: "Outros" },
  ];

  const SOCIALS = [
    { v: "facebook", label: "Facebook" },
    { v: "instagram", label: "Instagram" },
    { v: "twitter", label: "Twitter" },
    { v: "linkedin", label: "LinkedIn" },
    { v: "whatsapp", label: "Whatsapp" },
  ];

  // ==== Builders ====

  function buildSelect(name) {
    return $(`
      <div class="mb-2 cn-select-wrap">
        <select class="form-select" name="${name}">
          <option value="" disabled selected hidden>Selecione uma opção</option>
          ${CH_OPTIONS.map(
            (o) => `<option value="${o.v}">${o.label}</option>`
          ).join("")}
        </select>
        <div class="mt-2 cn-socials-box d-none"></div>
        <div class="mt-2 cn-other-box d-none"></div>
      </div>
    `);
  }

  /**
   * Preenche um <select> com as opções disponíveis:
   * - Nenhuma opção (exceto "outro") pode ser repetida entre selects.
   * - "outro" NUNCA é removido, pode ser escolhido infinitas vezes.
   */
  function fillSelectDynamic($sel, chosenNonOutroSet, currentValue) {
    const placeholder =
      '<option value="" disabled hidden>Selecione uma opção</option>';

    const optionsHtml = CH_OPTIONS.map((o) => {
      if (o.v === "outro") {
        // "outro" sempre disponível
        return `<option value="${o.v}">${o.label}</option>`;
      }

      // se já foi escolhido em outro select, só deixa se for o valor atual
      if (chosenNonOutroSet.has(o.v) && o.v !== currentValue) {
        return "";
      }
      return `<option value="${o.v}">${o.label}</option>`;
    }).join("");

    $sel.html(placeholder + optionsHtml);

    if (currentValue && $sel.find(`option[value="${currentValue}"]`).length) {
      $sel.val(currentValue);
    } else {
      $sel.val("");
    }
  }

  function renderSocialsBox($wrap, on) {
        const $box = $wrap.find(".cn-socials-box");

        if (on) {
            // Se já foi renderizado antes, só mostra de novo
            if ($box.children().length) {
            $box.removeClass("d-none");
            return;
            }

            const nameBase = $wrap.find("select").attr("name") + "__socials[]";

            const checks = SOCIALS.map(
            (s) => `
            <label class="me-3 mb-2 d-inline-flex align-items-center">
                <input type="checkbox"
                    name="${nameBase}"
                    value="${s.v}"
                    class="me-1">
                ${s.label}
            </label>`
            ).join("");

            $box
            .removeClass("d-none")
            .html(`<label class="form-label">Redes sociais:</label><br/>${checks}`);
        } else {
            // Só esconde; NÃO apaga o conteúdo pra não perder os checks
            $box.addClass("d-none");
        }
    }

    function renderOtherBox($wrap, on) {
        const $box = $wrap.find(".cn-other-box");

        if (on) {
            // Se já existe um input "outro" pra esse select, só mostra de novo
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
            // Só esconde; não limpa o value pra não perder o texto
            $box.addClass("d-none");
        }
    }


  function wireExtrasFor($wrap) {
    const $sel = $wrap.find("select");
    function update() {
      const val = $sel.val();
      renderSocialsBox($wrap, val === "redes_sociais");
      renderOtherBox($wrap, val === "outro");
    }
    $wrap.off("change.cnExtras").on("change.cnExtras", "select", update);
    update(); // estado inicial
  }

  // Calcula o próximo índice para "channelsX"
  function getNextIndex($container) {
    let next = $container.data("cnNextIndex");
    if (next) return next;

    let max = 1;
    $container
      .find("select[name^='channels']")
      .each(function () {
        const name = this.name || "";
        const m = name.match(/^channels(\d+)$/);
        if (m) {
          const n = parseInt(m[1], 10);
          if (!isNaN(n) && n > max) max = n;
        }
      });

    next = max + 1;
    $container.data("cnNextIndex", next);
    return next;
  }

  function bumpNextIndex($container) {
    const current = getNextIndex($container);
    $container.data("cnNextIndex", current + 1);
    return current;
  }

  // ==== Lógica dinâmica 9.1 (infinito) ====

  function initChannels($root) {
    const $s1 = $root.find(`select[name="${N.c1}"]`);
    if (!$s1.length) return;

    // Garante wrapper próprio para s1
    let $w1 = $s1.closest(".cn-select-wrap");
    if (!$w1.length) {
      $w1 = $(
        `<div class="mb-2 cn-select-wrap"></div>`
      );
      $s1.after($w1);
      $w1.append($s1);
      $w1.append(`<div class="mt-2 cn-socials-box d-none"></div>`);
      $w1.append(`<div class="mt-2 cn-other-box d-none"></div>`);
    }

    const $wrap1 = wrapperFor($s1); // card / bloco
    const $dynContainer = ensureContainer(
      $wrap1,
      "cn-selects-container",
      true
    );

    // função pra pegar TODOS os .cn-select-wrap (channels1 + dinâmicos)
    function allWraps() {
      return $w1.add($dynContainer.find(".cn-select-wrap"));
    }

    // Cria uma nova linha dinâmica (channelsX)
    function createNewRow() {
      const idx = bumpNextIndex($dynContainer);
      const name = `channels${idx}`;
      const $new = buildSelect(name).appendTo($dynContainer);
      wireExtrasFor($new);
      return $new;
    }

    // Remove selects vazios "sobrando", deixando no máximo 1 vazio além do primeiro
    function cleanupTrailingEmpties() {
      let $wraps = allWraps();

      // Se o primeiro (channels1) estiver vazio, apaga todo o resto
      const firstVal = $wraps.eq(0).find("select").val();
      if (!firstVal) {
        for (let i = $wraps.length - 1; i >= 1; i--) {
          $wraps.eq(i).remove();
        }
        $wraps = allWraps();
        return $wraps;
      }

      // A partir do segundo, mantém apenas o primeiro vazio e remove os demais vazios
      let firstEmptyIndex = -1;
      $wraps.each(function (idx) {
        if (idx === 0) return; // ignora o primeiro
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

      // 1) Limpa sobras vazias
      $wraps = cleanupTrailingEmpties();

      // 2) Calcula quais opções (exceto "outro") já foram usadas
      const chosenNonOutro = new Set();
      $wraps.each(function () {
        const v = $(this).find("select").val();
        if (v && v !== "outro") chosenNonOutro.add(v);
      });

      // 3) Cria nova linha se o último select tiver valor
      $wraps = allWraps();
      const $last = $wraps.last();
      const lastVal = $last.find("select").val();

      if (lastVal) {
        // Sempre que o último tiver valor, cria mais um vazio embaixo.
        createNewRow();
        $wraps = allWraps();
      }

      // 4) Preenche opções de todos os selects respeitando chosenNonOutro
      $wraps.each(function () {
        const $sel = $(this).find("select");
        const current = $sel.val();
        fillSelectDynamic($sel, chosenNonOutro, current);
      });

      // 5) Atualiza caixas de "Redes sociais" e "Outro" em todos
      $wraps.each(function () {
        const $w = $(this);
        const $sel = $w.find("select");
        const val = $sel.val();
        renderSocialsBox($w, val === "redes_sociais");
        renderOtherBox($w, val === "outro");
      });
    }

    // ==== Estado inicial ====
    wireExtrasFor($w1);

    // Se já houver selects dinâmicos criados no HTML (edição), registra extras
    $dynContainer.find(".cn-select-wrap").each(function () {
      wireExtrasFor($(this));
    });

    // Garante pelo menos um select extra inicial (channels2) se precisar
    if (!$dynContainer.find(".cn-select-wrap").length) {
      createNewRow();
    }

    // Primeira sync (considerando valores vindos do servidor, se houver)
    fullSync();

    // Binds de mudança em QUALQUER select de canais
    $root
      .off("change.cn_all")
      .on("change.cn_all", "select[name^='channels']", function () {
        fullSync();
      });
  }

  // ==== Bind público do Card 9 ====
  function bind($root) {
    if (!$root || !$root.length) return;
    initChannels($root);
  }

  return { bind };
})();