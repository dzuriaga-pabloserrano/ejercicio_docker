//javascript
const form = document.getElementById('messageForm');
const input = document.getElementById('messageInput');
const messagesList = document.getElementById('messagesList');

const backendUrl = 'http://localhost:3000';

async function fetchMessages() {
  const res = await fetch(`${backendUrl}/messages`);
  const messages = await res.json();
  messagesList.innerHTML = '';
  messages.forEach(msg => {
    const li = document.createElement('li');
    li.textContent = msg.text;
    messagesList.appendChild(li);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  await fetch(`${backendUrl}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  input.value = '';
  fetchMessages();
});

fetchMessages();