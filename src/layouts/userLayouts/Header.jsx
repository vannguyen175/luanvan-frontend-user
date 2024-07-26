import classNames from "classnames/bind";
import style from "./UserLayouts.module.scss";
import DropdownMenu from "~/components/DropdownMenu";
import Button from "@mui/material/Button";
import * as UserService from "~/service/UserService";
import * as productService from "~/service/ProductService";
import { StringTocamelCase } from "../../utils";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import Badge from "@mui/material/Badge";
import Grid from "@mui/material/Grid";

import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";

const cx = classNames.bind(style);

const categories = [
	{
		name: "Đồ nội thất",
		to: "/san-pham/noi-that",
	},
	{
		name: "Thiết bị điện tử",
		to: "/san-pham/do-dien-tu",
	},
	{
		name: "Thú cưng",
		to: "/san-pham/thu-cung",
	},
];

const ActionsUnLogin = [
	{
		name: "Đăng nhập",
		to: "/login",
	},
	{
		name: "Đăng ký",
		to: "/register",
	},
];

const ActionUserLogin = [
	{
		name: "Thông tin tài khoản",
		to: "/tai-khoan",
	},
	{
		name: "Nhà bán hàng",
		to: "/nha-ban-hang",
	},
	{
		name: "Đăng tải sản phẩm",
		to: "/dang-tin",
	},
];

function Header() {
	const navigate = useNavigate();
	const location = useLocation();
	const [productList, setProductList] = useState();
	const [name, setName] = useState("");
	const [inputSearch, setInputSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const searchInputRef = useRef();
	//lọc sản phẩm mỗi khi inputSearch thay đổi => tìm kiếm sp
	useEffect(() => {
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

	async function getNameAccount() {
		const id = localStorage.getItem("id_user");
		const token = localStorage.getItem("access_token");
		await UserService.getDetailUser(id, token).then((data) => {
			setName(data.user.name);
		});
	}
	useEffect(() => {
		if (localStorage.getItem("id_user")) {
			getNameAccount();
		}
	}, []);
	const handleLogout = async () => {
		await localStorage.clear();
		navigate("/");
	};

	const handleShowCart = () => {
		let idUser = localStorage.getItem("id_user");
		navigate(`/gio-hang/${idUser}`);
	};

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

	const handleClickSearchResult = (id) => {
		navigate(`../detail-product/${id}`, { replace: true });

		if (location.pathname.includes("detail-product")) {
			navigate(0); //reload page khi user search product ở detail-product
		}
		searchInputRef.current.value = "";
		setInputSearch("");
	};

	const handleLogin = () => {
		navigate("/login");
	};

	return (
		<Grid
			container
			style={{
				width: "90%",
				margin: "0 auto",
				boxShadow:
					"rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
			}}
		>
			<Grid item xs={2} className={cx("col")}>
				<Link to={"/"} className={cx("logo")}>
					TradeGoods
				</Link>
			</Grid>

			<Grid item xs={2} className={cx("col")}>
				<DropdownMenu title="Danh mục" listActions={categories} />
			</Grid>

			{/* Tìm kiếm sản phẩm */}
			<Grid item xs={4} className={cx("col")}>
				<div className={cx("search")}>
					<input
						type="text"
						onChange={(e) => setInputSearch(e.target.value)}
						name="search"
						ref={searchInputRef}
						autoComplete="off"
						placeholder="Tìm kiếm sản phẩm..."
					/>
					<button className="button-icon">
						<SearchIcon />
					</button>
				</div>
				<ul className={cx("search-result")}>
					{searchResult?.map((item, index) => (
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
					))}
				</ul>
			</Grid>

			{localStorage.getItem("access_token") === null ? (
				<Grid item xs={4} className={cx("col")}>
					<DropdownMenu title="Tiện ích" listActions={ActionsUnLogin} />

					<Button
						style={{ marginLeft: 100 }}
						variant="contained"
						size="small"
						to="/login"
						onClick={handleLogin}
					>
						Đăng nhập
					</Button>
				</Grid>
			) : (
				<Grid item xs={4} className={cx("col")} style={{ paddingLeft: 30 }}>
					<div className="icon-button">
						<ShoppingCartIcon onClick={handleShowCart} />
					</div>

					<Badge badgeContent={4} color="primary" className="icon-button">
						<NotificationsIcon onClick={handleShowCart} />
					</Badge>

					<Box ml={3} mr={1} p={0} display="inline-block">
						<DropdownMenu
							title={name}
							listActions={localStorage.getItem("id_user") && ActionUserLogin}
						/>
					</Box>

					<LogoutIcon className="icon-button" onClick={handleLogout} />
				</Grid>
			)}
		</Grid>
	);
}

export default Header;
