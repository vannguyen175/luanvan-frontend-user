import classNames from "classnames/bind";
import style from "./OrderProduct.module.scss";
import moment from "moment";
import Button from "~/components/Button";
import Select from "~/components/Select";
import vi from "moment/locale/vi";
import Grid from "@mui/material/Grid";
import { useNavigate, useParams } from "react-router-dom";
import * as ProductService from "~/service/ProductService";
import * as UserService from "~/service/UserService";
import * as OrderService from "~/service/OrderService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "~/components/Modal";
import Description from "~/components/Description";

const cx = classNames.bind(style);

function OrderProduct() {
	const navigate = useNavigate();
	const { id } = useParams(); //id product
	const idBuyer = localStorage.getItem("id_user");
	const [modelConfirm, setModelConfirm] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState("cash");
	const [details, setDetails] = useState({
		product: {},
		seller: {},
		buyer: {},
	});
	const getDetailProduct = async () => {
		const res = await ProductService.detailProduct(id);
		setDetails((prevDetails) => ({
			...prevDetails,
			product: res.data,
		}));
		getDetailSeller(res.data.idUser);
	};

	const getDetailBuyer = async () => {
		const res = await UserService.getInfoUser(idBuyer);
		setDetails((prevDetails) => ({
			...prevDetails,
			buyer: res.data,
		}));
	};

	const getDetailSeller = async (id) => {
		const res = await UserService.getInfoUser(id);
		setDetails((prevDetails) => ({
			...prevDetails,
			seller: res.data,
		}));
	};

	useEffect(() => {
		getDetailProduct();
		getDetailBuyer();
		// eslint-disable-next-line
	}, []); //detail-seller

	//Cập nhật gtri select khi người dùng thay đổi PaymentMethod
	const handleChangePaymentMethod = (e) => {
		if (e === "Thanh toán qua ngân hàng") {
			setPaymentMethod("autopay");
		} else {
			setPaymentMethod("cash");
		}
	};

	//Lưu lại gtri input khi người dùng thay đổi shippingAddress
	const handleOnchange = (e) => {
		setDetails({
			...details,
			buyer: {
				...details.buyer,
				[e.target.name]: e.target.value,
			},
		});
	};

	//Người dùng click button "Dat hang ngay" => hiện model confirm đơn hàng
	const handleCheckOrder = async () => {
		if (
			details.buyer.email === "" ||
			details.buyer.address === "" ||
			details.buyer.phone === ""
		) {
			toast.error("Vui lòng điển đầy đủ thông tin đặt hàng");
		} else {
			setModelConfirm(true);
		}
	};

	//tiến hành lưu thông tin order
	const handleOrder = async () => {
		console.log(details.buyer._id, idBuyer);
		const dataOrder = {
			product: details.product._id,
			paymentMethod: paymentMethod,
			shippingDetail: {
				email: details.buyer.email,
				address:
					details.buyer.address +
						", " +
						details.buyer.ward +
						", " +
						details.buyer.district +
						", " +
						details.buyer.province || "chưa có",
				phone: details.buyer.phone,
				shippingPrice: 30000,
			},
			buyer: details.buyer._id,
			seller: details.seller._id,
		};
		const res = await OrderService.createOrder(dataOrder);
		if (res?.status === "SUCCESS") {
			toast.success("Đặt hàng thành công!");
			setTimeout(() => {
				navigate("/");
			}, 2000);
		} else if (res?.status === "ERROR") {
			toast.error(res?.message);
			setTimeout(() => {
				setModelConfirm(false);
			}, 1000);
		}
	};

	return (
		<div style={{ margin: "5px auto 30px auto" }}>
			<Grid container item style={{ display: "flex", justifyContent: "center" }}>
				<Grid item xs={6} className={cx("inner-content", "left")}>
					<p className={cx("title")}>Thông tin sản phẩm</p>
					<p className={cx("time-order")}>
						<span>{moment().locale("vi", vi).format("DD-MM-YYYY")}</span>
						<span>{moment().locale("vi", vi).format("hh:mm")}</span>
					</p>

					<div className={cx("card-product")}>
						{details.product?.name && (
							<Grid container>
								<Grid item xs={4}>
									<img src={`${details.product?.images[0]}`} alt="anh-san-pham" />
								</Grid>
								<Grid item xs={8}>
									<p className={cx("name")}>{details.product?.name}</p>
									<p className={cx("price")}>
										{Intl.NumberFormat().format(details.product?.price)}đ
									</p>
									{Object.keys(details.product?.info).map((value, index) => (
										<p className={cx("info")} key={index}>
											<span>
												{value} : {details.product?.info[value]}
											</span>
										</p>
									))}
								</Grid>
							</Grid>
						)}
					</div>
					<hr style={{ marginTop: 40, marginBottom: -20 }} />
					<div className={cx("detail-seller")}>
						<p className={cx("title")}>Thông tin người bán</p>
						<Grid container style={{ display: "flex", alignItems: "center" }}>
							<Grid item xs={1}>
								<span className={cx("avatar")}>
									{details.seller?.avatar === "" ? (
										<img src="/assets/images/user-avatar.jpg" alt="avatar" />
									) : (
										<img src={details.seller?.avatar} alt="avatar" />
									)}
								</span>
							</Grid>
							<Grid item>
								<p className={cx("name")}>{details.seller?.name}</p>
								<p className={cx("rating")}>
									Đánh giá:
									{details.seller?.rating === 0
										? " Chưa có đánh giá"
										: details.seller?.rating}
								</p>
							</Grid>
						</Grid>
						<Description title="Số điện thoại" desc={details.seller?.phone} />
					</div>
				</Grid>
				<Grid item xs={5} className={cx("inner-content", "right")}>
					<p className={cx("title")}>Thông tin đơn đặt hàng</p>
					<div className={cx("detail-order")}>
						<Grid container style={{ display: "flex", alignItems: "center" }}>
							<Grid item xs={1}>
								<span className={cx("avatar")}>
									{details.buyer?.avatar === "" ? (
										<img src="/assets/images/user-avatar.jpg" alt="avatar" />
									) : (
										<img src={details.buyer?.avatar} alt="avatar" />
									)}
								</span>
							</Grid>
							<Grid item>
								<p className={cx("name")}>{details.buyer?.name}</p>
							</Grid>
						</Grid>
						<div className={cx("info")}>
							<p>
								Email:
								<input
									onChange={handleOnchange}
									placeholder={details.buyer?.email || ""}
									name="email"
								/>
							</p>
							<p>
								Số điện thoại:
								<input
									onChange={handleOnchange}
									placeholder={details.buyer?.phone || ""}
									name="phone"
								/>
							</p>
							<p>
								Địa chỉ:{" "}
								<textarea
									onChange={handleOnchange}
									placeholder={
										[
											details.buyer?.address,
											details.buyer?.ward,
											details.buyer?.district,
											details.buyer?.province,
										].join(", ") || ""
									}
									name="address"
								/>
							</p>
						</div>
						<hr />
						<div className={cx("price")}>
							<p>
								Giá sản phẩm:
								<span>{Intl.NumberFormat().format(details.product?.price)}đ</span>
							</p>
							<p>
								Giá vận chuyển: <span>{Intl.NumberFormat().format(30000)}đ</span>
							</p>
							<p>
								Tổng cộng:
								<span style={{ color: "red" }}>
									{Intl.NumberFormat().format(details.product?.price + 30000)}đ
								</span>
							</p>
						</div>
						<hr style={{ marginBlock: 30 }} />
						<Select
							borderColor="gray"
							name="Hình thức thanh toán"
							value="Thanh toán khi nhận hàng"
							options={["Thanh toán khi nhận hàng", "Thanh toán qua ngân hàng"]}
							onChange={handleChangePaymentMethod}
						/>
						<div className={cx("order-btn")}>
							<Button primary onClick={handleCheckOrder}>
								Đặt hàng ngay
							</Button>
						</div>
					</div>
				</Grid>
			</Grid>
			<Modal
				isOpen={modelConfirm}
				title="Xác nhận đặt hàng"
				setIsOpen={setModelConfirm}
				width={500}
			>
				{
					<div>
						<Description title="Tên sản phẩm" desc={details.product?.name} />
						<Description
							title="Tổng giá tiền"
							desc={`${Intl.NumberFormat().format(details.product?.price + 30000)}đ`}
						/>
						<Description title="Số điện thoại" desc={details.buyer?.phone} />
						<Description
							title="Địa chỉ giao hàng"
							desc={
								[
									details.buyer?.address,
									details.buyer?.ward,
									details.buyer?.district,
									details.buyer?.province,
								].join(", ") || ""
							}
							oneLine
						/>
						<Description
							title="Hình thức thanh toán"
							desc={
								paymentMethod === "cash"
									? "Thanh toán khi nhận hàng"
									: "Thanh toán qua ngân hàng"
							}
							oneLine
						/>
						<div style={{ textAlign: "center", marginTop: 20 }}>
							<Button onClick={() => setModelConfirm(false)}>Thoát</Button>

							<Button type="submit" primary onClick={handleOrder}>
								Thanh toán
							</Button>
						</div>
					</div>
				}
			</Modal>
		</div>
	);
}

export default OrderProduct;
