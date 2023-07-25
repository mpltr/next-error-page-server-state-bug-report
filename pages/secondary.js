import styles from "@/styles/Home.module.css";

// This page is used to confirm Secondary.getInitialProps function will not run on the client
// when serverside rendering. It represents the expected behaviour of the error page
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
