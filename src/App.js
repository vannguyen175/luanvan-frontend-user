import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import NotFoundPage from "~/pages/NotFoundPage/NotFoundPage";
import ScrollToTop from "./scrollToTop";
import { gapi } from "gapi-script";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProvider } from "~/context/AppProvider";

const clientID = "105139517728-qa77n1q8768ek3tpmi2thvd94p2lqqdh.apps.googleusercontent.com";

export function App() {
	//login with google
	useEffect(() => {
		function start() {
			gapi.client.init({
				clientID: clientID,
				scope: "",
			});
		}
		gapi.load("client:auth2", start);
	});

	return (
		<div>
			<AppProvider>
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
										<GoogleOAuthProvider clientId={clientID}>
											<Layout>
												{isCheckAuth === true ? <Page /> : <NotFoundPage />}
											</Layout>
										</GoogleOAuthProvider>
									}
								/>
							);
						})}
					</Routes>
				</Router>
			</AppProvider>
		</div>
	);
}

export default App;
