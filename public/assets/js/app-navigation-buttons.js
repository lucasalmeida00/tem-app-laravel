(function () {
  const TOTAL_BLOCKS = 20;
  let currentCardId = 1;

  function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  function getCurrentFromDOM() {
    const selectedSlide = document.querySelector('.swiper-slide .cards-card.is-selected');
    if (selectedSlide) {
      const slide = selectedSlide.closest('.swiper-slide');
      if (slide && slide.dataset.card) {
        return Number(slide.dataset.card) || 1;
      }
    }
    return 1;
  }

  function updateButtons() {
    const prevBtn   = document.getElementById('btnPrevBlock');
    const nextBtn   = document.getElementById('btnNextBlock');
    const prevLabel = document.getElementById('prevBlockLabel');
    const nextLabel = document.getElementById('nextBlockLabel');
    const finishBtn = document.getElementById('btnFinish');

    if (!prevBtn || !nextBtn) return;

    // Bloco anterior
    if (currentCardId <= 1) {
      prevBtn.classList.add('d-none');
    } else {
      prevBtn.classList.remove('d-none');
      const prev = currentCardId - 1;
      if (prevLabel) {
        prevLabel.textContent = `Bloco anterior: (${prev}/${TOTAL_BLOCKS})`;
      }
    }

    // Próximo bloco / Finalizar
    if (currentCardId >= TOTAL_BLOCKS) {
      // Último card: esconde "Próximo" e mostra "Finalizar"
      nextBtn.classList.add('d-none');
      if (finishBtn) {
        finishBtn.classList.remove('d-none');
      }
    } else {
      // Qualquer outro card: mostra "Próximo" e esconde "Finalizar"
      nextBtn.classList.remove('d-none');
      if (finishBtn) {
        finishBtn.classList.add('d-none');
      }

      const next = currentCardId + 1;
      if (nextLabel) {
        nextLabel.textContent = `Próximo bloco: (${next}/${TOTAL_BLOCKS})`;
      }
    }
  }


  // Navega para um card específico (como se clicasse na caixinha)
  function selectCard(cardId) {
    cardId = Math.min(Math.max(cardId, 1), TOTAL_BLOCKS);
    currentCardId = cardId;

    const slides = Array.from(document.querySelectorAll('.swiper-slide'));

    // Remove seleção atual
    slides.forEach(s => {
      const c = s.querySelector('.cards-card');
      if (c) c.classList.remove('is-selected');
    });

    // Marca o slide alvo
    const targetSlide = document.querySelector(`.swiper-slide[data-card="${cardId}"]`);
    if (targetSlide) {
      targetSlide.querySelector('.cards-card')?.classList.add('is-selected');
    }

    // Renderiza o formulário
    if (window.renderDynamicForm) {
      window.renderDynamicForm(cardId);
    }

    scrollToTop();

    // Dispara o mesmo evento global usado pelo clique
    window.dispatchEvent(new CustomEvent('card:selected', {
      detail: { cardId }
    }));

    // Move o carrossel para o slide correto, se o Swiper estiver disponível
    if (window.cardsSwiper && typeof window.cardsSwiper.slideTo === 'function') {
      const idx = slides.findIndex(s => s === targetSlide);
      if (idx >= 0) {
        window.cardsSwiper.slideTo(idx, 300);
      }
    }

    updateButtons();
  }

  function init() {
    const prevBtn   = document.getElementById('btnPrevBlock');
    const nextBtn   = document.getElementById('btnNextBlock');
    const finishBtn = document.getElementById('btnFinish');

    if (!prevBtn || !nextBtn) return;

    // Estado inicial
    currentCardId = getCurrentFromDOM();
    updateButtons();

    // Clique em "Bloco anterior"
    prevBtn.addEventListener('click', () => {
      if (currentCardId > 1) {
        if (window.temPerformSave) {
          window.temPerformSave();
        }
        selectCard(currentCardId - 1);
        scrollToTop();
      }
    });

    // Clique em "Próximo bloco"
    nextBtn.addEventListener('click', () => {
      if (currentCardId < TOTAL_BLOCKS) {
        if (window.temPerformSave) {
          window.temPerformSave();
        }
        selectCard(currentCardId + 1);
        scrollToTop();
      }
    });

    // Clique em "Finalizar"
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        // salva antes de sair
        if (window.temPerformSave) {
          window.temPerformSave();
        }

        // mesma URL + /resume
        const currentUrl = window.location.href;
        const targetUrl  = currentUrl.replace(/\/resume\/?$/, '') + '/resume';
        window.location.href = targetUrl;
      });
    }

    // Quando o usuário clicar diretamente em uma caixinha do carrossel
    window.addEventListener('card:selected', (ev) => {
      const cardId = Number(ev.detail?.cardId);
      if (!cardId) return;
      currentCardId = cardId;
      updateButtons();
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  // Função pública opcional, caso queira usar em outros lugares
  window.temSelectCard = selectCard;
})();