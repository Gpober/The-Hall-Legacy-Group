/** @type {import('next').NextConfig} */

// Optional base path so the app can be served under a sub-path (e.g. "/admin"
// proxied from the main site) today, then dropped to root for the
// admin.thehalllegacygrp.com subdomain later — just by changing this env var.
// Must start with "/" and have no trailing slash, e.g. "/admin".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  basePath: basePath || undefined,
};

export default nextConfig;
