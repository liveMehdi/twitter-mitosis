/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "rb.gy",
      "icon-library.com",
      "img.icons8.com",
      "developers.google.com",
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "www.linkpicture.com",
    ],
    formats: ["image/webp"],
  },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

module.exports = nextConfig;
