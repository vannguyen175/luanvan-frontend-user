import classNames from "classnames/bind";
import style from "./Profile.module.scss";

const cx = classNames.bind(style);

function Activities() {
	return (
		<div>
            <div className="inner-content">
                <p className="title">Hoạt động người dùng</p>
                <button className={cx("button")}>Đang theo dõi</button>
                <button className={cx("button")}>Sản phẩm đã xem gần đây</button>
            </div>
            <div className="inner-content">
                <p className="title">Trạng thái đơn hàng</p>
                <button className={cx("button")}>Đang vận chuyển</button>
                <button className={cx("button")}>Đã mua</button> 
            </div>
        </div>
	);
}

export default Activities;
