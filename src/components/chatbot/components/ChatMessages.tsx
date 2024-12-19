//@ts-nocheck

import React from 'react';
import type { CSSProperties } from 'react';
import type { Message as MessageType } from '../types/message';
import Message from './Message';
import { parseMessage } from '../utils/messageParser';
import RingLoader from "react-spinners/RingLoader";

interface ChatMessagesProps {
  messages: MessageType[];
  onSendMessage: (message: string) => void;
  onFeedbackRequest: () => void;
  isLoading?: boolean;
}

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#3B82F6",
};

const LoadingMessage = () => (
  <div className="flex items-start gap-2">
    <div className="flex items-center gap-2 p-4">
      <RingLoader
        color={"#3B82F6"}
        loading={true}
        cssOverride={override}
        size={40}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <span className="text-white ml-2">Thinking...</span>
    </div>
  </div>
);

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, onSendMessage, onFeedbackRequest, isLoading }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderBotMessage = (message: MessageType, index: number) => {
    const parsedMessage = parseMessage(message.text);

    if (parsedMessage.type === 'complex') {
      return (
        <Message
          key={index}
          type="chatbot-complex"
          message={parsedMessage.preText}
          items={parsedMessage.items}
          itemType={parsedMessage.itemType}
          displayType={parsedMessage.displayType}
          suggestions={parsedMessage.suggestions}
          onSendMessage={onSendMessage}
          onFeedbackRequest={onFeedbackRequest}
        />
      );
    }

    return (
      <Message
        key={index}
        type="chatbot-simple"
        message={parsedMessage.message}
        suggestions={parsedMessage.suggestions}
        onSendMessage={onSendMessage}
        onFeedbackRequest={onFeedbackRequest}
      />
    );
  };

  return (
    <div className="chat-messages p-4 flex flex-col gap-4 bg-gray-950">
      {messages.map((message, index) => {
        if (message.type === 'user') {
          return (
            <Message
              key={index}
              type="human"
              message={message.text}
              onSendMessage={onSendMessage}
            />
          );
        }
        return renderBotMessage(message, index);
      })}
      {isLoading && <LoadingMessage />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages; 