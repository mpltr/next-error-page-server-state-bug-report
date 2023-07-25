import "@/styles/globals.css";
import React from "react";
import App from "next/app";
import Link from "next/link";
import { nextPromiseAction, nextReduxWrapper } from "../redux";
import { useSelector } from "react-redux";

const Title = () => {
    const { tick } = useSelector((state) => state);

    return <h1>{tick}</h1>;
};

class MyApp extends React.Component {
    // Redux store is reinitialised on the client when the error page is rendered, losing the server state
    static getInitialProps = nextReduxWrapper.getInitialAppProps(
        (store) => async (context) => {
            console.log("RUNNING APP GIP");

            const ctx = await App.getInitialProps(context);
            let props = { ...ctx };

            // prevent "server only" logic running
            const isClientRuntime = typeof window !== "undefined";
            if (isClientRuntime) return props;

            // server only logic
            await nextPromiseAction(store, "updateTick", {
                value: "SERVER APP TITLE",
            });

            // example of a server only fetch
            // could be protected by CORS for example, so not suitable for client side fetching
            // const data = await fetch("https://jsonplaceholder.typicode.com/todos/1").then(res => res.json())

            return props;
        }
    );

    render() {
        const { Component, pageProps } = this.props;

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
                <Title />
                <Component {...pageProps} />
            </>
        );
    }
}

export default nextReduxWrapper.withRedux(MyApp);
