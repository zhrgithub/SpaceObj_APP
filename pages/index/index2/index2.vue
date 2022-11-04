<template>
	<view class="space-obj-background-style" :style="{background: 'url('+bgImage+')'}">
		<!-- 个人面板 -->
		<view class="personal-panel-style">
			<view class="image-background-style">
				<image :src="headImage" mode=""></image>
			</view>
			<view class="nick-name-style">
				{{nickName}}
			</view>
			<view class="title-context">
				<view class="title-item-style">
					{{titleContext}}
				</view>

			</view>
			<view class="about-link-style">
				<view class="about-style" @click="aboutMeFun">
					关于我
				</view>
				<view class="link-style" @click="linkMe">
					联系
				</view>
			</view>
		</view>

		<!-- 终端面板 --> 
		<view class="terminal-background-style">
			<view class="header-style">
				<view class="header-image-style">
					<view class="red-style">
					</view>
					<view class="orange-style">
					</view>
					<view class="green-style">
					</view>
				</view>
				<view class="header-title-style">
					zhr — -zsh —80✖️24
				</view>
			</view>
			<view class="body-style">
				<view class="login-style">
					Last login: Thu Jun 9 19:42:04 on console
				</view>
				<view class="root-style">
					zhr@zhrdeMacBook-Pro ~ % <text
						style="color: black;margin-left: 10rpx;font-weight: bold;">./weather.sh</text>
				</view>
				<view class="weather-style">
					<iframe scrolling="no" src="https://tianqiapi.com/api.php?style=tb&skin=pitaya" frameborder="0"
						width="350" height="24" allowtransparency="true"></iframe>
				</view>
				<view class="root-style">
					zhr@zhrdeMacBook-Pro ~ %
				</view>
			</view>
		</view>




		<!-- 备案号面板 -->
		<view class="filing-background-style">

			<uni-link href="https://beian.miit.gov.cn/" text="© 冀ICP备2020029498号-2" color="#FFF" font-size="16">
			</uni-link>
		</view>

	</view>
</template>

<script>
	var that = this;
	import sk from "@/common/StoryKeys.js"
	import api from "@/common/api.js"
	export default {
		data() {
			return {
				bgImage: "/static/bg.jpg",
				headImage: "/static/photo.jpg",
				nickName: "spaceObj",
				titleContext: "天下熙熙攘攘皆为利来天下攘攘熙熙皆为利往",
				aboutMe: "Java工程师",
				link: "微信：spaceobj"  
			}
		},
		onLoad() {

		},
		onShow() {
			
		},
		created() {
			that = this;
			
			const res = uni.getSystemInfoSync();
			uni.setStorage({
				key: sk.deviceModel,
				data: res
			})
			console.log("设备信息:", res) // 设备信息
			if (res.model != "PC") {
				uni.switchTab({
					url: '/pages/project/project'
				})
			}
		},
		methods: {
			aboutMeFun() {
				uni.showModal({
					showCancel: false,
					content: that.aboutMe
				})
			},
			linkMe() {

				uni.showModal({
					showCancel: false,
					content: that.link
				})
			},
		}
	}
</script>

<style scoped>
	.filing-background-style {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		bottom: 20px;
		position: fixed;
	}

	.space-obj-background-style {
		width: 100%;
		height: 100%;
		position: fixed;
	}

	.personal-panel-style {
		width: 320px;
		height: 400px;
		background-color: white;
		border-radius: 10rpx;
		box-shadow: darkgrey 1px 0px 50px 0px;
		margin-top: 10%;
		margin-left: 20%;
	}

	.image-background-style {
		width: 100%;
		height: 20%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.image-background-style image {
		width: 200rpx;
		height: 200rpx;
		margin-top: -200rpx;
		background-color: white;
		border-radius: 100%;
	}

	.nick-name-style {
		width: 100%;
		height: 10%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22px;
	}

	.title-context {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50%;
	}

	.title-item-style {
		width: 52%;
	}

	.about-link-style {
		height: 10%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10%;
	}

	.about-style {
		width: 50%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.link-style {
		width: 50%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.terminal-background-style {
		width: 750px;
		height: 400px;
		background-color: white;
		border-radius: 10rpx;
		margin-top: -25%;
		margin-left: 50%;
		box-shadow: darkgray 1px 0px 50px 0px;
	}

	.header-style {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: lightgrey;
		border-top-left-radius: 10rpx;
		border-top-right-radius: 10rpx;
	}

	.header-image-style {
		width: 15%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.red-style {
		width: 20rpx;
		height: 20rpx;
		background-color: red;
		border-radius: 100%;
		margin-right: 10%;
	}

	.orange-style {
		width: 20rpx;
		height: 20rpx;
		background-color: orange;
		border-radius: 100%;
		margin-right: 10%;
	}

	.green-style {
		width: 20rpx;
		height: 20rpx;
		background-color: green;
		border-radius: 100%;
		margin-right: 10%;
	}

	.header-title-style {
		width: 85%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.root-style {
		width: 96%;
		margin-left: 2%;
		display: flex;
		align-items: center;
		justify-content: left;
		color: green;
		margin-top: 1%;
	}

	.weather-style {
		width: 96%;
		margin-left: 2%;
		margin-top: 1%;
	}

	.login-style {
		width: 96%;
		margin-left: 2%;
		margin-top: 1%;
	}
</style>
