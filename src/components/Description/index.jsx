function Description({ title, desc }) {
	return (
		<span style={{ margin: "5px 0", display: "block" }}>
			<strong>{title}: </strong>
			<span>{desc}</span>
		</span>
	);
}

export default Description;
