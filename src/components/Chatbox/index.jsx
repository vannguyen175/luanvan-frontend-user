import classNames from "classnames/bind";
import style from "./Chatbox.module.scss";
import { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import * as UserService from "~/service/UserService";
import * as MessageService from "~/service/MessageService";
import socket from "../../socket";
import { useApp } from "~/context/AppProvider";
import ClearIcon from "@mui/icons-material/Clear";
import Badge from "@mui/material/Badge";
import RemoveIcon from "@mui/icons-material/Remove";

const cx = classNames.bind(style);

function Chatbox() {
	const idUser = localStorage.getItem("id_user");
	const { chatbox, setChatbox } = useApp(); //chatbox chứa id đối phương nhận tin nhắn

	const [open, setOpen] = useState(false);
	const [mess, setMess] = useState([]);
	const [receiveInfo, setReceiveInfo] = useState({
		name: null,
		avatar: null,
	});

	const messagesEnd = useRef();
	const msgRef = useRef();

	const getInfoReceiver = async () => {
		const res = await UserService.getInfoUser(chatbox);
		if (res.status === "OK") {
			setReceiveInfo({
				name: res.data.name,
				avatar: res.data.avatar,
			});
		}
	};

	const getDataChat = async (idUser, chatbox) => {
		const res = await MessageService.getChat(idUser, chatbox);
		if (res.status === "SUCCESS") {
			setMess(res.data.message);
		}
	};

	useEffect(() => {
		if (chatbox) {
			//lấy tên, avatar người nhận message
			getInfoReceiver();
			getDataChat(idUser, chatbox);
		}
	}, [chatbox]);

	useEffect(() => {
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
		const message = msgRef.current.value.trim();
		if (message !== null && message !== "") {
			const msg = {
				content: message,
				sender: idUser, //id người gửi
				receiver: chatbox, //id người nhận
			};
			setMess((oldMsgs) => [...oldMsgs, msg]);
			socket.emit("sendMessageClient", msg);
			msgRef.current.value = null;
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
			<Badge color="primary" variant="dot" overlap="circular">
				<img
					onClick={() => setOpen(!open)}
					className={cx("avatar")}
					src={receiveInfo.avatar}
					alt="avatar"
				/>
			</Badge>

			{open && (
				<div className={cx("box-chat")}>
					<div className={cx("header")}>
						<img src={receiveInfo.avatar} alt="avatar" />
						{receiveInfo.name}
						<ClearIcon className={cx("close-chat")} onClick={() => setChatbox()} />
						<RemoveIcon className={cx("hide-chat")} onClick={() => setOpen(false)} />
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
