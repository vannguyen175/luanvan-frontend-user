import Carousel from "react-bootstrap/Carousel";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "~/service/ProductService";
import * as UserService from "~/service/UserService";
import * as CartService from "~/service/CartService";
import ReactTimeAgo from "react-time-ago";
import {
	UserOutlined,
	ClockCircleOutlined,
	EnvironmentOutlined,
	CheckOutlined,
	SendOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

//import Button from "~/components/Button";
import { Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import style from "./DetailProduct.module.scss";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CardProduct from "~/components/CardProduct";

const cx = classNames.bind(style);

function DetailProduct() {
	const { id } = useParams();
	const idUser = localStorage.getItem("id_user");
	const navigate = useNavigate();
	const [buyerDetail, setBuyerDetail] = useState();
	const location = useLocation();

	const getDetailBuyer = async () => {
		const res = await UserService.getInfoUser(idUser);
		setBuyerDetail(res.data);
	};

	useEffect(() => {
		getDetailBuyer();
	}, []);

	const getDetailProduct = async () => {
		const res = await ProductService.detailProduct(id);
		return res.data;
	};

	const getDetailSeller = async () => {
		const res = await UserService.getInfoUser(detail.idUser);
		return res.data;
	};

	const getProductWithSubcate = async () => {
		const res = await ProductService.getAllProductsBySubCate(detail.subCategory);
		return res.data;
	};

	//lấy thông tin sản phẩm khi vừa truy cập hoặc reload trang
	const queryDetail = useQuery({ queryKey: ["product-detail"], queryFn: getDetailProduct });
	const { data: detail } = queryDetail;

	//lấy thông tin nguời bán sau khi có idUser từ getDetailProduct
	const queryUser = useQuery({
		queryKey: ["seller-detail"],
		queryFn: getDetailSeller,
		refetchOnWindowFocus: false,
		enabled: false,
	});
	const { data: seller, refetch: refetchSeller } = queryUser;

	//lấy các sản phẩm cùng danh mục sau khi có subCategory từ getDetailProduct
	const queryProductSubCate = useQuery({
		queryKey: ["product-subCate"],
		queryFn: getProductWithSubcate,
		refetchOnWindowFocus: false,
		enabled: false,
	});
	const { data: subCategoryProducts, refetch: refetchSubCategoryProducts } = queryProductSubCate;
	useEffect(() => {
		if (detail) {
			refetchSeller();
			refetchSubCategoryProducts();
		}
	}, [detail, refetchSeller, refetchSubCategoryProducts]); //detail-seller

	const handleOrderNow = () => {
		if (idUser) {
			navigate(`/dat-hang/${id}`);
		} else {
			navigate("/login", { state: location.pathname });
		}
	};

	const handleAddCart = async () => {
		if (idUser) {
			const addCart = await CartService.createCart({ idUser, idProduct: detail._id });
			if (addCart?.status === "SUCCESS") {
				toast.success("Thêm vào giỏ hàng thành công!");
			} else if (addCart?.status === "EXIST") {
				toast.warning("Bạn đã thêm sản phẩm này rồi");
			}
		} else {
			navigate("/login", { state: location.pathname });
		}
	};

	return (
		<div>
			<Row style={{ display: "flex" }}>
				<Col xs={8}>
					<div className={cx("inner-content", "left")}>
						<Carousel className={cx("carousel")}>
							{detail &&
								[detail.images]?.map((image, index) => (
									<Carousel.Item key={index}>
										<img
											src={`/assets/images-product/${image[index]?.name}`}
											alt="anh-san-pham"
										/>
									</Carousel.Item>
								))}
						</Carousel>

						{detail && (
							<div className={cx("details")} style={{ paddingLeft: 10 }}>
								<p className={cx("title")}>{detail?.name}</p>
								<p className={cx("price")}>
									{Intl.NumberFormat().format(detail?.price)}đ
								</p>
								<div style={{ display: "flex" }}>
									<p className={cx("note")}>
										<UserOutlined className={cx("icon")} />
										{detail?.sellerName}
									</p>
									<p className={cx("note")}>
										<ClockCircleOutlined className={cx("icon")} />
										<ReactTimeAgo
											date={Date.parse(detail?.createdAt)}
											locale="vi-VN"
										/>
									</p>
									<p className={cx("note")}>
										<EnvironmentOutlined className={cx("icon")} />
										{detail?.address}
									</p>
								</div>
								<p className={cx("note")}>
									<CheckOutlined className={cx("icon")} />
									<span>Tin đã được kiểm duyệt</span>
								</p>
								<br />
							</div>
						)}
					</div>
					<div className={cx("inner-content", "description")}>
						<p className="title">Thông tin chi tiết</p>
						<p className={cx("description")}>{detail?.description}</p>
						{detail &&
							Object.keys(detail?.info).map((value, index) => (
								<p className={cx("info")} key={index}>
									<SendOutlined className={cx("icon")} />
									<span>
										{value} : {detail?.info[value]}
									</span>
								</p>
							))}

						<p className={cx("info")}>
							<SendOutlined className={cx("icon")} />
							<span>Địa chỉ: </span>
							<span>{detail?.address}</span>
						</p>
					</div>
				</Col>
				<Col className={cx("inner-content", "right")}>
					<div>
						<hr style={{ marginTop: 43 }} />
						<p className="title">Thông tin người bán</p>
						<div className={cx("detail-seller")}>
							<span className={cx("avatar")}>
								{seller?.avatar === "" ? (
									<img src="/assets/images/user-avatar.jpg" alt="avatar" />
								) : (
									<img src={`/assets/images/${seller?.avata}`} alt="avatar" />
								)}
							</span>
							<span>
								<p className={cx("name")}>{seller?.name}</p>
								<p>
									Đánh giá:
									{seller?.rating === 0 ? " Chưa có đánh giá" : seller?.rating}
								</p>
							</span>
						</div>
						<p style={{ marginLeft: 20 }}>Số điện thoại: {seller?.phone}</p>
						<div className={cx("button")}>
							{detail?.sellerName === buyerDetail?.name ? (
								<p style={{ textAlign: "center" }}>Đây là sản phẩm của bạn</p>
							) : (
								<>
									<Button onClick={handleAddCart}>Thêm vào giỏ hàng</Button>
									<Button primary onClick={handleOrderNow}>
										Đặt hàng ngay
									</Button>
								</>
							)}
						</div>
					</div>
				</Col>
			</Row>
			<div className={cx("inner-content", "other-items")}>
				<p className="title">Các sản phẩm tương tự</p>
				<div style={{ display: "flex", flexWrap: "wrap" }}>
					{subCategoryProducts &&
						subCategoryProducts?.map(
							(product, key) =>
								product._id !== id && <CardProduct key={key} product={product} />
						)}
				</div>
			</div>
		</div>
	);
}

export default DetailProduct;
