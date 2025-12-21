// assets/js/card2-identificacao-empreendedor.js
window.Card2 = (function () {
  const NAMES = {
    fullName: "entrepreneurFullName",      // 2.1
    gender: "entrepreneurGender",          // 2.2
    birthDate: "entrepreneurBirthDate",    // 2.3 (DD/MM/AAAA)
    nationality: "entrepreneurNationality",// 2.4
    cpf: "entrepreneurCPF",                // 2.5 (000.000.000-00)
    email: "entrepreneurEmail",            // 2.6
    phone: "entrepreneurPhone"             // 2.7 ((00) 0000-0000 ou (00) 0 0000-0000)
  };

  // -------- Utils
  function onlyDigits(v) {
    return String(v || "").replace(/\D/g, "");
  }

  // -------- 2.3 Data: DD/MM/AAAA
  function maskDate(v) {
    v = onlyDigits(v).slice(0, 8);
    const d = v.substring(0, 2);
    const m = v.substring(2, 4);
    const y = v.substring(4, 8);
    if (v.length <= 2) return d;
    if (v.length <= 4) return `${d}/${m}`;
    return `${d}/${m}/${y}`;
  }

  // -------- 2.5 CPF: 000.000.000-00
  function maskCPF(v) {
    v = onlyDigits(v).slice(0, 11);
    const p1 = v.substring(0, 3);
    const p2 = v.substring(3, 6);
    const p3 = v.substring(6, 9);
    const p4 = v.substring(9, 11);
    if (v.length <= 3) return p1;
    if (v.length <= 6) return `${p1}.${p2}`;
    if (v.length <= 9) return `${p1}.${p2}.${p3}`;
    return `${p1}.${p2}.${p3}-${p4}`;
  }

  // -------- 2.7 Telefone BR:
  // 10 dígitos → (00) 0000-0000
  // 11 dígitos → (00) 0 0000-0000
  function maskPhone(v) {
    v = onlyDigits(v).slice(0, 11);
    const ddd = v.substring(0, 2);
    if (v.length <= 2) return `(${ddd}`;
    if (v.length <= 6) {
      const n1 = v.substring(2);
      return `(${ddd}) ${n1}`;
    }
    if (v.length <= 10) {
      const n1 = v.substring(2, 6);
      const n2 = v.substring(6, 10);
      return `(${ddd}) ${n1}-${n2}`;
    }
    const d9 = v.substring(2, 3);
    const n1 = v.substring(3, 7);
    const n2 = v.substring(7, 11);
    return `(${ddd}) ${d9} ${n1}-${n2}`;
  }

  // -------- Naturalidade (quando Nacionalidade = Brasil)
  function ensureNaturalidade($select) {
    const $wrapper = $select.closest(".mb-2, .col, .col-12");
    if (!$wrapper.length) return;

    // container onde vamos injetar o sub-campo
    let $extra = $wrapper.find(".extra-naturalidade-container").first();
    if (!$extra.length) {
      $extra = $(`<div class="extra-naturalidade-container mt-2"></div>`);
      $wrapper.append($extra);
    }

    const isBrasil = String($select.val()).toLowerCase() === "brasil";
    if (!isBrasil) {
      $extra.empty(); // remove o sub-campo se mudar para != Brasil
      return;
    }

    // Lista de UFs
    const UFS = [
      { value: "ac", label: "Acre" },
      { value: "al", label: "Alagoas" },
      { value: "ap", label: "Amapá" },
      { value: "am", label: "Amazonas" },
      { value: "ba", label: "Bahia" },
      { value: "ce", label: "Ceará" },
      { value: "df", label: "Distrito Federal" },
      { value: "es", label: "Espírito Santo" },
      { value: "go", label: "Goiás" },
      { value: "ma", label: "Maranhão" },
      { value: "mt", label: "Mato Grosso" },
      { value: "ms", label: "Mato Grosso do Sul" },
      { value: "mg", label: "Minas Gerais" },
      { value: "pa", label: "Pará" },
      { value: "pb", label: "Paraíba" },
      { value: "pr", label: "Paraná" },
      { value: "pe", label: "Pernambuco" },
      { value: "pi", label: "Piauí" },
      { value: "rj", label: "Rio de Janeiro" },
      { value: "rn", label: "Rio Grande do Norte" },
      { value: "rs", label: "Rio Grande do Sul" },
      { value: "ro", label: "Rondônia" },
      { value: "rr", label: "Roraima" },
      { value: "sc", label: "Santa Catarina" },
      { value: "sp", label: "São Paulo" },
      { value: "se", label: "Sergipe" },
      { value: "to", label: "Tocantins" }
    ];

    // injeta o mini-form (label + select)
    $extra.html(`
      <label class="form-label fw-semibold d-block">Naturalidade</label>
      <select class="form-select" name="${$select.attr("name")}__naturalidade">
        <option value="" disabled selected hidden>Selecione a naturalidade</option>
        ${UFS.map(uf => `<option value="${uf.value}">${uf.label}</option>`).join("")}
      </select>
    `);
  }

  function bind($root) {
    if (!$root || !$root.length) return;
    //if ($root.data("card2Bound")) return; // evita rebind
    //$root.data("card2Bound", true);

    // 2.3 Data
    $root.on("input", `[name="${NAMES.birthDate}"]`, function () {
      this.value = maskDate(this.value);
    });

    // 2.5 CPF
    $root.on("input", `[name="${NAMES.cpf}"]`, function () {
      this.value = maskCPF(this.value);
    });

    // 2.7 Telefone
    $root.on("input", `[name="${NAMES.phone}"]`, function () {
      this.value = maskPhone(this.value);
    });

    // Naturalidade: abre quando Nacionalidade = Brasil
    $root.on("change", `select[name="${NAMES.nationality}"]`, function () {
      ensureNaturalidade($(this));
    });

    // Pequenos helpers de UX
    $root.on("blur", `[name="${NAMES.fullName}"]`, function () {
      this.value = String(this.value || "").trim();
    });
    $root.on("blur", `[name="${NAMES.email}"]`, function () {
      this.value = String(this.value || "").trim();
    });

    // Estado inicial
    $root.find(`select[name="${NAMES.nationality}"]`).trigger("change");
    $root.find(`[name="${NAMES.birthDate}"]`).trigger("input");
    $root.find(`[name="${NAMES.cpf}"]`).trigger("input");
    $root.find(`[name="${NAMES.phone}"]`).trigger("input");
  }

  return { bind, masks: { maskDate, maskCPF, maskPhone } };
})();
