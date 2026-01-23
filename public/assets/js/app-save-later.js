(function () {

    const STORAGE_KEY = () => window.temBusinessStorageKey || "tem_business_default_data";
    let currentCardId = 1;

    function loadAllData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY());
            if (!raw) return {};
            const parsed = JSON.parse(raw);

            // Se por acaso vier um ARRAY tipo [null, {...}, {...}],
            // migramos pra objeto {"1": {...}, "2": {...}}
            if (Array.isArray(parsed)) {
                const migrated = {};
                parsed.forEach((cardData, idx) => {
                    if (cardData && typeof cardData === "object") {
                        migrated[String(idx)] = cardData;
                    }
                });
                return migrated;
            }

            return parsed && typeof parsed === "object" ? parsed : {};
        } catch (e) {
            console.error("Erro ao ler JSON do localStorage", e);
            return {};
        }
    }

    window.temLoadAllData = loadAllData;

    function saveAllData(allData) {
        try {
            localStorage.setItem(STORAGE_KEY(), JSON.stringify(allData));
        } catch (e) {
            console.error("Erro ao salvar JSON no localStorage", e);
        }
    }

    // Coleta todos os campos do formulário atual (container) para um card específico
    function collectCardData(cardId) {
        const container = document.querySelector(".section-forms .container");
        if (!container) return;

        const inputs = container.querySelectorAll("input, select, textarea");
        const cardObj = {};

        inputs.forEach(el => {
            const name = el.name;
            if (!name) return;

            // RADIO: guarda só o selecionado
            if (el.type === "radio") {
                if (!el.checked) return;
                let v = el.value;
                if (v === "true") v = true;
                else if (v === "false") v = false;
                cardObj[name] = v;
                return;
            }

            // CHECKBOX: guarda em array de valores marcados
            if (el.type === "checkbox") {
                if (!cardObj[name]) cardObj[name] = [];
                if (el.checked) {
                    cardObj[name].push(el.value);
                }
                return;
            }

            // Demais: text, number, select, textarea
            cardObj[name] = el.value;
        });

        // --- CARD 19: coletar marcos da trajetória em um array ---
        if (cardId === 19) {
            const list = container.querySelector(".trajectory-milestones-list");
            const items = list ? list.querySelectorAll(".trajectory-item") : [];

            const milestones = [];
            items.forEach(item => {
                const strong = item.querySelector("strong");
                const year = strong ? String(strong.textContent || "").trim() : "";

                // O texto completo é "ANO - descrição"
                const textDiv = item.querySelector("div");
                let desc = "";
                if (textDiv) {
                    const full = String(textDiv.textContent || "").trim();
                    // remove o "ANO - " do começo
                    desc = full.replace(/^\s*\d+\s*-\s*/, "");
                }

                if (desc) {
                    milestones.push({ year, description: desc });
                }
            });

            cardObj.milestones = milestones;
        }

        // --- CARD 20: coletar parcerias em um array ---
        if (cardId === 20) {
            const list = container.querySelector(".partnerships-list");
            const items = list ? list.querySelectorAll(".partnership-item") : [];

            const partnerships = [];
            items.forEach(item => {
                const strong = item.querySelector("strong");
                const year = strong ? String(strong.textContent || "").trim() : "";

                const textDiv = item.querySelector("div");
                let desc = "";
                if (textDiv) {
                    const full = String(textDiv.textContent || "").trim();
                    // remove o "ANO - " do começo
                    desc = full.replace(/^\s*\d+\s*-\s*/, "");
                }

                if (desc) {
                    partnerships.push({ year, description: desc });
                }
            });

            cardObj.partnerships = partnerships;
        }


        const allData = loadAllData();
        allData[String(cardId)] = cardObj;
        saveAllData(allData);

        return allData;
    }

    // Aplica dados de um card (obj {campo:valor}) nos inputs da tela
    function applyCardData(cardId) {
        const container = document.querySelector(".section-forms .container");
        if (!container) return;

        const allData = loadAllData();
        const cardData = allData[String(cardId)];
        if (!cardData || typeof cardData !== "object") return;

        const inputs = container.querySelectorAll("input, select, textarea");

        inputs.forEach(el => {
            const name = el.name;
            if (!name || !(name in cardData)) return;

            const val = cardData[name];

            if (el.type === "radio") {
                const targetVal = (val === true) ? "true" :
                    (val === false) ? "false" :
                    String(val);

                const shouldCheck = (String(el.value) === targetVal);
                const wasChecked  = el.checked;

                el.checked = shouldCheck;

                // se o estado mudou, dispara change pra Card3 (renderHistory, etc)
                if (shouldCheck !== wasChecked) {
                    el.dispatchEvent(new Event("change", { bubbles: true }));
                }
                return;
            }

            if (el.type === "checkbox") {
                let shouldCheck;
                if (Array.isArray(cardData[name])) {
                    shouldCheck = cardData[name].includes(el.value);
                } else {
                    shouldCheck = Boolean(cardData[name]);
                }

                const wasChecked = el.checked;
                el.checked = shouldCheck;

                // idem: dispara change pra Card3 (ensureSpecifyCheckbox, etc)
                if (shouldCheck !== wasChecked) {
                    el.dispatchEvent(new Event("change", { bubbles: true }));
                }
                return;
            }

            el.value = val ?? "";
            // dispara eventinho se precisar de máscaras/comportamentos
            el.dispatchEvent(new Event("input", {
                bubbles: true
            }));
            el.dispatchEvent(new Event("change", {
                bubbles: true
            }));
        });

        // Segundo passe: aplica valores em QUALQUER campo que exista no cardData,
        // inclusive os criados dinamicamente depois do primeiro loop.
        Object.keys(cardData).forEach(key => {
            const val = cardData[key];

            const elements = container.querySelectorAll(
                `input[name="${key}"], select[name="${key}"], textarea[name="${key}"]`
            );
            if (!elements.length) return;

            elements.forEach(el => {
                if (el.type === "radio") {
                    const targetVal = (val === true) ? "true" :
                        (val === false) ? "false" :
                        String(val);

                    const shouldCheck = (String(el.value) === targetVal);
                    const wasChecked  = el.checked;

                    el.checked = shouldCheck;

                    // 💡 EXCEÇÃO: no CARD 3, para hasClosedBusinesses / hasSoldBusinesses
                    // precisamos disparar o change quando o valor salvo for o selecionado,
                    // para recriar os campos condicionais (quantos encerrou / quantos vendeu etc).
                    if (
                        cardId === 3 &&
                        (key === "hasClosedBusinesses" || key === "hasSoldBusinesses") &&
                        shouldCheck && !wasChecked
                    ) {
                        el.dispatchEvent(new Event("change", { bubbles: true }));
                    }

                    // nos outros casos, continuamos SEM change pra não re-renderizar tudo
                    return;
                }


                if (el.type === "checkbox") {
                    if (Array.isArray(val)) {
                        el.checked = val.includes(el.value);
                    } else {
                        el.checked = Boolean(val);
                    }
                    // idem: sem change aqui
                    return;
                }

                const oldVal = el.value;
                el.value = val ?? "";

                // Se for SELECT e o valor mudou, dispara change pra ligar a lógica do Card3
                if (el.tagName === "SELECT") {
                    if (String(oldVal) !== String(el.value)) {
                        el.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                }
                // Para input/textarea simples não precisa disparar nada aqui
            });

        });

        // === Ajustes HARDCODED específicos do CARD 9 (Canais) ===
        if (cardId === 9 && typeof resolveCard9Fixes === "function") {
            const allData = loadAllData();
            const cardData9 = allData[String(cardId)] || {};
            resolveCard9Fixes(cardData9);
        }

        // === Ajustes HARDCODED específicos do CARD 4 (Recursos financeiros e não financeiros) ===
        if (cardId === 4 && typeof resolveCard4Fixes === "function") {
            const allData = loadAllData();
            const cardData = allData[String(cardId)] || {};
            resolveCard4Fixes(cardData);
        }

        // === Ajustes HARDCODED específicos do CARD 5 (Rede de relações) ===
        // Para o Card5, precisamos aguardar um pouco mais para garantir que os selects
        // tenham sido preenchidos e os blocos dinâmicos tenham sido criados
        if (cardId === 5 && typeof resolveCard5Fixes === "function") {
            const allData = loadAllData();
            const cardData = allData[String(cardId)] || {};
            // Aguarda um pouco para garantir que applyCardData tenha preenchido os selects
            setTimeout(() => {
                resolveCard5Fixes(cardData);
                // Depois de criar os blocos e preencher os campos básicos, 
                // cria os itens extras se necessário (para casos com mais de 3 itens)
                setTimeout(() => {
                    if (typeof resolveCard5ExtraItems === "function") {
                        resolveCard5ExtraItems(cardData);
                    }
                }, 500);
            }, 100);
        }

        // === Ajustes HARDCODED específicos do CARD 19 (Trajetória) ===
        if (cardId === 19 && typeof resolveCard19Fixes === "function") {
            const allData = loadAllData();
            const cardData = allData[String(cardId)] || {};
            resolveCard19Fixes(cardData);
        }

        // === Ajustes HARDCODED específicos do CARD 20 (Parcerias) ===
        if (cardId === 20 && typeof resolveCard20Fixes === "function") {
            const allData = loadAllData();
            const cardData = allData[String(cardId)] || {};
            resolveCard20Fixes(cardData);
        }

    }

    // 👉 Função de salvamento "real" (aqui entra sua lógica futura)
    function temPerformSave() {
      // Salva os campos do card atual no localStorage
      const allData = collectCardData(currentCardId);

      // E dispara um autosave silencioso pro backend
      if (window.temAutosaveUrl) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || "";

        fetch(window.temAutosaveUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
            "Accept": "application/json"
          },
          body: JSON.stringify({
            data: allData || {}
          })
        }).catch(err => {
          // silencioso mesmo – não queremos travar navegação
          console.error("Erro no autosave", err);
        });

        // Depois de salvar com sucesso:
        const allDataAfterSave = loadAllData();
        window.dispatchEvent(new CustomEvent("tem:form-saved", {
            detail: {
                currentCardId,
                allData: allDataAfterSave
            }
        }));

      }
    }

    // 👉 Função pública para o botão "Salvar e continuar mais tarde"
    function temSaveAndContinueLater() {
        try{
            temPerformSave();
        }finally{
            window.location.href = "/dashboard";
        }
    }

    // ======================================================================
    // HARDCODED: Correções específicas do CARD 4 (Recursos financeiros) 😎
    // ======================================================================
    function resolveCard4Fixes(cardData) {
        const container = document.querySelector(".section-forms .container");
        if (!container || !cardData) return;

        resolveDedicationHow(container, cardData);
        resolveInvestorsInitial(container, cardData);
        resolveInvestorsCurrent(container, cardData);
        resolveSubsidies(container, cardData);

        // 🔥 NOVO: reabrir os “Outro” dos blocos de NF (equip, rede, infra)
        resolveNfSpecialOthers(container, cardData);
    }

    function resolveDedicationHow(container, cardData) {
        const val = cardData.currentDedication;
        if (!val) return;

        // Garante que o radio "currentDedication" correto está marcado
        const radio = container.querySelector(`input[name="currentDedication"][value="${val}"]`);
        if (!radio) return;

        radio.checked = true;
        // Dispara change pra deixar o Card4 criar o input currentDedicationHow
        radio.dispatchEvent(new Event("change", { bubbles: true }));

        // Agora, se já temos valor salvo, preenche o campo "Como?"
        if (cardData.currentDedicationHow != null) {
            const howInput = container.querySelector('input[name="currentDedicationHow"]');
            if (howInput) {
                howInput.value = cardData.currentDedicationHow;
            }
        }
    }

    function resolveInvestorsInitial(container, cardData) {
        const block = container.querySelector(".investors-init-block");
        if (!block || !cardData) return;

        const list = block.querySelector(".investors-list");
        const btnAdd = block.querySelector(".btn-add-investor");
        if (!list || !btnAdd) return;

        // Descobre até qual índice temos dados (1..3)
        let needed = 0;
        for (let i = 1; i <= 3; i++) {
            const yearKey = `invInitYear${i}`;
            const nameKey = `invInitName${i}`;
            const yearVal = cardData[yearKey];
            const nameVal = cardData[nameKey];

            const hasSomething =
                (yearVal != null && String(yearVal).trim() !== "") ||
                (nameVal != null && String(nameVal).trim() !== "");

            if (hasSomething) {
                needed = i;
            }
        }

        if (!needed) return; // nada pra fazer

        const countRows = () => list.querySelectorAll(".investor-item").length;

        // Cria linhas extras (2, 3) clicando no botão de adicionar
        while (countRows() < needed) {
            btnAdd.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        }

        // Agora preenche cada linha com o que veio do JSON
        for (let i = 1; i <= needed; i++) {
            const yearKey = `invInitYear${i}`;
            const nameKey = `invInitName${i}`;

            const yearVal = cardData[yearKey];
            const nameVal = cardData[nameKey];

            const yearInput = list.querySelector(`input[name="${yearKey}"]`);
            const nameInput = list.querySelector(`input[name="${nameKey}"]`);

            if (yearInput && yearVal != null) {
                yearInput.value = yearVal;
            }
            if (nameInput && nameVal != null) {
                nameInput.value = nameVal;
            }
        }
    }

    function resolveInvestorsCurrent(container, cardData) {
        const block = container.querySelector(".investors-curr-block");
        if (!block || !cardData) return;

        const list = block.querySelector(".investors-list");
        const btnAdd = block.querySelector(".btn-add-investor");
        if (!list || !btnAdd) return;

        let needed = 0;
        for (let i = 1; i <= 3; i++) {
            const yearKey = `invCurrYear${i}`;
            const nameKey = `invCurrName${i}`;
            const yearVal = cardData[yearKey];
            const nameVal = cardData[nameKey];

            const hasSomething =
                (yearVal != null && String(yearVal).trim() !== "") ||
                (nameVal != null && String(nameVal).trim() !== "");

            if (hasSomething) {
                needed = i;
            }
        }

        if (!needed) return;

        const countRows = () => list.querySelectorAll(".investor-item").length;

        while (countRows() < needed) {
            btnAdd.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        }

        for (let i = 1; i <= needed; i++) {
            const yearKey = `invCurrYear${i}`;
            const nameKey = `invCurrName${i}`;

            const yearVal = cardData[yearKey];
            const nameVal = cardData[nameKey];

            const yearInput = list.querySelector(`input[name="${yearKey}"]`);
            const nameInput = list.querySelector(`input[name="${nameKey}"]`);

            if (yearInput && yearVal != null) {
                yearInput.value = yearVal;
            }
            if (nameInput && nameVal != null) {
                nameInput.value = nameVal;
            }
        }
    }

    function resolveSubsidies(container, cardData) {
        if (!cardData || cardData.subsidies == null) return;

        const v = String(cardData.subsidies);
        const radio = container.querySelector(`input[name="subsidies"][value="${v}"]`);
        if (radio) {
            radio.checked = true;
            // dispara change pra Card4 criar/limpar subsidiesDetail
            radio.dispatchEvent(new Event("change", { bubbles: true }));
        }

        if (cardData.subsidiesDetail != null) {
            const detailInput = container.querySelector('input[name="subsidiesDetail"]');
            if (detailInput) {
                detailInput.value = cardData.subsidiesDetail;
            }
        }
    }

    // Reabre os campos "Outro" dos blocos de NÃO FINANCEIROS (equip, rede, infra)
    function resolveNfSpecialOthers(container, cardData) {

        function fixBlock(blockSelector, checkboxName, valueKey) {
            const val = cardData[valueKey];
            if (val == null || String(val).trim() === "") return;

            const block = container.querySelector(blockSelector);
            if (!block) return;

            // Marca o checkbox "outro"
            const chk = block.querySelector(`input[type="checkbox"][name="${checkboxName}"]`);
            if (!chk) return;

            // Garante que esteja marcado
            chk.checked = true;

            // 🔴 IMPORTANTE: SEMPRE dispara change para recriar o input de texto,
            // mesmo que já estivesse marcado antes
            chk.dispatchEvent(new Event("change", { bubbles: true }));

            // Agora procura o input de texto (mesmo name, mas NÃO checkbox)
            const textInput = block.querySelector(
                `input[name="${valueKey}"]:not([type="checkbox"])`
            );
            if (textInput) {
                textInput.value = val;
            }
        }

        // nf-block-equip → nf_equip_outro
        fixBlock(".nf-block-equip", "nf_equip_outro", "nf_equip_outro");

        // nf-block-rede → nf_rede_outro
        fixBlock(".nf-block-rede", "nf_rede_outro", "nf_rede_outro");

        // nf-block-infra → nf_infra_outro
        fixBlock(".nf-block-infra", "nf_infra_outro", "nf_infra_outro");
    }

    // ======================================================================
    // HARDCODED: Correções específicas do CARD 5 (Rede de relações) 😎
    // ======================================================================
    function resolveCard5Fixes(cardData) {
        const container = document.querySelector(".section-forms .container");
        if (!container || !cardData) return;

        // Helper genérico: garante quantidade de itens e preenche campos
        function ensureRelations(prefixBase, selectBase) {
            // PASSO 1: Preenche os selects na ordem (1, depois 2, depois 3)
            // Isso é importante porque o select 2 só aparece se o 1 tiver valor, etc.
            const selectsToFill = [];
            for (let i = 1; i <= 3; i++) {
                const selKey = `${selectBase}${i}`;   // ex: relSelect1, relPostSelect2
                const cat = cardData[selKey];
                if (!cat) continue;

                const select = container.querySelector(`select[name="${selKey}"]`);
                if (select) {
                    selectsToFill.push({ select, cat, selKey, index: i });
                }
            }

            // Preenche os selects sequencialmente para garantir que os blocos sejam criados na ordem
            function fillSelectsSequentially(index) {
                if (index >= selectsToFill.length) {
                    // Todos os selects foram preenchidos, agora popula os campos
                    setTimeout(() => {
                        populateAllBlockFields(prefixBase, selectBase, cardData);
                    }, 300);
                    return;
                }

                const { select, cat, selKey } = selectsToFill[index];
                const oldVal = select.value;
                
                // Garante que o select tenha a opção disponível antes de selecionar
                if (select.querySelector(`option[value="${cat}"]`)) {
                    select.value = cat;
                    
                    // SEMPRE dispara change para criar o bloco dinâmico, mesmo se o valor já estava selecionado
                    // porque pode ser que o bloco não tenha sido criado ainda
                    select.dispatchEvent(new Event("change", { bubbles: true }));
                } else {
                    // Se a opção não existe, tenta adicionar ou aguarda
                    console.warn(`Opção ${cat} não encontrada no select ${selKey}`);
                }

                // Aguarda um pouco antes de preencher o próximo select
                setTimeout(() => {
                    fillSelectsSequentially(index + 1);
                }, 150);
            }

            // Inicia o preenchimento sequencial
            if (selectsToFill.length > 0) {
                fillSelectsSequentially(0);
            } else {
                // Se não há selects para preencher, tenta popular campos de qualquer forma
                setTimeout(() => {
                    populateAllBlockFields(prefixBase, selectBase, cardData);
                }, 300);
            }
        }

        // Função auxiliar para popular todos os blocos de campos
        function populateAllBlockFields(prefixBase, selectBase, cardData) {
            // Itera sobre os 3 selects possíveis
            for (let i = 1; i <= 3; i++) {
                const selKey = `${selectBase}${i}`;   // ex: relSelect1, relPostSelect2
                const cat = cardData[selKey];
                if (!cat) continue;

                // Função recursiva para tentar encontrar/criar o bloco
                function tryPopulateBlock(attempts = 0) {
                    if (attempts > 5) {
                        console.warn(`Não foi possível criar o bloco para ${cat} após ${attempts} tentativas`);
                        return;
                    }

                    // Tenta encontrar o bloco (pode estar oculto)
                    let block = container.querySelector(`.rel-category-block[data-cat="${cat}"]`);
                    
                    // Se não encontrou, tenta forçar a criação novamente
                    if (!block) {
                        const select = container.querySelector(`select[name="${selKey}"]`);
                        if (select) {
                            // Garante que o select tenha o valor correto
                            if (select.value !== cat) {
                                select.value = cat;
                            }
                            // SEMPRE dispara change para criar o bloco, mesmo se o valor já estava correto
                            select.dispatchEvent(new Event("change", { bubbles: true }));
                        }
                        // Aguarda um pouco e tenta novamente
                        setTimeout(() => {
                            tryPopulateBlock(attempts + 1);
                        }, 200);
                        return;
                    }

                    // Bloco encontrado! Garante que esteja visível
                    const $block = $(block);
                    $block.removeClass("d-none");

                    // Popula os campos do bloco
                    populateBlockFields(prefixBase, cat, cardData, block);
                }

                // Inicia a tentativa de popular o bloco
                tryPopulateBlock();
            }
        }

        // Função auxiliar para popular os campos de um bloco específico
        function populateBlockFields(prefixBase, cat, cardData, block) {
            if (!block) return;

            const list = block.querySelector(".rel-items-list");
            const btnAdd = block.querySelector(".btn-add");
            if (!list || !btnAdd) return;

            const base = `${prefixBase}${cat}`;   // ex: rel_amigos, relPost_colegas

            // Descobre até qual índice (1..3) temos dados no JSON
            let needed = 0;
            for (let idx = 1; idx <= 3; idx++) {
                const originKey = `${base}_origem_${idx}`;
                const tipoKey   = `${base}_tipo_${idx}`;
                const natKey    = `${base}_natureza_${idx}[]`;

                const hasOrigin = cardData[originKey] != null && String(cardData[originKey]).trim() !== "";
                const hasTipo   = cardData[tipoKey]   != null && String(cardData[tipoKey]).trim()   !== "";
                const hasNat    = Array.isArray(cardData[natKey]) && cardData[natKey].length > 0;

                if (hasOrigin || hasTipo || hasNat) {
                    needed = idx;
                }
            }

            if (!needed) return;

            const countItems = () => list.querySelectorAll(".rel-item").length;

            // Cria contatos adicionais (2,3) se necessário clicando em "Adicionar Contato"
            while (countItems() < needed) {
                btnAdd.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            }

            // Aguarda um pouco para os itens serem criados
            setTimeout(() => {
                // Agora preenche cada contato com o que veio do JSON
                for (let idx = 1; idx <= needed; idx++) {
                    const originKey      = `${base}_origem_${idx}`;
                    const tipoKey        = `${base}_tipo_${idx}`;
                    const tipoOutroKey   = `${base}_tipoOutro_${idx}`;
                    const natKey         = `${base}_natureza_${idx}[]`;
                    const natOutroKey    = `${base}_naturezaOutro_${idx}`;

                    const originVal    = cardData[originKey];
                    const tipoVal      = cardData[tipoKey];
                    const tipoOutroVal = cardData[tipoOutroKey];
                    const natVal       = cardData[natKey];
                    const natOutroVal  = cardData[natOutroKey];

                    // Usa um pequeno delay para cada item para garantir que os campos sejam encontrados
                    setTimeout(() => {
                        // Origem
                        if (originVal != null && String(originVal).trim() !== "") {
                            const originInput = container.querySelector(`input[name="${originKey}"]`);
                            if (originInput) {
                                originInput.value = originVal;
                            }
                        }

                        // Tipo (radio)
                        if (tipoVal != null && String(tipoVal).trim() !== "") {
                            const radio = container.querySelector(`input[name="${tipoKey}"][value="${tipoVal}"]`);
                            if (radio) {
                                radio.checked = true;
                                // SEMPRE dispara change para garantir recriação do campo *_tipoOutro_ se for "outro"
                                radio.dispatchEvent(new Event("change", { bubbles: true }));
                                
                                // TipoOutro (text) - precisa aguardar um pouco para o campo ser criado
                                if (tipoOutroVal != null && String(tipoOutroVal).trim() !== "") {
                                    setTimeout(() => {
                                        const outroInput = container.querySelector(`input[name="${tipoOutroKey}"]`);
                                        if (outroInput) {
                                            outroInput.value = tipoOutroVal;
                                        }
                                    }, 100);
                                }
                            }
                        }

                        // Natureza (checkboxes)
                        if (Array.isArray(natVal) && natVal.length > 0) {
                            natVal.forEach((v, checkIdx) => {
                                setTimeout(() => {
                                    const cb = container.querySelector(`input[name='${natKey}'][value='${v}']`);
                                    if (cb) {
                                        cb.checked = true;
                                        // SEMPRE dispara change pra garantir recriação do campo *_naturezaOutro_
                                        // quando houver "outro" ou "outro_setor"
                                        cb.dispatchEvent(new Event("change", { bubbles: true }));
                                    }
                                }, checkIdx * 50);
                            });
                            
                            // NaturezaOutro (text) - precisa aguardar um pouco para o campo ser criado
                            if (natOutroVal != null && String(natOutroVal).trim() !== "") {
                                setTimeout(() => {
                                    const natOutInput = container.querySelector(`input[name="${natOutroKey}"]`);
                                    if (natOutInput) {
                                        natOutInput.value = natOutroVal;
                                    }
                                }, 200);
                            }
                        }
                    }, idx * 50); // Delay escalonado para cada item
                }
            }, 200);
        }

        // Inicial (5.1): relSelect1..3 + rel_<cat>_...
        ensureRelations("rel_", "relSelect");

        // Pós-inicial (5.2): relPostSelect1..3 + relPost_<cat>_...
        ensureRelations("relPost_", "relPostSelect");
    }

    // ======================================================================
    // HARDCODED: Correções específicas do CARD 19 (Trajetória do empreendimento) 😎
    // ======================================================================
    function resolveCard19Fixes(cardData) {
        const container = document.querySelector(".section-forms .container");
        if (!container || !cardData) return;

        const milestones = Array.isArray(cardData.milestones) ? cardData.milestones : [];
        const list = container.querySelector(".trajectory-milestones-list");
        const btnAdd = container.querySelector(".btn-add-milestone");
        const descInput = container.querySelector('[name="milestoneDescription"]');
        const yearInput = container.querySelector('input[name="milestoneYear"]');

        if (!list || !btnAdd || !descInput || !yearInput) return;

        // Limpa lista atual antes de recriar
        list.innerHTML = "";
        if (!milestones.length) {
            list.classList.add("d-none");
            return;
        }

        // Garante que o container apareça
        list.classList.remove("d-none");

        // Para cada marco salvo, usamos o próprio botão "Adicionar"
        milestones.forEach(m => {
            descInput.value = m.description || "";
            yearInput.value = m.year || "";
            // Atualiza o contador "Marco (X/1000):"
            descInput.dispatchEvent(new Event("input", { bubbles: true }));
            // Clica no botão para criar o card visualmente
            btnAdd.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        // No final, os inputs já ficam limpos pelo próprio addMilestoneFromInputs()
    }

    // ======================================================================
    // HARDCODED: Correções específicas do CARD 20 (Parcerias) 😎
    // ======================================================================
    function resolveCard20Fixes(cardData) {
        const container = document.querySelector(".section-forms .container");
        if (!container || !cardData) return;

        const partnerships = Array.isArray(cardData.partnerships) ? cardData.partnerships : [];
        const list = container.querySelector(".partnerships-list");
        const btnAdd = container.querySelector(".btn-add-partnership");
        const descInput = container.querySelector('[name="partnershipDescription"]');
        const yearInput = container.querySelector('input[name="partnershipYear"]');

        if (!list || !btnAdd || !descInput || !yearInput) return;

        // Limpa a lista antes de recriar
        list.innerHTML = "";
        if (!partnerships.length) {
            list.classList.add("d-none");
            return;
        }

        list.classList.remove("d-none");

        partnerships.forEach(p => {
            descInput.value = p.description || "";
            yearInput.value = p.year || "";

            // Atualiza o contador "Parceria (X/1000):"
            descInput.dispatchEvent(new Event("input", { bubbles: true }));

            // Usa a própria lógica do Card 20 (addPartnershipFromInputs)
            btnAdd.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        // O próprio addPartnershipFromInputs limpa os campos no final
    }

    // ======================================================================
    // HARDCODED: Correções específicas do CARD 5 (Rede de Relações) 😎
    // ======================================================================
    function resolveCard5ExtraItems(cardData) {
        const container = document.querySelector(".section-forms .container");
        if (!container || !cardData) return;

        const categories = [
            "amigos", "colegas", "familiares", "mentores", "empregador",
            "outrosEmpreendedores", "nenhumPrevio", "parceirosFornecedores", "outrasRelacoes"
        ];

        categories.forEach(cat => {
            // Verifica 5.1 (fase inicial)
            createExtraItemsFor(container, cardData, cat, `rel_${cat}`);
            // Verifica 5.2 (fase pós-inicial)
            createExtraItemsFor(container, cardData, cat, `relPost_${cat}`);
        });
    }

    function createExtraItemsFor(container, cardData, cat, prefix) {
        // Descobre quantos itens existem nos dados salvos
        let maxIdx = 0;
        for (let i = 1; i <= 10; i++) {
            const key = `${prefix}_origem_${i}`;
            const tipoKey = `${prefix}_tipo_${i}`;
            const natKey = `${prefix}_natureza_${i}[]`;
            
            const hasOrigin = cardData[key] && String(cardData[key]).trim() !== "";
            const hasTipo = cardData[tipoKey] && String(cardData[tipoKey]).trim() !== "";
            const hasNat = Array.isArray(cardData[natKey]) && cardData[natKey].length > 0;
            
            if (hasOrigin || hasTipo || hasNat) {
                maxIdx = i;
            }
        }

        if (maxIdx <= 1) return; // Só 1 item ou nenhum, não precisa criar extras

        // Procura o bloco desta categoria (pode estar oculto)
        const $block = $(container).find(`.rel-category-block[data-cat="${cat}"]`);
        if (!$block.length) {
            // Bloco não existe ainda, tenta novamente depois
            setTimeout(() => createExtraItemsFor(container, cardData, cat, prefix), 200);
            return;
        }

        // Garante que o bloco esteja visível
        $block.removeClass("d-none");

        const $list = $block.find(".rel-items-list");
        const $btnAdd = $block.find(".btn-add");
        if (!$list.length || !$btnAdd.length) return;

        // Conta quantos itens já existem
        const currentCount = $list.find(".rel-item").length;

        // Cria os itens faltantes (apenas se necessário)
        if (currentCount < maxIdx) {
            for (let i = currentCount + 1; i <= maxIdx; i++) {
                $btnAdd[0].click(); // Clica no botão "Adicionar Contato"
            }

            // 🔥 REAPLICA OS DADOS APÓS CRIAR OS ITENS EXTRAS
            setTimeout(() => {
                fillExtraItemsData(container, cardData, cat, prefix, maxIdx);
            }, 200);
        }
    }

    function fillExtraItemsData(container, cardData, cat, prefix, maxIdx) {
        // Preenche os dados de cada item criado (sem disparar change para evitar loops)
        for (let idx = 2; idx <= maxIdx; idx++) {
            // Origem
            const origemKey = `${prefix}_origem_${idx}`;
            const origemVal = cardData[origemKey];
            if (origemVal) {
                const $origemInput = $(container).find(`input[name="${origemKey}"]`);
                if ($origemInput.length) {
                    $origemInput.val(origemVal);
                }
            }

            // Tipo de colaboração (radio) - SEM trigger de change
            const tipoKey = `${prefix}_tipo_${idx}`;
            const tipoVal = cardData[tipoKey];
            if (tipoVal) {
                const $tipoRadio = $(container).find(`input[name="${tipoKey}"][value="${tipoVal}"]`);
                if ($tipoRadio.length) {
                    $tipoRadio.prop("checked", true);
                    // Dispara change só para mostrar campos condicionais
                    setTimeout(() => $tipoRadio.trigger("change"), 50);
                }
            }

            // Tipo outro (input)
            const tipoOutroKey = `${prefix}_tipoOutro_${idx}`;
            const tipoOutroVal = cardData[tipoOutroKey];
            if (tipoOutroVal) {
                setTimeout(() => {
                    const $tipoOutroInput = $(container).find(`input[name="${tipoOutroKey}"]`);
                    if ($tipoOutroInput.length) {
                        $tipoOutroInput.val(tipoOutroVal);
                    }
                }, 150);
            }

            // Natureza (checkboxes) - SEM trigger de change
            const naturezaKey = `${prefix}_natureza_${idx}[]`;
            const naturezaVal = cardData[naturezaKey];
            if (Array.isArray(naturezaVal)) {
                naturezaVal.forEach(v => {
                    const $naturezaCheck = $(container).find(`input[name="${naturezaKey}"][value="${v}"]`);
                    if ($naturezaCheck.length) {
                        $naturezaCheck.prop("checked", true);
                        // Dispara change só para mostrar campos condicionais
                        setTimeout(() => $naturezaCheck.trigger("change"), 50);
                    }
                });
            }

            // Natureza outro (input)
            const naturezaOutroKey = `${prefix}_naturezaOutro_${idx}`;
            const naturezaOutroVal = cardData[naturezaOutroKey];
            if (naturezaOutroVal) {
                setTimeout(() => {
                    const $naturezaOutroInput = $(container).find(`input[name="${naturezaOutroKey}"]`);
                    if ($naturezaOutroInput.length) {
                        $naturezaOutroInput.val(naturezaOutroVal);
                    }
                }, 200);
            }
        }
    }

    // ======================================================================
    // HARDCODED: Correções específicas do CARD 9 (Canais) 😎
    // ======================================================================
    function resolveCard9Fixes(cardData) {
        const container = document.querySelector(".section-forms .container");
        if (!container || !cardData) return;

        Object.keys(cardData).forEach(key => {
            const val = cardData[key];

            // Campos "Outro" (texto), ex: channels6__other, channels7__other
            if (key.endsWith("__other")) {
                const input = container.querySelector(`input[name="${key}"]`);
                if (input) {
                    input.value = val ?? "";
                }
                return;
            }

            // Campos de redes sociais (checkboxes), ex: channels5__socials[]
            if (key.endsWith("__socials[]") && Array.isArray(val)) {
                val.forEach(v => {
                    const cb = container.querySelector(
                        `input[type="checkbox"][name="${key}"][value="${v}"]`
                    );
                    if (cb) {
                        cb.checked = true;
                    }
                });
            }
        });
    }

  // Deixa as funções acessíveis globalmente
  window.temPerformSave = temPerformSave;
  window.temSaveAndContinueLater = temSaveAndContinueLater;

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnSaveLater');
    if (btn) {
      btn.addEventListener('click', () => {
        temSaveAndContinueLater();
      });
    }

    // Quando o formulário de um card for (re)renderizado, aplica dados do localStorage
    const container = document.querySelector(".section-forms .container");
    if (container) {
      container.addEventListener("form:rendered", (ev) => {
        const cardId = Number(ev.detail?.cardId) || 1;
        currentCardId = cardId;

        // Deixa o CardX.bind rodar e criar os campos dinâmicos primeiro
        setTimeout(() => {
          applyCardData(cardId);
        }, 0);
      });
    }
  });

  // Sempre que o card/bloco mudar (clicando no card ou usando anterior/próximo)
  window.addEventListener('card:selected', (ev) => {
    const cardId = Number(ev.detail?.cardId) || 1;
    currentCardId = cardId;
    // NÃO chama temPerformSave aqui,
    // porque esse evento já é disparado DEPOIS de trocar o card.
  });

})();
