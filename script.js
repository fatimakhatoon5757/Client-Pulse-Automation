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

function renderLogs() {
  const container = document.getElementById('activityContainer');
  if (!container) return;
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

const modalOverlay = document.getElementById('modalOverlay');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

if (openModalBtn) {
  openModalBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
}

document.getElementById('onboardingForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('clientName').value;
  const email = document.getElementById('clientEmail').value;
  const phone = document.getElementById('clientPhone').value;

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerText;
  submitBtn.innerText = "Dispatching...";
  submitBtn.disabled = true;

  const webhookUrl = "http://localhost:5678/webhook-test/trigger-client-onboard";

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        timestamp: new Date().toISOString()
      })
    });

    if (response.ok) {
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

      const totalCount = document.getElementById('totalSentCount');
      const pendingCount = document.getElementById('pendingCount');
      if (totalCount) totalCount.innerText = parseInt(totalCount.innerText) + 1;
      if (pendingCount) pendingCount.innerText = parseInt(pendingCount.innerText) + 1;

      document.getElementById('onboardingForm').reset();
      modalOverlay.classList.remove('active');

      alert(`Onboarding Form link dispatched via Email & WhatsApp to ${name}!`);
    } else {
      alert("Failed to send data to n8n webhook. Status: " + response.status);
    }
  } catch (error) {
    console.error("Webhook Error:", error);
    alert("Error connecting to n8n Webhook. Please check your n8n server connection.");
  } finally {
    submitBtn.innerText = originalBtnText;
    submitBtn.disabled = false;
  }
});

renderLogs();