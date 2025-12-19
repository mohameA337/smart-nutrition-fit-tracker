import React, { useState } from 'react';
import { sendChatMessage } from '../services/api';
import Navbar from '../components/Navbar';

const Chatbot = () => {
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
            const data = await sendChatMessage(input);
            const aiMessage = { role: 'system', content: data.response };
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
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Navbar />
            <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    height: '70vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1rem',
                        borderBottom: '1px solid #eee',
                        backgroundColor: '#2c3e50',
                        color: 'white',
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px'
                    }}>
                        <h2 style={{ margin: 0 }}>🥑 AI Nutrition Assistant</h2>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.role === 'user' ? '#3498db' : '#ecf0f1',
                                color: msg.role === 'user' ? 'white' : '#2c3e50',
                                padding: '0.8rem 1.2rem',
                                borderRadius: '20px',
                                maxWidth: '70%',
                                wordWrap: 'break-word'
                            }}>
                                {msg.content}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', color: '#7f8c8d', fontStyle: 'italic' }}>
                                Thinking...
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} style={{
                        padding: '1rem',
                        borderTop: '1px solid #eee',
                        display: 'flex',
                        gap: '1rem'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about calories, workouts, or meal plans..."
                            style={{
                                flex: 1,
                                padding: '0.8rem',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                backgroundColor: '#27ae60',
                                color: 'white',
                                border: 'none',
                                padding: '0 1.5rem',
                                borderRadius: '5px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
