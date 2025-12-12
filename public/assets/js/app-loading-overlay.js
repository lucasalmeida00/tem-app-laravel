// app-loading-overlay.js

(function () {
    const OVERLAY_ID = "tem-loading-overlay";

    function hideOverlay() {
        const overlay = document.getElementById(OVERLAY_ID);
        if (!overlay) return;

        // Evita executar mais de uma vez
        if (overlay.classList.contains("fade-out")) return;

        overlay.classList.add("fade-out");

        // Remove do DOM depois da animação
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }

    // 1) Garante que o overlay fique visível logo no início
    document.addEventListener("DOMContentLoaded", () => {
        const overlay = document.getElementById(OVERLAY_ID);
        if (!overlay) return;
        // Se quiser garantir que tá sempre visível:
        overlay.style.display = "flex";
    });

    // 2) Quando a página terminar de carregar (HTML, CSS, JS, imagens, etc),
    //    escondemos o overlay. Isso já cobre o cenário de "refresh".
    window.addEventListener("load", () => {
        hideOverlay();
    });

    // 3) Opcional: se no futuro você quiser ser mais preciso, pode disparar
    //    esse evento quando o app estiver 100% reidratado:
    //
    //    window.dispatchEvent(new Event("tem:app-ready"));
    //
    //    E aqui a gente escuta:
    window.addEventListener("tem:app-ready", () => {
        hideOverlay();
    });
})();