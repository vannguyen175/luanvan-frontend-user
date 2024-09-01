import classNames from "classnames/bind";
import style from "./Notification.module.scss";
import * as notificationService from "~/service/NotificationService";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import { useEffect, useState } from "react";
import { useApp } from "~/context/AppProvider";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(style);

function Notification() {
	const { socket } = useApp();
	const [notifications, setNotifications] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const [unseenCount, setUnseenCount] = useState(null);
	const navigate = useNavigate();

	const getNoti = async () => {
		const res = await notificationService.getNotification({
			user: localStorage.getItem("id_user"),
		});
		setNotifications(res?.data?.info);
		setUnseenCount(res.unseenCount);
	};

	useEffect(() => {
		const addNoti = async (product, image, navigate, message) => {
			const res = await notificationService.addNotification({
				user: localStorage.getItem("id_user"),
				info: {
					product: product,
					image: image,
					navigate: navigate,
					message: message,
				},
			});
			setNotifications(res.data.info);
			setUnseenCount(res.unseenCount);
		};

		getNoti();
		console.log("socket on");

		socket?.on("getNotification", (data) => {
			console.log("getNotification", data);

			if (data.message) {
				console.log("data =>", data);
				addNoti(data.product, data.image, data.navigate, data.message);
			}
		});
	}, [socket]);

	const handleShowNotification = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	const handleClickNoti = async (info) => {
		if (info.isSeen === false) {
			//chuyển thông báo sang trạng thái "đã xem"
			await notificationService.updateNotification({
				user: localStorage.getItem("id_user"),
				infoID: info._id,
			});
			getNoti(); //cập nhật lại list thông báo
		}
		navigate(`/detail-product/${info.product}`);
		setAnchorEl(null);
	};

	return (
		<div className={cx("notification-icon")}>
			<Badge
				badgeContent={unseenCount > 0 ? unseenCount : 0}
				invisible={unseenCount === 0}
				color="primary"
				className={cx("icon-button")}
			>
				<NotificationsIcon onClick={handleShowNotification} />
			</Badge>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={() => {
					setAnchorEl(null);
				}}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				PaperProps={{
					style: {
						padding: "5px",
						borderRadius: "8px",
						boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
					},
				}}
			>
				<div>
					<h4 style={{ margin: "5px 0 10px 10px" }}>Thông báo</h4>
					{notifications?.length === 0 ? (
						<div className={cx("noNotification")}>Không có thông báo.</div>
					) : (
						<div className={cx("haveNotification")}>
							{notifications?.map((item, index) => (
								<div
									key={index}
									className={cx(item.isSeen ? "" : "unSeen")}
									onClick={() => handleClickNoti(item)}
								>
									<img src={item.image} alt="anh" />
									<span>{item.message}</span>
								</div>
							))}
						</div>
					)}
				</div>
			</Popover>
		</div>
	);
}

export default Notification;
