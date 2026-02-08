document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("cx-chat-toggle");
  const chat = document.getElementById("cx-chat-root");
  const closeBtn = document.getElementById("cx-chat-close");
  const input = document.getElementById("cx-chat-input");
  const sendBtn = document.getElementById("cx-chat-send");
  const messages = document.getElementById("cx-chat-messages");

  const API_URL = "https://sunshine-bot.vercel.app/api/chat-message";

  const sessionId =
    localStorage.getItem("cx_chat_session") ||
    (() => {
      const id = crypto.randomUUID();
      localStorage.setItem("cx_chat_session", id);
      return id;
    })();

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = `cx-msg ${type}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  toggle.onclick = () => chat.classList.remove("cx-hidden");
  closeBtn.onclick = () => chat.classList.add("cx-hidden");

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "cx-user");
    input.value = "";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text,      // ✅ backend expects this
          sessionId,
          source: "shopify",
          pageUrl: window.location.href
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API error:", data);
        throw new Error("API rejected request");
      }

      addMessage(data.reply || "Got it 👍", "cx-bot");
    } catch (err) {
      addMessage("Sorry, something went wrong.", "cx-bot");
    }
  }

  sendBtn.onclick = sendMessage;
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });
});
