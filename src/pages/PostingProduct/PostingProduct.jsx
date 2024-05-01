import { Container, Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import style from "./PostingProduct.module.scss";
import { useEffect, useRef, useState } from "react";
import Select from "~/components/Select";
import Input from "~/components/Input";
import Button from "~/components/Button";

import * as ProductService from "~/service/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "~/components/Loading/Loading";
import { convertToSlug } from "~/utils";
import * as OptionSelect from "~/components/OptionSelect";
import { StringTocamelCase } from "~/utils";
import { useMutationHook } from "~/hooks/useMutaionHook";
import * as UserService from "~/service/UserService";

import { getBase64 } from "~/utils";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import { toast } from "react-toastify";

const cx = classNames.bind(style);

function PostingProduct() {
	let categoryChosen = "";
	let subCategoryChosen = "";

	const categoryRef = useRef("");
	const subCategoryRef = useRef("");
	const nameRef = useRef("");
	const priceRef = useRef("");
	const addressRef = useRef("");
	const descriptionRef = useRef("");

	const [addressSeller, setAddressSeller] = useState("");
	const [dataSubmit, setDataSubmit] = useState();
	const [infoList, setInfoList] = useState([]);
	const [callMutation, setCallMudation] = useState(false);

	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [previewTitle, setPreviewTitle] = useState("");
	const [fileList, setFileList] = useState([]);

	async function detailsUser() {
		const id = localStorage.getItem("id_user");
		const token = localStorage.getItem("access_token");
		await UserService.getDetailUser(id, token).then((data) => {
			setAddressSeller(data.result.address);
		});
	}

	useEffect(() => {
		detailsUser();
	}, []);

	const mutationCreate = useMutationHook((data) => {
		const { ...rests } = data;
		console.log("{ ...rests }.data", { ...rests }.data);
		const res = ProductService.createProduct({ ...rests }.data);
		return res;
	});
	const { data: dataCreate, isLoading: isLoadingCreate } = mutationCreate;

	useEffect(() => {
		if (dataCreate?.status === "SUCCESS") {
			toast.success("Tạo bài đăng thành công!");
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		} else if (dataCreate?.status === "ERROR") {
			toast.error(dataCreate?.message);
		}
	}, [dataCreate]);
	//Upload Image
	const handleCancel = () => setPreviewOpen(false);
	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
		setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
	};

	//Button upload image
	const uploadButton = (
		<button style={{ border: 0, background: "none" }} type="button">
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		</button>
	);
	const handleChangeImage = ({ fileList: newFileList, url }) => setFileList(newFileList, url);

	const getCategories = async () => {
		const res = await ProductService.getAllCategories();
		return res;
	};

	const getSubCategory = async () => {
		const res = await ProductService.getSubCategory(convertToSlug(categoryChosen));
		return res;
	};

	const getSubCategoryInfo = async () => {
		const res = await ProductService.getSubCategoryInfo(convertToSlug(subCategoryChosen));
		return res.data;
	};

	//Lấy danh sách category
	const { data: categoryList, isLoading } = useQuery({
		queryKey: ["category"],
		queryFn: getCategories,
		select: (categoryList) => categoryList.data.map((item) => item.name),
	});

	//Lấy danh sách sub-category
	const {
		data: subCategoryList,
		refetch: refetchSubCategory,
		isLoading: isLoadingSubCate,
	} = useQuery({
		queryKey: ["sub-category"],
		queryFn: getSubCategory,
		select: (subCategoryList) => subCategoryList.subCategory.map((item) => item.name),
		refetchOnWindowFocus: false,
		enabled: false, // disable this query from automatically running
	});

	//Lấy danh sách INFO sub-category
	const { data: subCategoryInfo, refetch: refetchSubCategoryInfo } = useQuery({
		queryKey: ["sub-category-info"],
		queryFn: getSubCategoryInfo,
		refetchOnWindowFocus: false,
		enabled: false, // disable this query from automatically running
	});

	//handle category selected
	const handleCategoryChosen = (e) => {
		categoryChosen = e;
		setDataSubmit((prevData) => ({ ...prevData, category: categoryChosen }));
		refetchSubCategory();
		//refetchSubCategoryInfo();
	};

	//handle sub-category selected
	const handleSubCategoryChosen = (e) => {
		subCategoryChosen = convertToSlug(e);
		setDataSubmit((prevData) => ({ ...prevData, subCategory: subCategoryChosen }));
		refetchSubCategoryInfo();
	};

	const handleGetSelectOption = (camelCaseItem) => {
		return OptionSelect[camelCaseItem];
	};

	const handleChangeStateProduct = (e) => {
		if (e === "Chưa sử dụng") {
			setDataSubmit((prevData) => ({ ...prevData, stateProduct: "new" }));
		} else {
			setDataSubmit((prevData) => ({ ...prevData, stateProduct: "used" }));
		}
	};

	const handleChangeInfo = (item, event) => {
		setInfoList((prevData) => ({ ...prevData, [item.name]: event }));
	};

	//Gọi hàm mutationCreate + đặt setCallMudation(false);
	if (callMutation) {
		mutationCreate.mutate({
			data: dataSubmit,
		});
		setCallMudation(false);
	}
	//Lưu dữ liệu submit vào dataSubmit + đặt setCallMudation(true) để gọi hàm mutation
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("fileList", fileList);
		const listImage = fileList.map((file) => ({
			name: file.name,
		}));
		setDataSubmit((prevData) => ({
			...prevData,
			idUser: localStorage.getItem("id_user"),
			info: infoList,
			images: listImage,
			name: nameRef.current.value,
			price: priceRef.current.value,
			address: addressRef.current.value,
			description: descriptionRef.current.value,
		}));
		setCallMudation(true);
	};

	return (
		<Loading isLoading={isLoadingCreate === true}>
			<Container style={{ minHeight: "80vh" }} className="inner-content">
				<Row>
					<Col xs={3}>
						<div className="title" style={{ textAlign: "center", marginTop: 20 }}>
							Đăng tải sản phẩm
						</div>
						<div className={cx("upload-image")}>
							<p>Đăng hình ảnh sản phẩm</p>
							<p>(Từ 01 đến 06 hình)</p>
							<Upload
								action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
								listType="picture-card"
								//fileList={fileList}
								onPreview={handlePreview}
								onChange={handleChangeImage}
							>
								{fileList.length >= 6 ? null : uploadButton}
							</Upload>
							<Modal
								open={previewOpen}
								title={previewTitle}
								footer={null}
								onCancel={handleCancel}
							>
								<img alt="example" style={{ width: "100%" }} src={previewImage} />
							</Modal>
							{/* <UploadImages /> */}
						</div>
					</Col>
					<Col xs={9}>
						<form style={{ textAlign: "left" }}>
							{categoryList && (
								<Loading isLoading={isLoading}>
									<Select
										innerRef={categoryRef}
										name="Chọn danh mục"
										value="Chưa chọn danh mục"
										options={categoryList}
										onChange={handleCategoryChosen}
										required
									/>
								</Loading>
							)}

							{(subCategoryList || isLoadingSubCate) && (
								<Loading isLoading={isLoadingSubCate}>
									<Select
										innerRef={subCategoryRef}
										name="Chọn danh mục con"
										value="Chưa chọn danh mục con"
										options={subCategoryList || [""]}
										onChange={handleSubCategoryChosen}
										required
									/>
								</Loading>
							)}
							{subCategoryInfo && (
								<div>
									{subCategoryInfo.infoSubCate.map((item, index) => (
										<Select
											name={item.name}
											value="Chưa chọn"
											options={item.option}
											onChange={(event) => handleChangeInfo(item, event)}
											key={index}
											required
										/>
									))}

									{dataSubmit.category !== "Thú cưng" && (
										<Select
											onChange={handleChangeStateProduct}
											name="Tình trạng"
											value="Chưa chọn"
											options={["Chưa sử dụng", "Đã sử dụng"]}
											required
										/>
									)}

									<Input innerRef={nameRef} text="Tên bài đăng" required />
									<Input innerRef={priceRef} text="Giá bán" required />
									<Input
										innerRef={addressRef}
										text="Địa chỉ bán hàng"
										value={addressSeller || undefined}
										required
									/>
									<Input
										innerRef={descriptionRef}
										text="Mô tả chi tiết"
										textarea
									/>
									<div style={{ textAlign: "center", margin: "20px 0" }}>
										<Button onClick={handleSubmit}>
											Đăng sản phẩm và chờ kiểm duyệt
										</Button>
									</div>
								</div>
							)}
						</form>
					</Col>
				</Row>
			</Container>
		</Loading>
	);
}

export default PostingProduct;
