import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import style from "./Cart.module.scss";
import * as CartService from "~/service/CartService";
import { useEffect, useState } from "react";
import Button from "~/components/Button";

const cx = classNames.bind(style);

function Cart() {
	const { id } = useParams(); //idUser
	let navigate = useNavigate();
	const [cartDetail, setCartDetail] = useState([]);
	const getCarts = async () => {
		const result = await CartService.getCart(id);
		setCartDetail(result.data);
	};
	useEffect(() => {
		getCarts();
		// eslint-disable-next-line
	}, [id]);
	const handleDeleteCart = async (idProduct) => {
		await CartService.deleteCart({ idUser: id, idProduct: idProduct });
		getCarts();
	};

	const handlePurchase = (idCart) => {
		navigate(`/dat-hang/${idCart}`);
	};

	return (
		<div className="inner-content" style={{ width: 1000, margin: "20px auto" }}>
			<p className="title" style={{ textAlign: "center" }}>
				Giỏ hàng của bạn
			</p>
			<div className={cx("container")}>
				{cartDetail?.map((cart, index) => {
					return (
						<div className={cx("cart", "row")} key={index}>
							<div style={{ display: "flex" }}>
								<img
									className="col-3"
									src={`${cart?.images[0]}`}
									alt="anh-san-pham"
								/>
								<div className={cx("detail", "col-7")}>
									<p className={cx("name")}>{cart?.name}</p>
									<p className={cx("price")}>
										{Intl.NumberFormat().format(cart?.price)}đ
									</p>
									{cart?.statePost === "selled" ? (
										<p style={{ color: "red" }}>Hết hàng</p>
									) : (
										""
									)}
									<p>Số lượng x 1</p>
								</div>
								<div className={cx("col-2", "action")}>
									{cart?.statePost === "selled" ? (
										<Button disabled>Thanh toán</Button>
									) : (
										<Button primary onClick={() => handlePurchase(cart._id)}>
											Thanh toán
										</Button>
									)}

									<Button
										danger
										onClick={() => handleDeleteCart(cart._id)}
										style={{ width: 109 }}
									>
										Xóa
									</Button>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Cart;
