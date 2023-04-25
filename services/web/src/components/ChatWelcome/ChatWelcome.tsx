import SubjectSelector from "../SubjectSelector/SubjectSelector";
import styles from "./ChatWelcome.module.scss";

const ChatWelcome = ({
  selectSubject,
}: {
  selectSubject: (subject: string) => void;
}) => {
  return (
    <div className={styles.welcome}>
      <h1 className={styles.welcomeText}>Welcome to Judie!</h1>
      <p className={styles.welcomeSubtext}>
        Select a subject below to increase the degree of focus in Judie's
        answers
      </p>
      <SubjectSelector selectSubject={selectSubject} />
    </div>
  );
};

export default ChatWelcome;
