import Button from "~/components/Button";
import classNames from "classnames/bind";
import style from "./Register.module.scss";
import Input from "~/components/Input";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as UserService from "../../service/UserService";
import TextField from "@mui/material/TextField";

import { useMutationHook } from "../../hooks/useMutaionHook";
import { toast } from "react-toastify";

const cx = classNames.bind(style);

function Register() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [phone, setPhone] = useState("");

	const mutation = useMutationHook((data) => UserService.registerUser(data));
	const { data } = mutation;

	const handleOnchangeName = (e) => {
		setName(e.target.value);
	};
	const handleOnchangeEmail = (e) => {
		setEmail(e.target.value);
	};
	const handleOnchangePassword = (e) => {
		setPassword(e.target.value);
	};
	const handleOnchangeConfirmPassword = (e) => {
		setConfirmPassword(e.target.value);
	};
	const handleOnchangePhoneNumber = (e) => {
		setPhone(e.target.value);
	};

	useEffect(() => {
		if (data?.status === "SUCCESS") {
			toast.success("Đăng ký tài khoản thành công!");
			setTimeout(() => {
				navigate("/login");
			}, 1000);
		}
	}, [data, navigate]);

	const onsubmit = (e) => {
		//console.log('inputRef.current.value', inputRef.current.value);
		mutation.mutate({ name, email, password, confirmPassword, phone });
		e.preventDefault();
	};
	return (
		<div className={cx("backgroundImage", "animate__animated", "animate__fadeIn")}>
			<div className={cx("inner-content", "container", "animated", "fadeInDown")}>
				<h2 className={cx("title")}>Đăng ký tài khoản</h2>
				<form action="" method="POST">
					{data?.status === "ERROR" && (
						<span style={{ color: "red" }}>{data?.message}</span>
					)}
					<TextField
						sx={{ margin: "10px 0" }}
						fullWidth
						label="Email"
						handleOnChange={handleOnchangeName}
					/>
					<TextField
						sx={{ margin: "10px 0" }}
						fullWidth
						label="Tên tài khoản"
						handleOnChange={handleOnchangeEmail}
					/>
					<TextField
						sx={{ margin: "10px 0" }}
						fullWidth
						label="Số điện thoại"
						handleOnChange={handleOnchangePhoneNumber}
					/>
					<TextField
						sx={{ margin: "10px 0" }}
						fullWidth
						label="Mật khẩu"
						type="password"
						handleOnChange={handleOnchangePassword}
					/>
					<TextField
						sx={{ margin: "10px 0" }}
						fullWidth
						label="Nhập lại mật khẩu"
						type="password"
						handleOnChange={handleOnchangeConfirmPassword}
					/>

					<Button
						primary
						styleBtn={{
							display: "flex",
							margin: "30px auto",
							width: "420px",
							height: "50px",
							fontWeight: "500",
							fontSize: "1.2rem",
						}}
						onClick={onsubmit}
					>
						Đăng ký
					</Button>
					<p className={cx("register-link")}>
						Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
					</p>
				</form>
			</div>
		</div>
	);
}

export default Register;
