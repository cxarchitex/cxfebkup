(function () {
  const API_URL = "https://sunshine-bot.vercel.app/api/chat-message";

  function initChat() {
    const launcher = document.querySelector("[data-chat-launcher]");
    const widget = document.querySelector("[data-chat-widget]");
    const closeBtn = document.querySelector("[data-chat-close]");
    const messagesEl = document.querySelector("[data-chat-messages]");
    const inputEl = document.querySelector("[data-chat-input]");
    const sendBtn = document.querySelector("[data-chat-send]");

    if (!launcher || !widget || !closeBtn || !messagesEl || !inputEl || !sendBtn) {
      setTimeout(initChat, 300);
      return;
    }

    const conversationId =
      sessionStorage.getItem("chat_conversation_id") ||
      crypto.randomUUID();

    sessionStorage.setItem("chat_conversation_id", conversationId);

    launcher.addEventListener("click", () => {
      widget.classList.add("open");
    });

    closeBtn.addEventListener("click", () => {
      widget.classList.remove("open");
    });

    sendBtn.addEventListener("click", sendMessage);
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });

    async function sendMessage() {
      const text = inputEl.value.trim();
      if (!text) return;

      appendMessage(text, "user");
      inputEl.value = "";

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, conversationId })
        });

        const data = await res.json();

        if (!res.ok) {
          appendMessage("Sorry, something went wrong.", "bot");
          return;
        }

        appendMessage(data.reply, "bot");
      } catch (err) {
        appendMessage("Sorry, something went wrong.", "bot");
      }
    }

    function appendMessage(text, sender) {
      const msg = document.createElement("div");
      msg.className = `chat-msg ${sender}`;
      msg.textContent = text;
      messagesEl.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChat);
  } else {
    initChat();
  }
})();
