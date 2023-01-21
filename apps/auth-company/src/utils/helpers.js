export const validateEmail = (email) => {
	const regex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
	return regex.test(email)
}

export const validatePassword = (password) => {
	const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
	return regex.test(password)
}

export default {
	validateEmail,
	validatePassword,
}
