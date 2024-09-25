import classNames from "classnames/bind";
import style from "./OrderProduct.module.scss";
import moment from "moment";
import Button from "~/components/Button";
import vi from "moment/locale/vi";
import Grid from "@mui/material/Grid";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditIcon from "@mui/icons-material/Edit";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
	const [isLoading, setIsLoading] = useState(false);
	const [showBackdrop, setShowBackdrop] = useState(false);
	const [modalSuccess, setModalSuccess] = useState(false);
	//const [addressInfo, setAddressInfo] = useState({ address: {} });
	const [noteIndex, setNoteIndex] = useState();
	const [totalPrice, setTotalPrice] = useState(0);
	const [details, setDetails] = useState({
		product: {},
		buyer: {},
		address: {},
	});

	const getProducts = async () => {
		const result = await CartService.getCart(idUser);
		const data = result.data.filter((_, index) => cartSelected.includes(index)); //lấy sp được user chọn ở cart page
		setDetails((prevDetails) => ({
			...prevDetails,
			product: data.map((item) => ({
				...item,
				shippingPrice: 15000, // Thêm trường shippingPrice với giá trị mong muốn
			})),
		}));

		const total = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
		setTotalPrice(total);
	};

	useEffect(() => {
		getProducts();

		if (user.id) {
			//getDetailBuyer();
			setDetails((prevDetails) => ({
				...prevDetails,
				buyer: {
					id: user.id,
					avatar: user.avatar,
					name: user.name,
				},
				address: {
					email: user.email,
					phone: user.phone,
					province: user.province,
					district: user.district,
					ward: user.ward,
					address: user.address,
				}, //address's buyer
				paymentMethod: {
					method: "cash",
				},
			}));
		}
		// eslint-disable-next-line
	}, [user]); //detail-seller

	//Cập nhật gtri select khi người dùng thay đổi PaymentMethod
	const handleChangePaymentMethod = (e) => {
		//	console.log("e.target.value", e.target.value);
		setPaymentMethod(e.target.value);
	};

	//Người dùng click button "Dat hang ngay" => hiện model confirm đơn hàng
	const handleCheckOrder = async () => {
		if (
			details.address.email === null ||
			details.address.address === null ||
			details.address.phone === null
		) {
			toast.error("Vui lòng điển đầy đủ thông tin đặt hàng");
		} else {
			if (window.confirm("Bạn có chắc muốn đặt hàng?")) {
				handleOrder();
			}
		}
	};

	//tiến hành lưu thông tin order
	const handleOrder = async () => {
		const dataOrder = {
			products: details.product, //array
			paymentMethod: details.paymentMethod.method,
			shippingDetail: {
				email: details.address.email,
				phone: details.address.phone,
				address:
					details.address.address +
					", " +
					details.address.ward +
					", " +
					details.address.district +
					", " +
					details.address.province,
				shippingPrice: details.product?.length * 15000,
			},
			idBuyer: details.buyer.id,
			totalPaid: totalPrice + details.product?.length * 15000,
		};
		setIsLoading(true);
		console.log("setIsLoading1", isLoading);

		const res = await OrderService.createOrder(dataOrder);
		//console.log("res", res);
		console.log("setIsLoading2", isLoading);

		if (res.status === "SUCCESS") {
			setIsLoading(false);
			setModalSuccess(true);
		}
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
									<div style={{ display: "flex" }}>
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
										</div>
										<div className={cx("quantity", "col-3")}>
											<p>Phí vận chuyển: </p>
											<p
												style={{
													fontWeight: 500,
													marginBottom: 10,
													fontSize: "1.2rem",
												}}
											>
												{Intl.NumberFormat().format(15000)}đ
											</p>
											<p>Tổng tiền: </p>
											<p className={cx("price")}>
												{Intl.NumberFormat().format(
													item?.price * item?.quantity + 15000
												)}
												đ
											</p>
										</div>
										<div className={cx("col-1")}>
											<EditNoteIcon
												fontSize="large"
												color="primary"
												style={{ cursor: "pointer" }}
												onClick={() => handleShowNote(index)}
											/>
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
						<Grid item xs={7}>
							<p className={cx("name")}>{details.buyer?.name}</p>
						</Grid>
						<Grid item xs={4}>
							<button
								onClick={() => setModalChangeAddress(true)}
								className={cx("update-button")}
							>
								Cập nhật thông tin
							</button>
						</Grid>
					</Grid>
					<div className={cx("info")}>
						<div>
							<span>Email:</span>
							{details.address?.email || "Chưa có"}
						</div>
						<div>
							<span>Số điện thoại: </span>
							{formatPhoneNumber(details?.address.phone) || "Chưa có"}
						</div>

						<div>
							<span>Địa chỉ:</span>

							{(details.address?.address &&
								[
									details.address?.address,
									details.address?.ward,
									details.address?.district,
									details.address?.province,
								].join(", ")) ||
								"Chưa có"}
						</div>
						<hr />
						<div>
							<div className={cx("payment")}>
								<p style={{ marginRight: 20 }}>Hình thức thanh toán:</p>
								<select name="payment">
									<option value="cash">Thanh toán khi nhận hàng</option>
									<option value="vnpay" disabled>
										Thanh toán qua ngân hàng
									</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<Modal
					title="Cập nhật thông tin giao hàng"
					isOpen={modalChangeAddress}
					setIsOpen={setModalChangeAddress}
					width={800}
				>
					<div style={{ textAlign: "center" }}>
						<AddressForm setDataSubmit={setDetails} data={details.address} />
						<Button
							onClick={() => {
								setModalChangeAddress(false);
							}}
						>
							Cập nhật
						</Button>
					</div>
				</Modal>
				<div className={cx("inner-content", "summary")}>
					<p className={cx("title")}>Thông tin chung</p>
					<div className={cx("price")}>
						<p>
							Giá sản phẩm:
							<span>{Intl.NumberFormat().format(totalPrice)}đ</span>
						</p>
						<p>
							Giá vận chuyển:{" "}
							<span>
								{Intl.NumberFormat().format(details.product?.length * 15000)}đ
							</span>
						</p>
						<p>
							Tổng cộng:
							<span style={{ color: "red" }}>
								{Intl.NumberFormat().format(
									totalPrice + details.product?.length * 15000
								)}
								đ
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
			<Backdrop
				sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
				open={isLoading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Modal
				isOpen={modalSuccess}
				setIsOpen={setModalSuccess}
				width={600}
			>
				<div className={cx("confirm-success")}>
					<CheckCircleIcon color="success" fontSize="large"/>
					<h5>Đặt hàng thành công!</h5>
					<p>Vui lòng chờ nhà bán hàng chuẩn bị và vận chuyển đơn hàng.</p>
					<Link
						to={"/"}
					>
						Quay về trang chủ
					</Link>
				</div>
			</Modal>
		</div>
	);
}

export default OrderProduct;
