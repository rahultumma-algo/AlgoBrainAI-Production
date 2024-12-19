export type Product = {
  product_type: string;
  product_name: string;
  demo_available: boolean;
  demo_filename: string;
  slogan: string;
  color: string;
  description: string;
  slug: string;
  key_services: {
    title: string;
    icon: string;
    description: string;
  }[];
  title_media: {
    title: string;
    media_type: string;
  };
  optional_media: {
    title: string;
    media_type: string;
  }[];
  additional_info?: Partial<{
    features: {
      image: string;
      title: string;
      description: string;
    }[];
    use_cases: {
      category: string;
      subcategories: {
        name: string;
        description: string;
      }[];
    }[];
    pricing_plans: {
      name: string;
      description: string;
      durations: {
        type: string;
        price: string;
        discount: string;
        mostValuable: boolean;
      }[];
      features: string[];
    }[];
    technical_specs: {
      image: string;
      title: string;
      description: string;
    }[];
    faqs: {
      question: string;
      answer: string;
    }[];
    contact_info: {
      email: string;
      phone: string;
      website: string;
    };
  }>;
};

type ContentText = {
  content_type: "text";
  content_details: string;
};

type ContentList = {
  content_type: "list";
  content_details: {
    title: string;
    items: string[];
  };
};

type ContentImage = {
  content_type: "image";
  content_details: {
    image_url: string;
    image_alt: string;
  };
};

type ContentVideo = {
  content_type: "video";
  content_details: {
    video_url: string;
    video_title: string;
  };
};

type ContentTable = {
  content_type: "table";
  content_details: {
    table_data: Array<Array<string>>;
  };
};

type Content =
  | ContentText
  | ContentImage
  | ContentVideo
  | ContentTable
  | ContentList;

export type Section = {
  section_title: string;
  content: Array<Content>;
};

type BlogInfo = {
  author: string;
  authorDesignation: string;
  title: string;
  subtitle: string;
  published_date: string;
  category: string;
  heroImage: string;
  tags: Array<string>;
  demo_available: boolean;
  demo_filename: string;
};

type Timestamps = {
  created_at: string;
  updated_at: string;
};

type BlogResource = {
  href: string;
  name: string;
};

export type BlogData = {
  blog_info: BlogInfo;
  content: Array<Section>;
  timestamps: Timestamps;
  resources: Array<BlogResource>;
};

export type Course = {
  type: "programming" | "business" | "design";
  title: string;
  description: string;
  features: string[];
  hashtags: string[];
  image: string;
  link: string;
  demo_available: boolean;
  demo_filename: string;
};

type Feature = {
  count?: number;
  description: string;
};

type CoursesData = {
  courses: Course[];
};
