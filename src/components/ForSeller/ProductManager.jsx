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
	const [productsRejected, setProductsRejected] = useState([]);
	const [productsWaiting, setProductsWaiting] = useState([]);
	const [productsApproved, setProductsApproved] = useState([]);
	const [productsSelled, setProductsSelled] = useState([]);
	const [productsClosed, setProductsClosed] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const getProductsBySubCate = async () => {
		const resRejected = await ProductService.getAllProducts({
			data: { state: ["reject"], cate: [], subCate: [], seller: idUser },
			page: `page=${1}`,
			limit: `limit=${20}`,
		});
		setProductsRejected(resRejected.data);

		const resWaiting = await ProductService.getAllProducts({
			data: { state: ["waiting"], cate: [], subCate: [], seller: idUser },
			page: `page=${1}`,
			limit: `limit=${20}`,
		});

		setProductsWaiting(resWaiting.data);
		const resApproved = await ProductService.getAllProducts({
			data: { state: ["approved"], cate: [], subCate: [], seller: idUser },
			page: `page=${1}`,
			limit: `limit=${20}`,
		});

		setProductsApproved(resApproved.data);
		const resSelled = await ProductService.getAllProducts({
			data: { state: ["selled"], cate: [], subCate: [], seller: idUser },
			page: `page=${1}`,
			limit: `limit=${20}`,
		});
		setProductsSelled(resSelled.data);

		const resClosed = await ProductService.getAllProducts({
			data: { state: ["closed"], cate: [], subCate: [], seller: idUser },
			page: `page=${1}`,
			limit: `limit=${20}`,
		});
		setProductsClosed(resClosed.data);
		setIsLoading(false);
	};

	useEffect(() => {
		setIsLoading(true);
		getProductsBySubCate();
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
	return (
		<div style={{ padding: "10px" }}>
			<div>
				<div className="inner-content">
					<div className="title">Sản phẩm bị từ chối ({productsRejected?.length})</div>
					<TableContainer component={Paper}>
						<Table sx={{ minWidth: 650 }} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell></TableCell>
									<TableCell>Tên SP</TableCell>
									<TableCell>Danh mục</TableCell>
									<TableCell>Giá tiền</TableCell>
									<TableCell>Địa chỉ</TableCell>
									<TableCell>Trạng thái</TableCell>
									<TableCell>Thời điểm</TableCell>
									<TableCell>Chỉnh sửa</TableCell>
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
										{productsRejected[0]?.name ? (
											productsRejected.map((row) => (
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
															style={{ width: 50, height: 50 }}
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
													<TableCell>Đang chờ duyệt</TableCell>
													<TableCell>
														moment({row.createdAt}).format("DD-MM-YYYY
														HH:mm")
													</TableCell>
													<TableCell align="center">
														<Link
															className={cx("button-edit-product")}
															to={``}
														>
															Xem chi tiết
														</Link>
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
			<div>
				<div className="inner-content">
					<div className="title">Sản phẩm đang chờ duyệt ({productsWaiting?.length})</div>
					<TableContainer component={Paper}>
						<Table sx={{ minWidth: 650 }} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell></TableCell>
									<TableCell>Tên SP</TableCell>
									<TableCell>Danh mục</TableCell>
									<TableCell>Giá tiền</TableCell>
									<TableCell>Địa chỉ</TableCell>
									<TableCell>Trạng thái</TableCell>
									<TableCell>Thời điểm</TableCell>
									<TableCell>Chỉnh sửa</TableCell>
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
										{productsWaiting[0]?.name ? (
											productsWaiting.map((row) => (
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
															style={{ width: 50, height: 50 }}
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
													<TableCell>Đang chờ duyệt</TableCell>
													<TableCell>
														{moment(row.createdAt).format(
															"DD-MM-YYYY HH:mm"
														)}
													</TableCell>

													<TableCell align="center">
														<Link
															className={cx("button-edit-product")}
															to={`/detail-product/${row._id}`}
														>
															Xem chi tiết
														</Link>
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

			<div className="inner-content">
				<div className="title">Sản phẩm đang bán ({productsApproved?.length})</div>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell></TableCell>
								<TableCell>Tên SP</TableCell>
								<TableCell>Danh mục</TableCell>
								<TableCell>Giá tiền</TableCell>
								<TableCell>Địa chỉ</TableCell>
								<TableCell>Số lượng</TableCell>
								<TableCell>Đã bán</TableCell>
								<TableCell>Thời điểm</TableCell>
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
									{productsApproved[0]?.name ? (
										productsApproved.map((row) => (
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
														style={{ width: 50, height: 50 }}
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
														Đóng sản phẩm
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

			<div className="inner-content">
				<div className="title">Sản phẩm đã bán hết ({productsSelled?.length})</div>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell></TableCell>
								<TableCell>Tên SP</TableCell>
								<TableCell>Danh mục</TableCell>
								<TableCell>Giá tiền</TableCell>
								<TableCell>Địa chỉ</TableCell>
								<TableCell>Số lượng</TableCell>
								<TableCell>Đã bán</TableCell>
								<TableCell>Thời điểm</TableCell>
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
									{productsSelled[0]?.name ? (
										productsSelled.map((row) => (
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
														style={{ width: 50, height: 50 }}
														src={row.images[0]}
														alt="anh-SP"
													/>
												</TableCell>
												<TableCell>{row.name}</TableCell>
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
														className={cx("button-edit-product")}
														to={`/detail-product/${row._id}`}
													>
														Xem chi tiết
													</Link>
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

			<div className="inner-content">
				<div className="title">Sản phẩm đã đóng ({productsClosed?.length})</div>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell></TableCell>
								<TableCell>Tên SP</TableCell>
								<TableCell>Danh mục</TableCell>
								<TableCell>Giá tiền</TableCell>
								<TableCell>Địa chỉ</TableCell>
								<TableCell>Số lượng</TableCell>
								<TableCell>Đã bán</TableCell>
								<TableCell>Thời điểm</TableCell>
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
									{productsClosed[0]?.name ? (
										productsClosed.map((row) => (
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
														style={{ width: 50, height: 50 }}
														src={row.images[0]}
														alt="anh-SP"
													/>
												</TableCell>
												<TableCell>{row.name}</TableCell>
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
													<div
														className={cx("button-open-product")}
														onClick={() => openProduct(row._id)}
													>
														Mở bán lại
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
