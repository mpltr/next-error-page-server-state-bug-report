import styles from "@/styles/Home.module.css";

export default function Secondary() {
    return (
        <>
            <div className={styles.container}>
                Secondary Page Content (Uses getInitialProps)
            </div>
        </>
    );
}

export const getInitialProps = async (context) => {
    return { props: {} };
};
