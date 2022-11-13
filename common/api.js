import sk from "@/common/StoryKeys.js"
import api from "@/common/api.js"
// 服务器地址
// let SERVER_HEADER = 'http://localhost:8081/'
let SERVER_HEADER = "https://www.spaceobj.com/"

// 获取ip
let GET_IP = "https://whois.pconline.com.cn/ipJson.jsp";

// 获取IP属地
let IP_ipTerritory = "https://ip.useragentinfo.com/json";

// 用户模块
let USER = SERVER_HEADER + "spaceobj-user/"

//广告模块
let ADVERTISE = SERVER_HEADER + "spaceobj-user/"

//项目模块
let PROJECT = SERVER_HEADER + "spaceobj-project/"

//项目助力模块
let PROJECT_HELP = SERVER_HEADER + "spaceobj-project/"

//其它模块
let OTHER = SERVER_HEADER + "spaceobj-user/"


function post(data, url) {
	if(url!=api.getUserInfo){
		uni.showLoading({
			title: '加载中...'
		})
	}
	var token = uni.getStorageSync(sk.token);
	console.log("请求接口", url);
	return uni.request({
		url: url,
		data: data,
		header: {
			'content-type': 'application/x-www-form-urlencoded',
			'satoken': token != '' ? token : ''
		},
		method: "POST",
	}).then((res) => {
		// 隐藏Loading
		uni.hideLoading();
		var resultData = res[1].data;
		console.log("响应接口：", url, ";结果数据：", resultData);
		if (resultData.code == 500) {
			uni.showToast({
				icon: "none",
				title: resultData.msg
			})
			return resultData;
		}
		if (resultData.code == 201) {
			uni.navigateTo({
				url: '/pages/login/login'
			})

			// 设置登录状态为非登录
			uni.setStorage({
				key: sk.loginStatus,
				data: false
			});
			return resultData;
		}

		return resultData;

	}).catch(err => {
		// 隐藏Loading
		uni.hideLoading();
		uni.showToast({
			title: err,
			icon: 'none'
		})
		return
	})
}

function postJson(data, url) {
	uni.showLoading({
		title: '加载中...'
	})
	var token = uni.getStorageSync(sk.token);
	console.log("请求接口", url);
	return uni.request({
		url: url,
		data: data,
		header: {
			'content-type': 'application/json',
			'satoken': token != '' ? token : ''
		},
		method: "POST",
	}).then((res) => {
		// 隐藏Loading
		uni.hideLoading();
		var resultData = res[1].data;
		console.log("响应接口：", url, ";结果数据：", resultData);
		if (resultData.code == 500) {
			uni.showToast({
				icon: "error",
				title: resultData.msg
			})
			return resultData;
		}
		if (resultData.code == 201) {
			uni.navigateTo({
				url: '/pages/login/login'
			})
			return resultData;
		}

		return resultData;

	}).catch(err => {
		// 隐藏Loading
		uni.hideLoading();
		uni.showToast({
			title: err,
			icon: 'error'
		})
		return
	})
}

function get(data, url) {
	uni.showLoading({
		title: '加载中...'
	})
	console.log("请求接口", url);
	return uni.request({
		url: url,
		data: data,
		header: {
			'content-type': 'application/x-www-form-urlencoded;',
		},
		method: "GET",
	}).then((res) => {
		// 隐藏Loading
		uni.hideLoading();
		var data = res[1].data;
		console.log("响应接口：", url, ";结果数据：", data);
		return data;

	}).catch(err => {
		uni.hideLoading();
		uni.showToast({
			title: err,
			icon: 'none'
		})
		return
	})
}



export default {
	post,
	postJson,
	get,
	publicKey: "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCzZ5SLWaHmBmGQ2C7HsLPJywhHPTJWaSVDdXd2+wC5NzxBkko8atchNhMB2JKQcMnHy25nmleCK9nNBNJmLTBHE+s49klQSL0j8YrOCt+AF6TKP4ej88HTCVZsi755MM2DUQgC5J5gUpsSM3uKRgqTy7R696Rr4l9VZK4ADqvpgQIDAQAB",

	// 获取ip
	GET_IP: GET_IP,
	// 获取ip属地
	ipTerritory: IP_ipTerritory,

	//密码加密
	passwordEncryption: USER + "customerUser/aesEncrypt",
	// 登录、注册接口
	login: USER + "customerUser/loginOrRegister",
	// 微信授权登录
	loginByWechat: USER + "customerUser/loginByWechat",

	// 绑定微信
	bindWechat: USER + "customerUser/bindWechat",

	//重置密码
	resetPassword: USER + "customerUser/resetPassword",
	//普通用户文件上传
	upLoadFile: USER + "customerUser/upload",
	//用户登出
	loginOut: USER + "customerUser/loginOut",
	//根据用户账号获取用户基本信息
	getUserInfo: USER + "customerUser/getUserInfo",
	//普通用户修改用户信息
	customerUpdateUserInfo: USER + "customerUser/updateUserInfo",
	//邮箱验证码
	sendMailCode: USER + "customerUser/sendMailCode",
	//实名认证
	realName: USER + "customerUser/realName",

	//管理员查询用户列表
	findSysUserList: USER + "sysUser/findList",
	//管理员修改用户基本信息
	updateSysUser: USER + "sysUser/updateUser",

	//图片新增或者修改
	addOrUpdatePhoto: USER + "sysPhoto/addOrUpdate",
	//删除图片
	sysPhotoDelete: USER + "sysPhoto/delete",
	//查询图片列表
	sysPhotoList: USER + "sysPhoto/photoList",

	//获取广告列表
	jdList: ADVERTISE + "jd/list",
	//新增广告
	jdSaveAdvertise: ADVERTISE + "jd/saveAdvertise",
	//修改广告
	jdUpdateAdvertise: ADVERTISE + "jd/updateAdvertise",
	//删除广告
	jdDeleteAdvertise: ADVERTISE + "jd/deleteAdvertise",

	//查询项目列表
	projectFindList: PROJECT + "project/findList",
	//新增项目列表
	projectAddProject: PROJECT + "project/addProject",
	//更新项目列表
	projectUpdateProject: PROJECT + "project/updateProject",
	//审核项目
	auditProject: PROJECT + "project/auditProject",
	//修改项目浏览次数
	projectAddPageViews: PROJECT + "project/addPageViews",
	//获取项目联系方式
	getPhoneNumberByProjectId: PROJECT + "project/getPhoneNumberByProjectId",
	//管理员查询所有项目信息
	projectQueryListAdmin: PROJECT + "project/queryListAdmin",

	//创建项目助力链接
	createProjectHelpLink: PROJECT_HELP + "projectHelp/createProjectHelpLink",
	//更新项目助力链接
	updateProjectHelpNumber: PROJECT_HELP + "projectHelp/updateProjectHelpNumber",
	//项目助力列表
	projectHelpList: PROJECT_HELP + "projectHelp/projectHelpList",

	//更新其它
	updateOther: OTHER + "other/updateOther",
	//查询其它
	getOther: OTHER + "other/getOther",

}
