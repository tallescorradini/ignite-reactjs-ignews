import * as prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

// Create a client
const repositoryName = process.env.PRISMIC_REPO_NAME;
const endpoint = prismic.getEndpoint(repositoryName);
const client = prismic.createClient(endpoint, {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
});

// Query for all Page documents
export async function getPosts() {
  const response = await client.get({
    predicates: prismic.predicate.at("document.type", "post"),
  });

  const posts = response.results.map((post) => ({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    excerpt:
      post.data.content.find((content) => content.type === "paragraph")?.text ??
      "",
    updatedAt: new Date(post.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  }));

  return posts;
}

// // Or query for a specific document
// const blogPost = await client.getByUID("blog_post", "hello-world");
