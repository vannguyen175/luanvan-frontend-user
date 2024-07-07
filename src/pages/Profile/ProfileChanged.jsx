import classNames from "classnames/bind";
import style from "./Profile.module.scss";
import Button from "~/components/Button";
import Modal from "react-bootstrap/Modal";
import Input from "../../components/Input";
import { useState } from "react";

const cx = classNames.bind(style);
function Profilechanged({ data, onHide }) {
	console.log(data);
	const [profile, setProfile] = useState({
		name: data.user.name,
		email: data.user.email,
		isAdmin: data.user.isAdmin,
		phone: data.address.phone,
		adsress: data.address.adsress,
		avatar: data.user.avatar,
		rating: data.user.rating,
	});

	const handleOnchangeName = (e) => {
		setProfile(e.target.value);
	};

	return (
		<Modal {...data} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
			<Modal.Body style={{ margin: "auto" }}>
				<p className={cx("title")} style={{ margin: "20px" }}>
					Chỉnh sửa thông tin tài khoản
				</p>

				<form method="POST">
					<Input
						text="Tên tài khoản"
						value={data.user.name || ""}
						handleOnChange={handleOnchangeName}
					/>
					<Input type="email" text="Email" value={data.user.email || ""} />
					<Input text="Số điện thoại" value={data.address.phone || ""} />
					<Input textarea="textarea" text="Địa chỉ" value={data.address.address || ""} />
					<Input type="file" text="Ảnh đại diện" />
				</form>
			</Modal.Body>
			<Modal.Footer style={{ marginRight: "60px" }}>
				<Button onClick={onHide}>Thoát</Button>
				<Button primary onClick={onHide}>
					Lưu thay đổi
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default Profilechanged;
