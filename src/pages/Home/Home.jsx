import style from "./UserHome.module.scss";
import classNames from "classnames/bind";
import CategoryButton from "~/components/CategoryButton";
import CardProduct from "~/components/CardProduct";
import Button from "~/components/Button";
import * as ProductService from "~/service/ProductService";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const cx = classNames.bind(style);

function UserHome() {
	const [products, setProducts] = useState(null);
	const [categories, setCategories] = useState(null);
	const [pageState, setPageState] = useState({
		isLoading: false,
		data: [],
		total: 0,
		page: 1,
		pageSize: 10,
	});

	//Lấy danh sách sản phẩm đang bán
	const getProducts = async () => {
		const res = await ProductService.getAllProducts({
			data: { state: ["approved"], cate: [], subCate: [] },
			page: `page=${pageState.page}`,
			limit: `limit=${pageState.pageSize}`,
		});
		setProducts(res.data);
	};

	//Lấy danh sách danh mục
	const getCategory = async () => {
		const res = await ProductService.getAllCategories();
		setCategories(res.data);
	};

	useEffect(() => {
		getCategory();
		if (pageState.page) {
			getProducts();
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className={cx("container")}>
			<section
				style={{ backgroundImage: "url(/assets/images/anh-bia.jpg)" }}
				className={cx("section-1")}
			>
				<div className={cx("content", "box-shadow")}>
					<p>Chào mừng đến với website Thanh lý đồ cũ</p>
					<Button primary href="#categories">
						Bắt đầu mua sắm
					</Button>
				</div>
			</section>

			<section className={cx("inner-content")} id="categories">
				<p className={cx("title")}>Khám phá danh mục</p>
				<div className={cx("animate__animated", "animate__fadeIn")}>
					{categories ? (
						categories?.map((category, index) => {
							return (
								<CategoryButton
									key={index}
									to={`san-pham/${category.slug}`}
									src={`assets/images/danh-muc-${category.slug}.jpg`}
									alt={category.slug}
									type={category.name}
								/>
							);
						})
					) : (
						<div style={{ textAlign: "center" }}>
							<CircularProgress />
						</div>
					)}
				</div>
			</section>

			<section className={cx("inner-content")}>
				<p className={cx("title")}>Tin đăng mới</p>
				<div style={{ display: "flex", flexWrap: "wrap" }} >
					{products ? (
						products?.map((product, key) => <CardProduct key={key} product={product} />)
					) : (
						<div style={{ display: "flex", justifyContent: "center" }}>
							<CircularProgress />
						</div>
					)}
				</div>
			</section>
			<section
				className={cx("inner-content")}
				style={{ textAlign: "center", padding: "50px 20px" }}
			>
				<h2 style={{ color: "var(--main-color)" }}>
					Chợ Đồ Cũ - Chợ Mua Bán, Rao Vặt Trực Tuyến Dành Cho Người Việt
				</h2>
				<p style={{ margin: "20px auto 40px auto", width: "68%", fontWeight: 500 }}>
					Mục tiêu: Tạo ra một kênh rao vặt trung gian, kết nối người mua với người bán
					lại với nhau bằng những giao dịch đơn giản, tiện lợi, nhanh chóng, an toàn, mang
					đến hiệu quả bất ngờ.
				</p>
				<div style={{ display: "flex", justifyContent: "space-evenly" }}>
					<div className={cx("advance")}>
						<h3>Tiết kiệm chi phí</h3>
						<p>
							Người mua có thể mua được các sản phẩm với giá thấp hơn so với hàng mới.
						</p>
					</div>
					<div className={cx("advance")}>
						<h3>Tiếp cận dễ dàng</h3>
						<p>
							Người bán dễ dàng tiếp cận với một lượng lớn khách hàng tiềm năng mà
							không cần đầu tư vào cửa hàng vật lý.
						</p>
					</div>
					<div className={cx("advance")}>
						<h3>Đa dạng ngành hàng</h3>
						<p>
							Với Chợ Đồ Cũ, bạn có thể dễ dàng mua bán, trao đổi bất cứ một loại mặt
							hàng nào, dù đó là đồ cũ hay đồ mới với nhiều lĩnh vực.
						</p>
					</div>
					<div className={cx("advance")}>
						<h3>Giao dịch thuận tiện</h3>
						<p>
							Giao dịch được thực hiện trực tuyến, giúp tiết kiệm thời gian và công
							sức cho cả người mua và người bán.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}

export default UserHome;
