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
    // título do sub-bloco (menor que o do grupo)
    const $wrap = el("div", { class: "mb-3" });
    const $h = block.titleHtml
        ? elHTML("h4", block.titleHtml, { class: "h6 fw-semibold mb-2" })
        : el("h4", { class: "h6 fw-semibold mb-2" }, block.title || "");
    if (block.title || block.titleHtml) $wrap.appendChild($h);

    (block.fields || []).forEach(field => {
        $wrap.appendChild(field.type === "row" ? row(field) : oneField(field));
    });
    return $wrap;
  }

  function oneField(f) {
    if (!f) return el("div");
    const id = `f_${f.name || Math.random().toString(36).slice(2)}`;

    if (f.type === "radio") {
      const $wrap = el("div", { class: "mb-2" });
      if (f.labelHtml) {
        $wrap.appendChild(elHTML("label", f.labelHtml, { class: "form-label fw-semibold mb-1 d-block" }));
      } else if (f.label) {
        $wrap.appendChild(el("label", { class: "form-label fw-semibold mb-1" }, f.label));
      }

      const $row = el("div", { class: "d-flex flex-wrap gap-4" });
      (f.options || []).forEach(opt => {
        const optId = `${id}_${opt.value}`;
        const $label = el("label", { for: optId, class: "form-check-label ms-1" }, opt.label);
        const $input = el("input", {
          type: "radio", class: "form-check-input",
          id: optId, name: f.name, value: opt.value
        });
        $row.appendChild(el("div", { class: "form-check form-check-inline" }, [$input, $label]));
      });
      $wrap.appendChild($row);
      return $wrap;
    }

    if (f.type === "select") {
      const $wrap = el("div", { class: "mb-2" });

      if (f.labelHtml) {
        $wrap.appendChild(elHTML("label", f.labelHtml, { for: id, class: "form-label fw-semibold d-block" }));
      } else if (f.label) {
        $wrap.appendChild(el("label", { for: id, class: "form-label fw-semibold" }, [
          f.label, f.required ? el("span", { class: "text-danger ms-1" }, "*") : null
        ]));
      }

      const $sel = el("select", { id, name: f.name, class: "form-select" });

      // ✅ Placeholder não-selecionável
      if (f.placeholder) {
        const phAttrs = { value: "", disabled: "", hidden: "" };
        if (!("defaultValue" in f)) phAttrs.selected = "";
        const $ph = el("option", phAttrs, f.placeholder);
        $sel.appendChild($ph);
      }

      (f.options || []).forEach(opt => {
        // se usamos placeholder, ignore options vazias redundantes
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
      const box = el("div", { class: "d-flex flex-wrap gap-3" });
      (f.options || []).forEach(opt => {
        const id = `${f.name}_${opt.value}`;
        const $label = el("label", { class: "form-check-label", for: id }, opt.label);
        const $input = el("input", {
          class: "form-check-input me-1",
          type: "checkbox",
          name: f.name,        // mesmo name para o grupo
          value: opt.value,
          id
        });
        const $wrap = el("div", { class: "form-check me-3" }, [$input, $label]);
        box.appendChild($wrap);
      });
      return box;
    }

    if (f.type === "textarea") {
      const $wrap = el("div", { class: "mb-2" });

      if (f.labelHtml) {
        $wrap.appendChild(elHTML("label", f.labelHtml, { for: id, class: "form-label fw-semibold d-block" }));
      } else if (f.label) {
        $wrap.appendChild(el("label", { for: id, class: "form-label fw-semibold" }, [
          f.label, f.required ? el("span", { class: "text-danger ms-1" }, "*") : null
        ]));
      }

      const $ta = el("textarea", {
        id,
        name: f.name,
        class: "form-control",
        placeholder: f.placeholder || "",
        rows: f.rows != null ? String(f.rows) : "3"
      });
      // Se houver defaultValue no schema, aplica:
      if (f.defaultValue != null) $ta.value = String(f.defaultValue);

      $wrap.appendChild($ta);
      return $wrap;
    }

    const $wrap = el("div", { class: "mb-2" });
    if (f.labelHtml) {
    $wrap.appendChild(elHTML("label", f.labelHtml, { for: id, class: "form-label fw-semibold d-block" }));
    } else if (f.label) {
    $wrap.appendChild(el("label", { for: id, class: "form-label fw-semibold" }, [
        f.label, f.required ? el("span", { class: "text-danger ms-1" }, "*") : null
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
    const color = group.color || "secondary";
    const $wrap = el("div", { class: `border-start border-card border-4 border-${color} rounded-3 p-4 bg-white mb-3` });

    const $title = group.titleHtml
        ? elHTML("h3", group.titleHtml, { class: "h5 fw-bold mb-3 m-0" })
        : el("h3", { class: "h5 fw-bold mb-3 m-0" }, [
            group.title || "",
            group.requiredMark ? el("span", { class: "text-danger ms-1" }, "*") : null
        ]);
    $wrap.appendChild($title);

    // NOVO: se houver blocks, renderiza-os dentro do mesmo card
    if (Array.isArray(group.blocks) && group.blocks.length) {
        group.blocks.forEach(b => $wrap.appendChild(subBlock(b)));
    }

    // retrocompat: se houver fields (como antes), renderiza também
    (group.fields || []).forEach(field => {
        $wrap.appendChild(field.type === "row" ? row(field) : oneField(field));
    });

    return $wrap;
  }

  function renderForm(schema, targetEl) {
    if (!targetEl) return;
    targetEl.innerHTML = "";

    if (!schema) {
      targetEl.appendChild(el("div", { class: "alert alert-info" }, "Nenhum formulário para este card ainda."));
      return;
    }

    if (schema.title) {
      targetEl.appendChild(el("h3", { class: "h5 text-secondary fw-bold mb-3" }, schema.title));
    }

    (schema.groups || []).forEach(g => targetEl.appendChild(groupCard(g)));
  }

  // Exponibiliza:
  window.renderDynamicForm = function renderDynamicFormByCard(cardId) {
    const container = document.querySelector(".section-forms .container"); // alvo
    const schema = window.FormSchemas?.[String(cardId)] || null;

    renderForm(schema, container);

    // 🔔 Evento para quem quiser ouvir
    const evt = new CustomEvent("form:rendered", {
      detail: { schema, targetEl: container, cardId }
    });
    container.dispatchEvent(evt);

    // ✅ crie o wrapper jQuery
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