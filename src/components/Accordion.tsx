import { Accordion, AccordionItem } from "@nextui-org/accordion";
import React from "react";
interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqs }) => {
  return (
    <Accordion>
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          aria-label={`Accordion ${index + 1}`}
          title={faq.question}
        >
          {faq.answer}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQAccordion;
