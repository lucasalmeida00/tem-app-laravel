// assets/js/app-backup-viewer.js
// Permite trocar entre os backups salvos em business_data_backups pra visualizar
// (somente leitura) e, se quiser, restaurar um deles como os dados atuais.
(function () {
    let currentCardId = 1;

    // Instantes (ms) em que reaplicamos o "disabled" depois de um render — cobre
    // tanto os campos estáticos quanto os criados dinamicamente por Card4/Card5
    // (selects em cascata, blocos de investidor/relações etc.), sem precisar de
    // um MutationObserver (que se mostrou reentrante e travava a renderização).
    const DISABLE_CHECKPOINTS_MS = [0, 50, 150, 400, 900, 1800, 3000];

    function disableAllFields(container) {
        container.querySelectorAll("input, select, textarea, button").forEach(el => {
            el.disabled = true;
        });
    }

    function scheduleDisablePasses(container) {
        DISABLE_CHECKPOINTS_MS.forEach(ms => {
            setTimeout(() => {
                if (window.temBackupOverrideData) disableAllFields(container);
            }, ms);
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        const select = document.getElementById("temBackupSelect");
        const banner = document.getElementById("temBackupViewBanner");
        const viewIdEl = document.getElementById("temBackupViewId");
        const viewDateEl = document.getElementById("temBackupViewDate");
        const restoreBtn = document.getElementById("temBackupRestoreBtn");
        const saveLaterBtn = document.getElementById("btnSaveLater");
        const container = document.querySelector(".section-forms .container");
        const prevBtn = document.getElementById("temBackupPrevBtn");
        const nextBtn = document.getElementById("temBackupNextBtn");
        const loadingOverlay = document.getElementById("temBackupLoadingOverlay");

        if (!select || !container) return;

        // A renderização de um card (principalmente 4/5, com selects em cascata
        // e blocos dinâmicos) trava a thread principal por uma fração de
        // segundo. Um loading cobre essa mini-travada visualmente, em vez de a
        // tela ficar "paralisada" sem explicação.
        function showLoading() {
            if (loadingOverlay) loadingOverlay.style.display = "flex";
        }
        function hideLoading() {
            if (loadingOverlay) loadingOverlay.style.display = "none";
        }

        // Sempre que QUALQUER card for (re)renderizado (troca de backup, clique
        // num card, "Bloco anterior/próximo"...), reaplica o somente-leitura se
        // ainda estivermos visualizando um backup.
        container.addEventListener("form:rendered", () => {
            if (window.temBackupOverrideData) scheduleDisablePasses(container);
        });

        // Algumas telas (ex.: card 5) reagem à troca de dados com uma sequência
        // pesada de setTimeout/retries. Se o usuário trocar de backup de novo
        // antes disso terminar, os ciclos se empilham e travam a aba. Por isso
        // bloqueamos os controles durante uma troca e só liberamos depois de um
        // tempo de acomodação.
        let isSwitching = false;
        const SETTLE_MS = 3000;

        // options[0] = "Dados atuais" (presente), options[last] = backup mais antigo.
        // "anterior" anda pra um backup mais antigo (índice maior), "próximo" anda
        // pra um mais recente (índice menor), até voltar pros dados atuais.
        function updateNavButtonsState() {
            const lastIndex = select.options.length - 1;
            if (prevBtn) prevBtn.disabled = isSwitching || select.selectedIndex >= lastIndex;
            if (nextBtn) nextBtn.disabled = isSwitching || select.selectedIndex <= 0;
            select.disabled = isSwitching;
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                if (isSwitching) return;
                if (select.selectedIndex < select.options.length - 1) {
                    select.selectedIndex += 1;
                    select.dispatchEvent(new Event("change"));
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                if (isSwitching) return;
                if (select.selectedIndex > 0) {
                    select.selectedIndex -= 1;
                    select.dispatchEvent(new Event("change"));
                }
            });
        }

        updateNavButtonsState();

        window.addEventListener("card:selected", (ev) => {
            const cardId = Number(ev.detail?.cardId);
            if (cardId) currentCardId = cardId;
        });

        select.addEventListener("change", async () => {
            if (isSwitching) return; // troca já em andamento, ignora reentrância

            const backupId = select.value;

            if (!backupId) {
                // Voltando pros dados atuais: recarrega a página pra resincronizar tudo.
                if (window.temBackupOverrideData) window.location.reload();
                return;
            }

            isSwitching = true;
            updateNavButtonsState();
            showLoading();

            try {
                const url = window.temBackupShowUrlTemplate.replace("__ID__", backupId);
                const res = await fetch(url, { headers: { "Accept": "application/json" } });
                if (!res.ok) throw new Error("Falha ao carregar backup");
                const json = await res.json();

                window.temBackupOverrideData = json.data || {};

                if (viewIdEl) viewIdEl.textContent = json.id;
                if (viewDateEl) {
                    viewDateEl.textContent = select.options[select.selectedIndex].text.split(" — ")[0];
                }
                if (banner) banner.classList.remove("d-none");
                if (saveLaterBtn) saveLaterBtn.classList.add("d-none");

                if (typeof window.renderDynamicForm === "function") {
                    window.renderDynamicForm(currentCardId);
                }

                scheduleDisablePasses(container);

                // O loading só precisa cobrir a renderização inicial (a parte
                // que trava a thread); o bloqueio dos controles continua até o
                // SETTLE_MS pra evitar empilhar trocas.
                setTimeout(hideLoading, 400);

                // Só libera os controles depois que as rotinas pesadas de cada
                // card (ex.: resolveCard5Fixes, com seus próprios setTimeout em
                // cadeia) tiveram tempo de acomodar, pra não empilhar ciclos.
                setTimeout(() => {
                    isSwitching = false;
                    updateNavButtonsState();
                }, SETTLE_MS);
            } catch (e) {
                console.error("Erro ao carregar backup", e);
                alert("Não foi possível carregar esse backup. Tente novamente.");
                select.value = "";
                isSwitching = false;
                updateNavButtonsState();
                hideLoading();
            }
        });

        if (restoreBtn) {
            restoreBtn.addEventListener("click", async () => {
                const backupId = select.value;
                if (!backupId) return;

                const label = select.options[select.selectedIndex].text;
                const confirmed = confirm(
                    `Tem certeza que deseja restaurar "${label}" como os dados atuais deste empreendimento?\n\n` +
                    `Uma cópia de segurança do estado atual será criada automaticamente antes da substituição.`
                );
                if (!confirmed) return;

                try {
                    const url = window.temBackupRestoreUrlTemplate.replace("__ID__", backupId);
                    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";

                    const res = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": csrfToken,
                            "Accept": "application/json"
                        }
                    });
                    const json = await res.json();
                    if (!res.ok || !json.ok) throw new Error("Falha ao restaurar backup");

                    window.location.reload();
                } catch (e) {
                    console.error("Erro ao restaurar backup", e);
                    alert("Não foi possível restaurar esse backup. Tente novamente.");
                }
            });
        }
    });
})();
