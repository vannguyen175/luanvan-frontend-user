import Axios from "axios";

export const analyticProducts = async (data) => {
	const res = await Axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/analytic/product`, data);
	return res.data;
};
export const analyticOrders = async (data) => {
	const res = await Axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/analytic/order`, data);
	return res.data;
};
export const analyticProductsUser = async (data) => {
	const res = await Axios.post(
		`${process.env.REACT_APP_API_URL_BACKEND}/analytic/product-buyer`,
		data
	);
	return res.data;
};
export const analyticTotalPaid = async (data) => {
	const res = await Axios.post(
		`${process.env.REACT_APP_API_URL_BACKEND}/analytic/total-paid-buyer`,
		data
	);
	return res.data;
};
