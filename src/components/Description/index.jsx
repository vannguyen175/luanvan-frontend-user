function Description({ title, desc, onClick, style }) {
	return (
		<span onClick={onClick} style={{ margin: "5px 0", display: "block", ...style }}>
			<strong>{title}: </strong>
			<span>{desc}</span>
		</span>
	);
}

export default Description;
