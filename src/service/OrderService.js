import Axios from "axios";

export const createOrder = async (data) => {
	const res = await Axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/order/create`, data);
	return res.data;
};

export const getAllOrders = async (data) => {
	const res = await Axios.post(
		`${process.env.REACT_APP_API_URL_BACKEND}/order-detail/getAll`,
		data
	);
	return res.data;
};
export const cancelOrder = async (data) => {
	const res = await Axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/order/cancel`, data);
	return res.data;
};

export const getAnalyticsOrder = async (data) => {
	const res = await Axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/order/analytics`, data);
	return res.data;
};

export const updateOrder = async (id, data) => {
	const res = await Axios.put(
		`${process.env.REACT_APP_API_URL_BACKEND}/order-detail/update/${id}`,
		data
	);
	return res.data;
};
