import Dropdown from "react-bootstrap/Dropdown";
import classNames from "classnames/bind";
import style from "./DropdownMenu.module.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DropdownMenu({ title, listActions, border, icon, avatar }) {
	const cx = classNames.bind(style);

	return (
		<Dropdown>
			<Dropdown.Toggle
				className={cx("button-dropdown")}
				// id="button-dropdown"
                id="dropdown-basic"
                variant="Secondary"
				style={{
					border: { border },
					display: "flex",
					justifyContent: "space-evenly",
					alignItems: "center",
				}}
			>
				{icon && <FontAwesomeIcon icon={icon} style={{ marginRight: 10 }}/>}

				{title}
			</Dropdown.Toggle>

			<Dropdown.Menu>
				{listActions?.map((action, index) => (
					<Link key={index} to={action.to}>
						{action.name}
					</Link>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
}

export default DropdownMenu;
