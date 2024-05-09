import Button from "~/components/Button";
import classNames from "classnames/bind";
import style from "./Login.module.scss";
import Input from "~/components/Input";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import 'animate.css';

import * as UserService from "~/service/UserService";
import { useMutationHook } from "~/hooks/useMutaionHook";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const cx = classNames.bind(style);

function Login() {
	const navigate = useNavigate();
	const location = useLocation();

	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	const mutation = useMutationHook((data) => UserService.loginUser(data));
	const { data } = mutation;

	//xu ly khi nguoi dung nhan submit
	const onsubmit = (e) => {
		e.preventDefault();
		const email = emailRef.current.value;
		const password = passwordRef.current.value;
		mutation.mutate({ email, password });
	};

	useEffect(() => {
		if (data?.status === "SUCCESS") {
			toast.success("Đăng nhập thành công!");
			localStorage.setItem("access_token", data?.access_token);
			const decoded = jwtDecode(data?.access_token);
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
	}, [data, navigate, location?.state]);

	return (
		<div className={cx("backgroundImage", 'animate__animated', 'animate__fadeIn')}>
			<div
				className={cx("inner-content", "container", "animated", "fadeInDown", "box-shadow")}
			>
				<h2 className={cx("title")}>Đăng nhập</h2>
				<form method="POST">
					{data?.status === "ERROR" && (
						<span style={{ color: "red" }}>{data?.message}</span>
					)}
					<Input
						text="Email"
						type="email"
						name="email"
						autocomplete="on"
						innerRef={emailRef}
					/>
					<Input text="Mật khẩu" type="password" name="password" innerRef={passwordRef} />

					<a className={cx("forgot-password")} href="/">
						Quên mật khẩu?
					</a>

					<Button
						primary
						styleBtn={{
							display: "flex",
							margin: "0px auto 20px auto",
							width: "420px",
							height: "50px",
							fontWeight: "500",
							fontSize: "1.2rem",
						}}
						onClick={onsubmit}
					>
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
