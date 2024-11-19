import { useEffect, useState } from "react";
import * as ProductService from "~/service/ProductService";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import CircularProgress from "@mui/material/CircularProgress";

import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import vi from "javascript-time-ago/locale/vi";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";

import classNames from "classnames/bind";
import style from "./ForSeller.module.scss";
import { Link } from "react-router-dom";

TimeAgo.addLocale(vi);

const cx = classNames.bind(style);

function ProductManager() {
	const idUser = localStorage.getItem("id_user"); //idSeller
	const [productsRejected, setProductsRejected] = useState([]);
	const [productsWaiting, setProductsWaiting] = useState([]);
	const [productsApproved, setProductsApproved] = useState([]);
	const [productsSelled, setProductsSelled] = useState([]);
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
		setIsLoading(false);
	};

	useEffect(() => {
		setIsLoading(true);
		getProductsBySubCate();
	}, []);
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
														<ReactTimeAgo
															date={Date.parse(row.createdAt)}
															locale="vi-VN"
														/>
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
														<ReactTimeAgo
															date={Date.parse(row.createdAt)}
															locale="vi-VN"
														/>
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
												<TableCell>Đang bán</TableCell>
												<TableCell>
													<ReactTimeAgo
														date={Date.parse(row.createdAt)}
														locale="vi-VN"
													/>
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
				<div className="title">Sản phẩm đã bán ({productsSelled?.length})</div>
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
												<TableCell>Đã bán</TableCell>
												<TableCell>
													<ReactTimeAgo
														date={Date.parse(row.createdAt)}
														locale="vi-VN"
													/>
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
	);
}

export default ProductManager;
