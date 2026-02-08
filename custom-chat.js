(function () {
  const API_URL = "https://sunshine-bot.vercel.app/api/chat-message";

  function initChat() {
    const messagesEl = document.querySelector("[data-chat-messages]");
    const inputEl = document.querySelector("[data-chat-input]");
    const sendBtn = document.querySelector("[data-chat-send]");

    if (!messagesEl || !inputEl || !sendBtn) {
      setTimeout(initChat, 300);
      return;
    }

    const conversationId =
      sessionStorage.getItem("chat_conversation_id") ||
      crypto.randomUUID();

    sessionStorage.setItem("chat_conversation_id", conversationId);

    sendBtn.addEventListener("click", sendMessage);
    inputEl.addEventListener("keypress", (e) => {
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
          body: JSON.stringify({
            message: text,
            conversationId,
            customerId: window.SHOPIFY_CUSTOMER?.id || null
          })
        });

        const data = await res.json();
        appendMessage(data.reply, "bot");
      } catch {
        appendMessage("Sorry, something went wrong.", "bot");
      }
    }

    function appendMessage(text, sender) {
      const msg = document.createElement("div");
      msg.className = sender === "user" ? "chat-msg user" : "chat-msg bot";
      msg.innerText = text;
      messagesEl.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", initChat)
    : initChat();
})();
