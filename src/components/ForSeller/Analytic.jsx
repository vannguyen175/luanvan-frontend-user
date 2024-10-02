import { useEffect, useState } from "react";
import * as AnalyticService from "../../service/AnalyticService";
import moment from "moment";
import classNames from "classnames/bind";
import style from "./ForSeller.module.scss";
import { useApp } from "~/context/AppProvider";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const cx = classNames.bind(style);

const options = {
	type: "bar",
	responsive: true,
	// scales: {
	// 	y: {
	// 		beginAtZero: true,
	// 	},
	// },
};

function Analytic() {
	const { user } = useApp();
	const idUser = localStorage.getItem("id_user");

	const weekValue = moment().format("YYYY-[W]WW");
	const firstDayOfWeek = moment(weekValue, "YYYY-[W]WW").startOf("isoWeek").toDate();
	const [isOnWeek, setIsOnWeek] = useState(true);
	const [isOnWeekOrder, setIsOnWeekOrder] = useState(true);

	const [resultProduct, setResultProduct] = useState({
		onSell: "",
		selled: "",
	});

	const [resultOrder, setResultOrder] = useState({
		revenue: {},
		stateOrders: {},
		totalRevenueChart: {},
	});

	const getAnalyticProduct = async (dataType, startDay) => {
		const res = await AnalyticService.analyticProducts({
			idUser: idUser,
			typeDate: dataType,
			typeUser: "seller",
			startDay: startDay,
		});
		setResultProduct({
			onSell: res.onSell,
			selled: res.selled,
			totalPosted: res.totalPosted,
			totalSelled: res.totalSelled,
			totalRejected: res.totalRejected,
		});
	};

	const getAnalyticOrder = async (dataType, startDay) => {
		const res = await AnalyticService.analyticOrders({
			idSeller: idUser,
			typeDate: dataType,
			startDay: startDay,
		});

		setResultOrder({
			revenue: res.totalRevenue[0].totalRevenue,
			stateOrders: res.stateOrders,
			totalRevenueChart: res.totalRevenueChart,
		});
	};

	const handleChangeWeekProduct = (e) => {
		const weekValue = e.target.value;
		const weekChanged = moment(weekValue, "YYYY-[W]WW").startOf("isoWeek").toDate();
		getAnalyticProduct("week", weekChanged);
	};
	const handleChangeWeekOrder = (e) => {
		const weekValue = e.target.value;
		const weekChanged = moment(weekValue, "YYYY-[W]WW").startOf("isoWeek").toDate();
		getAnalyticOrder("week", weekChanged);
	};

	const handleChangeDataType = (e) => {
		if (e.target.value === "week") {
			setIsOnWeek(true);
			getAnalyticProduct(e.target.value, firstDayOfWeek);
		} else {
			setIsOnWeek(false);
			getAnalyticProduct(e.target.value, firstDayOfWeek);
		}
	};

	const handleChangeDataTypeOrder = (e) => {
		if (e.target.value === "week") {
			setIsOnWeekOrder(true);
			getAnalyticOrder(e.target.value, firstDayOfWeek);
		} else {
			setIsOnWeekOrder(false);
			getAnalyticOrder("month", firstDayOfWeek);
		}
	};

	let dataProduct = {
		labels: Object.keys(resultProduct?.selled),
		datasets: [
			{
				label: "Đăng bán",
				data: Object.values(resultProduct?.onSell),
				backgroundColor: "rgba(75, 192, 192, 0.2)", //Xanh
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
			},
			{
				label: "Đã bán",
				data: Object.values(resultProduct?.selled),
				backgroundColor: "rgba(253, 188, 9, 0.3)", //Vàng cam
				borderColor: "rgba(253, 188, 9, 1)",
				borderWidth: 1,
			},
		],
	};

	let dataRevenue = {
		labels: Object.keys(resultOrder?.totalRevenueChart || {}),
		datasets: [
			{
				label: "Doanh thu",
				data: Object.values(resultOrder?.totalRevenueChart || {}),
				backgroundColor: "rgba(253, 188, 9, 0.3)", //Vàng cam
				borderColor: "rgba(253, 188, 9, 1)",
				borderWidth: 1,
			},
		],
	};

	useEffect(() => {
		getAnalyticProduct("week", firstDayOfWeek);
		getAnalyticOrder("week", firstDayOfWeek);
	}, []);

	return (
		<div>
			<div className="inner-content" style={{ padding: 10 }}>
				{user?.name && (
					<div className={cx("account-info")}>
						<img src={user?.avatar || "assets/images/user-avatar.jpg"} alt="avatar" />
						<div style={{ width: "100%" }}>
							<p className={cx("name")}>{user.name}</p>
							<div className={cx("info")}>
								<div>
									<p>Vai trò</p>
									{user?.totalSold < 2
										? "Nhà bán hàng mới"
										: "Nhà bán hàng chuyên nghiệp"}
								</div>
								<div>
									<p>Số điện thoại</p>
									{user.phone}
								</div>
								<div>
									<p>Địa chỉ email</p>
									{user.email}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className={cx("inner-content", "product")}>
				<p className="title">Thống kê theo sản phẩm</p>
				<div>
					{resultProduct.totalPosted && (
						<div style={{ display: "flex", justifyContent: "space-evenly" }}>
							<div className={cx("data-product")}>
								<p>Số sản phẩm đã đăng</p>
								<strong>{resultProduct.totalPosted}</strong>
							</div>
							<div className={cx("data-product")}>
								<p>Số sản phẩm đã bán</p>
								<strong>{resultProduct.totalSelled}</strong>
							</div>
							<div className={cx("data-product")}>
								<p>Số sản phẩm đang chờ duyệt</p>
								<strong>{resultProduct.totalRejected}</strong>
							</div>
						</div>
					)}
				</div>
				<div className={cx("chart")}>
					<select name="typeDate" onChange={handleChangeDataType}>
						<option value="week">Theo tuần</option>
						<option value="month">Theo tháng</option>
					</select>
					{isOnWeek && (
						<input
							type="week"
							onChange={handleChangeWeekProduct}
							defaultValue={weekValue}
						/>
					)}
					<Bar data={dataProduct} options={options} />
				</div>
			</div>
			<div className={cx("inner-content", "order")}>
				<p className="title">Thống kê theo doanh thu</p>

				<div>
					{resultOrder.stateOrders && (
						<div style={{ display: "flex", justifyContent: "space-evenly" }}>
							<div className={cx("data-order")}>
								<p>Tổng đơn hàng đang chờ</p>
								<strong>{resultOrder.stateOrders.waiting}</strong>
							</div>
							<div className={cx("data-order")}>
								<p>Tổng đơn hàng đã bán</p>
								<strong>{resultOrder.stateOrders.approved}</strong>
							</div>
							<div className={cx("data-order")}>
								<p>Tổng đơn hàng bị hủy</p>
								<strong>{resultOrder.stateOrders.rejected}</strong>
							</div>
							<div className={cx("data-order")}>
								<p>Tổng doanh thu</p>
								<strong>{Intl.NumberFormat().format(resultOrder.revenue)}đ</strong>
							</div>
						</div>
					)}
				</div>
				<div className={cx("chart")}>
					<select name="typeDate" onChange={handleChangeDataTypeOrder}>
						<option value="week">Theo tuần</option>
						<option value="month">Theo tháng</option>
					</select>
					{isOnWeekOrder && (
						<input
							type="week"
							onChange={handleChangeWeekOrder}
							defaultValue={weekValue}
						/>
					)}
					{Object.keys(resultOrder?.totalRevenueChart || {})[0] && (
						<Bar data={dataRevenue} options={options} />
					)}
				</div>
			</div>
		</div>
	);
}

export default Analytic;
