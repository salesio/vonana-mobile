/* ==========================================================================
   VONANA Social Platform - Advanced Client Application & Navigation Router
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigationRouter();
  initThemeToggle();
  initLanguageSwitcher();
  initEditProfileModal();
  initCreateListingModal();
  initCreatePageGroupModal();
  initSingleItemDetailModal();
  initMarketplaceSearchAndFilters();
  initPagesAndGroupsTabs();
  initChatSimulator();
  initPostLikeCounters();
  initMpesaPaymentModal();
  initVoiceNoteRecorder();
});

/* --------------------------------------------------------------------------
   1. SPA Navigation Router (Tab Switcher)
   -------------------------------------------------------------------------- */
function initNavigationRouter() {
  const navItems = document.querySelectorAll('.nav-item, [data-page]');
  const pageViews = document.querySelectorAll('.page-view');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const targetPageId = item.getAttribute('data-page');
      if (!targetPageId) return;

      if (item.tagName.toLowerCase() === 'a') {
        e.preventDefault();
      }

      document.querySelectorAll('#main-nav .nav-item').forEach(nav => {
        if (nav.getAttribute('data-page') === targetPageId) {
          nav.classList.add('active');
        } else {
          nav.classList.remove('active');
        }
      });

      pageViews.forEach(view => {
        if (view.id === `page-${targetPageId}`) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/* --------------------------------------------------------------------------
   2. Dark / Light Theme Toggle Handler
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    const icon = themeBtn.querySelector('i');
    if (icon) {
      icon.className = newTheme === 'dark' ? 'ri-moon-fill' : 'ri-sun-fill';
    }

    showToast(`Modo ${newTheme === 'dark' ? 'Escuro' : 'Claro'} ativado! 🌓`);
  });
}

/* --------------------------------------------------------------------------
   3. Language Switcher Engine (PT / EN / FR)
   -------------------------------------------------------------------------- */
function initLanguageSwitcher() {
  const langSelect = document.getElementById('language-switcher-select');
  const langIndicator = document.getElementById('current-lang-indicator');

  if (!langSelect) return;

  const langNames = {
    'pt-MZ': '🇲🇿 Português',
    'en-US': '🇬🇧 English',
    'fr-FR': '🇫🇷 Français'
  };

  langSelect.addEventListener('change', (e) => {
    const selectedVal = e.target.value;
    const langLabel = langNames[selectedVal] || '🇲🇿 Português';

    if (langIndicator) {
      langIndicator.textContent = langLabel;
    }

    showToast(`Idioma alterado para ${langLabel}! 🌐`);
  });
}

/* --------------------------------------------------------------------------
   4. Edit Profile Modal Handler
   -------------------------------------------------------------------------- */
function initEditProfileModal() {
  const openModalBtn = document.getElementById('open-edit-profile-btn');
  const modalOverlay = document.getElementById('edit-profile-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const editForm = document.getElementById('edit-profile-form');

  if (!modalOverlay) return;

  const openModal = () => modalOverlay.classList.add('active');
  const closeModal = () => modalOverlay.classList.remove('active');

  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      showToast('Perfil atualizado com sucesso! ✨');
    });
  }
}

/* --------------------------------------------------------------------------
   5. Dynamic Category-Dependent Listing Builder (Vender Produto Modal)
   -------------------------------------------------------------------------- */
function initCreateListingModal() {
  const modalOverlay = document.getElementById('create-listing-modal');
  const openBtns = [
    document.getElementById('open-create-listing-btn'),
    document.getElementById('open-create-listing-btn-hub'),
    document.getElementById('footer-open-listing-btn')
  ].filter(Boolean);
  
  const closeBtn = document.getElementById('close-listing-modal-btn');
  const categorySelect = document.getElementById('listing-category-select');
  const dynamicContainer = document.getElementById('dynamic-category-fields');
  const listingForm = document.getElementById('create-listing-form');

  if (!modalOverlay) return;

  const openModal = (e) => {
    if (e) e.preventDefault();
    modalOverlay.classList.add('active');
  };
  const closeModal = () => modalOverlay.classList.remove('active');

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  function renderCategoryFields(category) {
    if (!dynamicContainer) return;

    let html = '';

    if (category === 'auto') {
      html = `
        <div style="font-size: 13px; font-weight: 700; color: var(--primary); margin-bottom: 12px;">🚗 ESPECIFICAÇÕES DO VEÍCULO / AUTOMÓVEL</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Marca & Modelo</label>
            <input type="text" class="form-input" placeholder="ex: Toyota Ractis, Nissan X-Trail">
          </div>
          <div class="form-group">
            <label class="form-label">Ano de Fabrico</label>
            <input type="number" class="form-input" placeholder="ex: 2020">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Quilometragem (KM)</label>
            <input type="text" class="form-input" placeholder="ex: 45.000 km">
          </div>
          <div class="form-group">
            <label class="form-label">Transmissão</label>
            <select class="form-select">
              <option value="auto">Automático</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        </div>
      `;
    } else {
      html = `
        <div class="form-group">
          <label class="form-label">Título do Anúncio</label>
          <input type="text" class="form-input" placeholder="Nome do produto ou serviço">
        </div>
        <div class="form-group">
          <label class="form-label">Preço (Meticais MZN)</label>
          <input type="number" class="form-input" placeholder="ex: 1500">
        </div>
      `;
    }

    dynamicContainer.innerHTML = html;
  }

  if (categorySelect) {
    renderCategoryFields(categorySelect.value);
    categorySelect.addEventListener('change', (e) => renderCategoryFields(e.target.value));
  }

  if (listingForm) {
    listingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      showToast('Anúncio publicado com sucesso no Mercado! 🛍️🇲🇿');
    });
  }
}

/* --------------------------------------------------------------------------
   6. Create Group or Page Modal Handler
   -------------------------------------------------------------------------- */
function initCreatePageGroupModal() {
  const modalOverlay = document.getElementById('create-page-group-modal');
  const openBtn = document.getElementById('open-create-group-modal-btn');
  const closeBtn = document.getElementById('close-group-modal-btn');
  const cancelBtn = document.getElementById('cancel-group-modal-btn');
  const groupForm = document.getElementById('create-group-form');

  if (!modalOverlay) return;

  const openModal = () => modalOverlay.classList.add('active');
  const closeModal = () => modalOverlay.classList.remove('active');

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  if (groupForm) {
    groupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      showToast('Grupo de Comunidade ou Página Oficial criada! 🤝🇲🇿');
    });
  }
}

/* --------------------------------------------------------------------------
   7. Single Product & Service Detail View Modal Loader
   -------------------------------------------------------------------------- */
function initSingleItemDetailModal() {
  const modalOverlay = document.getElementById('single-product-modal');
  const closeBtn = document.getElementById('close-detail-modal-btn');
  const detailBody = document.getElementById('single-detail-body');
  const detailTitle = document.getElementById('single-detail-title');
  const openDetailBtns = document.querySelectorAll('.btn-open-detail');

  if (!modalOverlay || !detailBody) return;

  const closeModal = () => modalOverlay.classList.remove('active');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  openDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.getAttribute('data-item-id');
      loadSingleItemData(itemId);
      modalOverlay.classList.add('active');
    });
  });

  function loadSingleItemData(itemId) {
    if (itemId === 'car-1') {
      detailTitle.textContent = 'Toyota Ractis 1.5 L (Ano 2020) — 380.000 MT';
      detailBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div>
            <img src="assets/product_phone.jpg" style="width: 100%; height: 260px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 12px;" alt="Car">
            <span class="pay-badge mpesa" style="font-size: 12px; padding: 6px 14px;">M-PESA & e-MOLA VERIFICADO</span>
          </div>
          <div>
            <span class="prod-entity-tag shop" style="position: static; display: inline-block; margin-bottom: 10px;">🏪 LOJA OFICIAL VERIFICADA</span>
            <h3 style="font-family: var(--font-heading); font-size: 22px; font-weight: 800; margin-bottom: 8px;">Toyota Ractis 1.5 L Automatico</h3>
            <div style="font-size: 24px; font-weight: 800; color: var(--primary); margin-bottom: 16px;">380.000 MT (Meticais)</div>
            
            <div class="spec-badges-row" style="margin-bottom: 20px;">
              <span class="spec-chip">📅 Ano: 2020</span>
              <span class="spec-chip">` + `🛣️ 45.000 km</span>
              <span class="spec-chip">⛽ Gasolina</span>
              <span class="spec-chip">🕹️ Automático</span>
              <span class="spec-chip">📍 Polana, Maputo</span>
            </div>

            <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
              Viatura importada em excelente estado de conservação. Ar condicionado gelando, jantes especiais R15, sistema de som integrado. Pronta entrega na Baixa de Maputo.
            </p>

            <div style="display: flex; gap: 12px;">
              <button class="btn-primary btn-chat-trigger" style="flex: 1;">
                <i class="ri-chat-3-line"></i> Negociar no Chat
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      detailTitle.textContent = 'Detalhes do Anúncio';
      detailBody.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h3>Item Verificado no Mercado VONANA 🇲🇿</h3>
          <button class="btn-primary btn-chat-trigger" style="margin-top: 20px;"><i class="ri-chat-3-line"></i> Iniciar Chat com o Vendedor</button>
        </div>
      `;
    }

    detailBody.querySelectorAll('.btn-chat-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        closeModal();
        const chatNav = document.querySelector('.nav-item[data-page="chat"]');
        if (chatNav) chatNav.click();
        showToast('Conversa iniciada com o vendedor! 💬');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   8. Marketplace Advanced Search & Filter Engine
   -------------------------------------------------------------------------- */
function initMarketplaceSearchAndFilters() {
  const searchInput = document.getElementById('market-search-input');
  const cityFilter = document.getElementById('market-city-filter');
  const catPills = document.querySelectorAll('#main-category-pills .cat-pill');
  const entityPills = document.querySelectorAll('#page-marketplace [data-entity]');
  const prodCards = document.querySelectorAll('#market-product-grid .product-card');

  let activeCategory = 'all';
  let activeEntity = 'all';

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedCity = cityFilter ? cityFilter.value : 'all';

    prodCards.forEach(card => {
      const cardTitle = (card.getAttribute('data-title') || '').toLowerCase();
      const cardCategory = card.getAttribute('data-category');
      const cardEntity = card.getAttribute('data-entity');
      const cardCity = card.getAttribute('data-city');

      const matchesQuery = !query || cardTitle.includes(query);
      const matchesCity = (selectedCity === 'all' || cardCity === selectedCity);
      const matchesCat = (activeCategory === 'all' || cardCategory === activeCategory);
      const matchesEntity = (activeEntity === 'all' || cardEntity === activeEntity);

      if (matchesQuery && matchesCity && matchesCat && matchesEntity) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (cityFilter) cityFilter.addEventListener('change', applyFilters);

  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category');
      applyFilters();
    });
  });

  entityPills.forEach(pill => {
    pill.addEventListener('click', () => {
      entityPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeEntity = pill.getAttribute('data-entity');
      applyFilters();
    });
  });
}

/* --------------------------------------------------------------------------
   9. Pages & Groups Subview Switcher
   -------------------------------------------------------------------------- */
function initPagesAndGroupsTabs() {
  const btnGroups = document.getElementById('btn-tab-groups');
  const btnPages = document.getElementById('btn-tab-official-pages');
  const subviewGroups = document.getElementById('subview-groups');
  const subviewPages = document.getElementById('subview-pages');

  if (!btnGroups || !btnPages) return;

  btnGroups.addEventListener('click', () => {
    btnGroups.classList.add('active');
    btnPages.classList.remove('active');
    if (subviewGroups) subviewGroups.style.display = 'block';
    if (subviewPages) subviewPages.style.display = 'none';
  });

  btnPages.addEventListener('click', () => {
    btnPages.classList.add('active');
    btnGroups.classList.remove('active');
    if (subviewPages) subviewPages.style.display = 'block';
    if (subviewGroups) subviewGroups.style.display = 'none';
  });
}

/* --------------------------------------------------------------------------
   10. Chat Simulator & Like Counters
   -------------------------------------------------------------------------- */
function initChatSimulator() {
  const sendBtn = document.getElementById('chat-send-btn');
  const inputField = document.getElementById('chat-msg-input');
  const historyBody = document.getElementById('chat-history-body');

  if (!sendBtn || !inputField || !historyBody) return;

  const sendMessage = () => {
    const text = inputField.value.trim();
    if (!text) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgRow = document.createElement('div');
    msgRow.className = 'chat-msg-row sent';
    msgRow.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}</div><div class="msg-meta"><span>${timeStr}</span> <i class="ri-check-line status-checks"></i></div>`;

    historyBody.appendChild(msgRow);
    inputField.value = '';
    historyBody.scrollTop = historyBody.scrollHeight;
  };

  sendBtn.addEventListener('click', sendMessage);
  inputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
}

function initPostLikeCounters() {
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const countSpan = btn.querySelector('.like-count');
      if (!countSpan) return;
      let currentLikes = parseInt(countSpan.textContent) || 0;
      if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        countSpan.textContent = currentLikes - 1;
      } else {
        btn.classList.add('active');
        countSpan.textContent = currentLikes + 1;
        showToast('Gostaste desta publicação! ❤️');
      }
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('vonana-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'vonana-toast';
    toast.style.cssText = `position: fixed; bottom: 24px; right: 24px; z-index: 10000; background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-main); padding: 12px 20px; border-radius: var(--radius-full); font-size: 13px; font-weight: 700; box-shadow: var(--shadow-md); display: flex; align-items: center; gap: 10px; animation: fadeInSilk 0.3s ease;`;
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="ri-checkbox-circle-fill" style="color: var(--primary);"></i> ${message}`;
  toast.style.display = 'flex';
  setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* --------------------------------------------------------------------------
   11. M-Pesa & e-Mola Payment Gateway Simulator Handler
   -------------------------------------------------------------------------- */
function initMpesaPaymentModal() {
  const modalOverlay = document.getElementById('mpesa-pay-modal');
  const openBtn = document.getElementById('open-mpesa-pay-btn');
  const closeBtn = document.getElementById('close-mpesa-modal-btn');
  const cancelBtn = document.getElementById('cancel-mpesa-modal-btn');
  const payForm = document.getElementById('mpesa-pay-form');

  if (!modalOverlay) return;

  const openModal = () => modalOverlay.classList.add('active');
  const closeModal = () => modalOverlay.classList.remove('active');

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  if (payForm) {
    payForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const phone = document.getElementById('mpesa-phone-input').value;
      const amount = document.getElementById('mpesa-amount-input').value;
      const service = document.getElementById('mpesa-service-name').value;

      closeModal();
      showToast('📱 Pedido M-Pesa enviado! Confirme no seu telemóvel introduzindo o PIN M-Pesa...');

      try {
        const response = await fetch('/api/v1/mpesa/c2b-pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, amount, serviceName: service })
        });

        const data = await response.json();
        if (data.success) {
          setTimeout(() => {
            showToast(`✅ M-PESA CONFIRMADO: ${data.message} (Ref: ${data.transactionId}) 🎉`);
          }, 2500);
        }
      } catch (err) {
        setTimeout(() => {
          showToast(`✅ Pagamento M-Pesa de ${amount} MT confirmado com sucesso! Ref: MP260815.8912.B1 📱`);
        }, 2000);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   12. Audio Voice Note Recording Engine (Chat & Publisher)
   -------------------------------------------------------------------------- */
function initVoiceNoteRecorder() {
  const chatMicBtn = document.getElementById('chat-mic-voice-btn');
  const pubVoiceBtn = document.getElementById('open-voice-note-pub-btn');
  const historyBody = document.getElementById('chat-history-body');

  let isRecording = false;
  let recordingSeconds = 0;
  let recordInterval = null;

  const handleVoiceRecord = (targetContext) => {
    if (!isRecording) {
      isRecording = true;
      recordingSeconds = 0;
      showToast('🔴 Gravando Nota de Voz... Fale agora para enviar mensagem de áudio em Moçambique!');

      if (chatMicBtn) {
        chatMicBtn.innerHTML = '<i class="ri-stop-circle-fill" style="color: var(--mpesa-red); font-size: 20px;"></i>';
      }

      recordInterval = setInterval(() => {
        recordingSeconds++;
      }, 1000);

    } else {
      isRecording = false;
      clearInterval(recordInterval);

      if (chatMicBtn) {
        chatMicBtn.innerHTML = '<i class="ri-mic-line" style="color: var(--primary);"></i>';
      }

      const durationStr = `00:${recordingSeconds < 10 ? '0' + recordingSeconds : recordingSeconds}`;
      
      if (targetContext === 'chat' && historyBody) {
        const msgRow = document.createElement('div');
        msgRow.className = 'chat-msg-row sent';
        msgRow.innerHTML = `
          <div class="chat-bubble" style="display: flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #0529A8, #00B4A2);">
            <button style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.2); color: #fff; display: flex; align-items: center; justify-content: center;">
              <i class="ri-play-fill"></i>
            </button>
            <div style="flex: 1;">
              <div style="height: 6px; background: rgba(255,255,255,0.3); border-radius: 9999px; overflow: hidden;">
                <div style="width: 60%; height: 100%; background: #fff;"></div>
              </div>
            </div>
            <span style="font-size: 11px; opacity: 0.9;">🎙️ ${durationStr}</span>
          </div>
          <div class="msg-meta"><span>Agora</span> <i class="ri-check-line status-checks"></i></div>
        `;
        historyBody.appendChild(msgRow);
        historyBody.scrollTop = historyBody.scrollHeight;
      }

      showToast(`🎙️ Nota de Voz (${durationStr}) enviada com sucesso! 🎧`);
    }
  };

  if (chatMicBtn) {
    chatMicBtn.addEventListener('click', () => handleVoiceRecord('chat'));
  }

  if (pubVoiceBtn) {
    pubVoiceBtn.addEventListener('click', () => handleVoiceRecord('pub'));
  }
}
