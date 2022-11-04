<template>
	<view class="release-background-style">

		<!-- 搜索框 -->
		<view class="search-background-style">
			<view class="search-logo-background-style">
				<view class="image-background-style">
					<image src="/static/searchInput.png" mode=""></image>
				</view>
				<view class="input-background-style">
					<input :value="seachText" type="text" maxlength="15" placeholder="项目编号、项目内容、发布人昵称、用户id"
						placeholder-style="font-size:14px" confirm-type="search" @confirm="doSearch" @input="inputText">
					<image src="/static/deleteSearch.png" @click="clearInput">
				</view>
			</view>

		</view>
		<view class="top-space-line-style"></view>

		<!-- 发布的列表 -->
		<view class="project-list-style" @click="toAuditProjectDetail(item)" v-for="(item,idx) in list" :key="idx">
			<view class="date-status-style">
				<view class="date-style">
					{{timeStampTurnTime(item.createTime)}}
				</view>
				<view class="status-style">
					{{getAuditStatus(item.status)}}
				</view>
				<view class="status-style" @click="toAuditProjectDetail(item)">
					查看详情
				</view>
			</view>
			<view class="brief-information-style">
				项目描述：{{item.content}}
			</view>
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
				seachText: '',
				list: [],
				projecObj: null,
				currentPage: 1,
				pageSize: 10
			}
		},
		created() {
			that = this;
		},
		onShow() {

			that.list = [];
			that.currentPage = 1;
			that.pageSize = 10;
			that.loadList();
		},
		// 触底加载更多
		onReachBottom() {
			that.loadList();
		},
		// 下拉刷新
		onPullDownRefresh() {
			that.currentPage = 1;
			that.list = [];
			that.loadList();
			uni.stopPullDownRefresh();
		},
		methods: {
			timeStampTurnTime(str) {
				var date = new Date(str); // 参数需要毫秒数，所以这里将秒数乘于 1000
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = date.getDate() + ' ';
				return Y + M + D;
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
			loadList() {
				api.post({
					content: that.seachText,
					currentPage: that.currentPage,
					pageSize: that.pageSize
				}, api.projectQueryListAdmin).then(res => {
					if (res.code == 200) {
						if (res.data.length > 0) {
							that.list = that.list.concat(res.data);
							that.currentPage++;
						}
					}

					uni.showToast({
						icon: 'none',
						title: res.msg
					})
				});
			},
			toAuditProjectDetail(e) {
				uni.navigateTo({
					url: '/pages/my/auditProject/auditProjectDetail/auditProjectDetail?obj=' + encodeURIComponent(
						JSON.stringify(e))
				})
			},
			doSearch(e) {
				that.currentPage = 1;
				that.list = [];
				that.loadList();
			},
			inputText(e) {
				this.seachText = e.detail.value
			},
			clearInput() {
				this.seachText = "";
				that.list = [];
				that.currentPage = 1;
				that.loadList();
			},
		}
	}
</script>

<style scoped>
	/* 搜索框 */
	.search-background-style {
		width: 100%;
		height: 130rpx;
		position: absolute;
		z-index: 9;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		z-index: 999;
		background-color: #fff;
	}

	.search-logo-background-style {
		width: 90%;
		height: 60%;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		background-color: #F5F5F5;
	}

	.image-background-style {
		width: 10%;
		height: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.image-background-style image {
		width: 40rpx;
		height: 40rpx;
	}

	.input-background-style {
		width: 85%;
		height: 80%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.input-background-style input {
		width: 90%;
		height: 100%;
	}

	.input-background-style image {
		width: 40rpx;
		height: 40rpx;
	}


	.top-space-line-style {
		height: 150rpx;
		width: 100%;
	}

	/* 项目列表 */
	.project-list-style {
		width: 96%;
		margin-left: 2%;
		height: 280rpx;
		box-shadow: darkgray 0px 0px 2px 0px;
		border-radius: 10rpx;
		margin-bottom: 30rpx;
	}


	.date-status-style {
		width: 98%;
		margin-left: 1%;
		height: 35%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.brief-information-style {
		width: 96%;
		margin-left: 2%;
		height: 160rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		font-size: 15px;
	}

	.date-style {
		width: 30%;
		background-color: #49A8E7;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		border-radius: 10rpx;
		height: 60%;
		font-size: 14px;
	}

	.status-style {
		width: 30%;
		background-color: #49A8E7;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		border-radius: 10rpx;
		height: 60%;
		margin-left: 3%;
		margin-right: 3%;
		font-size: 14px;
	}

	.detail-style {
		width: 30%;
		background-color: #EBA54B;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		border-radius: 10rpx;
		height: 60%;
		font-size: 14px;
	}

	.release-background-style {
		width: 100%;
		height: 100%;
		position: absolute;
	}
</style>
