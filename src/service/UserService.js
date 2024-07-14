import Axios from "axios";

export const loginUser = async (data) => {
	const res = await Axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/login`, data);
	return res.data;
};

export const registerUser = async (data) => {
	const res = await Axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/register`, data);
	return res.data;
};

export const logoutUser = async () => {
	const res = await Axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/logout`);
	return res.data;
};

export const getDetailUser = async (id, access_token) => {
	const res = await Axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/user/details/${id}`, {
		headers: { token: `Bearer ${access_token}` },
	});
	return res.data;
};

export const getInfoUser = async (id) => {
	const res = await Axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/user/info/${id}`);
	return res.data;
};

export const updateUser = async (id, access_token, data) => {
	const res = await Axios.put(
		`${process.env.REACT_APP_API_URL_BACKEND}/user/update/${id}`,
		data,
		{ headers: { token: `Bearer ${access_token}` } }
	);

	return res.data;
};

export const deleteUser = async (id, access_token) => {
	const res = await Axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/user/delete/${id}`, {
		headers: { token: `Bearer ${access_token}` },
	});
	return res.data;
};

export const getAllUsers = async (access_token) => {
	const res = await Axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/user/getAll`, {
		headers: { token: `Bearer ${access_token}` },
	});
	return res.data;
};
