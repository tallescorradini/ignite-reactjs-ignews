import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import styles from "./styles.module.scss";
import { getPosts } from "../../services/prismic";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface Props {
  posts: Post[];
}

export default function Posts({ posts }: Props) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPosts();

  return {
    props: { posts },
  };
};
