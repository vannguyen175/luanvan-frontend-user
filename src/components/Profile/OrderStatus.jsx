import classNames from "classnames/bind";
import style from "./Profile.module.scss";
import * as OrderService from "../../service/OrderService";
import Description from "../Description";
import Modal from "../Modal";
import { useApp } from "~/context/AppProvider";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useEffect, useState } from "react";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { toast } from "react-toastify";

const cx = classNames.bind(style);

function OrderStatus() {
	const { user, token } = useApp();
	const [alignment, setAlignment] = useState("0");
	const [cancelOpen, setCancelOpen] = useState(false);
	const [reasonCancel, setReasonCancel] = useState({
		idOrder: "",
		reason: "",
	});
	const [orders, setOrders] = useState([]);

	const getOrders = async () => {
		if (user.id) {
			console.log(alignment);
			const res = await OrderService.getAllOrders({
				data: { buyer: user.id, status: alignment, token: token },
			});
			setOrders(res.data);
		}
	};

	useEffect(() => {
		getOrders();
		// eslint-disable-next-line
	}, [alignment, user]);

	const handleChange = (event, newAlignment) => {
		setAlignment(newAlignment);
	};

	const handleCancelOpen = (id) => {
		setCancelOpen(true);
		setReasonCancel({ idOrder: id });
	};

	const handleChangeReason = (event) => {
		setReasonCancel({ ...reasonCancel, reason: event.target.value });
	};

	const handleCancel = async () => {
		const res = await OrderService.cancelOrder(reasonCancel);
		if (res.status === "SUCCESS") {
			toast.success(res.message);
			setTimeout(() => {
				getOrders();
				setCancelOpen(false);
			}, 2000);
		} else {
			toast.error(res.message);
		}
	};

	const handleReview = () => {};

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
			<div>
				{orders.length > 0 ? (
					orders.map((item, index) => (
						<div className={cx("order-status-card")} key={index}>
							<Grid container>
								<Grid item xs={12} className={cx("shop")}>
									<StorefrontIcon style={{ marginRight: 10 }} />
									{item.product.sellerName}
								</Grid>
								<Grid item xs={1} className={cx("image-product")}>
									<img src={item.product.images[0]} alt="anh-san-pham" />
								</Grid>
								<Grid item xs={7} className={cx("detail-product")}>
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
								<Grid item xs={4} className={cx("price-product")}>
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
													? "Thanh toán bằng tiền mặt"
													: "Chuyển khoản"
											}
										/>
									</Grid>
								</Grid>
								<Grid item container className={cx("action")}>
									<Grid item xs={10}></Grid>
									<Grid item xs={2}>
										{alignment === "0" ? (
											<button
												onClick={() => handleCancelOpen(item._id)}
												className={cx("button-primary")}
											>
												Hủy
											</button>
										) : alignment === "3" ? (
											<button
												onClick={handleReview}
												className={cx("button-primary")}
											>
												Đánh giá
											</button>
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
				<Modal
					title="Lý do hủy đơn hàng"
					isOpen={cancelOpen}
					setIsOpen={setCancelOpen}
					width={600}
				>
					<div>
						Vui lòng chọn lý do hủy đơn hàng, thao tác này sẽ hủy sản phẩm trong giỏ
						hàng và không thể hoàn tác.
					</div>
					<FormControl>
						<RadioGroup defaultValue={"no"} onChange={handleChangeReason}>
							<FormControlLabel
								value="0"
								control={<Radio />}
								label="Muốn thay đổi địa chỉ giao hàng"
							/>
							<FormControlLabel
								value="1"
								control={<Radio />}
								label="Tìm thấy giá rẻ hơn ở chỗ khác"
							/>
							<FormControlLabel
								value="3"
								control={<Radio />}
								label="Thủ tục thanh toán rắc rối"
							/>
							<FormControlLabel value="2" control={<Radio />} label="Thay đổi ý" />
							<FormControlLabel value="4" control={<Radio />} label="Khác" />
						</RadioGroup>
					</FormControl>
					<div style={{ marginTop: 20, textAlign: "center" }}>
						<button
							className={cx("button")}
							onClick={() => {
								setCancelOpen(false);
							}}
						>
							Thoát
						</button>
						<button className={cx("button-primary")} onClick={handleCancel}>
							Xác nhận hủy
						</button>
					</div>
				</Modal>
			</div>
		</div>
	);
}

export default OrderStatus;
