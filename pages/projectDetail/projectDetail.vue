<template>
	<view class="project-detail-background-style">


		<view class="base-info-panel-style" @click="copyPid(projectObj.pid)" v-if="online==1">
			<view class="project-num-status-style">
				<view class="project-numer-style">
					项目编号：{{projectObj.pid}}
				</view>
				<view class="project-numer-style">
					用户：{{projectObj.nickname}}
				</view>
			</view>

			<view class="project-num-status-style">
				<view class="project-numer-style">
					预算：{{projectObj.price}}元
				</view>
				<view class="project-numer-style">
					浏览：{{projectObj.pageViews}}次
				</view>
			</view>

			<view class="project-num-status-style">
				<view class="ip-address-style">
					IP属地：{{projectObj.ipAddress}}
				</view>
			</view>
		</view>

		<view class="description-requirement-style" v-if="online==1">
			<view class="description-content-style">
				<text>项目描述：</text> {{projectObj.content}}
			</view>
		</view>

		<view class="description-requirement-style" v-if="online==0">
			<view class="description-content-style">
				　田忌经常与齐国诸公子赛马，设重金作为赌注。孙膑发现比赛的马可分为上、中、下三等，于是建议田忌增加赌注，并且向他保证必能取胜。田忌于是与齐威王和诸公子设每场千金作为赌注，比试赛马。孙膑叫田忌用下等马，与齐威王的上等马比赛，首场大败；随后孙膑又叫田忌用上等马、中等马，分别与齐威王的中等马及下等马比赛，结果田忌两胜一负，最终赢得齐威王的千金赌注，孙膑由此名声大振。田忌将孙膑推荐给齐威王，齐威王向他请教兵法并让他担任自己的兵法教师。
			</view>
		</view>





		<view class="space-line-style">
		</view>
		<view class="btn-background-style" v-if="online==1">
			<button @click="getUserInfo">立即联系</button>

		</view>

		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msgType" :cancelText="shareCancelText" :confirmText="shareConfirmText"
				:title="shareTitle" :content="shareContent" @confirm="dialogConfirm" @close="dialogClose">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	let that;
	import sk from '@/common/StoryKeys.js'
	import api from '@/common/api.js'
	import su from '@/utils/StringUtils.js'
	export default {
		data() {
			return {
				projectObj: "",

				projectHelp: "",
				// 自定义弹出框居中显示
				type: 'center',
				msgType: 'success',
				shareContent: '',
				shareTitle: '',
				shareCancelText: '',
				shareConfirmText: '',
				online: 0,

			}
		},
		created() {
			that = this;
		},
		onShow() {
			that.online = uni.getStorageSync(sk.otherInfo).online;
		},
		onLoad(e) {
			var str = decodeURIComponent(e.obj);
			var obj = JSON.parse(str);
			that.projectObj = obj;
			that.addViews(obj);
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
			}
			return {
				title: '欢迎体验spaceObj，项目大厅入口',
				path: 'pages/index/index?projectHelpShare=' + encodeURIComponent(JSON.stringify(that.projectHelp))
			}
		},
		methods: {
			copyPid(e) {
				uni.setClipboardData({
					data: e,
					showToast: false,
					success: function() {
						uni.showToast({
							icon: 'none',
							title: '项目编号已复制'
						})
					}
				});
			},
			addViews(obj) {
				api.post({
					uuid: obj.uuid,
				}, api.projectAddPageViews).then(res => {

				});
			},
			dialogClose() {},
			dialogConfirm() {},
			dialogToggle(type) {
				this.msgType = type
				this.$refs.alertDialog.open()
			},
			getAuditStatus(e) {
				if (e == 0) {
					return "待审核";
				}
				if (e == 1) {
					return "审核通过";
				}
				if (e == 2) {
					return "审核不通过";
				}
				if (e == 3) {
					return "已删除";
				}
				if (e == 4) {
					return "已成交";
				}
			},
			copyPhoneNumber(phoneNumber) {
				uni.showModal({
					title: "联系方式",
					content: phoneNumber,
					cancelText: "取消",
					confirmText: "复制",
					success(e) {
						if (e.confirm) {
							uni.setClipboardData({
								data: phoneNumber,
								success() {
									uni.showToast({
										title: '复制成功',
										icon: 'none'
									})
								},
								fail() {
									uni.showToast({
										title: '复制失败',
										icon: 'none'
									})
								}
							})
						}
					}
				})
			},
			getUserInfo() {

				api.post({
					uuid: that.projectObj.uuid,
				}, api.getPhoneNumberByProjectId).then(res => {

					if (res.code == 200) {
						that.copyPhoneNumber(res.data);
					}
					if (res.code == 202) {
						// 提前生成助力链接
						that.getShareProjectHelp();

						// 初始化自定义弹窗内容
						that.shareTitle = '温馨提示';
						that.shareContent = res.msg;
						that.shareCancelText = '放弃';
						that.shareConfirmText = '立即分享';
						that.dialogToggle('info');
						return;
					}
					if (res.code == 500) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				});
			},
			getShareProjectHelp() {

				api.post({
					pUUID: that.projectObj.uuid,
				}, api.createProjectHelpLink).then(res => {

					if (res.code == 200) {
						that.projectHelp = res.data;
					}
				});
			},
		}
	}
</script>

<style scoped>
	.main-content-right {
		width: 100%;
		height: 200rpx;
		display: none;
	}

	.project-detail-background-style {
		width: 100%;
		height: 100%;
		position: absolute;
	}

	.base-info-panel-style {
		width: 96%;
		margin-left: 2%;
		height: 300rpx;
		box-shadow: darkgray 0px 0px 2px 0px;
		margin-top: 50rpx;
		border-radius: 10px;
	}

	.project-num-status-style {
		width: 90%;
		margin-left: 5%;
		height: 95rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
	}

	.project-numer-style {
		width: 50%;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ip-address-style {
		width: 100%;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}


	.description-requirement-style {
		width: 96%;
		margin-left: 2%;
		margin-top: 50rpx;
		border-radius: 10rpx;
		box-shadow: darkgray 0px 0px 2px 0px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.description-content-style {
		width: 90%;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		font-size: 15px;
	}

	.btn-background-style {
		height: 120rpx;
		position: fixed;
		bottom: 0rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
	}

	.btn-background-style button {
		width: 96%;
		margin-left: 2%;
		background-color: #49A8E7;
		color: white;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.space-line-style {
		width: 100%;
		height: 200rpx;
	}
</style>
