import React from "react";
import { Button } from "@nextui-org/button";
import { convertImageName } from "@/lib/utils";

interface Props {
  name: string;
  description: string;
  features: string[];
  image: string;
  tags: string[];
  href: string;
}

const FeaturesCard: React.FC<Props> = ({
  name,
  description,
  features,
  image,
  tags,
  href,
}: Props) => {
  return (
    <div className="flex flex-col relative h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large bg-background/80 backdrop-blur-md backdrop-saturate-150 transition-transform-background motion-reduce:transition-none overflow-visible !border-small p-3 dark:bg-black/40 order-first border-secondary/50 lg:order-none">
      <div>
        <img
          className="rounded-md aspect-square object-cover"
          height={1600}
          width={900}
          src={image}
          alt={convertImageName(image)}
        />
      </div>
      <div className="p-3 z-10 w-full justify-start shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large flex flex-col items-start gap-2 pb-6">
        <h2 className="text-large font-medium">{name}</h2>
        <p className="text-medium text-default-500 line-clamp-2">
          {description}
        </p>
      </div>
      <hr
        className="shrink-0 border-none w-full h-divider bg-default-200/50"
        role="separator"
      />
      <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased gap-4">
        <ul className="flex flex-col gap-2">
          {features.map((e, index) => (
            <li className="flex items-center gap-2" key={index}>
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
      <div className="flex gap-3 my-3  flex-wrap">
        {tags.map((e, index) => (
          <Button variant="bordered" radius="full" size="sm" key={index}>
            {e}
          </Button>
        ))}
      </div>
      <div className="p-3 h-auto flex w-full items-center overflow-hidden color-inherit subpixel-antialiased rounded-b-large">
        <Button
          className="text-center mx-auto"
          title={`ALGOBRAIN AI | ${name}`}
          as="a"
          href={href}
                          target="_blank"

        >
          Choose plan
        </Button>
      </div>
    </div>
  );
};

export default FeaturesCard;
