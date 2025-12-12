window.Card19 = (function () {
  // ==== Utils (seguindo padrão dos outros cards) ====
  function wrapperFor($el) {
    const $p = $el.closest(".form-field, .mb-2, .mb-3, .col, .col-12, .row");
    return $p.length ? $p : $el.parent();
  }

  function ensureContainer($wrap, cls, asSiblingAfter = false) {
    if (!$wrap || !$wrap.length) return $();
    let $c;
    if (asSiblingAfter) {
      $c = $wrap.nextAll("." + cls).first();
      if (!$c.length) {
        $c = $(`<div class="${cls}"></div>`).insertAfter($wrap);
      }
    } else {
      $c = $wrap.find("." + cls).first();
      if (!$c.length) {
        $c = $(`<div class="${cls}"></div>`).appendTo($wrap);
      }
    }
    return $c;
  }

  const MAX_CHARS = 1000;

  function initTrajectory($root) {
    const $desc = $root.find('[name="milestoneDescription"]');
    const $year = $root.find('input[name="milestoneYear"]');
    if (!$desc.length || !$year.length) return;

    const currentYear = new Date().getFullYear();

    // Garante maxlength e contador dinâmico "Marco (0/1000):"
    const $wrapDesc = wrapperFor($desc);
    const $labelDesc = $wrapDesc.find("label.form-label").first();

    if ($labelDesc.length) {
      $desc.attr("maxlength", MAX_CHARS);

      function updateCounter() {
        const len = ($desc.val() || "").length;
        $labelDesc.text(`Marco (${len}/${MAX_CHARS}):`);
      }

      $desc.off("input.card19_counter").on("input.card19_counter", updateCounter);
      updateCounter();
    }

    // Placeholder do ano com ano atual
    if (!$year.attr("placeholder")) {
      $year.attr("placeholder", String(currentYear));
    }

    $year.attr("max", String(currentYear));

    // Encontra o "card" visual deste grupo (bg-white com borda colorida)
    const $groupCard = $desc.closest(".border-card");
    const $title = $groupCard.children().first(); // h3 do título do grupo

    // Container onde os cards de marcos serão renderizados (cinza)
    let $list = $groupCard.find(".trajectory-milestones-list");
    if (!$list.length) {
      $list = $(`
        <div class="trajectory-milestones-list border rounded-3 p-3 d-none"
            style="background-color: #f5f5f5; margin: 12px 0;">
        </div>
      `);
      $list.insertAfter($title); // fica logo abaixo do título 19.1
    }

    // Botão "Adicionar" logo abaixo dos campos
    const $wrapYear = wrapperFor($year);
    let $btnAdd = $groupCard.find(".btn-add-milestone");
    if (!$btnAdd.length) {
      $btnAdd = $(`
        <button type="button" class="btn btn-sm btn-primary mt-2 btn-add-milestone">
          Adicionar
        </button>
      `);
      $btnAdd.insertAfter($wrapYear);
    }

    // ====== MODAL DE EDIÇÃO (Bootstrap 5) ==================================
    let editingItem = null;
    let $editModal = $("#trajectoryEditModal");
    let $editYear = null;
    let $editDesc = null;
    let editModalInstance = null;

    if ($editModal.length && window.bootstrap && bootstrap.Modal) {
      $editYear = $editModal.find('input[name="trajEditYear"]');
      $editDesc = $editModal.find('textarea[name="trajEditDesc"]');
      editModalInstance = new bootstrap.Modal($editModal[0]);

      // Garantir max no input de ano do modal
      if ($editYear.length) {
        $editYear.attr("max", String(currentYear));
        if (!$editYear.attr("placeholder")) {
          $editYear.attr("placeholder", String(currentYear));
        }
      }

      // Botão "Editar" do modal
      const $btnConfirm = $editModal.find(".btn-confirm-edit");
      if ($btnConfirm.length) {
        $btnConfirm.off("click.card19_editConfirm").on("click.card19_editConfirm", function () {
          if (!editingItem || !$editYear || !$editDesc) {
            if (editModalInstance) editModalInstance.hide();
            return;
          }

          const desc = ($editDesc.val() || "").trim();
          let yearStr = ($editYear.val() || "").trim();

          if (!desc) {
            alert("Informe a descrição do marco.");
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
          const $yearEl = editingItem.find(".trajectory-year");
          const $descEl = editingItem.find(".trajectory-desc");

          if ($yearEl.length) {
            $yearEl.text(year);
          }
          if ($descEl.length) {
            $descEl.text(" - " + desc);
          }

          // Reordena depois de editar o ano
          resortMilestones();

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

    // ====== Função para criar um card de marco =============================
    function createMilestoneItem(desc, year) {
      const $item = $(`
        <div class="trajectory-item d-flex align-items-center justify-content-between mb-2 p-2 rounded">
        </div>
      `).css("background-color", "#e9ecef"); // cinza claro

      const displayYear = year || currentYear;

      const $text = $('<div class="me-2"></div>');
      const $yearEl = $('<strong class="trajectory-year"></strong>').text(displayYear);
      const $descEl = $('<span class="trajectory-desc"></span>').text(" - " + desc);

      $text.append($yearEl, $descEl);

      // Botões de ação (editar em cima, deletar embaixo)
      const $actions = $('<div class="d-flex flex-column gap-1"></div>');

      const $btnEdit = $(`
        <button type="button"
                class="btn btn-sm btn-outline-secondary trajectory-edit"
                aria-label="Editar marco">
          <i class="fas fa-pen"></i>
        </button>
      `);

      const $btnDel = $(`
        <button type="button"
                class="btn btn-sm btn-outline-danger trajectory-delete"
                aria-label="Remover marco">
          &times;
        </button>
      `);

      $actions.append($btnEdit, $btnDel);

      $item.append($text, $actions);
      return $item;
    }

    function resortMilestones() {
      const items = $list.find(".trajectory-item").get();

      items.sort((a, b) => {
        const ay = parseInt($(a).find(".trajectory-year").text(), 10) || 0;
        const by = parseInt($(b).find(".trajectory-year").text(), 10) || 0;

        // ordem cronológica: do menor ano para o maior
        if (ay === by) return 0; // mantém ordem relativa quando o ano é igual
        return ay - by;
      });

      // reapende na nova ordem
      $list.append(items);
    }

    function addMilestoneFromInputs() {
      const desc = ($desc.val() || "").trim();
      let yearStr = ($year.val() || "").trim();

      if (!desc) {
        // Sem descrição, não adiciona nada
        return;
      }

      let yearNum;
      if (!yearStr) {
        yearNum = currentYear; // se não informar, usamos o ano atual
      } else {
        yearNum = parseInt(yearStr, 10);
        if (isNaN(yearNum)) {
          alert("Informe um ano válido.");
          $year.focus();
          return;
        }
      }

      // Se o ano informado for maior que o ano atual, bloqueia e alerta
      if (yearNum > currentYear) {
        alert(
          `O ano informado (${yearNum}) é maior que o ano atual (${currentYear}). ` +
          "Informe um ano igual ou anterior ao ano atual."
        );
        $year.focus();
        return;
      }

      const year = String(yearNum);

      // garante que o container apareça ao menos quando tiver 1 item
      $list.removeClass("d-none");

      const $item = createMilestoneItem(desc, year);
      $list.append($item);

      // Reordena pela coluna de ano
      resortMilestones();

      // Limpa campos e reseta contador
      $desc.val("");
      $year.val("");
      $desc.trigger("input.card19_counter");
    }

    // Clique no botão "Adicionar"
    $btnAdd.off("click.card19_add").on("click.card19_add", function () {
      addMilestoneFromInputs();
    });

    // Delete direto (sem confirmação)
    $list
      .off("click.card19_del")
      .on("click.card19_del", ".trajectory-delete", function () {
        const $container = $(this).closest(".trajectory-milestones-list");
        $(this).closest(".trajectory-item").remove();

        if (!$container.find(".trajectory-item").length) {
          $container.addClass("d-none");
        }
      });

    // Clique em "Editar" → abre modal com dados do item
    $list
      .off("click.card19_edit")
      .on("click.card19_edit", ".trajectory-edit", function () {
        if (!$editModal || !$editModal.length || !editModalInstance) return;

        const $item = $(this).closest(".trajectory-item");
        editingItem = $item;

        const $yearEl = $item.find(".trajectory-year");
        const $descEl = $item.find(".trajectory-desc");

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

  // ==== Bind público do Card 19 ====
  function bind($root) {
    if (!$root || !$root.length) return;
    initTrajectory($root); // 19.1
  }

  return { bind };
})();