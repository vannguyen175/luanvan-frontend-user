import Grid from "@mui/material/Grid";

function InputComp({ label, placeholder, type, textarea, innerRef, name, onChange }) {
	let Comp = "input";
	if (textarea) {
		Comp = "textarea";
	}
	return (
		<>
			<Grid item xs={2} justify="flex-start">
				<span>{label}:</span>
			</Grid>
			<Grid item xs={9}>
				<Comp
					name={name}
					onChange={onChange}
					ref={innerRef}
					type={type}
					placeholder={placeholder}
				/>
			</Grid>
		</>
	);
}

export default InputComp;
