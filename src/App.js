import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import NotFoundPage from "~/pages/NotFoundPage/NotFoundPage";
import ScrollToTop from "./scrollToTop";
import { gapi } from "gapi-script";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useApp } from "./context/AppProvider";
import Chatbox from "./components/Chatbox";
import socket from "./socket";

const clientID = "105139517728-qa77n1q8768ek3tpmi2thvd94p2lqqdh.apps.googleusercontent.com";

export function App() {
	const { token, user, setSocket, chatbox, setChatbox } = useApp();

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
		//lắng nghe sự kiện phía server
		socket.on("getId", (data) => {});

		socket.on("sendMessageServer", (dataGot) => {
			if (chatbox !== dataGot.data.sender) {
				setChatbox(dataGot.data.sender);
			}
		});
	}, []);

	// useEffect(() => {
	// 	if (token) {
	// 		const decoded = jwtDecode(token);
	// 		socket?.emit("newUser", decoded?.id);
	// 	}
	// 	if (socket) {
	// 		socket.on("connect", () => {
	// 			//console.log("Socket.IO successfully connected!", socket);
	// 			setSocket(socket);
	// 		});
	// 	}
	// }, [socket, token, user]);

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
											{chatbox && <Chatbox receiverID={chatbox} />}
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
