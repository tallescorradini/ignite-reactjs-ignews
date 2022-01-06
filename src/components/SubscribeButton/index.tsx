import styles from "./styles.module.scss";

interface Props {
  priceId: string;
}

export function SubscribeButton({ priceId }: Props) {
  return <button className={styles.subscribeButton}>Subscribe now</button>;
}
