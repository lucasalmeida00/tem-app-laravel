document.addEventListener('DOMContentLoaded', function () {
    var modalEl = document.getElementById('detailModal');
    if (!modalEl || typeof bootstrap === 'undefined' || !bootstrap.Modal) {
        return;
    }

    var modalBody = modalEl.querySelector('.modal-body');
    var modalTitle = modalEl.querySelector('.modal-title');
    var bsModal = new bootstrap.Modal(modalEl);

    function bindClick(selector, defaultTitle) {
        document.querySelectorAll(selector).forEach(function (el) {
            // Deixa visualmente "clicável"
            el.style.cursor = 'pointer';

            el.addEventListener('click', function () {
                var fullText =
                    el.getAttribute('data-full-text') ||
                    el.getAttribute('data-descbig') ||
                    el.innerText.trim();

                var title =
                    el.getAttribute('data-modal-title') ||
                    defaultTitle ||
                    'Detalhes';

                if (modalTitle) {
                    modalTitle.textContent = title;
                }
                if (modalBody) {
                    // Se quiser permitir HTML no futuro, pode trocar para innerHTML
                    modalBody.textContent = fullText;
                }

                bsModal.show();
            });
        });
    }

    // Linha do tempo
    bindClick('.timeline-item', 'Linha do tempo');

    // Parcerias
    bindClick('.partnership-item', 'Parcerias');
});