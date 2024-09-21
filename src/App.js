import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import NotFoundPage from "~/pages/NotFoundPage/NotFoundPage";
import ScrollToTop from "./scrollToTop";
import { gapi } from "gapi-script";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { useApp } from "./context/AppProvider";

const clientID = "105139517728-qa77n1q8768ek3tpmi2thvd94p2lqqdh.apps.googleusercontent.com";

export function App() {
	const { token, user, socket, setSocket } = useApp();

	//login with google
	useEffect(() => {
		function start() {
			gapi.client.init({
				clientID: clientID,
				scope: "",
			});
		}
		gapi.load("client:auth2", start);
	}, []);

	useEffect(() => {
		setSocket(io("http://localhost:5000"));
	}, []);

	useEffect(() => {
		if (token) {
			const decoded = jwtDecode(token);
			socket?.emit("newUser", decoded?.id);
		}
		if (socket) {
			socket.on("connect", () => {
				//console.log("Socket.IO successfully connected!", socket);
				setSocket(socket);
			});
		}
	}, [socket, token, user]);

	return (
		<div>
			<GoogleOAuthProvider clientId={clientID}>
				<Router>
					<ScrollToTop />
					<Routes>
						{routes.map((route, index) => {
							let Page = route.page;
							const Layout = route.layout;
							const isCheckAuth = !route.isPrivate;
							return (
								<Route
									key={index}
									exact
									path={isCheckAuth === true ? route.path : "*"}
									element={
										<Layout>
											{isCheckAuth === true ? <Page /> : <NotFoundPage />}
										</Layout>
									}
								/>
							);
						})}
					</Routes>
				</Router>
			</GoogleOAuthProvider>
		</div>
	);
}

export default App;
