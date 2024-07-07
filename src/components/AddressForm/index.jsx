import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import * as UserService from "~/service/UserService";
import subVn from "sub-vn";

function AddressForm({ setDataSubmit }) {
	const [name, setName] = useState("");
	const [address, setAddress] = useState({
		province: "",
		district: "",
		ward: "",
		address: "",
		phone: "",
	});

	useEffect(() => {
		const id = localStorage.getItem("id_user");
		const token = localStorage.getItem("access_token");
		const getUser = async () => {
			await UserService.getDetailUser(id, token).then((data) => {
				setName(data.user.name);
			});
		};
		getUser();
	}, []);

	const [provinceCode, setProvinceCode] = useState(""); //Lấy code tỉnh/thành phố
	const [districtCode, setDistrictCode] = useState(""); //Lấy code huyện/quận

	const hanldeChangeProvince = async (e) => {
		const listProvince = await subVn.getProvinces();
		const selectedProvince = listProvince.find((item) => item.name === e.target.innerText);
		if (selectedProvince) {
			setProvinceCode(selectedProvince.code);
		}
		setAddress({ ...address, province: e.target.innerText });
		setDataSubmit((prevData) => ({
			...prevData,
			address: {
				...prevData.address,
				province: e.target.innerText,
			},
		}));
	};
	const hanldeChangeDistrict = async (e) => {
		const listDistrict = await subVn.getDistricts();
		//có name district, cần code district để truy xuất ward => dùng map
		const selectedDistrict = listDistrict.find((item) => item.name === e.target.innerText);
		if (selectedDistrict) {
			setDistrictCode(selectedDistrict.code);
		}
		setAddress({ ...address, district: e.target.innerText });
		setDataSubmit((prevData) => ({
			...prevData,
			address: {
				...prevData.address,
				district: e.target.innerText,
			},
		}));
	};
	const hanldeChangeWard = (e) => {
		setAddress({ ...address, ward: e.target.innerText });
		setDataSubmit((prevData) => ({
			...prevData,
			address: {
				...prevData.address,
				ward: e.target.innerText,
			},
		}));
	};

	const handleChange = (e) => {
		setDataSubmit((prevData) => ({
			...prevData,
			address: {
				...prevData.address,
				[e.target.name]: e.target.value,
			},
		}));
	};

	return (
		<div
			style={{
				textAlign: "left",
				boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
				padding: 20,
			}}
		>
			{name && (
				<TextField
					defaultValue={name}
					label="Tên người bán"
					variant="outlined"
					className="text-field"
					InputProps={{ readOnly: true }}
				/>
			)}
			<TextField
				name="phone"
				onChange={handleChange}
				label="Số điện thoại"
				variant="outlined"
				type="number"
				className="text-field"
				style={{ margin: "15px 0" }}
			/>
			<Autocomplete
				options={subVn.getProvinces().map((item) => item.name)}
				onChange={hanldeChangeProvince}
				renderInput={(params) => <TextField {...params} label="Tỉnh/thành phố" />}
			/>
			{provinceCode && (
				<Autocomplete
					options={subVn
						.getDistrictsByProvinceCode(provinceCode)
						.map((item) => item.name)}
					onChange={hanldeChangeDistrict}
					renderInput={(params) => <TextField {...params} label="Huyện/quận" />}
					style={{ margin: "15px 0" }}
				/>
			)}

			{districtCode && (
				<>
					<Autocomplete
						options={subVn
							.getWardsByDistrictCode(districtCode)
							.map((item) => item.name)}
						onChange={hanldeChangeWard}
						renderInput={(params) => <TextField {...params} label="Phường/xã" />}
					/>
					<TextField
						name="address"
						onChange={handleChange}
						label="Địa chỉ chi tiết"
						variant="outlined"
						className="text-field"
						style={{ margin: "15px 0" }}
					/>
				</>
			)}
		</div>
	);
}

export default AddressForm;
