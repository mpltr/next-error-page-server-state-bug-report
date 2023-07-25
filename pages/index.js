import styles from "@/styles/Home.module.css";

export default function Home() {
    return <div className={styles.container}>Home Page Content</div>;
}

export const getServerSideProps = async (context) => {
    return { props: {} };
};
