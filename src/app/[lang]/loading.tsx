import LoadingClient from "./LoadingClient";

/**
 * Loading component for localized routes.
 * Acts as a lightweight shell that avoids dynamic functions (headers, cookies)
 * to prevent React Error #419 in Next.js 15 Suspense boundaries.
 */
export default function Loading() {
  return <LoadingClient />;
}
