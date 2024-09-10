//Trang hiển thị các sản phẩm đang bán + thông tin chung của nhà bán hàng

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as UserService from "~/service/UserService";
import * as ProductService from "~/service/ProductService";
import CardProduct from "~/components/CardProduct";
import { useApp } from "../../context/AppProvider";

import classNames from "classnames/bind";
import style from "./SellerHomePage.module.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const cx = classNames.bind(style);

function SellerPage() {
	const { id } = useParams();
	const { socket, user } = useApp();
	const [isHeart, setIsHeart] = useState(false);
	const [pageState, setPageState] = useState({
		isLoading: false,
		data: [],
		total: 0,
		page: 1,
		pageSize: 10,
	});

	const [detail, setDetail] = useState({
		seller: null,
		product: [],
	});

	const getProducts = async () => {
		const res = await ProductService.getAllProducts({
			data: { state: ["approved"], cate: [], subCate: [], seller: id },
			page: `page=${pageState.page}`,
			limit: `limit=${pageState.pageSize}`,
		});
		setDetail((prevData) => ({ ...prevData, product: res.data }));
	};

	useEffect(() => {
		const getDetailBuyer = async () => {
			const res = await UserService.getInfoUser(id);
			setDetail((prevData) => ({ ...prevData, seller: res.data }));
		};
		getDetailBuyer();
		getProducts();
	}, [id]);

	return (
		<div style={{ position: "relative" }}>
			<div className={cx("inner-content", "header")}>
				<img
					src={detail?.seller?.avatar || "/assets/images/user-avatar.jpg"}
					alt="avatar"
				/>
				<h2>{detail?.seller?.name}</h2>
				{detail?.seller?.totalSelled >= 2
					? "Nhà bán hàng chuyên nghiệp"
					: "Nhà bán hàng mới"}
				{/* <div>{isHeart ? <FavoriteIcon /> : <FavoriteBorderIcon />}</div> */}
			</div>
			<div className={cx("inner-content", "product-list")}>
				<div style={{ display: "flex", flexWrap: "wrap", paddingTop: 20 }}>
					{detail?.product &&
						detail?.product?.map((item, key) => (
							<CardProduct key={key} product={item} type="horizontal" />
						))}
				</div>
			</div>
		</div>
	);
}

export default SellerPage;
