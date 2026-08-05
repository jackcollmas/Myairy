document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const lockScreen = document.getElementById('lock-screen');
  const appScreen = document.getElementById('app');
  const pinInput = document.getElementById('pin-input');
  const pinLoading = document.getElementById('pin-loading');
  const lockError = document.getElementById('lock-error');
  const preLoginInput = document.getElementById('pre-login-input');
  const preLoginSendBtn = document.getElementById('pre-login-send-btn');
  const preLoginQueue = document.getElementById('pre-login-queue');
  const preLoginMentionsDropdown = document.getElementById('pre-login-mentions-dropdown');

  const navDashboard = document.getElementById('nav-dashboard');
  const navChat = document.getElementById('nav-chat');
  const navPersonas = document.getElementById('nav-personas');
  const navSearch = document.getElementById('nav-search');
  const navAnalytics = document.getElementById('nav-analytics');
  const lockAppBtn = document.getElementById('lock-app-btn');

  const viewDashboard = document.getElementById('view-dashboard');
  const viewPersonas = document.getElementById('view-personas');
  const viewSearch = document.getElementById('view-search');
  const viewAnalytics = document.getElementById('view-analytics');
  const viewEntry = document.getElementById('view-entry');

  const journalsList = document.getElementById('journals-list');
  const personasList = document.getElementById('personas-list');
  const searchResults = document.getElementById('search-results');
  const searchInput = document.getElementById('search-input');
  const searchCount = document.getElementById('search-count');
  const searchPagination = document.getElementById('search-pagination');
  const prevPageBtn = document.getElementById('prev-page-btn');
  const nextPageBtn = document.getElementById('next-page-btn');
  const currentPageSpan = document.getElementById('current-page');
  const totalPagesSpan = document.getElementById('total-pages');
  const resultsRangeSpan = document.getElementById('results-range');
  const totalResultsSpan = document.getElementById('total-results');
  const searchStats = document.getElementById('search-stats');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const searchPersonaFilter = document.getElementById('search-persona-filter');
  const searchJournalFilter = document.getElementById('search-journal-filter');
  const searchImagesOnly = document.getElementById('search-images-only');
  const searchWithReactions = document.getElementById('search-with-reactions');

  const newJournalBtn = document.getElementById('new-journal-btn');
  const newPersonaBtn = document.getElementById('new-persona-btn');
  const backToDashboardBtn = document.getElementById('back-to-dashboard');
  const toggleStarBtn = document.getElementById('toggle-star-btn');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  const sidebar = document.querySelector('.sidebar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const desktopCollapseBtn = document.getElementById('desktop-collapse-btn');

  // --- Mobile & Desktop Sidebar Logic ---
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      const icon = mobileMenuBtn.querySelector('i');
      if (sidebar.classList.contains('mobile-open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  if (desktopCollapseBtn) {
    desktopCollapseBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const icon = desktopCollapseBtn.querySelector('i');
      if (sidebar.classList.contains('collapsed')) {
        icon.classList.remove('fa-chevron-left');
        icon.classList.add('fa-chevron-right');
      } else {
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-left');
      }
    });
  }

  // --- Theme Initialization ---
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (darkModeToggle) {
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }
    });
  }

  const entryTitle = document.getElementById('entry-title');
  const entryDate = document.getElementById('entry-date');
  const entryMessages = document.getElementById('entry-messages');
  const messageInput = document.getElementById('message-input');
  const mentionsDropdown = document.getElementById('mentions-dropdown');
  const sendMessageBtn = document.getElementById('sendMessage-btn') || document.getElementById('send-message-btn');

  const imageInput = document.getElementById('image-input');
  const imageBtn = document.getElementById('image-btn');
  const imageOptionsMenu = document.getElementById('image-options-menu');
  const attachmentPreview = document.getElementById('attachment-preview');
  const imagesContainer = document.getElementById('images-container');
  const replyAttachment = document.getElementById('reply-attachment');
  const removeReplyBtn = document.getElementById('remove-reply-btn');
  const replyAuthor = document.getElementById('reply-author');
  const replyText = document.getElementById('reply-text');
  
  // Camera elements
  const cameraModal = document.getElementById('camera-modal');
  const cameraVideo = document.getElementById('camera-video');
  const cameraCanvas = document.getElementById('camera-canvas');
  const closeCameraBtn = document.getElementById('close-camera-btn');
  const switchCameraBtn = document.getElementById('switch-camera-btn');
  const capturePhotoBtn = document.getElementById('capture-photo-btn');

  const messageContextMenu = document.getElementById('message-context-menu');
  const reactionPicker = document.getElementById('reaction-picker');

  const modalOverlay = document.getElementById('modal-overlay');
  const modalContent = document.getElementById('modal-content');

  // --- State ---
  let currentPersonas = [];
  let currentJournals = [];
  let activeSenderId = null;
  let activeJournalId = null;
  let selectedImageFile = null;
  let uploadedImageUrls = []; // Changed to array for multiple images
  let contextMenuTarget = null;
  let replyingToMessage = null;
  
  // Load personas from localStorage on page load (before login)
  currentPersonas = getPersonasFromLocalStorage();
  
  // Pagination state
  let searchResultsCache = [];
  let currentSearchPage = 1;
  let resultsPerPage = 10;

  const jumpToPageInput = document.getElementById('jump-to-page');
  const resultsPerPageSelect = document.getElementById('results-per-page');

  // --- Initialization ---

  // --- LocalStorage Management ---
  function savePersonasToLocalStorage(personas) {
    try {
      const simplifiedPersonas = personas.map(p => ({
        id: p.id,
        name: p.name,
        avatarIcon: p.avatarIcon,
        color: p.color
      }));
      localStorage.setItem('myairy_personas', JSON.stringify(simplifiedPersonas));
    } catch (e) {
      console.error('Failed to save personas to localStorage:', e);
    }
  }

  function getPersonasFromLocalStorage() {
    try {
      const stored = localStorage.getItem('myairy_personas');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load personas from localStorage:', e);
      return [];
    }
  }

  function savePreLoginMessagesToLocalStorage(messages) {
    try {
      localStorage.setItem('myairy_prelogin_messages', JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save pre-login messages:', e);
    }
  }

  function getPreLoginMessagesFromLocalStorage() {
    try {
      const stored = localStorage.getItem('myairy_prelogin_messages');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load pre-login messages:', e);
      return [];
    }
  }

  function clearPreLoginMessages() {
    try {
      localStorage.removeItem('myairy_prelogin_messages');
    } catch (e) {
      console.error('Failed to clear pre-login messages:', e);
    }
  }

  function savePreLoginInputState(text) {
    try {
      localStorage.setItem('myairy_prelogin_input', text);
    } catch (e) {
      console.error('Failed to save pre-login input:', e);
    }
  }

  function getPreLoginInputState() {
    try {
      return localStorage.getItem('myairy_prelogin_input') || '';
    } catch (e) {
      console.error('Failed to load pre-login input:', e);
      return '';
    }
  }

  function clearPreLoginInputState() {
    try {
      localStorage.removeItem('myairy_prelogin_input');
    } catch (e) {
      console.error('Failed to clear pre-login input:', e);
    }
  }

  // --- Pre-login Input Logic ---
  let preLoginMessages = [];
  let preLoginMentionActive = false;
  let preLoginMentionQuery = '';
  let preLoginSelectedMentionIndex = 0;
  let preLoginMentionOptions = [];
  
  // Cache current journal messages for optimistic UI
  let currentJournalMessages = [];

  function updatePreLoginMentionsDropdown() {
    // Only show dropdown if input has focus AND mention is active
    if (!preLoginMentionActive || !preLoginInputHasFocus) {
      preLoginMentionsDropdown.classList.add('hidden');
      return;
    }

    // Filter options based on query
    const query = preLoginMentionQuery.toLowerCase();
    preLoginMentionOptions = [
      { id: 'ai_assistant', name: 'AI Assistant', icon: 'fa-robot', color: '#4facfe' },
      ...currentPersonas
    ].filter(p => p.name.toLowerCase().includes(query));

    if (preLoginMentionOptions.length === 0) {
      preLoginMentionsDropdown.classList.add('hidden');
      return;
    }

    // Ensure selected index is within bounds
    if (preLoginSelectedMentionIndex >= preLoginMentionOptions.length) {
      preLoginSelectedMentionIndex = 0;
    }

    preLoginMentionsDropdown.innerHTML = '';
    preLoginMentionOptions.forEach((p, index) => {
      const item = document.createElement('div');
      item.className = `mention-item ${index === preLoginSelectedMentionIndex ? 'active' : ''}`;
      
      const avatarHtml = p.id === 'ai_assistant' 
        ? `<i class="fas ${p.icon}"></i>` 
        : (p.avatarIcon || '<i class="fas fa-user"></i>');
        
      item.innerHTML = `
        <div class="mention-icon" style="color: ${p.color};">${avatarHtml}</div>
        <div class="mention-name" style="color: ${p.color};">${p.name}</div>
      `;
      
      item.addEventListener('click', () => {
        insertPreLoginMention(p);
      });
      
      preLoginMentionsDropdown.appendChild(item);
    });

    preLoginMentionsDropdown.classList.remove('hidden');
  }

  function insertPreLoginMention(persona) {
    const val = preLoginInput.value;
    const cursorPos = preLoginInput.selectionStart;
    const textBeforeCursor = val.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atIndex !== -1) {
      preLoginInput.value = val.substring(0, atIndex) + `@${persona.name} ` + val.substring(cursorPos);
    } else {
      preLoginInput.value = val + `@${persona.name} `;
    }
    preLoginMentionActive = false;
    updatePreLoginMentionsDropdown();
    preLoginInput.focus();
  }

  preLoginInput.addEventListener('input', (e) => {
    const val = preLoginInput.value;
    const cursorPos = preLoginInput.selectionStart;
    
    // Check if we are currently typing a mention
    const textBeforeCursor = val.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atIndex !== -1) {
      // Check if there is a space after the @
      const textAfterAt = textBeforeCursor.substring(atIndex + 1);
      if (!textAfterAt.includes(' ')) {
        preLoginMentionActive = true;
        preLoginMentionQuery = textAfterAt;
        updatePreLoginMentionsDropdown();
        return;
      }
    }
    
    preLoginMentionActive = false;
    updatePreLoginMentionsDropdown();
  });

  preLoginInput.addEventListener('keydown', (e) => {
    // Prevent deleting the @ symbol
    if ((e.key === 'Backspace' || e.key === 'Delete') && preLoginInput.value === '@') {
      e.preventDefault();
      return;
    }

    // Don't send if only @ is present
    if (e.key === 'Enter' && preLoginInput.value.trim() === '@') {
      e.preventDefault();
      return;
    }

    if (!preLoginMentionActive || preLoginMentionsDropdown.classList.contains('hidden')) {
      if (e.key === 'Enter') {
        e.preventDefault();
        preLoginSendBtn.click();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      preLoginSelectedMentionIndex = (preLoginSelectedMentionIndex + 1) % preLoginMentionOptions.length;
      updatePreLoginMentionsDropdown();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      preLoginSelectedMentionIndex = (preLoginSelectedMentionIndex - 1 + preLoginMentionOptions.length) % preLoginMentionOptions.length;
      updatePreLoginMentionsDropdown();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      insertPreLoginMention(preLoginMentionOptions[preLoginSelectedMentionIndex]);
    } else if (e.key === 'Escape') {
      preLoginMentionActive = false;
      updatePreLoginMentionsDropdown();
    }
  });

  let preLoginInputHasFocus = false;

  function resetPreLoginInput() {
    preLoginInput.value = '@';
    preLoginMentionActive = false;
    preLoginMentionQuery = '';
    updatePreLoginMentionsDropdown();
  }

  // Show dropdown when focusing the input if there's an @
  preLoginInput.addEventListener('focus', () => {
    preLoginInputHasFocus = true;
    // Trigger input processing after setting focus flag
    setTimeout(() => {
      preLoginInput.dispatchEvent(new Event('input'));
    }, 0);
  });

  // Hide dropdown when leaving the input, with a delay to allow clicks
  preLoginInput.addEventListener('blur', () => {
    setTimeout(() => {
      preLoginInputHasFocus = false;
      preLoginMentionActive = false;
      updatePreLoginMentionsDropdown();
    }, 200);
  });

  function renderPreLoginQueue() {
    preLoginQueue.innerHTML = '';
    preLoginMessages.forEach((msg, index) => {
      const item = document.createElement('div');
      item.className = 'pre-login-queue-item';
      item.innerHTML = `
        <span class="pre-login-queue-text">${msg}</span>
        <button class="pre-login-queue-remove" data-index="${index}" title="Remove">
          <i class="fas fa-times"></i>
        </button>
      `;
      preLoginQueue.appendChild(item);
    });

    // Add event listeners to remove buttons
    document.querySelectorAll('.pre-login-queue-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        preLoginMessages.splice(index, 1);
        savePreLoginMessagesToLocalStorage(preLoginMessages);
        renderPreLoginQueue();
      });
    });
  }

  // Load pre-login messages on page load
  preLoginMessages = getPreLoginMessagesFromLocalStorage();
  renderPreLoginQueue();

  // Restore pre-login input state or set to @ if empty
  const savedInputState = getPreLoginInputState();
  preLoginInput.value = savedInputState || '@';

  // Save input state as user types
  preLoginInput.addEventListener('input', () => {
    savePreLoginInputState(preLoginInput.value);
  });

  // Queue pre-login message
  preLoginSendBtn.addEventListener('click', () => {
    const message = preLoginInput.value.trim();
    if (message && message !== '@') {
      preLoginMessages.push(message);
      savePreLoginMessagesToLocalStorage(preLoginMessages);
      resetPreLoginInput();
      clearPreLoginInputState();
      renderPreLoginQueue();
    }
  });

  // Remove the duplicate Enter key handler (already handled in keydown above)

  // Send all queued messages when logging in
  async function sendQueuedMessages() {
    if (!activeJournalId) return;

    const messagesToSend = [...preLoginMessages];
    const inputText = preLoginInput.value.trim();
    
    if (inputText) {
      messagesToSend.push(inputText);
    }

    if (messagesToSend.length === 0) return;

    try {
      // Fetch current journal
      const jRes = await fetch(`/api/journals/${activeJournalId}`);
      const journal = await jRes.json();

      // Process each message
      for (const content of messagesToSend) {
        let finalPersonaId = activeSenderId || (currentPersonas.length > 0 ? currentPersonas[0].id : null);
        let finalContent = content;

        // Check if message starts with @PersonaName
        if (content.startsWith('@')) {
          let matched = false;
          
          // Check AI first
          if (content.toLowerCase().startsWith('@ai assistant ') || content.toLowerCase().startsWith('@ai ')) {
            const aiPrefix = content.toLowerCase().startsWith('@ai assistant ') ? '@ai assistant ' : '@ai ';
            finalContent = content.substring(aiPrefix.length).trim();
            // For AI messages, keep the @ in the content
            finalContent = content; // Keep as is, will be handled by AI
            matched = true;
          } else if (content.toLowerCase() === '@ai assistant' || content.toLowerCase() === '@ai') {
            finalContent = content; // Keep as is
            matched = true;
          }

          // Check personas if not AI
          if (!matched) {
            for (const p of currentPersonas) {
              const prefix = `@${p.name.toLowerCase()} `;
              if (content.toLowerCase().startsWith(prefix)) {
                finalPersonaId = p.id;
                finalContent = content.substring(prefix.length).trim();
                matched = true;
                break;
              } else if (content.toLowerCase() === `@${p.name.toLowerCase()}`) {
                finalPersonaId = p.id;
                finalContent = '';
                matched = true;
                break;
              }
            }
          }
        }

        if (!finalPersonaId) continue;

        const persona = currentPersonas.find(p => p.id === finalPersonaId);
        if (!persona) continue;

        if (!finalContent) continue;

        const newMessage = {
          id: `msg_${Date.now()}_${Math.random()}`,
          personaId: persona.id,
          personaName: persona.name,
          personaColor: persona.color,
          personaIcon: persona.avatarIcon,
          content: finalContent,
          timestamp: new Date().toISOString()
        };

        journal.messages.push(newMessage);
        
        // Small delay to ensure unique timestamps
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Save updated journal
      await fetch(`/api/journals/${activeJournalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(journal)
      });

      // Clear queued messages
      preLoginMessages = [];
      clearPreLoginMessages();
      preLoginInput.value = '';
      clearPreLoginInputState();
      renderPreLoginQueue();

      // Reload journal to show new messages
      openJournal(activeJournalId);
    } catch (e) {
      console.error('Failed to send queued messages:', e);
    }
  }

  // Transfer pre-login input to chat input if user was typing when login completed
  function transferPreLoginInput() {
    const text = preLoginInput.value.trim();
    if (text && messageInput) {
      messageInput.value = text;
      clearPreLoginInputState();
    }
  }

  // --- Initialization ---

  // --- Floating Words Animation (Lock Screen) ---
  const POWERFUL_WORDS = [
    'creativity', 'personality', 'life', 'courage', 'silence',
    'wonder', 'freedom', 'resilience', 'truth', 'growth',
    'clarity', 'purpose', 'passion', 'solitude', 'presence',
    'grace', 'depth', 'intention', 'becoming', 'memory',
    'stillness', 'identity', 'longing', 'surrender', 'vision',
    'instinct', 'light', 'persistence', 'soul', 'reflection',
    'curiosity', 'vulnerability', 'momentum', 'awareness', 'joy'
  ];

  const floatingWordsContainer = document.getElementById('floating-words-container');
  let floatingWordsInterval = null;

  function spawnFloatingWord() {
    if (!floatingWordsContainer) return;
    const word = POWERFUL_WORDS[Math.floor(Math.random() * POWERFUL_WORDS.length)];
    const el = document.createElement('span');
    el.classList.add('floating-word');
    el.textContent = word;

    const topPct  = 5 + Math.random() * 85;
    const leftPct = 3 + Math.random() * 80;
    const rotation = (Math.random() - 0.5) * 22;
    const fontSize = 1.4 + Math.random() * 2.2;
    const fonts = ["'Italianno', cursive", "'Passero One', cursive"];
    const chosenFont = fonts[Math.floor(Math.random() * fonts.length)];

    el.style.cssText = `
      top: ${topPct}%;
      left: ${leftPct}%;
      --rot: ${rotation}deg;
      font-size: ${fontSize}rem;
      font-family: ${chosenFont};
      color: var(--text-color);
    `;

    floatingWordsContainer.appendChild(el);
    setTimeout(() => el.remove(), 6200);
  }

  function startFloatingWords() {
    if (floatingWordsInterval) return; // already running
    spawnFloatingWord();
    floatingWordsInterval = setInterval(spawnFloatingWord, 500);
  }

  function stopFloatingWords() {
    if (floatingWordsInterval) {
      clearInterval(floatingWordsInterval);
      floatingWordsInterval = null;
    }
    if (floatingWordsContainer) floatingWordsContainer.innerHTML = '';
  }

  // Start immediately — lock screen is the first thing shown
  startFloatingWords();

  // --- Lock Screen Logic ---
  pinInput.addEventListener('input', async (e) => {
    const pin = e.target.value;
    if (pin.length === 4) {
      // Show loading spinner
      pinLoading.classList.remove('hidden');
      pinInput.disabled = true;
      lockError.textContent = '';
      
      try {
        const res = await fetch('/api/verify-pin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin })
        });
        const data = await res.json();
        
        if (data.success) {
          lockScreen.classList.remove('active');
          lockScreen.classList.add('hidden');
          appScreen.classList.remove('hidden');
          appScreen.classList.add('active');
          pinInput.value = '';
          lockError.textContent = '';
          stopFloatingWords();
          await loadDashboard();
          await getOrCreateTodayJournal();
          
          // Send queued messages after a short delay
          setTimeout(async () => {
            await sendQueuedMessages();
          }, 500);
          
          // Transfer any text in pre-login input to chat input
          transferPreLoginInput();
        } else {
          lockError.textContent = data.message || 'Invalid PIN';
          pinInput.value = '';
        }
      } catch (err) {
        lockError.textContent = 'Error verifying PIN';
        pinInput.value = '';
      } finally {
        // Hide loading spinner and re-enable input
        pinLoading.classList.add('hidden');
        pinInput.disabled = false;
      }
    } else {
      lockError.textContent = ''; // clear error when typing
    }
  });

  lockAppBtn.addEventListener('click', () => {
    // Close mobile sidebar if open
    if (sidebar.classList.contains('mobile-open')) {
      sidebar.classList.remove('mobile-open');
      if (mobileMenuBtn) {
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }
    appScreen.classList.remove('active');
    appScreen.classList.add('hidden');
    lockScreen.classList.remove('hidden');
    lockScreen.classList.add('active');
  });

  // Restart animation when locking the app
  lockAppBtn.addEventListener('click', startFloatingWords);

  // --- FAB Visibility ---
  const fabJournal = document.getElementById('new-journal-btn');
  const fabPersona = document.getElementById('new-persona-btn');

  function updateFab(viewId) {
    // Hide all FABs first
    if (fabJournal) fabJournal.classList.add('fab-hidden');
    if (fabPersona) fabPersona.classList.add('fab-hidden');

    // Show the relevant FAB and re-trigger entrance animation
    const showFab = (fab) => {
      if (!fab) return;
      fab.classList.remove('fab-hidden');
      // Re-trigger animation by removing and re-adding
      fab.style.animation = 'none';
      fab.offsetHeight; // reflow
      fab.style.animation = '';
    };

    if (viewId === 'view-dashboard') showFab(fabJournal);
    else if (viewId === 'view-personas') showFab(fabPersona);
    // view-entry and view-search: keep both hidden
  }

  // --- Navigation ---
  function switchView(viewId) {
    // Close mobile sidebar if open
    if (sidebar.classList.contains('mobile-open')) {
      sidebar.classList.remove('mobile-open');
      if (mobileMenuBtn) {
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }

    document.querySelectorAll('.sub-view').forEach(v => {
      v.classList.remove('active');
      v.classList.add('hidden');
    });
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.remove('hidden');
      targetView.classList.add('active');
    }

    if (viewId === 'view-dashboard') {
      navDashboard.classList.add('active');
      loadDashboard();
    } else if (viewId === 'view-personas') {
      navPersonas.classList.add('active');
      loadPersonas();
    } else if (viewId === 'view-search') {
      navSearch.classList.add('active');
      loadSearch();
    } else if (viewId === 'view-analytics') {
      navAnalytics.classList.add('active');
      loadAnalytics();
    }

    updateFab(viewId);
  }

  // Open Latest Journal (for Chat tab)
  async function openLatestJournal() {
    // Close mobile sidebar if open
    if (sidebar.classList.contains('mobile-open')) {
      sidebar.classList.remove('mobile-open');
      if (mobileMenuBtn) {
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }

    try {
      const res = await fetch('/api/journals');
      const journals = await res.json();
      
      if (journals.length === 0) {
        alert('No journals found. Create a journal from the Dashboard first!');
        switchView('view-dashboard');
        return;
      }
      
      // Sort by date (newest first)
      journals.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Open the latest journal
      const latestJournal = journals[0];
      openJournal(latestJournal.id);
      
      // Highlight the Chat button
      navChat.classList.add('active');
    } catch (e) {
      console.error('Failed to load latest journal:', e);
      alert('Failed to load latest journal');
    }
  }

  navDashboard.addEventListener('click', () => switchView('view-dashboard'));
  navChat.addEventListener('click', () => openLatestJournal());
  navPersonas.addEventListener('click', () => switchView('view-personas'));
  navSearch.addEventListener('click', () => switchView('view-search'));
  navAnalytics.addEventListener('click', () => switchView('view-analytics'));
  backToDashboardBtn.addEventListener('click', () => switchView('view-dashboard'));
  
  if (toggleStarBtn) {
    toggleStarBtn.addEventListener('click', async () => {
      if (!activeJournalId) return;
      try {
        const res = await fetch(`/api/journals/${activeJournalId}/toggle-special`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        const updated = await res.json();
        toggleStarBtn.innerHTML = updated.isSpecial ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        loadDashboard();
      } catch (e) {
        console.error('Failed to toggle special status');
      }
    });
  }

  // --- Editable Entry Title ---
  entryTitle.addEventListener('blur', async () => {
    if (!activeJournalId) return;
    const newTitle = entryTitle.textContent.trim();
    if (!newTitle) return;
    
    try {
      const res = await fetch(`/api/journals/${activeJournalId}`);
      const journal = await res.json();
      if (journal.title === newTitle) return; // No change

      await fetch(`/api/journals/${activeJournalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...journal, title: newTitle })
      });
      loadDashboard();
    } catch (e) {
      console.error('Failed to update title');
    }
  });

  entryTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      entryTitle.blur();
    }
  });

  // --- Data Fetching & Rendering ---
  async function loadDashboard() {
    try {
      const [journalsRes, personasRes] = await Promise.all([
        fetch('/api/journals'),
        fetch('/api/personas')
      ]);
      currentJournals = await journalsRes.json();
      currentPersonas = await personasRes.json();
      renderJournals();
    } catch (e) {
      console.error('Failed to load dashboard data');
    }
  }

  async function getOrCreateTodayJournal() {
    const today = new Date().toISOString().split('T')[0];
    const todayTitle = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const existing = currentJournals.find(j => j.date === today);
    if (existing) {
      openJournal(existing.id);
      return;
    }
    try {
      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: todayTitle, date: today })
      });
      const newJournal = await res.json();
      currentJournals.unshift(newJournal);
      renderJournals();
      openJournal(newJournal.id);
    } catch (e) {
      console.error('Failed to create today journal');
    }
  }

  async function loadPersonas() {
    try {
      const res = await fetch('/api/personas');
      currentPersonas = await res.json();
      
      // Save personas to localStorage whenever they're loaded
      savePersonasToLocalStorage(currentPersonas);
      
      if (currentPersonas.length > 0 && !activeSenderId) {
        activeSenderId = currentPersonas[0].id;
      }
      renderPersonas();
    } catch (e) {
      console.error('Failed to load personas');
      
      // Fallback to localStorage if API fails
      const storedPersonas = getPersonasFromLocalStorage();
      if (storedPersonas.length > 0) {
        currentPersonas = storedPersonas;
        if (!activeSenderId) {
          activeSenderId = currentPersonas[0].id;
        }
        renderPersonas();
      }
    }
  }

  // Load and Initialize Search
  async function loadSearch() {
    // Populate filter dropdowns
    searchPersonaFilter.innerHTML = '<option value="">All Personas</option>';
    currentPersonas.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      searchPersonaFilter.appendChild(opt);
    });

    searchJournalFilter.innerHTML = '<option value="">All Journals</option>';
    currentJournals.forEach(j => {
      const opt = document.createElement('option');
      opt.value = j.id;
      opt.textContent = j.title;
      searchJournalFilter.appendChild(opt);
    });

    // Reset search if needed
    if (!searchInput.value.trim()) {
      searchResults.innerHTML = `
        <div class="search-empty">
          <p><i class="fas fa-search"></i> Start typing to search across all your journal messages</p>
          <p style="color: var(--gray-text); font-size: 0.9rem; margin-top: 0.5rem;">
            Search by content, persona name, or date
          </p>
        </div>
      `;
      searchStats.classList.add('hidden');
    } else {
      performSearch();
    }
  }

  // Search Input Handler
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query) {
      clearSearchBtn.style.display = 'block';
      performSearch();
    } else {
      clearSearchBtn.style.display = 'none';
      searchResults.innerHTML = `
        <div class="search-empty">
          <p><i class="fas fa-search"></i> Start typing to search across all your journal messages</p>
        </div>
      `;
      searchStats.classList.add('hidden');
    }
  });

  // Clear Search
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    searchImagesOnly.checked = false;
    searchWithReactions.checked = false;
    searchPersonaFilter.value = '';
    searchJournalFilter.value = '';
    searchResultsCache = [];
    currentSearchPage = 1;
    searchPagination.classList.add('hidden');
    loadSearch();
  });

  // Filter Change Handlers
  searchPersonaFilter.addEventListener('change', () => {
    if (searchInput.value.trim()) performSearch();
  });

  searchJournalFilter.addEventListener('change', () => {
    if (searchInput.value.trim()) performSearch();
  });

  searchImagesOnly.addEventListener('change', () => {
    if (searchInput.value.trim()) performSearch();
  });

  // Pagination Button Handlers
  prevPageBtn.addEventListener('click', () => {
    if (currentSearchPage > 1) {
      currentSearchPage--;
      renderSearchResults(searchInput.value.trim());
    }
  });

  nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(searchResultsCache.length / resultsPerPage);
    if (currentSearchPage < totalPages) {
      currentSearchPage++;
      renderSearchResults(searchInput.value.trim());
    }
  });

  if (jumpToPageInput) {
    jumpToPageInput.addEventListener('change', (e) => {
      const page = parseInt(e.target.value);
      const totalPages = Math.ceil(searchResultsCache.length / resultsPerPage);
      
      if (page >= 1 && page <= totalPages) {
        currentSearchPage = page;
        renderSearchResults(searchInput.value.trim());
      } else {
        // Reset to current page if invalid
        e.target.value = currentSearchPage;
      }
    });
  }

  if (resultsPerPageSelect) {
    resultsPerPageSelect.addEventListener('change', (e) => {
      resultsPerPage = parseInt(e.target.value);
      currentSearchPage = 1; // Reset to page 1 when page size changes
      renderSearchResults(searchInput.value.trim());
    });
  }

  // Perform Search
  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    const personaFilter = searchPersonaFilter.value;
    const journalFilter = searchJournalFilter.value;
    const imagesOnly = searchImagesOnly.checked;
    const withReactions = searchWithReactions.checked;

    const results = [];

    // Search through all journals and messages
    currentJournals.forEach(journal => {
      // Skip if journal filter is active and doesn't match
      if (journalFilter && journal.id !== journalFilter) return;

      journal.messages.forEach(msg => {
        // Skip deleted messages
        if (msg.deleted || msg.permanentlyDeleted) return;

        // Apply filters
        if (personaFilter && msg.personaId !== personaFilter) return;
        if (imagesOnly && !msg.imageUrl) return;
        if (withReactions && (!msg.reactions || msg.reactions.length === 0)) return;

        // Search in message content, persona name, and date
        const searchText = `${msg.content} ${msg.personaName} ${new Date(msg.timestamp).toLocaleDateString()}`.toLowerCase();
        
        if (searchText.includes(query)) {
          results.push({
            message: msg,
            journal: journal,
            relevance: calculateRelevance(msg, query)
          });
        }
      });
    });

    // Sort by relevance (highest first)
    results.sort((a, b) => b.relevance - a.relevance);

    // Cache results and reset to page 1
    searchResultsCache = results;
    currentSearchPage = 1;

    // Render paginated results
    renderSearchResults(query);
  }

  // Calculate relevance score
  function calculateRelevance(message, query) {
    let score = 0;
    const content = message.content.toLowerCase();
    const personaName = message.personaName.toLowerCase();

    // Exact match in content
    if (content === query) score += 100;
    // Starts with query
    else if (content.startsWith(query)) score += 50;
    // Contains query
    else if (content.includes(query)) score += 20;

    // Persona name match
    if (personaName.includes(query)) score += 10;

    // Recent messages get slight boost
    const age = Date.now() - new Date(message.timestamp).getTime();
    const daysSince = age / (1000 * 60 * 60 * 24);
    score += Math.max(0, 10 - daysSince);

    return score;
  }

  // Render Search Results
  function renderSearchResults(query) {
    const totalResults = searchResultsCache.length;
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const startIdx = (currentSearchPage - 1) * resultsPerPage;
    const endIdx = startIdx + resultsPerPage;
    const pageResults = searchResultsCache.slice(startIdx, endIdx);

    // Update stats
    searchCount.textContent = totalResults;
    searchStats.classList.remove('hidden');

    // Update pagination info
    if (totalResults > 0) {
      searchPagination.classList.remove('hidden');
      currentPageSpan.textContent = currentSearchPage;
      totalPagesSpan.textContent = totalPages;
      resultsRangeSpan.textContent = `${startIdx + 1}-${Math.min(endIdx, totalResults)}`;
      totalResultsSpan.textContent = totalResults;
      
      if (jumpToPageInput) {
        jumpToPageInput.value = currentSearchPage;
      }
      
      // Update button states
      prevPageBtn.disabled = currentSearchPage === 1;
      nextPageBtn.disabled = currentSearchPage === totalPages;
    } else {
      searchPagination.classList.add('hidden');
    }

    if (totalResults === 0) {
      searchResults.innerHTML = `
        <div class="search-empty">
          <p>No messages found for "${query}"</p>
          <p style="color: var(--gray-text); font-size: 0.9rem; margin-top: 0.5rem;">
            Try different keywords or adjust your filters
          </p>
        </div>
      `;
      return;
    }

    searchResults.innerHTML = '';
    pageResults.forEach(result => {
      const { message, journal } = result;
      const card = document.createElement('div');
      card.className = 'search-result-card';

      // Build reply preview if exists
      let replyHtml = '';
      if (message.replyTo) {
        const repliedMsg = journal.messages.find(m => m.id === message.replyTo);
        if (repliedMsg) {
          replyHtml = `
            <div class="search-result-reply-preview">
              <div class="search-result-reply-author"><i class="fas fa-reply"></i> ${repliedMsg.personaName}</div>
              <div class="search-result-reply-text">${repliedMsg.content.substring(0, 60)}${repliedMsg.content.length > 60 ? '...' : ''}</div>
            </div>
          `;
        }
      }

      // Build badges
      const badges = [];
      if (message.edited) badges.push('<span class="search-badge edited"><i class="fas fa-pen"></i> Edited</span>');
      if (message.imageUrl) badges.push('<span class="search-badge has-image"><i class="fas fa-image"></i> Image</span>');
      if (message.replyTo) badges.push('<span class="search-badge has-reply"><i class="fas fa-reply"></i> Reply</span>');
      
      const badgesHtml = badges.length > 0 ? `<div class="search-result-badges">${badges.join('')}</div>` : '';

      // Highlight search query in content
      const highlightedContent = highlightText(message.content, query);

      // Build reactions display
      let reactionsHtml = '';
      if (message.reactions && message.reactions.length > 0) {
        const reactionGroups = {};
        message.reactions.forEach(r => {
          if (!reactionGroups[r.emoji]) reactionGroups[r.emoji] = 0;
          reactionGroups[r.emoji]++;
        });

        reactionsHtml = '<div class="search-result-reactions">';
        Object.entries(reactionGroups).forEach(([emoji, count]) => {
          reactionsHtml += `<span class="search-result-reaction">${emoji} ${count}</span>`;
        });
        reactionsHtml += '</div>';
      }

      // Build image display
      const imageHtml = message.imageUrl ? `<img src="${message.imageUrl}" alt="Message image" class="search-result-image">` : '';

      card.innerHTML = `
        <div class="search-result-header">
          <div class="search-result-meta">
            <div class="search-result-persona">
              <span class="search-result-avatar">${message.personaIcon || '👤'}</span>
              <span style="color: ${message.personaColor || 'var(--text-color)'};">${message.personaName}</span>
            </div>
            <div class="search-result-journal">in "${journal.title}"</div>
          </div>
          <div class="search-result-date">${new Date(message.timestamp).toLocaleDateString()} ${new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
        
        ${badgesHtml}
        
        <div class="search-result-content">
          ${replyHtml}
          <div class="search-result-text">${highlightedContent}</div>
          ${imageHtml}
        </div>
        
        ${reactionsHtml}
        
        <div class="search-result-footer">
          <button class="search-result-action" data-journal-id="${journal.id}" data-message-id="${message.id}">
            Go to message →
          </button>
        </div>
      `;

      // Add click handler to go to message
      const actionBtn = card.querySelector('.search-result-action');
      actionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToMessage(journal.id, message.id);
      });

      searchResults.appendChild(card);
    });
    
    // Scroll to top of results
    if (currentSearchPage > 1) {
      searchResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Highlight search query in text
  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Escape regex special characters
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Go to message in journal
  async function goToMessage(journalId, messageId) {
    await openJournal(journalId);
    setTimeout(() => {
      window.scrollToMessage(messageId);
    }, 200);
  }

  function renderJournals() {
    journalsList.innerHTML = '';
    currentJournals.forEach(journal => {
      const card = document.createElement('div');
      card.className = 'card journal-card';
      if (journal.isSpecial) card.classList.add('starred-card');
      card.innerHTML = `
        <div class="journal-header">
          <div>
            <h3>${journal.title} ${journal.isSpecial ? '<span class="star-badge"><i class="fas fa-star"></i></span>' : ''}</h3>
            <p>${new Date(journal.date).toLocaleDateString()} &middot; ${journal.messages.length} messages</p>
          </div>
          <div class="journal-actions">
            <button class="icon-btn journal-delete-btn" data-id="${journal.id}" title="Delete journal"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `;
      
      // Click on card (but not on buttons) to open journal
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.journal-delete-btn')) {
          openJournal(journal.id);
        }
      });
      
      journalsList.appendChild(card);
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.journal-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const journalId = btn.getAttribute('data-id');
        confirmDeleteJournal(journalId);
      });
    });
  }

  function renderPersonas() {
    personasList.innerHTML = '';
    currentPersonas.forEach(persona => {
      const card = document.createElement('div');
      card.className = 'card persona-card';
      
      // Format creation date
      const createdDate = persona.createdAt 
        ? new Date(persona.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })
        : 'Unknown';
      
      card.innerHTML = `
        <div class="persona-header">
          <h3 style="color: ${persona.color || '#000000'};">${persona.avatarIcon} ${persona.name}</h3>
          <div class="persona-actions">
            <button class="icon-btn persona-edit-btn" data-id="${persona.id}" title="Edit persona"><i class="fas fa-pen"></i></button>
            <button class="icon-btn persona-delete-btn" data-id="${persona.id}" title="Delete persona"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div class="persona-meta">
          <span class="persona-color-badge" style="background-color: ${persona.color || '#000000'};"></span>
          <span class="persona-created">Created ${createdDate}</span>
        </div>
      `;
      personasList.appendChild(card);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.persona-edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const personaId = e.currentTarget.getAttribute('data-id');
        openEditPersonaModal(personaId);
      });
    });

    document.querySelectorAll('.persona-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const personaId = e.currentTarget.getAttribute('data-id');
        confirmDeletePersona(personaId);
      });
    });
  }

  // --- Journal Entry View ---
  async function openJournal(id) {
    try {
      const res = await fetch(`/api/journals/${id}`);
      const journal = await res.json();
      activeJournalId = id;

      entryTitle.textContent = journal.title;
      entryDate.textContent = new Date(journal.date).toLocaleDateString();

      if (toggleStarBtn) {
        toggleStarBtn.innerHTML = journal.isSpecial ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
      }

      renderMessages(journal.messages);
      switchView('view-entry');

      // Reset input to @
      resetMessageInput();

      // Scroll to bottom
      setTimeout(() => {
        entryMessages.scrollTop = entryMessages.scrollHeight;
      }, 50);
    } catch (e) {
      console.error('Failed to open journal');
    }
  }

  function renderMessages(messages) {
    entryMessages.innerHTML = '';
    if (!messages || !Array.isArray(messages)) {
      console.warn('renderMessages called with invalid messages:', messages);
      return;
    }
    
    // Cache messages for optimistic UI updates
    currentJournalMessages = messages;
    
    messages.forEach(msg => {
      const messageDiv = createMessageElement(msg, messages);
      if (messageDiv) {
        entryMessages.appendChild(messageDiv);
      }
    });
  }

  // Helper function to create a single message element (for optimistic UI)
  function createMessageElement(msg, allMessages = []) {
    // Skip permanently deleted messages (after undo window)
    if (msg.permanentlyDeleted) return null;

    const div = document.createElement('div');
    div.className = 'message';
    div.setAttribute('data-message-id', msg.id);

    // Check if it's an AI message or AI query
    const isAI = msg.personaName.includes('AI Assistant') || msg.personaId === 'ai_assistant';
    const isAIQuery = msg.content.startsWith('@');
    const hasImages = msg.imageUrls && msg.imageUrls.length > 0;
    const hasImage = msg.imageUrl; // Legacy single image support
    const isDeleted = msg.deleted;

    if (isAI) {
      div.classList.add('ai-message');
    } else if (isAIQuery) {
      div.classList.add('user-ai-query');
    }
    
    if (hasImages || hasImage) {
      div.classList.add('has-image');
    }

    if (isDeleted) {
      div.classList.add('deleted');
    }

    div.style.alignSelf = 'center';
    
    // Build reply preview if message is a reply
    let replyHtml = '';
    if (msg.replyTo) {
      const repliedMsg = allMessages.find(m => m.id === msg.replyTo);
      if (repliedMsg) {
        replyHtml = `
          <div class="reply-preview" onclick="scrollToMessage('${msg.replyTo}')">
            <div class="reply-preview-author">${repliedMsg.personaName}</div>
            <div class="reply-preview-text">${repliedMsg.content.substring(0, 50)}${repliedMsg.content.length > 50 ? '...' : ''}</div>
          </div>
        `;
      }
    }
    
    // Build images HTML for multiple images or legacy single image
    let imagesHtml = '';
    if (hasImages) {
      imagesHtml = '<div class="message-images">';
      msg.imageUrls.forEach(url => {
        imagesHtml += `<img src="${url}" alt="Uploaded image" class="message-image" onclick="showImageFullscreen('${url}')">`;
      });
      imagesHtml += '</div>';
    } else if (hasImage) {
      // Legacy single image support
      imagesHtml = `<img src="${msg.imageUrl}" alt="Uploaded image" class="message-image" onclick="showImageFullscreen('${msg.imageUrl}')">`;
    }
    
    // Build content (show placeholder if deleted)
    const messageText = isDeleted ? '<em>This message was deleted</em>' : msg.content;
    const editedIndicator = msg.edited && !isDeleted ? '<span class="message-edited">(edited)</span>' : '';

    // Build reactions display
    let reactionsHtml = '';
    if (msg.reactions && msg.reactions.length > 0 && !isDeleted) {
      const reactionGroups = {};
      msg.reactions.forEach(r => {
        if (!reactionGroups[r.emoji]) {
          reactionGroups[r.emoji] = [];
        }
        reactionGroups[r.emoji].push(r.personaId);
      });

      const currentPersonaId = activeSenderId;
      reactionsHtml = '<div class="message-reactions">';
      Object.entries(reactionGroups).forEach(([emoji, personaIds]) => {
        const isMine = personaIds.includes(currentPersonaId);
        reactionsHtml += `
          <span class="message-reaction ${isMine ? 'my-reaction' : ''}" onclick="toggleReaction('${msg.id}', '${emoji}')">
            <span class="message-reaction-emoji">${emoji}</span>
            <span class="message-reaction-count">${personaIds.length}</span>
          </span>
        `;
      });
      reactionsHtml += '</div>';
    }

    const pColor = msg.personaColor
      || currentPersonas.find(p => p.id === msg.personaId)?.color
      || '#555555';
    // AI gets a FA icon; all other personas keep their emoji
    const avatarHtml = msg.personaFaIcon
      ? `<i class="fas ${msg.personaFaIcon}"></i>`
      : (msg.personaIcon || '<i class="fas fa-user"></i>');

    const timeString = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    div.innerHTML = `
      <div class="message-avatar" style="border-color: ${pColor}; color: ${pColor};">${avatarHtml}</div>
      <div class="message-body">
        <div class="message-header">
          <span class="message-name" style="color: ${pColor};">${msg.personaName}</span>
          <span class="message-time">${timeString}</span>
        </div>
        <div class="message-content" style="border-color: ${pColor};">
          ${replyHtml}
          ${messageText}${editedIndicator}
          ${imagesHtml}
        </div>
        ${reactionsHtml}
      </div>
    `;

    // Add context menu on right-click and long-press (mobile)
    if (!isDeleted) {
      div.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showMessageContextMenu(e, msg);
      });

      // Long-press for mobile
      let pressTimer;
      div.addEventListener('touchstart', (e) => {
        pressTimer = setTimeout(() => {
          showMessageContextMenu(e, msg);
        }, 500);
      });

      div.addEventListener('touchend', () => {
        clearTimeout(pressTimer);
      });

      div.addEventListener('touchmove', () => {
        clearTimeout(pressTimer);
      });
    }

    return div;
  }

  // Removed persona selector update functions

  // Get messages within character limit (counting backwards)
  function getMessagesWithinCharLimit(messages, charLimit = 10000) {
    const selectedMessages = [];
    let totalChars = 0;

    // Start from the end and work backwards
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const formattedContent = `${msg.personaName} said: ${msg.content}`;
      const messageLength = formattedContent.length;

      // Check if adding this message would exceed limit
      if (totalChars + messageLength > charLimit && selectedMessages.length > 0) {
        break; // Stop adding messages
      }

      selectedMessages.unshift(msg); // Add to beginning to maintain order
      totalChars += messageLength;
    }

    return selectedMessages;
  }

  // Handle AI Message
  async function handleAIMessage(userPrompt) {
    if (!activeJournalId || !userPrompt) return;

    try {
      // Show user's message first
      const personaId = activeSenderId;
      const persona = currentPersonas.find(p => p.id === personaId);
      if (!persona) return;

      // Add user message with @ prefix to journal
      const userMessage = {
        id: `msg_${Date.now()}`,
        personaId: persona.id,
        personaName: persona.name,
        personaColor: persona.color,
        personaIcon: persona.avatarIcon,
        content: `@${userPrompt}`,
        timestamp: new Date().toISOString()
      };

      // Fetch current journal
      const jRes = await fetch(`/api/journals/${activeJournalId}`);
      const journal = await jRes.json();

      // Get messages within 10,000 character limit
      const recentMessages = getMessagesWithinCharLimit(journal.messages, 10000);

      // Format messages for AI API with persona names
      const contextMessages = recentMessages.map(msg => ({
        role: 'user',
        content: `${msg.personaName} said: ${msg.content}`,
        timestamp: msg.timestamp
      }));

      // Add current user query
      contextMessages.push({
        role: 'user',
        content: userPrompt
      });

      // Show loading indicator
      messageInput.value = 'AI is thinking...';
      messageInput.disabled = true;

      // Call AI API
      const aiRes = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: contextMessages
        })
      });

      const aiData = await aiRes.json();

      resetMessageInput();
      messageInput.disabled = false;

      if (!aiData.success) {
        alert(`AI Error: ${aiData.error || 'Unknown error'}`);
        return;
      }

      // Add user message to journal
      journal.messages.push(userMessage);

      // Create AI response message
      const aiMessage = {
        id: `msg_${Date.now() + 1}`,
        personaId: 'ai_assistant',
        personaName: 'AI Assistant',
        personaColor: '#4a90e2',
        personaIcon: null,
        personaFaIcon: 'fa-robot',
        content: aiData.response,
        timestamp: new Date().toISOString()
      };

      journal.messages.push(aiMessage);

      // Save updated journal
      const updateRes = await fetch(`/api/journals/${activeJournalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(journal)
      });

      if (updateRes.ok) {
        openJournal(activeJournalId); // re-render
      }

    } catch (e) {
      console.error('Failed to handle AI message:', e);
      messageInput.value = '';
      messageInput.disabled = false;
      alert('Failed to get AI response. Please try again.');
    }
  }

  // Image Upload Handlers
  const MAX_IMAGES = 5;
  let uploadingCount = 0;

  // Toggle image options menu
  imageBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    imageOptionsMenu.classList.toggle('hidden');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!imageOptionsMenu.classList.contains('hidden') && 
        !imageOptionsMenu.contains(e.target) && 
        e.target !== imageBtn) {
      imageOptionsMenu.classList.add('hidden');
    }
  });

  // Handle image option selection
  imageOptionsMenu.addEventListener('click', async (e) => {
    const btn = e.target.closest('.image-option-btn');
    if (!btn) return;
    
    const action = btn.getAttribute('data-action');
    imageOptionsMenu.classList.add('hidden');
    
    if (uploadedImageUrls.length >= MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }
    
    if (action === 'camera') {
      await openCamera();
    } else if (action === 'upload') {
      imageInput.click();
    }
  });

  imageInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Check if adding these would exceed max
    const totalImages = uploadedImageUrls.length + files.length;
    if (totalImages > MAX_IMAGES) {
      alert(`You can only upload up to ${MAX_IMAGES} images. You have ${uploadedImageUrls.length} already.`);
      imageInput.value = '';
      return;
    }

    // Disable send button while uploading
    sendMessageBtn.disabled = true;
    sendMessageBtn.style.opacity = '0.5';
    sendMessageBtn.style.cursor = 'not-allowed';

    for (const file of files) {
      await uploadSingleImage(file);
    }

    // Re-enable send button after all uploads
    sendMessageBtn.disabled = false;
    sendMessageBtn.style.opacity = '1';
    sendMessageBtn.style.cursor = 'pointer';
    
    imageInput.value = '';
  });

  async function uploadSingleImage(file) {
    uploadingCount++;
    
    // Create preview container
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const imageDiv = document.createElement('div');
    imageDiv.className = 'image-attachment';
    imageDiv.setAttribute('data-image-id', imageId);
    
    const img = document.createElement('img');
    img.className = 'attachment-image';
    
    const overlay = document.createElement('div');
    overlay.className = 'attachment-overlay';
    
    const status = document.createElement('span');
    status.className = 'attachment-status';
    status.innerHTML = '<i class="fas fa-upload"></i> Uploading...';
    overlay.appendChild(status);
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-attachment-btn';
    removeBtn.title = 'Remove image';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    
    imageDiv.appendChild(img);
    imageDiv.appendChild(overlay);
    imageDiv.appendChild(removeBtn);
    
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    
    imagesContainer.appendChild(imageDiv);
    showAttachmentPreview('images');

    // Start async upload
    try {
      const formData = new FormData();
      formData.append('image', file);

      const uploadRes = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        status.innerHTML = '<i class="fas fa-times-circle"></i> Failed';
        overlay.classList.add('error');
        setTimeout(() => {
          imageDiv.remove();
          checkAttachmentPreviewVisibility();
        }, 2000);
        uploadingCount--;
        return;
      }

      // Store uploaded URL with image ID
      uploadedImageUrls.push({
        id: imageId,
        url: uploadData.url
      });
      
      status.innerHTML = '<i class="fas fa-check-circle"></i> Ready';
      overlay.classList.add('success');
      
      // Hide overlay after 1 second
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 1000);
      
      // Add remove handler
      removeBtn.addEventListener('click', () => {
        removeImage(imageId);
      });

    } catch (e) {
      console.error('Failed to upload image:', e);
      status.innerHTML = '<i class="fas fa-times-circle"></i> Failed';
      overlay.classList.add('error');
      setTimeout(() => {
        imageDiv.remove();
        checkAttachmentPreviewVisibility();
      }, 2000);
    }
    
    uploadingCount--;
  }

  function removeImage(imageId) {
    // Remove from uploaded URLs array
    uploadedImageUrls = uploadedImageUrls.filter(img => img.id !== imageId);
    
    // Remove from DOM
    const imageDiv = imagesContainer.querySelector(`[data-image-id="${imageId}"]`);
    if (imageDiv) {
      imageDiv.remove();
    }
    
    checkAttachmentPreviewVisibility();
  }

  function clearImageAttachments() {
    imagesContainer.innerHTML = '';
    uploadedImageUrls = [];
    imageInput.value = '';
    imagesContainer.classList.add('hidden');
    checkAttachmentPreviewVisibility();
  }

  // ===== CAMERA FUNCTIONALITY =====
  let cameraStream = null;
  let currentFacingMode = 'user'; // 'user' for front camera, 'environment' for back camera

  async function openCamera() {
    try {
      cameraModal.classList.remove('hidden');
      
      // Request camera access
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: currentFacingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      cameraVideo.srcObject = cameraStream;
      
      // Hide switch camera button on desktop (only one camera typically)
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      if (videoDevices.length <= 1) {
        switchCameraBtn.style.display = 'none';
      }
      
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Could not access camera. Please check permissions.');
      closeCamera();
    }
  }

  function closeCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    cameraVideo.srcObject = null;
    cameraModal.classList.add('hidden');
  }

  closeCameraBtn.addEventListener('click', closeCamera);

  // Close camera when clicking outside modal
  cameraModal.addEventListener('click', (e) => {
    if (e.target === cameraModal) {
      closeCamera();
    }
  });

  switchCameraBtn.addEventListener('click', async () => {
    // Toggle between front and back camera
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    closeCamera();
    await openCamera();
  });

  capturePhotoBtn.addEventListener('click', async () => {
    if (!cameraStream) return;
    
    // Set canvas size to match video
    const videoWidth = cameraVideo.videoWidth;
    const videoHeight = cameraVideo.videoHeight;
    cameraCanvas.width = videoWidth;
    cameraCanvas.height = videoHeight;
    
    // Draw current video frame to canvas
    const context = cameraCanvas.getContext('2d');
    context.drawImage(cameraVideo, 0, 0, videoWidth, videoHeight);
    
    // Convert canvas to blob
    cameraCanvas.toBlob(async (blob) => {
      if (!blob) {
        alert('Failed to capture photo');
        return;
      }
      
      // Create a file from the blob
      const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Close camera
      closeCamera();
      
      // Disable send button while uploading
      sendMessageBtn.disabled = true;
      sendMessageBtn.style.opacity = '0.5';
      sendMessageBtn.style.cursor = 'not-allowed';
      
      // Upload the captured photo
      await uploadSingleImage(file);
      
      // Re-enable send button
      sendMessageBtn.disabled = false;
      sendMessageBtn.style.opacity = '1';
      sendMessageBtn.style.cursor = 'pointer';
      
    }, 'image/jpeg', 0.9);
  });

  // Remove reply attachment
  removeReplyBtn.addEventListener('click', () => {
    clearReplyAttachment();
  });

  function clearReplyAttachment() {
    replyAttachment.classList.add('hidden');
    replyingToMessage = null;
    messageInput.style.borderLeft = '';
    messageInput.placeholder = "What's on your mind? (Type @ to ask AI)";
    checkAttachmentPreviewVisibility();
  }

  // Show attachment preview area
  function showAttachmentPreview(type) {
    attachmentPreview.classList.remove('hidden');
    
    if (type === 'images') {
      imagesContainer.classList.remove('hidden');
    } else if (type === 'reply') {
      replyAttachment.classList.remove('hidden');
    }
  }

  // Check if we should hide the preview area
  function checkAttachmentPreviewVisibility() {
    const hasImages = uploadedImageUrls.length > 0;
    const hasReply = !replyAttachment.classList.contains('hidden');
    
    if (!hasImages && !hasReply) {
      attachmentPreview.classList.add('hidden');
      imagesContainer.classList.add('hidden');
    }
  }

  // Fullscreen Image View
  window.showImageFullscreen = (imageUrl) => {
    const fullscreenDiv = document.createElement('div');
    fullscreenDiv.className = 'image-fullscreen-modal';
    fullscreenDiv.innerHTML = `<img src="${imageUrl}" alt="Full size image">`;
    fullscreenDiv.addEventListener('click', () => {
      document.body.removeChild(fullscreenDiv);
    });
    document.body.appendChild(fullscreenDiv);
  };

  sendMessageBtn.addEventListener('click', async () => {
    if (!activeJournalId) return;
    
    // Allow sending if there's text, image, or both
    const hasContent = messageInput.value.trim();
    const hasImages = uploadedImageUrls.length > 0;
    
    if (!hasContent && !hasImages) return;

    const content = messageInput.value.trim();
    const editingId = messageInput.getAttribute('data-editing-id');

    // Handle message editing
    if (editingId) {
      try {
        const res = await fetch(`/api/journals/${activeJournalId}/messages/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        });

        if (res.ok) {
          cancelEdit();
          openJournal(activeJournalId);
        } else {
          const error = await res.json();
          alert(error.error || 'Failed to edit message');
        }
      } catch (e) {
        console.error('Failed to edit message:', e);
        alert('Failed to edit message. Please try again.');
      }
      return;
    }

    let finalPersonaId = activeSenderId;
    let finalContent = content;

    // Check if message starts with @
    if (content.startsWith('@')) {
      let matched = false;
      
      // Check AI first
      if (content.toLowerCase().startsWith('@ai assistant ') || content.toLowerCase().startsWith('@ai ')) {
        const aiPrefix = content.toLowerCase().startsWith('@ai assistant ') ? '@ai assistant ' : '@ai ';
        const aiPrompt = content.substring(aiPrefix.length).trim();
        await handleAIMessage(aiPrompt);
        cancelReply();
        return;
      } else if (content.toLowerCase() === '@ai assistant' || content.toLowerCase() === '@ai') {
        await handleAIMessage('');
        cancelReply();
        return;
      }

      // Check personas
      for (const p of currentPersonas) {
        const prefix = `@${p.name.toLowerCase()} `;
        if (content.toLowerCase().startsWith(prefix)) {
          finalPersonaId = p.id;
          finalContent = content.substring(prefix.length).trim();
          matched = true;
          break;
        } else if (content.toLowerCase() === `@${p.name.toLowerCase()}`) {
          finalPersonaId = p.id;
          finalContent = '';
          matched = true;
          break;
        }
      }
      
      // If no persona matched but it starts with @, maybe it's just text, or maybe we just leave it.
    }

    const persona = currentPersonas.find(p => p.id === finalPersonaId);
    if (!persona) return;

    if (!finalContent && uploadedImageUrls.length === 0) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      personaId: persona.id,
      personaName: persona.name,
      personaColor: persona.color,
      personaIcon: persona.avatarIcon,
      content: finalContent || '', // Allow empty content if there are images
      timestamp: new Date().toISOString()
    };

    // Add image URLs if uploaded
    if (uploadedImageUrls.length > 0) {
      newMessage.imageUrls = uploadedImageUrls.map(img => img.url);
    }

    // Add reply reference if replying to a message
    if (replyingToMessage) {
      newMessage.replyTo = replyingToMessage.id;
    }

    // ===== OPTIMISTIC UI UPDATE =====
    // Clear input and attachments immediately for instant feedback
    const savedInput = messageInput.value;
    const savedImages = [...uploadedImageUrls];
    const savedReply = replyingToMessage;
    
    messageInput.value = '';
    clearReplyAttachment();
    clearImageAttachments();
    
    // Add message to UI immediately using cached messages (optimistic)
    const messageDiv = createMessageElement(newMessage, currentJournalMessages);
    if (messageDiv) {
      entryMessages.appendChild(messageDiv);
      // Scroll to bottom immediately
      entryMessages.scrollTop = entryMessages.scrollHeight;
    }

    try {
      // Now fetch and update backend in background
      const jRes = await fetch(`/api/journals/${activeJournalId}`);
      const journal = await jRes.json();
      
      journal.messages.push(newMessage);

      const updateRes = await fetch(`/api/journals/${activeJournalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(journal)
      });

      if (!updateRes.ok) {
        // If backend fails, remove the optimistic message and restore input
        if (messageDiv) messageDiv.remove();
        messageInput.value = savedInput;
        uploadedImageUrls = savedImages;
        replyingToMessage = savedReply;
        console.error('Failed to send message to server');
        alert('Failed to send message. Please try again.');
      } else {
        // Update cache with new message
        currentJournalMessages.push(newMessage);
      }
    } catch (e) {
      // If error occurs, remove optimistic message and restore input
      if (messageDiv) messageDiv.remove();
      messageInput.value = savedInput;
      uploadedImageUrls = savedImages;
      replyingToMessage = savedReply;
      console.error('Failed to send message:', e);
      alert('Failed to send message. Please try again.');
    }
  });

  // --- Mentions Dropdown Logic ---
  let mentionActive = false;
  let mentionQuery = '';
  let selectedMentionIndex = 0;
  let mentionOptions = [];

  function resetMessageInput() {
    messageInput.value = '@';
    mentionActive = false;
    mentionQuery = '';
    updateMentionsDropdown();
  }

  let inputHasFocus = false;

  // Show dropdown when focusing the input if there's an @
  messageInput.addEventListener('focus', () => {
    inputHasFocus = true;
    // Trigger input processing after setting focus flag
    setTimeout(() => {
      messageInput.dispatchEvent(new Event('input'));
    }, 0);
  });

  // Hide dropdown when leaving the input, with a delay to allow clicks
  messageInput.addEventListener('blur', () => {
    setTimeout(() => {
      inputHasFocus = false;
      mentionActive = false;
      updateMentionsDropdown();
    }, 200);
  });

  function updateMentionsDropdown() {
    // Only show dropdown if input has focus AND mention is active
    if (!mentionActive || !inputHasFocus) {
      mentionsDropdown.classList.add('hidden');
      return;
    }

    // Filter options based on query
    const query = mentionQuery.toLowerCase();
    mentionOptions = [
      { id: 'ai_assistant', name: 'AI Assistant', icon: 'fa-robot', color: '#4facfe' },
      ...currentPersonas
    ].filter(p => p.name.toLowerCase().includes(query));

    if (mentionOptions.length === 0) {
      mentionsDropdown.classList.add('hidden');
      return;
    }

    // Ensure selected index is within bounds
    if (selectedMentionIndex >= mentionOptions.length) {
      selectedMentionIndex = 0;
    }

    mentionsDropdown.innerHTML = '';
    mentionOptions.forEach((p, index) => {
      const item = document.createElement('div');
      item.className = `mention-item ${index === selectedMentionIndex ? 'active' : ''}`;
      
      const avatarHtml = p.id === 'ai_assistant' 
        ? `<i class="fas ${p.icon}"></i>` 
        : (p.avatarIcon || '<i class="fas fa-user"></i>');
        
      item.innerHTML = `
        <div class="mention-icon" style="color: ${p.color};">${avatarHtml}</div>
        <div class="mention-name" style="color: ${p.color};">${p.name}</div>
      `;
      
      item.addEventListener('click', () => {
        insertMention(p);
      });
      
      mentionsDropdown.appendChild(item);
    });

    mentionsDropdown.classList.remove('hidden');
  }

  function insertMention(persona) {
    const val = messageInput.value;
    const cursorPos = messageInput.selectionStart;
    const textBeforeCursor = val.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atIndex !== -1) {
      messageInput.value = val.substring(0, atIndex) + `@${persona.name} ` + val.substring(cursorPos);
    } else {
      messageInput.value = val + `@${persona.name} `;
    }
    mentionActive = false;
    updateMentionsDropdown();
    messageInput.focus();
  }

  messageInput.addEventListener('input', (e) => {
    const val = messageInput.value;
    const cursorPos = messageInput.selectionStart;
    
    // Check if we are currently typing a mention
    const textBeforeCursor = val.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atIndex !== -1) {
      // Check if there is a space after the @
      const textAfterAt = textBeforeCursor.substring(atIndex + 1);
      if (!textAfterAt.includes(' ')) {
        mentionActive = true;
        mentionQuery = textAfterAt;
        updateMentionsDropdown();
        return;
      }
    }
    
    mentionActive = false;
    updateMentionsDropdown();
  });

  messageInput.addEventListener('keydown', (e) => {
    if (!mentionActive || mentionsDropdown.classList.contains('hidden')) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedMentionIndex = (selectedMentionIndex + 1) % mentionOptions.length;
      updateMentionsDropdown();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedMentionIndex = (selectedMentionIndex - 1 + mentionOptions.length) % mentionOptions.length;
      updateMentionsDropdown();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      insertMention(mentionOptions[selectedMentionIndex]);
    } else if (e.key === 'Escape') {
      mentionActive = false;
      updateMentionsDropdown();
    }
  });

  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !mentionActive) {
      sendMessageBtn.click();
    }
  });

  // --- Modals ---
  function showModal(html) {
    modalContent.innerHTML = html;
    modalOverlay.classList.remove('hidden');
  }

  function hideModal() {
    modalOverlay.classList.add('hidden');
    modalContent.innerHTML = '';
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) hideModal();
  });

  newJournalBtn.addEventListener('click', () => {
    showModal(`
      <h2>New Journal</h2>
      <div class="form-group">
        <label>Title</label>
        <input type="text" id="new-j-title" placeholder="e.g. A busy Tuesday">
      </div>
      <div class="modal-actions">
        <button id="cancel-modal" class="icon-btn">Cancel</button>
        <button id="save-new-j" class="primary-btn">Create</button>
      </div>
    `);

    document.getElementById('cancel-modal').addEventListener('click', hideModal);
    document.getElementById('save-new-j').addEventListener('click', async () => {
      const title = document.getElementById('new-j-title').value.trim();
      if (!title) return;
      try {
        await fetch('/api/journals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, date: new Date().toISOString().split('T')[0] })
        });
        hideModal();
        loadDashboard();
      } catch (e) { }
    });
  });

  newPersonaBtn.addEventListener('click', () => {
    showModal(`
      <h2>New Persona</h2>
      <div class="form-group">
        <label>Name</label>
        <input type="text" id="new-p-name" placeholder="e.g. Creative Me">
      </div>
      <div class="form-group">
        <label>Icon / Emoji</label>
        <input type="text" id="new-p-icon" value="👤" maxlength="2" style="width: 3rem; text-align: center; font-size: 1.2rem;">
      </div>
      <div class="form-group">
        <label>Color</label>
        <input type="color" id="new-p-color" value="#000000" style="padding: 0.25rem; height: 40px; cursor: pointer;">
      </div>
      <div class="modal-actions">
        <button id="cancel-modal" class="icon-btn">Cancel</button>
        <button id="save-new-p" class="primary-btn">Save</button>
      </div>
    `);

    document.getElementById('cancel-modal').addEventListener('click', hideModal);
    document.getElementById('save-new-p').addEventListener('click', async () => {
      const name = document.getElementById('new-p-name').value.trim();
      const icon = document.getElementById('new-p-icon').value.trim() || '👤';
      const color = document.getElementById('new-p-color').value;
      if (!name) return;
      try {
        const res = await fetch('/api/personas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, color: color, avatarIcon: icon })
        });
        const newPersona = await res.json();
        
        // Add to currentPersonas and save to localStorage
        currentPersonas.push(newPersona);
        savePersonasToLocalStorage(currentPersonas);
        
        hideModal();
        loadPersonas();
      } catch (e) {
        console.error('Failed to create persona:', e);
      }
    });
  });

  // Edit Persona Handler
  function openEditPersonaModal(personaId) {
    const persona = currentPersonas.find(p => p.id === personaId);
    if (!persona) return;

    showModal(`
      <h2>Edit Persona</h2>
      <div class="form-group">
        <label>Name</label>
        <input type="text" id="edit-p-name" value="${persona.name}">
      </div>
      <div class="form-group">
        <label>Icon / Emoji</label>
        <input type="text" id="edit-p-icon" value="${persona.avatarIcon || '👤'}" maxlength="2" style="width: 3rem; text-align: center; font-size: 1.2rem;">
      </div>
      <div class="form-group">
        <label>Color</label>
        <input type="color" id="edit-p-color" value="${persona.color || '#000000'}" style="padding: 0.25rem; height: 40px; cursor: pointer;">
      </div>
      <div class="modal-actions">
        <button id="cancel-modal" class="icon-btn">Cancel</button>
        <button id="save-edit-p" class="primary-btn">Save Changes</button>
      </div>
    `);

    document.getElementById('cancel-modal').addEventListener('click', hideModal);
    document.getElementById('save-edit-p').addEventListener('click', async () => {
      const name = document.getElementById('edit-p-name').value.trim();
      const icon = document.getElementById('edit-p-icon').value.trim() || '👤';
      const color = document.getElementById('edit-p-color').value;
      if (!name) return;

      try {
        const res = await fetch(`/api/personas/${personaId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, avatarIcon: icon, color })
        });

        if (res.ok) {
          hideModal();
          
          // Update currentPersonas and save to localStorage
          const updatedPersona = currentPersonas.find(p => p.id === personaId);
          if (updatedPersona) {
            updatedPersona.name = name;
            updatedPersona.avatarIcon = icon;
            updatedPersona.color = color;
            savePersonasToLocalStorage(currentPersonas);
          }
          
          loadPersonas();
        } else {
          const error = await res.json();
          alert(`Failed to update persona: ${error.error || 'Unknown error'}`);
        }
      } catch (e) {
        console.error('Failed to update persona:', e);
        alert('Failed to update persona. Please try again.');
      }
    });
  }

  // Delete Persona Handler with Confirmation
  function confirmDeletePersona(personaId) {
    const persona = currentPersonas.find(p => p.id === personaId);
    if (!persona) return;

    showModal(`
      <h2>Delete Persona</h2>
      <p style="margin-bottom: 1.5rem;">Are you sure you want to delete <strong>"${persona.name}"</strong>?</p>
      <p style="color: var(--gray-text); font-size: 0.9rem; margin-bottom: 1.5rem;">This action cannot be undone. Messages from this persona will remain in your journals.</p>
      <div class="modal-actions">
        <button id="cancel-delete" class="icon-btn">Cancel</button>
        <button id="confirm-delete" class="primary-btn" style="background-color: #cc0000;">Delete Persona</button>
      </div>
    `);

    document.getElementById('cancel-delete').addEventListener('click', hideModal);
    document.getElementById('confirm-delete').addEventListener('click', async () => {
      try {
        const res = await fetch(`/api/personas/${personaId}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          hideModal();
          loadPersonas();
          // Refresh dashboard in case persona was selected
          if (viewDashboard.classList.contains('active')) {
            loadDashboard();
          }
        } else {
          const error = await res.json();
          alert(`Failed to delete persona: ${error.error || 'Unknown error'}`);
        }
      } catch (e) {
        console.error('Failed to delete persona:', e);
        alert('Failed to delete persona. Please try again.');
      }
    });
  }

  // Delete Journal Handler with Confirmation
  function confirmDeleteJournal(journalId) {
    const journal = currentJournals.find(j => j.id === journalId);
    if (!journal) return;

    showModal(`
      <h2>Delete Journal</h2>
      <p style="margin-bottom: 1.5rem;">Are you sure you want to delete <strong>"${journal.title}"</strong>?</p>
      <p style="color: var(--gray-text); font-size: 0.9rem; margin-bottom: 1.5rem;">This action cannot be undone. All messages in this journal will be permanently deleted.</p>
      <div class="modal-actions">
        <button id="cancel-delete-journal" class="icon-btn">Cancel</button>
        <button id="confirm-delete-journal" class="primary-btn" style="background-color: #cc0000;">Delete Journal</button>
      </div>
    `);

    document.getElementById('cancel-delete-journal').addEventListener('click', hideModal);
    document.getElementById('confirm-delete-journal').addEventListener('click', async () => {
      try {
        const res = await fetch(`/api/journals/${journalId}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          hideModal();
          
          // If we're currently viewing this journal, go back to dashboard
          if (activeJournalId === journalId) {
            activeJournalId = null;
            switchView('dashboard');
          }
          
          // Reload journals and dashboard
          await loadJournals();
          if (viewDashboard.classList.contains('active')) {
            loadDashboard();
          }
        } else {
          const error = await res.json();
          alert(`Failed to delete journal: ${error.error || 'Unknown error'}`);
        }
      } catch (e) {
        console.error('Failed to delete journal:', e);
        alert('Failed to delete journal. Please try again.');
      }
    });
  }

  // Message Context Menu Handler
  function showMessageContextMenu(e, message) {
    e.preventDefault();
    contextMenuTarget = message;

    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);

    messageContextMenu.style.left = `${x}px`;
    messageContextMenu.style.top = `${y}px`;
    messageContextMenu.classList.remove('hidden');

    // Check if message is editable (within 15 minutes)
    const messageAge = Date.now() - new Date(message.timestamp).getTime();
    const fifteenMinutes = 15 * 60 * 1000;
    const editBtn = messageContextMenu.querySelector('[data-action="edit"]');
    
    if (messageAge > fifteenMinutes || message.deleted) {
      editBtn.style.display = 'none';
    } else {
      editBtn.style.display = 'flex';
    }
  }

  // Hide context menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!messageContextMenu.contains(e.target) && !reactionPicker.contains(e.target)) {
      messageContextMenu.classList.add('hidden');
      reactionPicker.classList.add('hidden');
    }
  });

  // Context Menu Action Handlers
  messageContextMenu.querySelectorAll('.context-menu-item').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const action = e.currentTarget.getAttribute('data-action');
      messageContextMenu.classList.add('hidden');

      if (!contextMenuTarget) return;

      switch (action) {
        case 'react':
          showReactionPicker(e);
          break;
        case 'reply':
          startReply(contextMenuTarget);
          break;
        case 'edit':
          startEdit(contextMenuTarget);
          break;
        case 'delete':
          deleteMessage(contextMenuTarget);
          break;
      }
    });
  });

  // Show Reaction Picker
  function showReactionPicker(e) {
    reactionPicker.style.left = messageContextMenu.style.left;
    reactionPicker.style.top = `${parseFloat(messageContextMenu.style.top) - 60}px`;
    reactionPicker.classList.remove('hidden');
  }

  // Initialize Reaction Picker with stored emojis
  const MAX_CUSTOM_EMOJIS = 6;
  
  function loadReactionEmojis() {
    const stored = localStorage.getItem('reactionEmojis');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return ['👍', '❤️', '😂', '😮', '😢', '🙏'];
      }
    }
    return ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  }

  function saveReactionEmojis(emojis) {
    localStorage.setItem('reactionEmojis', JSON.stringify(emojis));
  }

  function renderReactionPicker() {
    const emojis = loadReactionEmojis();
    const reactionButtons = reactionPicker.querySelectorAll('.reaction-btn');
    
    // Update existing buttons with current emoji list
    emojis.forEach((emoji, index) => {
      if (reactionButtons[index]) {
        reactionButtons[index].setAttribute('data-emoji', emoji);
        reactionButtons[index].textContent = emoji;
      }
    });
  }

  // Move emoji to front (LIFO) when used
  function moveEmojiToFront(emoji) {
    let emojis = loadReactionEmojis();
    
    // Remove emoji if it exists
    emojis = emojis.filter(e => e !== emoji);
    
    // Add to front
    emojis.unshift(emoji);
    
    // Keep only MAX_CUSTOM_EMOJIS
    emojis = emojis.slice(0, MAX_CUSTOM_EMOJIS);
    
    saveReactionEmojis(emojis);
    renderReactionPicker();
  }

  // Initialize on load
  renderReactionPicker();

  // Add Emoji from Clipboard Button Handler
  document.getElementById('add-emoji-btn').addEventListener('click', async (e) => {
    e.stopPropagation();
    
    try {
      // Try to read from clipboard
      const text = await navigator.clipboard.readText();
      
      // Extract first emoji from clipboard (simple emoji regex)
      const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
      const match = text.match(emojiRegex);
      
      if (match && match[0]) {
        const emoji = match[0];
        moveEmojiToFront(emoji);
        
        // Show feedback
        const btn = e.currentTarget;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.color = '#22c55e';
        
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.color = '';
        }, 1000);
      } else {
        alert('No emoji found in clipboard. Copy an emoji first, then click + to add it.');
      }
    } catch (err) {
      // Fallback: prompt user to paste manually
      const emoji = prompt('Paste an emoji:');
      if (emoji && emoji.trim()) {
        moveEmojiToFront(emoji.trim());
      }
    }
  });

  // Reaction Picker Handlers
  reactionPicker.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const emoji = e.currentTarget.getAttribute('data-emoji');
      reactionPicker.classList.add('hidden');
      
      if (contextMenuTarget) {
        // Move used emoji to front (LIFO)
        moveEmojiToFront(emoji);
        await toggleReaction(contextMenuTarget.id, emoji);
      }
    });
  });

  // Toggle Reaction (add or remove)
  window.toggleReaction = async function(messageId, emoji) {
    if (!activeJournalId) return;

    const personaId = activeSenderId;
    
    try {
      const res = await fetch(`/api/journals/${activeJournalId}/messages/${messageId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personaId, emoji })
      });
      if (res.ok) {
        const updatedJournal = await res.json();
        
        // Update local state
        const jIdx = currentJournals.findIndex(j => j.id === activeJournalId);
        if (jIdx !== -1) {
          currentJournals[jIdx] = updatedJournal;
        }

        // Re-render but preserve scroll position
        const scrollPos = entryMessages.scrollTop;
        renderMessages(updatedJournal.messages);
        entryMessages.scrollTop = scrollPos;
      }
    } catch (e) {
      console.error('Failed to toggle reaction:', e);
    }
  };

  // Scroll to Message (for reply previews)
  window.scrollToMessage = function(messageId) {
    const messageEl = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageEl) {
      messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageEl.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
      setTimeout(() => {
        messageEl.style.backgroundColor = '';
      }, 1000);
    }
  };

  // Start Reply
  function startReply(message) {
    replyingToMessage = message;
    
    // Update reply attachment preview
    replyAuthor.textContent = message.personaName;
    replyText.textContent = message.content.substring(0, 100) + (message.content.length > 100 ? '...' : '');
    showAttachmentPreview('reply');
    
    messageInput.focus();
  }

  // Start Edit
  function startEdit(message) {
    messageInput.value = message.content;
    messageInput.focus();
    messageInput.setAttribute('data-editing-id', message.id);
    messageInput.placeholder = 'Edit message (press Enter to save, Esc to cancel)';
    messageInput.style.borderLeft = '3px solid #f59e0b';
  }

  // Cancel edit on Escape
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cancelEdit();
      cancelReply();
    }
  });

  function cancelEdit() {
    messageInput.removeAttribute('data-editing-id');
    messageInput.value = '';
    messageInput.placeholder = "What's on your mind? (Type @ to ask AI)";
    messageInput.style.borderLeft = '';
  }

  function cancelReply() {
    clearReplyAttachment();
  }

  // Delete Message with Undo
  async function deleteMessage(message) {
    if (!activeJournalId) return;

    try {
      const res = await fetch(`/api/journals/${activeJournalId}/messages/${message.id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        openJournal(activeJournalId); // Refresh

        // Show undo toast
        showUndoToast(message.id, 'Message deleted', 5000);
      }
    } catch (e) {
      console.error('Failed to delete message:', e);
      alert('Failed to delete message. Please try again.');
    }
  }

  // Show Undo Toast
  function showUndoToast(messageId, text, duration) {
    const toast = document.createElement('div');
    toast.className = 'undo-toast';
    toast.innerHTML = `
      <span>${text}</span>
      <button class="undo-btn">Undo</button>
    `;
    document.body.appendChild(toast);

    const undoBtn = toast.querySelector('.undo-btn');
    undoBtn.addEventListener('click', async () => {
      await undoDelete(messageId);
      document.body.removeChild(toast);
    });

    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, duration);
  }

  // Undo Delete
  async function undoDelete(messageId) {
    if (!activeJournalId) return;

    try {
      const res = await fetch(`/api/journals/${activeJournalId}/messages/${messageId}/undo-delete`, {
        method: 'POST'
      });

      if (res.ok) {
        openJournal(activeJournalId); // Refresh
      }
    } catch (e) {
      console.error('Failed to undo delete:', e);
    }
  }

// --- Analytics Logic ---
  const statStreak = document.getElementById('stat-streak');
  const statTopPersona = document.getElementById('stat-top-persona');
  const statActiveDay = document.getElementById('stat-active-day');
  const statTotalMsgs = document.getElementById('stat-total-msgs');
  const statTotalImgs = document.getElementById('stat-total-imgs');
  const statTotalStars = document.getElementById('stat-total-stars');
  const statTotalReacts = document.getElementById('stat-total-reacts');
  const activityChart = document.getElementById('activity-chart');
  const generateInsightBtn = document.getElementById('generate-insight-btn');
  const insightsList = document.getElementById('insights-list');

  async function loadAnalytics() {
    try {
      const [journalsRes, personasRes, insightsRes] = await Promise.all([
        fetch('/api/journals'),
        fetch('/api/personas'),
        fetch('/api/insights')
      ]);
      const journals = await journalsRes.json();
      const personas = await personasRes.json();
      const insights = await insightsRes.json();
      
      calculateStats(journals, personas);
      renderInsights(insights);
    } catch (e) {
      console.error('Failed to load analytics data', e);
    }
  }

  function calculateStats(journals, personas) {
    if (!journals.length) {
      statStreak.textContent = '0 days';
      statTopPersona.textContent = '-';
      statActiveDay.textContent = '-';
      statTotalMsgs.textContent = '0';
      statTotalImgs.textContent = '0';
      statTotalStars.textContent = '0';
      statTotalReacts.textContent = '0';
      activityChart.innerHTML = '';
      return;
    }

    // Sort journals by date (oldest to newest)
    const sortedJournals = [...journals].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate Streak
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    let lastDate = null;
    let streakCount = 0;
    for (const j of sortedJournals) {
      if (lastDate) {
        const diff = (new Date(j.date) - new Date(lastDate)) / 86400000;
        if (diff === 1) streakCount++;
        else if (diff > 1) streakCount = 1; // reset
      } else {
        streakCount = 1;
      }
      lastDate = j.date;
    }
    
    if (lastDate === today || lastDate === yesterday) {
      currentStreak = streakCount;
    } else {
      currentStreak = 0;
    }
    statStreak.textContent = `${currentStreak} days`;

    // Persona & Day activity, plus totals
    const personaCounts = {};
    const dayCounts = { 'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0 };
    const dateCounts = {};
    
    let totalMsgs = 0;
    let totalImgs = 0;
    let totalStars = 0;
    let totalReacts = 0;

    journals.forEach(j => {
      const d = new Date(j.date);
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
      
      if (j.isSpecial) totalStars++;
      
      let msgCount = 0;
      if (j.messages && j.messages.length > 0) {
        msgCount = j.messages.length;
        totalMsgs += msgCount;
        
        j.messages.forEach(m => {
          if (m.imageUrl) totalImgs++;
          if (m.reactions && m.reactions.length > 0) totalReacts += m.reactions.length;
          
          if (m.personaId !== 'ai_assistant') {
            personaCounts[m.personaId] = (personaCounts[m.personaId] || 0) + 1;
          }
        });
      }
      dayCounts[dayName] += msgCount;
      dateCounts[j.date] = (dateCounts[j.date] || 0) + msgCount;
    });
    
    statTotalMsgs.textContent = totalMsgs;
    statTotalImgs.textContent = totalImgs;
    statTotalStars.textContent = totalStars;
    statTotalReacts.textContent = totalReacts;

    // Top Persona
    let topId = null;
    let maxMsgs = 0;
    for (const [id, count] of Object.entries(personaCounts)) {
      if (count > maxMsgs) {
        topId = id;
        maxMsgs = count;
      }
    }
    if (topId) {
      const p = personas.find(x => x.id === topId);
      statTopPersona.textContent = p ? p.name : 'Unknown';
    } else {
      statTopPersona.textContent = '-';
    }

    // Most Active Day
    let topDay = null;
    let maxDayMsgs = 0;
    for (const [day, count] of Object.entries(dayCounts)) {
      if (count > maxDayMsgs) {
        topDay = day;
        maxDayMsgs = count;
      }
    }
    statActiveDay.textContent = topDay || '-';

    // Activity Chart (last 7 days)
    activityChart.innerHTML = '';
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }
    
    let maxCount = Math.max(...last7Days.map(d => dateCounts[d] || 0), 1);
    
    // ROYGBIV thresholds and colors (each band = 5 messages)
    const roygbiv = [
      { limit: 5,  color: '#FF4444' }, // Red
      { limit: 10, color: '#FF8C00' }, // Orange
      { limit: 15, color: '#FFD700' }, // Yellow
      { limit: 20, color: '#44CC44' }, // Green
      { limit: 25, color: '#4488FF' }, // Blue
      { limit: 30, color: '#4B0082' }, // Indigo
      { limit: 35, color: '#9400D3' }, // Violet
    ];
    const MAX_SCALE = 35; // treat 35+ as full bar

    last7Days.forEach(date => {
      const count = dateCounts[date] || 0;
      // Scale to actual max so the tallest bar always reaches near the top
      const barHeightPercent = count === 0 ? 0 : Math.max((count / maxCount) * 100, 4);
      const shortDay = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

      const barContainer = document.createElement('div');
      barContainer.className = 'chart-bar-container';

      const bar = document.createElement('div');
      bar.className = 'chart-bar';
      bar.style.height = '0%';
      bar.setAttribute('data-val', count);

      // Build stacked segments using flex-grow so they fill the bar proportionally
      let prev = 0;
      const effectiveCount = Math.max(count, 1);
      roygbiv.forEach(({ limit, color }) => {
        if (count <= prev) return; // band not reached
        const bandEnd = Math.min(count, limit);
        const bandCount = bandEnd - prev;

        const seg = document.createElement('div');
        seg.className = 'chart-segment';
        seg.style.background = color;
        seg.style.flexGrow = bandCount; // proportional slice of the bar
        seg.style.flexShrink = 0;
        seg.style.flexBasis = '0';
        bar.appendChild(seg);
        prev = limit;
      });

      // Handle count > 35: extend the last (violet) segment
      if (count > 35) {
        const lastSeg = bar.querySelector('.chart-segment:last-child');
        if (lastSeg) {
          lastSeg.style.flexGrow = parseFloat(lastSeg.style.flexGrow) + (count - 35);
        }
      }

      // Animate overall bar height
      setTimeout(() => {
        bar.style.height = `${Math.max(barHeightPercent, 4)}%`;
      }, 100);

      const label = document.createElement('div');
      label.className = 'chart-label';
      label.textContent = shortDay;

      barContainer.appendChild(bar);
      barContainer.appendChild(label);
      activityChart.appendChild(barContainer);
    });
  }

  function renderInsights(insights) {
    insightsList.innerHTML = '';
    if (insights.length === 0) {
      insightsList.innerHTML = '<p style="color: var(--gray-text); text-align: center; padding: 2rem;">No AI insights yet. Generate one to reflect on your journey!</p>';
      return;
    }
    
    insights.forEach(insight => {
      const div = document.createElement('div');
      div.className = 'insight-item';
      
      const dateDiv = document.createElement('div');
      dateDiv.className = 'insight-date';
      dateDiv.textContent = new Date(insight.createdAt).toLocaleString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      
      const textDiv = document.createElement('div');
      textDiv.className = 'insight-text';
      textDiv.textContent = insight.content;
      
      div.appendChild(dateDiv);
      div.appendChild(textDiv);
      insightsList.appendChild(div);
    });
  }

  if (generateInsightBtn) {
    generateInsightBtn.addEventListener('click', async () => {
      const originalHtml = generateInsightBtn.innerHTML;
      generateInsightBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
      generateInsightBtn.disabled = true;
      
      try {
        const res = await fetch('/api/insights', { method: 'POST' });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to generate insight');
        }
        
        // Reload analytics
        loadAnalytics();
      } catch (e) {
        console.error(e);
        alert(e.message);
      } finally {
        generateInsightBtn.innerHTML = originalHtml;
        generateInsightBtn.disabled = false;
      }
    });
  }

});
