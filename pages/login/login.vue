<template>
	<view class="container">
		<view class="logo-background-style">
			spaceObj
		</view>

		<!-- 用户的电话 邮件  -->
		<view class="phone-email-background-style">
			<view class="phone-background-style" v-if="operationType==1">
				<view class="phone-style">
					<input type="text" maxlength="11" placeholder="设置QQ/微信/手机号" @input="getphoneNumber">
				</view>
			</view>

			<view class="phone-background-style" v-if="operationType==0||operationType==2||operationType==1">
				<view class="phone-style">
					<input type="text" maxlength="18" placeholder="请输入邮箱号" @input="getEmail">
				</view>
			</view>
			<view class="phone-background-style">
				<view class="phone-style">
					<input type="password" maxlength="18" placeholder="请输入密码" @input="getPassword">
				</view>
			</view>
			<view class="phone-background-style" v-if="operationType==2">

				<view class="verifiction-style">
					<input type="number" maxlength="6" placeholder="请输入验证码" @input="getVerifition">
				</view>
				<view class="count-down-background-style">
					<view class="count-down-button" @click="countDownNum">
						{{number}}<text v-if="!(number=='获取验证码'||number=='重新获取')">秒后重发</text>
					</view>
				</view>
			</view>

		</view>
		<!-- 登录、注册、重置密码按钮 -->
		<view class="login-background-style">
			<button @click="doLogin" v-if="operationType==0">登录</button>
			<button @click="doRegister" v-if="operationType==1">注册</button>
			<button @click="doResetPassword" v-if="operationType==2">重置密码</button>
		</view>
		<!-- 底部选择按钮 -->
		<view class="reset-password-register">
			<view class="choose-other-style" @click="toRegister" v-if="operationType==0||operationType==2">注册
			</view>
			<view class="choose-other-style" @click="toResetPassword" v-if="operationType==0||operationType==1">
				重置密码</view>
			<view class="choose-other-style" @click="toLogin" v-if="operationType==1||operationType==2">登录
			</view>
		</view>
		<!-- 第三方授权登录 -->
		<view class="third-party-login-background">
			<view class="line-divider"></view>
			<view class="prompt-information-style">
				第三方登录
			</view>
			<view class="line-divider"></view>
		</view>
		<view class="third-party-login-background">
			<image src="/static/wechat.png" @click="loginByWechat" />
		</view>


	</view>
</template>

<script>
	import app from '@/App.vue'
	import api from '@/common/api.js'
	import sk from '@/common/StoryKeys.js'
	import rgx from '@/utils/Regexs.js'
	import JSEncrypt from '@/utils/jsencrypt.min.js'
	import su from '@/utils/StringUtils.js'
	import nick_Name from '@/utils/nickName.js'
	var that;
	export default {
		data() {
			return {
				operationType: 0, //0表示登录，1表示注册,2表示重置密码
				stepStatus: 0,
				phoneNumber: null,
				email: null,
				password: null,
				number: "获取验证码",
				verificatioin: null,
			}
		},
		created() {
			that = this;
		},
		onLoad(e) {

		},

		onShow() {
			this.timer = setTimeout(() => {
				that.number = "获取验证码"

			}, 200)

		},
		methods: {

			loginByWechat() {

				var nickName = nick_Name.getNickName();
				uni.login({
					provider: 'weixin',
					success: function(res) {
						console.log("微信信息：", res)
						api.post({
							code: res.code,
							ipTerritory: uni.getStorageSync(sk.ipTerritory),
							deviceType: uni.getStorageSync(sk.deviceModel).model,
							inviteUserId: uni.getStorageSync(sk.inviteUserId),
							nickName: nickName
						}, api.loginByWechat).then(res2 => {
							if (res2.code == 200) {
								// 缓存用户基本信息
								uni.setStorage({
									key: sk.userInfo,
									data: res2.data,
									success() {
										that.loginResetUserinFo(res2.data, res2.data.token,
											res2.msg);
									}
								})
							}

						})
					}
				});
			},
			doRegister() {
				var email = that.email;
				var password = that.password;
				var phoneNumber = that.phoneNumber;
				var nickName = nick_Name.getNickName();
				if (!rgx.checkEmail(email)) {
					uni.showToast({
						icon: 'none',
						title: "邮箱格式不正确"
					})
					return;
				}
				if (password == null || password.length == 0) {
					uni.showToast({
						icon: 'none',
						title: "密码格式不正确"
					})
					return;
				}
				if (phoneNumber.length == 0) {
					uni.showToast({
						icon: 'none',
						title: "手机格式不正确"
					})
					return;
				}
				// 密码加密
				var en = new JSEncrypt();
				en.setPublicKey(api.publicKey);
				api.post({
					operateType: 0,
					account: email,
					password: en.encrypt(that.password),
					ipTerritory: uni.getStorageSync(sk.ipTerritory),
					deviceType: uni.getStorageSync(sk.deviceModel).model,
					phoneNumber: phoneNumber,
					inviteUserId: uni.getStorageSync(sk.inviteUserId),
					nickName: nickName
				}, api.login).then(res => {

					if (res.code == 200) {
						// 缓存用户基本信息
						uni.setStorage({
							key: sk.userInfo,
							data: res.data,
							success() {
								that.loginResetUserinFo(res.data, res.data.token, res.msg);
							}
						})
					}
				})
			},
			loginResetUserinFo(userInfo, token, msg) {

				// if (su.isBlank(userInfo.email) || su.isBlank(userInfo.phoneNumber)) {
				// 	uni.navigateTo({
				// 		url: '/pages/addEmailPhoneNumber/addEmailPhoneNumber'
				// 	})
				// 	return;
				// }

				// 缓存登录状态
				uni.setStorage({
					key: sk.loginStatus,
					data: true
				})

				//缓存token
				uni.setStorage({
					key: sk.token,
					data: token,
					success() {
						// 转到项目大厅
						uni.showToast({
							icon: 'none',
							title: msg,
							success() {
								uni.switchTab({
									url: '/pages/project/project'
								})
							}
						})
					}
				})

			},
			doResetPassword() {
				var email = that.email;
				var password = that.password;
				var verificatioin = that.verificatioin;
				if (!rgx.checkEmail(email)) {
					uni.showToast({
						icon: 'none',
						title: "邮箱格式不正确"
					})
					return;
				}
				if (password == null || password.length == 0) {
					uni.showToast({
						icon: 'none',
						title: "密码格式不正确"
					})
					return;
				}
				if (verificatioin == null || verificatioin.length < 6) {
					uni.showToast({
						icon: 'none',
						title: "验证码格式不正确"
					})
					return;
				}
				// 密码加密
				var en = new JSEncrypt();
				en.setPublicKey(api.publicKey);
				// 重置密码
				api.post({
					account: that.email,
					emailCode: that.verificatioin,
					newPassword: en.encrypt(that.password),
				}, api.resetPassword).then(res => {

					uni.showToast({
						icon: 'none',
						title: res.msg,

					})
				});




			},

			toLogin() {
				that.operationType = 0;
			},
			toResetPassword() {
				that.operationType = 2;
			},
			toRegister() {
				that.operationType = 1;
			},
			getphoneNumber(e) {
				that.phoneNumber = e.detail.value;
			},
			getEmail(e) {
				that.email = e.detail.value;
			},
			getPassword(e) {
				that.password = e.detail.value;
			},
			getVerifition(e) {
				that.verificatioin = e.detail.value;
			},
			doLogin() {
				if (that.email == "" || that.email == null) {
					uni.showToast({
						icon: 'none',
						title: "请输入邮箱号"
					})
					return;
				}
				if (that.password == "" || that.password == null) {
					uni.showToast({
						icon: 'none',
						title: "请输入密码"
					})
					return;
				}
				var deviceModel = uni.getStorageSync(sk.deviceModel);
				var en = new JSEncrypt();
				en.setPublicKey(api.publicKey);
				var encryPassword = en.encrypt(that.password);
				api.post({
					operateType: 3,
					account: that.email,
					password: encryPassword,
					ipTerritory: uni.getStorageSync(sk.ipTerritory),
					deviceType: deviceModel.model
				}, api.login).then(res => {
					if (res.code == 200) {
						// 缓存用户基本信息
						uni.setStorage({
							key: sk.userInfo,
							data: res.data,
							success() {
								that.loginResetUserinFo(res.data, res.data.token, res.msg);
							}
						})
					}
				})
			},

			countDownNum() {
				if (!rgx.checkEmail(that.email)) {
					uni.showToast({
						icon: 'none',
						title: "邮箱格式不正确"
					})
					return;
				}
				if (that.number == "获取验证码" || that.number == "重新获取") {
					that.number = 60;
					//获取验证码
					that.sendVerificatonByEmail();

					if (that.number == 60) {
						var sid = setInterval(function() {
							that.number--;
							if (Number.isNaN(that.number)) {
								clearInterval(sid);
								that.number = "重新获取"
							}
							if (that.number == 0 || that.number == "获取验证码") {
								that.number = '重新获取';
								clearInterval(sid);
							}
						}, 1000);
					}
				}

			},

			sendVerificatonByEmail() {

				api.post({
					account: that.email,
				}, api.sendMailCode).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				});
			},
			copyContent() {
				uni.showToast({
					title: '已复制内容',
					icon: "none"
				})
			},
			copyEmail() {
				uni.showToast({
					title: '已复制收件箱',
					icon: "none"
				})
			}

		}
	}
</script>

<style scoped>
	.third-party-login-background {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40rpx;
	}

	.third-party-login-background image {
		width: 60rpx;
		height: 60rpx;
		margin-top: 20rpx;
		margin-left: 12rpx;
		margin-right: 12rpx;
	}

	.line-divider {
		width: 20%;
		border-top: solid #e1e1e1 1rpx;
		content: '';
	}

	.prompt-information-style {
		width: 25%;
		font-size: 11px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.container {
		width: 100%;
		height: 100%;
		position: absolute;
	}

	.logo-background-style {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 46px;
		height: 300rpx;
		font-weight: bold;
		color: #49A8E7;
	}

	.phone-email-background-style {
		width: 70%;
		margin-left: 15%;
		margin-bottom: 30rpx;
	}

	.phone-background-style {
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.phone-style {
		width: 100%;
		height: 65%;
		box-shadow: darkgray 0px 0px 2px 0px;
		border-radius: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.phone-style input {
		width: 90%;
		height: 100%;
	}

	.verifiction-style {
		width: 40%;
		height: 65%;
		box-shadow: darkgray 0px 0px 2px 0px;
		border-radius: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.verifiction-style input {
		width: 90%;
		height: 100%;
	}

	.count-down-background-style {
		width: 60%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: right;
	}

	.count-down-button {
		width: 80%;
		height: 65%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		background-color: #49A8E7;
		border-radius: 10rpx;
		font-size: 14px;
		margin-left: 20%;
	}



	.login-background-style {
		width: 96%;
		margin-left: 2%;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 50rpx;
	}

	.login-background-style button {
		width: 70%;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #49A8E7;
		color: #fff;
		font-size: 14px;
	}

	.reset-password-register {
		width: 96%;
		margin-left: 2%;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10rpx;
	}

	.choose-other-style {
		width: 150rpx;
		color: #5f5f5f;
		font-size: 12px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 邮箱验证 */
	.email-verification-style {
		width: 96%;
		margin-left: 2%;
		display: flex;
		justify-content: left;
		align-items: center;
		height: 30rpx;
		font-weight: bold;
	}

	.email-verification-hint-style {
		width: 96%;
		margin-left: 2%;
		font-size: 12px;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
	}

	.send-email-panel-style {
		width: 96%;
		margin-left: 2%;
		height: 200rpx;
	}

	.send-content-background {
		width: 100%;
		height: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.copy-button-style {
		width: 20%;
		margin-left: 10%;
		height: 60rpx;
		font-size: 14px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #49A8E7;
		color: #fff;
	}
</style>
