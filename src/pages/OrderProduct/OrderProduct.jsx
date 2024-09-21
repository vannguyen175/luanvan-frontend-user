import classNames from "classnames/bind";
import style from "./OrderProduct.module.scss";
import moment from "moment";
import Button from "~/components/Button";
import vi from "moment/locale/vi";
import Grid from "@mui/material/Grid";
import { useNavigate, useParams } from "react-router-dom";
import * as ProductService from "~/service/ProductService";
import * as CartService from "~/service/CartService";

import * as UserService from "~/service/UserService";
import * as OrderService from "~/service/OrderService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "~/components/Modal";
import Description from "~/components/Description";
import { useApp } from "~/context/AppProvider";
import AddressForm from "~/components/AddressForm";
import { formatPhoneNumber } from "../../utils";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import PaymentIcon from "@mui/icons-material/Payment";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";

const cx = classNames.bind(style);

function OrderProduct() {
	const navigate = useNavigate();
	const cartSelected = localStorage.getItem("cartSelected");
	const idUser = localStorage.getItem("id_user");
	const { id } = useParams(); //id product
	const { user, socket } = useApp();
	const [modelConfirm, setModelConfirm] = useState(false);
	const [modalChangeAddress, setModalChangeAddress] = useState(false);
	const [modalChangePaymentMethod, setModalChangePaymentMothod] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState("cash");
	const [addressInfo, setAddressInfo] = useState({ address: {} });
	const [noteIndex, setNoteIndex] = useState();
	const [details, setDetails] = useState({
		product: {},
		buyer: {},
	});

	const getProducts = async () => {
		const result = await CartService.getCart(idUser);
		const data = result.data.filter((_, index) => cartSelected.includes(index));
		setDetails((prevDetails) => ({
			...prevDetails,
			product: data,
		}));
	};

	// const getDetailProduct = async () => {
	// 	const res = await ProductService.detailProduct(id);
	// 	setDetails((prevDetails) => ({
	// 		...prevDetails,
	// 		product: res.data,
	// 	}));
	// 	getDetailSeller(res.data.idUser);
	// };

	// const getDetailBuyer = async () => {
	// 	if (user.id) {
	// 		const res = await UserService.getInfoUser(user.id);
	// 		setDetails((prevDetails) => ({
	// 			...prevDetails,
	// 			buyer: res.data,
	// 		}));
	// 	}
	// };

	useEffect(() => {
		getProducts();

		if (user.id) {
			//getDetailBuyer();
			setDetails((prevDetails) => ({
				...prevDetails,
				buyer: user,
			}));
			setAddressInfo({
				email: user.email,
				address: user.address,
				district: user.district,
				phone: user.phone,
				province: user.province,
				ward: user.ward,
			});
		}
		// eslint-disable-next-line
	}, [user]); //detail-seller

	//Cập nhật gtri select khi người dùng thay đổi PaymentMethod
	const handleChangePaymentMethod = (e) => {
		//	console.log("e.target.value", e.target.value);
		setPaymentMethod(e.target.value);
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
			socket?.emit("sendNotification", {
				senderId: user.id,
				reveiverId: id,
				message: "Sản phẩm của bạn đã có người đặt mua. Nhấn vào đây để xử lý đơn hàng.",
			});
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
	const handleChangeAddress = () => {
		setDetails((prevDetails) => ({
			...prevDetails,
			buyer: {
				...prevDetails.buyer,
				...addressInfo.address,
			},
		}));
		setModalChangeAddress(false);
	};

	const handleShowNote = (index) => {
		if (noteIndex !== index) {
			setNoteIndex(index);
		} else {
			setNoteIndex();
		}
	};

	return (
		<div style={{ margin: "5px auto 30px auto", display: "flex" }}>
			<div style={{ width: "60%" }}>
				<div className={cx("inner-content", "product")}>
					<p className="title">Sản phẩm</p>
					{details.product.length > 0 &&
						details.product?.map((item, index) => {
							return (
								<div className={cx("cart", "row")} key={index}>
									<div style={{ display: "flex", marginBottom: 10 }}>
										<img
											className="col-2"
											src={`${item?.image}`}
											alt="anh-san-pham"
										/>
										<div className={cx("detail", "col-5")}>
											<StoreMallDirectoryIcon /> {item?.sellerName}
											<p className={cx("name")}>{item?.name}</p>
											<p className={cx("price")}>
												{Intl.NumberFormat().format(item?.price)}đ
											</p>
											<p>Số lượng: {item?.quantity}</p>
											{item?.statePost === "selled" && (
												<p style={{ color: "red" }}>Hết hàng</p>
											)}
										</div>
										<div className={cx("quantity", "col-3")}>
											<p>Tổng tiền: </p>
											<p className={cx("price")}>
												{Intl.NumberFormat().format(
													item?.price * item?.quantity
												)}
												đ
											</p>
											<p
												style={{
													textDecoration: "underline",
													cursor: "pointer",
												}}
												onClick={() => handleShowNote(index)}
											>
												Ghi chú cho nhà bán hàng
											</p>
										</div>
									</div>
									{noteIndex === index && (
										<>
											<hr />
											<div className={cx("note")}>
												<div>
													<p>Note:</p>
													<p onClick={() => handleShowNote(index)}>Hủy</p>
												</div>
												<textarea name="note" />
											</div>
										</>
									)}
								</div>
							);
						})}
				</div>
			</div>

			<div className={cx("buyer")} style={{ width: "40%" }}>
				<div className={cx("inner-content", "detail-order")}>
					<p className={cx("title")}>Thông tin đặt hàng</p>
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
						<div>
							Email:
							<input
								onChange={handleOnchange}
								value={details.buyer?.email || ""}
								name="email"
							/>
						</div>
						<div>
							Số điện thoại:
							<input
								onChange={handleOnchange}
								value={formatPhoneNumber(details?.buyer.phone) || ""}
								name="phone"
							/>
						</div>

						<div>
							Địa chỉ:
							<textarea
								onClick={() => setModalChangeAddress(true)}
								defaultValue={
									details.buyer?.address &&
									[
										details.buyer?.address,
										details.buyer?.ward,
										details.buyer?.district,
										details.buyer?.province,
									].join(", ")
								}
								name="address"
							/>
						</div>
						<hr />
						<div>
							<div className={cx("payment")}>
								<span>Hình thức thanh toán:</span>
								<select name="payment">
									<option value="cash">Thanh toán khi nhận hàng</option>
									<option value="vnpay" disabled>Thanh toán qua ngân hàng</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<div className={cx("inner-content", "summary")}>
					<p className={cx("title")}>Thông tin chung</p>
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

					<div className={cx("order-btn")}>
						<Button primary onClick={handleCheckOrder}>
							Đặt hàng ngay
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default OrderProduct;
