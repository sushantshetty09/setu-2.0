// Scheme Saathi — WhatsApp Web Simulator Client
(function () {
  'use strict';

  // State
  const STORAGE_KEY = 'scheme_saathi_sender_id';
  let senderId = localStorage.getItem(STORAGE_KEY);
  if (!senderId) {
    senderId = 'wa_web_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem(STORAGE_KEY, senderId);
  }

  let soundEnabled = true;

  // DOM Elements
  const messagesContainer = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input');
  const typingIndicator = document.getElementById('typing-indicator');
  const restartBtn = document.getElementById('restart-chat-btn');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const statusClock = document.getElementById('status-clock');
  const quickChips = document.getElementById('quick-chips');

  // Update Clock
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    if (statusClock) {
      statusClock.textContent = `${hours}:${minutes}`;
    }
  }
  updateClock();
  setInterval(updateClock, 30000);

  // Audio Beep using Web Audio API (Native, no external audio file needed)
  function playWhatsAppSound() {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // Audio not permitted or user hasn't interacted yet
    }
  }

  // Format Time (e.g. "10:42 AM")
  function formatCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  // Format WhatsApp Markdown to HTML
  function formatWhatsAppText(text) {
    if (!text) return '';

    let formatted = text
      // Escape basic HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold: *text* -> <strong>text</strong>
    formatted = formatted.replace(/\*([^*\n]+)\*/g, '<strong>$1</strong>');

    // Italics: _text_ -> <em>text</em>
    formatted = formatted.replace(/_([^_\n]+)_/g, '<em>$1</em>');

    // Convert URLs into clickable links
    formatted = formatted.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    return formatted;
  }

  // Scroll messages to bottom
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Append Message Bubble
  function appendMessage(text, isUser = false) {
    const row = document.createElement('div');
    row.className = `msg-row ${isUser ? 'outgoing' : 'incoming'}`;

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';

    const textDiv = document.createElement('div');
    textDiv.className = 'msg-text';
    textDiv.innerHTML = formatWhatsAppText(text);

    const meta = document.createElement('div');
    meta.className = 'msg-meta';

    const timeSpan = document.createElement('span');
    timeSpan.textContent = formatCurrentTime();
    meta.appendChild(timeSpan);

    if (isUser) {
      const ticks = document.createElement('span');
      ticks.className = 'ticks';
      ticks.innerHTML = '✓✓';
      meta.appendChild(ticks);
    }

    bubble.appendChild(textDiv);
    bubble.appendChild(meta);
    row.appendChild(bubble);
    messagesContainer.appendChild(row);

    scrollToBottom();
    if (!isUser) {
      playWhatsAppSound();
    }
  }

  // Show / Hide Typing Indicator
  function setTyping(isTyping) {
    if (typingIndicator) {
      typingIndicator.style.display = isTyping ? 'block' : 'none';
      if (isTyping) scrollToBottom();
    }
  }

  // Send Message to Chatbot Backend
  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Display user message in UI
    appendMessage(trimmed, true);
    setTyping(true);

    try {
      const response = await fetch('/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, text: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setTyping(false);

      if (data.replies && Array.isArray(data.replies)) {
        for (let i = 0; i < data.replies.length; i++) {
          appendMessage(data.replies[i], false);
          // Small stagger between multiple bubbles for authentic WhatsApp pacing
          if (i < data.replies.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 350));
          }
        }
      }
    } catch (err) {
      setTyping(false);
      appendMessage(
        `⚠️ *Connection Error:* Unable to reach Scheme Saathi server. Please ensure the server is running on port 3000.`,
        false
      );
    }
  }

  // Event Listeners
  chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = messageInput.value;
    if (!text.trim()) return;
    messageInput.value = '';
    sendMessage(text);
  });

  // Quick Action Chips Click
  if (quickChips) {
    quickChips.addEventListener('click', function (e) {
      const chip = e.target.closest('.chip');
      if (chip) {
        const action = chip.getAttribute('data-action');
        if (action === 'open-rejection') {
          openRejectionModal();
          return;
        }
        if (action === 'open-life-event') {
          openLifeEventModal();
          return;
        }
        const text = chip.getAttribute('data-text');
        if (text) {
          sendMessage(text);
        }
      }
    });
  }

  // Side Panel Prompt Samples
  document.querySelectorAll('.prompt-sample').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const text = this.getAttribute('data-text');
      if (text) {
        sendMessage(text);
      }
    });
  });

  // Sound Toggle
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', function () {
      soundEnabled = !soundEnabled;
      soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    });
  }

  // Restart / Clear Chat
  if (restartBtn) {
    restartBtn.addEventListener('click', async function () {
      if (confirm('Start a fresh conversation with Scheme Saathi?')) {
        messagesContainer.innerHTML = `
          <div class="system-pill-wrapper">
            <div class="system-pill">
              <span class="lock-icon">🔒</span>
              <span>Messages are simulated locally for Scheme Saathi. We never request Aadhaar numbers, OTPs, or bank details.</span>
            </div>
          </div>
          <div class="date-separator">
            <span class="date-bubble">TODAY</span>
          </div>
        `;
        senderId = 'wa_web_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem(STORAGE_KEY, senderId);
        sendMessage('HI');
      }
    });
  }

  // ========================================================
  // Website Citizen Enquiries Database Modal Controller
  // ========================================================
  const dbModal = document.getElementById('db-modal');
  const dbModalOverlay = document.getElementById('db-modal-overlay');
  const dbModalClose = document.getElementById('db-modal-close');
  const dbHeaderBtn = document.getElementById('db-header-btn');
  const openDbPanelBtn = document.getElementById('open-db-panel-btn');

  const dbTotalCount = document.getElementById('db-total-count');
  const dbWomenCount = document.getElementById('db-women-count');
  const dbBplCount = document.getElementById('db-bpl-count');
  const dbTopState = document.getElementById('db-top-state');

  const dbSearchInput = document.getElementById('db-search-input');
  const dbStateFilter = document.getElementById('db-state-filter');
  const dbGenderFilter = document.getElementById('db-gender-filter');
  const dbRefreshBtn = document.getElementById('db-refresh-btn');
  const dbExportBtn = document.getElementById('db-export-btn');
  const dbTableBody = document.getElementById('db-table-body');
  const dbEmptyState = document.getElementById('db-empty-state');

  let cachedEnquiries = [];

  function openDatabaseModal() {
    if (!dbModal) return;
    dbModal.style.display = 'flex';
    dbModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    loadEnquiriesAndStats();
  }

  function closeDatabaseModal() {
    if (!dbModal) return;
    dbModal.style.display = 'none';
    dbModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (dbHeaderBtn) dbHeaderBtn.addEventListener('click', openDatabaseModal);
  if (openDbPanelBtn) openDbPanelBtn.addEventListener('click', openDatabaseModal);
  if (dbModalClose) dbModalClose.addEventListener('click', closeDatabaseModal);
  if (dbModalOverlay) dbModalOverlay.addEventListener('click', closeDatabaseModal);

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && dbModal && dbModal.style.display === 'flex') {
      closeDatabaseModal();
    }
  });

  async function loadEnquiriesAndStats() {
    try {
      if (dbTableBody) {
        dbTableBody.innerHTML = `<tr><td colspan="11" style="text-align: center; padding: 24px; color: #94a3b8;">Loading citizen enquiries...</td></tr>`;
      }

      // Fetch enquiries list & aggregate stats in parallel
      const [enqRes, statsRes] = await Promise.all([
        fetch('/api/enquiries?limit=100').then((r) => r.json()),
        fetch('/api/enquiries/stats').then((r) => r.json()),
      ]);

      if (enqRes.success && Array.isArray(enqRes.enquiries)) {
        cachedEnquiries = enqRes.enquiries;
        renderEnquiriesTable(cachedEnquiries);
      }

      if (statsRes.success && statsRes.stats) {
        const stats = statsRes.stats;
        if (dbTotalCount) dbTotalCount.textContent = stats.totalEnquiries || 0;
        if (dbWomenCount) dbWomenCount.textContent = stats.byGender?.Female || 0;
        if (dbBplCount) dbBplCount.textContent = stats.byIncome?.['Below ₹1 Lakh (BPL)'] || 0;

        if (dbTopState && stats.byState) {
          const sortedStates = Object.entries(stats.byState).sort((a, b) => b[1] - a[1]);
          if (sortedStates.length > 0) {
            dbTopState.textContent = `${sortedStates[0][0]} (${sortedStates[0][1]})`;
          }
        }
      }
    } catch (err) {
      console.error('[WebSimulator] Failed to load enquiries:', err);
      if (dbTableBody) {
        dbTableBody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: #ef4444; padding: 20px;">Could not load database records. Ensure backend is running.</td></tr>`;
      }
    }
  }

  function renderEnquiriesTable(enquiries) {
    if (!dbTableBody) return;
    dbTableBody.innerHTML = '';

    if (!enquiries || enquiries.length === 0) {
      if (dbEmptyState) dbEmptyState.style.display = 'block';
      return;
    }
    if (dbEmptyState) dbEmptyState.style.display = 'none';

    enquiries.forEach(function (item) {
      const tr = document.createElement('tr');

      // Gender badge class
      const genderClass = item.gender ? item.gender.toLowerCase() : 'other';

      // Income badge class
      let incomeClass = 'mid';
      if (item.annualIncome && item.annualIncome.includes('BPL')) {
        incomeClass = 'bpl';
      } else if (item.annualIncome && item.annualIncome.includes('Above')) {
        incomeClass = 'high';
      }

      // Schemes pills (max 2 + count)
      const schemesList = item.matchedSchemeNames || [];
      const schemePills = schemesList
        .slice(0, 2)
        .map((s) => `<span class="db-scheme-pill" title="${s}">🏛️ ${s}</span>`)
        .join('');
      const moreBadge = schemesList.length > 2 ? `<small style="color: #25d366;">+${schemesList.length - 2} more</small>` : '';

      // Date formatting
      const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

      tr.innerHTML = `
        <td><span class="db-ref-id">${item.id}</span></td>
        <td><span class="db-citizen-name">${item.name || 'Citizen'}</span></td>
        <td><span class="db-badge-gender ${genderClass}">${item.gender || '—'}</span></td>
        <td>${item.age ? item.age + ' yrs' : '—'}</td>
        <td>📍 <strong>${item.state || 'All India'}</strong></td>
        <td>${item.occupation || '—'}</td>
        <td><span class="db-badge-income ${incomeClass}">${item.annualIncome || '—'}</span></td>
        <td>🎯 ${item.category || 'General'}</td>
        <td><div class="db-schemes-preview">${schemePills} ${moreBadge}</div></td>
        <td style="font-family: monospace; color: #94a3b8;">${item.phoneNumber || '—'}</td>
        <td style="color: #64748b; font-size: 11px; white-space: nowrap;">${dateStr}</td>
      `;

      dbTableBody.appendChild(tr);
    });
  }

  function applyFilters() {
    const query = dbSearchInput ? dbSearchInput.value.trim().toLowerCase() : '';
    const stateFilter = dbStateFilter ? dbStateFilter.value : '';
    const genderFilter = dbGenderFilter ? dbGenderFilter.value : '';

    const filtered = cachedEnquiries.filter(function (item) {
      if (stateFilter && item.state !== stateFilter) return false;
      if (genderFilter && item.gender !== genderFilter) return false;

      if (query) {
        const nameMatch = (item.name || '').toLowerCase().includes(query);
        const phoneMatch = (item.phoneNumber || '').toLowerCase().includes(query);
        const idMatch = (item.id || '').toLowerCase().includes(query);
        const stateMatch = (item.state || '').toLowerCase().includes(query);
        const schemeMatch = (item.matchedSchemeNames || []).some((s) => s.toLowerCase().includes(query));
        return nameMatch || phoneMatch || idMatch || stateMatch || schemeMatch;
      }

      return true;
    });

    renderEnquiriesTable(filtered);
  }

  if (dbSearchInput) dbSearchInput.addEventListener('input', applyFilters);
  if (dbStateFilter) dbStateFilter.addEventListener('change', applyFilters);
  if (dbGenderFilter) dbGenderFilter.addEventListener('change', applyFilters);
  if (dbRefreshBtn) dbRefreshBtn.addEventListener('click', loadEnquiriesAndStats);

  // CSV Export
  if (dbExportBtn) {
    dbExportBtn.addEventListener('click', function () {
      if (!cachedEnquiries || cachedEnquiries.length === 0) {
        alert('No enquiries to export.');
        return;
      }

      const headers = ['Enquiry ID', 'Citizen Name', 'Gender', 'Age', 'State', 'Occupation', 'Annual Income', 'Category', 'Language', 'Phone Number', 'Schemes Count', 'Matched Schemes', 'Timestamp'];
      const rows = cachedEnquiries.map((e) => [
        `"${e.id}"`,
        `"${e.name || ''}"`,
        `"${e.gender || ''}"`,
        e.age || '',
        `"${e.state || ''}"`,
        `"${e.occupation || ''}"`,
        `"${e.annualIncome || ''}"`,
        `"${e.category || ''}"`,
        `"${e.language || ''}"`,
        `"${e.phoneNumber || ''}"`,
        e.matchedSchemesCount || 0,
        `"${(e.matchedSchemeNames || []).join('; ')}"`,
        `"${e.createdAt || ''}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `scheme_saathi_enquiries_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // ========================================================
  // Feature 1: Rejection Recovery Assistant Controller
  // ========================================================
  const rejectionModal = document.getElementById('rejection-modal');
  const openRejHeaderBtn = document.getElementById('header-rejection-btn');
  const openRejDockBtn = document.getElementById('dock-rejection-btn');
  const openRejSideBtn = document.getElementById('open-rejection-modal-btn');
  const rejCloseBtn = document.getElementById('rejection-modal-close');
  const rejOverlay = document.getElementById('rejection-modal-overlay');
  const rejTextInput = document.getElementById('rej-text-input');
  const rejSchemeSelect = document.getElementById('rej-scheme-select');
  const rejStateSelect = document.getElementById('rej-state-select');
  const rejLangSelect = document.getElementById('rej-lang-select');
  const rejFileInput = document.getElementById('rej-file-input');
  const rejPreviewContainer = document.getElementById('rej-preview-container');
  const rejImagePreview = document.getElementById('rej-image-preview');
  const rejRemoveImageBtn = document.getElementById('rej-remove-image-btn');
  const rejAnalyzeBtn = document.getElementById('rej-analyze-btn');
  const rejClearBtn = document.getElementById('rej-clear-btn');
  const rejLoading = document.getElementById('rej-loading');
  const rejResultContainer = document.getElementById('rej-result-container');

  let currentRejBase64 = null;
  let lastRejectionResult = null;

  function openRejectionModal(initialText = '') {
    if (!rejectionModal) return;
    rejectionModal.style.display = 'flex';
    rejectionModal.setAttribute('aria-hidden', 'false');
    if (initialText && rejTextInput) {
      rejTextInput.value = initialText;
    }
  }

  function closeRejectionModal() {
    if (!rejectionModal) return;
    rejectionModal.style.display = 'none';
    rejectionModal.setAttribute('aria-hidden', 'true');
  }

  if (openRejHeaderBtn) openRejHeaderBtn.addEventListener('click', () => openRejectionModal());
  if (openRejDockBtn) openRejDockBtn.addEventListener('click', () => openRejectionModal());
  if (openRejSideBtn) openRejSideBtn.addEventListener('click', () => openRejectionModal());
  if (rejCloseBtn) rejCloseBtn.addEventListener('click', closeRejectionModal);
  if (rejOverlay) rejOverlay.addEventListener('click', closeRejectionModal);

  // Sample notice buttons in side panel and quick tags
  const SAMPLE_REJECTION_NOTICES = {
    'pm-kisan-name': 'Your application for PM-KISAN registration has been rejected due to beneficiary name mismatch with Aadhaar database.',
    'pmfby-crop': 'Dear applicant, your PMFBY claim for season Kharif has been rejected as crop loss was reported after the 72-hour window.',
    'pmay-income': 'Your application for Pradhan Mantri Awas Yojana (PMAY) has been rejected because annual household income exceeds the EWS ceiling limit.',
    'pm-kisan': 'Your application for PM-KISAN registration has been rejected due to beneficiary name mismatch with Aadhaar database.',
    'pmfby': 'Dear applicant, your PMFBY claim for season Kharif has been rejected as crop loss was reported after the 72-hour window.',
    'dbt': 'Beneficiary status: Rejected by PFMS due to Bank Account invalid or inactive. NPCI Aadhaar seeding not detected.',
    'ambiguous': 'Application status: Rejected.'
  };

  document.querySelectorAll('[data-rej-sample]').forEach((btn) => {
    btn.addEventListener('click', function () {
      const sampleKey = this.getAttribute('data-rej-sample');
      const sampleText = SAMPLE_REJECTION_NOTICES[sampleKey] || '';
      openRejectionModal(sampleText);
    });
  });

  document.querySelectorAll('.rej-quick-sample').forEach((btn) => {
    btn.addEventListener('click', function () {
      const sampleKey = this.getAttribute('data-sample');
      if (rejTextInput && SAMPLE_REJECTION_NOTICES[sampleKey]) {
        rejTextInput.value = SAMPLE_REJECTION_NOTICES[sampleKey];
      }
    });
  });

  // Image Upload Handling
  if (rejFileInput) {
    rejFileInput.addEventListener('change', function (e) {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          currentRejBase64 = evt.target.result;
          if (rejImagePreview) rejImagePreview.src = currentRejBase64;
          if (rejPreviewContainer) rejPreviewContainer.style.display = 'flex';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (rejRemoveImageBtn) {
    rejRemoveImageBtn.addEventListener('click', function () {
      currentRejBase64 = null;
      if (rejFileInput) rejFileInput.value = '';
      if (rejPreviewContainer) rejPreviewContainer.style.display = 'none';
      if (rejImagePreview) rejImagePreview.src = '';
    });
  }

  if (rejClearBtn) {
    rejClearBtn.addEventListener('click', function () {
      if (rejTextInput) rejTextInput.value = '';
      if (rejResultContainer) rejResultContainer.style.display = 'none';
      currentRejBase64 = null;
      if (rejFileInput) rejFileInput.value = '';
      if (rejPreviewContainer) rejPreviewContainer.style.display = 'none';
    });
  }

  async function performRejectionAnalysis(langOverride) {
    const rawText = rejTextInput ? rejTextInput.value.trim() : '';
    if (!rawText && !currentRejBase64) {
      alert('Please enter a rejection message or upload an image.');
      return;
    }

    const lang = langOverride || (rejLangSelect ? rejLangSelect.value : 'en');
    const schemeName = rejSchemeSelect ? rejSchemeSelect.value : undefined;
    const state = rejStateSelect ? rejStateSelect.value : undefined;

    if (rejLoading) rejLoading.style.display = 'flex';
    if (rejResultContainer) rejResultContainer.style.display = 'none';

    try {
      const res = await fetch('/api/rejection/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: rawText || 'Rejection notice attached in screenshot',
          schemeName,
          state,
          language: lang,
          imageBase64: currentRejBase64 || undefined,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (!data.success || !data.result) throw new Error(data.error || 'Failed to analyze rejection');

      lastRejectionResult = data.result;
      renderRejectionResult(data.result);
    } catch (err) {
      alert('Analysis error: ' + (err.message || 'Server error'));
    } finally {
      if (rejLoading) rejLoading.style.display = 'none';
    }
  }

  function renderRejectionResult(r) {
    if (!rejResultContainer) return;

    // Section A
    const meaningEl = document.getElementById('rej-res-meaning');
    if (meaningEl) meaningEl.textContent = r.meaning || 'Application held or rejected.';

    // Section B
    const statedEl = document.getElementById('rej-res-stated');
    if (statedEl) statedEl.textContent = r.statedReason || 'Demographic verification failure.';

    const possibleList = document.getElementById('rej-res-possible');
    const possibleBlock = document.getElementById('rej-possible-block');
    if (possibleList) {
      possibleList.innerHTML = '';
      if (r.possibleReasons && r.possibleReasons.length > 0) {
        r.possibleReasons.forEach((p) => {
          const li = document.createElement('li');
          li.textContent = p;
          possibleList.appendChild(li);
        });
        if (possibleBlock) possibleBlock.style.display = 'block';
      } else {
        if (possibleBlock) possibleBlock.style.display = 'none';
      }
    }

    // Section C
    const actionPlanList = document.getElementById('rej-res-action-plan');
    if (actionPlanList) {
      actionPlanList.innerHTML = '';
      (r.actionPlan || []).forEach((step) => {
        const li = document.createElement('li');
        li.textContent = step;
        actionPlanList.appendChild(li);
      });
    }

    const docsList = document.getElementById('rej-res-docs');
    if (docsList) {
      docsList.innerHTML = '';
      (r.documentsToCheck || []).forEach((doc) => {
        const li = document.createElement('li');
        li.textContent = doc;
        docsList.appendChild(li);
      });
    }

    // Section D
    const portalLink = document.getElementById('rej-res-portal-link');
    const portalName = document.getElementById('rej-res-portal-name');
    if (portalLink && portalName) {
      portalLink.href = r.officialPortalUrl || 'https://www.myscheme.gov.in/';
      portalName.textContent = r.officialPortalName || 'Official Scheme Portal';
    }

    const grievanceLink = document.getElementById('rej-res-grievance-link');
    const grievanceName = document.getElementById('rej-res-grievance-name');
    if (grievanceLink && grievanceName) {
      grievanceLink.href = r.grievanceChannelUrl || 'https://pgportal.gov.in/';
      grievanceName.textContent = r.grievanceChannelName || 'Centralised Public Grievance Portal (CPGRAMS)';
    }

    const helplineBox = document.getElementById('rej-res-helpline-box');
    const helplineEl = document.getElementById('rej-res-helpline');
    if (helplineBox && helplineEl) {
      if (r.verifiedHelpline) {
        helplineEl.textContent = r.verifiedHelpline;
        helplineBox.style.display = 'block';
      } else {
        helplineBox.style.display = 'none';
      }
    }

    const deadlineBox = document.getElementById('rej-res-deadline-box');
    const deadlineEl = document.getElementById('rej-res-deadline');
    if (deadlineBox && deadlineEl) {
      if (r.verifiedDeadline) {
        deadlineEl.textContent = r.verifiedDeadline;
        deadlineBox.style.display = 'block';
      } else {
        deadlineBox.style.display = 'none';
      }
    }

    // Section E
    const escalationList = document.getElementById('rej-res-escalation');
    if (escalationList) {
      escalationList.innerHTML = '';
      (r.escalationOptions || []).forEach((opt) => {
        const li = document.createElement('li');
        li.textContent = opt;
        escalationList.appendChild(li);
      });
    }

    // Follow up clarification questions
    const clarBox = document.getElementById('rej-res-clarification');
    const qList = document.getElementById('rej-res-questions');
    if (clarBox && qList) {
      if (r.needsClarification && r.followUpQuestions && r.followUpQuestions.length > 0) {
        qList.innerHTML = '';
        r.followUpQuestions.forEach((q) => {
          const li = document.createElement('li');
          li.textContent = q;
          qList.appendChild(li);
        });
        clarBox.style.display = 'block';
      } else {
        clarBox.style.display = 'none';
      }
    }

    rejResultContainer.style.display = 'flex';
  }

  if (rejAnalyzeBtn) rejAnalyzeBtn.addEventListener('click', () => performRejectionAnalysis());

  // Result Toolbar Action Buttons
  const rejActHindi = document.getElementById('rej-act-hindi');
  if (rejActHindi) {
    rejActHindi.addEventListener('click', () => {
      if (rejLangSelect) rejLangSelect.value = 'hi';
      performRejectionAnalysis('hi');
    });
  }

  const rejActKannada = document.getElementById('rej-act-kannada');
  if (rejActKannada) {
    rejActKannada.addEventListener('click', () => {
      if (rejLangSelect) rejLangSelect.value = 'kn';
      performRejectionAnalysis('kn');
    });
  }

  const rejActSimple = document.getElementById('rej-act-simple');
  if (rejActSimple) {
    rejActSimple.addEventListener('click', () => {
      if (!lastRejectionResult) return;
      const meaningEl = document.getElementById('rej-res-meaning');
      if (meaningEl) {
        meaningEl.innerHTML = `<strong>💡 Plain-Language Summary:</strong><br>` +
          `1. Your application could not be verified because records in the system do not match.<br>` +
          `2. Check your Aadhaar spelling and ask your bank to enable NPCI Direct Benefit Transfer (DBT).<br>` +
          `3. After updating, re-verify your status on the official portal. No fee is required.`;
      }
    });
  }

  const rejActSendChat = document.getElementById('rej-act-send-chat');
  if (rejActSendChat) {
    rejActSendChat.addEventListener('click', () => {
      if (lastRejectionResult && lastRejectionResult.formattedMessage) {
        closeRejectionModal();
        appendMessage(lastRejectionResult.formattedMessage, false);
      }
    });
  }

  // ========================================================
  // Feature 2: Life-Event Benefit Discovery Controller
  // ========================================================
  const lifeEventModal = document.getElementById('life-event-modal');
  const openLeHeaderBtn = document.getElementById('header-life-event-btn');
  const openLeDockBtn = document.getElementById('dock-life-event-btn');
  const openLeSideBtn = document.getElementById('open-life-event-modal-btn');
  const leCloseBtn = document.getElementById('life-event-modal-close');
  const leOverlay = document.getElementById('life-event-modal-overlay');
  const leSituationInput = document.getElementById('le-situation-input');
  const leStateSelect = document.getElementById('le-state-select');
  const leOccSelect = document.getElementById('le-occ-select');
  const leLangSelect = document.getElementById('le-lang-select');
  const leDiscoverBtn = document.getElementById('le-discover-btn');
  const leClearBtn = document.getElementById('le-clear-btn');
  const leLoading = document.getElementById('le-loading');
  const leResultContainer = document.getElementById('le-result-container');

  let lastLifeEventResult = null;

  function openLifeEventModal(initialText = '') {
    if (!lifeEventModal) return;
    lifeEventModal.style.display = 'flex';
    lifeEventModal.setAttribute('aria-hidden', 'false');
    if (initialText && leSituationInput) {
      leSituationInput.value = initialText;
    }
  }

  function closeLifeEventModal() {
    if (!lifeEventModal) return;
    lifeEventModal.style.display = 'none';
    lifeEventModal.setAttribute('aria-hidden', 'true');
  }

  if (openLeHeaderBtn) openLeHeaderBtn.addEventListener('click', () => openLifeEventModal());
  if (openLeDockBtn) openLeDockBtn.addEventListener('click', () => openLifeEventModal());
  if (openLeSideBtn) openLeSideBtn.addEventListener('click', () => openLifeEventModal());
  if (leCloseBtn) leCloseBtn.addEventListener('click', closeLifeEventModal);
  if (leOverlay) leOverlay.addEventListener('click', closeLifeEventModal);

  // Preset situations from side panel & modal
  const SAMPLE_LIFE_EVENTS = {
    'crop-damage': 'Meri fasal baarish ki वजह se kharab ho gayi hai.',
    'small-business': 'I want to start a small business but I have very little money.',
    'daughter-college': 'My daughter is going to college and I need financial assistance.',
    'elderly-pension': 'My father is elderly and needs pension support.',
  };

  document.querySelectorAll('[data-le-sample]').forEach((btn) => {
    btn.addEventListener('click', function () {
      const sampleKey = this.getAttribute('data-le-sample');
      const sampleText = SAMPLE_LIFE_EVENTS[sampleKey] || '';
      openLifeEventModal(sampleText);
    });
  });

  document.querySelectorAll('.le-quick-preset').forEach((btn) => {
    btn.addEventListener('click', function () {
      const text = this.getAttribute('data-text');
      if (leSituationInput && text) {
        leSituationInput.value = text;
      }
    });
  });

  if (leClearBtn) {
    leClearBtn.addEventListener('click', function () {
      if (leSituationInput) leSituationInput.value = '';
      if (leResultContainer) leResultContainer.style.display = 'none';
    });
  }

  async function performLifeEventDiscovery(langOverride) {
    const userSituation = leSituationInput ? leSituationInput.value.trim() : '';
    if (!userSituation) {
      alert('Please describe your real-life situation or need.');
      return;
    }

    const lang = langOverride || (leLangSelect ? leLangSelect.value : 'en');
    const state = leStateSelect ? leStateSelect.value : undefined;
    const occupation = leOccSelect ? leOccSelect.value : undefined;

    if (leLoading) leLoading.style.display = 'flex';
    if (leResultContainer) leResultContainer.style.display = 'none';

    try {
      const res = await fetch('/api/life-events/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userSituation,
          state,
          occupation,
          language: lang,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (!data.success || !data.result) throw new Error(data.error || 'Failed to discover benefits');

      lastLifeEventResult = data.result;
      renderLifeEventResult(data.result);
    } catch (err) {
      alert('Discovery error: ' + (err.message || 'Server error'));
    } finally {
      if (leLoading) leLoading.style.display = 'none';
    }
  }

  function renderLifeEventResult(r) {
    if (!leResultContainer) return;

    const eventEl = document.getElementById('le-res-event');
    if (eventEl) eventEl.textContent = `Event: ${r.identifiedLifeEvent}`;

    const needEl = document.getElementById('le-res-need');
    if (needEl) needEl.textContent = `Need: ${r.identifiedNeed}`;

    const catEl = document.getElementById('le-res-cat');
    if (catEl) catEl.textContent = `Category: ${r.primaryCategory}`;

    const expEl = document.getElementById('le-res-explanation');
    if (expEl) expEl.textContent = r.summaryExplanation;

    const cardsGrid = document.getElementById('le-cards-grid');
    if (cardsGrid) {
      cardsGrid.innerHTML = '';
      (r.matches || []).forEach((m) => {
        const card = document.createElement('div');
        card.className = 'scheme-card';

        const loanWarningHtml = m.isLoan
          ? `<div class="loan-warning-pill">⚠️ <strong>Credit Facility:</strong> This scheme provides a loan that requires repayment, not a free grant.</div>`
          : '';

        card.innerHTML = `
          <div class="scheme-card-header">
            <div>
              <div class="scheme-card-title">${m.scheme.name}</div>
              <div class="scheme-card-dept">🏛️ ${m.scheme.ministry} &bull; State: ${m.scheme.state}</div>
            </div>
            <span class="benefit-type-badge">${m.benefitType}</span>
          </div>
          ${loanWarningHtml}
          <div class="scheme-card-block">
            <span class="block-label">💡 Why this matches:</span>
            <span class="block-content">${m.whyMatched}</span>
          </div>
          <div class="scheme-card-block">
            <span class="block-label">💰 Benefits:</span>
            <span class="block-content">${m.financialAssistanceDetails}</span>
          </div>
          <div class="scheme-card-block">
            <span class="block-label">👥 Apparent Eligibility:</span>
            <span class="block-content">${m.apparentEligibility}</span>
          </div>
          <div class="scheme-card-block">
            <span class="block-label">⚠️ Exclusions:</span>
            <span class="block-content">${m.importantExclusions.join(' • ')}</span>
          </div>
          <div class="scheme-card-block">
            <span class="block-label">📄 Key Documents:</span>
            <span class="block-content">${m.requiredDocuments.slice(0, 3).join(', ')}</span>
          </div>
          <div style="margin-top: 6px;">
            <a href="${m.officialApplicationUrl}" target="_blank" rel="noopener noreferrer" class="portal-btn">
              <span>Official Application Portal ↗</span>
            </a>
          </div>
        `;
        cardsGrid.appendChild(card);
      });
    }

    const missingBox = document.getElementById('le-missing-details-box');
    const missingText = document.getElementById('le-missing-details-text');
    if (missingBox && missingText) {
      if (r.missingDetailsPrompt) {
        missingText.textContent = r.missingDetailsPrompt;
        missingBox.style.display = 'flex';
      } else {
        missingBox.style.display = 'none';
      }
    }

    leResultContainer.style.display = 'flex';
  }

  if (leDiscoverBtn) leDiscoverBtn.addEventListener('click', () => performLifeEventDiscovery());

  const leActHindi = document.getElementById('le-act-hindi');
  if (leActHindi) {
    leActHindi.addEventListener('click', () => {
      if (leLangSelect) leLangSelect.value = 'hi';
      performLifeEventDiscovery('hi');
    });
  }

  const leActKannada = document.getElementById('le-act-kannada');
  if (leActKannada) {
    leActKannada.addEventListener('click', () => {
      if (leLangSelect) leLangSelect.value = 'kn';
      performLifeEventDiscovery('kn');
    });
  }

  const leActChatEligibility = document.getElementById('le-act-chat-eligibility');
  if (leActChatEligibility) {
    leActChatEligibility.addEventListener('click', () => {
      closeLifeEventModal();
      sendMessage('Check my eligibility');
    });
  }

  const leActSendChat = document.getElementById('le-act-send-chat');
  if (leActSendChat) {
    leActSendChat.addEventListener('click', () => {
      if (lastLifeEventResult && lastLifeEventResult.formattedMessage) {
        closeLifeEventModal();
        appendMessage(lastLifeEventResult.formattedMessage, false);
      }
    });
  }

  // Initial Kickoff
  // Automatically greet user with welcome message on load
  setTimeout(function () {
    sendMessage('HI');
  }, 400);

})();

