import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";

import styles from "./post.module.scss";
import { getPost } from "../../services/prismic";

interface Props {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function Post({ post }: Props) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${params.slug}`,
        permanent: false,
      },
    };
  }

  const { slug } = params;
  const post = await getPost(String(slug));

  return {
    props: { post },
  };
};
