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

        if (filledCount >= minKeys) {
            return {
                state: "done",
                label: "Concluído",
                badgeClass: "bg-success text-white"
            };
        }

        return {
            state: "in_progress",
            label: "Em andamento",
            badgeClass: "bg-warning text-dark"
        };
    }

    function updateCardsStatuses() {
        const allData = getAllDataSafe();

        for (let cardId = 1; cardId <= 20; cardId++) {
            const cardEl = document.getElementById("card-tem-" + cardId);
            if (!cardEl) continue;

            const statusEl = cardEl.querySelector(".tem-card-status-label");
            if (!statusEl) continue;

            const status = computeStatusForCard(cardId, allData);

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
    });

    // Atualiza sempre que um salvamento for feito
    window.addEventListener("tem:form-saved", () => {
        updateCardsStatuses();
    });

    // Se você quiser garantir depois do "app-ready" (quando tudo foi reidratado):
    window.addEventListener("tem:app-ready", () => {
        updateCardsStatuses();
    });
})();