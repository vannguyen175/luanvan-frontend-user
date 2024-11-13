import { useEffect, useState } from "react";
import * as AnalyticService from "../../service/AnalyticService";
import moment from "moment";
import classNames from "classnames/bind";
import style from "./Profile.module.scss";
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
	// type: "bar",
	// responsive: true,
	//maintainAspectRatio: false,
};

function Analytics() {
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
		const res = await AnalyticService.analyticProductsUser({
			idUser: idUser,
			typeDate: dataType,
			startDay: startDay,
		});
		setResultProduct({
			brought: res.stateOrders.brought,
			waiting: res.stateOrders.waiting,
			cancel: res.stateOrders.cancel,
			totalPaid: res.totalPaid,
			totalBrought: res.totalBrought,
		});
	};

	const getAnalyticTotalPaid = async (dataType, startDay) => {
		console.log("TEST");

		const res = await AnalyticService.analyticTotalPaid({
			idBuyer: idUser,
			typeDate: dataType,
			startDay: startDay,
		});

		console.log("getAnalyticTotalPaid", res);

		setResultOrder({
			totalPaidChart: res.totalPaidChart,
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
		getAnalyticTotalPaid("week", weekChanged);
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
			getAnalyticTotalPaid(e.target.value, firstDayOfWeek);
		} else {
			setIsOnWeekOrder(false);
			getAnalyticTotalPaid("month", firstDayOfWeek);
		}
	};

	let dataProduct = {
		labels: Object.keys(resultProduct?.totalBrought || {}),
		datasets: [
			{
				label: "Sản phẩm đã mua",
				data: Object.values(resultProduct?.totalBrought || {}),
				backgroundColor: "rgba(75, 192, 192, 0.2)", //Xanh
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
			},
		],
	};

	let dataRevenue = {
		labels: Object.keys(resultOrder?.totalPaidChart || {}),
		datasets: [
			{
				label: "Doanh thu",
				data: Object.values(resultOrder?.totalPaidChart || {}),
				backgroundColor: "rgba(253, 188, 9, 0.3)", //Vàng cam
				borderColor: "rgba(253, 188, 9, 1)",
				borderWidth: 1,
			},
		],
	};

	useEffect(() => {
		getAnalyticProduct("week", firstDayOfWeek);
		getAnalyticTotalPaid("week", firstDayOfWeek);
	}, []);

	return (
		<div>
			<div className={cx("inner-content", "product")}>
				<p className="title">Thống kê theo sản phẩm</p>
				<div>
					{resultProduct.brought && (
						<div style={{ display: "flex", justifyContent: "space-evenly" }}>
							<div className={cx("data-product")}>
								<p>Số sản phẩm đã mua</p>
								<strong>{resultProduct.brought}</strong>
							</div>
							<div className={cx("data-product")}>
								<p>Số đơn hàng đang chờ xử lý</p>
								<strong>{resultProduct.waiting}</strong>
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
				<p className="title">Thống kê tổng chi tiêu mua hàng</p>

				<div>
					{resultProduct.totalPaid && (
						<div style={{ display: "flex", justifyContent: "space-evenly" }}>
							<div className={cx("data-product")}>
								<p>Tổng tiền đã chi</p>
								<strong>
									{Intl.NumberFormat().format(resultProduct.totalPaid)} VND
								</strong>
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
					{/* {Object.keys(resultOrder?.totalRevenueChart || {})[0] && (
					<Bar data={dataRevenue} options={options} />
				)} */}
					<Bar data={dataRevenue} options={options} />
				</div>
			</div>
		</div>
	);
}

export default Analytics;
