import styles from "@/styles/Home.module.css";

export default function Tertiary() {
    const does = {};
    return (
        <>
            {/* this will throw an error */}
            {does.not.exist}
            <div className={styles.container}>Tertiary Page Content</div>;
        </>
    );
}

export const getServerSideProps = async (context) => {
    return { props: {} };
};
