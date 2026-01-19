import { Blog } from "@/types/blog";

const blogData: Blog[] = [
  {
    id: 1,
    title: "5 Essential Tips for Designing Your Perfect Kurta Shalwar",
    paragraph:
      "Discover expert tips and tricks for creating stunning Kurta Shalwar designs. Learn how to choose the right fabrics, colors, and patterns that reflect your unique style and personality.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop",
    author: {
      name: "Ayesha Malik",
      image: "/images/blog/author-03.png",
      designation: "Fashion Designer",
    },
    tags: ["design"],
    publishDate: "Jan 2025",
  },
  {
    id: 2,
    title: "Creator Spotlight: How Zara Earned Her First Reward",
    paragraph:
      "Meet Zara, a Gen Z creator who turned her passion for fashion into income. Learn how she designed 20+ unique outfits and earned rewards when others ordered her creations.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop",
    author: {
      name: "Fatima Hassan",
      image: "/images/blog/author-02.png",
      designation: "Community Manager",
    },
    tags: ["creators"],
    publishDate: "Dec 2024",
  },
  {
    id: 3,
    title: "Trending Now: Pakistani Fashion Styles for 2025",
    paragraph:
      "Explore the latest fashion trends in Pakistani wear. From traditional embroidery to modern minimalist designs, discover what's trending in the JUTE Fashion community this year.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop",
    author: {
      name: "Sana Khan",
      image: "/images/blog/author-03.png",
      designation: "Style Influencer",
    },
    tags: ["trends"],
    publishDate: "Dec 2024",
  },
];
export default blogData;
