import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import LoadingDots from '@/components/LoadingDots';
import { searchUniversities, ChatResponse } from '@/services/universityService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  colleges?: Array<{
    name: string;
    country: string;
    website: string;
  }>;
}

const Index: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Global College Assistant. Ask me about universities and colleges worldwide! Try questions like 'top universities in Canada' or 'universities in Japan'.",
      isUser: false
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the university service
      const response: ChatResponse = await searchUniversities(message);
      
      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        isUser: false,
        colleges: response.colleges
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-4 shadow-elegant">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <GraduationCap className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Global College Chatbot</h1>
            <p className="text-sm opacity-90">Discover universities and colleges worldwide</p>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-gradient-subtle">
        <div className="max-w-4xl mx-auto py-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              colleges={message.colleges}
            />
          ))}
          
          {isLoading && (
            <div className="flex gap-3 p-4 justify-start">
              <div className="flex gap-3 max-w-[80%] md:max-w-[70%]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chat-bot">
                  <LoadingDots />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-chat-bot text-chat-bot-foreground shadow-card">
                  <p className="text-sm md:text-base">Bot is thinking...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default Index;