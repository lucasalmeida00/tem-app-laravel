;(function () {
  function clean(s) {
    return (s || '')
      .replace(/\s+/g, ' ')
      .replace(/\u00A0/g, ' ')
      .trim();
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  // Coleta lista (ul/li) preservando níveis em arrays aninhados
  function collectList(ul) {
    if (!ul) return [];
    const items = [];
    ul.querySelectorAll(':scope > li').forEach(li => {
      const entry = { text: clean(li.childNodes[0]?.textContent || '') };

      // sublistas diretas
      const sub = li.querySelector(':scope > ul');
      if (sub) entry.children = collectList(sub);

      // subitens "soltos"
      const listNone = li.querySelector(':scope > ul.list-none');
      if (listNone) entry.children = collectList(listNone);

      items.push(entry);
    });
    return items;
  }

  // ========== 1) Cabeçalho / Título ==========

  function getTitleDocument() {
    const h1 = document.querySelector('h1.tem-title');
    return clean(h1?.textContent || '') || null;
  }

  // ========== 2) Contatos (primeira seção .tem-wrap) ==========

  function getContacts() {
    const result = {
      site: null,
      instagram: null,
      linkedin: null,
      facebook: null,
      email: null,
      phone: null,
      whatsapp: null,
      others: []
    };

    // primeiro bloco do resumo
    const container = document.querySelector('section.tem-wrap .container');
    if (!container) return result;

    const anchors = Array.from(container.querySelectorAll('a[href]'));

    anchors.forEach(a => {
      const href = (a.getAttribute('href') || '').trim();
      const text = clean(a.textContent || href);

      if (/^mailto:/i.test(href)) {
        result.email = href.replace(/^mailto:/i, '');
        return;
      }
      if (/^tel:/i.test(href)) {
        result.phone = href.replace(/^tel:/i, '');
        return;
      }
      if (/whatsapp\.com|wa\.me/i.test(href)) {
        result.whatsapp = href;
        return;
      }
      if (/instagram\.com/i.test(href)) {
        result.instagram = text || href;
        return;
      }
      if (/linkedin\.com/i.test(href)) {
        result.linkedin = text || href;
        return;
      }
      if (/facebook\.com/i.test(href)) {
        result.facebook = text || href;
        return;
      }

      // Se não é rede social / mailto / tel, assume site
      if (!/instagram|linkedin|facebook|twitter|x\.com|tiktok|wa\.me|whatsapp|mailto:|tel:/i.test(href)) {
        if (!result.site) result.site = text || href;
        else result.others.push(text || href);
      } else {
        result.others.push(text || href);
      }
    });

    return result;
  }

  // ========== 3) Linha do tempo (nova timeline) ==========

  function getTimeline() {
    const out = {};
    const items = document.querySelectorAll('.timeline-item');

    items.forEach(item => {
      const yearEl = item.querySelector('.timeline-card span');
      const year = clean(yearEl?.textContent || '');

      if (!/^\d{4}$/.test(year)) return;

      const fullDesc =
        item.getAttribute('data-descbig') ||
        item.querySelector('.timeline-text')?.textContent ||
        '';
      const text = clean(fullDesc);
      if (!text) return;

      if (!out[year]) out[year] = [];
      if (!out[year].includes(text)) out[year].push(text);
    });

    return out;
  }

  // ========== 4) Modelo de Negócios (a partir do HTML .bmodel) ==========

  function extractEntriesFromBody(bodyEl) {
    const entries = [];
    if (!bodyEl) return entries;

    let node = bodyEl.firstElementChild;
    while (node) {
      const tag = node.tagName;

      if (tag === 'H4') {
        const subtitle = clean(node.textContent || '').replace(/:$/, '');

        // pega o próximo bloco relevante (UL | DIV | P), até outro H4/HR
        let sib = node.nextElementSibling;
        let list = [];
        while (sib && sib.tagName !== 'H4') {
          if (sib.tagName === 'UL') {
            list = collectList(sib);
            break;
          }
          if (sib.tagName === 'DIV' || sib.tagName === 'P') {
            const t = clean(sib.textContent || '');
            if (t) list = [{ text: t }];
            break;
          }
          if (sib.tagName === 'HR') break;
          sib = sib.nextElementSibling;
        }

        entries.push({ subtitle, list });
        node = sib ? sib.nextElementSibling : node.nextElementSibling;
        continue;
      }

      // lista "solta" (antes de h4)
      if (tag === 'UL') {
        entries.push({ subtitle: null, list: collectList(node) });
      } else if (tag === 'DIV' || tag === 'P') {
        const t = clean(node.textContent || '');
        if (t) entries.push({ subtitle: null, list: [{ text: t }] });
      }

      node = node.nextElementSibling;
    }

    return entries;
  }

  function getBusinessModel() {
    const result = {};

    // cada .bmodel-header representa uma seção (Parcerias-chave, Atividades-chave, etc.)
    const headers = document.querySelectorAll('.bmodel-board .bmodel-header');
    headers.forEach(header => {
      const span = header.querySelector('span');
      const sectionName = clean(span?.textContent || header.textContent || '');
      if (!sectionName) return;

      // o "corpo" está logo abaixo, como .bmodel-body
      let body =
        header.parentElement?.querySelector(':scope > .bmodel-body') ||
        header.closest('.bmodel-cell-half')?.querySelector(':scope > .bmodel-body') ||
        header.closest('.bmodel-cell')?.querySelector(':scope > .bmodel-body');

      const entries = extractEntriesFromBody(body);
      if (entries.length) {
        result[sectionName] = entries;
      }
    });

    return result;
  }

  // ========== 5) Parcerias (nova seção) ==========

  function getPartnerships() {
    const out = {};
    const cards = document.querySelectorAll('.partnership-item');

    cards.forEach(card => {
      const yearEl = card.querySelector('h4');
      const year = clean(yearEl?.textContent || '');
      if (!/^\d{4}$/.test(year)) return;

      const fullDesc =
        card.getAttribute('data-descbig') ||
        card.querySelector('.partnership-text')?.textContent ||
        '';
      const text = clean(fullDesc);
      if (!text) return;

      if (!out[year]) out[year] = [];
      if (!out[year].includes(text)) out[year].push(text);
    });

    // se quiser colapsar anos com apenas 1 item para string (igual ao SDK):
    Object.keys(out).forEach(y => {
      if (Array.isArray(out[y]) && out[y].length === 1) {
        out[y] = out[y][0];
      }
    });

    return out;
  }

  // ========== 6) Utilitários de download ==========

  function slugify(str) {
    return (str || 'documento')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim().replace(/\s+/g, '-')
      .toLowerCase();
  }

  async function downloadPDF(data) {
    const endpoint = window.location.origin + '/api/report/download';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      mode: 'cors',
      credentials: 'omit'
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} - ${text}`);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const filename = `${slugify(data.titleDocument || 'documento')}-TEM.pdf`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // ========== 7) Ação principal ==========

  async function startPrint() {
    try {
      const titleDocument = getTitleDocument();
      const contacts = getContacts();
      const Timeline = getTimeline();
      const BusinessModel = getBusinessModel();
      const partnerships = getPartnerships();

      const payload = {
        titleDocument,
        SiteDocument: contacts.site || null,
        InstagramDocument: contacts.instagram || null,
        Contacts: {
          site: contacts.site,
          instagram: contacts.instagram,
          linkedin: contacts.linkedin,
          facebook: contacts.facebook,
          email: contacts.email,
          phone: contacts.phone,
          whatsapp: contacts.whatsapp,
          others: contacts.others
        },
        Timeline,
        BusinessModel,
        partnerships
      };

      console.log('[ResumePrint] JSON enviado para API Laravel:', payload);
      await downloadPDF(payload);
    } catch (err) {
      console.error('[ResumePrint] Falha ao gerar PDF:', err);
      alert('Falha ao gerar o PDF. Veja o console para detalhes.');
    }
  }

  // ========== 8) Hook no botão "Imprimir Formulário" ==========

  onReady(() => {
    const btn = document.querySelector('.tem-actions .btn.btn-brand');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      startPrint();
    });
  });
})();
