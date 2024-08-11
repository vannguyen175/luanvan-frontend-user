import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import subVn from "sub-vn";

import { useApp } from "~/context/AppProvider";

function AddressForm({ setDataSubmit }) {
	const [provinceCode, setProvinceCode] = useState(""); //Lấy code tỉnh/thành phố
	const [districtCode, setDistrictCode] = useState(""); //Lấy code huyện/quận
	const { user } = useApp(); //useContext

	useEffect(() => {
		if (user.district !== "") {
			setDataSubmit((prevData) => ({
				...prevData,
				address: {
					//...prevData.address,
					phone: user.phone,
					province: user.province,
					district: user.district,
					ward: user.ward,
					address: user.address,
				},
			}));
			hanldeChangeProvince(user.province);
			hanldeChangeDistrict(user.district);
			hanldeChangeWard(user.ward);
		}
		// eslint-disable-next-line
	}, [user]);

	const hanldeChangeProvince = async (value) => {
		const listProvince = await subVn.getProvinces();
		const selectedProvince = listProvince.find((item) => item.name === value);

		if (selectedProvince) {
			setProvinceCode(selectedProvince.code);
		}
		setDataSubmit((prevData) => ({
			...prevData,
			address: {
				...prevData.address,
				province: value,
			},
		}));
	};
	const hanldeChangeDistrict = async (value) => {
		const listDistrict = await subVn.getDistricts();
		const selectedDistrict = listDistrict.find((item) => item.name === value);
		if (selectedDistrict) {
			setDistrictCode(selectedDistrict.code);
		}
		setDataSubmit((prevData) => ({
			...prevData,
			address: {
				...prevData.address,
				district: value,
			},
		}));
	};
	const hanldeChangeWard = (value) => {
		setDataSubmit((prevData) => ({
			...prevData,
			address: {
				...prevData.address,
				ward: value,
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
			{user.id && (
				<>
					<TextField
						defaultValue={user.name}
						label="Tên tài khoản"
						variant="outlined"
						className="text-field"
						InputProps={{ readOnly: true }}
					/>
					<TextField
						name="phone"
						defaultValue={user.phone}
						onChange={handleChange}
						label="Số điện thoại"
						variant="outlined"
						type="number"
						className="text-field"
						style={{ margin: "15px 0" }}
					/>

					<Autocomplete
						defaultValue={user.province}
						options={subVn.getProvinces().map((item) => item.name)}
						onChange={(e) => hanldeChangeProvince(e.target.innerText)}
						renderInput={(params) => <TextField {...params} label="Tỉnh/thành phố" />}
					/>
					{(provinceCode || user.district) && (
						<Autocomplete
							defaultValue={user.district}
							options={subVn
								.getDistrictsByProvinceCode(provinceCode)
								.map((item) => item.name)}
							onChange={(e) => hanldeChangeDistrict(e.target.innerText)}
							renderInput={(params) => <TextField {...params} label="Huyện/quận" />}
							style={{ margin: "15px 0" }}
						/>
					)}

					{(districtCode || user.district) && (
						<>
							<Autocomplete
								defaultValue={user.ward}
								options={subVn
									.getWardsByDistrictCode(districtCode)
									.map((item) => item.name)}
								onChange={(e) => hanldeChangeWard(e.target.innerText)}
								renderInput={(params) => (
									<TextField {...params} label="Phường/xã" />
								)}
							/>
							<TextField
								name="address"
								defaultValue={user.address}
								onChange={handleChange}
								label="Địa chỉ chi tiết"
								variant="outlined"
								className="text-field"
								style={{ margin: "15px 0" }}
							/>
						</>
					)}
				</>
			)}
		</div>
	);
}

export default AddressForm;
