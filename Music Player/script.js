/* ============================================================
   AURA MUSIC PLAYER — script.js
   Features: Playlist, Search, Categories, localStorage,
             Progress seek, Volume, Shuffle, Repeat,
             Animated visualizer rings, Mini player
   ============================================================ */

'use strict';

/* ══════════════════════════════════════
   1. SONG DATA
   Using free/embeddable audio from public CDNs and
   placeholder album art from picsum.photos (deterministic)
══════════════════════════════════════ */
const SONGS = [
  {
    id: 1,
    title: 'Summer Breeze',
    artist: 'Ocean Waves',
    category: 'Chill',
    color: '#e8a838',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  },
  {
    id: 2,
    title: 'Midnight Drive',
    artist: 'Neon Pulse',
    category: 'Electronic',
    color: '#6c63ff',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80',
  },
  {
    id: 3,
    title: 'Golden Hour',
    artist: 'Amber Light',
    category: 'Pop',
    color: '#f06240',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80',
  },
  {
    id: 4,
    title: 'Iron Tempo',
    artist: 'The Grind',
    category: 'Workout',
    color: '#e84118',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
  },
  {
    id: 5,
    title: 'Forest Rain',
    artist: 'Ambient Skies',
    category: 'Chill',
    color: '#2ecc71',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80',
  },
  {
    id: 6,
    title: 'City Lights',
    artist: 'Urban Echo',
    category: 'Electronic',
    color: '#00cec9',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&q=80',
  },
  {
    id: 7,
    title: 'Dance Floor',
    artist: 'Groove Theory',
    category: 'Pop',
    color: '#fd79a8',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
  },
  {
    id: 8,
    title: 'Peak Power',
    artist: 'Max Force',
    category: 'Workout',
    color: '#e17055',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80',
  },
  {
    id: 9,
    title: 'Stellar Dreams',
    artist: 'Cosmo Wave',
    category: 'Chill',
    color: '#a29bfe',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80',
  },
  {
    id: 10,
    title: 'Jazz Afternoon',
    artist: 'Blue Note Trio',
    category: 'Jazz',
    color: '#b2a07a',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
  },
  {
    id: 11,
    title: 'Neon Jungle',
    artist: 'Cyber Beats',
    category: 'Electronic',
    color: '#00b894',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    id: 12,
    title: 'Serenade',
    artist: 'Luna Belle',
    category: 'Pop',
    color: '#e84393',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80',
  },
  {
    id: 13,
    title: 'Velocity',
    artist: 'Rush Hour',
    category: 'Workout',
    color: '#d63031',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    image: 'https://images.unsplash.com/photo-1539794830467-1f1755804d13?w=400&q=80',
  },
  {
    id: 14,
    title: 'Smooth Sax',
    artist: 'Night Club',
    category: 'Jazz',
    color: '#fdcb6e',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&q=80',
  },
  {
    id: 15,
    title: 'Deep Space',
    artist: 'Starfield',
    category: 'Chill',
    color: '#74b9ff',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80',
  },
  {
    id: 16,
    title: 'Euphoria',
    artist: 'Nova Trance',
    category: 'Electronic',
    color: '#e056fd',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80',
  },
];

/* ── Category Colors ── */
const CAT_COLORS = {
  'All':        '#f0a500',
  'Chill':      '#74b9ff',
  'Electronic': '#6c63ff',
  'Pop':        '#fd79a8',
  'Workout':    '#e84118',
  'Jazz':       '#b2a07a',
};

/* ══════════════════════════════════════
   2. STATE
══════════════════════════════════════ */
let state = {
  currentIndex: 0,         // index in filteredSongs
  isPlaying:    false,
  isShuffle:    false,
  isRepeat:     false,
  isLiked:      false,
  volume:       80,
  activeCategory: 'All',
  searchQuery: '',
  filteredSongs: [...SONGS],
  likedIds:     new Set(),
};

/* ══════════════════════════════════════
   3. DOM REFS
══════════════════════════════════════ */
const $ = id => document.getElementById(id);

const DOM = {
  loader:           $('loader'),
  app:              $('app'),
  sidebar:          $('sidebar'),
  sidebarToggle:    $('sidebarToggle'),
  menuBtn:          $('menuBtn'),
  searchInput:      $('searchInput'),
  searchClear:      $('searchClear'),
  songsGrid:        $('songsGrid'),
  sectionTitle:     $('sectionTitle'),
  songCount:        $('songCount'),
  filterRow:        $('filterRow'),
  categoryPills:    $('categoryPills'),
  sidebarPlaylist:  $('sidebarPlaylist'),
  heroTitle:        $('heroTitle'),
  heroArtist:       $('heroArtist'),
  heroBg:           $('heroBg'),
  heroPlayBtn:      $('heroPlayBtn'),
  heroAddBtn:       $('heroAddBtn'),
  // Now Playing
  nowPlaying:       $('nowPlaying'),
  npClose:          $('npClose'),
  npImg:            $('npImg'),
  npArtwork:        $('npArtwork'),
  npGlow:           $('npGlow'),
  npTitle:          $('npTitle'),
  npArtist:         $('npArtist'),
  npLike:           $('npLike'),
  npProgressBar:    $('npProgressBar'),
  npProgressFill:   $('npProgressFill'),
  npCurrentTime:    $('npCurrentTime'),
  npDuration:       $('npDuration'),
  playPauseBtn:     $('playPauseBtn'),
  prevBtn:          $('prevBtn'),
  nextBtn:          $('nextBtn'),
  shuffleBtn:       $('shuffleBtn'),
  repeatBtn:        $('repeatBtn'),
  volumeSlider:     $('volumeSlider'),
  volumeFill:       $('volumeFill'),
  volIcon:          $('volIcon'),
  upNextList:       $('upNextList'),
  visRing1:         $('visRing1'),
  visRing2:         $('visRing2'),
  // Mini
  miniPlayer:       $('miniPlayer'),
  miniImg:          $('miniImg'),
  miniTitle:        $('miniTitle'),
  miniArtist:       $('miniArtist'),
  miniPlayBtn:      $('miniPlayBtn'),
  miniNextBtn:      $('miniNextBtn'),
  miniProgressFill: $('miniProgressFill'),
  // Audio
  audio:            $('audioPlayer'),
};

/* ══════════════════════════════════════
   4. INIT
══════════════════════════════════════ */
function init() {
  loadFromStorage();
  buildCategoryPills();
  buildFilterRow();
  renderSongsGrid();
  renderUpNext();
  renderSidebarPlaylist();
  setHero(SONGS[0]);
  setupEventListeners();
  setVolume(state.volume, false);
  updateShuffleRepeatUI();

  // Restore last song if saved
  const lastId = parseInt(localStorage.getItem('aura_lastSong'));
  if (lastId) {
    const idx = state.filteredSongs.findIndex(s => s.id === lastId);
    if (idx !== -1) loadSong(idx, false);
  } else {
    loadSong(0, false);
  }

  // Hide loader after short delay
  setTimeout(() => {
    DOM.loader.classList.add('hidden');
  }, 1800);
}

/* ══════════════════════════════════════
   5. BUILD UI
══════════════════════════════════════ */
function buildCategoryPills() {
  const cats = ['All', ...new Set(SONGS.map(s => s.category))];
  DOM.categoryPills.innerHTML = '';
  cats.forEach(cat => {
    const el = document.createElement('div');
    el.className = 'cat-pill' + (cat === state.activeCategory ? ' active' : '');
    el.innerHTML = `
      <span class="cat-pill-dot" style="background:${CAT_COLORS[cat] || '#aaa'}"></span>
      <span>${cat}</span>
    `;
    el.addEventListener('click', () => setCategory(cat));
    DOM.categoryPills.appendChild(el);
  });
}

function buildFilterRow() {
  const cats = ['All', ...new Set(SONGS.map(s => s.category))];
  DOM.filterRow.innerHTML = '';
  cats.forEach(cat => {
    const chip = document.createElement('button');
    chip.className = 'filter-chip' + (cat === state.activeCategory ? ' active' : '');
    chip.textContent = cat;
    chip.addEventListener('click', () => setCategory(cat));
    DOM.filterRow.appendChild(chip);
  });
}

function renderSongsGrid() {
  const { filteredSongs, currentIndex } = state;
  DOM.songsGrid.innerHTML = '';

  if (filteredSongs.length === 0) {
    DOM.songsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🎵</div>
        <h3>No songs found</h3>
        <p>Try a different search or category.</p>
      </div>`;
    DOM.songCount.textContent = '';
    return;
  }

  DOM.songCount.textContent = `${filteredSongs.length} song${filteredSongs.length !== 1 ? 's' : ''}`;

  filteredSongs.forEach((song, i) => {
    const isActive = i === currentIndex;
    const card = document.createElement('div');
    card.className = 'song-card' + (isActive ? ' active' : '');
    card.dataset.index = i;
    card.style.animationDelay = `${i * 0.04}s`;
    card.innerHTML = `
      <div class="song-card-art">
        <img src="${song.image}" alt="${song.title}" loading="lazy"/>
        <div class="song-card-art-overlay">
          <div class="song-card-play">
            <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
          </div>
        </div>
        <span class="song-card-cat" style="color:${CAT_COLORS[song.category] || '#aaa'}">${song.category}</span>
        <div class="card-playing-bars">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div class="song-card-body">
        <div class="song-card-title">${song.title}</div>
        <div class="song-card-artist">${song.artist}</div>
      </div>
    `;
    card.addEventListener('click', () => {
      loadSong(i, true);
    });
    DOM.songsGrid.appendChild(card);
  });
}

function renderUpNext() {
  const { filteredSongs, currentIndex } = state;
  DOM.upNextList.innerHTML = '';
  const nextItems = [];
  for (let i = 1; i <= 5; i++) {
    const idx = (currentIndex + i) % filteredSongs.length;
    if (idx !== currentIndex) nextItems.push({ song: filteredSongs[idx], idx });
  }
  if (nextItems.length === 0) {
    DOM.upNextList.innerHTML = '<p style="font-size:0.8rem;color:var(--text-dim);padding:0.5rem">No songs in queue</p>';
    return;
  }
  nextItems.forEach(({ song, idx }) => {
    const item = document.createElement('div');
    item.className = 'up-next-item';
    item.innerHTML = `
      <div class="up-next-art">
        <img src="${song.image}" alt="${song.title}" loading="lazy"/>
      </div>
      <div class="up-next-info">
        <div class="up-next-title">${song.title}</div>
        <div class="up-next-artist">${song.artist}</div>
      </div>
    `;
    item.addEventListener('click', () => loadSong(idx, true));
    DOM.upNextList.appendChild(item);
  });
}

function renderSidebarPlaylist() {
  DOM.sidebarPlaylist.innerHTML = '';
  SONGS.slice(0, 8).forEach((song, i) => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.textContent = song.title;
    item.addEventListener('click', () => {
      const idx = state.filteredSongs.findIndex(s => s.id === song.id);
      if (idx !== -1) loadSong(idx, true);
    });
    DOM.sidebarPlaylist.appendChild(item);
  });
}

function setHero(song) {
  DOM.heroTitle.textContent  = song.title;
  DOM.heroArtist.textContent = song.artist;
  DOM.heroBg.style.backgroundImage = `url('${song.image}')`;
  DOM.heroBg.style.filter = 'blur(2px) saturate(1.2)';
}

/* ══════════════════════════════════════
   6. SONG LOADING & PLAYBACK
══════════════════════════════════════ */
function loadSong(index, autoPlay = true) {
  const songs = state.filteredSongs;
  if (!songs.length) return;
  index = Math.max(0, Math.min(index, songs.length - 1));

  state.currentIndex = index;
  const song = songs[index];

  // Update audio
  DOM.audio.src = song.src;
  DOM.audio.load();

  // Update Now Playing panel
  DOM.npImg.src        = song.image;
  DOM.npTitle.textContent  = song.title;
  DOM.npArtist.textContent = song.artist;
  DOM.npGlow.style.background = song.color || 'var(--accent)';
  DOM.npProgressFill.style.width = '0%';
  DOM.npCurrentTime.textContent = '0:00';
  DOM.npDuration.textContent    = '0:00';

  // Mini player
  DOM.miniImg.src          = song.image;
  DOM.miniTitle.textContent  = song.title;
  DOM.miniArtist.textContent = song.artist;
  DOM.miniProgressFill.style.width = '0%';

  // Hero update
  setHero(song);

  // Like state
  state.isLiked = state.likedIds.has(song.id);
  updateLikeUI();

  // Re-render grid to update active state
  renderSongsGrid();
  renderUpNext();

  // Artwork float animation
  DOM.npArtwork.classList.toggle('playing', autoPlay);

  // Save last played
  localStorage.setItem('aura_lastSong', song.id);

  if (autoPlay) {
    playAudio();
  } else {
    pauseAudio();
  }
}

function playAudio() {
  DOM.audio.play().then(() => {
    state.isPlaying = true;
    updatePlayPauseUI();
    DOM.npArtwork.classList.add('playing');
    // Visualizer rings
    DOM.visRing1.classList.add('active');
    DOM.visRing2.classList.add('active');
  }).catch(err => {
    console.warn('Playback error:', err);
    state.isPlaying = false;
    updatePlayPauseUI();
  });
}

function pauseAudio() {
  DOM.audio.pause();
  state.isPlaying = false;
  updatePlayPauseUI();
  DOM.npArtwork.classList.remove('playing');
  DOM.visRing1.classList.remove('active');
  DOM.visRing2.classList.remove('active');
}

function togglePlayPause() {
  if (state.isPlaying) {
    pauseAudio();
  } else {
    if (!DOM.audio.src || DOM.audio.src === window.location.href) {
      loadSong(state.currentIndex, true);
    } else {
      playAudio();
    }
  }
}

function nextSong() {
  let nextIndex;
  if (state.isShuffle) {
    nextIndex = getRandomIndex();
  } else {
    nextIndex = (state.currentIndex + 1) % state.filteredSongs.length;
  }
  loadSong(nextIndex, true);
}

function prevSong() {
  // If more than 3 seconds in, restart current song
  if (DOM.audio.currentTime > 3) {
    DOM.audio.currentTime = 0;
    return;
  }
  let prevIndex;
  if (state.isShuffle) {
    prevIndex = getRandomIndex();
  } else {
    prevIndex = (state.currentIndex - 1 + state.filteredSongs.length) % state.filteredSongs.length;
  }
  loadSong(prevIndex, true);
}

function getRandomIndex() {
  const len = state.filteredSongs.length;
  if (len <= 1) return 0;
  let idx;
  do { idx = Math.floor(Math.random() * len); } while (idx === state.currentIndex);
  return idx;
}

/* ══════════════════════════════════════
   7. PROGRESS & TIME
══════════════════════════════════════ */
function formatTime(secs) {
  if (isNaN(secs) || !isFinite(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateProgress() {
  const { currentTime, duration } = DOM.audio;
  if (!duration) return;
  const pct = (currentTime / duration) * 100;
  DOM.npProgressFill.style.width  = pct + '%';
  DOM.miniProgressFill.style.width = pct + '%';
  DOM.npCurrentTime.textContent = formatTime(currentTime);
  DOM.npDuration.textContent    = formatTime(duration);
}

function seekTo(e) {
  const rect = DOM.npProgressBar.getBoundingClientRect();
  const x    = e.clientX - rect.left;
  const pct  = Math.max(0, Math.min(1, x / rect.width));
  DOM.audio.currentTime = pct * (DOM.audio.duration || 0);
}

/* ══════════════════════════════════════
   8. VOLUME
══════════════════════════════════════ */
function setVolume(val, save = true) {
  state.volume        = val;
  DOM.audio.volume    = val / 100;
  DOM.volumeSlider.value = val;
  DOM.volumeFill.style.width = val + '%';
  if (save) localStorage.setItem('aura_volume', val);

  // Toggle mute icon waves
  const waves = document.getElementById('volWaves');
  if (val === 0) {
    waves.style.display = 'none';
  } else {
    waves.style.display = '';
  }
}

function toggleMute() {
  if (state.volume > 0) {
    state._prevVolume = state.volume;
    setVolume(0);
  } else {
    setVolume(state._prevVolume || 80);
  }
}

/* ══════════════════════════════════════
   9. FILTERS & SEARCH
══════════════════════════════════════ */
function setCategory(cat) {
  state.activeCategory = cat;
  applyFilters();

  // Update pills
  document.querySelectorAll('.cat-pill').forEach(el => {
    el.classList.toggle('active', el.querySelector('span:last-child').textContent === cat);
  });
  // Update chips
  document.querySelectorAll('.filter-chip').forEach(el => {
    el.classList.toggle('active', el.textContent === cat);
  });

  // Update section title
  DOM.sectionTitle.textContent = cat === 'All' ? 'All Songs' : cat;
}

function applyFilters() {
  const q   = state.searchQuery.toLowerCase();
  const cat = state.activeCategory;

  state.filteredSongs = SONGS.filter(s => {
    const matchCat  = cat === 'All' || s.category === cat;
    const matchSearch = !q ||
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // Re-anchor currentIndex to the same song if possible
  const currentSong = SONGS[state.currentIndex] || SONGS[0];
  const newIdx = state.filteredSongs.findIndex(s => s.id === currentSong.id);
  state.currentIndex = newIdx !== -1 ? newIdx : 0;

  renderSongsGrid();
  renderUpNext();
}

/* ══════════════════════════════════════
   10. UI STATE UPDATES
══════════════════════════════════════ */
function updatePlayPauseUI() {
  const playing = state.isPlaying;
  // Main controls
  DOM.playPauseBtn.querySelector('.icon-play').style.display  = playing ? 'none' : '';
  DOM.playPauseBtn.querySelector('.icon-pause').style.display = playing ? '' : 'none';
  // Mini
  DOM.miniPlayBtn.querySelector('.icon-play').style.display  = playing ? 'none' : '';
  DOM.miniPlayBtn.querySelector('.icon-pause').style.display = playing ? '' : 'none';
}

function updateShuffleRepeatUI() {
  DOM.shuffleBtn.classList.toggle('active-state', state.isShuffle);
  DOM.repeatBtn.classList.toggle('active-state', state.isRepeat);
}

function updateLikeUI() {
  DOM.npLike.classList.toggle('liked', state.isLiked);
}

/* ══════════════════════════════════════
   11. STORAGE
══════════════════════════════════════ */
function loadFromStorage() {
  const vol     = localStorage.getItem('aura_volume');
  const liked   = localStorage.getItem('aura_liked');
  const shuffle = localStorage.getItem('aura_shuffle');
  const repeat  = localStorage.getItem('aura_repeat');

  if (vol    !== null) state.volume    = parseInt(vol);
  if (shuffle !== null) state.isShuffle = shuffle === 'true';
  if (repeat  !== null) state.isRepeat  = repeat === 'true';
  if (liked) {
    JSON.parse(liked).forEach(id => state.likedIds.add(id));
  }
}

function saveLiked() {
  localStorage.setItem('aura_liked', JSON.stringify([...state.likedIds]));
}

/* ══════════════════════════════════════
   12. EVENT LISTENERS
══════════════════════════════════════ */
function setupEventListeners() {

  /* ---- Audio Events ---- */
  DOM.audio.addEventListener('timeupdate', updateProgress);
  DOM.audio.addEventListener('ended', () => {
    if (state.isRepeat) {
      DOM.audio.currentTime = 0;
      playAudio();
    } else {
      nextSong();
    }
  });
  DOM.audio.addEventListener('loadedmetadata', () => {
    DOM.npDuration.textContent = formatTime(DOM.audio.duration);
  });
  DOM.audio.addEventListener('error', () => {
    console.warn('Audio load error — trying next song');
    setTimeout(nextSong, 500);
  });

  /* ---- Controls ---- */
  DOM.playPauseBtn.addEventListener('click', togglePlayPause);
  DOM.miniPlayBtn.addEventListener('click',  togglePlayPause);
  DOM.prevBtn.addEventListener('click', prevSong);
  DOM.nextBtn.addEventListener('click', nextSong);
  DOM.miniNextBtn.addEventListener('click', nextSong);

  DOM.shuffleBtn.addEventListener('click', () => {
    state.isShuffle = !state.isShuffle;
    localStorage.setItem('aura_shuffle', state.isShuffle);
    updateShuffleRepeatUI();
  });
  DOM.repeatBtn.addEventListener('click', () => {
    state.isRepeat = !state.isRepeat;
    localStorage.setItem('aura_repeat', state.isRepeat);
    updateShuffleRepeatUI();
  });

  /* ---- Progress Bar ---- */
  let isDragging = false;
  DOM.npProgressBar.addEventListener('mousedown', e => {
    isDragging = true;
    seekTo(e);
  });
  window.addEventListener('mousemove', e => { if (isDragging) seekTo(e); });
  window.addEventListener('mouseup',   () => { isDragging = false; });

  DOM.npProgressBar.addEventListener('touchstart', e => {
    isDragging = true; seekTo(e.touches[0]);
  }, { passive: true });
  window.addEventListener('touchmove', e => {
    if (isDragging) seekTo(e.touches[0]);
  }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });

  /* ---- Volume ---- */
  DOM.volumeSlider.addEventListener('input', e => setVolume(parseInt(e.target.value)));
  DOM.volIcon.addEventListener('click', toggleMute);

  /* ---- Like ---- */
  DOM.npLike.addEventListener('click', () => {
    const song = state.filteredSongs[state.currentIndex];
    if (!song) return;
    state.isLiked = !state.isLiked;
    if (state.isLiked) state.likedIds.add(song.id);
    else state.likedIds.delete(song.id);
    updateLikeUI();
    saveLiked();

    // Animate
    DOM.npLike.style.transform = 'scale(1.4)';
    setTimeout(() => DOM.npLike.style.transform = '', 250);
  });

  /* ---- Search ---- */
  DOM.searchInput.addEventListener('input', e => {
    state.searchQuery = e.target.value;
    DOM.searchClear.classList.toggle('visible', state.searchQuery.length > 0);
    applyFilters();
  });
  DOM.searchClear.addEventListener('click', () => {
    state.searchQuery   = '';
    DOM.searchInput.value = '';
    DOM.searchClear.classList.remove('visible');
    applyFilters();
  });

  /* ---- Hero Buttons ---- */
  DOM.heroPlayBtn.addEventListener('click', () => {
    // Play the featured (first) song of current filter
    if (state.filteredSongs.length) {
      loadSong(0, true);
    }
  });
  DOM.heroAddBtn.addEventListener('click', () => {
    // Visual feedback only (no queue logic needed for demo)
    DOM.heroAddBtn.textContent = '✓ Added';
    DOM.heroAddBtn.style.borderColor = 'var(--accent)';
    DOM.heroAddBtn.style.color = 'var(--accent)';
    setTimeout(() => {
      DOM.heroAddBtn.textContent = '+ Add to Queue';
      DOM.heroAddBtn.style.borderColor = '';
      DOM.heroAddBtn.style.color = '';
    }, 1500);
  });

  /* ---- Sidebar Toggle ---- */
  DOM.sidebarToggle.addEventListener('click', () => {
    DOM.sidebar.classList.toggle('collapsed');
    const icon = DOM.sidebarToggle.querySelector('svg');
    icon.style.transform = DOM.sidebar.classList.contains('collapsed') ? 'rotate(180deg)' : '';
  });

  /* ---- Mobile Menu ---- */
  DOM.menuBtn.addEventListener('click', () => {
    DOM.sidebar.style.display = DOM.sidebar.style.display === 'flex' ? 'none' : 'flex';
    DOM.sidebar.style.position = 'fixed';
    DOM.sidebar.style.top = '0';
    DOM.sidebar.style.left = '0';
    DOM.sidebar.style.height = '100vh';
    DOM.sidebar.style.zIndex = '200';
    DOM.sidebar.style.width = '240px';
  });

  /* ---- NP Panel Close (mobile) ---- */
  DOM.npClose.addEventListener('click', () => {
    DOM.nowPlaying.style.display = 'none';
  });

  /* ---- Keyboard Shortcuts ---- */
  document.addEventListener('keydown', e => {
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    switch (e.code) {
      case 'Space':    e.preventDefault(); togglePlayPause(); break;
      case 'ArrowRight': nextSong(); break;
      case 'ArrowLeft':  prevSong(); break;
      case 'ArrowUp':
        e.preventDefault();
        setVolume(Math.min(100, state.volume + 5));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setVolume(Math.max(0, state.volume - 5));
        break;
      case 'KeyM':   toggleMute(); break;
      case 'KeyS':   DOM.shuffleBtn.click(); break;
      case 'KeyR':   DOM.repeatBtn.click(); break;
    }
  });

  /* ---- Close sidebar on outside click (mobile) ---- */
  document.addEventListener('click', e => {
    if (
      DOM.sidebar.style.position === 'fixed' &&
      !DOM.sidebar.contains(e.target) &&
      e.target !== DOM.menuBtn
    ) {
      DOM.sidebar.style.display = 'none';
      DOM.sidebar.style.position = '';
    }
  });
}

/* ══════════════════════════════════════
   13. START
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', init);