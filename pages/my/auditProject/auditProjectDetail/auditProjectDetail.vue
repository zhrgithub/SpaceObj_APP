<template>
	<view class="project-detail-background-style">

		<view class="base-info-panel-style">
			<view class="project-num-status-style">
				<view class="project-numer-style">
					项目编号：{{projectObj.pid}}
				</view>
				<view class="project-status-style">
					状态：{{getAuditStatus(projectObj.status)}}
				</view>
			</view>

			<view class="project-num-status-style">
				<view class="project-numer-style">
					预算：{{projectObj.price}}元
				</view>
				<view class="project-status-style">
					浏览：{{projectObj.pageViews}}次
				</view>
			</view>

			<view class="project-num-status-style">
				<view class="project-numer-style">
					IP属地：{{projectObj.ipAddress}}
				</view>
				<view class="project-numer-style">
					用户：{{projectObj.nickname}}
				</view>
			</view>
		</view>



		<view class="description-requirement-style">
			<view class="description-content-style">
				项目描述：{{projectObj.content}}
			</view>

		</view>
		<view class="btn-background-style">
			<button @click="refuse">拒绝</button>
			<button @click="approve">通过</button>
		</view>
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
				dataMessge: "www.spaceobj.com",
				projectObj: null,
			}
		},
		created() {
			that = this;
		},
		onLoad(e) {

			var str = decodeURIComponent(e.obj);
			var obj = JSON.parse(str);
			that.projectObj = obj;
		},

		methods: {
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
			refuse() {
				uni.showModal({
					title: '拒绝通过',
					editable: true,
					success(e) {
						if (e.confirm) {
							that.updateProject(2, e.content);
						}
					}
				})
			},
			approve() {
				uni.showModal({
					content: '确认通过',
					success(e) {
						if (e.confirm) {
							that.updateProject(1, "");
						}
					}
				})
			},
			updateProject(status, message) {
				var obj = that.projectObj;
				api.post({
					pId: obj.pid,
					status: status,
					message: message,
				}, api.auditProject).then(res => {

					uni.showToast({
						title: res.msg,
						icon: 'none',
						success() {
							uni.navigateBack();
						}
					})
				})
			}

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
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.project-status-style {
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
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
		width: 96%;
		height: 280rpx;
		margin-left: 2%;
		margin-bottom: 500rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.btn-background-style button {
		width: 40%;
		background-color: #49A8E7;
		color: white;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
