/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  i18n: {
    locales: ["en-US", "bn-BD"],
    defaultLocale: "en-US",
  },
  webpack: (config) => {
    // Add the HTML loader
    config.module.rules.push({
      test: /\.html$/,
      use: {
        loader: 'html-loader', // Specify the loader
      },
    });

    return config; // Return the updated config
  },
};

module.exports = nextConfig;
