//Trang menu quản lý của nhà bán hàng

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";

import classNames from "classnames/bind";
import style from "./ForSeller.module.scss";
import { useState } from "react";
import OrderManager from "../../components/ForSeller/OrderManager";
import ProductManager from "../../components/ForSeller/ProductManager";
import ProfileSeller from "../../components/ForSeller/ProfileSeller";
import Analytic from "../../components/ForSeller/Analytic";

const cx = classNames.bind(style);

function ForSeller() {
	const [menuClose, setMenuClose] = useState(true);
	const [menuState, setMenuState] = useState(localStorage.getItem("menu_seller"));

	const handleState = (value) => {
		setMenuState(value);
		localStorage.setItem("menu_seller", value);
	};

	return (
		<div style={{ display: "flex" }}>
			<div className={cx("menu-navigate", "inner-content", { close: !menuClose })}>
				<div className={cx("menu-navigate-header")}>
					<IconButton onClick={() => setMenuClose(!menuClose)}>
						{menuClose ? <ArrowBackIosIcon /> : <MenuIcon />}
					</IconButton>
				</div>
				<div className={cx("menu")}>
					<div
						className={cx({ "menu-active": menuState === "1" })}
						onClick={() => handleState("1")}
					>
						Thông tin nhà bán hàng
					</div>
					<div
						className={cx({ "menu-active": menuState === "2" })}
						onClick={() => handleState("2")}
					>
						Quản lý sản phẩm
					</div>
					<div
						className={cx({ "menu-active": menuState === "3" })}
						onClick={() => handleState("3")}
					>
						Quản lý đơn hàng
					</div>
					<div
						className={cx({ "menu-active": menuState === "4" })}
						onClick={() => handleState("4")}
					>
						Thống kê
					</div>
				</div>
			</div>
			<div className={cx("body")}>
				{menuState === "1" && <OrderManager />}
				{menuState === "2" && <ProductManager />}
				{menuState === "3" && <ProfileSeller />}
				{menuState === "4" && <Analytic />}
			</div>
		</div>
	);
}

export default ForSeller;
