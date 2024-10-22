import classNames from "classnames/bind";
import style from "./Profile.module.scss";
import * as OrderService from "../../service/OrderService";
import * as RatingService from "../../service/RatingService";
import Description from "../Description";
import Modal from "../Modal";
import { useApp } from "~/context/AppProvider";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useEffect, useRef, useState } from "react";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import CircularProgress from "@mui/material/CircularProgress";

const cx = classNames.bind(style);

function OrderStatus() {
	const reviewRef = useRef();
	const navigate = useNavigate();
	const { user, token } = useApp();
	const [isLoading, setIsLoading] = useState(false);
	const [alignment, setAlignment] = useState("0");
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [cancelOpen, setCancelOpen] = useState(false);
	const [ratingInfo, setRatingInfo] = useState({
		info: {},
		score: 0,
	});
	const [reasonCancel, setReasonCancel] = useState({
		idOrder: "",
		reason: "",
	});
	const [orders, setOrders] = useState([]);

	const getOrders = async () => {
		setIsLoading(true);
		if (user.id) {
			const res = await OrderService.getAllOrders({
				data: { buyer: user.id, status: alignment, token: token },
			});
			setOrders(res.data);
		}
		setIsLoading(false);
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

	const handleShowRatingModal = (item) => {
		setShowReviewModal(true);
		if (item?.ratingInfo?.score) {
			setRatingInfo({
				info: item,
				score: item.ratingInfo?.score,
				review: item.ratingInfo?.review,
				idRating: item.ratingInfo?._id,
			});
		} else {
			setRatingInfo({ info: item, score: 0 });
		}
	};

	const handleSendReview = async () => {
		let dataSubmit = {};
		let res;
		if (ratingInfo?.idRating) {
			dataSubmit = {
				idRating: ratingInfo.idRating,
				review: reviewRef.current.value,
				score: ratingInfo.score,
			};
			res = await RatingService.updateRating(dataSubmit);
		} else {
			dataSubmit = {
				idProduct: ratingInfo.info.idProduct._id,
				idOrder: ratingInfo.info._id,
				idBuyer: user.id,
				idSeller: ratingInfo.info.idSeller,
				review: reviewRef.current.value,
				score: ratingInfo.score,
			};
			res = await RatingService.createRating(dataSubmit);
		}

		if (res.status === "SUCCESS") {
			toast.success(res.message);
			setTimeout(() => {
				getOrders();
				setShowReviewModal(false);
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
			<div>
				{isLoading ? (
					<div style={{ textAlign: "center" }}>
						<CircularProgress />
					</div>
				) : orders.length > 0 ? (
					orders.map((item, index) => (
						<div className={cx("order-status-card")} key={index}>
							<Grid container>
								<Grid item xs={12} className={cx("shop")}>
									<StorefrontIcon style={{ marginRight: 10 }} />

									<span onClick={() => navigate(`/seller/${item.idSeller._id}`)}>
										{item.idSeller.name}
									</span>
								</Grid>
								<Grid item xs={1} className={cx("image-product")}>
									<img src={item.idProduct.images[0]} alt="anh-san-pham" />
								</Grid>
								<Grid item xs={7} className={cx("detail-product")}>
									<Grid container direction="column">
										<Grid item xs={12} className={cx("name")}>
											{item.idProduct.name}
										</Grid>
										<Grid item xs={12}>
											<Description
												title="Danh mục"
												desc={item.idProduct.subCategory.name}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={4} className={cx("price-product")}>
									<Grid container direction="column">
										<Description
											title="Giá tiền"
											desc={`${Intl.NumberFormat().format(
												(item.productPrice || 0) + (item.shippingPrice || 0)
											)}đ`}
										/>
										<Description
											title="Hình thức"
											desc={
												item.isPaid
													? "Chuyển khoản"
													: "Thanh toán bằng tiền mặt"
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
												onClick={() => handleShowRatingModal(item)}
												className={cx("button-primary")}
											>
												{item?.ratingInfo?.score
													? "Đã đánh giá"
													: "Đánh giá"}
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
				<Modal
					title="Đánh giá sản phẩm, nhà bán hàng"
					isOpen={showReviewModal}
					setIsOpen={setShowReviewModal}
					width={600}
				>
					{" "}
					{ratingInfo.info?.idProduct && (
						<div className={cx("rating")}>
							<div className={cx("info")}>
								<img src={ratingInfo.info.idProduct.images[0]} alt="anh-san-pham" />
								<div>
									<h5 style={{ marginTop: 5 }}>
										{ratingInfo.info.idProduct.name}
									</h5>
									<div
										style={{
											display: "flex",
											alignItems: "center",
										}}
									>
										<StorefrontIcon style={{ marginRight: 5 }} />
										<span
											onClick={() =>
												navigate(`/seller/${ratingInfo.info.idSeller._id}`)
											}
										>
											{ratingInfo.info.idSeller.name}
										</span>
									</div>
								</div>
							</div>
							<div className={cx("score")}>
								<p>Điểm đánh giá: </p>
								<Rating
									name="simple-controlled"
									value={ratingInfo.score}
									precision={0.5}
									size="large"
									onChange={(event, newValue) => {
										setRatingInfo((prevData) => ({
											...prevData,
											score: newValue,
										}));
									}}
								/>
								<span style={{ marginLeft: 30, marginTop: "-5px" }}>
									({ratingInfo?.score || 0}/5)
								</span>
							</div>
							<textarea
								className={cx("review")}
								cols={5}
								name="review"
								ref={reviewRef}
								defaultValue={ratingInfo?.review}
								placeholder="Nhận xét về sản phẩm, nhà bán hàng,..."
							></textarea>
							<div style={{ textAlign: "center" }}>
								<button className={cx("button-primary")} onClick={handleSendReview}>
									{ratingInfo?.idRating ? "Cập nhật đánh giá" : "Gửi đánh giá"}
								</button>
							</div>
						</div>
					)}
				</Modal>
			</div>
		</div>
	);
}

export default OrderStatus;
