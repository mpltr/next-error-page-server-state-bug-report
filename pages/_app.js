import "@/styles/globals.css";
import App from "next/app";
import Link from "next/link";

export default function MyApp({ Component, pageProps }) {
    const { title } = pageProps;

    return (
        <>
            <nav>
                <div>
                    <Link href="/">Home</Link>
                </div>
                <div>
                    <Link href="/secondary">Secondary</Link>
                </div>
                <div>
                    <Link href="/tertiary">Tertiary (with error)</Link>
                </div>
            </nav>
            <h1>{title}</h1>
            <Component {...pageProps} />
        </>
    );
}

MyApp.getInitialProps = async (context) => {
    console.log("RUNNING APP GIP");

    const ctx = await App.getInitialProps(context);
    let props = { ...ctx };

    // prevent "server only" logic running
    const isClientRuntime = typeof window !== "undefined";
    if (isClientRuntime) return props;

    // server only logic
    props.pageProps.title = "SERVER APP TITLE";

    // example of a server only fetch
    // could be protected by CORS for example, so not suitable for client side fetching
    // const data = await fetch("https://jsonplaceholder.typicode.com/todos/1").then(res => res.json())

    return props;
};
