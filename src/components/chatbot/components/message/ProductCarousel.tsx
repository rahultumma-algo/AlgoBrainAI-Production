import React from 'react';
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, EffectCards } from "swiper/modules";

interface ProductCarouselProps {
  items: any[];
  displayType: 'carousel' | 'card';
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ items, displayType }) => {
  if (displayType === 'card' && items.length > 0) {
    const product = items[0];
    return (
      <Card className="py-4 max-w-fit shadow-none bg-gray-100">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <Image
            alt={product.product_name}
            className="object-contain aspect-square rounded-xl"
            src={product.title_media.title}
            width={270}
          />
        </CardHeader>
        <CardBody className="overflow-visible pb-0">
          <p className="text-tiny uppercase font-bold">
            {product.product_type}
          </p>
          <small className="text-default-500 text-tiny">
            {product.description}
          </small>
          <div className="flex gap-2 mt-4">
            <Button size="sm">View Details</Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <style>{`
        .swiper {
          width: 150px;
          height: 220px;
          margin-left: 0px;
          --swiper-pagination-bottom: -16px;
        }

        .swiper-slide {
          display: flex;
          align-items: center;
          justify-content: start;
          border-radius: 18px;
          font-size: 22px;
          font-weight: bold;
          color: #fff;
        }
      `}</style>
      <Swiper
        modules={[EffectCards, A11y, Pagination]}
        effect={"cards"}
        grabCursor={true}
        pagination={{ clickable: true }}
      >
        {items.map((product) => (
          <SwiperSlide key={product.id}>
            <Card className="py-4 max-w-fit shadow-none bg-gray-100">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <Image
                  alt={product.product_name}
                  className="object-contain aspect-square rounded-xl"
                  src={product.title_media.title}
                  width={270}
                />
              </CardHeader>
              <CardBody className="overflow-visible pb-0">
                <p className="text-tiny uppercase font-bold">
                  {product.product_type}
                </p>
                <small className="text-default-500 text-tiny">
                  {product.description}
                </small>
              </CardBody>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex gap-2 mt-4">
        <Button size="sm">View Catalogue</Button>
        <Button size="sm">View Products</Button>
      </div>
    </>
  );
};

export default ProductCarousel; 