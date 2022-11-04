<template>
	<view class="container" v-if="online==1">
		<view class="edit-background-style">
			<view class="change-tips">
				联系方式
			</view>
			<view class="change-input-style">
				<input type="text" maxlength="11" placeholder="设置QQ/微信/手机号" :value="phoneNumber"
					@input="setPhoneNumber">
			</view>
		</view>

		<view class="edit-background-style">
			<view class="change-tips">
				邮箱
			</view>
			<view class="change-input-style">
				<input type="text" maxlength="20" placeholder="请设置邮箱" :value="email" @input="setEmail">
			</view>
		</view>

		<view class="save-btn-style">
			<button @click="saveUserInfo">保存</button>
		</view>


	</view>
</template>

<script>
	var that;
	import sk from '@/common/StoryKeys.js'
	import api from '@/common/api.js'
	import strigUtils from '@/utils/StringUtils.js'
	import nick_Name from '@/utils/nickName.js'
	export default {
		data() {
			return {
				photoUrl: '/static/photo.jpg',
				selectPhotoList: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				ipTerritory: "未知",
				nickName: "未设置",
				phoneNumber: "",
				account: "未知",
				realNameStatus: '未实名',
				email: '',
				online:0,
			}
		},
		onShow() {
			
			
			var otherInfo = uni.getStorageSync(sk.otherInfo);
			
			that.online = otherInfo.online;
			if(that.online==0){
				uni.switchTab({
					url: '/pages/project/project'
				})
			}
			this.timer = setTimeout(() => {
				var userInfo = uni.getStorageSync(sk.userInfo);
				that.email = strigUtils.isBlank(userInfo.email) ? that.email : userInfo.email;
				that.phoneNumber = strigUtils.isBlank(userInfo.phoneNumber) ? that.phoneNumber : userInfo
					.phoneNumber;
					
					
			}, 200)

		},
		created() {
			that = this;
		},
		methods: {
			setEmail(e) {
				that.email = e.detail.value;
			},
			setPhoneNumber(e) {
				that.phoneNumber = e.detail.value;
			},


			saveUserInfo() {
				var nickName = nick_Name.getNickName();

				
				if (that.phoneNumber.length ==0) {
					uni.showToast({
						icon: 'none',
						title: "设置QQ/微信/手机号"
					})
					return;
				}

				if (that.email.length == 0 || that.email == '未设置') {
					uni.showToast({
						icon: 'none',
						title: '未设置邮箱'
					})
					return;
				}
				// 设置用户的邮箱和手机号
				api.post({
					email: that.email,
					phoneNumber: that.phoneNumber,
					ipTerritory: uni.getStorageSync(sk.ipTerritory),
					nickName: nickName
				}, api.customerUpdateUserInfo).then(res => {
					
					if (res.code == 200) {
						// 设置用户信息
						uni.setStorage({
							key: sk.userInfo,
							data: res.data
						})
						// 转到上一页
						uni.navigateBack();
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
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

	.change-input-style {
		width: 70%;
		height: 70%;
		display: flex;
		justify-content: left;
		align-items: center;
		margin-left: 2%;
	}

	.change-input-style input {
		width: 100%;
		height: 100%;
		border: solid 1rpx #e6e6e6;
	}

	.save-btn-style {
		width: 96%;
		margin-left: 2%;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 20rpx;
	}

	.save-btn-style button {
		width: 100%;
		height: 90%;
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
