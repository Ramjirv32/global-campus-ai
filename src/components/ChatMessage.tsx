import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  colleges?: Array<{
    name: string;
    country?: string;
    website: string;
    description?: string;
  }>;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, colleges }) => {
  return (
    <div className={cn(
      "flex gap-3 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex gap-3 max-w-[80%] md:max-w-[70%]",
        isUser && "flex-row-reverse"
      )}>
        <div className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-chat-user" : "bg-chat-bot"
        )}>
          {isUser ? (
            <User className="h-4 w-4 text-chat-user-foreground" />
          ) : (
            <Bot className="h-4 w-4 text-chat-bot-foreground" />
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <div className={cn(
            "rounded-2xl px-4 py-3 shadow-card",
            isUser 
              ? "bg-chat-user text-chat-user-foreground" 
              : "bg-chat-bot text-chat-bot-foreground"
          )}>
            <p className="text-sm md:text-base whitespace-pre-wrap">{message}</p>
          </div>
          
          {colleges && colleges.length > 0 && (
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full rounded-lg overflow-hidden shadow-card">
                <thead>
                  <tr className="bg-table-header text-table-header-foreground">
                    <th className="px-4 py-3 text-left text-sm font-semibold">College/University</th>
                    {colleges[0]?.country && <th className="px-4 py-3 text-left text-sm font-semibold">Country</th>}
                    {colleges[0]?.description && <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>}
                    <th className="px-4 py-3 text-left text-sm font-semibold">Website</th>
                  </tr>
                </thead>
                <tbody>
                  {colleges.map((college, index) => (
                    <tr 
                      key={index}
                      className={cn(
                        "transition-colors hover:bg-table-hover",
                        index % 2 === 0 ? "bg-table-row-even" : "bg-table-row-odd"
                      )}
                    >
                      <td className="px-4 py-3 text-sm text-foreground font-medium">{college.name}</td>
                      {colleges[0]?.country && (
                        <td className="px-4 py-3 text-sm text-muted-foreground">{college.country || 'N/A'}</td>
                      )}
                      {colleges[0]?.description && (
                        <td className="px-4 py-3 text-sm text-muted-foreground max-w-md">
                          <span className="line-clamp-2">{college.description}</span>
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm">
                        <a 
                          href={college.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-hover underline font-medium"
                        >
                          Visit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;