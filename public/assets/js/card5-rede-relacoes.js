// assets/js/card5-rede-relacoes.js
window.Card5 = (function () {
  // ===== Utils (alinhados ao Card4) =====
  function wrapperFor($el) {
    return $el.closest(".mb-2, .col, .col-12");
  }
  
  function ensureContainer($wrap, cls, asSiblingAfter = false) {
    if (!$wrap.length) return $();
    let $c;
    if (asSiblingAfter) {
      $c = $wrap.nextAll(`.${cls}`).first();
      if (!$c.length) {
        $c = $(`<div class="${cls}"></div>`).insertAfter($wrap);
      }
    } else {
      $c = $wrap.find(`.${cls}`).first();
      if (!$c.length) {
        $c = $(`<div class="${cls}"></div>`).appendTo($wrap);
      }
    }
    return $c;
  }

  // ===== Mapeamentos 5.1 =====
  const N = { rs1: "relSelect1", rps1: "relPostSelect1" };

  const REL_OPTIONS = [
    { v: "amigos", label: "Amigos" },
    { v: "colegas", label: "Colegas ou Ex-colegas" },
    { v: "familiares", label: "Familiares" },
    { v: "mentores", label: "Mentores ou conselheiros profissionais" },
    { v: "empregador", label: "Empregador (Antigo ou atual empregador que se torna parceiro, investidor ou sócio do empreendimento)" },
    { v: "outrosEmpreendedores", label: "Outros empreendedores" },
    { v: "nenhumPrevio", label: "Nenhum contato prévio, pois encontrei pessoas durante o processo" },
    { v: "parceirosFornecedores", label: "Parceiros ou fornecedores já conhecidos" },
    { v: "outrasRelacoes", label: "Outras relações (poder público, igreja, outras insituições, investidor, contatos via redes sociais etc.)" }
  ];

  // ===== Metadados por categoria =====
  const CATEGORY_META = {
    amigos: {
      title: "Amigos",
      itemBase: "Amigo",
      originLabel: "Origem",
      originPh: "Especifique a origem da amizade",
      collab: ["Sócio", "Parceiro", "Colaborador", "Somente uma conversa", "Outro"],
      nature: [
        "Apoio financeiro",
        "Habilidades ou conhecimentos técnicos",
        "Suporte emocional/motivacional",
        "Equipamentos ou Infraestrutura",
        "Conversa ou troca de ideias",
        "Conhecimento de mercado e de potencias clientes e parceiros",
        "mentoria e aconselhamento",
        "Conhecimento e experiência de gestão",
        "Outro"
      ],
      addBtn: "Adicionar Contato"
    },
    colegas: {
      title: "Colegas ou Ex-colegas",
      itemBase: "Colega",
      originLabel: "Origem",
      originPh: "Especifique a origem do colega",
      collab: ["Sócio", "Parceiro", "Colaborador", "Outro"],
      nature: ["Experiência profissional relevante", "Consultoria ou orientação", "Colaboração em atividades específicas", "Outro"],
      addBtn: "Adicionar Contato"
    },
    familiares: {
      title: "Familiares",
      itemBase: "Familiar",
      originLabel: "Origem",
      originPh: "Especifique a origem",
      collab: ["Sócio", "Parceiro", "Colaborador", "Somente uma conversa", "Outro"],
      nature: [
        "Apoio financeiro",
        "Contribuição com trabalho não remunerado",
        "Ajuda com infraestrutura (espaço, ferramentas)",
        "Rede de contatos",
        "Conversa ou troca de ideias",
        "Outro"
      ],
      addBtn: "Adicionar Contato"
    },
    mentores: {
      title: "Mentores ou conselheiros profissionais",
      itemBase: "Mentor",
      originLabel: "Origem",
      originPh: "Informe a origem do mentor/conselheiro",
      collab: ["Sócio", "Parceiro", "Colaborador", "Somente uma conversa", "Outro"],
      nature: [
        "Experiência profissional ou habilidades específicas",
        "Recursos materiais ou infraestrutura",
        "Indicação para rede de contatos ou clientes",
        "Conhecimento de mercado",
        "Rede de contas para potenciais clientes",
        "Outro"
      ],
      addBtn: "Adicionar Contato"
    },
    empregador: {
      title: "Empregador",
      itemBase: "Empregador",
      originLabel: "Origem",
      originPh: "Especifique a origem do empregador",
      collab: ["Sócio", "Parceiro", "Colaborador", "Outro"],
      nature: [
        "Experiência profissional ou habilidades específicas",
        "Recursos materiais ou infraestrutura",
        "Indicação para rede de contatos ou clientes",
        "Conhecimento de mercado",
        "Rede de contas para potenciais clientes",
        "Outro"
      ],
      addBtn: "Adicionar Parceiro"
    },
    outrosEmpreendedores: {
      title: "Outros empreendedores",
      itemBase: "Empreendedor",
      originLabel: "Origem",
      originPh: "Especifique a origem do empreendedor",
      collab: ["Sócio", "Parceiro", "Colaborador", "Somente uma conversa", "Outro"],
      nature: [
        "Parcerias comerciais ou operacionais",
        "Compartilhamento de recursos e conhecimento",
        "Infraestrutura",
        "Tecnologia",
        "Canais de Distribuição",
        "Novos Mercados",
        "Outro"
      ],
      addBtn: "Adicionar Contato"
    },
    nenhumPrevio: {
      title: "Nenhum contato prévio, pois encontrei pessoas durante o processo",
      itemBase: "Contato",
      originLabel: "Origem",
      originPh: "Especifique a origem das pessoas encontradas",
      collab: ["Sócio", "Parceiro", "Colaborador", "Somente uma conversa", "Outro"],
      nature: ["Mesmo setor", "Outro Setor", "Outro"],
      addBtn: "Adicionar Contato"
    },
    parceirosFornecedores: {
      title: "Parceiros ou fornecedores já conhecidos",
      itemBase: "Parceiro/Fornecedor",
      originLabel: "Origem",
      originPh: "Especifique a origem do parceiro ou fornecedor",
      collab: ["Sócio", "Parceiro", "Colaborador", "Somente uma conversa", "Outro"],
      nature: [
        "Condições especiais em fornecimento de materiais/serviços",
        "Colaboração em projetos específicos",
        "Desenvolvimento em conjunto de novo produto",
        "Teste de produto no mercado",
        "Desenvolvimento e teste de novas matérias primas",
        "Desenvolvimento e teste de equipamentos",
        "Outro"
      ],
      addBtn: "Adicionar Parceiro"
    },
    outrasRelacoes: {
      title: "Outras relações (poder público, igreja, outras instituições, investidor, contatos via redes sociais etc.)",
      itemBase: "Relação",
      originLabel: "Origem",
      originPh: "Especifique a origem da relação",
      collab: ["Sócio", "Parceiro", "Colaborador", "Somente uma conversa", "Outro"],
      nature: [
        "Conexões facilitadas por redes sociais/profissionais",
        "Parcerias institucionais (como com órgãos públicos, privados, coletivos ou ONGs)",
        "Colaboração em projetos específicos",
        "Edital de fomento",
        "Aceleradoras",
        "Programas de treinamento",
        "Fomento não reembolsável",
        "Investimento de capital de risco",
        "Investimento Anjo",
        "Financiamento bancário com taxas de mercado",
        "Financiamento bancário com taxas subsidiadas e especiais",
        "Incubadoras de empresas",
        "Investimentos de outra natureza",
        "Investimento capital semente",
        "Outro"
      ],
      addBtn: "Adicionar Contato"
    }
  };

  // ===== Selects encadeados 5.1 =====
  function buildSelect($holder, name) {
    const $sel = $(
      `<select class="form-select mb-2" name="${name}">
        <option value="" disabled selected hidden>Selecione uma opção</option>
      </select>`
    );
    $holder.append($sel);
    return $sel;
  }

  function fillSelect($sel, chosenSet) {
    const current = $sel.val();
    $sel.empty().append(`<option value="" disabled selected hidden>Selecione uma opção</option>`);
    REL_OPTIONS.forEach(o => {
      if (!chosenSet.has(o.v)) {
        $sel.append(`<option value="${o.v}">${o.label}</option>`);
      }
    });
    // preserva valor se continuar válido
    if (current && !chosenSet.has(current)) $sel.val(current);
  }

  // ===== Blocos dinâmicos por categoria =====
  function namePrefixFor(cat) {
    return `rel_${cat}`;
  }

  function namePrefixForPost(cat) { return `relPost_${cat}`; }

  function buildItemHtml(cat, idx) {
    const meta = CATEGORY_META[cat];
    const prefix = namePrefixFor(cat);
    const num = String(idx).padStart(2, "0");

    const radioName = `${prefix}_tipo_${idx}`;
    const otherRadioName = `${prefix}_tipoOutro_${idx}`;
    const checksName = `${prefix}_natureza_${idx}[]`;
    const otherCheckName = `${prefix}_naturezaOutro_${idx}`;

    const radiosHtml = meta.collab
      .map(opt => {
        const v = opt.toLowerCase().replaceAll(/\s+/g, "_");
        return `<label class="me-3 mb-2"><input type="radio" name="${radioName}" value="${v}"> ${opt}</label>`;
      })
      .join("");

    const checksHtml = meta.nature
      .map(opt => {
        const v = opt.toLowerCase().replaceAll(/\s+/g, "_");
        return `<label class="me-3 mb-2 d-inline-flex align-items-center">
                  <input type="checkbox" name="${checksName}" value="${v}" class="me-1"> ${opt}
                </label>`;
      })
      .join("");

    return `
      <div class="card p-3 mb-2 rel-item" data-idx="${idx}">
        <div class="fw-bold mb-2">${meta.itemBase} ${num}</div>

        <div class="mb-2">
          <label class="form-label">${meta.originLabel}</label>
          <input type="text" class="form-control" name="${prefix}_origem_${idx}" placeholder="${meta.originPh}">
        </div>

        <div class="mb-2">
          <label class="form-label">Tipo de Colaboração:</label><br/>
          ${radiosHtml}
          <div class="mt-2 rel-radio-outro"></div>
        </div>

        <div class="mb-1">
          <label class="form-label">Natureza de Recursos:</label><br/>
          ${checksHtml}
          <div class="mt-2 rel-check-outro"></div>
        </div>
      </div>
    `;
  }

  function wireItemBehaviors($item, cat, idx) {
    const prefix = namePrefixFor(cat);
    const radioName = `${prefix}_tipo_${idx}`;
    const otherRadioName = `${prefix}_tipoOutro_${idx}`;
    const checksName = `${prefix}_natureza_${idx}[]`;
    const otherCheckName = `${prefix}_naturezaOutro_${idx}`;

    const $radioOutroHolder = $item.find(".rel-radio-outro");
    const $checkOutroHolder = $item.find(".rel-check-outro");

    // Radio "Outro" -> text
    $item.off("change.relRadio").on("change.relRadio", `input[name="${radioName}"]`, function () {
      const val = (this.value || "").toLowerCase();
      if (val === "outro") {
        $radioOutroHolder.html(
          `<input type="text" class="form-control" name="${otherRadioName}" placeholder="Especifique">`
        );
      } else {
        $radioOutroHolder.empty();
      }
    });

    // Checkbox "outro"/"outro_setor" -> text
    $item.off("change.relCheck").on("change.relCheck", `input[name='${checksName}']`, function () {
      const vals = $item
        .find(`input[name='${checksName}']:checked`)
        .map(function () { return this.value; })
        .get();
      const needsOther = vals.some(v => v === "outro" || v === "outro_setor");
      if (needsOther) {
        $checkOutroHolder.html(
          `<input type="text" class="form-control" name="${otherCheckName}" placeholder="Especifique">`
        );
      } else {
        $checkOutroHolder.empty();
      }
    });
  }

  function buildCategoryBlock($blocks, cat) {
    const meta = CATEGORY_META[cat];
    const $block = $(`
      <div class="rel-category-block mb-3" data-cat="${cat}">
        <div class="fw-bold mb-2">${meta.title}</div>
        <div class="rel-items-list"></div>
        <div class="d-flex justify-content-end gap-2 mt-2">
          <button type="button" class="btn btn-primary btn-add">${meta.addBtn}</button>
          <button type="button" class="btn btn-danger btn-rem d-none">Remover</button>
        </div>
      </div>
    `);

    const $list = $block.find(".rel-items-list");
    const $btnAdd = $block.find(".btn-add");
    const $btnRem = $block.find(".btn-rem");

    function count() { return $list.children(".rel-item").length; }
    function updateBtns() {
      const c = count();
      $btnRem.toggleClass("d-none", c <= 1);
      $btnAdd.prop("disabled", c >= 3);
      $btnRem.text("Remover " + meta.itemBase);
    }
    function addItem() {
      if (count() >= 3) return;
      const idx = count() + 1;
      const $it = $(buildItemHtml(cat, idx));
      $list.append($it);
      wireItemBehaviors($it, cat, idx);
      updateBtns();
    }
    function removeItem() {
      if (count() <= 1) return;
      $list.children(".rel-item").last().remove();
      updateBtns();
    }

    // inicial
    addItem();

    $block.off("click.relAdd").on("click.relAdd", ".btn-add", addItem);
    $block.off("click.relRem").on("click.relRem", ".btn-rem", removeItem);

    $blocks.append($block);
  }

  function renderCategoryFor($container, cat) {
        // Remove o bloco atual se a seleção mudou/limpou
        const $existing = $container.find(".rel-category-block");
        const existingCat = $existing.length ? $existing.data("cat") : null;

        if (!cat) { // sem seleção: limpar
            $existing.remove();
            return;
        }

        if (existingCat === cat) {
            // já está renderizado corretamente
            return;
        }

        // troca o bloco
        $existing.remove();
        buildCategoryBlock($container, cat);
  }

  //For 5.2
  function buildItemHtmlPost(cat, idx) {
  const meta = CATEGORY_META[cat];
  const prefix = namePrefixForPost(cat);
  const num = String(idx).padStart(2, "0");

  const radioName = `${prefix}_tipo_${idx}`;
  const otherRadioName = `${prefix}_tipoOutro_${idx}`;
  const checksName = `${prefix}_natureza_${idx}[]`;
  const otherCheckName = `${prefix}_naturezaOutro_${idx}`;

  const radiosHtml = meta.collab.map(opt => {
    const v = opt.toLowerCase().replaceAll(/\s+/g, "_");
    return `<label class="me-3 mb-2"><input type="radio" name="${radioName}" value="${v}"> ${opt}</label>`;
  }).join("");

  const checksHtml = meta.nature.map(opt => {
    const v = opt.toLowerCase().replaceAll(/\s+/g, "_");
    return `<label class="me-3 mb-2 d-inline-flex align-items-center">
              <input type="checkbox" name="${checksName}" value="${v}" class="me-1"> ${opt}
            </label>`;
  }).join("");

  return `
    <div class="card p-3 mb-2 rel-item" data-idx="${idx}">
      <div class="fw-bold mb-2">${meta.itemBase} ${num}</div>

      <div class="mb-2">
        <label class="form-label">${meta.originLabel}</label>
        <input type="text" class="form-control" name="${prefix}_origem_${idx}" placeholder="${meta.originPh}">
      </div>

      <div class="mb-2">
        <label class="form-label">Tipo de Colaboração:</label><br/>
        ${radiosHtml}
        <div class="mt-2 rel-radio-outro"></div>
      </div>

      <div class="mb-1">
        <label class="form-label">Natureza de Recursos:</label><br/>
        ${checksHtml}
        <div class="mt-2 rel-check-outro"></div>
      </div>
    </div>
  `;
}

function wireItemBehaviorsPost($item, cat, idx) {
  const prefix = namePrefixForPost(cat);
  const radioName = `${prefix}_tipo_${idx}`;
  const otherRadioName = `${prefix}_tipoOutro_${idx}`;
  const checksName = `${prefix}_natureza_${idx}[]`;
  const otherCheckName = `${prefix}_naturezaOutro_${idx}`;

  const $radioOutroHolder = $item.find(".rel-radio-outro");
  const $checkOutroHolder = $item.find(".rel-check-outro");

  $item.off("change.relRadioPost").on("change.relRadioPost", `input[name="${radioName}"]`, function () {
    const val = (this.value || "").toLowerCase();
    if (val === "outro") {
      $radioOutroHolder.html(`<input type="text" class="form-control" name="${otherRadioName}" placeholder="Especifique">`);
    } else {
      $radioOutroHolder.empty();
    }
  });

  $item.off("change.relCheckPost").on("change.relCheckPost", `input[name='${checksName}']`, function () {
    const vals = $item.find(`input[name='${checksName}']:checked`).map(function(){return this.value;}).get();
    const needsOther = vals.some(v => v === "outro" || v === "outro_setor");
    if (needsOther) {
      $checkOutroHolder.html(`<input type="text" class="form-control" name="${otherCheckName}" placeholder="Especifique">`);
    } else {
      $checkOutroHolder.empty();
    }
  });
}

function buildCategoryBlockPost($blocks, cat) {
  const meta = CATEGORY_META[cat];
  const $block = $(`
    <div class="rel-category-block mb-3" data-cat="${cat}">
      <div class="fw-bold mb-2">${meta.title}</div>
      <div class="rel-items-list"></div>
      <div class="d-flex justify-content-end gap-2 mt-2">
        <button type="button" class="btn btn-primary btn-add">${meta.addBtn}</button>
        <button type="button" class="btn btn-danger btn-rem d-none">Remover</button>
      </div>
    </div>
  `);

  const $list = $block.find(".rel-items-list");
  const $btnAdd = $block.find(".btn-add");
  const $btnRem = $block.find(".btn-rem");

  function count(){ return $list.children(".rel-item").length; }
  function updateBtns(){
    const c = count();
    $btnRem.toggleClass("d-none", c <= 1);
    $btnAdd.prop("disabled", c >= 3);
    $btnRem.text("Remover " + meta.itemBase);
  }
  function addItem(){
    if (count() >= 3) return;
    const idx = count() + 1;
    const $it = $(buildItemHtmlPost(cat, idx));
    $list.append($it);
    wireItemBehaviorsPost($it, cat, idx);
    updateBtns();
  }
  function removeItem(){
    if (count() <= 1) return;
    $list.children(".rel-item").last().remove();
    updateBtns();
  }

  addItem();
  $block.off("click.relAddPost").on("click.relAddPost", ".btn-add", addItem);
  $block.off("click.relRemPost").on("click.relRemPost", ".btn-rem", removeItem);

  $blocks.append($block);
}

function renderCategoryForPost($container, cat) {
  const $existing = $container.find(".rel-category-block");
  const existingCat = $existing.length ? $existing.data("cat") : null;
  if (!cat) { $existing.remove(); return; }
  if (existingCat === cat) return;
  $existing.remove();
  buildCategoryBlockPost($container, cat);
}



  // ===== Inicialização 5.1 =====
  function initRelations($root) {
  const $s1 = $root.find(`select[name="${N.rs1}"]`);
  if (!$s1.length) return;

  const $wrap = wrapperFor($s1);
  const $selects = ensureContainer($wrap, "rel-selects-container", true);

  // cria selects 2 e 3 (ficam dentro do container dinâmico)
  let $s2 = $selects.find(`select[name="relSelect2"]`);
  let $s3 = $selects.find(`select[name="relSelect3"]`);
  if (!$s2.length) $s2 = buildSelect($selects, "relSelect2");
  if (!$s3.length) $s3 = buildSelect($selects, "relSelect3");

  // ⚠️ SÓ AGORA podemos criar os containers de blocos abaixo de cada select
  const $blocks1 = ensureContainer(wrapperFor($s1), "rel-blocks-s1", true); // abaixo do select 1
  const $blocks2 = ensureContainer(wrapperFor($s2), "rel-blocks-s2", true); // abaixo do select 2
  const $blocks3 = ensureContainer(wrapperFor($s3), "rel-blocks-s3", true); // abaixo do select 3

  function getChosen() {
    const vals = [];
    const v1 = $s1.val(); if (v1) vals.push(v1);
    const v2 = $s2.val(); if (v2) vals.push(v2);
    const v3 = $s3.val(); if (v3) vals.push(v3);
    return new Set(vals);
  }

  function sync() {
    const chosen = getChosen();

    // Não refaça as opções do select 1 aqui, para não perder a seleção do usuário
    // Apenas s2 e s3 devem excluir escolhas já feitas
    fillSelect($s2, new Set([...chosen].filter(v => v !== $s2.val())));
    fillSelect($s3, new Set([...chosen].filter(v => v !== $s3.val())));

    // mostra s2 só depois de s1, e s3 só depois de s2
    $s2.toggle(!!$s1.val());
    if (!$s1.val()) $s2.val("");

    $s3.toggle(!!$s2.val());
    if (!$s2.val()) $s3.val("");

    // (re)monta blocos das categorias selecionadas nos containers corretos
    const v1 = $s1.val();
    const v2 = $s2.val();
    const v3 = $s3.val();
    renderCategoryFor($blocks1, v1);
    renderCategoryFor($blocks2, v2);
    renderCategoryFor($blocks3, v3);
  }

  // estado inicial
  fillSelect($s1, new Set()); // apenas uma vez
  fillSelect($s2, new Set());
  fillSelect($s3, new Set());
  $s2.hide();
  $s3.hide();

  // binds
  $s1.off("change.rel5s1").on("change.rel5s1", sync);
  $selects.off("change.rel5").on("change.rel5", "select[name^='relSelect']", sync);

  // primeira sincronização
  sync();
}

  // ==== Inicialização 5.2 =====
  function initRelationsPost($root) {
  const $s1 = $root.find(`select[name="${N.rps1}"]`);
  if (!$s1.length) return;

  const $wrap = wrapperFor($s1);
  const $selects = ensureContainer($wrap, "rel-post-selects-container", true);

  // cria selects 2 e 3 do 5.2
  let $s2 = $selects.find(`select[name="relPostSelect2"]`);
  let $s3 = $selects.find(`select[name="relPostSelect3"]`);
  if (!$s2.length) $s2 = buildSelect($selects, "relPostSelect2");
  if (!$s3.length) $s3 = buildSelect($selects, "relPostSelect3");

  // containers dos blocos por select (5.2)
  const $blocks1 = ensureContainer(wrapperFor($s1), "rel-post-blocks-s1", true);
  const $blocks2 = ensureContainer(wrapperFor($s2), "rel-post-blocks-s2", true);
  const $blocks3 = ensureContainer(wrapperFor($s3), "rel-post-blocks-s3", true);

  function getChosen() {
    const vals = [];
    const v1 = $s1.val(); if (v1) vals.push(v1);
    const v2 = $s2.val(); if (v2) vals.push(v2);
    const v3 = $s3.val(); if (v3) vals.push(v3);
    return new Set(vals);
  }

  function sync() {
    const chosen = getChosen();

    // não mexa nas opções do s1; apenas s2/s3 excluem já escolhidos
    fillSelect($s2, new Set([...chosen].filter(v => v !== $s2.val())));
    fillSelect($s3, new Set([...chosen].filter(v => v !== $s3.val())));

    $s2.toggle(!!$s1.val());
    if (!$s1.val()) $s2.val("");

    $s3.toggle(!!$s2.val());
    if (!$s2.val()) $s3.val("");

    const v1 = $s1.val();
    const v2 = $s2.val();
    const v3 = $s3.val();
    renderCategoryForPost($blocks1, v1);
    renderCategoryForPost($blocks2, v2);
    renderCategoryForPost($blocks3, v3);
  }

  // estado inicial
  fillSelect($s1, new Set());
  fillSelect($s2, new Set());
  fillSelect($s3, new Set());
  $s2.hide();
  $s3.hide();

  // binds
  $s1.off("change.rel5p_s1").on("change.rel5p_s1", sync);
  $selects.off("change.rel5p").on("change.rel5p", "select[name^='relPostSelect']", sync);

  sync();
}



  // ===== bind =====
  function bind($root) {
    if (!$root || !$root.length) return;

    // REMOVE o data("card5Bound") pra poder rebindar sempre
    // if ($root.data("card5Bound")) return;
    // $root.data("card5Bound", true);

    // 5.1 (fase inicial)
    initRelations($root);

    // 5.2 (pós-inicial)
    initRelationsPost($root);
  }



  return { bind };
})();