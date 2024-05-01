import { useEffect, useState } from "react";
import * as orderService from "~/service/OrderService";
import { Statistic } from "antd";
import CountUp from "react-countup";
import classNames from "classnames/bind";
import style from "./Analytics.module.scss";

const cx = classNames.bind(style);

const formatter = (value) => <CountUp end={value} separator="," />;

function Analytics() {
	const [analytics, setAnalytics] = useState();
	const getAnalyticOrder = async () => {
		const data = await orderService.getAnalyticsOrder({
			idUser: localStorage.getItem("id_user"),
		});
		console.log("data", data);
		setAnalytics(data);
	};

	useEffect(() => {
		getAnalyticOrder();
	}, []);
	return (
		<div>
			<div className="inner-content" style={{ paddingLeft: 50 }}>
				<p className="title">Thống kê với vai trò người dùng</p>
				<Statistic
					className={cx("statistic-card")}
					title="Số sản phẩm đã mua"
					value={analytics?.listProductBought?.length}
					formatter={formatter}
				/>

				<Statistic
					className={cx("statistic-card")}
					title="Đơn hàng chờ duyệt"
					value={analytics?.listProductWaiting?.length}
					formatter={formatter}
				/>

				<Statistic
					className={cx("statistic-card")}
					title="Tổng tiền đã mua"
					value={analytics?.priceBought}
					precision={2}
					formatter={formatter}
				/>
			</div>
			<div className="inner-content" style={{ paddingLeft: 50 }}>
				<p className="title">Thống kê với vai trò nhà bán hàng</p>

				<Statistic
					className={cx("statistic-card")}
					title="Số sản phẩm đã bán"
					value={analytics?.listProductSelled?.length}
					formatter={formatter}
				/>

				<Statistic
					className={cx("statistic-card")}
					title="Đơn hàng chờ duyệt"
					value={analytics?.listOrderWaiting?.length}
					formatter={formatter}
				/>

				<Statistic
					className={cx("statistic-card")}
					title="Tổng tiền đã bán"
					value={analytics?.priceSelled}
					precision={2}
					formatter={formatter}
				/>
			</div>
		</div>
	);
}

export default Analytics;
