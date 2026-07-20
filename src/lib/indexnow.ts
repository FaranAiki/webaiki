const INDEXNOW_KEY = "db704865e1924ab39875da0d14ac0b6a";
const HOST = "faranaiki.id";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

export const INDEXNOW_HOST = HOST;
export const INDEXNOW_KEY_LOCATION = KEY_LOCATION;

/**
 * Submits one or more URLs to the IndexNow API (Bing, Yandex, Naver, Seznam).
 * Failures are swallowed so callers can fire-and-forget without breaking the request.
 */
export async function submitIndexNow(urls: string[]): Promise<boolean> {
  const unique = Array.from(new Set(urls.filter((u): u is string => Boolean(u))));
  if (unique.length === 0) return false;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: unique,
      }),
    });

    if (!res.ok) {
      console.error("[indexnow] submission failed:", res.status, await res.text().catch(() => ""));
    }

    return res.ok;
  } catch (error) {
    console.error("[indexnow] network error:", error);
    return false;
  }
}
