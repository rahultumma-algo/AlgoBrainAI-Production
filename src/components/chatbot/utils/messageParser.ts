//@ts-nocheck`
import productData from '@/content/productData.json';
import blogData from '@/content/blogData.json';
import courseData from '@/content/courseData.json';

interface ParsedMessage {
  type: 'simple' | 'complex';
  message: string;
  preText?: string;
  postText?: string;
  items?: any[];
  itemType?: 'product' | 'blog' | 'course';
  displayType?: 'carousel' | 'card';
  suggestions?: Array<{
    text: string;
    action: string;
  }>;
}

export const parseMessage = (text: string): ParsedMessage => {
  // Check for carousel or card patterns
  const carouselMatch = text.match(/\/carousel-(prod|blog|course)(.*?)\/carousel-\1/s);
  const cardMatch = text.match(/\/card-(prod|blog|course)(.*?)\/card-\1/s);
  
  let items: any[] = [];
  let itemType: 'product' | 'blog' | 'course' = 'product';
  let displayType: 'carousel' | 'card' = 'carousel';
  let message = text;
  let suggestions: Array<{ text: string; action: string }> = [];
  let preText: string | undefined;
  let postText: string | undefined;

  // Find all trigger buttons in the text
  const triggerPattern = /\/trigger-button\s*\[(.*?)\]\((.*?)\)\s*\/trigger-button/g;
  let triggerMatch;
  let lastTriggerIndex = 0;
  
  while ((triggerMatch = triggerPattern.exec(text)) !== null) {
    suggestions.push({
      text: triggerMatch[1],
      action: triggerMatch[2]
    });
    lastTriggerIndex = triggerMatch.index + triggerMatch[0].length;
  }
  // Check if there's a carousel/card
  if (carouselMatch || cardMatch) {
    const match = carouselMatch || cardMatch;
    if (!match) return {
      type: 'simple',
      message: text,
      suggestions
    };
    
    const type = match[1];
    displayType = carouselMatch ? 'carousel' : 'card';
    const fullMatch = match[0];
    const matchIndex = text.indexOf(fullMatch);
    // Extract text before and after the carousel/card
    preText = text.substring(0, matchIndex).trim();
    
    // Get the text after carousel but before any trigger buttons
    const afterCarousel = text.substring(matchIndex + fullMatch.length);
    const firstTriggerInPost = afterCarousel.indexOf('/trigger-button');
    postText = firstTriggerInPost >= 0 
      ? afterCarousel.substring(0, firstTriggerInPost).trim()
      : afterCarousel.trim();

    // Extract IDs and URLs using a more specific pattern
    const idPattern = /\b(prod|blog|course)-\d+\[([^\]]+)\]/g;
    const matches = match ? [...match[2].matchAll(idPattern)] : [];
    const ids = matches.map(m => ({
      id: m[0].split('[')[0],
      url: m[2]
    }));
    
    switch (type) {
      case 'prod':
        itemType = 'product';
        items = ids.map(({id, url}) => {
          const product = productData.products.find(p => p.id === id);
          return product ? {...product, url} : null;
        }).filter(Boolean);
        break;
      case 'blog':
        itemType = 'blog';
        items = ids.map(({id, url}) => {
          const blog = blogData.blogs.find(b => b.id === id);
          return blog ? {...blog, url} : null;
        }).filter(Boolean);
        break;
      case 'course':
        itemType = 'course';
        items = ids.map(({id, url}) => {
          const course = courseData.courses.find(c => c.id === id);
          return course ? {...course, url} : null;
        }).filter(Boolean);
        break;
    }

    return {
      type: 'complex',
      message: '', // The carousel/card content
      preText: preText || undefined,
      postText: postText || undefined,
      items,
      itemType,
      displayType,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  }

  // If it's a simple message (with or without trigger buttons)
  return {
    type: 'simple',
    message: text,
    suggestions: suggestions.length > 0 ? suggestions : undefined
  };
}; 