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

const cx = classNames.bind(style);

function Login() {
	const navigate = useNavigate();
	const location = useLocation();
	const [data, setData] = useState();

	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	//xu ly khi nguoi dung nhan submit
	const onsubmit = async (e) => {
		e.preventDefault();
		const email = emailRef.current.value;
		const password = passwordRef.current.value;
		const res = await UserService.loginUser({ email, password });
		setData(res);
		if (res?.status === "SUCCESS") {
			toast.success("Đăng nhập thành công!");
			localStorage.setItem("access_token", res?.access_token);
			const decoded = jwtDecode(res?.access_token);
			localStorage.setItem("id_user", decoded?.id);
			localStorage.setItem("isAdmin", decoded?.isAdmin);
			localStorage.setItem("avatar", decoded?.avatar || "assets/images/user-avatar.jpg");
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
		<div className={cx("backgroundImage", "animate__animated", "animate__fadeIn")}>
			<div
				className={cx("inner-content", "container", "animated", "fadeInDown", "box-shadow")}
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
					<TextField type="password" fullWidth label="Mật khẩu" inputRef={passwordRef} />

					<a className={cx("forgot-password")} href="/">
						Quên mật khẩu?
					</a>

					<Button primary className={cx("login-btn")} onClick={onsubmit}>
						Đăng nhập
					</Button>

					<p className={cx("register-link")}>
						Chưa có tài khoản? <Link to="/register">Đăng ký tài khoản mới</Link>
					</p>
				</form>
			</div>
		</div>
	);
}

export default Login;
