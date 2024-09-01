import { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ProductForm from "~/components/ProductForm";
import AddressForm from "~/components/AddressForm";
import UploadImage from "~/components/UploadImage";
import { useApp } from "~/context/AppProvider";
import * as ProductService from "~/service/ProductService";
import Button from "~/components/Button";
import { Link } from "react-router-dom";

function PostingProduct() {
	const { user } = useApp();
	const [imageList, setImageList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [dataSubmit, setDataSubmit] = useState({
		idUser: user.id,
		subCategory: "",
		info: {},
		images: "",
		name: "",
		price: "",
		description: "",
		address: {},
	});

	const handleSubmit = async () => {
		setLoading(true);
		const data = {
			...dataSubmit,
			images: imageList,
		};
		const res = await ProductService.createProduct(data);
		if (res.status === "SUCCESS") {
			setLoading(false);
			toast.success(res.message);
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		} else {
			setLoading(false);
			toast.error(res.message);
		}
	};

	return (
		<div className="inner-content" style={{ margin: "10px auto", padding: "20px 30px" }}>
			<div style={{ float: "left" }}>
				<Link to={"/nha-ban-hang"}>
					<ArrowBackIcon />
				</Link>
			</div>
			<p className="title" style={{ textAlign: "center" }}>
				Đăng tải sản phẩm
			</p>

			<Box sx={{ flexGrow: 1 }} style={{ margin: "20px 0px" }}>
				<Grid container spacing={2}>
					<Grid xs={2} style={{ borderRight: "2px solid var(--main-color)" }}>
						<UploadImage setImageList={setImageList} />
					</Grid>
					<Grid xs={6}>
						<ProductForm setDataSubmit={setDataSubmit} />
					</Grid>
					<Grid xs={4} style={{ borderLeft: "2px solid var(--main-color)" }}>
						<AddressForm setDataSubmit={setDataSubmit} />
					</Grid>
				</Grid>
			</Box>

			<div style={{ textAlign: "center" }}>
				<Button onClick={handleSubmit} className="center">
					{loading ? (
						<>
							Đang tiến hành đăng bài, vui lòng chờ trong giây lát...
							<CircularProgress size={20} />
						</>
					) : (
						<>Đăng tải</>
					)}
				</Button>
			</div>
		</div>
	);
}

export default PostingProduct;
