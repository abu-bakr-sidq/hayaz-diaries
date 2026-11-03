import { cacheLife } from "next/cache";
import { profile } from "@/content/profile";

export type InstagramStats = { followers: number; posts: number };

/**
 * Follower and post counts for @hayaz_diaries_.
 *
 * With INSTAGRAM_ACCESS_TOKEN set (a long-lived token from the Instagram API
 * with Instagram Login, for her professional account) the numbers come from
 * Instagram and refresh about once an hour. Without it — or if Instagram is
 * down or the token has expired — the fallback in content/profile.ts is used.
 */
export async function getInstagramStats(): Promise<InstagramStats> {
  "use cache";
  cacheLife("hours");

  const fallback = { followers: profile.instagram.followers, posts: profile.instagram.posts };
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return fallback;

  try {
    const res = await fetch(`https://graph.instagram.com/me?fields=followers_count,media_count&access_token=${encodeURIComponent(token)}`);
    if (!res.ok) return fallback;
    const data: { followers_count?: number; media_count?: number } = await res.json();
    return {
      followers: data.followers_count ?? fallback.followers,
      posts: data.media_count ?? fallback.posts,
    };
  } catch {
    return fallback;
  }
}
