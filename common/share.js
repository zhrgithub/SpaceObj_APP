import sk from './common/StoryKeys.js'
export default {
	onShareAppMessage(res) {

		// 获取分享的项目助力
		var projectHelpShare = uni.getStorageSync(sk.projectHelpShare);

		// 获取用户基本信息
		var userInfo = uni.getStorageSync(sk.userInfo);

		console.log(projectHelpShare, userInfo);

		return {
			title: '欢迎使用SpaceObj',
			path: 'pages/index/index?projectHelpShare=' + encodeURIComponent(JSON.stringify(projectHelpShare)) +
				'&&inviteUserId=' + userInfo.userId,
			// imageUrl: imageUrl
		};
	},
	// 分享到朋友圈
	onShareTimeline() {
		// 获取分享的项目助力
		var projectHelpShare = uni.getStorageSync(sk.projectHelpShare);

		// 获取用户基本信息
		var userInfo = uni.getStorageSync(sk.userInfo);

		console.log(projectHelpShare, userInfo);

		return {
			title: '欢迎使用SpaceObj',
			path: 'pages/index/index?projectHelpShare=' + encodeURIComponent(JSON.stringify(projectHelpShare)) +
				'&&inviteUserId=' + userInfo.userId,
			// imageUrl: imageUrl
		};
	},
	methods: {

	}
}
