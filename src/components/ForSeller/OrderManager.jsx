import classNames from "classnames/bind";
import style from "./ForSeller.module.scss";
import { useEffect, useState } from "react";
import * as OrderService from "../../service/OrderService";
import { useApp } from "~/context/AppProvider";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "~/components/Modal";
import Description from "~/components/Description";
import Button from "../Button";
import { toast } from "react-toastify";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Grid";

const cx = classNames.bind(style);

function OrderManager() {
	const { user, token } = useApp();

	const [activeTab, setActiveTab] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [modalDetail, setModalDetail] = useState(false);
	const [orders, setOrders] = useState([]);
	const [orderSelected, setOrderSelected] = useState();

	const tabs = [
		{ label: "Đang xử lý" },
		{ label: "Đang vận chuyển" },
		{ label: "Đang giao hàng" },
		{ label: "Đã giao hàng" },
		{ label: "Bị hủy" },
	];

	const getOrders = async () => {
		if (user.id) {
			const res = await OrderService.getAllOrders({
				data: { seller: user.id, status: activeTab, token: token },
			});
			setOrders(res.data);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getOrders();
		setIsLoading(true);
	}, [activeTab]);

	const handleShowDetail = (row) => {
		console.log("row", row);

		setModalDetail(true);
		setOrderSelected(row);
	};

	const handleUpdateOrder = async (idOrder, data) => {
		if (window.confirm("Bạn có chắc muốn vận chuyển đơn hàng?")) {
			const res = await OrderService.updateOrder(idOrder, data);
			console.log("res", res);

			if (res.status === "SUCCESS") {
				toast.success(res.message);
				setTimeout(() => {
					getOrders();
					setModalDetail(false);
				}, 2000);
			} else {
				toast.error(res.message);
			}
		}
	};

	return (
		<div>
			<div className={cx("inner-content")}>
				<div className={cx("title")}>Quản lý đơn hàng</div>
				<div className={cx("tab-order")}>
					{tabs.map((item, index) => (
						<button
							key={index}
							onClick={() => setActiveTab(index)}
							className={cx(activeTab === index && "active-tab")}
						>
							{item.label}
						</button>
					))}
				</div>
				<div className={cx("search-order")}>
					<input
						type="text"
						placeholder="Nhập ID đơn hàng, tên khách hàng, tên sản phẩm..."
					/>
					<button>Tìm kiếm</button>
					<button>Xuất file excel</button>
				</div>

				<div className={cx("table-order")}>
					<TableContainer>
						<Table sx={{ minWidth: 650 }} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell></TableCell>
									<TableCell>Tên SP</TableCell>
									<TableCell>Khách hàng</TableCell>
									<TableCell>Giá tiền</TableCell>
									<TableCell>Số lượng</TableCell>
									<TableCell>Hình thức thanh toán</TableCell>
									<TableCell>Ngày mua</TableCell>
									<TableCell>Địa chỉ</TableCell>
									<TableCell></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={12} align="center">
											<CircularProgress />
										</TableCell>
									</TableRow>
								) : (
									<>
										{orders[0]?.idOrder ? (
											orders.map((row) => (
												<TableRow
													key={row._id}
													sx={{
														"&:last-child td, &:last-child th": {
															border: 0,
														},
													}}
													className="animate__animated animate__fadeIn"
												>
													<TableCell>
														<img
															style={{ width: 50, height: 50 }}
															src={row.idProduct.images[0]}
															alt="anh-SP"
														/>
													</TableCell>
													<TableCell>
														<p style={{ fontWeight: 500 }}>
															{row.idProduct.name}
														</p>
													</TableCell>
													<TableCell>
														{row.idOrder.idBuyer.name}
													</TableCell>
													<TableCell>
														<p style={{ color: "var(--orange-color)" }}>
															{Intl.NumberFormat().format(
																row.productPrice + row.shippingPrice
															)}
															đ
														</p>
													</TableCell>
													<TableCell>{row.quantity}</TableCell>
													<TableCell>
														{row.idOrder.paymentMethod === "cash"
															? "Tiền mặt"
															: "Chuyển khoản"}
													</TableCell>
													<TableCell>
														{moment(row.createdAt).format(
															"DD-MM-YYYY HH:mm:ss"
														)}
													</TableCell>
													<TableCell>
														{row.idOrder.shippingDetail.address}
													</TableCell>

													<TableCell>
														<button
															className={cx("button-show-order")}
															onClick={() => handleShowDetail(row)}
														>
															Xem chi tiết
														</button>
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={12} align="center">
													Không có đơn hàng.
												</TableCell>
											</TableRow>
										)}
									</>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</div>

				<Modal
					isOpen={modalDetail}
					title="Thông tin đơn hàng"
					setIsOpen={setModalDetail}
					width={1000}
				>
					{orderSelected?.idProduct && (
						<div className={cx("modal")}>
							<div className="title" style={{ marginBottom: 30 }}>
								Trạng thái đơn hàng:
								{orderSelected.status}
							</div>
							<Grid
								container
								spacing={2}
								sx={{
									justifyContent: "space-evenly",
									alignItems: "center",
									marginBottom: 6,
								}}
							>
								<Grid item xs={5} className={cx("info-section")}>
									<p className={cx("title-section")}>Khách hàng</p>
									<Description
										title="Tên"
										desc={orderSelected.idOrder.idBuyer?.name}
									/>
									<Description
										title="Email"
										desc={orderSelected.idOrder.shippingDetail?.email}
									/>
									<Description
										title="Số điện thoại"
										desc={orderSelected.idOrder.shippingDetail?.phone}
									/>
									<Description
										title="Địa chỉ"
										desc={orderSelected.idOrder.shippingDetail?.address}
									/>
								</Grid>
								<Grid item xs={5} className={cx("info-section")}>
									<p className={cx("title-section")}>Thông tin chung</p>
									<Description
										title="Giá sản phẩm"
										desc={`${Intl.NumberFormat().format(
											orderSelected.productPrice
										)}đ`}
									/>
									<Description
										title="Phí vận chuyển"
										desc={`${Intl.NumberFormat().format(
											orderSelected.shippingPrice
										)}đ`}
									/>
									<Description
										title="Hình thức thanh toán"
										desc={
											orderSelected.paymentMethod === "cash"
												? "Thanh toán khi nhận hàng"
												: "Thanh toán qua ngân hàng"
										}
									/>
									<Description
										title="Tổng tiền"
										desc={`${Intl.NumberFormat().format(
											orderSelected.shippingPrice + orderSelected.productPrice
										)}đ`}
										important
									/>
								</Grid>
							</Grid>
							<Grid
								container
								spacing={2}
								sx={{
									justifyContent: "space-evenly",
									alignItems: "center",
								}}
							>
								<Grid item xs={5} className={cx("info-section")}>
									<p className={cx("title-section")}>Sản phẩm</p>
									{orderSelected.idProduct.images.map((image, index) => (
										<img
											key={index}
											style={{ width: 70, height: 70, margin: 5 }}
											src={image}
											alt="anh-SP"
										/>
									))}

									<Description
										title="Tên SP"
										desc={orderSelected.idProduct?.name}
									/>
									<Description
										title="Giá"
										desc={`${Intl.NumberFormat().format(
											orderSelected.productPrice
										)}đ`}
									/>
									<Description
										title="Số lượng"
										desc={orderSelected.quantity}
									/>
									<Description
										title="Danh mục"
										desc={orderSelected.idProduct.subCategory?.name}
									/>
								</Grid>
								<Grid item xs={5} className={cx("info-section")}>
									{orderSelected?.cancelReason ? (
										<Description
											title="Lý do hủy đơn"
											desc={orderSelected?.cancelReason}
										/>
									) : (
										<div>
											<Description
												title="Ghi chú của khách hàng"
												desc={orderSelected?.note || "Không có"}
											/>
											<Description
												title="Đánh giá từ khách hàng"
												desc={orderSelected?.rating || "Không có"}
											/>
										</div>
									)}
								</Grid>
							</Grid>
							<div style={{ textAlign: "center", paddingTop: 30 }}>
								<Button onClick={() => setModalDetail(false)}>Thoát</Button>
								{orderSelected.status === "Đang xử lý" && (
									<Button
										primary
										onClick={() =>
											handleUpdateOrder(orderSelected._id, { status: "1" })
										}
									>
										Vận chuyển hàng
									</Button>
								)}
							</div>
						</div>
					)}
				</Modal>
			</div>
		</div>
	);
}

export default OrderManager;
