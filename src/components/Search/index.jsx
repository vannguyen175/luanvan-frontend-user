import { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import classNames from "classnames/bind";
import style from "./Search.module.scss";
import { StringTocamelCase } from "~/utils";
import { useLocation, useNavigate } from "react-router-dom";
import * as productService from "~/service/ProductService";
import Popover from "@mui/material/Popover";

const cx = classNames.bind(style);

function Search() {
	const [inputSearch, setInputSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const searchInputRef = useRef();
	const [anchorEl, setAnchorEl] = useState(null);
	const [productList, setProductList] = useState();
	const location = useLocation();

	const navigate = useNavigate();

	useEffect(() => {
		getProductList();
	}, []);

	const getProductList = async () => {
		const result = await productService.getAllProducts({
			data: { state: [], cate: [], subCate: [] },
			page: `page=1`,
			limit: `limit=10000`,
		});
		setProductList(result);
	};

	//lọc sản phẩm mỗi khi inputSearch thay đổi => tìm kiếm sp
	useEffect(() => {
		console.log(inputSearch.currentTarget);

		if (inputSearch === "") {
			setSearchResult([]);
		} else {
			const filteredProducts = productList.data?.filter((product) => {
				return StringTocamelCase(product.name).includes(StringTocamelCase(inputSearch));
			});
			setSearchResult(filteredProducts);
		}
		// eslint-disable-next-line
	}, [inputSearch]);

	const handleChangeInput = (e) => {
		setInputSearch(e.target.value);
		setAnchorEl(e.currentTarget);
	};

	const handleClickSearchResult = (id) => {
		navigate(`../detail-product/${id}`, { replace: true });

		if (location.pathname.includes("detail-product")) {
			navigate(0); //reload page khi user search product ở detail-product
		}
		searchInputRef.current.value = "";
		setInputSearch("");
	};
	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;
	return (
		<div>
			<div className={cx("search")}>
				<input
					type="text"
					onChange={handleChangeInput}
					//onChange={(e) => setInputSearch(e.target.value)}
					name="search"
					ref={searchInputRef}
					autoComplete="off"
					placeholder="Tìm kiếm sản phẩm..."
				/>
				<button className="button-icon">
					<SearchIcon />
				</button>
			</div>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={() => {
					setAnchorEl(null);
				}}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				PaperProps={{
					style: {
						padding: "5px",
						borderRadius: "8px",
						boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
					},
				}}
			>
				<div>
					TEST SEARCH
					{/* {searchResult?.map((item, index) => (
						<li key={index} onClick={() => handleClickSearchResult(item._id)}>
							<div style={{ display: "flex" }}>
								<div>
									<img src={`${item.images[0]}`} alt="anh-san-pham" />
								</div>
								<div className={cx("detail")}>
									<p style={{ fontWeight: 500 }}>{item.name}</p>
									<p style={{ color: "red" }}>
										{Intl.NumberFormat().format(item?.price)}đ
									</p>
								</div>
							</div>
						</li>
					))} */}
				</div>
			</Popover>
		</div>
	);
}

export default Search;
