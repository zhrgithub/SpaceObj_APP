/**
 * 校验邮箱格式
 * 
 * @param {Object} str
 */
function checkEmail(str) {
	var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
	if (re.test(str)) {
		return true;
	} else {
		return false;
	}
}

/**
 * 验证手机号格式是否正确
 * @param {Object} str
 */
function checkMobile(str) {
	if (!(/^1[3456789]\d{9}$/.test(str))) {
		return false;
	} else {
		return true;
	}
}
export default {
	checkEmail,
	checkMobile,
	
}
