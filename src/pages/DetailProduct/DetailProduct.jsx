import * as ProductService from "~/service/ProductService";
import * as UserService from "~/service/UserService";
import * as CartService from "~/service/CartService";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import vi from "javascript-time-ago/locale/vi";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { toast } from "react-toastify";

//import Button from "~/components/Button";
import classNames from "classnames/bind";
import style from "./DetailProduct.module.scss";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Description from "../../components/Description";
import ImagePreview from "../../components/ImagePreview";

const cx = classNames.bind(style);
TimeAgo.addLocale(vi);

function DetailProduct() {
	const { id } = useParams();
	const idUser = localStorage.getItem("id_user");
	const navigate = useNavigate();
	const [buyerDetail, setBuyerDetail] = useState();
	const location = useLocation();
	const [details, setDetails] = useState({
		product: {},
		seller: {},
		buyer: {},
		stateShow: "product",
	});
	const getDetailBuyer = async () => {
		const res = await UserService.getInfoUser(idUser);
		setBuyerDetail(res.data);
	};

	const getDetailProduct = async () => {
		const res = await ProductService.detailProduct(id);
		setDetails((prevDetails) => ({
			...prevDetails,
			product: res.data,
		}));

		getDetailSeller(res.data.idUser);
	};
	useEffect(() => {
		getDetailProduct();
		getDetailBuyer();
		// eslint-disable-next-line
	}, []);

	const getDetailSeller = async (idUser) => {
		const res = await UserService.getInfoUser(idUser);
		setDetails((prevDetails) => ({
			...prevDetails,
			seller: res.data,
		}));
	};

	const handleOrderNow = () => {
		if (idUser) {
			navigate(`/dat-hang/${id}`);
		} else {
			navigate("/login", { state: location.pathname });
		}
	};

	const handleAddCart = async () => {
		if (idUser) {
			const addCart = await CartService.createCart({
				idUser,
				idProduct: details.product._id,
			});
			if (addCart?.status === "SUCCESS") {
				toast.success("Thêm vào giỏ hàng thành công!");
			} else if (addCart?.status === "EXIST") {
				toast.warning("Bạn đã thêm sản phẩm này rồi");
			}
		} else {
			navigate("/login", { state: location.pathname });
		}
	};

	const handleShowDetail = (value) => {
		setDetails((prev) => ({ ...prev, stateShow: value }));
	};

	return (
		<div style={{ display: "flex", minHeight: "100vh" }}>
			<div className={cx("inner-content", "sticky")} style={{ width: "30%" }}>
				{details.product.images && <ImagePreview data={details.product.images} />}
			</div>
			{details.product.name && (
				<div style={{ width: "70%" }}>
					<div className={cx("inner-content", "sticky")} style={{ paddingLeft: 30 }}>
						<p>
							{details.product?.subCategory.category.name} /{" "}
							{details.product?.subCategory.name}
						</p>
						<h1 style={{ color: "var(--main-color)" }}>{details.product?.name}</h1>
						{details.product?.sellerName === buyerDetail?.name && (
							<div style={{ display: "flex" }}>
								<p style={{ marginRight: 10 }}>Đây là sản phẩm của bạn</p>
								<a href="/#">Chỉnh sửa</a>
							</div>
						)}
					</div>

					<div className={cx("inner-content")} style={{ paddingLeft: 10 }}>
						<div className={cx("tab-button")}>
							<button
								className={cx(details.stateShow === "product" && "button-active")}
								onClick={() => {
									handleShowDetail("product");
								}}
							>
								Sản phẩm
							</button>
							<button
								className={cx(details.stateShow === "seller" && "button-active")}
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
									desc={`${Intl.NumberFormat().format(details.product?.price)}đ`}
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
							<div style={{ paddingLeft: 30 }}>
								<h5>Thông tin nhà bán hàng</h5>
								<Description title="Tên nhà bán hàng" desc={details.seller?.name} />
								<Description title="Đánh giá" desc={details.seller?.rating} />
								<Description title="Số điện thoại" desc={details.seller?.phone} />
								<Description
									title="Địa chỉ"
									desc={details.seller?.address || "Không có"}
								/>
							</div>
						)}

						{details.product?.sellerName === buyerDetail?.name ? (
							<p style={{ textAlign: "center" }}>Đây là sản phẩm của bạn</p>
						) : (
							<div style={{ textAlign: "center" }}>
								<Button style={{ width: "70%" }} onClick={handleAddCart}>
									Thêm vào giỏ hàng
								</Button>
								<Button primary style={{ width: "70%" }} onClick={handleOrderNow}>
									Đặt hàng ngay
								</Button>
							</div>
						)}
					</div>

					<div className="row"></div>
				</div>
			)}
		</div>
	);
}

export default DetailProduct;
