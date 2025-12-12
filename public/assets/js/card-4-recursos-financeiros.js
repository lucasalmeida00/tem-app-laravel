// assets/js/card4-recursos.js
window.Card4 = (function () {
    const N = {
        // 4.1
        nf1: "nfSelect1",
        // 4.2
        f1: "fSelect1",
        // 4.3
        renounced: "renouncedSalaries",
        // 4.4
        initDed: "initialDedication",
        // 4.5
        vol: "volunteerType",
        // 4.6
        viab: "viabilityTime",
        // 4.7
        r1: "riskInvSelect1",
        // 4.8
        invInitY1: "invInitYear1",
        invInitN1: "invInitName1",
        // 4.9
        invCurrY1: "invCurrYear1",
        invCurrN1: "invCurrName1",
        // 4.10
        subs: "subsidies",
    };

    // ===== Utils =====
    function wrapperFor($el) {
        return $el.closest(".mb-2, .col, .col-12");
    }

    function ensureContainer($wrap, cls, asSiblingAfter = false) {
        if (!$wrap.length) return $();
        let $c;
        if (asSiblingAfter) {
            // procura como IRMÃO após o wrapper
            $c = $wrap.nextAll(`.${cls}`).first();
            if (!$c.length) {
                $c = $(`<div class="${cls}"></div>`).insertAfter($wrap);
            }
        } else {
            // procura DENTRO do wrapper
            $c = $wrap.find(`.${cls}`).first();
            if (!$c.length) {
                $c = $(`<div class="${cls}"></div>`).appendTo($wrap);
            }
        }
        return $c;
    }

    // ---------- 4.1 NÃO FINANCEIROS ----------
    const NF_OPTIONS = [{
            v: "conhecimento_experiencia",
            l: "Conhecimento ou experiência"
        },
        {
            v: "experiencia_pratica",
            l: "Experiência prática como empreendedor"
        },
        {
            v: "equipamentos",
            l: "Equipamentos"
        },
        {
            v: "rede_contatos",
            l: "Rede de Contatos"
        },
        {
            v: "infraestrutura",
            l: "Infraestrutura"
        },
        {
            v: "conhecimento_territorio",
            l: "Conhecimento de território/mercado/setor"
        },
        {
            v: "parcerias_locais",
            l: "Parcerias com empresas locais e/ou outras"
        },
        {
            v: "trabalho_voluntario_terceiros",
            l: "Trabalho voluntário de terceiros"
        },
        {
            v: "tempo_integral",
            l: "Tempo de dedicação integral"
        },
        {
            v: "tempo_parcial",
            l: "Tempo de dedicação parcial"
        },
        {
            v: "trabalho_nao_remunerado_socios",
            l: "Trabalho não remunerado dos sócios"
        },
        {
            v: "outro",
            l: "Outro"
        }
    ];

    // cria select encadeado (2..5) abaixo do 1º
    function renderNfSelect($root, idx, chosenSet) {
        const base = `nfSelect${idx}`;
        const $first = $root.find(`select[name="${N.nf1}"]`);
        const $wrap = wrapperFor($first);
        const $holder = ensureContainer($wrap, "nf-selects-container"); // dentro do mesmo card

        // cria markup do select + espaço para “Outro” logo abaixo
        let $sel = $holder.find(`select[name="${base}"]`);
        if (!$sel.length) {
            $holder.append(`
        <select class="form-select mb-2" name="${base}">
          <option value="" disabled selected hidden>selecione uma opção</option>
        </select>
        <div class="extra-${base}-other" style="margin-bottom:10px;"></div>
      `);
            $sel = $holder.find(`select[name="${base}"]`);
        }

        // popula com opções disponíveis (exceto já escolhidas, mantendo “outro”)
        const options = NF_OPTIONS.filter(o => !chosenSet.has(o.v) || o.v === "outro");
        $sel.empty().append(`<option value="" disabled selected hidden>selecione uma opção</option>`);
        options.forEach(o => $sel.append(`<option value="${o.v}">${o.l}</option>`));

        // estado “Outro” / sub-checkboxes especiais
        function ensureNfOther($selLocal, name) {
            const $extra = $holder.find(`.extra-${name}-other`).first();
            if (String($selLocal.val()) === "outro") {
                $extra.html(`<input class="form-control" name="${name}__other" placeholder="especifique" style="margin-bottom:10px;">`);
            } else {
                $extra.empty();
            }
        }

        $sel.off("change.nf").on("change.nf", function () {
            ensureNfOther($sel, base);

            // Agora pega TODOS os nfSelect (1..5) a partir da raiz do card
            const chosen = new Set(
                $root
                    .find('select[name^="nfSelect"]')
                    .map((_, el) => $(el).val())
                    .get()
                    .filter(Boolean)
            );

            // desenha o próximo até o 5º
            if (idx < 5) {
                renderNfSelect($root, idx + 1, chosen);
            }

            // sub-opções especiais (checkboxes) — sempre abaixo do bloco 4.1
            renderNfSpecialCheckboxes($root, chosen);
        });

        // estado inicial “Outro”
        ensureNfOther($sel, base);
    }

    // Checkbox especiais de 4.1: AGORA por SELECT (nfSelect1..5),
    // Checkbox especiais de 4.1: AGORA por SELECT (nfSelect1..5),
// cada um com seu container logo abaixo do próprio select (ou do campo "__other" dele).
function renderNfSpecialCheckboxes($root, _chosenSet) {
    $root.find('select[name^="nfSelect"]').each(function () {
        const $sel  = $(this);
        const v     = String($sel.val() || "");
        const base  = $sel.attr("name"); // ex: nfSelect1, nfSelect2...
        if (!base) return;

        // 🔹 Queremos inserir SEMPRE após:
        // 1) o div.extra-nfSelectX-other, se existir
        // 2) senão, logo após o próprio <select>
        const extraClass  = `extra-${base}-other`;
        const $extra      = $sel.nextAll(`.${extraClass}`).first();
        let   $anchor     = $extra.length ? $extra : $sel;

        const cls    = `nf-special-${base}`;
        let   $below = $anchor.nextAll(`.${cls}`).first();
        if (!$below.length) {
            // cria o container ESPECÍFICO desse select, imediatamente depois do anchor
            $below = $(`<div class="${cls}"></div>`).insertAfter($anchor);
        }

        // Se o valor NÃO é um dos especiais, limpa o container e sai
        if (!["equipamentos", "rede_contatos", "infraestrutura"].includes(v)) {
            $below.empty().removeAttr("data-nf-kind");
            return;
        }

        // Se já existe HTML e o "tipo" não mudou, não re-renderiza
        // (pra não perder checkboxes marcados)
        const currentKind = $below.data("nf-kind");
        if (currentKind === v && $below.children().length) {
            return;
        }

        let html = "";
        let kind = v;

        if (v === "equipamentos") {
            html = `
        <div class="mb-3 nf-block-equip">
          <label class="form-label fw-semibold d-block">Especifique o equipamento:</label>
          <div class="d-flex flex-wrap gap-3">
            <div class="form-check me-3">
              <input class="form-check-input" type="checkbox"
                     name="nf_equip_doados" value="doados" id="nf_equip_doados">
              <label class="form-check-label" for="nf_equip_doados">Doados</label>
            </div>
            <div class="form-check me-3">
              <input class="form-check-input" type="checkbox"
                     name="nf_equip_comprados" value="comprados" id="nf_equip_comprados">
              <label class="form-check-label" for="nf_equip_comprados">Comprados</label>
            </div>
            <div class="form-check me-3">
              <input class="form-check-input" type="checkbox"
                     name="nf_equip_materiais_proprios" value="materiais_proprios" id="nf_equip_materiais_proprios">
              <label class="form-check-label" for="nf_equip_materiais_proprios">Materiais próprios</label>
            </div>
            <div class="form-check me-3">
              <input class="form-check-input" type="checkbox"
                     name="nf_equip_conhecimento_experiencia" value="conhecimento_experiencia" id="nf_equip_conhecimento_experiencia">
              <label class="form-check-label" for="nf_equip_conhecimento_experiencia">Conhecimento ou experiência</label>
            </div>
            <div class="form-check me-3">
              <input class="form-check-input" type="checkbox"
                     name="nf_equip_outro" value="outro" id="nf_equip_outro">
              <label class="form-check-label" for="nf_equip_outro">Outro</label>
            </div>
          </div>
          <div class="nf-equip-other mt-2"></div>
        </div>
      `;
        } else if (v === "rede_contatos") {
            html = `
        <div class="mb-3 nf-block-rede">
          <label class="form-label fw-semibold d-block">Especifique a rede de contatos:</label>
          <div class="d-flex flex-wrap gap-3">
            <div class="form-check me-3">
              <input class="form-check-input" type="checkbox"
                     name="nf_rede_mentores" value="mentores" id="nf_rede_mentores">
              <label class="form-check-label" for="nf_rede_mentores">Mentores</label>
            </div>
            <div class="form-check me-3">
              <input class="form-check-input" type="checkbox"
                     name="nf_rede_parceiros" value="parceiros" id="nf_rede_parceiros">
              <label class="form-check-label" for="nf_rede_parceiros">Parceiros</label>
            </div>
            <div class="form-check me-3">
              <input class="form-check-input" type="checkbox"
                     name="nf_rede_amigos" value="amigos" id="nf_rede_amigos">
              <label class="form-check-label" for="nf_rede_amigos">Amigos</label>
            </div>
            <div class="form-check me-3">
              <input class="form-check-input" type="checkbox"
                     name="nf_rede_familiares" value="familiares" id="nf_rede_familiares">
              <label class="form-check-label" for="nf_rede_familiares">Familiares</label>
            </div>
            <div class="form-check me-3">
              <input class="form-check-input" type="checkbox"
                     name="nf_rede_outro" value="outro" id="nf_rede_outro">
              <label class="form-check-label" for="nf_rede_outro">Outro</label>
            </div>
          </div>
          <div class="nf-rede-other mt-2"></div>
        </div>
      `;
        } else if (v === "infraestrutura") {
            html = `
        <div class="mb-3 nf-block-infra">
          <label class="form-label fw-semibold d-block">Especifique a infraestrutura:</label>
          <div class="d-flex flex-wrap gap-3">
            <div class="form-check me-3">
              <input class="form-check-input" type="checkbox"
                     name="nf_infra_espaco_alugado" value="espaco_alugado" id="nf_infra_espaco_alugado">
              <label class="form-check-label" for="nf_infra_espaco_alugado">Espaço alugado</label>
            </div>
            <div class="form-check me-3">
              <input class="form-check-input" type="checkbox"
                     name="nf_infra_espaco_emprestado" value="espaco_emprestado" id="nf_infra_espaco_emprestado">
              <label class="form-check-label" for="nf_infra_espaco_emprestado">Espaço emprestado</label>
            </div>
            <div class="form-check me-3">
              <input class="form-check-input" type="checkbox"
                     name="nf_infra_moradia" value="moradia" id="nf_infra_moradia">
              <label class="form-check-label" for="nf_infra_moradia">Moradia</label>
            </div>
            <div class="form-check me-3">
              <input class="form-check-input" type="checkbox"
                     name="nf_infra_outro" value="outro" id="nf_infra_outro">
              <label class="form-check-label" for="nf_infra_outro">Outro</label>
            </div>
          </div>
          <div class="nf-infra-other mt-2"></div>
        </div>
      `;
        }

        $below
            .attr("data-nf-kind", kind)
            .html(html);
    });

    // Binds "Outro" para TODOS os blocos especiais (equip, rede, infra),
    // sem perder o estado de outros selects.
    $root
        .off("change.nf-special")
        .on("change.nf-special", '.nf-block-equip input[type="checkbox"], .nf-block-rede input[type="checkbox"], .nf-block-infra input[type="checkbox"]', function () {
            const $b      = $(this).closest(".mb-3");
            const isEquip = $b.hasClass("nf-block-equip");
            const isRede  = $b.hasClass("nf-block-rede");
            const isInfra = $b.hasClass("nf-block-infra");

            const outroChecked = $b.find('input[type="checkbox"][value="outro"]').is(":checked");
            const $target = isEquip ? $b.find(".nf-equip-other")
                          : isRede ? $b.find(".nf-rede-other")
                          : isInfra ? $b.find(".nf-infra-other")
                          : $();

            if (!$target.length) return;

            if (outroChecked) {
                const label = isEquip
                    ? "Especifique o equipamento:"
                    : isRede
                    ? "Especifique a rede de contatos:"
                    : "Especifique a infraestrutura:";
                const name = isEquip
                    ? "nf_equip_outro"
                    : isRede
                    ? "nf_rede_outro"
                    : "nf_infra_outro";

                $target.html(`
        <label class="form-label mt-2">${label}</label>
        <input class="form-control" name="${name}" placeholder="especifique">
      `);
            } else {
                $target.empty();
            }
        });
}


    function initNonFinancial($root) {
        const $s1 = $root.find(`select[name="${N.nf1}"]`);
        if (!$s1.length) return;
        const $wrap = wrapperFor($s1);
        ensureContainer($wrap, "nf-selects-container"); // holder para 2..5
        ensureContainer($wrap, "nf-special-container", true); // holder abaixo (irmão) para checkboxes especiais

        $s1.off("change.nf1").on("change.nf1", function () {
            const v = $(this).val();

            // zera cadeia e especiais
            const $holder = $wrap.find(".nf-selects-container");
            $holder.find('select[name^="nfSelect"]:not([name="nfSelect1"]), .extra-nfSelect2-other, .extra-nfSelect3-other, .extra-nfSelect4-other, .extra-nfSelect5-other').remove();

            // se por acaso algum container duplicado já existia, remova-o
            $wrap.nextAll(".nf-special-container").remove();

            // “Outro” do 1º select (sem label)
            const cls = "extra-nfSelect1-other";
            let $extra1 = $holder.find(`.${cls}`);
            if (!$extra1.length) {
                $extra1 = $(`<div class="${cls}" style="margin-bottom:10px;"></div>`);
                $holder.prepend($extra1);
            }
            if (v === "outro") $extra1.html(`<input class="form-control" name="nfSelect1__other" placeholder="especifique" style="margin-bottom:10px;">`);
            else $extra1.empty();

            if (!v) return;
            const chosen = new Set([v]);
            renderNfSelect($root, 2, chosen);
            // também atualizar especiais do 1º
            renderNfSpecialCheckboxes($root, chosen);
        });

        // estado inicial
        $s1.trigger("change");
    }

    // ---------- 4.2 FINANCEIROS ----------
    const F_OPTIONS = [{
            v: "economias_pessoais",
            l: "Economias pessoais (poupança)"
        },
        {
            v: "emprestimo_bancario",
            l: "Empréstimo bancário"
        },
        {
            v: "investimento_terceiros",
            l: "Investimento de terceiros"
        },
        {
            v: "investimento_informal",
            l: "Investimento Informal"
        },
        {
            v: "recursos_pessoais",
            l: "Recursos financeiros pessoais"
        },
        {
            v: "fgts",
            l: "FGTS"
        },
        {
            v: "seguro_desemprego",
            l: "Seguro desemprego"
        },
        {
            v: "emprestimo_amigos",
            l: "Empréstimo com amigos"
        },
        {
            v: "emprestimo_familiares",
            l: "Empréstimo com familiares"
        },
        {
            v: "infraestrutura",
            l: "Infraestrutura"
        },
        {
            v: "equipamento",
            l: "Equipamento"
        },
        {
            v: "outro",
            l: "Outro"
        }
    ];

    function renderFSelect($root, idx, chosenSet) {
        const base = `fSelect${idx}`;
        const $first = $root.find(`select[name="${N.f1}"]`);
        const $wrap = wrapperFor($first);
        const $holder = ensureContainer($wrap, "f-selects-container");

        let $sel = $holder.find(`select[name="${base}"]`);
        if (!$sel.length) {
            $holder.append(`
        <select class="form-select mb-2" name="${base}">
          <option value="" disabled selected hidden>selecione uma opção</option>
        </select>
        <div class="extra-${base}-other" style="margin-bottom:10px;"></div>
      `);
            $sel = $holder.find(`select[name="${base}"]`);
        }

        const options = F_OPTIONS.filter(o => !chosenSet.has(o.v) || o.v === "outro");
        $sel.empty().append(`<option value="" disabled selected hidden>selecione uma opção</option>`);
        options.forEach(o => $sel.append(`<option value="${o.v}">${o.l}</option>`));

        function ensureFOther($selLocal, name) {
            const $extra = $holder.find(`.extra-${name}-other`).first();
            const v = $selLocal.val();

            if (v === "outro") {
                $extra.html(`<input class="form-control" name="${name}__other" placeholder="especifique" style="margin-bottom:10px;">`);
            } else if (v === "investimento_terceiros") {
                $extra.html(`
          <label class="form-label fw-semibold d-block">Especifique o Investimento de Terceiros:</label>
          <input class="form-control" name="${name}__inv_terceiros" placeholder="Descreva" />
        `);
            } else {
                $extra.empty();
            }
        }

        $sel.off("change.f").on("change.f", function () {
            const v = $(this).val();
            ensureFOther($sel, base);

            const chosen = new Set(
                [1, 2, 3].map(i => $holder.find(`select[name="fSelect${i}"]`).val()).filter(Boolean)
            );
            if (idx < 3) renderFSelect($root, idx + 1, chosen);
        });

        ensureFOther($sel, base);
    }

    function initFinancial($root) {
        const $s1 = $root.find(`select[name="${N.f1}"]`);
        if (!$s1.length) return;
        const $wrap = wrapperFor($s1);
        ensureContainer($wrap, "f-selects-container");

        $s1.off("change.f1").on("change.f1", function () {
            const v = $(this).val();

            // “Outro”/terceiros do 1º
            const cls = "extra-fSelect1-other";
            const $holder = $wrap.find(".f-selects-container");
            let $extra1 = $holder.find(`.${cls}`);
            if (!$extra1.length) {
                $extra1 = $(`<div class="${cls}" style="margin-bottom:10px;"></div>`);
                $holder.prepend($extra1);
            }
            if (v === "outro") {
                $extra1.html(`<input class="form-control" name="fSelect1__other" placeholder="especifique" style="margin-bottom:10px;">`);
            } else if (v === "investimento_terceiros") {
                $extra1.html(`
          <label class="form-label fw-semibold d-block">Especifique o Investimento de Terceiros:</label>
          <input class="form-control" name="fSelect1__inv_terceiros" placeholder="Descreva" />
        `);
            } else {
                $extra1.empty();
            }

            // zera cadeia 2..3
            $holder.find('select[name="fSelect2"], select[name="fSelect3"], .extra-fSelect2-other, .extra-fSelect3-other').remove();

            if (!v) return;
            const chosen = new Set([v]);
            renderFSelect($root, 2, chosen);
        });

        $s1.trigger("change");
    }

    // ---------- 4.4 DEDICAÇÃO ----------
    function initDedication($root) {
        const $rad = $root.find(`input[name="${N.initDed}"]`);
        if (!$rad.length) return;

        const $wrap = wrapperFor($rad.first());
        const $extra = ensureContainer($wrap, "dedication-extra"); // “Como?” (fase inicial)
        const $current = ensureContainer($wrap, "dedication-current", true); // “E atualmente...”, abaixo

        function renderInitialExtra() {
            const val = $root.find(`input[name="${N.initDed}"]:checked`).val();
            if (val === "divide_tempo") {
                $extra.html(`
                <label class="form-label fw-semibold d-block">Como?</label>
                <input type="text" class="form-control" name="initialDedicationHow" placeholder="Descreva" />
            `);
            } else {
                $extra.empty();
            }
        }

        function renderCurrentBlock() {
            const hasSelection = $root.find(`input[name="${N.initDed}"]:checked`).length > 0;

            if (!hasSelection) {
                // Nada selecionado ⇒ não mostra o bloco “E atualmente...”
                $current.empty();
                $root.off("change.currentDed");
                return;
            }

            // Há seleção ⇒ renderiza (idempotente)
            $current.html(`
            <label class="form-label fw-semibold d-block mt-3">
                E atualmente, qual a sua dedicação ao empreendimento?
            </label>
            <div class="mb-2">
                <label class="me-3"><input type="radio" name="currentDedication" value="integral"> Tempo dedicado integralmente</label>
                <label class="me-3"><input type="radio" name="currentDedication" value="parcial"> Tempo parcialmente ao empreendimento</label>
                <label class="me-3"><input type="radio" name="currentDedication" value="divide_tempo"> Divide tempo com outro trabalho em paralelo com o empreendimento</label>
            </div>
            <div class="current-how mt-2"></div>
            `);

            // “Como?” do bloco atual
            $root.off("change.currentDed").on("change.currentDed", 'input[name="currentDedication"]', function () {
                const $box = $current.find(".current-how");
                if (this.value === "divide_tempo") {
                    $box.html(`
                <label class="form-label fw-semibold d-block">Como?</label>
                <input type="text" class="form-control" name="currentDedicationHow" placeholder="Descreva" />
                `);
                } else {
                    $box.empty();
                }
            });
        }

        // === liga eventos + estado inicial ===
        $rad.off("change.initDed").on("change.initDed", function () {
            renderInitialExtra();
            renderCurrentBlock();
        });

        // Ao carregar: sem seleção ⇒ bloco “E atualmente...” escondido
        renderInitialExtra();
        renderCurrentBlock();
    }

    // ---------- 4.5 VOLUNTÁRIOS ----------
    function initVolunteers($root) {
        const $s = $root.find(`select[name="${N.vol}"]`);
        if (!$s.length) return;

        const $wrap = wrapperFor($s);
        const $holder = ensureContainer($wrap, "volunteers-extra", true); // irmão abaixo do select

        function render() {
            const v = $s.val();

            if (v === "fixa" || v === "sob_demanda") {
                // Sim ⇒ mostra Quantas? + Comente
                $holder.html(`
                <div class="row g-2 mt-2">
                    <div class="col-12 col-md-4">
                    <input type="number" min="0" class="form-control" name="volunteersQty" placeholder="Quantas?" />
                    </div>
                    <div class="col-12 col-md-8">
                    <input type="text" class="form-control" name="volunteersComment" placeholder="Comente sua resposta:" />
                    </div>
                </div>
                `);
            } else if (v === "nao") {
                // Não ⇒ mostra somente "Comente sua resposta:"
                $holder.html(`
                <div class="mt-2">
                    <input type="text" class="form-control" name="volunteersComment" placeholder="Comente sua resposta:" />
                </div>
                `);
            } else {
                // sem seleção ⇒ limpar
                $holder.empty();
            }
        }


        $s.off("change.vol").on("change.vol", render);
        render(); // estado inicial
    }

    // ---------- 4.6 VIABILIDADE ECONÔMICA ----------
    function initViability($root) {
        const $rad = $root.find(`input[name="${N.viab}"]`);
        if (!$rad.length) return;

        const $wrap = wrapperFor($rad.first());
        const $extra = ensureContainer($wrap, "viability-extra", true);

        function render() {
            const v = $root.find(`input[name="${N.viab}"]:checked`).val();
            if (v === "outro") {
                $extra.html(`
        <div class="mt-2">
          <input type="text" class="form-control" name="viabilityOther" placeholder="Especifique" />
        </div>
      `);
            } else {
                $extra.empty();
            }
        }

        $root.off("change.viab").on("change.viab", `input[name="${N.viab}"]`, render);
        render(); // estado inicial
    }

    // ---------- 4.7 RISCOS & INVESTIMENTOS (3 selects) ----------
    const RISK_OPTIONS = [{
            v: "investiu_capital_proprio",
            l: "Investiu capital próprio"
        },
        {
            v: "investiu_apenas_que_poderia_perder",
            l: "Investiu somente o que vocêr poderia arriscar e perder"
        },
        {
            v: "nao_investiu_dinheiro",
            l: "Não investiu dinheiro inicial"
        },
        {
            v: "contratou_emprestimo",
            l: "Contratou emprestimo"
        },
        {
            v: "buscou_edital",
            l: "Buscou edital de fomento"
        },
        {
            v: "buscou_investidor",
            l: "Buscou investidor profissional"
        },
        {
            v: "buscou_parceiros",
            l: "Buscou parceiros"
        },
        {
            v: "buscou_amigos_familiares",
            l: "Buscou amigos e familiares"
        },
        {
            v: "outro",
            l: "Outro"
        }
    ];

    function renderRiskSelect($root, idx, chosenSet) {
        const base = `riskInvSelect${idx}`;
        const $first = $root.find(`select[name="${N.r1}"]`);
        const $wrap = wrapperFor($first);
        const $holder = ensureContainer($wrap, "risk-selects-container"); // dentro

        let $sel = $holder.find(`select[name="${base}"]`);
        if (!$sel.length) {
            $holder.append(`
      <select class="form-select mb-2" name="${base}">
        <option value="" disabled selected hidden>Selecione uma opção</option>
      </select>
      <div class="extra-${base}-other" style="margin-bottom:10px;"></div>
    `);
            $sel = $holder.find(`select[name="${base}"]`);
        }

        const options = RISK_OPTIONS.filter(o => !chosenSet.has(o.v) || o.v === "outro");
        $sel.empty().append(`<option value="" disabled selected hidden>Selecione uma opção</option>`);
        options.forEach(o => $sel.append(`<option value="${o.v}">${o.l}</option>`));

        function ensureOther($selLocal, name) {
            const $extra = $holder.find(`.extra-${name}-other`).first();
            if (String($selLocal.val()) === "outro") {
                $extra.html(`<input class="form-control" name="${name}__other" placeholder="Especifique" style="margin-bottom:10px;">`);
            } else {
                $extra.empty();
            }
        }

        $sel.off("change.risk").on("change.risk", function () {
            ensureOther($sel, base);

            const chosen = new Set(
                [1, 2, 3]
                .map(i => $holder.find(`select[name="riskInvSelect${i}"]`).val())
                .filter(Boolean)
            );
            if (idx < 3) renderRiskSelect($root, idx + 1, chosen);
        });

        // estado inicial “Outro”
        ensureOther($sel, base);
    }

    function initRisk($root) {
        const $s1 = $root.find(`select[name="${N.r1}"]`);
        if (!$s1.length) return;

        const $wrap = wrapperFor($s1);
        ensureContainer($wrap, "risk-selects-container");

        $s1.off("change.risk1").on("change.risk1", function () {
            const v = $(this).val();
            const $holder = $wrap.find(".risk-selects-container");

            // Outro do 1º
            const cls = "extra-riskInvSelect1-other";
            let $extra1 = $holder.find(`.${cls}`);
            if (!$extra1.length) {
                $extra1 = $(`<div class="${cls}" style="margin-bottom:10px;"></div>`);
                $holder.prepend($extra1);
            }
            if (v === "outro") $extra1.html(`<input class="form-control" name="riskInvSelect1__other" placeholder="Especifique" style="margin-bottom:10px;">`);
            else $extra1.empty();

            // reset 2 e 3
            $holder.find('select[name="riskInvSelect2"], select[name="riskInvSelect3"], .extra-riskInvSelect2-other, .extra-riskInvSelect3-other').remove();

            if (!v) return;
            renderRiskSelect($root, 2, new Set([v]));
        });

        // estado inicial
        $s1.trigger("change");
    }

    // ====== Helpers para blocos de Investidores (4.8 e 4.9) ======
    function buildInvestorRowHtml(prefix, idx) {
        // prefix: "invInit" ou "invCurr"
        // idx: 1..3
        const yearName = `${prefix}Year${idx}`;
        const invName = `${prefix}Name${idx}`;
        return `
        <div class="card mb-2 p-2 investor-item" data-idx="${idx}">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <label class="fw-semibold mb-0">Investidor ${String(idx).padStart(2, "0")}</label>
        </div>
        <div class="row g-2 align-items-end">
            <div class="col-12 col-md-4">
            <label class="form-label">Ano de Investimento</label>
            <input type="number" class="form-control" name="${yearName}" placeholder="Digite o ano" min="0" />
            </div>
            <div class="col-12 col-md-8">
            <label class="form-label">Investidor</label>
            <input type="text" class="form-control" name="${invName}" placeholder="Digite o nome do investidor" />
            </div>
        </div>
        </div>
    `;
    }

    function renderInvestorsBlock($anchorWrap, opts) {
        // opts: { prefix, max, blockClass }
        const {
            prefix,
            max,
            blockClass
        } = opts;
        const $holder = ensureContainer($anchorWrap, blockClass, true); // irmão após o wrapper do primeiro campo

        // estado inicial: se ainda não tem conteúdo, cria com 1 item + footer botões
        if (!$holder.data("rendered")) {
            $holder
                .html(`
            <div class="investors-list"></div>
            <div class="d-flex justify-content-end gap-2 mt-2 investors-actions">
            <button type="button" class="btn btn-primary btn-add-investor">Adicionar Investidor</button>
            <button type="button" class="btn btn-danger btn-remove-investor d-none">Remover Investidor</button>
            </div>
        `)
                .data("rendered", true);
        }

        const $list = $holder.find(".investors-list");
        const $btnAdd = $holder.find(".btn-add-investor");
        const $btnRem = $holder.find(".btn-remove-investor");

        function countItems() {
            return $list.children(".investor-item").length;
        }

        function updateButtons() {
            const c = countItems();
            // remover visível apenas se houver >1
            $btnRem.toggleClass("d-none", c <= 1);
            // adicionar desabilita quando chegar no máximo
            $btnAdd.prop("disabled", c >= max);
        }

        function addItem() {
            const c = countItems();
            if (c >= max) return;
            const nextIdx = c + 1;
            $list.append(buildInvestorRowHtml(prefix, nextIdx));
            updateButtons();
        }

        function removeItem() {
            const c = countItems();
            if (c <= 1) return; // Investidor 01 não remove
            $list.children(".investor-item").last().remove();
            updateButtons();
        }

        // Se a lista está vazia, cria o Investidor 01
        if (!countItems()) {
            addItem();
        }

        // Bind dos botões
        $holder.off("click.invAdd").on("click.invAdd", ".btn-add-investor", addItem);
        $holder.off("click.invRem").on("click.invRem", ".btn-remove-investor", removeItem);

        // Espelha valores já existentes do primeiro par (se o renderer tiver escrito algo nos campos originais)
        // — opcional: apenas se existir input original com valor (não obrigatório)
    }

    // ---------- 4.8 INVESTIDORES (fase inicial) ----------
    function initInvestorsInitial($root) {
        const $y = $root.find(`input[name="${N.invInitY1}"]`);
        const $n = $root.find(`input[name="${N.invInitN1}"]`);
        if (!$y.length || !$n.length) return;

        const $wrapY = wrapperFor($y);
        const $wrapN = wrapperFor($n);

        // 1) Usa o wrapper do "Ano" como âncora para inserir o bloco dinâmico
        renderInvestorsBlock($wrapY, {
            prefix: "invInit",
            max: 3,
            blockClass: "investors-init-block"
        });

        // 2) Agora pode remover completamente os campos crus do DOM
        $wrapY.remove();
        $wrapN.remove();
    }

    // ---------- 4.9 INVESTIDORES (fase atual) ----------
    function initInvestorsCurrent($root) {
        const $y = $root.find(`input[name="${N.invCurrY1}"]`);
        const $n = $root.find(`input[name="${N.invCurrN1}"]`);
        if (!$y.length || !$n.length) return;

        const $wrapY = wrapperFor($y);
        const $wrapN = wrapperFor($n);

        // monta o bloco dinâmico (máx. 3 investidores)
        renderInvestorsBlock($wrapY, {
            prefix: "invCurr",
            max: 3,
            blockClass: "investors-curr-block"
        });

        // remove campos crus
        $wrapY.remove();
        $wrapN.remove();
    }

    // ---------- 4.10 SUBSÍDIOS ----------
    function initSubsidies($root) {
        const $rad = $root.find(`input[name="${N.subs}"]`);
        if (!$rad.length) return;

        const $wrap = wrapperFor($rad.first());
        const $extra = ensureContainer($wrap, "subsidies-extra", true);

        function render() {
            const v = $root.find(`input[name="${N.subs}"]:checked`).val();
            if (v === "sim") {
                $extra.html(`
        <div class="mt-2">
          <input type="text" class="form-control" name="subsidiesDetail" placeholder="Específique" />
        </div>
      `);
            } else {
                $extra.empty();
            }
        }

        $root.off("change.subs").on("change.subs", `input[name="${N.subs}"]`, render);
        render();
    }

    // ---------- bind ----------
    function bind($root) {
        if (!$root || !$root.length) return;

        // ❌ REMOVE / COMENTA essas duas linhas:
        // if ($root.data("card4Bound")) return;
        // $root.data("card4Bound", true);

        // Pode chamar sempre, porque internamente já usamos .off() e holders idempotentes
        initNonFinancial($root);      // 4.1
        initFinancial($root);         // 4.2
        // 4.3 não tem lógica condicional
        initDedication($root);        // 4.4
        initVolunteers($root);        // 4.5
        initViability($root);         // 4.6
        initRisk($root);              // 4.7
        initInvestorsInitial($root);  // 4.8
        initInvestorsCurrent($root);  // 4.9
        initSubsidies($root);         // 4.10
    }


    return {
        bind
    };
})();