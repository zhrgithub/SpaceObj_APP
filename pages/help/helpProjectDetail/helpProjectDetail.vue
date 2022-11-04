<template>
	<view class="project-detail-background-style">

		<view class="base-info-panel-style">
			<view class="project-num-status-style">
				<view class="project-numer-style">
					项目编号：{{projectHelp.projectId}}
				</view>
				<view class="project-numer-style">
					状态：{{getAuditStatus(projectHelp.hpStatus)}}
				</view>
			</view>

			<view class="project-num-status-style">
				<view class="project-numer-style">
					预算：{{projectHelp.pprice}}元
				</view>
				<view class="project-numer-style">
					项目发布人：{{projectHelp.projectCreateNickName}}
				</view>
			</view>

			<view class="project-num-status-style">
				<view class="project-numer-style">
					助力创建人：{{projectHelp.hpCreateNickName}}
				</view>
				<view class="project-numer-style">
					IP属地：{{projectHelp.ipTerritory}}
				</view>

			</view>
		</view>
		<view class="description-requirement-style">
			<view class="description-content-style">
				项目描述：{{projectHelp.pcontent}}
			</view>
		</view>
		<view class="space-line-style">
		</view>
		<view class="btn-background-style">
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
				//项目状态，如果甲方已关闭，那么拒绝获取客户联系方式
				projectStatus: 1,
				//用户的邀请值>1,或者助力值>10
				helpValue: 0, //助力值
				inviteValue: 0, //邀请值
				//用户已经获取过
				getStatus: false,

				projectHelp: "",

				// 自定义弹出框居中显示
				type: 'center',
				msgType: 'success',
				shareContent: '',
				shareTitle: '',
				shareCancelText: '',
				shareConfirmText: ''
			}
		},
		created() {
			that = this;
		},
		onLoad(e) {
			var str = decodeURIComponent(e.obj);
			var obj = JSON.parse(str);
			that.projectHelp = obj;
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
					},
					fail(res) {
						console.log(res)
					}
				});
			},
			dialogClose() {},
			dialogConfirm() {
				// this.$refs.message.open();
			},
			dialogToggle(type) {
				this.msgType = type
				this.$refs.alertDialog.open()
			},
			getAuditStatus(e) {
				if (e == 0) {
					return "助力中";
				}
				if (e == 1) {
					return "助力成功";
				}
				if (e == 2) {
					return "已删除";
				}
				if (e == 3) {
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
					uuid: that.projectHelp.puuid,
				}, api.getPhoneNumberByProjectId).then(res => {

					if (res.code == 200) {
						that.copyPhoneNumber(res.data);
					}
					if (res.code == 202) {
						// 初始化自定义弹窗内容
						that.shareTitle = '温馨提示';
						that.shareContent = res.msg;
						that.shareCancelText = '放弃';
						that.shareConfirmText = '立即分享';
						that.dialogToggle('info');
						return;
					}
				});
			},

		}
	}
</script>

<style scoped>
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
