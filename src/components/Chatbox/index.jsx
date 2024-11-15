import classNames from "classnames/bind";
import style from "./Chatbox.module.scss";
import { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import * as UserService from "~/service/UserService";
import socket from "../../socket";

const cx = classNames.bind(style);

function Chatbox({ receiverID }) {
	const idUser = localStorage.getItem("id_user");

	const [open, setOpen] = useState(true);
	const [mess, setMess] = useState([]);
	const [receiveInfo, setReceiveInfo] = useState({
		name: null,
		avatar: null,
	});

	const messagesEnd = useRef();
	const msgRef = useRef();

	const getInfoReceiver = async () => {
		const res = await UserService.getInfoUser(receiverID);
		if (res.status === "OK") {
			setReceiveInfo({
				name: res.data.name,
				avatar: res.data.avatar,
			});
		}
	};

	useEffect(() => {
		//lấy tên, avatar người nhận message
		if (receiverID) {
			getInfoReceiver();
		}

		//lắng nghe sự kiện phía server
		socket.on("sendMessageServer", (dataGot) => {
			setMess((oldMsgs) => [...oldMsgs, dataGot.data]);
			scrollToBottom();
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const sendMessage = () => {
		const message = msgRef.current.value;
		if (message !== null) {
			const msg = {
				content: message,
				sender: idUser, //id người gửi
				receiver: receiverID, //id người nhận
			};
			setMess((oldMsgs) => [...oldMsgs, msg]);
			socket.emit("sendMessageClient", msg);
			msgRef.current.value = "";
		}
	};

	const scrollToBottom = () => {
		if (open) {
			messagesEnd.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	const renderMess = mess.map((m, index) => (
		<div
			key={index}
			className={cx(m.sender === idUser ? "your-message" : "other-people", "chat-item")}
		>
			{m.content}
		</div>
	));

	const onEnterPress = (e) => {
		if (e.keyCode === 13 && e.shiftKey === false) {
			sendMessage();
		}
	};

	return (
		<div>
			<img
				onClick={() => setOpen(!open)}
				className={cx("avatar")}
				src="/assets/images/user-avatar.jpg"
				alt="avatar"
			/>
			{open && (
				<div className={cx("box-chat")}>
					<div className={cx("header")}>
						<img src={receiveInfo.avatar} alt="avatar" />
						{receiveInfo.name}
					</div>
					<div className={cx("box-chat_message")}>
						{renderMess}
						<div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
					</div>

					<div className={cx("send-box")}>
						<textarea
							ref={msgRef}
							onKeyDown={onEnterPress}
							placeholder="Nhập tin nhắn ..."
						/>

						<button onClick={sendMessage}>
							<SendIcon />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Chatbox;
