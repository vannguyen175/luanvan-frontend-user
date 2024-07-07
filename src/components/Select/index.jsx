import classNames from "classnames/bind";
import style from "./Select.module.scss";
import { Select as SelectAnt } from "antd";
import styled from "styled-components";

const cx = classNames.bind(style);

const SelectWrapper = styled(SelectAnt)`
	& .ant-select-selector {
		background-color: transparent !important;
		border: none !important;
		outline: none !important;
		padding: 5px !important;
	}
	& .ant-select-selector:focus {
		outline: none !important;
	}
`;

function Select({ innerRef, value, options, name, required, onChange, width, borderColor="black" }) {
	// const filterOption = (input, option) =>
	// 	(option?.label ?? "").toLowerCase().includes(input.toLowerCase());
	return (
		<div className={cx("container")} style={{ border: `1px solid ${borderColor}` }}>
			<span className={cx("text")}>
				{name}:{required && <strong style={{ color: "red" }}>*</strong>}
			</span>
			<SelectWrapper
				className={cx("select")}
				defaultValue={value}
				placeholder={name}
				name="isAdmin"
				ref={innerRef}
				onChange={onChange}
				showSearch
				width={width || ''}

			>
				{options.map((option) => {
					return (
						<SelectWrapper.Option value={option} key={option}>
							{option}
						</SelectWrapper.Option>
					);
				})}
			</SelectWrapper>
		</div>
	);
}

export default Select;
