<template>
	<view class="container">
		<view class="edit-background-style">
			<view class="change-tips">
				客服微信
			</view>
			<view class="change-input-style">
				<input type="text" :value="wechat" @input="setWechat">
			</view>
		</view>

		<view class="edit-background-style">
			<view class="change-tips">
				下载链接
			</view>
			<view class="change-input-style">
				<input type="text" :value="downloadUrl" @input="setDownLoad">
			</view>
		</view>

		<view class="edit-background-style">
			<view class="change-tips">
				上线开关
			</view>
			<view class="change-input-style">
				<switch color="#49A8E7" @change="setOnline" :checked="online==1" />
			</view>
		</view>



		<view class="save-btn-style">
			<button @click="save">保存</button>
		</view>


	</view>
</template>

<script>
	let that;
	import sk from '@/common/StoryKeys.js'
	import api from '@/common/api.js'
	export default {
		data() {
			return {
				downloadUrl: null,
				wechat: null,
				otherInfo: null,
				online: null,
			}
		},
		created() {
			that = this;
		},
		onShow() {
			that.timer = setTimeout(() => {
				var otherInfo = uni.getStorageSync(sk.otherInfo);
				that.downloadUrl = otherInfo.downloadUrl;
				that.wechat = otherInfo.wechat;
				that.online = otherInfo.online;
			}, 200);
		},
		methods: {
			setOnline() {
				var online = that.online;
				if (online == 0) {
					that.online = 1;
				} else {
					that.online = 0;
				}
			},
			setWechat(e) {
				that.wechat = e.detail.value;
			},
			setDownLoad(e) {
				that.downloadUrl = e.detail.value;
			},
			save() {
				if (that.downloadUrl == '') {
					uni.showToast({
						icon: 'none',
						title: '下载链接不为空'
					})
					return;
				}
				if (that.wechat == '') {
					uni.showToast({
						icon: 'none',
						title: '客服微信不为空'
					})
					return;
				}
				api.post({
					wechat: that.wechat,
					downloadUrl: that.downloadUrl,
					online: that.online
				}, api.updateOther).then(res => {
					if (res.code == 200) {
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
						uni.setStorage({
							key: sk.otherInfo,
							data: res.data
						})
					}
				})
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
		width: 90%;
		height: 90%;
		background-color: #49A8E7;
		color: #fff;
	}
</style>
