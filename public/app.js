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

  // Initial Kickoff
  // Automatically greet user with welcome message on load
  setTimeout(function () {
    sendMessage('HI');
  }, 400);

})();
