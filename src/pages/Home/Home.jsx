import style from "./UserHome.module.scss";
import classNames from "classnames/bind";
// import { Container, Row, Col } from "react-bootstrap";
import CategoryButton from "~/components/CategoryButton";
import CardProduct from "~/components/CardProduct";
import Button from "~/components/Button";
import * as ProductService from "~/service/ProductService";
import { useQuery } from "@tanstack/react-query";

const cx = classNames.bind(style);

function UserHome() {
	const getProducts = async () => {
		const res = await ProductService.getAllProducts({ filter: "approved", onSale: true });
		return res.data;
	};

	const getCategory = async () => {
		const res = await ProductService.getAllCategories();
		return res.data;
	};

	//lấy thông tin sản phẩm khi vừa truy cập hoặc reload trang
	const queryProducts = useQuery({ queryKey: ["products"], queryFn: getProducts });
	const { data: products } = queryProducts;

	//lấy thông tin danh mục khi vừa truy cập hoặc reload trang
	const queryCategory = useQuery({ queryKey: ["categories"], queryFn: getCategory });
	const { data: categories } = queryCategory;

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
