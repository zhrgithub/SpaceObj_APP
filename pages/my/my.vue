<template>
	<view class="container">
		<!-- 未登录 -->
		<view class="login-background-style" @click="toLogin" v-if="!loginStatus">
			<view class="photo-image-background-style">
				<image src="/static/photo.png" mode=""></image>
			</view>
			<view class="userinfo-background-style">
				<view class="btn-login-background">
					登录
				</view>
			</view>
		</view>
		<!-- 已登录 -->
		<view class="login-background-style" v-if="loginStatus" @click="editUserInfo">
			<view class="photo-image-background-style">
				<image :src="photoUrl" mode=""></image>
			</view>
			<view class="userinfo-background-style">
				<text class="nick-name-style">{{nickName}}</text>
				<text class="address-background-style">IP属地：{{ipTerritory}}</text>
			</view>
			<!-- 设置空白区域 -->
			<!-- <view class="userinfo-background-style" v-if="online==0">
				
			</view> -->
			<view class="to-perso-certer">
				<image src="/static/toPersonCerter.png" mode=""></image>
			</view>
		</view>

		<!-- 实名认证 -->
		<view class="invite-value-background-style" v-if="loginStatus&&online==1">
			<view class="link-us-style">
				实名状态：
				<text v-if="realNameStatus==0">未实名</text>

				<text v-if="realNameStatus==2">审核中</text>
				<text v-if="realNameStatus==3">审核不通过</text>
			</view>


			<view class="invite-btn-stye" @click="userVerified" v-if="realNameStatus!=1">
				去实名
			</view>

			<view class="real-name-finish" v-if="realNameStatus==1">
				已实名
			</view>

		</view>

		<!-- 邀请链接 -->
		<view class="invite-value-background-style" v-if="loginStatus&&online==1">
			<view class="invite-tips-style">
				邀请值：
			</view>
			<view class="invite-numbers-style">
				{{invitationValue}}
			</view>
			<view class="invite-btn-stye">
				<button data-name="shareBtn" open-type="share">邀请好友</button>
			</view>
		</view>
		<view class="invite-hint-background" v-if="loginStatus&&online==1">
			提示：邀请值可以用来获取用户联系方式，每获取一次用户联系方式，邀请值会减少 1 ，邀请好友注册一次邀请值会增加 1
		</view>

		<!-- 好友助力 -->
		<view class="invite-value-background-style" @click="friendHelp" v-if="online==1">
			<view class="friend_help">
				我分享的项目
			</view>

			<view class="to-perso-certer">
				<image src="/static/toPersonCerter.png" mode=""></image>
			</view>
		</view>

		<!-- 我的发布 -->
		<view class="invite-value-background-style" @click="myRelease" v-if="online==1">
			<view class="friend_help">
				我发布的项目
			</view>

			<view class="to-perso-certer">
				<image src="/static/toPersonCerter.png" mode=""></image>
			</view>
		</view>

		<!-- 联系客服 -->
		<view class="invite-value-background-style">
			<view class="link-us-style">
				客服微信
			</view>

			<view class="invite-btn-stye" @click="copyWeChat">
				复制
			</view>
		</view>
		<!-- 下载 -->
		<view class="invite-value-background-style">
			<view class="link-us-style">
				APP
			</view>

			<view class="invite-btn-stye" @click="downloadFunction">
				下载
			</view>
		</view>


		<view v-if="userType=='root'&&loginStatus">
			<!-- 管理 -->
			<view class="invite-value-background-style">

				<view class="manage-btn-style" @click="auditProject">
					项目管理
				</view>

				<view class="manage-btn-style" @click="userManagement">
					用户管理
				</view>
				<view class="manage-btn-style" @click="userVerifiedMangeMent">
					实名管理
				</view>
				<view class="manage-btn-style" @click="photoManagement">
					头像管理
				</view>
			</view>

			<view class="invite-value-background-style">

				<view class="manage-btn-style" @click="advertiseManagement">
					广告管理
				</view>
				<view class="manage-btn-style" @click="logManagement">
					日志管理
				</view>
				<view class="manage-btn-style" @click="otherManagement">
					其它管理
				</view>
			</view>

			<!-- 其它管理 -->
			<view class="space-line-style">

			</view>
		</view>
	</view>
</template>

<script>
	var that;
	import app from '@/App.vue'
	import api from '@/common/api.js'
	import sk from '@/common/StoryKeys.js'
	import strigUtils from '@/utils/StringUtils.js'
	export default {
		data() {
			return {
				loginStatus: false,
				photoUrl: '/static/photo.png',
				nickName: '昵称未设置',
				ipTerritory: '广东 深圳',
				downloadUrl: "www.baidu.com",
				wechat: "spaceobj",
				userType: "user",
				invitationValue: 0,
				realNameStatus: 0,
				userId: null,
				online: 0,
			}
		},
		created() {
			that = this;
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
			}
			return {
				title: '欢迎体验spaceObj，项目大厅入口',
				path: 'pages/index/index?inviteUserId=' + that.userId
			}
		},
		onLoad() {

		},
		onShow() {
			this.timer = setTimeout(() => {

				// 第一步：加载用户基本信息
				that.loginStatus = uni.getStorageSync(sk.loginStatus);
				var userInfo = uni.getStorageSync({
					key: sk.userInfo
				})
				if (that.loginStatus) {
					that.getUserInfo(userInfo);
				}
				// 第二步加载其它信息
				var otherInfo = uni.getStorageSync(sk.otherInfo);

				that.downloadUrl = otherInfo.downloadUrl;
				that.wechat = otherInfo.wechat;
				that.online = otherInfo.online;
			}, 200)
		},
		methods: {
			friendHelp() {
				uni.navigateTo({
					url: '/pages/help/help'
				})
			},
			myRelease() {
				uni.navigateTo({
					url: '/pages/release/release'
				})
			},
			// 根据用户登录账户刷新用户基本信息
			getUserInfo(userInfo) {
				api.post({}, api.getUserInfo).then(res => {
					userInfo = res.data;
					if (res.code == 200) {
						// 刷新缓存
						uni.setStorage({
							key: sk.userInfo,
							data: res.data
						})
						userInfo = res.data;
					}
					if (userInfo != '') {
						that.userType = strigUtils.isBlank(userInfo.userType) ? '' : userInfo.userType;
						that.photoUrl = strigUtils.isBlank(userInfo.photoUrl) ? "/static/photo.png" : userInfo
							.photoUrl;
						that.nickName = strigUtils.isBlank(userInfo.nickName) ? that.nickName : userInfo.nickName;
						that.invitationValue = userInfo.invitationValue;
						that.realNameStatus = userInfo.realNameStatus;
						that.ipTerritory = userInfo.ipTerritory;
						that.userId = userInfo.userId;
					}
				});
			},
			toLogin() {
				that.loginStatus = true;
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			editUserInfo() {
				uni.navigateTo({
					url: '/pages/my/editUser/editUser'
				})
			},
			auditProject() {
				uni.navigateTo({
					url: '/pages/my/auditProject/auditProject'
				})
			},
			logManagement() {
				uni.navigateTo({
					url: '/pages/my/logManagement/logManagement'
				})
			},
			userManagement() {
				uni.navigateTo({
					url: '/pages/my/userManageMent/userManageMent'
				})
			},
			userVerified() {
				uni.navigateTo({
					url: '/pages/my/userVerified/userVerified'
				})
			},
			photoManagement() {
				uni.navigateTo({
					url: '/pages/my/photoManagement/photoManagement'
				})
			},
			advertiseManagement() {
				uni.navigateTo({
					url: '/pages/my/advertiseManagement/advertiseManagement'
				})
			},
			userVerifiedMangeMent() {
				uni.navigateTo({
					url: '/pages/my/userVerifiedMangeMent/userVerifiedMangeMent'
				})
			},
			otherManagement() {
				uni.navigateTo({
					url: '/pages/my/otherManagement/otherManagement'
				})
			},
			copyWeChat() {
				uni.setClipboardData({
					data: that.wechat,
					showToast: false,
					success: function() {
						uni.showToast({
							icon: 'none',
							title: '客服微信已复制'
						})
					}
				});
			},
			downloadFunction() {
				uni.setClipboardData({
					data: that.downloadUrl,
					showToast: false,
					success: function() {
						uni.showToast({
							icon: 'none',
							title: '下载链接已复制，请到浏览器打开'
						});
					}
				});
			}
		}
	}
</script>

<style scoped>
	.container {
		width: 100%;
		height: 100%;
		position: absolute;
	}

	.space-line-style {
		width: 100%;
		height: 200rpx;
	}

	.login-background-style {
		width: 96%;
		margin-left: 2%;
		height: 150rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		box-shadow: darkgray 0px 0px 2px 0px;
	}

	.photo-image-background-style {
		width: 20%;
		height: 70%;
		display: flex;
		justify-content: center;
		align-items: center;

	}

	.photo-image-background-style image {
		width: 100rpx;
		height: 100rpx;
	}

	.userinfo-background-style {
		width: 70%;
		height: 70%;
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.to-perso-certer {
		width: 10%;
		height: 70%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.to-perso-certer image {
		width: 60%;
		height: 50%;
	}


	.nick-name-style {
		width: 30%;
		display: block;
		font-size: 14px;
		justify-content: left;
		align-items: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.address-background-style {
		width: 70%;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.btn-login-background {
		width: 160rpx;
		margin-left: 5%;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		background-color: #49A8E7;
		border-radius: 10rpx;
	}


	/* 邀请值 */
	.invite-value-background-style {
		width: 96%;
		margin-left: 2%;
		height: 90rpx;
		display: flex;
		justify-content: left;
		align-items: center;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		box-shadow: darkgray 0px 0px 2px 0px;
	}

	.invite-tips-style {
		width: 20%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 20rpx;
		margin-left: 20rpx;
	}

	.link-us-style {
		width: 70%;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.friend_help {
		width: 80%;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.invite-numbers-style {
		width: 50%;
	}

	.invite-btn-stye {
		width: 30%;
		height: 60%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 20rpx;
		margin-left: 20rpx;
		border-radius: 10rpx;
		box-shadow: darkgray 0px 0px 2px 0px;
		font-size: 14px;
		background-color: #49A8E7;
		color: #fff;
	}

	.invite-btn-stye button {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #49A8E7;
		color: #fff;
		font-size: 14px;
	}

	.real-name-finish {
		width: 20%;
		height: 60%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 20rpx;
		margin-left: 20rpx;
		font-size: 16px;
		color: #000;
	}

	.manage-btn-style {
		width: 20%;
		height: 60%;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10rpx;
		box-shadow: darkgray 0px 0px 2px 0px;
		font-size: 14px;
		background-color: #49A8E7;
		color: #fff;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.invite-hint-background {
		width: 90%;
		margin-left: 5%;
		display: flex;
		height: 80rpx;
		font-size: 10px;
		color: #666;
	}
</style>
