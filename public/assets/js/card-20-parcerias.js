window.Card20 = (function () {
  // ==== Utils padrão ====
  function wrapperFor($el) {
    const $p = $el.closest(".form-field, .mb-2, .mb-3, .col, .col-12, .row");
    return $p.length ? $p : $el.parent();
  }

  const MAX_CHARS = 1000;

  function initPartnerships($root) {
    const $desc = $root.find('[name="partnershipDescription"]');
    const $year = $root.find('input[name="partnershipYear"]');
    if (!$desc.length || !$year.length) return;

    const currentYear = new Date().getFullYear();

    // Configura maxlength e contador dinâmico
    const $wrapDesc = wrapperFor($desc);
    const $labelDesc = $wrapDesc.find("label.form-label").first();

    if ($labelDesc.length) {
      $desc.attr("maxlength", MAX_CHARS);

      function updateCounter() {
        const len = ($desc.val() || "").length;
        $labelDesc.text(`Parceria (${len}/${MAX_CHARS}):`);
      }

      $desc.off("input.card20_counter").on("input.card20_counter", updateCounter);
      updateCounter();
    }

    // Placeholder e restrição do ano
    if (!$year.attr("placeholder")) {
      $year.attr("placeholder", String(currentYear));
    }
    $year.attr("max", String(currentYear));

    const $groupCard = $desc.closest(".border-card");
    const $title = $groupCard.children().first();

    // Container da lista de parcerias (cinza), escondido inicialmente
    let $list = $groupCard.find(".partnerships-list");
    if (!$list.length) {
      $list = $(`
        <div class="partnerships-list border rounded-3 p-3 d-none"
             style="background-color: #f5f5f5; margin: 12px 0;">
        </div>
      `);
      $list.insertAfter($title);
    }

    // Botão "Adicionar"
    const $wrapYear = wrapperFor($year);
    let $btnAdd = $groupCard.find(".btn-add-partnership");
    if (!$btnAdd.length) {
      $btnAdd = $(`
        <button type="button" class="btn btn-sm btn-primary mt-2 btn-add-partnership">
          Adicionar
        </button>
      `);
      $btnAdd.insertAfter($wrapYear);
    }

    // ====== MODAL DE EDIÇÃO (Bootstrap 5) ==================================
    let editingItem = null;
    let $editModal = $("#partnershipEditModal");
    let $editYear = null;
    let $editDesc = null;
    let editModalInstance = null;

    if ($editModal.length && window.bootstrap && bootstrap.Modal) {
      $editYear = $editModal.find('input[name="partEditYear"]');
      $editDesc = $editModal.find('textarea[name="partEditDesc"]');
      editModalInstance = new bootstrap.Modal($editModal[0]);

      // Garantir max no input de ano do modal
      if ($editYear.length) {
        $editYear.attr("max", String(currentYear));
        if (!$editYear.attr("placeholder")) {
          $editYear.attr("placeholder", String(currentYear));
        }
      }

      // Botão "Editar" do modal
      const $btnConfirm = $editModal.find(".btn-confirm-part-edit");
      if ($btnConfirm.length) {
        $btnConfirm.off("click.card20_editConfirm").on("click.card20_editConfirm", function () {
          if (!editingItem || !$editYear || !$editDesc) {
            if (editModalInstance) editModalInstance.hide();
            return;
          }

          const desc = ($editDesc.val() || "").trim();
          let yearStr = ($editYear.val() || "").trim();

          if (!desc) {
            alert("Informe a descrição da parceria.");
            $editDesc.focus();
            return;
          }

          let yearNum;
          if (!yearStr) {
            yearNum = currentYear; // Se não informar, usa ano atual
          } else {
            yearNum = parseInt(yearStr, 10);
            if (isNaN(yearNum)) {
              alert("Informe um ano válido.");
              $editYear.focus();
              return;
            }
          }

          if (yearNum > currentYear) {
            alert(
              `O ano informado (${yearNum}) é maior que o ano atual (${currentYear}). ` +
              "Informe um ano igual ou anterior ao ano atual."
            );
            $editYear.focus();
            return;
          }

          const year = String(yearNum);

          // Atualiza o item visualmente
          const $yearEl = editingItem.find(".partnership-year");
          const $descEl = editingItem.find(".partnership-desc");

          if ($yearEl.length) {
            $yearEl.text(year);
          }
          if ($descEl.length) {
            $descEl.text(" - " + desc);
          }

          // Reordena depois de editar o ano
          resortPartnerships();

          // Fecha modal e limpa referência
          editingItem = null;
          if (editModalInstance) {
            editModalInstance.hide();
          }
        });
      }

      // Quando o modal fecha por qualquer motivo, limpamos referência
      $editModal.on("hidden.bs.modal", function () {
        editingItem = null;
      });
    }

    // Função para criar visual de parceria adicionada
    function createPartnershipItem(desc, year) {
      const $item = $(`
        <div class="partnership-item d-flex align-items-center justify-content-between mb-2 p-2 rounded">
        </div>
      `).css("background-color", "#e9ecef");

      const displayYear = year || currentYear;

      const $text = $('<div class="me-2"></div>');
      const $yearEl = $('<strong class="partnership-year"></strong>').text(displayYear);
      const $descEl = $('<span class="partnership-desc"></span>').text(" - " + desc);

      $text.append($yearEl, $descEl);

      // Ações: editar (em cima) e deletar (embaixo)
      const $actions = $('<div class="d-flex flex-column gap-1"></div>');

      const $btnEdit = $(`
        <button type="button"
                class="btn btn-sm btn-outline-secondary partnership-edit"
                aria-label="Editar parceria">
          <i class="fas fa-pen"></i>
        </button>
      `);

      const $btnDel = $(`
        <button type="button"
                class="btn btn-sm btn-outline-danger partnership-delete"
                aria-label="Remover parceria">
          &times;
        </button>
      `);

      $actions.append($btnEdit, $btnDel);

      $item.append($text, $actions);
      return $item;
    }

    function resortPartnerships() {
      const items = $list.find(".partnership-item").get();

      items.sort((a, b) => {
        const ay = parseInt($(a).find(".partnership-year").text(), 10) || 0;
        const by = parseInt($(b).find(".partnership-year").text(), 10) || 0;

        if (ay === by) return 0;
        return ay - by;
      });

      $list.append(items);
    }

    // Função para adicionar parceria
    function addPartnershipFromInputs() {
      const desc = ($desc.val() || "").trim();
      let yearStr = ($year.val() || "").trim();

      if (!desc) return;

      let yearNum;
      if (!yearStr) {
        yearNum = currentYear;
      } else {
        yearNum = parseInt(yearStr, 10);
        if (isNaN(yearNum)) {
          alert("Informe um ano válido.");
          $year.focus();
          return;
        }
      }

      if (yearNum > currentYear) {
        alert(
          `O ano informado (${yearNum}) é maior que o ano atual (${currentYear}). ` +
          "Informe um ano igual ou anterior ao ano atual."
        );
        $year.focus();
        return;
      }

      const year = String(yearNum);

      // Exibe container
      $list.removeClass("d-none");

      // Adiciona card
      const $item = createPartnershipItem(desc, year);
      $list.append($item);

      // Reordena pela coluna de ano
      resortPartnerships();

      // Limpa campos
      $desc.val("");
      $year.val("");
      $desc.trigger("input.card20_counter");
    }

    // Eventos
    $btnAdd.off("click.card20_add").on("click.card20_add", addPartnershipFromInputs);

    // Remoção
    $list.off("click.card20_del").on("click.card20_del", ".partnership-delete", function () {
      const $container = $(this).closest(".partnerships-list");
      $(this).closest(".partnership-item").remove();

      if (!$container.find(".partnership-item").length) {
        $container.addClass("d-none");
      }
    });

    // Edição → abre modal
    $list
      .off("click.card20_edit")
      .on("click.card20_edit", ".partnership-edit", function () {
        if (!$editModal || !$editModal.length || !editModalInstance) return;

        const $item = $(this).closest(".partnership-item");
        editingItem = $item;

        const $yearEl = $item.find(".partnership-year");
        const $descEl = $item.find(".partnership-desc");

        const yearText = $yearEl.length ? String($yearEl.text() || "").trim() : "";
        let descText = $descEl.length ? String($descEl.text() || "") : "";
        descText = descText.replace(/^\s*-\s*/, "").trim(); // remove " - " do começo

        if ($editYear && $editYear.length) {
          $editYear.val(yearText || "");
        }
        if ($editDesc && $editDesc.length) {
          $editDesc.val(descText || "");
        }

        editModalInstance.show();
      });
  }

  // ==== Bind público ====
  function bind($root) {
    if (!$root || !$root.length) return;
    initPartnerships($root);
  }

  return { bind };
})();