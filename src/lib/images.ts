// Hosts we control and that Next.js/Vercel's image optimizer can reliably
// fetch and resize. Anything else (e.g. a link an admin pastes in from an
// arbitrary site) is served unoptimized — Vercel's hosted Image Optimization
// rejects broad external domains even when next.config.ts's remotePatterns
// technically allows them (error: OPTIMIZED_EXTERNAL_IMAGE_REQUEST_UNAUTHORIZED).
const OPTIMIZED_HOSTS = ["ufs.sh", "cdn.sanity.io"];

export function isOptimizableImageUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return OPTIMIZED_HOSTS.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`),
    );
  } catch {
    return false;
  }
}
