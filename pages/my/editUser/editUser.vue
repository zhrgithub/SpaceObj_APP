<template>
	<view class="container">
		<view class="login-background-style" @click="editPhoto">
			<view class="userinfo-background-style">
				修改头像
			</view>
			<view class="photo-image-background-style">
				<image :src="photoUrl" mode=""></image>
			</view>
		</view>

		<view class="edit-background-style">
			<view class="change-tips">
				昵称
			</view>
			<view class="change-input-style">
				<input type="text" maxlength="8" :value="nickName" @input="setNickName" placeholder="未设置">
			</view>
		</view>

		<view class="edit-background-style" v-if="online==1">
			<view class="change-tips">
				联系方式
			</view>
			<view class="change-input-style">
				<input type="text" maxlength="11" :value="phoneNumber" @input="setPhoneNumber" placeholder="未设置">
			</view>
		</view>

		<view class="edit-background-style" v-if="online==1">
			<view class="change-tips">
				邮箱
			</view>
			<view class="change-input-style">
				<input type="text" maxlength="20" :value="email" @input="setEmail" placeholder="未设置">
			</view>

		</view>
		<view class="edit-background-style" v-if="online==1">
			<view class="change-tips">
				实名状态
			</view>
			<view class="change-input-style">
				{{realNameStatus}}
			</view>
		</view>
		<view class="edit-background-style" v-if="online==1">
			<view class="change-tips">
				位置
			</view>
			<view class="change-input-style">
				{{ipTerritory}}
			</view>
		</view>

		<view class="edit-background-style" v-if="online==1">
			<view class="change-tips">
				<image src="/static/wechat.png" mode=""></image>
			</view>
			<view class="change-input-style" v-if="openId.length>0&&openId!='null'&&openId!=null">
				已绑定
			</view>
			<view class="change-input-style" v-if="openId.length==0||openId=='null'||openId==null" @click="bindWechat">
				<view class="tips-info-style">
					绑定微信
				</view>
				<view class="arrow-image-background">
					<image src="/static/toPersonCerter.png" mode=""></image>
				</view>
			</view>
		</view>

		<view class="edit-background-style" v-if="online==1">
			<view class="change-tips">
				设备
			</view>
			<view class="change-input-style">
				{{deviceModel.deviceModel}}
			</view>
		</view>

		<!-- <view class="edit-background-style">
			<view class="change-tips">
				IP
			</view>
			<view class="change-input-style">
				{{userInfo.ip}}
			</view>
		</view> -->
		<view class="edit-background-style" v-if="online==1">
			<view class="change-tips">
				操作系统
			</view>
			<view class="change-input-style">
				{{deviceModel.system}}
			</view>
		</view>
		<!-- <view class="edit-background-style" v-if="online==1">
			<view class="change-tips">
				电池电量
			</view>
			<view class="change-input-style">
				{{deviceModel.batteryLevel}}%
			</view>
		</view> -->
		<view class="space-line-style">

		</view>



		<view class="save-btn-style">
			<button @click="logout">退出登录</button> <button @click="saveUserInfo">保存</button>
		</view>

		<uni-popup ref="popup" background-color="#fff">
			<view class="need-description-budget-style">
				选择头像
			</view>
			<view class="scroll-item-line-two-style"></view>
			<view class="description-doller-style">
				<image @click="setPhoto(item.photoUrl)" :src="item.photoUrl" mode=""
					v-for="(item,idx) in selectPhotoList" :key="idx"></image>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	var that;
	import sk from '@/common/StoryKeys.js'
	import api from '@/common/api.js'
	import strigUtils from '@/utils/StringUtils.js'
	export default {
		data() {
			return {
				photoUrl: '/static/photo.png',
				selectPhotoList: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				ipTerritory: "未知",
				nickName: "未设置",
				phoneNumber: "未设置",
				account: "未知",
				realNameStatus: '未实名',
				email: '未设置',
				openId: null,
				userId: '',
				deviceModel: '',
				ip: "",
				userInfo: "",
				online: 0,
			}
		},
		onShow() {
			that.deviceModel = uni.getStorageSync(sk.deviceModel);
			that.loadUserInfo();
			// 加载是否上线信息
			that.online = uni.getStorageSync(sk.otherInfo).online;


		},
		created() {
			that = this;
		},
		methods: {
			loadUserInfo() {
				var userInfo = uni.getStorageSync(sk.userInfo);

				that.userInfo = userInfo;
				console.log(that.userInfo);
				that.photoUrl = strigUtils.isBlank(userInfo.photoUrl) ? that.photoUrl : userInfo.photoUrl;
				that.nickName = strigUtils.isBlank(userInfo.nickName) ? that.nickName : userInfo.nickName;
				that.phoneNumber = strigUtils.isBlank(userInfo.phoneNumber) ? that.phoneNumber : userInfo
					.phoneNumber;
				that.account = strigUtils.isBlank(userInfo.account) ? that.account : userInfo.account;
				that.email = strigUtils.isBlank(userInfo.email) ? that.email : userInfo.email;
				that.realNameStatus = userInfo.realNameStatus != 1 ? '未实名' : '已实名';
				that.ipTerritory = userInfo.ipTerritory;
				that.openId = userInfo.openId;
				that.userId = userInfo.userId;
				console.log(that.openId);
			},
			bindWechat() {
				uni.login({
					provider: 'weixin',
					success: function(res) {

						api.post({
							code: res.code,
							userId: that.userId
						}, api.bindWechat).then(res2 => {
							// 修改缓存信息
							if (res2.code == 200) {
								uni.setStorage({
									key: sk.userInfo,
									data: res2.data,
									success() {
										// 重新加载用户信息
										that.loadUserInfo();
									}
								})
							}

							uni.showToast({
								icon: 'none',
								title: res2.msg
							})
						})


					}
				});
			},
			setEmail(e) {
				that.email = e.detail.value;
			},
			setPhoneNumber(e) {
				that.phoneNumber = e.detail.value;
			},
			setNickName(e) {
				that.nickName = e.detail.value;
			},

			editPhoto() {
				this.$refs.popup.open('bottom');
				api.post({

				}, api.sysPhotoList).then(res => {
					that.selectPhotoList = res.data;

				});

			},
			setPhoto(e) {
				that.photoUrl = e;
				this.$refs.popup.close();
			},
			logout() {
				api.post({

				}, api.loginOut).then(res => {

					// 设置登录状态为退出
					uni.setStorage({
						key: "loginStatus",
						data: false
					})

					// 移除缓存中的key
					for (var i = 0; i < sk.clearKey.length; i++) {
						uni.removeStorage({
							key: sk.clearKey[i]
						})
					}
					uni.switchTab({
						url: '/pages/my/my'
					})
					uni.showToast({
						title: res.data,
						icon: 'none'
					})
				});

			},
			saveUserInfo() {
				if (strigUtils.isBlank(that.phoneNumber)) {
					uni.showToast({
						icon: 'none',
						title: "联系方式不正确"
					})
					return;
				}
				if (strigUtils.isBlank(that.nickName)) {
					uni.showToast({
						icon: 'none',
						title: '未设置昵称'
					})
					return;
				}
				if (strigUtils.isBlank(that.email)) {
					uni.showToast({
						icon: 'none',
						title: '未设置邮箱'
					})
					return;
				}
				api.post({
					phoneNumber: that.phoneNumber,
					nickName: that.nickName,
					photoUrl: that.photoUrl,
					ipTerritory: that.ipTerritory,
					email: that.email,
					openId: that.openId
				}, api.customerUpdateUserInfo).then(res => {

					if (res.code == 200) {
						uni.setStorage({
							key: sk.userInfo,
							data: res.data
						})
					}
					uni.showToast({
						icon: 'none',
						title: res.msg
					})

				});
			}

		}
	}
</script>

<style scoped>
	.space-line-style {
		width: 100%;
		height: 200rpx;
	}

	.container {
		width: 100%;
		height: 100%;
		position: absolute;
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

	.edit-background-style {
		width: 96%;
		margin-left: 2%;
		height: 110rpx;
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

	.change-tips {
		width: 20%;
		height: 70%;
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.change-tips image {
		width: 60rpx;
		height: 60rpx;
	}

	.change-input-style {
		width: 70%;
		height: 70%;
		display: flex;
		justify-content: left;
		align-items: center;
		margin-left: 2%;
	}

	.tips-info-style {
		width: 90%;
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.arrow-image-background {
		width: 10%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.arrow-image-background image {
		width: 80rpx;
		height: 60rpx;
	}



	.change-input-style input {
		width: 100%;
		height: 100%;
		border: solid #6e6e6e 1rpx;
		border-radius: 10rpx;
	}

	.save-btn-style {
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 0rpx;
		background-color: #fff;
	}

	.save-btn-style button {
		width: 30%;
		height: 90rpx;
		background-color: #49A8E7;
		color: #fff;
	}

	/* 修改头像 */
	.need-description-budget-style {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
	}

	.scroll-item-line-two-style {
		width: 100%;
		border-top: 1rpx solid #e1e1e1;
		content: '';
	}

	.description-doller-style {
		width: 98%;
		margin-left: 1%;
		height: 700rpx;
	}

	.description-doller-style image {
		width: 70rpx;
		height: 70rpx;
		margin: 14rpx 15rpx;
		border: solid #fff;
	}
</style>
