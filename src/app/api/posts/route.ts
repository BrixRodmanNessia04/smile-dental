import { listPublishedPosts } from "@/features/posts/services/post-query.service";

export async function GET() {
  const result = await listPublishedPosts();

  if (!result.ok) {
    return Response.json({ message: result.message }, { status: 400 });
  }

  return Response.json(result.data);
}
