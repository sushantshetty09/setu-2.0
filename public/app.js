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

  // Initial Kickoff
  // Automatically greet user with welcome message on load
  setTimeout(function () {
    sendMessage('HI');
  }, 400);

})();
