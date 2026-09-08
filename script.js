// Activity Logs Mock Data
const onboardingData = [
  {
    id: 1,
    name: "Ahmere Tech Solutions",
    email: "contact@ahmere.com",
    phone: "+923009876543",
    status: "Completed",
    time: "Today, 02:15 PM"
  },
  {
    id: 2,
    name: "Fatima Graphics Studio",
    email: "fatima@designhouse.pk",
    phone: "+923215554321",
    status: "Pending (Reminder Sent)",
    time: "Yesterday, 10:00 AM"
  }
];

// Render Logs to UI
function renderLogs() {
  const container = document.getElementById('activityContainer');
  container.innerHTML = '';

  onboardingData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'activity-card';
    
    const isCompleted = item.status === "Completed";
    const statusClass = isCompleted ? "completed" : "pending";

    card.innerHTML = `
      <div class="client-meta">
        <h3>${escapeHtml(item.name)}</h3>
        <p>Email: ${escapeHtml(item.email)} • WhatsApp: ${escapeHtml(item.phone)}</p>
        <p style="font-size: 11px; margin-top: 4px; color: #6b7280;">Triggered: ${item.time}</p>
      </div>
      <div>
        <span class="status-badge ${statusClass}">${item.status}</span>
      </div>
    `;

    container.appendChild(card);
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
}

// Modal Control
const modalOverlay = document.getElementById('modalOverlay');
document.getElementById('openModalBtn').addEventListener('click', () => modalOverlay.classList.add('active'));
document.getElementById('closeModalBtn').addEventListener('click', () => modalOverlay.classList.remove('active'));

// Handle Form Submission & Triggering n8n Webhook
document.getElementById('onboardingForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('clientName').value;
  const email = document.getElementById('clientEmail').value;
  const phone = document.getElementById('clientPhone').value;

  const newItem = {
    id: Date.now(),
    name: name,
    email: email,
    phone: phone,
    status: "Pending (Form Dispatched)",
    time: "Just Now"
  };

  onboardingData.unshift(newItem);
  renderLogs();

  // Update Counters
  const totalCount = document.getElementById('totalSentCount');
  const pendingCount = document.getElementById('pendingCount');
  totalCount.innerText = parseInt(totalCount.innerText) + 1;
  pendingCount.innerText = parseInt(pendingCount.innerText) + 1;

  // Reset & Close Modal
  document.getElementById('onboardingForm').reset();
  modalOverlay.classList.remove('active');

  alert(`Onboarding Form link dispatched via Email & WhatsApp to ${name}!`);
});

// Initial Render
renderLogs();
