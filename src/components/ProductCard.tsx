import React, { useEffect, useState } from "react";
import HoverCard from "./HoverCard";
import FeaturesCard from "./FeaturesCard"; // Assuming you have a FeaturesCard component
import { motion } from "framer-motion";
import {
  convertImageName,
  isVideo,
  getAssetSrc,
  getImageNameWithExtension,
} from "@/lib/utils";
import { Skeleton } from "@nextui-org/skeleton";

export interface Props {
  title: string;
  demo_available: boolean;
  demo_filename: string;
  description: string;
  resource?: string;
  href: string;
  categories: string | string[];
  features?: string[]; // Making features optional
}

const ProductCard: React.FC<Props> = ({
  title,
  demo_available,
  demo_filename,
  description,
  resource = "https://github.githubassets.com/images/modules/site/home-campaign/illu-discussions.png?width=1208&format=webpll",
  href,
  features, // Destructuring features from props
  categories,
}) => {
  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring", // Adjust animation type as needed
        stiffness: 100, // Adjust stiffness as needed
      },
    },
  };

  const [hovered, setHovered] = useState(false);

  return (
    <motion.div variants={itemVariants} layout className="relative">

      <HoverCard backgroundColor="#ffa28b" direction="flex-col" left="0">


        {features === undefined ? (
          <>
            <a href={href} title={`ALGOBRAINAI ${title}`}>
              <motion.div className="md:flex flex-col flex-1 p-8">
                <p className="h-32 mb-6 font-medium line-clamp-6 text-ellipsis text-[#7d8590]">
                  <span className="text-foreground-700 text-2xl font-semibold block">
                    {title}
                  </span>
                  <span className="line-clamp-2 "> {description}</span>
                </p>
                <div className="mt-auto flex items-center justify-between gap-4">
                  <span
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="py-1 inline-block text-foreground-700 font-semibold"
                  >
                    Learn more
                    <span className="sr-only">about {title}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className={`mb-[2px] transition inline-block ml-3 ease-in duration-300 ${hovered ? "translate-x-0" : "-translate-x-1"
                        }`}
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                      />
                    </svg>
                  </span>

                  {demo_available && (
                    <a
                      href={`/products/demo/${demo_filename}`}
                      className="flex items-center justify-center p-2 rounded-lg text-xs sm:text-sm font-medium text-white  transition-all duration-300 bg-gray-500 opacity-90 hover:scale-105"
                    >
                      <div className="relative">
                        {/* Pulsing background effect */}
                        <div className="absolute inset-0 rounded-lg animate-ping bg-purple-300 opacity-20 "></div>

                        {/* Main button - adjusted size and positioning */}
                        <div className="relative flex flex-col items-center justify-center">
                      
                          <span className="sr-only">Try Demo</span>
                          <span className="text-[10px] sm:text-xs font-semibold whitespace-nowrap">Try Demo</span>
                        </div>
                      </div>
                    </a>
                  )}
                </div>
              </motion.div>
              <motion.div className="overflow-hidden rounded-lg mx-4 mb-4">
                {isVideo(resource) ? (
                  <video
                    className="w-full h-auto"
                    width="1209"
                    height="890"
                    autoPlay
                    loop={true}
                    aria-hidden="true"
                    src={resource}
                  />
                ) : (
                  <img
                    className="w-full h-auto aspect-square object-cover"
                    width="1209"
                    height="890"
                    loading="lazy"
                    decoding="async"
                    alt={convertImageName(resource)}
                    aria-hidden="true"
                    //@ts-ignore
                    src={getAssetSrc(getImageNameWithExtension(resource)).src}
                  />
                )}
              </motion.div>
            </a>
          </>
        ) : (
          <>
            <FeaturesCard
              tags={Array.isArray(categories) ? categories : [categories]}
              features={features}
              name={title}
              description={description}
              //@ts-ignore
              image={getAssetSrc(getImageNameWithExtension(resource)).src}
              href={href}
            />
          </>
        )}
      </HoverCard>
    </motion.div>
  );
};

export default ProductCard;
