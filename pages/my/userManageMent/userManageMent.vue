<template>
	<view class="container">

		<!-- 搜索框 -->
		<view class="search-background-style">
			<view class="search-logo-background-style">
				<view class="image-background-style">
					<image src="/static/searchInput.png" mode=""></image>
				</view>
				<view class="input-background-style">
					<input :value="seachText" type="text" maxlength="15" placeholder="电话、昵称、邮箱、名称、身份证、属地"
						placeholder-style="font-size:14px" confirm-type="search" @confirm="doSearch" @input="inputText">
					<image src="/static/deleteSearch.png" @click="clearInput">
				</view>
			</view>
		</view>
		<view class="top-space-line-style"></view>


		<view class="photo-image-btn-background-style" v-for="(item,idx) in list" :key="idx">
			<view class="photo-image-background-style">
				<image :src="item.photoUrl==null?'/static/photo.png':item.photoUrl" mode=""></image>
				<view class="base-info-panel-style">
					<view class="phone-background-style">
						<text>{{item.nickName}}</text> 
						<text v-if="item.disableStatus==0" style="margin-left: 20rpx;color: #49A8E7;">正常</text> 
						<text v-if="item.disableStatus==1" style="margin-left: 20rpx;color: gray;">冻结</text>
						<text v-if="item.onlineStatus==1" style="margin-left: 20rpx;color: seagreen;">已登录</text>
						<text v-if="item.onlineStatus==0" style="margin-left: 20rpx;color: gray;">未登录</text>
					</view>
					<view class="phone-background-style">
					 {{item.ipTerritory}}
					</view>
				</view>
			</view>
			<view class="btn-background-style">
				<button @click="editUser(item)">编辑</button>
			</view>
		</view>



		<uni-popup ref="popup" background-color="#fff">
			<view class="need-description-budget-style">
				基本信息
			</view>
			<view class="scroll-item-line-two-style"></view>
			<view class="description-doller-style">
				<view class="edit-background-style">
					<view class="change-tips">
						用户名
					</view>
					<view class="change-input-style">
						<input type="text" placeholder="请输入用户名" :value="userObj.username" @input="setUserName">
					</view>
				</view>
				<view class="edit-background-style">
					<view class="change-tips">
						昵称
					</view>
					<view class="change-input-style">
						<input type="text" placeholder="设置昵称" :value="userObj.nickName" @input="setNickName">
					</view>
				</view>
				<view class="edit-background-style">
					<view class="change-tips">
						实名状态
					</view>
					<view class="change-input-style">
						<input type="text" disabled="true" :value="userObj.realNameStatus==0?'未实名':'已实名'">
					</view>
				</view>
				<view class="edit-background-style">
					<view class="change-tips">
						联系方式
					</view>
					<view class="change-input-style">
						<input type="text" placeholder="请输入联系方式" :value="userObj.phoneNumber" @input="setPhoneNumber">
					</view>
				</view>
				<view class="edit-background-style">
					<view class="change-tips">
						邮箱
					</view>
					<view class="change-input-style">
						<input type="text" placeholder="请输入邮箱" :value="userObj.email" @input="setEmail">
					</view>
				</view>
				<view class="edit-background-style">
					<view class="change-tips">
						邀请值
					</view>
					<view class="change-input-style">
						<input type="text" placeholder="请设置邀请值" :value="userObj.invitationValue"
							@input="setInvitationValue">
					</view>
				</view>

				<view class="edit-background-style">
					<view class="change-tips">
						ip属地
					</view>
					<view class="change-input-style">
						<input type="text" placeholder="归属地" disabled="true" :value="userObj.ipTerritory">
					</view>
				</view>
				<view class="edit-background-style">
					<view class="change-tips">
						用户状态
					</view>
					<view class="change-input-style">
						<input type="text" placeholder="用户状态" disabled="true"
							:value="userObj.disableStatus==0?'正常':'冻结'">

						<switch color="#49A8E7" @change="disabledUser" :checked="userObj.disableStatus==0" />
					</view>
				</view>

				<view class="button-background">
					<!-- <button @click="disabledUser">冻结</button> -->
					<button @click="save">保存</button>
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
				seachText: '',
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
			setUserName(e) {
				that.userObj.username = e.detail.value;
			},
			setNickName(e) {
				that.userObj.nickName = e.detail.value;
			},
			setPhoneNumber(e) {
				that.userObj.phoneNumber = e.detail.value;
			},
			setEmail(e) {
				that.userObj.email = e.detail.value;
			},
			setInvitationValue(e) {
				that.userObj.invitationValue = e.detail.value;
			},
			loadList() {
				api.post({
					content: that.seachText,
					currentPage: that.currentPage,
					pageSize: that.pageSize
				}, api.findSysUserList).then(res => {
					console.log(res.data)
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
			editUser(e) {
				that.userObj = e;
				this.$refs.popup.open('bottom')
			},
			disabledUser() {
				var userObj = that.userObj;
				if (userObj.disableStatus == 0) {
					that.userObj.disableStatus = 1;
				} else {
					that.userObj.disableStatus = 0;
				}
			},
			save() {
				var userObj = that.userObj;
				api.post(userObj, api.updateSysUser).then(res => {

					if (res.code == 200) {
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
						that.currentPage = 1;
						that.list = [];
						that.loadList();
					}
				});
				this.$refs.popup.close();
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
	.container {
		width: 100%;
		height: 100%;
		position: absolute;
	}

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
		height: 130rpx;
		width: 100%;
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

	.online-status {
		width: 20rpx;
		height: 20rpx;
		background-color: green;
		border-radius: 100%;
		margin-left: 5rpx;
		margin-right: 20rpx;
	}

	.un-online-status {
		width: 20rpx;
		height: 20rpx;
		background-color: grey;
		border-radius: 100%;
		margin: 0px 10rpx;
	}

	.photo-image-background-style image {
		width: 70rpx;
		height: 70rpx;
	}

	.base-info-panel-style {
		width: 70%;
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

	.button-background {
		width: 90%;
		margin-left: 5%;
		text-align: center;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.button-background button {
		background-color: #49A8E7;
		color: white;
		border-radius: 20rpx;
		width: 100%;
	}

	.edit-background-style {
		width: 96%;
		margin-left: 2%;
		height: 80rpx;
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
</style>
