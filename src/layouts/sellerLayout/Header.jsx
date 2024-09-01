import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

import style from "./SellerLayout.module.scss";
import classNames from "classnames/bind";


const cx = classNames.bind(style);

function SellerLayout() {
	return (
		<Grid
			container
			style={{
				width: "90%",
				margin: "0 auto",
				boxShadow:
					"rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
			}}
			className={cx("header")}
		>
			<Grid item xs={4} className={cx("col")}>
				<Link to={"/"} className={cx("back-btn")}>
					Quay về trang mua sắm
				</Link>
			</Grid>
			<Grid item xs={6} className={cx("col")}>
				<div className="title">Trang dành cho nhà bán hàng</div>
			</Grid>
			<Grid item xs={2} className={cx("col")}>
				<Link to={"/dang-tin"} className={cx("posting-btn")}>
					Đăng tải sản phẩm
				</Link>
			</Grid>
		</Grid>
	);
}

export default SellerLayout;