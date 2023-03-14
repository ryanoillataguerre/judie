import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import styles from "../styles/Chat.module.scss";
interface ChatPageProps {
  query?: string;
}
export default function Chat({ query }: ChatPageProps) {
  return <div className={styles.chatPageContainer}></div>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Get query parameter "query" and pass in as a prop
  const query = context.query.query;
  return {
    props: {
      query,
    },
  };
}
