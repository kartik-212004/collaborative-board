"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

import { MessageCircle, Send, X } from "lucide-react";

import { ChatMessagePayload } from "../types";

export type ChatMessage = ChatMessagePayload;

interface ChatSidebarProps {
  messages: ChatMessage[];
  currentUserId: string | null;
  onSendMessage: (message: string) => void;
  isConnected: boolean;
  isOpen: boolean;
  onClose: () => void;
  unreadCount: number;
}

export function ChatSidebar({
  messages,
  currentUserId,
  onSendMessage,
  isConnected,
  isOpen,
  onClose,
  unreadCount,
}: ChatSidebarProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSend = () => {
    if (inputValue.trim() && isConnected) {
      onSendMessage(inputValue.trim());
      setInputValue("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="bg-canvas-toolbar border-canvas-border text-canvas-foreground flex w-56 flex-col rounded-xl border shadow-xl">
      <div className="border-canvas-border flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm font-semibold">Chat</span>
        </div>
        <button onClick={onClose} className="hover:bg-canvas-hover rounded p-1 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex max-h-64 min-h-48 flex-col overflow-y-auto px-2 py-2">
        {messages.length === 0 ? (
          <div className="text-canvas-muted-foreground flex flex-1 items-center justify-center px-2 py-3 text-center text-xs">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => {
              const isOwn = msg.userId === currentUserId;
              return (
                <div key={msg.id} className={`flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
                  {!isOwn && (
                    <div className="flex items-center gap-1.5 px-1">
                      {msg.userPhoto ? (
                        <img
                          src={msg.userPhoto}
                          alt={msg.userName}
                          className="h-4 w-4 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-600 text-[8px] font-semibold">
                          {msg.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-canvas-muted-foreground text-xs">{msg.userName}</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[90%] rounded-lg px-3 py-1.5 text-sm ${
                      isOwn ? "bg-blue-600 text-white" : "bg-canvas-hover text-canvas-foreground/90"
                    }`}>
                    {msg.message}
                  </div>
                  <span className="text-canvas-muted-foreground px-1 text-[10px]">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-canvas-border border-t p-2">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? "Type a message..." : "Disconnected"}
            disabled={!isConnected}
            className="border-canvas-border bg-canvas-muted text-canvas-foreground placeholder:text-canvas-muted-foreground focus:border-canvas-foreground/20 w-[80%] flex-1 rounded-lg border px-3 py-1.5 text-sm focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || !isConnected}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
