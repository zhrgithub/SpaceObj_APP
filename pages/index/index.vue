<template>
	<view class="space-obj-background-style">
		<image src="/static/index.png" mode=""></image>
	</view>
</template>

<script>
	var that = this;
	import sk from "@/common/StoryKeys.js"
	import api from "@/common/api.js"
	import su from "@/utils/StringUtils.js"
	import config from '@/common/config.js'
	export default {
		data() {
			return {
				bgImage: "/static/index.png",
			}
		},
		onLoad(e) {
			if (!su.isBlank(e)) {
				// 设置邀请人id
				if (!su.isUndefined(e.inviteUserId)) {
					uni.setStorage({
						key: sk.inviteUserId,
						data: e.inviteUserId
					})
				}  
				// 设置项目助力projectHelpShare
				if (!su.isUndefined(e.projectHelpShare)) {
					var str = decodeURIComponent(e.projectHelpShare);
					var projectHelpShare = JSON.parse(str);
					uni.setStorage({
						key: sk.projectHelpShare,
						data: projectHelpShare
					})
				}
			}
		},
		onShow() {
			api.post({}, api.getOther).then(res => {
				console.log(res)
				var data = res.data;
				var version = res.data.version;
				// 判断后端传递过来的版本号和当前APP的版本号是否一致，如果不一致，就设置上线状态为0，一致则设置为1
				if (version == config.system_version) {
					data.online = 1;
				} else {
					data.online = 0;
				}
				uni.setStorage({
					key: sk.otherInfo,
					data: data,
					success() {
						uni.switchTab({
							url: '/pages/project/project'
						})
					}
				})
			})
		},
		created() {
			that = this;

			const res = uni.getSystemInfoSync();
			console.log("设备信息：", res)
			uni.setStorage({
				key: sk.deviceModel,
				data: res
			})
			if (res.model != "PC") {

			}
		},
		methods: {
			// doUpdateProjectHelp() {
			// 	var projectHelpShare = uni.getStorageSync(sk.projectHelpShare);
			// 	if (!su.isUndefined(projectHelpShare)&&!su.isBlank(projectHelpShare)) {
			// 		api.post({
			// 			hpId: projectHelpShare.hpId,
			// 		}, api.updateProjectHelpNumber).then(res => {
			// 			if (res.code == 200) {
			// 				uni.removeStorage({
			// 					key: sk.projectHelpShare
			// 				})
			// 			}
			// 			uni.showToast({
			// 				title: res.msg,
			// 				icon: "none"
			// 			})
			// 		});
			// 	}
			// }
		}
	}
</script>

<style scoped>
	.space-obj-background-style {
		width: 100%;
		height: 100%;
		position: fixed;
	}

	.space-obj-background-style image {
		width: 100%;
		height: 100%;
	}
</style>
