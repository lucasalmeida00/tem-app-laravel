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

  // ==== Nomes/constantes 9.1 ====
  const N = {
    c1: "channels1",
    c2: "channels2",
    c3: "channels3"
  };

  const CH_OPTIONS = [
    { v: "lojas_franquias_marketing", label: "Lojas físicas, franquias ou por meio de canais de marketing como redes sociais" },
    { v: "internet", label: "Internet" },
    { v: "anuncios", label: "Anúncios" },
    { v: "vendas_diretas_feiras_parcerias", label: "vendas diretas de porta em porta, feiras locais ou parcerias com lideranças comunitárias" },
    { v: "redes_sociais", label: "Redes sociais" },
    { v: "outro", label: "Outros" }
  ];

  const SOCIALS = [
    { v: "facebook", label: "Facebook" },
    { v: "instagram", label: "Instagram" },
    { v: "twitter", label: "Twitter" },
    { v: "linkedin", label: "LinkedIn" },
    { v: "whatsapp", label: "Whatsapp" }
  ];

  // ==== Builders ====
  function buildSelect(name) {
    return $(`
      <div class="mb-2 cn-select-wrap">
        <select class="form-select" name="${name}">
          <option value="" disabled selected hidden>Selecione uma opção</option>
          ${CH_OPTIONS.map(o => `<option value="${o.v}">${o.label}</option>`).join("")}
        </select>
        <div class="mt-2 cn-socials-box d-none"></div>
        <div class="mt-2 cn-other-box d-none"></div>
      </div>
    `);
  }

  // “outro” nunca some (igual aos cards 6/7/8)
  function fillSelect($sel, chosenSet) {
    const keep = $sel.val();
    $sel.html(`<option value="" disabled selected hidden>Selecione uma opção</option>`);
    CH_OPTIONS.forEach(o => {
      if (!chosenSet.has(o.v) || o.v === "outro") {
        $sel.append(`<option value="${o.v}">${o.label}</option>`);
      }
    });
    if (keep && (!chosenSet.has(keep) || keep === "outro")) $sel.val(keep);
  }

  function renderSocialsBox($wrap, on) {
    const $box = $wrap.find(".cn-socials-box");
    if (on) {
      const checks = SOCIALS.map(s =>
        `<label class="me-3 mb-2 d-inline-flex align-items-center">
           <input type="checkbox" name="${$wrap.find("select").attr("name")}__socials[]" value="${s.v}" class="me-1"> ${s.label}
         </label>`
      ).join("");
      $box.removeClass("d-none").html(`
        <label class="form-label">Redes sociais:</label><br/>
        ${checks}
      `);
    } else {
      $box.addClass("d-none").empty();
    }
  }

  function renderOtherBox($wrap, on) {
    const $box = $wrap.find(".cn-other-box");
    if (on) {
      $box.removeClass("d-none").html(
        `<input type="text" class="form-control" name="${$wrap.find("select").attr("name")}__other" placeholder="Especifique" />`
      );
    } else {
      $box.addClass("d-none").empty();
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

  // ==== Inicialização 9.1 ====
  function initChannels($root) {
    const $s1 = $root.find(`select[name="${N.c1}"]`);
    if (!$s1.length) return;

    // garante wrapper próprio para s1
    let $w1 = $s1.closest(".cn-select-wrap");
    if (!$w1.length) {
      $w1 = $(`<div class="mb-2 cn-select-wrap"></div>`);
      $s1.after($w1);
      $w1.append($s1);
      $w1.append(`<div class="mt-2 cn-socials-box d-none"></div>`);
      $w1.append(`<div class="mt-2 cn-other-box d-none"></div>`);
    }

    const $wrap1 = wrapperFor($s1);
    const $selects = ensureContainer($wrap1, "cn-selects-container", true);

    // cria s2/s3
    let $w2 = $selects.find(`.cn-select-wrap:has(select[name="${N.c2}"])`);
    let $w3 = $selects.find(`.cn-select-wrap:has(select[name="${N.c3}"])`);
    if (!$w2.length) $w2 = buildSelect(N.c2).appendTo($selects);
    if (!$w3.length) $w3 = buildSelect(N.c3).appendTo($selects);

    const $s2 = $w2.find("select");
    const $s3 = $w3.find("select");

    // extras (redes sociais + outro) por select
    wireExtrasFor($w1);
    wireExtrasFor($w2);
    wireExtrasFor($w3);

    function getChosen() {
      const vals = [];
      const v1 = $s1.val(); if (v1) vals.push(v1);
      const v2 = $s2.val(); if (v2) vals.push(v2);
      const v3 = $s3.val(); if (v3) vals.push(v3);
      return new Set(vals);
    }

    function sync() {
      const chosen = getChosen();

      // s2/s3 excluem escolhas anteriores (mantendo “outro”)
      fillSelect($s2, new Set([...chosen].filter(v => v !== $s2.val())));
      fillSelect($s3, new Set([...chosen].filter(v => v !== $s3.val())));

      // encadeamento visual
      $w2.toggle(!!$s1.val());
      if (!$s1.val()) $s2.val("");

      $w3.toggle(!!$s2.val());
      if (!$s2.val()) $s3.val("");

      // atualizar caixas “Redes sociais” e “Especifique”
      $w1.triggerHandler("change.cnExtras");
      $w2.triggerHandler("change.cnExtras");
      $w3.triggerHandler("change.cnExtras");
    }

    // estado inicial
    fillSelect($s1, new Set());
    fillSelect($s2, new Set());
    fillSelect($s3, new Set());
    $w2.hide();
    $w3.hide();

    // binds
    $s1.off("change.cn_s1").on("change.cn_s1", sync);
    $selects.off("change.cn").on("change.cn", "select[name^='channels']", sync);

    // primeira sync
    sync();
  }

  // ==== Bind público do Card 9 ====
  function bind($root) {
    if (!$root || !$root.length) return;
    //if ($root.data("card9Bound")) return;
    //$root.data("card9Bound", true);

    initChannels($root); // 9.1
  }

  return { bind };
})();