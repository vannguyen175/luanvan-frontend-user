import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		primary: {
			main: "#aaa86f",
		},
	},
});

const root = ReactDOM.createRoot(document.getElementById("root"));
// Create a client
const queryClient = new QueryClient();
root.render(
	<QueryClientProvider client={queryClient}>
		<ThemeProvider theme={theme}>
			<ToastContainer
				hideProgressBar
				position="top-center"
				transition={Flip}
				autoClose={2000}
			/>
			<App />
		</ThemeProvider>
		<ReactQueryDevtools initialIsOpen={false} />
	</QueryClientProvider>
);
reportWebVitals();
