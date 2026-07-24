import React, { useState, useRef, useEffect } from "react";

// ── YOUR API URL ────────────────────────────────────────────────────────
const API_URL = "https://qssvxz4w11.execute-api.us-east-1.amazonaws.com/prod/chat";

// ── Icons ───────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
  </svg>
);

const ChatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SUGGESTIONS = [
  { title: "Explain Lambda functions", sub: "AWS serverless compute" },
  { title: "What is API Gateway?", sub: "REST vs HTTP APIs" },
  { title: "How does Cognito auth work?", sub: "User pools & identity" },
  { title: "DynamoDB vs S3 storage", sub: "When to use each" },
];

// const HISTORY = [
//  "Setting up AWS Amplify hosting",
//  "Bedrock Claude model access",
//  "IAM roles for Lambda",
//]; 

// ── Styles ───────────────────────────────────────────────────────────────
const styles = {
  root: {
    height: "100vh",
    display: "flex",
    backgroundColor: "#212121",
    color: "#ececec",
    fontFamily: "'Söhne', 'ui-sans-serif', 'system-ui', sans-serif",
    overflow: "hidden",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#171717",
    display: "flex",
    flexDirection: "column",
    padding: "8px",
    flexShrink: 0,
    overflowY: "auto",
  },
  sidebarTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 8px 4px",
    marginBottom: "4px",
  },
  sidebarBrand: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#ececec",
    letterSpacing: "-0.01em",
  },
  newChatBtn: {
    background: "none",
    border: "none",
    color: "#8e8ea0",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarSection: {
    padding: "4px 8px 2px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#8e8ea0",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginTop: "8px",
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 10px",
    borderRadius: "8px",
    fontSize: "13.5px",
    color: "#c5c5d2",
    cursor: "pointer",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    userSelect: "none",
    transition: "background 0.15s",
  },
  sidebarItemActive: {
    backgroundColor: "#2f2f2f",
    color: "#ececec",
  },
  sidebarDivider: {
    height: "1px",
    backgroundColor: "#2f2f2f",
    margin: "8px 0",
  },
  sidebarFooter: {
    marginTop: "auto",
    paddingTop: "8px",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #2f2f2f",
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#ececec",
  },
  headerBadge: {
    fontSize: "11px",
    backgroundColor: "#2f2f2f",
    color: "#8e8ea0",
    borderRadius: "20px",
    padding: "3px 10px",
    fontWeight: "500",
  },
  chatArea: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    padding: "40px 20px",
    textAlign: "center",
  },
  emptyLogo: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    backgroundColor: "#2f2f2f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    marginBottom: "4px",
  },
  emptyTitle: {
    fontSize: "26px",
    fontWeight: "600",
    color: "#ececec",
    letterSpacing: "-0.02em",
  },
  emptySubtitle: {
    fontSize: "14px",
    color: "#8e8ea0",
    maxWidth: "360px",
    lineHeight: "1.6",
  },
  suggestionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginTop: "8px",
    width: "100%",
    maxWidth: "520px",
  },
  suggestionCard: {
    backgroundColor: "#2f2f2f",
    border: "1px solid #3f3f3f",
    borderRadius: "12px",
    padding: "12px 14px",
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.15s, border-color 0.15s",
  },
  suggestionTitle: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#ececec",
    marginBottom: "2px",
  },
  suggestionSub: {
    fontSize: "12px",
    color: "#8e8ea0",
  },
  messageRow: {
    padding: "20px 0",
    display: "flex",
    justifyContent: "center",
  },
  messageInner: {
    width: "100%",
    maxWidth: "680px",
    padding: "0 16px",
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
  },
  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "600",
    marginTop: "2px",
  },
  avatarUser: {
    backgroundColor: "#4a4a5a",
    color: "#ececec",
  },
  avatarBot: {
    backgroundColor: "#2f2f2f",
    border: "1px solid #3f3f3f",
    color: "#ececec",
    fontSize: "15px",
  },
  messageContent: {
    flex: 1,
    fontSize: "14.5px",
    lineHeight: "1.75",
    color: "#ececec",
    paddingTop: "3px",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
  },
  messageMeta: {
    fontSize: "11px",
    color: "#8e8ea0",
    marginBottom: "4px",
    fontWeight: "500",
  },
  typingDot: {
    display: "inline-block",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#8e8ea0",
    margin: "0 2px",
    animation: "bounce 1.2s infinite",
  },
  inputArea: {
    padding: "12px 16px 16px",
    flexShrink: 0,
  },
  inputWrapper: {
    maxWidth: "680px",
    margin: "0 auto",
    backgroundColor: "#2f2f2f",
    borderRadius: "16px",
    border: "1px solid #3f3f3f",
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
    padding: "10px 12px",
  },
  textarea: {
    flex: 1,
    background: "none",
    border: "none",
    outline: "none",
    color: "#ececec",
    fontSize: "14.5px",
    lineHeight: "1.6",
    resize: "none",
    maxHeight: "200px",
    minHeight: "24px",
    fontFamily: "inherit",
    padding: "0",
  },
  sendBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background 0.15s",
  },
  inputFooter: {
    maxWidth: "680px",
    margin: "8px auto 0",
    textAlign: "center",
    fontSize: "11.5px",
    color: "#6b6b7b",
  },
};

// ── Typing indicator ─────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={styles.messageRow}>
      <div style={styles.messageInner}>
        <div style={{ ...styles.avatar, ...styles.avatarBot }}>🦉</div>
        <div>
          <div style={styles.messageMeta}>AthenaAI</div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", paddingTop: "6px" }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  ...styles.typingDot,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────
export default function App() {
  //states
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState("");
  const [chatID, setChatID] = useState(Date.now().toString());
  const [chatList, setChatList] = useState([]);
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isLoading]);

  // Load chat from localStorage
  useEffect(() => {
    const savedChat = localStorage.getItem("chat");
    if (savedChat) {
      try {
        setChat(JSON.parse(savedChat));
      } catch (e) {
        console.error("Failed to parse saved chat:", e);
      }
    }
  }, []);

  // Save chat to localStorage
  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(chat));
  }, [chat]);
  useEffect(() => {
  fetchChats();
}, []);

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };
  const fetchChats = async () => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "list_chats" }),
    });

    const data = await res.json();
    setChatList(data.chats || []);
  } catch (err) {
    console.error(err);
  }
};
const loadChat = async (id) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "load_chat",
        chatID: id,
      }),
    });

    const data = await res.json();

    setChat((data.messages || []).sort((a, b) => {
  return a.timestamp - b.timestamp;
}));
    setChatID(String(id));
    setTimeout(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, 100);
  } catch (err) {
    console.error(err);
  }
};

  const sendMessage = async (text) => {
    const msg = text || message;
    if (!msg.trim() || isLoading) return;

    // Add user message
    setChat((prev) => [...prev, { role: "user", text: msg }]);
    setMessage("");
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, chatID }),
      });

    
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const replyText = data?.reply || data?.response || data?.message || "No response from AI";

      setChat((prev) => [...prev, { role: "bot", text: replyText }]);
      fetchChats();
    } catch (error) {
      console.error("Fetch error:", error);
      setChat((prev) => [
        ...prev,
        { role: "bot", text: `⚠️ Error: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renameChat = async (chatId) => {
  const newTitle = prompt("Enter new name:");
  if (!newTitle) return;
  console.log("RENAME REQUEST:", {
    action: "rename_chat",
    chatID: chatId,
    title: newTitle
  });

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "rename_chat",
      chatID: chatId,
      title: newTitle
    })
  });

  await fetchChats();
};

const deleteChat = async (chatId) => {
  if (!window.confirm("Delete chat?")) return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "delete_chat",
      chatID: chatId
    })
  });

  setChat([]);

  await fetchChats();
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    setChat([]);
    setChatID(newId);
    localStorage.removeItem("chat");
 };

  const canSend = message.trim() && !isLoading;

  return (
    <div style={styles.root}>
      {/* ── Sidebar ── */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          <span style={styles.sidebarBrand}>AthenaAI</span>
          <button
            style={styles.newChatBtn}
            title="New chat"
            onClick={handleNewChat}
          >
            <PlusIcon />
          </button>
        </div>

        <div
          style={styles.sidebarItem}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2f2f2f")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          onClick={handleNewChat}
        >
          <ChatIcon /> New conversation
        </div>

        <div style={styles.sidebarDivider} />
        <div style={styles.sidebarSection}>Recent</div>

 {chatList.map((h, i) => {
  console.log("RENDER ITEM:", h);

  return (
    <div
      key={i}
      style={{
        ...styles.sidebarItem,
        backgroundColor:
          String(chatID) === String(h.chatID)
            ? "#2f2f2f"   // active
            : "#171717",  // default
      }}
      onClick={() => {
        console.log("CLICKED CHAT:", h);
        console.log("Current chatID:", chatID);
        console.log("Clicked chatId:", h.chatID);

        loadChat(h.chatId);
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#2a2a2a"; // hover
      }}
      onMouseLeave={(e) => {
        if (String(chatID) !== String(h.chatID)) {
          e.currentTarget.style.backgroundColor = "#171717"; // reset
        } else {
          e.currentTarget.style.backgroundColor = "#2f2f2f"; // keep active
        }
      }}
    >
      <ChatIcon />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {h.title}
      </span>
      <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
  
  <div style={{ marginLeft: "auto", position: "relative", overflow: "visible"}}>

  {/* 3 dots button */}
  <button
  onClick={(e) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();

    setMenuPosition({
      x: rect.right,
      y: rect.bottom
    });

    setMenuOpen(prev => prev === h.chatId ? null : h.chatId);
  }}
  style={{
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: "#c5c5d2"
  }}
>
  ⋮
</button>

  

</div>

</div>
{menuOpen && (
  <div
    style={{
      position: "fixed",
      top: menuPosition.y,
      left: menuPosition.x - 120,
      backgroundColor: "#2f2f2f",
      border: "1px solid #3f3f3f",
      borderRadius: "6px",
      padding: "6px",
      zIndex: 9999,
      minWidth: "120px"
    }}
  >
    <div
      onClick={() => {
        renameChat(menuOpen);
        setMenuOpen(null);
      }}
      style={{ padding: "6px", cursor: "pointer" }}
    >
      Rename
    </div>

    <div
      onClick={() => {
        deleteChat(menuOpen);
        setMenuOpen(null);
      }}
      style={{ padding: "6px", cursor: "pointer", color: "#ff6b6b" }}
    >
      Delete
    </div>
  </div>
)}

    </div>
  );
})}

        <div style={styles.sidebarDivider} />
        <div style={styles.sidebarSection}>Study</div>

        {["AWS Modules", "Course Notes"].map((item, i) => (
          <div
            key={i}
            style={styles.sidebarItem}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2f2f2f")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <BookIcon /> {item}
          </div>
        ))}

        <div style={styles.sidebarFooter}>
          <div style={styles.sidebarDivider} />
          <div
            style={styles.sidebarItem}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2f2f2f")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <UserIcon /> My Account
          </div>
        </div>

      </div>

      {/* ── Main ── */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.headerTitle}>AthenaAI</span>
          <span style={styles.headerBadge}>Study Assistant</span>
        </div>

        {/* Chat / Empty state */}
        <div style={styles.chatArea}>
          {chat.length === 0 && !isLoading ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyLogo}>🦉</div>
              <div style={styles.emptyTitle}>How can I help you study?</div>
              <div style={styles.emptySubtitle}>
                Ask anything about your serverless AI project — architecture,
                AWS services, code, or deployment steps.
              </div>
              <div style={styles.suggestionGrid}>
                {SUGGESTIONS.map((s, i) => (
                  <div
                    key={i}
                    style={styles.suggestionCard}
                    onClick={() => sendMessage(s.title)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#3a3a3a";
                      e.currentTarget.style.borderColor = "#555";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#2f2f2f";
                      e.currentTarget.style.borderColor = "#3f3f3f";
                    }}
                  >
                    <div style={styles.suggestionTitle}>{s.title}</div>
                    <div style={styles.suggestionSub}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {chat.map((msg, index) => (
                <div key={index} style={styles.messageRow}>
                  <div style={styles.messageInner}>
                    <div style={{ ...styles.avatar, ...(msg.role === "user" ? styles.avatarUser : styles.avatarBot) }}>
                      {msg.role === "user" ? "U" : "🦉"}
                    </div>
                    <div>
                      <div style={styles.messageMeta}>
                        {msg.role === "user" ? "You" : "AthenaAI"}
                      </div>
                      <div style={styles.messageContent}>{msg.text}</div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div style={styles.inputArea}>
          <div style={styles.inputWrapper}>
            <textarea
              ref={textareaRef}
              rows={1}
              value={message}
              onChange={(e) => { setMessage(e.target.value); autoResize(e); }}
              onKeyDown={handleKeyDown}
              placeholder="Ask AthenaAI anything..."
              style={styles.textarea}
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!canSend}
              style={{
                ...styles.sendBtn,
                backgroundColor: canSend ? "#ececec" : "#3f3f3f",
                color: canSend ? "#212121" : "#8e8ea0",
                cursor: canSend ? "pointer" : "default",
              }}
            >
              <SendIcon />
            </button>
          </div>
          <div style={styles.inputFooter}>
            AthenaAI can make mistakes. Verify important information.
          </div>
        </div>
      </div>
    </div>
  );
}