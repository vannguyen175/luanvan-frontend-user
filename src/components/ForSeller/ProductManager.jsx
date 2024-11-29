import { useEffect, useState } from "react";
import * as ProductService from "~/service/ProductService";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment/moment";

import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import vi from "javascript-time-ago/locale/vi";
import TimeAgo from "javascript-time-ago";

import classNames from "classnames/bind";
import style from "./ForSeller.module.scss";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";

TimeAgo.addLocale(vi);

const cx = classNames.bind(style);

function ProductManager() {
	const idUser = localStorage.getItem("id_user"); //idSeller
	const [state, setState] = useState("approved");
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const getProductsBySubCate = async (state) => {
		setIsLoading(true);
		const res = await ProductService.getAllProducts({
			data: { state: [state], cate: [], subCate: [], seller: idUser },
			page: `page=${1}`,
			limit: `limit=${20}`,
		});
		setProducts(res.data);
		setIsLoading(false);
	};

	useEffect(() => {
		getProductsBySubCate("approved");
	}, []);

	const closeProduct = async (idProduct) => {
		if (window.confirm("Bạn có chắc muốn đóng bài đăng này?")) {
			const res = await ProductService.updateProduct(idProduct, {
				data: {
					statePost: "closed",
				},
			});
			if (res.status === "SUCCESS") {
				toast.success(res.message);
				getProductsBySubCate();
			} else {
				toast.error(res.message);
			}
		}
	};
	const openProduct = async (idProduct) => {
		if (window.confirm("Bạn có chắc muốn mở bán lại bài đăng này?")) {
			const res = await ProductService.updateProduct(idProduct, {
				data: {
					statePost: "approved",
				},
			});
			if (res.status === "SUCCESS") {
				toast.success(res.message);
				getProductsBySubCate();
			} else {
				toast.error(res.message);
			}
		}
	};

	const handleChangeState = (e) => {
		setState(e.target.value);
		getProductsBySubCate(e.target.value);
	};

	return (
		<div style={{ padding: "10px" }} className="inner-content">
			<p className="title">Quản lý sản phẩm</p>
			<div className={cx("action")}>
				<div className={cx("search")}>
					<label>Tìm kiếm sản phẩm:</label>
					<input type="text" />
					<button>Tìm kiếm</button>
				</div>
				<div>
					<label>Trạng thái sản phẩm:</label>
					<select onChange={handleChangeState} defaultValue="approved">
						<option value="waiting">Chờ duyệt</option>
						<option value="approved">Đang bán</option>
						<option value="selled">Bán hết</option>
						<option value="rejected">Bị hủy</option>
						<option value="closed">Đã đóng</option>
					</select>
				</div>
			</div>
			<div style={{ marginLeft: 20, fontWeight: 500 }}>
				{state === "waiting"
					? "Sản phẩm chờ duyệt"
					: state === "approved"
					? "Sản phẩm đang bán"
					: state === "selled"
					? "Sản phẩm bán hết"
					: state === "rejected"
					? "Sản phẩm bị hủy"
					: "Sản phẩm đã đóng"}{" "}
				({products?.length})
			</div>
			<div className={cx("table")}>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell></TableCell>
								<TableCell
									className=""
									style={{
										width: "300px",
										maxWidth: "300px",
										overflow: "hidden",
										textOverflow: "ellipsis",
									}}
								>
									Tên SP
								</TableCell>
								<TableCell>Danh mục</TableCell>
								<TableCell>Giá tiền</TableCell>
								<TableCell>Địa chỉ</TableCell>
								<TableCell>Số lượng</TableCell>
								<TableCell>Đã bán</TableCell>
								<TableCell>Thời điểm đăng bán</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody className="animate__animated animate__fadeIn">
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={12} align="center">
										<CircularProgress />
									</TableCell>
								</TableRow>
							) : (
								<>
									{products[0]?.name ? (
										products.map((row) => (
											<TableRow
												key={row.name}
												sx={{
													"&:last-child td, &:last-child th": {
														border: 0,
													},
												}}
											>
												<TableCell component="th" scope="row">
													<img
														style={{ width: 80, height: 80 }}
														src={row.images[0]}
														alt="anh-SP"
													/>
												</TableCell>
												<TableCell component="th" scope="row">
													{row.name}
												</TableCell>
												<TableCell>
													{row.subCategory.category.name} -{" "}
													{row.subCategory.name}
												</TableCell>
												<TableCell align="right">
													{Intl.NumberFormat().format(row.price)}đ
												</TableCell>
												<TableCell>{row?.address.address}</TableCell>
												<TableCell>{row.quantity}</TableCell>
												<TableCell>{row.quantityState}</TableCell>
												<TableCell>
													{moment(row.createdAt).format(
														"DD-MM-YYYY HH:mm"
													)}
												</TableCell>
												<TableCell align="center">
													<Link
														className={cx("button-detail-product")}
														to={`/detail-product/${row._id}`}
													>
														Chi tiết
													</Link>
													<div
														className={cx("button-close-product")}
														onClick={() => closeProduct(row._id)}
													>
														Đóng
													</div>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableCell colSpan={12} align="center">
											Không có sản phẩm.
										</TableCell>
									)}
								</>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
}

export default ProductManager;
