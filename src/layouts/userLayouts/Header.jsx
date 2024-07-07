import classNames from "classnames/bind";
import style from "./UserLayouts.module.scss";
import DropdownMenu from "~/components/DropdownMenu";
import Button from "~/components/Button";
import * as UserService from "~/service/UserService";
import * as productService from "~/service/ProductService";
import { StringTocamelCase } from "../../utils";
import { Container, Row, Col } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import Badge from "@mui/material/Badge";

import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
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
		to: "/profile",
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

	return (
		<Container fluid className={cx("header")}>
			<Row style={{ display: "flex" }}>
				<Col className={cx("col")} xs={2}>
					<Link to={"/"} className={cx("logo")}>
						TradeGoods
					</Link>
				</Col>

				<Col className={cx("col")} xs={2}>
					<DropdownMenu title="Danh mục" listActions={categories} />
				</Col>

				{/* Tìm kiếm sản phẩm */}
				<Col className={cx("col")} xs={4}>
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
				</Col>

				{localStorage.getItem("access_token") === null ? (
					<Col className={cx("col")} xs={3} style={{ paddingLeft: 30 }}>
						<DropdownMenu title="Tiện ích" listActions={ActionsUnLogin} />

						<Button
							style={{ marginLeft: 100, marginTop: 5 }}
							children="Login"
							to="/login"
							button
						/>
					</Col>
				) : (
					<Col className={cx("col")} xs={4}>
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
					</Col>
				)}
			</Row>
		</Container>
	);
}

export default Header;
