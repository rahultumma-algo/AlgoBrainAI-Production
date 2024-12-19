import { Button } from "@nextui-org/button";
import React from "react";
import { calculateDiscountedPrice } from "@/lib/utils";
import { Badge } from "@nextui-org/badge";

type Props = {
  name: string;
  description: string;
  isMostPopular: boolean;
  features: string[];
  pricing: string;
  discount: string;
};

const PricingCard: React.FC<Props> = ({
  name,
  description,
  isMostPopular,
  features,
  pricing,
  discount,
}) => {
  return (
    <div className="flex flex-col relative height-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large bg-background/80 backdrop-blur-md backdrop-saturate-150 transition-transform-background motion-reduce:transition-none overflow-visible !border-small p-3 dark:bg-black/40 order-first border-secondary/50 lg:order-none">
      {isMostPopular && (
        <div className="max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 h-7 text-small rounded-full bg-secondary text-secondary-foreground absolute -top-3 left-1/2 -translate-x-1/2 shadow-large">
          <span className="flex-1 text-inherit px-2 font-semibold [text-shadow:_0_2px_10px_rgb(0_0_0_/_20%)]">
            Most Popular
          </span>
        </div>
      )}

      <div className="p-3 z-10 w-full justify-start shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large flex flex-col items-start gap-2 pb-6">
        <h2 className="text-large font-medium">{name}</h2>
        <p className="text-medium text-default-500">{description}</p>
      </div>
      <hr
        className="shrink-0 border-none w-full h-divider bg-default-200/50"
        role="separator"
      />
      <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased gap-4">
        <ul className="flex flex-col gap-2">
          {features.map((e, index) => (
            <li key={index} className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                className="text-foreground-700"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m6 12l4.243 4.243 8.484-8.486"
                />
              </svg>
              <p className="text-default-500">{e}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-3 h-auto flex w-full items-center overflow-hidden color-inherit subpixel-antialiased rounded-b-large">
        <Button
          as="a"
          href="https://api.whatsapp.com/send?phone=919313192028&text=Hi"
          className="text-center mx-auto"
          target="_self"

        >
                        Contact Us{" "}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;
