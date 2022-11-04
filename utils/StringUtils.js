/**
 * 校验字符串非空
 * @param {Object} str
 */
function isBlank(str) {
	if (str == null || str == "" || str.length == 0||str=='null'||str=='undefined'||str==undefined) {
		return true;
	} else {
		return false;
	}
}


function isUndefined(obj) {
	if (obj == 'undefined' || obj == undefined) {
		return true;
	} else {
		return false;
	}
}

function timeStampTurnTime(str) {
	var date = new Date(str); // 参数需要毫秒数，所以这里将秒数乘于 1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = date.getDate() + ' ';
	return Y + M + D;
}

function getIp(res){
	console.log(res)
	var ip = null;
	if(res=='undefined'||res==undefined){
		return null;
	}
	// 去除空格
	var remove_blank_space_str = res.replace(/[\r\n]/g, "");
	// 设置剪切ip的正则
	let ip_reg = /([\d\.]*)/gi;
	// 根据ip正则剪切得到ip数组
	var ip_arr = remove_blank_space_str.match(ip_reg);
	// 从ip数组中获取ip
	// 设置合法ip
	var reg_legal =
		/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	for (var i = 0; i < ip_arr.length; i++) {
		var flag = reg_legal.test(ip_arr[i]);
		if (flag) {
			ip = ip_arr[i];
		}
	}
	return ip;
}


export default {
	isBlank,
	timeStampTurnTime,
	isUndefined,
	getIp,
	
}
