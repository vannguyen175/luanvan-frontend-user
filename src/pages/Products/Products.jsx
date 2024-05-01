import style from "./Products.module.scss";
import classNames from "classnames/bind";
import Button from "~/components/Button";
import CardProduct from "~/components/CardProduct";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "~/service/ProductService";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { convertToSlug } from "~/utils";

const cx = classNames.bind(style);

function Products() {
	const { slug_category } = useParams();
	const [subCateChosen, setSubCateChosen] = useState();
	const [subCategory, setSubCategory] = useState();

	const getSubCategory = async () => {
		const res = await ProductService.getSubCategory(slug_category);
		setSubCategory(res.subCategory);
		console.log(res);
		setSubCateChosen(res.subCategory[0]?.name);
		//return res.subCategory;
	};
	useEffect(() => {
		getSubCategory();
	}, []);

	const getProductsBySubCate = async () => {
		const res = await ProductService.getAllProductsBySubCate(convertToSlug(subCateChosen));
		return res.data;
	};

	// //lấy thông tin sản phẩm khi vừa truy cập hoặc reload trang
	// const querySubCategory = useQuery({ queryKey: ["sub-category"], queryFn: getSubCategory });
	// const { data: subCategory } = querySubCategory;

	//lấy thông tin sản phẩm khi vừa truy cập hoặc reload trang
	const queryProduct = useQuery({
		queryKey: ["product"],
		queryFn: getProductsBySubCate,
		refetchOnWindowFocus: false,
		enabled: false,
	});
	const { data: products, refetch: refetchProduct } = queryProduct;

	//thay đổi subCateChosen mỗi khi user nhấn chọn danh mục phụ
	const handleShowProducts = (subCate) => {
		setSubCateChosen(subCate.name);
	};

	//mỗi lần subCateChosen thay đổi, getProductsBySubCate sẽ được refetch để lấy data products
	useEffect(() => {
		if (subCateChosen) {
			refetchProduct();
		}
	}, [subCateChosen, refetchProduct]);

	console.log("subCategory", subCategory);

	return (
		<div className={cx("container")}>
			<div className={cx("shop-category", "inner-content")}>
				<p className={cx("title")}>Danh mục phụ</p>
				{subCategory?.map((subCate, index) => (
					<Button
						key={index}
						chosenBtn={subCateChosen === subCate.name}
						onClick={() => handleShowProducts(subCate)}
					>
						{subCate.name}
					</Button>
				))}
			</div>
			<div className={cx("shop-new", "inner-content")}>
				<p className={cx("title")}>Tin đăng mới</p>
				<div style={{ display: "flex", flexWrap: "wrap" }}>
					{products &&
						products?.map((product, key) => (
							<CardProduct key={key} product={product} type="horizontal" />
						))}
				</div>
			</div>
		</div>
	);
}

export default Products;
