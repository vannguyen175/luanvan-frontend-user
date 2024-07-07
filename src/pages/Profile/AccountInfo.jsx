import Button from "~/components/Button";
import { Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import style from "./Profile.module.scss";
import * as UserService from "~/service/UserService";
import Profilechanged from "./ProfileChanged";
import { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";

const cx = classNames.bind(style);

function AccountInfo() {
	const id = localStorage.getItem("id_user");
	const token = localStorage.getItem("access_token");
	const [modalShow, setModalShow] = useState(false);
	const [userProfile, setUserProfile] = useState();

	const getUserDetail = async () => {
		const res = await UserService.getDetailUser(id, token);
		setUserProfile({
			user: res.user,
			address: res.address,
		});
		console.log(res);
	};

	async function detailsUser() {
		const id = localStorage.getItem("id_user");
		const token = localStorage.getItem("access_token");
		await UserService.getDetailUser(id, token).then((data) => {
			setUserProfile({
				name: data.result.name,
				email: data.result.email,
				isAdmin: data.result.isAdmin || "Người dùng / Người bán hàng",
				phone: data.result.phone || "Chưa có",
				adsress: data.result.address || "Chưa có",
				avatar: data.result.avatar,
				rating: data.result.rating || "Chưa có",
			});
		});
	}

	useEffect(() => {
		getUserDetail();
	}, []);

	return (
		<div>
			<div className={cx("right")}>
				<div className={cx("inner-content", "info-user")}>
					<p className="title">Thông tin người dùng</p>
					<p className={cx("edit-btn")}>
						<Button onClick={() => setModalShow(true)}>
							<EditOutlined /> Chỉnh sửa
						</Button>
					</p>
					{userProfile?.user && (
						<Profilechanged
							show={modalShow}
							onHide={() => setModalShow(false)}
							data={userProfile}
						/>
					)}
					<Row>
						<Col xs={2}>
							<div className={cx("avatar")}>
								{userProfile?.user.avatar ? (
									<img src={userProfile?.user.avatar} alt="anh-dai-dien" />
								) : (
									<img src="/assets/images/user-avatar.jpg" alt="anh-dai-dien" />
								)}
							</div>
						</Col>
						<Col>
							<p className={cx("name")}>{userProfile?.name}</p>
							<div className={cx("info")}>
								<p>
									Vai trò
									<span>
										{userProfile?.user.isAdmin === true
											? "Quản trị viên"
											: "Người dùng"}
									</span>
								</p>
								<p>
									Số điện thoại
									<span>{userProfile?.address.phone}</span>
								</p>
								<p>
									Địa chỉ email
									<span>{userProfile?.user.email}</span>
								</p>
							</div>
						</Col>
					</Row>
				</div>

				<div className={cx("inner-content", "info-activity")}>
					<div className={cx("brought-history")}>
						<p className={cx("title")}>Lịch sử mua hàng</p>
						{/* {orders && <Table columns={columns} dataSource={DetailData} />} */}
					</div>
				</div>
			</div>
		</div>
	);
}

export default AccountInfo;
