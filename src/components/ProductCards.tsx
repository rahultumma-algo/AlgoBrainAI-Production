import React, { useMemo } from "react";
import type { Props as cardProps } from "./ProductCard";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import Filter from "./Filter";
import { Button } from "@nextui-org/button";

function ProductCards({
  type = "default",
  data,
  viewAllUrl,
  cardFor,
}: {
  type?: "feature" | "default";
  data: cardProps[];
  viewAllUrl?: string;
  cardFor: string;
}) {
  const [filters, setFilters] = React.useState<string>("all");
  const [isAnimationVisible, setIsAnimationVisible] = React.useState(false);
  const [displayLimit, setDisplayLimit] = React.useState<number | null>(null);
  
  // Check if we're on the products page
  const isProductsPage = typeof window !== 'undefined' && window.location.pathname === '/products';

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAnimationVisible(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!data) return [];

    const filtered = filters === "all"
      ? data
      : data.filter((item) => {
          if (Array.isArray(item.categories)) {
            return item.categories.includes(filters);
          } else if (typeof item.categories === "string") {
            return item.categories === filters;
          }
          return false;
        });

    // On homepage, limit to 3 items if viewAllUrl is present
    if (viewAllUrl && displayLimit === null) {
      setDisplayLimit(3);
    }

    return displayLimit ? filtered.slice(0, displayLimit) : filtered;
  }, [data, filters, displayLimit, viewAllUrl]);

  const hasMoreItems = useMemo(() => {
    const totalItems = filters === "all"
      ? data.length
      : data.filter((item) => {
          if (Array.isArray(item.categories)) {
            return item.categories.includes(filters);
          } else if (typeof item.categories === "string") {
            return item.categories === filters;
          }
          return false;
        }).length;

    return totalItems > 3;
  }, [data, filters]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div>
      <Filter
        categories={Array.from(
          new Set(
            data.flatMap((product) => {
              if (Array.isArray(product.categories)) {
                return product.categories;
              } else if (typeof product.categories === "string") {
                return [product.categories];
              }
              return [];
            })
          )
        )}
        filters={filters}
        setFilters={setFilters}
        key="filterProduct"
      />

      {isAnimationVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 auto-rows-fr justify-center items-center dark:text-white mt-5"
        >
          {filteredProducts.map((product) => (
            <div key={product.title} className="lg:col-span-2">
              {type === "feature" ? (
                <ProductCard {...product} features={product.features} />
              ) : (
                <ProductCard {...product} />
              )}
            </div>
          ))}
        </motion.div>
      )}

    

      {viewAllUrl && (
        <Button
          className="flex justify-center items-center mt-3 w-fit mx-auto"
          as="a"
          variant="bordered"
          radius="full"
          title={`View all ${cardFor}`}
          href={viewAllUrl}
        >
          View All
        </Button>
      )}
    </div>
  );
}

export default ProductCards;
