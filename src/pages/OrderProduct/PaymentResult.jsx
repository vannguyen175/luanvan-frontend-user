import { useEffect, useState } from "react";
import * as OrderService from "~/service/OrderService";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

function PaymentResult() {
	const navigate = useNavigate();
	const dataOrder = JSON.parse(localStorage.getItem("dataOrder") || "{}");
	const [isLoading, setIsLoading] = useState(true);
	const [result, setResult] = useState(JSON.parse(localStorage.getItem("result-payment")) || "");
	const [amountPaid, setAmountPaid] = useState(localStorage.getItem("amount-paid") || "");

	const createOrder = async () => {
		if (result === "") {
			const res = await OrderService.createOrder(dataOrder);
			localStorage.removeItem("dataOrder");
			if (res.status === "SUCCESS") {
				setIsLoading(false);
			}
			setResult(res);
			localStorage.setItem("result-payment", JSON.stringify(res));
			localStorage.setItem("amount-paid", dataOrder.totalPaid);
			setAmountPaid(dataOrder.totalPaid);
		} else {
			localStorage.removeItem("dataOrder");
		}
		setIsLoading(false);
	};
	useEffect(() => {
		createOrder();
	}, []);

	const handleBack = () => {
		localStorage.removeItem("result-payment", "amount-paid");
		navigate("/");
	};

	return (
		<>
			{isLoading ? (
				<Backdrop
					sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
					open={isLoading}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
			) : (
				<div
					className="inner-content"
					style={{
						textAlign: "center",
						width: "50%",
						margin: "100px auto",
						padding: "30px 0px",
					}}
				>
					{result?.status === "success" ? (
						<CheckCircleIcon
							style={{ color: "green", transform: "scale(3.5)", marginTop: 50 }}
						/>
					) : (
						<ErrorIcon
							style={{ color: "green", transform: "scale(3.5)", marginTop: 50 }}
						/>
					)}
					<h3 style={{ marginTop: 40 }}>{result.message}</h3>

					{result?.status === "success" && (
						<>
							<p>Nhà bán hàng sẽ chuẩn bị hàng và sớm giao đến cho bạn.</p>
							<div
								style={{
									boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
									width: "60%",
									margin: "30px auto",
									padding: 20,
									borderRadius: 10,
								}}
							>
								<h5>Tổng tiền đã thanh toán:</h5>
								<h4>{Intl.NumberFormat().format(amountPaid)}đ</h4>
							</div>
						</>
					)}
					<Button onClick={handleBack} primary>
						Quay về trang chủ
					</Button>
				</div>
			)}
		</>
	);
}

export default PaymentResult;
