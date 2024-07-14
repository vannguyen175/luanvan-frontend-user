import Button from "~/components/Button";
import { Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import style from "./Profile.module.scss";
import * as UserService from "~/service/UserService";
import * as OrderService from "~/service/OrderService";
import Profilechanged from "./ProfileChanged";
import { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Table, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import Modal from "~/components/Modal";
import Description from "../../components/Description/Description";
import { toast } from "react-toastify";

const cx = classNames.bind(style);

function ManagerOrder() {
	const [modalShow, setModalShow] = useState(false);
	const [updateOpen, setUpdateOpen] = useState(false); //open modal
	const [userProfile, setUserProfile] = useState({
		name: "",
		email: "",
		isAdmin: "",
		phone: "",
		adsress: "",
		avatar: "",
		rating: "",
	});
	let filterStateOrder = "all";
	const [stateOrder, setStateOrder] = useState("");

	const [detailOrder, setDetailOrder] = useState({
		nameProduct: "",
		nameBuyer: "",
		paymentMethod: "",
		totalPrice: "",
		stateOrder: "all",
	});

	const getSellerOrder = async () => {
		const res = await OrderService.getSellerOrder({
			stateOrder: filterStateOrder,
			id: localStorage.getItem("id_user"),
		});
		return res.data;
	};

	//lấy thông tin order khi vừa truy cập hoặc reload trang
	const queryOrder = useQuery({
		queryKey: ["user-order"],
		queryFn: getSellerOrder,
		refetchOnWindowFocus: true,
		enabled: true,
	});
	const { data: orders, refetch: refetchOrder } = queryOrder;

	//show thông tin bảng khi reload
	const DetailData = orders?.map((order) => {
		return {
			...order?._doc,
			stateOrder:
				order._doc?.stateOrder === "waiting"
					? "Chưa duyệt"
					: order._doc?.stateOrder === "approved"
					? "Đã duyệt"
					: "Hủy",
			paymentMethod: order._doc?.paymentMethod === "cash" ? "Tiền mặt" : "Ngân hàng",
			buyerInfos: order?.buyerName,
			key: order._doc?._id,
		};
	});

	//Khi Nhà bán hàng nhấn vào biểu tượng edit (get data + show modal)
	const handleShowUpdateModal = (record) => {
		setUpdateOpen(true);
		setDetailOrder({
			id: record._id,
			nameProduct: record.orderItems?.name,
			nameBuyer: record.buyer,
			paymentMethod: record.paymentMethod,
			totalPrice: record.totalPrice,
			stateOrder: record.stateOrder,
		});
	};

	const renderAction = (record) => {
		return (
			<div>
				<EditOutlined
					style={{ color: "brown", margin: "0px 20px" }}
					onClick={() => handleShowUpdateModal(record)}
				/>
			</div>
		);
	};

	const columns = [
		{
			title: "Tên",
			dataIndex: "orderItems",
			key: "product",
			render: (orderItems) => orderItems?.name,
		},
		{
			title: "Người mua",
			dataIndex: "buyerInfos",
			key: "buyerInfos",
		},
		{
			title: "Hình thức thanh toán",
			dataIndex: "paymentMethod",
			key: "paymentMethod",
		},
		{
			title: "Giá tiền",
			dataIndex: "totalPrice",
			key: "price",
			render: (totalPrice) => `${Intl.NumberFormat().format(totalPrice)}đ`,
		},
		{
			title: "Trạng thái",
			dataIndex: "stateOrder",
			key: "stateOrder",
			render: (_, { stateOrder }) => (
				<>
					<Tag
						color={
							stateOrder === "Đã duyệt"
								? "green"
								: stateOrder === "Chưa duyệt"
								? "gold"
								: "volcano"
						}
						key={stateOrder}
					>
						{stateOrder}
					</Tag>
				</>
			),
		},
		{
			title: "Chỉnh sửa",
			key: "action",
			render: (_, record) => renderAction(record),
		},
	];

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
		detailsUser();
	}, []);

	//cancel modal
	const handleCancel = () => {
		setUpdateOpen(false);
	};

	const handleChangeState = (e) => {
		setStateOrder(e.target.value);
	};

	const handleUpdate = async (e) => {
		const result = await OrderService.updateOrder(
			{
				stateOrder: stateOrder,
			},
			detailOrder.id
		);
		if (result?.status === "OK") {
			toast.success("Cập nhật thành công!");
			refetchOrder();
			setTimeout(() => {
				handleCancel();
			}, 1000);
		}
		e.preventDefault();
	};

	const changeFilterState = (e) => {
		filterStateOrder = e.target.value;
		refetchOrder();
	};

	return (
		<div>
			<div className={cx("right")}>
				<div className={cx("inner-content", "info-user")}>
					<p className="title">Thông tin Nhà bán hàng</p>
					<p className={cx("edit-btn")}>
						<Button onClick={() => setModalShow(true)}>
							<EditOutlined /> Chỉnh sửa
						</Button>
					</p>
					<Profilechanged
						show={modalShow}
						onHide={() => setModalShow(false)}
						data={userProfile}
					/>
					<Row>
						<Col xs={2}>
							<div className={cx("avatar")}>
								{userProfile?.avatar ? (
									<img src={userProfile?.avatar} alt="anh-dai-dien" />
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
										{userProfile?.isAdmin === true
											? "Quản trị viên"
											: "Người dùng"}
									</span>
								</p>
								<p>
									Số điện thoại
									<span>{userProfile?.phone}</span>
								</p>
								<p>
									Địa chỉ email
									<span>{userProfile?.email}</span>
								</p>
							</div>
						</Col>
					</Row>
				</div>

				<div className={cx("inner-content", "info-activity")}>
					<div className={cx("brought-history")}>
						<p className={cx("title")}>Lịch sử bán hàng</p>
						<select
							onChange={changeFilterState}
							style={{ padding: "5px 10px", float: "right" }}
						>
							<option value="all">Tất cả</option>
							<option value="waiting">Chưa duyệt</option>
							<option value="approved">Đã duyệt</option>
							<option value="reject">Từ chối</option>
						</select>
						{orders && <Table columns={columns} dataSource={DetailData} />}
					</div>
				</div>
				<Modal
					title="Cập nhật đơn hàng"
					open={updateOpen}
					onCancel={handleCancel}
					width="650px"
					footer={[
						<Button key="cancel" type="primary" onClick={handleCancel}>
							Thoát
						</Button>,
						<Button type="submit" key="update" primary onClick={handleUpdate}>
							Cập nhật
						</Button>,
					]}
				>
					<div className={cx("update-modal")} style={{ marginTop: 20, padding: 20 }}>
						<Description label="ID" infor={detailOrder.id} oneLine />
						<Description label="Tên sản phẩm" infor={detailOrder.nameProduct} oneLine />
						<Description
							label="Hình thức mua hàng"
							infor={detailOrder.paymentMethod}
							oneLine
						/>
						<Description
							label="Giá tiền"
							infor={`${Intl.NumberFormat().format(detailOrder.totalPrice)}đ`}
							oneLine
						/>
						<span style={{ marginRight: 10 }}>Trạng thái đơn hàng</span>
						{detailOrder.stateOrder === "Chưa duyệt" ? (
							<select
								onChange={handleChangeState}
								value={stateOrder}
								style={{ padding: "5px 10px" }}
							>
								<option
									value="waiting"
									defaultValue={detailOrder.stateOrder === "waiting"}
								>
									Chưa duyệt
								</option>
								<option
									value="approved"
									defaultValue={detailOrder.stateOrder === "approved"}
								>
									Đã duyệt
								</option>
								<option
									value="reject"
									defaultValue={detailOrder.stateOrder === "reject"}
								>
									Từ chối
								</option>
							</select>
						) : (
							<Description
								label="Trạng thái"
								infor={detailOrder.stateOrder}
								oneLine
							/>
						)}
					</div>
				</Modal>
			</div>
		</div>
	);
}

export default ManagerOrder;
