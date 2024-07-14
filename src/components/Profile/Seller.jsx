import classNames from "classnames/bind";
import style from "./Profile.module.scss";

const cx = classNames.bind(style);

function Seller() {
	return (
		<div>
			<div className="inner-content">
				<p className="title">Thông tin nhà bán hàng</p>
				<button className={cx("button")}>Đăng tải sản phẩm mới</button>
				<button className={cx("button")}>Sản phẩm đang bán</button>
				<button className={cx("button")}>Đánh giá từ khách hàng</button>
			</div>
			<div className="inner-content">
				<p className="title">Trạng thái đơn hàng</p>
				<button className={cx("button")}>Đang vận chuyển</button>
				<button className={cx("button")}>Đã bán</button>
			</div>
			<div className="inner-content">
				<p className="title">Thống kê</p>
				<button className={cx("button")}>Doanh thu theo ngày/tuần/tháng/năm</button>
				<button className={cx("button")}>Thống kê sản phẩm đang bán/đã bán/đã hủy</button>
			</div>
		</div>
	);
}

export default Seller;
