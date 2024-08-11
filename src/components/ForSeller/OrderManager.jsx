import classNames from "classnames/bind";
import style from "./ForSeller.module.scss";
import * as OrderService from "../../service/OrderService";
import Description from "../Description";
import { useApp } from "~/context/AppProvider";


import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import * as React from "react";

const cx = classNames.bind(style);

function OrderManager() {
	const [alignment, setAlignment] = useState("0");
	const { user } = useApp();
	const [orders, setOrders] = useState([]);

	const getOrders = async () => {
		const res = await OrderService.getAllOrders({
			data: { seller: user.id, status: alignment },
		});
		setOrders(res.data);
	};

	useEffect(() => {
		getOrders();
		// eslint-disable-next-line
	}, [alignment]);

	const handleChange = (event, newAlignment) => {
		setAlignment(newAlignment);
	};

	const handleUpdateOrder = async (id, data) => {
		const res = await OrderService.updateOrder(id, data);
		if (res.status === "SUCCESS") {
			toast.success(res.message);
			setTimeout(() => {
				getOrders();
			}, 2000);
		} else {
			toast.error(res.message);
		}
	};

	return (
		<div style={{ overflow: "unset" }}>
			<div className={cx("inner-content")}>
				<p className="title">Trạng thái đơn hàng</p>
				<div className={cx("sticky")}>
					<ToggleButtonGroup
						color="primary"
						value={alignment}
						exclusive
						onChange={handleChange}
						fullWidth
						size="small"
					>
						<ToggleButton value="0">Đang xử lý</ToggleButton>
						<ToggleButton value="1">Đang vận chuyển</ToggleButton>
						<ToggleButton value="2">Giao hàng</ToggleButton>
						<ToggleButton value="3">Đã giao</ToggleButton>
						<ToggleButton value="4">Đã hủy</ToggleButton>
					</ToggleButtonGroup>
				</div>
			</div>
			<div className="inner-content">
				{`${orders.length} đơn hàng`}
				{orders.length > 0 ? (
					orders?.map((item, index) => (
						<div className={cx("order-status-card")} key={index}>
							<Grid container>
								<Grid item xs={12} className={cx("shop")}>
									Người mua: &nbsp;
									{item.buyer.name}
								</Grid>
								<Grid item xs={1} className={cx("image-product")}>
									<img src={item.product.images[0]} alt="anh-san-pham" />
								</Grid>
								<Grid item xs={6} className={cx("detail-product")}>
									<Grid container direction="column">
										<Grid item xs={12} className={cx("name")}>
											{item.product.name}
										</Grid>
										<Grid item xs={12}>
											<Description
												title="Danh mục"
												desc={item.product.subCategory.name}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={3} className={cx("price-product")}>
									<Grid container direction="column">
										<Description
											title="Giá tiền"
											desc={`${Intl.NumberFormat().format(
												(item.shippingDetail?.shippingPrice || 0) +
													(item.product?.price || 0)
											)}đ`}
										/>
										<Description
											title="Hình thức"
											desc={
												item.paymentMethod === "cash"
													? "Tiền mặt"
													: "Chuyển khoản"
											}
										/>
									</Grid>
								</Grid>
								<Grid item xs={2} className={cx("note")}>
									{alignment === "1" && <p>Đơn vị vận chuyển đang giao hàng</p>}
								</Grid>
								<Grid item container className={cx("action")}>
									<Grid item xs={12}>
										{alignment === "0" ? (
											<button
												onClick={() =>
													handleUpdateOrder(item._id, { status: "1" })
												}
												className={cx("button-primary")}
											>
												Vận chuyển
											</button>
										) : alignment === "3" ? (
											<button className={cx("button-primary")}>
												Đánh giá
											</button>
										) : alignment === "1" ? (
											<p>Nhắn tin cho người mua</p>
										) : (
											""
										)}
									</Grid>
								</Grid>
							</Grid>
						</div>
					))
				) : (
					<p style={{ textAlign: "center", margin: 20 }}>Không có dữ liệu</p>
				)}
			</div>
		</div>
	);
}

export default OrderManager;
