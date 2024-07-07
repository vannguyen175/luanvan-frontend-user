import style from "./UserHome.module.scss";
import classNames from "classnames/bind";
import CategoryButton from "~/components/CategoryButton";
import CardProduct from "~/components/CardProduct";
import Button from "~/components/Button";
import * as ProductService from "~/service/ProductService";
import { useEffect, useState } from "react";

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
		console.log(res.data);
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
				<div>
					{categories &&
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
						})}
				</div>
			</section>

			<section className={cx("inner-content")}>
				<p className={cx("title")}>Tin đăng mới</p>
				<div style={{ display: "flex", flexWrap: "wrap" }}>
					{products &&
						products?.map((product, key) => (
							<CardProduct key={key} product={product} />
						))}
				</div>
			</section>
		</div>
	);
}

export default UserHome;
