import * as ProductService from "~/service/ProductService";
import * as UserService from "~/service/UserService";
import * as CartService from "~/service/CartService";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import vi from "javascript-time-ago/locale/vi";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";

//import Button from "~/components/Button";
import classNames from "classnames/bind";
import style from "./DetailProduct.module.scss";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Description from "~/components/Description";
import ImagePreview from "~/components/ImagePreview";
import { useApp } from "~/context/AppProvider";
import { formatPhoneNumber } from "../../utils";
import CircularProgress from "@mui/material/CircularProgress";
import CardProduct from "~/components/CardProduct";

const cx = classNames.bind(style);
TimeAgo.addLocale(vi);

function DetailProduct() {
	const { id } = useParams();
	const { user } = useApp();
	const navigate = useNavigate();
	const [buyerDetail, setBuyerDetail] = useState();
	const [quantitySelected, setQuantitySelected] = useState(1);
	const location = useLocation();
	const [productBySubCate, setProductBySubCate] = useState();
	const [details, setDetails] = useState({
		product: {},
		seller: {},
		buyer: {},
		stateShow: "product",
	});
	const getDetailBuyer = async () => {
		const res = await UserService.getInfoUser(user?.id);
		setBuyerDetail(res.data);
	};

	const getDetailProduct = async () => {
		const res = await ProductService.detailProduct(id);
		setDetails((prevDetails) => ({
			...prevDetails,
			product: res.data,
		}));
		if (res.data) {
			console.log(res.data);

			getProductsBySubCate(res.data.subCategory.name);
		}
		getDetailSeller(res.data.idUser._id);
	};

	const getProductsBySubCate = async (subCate) => {
		const res = await ProductService.getAllProducts({
			data: { state: [], cate: [], subCate: [subCate] },
			page: `page=${1}`,
			limit: `limit=${10}`,
		});
		const filteredProducts = res.data.filter((product) => product._id !== id);
		setProductBySubCate(filteredProducts);
	};
	useEffect(() => {
		getDetailProduct();
		if (user?.id) {
			getDetailBuyer();
		}
		// eslint-disable-next-line
	}, []);

	const getDetailSeller = async (idUser) => {
		const res = await UserService.getInfoUser(idUser);
		setDetails((prevDetails) => ({
			...prevDetails,
			seller: res.data,
		}));
	};

	const handleChoseQuantity = (type) => {
		if (quantitySelected == 1 && type === "remove") return;
		else if (quantitySelected == details.product?.quantity && type === "add") return;
		else if (type === "remove") setQuantitySelected(quantitySelected - 1);
		else if (type === "add") setQuantitySelected(quantitySelected + 1);
	};

	const handleOrderNow = () => {
		if (user.id) {
			navigate(`/dat-hang/${id}/${quantitySelected}`);
		} else {
			navigate("/login", { state: location.pathname });
		}
	};

	const handleAddCart = async () => {
		if (user.id) {
			const addCart = await CartService.createCart({
				id: user.id,
				idProduct: details.product._id,
				quantity: quantitySelected,
			});
			if (addCart?.status === "SUCCESS") {
				toast.success(addCart.message);
			} else if (addCart?.status === "EXIST") {
				toast.warning("Sản phẩm đã tồn tại trong giỏ hàng");
			}
		} else {
			navigate("/login", { state: location.pathname });
		}
	};

	const handleShowDetail = (value) => {
		setDetails((prev) => ({ ...prev, stateShow: value }));
	};

	return (
		<div className={cx("animate__animated", "animate__fadeIn")}>
			{details.product?.name ? (
				<div style={{ display: "flex", minHeight: "100vh" }}>
					<div
						className={cx("inner-content", "sticky")}
						style={{ width: "30%", height: "fit-content" }}
					>
						{details.product.images ? (
							<ImagePreview data={details.product.images} />
						) : (
							<div style={{ textAlign: "center" }}>
								<CircularProgress />
							</div>
						)}
					</div>
					{details.product.name && (
						<div style={{ width: "70%" }}>
							<div
								className={cx("inner-content", "sticky")}
								style={{ paddingLeft: 30 }}
							>
								<p>
									{details.product?.subCategory.category.name} /{" "}
									{details.product?.subCategory.name}
								</p>
								<h2 style={{ color: "var(--main-color)", marginTop: 10 }}>
									{details.product?.name}
								</h2>
								{details.product?.sellerName &&
									details.product?.sellerName === buyerDetail?.name && (
										<div style={{ display: "flex" }}>
											<p style={{ marginRight: 10 }}>
												Đây là sản phẩm của bạn
											</p>
											<a href="/#">Chỉnh sửa</a>
										</div>
									)}
							</div>

							<div className={cx("inner-content")} style={{ paddingLeft: 10 }}>
								<div className={cx("tab-button")}>
									<button
										className={cx(
											details.stateShow === "product" && "button-active"
										)}
										onClick={() => {
											handleShowDetail("product");
										}}
									>
										Sản phẩm
									</button>
									<button
										className={cx(
											details.stateShow === "seller" && "button-active"
										)}
										onClick={() => {
											handleShowDetail("seller");
										}}
									>
										Người bán
									</button>
								</div>
								{details.stateShow === "product" && (
									<div style={{ paddingLeft: 30 }}>
										<h5>Thông tin chung</h5>
										<Description
											title="Giá tiền"
											desc={`${Intl.NumberFormat().format(
												details.product?.price
											)}đ`}
										/>
										<Description
											title="Số lượng"
											desc={details.product?.quantity}
										/>
										<Description
											title="Thời điểm đăng"
											desc={
												<ReactTimeAgo
													date={Date.parse(details.product?.createdAt)}
													locale="vi-VN"
												/>
											}
										/>
										<Description
											title="Địa chỉ bán hàng"
											desc={`${details.product?.address?.address}, ${details.product?.address?.ward}, ${details.product?.address?.district}, ${details.product?.address?.province}`}
										/>
										<Description
											title="Tin đã được kiểm duyệt"
											desc={<CheckCircleOutlineIcon />}
										/>
										{details.product?.sellerName &&
										details.product?.sellerName === buyerDetail?.name ? (
											<p style={{ textAlign: "center", marginTop: 20 }}>
												Đây là sản phẩm của bạn
											</p>
										) : (
											<div className={cx("actions")}>
												<div
													style={{
														display: "flex",
														justifyContent: "center",
													}}
												>
													<div className={cx("actions-price")}>
														<p>Tổng tiền: &nbsp;</p>
														<strong>
															{Intl.NumberFormat().format(
																details.product?.price *
																	quantitySelected
															)}
															đ
														</strong>
													</div>
													<div className={cx("actions-quantity")}>
														<p>Số lượng</p>
														<RemoveIcon
															onClick={() =>
																handleChoseQuantity("remove")
															}
														/>
														<strong>{quantitySelected}</strong>
														<AddIcon
															onClick={() =>
																handleChoseQuantity("add")
															}
														/>
													</div>
												</div>

												<div className={cx("actions-button")}>
													<Button
														style={{ width: "70%" }}
														onClick={handleAddCart}
													>
														Thêm vào giỏ hàng
													</Button>
													<Button
														primary
														style={{ width: "70%" }}
														onClick={handleOrderNow}
													>
														Đặt hàng ngay
													</Button>
												</div>
											</div>
										)}
										<hr />

										<h5>Thông tin chi tiết sản phẩm</h5>
										{Object.keys(details.product?.info).map((value, index) => (
											<p className={cx("info")} key={index}>
												<Description
													title={value}
													desc={details.product?.info[value]}
												/>
											</p>
										))}
										<Description
											title="Mô tả sản phẩm"
											desc={details.product?.description || "Không có"}
										/>
									</div>
								)}
								{details.stateShow === "seller" && (
									<div
										style={{ paddingLeft: 30 }}
										className={cx("detail-seller")}
									>
										<h5>Thông tin nhà bán hàng</h5>

										<div className={cx("main-info")}>
											<img
												src={
													details.seller?.avatar ||
													"/assets/images/user-avatar.jpg"
												}
												alt="anh-nguoi-ban"
												className={cx("avatar")}
											/>

											<p
												onClick={() =>
													navigate(`/seller/${details.seller?.user}`)
												}
												className={cx("name")}
											>
												{details.seller?.name}
											</p>
										</div>

										<Description
											title="Đánh giá"
											desc={
												<>
													{details.seller?.avgRating[0]?.averageRating ? (
														<>
															<Rating
																name="read-only"
																value={
																	details.seller?.avgRating[0]
																		?.averageRating
																}
																readOnly
															/>
															<span style={{ marginLeft: 10 }}>
																{
																	details.seller?.avgRating[0]
																		?.averageRating
																}
																/5
															</span>
														</>
													) : (
														"Chưa có đánh giá nào"
													)}
												</>
											}
											className={cx("rating")}
										/>

										<Description
											title="Số điện thoại"
											desc={formatPhoneNumber(details.seller?.phone)}
										/>
										<Description
											title="Địa chỉ"
											desc={
												[
													details.seller?.address,
													details.seller?.ward,
													details.seller?.district,
													details.seller?.province,
												].join(", ") || ""
											}
										/>
									</div>
								)}
							</div>

							<div className="row"></div>
						</div>
					)}
				</div>
			) : (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
					}}
				>
					<CircularProgress color="inherit" />
				</div>
			)}
			<div className={cx("inner-content", "animate__animated", "animate__fadeIn")}>
				<div className="title">Những sản phẩm bạn có thể thích</div>
				<div style={{ display: "flex", flex: "wrap" }}>
					{productBySubCate &&
						productBySubCate?.map((product, key) => (
							<CardProduct key={key} product={product} />
						))}
				</div>
			</div>
		</div>
	);
}

export default DetailProduct;
