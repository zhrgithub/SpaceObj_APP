<template>
	<view class="container" v-if="online==1">
		<view class="base-infos">
			<view class="base-infos-style">
				<input placeholder="请输入您的真实姓名(必填)" :value="username" maxlength="15" @input="setUserName"></input>
			</view>
			<view class="base-infos-style-two">
				<input placeholder="请输入您的身份证号码(必填)" :value="idCardNum" maxlength="18" type="number"
					@input="setIdCardNumber"></input>
			</view>
		</view>

		<view class="id-card-style" @click="uploadImageItem">
			<view class="image-background-one"
				v-if="idCardPic==''||idCardPic==null||idCardPic=='null'||idCardPic.length==0">
				<image src="/static/camera.png"></image>
				<view class="image-title">身份证正面(必填)</view>
			</view>
			<block class="image-background-two"
				v-if="idCardPic!=''&&idCardPic!=null&&idCardPic!='null'&&idCardPic.length!=0">
				<img :src="idCardPic" style="width:100%;height:100%;margin-left:0%;border-radius: 20rpx;" />
			</block>
		</view>

		<view class="button-background" v-if="realNameStatus==0||realNameStatus==3">
			<button @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
	var that;
	import app from '@/App.vue'
	import sk from '@/common/StoryKeys.js'
	import su from '@/utils/StringUtils.js'
	import api from '@/common/api.js'
	export default {
		data() {
			return {
				realNameStatus: 3,
				idCardPic: '',
				username: '',
				idCardNum: '',
				online: 0,
			}
		},
		created() {
			that = this;
		},
		onLoad() {

		},
		onShow() {



			this.timer = setTimeout(() => {
				// 第二步加载其它信息
				var otherInfo = uni.getStorageSync(sk.otherInfo);

				that.online = otherInfo.online;


				// 第一步：加载用户基本信息
				that.loginStatus = uni.getStorageSync(sk.loginStatus);
				var userInfo = uni.getStorageSync(sk.userInfo);
				if (userInfo != '') {
					that.realNameStatus = userInfo.realNameStatus;
					that.idCardPic = userInfo.idCardPic;
					that.username = su.isBlank(userInfo.username) ? '' : userInfo.username;
					that.idCardNum = su.isBlank(userInfo.idCardNum) ? '' : userInfo.idCardNum;
					if (that.realNameStatus == 3) {
						uni.showModal({
							showCancel: false,
							title: "审核结果",
							content: userInfo.auditMsg
						})
					}
				}
			})

		},
		methods: {
			setUserName(e) {
				that.username = e.detail.value;
			},
			setIdCardNumber(e) {
				that.idCardNum = e.detail.value;
			},
			submit() {
				var username = that.username;
				var userInfo = uni.getStorageSync(sk.userInfo);
				var idCardNum = that.idCardNum;
				var idCardPic = that.idCardPic;
				if (su.isBlank(username)) {
					uni.showToast({
						icon: 'none',
						title: '用户名不为空'
					})
					return;
				}
				if (su.isBlank(idCardNum) || idCardNum.length != 18) {
					uni.showToast({
						icon: 'none',
						title: '身份证号格式不正确'
					})
					return;
				}
				if (su.isBlank(idCardPic)) {
					uni.showToast({
						icon: 'none',
						title: '请上传图片'
					})
					return;
				}
				userInfo.username = username;
				userInfo.idCardNum = idCardNum;
				userInfo.idCardPic = idCardPic;


				api.post(userInfo, api.realName).then(res => {

					if (res.code == 200) {
						uni.setStorage({
							key: sk.userInfo,
							data: res.data
						})
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
					}

				});
			},
			uploadImageItem() {
				var token = uni.getStorageSync(sk.token);
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						const uploadTask = uni.uploadFile({
							url: api.upLoadFile, //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							header: {
								'content-type': 'application/x-www-form-urlencoded',
								'satoken': token != '' ? token : ''
							},
							formData: {
								'file': tempFilePaths
							},
							success: (uploadFileRes) => {
								var data = JSON.parse(uploadFileRes.data);
								if (data.code == 200) {
									that.idCardPic = data.data;
								}
								uni.showToast({
									title: data.msg,
									icon: 'none'
								})
							}
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

	.base-infos {
		width: 95%;
		margin-left: 2.5%;
		height: 250rpx;
		box-shadow: darkgray 0px 0px 2px 0px;
		border-radius: 20rpx;
		margin-top: 25rpx;
	}

	.base-infos-style {
		width: 95%;
		margin-left: 2.5%;
		margin-top: 5rpx;
		display: flex;
	}

	.base-infos-style input {
		margin-top: 30rpx;
		box-shadow: 0rpx 0rpx 1rpx 1rpx #ebebeb;
		border-radius: 10rpx;
		height: 80rpx;
		font-size: 16px;
		width: 100%;
		justify-content: center;
		text-align: center;
	}


	.base-infos-style-two {
		width: 95%;
		margin-left: 2.5%;
		margin-top: 5rpx;
		display: flex;
	}

	.base-infos-style-two input {
		margin-top: 30rpx;
		box-shadow: 0rpx 0rpx 1rpx 1rpx #ebebeb;
		border-radius: 10rpx;
		width: 100%;
		height: 80rpx;
		font-size: 16px;
		justify-content: center;
		text-align: center;
	}

	.id-card-style {
		width: 95%;
		margin-left: 2.5%;
		margin-top: 50rpx;
		height: 400rpx;
		box-shadow: darkgray 0px 0px 2px 0px;
		border-radius: 20rpx;
	}

	.image-background-one {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.image-background-one image {
		width: 50rpx;
		height: 50rpx;
		margin-right: 10rpx;
	}

	.image-background-two {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.image-background-two image {
		width: 50rpx;
		height: 50rpx;
	}

	.button-background {
		width: 90%;
		margin-left: 5%;
		text-align: center;
		position: absolute;
		margin-top: 100rpx;
		bottom: 30rpx;
	}

	.button-background button {
		background-color: #49A8E7;
		color: white;
		border-radius: 20rpx;
		width: 100%;
	}

	.realnameSatatus-style {
		width: 50%;
		height: 100rpx;
		background-color: #34495E;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 20rpx;
	}
</style>
