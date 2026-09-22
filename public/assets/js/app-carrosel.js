document.addEventListener('DOMContentLoaded', () => {

    const swiper = new Swiper('.swiper', {
        // Quantidade de slides visíveis por padrão (telas pequenas)
        slidesPerView: 1,

        // Espaçamento entre os slides
        spaceBetween: 16, // Equivale a 1rem

        // Habilitar controle pelo teclado
        keyboard: {
            enabled: true,
        },

        // Configuração dos botões de navegação
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Configuração responsiva (breakpoints)
        breakpoints: {
            // quando a tela for >= 768px
            768: {
                slidesPerView: 3,
                spaceBetween: 16
            },
            // quando a tela for >= 1200px
            1200: {
                slidesPerView: 5,
                spaceBetween: 16
            }
        },

        // === AQUI IMPLEMENTAMOS A LÓGICA DO CLIQUE ===
        on: {
            click: function (swiper, event) {
                const slide = event.target.closest('.swiper-slide');
                if (!slide) return;

                // 🔹 Antes de mudar de card, salva o card ATUAL
                if (window.temPerformSave && typeof window.temPerformSave === 'function') {
                window.temPerformSave();
                }

                // marca visual no card
                swiper.slides.forEach(s => {
                const c = s.querySelector('.cards-card');
                if (c) c.classList.remove('is-selected');
                });
                slide.querySelector('.cards-card')?.classList.add('is-selected');

                const cardId = Number(slide.dataset.card);

                // evento global (atualiza currentCardId em outros módulos)
                window.dispatchEvent(new CustomEvent('card:selected', { detail: { cardId } }));

                // renderiza o formulário do novo card
                if (window.renderDynamicForm) {
                window.renderDynamicForm(cardId);
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });

                // centraliza o slide clicado
                if (typeof swiper.slideTo === "function" && typeof swiper.clickedIndex === "number") {
                swiper.slideTo(swiper.clickedIndex, 300);
                }
            }
        }
    });

    // 👉 Deixa o Swiper acessível globalmente
    window.cardsSwiper = swiper;

    window.temSelectCard = function(cardId) {
        const targetSlide = document.querySelector(`.swiper-slide[data-card="${cardId}"]`);
        if (!targetSlide) return;

        document.querySelectorAll('.swiper-slide .cards-card').forEach(c => c.classList.remove('is-selected'));
        targetSlide.querySelector('.cards-card')?.classList.add('is-selected');

        const index = Array.from(swiper.slides).indexOf(targetSlide);
        if (index >= 0 && typeof swiper.slideTo === 'function') {
            swiper.slideTo(index, 300);
        }

        window.dispatchEvent(new CustomEvent('card:selected', { detail: { cardId: Number(cardId) } }));
        if (window.renderDynamicForm) {
            window.renderDynamicForm(Number(cardId));
        }
    };
});