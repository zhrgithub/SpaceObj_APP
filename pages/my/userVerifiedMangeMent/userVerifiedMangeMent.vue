<template>
	<view class="container">
		<view class="photo-image-btn-background-style" v-for="(item,idx) in list" :key="idx">
			<view class="photo-image-background-style">
				<image :src="item.photoUrl" mode=""></image>
				<view class="base-info-panel-style">
					<view class="phone-background-style">
						状态：<text v-if="item.realNameStatus==0">未实名</text> <text
							v-if="item.realNameStatus==1">审核通过</text><text v-if="item.realNameStatus==2">待审核</text><text
							v-if="item.realNameStatus==3">审核不通过</text>
					</view>
					<view class="phone-background-style">
						邮箱：<text>{{item.email}}</text>
					</view>
				</view>
			</view>
			<view class="btn-background-style">
				<button @click="auditUser(item)">审核</button>
			</view>
		</view>



		<uni-popup ref="popup" background-color="#fff">
			<view class="need-description-budget-style">
				实名信息
			</view>
			<view class="scroll-item-line-two-style"></view>
			<view class="description-doller-style">
				<view class="base-infos">
					<view class="base-infos-style">
						<input placeholder="用户姓名" :value="userObj.username" disabled="true"></input>
					</view>
					<view class="base-infos-style-two">
						<input placeholder="身份证号" :value="userObj.idCardNum" maxlength="18" type="number"
							disabled="true"></input>
					</view>
				</view>

				<view class="id-card-style">
					<block class="image-background-two">
						<image :src="userObj.idCardPic"
							style="width:100%;height:100%;margin-left:0%;border-radius: 20rpx;" />
					</block>
				</view>

				<view class="button-background" v-if="auditStatus==0||auditStatus==3">
					<button @click="saveBtn(1)">通过</button>
					<button @click="saveBtn(0)">不通过</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	let that;
	import sk from '@/common/StoryKeys.js'
	import api from '@/common/api.js'
	import strigUtils from '@/utils/StringUtils.js'
	export default {
		data() {
			return {
				auditStatus: 3,
				imageUrl: '',
				name: '',
				idCard: '',
				phone: '',

				list: [],
				userObj: null,
				currentPage: 1,
				pageSize: 10
			}
		},
		created() {
			that = this;
		},
		onShow() {
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
			loadList() {
				api.post({
					currentPage: that.currentPage,
					pageSize: that.pageSize,
					realNameStatus: 2,
				}, api.findSysUserList).then(res => {
					if (res.code == 200) {
						if (res.data.length > 0) {
							that.list = that.list.concat(res.data);
							that.currentPage++;
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
					}

				});
			},
			auditUser(e) {
				that.userObj = e;
				this.$refs.popup.open('bottom');
			},
			saveBtn(e) {
				this.$refs.popup.close();
				var userObj = that.userObj;
				// 审核不通过
				if (e == 0) {
					uni.showModal({
						editable: true,
						title: '未通过原因',
						confirmColor: '#000',
						success(e) {
							if (e.confirm) {
								userObj.auditMsg = e.content;
								userObj.realNameStatus = 3;
								that.save(userObj);
							}
						}
					})
				}
				// 审核通过
				if (e == 1) {
					userObj.realNameStatus = 1;
					that.save(userObj);
				}
			},
			save(userObj) {
				api.post(userObj, api.updateSysUser).then(res => {

					if (res.code == 200) {
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						that.currentPage = 1;
						that.list = [];
						that.loadList();
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

	.photo-image-btn-background-style {
		width: 96%;
		margin-left: 2%;
		height: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		box-shadow: darkgray 0px 0px 2px 0px;
	}

	.photo-image-background-style {
		width: 70%;
		height: 80%;
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.photo-image-background-style image {
		width: 70rpx;
		height: 70rpx;
	}

	.base-info-panel-style {
		width: 80%;
		margin-left: 20rpx;
		height: 100%;
	}

	.phone-background-style {
		width: 100%;
		display: block;
		justify-content: left;
		align-items: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.btn-background-style {
		width: 25%;
		height: 80%;
		justify-content: center;
		display: flex;
		align-items: center;
	}

	.btn-background-style button {
		width: 80%;
		height: 70%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		background-color: #49A8E7;
		color: #fff;
	}

	/* 弹出框 */

	.need-description-budget-style {
		width: 100%;
		font-weight: bold;
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
		width: 100%;
		height: 900rpx;
	}

	/* 表单信息 */
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
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.button-background button {
		background-color: #49A8E7;
		color: white;
		border-radius: 20rpx;
		width: 30%;
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
