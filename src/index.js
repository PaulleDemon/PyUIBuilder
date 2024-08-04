import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import store from "./redux/store"
import { Provider } from "react-redux";

import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import "./styles/tailwind.css";
import "./styles/index.css";

const originalSetItem = localStorage.setItem;
// triggers itemsChaned event whenever the item in localstorage is chanegd.
localStorage.setItem = function (key, value) {

	originalSetItem.apply(this, arguments);

	const event = new Event("localStorageChange");
	window.dispatchEvent(event);
}

const dontTryErrors = [400, 401, 402, 404, 403, 405, 410, 417, 429, 500];

const queryClientConfig = {

	defaultOptions: {
		cacheTime: 20 * (60 * 1000), // 20 mins 
		queries: {
			retry: (failureCount, error) => {
				if (dontTryErrors.includes(error.response?.status) || error.response?.status >= 500) 
					//dont retry if the page returns 404 or 400
					return false;

				if (failureCount >= 3) {
					return false;
				}
				return true;
			}
		},

		mutations: {
			retry: (failureCount, error) => {

				if (dontTryErrors.includes(error.response?.status) || error.response?.status >= 500) //dont retry if the page returns 404 or 400
					//dont retry if the page returns 404 or 400 or 403 or 401
					return false;

				if (failureCount >= 3)
					return false;

				return true;
			}
		}
	}

}


const queryClient = new QueryClient(queryClientConfig)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<React.StrictMode>
            <Provider store={store}>
                <QueryClientProvider client={queryClient} >
					<App />
				</QueryClientProvider>
            </Provider>
		</React.StrictMode>
	</BrowserRouter>
);
