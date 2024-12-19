export type HumanMessageProps = {
  type: "human";
  message: string;
};

export type ChatBotSimpleMessageProps = {
  type: "chatbot-simple";
  message: string;
};

export type ChatBotComplexMessageProps = {
  type: "chatbot-complex";
  message?: string;
  items: any[];
  itemType: 'product' | 'blog' | 'course';
  displayType: 'carousel' | 'card';
};

export type SuggestionMessageProps = {
  type: "suggestion";
  suggestions: Array<{
    text: string;
    action: string;
  }>;
};

export type MessageProps =
  | HumanMessageProps
  | ChatBotSimpleMessageProps
  | ChatBotComplexMessageProps
  | SuggestionMessageProps;

export interface Message {
  text: string;
  type: 'user' | 'bot';
  metadata?: {
    items?: any[];
    itemType?: 'product' | 'blog' | 'course';
    displayType?: 'carousel' | 'card';
    suggestions?: Array<{
      text: string;
      action: string;
    }>;
  };
}

// Create a barrel export file
export * from './message'; 