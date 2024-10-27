import { useApp } from "~/context/AppProvider";
import ReactTimeAgo from "react-time-ago";
import moment from "moment";
import { Link } from "react-router-dom";
import * as userService from "../../service/UserService";
import { useEffect, useState } from "react";

function BlockAccount() {
	const { user } = useApp();
	const idUser = localStorage.getItem("id_user");

	const [detail, setDetail] = useState({
		isBlocked: false,
		blockExpireDate: "",
		blockReason: "",
	});

	const checkUserBanned = async () => {
		const res = await userService.checkUserBanned(idUser);
		if (res.status === "BLOCKED") {
			setDetail({
				isBlocked: true,
				blockExpireDate: res.blockExpireDate,
				blockReason: res.blockReason,
			});
		}
	};

	useEffect(() => {
		checkUserBanned();
	}, []);

	return (
		<div
			style={{
				background: "white",
				minHeight: "100vh",
				textAlign: "center",
				paddingTop: 100,
				color: "red",
			}}
		>
			{detail.isBlocked && (
				<>
					<h2>Tài khoản của bạn đã bị khóa tạm thời.</h2>
					<h5>Lý do: {detail.blockReason}</h5>
					<h5>
						Thời gian mở khóa:{" "}
						{moment(detail.blockExpireDate).format("hh:mm, DD-MM-YYYY")} (
						<ReactTimeAgo date={Date.parse(detail.blockExpireDate)} locale="vi-VN" />)
					</h5>
					<Link to={"/login"} style={{ display: "inline-block", marginTop: 30 }}>
						Quay về trang đăng nhập
					</Link>
				</>
			)}
		</div>
	);
}

export default BlockAccount;
