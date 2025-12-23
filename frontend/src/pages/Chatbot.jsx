import React, { useState } from 'react';
import { getUserProfile, sendChatMessage } from '../services/api';
import { THEMES } from '../theme/theme';

const Chatbot = () => {
    // Theme State
    const [isDarkMode, setIsDarkMode] = useState(true);
    const theme = isDarkMode ? THEMES.dark : THEMES.light;
    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const [messages, setMessages] = useState([
        { role: 'system', content: 'Hello! I am your AI nutrition assistant. Ask me anything about diet, workouts, or health.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const data = await sendChatMessage(input, getUserProfile);
            // Ensure we handle the response format correctly (data.response or data)
            const aiContent = data.response || data.message || "I didn't get a response.";
            const aiMessage = { role: 'system', content: aiContent };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage = { role: 'system', content: 'Sorry, I encountered an error. Please try again later.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        // 1. Outer Container: Centers the chat window on the page
        <div style={{ 
            minHeight: 'calc(100vh - 80px)', // Adjust for navbar
            backgroundColor: theme.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            transition: 'background-color 0.3s'
        }}>

            {/* 2. Chat Window */}
            <div style={{
                width: '100%',
                maxWidth: '500px',      
                height: '500px',        
                backgroundColor: theme.cardBg,
                borderRadius: '15px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: `1px solid ${theme.cardBorder}`,
                transition: 'background-color 0.3s, border-color 0.3s'
            }}>

                {/* Header */}
                <div style={{
                    padding: '1rem',
                    backgroundColor: isDarkMode ? '#2c3e50' : '#2c3e50', 
                    color: 'white',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', flex: 1 }}>AI Nutrition Assistant</h2>
                    <button 
                        onClick={toggleTheme}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.5)',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '15px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </div>

                {/* Messages Area */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    backgroundColor: theme.cardBg
                }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.role === 'user' ? theme.accentBlue : (isDarkMode ? theme.itemBg : '#f1f0f0'),
                            color: msg.role === 'user' ? 'white' : theme.text,
                            padding: '0.8rem 1.2rem',
                            borderRadius: '18px',
                            borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                            borderBottomLeftRadius: msg.role === 'user' ? '18px' : '4px',
                            maxWidth: '75%',
                            wordWrap: 'break-word',
                            fontSize: '0.95rem',
                            lineHeight: '1.4'
                        }}>
                            {msg.content}
                        </div>
                    ))}
                    {loading && (
                        <div style={{ alignSelf: 'flex-start', color: theme.subText, fontStyle: 'italic', fontSize: '0.9rem', marginLeft: '10px' }}>
                            Thinking...
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} style={{
                    padding: '1rem',
                    borderTop: `1px solid ${theme.itemBorder}`,
                    display: 'flex',
                    gap: '0.8rem',
                    backgroundColor: theme.cardBg
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        style={{
                            flex: 1,
                            padding: '0.8rem',
                            borderRadius: '25px',
                            border: `1px solid ${theme.cardBorder}`,
                            fontSize: '0.95rem',
                            outline: 'none',
                            backgroundColor: theme.inputBg,
                            color: theme.inputText
                        }}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: theme.accentBlue,
                            color: 'white',
                            border: 'none',
                            padding: '0 1.5rem',
                            borderRadius: '25px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: 'bold',
                            transition: 'opacity 0.2s',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;