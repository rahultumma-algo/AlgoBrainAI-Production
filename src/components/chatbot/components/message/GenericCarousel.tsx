import React from 'react';
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, EffectCards } from "swiper/modules";
import {
  convertImageName,
  isVideo,
  getAssetSrc,
  getImageNameWithExtension,
} from "@/lib/utils";

interface CarouselItem {
  id: string;
  title: string;
  description: string;
  image: string;
  type: string;
  link?: string;
}

interface GenericCarouselProps {
  items: any[];
  displayType: 'carousel' | 'card';
  itemType: 'product' | 'blog' | 'course';
}

const GenericCarousel: React.FC<GenericCarouselProps> = ({ items, displayType, itemType }) => {
  const formatItem = (item: any): CarouselItem => {
    switch (itemType) {
      case 'product':
        return {
          id: item.id,
          title: item.product_name,
          description: item.description,
          image: item.title_media.title,
          type: item.product_type,
          link: item.slug.toLowerCase().replace(/\s+/g, '-')
        };
      case 'blog':
        return {
          id: item.id,
          title: item.blog_info.title,
          description: item.blog_info.subtitle,
          image: item.blog_info.heroImage,
          type: item.blog_info.category
        };
      case 'course':
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image,
          type: item.type,
          link: item.link
        };
      default:
        throw new Error(`Unknown item type: ${itemType}`);
    }
  };

  if (displayType === 'card' && items.length > 0) {
    const item = formatItem(items[0]);
    return (
      <Card className="py-4 w-full h-full shadow-none bg-gray-800 text-white">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          <Image
            alt={item.title}
            className="object-cover h-48 rounded-xl"
            //@ts-ignore
            src={getAssetSrc(getImageNameWithExtension(item.image)).src}
          />
        </CardHeader>
        <CardBody className="overflow-visible pb-0">
          <p className="text-tiny uppercase font-bold card-title text-gray-400">
            {item.type}
          </p>
          <h4 className="font-bold text-large card-title">
            {item.title}
          </h4>
          <small className="text-gray-400 card-description">
            {item.description}
          </small>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <style>{`
        .swiper {
          width: 280px;
          height: 420px;
          margin-left: 0px;
          --swiper-pagination-bottom: -16px;
        }

        .swiper-slide {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          font-size: 22px;
          font-weight: bold;
          color: #fff;
        }

        .card-title {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }

        .card-description {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .card-description {
          margin-bottom: 1rem;
        }

        .swiper-pagination-bullet {
          background-color: #fff !important;
          opacity: 0.5;
        }

        .swiper-pagination-bullet-active {
          background-color: #fff !important;
          opacity: 1;
        }

      `}</style>
      <Swiper
        modules={[EffectCards, A11y, Pagination]}
        effect={"cards"}
        grabCursor={true}
        pagination={{ clickable: true }}
      >
        {items.map((item) => {
          const formattedItem = formatItem(item);
          return (
            <SwiperSlide key={formattedItem.id}>
              <Card className="py-4 w-full h-full shadow-none bg-gray-800 text-white">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                  <div className="w-full flex justify-center">
                    <Image
                      alt={formattedItem.title}
                      className="object-cover h-48 rounded-xl"
                      //@ts-ignore
                      src={getAssetSrc(getImageNameWithExtension(formattedItem.image)).src}
                    />
                  </div>
                </CardHeader>
                <CardBody className="overflow-visible pb-0">
                  <div className="card-content">
                    <p className="text-tiny uppercase font-bold card-title text-gray-400">
                      {formattedItem.type}
                    </p>
                    <h4 className="font-bold text-large card-title">
                      {formattedItem.title}
                    </h4>
                    <small className="text-gray-400 card-description">
                      {formattedItem.description}
                    </small>
                    <Button
                      size="sm"
                      variant="bordered"
                      radius="full"
                      color="primary"
                      className="learn-more-btn"
                      as="a"
                      href={
                        itemType === 'course' 
                          ? formattedItem.link 
                          : itemType === 'blog'
                            ? `https://algobrainai.com/blogs/${formattedItem.title.toLowerCase().replace(/\s+/g, '-')}`
                            : `https://algobrainai.com/products/${formattedItem.link}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <small>Learn More</small>
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  );
};

export default GenericCarousel; 