import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Course, Product } from "./types";
import type { Props as cardProps } from "@/components/ProductCard";
import type { props as pricingProps } from "@/components/Pricing";
import type { BlogData } from "./types";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
/**
 * Extracts the image name without the path, removes the file extension and converts to lowercase, replaces underscores with spaces and returns the modified image name.
 *
 * @param {string} imageName - the original image name
 * @return {string} the modified image name
 */
export function convertImageName(imageName: string): string {
  // Extract just the image name without the path
  const imageNameWithoutPath = imageName.split("/").pop() || imageName;

  // Remove file extension and convert to lowercase
  const imageNameWithoutExtension = imageNameWithoutPath
    .split(".")[0]
    .toLowerCase();

  // Replace underscores with spaces and return
  return imageNameWithoutExtension.replace(/-/g, " ");
}
/**
 * Extracts the image name with extension from the given image path.
 *
 * @param {string} imagePath - The path of the image.
 * @return {string} The image name with extension.
 */
export function getImageNameWithExtension(imagePath: string): string {
  // Extract just the image name with extension
  const imageNameWithExtension = imagePath.split("/").pop() || imagePath;
  return imageNameWithExtension;
}

/**
 * Transforms a product object into cardProps format.
 *
 * @param {Product} product - the product object to transform
 * @return {cardProps} the transformed product in cardProps format
 */
export function transformProduct(product: Product): cardProps {
  return {
    title: product.product_name,
    description: product.description,
    resource: product.title_media.title, // Assuming the first image is used as imageUrl
    href: "/products/" + product.slug, // You can replace it with the actual link
    categories: product.product_type,
    demo_available: product.demo_available,
    demo_filename: product.demo_filename,
  };
}

export function transformBlogData(blog: BlogData): cardProps {
  return {
    categories: blog.blog_info.category,
    description: blog.blog_info.subtitle,
    href: "/blogs/" + blog.blog_info.title.trim().replace(/\s+/g, "-"),
    title: blog.blog_info.title,
    resource: blog.blog_info.heroImage,
    demo_available: blog.blog_info.demo_available,
    demo_filename: blog.blog_info.demo_filename,
  };
}
export function transformCourseData(blog: Course): cardProps {
  return {
    categories: blog.hashtags,
    description: blog.description,
    href: blog.link,
    title: blog.title,
    resource: blog.image,
    features: blog.features,
    demo_available: blog.demo_available,
    demo_filename: blog.demo_filename,
  };
}

/**
 * Check if the given resource is a video file based on its file extension.
 *
 * @param {string} resource - the resource to check for being a video file
 * @return {boolean} true if the resource is a video file, false otherwise
 */
export function isVideo(resource: string) {
  // List of common video file extensions
  const videoExtensions = [
    ".mp4",
    ".avi",
    ".mov",
    ".mkv",
    ".wmv",
    ".flv",
    ".webm",
  ];

  // Get the file extension of the resource
  const fileExtension = resource.substring(resource.lastIndexOf("."));

  // Check if the file extension is in the list of video extensions
  return videoExtensions.includes(fileExtension);
}

export function groupPlansByType(pricing_plans: pricingProps[]) {
  console.log("pricing plans", pricing_plans);
  // Extract unique plan types
  const uniquePlanTypes = [
    ...new Set(
      pricing_plans.flatMap((plan) =>
        plan.durations.map((duration) => duration.type)
      )
    ),
  ];

  // Group plans by plan type
  const groupedPlans: Record<string, pricingProps[]> = {};
  uniquePlanTypes.forEach((type) => {
    const plansOfType = pricing_plans.filter((plan) =>
      plan.durations.some((duration) => duration.type === type)
    );
    if (plansOfType.length > 0) {
      groupedPlans[type] = plansOfType;
    }
  });

  return [uniquePlanTypes, groupedPlans] as const;
}

export const calculateDiscountedPrice = (
  price: string,
  discountPercentage: string
) => {
  const originalPrice = parseFloat(price);
  const discount = parseFloat(discountPercentage);
  console.log(originalPrice, price);

  // Ensure discount is applied correctly for desired output of 1600
  const discountAmount = originalPrice * (discount / 100);

  return (originalPrice - discountAmount).toFixed(0); // Subtract the discount amount from the original price
};

export const getAssetSrc = (name: string) => {
  const path = `/src/assets/${name}`;
  const modules = import.meta.glob("/src/assets/*", { eager: true });
  const mod = modules[path] as { default: string };
  console.log("modules", modules);
  return mod.default;
};

/**
 * Extracts the extension of an image file path as a string.
 * @param imagePath - The path of the image file.
 * @returns The extension of the image file path, or an empty string if the
 * extension cannot be extracted.
 */
export function extractImageExtension(imagePath: string | undefined): string {
  if (imagePath === undefined || imagePath.trim() === "") {
    return ""; // or throw an error or handle the case based on your requirement
  }

  const extension = imagePath.split(".").pop()?.toLowerCase() ?? ""; // using optional chaining and nullish coalescing operator
  return extension;
}
