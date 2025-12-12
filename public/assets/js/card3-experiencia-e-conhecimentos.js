// assets/js/card3-experiencia-e-conhecimentos.js
window.Card3 = (function () {
  const N = {
    education: "entrepreneurEducation",           // 3.1
    role: "entrepreneurRole",                     // 3.2
    functions: "entrepreneurFunctions",           // 3.3 (checkbox group)
    hasExp: "hasEntrepreneurExperience",          // 3.4 (sim|nao)
    motivation: "startMotivation",                // 3.5
    situation: "situationWhenStarted",            // 3.6
    steps1: "firstSteps1",                        // 3.7 (steps2/steps3 serão injetados)
    innovation: "postCreationInnovation"          // 3.8
  };

  // ============== helpers genéricos ==============
  function ensureContainer($wrapper, cls) {
    let $extra = $wrapper.find(`.${cls}`).first();
    if (!$extra.length) {
      $extra = $(`<div class="${cls} mt-2"></div>`);
      $wrapper.append($extra);
    }
    return $extra;
  }

  function wrapperFor($el) {
    return $el.closest(".mb-2, .col, .col-12");
  }

  function isOtherValue(v) {
    return String(v || "").toLowerCase() === "outro";
  }

  // ============== 3.2 — Outro → especifique (select) ==============
  function ensureSpecifySelect($select, label = "Especifique o cargo", nameSuffix = "__other") {
    const $wrapper = wrapperFor($select);
    if (!$wrapper.length) return;
    const $extra = ensureContainer($wrapper, "extra-specify-container");
    if (isOtherValue($select.val())) {
      $extra.html(`
        <label class="form-label fw-semibold d-block">${label}</label>
        <input type="text" class="form-control" name="${$select.attr("name")}${nameSuffix}" placeholder="especifique o cargo" />
      `);
    } else {
      $extra.empty();
    }
  }

  // ============== 3.3 — Outro → especifique (checkbox group) ==============
  function ensureSpecifyCheckbox($root) {
    const $first = $root.find(`input[type="checkbox"][name="${N.functions}"]`).first();
    if (!$first.length) return;

    // container que agrupa TODOS os checkboxes
    const $boxes = $first.closest(".d-flex.flex-wrap.gap-3");

    // cria (ou acha) o holder logo DEPOIS do grupo de checkboxes
    let $extra = $boxes.next(".extra-specify-functions");
    if (!$extra.length) {
      $extra = $(`<div class="extra-specify-functions mt-2"></div>`);
      $boxes.after($extra); // 👉 injeta abaixo do último checkbox
    }

    const outroChecked = $root
      .find(`input[type="checkbox"][name="${N.functions}"][value="outro"]`)
      .is(":checked");

    if (outroChecked) {
      $extra.html(`
        <label class="form-label fw-semibold d-block">Especifique a função</label>
        <input type="text" class="form-control" name="${N.functions}__other" placeholder="especifique a função" />
      `);
    } else {
      $extra.empty();
    }
  }

  // ============== 3.4 — Histórico como empreendedor ==============
  function renderHistory($root) {
    const val = $root.find(`input[name="${N.hasExp}"]:checked`).val();
    const $wrap = wrapperFor($root.find(`input[name="${N.hasExp}"]`).first());
    if (!$wrap.length) return;
    const $extra = ensureContainer($wrap, "extra-history");

    if (val === "sim") {
      $extra.html(`
        <div class="mb-2">
          <label class="form-label fw-semibold d-block">Comentário adicional:</label>
          <input type="text" class="form-control" name="experienceCommentSim" placeholder="Digite um comentário"/>
        </div>

        <div class="mb-2">
          <label class="form-label fw-semibold d-block">Quantas vezes já empreendeu?</label>
          <input type="number" class="form-control" name="experienceTimes" placeholder="Informe a quantidade"/>
        </div>

        <div class="mb-2">
          <label class="form-label fw-semibold d-block">Em que área/setor?</label>
          <input type="text" class="form-control" name="experienceSector" placeholder="Informe o setor de empreendimentos anteriores"/>
        </div>

        <div class="mb-2">
          <label class="form-label fw-semibold d-block">Você já ENCERROU empreendimentos?</label>
          <div>
            <label class="me-3"><input type="radio" name="hasClosedBusinesses" value="sim"> Sim</label>
            <label><input type="radio" name="hasClosedBusinesses" value="nao" checked> Não</label>
          </div>
          <div class="extra-closed mt-2"></div>
        </div>

        <div class="mb-2">
          <label class="form-label fw-semibold d-block">Você já vendeu empreendimentos?</label>
          <div>
            <label class="me-3"><input type="radio" name="hasSoldBusinesses" value="sim"> Sim</label>
            <label><input type="radio" name="hasSoldBusinesses" value="nao" checked> Não</label>
          </div>
          <div class="extra-sold mt-2"></div>
        </div>
      `);

      // binds locais (delegados ao container do card)
      // encerrou?
      $root.off("change.hasClosed").on("change.hasClosed", `input[name="hasClosedBusinesses"]`, function () {
        const $c = $extra.find(".extra-closed");
        if (this.value === "sim") {
          $c.html(`
            <label class="form-label fw-semibold d-block">Quantos empreendimentos encerrou?</label>
            <input type="number" class="form-control" name="closedBusinessesCount" placeholder="Informe a quantidade"/>
          `);
        } else {
          $c.empty();
        }
      }).find(`input[name="hasClosedBusinesses"][value="nao"]`).trigger("change");

      // vendeu?
      $root.off("change.hasSold").on("change.hasSold", `input[name="hasSoldBusinesses"]`, function () {
        const $s = $extra.find(".extra-sold");
        if (this.value === "sim") {
          $s.html(`
            <div class="mb-2">
              <label class="form-label fw-semibold d-block">Quantos empreendimentos vendeu?</label>
              <input type="number" class="form-control" name="soldBusinessesCount" placeholder="Informe a quantidade"/>
            </div>
            <div>
              <label class="form-label fw-semibold d-block">Em que área/setor vendeu?</label>
              <input type="text" class="form-control" name="soldBusinessesSector" placeholder="Informe o setor de empreendimentos vendidos"/>
            </div>
          `);
        } else {
          $s.empty();
        }
      }).find(`input[name="hasSoldBusinesses"][value="nao"]`).trigger("change");

    } else if (val === "nao") {
      $extra.html(`
        <label class="form-label fw-semibold d-block">Comentário adicional:</label>
        <input type="text" class="form-control" name="experienceCommentNao" placeholder="Digite um comentário"/>
      `);
    } else {
      $extra.empty();
    }
  }

  // ============== 3.5 — “Justifique sua resposta” sempre aparece ==============
  function ensureJustification($select) {
    const $wrapper = wrapperFor($select);
    if (!$wrapper.length) return;
    const $extra = ensureContainer($wrapper, "extra-justification");

    const hasValue = !!$select.val();
    if (!hasValue) {
      $extra.empty();     // escondido quando nada selecionado
      return;
    }

    // renderiza se ainda não houver conteúdo
    if (!$extra.children().length) {
      $extra.html(`
        <label class="form-label fw-semibold d-block">Justifique sua resposta:</label>
        <textarea class="form-control" name="startMotivationJustification" placeholder="justificativa" rows="4"></textarea>
      `);
    }
  }

  // ============== 3.6 — Outro → especifique (select) ==============
  function ensureSpecifySituation($select) {
    const $wrapper = wrapperFor($select);
    if (!$wrapper.length) return;
    const $extra = ensureContainer($wrapper, "extra-specify-situation");
    if (isOtherValue($select.val())) {
      $extra.html(`
        <label class="form-label fw-semibold d-block">Especifique a situação</label>
        <input type="text" class="form-control" name="${$select.attr("name")}__other" placeholder="Especifique a situação"/>
      `);
    } else {
      $extra.empty();
    }
  }

  function ensureOtherForStep($select, baseName) {
    // pega a caixa extra que está logo DEPOIS do select atual
    const $extra = $select.nextAll(`.extra-${baseName}-other`).first();
    if (!$extra.length) return;

    if (String($select.val()) === "outro") {
      $extra.html(`
        <input type="text" class="form-control"
              name="${baseName}__other"
              placeholder="especifique"
              style="margin-bottom:10px;" />
      `);
    } else {
      $extra.empty();
    }
  }


  // ============== 3.7 — 3 selects encadeados (com “Outro” especial) ==============
  const STEP_OPTIONS = [
    { value: "impulso", label: "Foi um impulso e comecei imediatamente" },
    { value: "considerando_possibilidades", label: "Passei algum tempo considerando possibilidades" },
    { value: "aos_poucos_ajustes", label: "Comecei aos poucos e fui ajustando conforme necessário" },
    { value: "conversei_setor", label: "Conversei com pessoas do setor" },
    { value: "conversei_amigos_familiares", label: "Conversei com amigos e/ou familiares" },
    { value: "pesquisei_bastante", label: "Pesquisei bastante antes de iniciar" },
    { value: "entender_mercado_clientes", label: "Busquei entender o mercado e as necessidades dos clientes" },
    { value: "recursos_informacoes", label: "Busquei recursos e informações" },
    { value: "estrategias_iniciais", label: "Desenvolvi estratégias iniciais, estudei várias alternativas" },
    { value: "informal_ate_formalizar", label: "Fiz algo mais informal até formalizar" },
    { value: "outro", label: "Outro" }
  ];

  function renderStepSelect($root, idx, chosenSet) {
    // idx = 1|2|3
    const baseName = `firstSteps${idx}`;
    const prev = idx > 1 ? idx - 1 : null;

    const $firstWrap = wrapperFor($root.find(`[name="${N.steps1}"]`).first());
    if (!$firstWrap.length) return;
    const $container = ensureContainer($firstWrap, "extra-steps-container");

    // garante placeholders
    const placeholders = {
      1: "Selecione uma opção",
      2: "Selecione uma opção",
      3: "Selecione uma opção"
    };

    // cria o select se não existir
    let $sel = $container.find(`select[name="${baseName}"]`);
    if (!$sel.length) {
      $container.append(`
        <select class="form-select mb-2" name="${baseName}">
          <option value="" disabled selected hidden>${placeholders[idx]}</option>
        </select>
        <div class="extra-${baseName}-other mt-2"></div>
      `);
      $sel = $container.find(`select[name="${baseName}"]`);
    }

    // monta options filtrando os já escolhidos (exceto "outro")
    const options = STEP_OPTIONS.filter(o => !chosenSet.has(o.value) || o.value === "outro");
    $sel.empty().append(`<option value="" disabled selected hidden>${placeholders[idx]}</option>`);
    options.forEach(o => $sel.append(`<option value="${o.value}">${o.label}</option>`));

    // preserva valor se ainda existir
    const prevVal = $sel.data("lastVal");
    if (prevVal && options.some(o => o.value === prevVal)) {
      $sel.val(prevVal);
    } else {
      $sel.val("");
      $sel.data("lastVal", "");
    }

    // bind change p/ abrir próximo e lidar com Outro
    const otherBoxSelector = `.extra-${baseName}-other`;
    $sel.off("change.step").on("change.step", function () {
      const v = $(this).val();
      $sel.data("lastVal", v || "");
      
       ensureOtherForStep($sel, baseName);

      // recalcula conjunto e renderiza o próximo
      const newChosen = new Set([
        $container.find(`select[name="firstSteps1"]`).val(),
        $container.find(`select[name="firstSteps2"]`).val()
      ].filter(Boolean));

      if (idx < 3) {
        renderStepSelect($root, idx + 1, newChosen);
      }
    });

    ensureOtherForStep($sel, baseName);
  }

  function initStepsChain($root) {
    const $sel1 = $root.find(`select[name="${N.steps1}"]`);
    if (!$sel1.length) return;

    // container ÚNICO logo abaixo do primeiro select
    const $wrap = wrapperFor($sel1);
    const $container = ensureContainer($wrap, "extra-steps-container"); // holder comum

    // helper local p/ o "outro" do primeiro select (renderiza DENTRO do $container)
    function ensureOtherForStep1() {
      let $extra1 = $container.find(`.extra-firstSteps1-other`);
      if (!$extra1.length) {
        $extra1 = $(`<div class="extra-firstSteps1-other mt-2"></div>`);
        $container.prepend($extra1);
      }
      if (String($sel1.val()) === "outro") {
        $extra1.html(`
          <input type="text" class="form-control" name="firstSteps1__other" placeholder="especifique" style="margin-bottom:10px;" />
        `);
      } else {
        $extra1.empty();
      }
    }


    // bind do 1º select
    $sel1.off("change.steps1").on("change.steps1", function () {
      const v = $(this).val();

      // 1) atualiza “Outro” do primeiro DENTRO do container
      ensureOtherForStep1();

      // 2) limpa tudo que é passo 2/3 (mas mantém o extra do passo 1 no topo)
      $container.find(`select[name="firstSteps2"], select[name="firstSteps3"], .extra-firstSteps2-other, .extra-firstSteps3-other`).remove();

      // 3) só cria Passo 2 se houver escolha no primeiro
      if (!v) return;

      const chosen = new Set([v]);
      renderStepSelect($root, 2, chosen); // Passo 2 é append após o extra do passo 1
    });

    // estado inicial: não cria nada, só garante "Outro" do primeiro se já houver valor
    ensureOtherForStep1();
  }

  // ============== bind principal ==============
  function bind($root) {
    if (!$root || !$root.length) return;
    //if ($root.data("card3Bound")) return;
    //$root.data("card3Bound", true);

    // 3.2 Outro (select)
    $root.on("change", `select[name="${N.role}"]`, function () {
      ensureSpecifySelect($(this));
    }).find(`select[name="${N.role}"]`).trigger("change");

    // 3.3 Outro (checkbox)
    $root.on("change", `input[type="checkbox"][name="${N.functions}"]`, function () {
      ensureSpecifyCheckbox($root);
    });
    ensureSpecifyCheckbox($root); // estado inicial

    // 3.4 histórico
    $root.on("change", `input[name="${N.hasExp}"]`, function () {
      renderHistory($root);
    });
    renderHistory($root); // estado inicial (nada marcado → limpa)

    // 3.5 justificativa sempre
    $root.on("change", `select[name="${N.motivation}"]`, function () {
      ensureJustification($(this));
    });

    // 3.6 Outro (situação)
    $root.on("change", `select[name="${N.situation}"]`, function () {
      ensureSpecifySituation($(this));
    }).find(`select[name="${N.situation}"]`).trigger("change");

    // 3.7 chain de 3 selects
    initStepsChain($root);
  }

  return { bind };
})();