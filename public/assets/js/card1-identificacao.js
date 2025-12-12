window.Card1 = (function () {
  const NAMES = {
    formal: "formalizedCompany",
    cnpj: "cnpj",
    corporateName: "corporateName",
    nature: "companyNature",
    sector: "companySector",
    location: "companyLocation",
    area: "operatingArea"
  };

  // ---- util: pega label do campo (por id/for ou vizinho) ----
  function getLabel($root, $input) {
    const id = $input.attr("id");
    if (id) {
      const $byFor = $root.find(`label[for="${id}"]`).first();
      if ($byFor.length) return $byFor;
    }
    const $near = $input.closest(".mb-2").find("label").first();
    return $near.length ? $near : $();
  }

  // ---- A) Formal → asterisco em CNPJ e Razão Social ----
  function updateFormalAsterisk($root) {
    const isFormal = $root.find(`input[name="${NAMES.formal}"]:checked`).val() === "true";
    [
      { name: NAMES.cnpj, label: "CNPJ" },
      { name: NAMES.corporateName, label: "Razão Social" }
    ].forEach(({ name }) => {
      const $inp = $root.find(`[name="${name}"]`).first();
      if (!$inp.length) return;
      const $label = getLabel($root, $inp);
      // remove antigos
      $label.find(".asterisk-dynamic").remove();
      if (isFormal) {
        $label.append(`<span class="asterisk-dynamic text-danger ms-1">*</span>`);
        $inp.attr("required", "true");
      } else {
        $inp.removeAttr("required");
      }
    });
  }

  // ---- B) Máscara CNPJ 00.000.000/0001-00 ----
  function maskCNPJ(v) {
    v = String(v || "").replace(/\D/g, "").slice(0, 14);
    const p = [];
    if (v.length > 0)  p.push(v.substring(0, 2));
    if (v.length > 2)  p.push(v.substring(2, 5));
    if (v.length > 5)  p.push(v.substring(5, 8));
    if (v.length > 8)  p.push(v.substring(8, 12));
    const suf = v.length > 12 ? v.substring(12, 14) : "";
    if (v.length <= 2) return v;
    if (v.length <= 5) return `${p[0]}.${p[1]}`;
    if (v.length <= 8) return `${p[0]}.${p[1]}.${p[2]}`;
    if (v.length <= 12) return `${p[0]}.${p[1]}.${p[2]}/${p[3]}`;
    return `${p[0]}.${p[1]}.${p[2]}/${p[3]}-${suf}`;
  }

  // ---- C) Outro → Especifique (genérico) ----
  function ensureSpecify($select) {
    const $wrapper = $select.closest(".mb-2, .col, .col-12");
    if (!$wrapper.length) return;

    let $extra = $wrapper.find(".extra-specify-container").first();
    if (!$extra.length) {
      $extra = $(`<div class="extra-specify-container mt-2"></div>`);
      $wrapper.append($extra);
    }

    const isOther = String($select.val()).toLowerCase() === "outro";
    if (!isOther) {
      $extra.empty();
      return;
    }

    $extra.html(`
      <label class="form-label fw-semibold d-block">Especifique</label>
      <input type="text" class="form-control"
             name="${$select.attr("name")}__other"
             placeholder="Descreva aqui" />
    `);
  }

  // ---- Bind delegado (uma vez por container) ----
  function bind($root) {
    if (!$root || !$root.length) return;

    // evita re-bind (marca no dataset do container)
    //if ($root.data("card1Bound")) return;
    //$root.data("card1Bound", true);

    // Formal radio change
    $root.on("change", `input[name="${NAMES.formal}"]`, function () {
      updateFormalAsterisk($root);
    });

    // CNPJ mask
    $root.on("input", `[name="${NAMES.cnpj}"]`, function () {
      this.value = maskCNPJ(this.value);
    });

    // Selects com "Outro" (Natureza, Setor, Localização, Área)
    const selects = [NAMES.nature, NAMES.sector, NAMES.location, NAMES.area];
    selects.forEach((n) => {
      $root.on("change", `select[name="${n}"]`, function () {
        ensureSpecify($(this));
      });
    });

    // ---- Estado inicial (dispara os handlers) ----
    updateFormalAsterisk($root);
    selects.forEach((n) => $root.find(`select[name="${n}"]`).trigger("change"));
    $root.find(`[name="${NAMES.cnpj}"]`).trigger("input");
  }

  return { bind };
})();
