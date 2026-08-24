document.addEventListener('DOMContentLoaded', function () {
    var VIEWPORT_MARGIN = 12; // respiro mínimo em relação às bordas da tela

    var current = null; // { el, popEl, reposition }

    function closeCurrent() {
        if (current) {
            current.popEl.remove();
            window.removeEventListener('resize', current.reposition);
            window.removeEventListener('scroll', current.reposition, true);
            current = null;
        }
    }

    function buildPopEl() {
        var popEl = document.createElement('div');
        popEl.className = 'detail-popover-overlay';
        // Estático, sem dados do usuário interpolados — o texto é preenchido
        // depois via textContent, então não há risco de HTML injetado através
        // de uma descrição de parceria/marco digitada pelo usuário.
        popEl.innerHTML =
            '<button type="button" class="btn-close detail-popover-close" aria-label="Fechar"></button>' +
            '<div class="detail-popover-text"></div>';
        return popEl;
    }

    // Centraliza o balão exatamente sobre o card clicado (sobrepondo-o).
    // Se não couber em cima, empurra pra baixo; se não couber embaixo, empurra
    // pra cima. Nunca desloca para os lados — só ajusta o mínimo pra não
    // estourar a borda esquerda/direita da tela.
    function position(popEl, el) {
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;

        var pw = popEl.offsetWidth;
        var ph = popEl.offsetHeight;

        var left = cx - pw / 2;
        left = Math.max(VIEWPORT_MARGIN, Math.min(left, window.innerWidth - pw - VIEWPORT_MARGIN));

        var top = cy - ph / 2;
        if (top < VIEWPORT_MARGIN) {
            top = VIEWPORT_MARGIN;
        } else if (top + ph > window.innerHeight - VIEWPORT_MARGIN) {
            top = Math.max(VIEWPORT_MARGIN, window.innerHeight - ph - VIEWPORT_MARGIN);
        }

        popEl.style.left = left + 'px';
        popEl.style.top = top + 'px';
    }

    function openPopover(el) {
        var reopeningSame = current && current.el === el;
        closeCurrent();
        if (reopeningSame) return; // clicar de novo no mesmo item apenas fecha (toggle)

        var fullText =
            el.getAttribute('data-full-text') ||
            el.getAttribute('data-descbig') ||
            el.innerText.trim();

        var popEl = buildPopEl();
        popEl.querySelector('.detail-popover-text').textContent = fullText;
        document.body.appendChild(popEl);

        function reposition() { position(popEl, el); }
        reposition();

        popEl.querySelector('.detail-popover-close').addEventListener('click', function (ev) {
            ev.stopPropagation();
            closeCurrent();
        });

        window.addEventListener('resize', reposition);
        window.addEventListener('scroll', reposition, true);

        current = { el: el, popEl: popEl, reposition: reposition };
    }

    function bindClick(selector) {
        document.querySelectorAll(selector).forEach(function (el) {
            el.style.cursor = 'pointer';
            el.setAttribute('tabindex', '0');
            el.addEventListener('click', function (ev) {
                ev.stopPropagation();
                openPopover(el);
            });
        });
    }

    bindClick('.timeline-item');
    bindClick('.partnership-item');

    // Fecha ao clicar fora do balão e do item que o abriu
    document.addEventListener('click', function (ev) {
        if (!current) return;
        if (current.popEl.contains(ev.target)) return;
        if (current.el.contains(ev.target)) return;
        closeCurrent();
    });

    // Fecha com Esc (útil em desktop e teclados externos no mobile)
    document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape') closeCurrent();
    });
});
