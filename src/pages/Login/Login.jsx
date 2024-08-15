import Button from "~/components/Button";
import classNames from "classnames/bind";
import style from "./Login.module.scss";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "animate.css";
import TextField from "@mui/material/TextField";

import * as UserService from "~/service/UserService";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useApp } from "../../context/AppProvider";
import axios from "axios";
import FacebookLogin from "react-facebook-login";

const cx = classNames.bind(style);
const clientID = "105139517728-qa77n1q8768ek3tpmi2thvd94p2lqqdh.apps.googleusercontent.com";

function Login() {
	const { setUser, setToken } = useApp();
	const navigate = useNavigate();
	const location = useLocation();
	const [data, setData] = useState();

	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	const loginGoogle = useGoogleLogin({
		onSuccess: async (response) => {
			try {
				const dataUser = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
					headers: {
						Authorization: `Bearer ${response.access_token}`,
					},
				});
				if (dataUser?.data?.email) {
					const res = await UserService.loginWithGoogle({
						email: dataUser?.data?.email,
						name: dataUser?.data?.name,
						picture: dataUser?.data?.picture,
					});
					checkLoginResult(res);
				}
			} catch (error) {
				console.log("Have an error with login google", error);
			}
		},
	});

	const responseFacebook = async (response) => {
		console.log("responseFacebook", response);
		if (response?.email) {
			const res = await UserService.loginWithFacebook({
				email: response?.email,
				name: response?.name,
				picture: response?.picture.url,
			});
			checkLoginResult(res);
		}
	};

	//xu ly khi nguoi dung nhan submit
	const onsubmit = async (e) => {
		e.preventDefault();
		const email = emailRef.current.value;
		const password = passwordRef.current.value;
		const res = await UserService.loginUser({ email, password });
		setData(res);
		checkLoginResult(res);
	};

	const checkLoginResult = (result) => {
		if (result.status === "SUCCESS") {
			toast.success("Đăng nhập thành công!");
			localStorage.setItem("access_token", result?.access_token);
			setToken(result?.access_token);
			const decoded = jwtDecode(result?.access_token);
			setUser({
				id: decoded?.id,
				isAdmin: decoded?.isAdmin,
			});
			if (location?.state) {
				setTimeout(() => {
					navigate(location?.state);
				}, 1000);
			} else {
				setTimeout(() => {
					navigate("/");
				}, 1000);
			}
		}
	};

	return (
		<GoogleOAuthProvider clientId={clientID}>
			<div className={cx("backgroundImage", "animate__animated", "animate__fadeIn")}>
				<div
					className={cx(
						"inner-content",
						"container",
						"animated",
						"fadeInDown",
						"box-shadow"
					)}
				>
					<h2 className={cx("title")}>Đăng nhập</h2>
					<form method="POST">
						{data?.status === "ERROR" && (
							<span style={{ color: "red" }}>{data?.message}</span>
						)}
						<TextField
							sx={{ margin: "20px 0" }}
							fullWidth
							label="Email"
							inputRef={emailRef}
						/>
						<TextField
							type="password"
							fullWidth
							label="Mật khẩu"
							inputRef={passwordRef}
							autoComplete="on"
						/>
						<a className={cx("forgot-password")} href="/">
							Quên mật khẩu?
						</a>
						<Button primary className={cx("login-btn")} onClick={onsubmit}>
							Đăng nhập
						</Button>
						<div className={cx("login-with")}>
							<p>Hoặc đăng nhập bằng:</p>
							<img onClick={loginGoogle} src="/assets/google-icon.webp" alt="#" />
							<span>
								<FacebookLogin
									appId="1138022350625642"
									fields="name,email,picture"
									callback={responseFacebook}
									className={cx("my-facebook-button-class")}
									textButton=""
									icon={<img src="/assets/facebook-icon.png" alt="#" />}
								/>
							</span>
						</div>

						<p className={cx("register-link")}>
							Chưa có tài khoản? <Link to="/register">Đăng ký tài khoản mới</Link>
						</p>
					</form>
				</div>
			</div>
		</GoogleOAuthProvider>
	);
}

export default Login;
