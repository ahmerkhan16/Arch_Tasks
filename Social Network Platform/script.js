// ----------------------------- FULL STATE MANAGEMENT -----------------------------
let state = {
    currentUser: JSON.parse(localStorage.getItem('connectify_user')) || { 
        id: 'user1',
        name: "Alex Mercer", 
        privacy: "Public", 
        avatar: "https://ui-avatars.com/api/?name=Alex+Mercer&background=6c5ce7&color=fff&bold=true",
        likesGiven: 0
    },
    posts: JSON.parse(localStorage.getItem('connectify_posts')) || [],
    notifications: JSON.parse(localStorage.getItem('connectify_notifications')) || [],
    friends: JSON.parse(localStorage.getItem('connectify_friends')) || [],
    friendRequests: JSON.parse(localStorage.getItem('connectify_requests')) || [
        { id: 'req1', from: "Sophia Martinez", avatar: "https://randomuser.me/api/portraits/women/22.jpg", fromId: 'user_sophia' },
        { id: 'req2', from: "James Carter", avatar: "https://randomuser.me/api/portraits/men/45.jpg", fromId: 'user_james' }
    ],
    activeCommentPostId: null
};

// Helper saves
function persistState() {
    localStorage.setItem('connectify_user', JSON.stringify(state.currentUser));
    localStorage.setItem('connectify_posts', JSON.stringify(state.posts));
    localStorage.setItem('connectify_notifications', JSON.stringify(state.notifications));
    localStorage.setItem('connectify_friends', JSON.stringify(state.friends));
    localStorage.setItem('connectify_requests', JSON.stringify(state.friendRequests));
}

// WebSocket simulation: real-time friend requests, likes and notifications
let wsInterval;
function initRealTimeSimulation() {
    if(wsInterval) clearInterval(wsInterval);
    wsInterval = setInterval(() => {
        // Simulate random real-time event: someone likes your post or sends friend request
        const events = ['like', 'request'];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        if(randomEvent === 'like' && state.posts.length > 0) {
            const randomPost = state.posts[Math.floor(Math.random() * state.posts.length)];
            if(randomPost.author !== state.currentUser.name) {
                randomPost.likes = (randomPost.likes || 0) + 1;
                addNotification(`💖 ${getRandomName()} liked your post: "${randomPost.content.substring(0, 30)}..."`, 'like');
                renderPosts();
                persistState();
            }
        } else if(randomEvent === 'request') {
            const newRequester = { 
                id: 'req_' + Date.now(), 
                from: getRandomName(), 
                avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random()*70)}.jpg`,
                fromId: 'rand_' + Date.now()
            };
            if(!state.friendRequests.some(r => r.from === newRequester.from)) {
                state.friendRequests.unshift(newRequester);
                addNotification(`📨 New friend request from ${newRequester.from}!`, 'request');
                persistState();
                renderFriendRequests();
                updateBadges();
            }
        }
        updateBadges();
        renderNotifications();
    }, 18000);
}

function getRandomName() {
    const names = ["Elena Grace", "Marcus Lane", "Zara Khan", "Oliver Chen", "Isla Ray"];
    return names[Math.floor(Math.random() * names.length)];
}

function addNotification(text, type = 'system') {
    const noti = { id: Date.now(), text, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), type };
    state.notifications.unshift(noti);
    if(state.notifications.length > 25) state.notifications.pop();
    renderNotifications();
    persistState();
    updateBadges();
}

// Render Functions
function renderPosts() {
    const container = document.getElementById('posts-container');
    if(!container) return;
    const visiblePosts = state.posts.filter(post => {
        if(post.author === state.currentUser.name) return true;
        if(state.currentUser.privacy === 'Private' && post.author !== state.currentUser.name) return false;
        if(state.currentUser.privacy === 'Friends' && !state.friends.includes(post.author) && post.author !== state.currentUser.name) return false;
        return true;
    });
    if(visiblePosts.length === 0) {
        container.innerHTML = `<div class="glass-card" style="text-align:center"><i class="fas fa-newspaper"></i> No posts yet. Be the first to share!</div>`;
        return;
    }
    container.innerHTML = visiblePosts.map(post => `
        <div class="post-card" data-id="${post.id}">
            <div class="post-meta">
                <div style="display:flex; align-items:center; gap:12px">
                    <img src="${post.avatar}" class="avatar-sm">
                    <strong>${post.author}</strong>
                </div>
                <small><i class="far fa-clock"></i> ${post.timestamp}</small>
            </div>
            <p style="margin: 12px 0; line-height:1.5">${escapeHtml(post.content)}</p>
            ${post.image ? (post.image.includes('video') || post.imageMime?.startsWith('video') ? `<video controls src="${post.image}" style="max-width:100%; border-radius:20px"></video>` : `<img src="${post.image}" alt="post media">`) : ''}
            <div class="post-footer">
                <span class="footer-btn" onclick="likePost(${post.id})"><i class="fas fa-heart"></i> ${post.likes || 0}</span>
                <span class="footer-btn" onclick="openComments(${post.id})"><i class="fas fa-comment"></i> ${post.comments?.length || 0}</span>
                <span class="footer-btn" onclick="sharePost(${post.id})"><i class="fas fa-share-alt"></i> Share</span>
            </div>
        </div>
    `).join('');
}

function renderNotifications() {
    const list = document.getElementById('notifications-list');
    if(list) {
        list.innerHTML = state.notifications.map(n => `<div class="notification-item" style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.1);"><i class="fas ${n.type === 'like' ? 'fa-heart' : 'fa-bell'}"></i> ${escapeHtml(n.text)}<br><small style="color:var(--secondary)">${n.time}</small></div>`).join('');
        if(state.notifications.length === 0) list.innerHTML = '<p class="empty-msg">✨ No new alerts</p>';
    }
}

function renderFriendsList() {
    const container = document.getElementById('friends-list-container');
    if(container) {
        if(state.friends.length === 0) container.innerHTML = '<p class="empty-msg">🤝 Make new connections!</p>';
        else container.innerHTML = state.friends.map(f => `<div class="friend-item"><span><i class="fas fa-user-circle"></i> ${escapeHtml(f)}</span><button class="small-btn" onclick="removeFriend('${f}')">Remove</button></div>`).join('');
    }
}

function renderFriendRequests() {
    const container = document.getElementById('requests-list-container');
    if(container) {
        if(state.friendRequests.length === 0) container.innerHTML = '<p class="empty-msg">No pending requests ✔️</p>';
        else container.innerHTML = state.friendRequests.map(req => `
            <div class="request-item" data-id="${req.id}">
                <div style="display:flex; gap:12px; align-items:center"><img src="${req.avatar}" style="width:40px;height:40px;border-radius:50%"> <strong>${escapeHtml(req.from)}</strong></div>
                <div><button class="small-btn" style="background:#00cec9" onclick="acceptFriendRequest('${req.id}')">Accept</button> <button class="small-btn" style="background:#ff7675" onclick="declineRequest('${req.id}')">Decline</button></div>
            </div>
        `).join('');
    }
    updateBadges();
}

function updateBadges() {
    document.getElementById('friend-count-badge').innerText = state.friends.length;
    document.getElementById('noti-count-badge').innerText = state.notifications.length;
    document.getElementById('req-count-badge').innerText = state.friendRequests.length;
    document.getElementById('userPostCount').innerText = state.posts.filter(p => p.author === state.currentUser.name).length;
    document.getElementById('userLikesGiven').innerText = state.currentUser.likesGiven || 0;
}

// Core Features
function createPost() {
    const text = document.getElementById('postInput').value;
    const fileInput = document.getElementById('imageInput');
    if(!text.trim() && (!fileInput.files || fileInput.files.length === 0)) return alert("Write something or add media!");
    const reader = new FileReader();
    const processPost = (mediaData, mimeType) => {
        const newPost = {
            id: Date.now(),
            author: state.currentUser.name,
            avatar: state.currentUser.avatar,
            content: text.trim(),
            image: mediaData || null,
            imageMime: mimeType,
            likes: 0,
            comments: [],
            timestamp: new Date().toLocaleString()
        };
        state.posts.unshift(newPost);
        persistState();
        renderPosts();
        document.getElementById('postInput').value = '';
        document.getElementById('imageInput').value = '';
        document.getElementById('image-preview-container').innerHTML = '';
        addNotification(`📢 New post shared!`, 'system');
        updateBadges();
    };
    if(fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const readerFile = new FileReader();
        readerFile.onload = (e) => processPost(e.target.result, file.type);
        readerFile.readAsDataURL(file);
    } else {
        processPost(null, null);
    }
}

function likePost(postId) {
    const post = state.posts.find(p => p.id === postId);
    if(post) {
        post.likes = (post.likes || 0) + 1;
        state.currentUser.likesGiven = (state.currentUser.likesGiven || 0) + 1;
        persistState();
        renderPosts();
        if(post.author !== state.currentUser.name) addNotification(`👍 ${state.currentUser.name} liked your post!`, 'like');
        updateBadges();
    }
}

function sharePost(postId) {
    addNotification(`🔁 You shared a post! Spread connection.`, 'system');
    alert("Post shared to your timeline (simulated share)");
}

// Comments Modal
function openComments(postId) {
    state.activeCommentPostId = postId;
    const post = state.posts.find(p => p.id === postId);
    const commentList = document.getElementById('modal-comments-list');
    commentList.innerHTML = post.comments?.map(c => `<div style="padding:10px; border-bottom:1px solid #444;"><i class="fas fa-user"></i> ${escapeHtml(c)}</div>`).join('') || "<i>Start the conversation 💬</i>";
    document.getElementById('comment-modal').style.display = 'block';
}
function closeComments() { document.getElementById('comment-modal').style.display = 'none'; }
function submitComment() {
    const text = document.getElementById('new-comment-text').value;
    if(!text.trim()) return;
    const post = state.posts.find(p => p.id === state.activeCommentPostId);
    if(post) {
        post.comments = post.comments || [];
        post.comments.push(`${state.currentUser.name}: ${text}`);
        persistState();
        renderPosts();
        openComments(state.activeCommentPostId);
        document.getElementById('new-comment-text').value = '';
        if(post.author !== state.currentUser.name) addNotification(`💬 ${state.currentUser.name} commented on your post.`, 'system');
    }
}

// Friend Request actions
function acceptFriendRequest(requestId) {
    const req = state.friendRequests.find(r => r.id === requestId);
    if(req && !state.friends.includes(req.from)) {
        state.friends.push(req.from);
        state.friendRequests = state.friendRequests.filter(r => r.id !== requestId);
        addNotification(`🎉 You are now friends with ${req.from}!`, 'system');
        persistState();
        renderFriendsList();
        renderFriendRequests();
        updateBadges();
    }
}
function declineRequest(requestId) {
    state.friendRequests = state.friendRequests.filter(r => r.id !== requestId);
    persistState();
    renderFriendRequests();
    updateBadges();
}
function removeFriend(friendName) {
    state.friends = state.friends.filter(f => f !== friendName);
    addNotification(`👋 You removed ${friendName} from friends.`, 'system');
    persistState();
    renderFriendsList();
    updateBadges();
}

// Profile update & privacy
function updateProfile() {
    const newName = document.getElementById('username-input').value.trim();
    if(newName) state.currentUser.name = newName;
    state.currentUser.privacy = document.getElementById('privacy-input').value;
    const avatarFile = document.getElementById('avatarUpload').files[0];
    if(avatarFile) {
        const avReader = new FileReader();
        avReader.onload = (e) => {
            state.currentUser.avatar = e.target.result;
            applyProfileUI();
            persistState();
            renderPosts();
        };
        avReader.readAsDataURL(avatarFile);
    } else {
        state.currentUser.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(state.currentUser.name)}&background=6c5ce7&color=fff`;
        applyProfileUI();
        persistState();
        renderPosts();
    }
    addNotification(`Profile updated! Privacy: ${state.currentUser.privacy}`, 'system');
}

function applyProfileUI() {
    document.getElementById('nav-avatar').src = state.currentUser.avatar;
    document.getElementById('input-avatar').src = state.currentUser.avatar;
    document.getElementById('profileAvatarLarge').src = state.currentUser.avatar;
    document.getElementById('profileDisplayName').innerText = state.currentUser.name;
    document.getElementById('navUsername').innerText = state.currentUser.name;
    document.getElementById('profilePrivacyBadge').innerText = state.currentUser.privacy;
    document.getElementById('username-input').value = state.currentUser.name;
    document.getElementById('privacy-input').value = state.currentUser.privacy;
    updateBadges();
}

// UI Navigation
document.querySelectorAll('.nav-links li').forEach(li => {
    li.addEventListener('click', () => {
        const sectionId = li.getAttribute('data-section');
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
        li.classList.add('active');
        if(sectionId === 'friends') renderFriendsList();
        if(sectionId === 'requests') renderFriendRequests();
        if(sectionId === 'notifications') renderNotifications();
        if(sectionId === 'feed') renderPosts();
    });
});

// Story simulation
document.getElementById('triggerStory')?.addEventListener('click', () => {
    document.getElementById('story-content').innerHTML = `<h3>✨ Your Story ✨</h3><img src="${state.currentUser.avatar}" style="width:100px;border-radius:50%"><p>${state.currentUser.name}’s moment</p><button class="btn-primary" onclick="closeStoryModal()">Close</button>`;
    document.getElementById('story-modal').style.display = 'block';
});
function closeStoryModal() { document.getElementById('story-modal').style.display = 'none'; }

function escapeHtml(str) { if(!str) return ''; return str.replace(/[&<>]/g, function(m){if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m;}); }

// Image preview
document.getElementById('imageInput').addEventListener('change', (e) => {
    const preview = document.getElementById('image-preview-container');
    if(e.target.files[0]) preview.innerHTML = `<img src="${URL.createObjectURL(e.target.files[0])}" style="max-width:100px; border-radius:12px">`;
    else preview.innerHTML = '';
});

// Initialize all
document.addEventListener('DOMContentLoaded', () => {
    applyProfileUI();
    renderPosts();
    renderNotifications();
    renderFriendsList();
    renderFriendRequests();
    updateBadges();
    initRealTimeSimulation();
    // trigger extra cleanup
    window.addEventListener('beforeunload', () => { if(wsInterval) clearInterval(wsInterval); });
});