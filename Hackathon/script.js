// ── UTILITIES ──────────────────────────────────────────────

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(dateStr) {
  if (!dateStr) return { day: '—', month: '—' };
  const d = new Date(dateStr + 'T00:00:00');
  return {
    day:   d.getDate(),
    month: d.toLocaleString('default', { month: 'short' }).toUpperCase()
  };
}

// ── PROFILES ───────────────────────────────────────────────

function getProfiles() {
  return JSON.parse(localStorage.getItem('profiles')) || [];
}

function saveProfiles(profiles) {
  localStorage.setItem('profiles', JSON.stringify(profiles));
}

function addProfile() {
  const nameEl     = document.getElementById('name');
  const skillEl    = document.getElementById('skill');
  const locationEl = document.getElementById('location');

  const name     = nameEl.value.trim();
  const skill    = skillEl.value.trim();
  const location = locationEl ? locationEl.value.trim() : '';

  if (!name || !skill) {
    showToast('⚠ Please enter both name and skill.');
    return;
  }

  const profiles = getProfiles();
  profiles.push({ name, skill, location });
  saveProfiles(profiles);

  nameEl.value = '';
  skillEl.value = '';
  if (locationEl) locationEl.value = '';

  showToast('✦ Volunteer added successfully!');
  displayProfiles();
}

function deleteProfile(index) {
  const profiles = getProfiles();
  profiles.splice(index, 1);
  saveProfiles(profiles);
  displayProfiles();
  showToast('Profile removed.');
}

function displayProfiles() {
  const list = document.getElementById('profileList');
  const countEl = document.getElementById('profileCount');
  if (!list) return;

  const query = (document.getElementById('profileSearch')?.value || '').toLowerCase();
  const profiles = getProfiles().filter(p =>
    !query || p.name.toLowerCase().includes(query) || p.skill.toLowerCase().includes(query)
  );

  if (countEl) countEl.textContent = getProfiles().length + ' volunteer' + (getProfiles().length !== 1 ? 's' : '');

  if (profiles.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">✦</div>
        <p>${query ? 'No volunteers match your search.' : 'No volunteers yet. Add the first one!'}</p>
      </div>`;
    return;
  }

  list.innerHTML = '';
  profiles.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.style.animationDelay = (i * 0.06) + 's';
    card.innerHTML = `
      <div class="avatar">${initials(p.name)}</div>
      <div class="profile-info">
        <div class="profile-name">${p.name}</div>
        <div class="skill-badge">⬡ ${p.skill}${p.location ? ' &nbsp;·&nbsp; 📍 ' + p.location : ''}</div>
      </div>
      <button class="btn btn-danger" onclick="deleteProfile(${getProfiles().indexOf(p)})">Remove</button>
    `;
    list.appendChild(card);
  });
}

// ── EVENTS ─────────────────────────────────────────────────

function getEvents() {
  return JSON.parse(localStorage.getItem('events')) || [];
}

function saveEvents(events) {
  localStorage.setItem('events', JSON.stringify(events));
}

function addEvent() {
  const titleEl    = document.getElementById('eventTitle');
  const skillEl    = document.getElementById('eventSkill');
  const dateEl     = document.getElementById('eventDate');
  const locationEl = document.getElementById('eventLocation');

  const title    = titleEl.value.trim();
  const skill    = skillEl.value.trim();
  const date     = dateEl.value;
  const location = locationEl ? locationEl.value.trim() : '';

  if (!title || !skill) {
    showToast('⚠ Please enter title and required skill.');
    return;
  }

  const events = getEvents();
  events.push({ title, skill, date, location });
  saveEvents(events);

  titleEl.value = '';
  skillEl.value = '';
  dateEl.value = '';
  if (locationEl) locationEl.value = '';

  showToast('✦ Event posted successfully!');
  displayEvents();
}

function deleteEvent(index) {
  const events = getEvents();
  events.splice(index, 1);
  saveEvents(events);
  displayEvents();
  showToast('Event removed.');
}

function filterEvents() {
  displayEvents();
}

function displayEvents() {
  const list = document.getElementById('eventList');
  const countEl = document.getElementById('eventCount');
  if (!list) return;

  const query = (document.getElementById('searchSkill')?.value || '').toLowerCase();
  const events = getEvents().filter(e =>
    !query ||
    e.skill.toLowerCase().includes(query) ||
    e.title.toLowerCase().includes(query)
  );

  if (countEl) countEl.textContent = getEvents().length + ' event' + (getEvents().length !== 1 ? 's' : '');

  if (events.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">✦</div>
        <p>${query ? 'No events match your search.' : 'No events yet. Post the first one!'}</p>
      </div>`;
    return;
  }

  list.innerHTML = '';
  events.forEach((e, i) => {
    const { day, month } = formatDate(e.date);
    const card = document.createElement('div');
    card.className = 'event-card';
    card.style.animationDelay = (i * 0.06) + 's';
    // Find original index for deletion
    const allEvents = getEvents();
    const origIndex = allEvents.findIndex(ev => ev.title === e.title && ev.date === e.date && ev.skill === e.skill);
    card.innerHTML = `
      <div class="event-date-block">
        <div class="event-day">${day}</div>
        <div class="event-month">${month}</div>
      </div>
      <div class="event-info">
        <div class="event-title">${e.title}</div>
        <div class="event-meta">
          <span class="event-skill-badge">⬡ ${e.skill}</span>
          ${e.location ? `<span class="event-location">📍 ${e.location}</span>` : ''}
        </div>
      </div>
      <button class="btn btn-danger" onclick="deleteEvent(${origIndex})">Remove</button>
    `;
    list.appendChild(card);
  });
}

// ── SEED DATA ──────────────────────────────────────────────

function seedIfEmpty() {
  if (getProfiles().length === 0) {
    saveProfiles([
      { name: 'Priya Sharma',  skill: 'Graphic Design', location: 'Hyderabad' },
      { name: 'Arjun Mehta',   skill: 'Web Development', location: 'Bangalore' },
      { name: 'Divya Nair',    skill: 'Teaching',        location: 'Chennai' },
    ]);
  }
  if (getEvents().length === 0) {
    const today = new Date();
    const fmt = d => d.toISOString().split('T')[0];
    const d1 = new Date(today); d1.setDate(today.getDate() + 5);
    const d2 = new Date(today); d2.setDate(today.getDate() + 12);
    
  }
}

// ── INIT ───────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  seedIfEmpty();
  displayProfiles();
  displayEvents();
});