(function () {
    // Quantidade mínima de campos preenchidos para considerar "Concluído"
    // Você pode ajustar manualmente esses números, card por card.
    const MIN_KEYS_BY_CARD = {
        1: 25,  // CARD 1 tem 25 campos válidos preenchidos
        2: 7,   // Nome, gênero, nascimento, nacionalidade, CPF, email, telefone
        3: 10,  // Educação, papel, funções (array), motivação, situação, passos, inovação...
        4: 20,  // Bastante campos fixos + dedicações + investidores
        5: 15,  // Relações e natureza de contatos
        6: 1,   // "decisionMain" apenas (mínimo do mínimo)
        7: 4,   // Problema, diferenciais, etc.
        8: 4,
        9: 3,
        10: 6,
        11: 6,
        12: 3,
        13: 3,
        14: 4,
        15: 7,
        16: 3,
        17: 10,
        18: 2,
        19: 1,  // Apenas 1 marco exigido (milestones array)
        20: 1   // Apenas 1 parceria exigida (partnerships array)
    };

    function getAllDataSafe() {
        if (typeof window.temLoadAllData === "function") {
            return window.temLoadAllData() || {};
        }
        return {};
    }

    // Função para obter dados atuais do formulário (em tempo real)
    function getCurrentFormData(cardId) {
        const formsSection = document.querySelector('.section-forms');
        if (!formsSection) return null;

        const formData = {};
        const inputs = formsSection.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            if (!input.name) return;

            const name = input.name;
            let value = null;

            // Select
            if (input.tagName === 'SELECT') {
                value = input.value;
                // Se for select com opção vazia selecionada, considera como vazio
                if (value === '' || value === null) {
                    value = '';
                }
            }
            // Checkbox
            else if (input.type === 'checkbox') {
                // Se já existe o campo, transforma em array ou adiciona ao array
                if (formData[name] !== undefined) {
                    if (Array.isArray(formData[name])) {
                        if (input.checked) formData[name].push(value || true);
                    } else {
                        formData[name] = [formData[name], input.checked ? (value || true) : null].filter(Boolean);
                    }
                    return;
                }
                value = input.checked ? (input.value || true) : false;
            }
            // Radio
            else if (input.type === 'radio') {
                if (input.checked) {
                    formData[name] = input.value;
                }
                return;
            }
            // File
            else if (input.type === 'file') {
                value = input.files && input.files.length > 0 ? input.files[0].name : '';
            }
            // Input normal e textarea
            else {
                value = input.value;
            }

            // Se o campo já existe (múltiplos inputs com mesmo name), transforma em array
            if (formData[name] !== undefined && !Array.isArray(formData[name])) {
                formData[name] = [formData[name], value].filter(v => v !== null && v !== '');
            } else if (formData[name] !== undefined && Array.isArray(formData[name])) {
                if (value !== null && value !== '') formData[name].push(value);
            } else {
                formData[name] = value;
            }
        });

        return formData;
    }

    function computeStatusForCard(cardId, allData) {
        const key = String(cardId);
        const cardData = allData[key];

        if (!cardData) {
            return {
                state: "not_started",
                label: "Não iniciado",
                badgeClass: "bg-light text-muted"
            };
        }

        // Conta quantas "keys válidas" existem
        let filledCount = 0;
        Object.keys(cardData).forEach(k => {
            const v = cardData[k];

            if (v === null || v === undefined) return;

            if (Array.isArray(v)) {
                if (v.length > 0) filledCount++;
                return;
            }

            if (typeof v === "object") {
                // Ex.: milestones, partnerships, etc.
                if (Object.keys(v).length > 0) filledCount++;
                return;
            }

            const str = String(v).trim();
            if (str.length > 0) {
                filledCount++;
            }
        });

        const minKeys = MIN_KEYS_BY_CARD[cardId] || 1;
        const fields = Object.keys(cardData);

        // Verifica quantos campos required foram preenchidos
        let requiredFilledCount = 0;
        let totalRequiredCount = 0;
        const missingRequired = [];

        // Busca o schema do formulário para verificar campos required
        const formSchema = window.FormSchemas?.[String(cardId)];

        if (formSchema && formSchema.groups) {
            // Percorre todos os grupos do schema
            formSchema.groups.forEach(group => {
                // Verifica se o grupo tem blocks
                if (Array.isArray(group.blocks)) {
                    group.blocks.forEach(block => {
                        if (Array.isArray(block.fields)) {
                            block.fields.forEach(field => {
                                if (field.type === "row" && Array.isArray(field.cols)) {
                                    field.cols.forEach(col => {
                                        if (col.field && col.field.required) {
                                            totalRequiredCount++;
                                            const value = cardData[col.field.name];
                                            let isFilled = false;
                                            if (value !== null && value !== undefined) {
                                                if (Array.isArray(value)) {
                                                    if (value.length > 0) { requiredFilledCount++; isFilled = true; }
                                                } else if (typeof value === "object") {
                                                    if (Object.keys(value).length > 0) { requiredFilledCount++; isFilled = true; }
                                                } else {
                                                    const str = String(value).trim();
                                                    if (str.length > 0) { requiredFilledCount++; isFilled = true; }
                                                }
                                            }
                                            if (!isFilled) missingRequired.push(col.field.name);
                                        }
                                    });
                                } else if (field.required) {
                                    totalRequiredCount++;
                                    const value = cardData[field.name];
                                    let isFilled = false;
                                    if (value !== null && value !== undefined) {
                                        if (Array.isArray(value)) {
                                            if (value.length > 0) requiredFilledCount++;
                                        } else if (typeof value === "object") {
                                            if (Object.keys(value).length > 0) requiredFilledCount++;
                                        } else {
                                            const str = String(value).trim();
                                            if (str.length > 0) requiredFilledCount++;
                                        }
                                    }
                                }
                            });
                        }
                    });
                }

                // Verifica se o grupo tem fields diretos (retrocompatibilidade)
                if (Array.isArray(group.fields)) {
                    group.fields.forEach(field => {
                        if (field.type === "row" && Array.isArray(field.cols)) {
                            field.cols.forEach(col => {
                                if (col.field && col.field.required) {
                                    totalRequiredCount++;
                                    const value = cardData[col.field.name];
                                    let isFilled = false;
                                    if (value !== null && value !== undefined) {
                                        if (Array.isArray(value)) {
                                            if (value.length > 0) requiredFilledCount++;
                                        } else if (typeof value === "object") {
                                            if (Object.keys(value).length > 0) requiredFilledCount++;
                                        } else {
                                            const str = String(value).trim();
                                            if (str.length > 0) requiredFilledCount++;
                                        }
                                    }
                                }
                            });
                        } else if (field.required) {
                            totalRequiredCount++;
                            const value = cardData[field.name];
                            let isFilled = false;
                            if (value !== null && value !== undefined) {
                                if (Array.isArray(value)) {
                                    if (value.length > 0) { requiredFilledCount++; isFilled = true; }
                                } else if (typeof value === "object") {
                                    if (Object.keys(value).length > 0) { requiredFilledCount++; isFilled = true; }
                                } else {
                                    const str = String(value).trim();
                                    if (str.length > 0) { requiredFilledCount++; isFilled = true; }
                                }
                            }
                            if (!isFilled) missingRequired.push(field.name);
                        }
                    });
                }
            });
        }

        if (missingRequired.length > 0) {
            console.log(`⚠️ Card ${cardId} - Campos required não preenchidos:`, missingRequired);
        }

        // Regras de status:
        // 1. Se não tem nenhum campo preenchido -> "Não iniciado"
        //    (Cobre os casos: sem required e sem dados OU com required e sem dados)
        if (filledCount === 0) {
            return {
                state: "not_started",
                label: "Não iniciado",
                badgeClass: "bg-light text-muted"
            };
        }

        // 2. Se não tem campos required mas tem campos preenchidos -> "Concluído"
        if (totalRequiredCount === 0 && filledCount > 0) {
            return {
                state: "done",
                label: "Concluído",
                badgeClass: "bg-success text-white"
            };
        }

        // 3. Se todos os campos required estão preenchidos -> "Concluído"
        if (totalRequiredCount > 0 && requiredFilledCount === totalRequiredCount) {
            return {
                state: "done",
                label: "Concluído",
                badgeClass: "bg-success text-white"
            };
        }

        // 4. Se tem algum campo preenchido mas nem todos os required -> "Em andamento"
        return {
            state: "in_progress",
            label: "Em andamento",
            badgeClass: "bg-warning text-dark"
        };
    }

    function updateCardsStatuses(useCurrentFormData = false) {
        const allData = getAllDataSafe();

        for (let cardId = 1; cardId <= 20; cardId++) {
            const cardEl = document.getElementById("card-tem-" + cardId);
            if (!cardEl) continue;

            const statusEl = cardEl.querySelector(".tem-card-status-label");
            if (!statusEl) continue;

            // Se useCurrentFormData for true, tenta usar dados do formulário atual
            let dataToUse = allData;
            if (useCurrentFormData) {
                const formData = getCurrentFormData(cardId);
                if (formData && Object.keys(formData).length > 0) {
                    dataToUse = { ...allData };
                    // Mescla dados salvos com dados atuais do formulário
                    dataToUse[String(cardId)] = {
                        ...(allData[String(cardId)] || {}),
                        ...formData
                    };
                }
            }

            const status = computeStatusForCard(cardId, dataToUse);

            // Reseta classes Bootstrap básicas de badge antes
            statusEl.classList.remove(
                "bg-light",
                "bg-warning",
                "bg-success",
                "text-muted",
                "text-dark",
                "text-white"
            );

            statusEl.textContent = status.label;

            // Aplica classes novas
            status.badgeClass.split(" ").forEach(cls => {
                if (cls) statusEl.classList.add(cls);
            });
        }
    }

    // Atualiza quando o DOM estiver pronto
    document.addEventListener("DOMContentLoaded", () => {
        updateCardsStatuses();

        // Adiciona listener para detectar mudanças em campos do formulário
        setupFormChangeListeners();

        // Adiciona click nos cards para atualizar também
        setupCardClickListeners();
    });

    // Atualiza sempre que um salvamento for feito
    window.addEventListener("tem:form-saved", () => {
        updateCardsStatuses();
    });

    // Se você quiser garantir depois do "app-ready" (quando tudo foi reidratado):
    window.addEventListener("tem:app-ready", () => {
        updateCardsStatuses();
    });

    // Reconfigurar listeners quando um novo card/formulário for renderizado
    window.addEventListener("tem:form-rendered", () => {
        setupFormChangeListeners();
        // Atualiza com dados do formulário após renderizar
        setTimeout(() => updateCardsStatuses(true), 100);
    });

    // Função para adicionar click nos cards
    function setupCardClickListeners() {
        for (let cardId = 1; cardId <= 20; cardId++) {
            const cardEl = document.querySelector(`[data-card="${cardId}"]`);
            if (cardEl) {
                cardEl.addEventListener('click', () => {
                    // Pequeno delay para dar tempo de renderizar o formulário
                    setTimeout(() => {
                        setupFormChangeListeners();
                        updateCardsStatuses(true);
                    }, 200);
                });
            }
        }
    }

    // Função para configurar listeners de mudança nos campos
    function setupFormChangeListeners() {
        const formsSection = document.querySelector('.section-forms');

        if (!formsSection) {
            return;
        }

        // Remove listeners antigos se existirem
        const oldInput = formsSection.__inputListener;
        const oldChange = formsSection.__changeListener;
        if (oldInput) formsSection.removeEventListener('input', oldInput);
        if (oldChange) formsSection.removeEventListener('change', oldChange);

        // Cria novos listeners
        const inputListener = (e) => {
            if (e.target.matches('input, select, textarea')) {
                clearTimeout(window.statusDebounceTimer);
                window.statusDebounceTimer = setTimeout(() => {
                    // Atualiza usando dados atuais do formulário
                    updateCardsStatuses(true);

                    // Salva em background
                    if (typeof window.temSaveCurrentCard === 'function') {
                        window.temSaveCurrentCard();
                    }
                }, 300);
            }
        };

        const changeListener = (e) => {
            if (e.target.matches('input, select, textarea')) {
                // Atualiza usando dados atuais do formulário
                updateCardsStatuses(true);

                // Salva em background
                if (typeof window.temSaveCurrentCard === 'function') {
                    window.temSaveCurrentCard();
                }
            }
        };

        // Adiciona listeners e guarda referência
        formsSection.addEventListener('input', inputListener);
        formsSection.addEventListener('change', changeListener);
        formsSection.__inputListener = inputListener;
        formsSection.__changeListener = changeListener;

    }
})();
