import Head from "next/head";
import { GetStaticProps } from "next";

import { SubscribeButton } from "../components/SubscribeButton";
import styles from "./home.module.scss";
import { stripe } from "../services/stripe";

interface Props {
  product: {
    priceId: string;
    amount: string;
  };
}

export default function Home({ product }: Props) {
  return (
    <>
      <Head>
        <title> Home | Ig.news</title>
      </Head>
      <header>
        <h1>Hello world</h1>
      </header>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} a month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img
          src="/images/avatar.svg"
          alt="Girl sitting behind a desk coding on a laptop"
        />
      </main>
    </>
  );
}

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1KF4LYEKHf9HSzDLhjJ1rQjh", {
    expand: ["product"],
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: { product },
    revalidate: ONE_DAY_IN_SECONDS,
  };
};
