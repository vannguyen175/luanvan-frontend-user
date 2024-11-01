import style from "./Products.module.scss";
import classNames from "classnames/bind";
import Button from "~/components/Button";
import CardProduct from "~/components/CardProduct";
import * as ProductService from "~/service/ProductService";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Search from "../../components/Search";

const cx = classNames.bind(style);

function Products() {
	const { slug_category } = useParams();
	const [subCateChosen, setSubCateChosen] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [subCategory, setSubCategory] = useState();
	const [products, setProducts] = useState();
	const [pageState, setPageState] = useState({
		isLoading: false,
		data: [],
		total: 0,
		page: 1,
		pageSize: 20,
	});

	const getSubCategory = async () => {
		const res = await ProductService.getSubCategory(slug_category);
		setSubCategory(res.subCategory);
		setSubCateChosen(res.subCategory[0]?.name);
		//return res.subCategory;
	};
	useEffect(() => {
		getSubCategory();
		// eslint-disable-next-line
	}, []);

	const getProductsBySubCate = async () => {
		setIsLoading(true);
		const res = await ProductService.getAllProducts({
			data: { state: [], cate: [], subCate: [subCateChosen] }, //vd: chó
			page: `page=${pageState.page}`,
			limit: `limit=${pageState.pageSize}`,
		});
		setProducts(res.data);
		setIsLoading(false);
	};

	//thay đổi subCateChosen mỗi khi user nhấn chọn danh mục phụ
	const handleShowProducts = (subCate) => {
		setSubCateChosen(subCate.name);
	};

	//mỗi lần subCateChosen thay đổi, getProductsBySubCate sẽ được refetch để lấy data products
	useEffect(() => {
		if (subCateChosen) {
			getProductsBySubCate();
		}
		// eslint-disable-next-line
	}, [subCateChosen]);

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
					{isLoading ? (
						<div style={{ margin: "0 auto" }}>
							<CircularProgress />
						</div>
					) : products?.length > 0 ? (
						products?.map((product, key) => (
							<CardProduct key={key} product={product} type="horizontal" />
						))
					) : (
						<p style={{ margin: "0 auto" }}>Danh mục này hiện không có sản phẩm nào.</p>
					)}
				</div>
			{/* <div>
				<Search />
			</div> */}
			</div>
		</div>
	);
}

export default Products;
