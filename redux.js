// store.ts

import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { put, takeLatest, all } from "redux-saga/effects";
import produce from "immer";

// create your reducer
const reducer = produce((state = { tick: "init" }, action) => {
    if (typeof window === "undefined") {
        if (action.type.includes("ERROR")) {
            console.log("SERVER", action);
        }
    } else {
        console.log("DISPATCHER", action.type);
    }
    switch (action.type) {
        case HYDRATE:
            // Attention! This will overwrite client state! Real apps should use proper reconciliation.
            return { ...state, ...action.payload };
        case "TICK_SUCCESS":
            state.tick = action.tick;
            return state;
        default:
            return state;
    }
});

function* saga() {
    yield all([
        takeLatest("TICK", function* (action) {
            try {
                yield put({ type: "TICK_SUCCESS", tick: action.data.value });
                action.onSuccess();
            } catch (e) {
                yield put({ type: "TICK_ERROR", message: e.message });
            }
        }),
    ]);
}

const AppAction = (global.appActions = Object.assign(
    {},
    {
        updateTick(data, callbacks) {
            return {
                type: "TICK",
                data,
                ...callbacks,
            };
        },
    }
));

export const nextPromiseAction = (store, appAction, actionData) => {
    return new Promise((resolve) => {
        const onSuccess = (data) => {
            resolve();
        };

        const onError = (err, ext) => {
            console.error(redBright("[nextPromiseAction]", appAction, err));
            if (ext) {
                console.log({ ext });
            }
            resolve({ jsonLd: [] });
        };

        const actionGetter = AppAction[appAction];

        const action = actionGetter(actionData, {
            onSuccess,
            onError,
        });

        store.dispatch(action);
    });
};

let store;

// create a makeStore function
const makeStore = (context) => {
    const isServerSide = typeof window === "undefined";

    if (store && isServerSide) {
        return store;
    }

    const sagaMiddleware = createSagaMiddleware();

    const storeConfig = {
        devTools: true,
        middleware: [sagaMiddleware],
        preloadedState: { tick: "init" },
        reducer,
    };

    store = configureStore(storeConfig);

    store.sagaTask = sagaMiddleware.run(saga);

    return store;
};

// export an assembled wrapper
export const nextReduxWrapper = createWrapper(makeStore, { debug: true });
