// assets/js/form-renderer.js
(function () {
  function el(tag, attrs = {}, children = []) {
    const $el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") $el.className = v;
      else if (k === "dataset") Object.entries(v).forEach(([dk, dv]) => $el.dataset[dk] = dv);
      else if (v !== undefined && v !== null) $el.setAttribute(k, String(v));
    }
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      $el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return $el;
  }

  function elHTML(tag, html, attrs = {}) {
    const $el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") $el.className = v;
      else if (k === "dataset") Object.entries(v).forEach(([dk, dv]) => $el.dataset[dk] = dv);
      else if (v !== undefined && v !== null) $el.setAttribute(k, String(v));
    }
    if (html) $el.innerHTML = html;
    return $el;
  }

  function subBlock(block) {
    const $wrap = el("div", { class: "mb-3 pt-1" });
    const $h = block.titleHtml
        ? elHTML("h4", block.titleHtml, { class: "h6 fw-bold text-dark mb-2" })
        : el("h4", { class: "h6 fw-bold text-dark mb-2" }, block.title || "");
    if (block.title || block.titleHtml) $wrap.appendChild($h);

    (block.fields || []).forEach(field => {
        $wrap.appendChild(field.type === "row" ? row(field) : oneField(field));
    });
    return $wrap;
  }

  function oneField(f) {
    if (!f) return el("div", { class: "mb-2" });
    const id = `f_${f.name || Math.random().toString(36).slice(2)}`;

    if (f.type === "radio") {
      const $wrap = el("div", { class: "form-field-wrap mb-2" });
      if (f.labelHtml) {
        $wrap.appendChild(elHTML("label", f.labelHtml, { class: "form-label fw-semibold mb-2 d-block" }));
      } else if (f.label) {
        $wrap.appendChild(el("label", { class: "form-label fw-semibold mb-2 d-block" }, [
          f.label, f.required ? el("span", { class: "required-asterisk ms-1" }, "*") : null
        ]));
      }

      const $row = el("div", { class: "d-flex flex-wrap gap-4 mt-1" });
      (f.options || []).forEach(opt => {
        const optId = `${id}_${opt.value}`;
        const $input = el("input", {
          type: "radio", class: "form-check-input",
          id: optId, name: f.name, value: opt.value
        });
        const $label = el("label", { for: optId, class: "form-check-label ms-2 cursor-pointer" }, opt.label);
        $row.appendChild(el("div", { class: "form-check form-check-inline d-flex align-items-center" }, [$input, $label]));
      });
      $wrap.appendChild($row);
      return $wrap;
    }

    if (f.type === "select") {
      const $wrap = el("div", { class: "form-field-wrap mb-2" });

      if (f.labelHtml) {
        $wrap.appendChild(elHTML("label", f.labelHtml, { for: id, class: "form-label fw-semibold d-block mb-1" }));
      } else if (f.label) {
        $wrap.appendChild(el("label", { for: id, class: "form-label fw-semibold mb-1" }, [
          f.label, f.required ? el("span", { class: "required-asterisk ms-1" }, "*") : null
        ]));
      }

      const $sel = el("select", { id, name: f.name, class: "form-select" });

      if (f.placeholder) {
        const phAttrs = { value: "", disabled: "", hidden: "" };
        if (!("defaultValue" in f)) phAttrs.selected = "";
        const $ph = el("option", phAttrs, f.placeholder);
        $sel.appendChild($ph);
      }

      (f.options || []).forEach(opt => {
        if (f.placeholder && opt && opt.value === "" && opt.label === "") return;

        const $o = el("option", { value: opt.value }, opt.label);
        if (f.defaultValue != null && String(f.defaultValue) === String(opt.value)) {
          $o.selected = true;
        }
        $sel.appendChild($o);
      });

      $wrap.appendChild($sel);
      return $wrap;
    }

    if (f.type === "checkbox") {
      const box = el("div", { class: "form-field-wrap mb-2 d-flex flex-wrap gap-3 my-2" });
      (f.options || []).forEach(opt => {
        const id = `${f.name}_${opt.value}`;
        const $input = el("input", {
          class: "form-check-input me-2",
          type: "checkbox",
          name: f.name,
          value: opt.value,
          id
        });
        const $label = el("label", { class: "form-check-label cursor-pointer", for: id }, opt.label);
        const $wrap = el("div", { class: "form-check me-3 d-flex align-items-center" }, [$input, $label]);
        box.appendChild($wrap);
      });
      return box;
    }

    if (f.type === "textarea") {
      const $wrap = el("div", { class: "form-field-wrap mb-2" });

      if (f.labelHtml) {
        $wrap.appendChild(elHTML("label", f.labelHtml, { for: id, class: "form-label fw-semibold d-block mb-1" }));
      } else if (f.label) {
        $wrap.appendChild(el("label", { for: id, class: "form-label fw-semibold mb-1" }, [
          f.label, f.required ? el("span", { class: "required-asterisk ms-1" }, "*") : null
        ]));
      }

      const $ta = el("textarea", {
        id,
        name: f.name,
        class: "form-control",
        placeholder: f.placeholder || "",
        rows: f.rows != null ? String(f.rows) : "3"
      });
      if (f.defaultValue != null) $ta.value = String(f.defaultValue);

      $wrap.appendChild($ta);
      return $wrap;
    }

    const $wrap = el("div", { class: "form-field-wrap mb-2" });
    if (f.labelHtml) {
      $wrap.appendChild(elHTML("label", f.labelHtml, { for: id, class: "form-label fw-semibold d-block mb-1" }));
    } else if (f.label) {
      $wrap.appendChild(el("label", { for: id, class: "form-label fw-semibold mb-1" }, [
        f.label, f.required ? el("span", { class: "required-asterisk ms-1" }, "*") : null
      ]));
    }
    
    $wrap.appendChild(el("input", {
      id, name: f.name, type: f.type || "text",
      class: "form-control", placeholder: f.placeholder || ""
    }));
    return $wrap;
  }

  function row(rowDef) {
    const $row = el("div", { class: "row g-3" });
    (rowDef.cols || []).forEach(col => {
      const size = Math.min(Math.max(col.col || 12, 1), 12);
      const $col = el("div", { class: `col-12 col-md-${size}` });
      $col.appendChild(oneField(col.field));
      $row.appendChild($col);
    });
    return $row;
  }

  function groupCard(group) {
    const $wrap = el("div", { class: "tem-card border-card mb-4" });

    if (group.titleHtml) {
      const $title = elHTML("div", group.titleHtml, { class: "group-title-wrap mb-3" });
      $wrap.appendChild($title);
    } else if (group.title && group.title.trim()) {
      const $title = el("h3", { class: "h5 fw-bold mb-3 pb-2 text-primary" }, [
        group.title,
        group.requiredMark ? el("span", { class: "required-asterisk ms-1" }, "*") : null
      ]);
      $wrap.appendChild($title);
    }

    if (Array.isArray(group.blocks) && group.blocks.length) {
      group.blocks.forEach(b => $wrap.appendChild(subBlock(b)));
    }

    (group.fields || []).forEach(field => {
      $wrap.appendChild(field.type === "row" ? row(field) : oneField(field));
    });

    return $wrap;
  }

  const CARD_DESCRIPTIONS = {
    1: {
      title: "Identificação do Empreendimento",
      description: "Esta etapa tem por objetivo identificar as informações fundamentais da sua empresa, tais como razão social, nome fantasia, ano de fundação, porte, modelo de atuação e meios de contato."
    },
    2: {
      title: "Identificação do Empreendedor Principal",
      description: "Esta etapa tem por objetivo identificar o perfil, trajetória, formação e dados de contato do empreendedor principal."
    },
    3: {
      title: "Experiência e Conhecimentos do Empreendedor",
      description: "Mapeamento das experiências anteriores, formação acadêmica, motivações e conhecimentos específicos do empreendedor."
    },
    4: {
      title: "Recursos Financeiros e Não Financeiros",
      description: "Levantamento dos recursos investidos no negócio, fontes de financiamento e dedicação de tempo."
    },
    5: {
      title: "Rede de Relações do Empreendedor",
      description: "Mapeamento das conexões pessoais e profissionais, redes de apoio e parcerias iniciais do empreendedor."
    },
    6: {
      title: "Processo de Decisão do Empreendedor",
      description: "Avaliação do estilo de tomada de decisão, gestão de riscos, perdas acessíveis e princípios de effectuation."
    },
    7: {
      title: "Proposta de Valor",
      description: "Definição do problema solucionado pelo negócio, proposta de valor central e diferenciais competitivos."
    },
    8: {
      title: "Segmentos de Clientes",
      description: "Identificação do público-alvo, clientes iniciais e principais nichos de mercado atendidos."
    },
    9: {
      title: "Canais",
      description: "Mapeamento dos canais de comunicação, distribuição e canais de vendas utilizados."
    },
    10: {
      title: "Relação com Clientes",
      description: "Estratégias adotadas para captação, retenção, suporte e relacionamento com os clientes."
    },
    11: {
      title: "Fontes de Receita",
      description: "Estrutura e modalidades de geração de receita, modelos de precificação e fontes de faturamento."
    },
    12: {
      title: "Recursos-chave",
      description: "Principais ativos físicos, intelectuais, humanos e financeiros necessários para manter o modelo de negócios operando."
    },
    13: {
      title: "Atividades-chave",
      description: "Ações essenciais e rotinas estratégicas indispensáveis para o funcionamento e entrega da solução."
    },
    14: {
      title: "Parcerias-chave",
      description: "Principais parceiros, fornecedores estratégicos e alianças necessárias para a sustentabilidade da empresa."
    },
    15: {
      title: "Rede de Parcerias",
      description: "Detalhamento das parcerias operacionais, governamentais, acadêmicas e corporativas."
    },
    16: {
      title: "Estrutura de Custos",
      description: "Principais direcionadores de custo, despesas fixas, variáveis e custos mais significativos do modelo de negócios."
    },
    17: {
      title: "Inovação",
      description: "Avaliação das dimensões de inovação implementadas em produtos, serviços, processos, marketing e gestão."
    },
    18: {
      title: "Impactos e Externalidades Positivas",
      description: "Mapeamento dos impactos socioambientais, geração de valor local e externalidades positivas da empresa."
    },
    19: {
      title: "Trajetória do Empreendimento",
      description: "Linha do tempo histórica dos principais marcos e eventos da evolução do negócio."
    },
    20: {
      title: "Parcerias",
      description: "Mapeamento completo das entidades parceiras, tipo de relacionamento e contribuição mútua."
    }
  };

  function renderForm(schema, targetEl, cardId) {
    if (!targetEl) return;
    targetEl.innerHTML = "";

    if (cardId && CARD_DESCRIPTIONS[cardId]) {
      const desc = CARD_DESCRIPTIONS[cardId];
      const $banner = el("div", { class: "card-description-banner" }, [
        el("h2", { class: "card-description-title" }, `${cardId}. ${desc.title}`),
        el("p", { class: "card-description-text" }, desc.description)
      ]);
      targetEl.appendChild($banner);
    }

    if (!schema) {
      targetEl.appendChild(el("div", { class: "alert alert-info" }, "Nenhum formulário para este card ainda."));
      return;
    }

    if (schema.title) {
      targetEl.appendChild(el("h2", { class: "h4 text-primary fw-bold mb-3" }, schema.title));
    }

    (schema.groups || []).forEach(g => targetEl.appendChild(groupCard(g)));
  }

  window.renderDynamicForm = function renderDynamicFormByCard(cardId) {
    const container = document.querySelector(".section-forms .container");
    const schema = window.FormSchemas?.[String(cardId)] || null;

    renderForm(schema, container, cardId);

    const evt = new CustomEvent("form:rendered", {
      detail: { schema, targetEl: container, cardId }
    });
    container.dispatchEvent(evt);

    const $container = window.jQuery ? window.jQuery(container) : null;

    if (cardId === 1 && window.Card1 && $container) window.Card1.bind($container);
    if (cardId === 2 && window.Card2 && $container) window.Card2.bind($container);
    if (cardId === 3 && window.Card3 && $container) window.Card3.bind($container);
    if (cardId === 4 && window.Card4 && $container) window.Card4.bind($container);
    if (cardId === 5 && window.Card5 && $container) window.Card5.bind($container);
    if (cardId === 6 && window.Card6 && $container) window.Card6.bind($container);
    if (cardId === 7 && window.Card7 && $container) window.Card7.bind($container);
    if (cardId === 8 && window.Card8 && $container) window.Card8.bind($container);
    if (cardId === 9 && window.Card9 && $container) window.Card9.bind($container);
    if (cardId === 10 && window.Card10 && $container) window.Card10.bind($container);
    if (cardId === 11 && window.Card11 && $container) window.Card11.bind($container);
    if (cardId === 12 && window.Card12 && $container) window.Card12.bind($container);
    if (cardId === 13 && window.Card13 && $container) window.Card13.bind($container);
    if (cardId === 14 && window.Card14 && $container) window.Card14.bind($container);
    if (cardId === 15 && window.Card15 && $container) window.Card15.bind($container);
    if (cardId === 16 && window.Card16 && $container) window.Card16.bind($container);
    if (cardId === 17 && window.Card17 && $container) window.Card17.bind($container);
    if (cardId === 18 && window.Card18 && $container) window.Card18.bind($container);
    if (cardId === 19 && window.Card19 && $container) window.Card19.bind($container);
    if (cardId === 20 && window.Card20 && $container) window.Card20.bind($container);
  };
})();