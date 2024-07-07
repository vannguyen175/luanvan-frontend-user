import { useState } from "react";
import classNames from "classnames/bind";
import style from "./ImagePreview.module.scss";
import { Box, Modal } from "@mui/material";
import { BorderRight } from "@mui/icons-material";

const styleModal = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	// maxWidth: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
	borderRadius: "10px",
	textAlight: "center",
	backdropFilter: "blur(15px)",
};

const cx = classNames.bind(style);

function ImagePreview({ data }) {
	const [preview, setPreview] = useState(data[0]);

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	return (
		<div className={cx("image-area")}>
			<div className={cx("show-image")}>
				<img onClick={handleOpen} src={preview} alt="anh-san-pham" />
			</div>
			<div className={cx("list-image")}>
				{data &&
					data.map((image, index) => (
						<img
							key={index}
							onMouseEnter={() => setPreview(image)}
							src={image}
							alt="anh-san-pham"
						/>
					))}
			</div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={styleModal}>
					<img src={preview} alt="anh-san-pham" />
				</Box>
			</Modal>
		</div>
	);
}

export default ImagePreview;
