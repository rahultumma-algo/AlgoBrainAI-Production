import React, { useState } from 'react';
import type { FC, ReactNode } from 'react';
import { Card, CardHeader, Button } from "@nextui-org/react";
import { HeadCircuit, Sparkle } from "@phosphor-icons/react";
import type { MessageProps } from '../types/message';
import GenericCarousel from './message/GenericCarousel';
import { TextGenerateEffect } from './message/TextGenerateEffect';

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";

interface TriggerButtonProps {
  text: string;
  action: string;
  onSendMessage: (message: string) => void;
}

const TriggerButton: FC<TriggerButtonProps> = ({ text, action, onSendMessage }) => (
  <Button
    size="sm"
    color="primary"
    variant="flat"
    className="bg-[hsl(222deg_8.93%_43.92%)] text-white hover:opacity-90"
    onClick={() => onSendMessage(action)}
  >
    {text}
  </Button>
);

interface MessageComponentProps {
  type: "human" | "chatbot-simple" | "chatbot-complex" | "suggestion";
  message?: string;
  items?: any[];
  itemType?: 'product' | 'blog' | 'course';
  displayType?: 'carousel' | 'card';
  suggestions?: Array<{
    text: string;
    action: string;
  }>;
  onSendMessage?: (message: string) => void;
  onFeedbackRequest?: () => void;
}

const Message: React.FC<MessageComponentProps> = (props) => {
  // Add state to track if feedback has been requested
  const [feedbackRequested, setFeedbackRequested] = useState(false);
  const [isTextComplete, setIsTextComplete] = useState(false);

  // Helper function to check for feedback command
  const handleFeedbackCommand = (text: string) => {
    const feedbackMatch = text.match(/\/feedback\s+(.*?)\s+\/feedback/);
    if (feedbackMatch && props.onFeedbackRequest && !feedbackRequested) {
      setFeedbackRequested(true);
      props.onFeedbackRequest();
      return feedbackMatch[1]; // Return the text between feedback tags
    }
    // If feedback was already requested or there's no feedback command,
    // just return the cleaned text
    return feedbackMatch ? feedbackMatch[1] : text;
  };

  // Helper function to process text with formatting
  const processFormattedText = (text: string): ReactNode[] => {
    let processedText = text.replace(/\s+/g, ' ').trim();
    const parts = processedText.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/);
    
    return parts.map((part, i) => {
      const boldMatch = part.match(/\*\*(.*?)\*\*/);
      if (boldMatch) {
        return <strong key={i}>{boldMatch[1]}</strong>;
      }
      
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        return (
          <a 
            key={i}
            href={linkMatch[2]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            {linkMatch[1]}
          </a>
        );
      }
      
      return part ? <span key={i}>{part}</span> : null;
    });
  };

  // Helper function to extract trigger button
  const extractTriggers = (text: string) => {
    const triggerPattern = /\/trigger-button\s*\[(.*?)\]\s*\((.*?)\)\s*\/trigger-button/;
    const match = text.match(triggerPattern);
    
    if (match) {
      const textWithoutTrigger = text.replace(triggerPattern, '').trim();
      return {
        content: textWithoutTrigger,
        triggers: [{
          text: match[1].trim(),
          action: match[2].trim()
        }]
      };
    }
    
    return {
      content: text,
      triggers: []
    };
  };

  // Update formatContent to handle single trigger button
  const formatContent = (text: string): ReactNode => {
    const cleanText = handleFeedbackCommand(text);
    // Remove trigger button content before processing
    const textWithoutTrigger = cleanText.replace(/\/trigger-button\s*\[.*?\]\s*\(.*?\)\s*\/trigger-button/, '').trim();
    const lines = textWithoutTrigger.split('\n').filter(Boolean);
    
    return (
      <div className="flex flex-col gap-2">
        {lines.map((line, index) => {
          if (line.startsWith('-')) {
            return (
              <div key={index} className="flex gap-2">
                <span className="text-gray-400">•</span>
                <span>{processFormattedText(line.slice(1).trim())}</span>
              </div>
            );
          }
          
          const numberMatch = line.match(/^(\d+)\.\s*(.*)/);
          if (numberMatch) {
            return (
              <div key={index} className="flex gap-2">
                <span className="text-gray-400 min-w-[1.5rem]">{numberMatch[1]}.</span>
                <span>{processFormattedText(numberMatch[2].trim())}</span>
              </div>
            );
          }
          
          return <div key={index}>{processFormattedText(line)}</div>;
        })}
      </div>
    );
  };

  return (
    <>
      {props.type === "chatbot-simple" && (
        <div className="flex items-start gap-2">
          <div className="flex flex-col gap-2">
            {props.message && (() => {
              const { content, triggers } = extractTriggers(props.message);
              return (
                <>
                  <Card className="max-w-[85%] rounded-bl-md bg-gray-800 text-white">
                    <CardHeader className="p-4">
                      <TextGenerateEffect 
                        words={content}
                        className="!mt-0 !text-base !font-normal"
                        onComplete={() => setIsTextComplete(true)}
                      >
                        {formatContent(content)}
                      </TextGenerateEffect>
                    </CardHeader>
                  </Card>
                  {isTextComplete && (
                    <div className="flex flex-col gap-2">
                      {triggers.length > 0 ? (
                        <div className="flex gap-2 mt-2 justify-start flex-wrap">
                          {triggers.map((trigger, index) => (
                            <TriggerButton
                              key={`trigger-${index}`}
                              text={trigger.text}
                              action={trigger.action}
                              onSendMessage={props.onSendMessage || (() => {})}
                            />
                          ))}
                        </div>
                      ) : props.suggestions && props.suggestions.length > 0 && (
                        <div className="flex gap-2 mt-2 justify-start flex-wrap">
                          {props.suggestions.map((suggestion, index) => (
                            <TriggerButton
                              key={`suggestion-${index}`}
                              text={suggestion.text}
                              action={suggestion.action}
                              onSendMessage={props.onSendMessage || (() => {})}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {props.type === "human" && (
        <div className="flex items-end justify-end gap-2 ms-auto break-words">
          <div className="flex flex-col gap-2">
            <Card className=" ms-auto rounded-br-md bg-blue-900 text-white">
              <CardHeader className="p-4">
                <div className="flex flex-col gap-2">
                  {props.message?.split('\n').filter(Boolean).map((line, index) => (
                    <div key={`human-msg-${line}`} className="break-words">{line}</div>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      )}

      {props.type === "suggestion" && props.suggestions && (
        <div className="flex items-center gap-2 ms-auto me-5 flex-wrap">
          {props.suggestions.map((suggestion) => (
            <Button
              startContent={<Sparkle size={16} />}
              key={suggestion.text}
              variant="faded"
              color="primary"
              size="sm"
              onClick={() => props.onSendMessage?.(suggestion.action)}
            >
              {suggestion.text}
            </Button>
          ))}
        </div>
      )}

      {props.type === "chatbot-complex" && (
        <div className="flex items-start gap-2">
          <div className="flex flex-col gap-2 max-w-[85%]">
            {props.message && (
              <Card className="max-w-fit rounded-bl-md bg-gray-800 text-white">
                <CardHeader>
                  <TextGenerateEffect 
                    words={props.message}
                    className="!mt-0 !text-base !font-normal"
                    onComplete={() => setIsTextComplete(true)}
                  >
                    {formatContent(props.message)}
                  </TextGenerateEffect>
                </CardHeader>
              </Card>
            )}
            {isTextComplete && props.items && props.items.length > 0 && (
              <div className={!props.message ? "ms-3" : ""}>
                <GenericCarousel 
                  items={props.items} 
                  displayType={props.displayType || 'carousel'}
                  itemType={props.itemType || 'product'}
                />
                {props.suggestions && props.suggestions.length > 0 && (
                  <div className="flex gap-2 mt-4 justify-start flex-wrap">
                    {props.suggestions.map((suggestion, index) => (
                      <TriggerButton
                        key={`suggestion-${index}`}
                        text={suggestion.text}
                        action={suggestion.action}
                        onSendMessage={props.onSendMessage || (() => {})}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Message; 