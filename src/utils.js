export const isJsonString = (data) => {
	try {
		JSON.parse(data);
	} catch (error) {
		return false;
	}
	return true;
};

export const getBase64 = async (file) =>
	await new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

export const convertToSlug = (name) => {
	return name
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ|Đ/g, "d")
		.toLowerCase()
		.replace(/ /g, "-")
		.replace(/[^\w-]+/g, "");
};

export const StringTocamelCase = (str) => {
	// Using replace method with regEx
	return str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ|Đ/g, "d")
		.replace(/\s(.)/g, function (a) {
			return a.toUpperCase();
		})
		.replace(/\s/g, "")
		.replace(/^(.)/, function (b) {
			return b.toLowerCase();
		});
};

export const formatPhoneNumber = (phoneNumber) => {
	if (phoneNumber) {
		const cleaned = phoneNumber.replace(/\D/g, ""); // Loại bỏ tất cả các ký tự không phải là số
		const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
		if (match) {
			return `${match[1]} ${match[2]} ${match[3]}`;
		}
		return phoneNumber;
	}
};
