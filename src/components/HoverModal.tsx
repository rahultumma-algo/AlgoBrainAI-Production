import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type React from "react";

interface Props {
  content: string;
}

function HoverModal(props: Props) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div role="button">
          {
            //@ts-ignore

            props.trigger
          }
        </div>
      </HoverCardTrigger>
      <HoverCardContent>{props.content}</HoverCardContent>
    </HoverCard>
  );
}

export default HoverModal;
