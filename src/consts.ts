import data from "@/content/productData.json";
import blogData from "@/content/blogData.json";
import type { Product, BlogData, Course } from "./lib/types";
import courseData from "@/content/courseData.json";

const courses: Course[] = courseData.courses as unknown as Course[];

const products = data.products as unknown as Product[];
const blogs = blogData.blogs as unknown as BlogData[];

export const components: {
  title: string;
  href: string;
  description: string;
}[] = products.map((e) => {
  const prod = {
    title: e.product_name,
    href: `/products/${e.slug}`,
    description: e.slogan,
  };
  return prod;
});

export const services = [
  {
    image: "/src/assets/MdiEarth.svg",
    title: "Societal Impact Focus",
    description:
      "Prioritize creating AI applications that positively impact society, such as in healthcare, smart cities, and environmental sustainability.",
  },
  {
    image: "/src/assets/MdiCog.svg",
    title: "Custom AI Solutions",
    description:
      "Develop tailored AI solutions to address the specific needs of clients and industries.",
  },
  {
    image: "/src/assets/MdiAccessPointNetwork.svg",
    title: "Integration with IoT",
    description:
      "Specialize in seamlessly integrating IoT devices to collect data and enhance AI capabilities.",
  },
  {
    image: "/src/assets/MdiLightbulb.svg",
    title: "Innovation Hub",
    description:
      "Cultivate a culture of innovation to continuously push the boundaries of AI and IoT technology, staying at the forefront of industry advancements.",
  },
];

export const blog: {
  title: string;
  href: string;
  description: string;
}[] = blogs.map((e) => {
  const prod = {
    title: e.blog_info.title,
    href: `/blogs/${e.blog_info.title.trim().replace(/\s+/g, "-")}`,
    description: e.blog_info.subtitle,
  };
  return prod;
});

export const course: {
  title: string;
  href: string;
  description: string;
}[] = courses.map((e) => {
  const prod = {
    title: e.title,
    href: e.link,
    description: e.description,
  };
  return prod;
});
