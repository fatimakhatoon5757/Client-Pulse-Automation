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
      totalCount.innerText = parseInt(totalCount.innerText) + 1;
      pendingCount.innerText = parseInt(pendingCount.innerText) + 1;

      document.getElementById('onboardingForm').reset();
      modalOverlay.classList.remove('active');

      alert(`Onboarding Form link dispatched via Email & WhatsApp to ${name}!`);
    } else {
      alert("Failed to send data to n8n webhook. Status: " + response.status);
    }

  } catch (error) {
    console.error("Webhook Error:", error);
    alert("Error connecting to n8n Webhook. Please check console.");
  } finally {
    submitBtn.innerText = originalBtnText;
    submitBtn.disabled = false;
  }
});