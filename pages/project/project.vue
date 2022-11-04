<template>
	<view class="release-background-style">

		<!-- 搜索框 -->
		<view class="search-background-style">
			<view class="search-logo-background-style">
				<view class="image-background-style">
					<image src="/static/searchInput.png" mode=""></image>
				</view>
				<view class="input-background-style" v-if="online==1">
					<input :value="seachText" type="text" maxlength="15" placeholder="元宇宙、商城、聊天、APP、网站"
						placeholder-style="font-size:14px" confirm-type="search" @confirm="doSearch" @input="inputText">
					<image src="/static/deleteSearch.png" @click="clearInput">
				</view>
				<view class="input-background-style" v-if="online==0">
					<input :value="seachText" type="text" maxlength="15" placeholder="名人传,拿破仑,秦孝公..."
						placeholder-style="font-size:14px" confirm-type="search" @confirm="doSearch" @input="inputText">
					<image src="/static/deleteSearch.png" @click="clearInput">
				</view>
			</view>
		</view>
		<view v-if="list.length==0" class="content-null-style" @click="touchLoad">
			<view class="image-title-background-style">
				<view class="not-release-image-style-background">
					<image src="/static/notAnything.png" mode=""></image>
				</view>
				<view class="title-context">
					点我加载信息~
				</view>
			</view>
		</view>
		<view class="top-space-line-style"></view>
		<view v-if="online==1" class="click-release-style" @click="releaseProject('bottom')">发项目</view>
		<uni-popup ref="popup" background-color="#fff">
			<view class="need-description-budget-style">
				项目描述和预算
			</view>
			<view class="scroll-item-line-two-style"></view>
			<view class="description-doller-style">
				<view class="doller-num-style">
					<input placeholder="请输入预算(单位:元)" type="number" maxlength="15" :value="price" @input="setPrice">
				</view>
				<view class="description-style">
					<textarea maxlength="1000" cols="30" rows="100" placeholder="请输入您的需求信息" :value="content"
						@input="setContent"></textarea>
				</view>
				<view class="button-style">
					<button @click="cancelSubmit">取消</button>
					<view class="button-space"></view>
					<button @click="submit">确认发布</button>
				</view>
			</view>
		</uni-popup>


		<view class="advertise-project-list" v-if="online==0">
			<view class="project-list-style" style="height: 100%;" @click="toProjecDetail(item)">
				<view class="date-status-style" v-if="online==0">
					<view class="status-style"
						style="width: 100%;height: 80rpx; margin-top: 20rpx;margin-bottom: 20rpx;">

						田忌赛马
					</view>
				</view>
				<view style="width: 96%;height: 95%;margin-left: 2%;margin-top: 10rpx;margin-bottom: 20rpx;">
					　田忌经常与齐国诸公子赛马，设重金作为赌注。孙膑发现比赛的马可分为上、中、下三等，于是建议田忌增加赌注，并且向他保证必能取胜。田忌于是与齐威王和诸公子设每场千金作为赌注，比试赛马。孙膑叫田忌用下等马，与齐威王的上等马比赛...
				</view>
			</view>
		</view>

		<view class="advertise-project-list" v-for="(item,idx) in list" :key="idx" v-if="online==1">


			<!-- 发布的列表 -->
			<view class="project-list-style" @click="toProjecDetail(item)">
				<view class="date-status-style">
					<view class="date-style">
						{{timeStampTurnTime(item.createTime)}}
					</view>
					<view class="status-style">
						待接包
					</view>
					<view class="status-style">
						查看详情
					</view>
				</view>

				<view class="brief-information-style">
					<text> 项目预算：{{item.price}}元；项目描述：</text>{{item.content}}
				</view>
			</view>


			<view class="shop-list-style" v-if="idx==0&&online==1">
				<swiper class="swiper" @change="getItem" :current="act" autoplay="true" interval="3000" circular="true">
					<swiper-item v-for="(shopItem,ids) in shopList" :key="ids"
						@click="copyAdLink(shopItem.jdAdHyperlink)">
						<!-- <uni-link href="https://item.jd.com/100010599633.html#crumb-wrap" showUnderLine="false" >
					</uni-link> -->
						<view class="commodity-image-description-background-style">
							<view class="commodity-image-background-style">
								<image :src="shopItem.jdAdImageLink" />
							</view>
							<view class="description-background-style">
								<view class="title-description-style">
									{{shopItem.jdAdName}}
								</view>
								<view class="store-description-style">
									商家：{{shopItem.jdAdStoreName}}
								</view>

								<view class="discount-description-style">
									优惠卷：{{shopItem.jdAdCoupon}}
								</view>

								<view class="price-good-diss-style">
									<view class="price-num-style">
										价格：￥{{shopItem.jdAdPrice}}
									</view>
									<view class="good-diss-style">
										好评：{{shopItem.jdAdCommentNum}}万+

									</view>
									<view class="go-shopping">
										<view class="go-shopping-btn">
											<uni-link :href="shopItem.jdAdHyperlink" showUnderLine="false"
												copyTips="已复制商品链接,可在浏览器打开" text="逛一逛" color="red" fontSize="12">
											</uni-link>
										</view>

									</view>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>

		<!-- 提示下拉刷新~ -->
		<view class="tips-background-style" v-if="list.length>0&&list.length<10">
			下 拉 刷 新 ~ ~ ~
		</view>
		<!-- 提示上滑加载更多~ -->
		<view class="tips-background-style" v-if="list.length>=10">
			上 滑 加 载 更 多 ~ ~ ~
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
				list: [],
				type: 'center',
				seachText: "",
				// 默认激活样式是第一个
				act: '',
				shopList: [],

				projecObj: null,
				currentPage: 1,
				pageSize: 10,
				price: "",
				content: "",
				userInfo: "",
				online: 0,

			}
		},
		created() {
			that = this;
		},
		onLoad() {
			
			that.list = [];
			that.currentPage = 1;
			that.pageSize = 10;
			that.loadList();


		},
		onShow() {
			var otherInfo = uni.getStorageSync(sk.otherInfo);
			that.online = otherInfo.online;


			that.shopList = uni.getStorageSync(sk.shopList);
			var userInfo = uni.getStorageSync(sk.userInfo);
			that.userInfo = userInfo;
			// 校验用户是否登录
			var loginStatus = uni.getStorageSync(sk.loginStatus);
			if (loginStatus) {
				// 登录成功，帮助好友更新项目助力信息
				that.doUpdateProjectHelp();
			}
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

			touchLoad() {
				
				that.currentPage = 1;
				that.list = [];
				that.loadList();
			},

			doUpdateProjectHelp() {
				var projectHelpShare = uni.getStorageSync(sk.projectHelpShare);
				var createUserId = projectHelpShare.createUserId;
				var userInfo = that.userInfo;
				if (userInfo.userId == createUserId) {
					return;
				}

				console.log(projectHelpShare);
				if (!su.isUndefined(projectHelpShare) && !su.isBlank(projectHelpShare)) {
					api.post({
						hpId: projectHelpShare.hpId,
					}, api.updateProjectHelpNumber).then(res => {
						if (res.code == 200) {
							uni.removeStorage({
								key: sk.projectHelpShare
							})
						}
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
					});
				}
			},
			copyAdLink(e) {
				uni.setClipboardData({
					data: e,
					showToast: false,
					success: function() {
						uni.showToast({
							icon: 'none',
							title: '已复制商品链接,可在浏览器打开'
						})
					}
				});
			},

			setPrice(e) {
				that.price = e.detail.value;
			},
			setContent(e) {
				that.content = e.detail.value;
			},

			timeStampTurnTime(str) {
				var date = new Date(str); // 参数需要毫秒数，所以这里将秒数乘于 1000
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = date.getDate() + ' ';
				return Y + M + D;
			},



			loadList() {
				api.post({
					content: that.seachText,
					projectType: 0,
					currentPage: that.currentPage,
					pageSize: that.pageSize
				}, api.projectFindList).then(res => {
					
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
			releaseProject(type) {
				var token = uni.getStorageSync(sk.token);
				if (su.isBlank(token)) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				var userInfo = uni.getStorageSync(sk.userInfo);
				if (su.isBlank(userInfo.email) || su.isBlank(userInfo.phoneNumber)) {
					uni.showModal({
						title: '温馨提示',
						content: '设置邮箱和电话方便乙方联系您',
						cancelText: '不去',
						confirmText: '去啊',
						success(e) {
							if (e.confirm) {
								uni.navigateTo({
									url: '/pages/addEmailPhoneNumber/addEmailPhoneNumber'
								})
							}
						}
					})
					return;
				}
				that.type = type;
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				that.$refs.popup.open(type);
			},
			submit() {
				if (su.isBlank(that.price)) {
					uni.showToast({
						icon: 'none',
						title: '预算不为空',
					})
					return;
				}
				if (that.price < 50) {
					uni.showToast({
						icon: 'none',
						title: '预算低于50元',
					})
					return;
				}

				if (su.isBlank(that.content)) {
					uni.showToast({
						icon: 'none',
						title: '需求内容不为空',
					})
					return;
				}

				
				api.post({
					content: that.content,
					price: that.price,
					ipAddress: uni.getStorageSync(sk.ipTerritory),
					nickname: that.userInfo.nickName,
				}, api.projectAddProject).then(res => {
					
					if (res.code == 200) {
						that.content = '';
						that.price = '';
						that.list = [];
						that.currentPage = 1;
						that.pageSize = 10;
						that.loadList();
						that.$refs.popup.close();
						uni.navigateTo({
							url: '/pages/release/release'
						})
					}
					uni.showToast({
						icon: 'none',
						title: res.msg
					})
				});
			},
			cancelSubmit() {
				that.$refs.popup.close();
			},

			toProjecDetail(e) {
				uni.navigateTo({
					url: '/pages/projectDetail/projectDetail?obj=' + encodeURIComponent(JSON.stringify(e))
				})
			},
			doSearch(e) {
				that.currentPage = 1;
				that.list = [];
				that.loadList();
			},
			inputText(e) {
				that.seachText = e.detail.value
			},
			clearInput() {
				that.seachText = "";
				that.list = [];
				that.currentPage = 1;
				that.loadList();
			},
			getItem(e) {
				that.act = e.detail.current;
			},
		}
	}
</script>

<style scoped>
	.tips-background-style {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 28rpx;
		font-size: 12px;
		color: #bfbfbf;
	}

	.advertise-project-list {
		width: 100%;
		height: auto;
	}

	/* 广告插入 */
	.swiper {
		height: 100%;
		width: 100%;
	}


	.swiper-item {
		display: block;
		height: 100%;
		line-height: 100%;
		text-align: center;
		border: 1rpx solid black;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: green;
	}

	.commodity-image-description-background-style {
		width: 98%;
		margin-left: 1%;
		height: 98%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 2.5%;
	}

	.commodity-image-background-style {
		width: 25%;
		height: 98%;
	}

	.commodity-image-background-style image {
		height: 160rpx;
		width: 160rpx;
	}

	.description-background-style {
		width: 75%;
		height: 100%;
	}

	.title-description-style {
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		color: black;
		font-size: 14px;
		white-space: nowrap;
	}

	.price-good-diss-style {
		display: flex;
		color: red;
		font-size: 15px;
		font-weight: bold;
	}

	.price-num-style {
		width: 40%;
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.good-diss-style {
		width: 30%;
		font-size: 12px;
		color: grey;
		display: flex;
		justify-content: right;
		align-items: center;
	}

	.go-shopping {
		width: 30%;
		font-size: 12px;
		color: grey;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.go-shopping-btn {
		width: 80%;
		border-radius: 10rpx;
		height: 100%;
		font-size: 12px;
		color: grey;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: darkgray 0px 0px 2px 0px;
	}

	.discount-description-style {
		color: red;
		font-size: 14px;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.store-description-style {
		width: 100%;
		color: black;
		font-size: 14px;
	}


	/* 搜索框 */
	.search-background-style {
		width: 100%;
		height: 130rpx;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		z-index: 2;
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

	.project-list-style {
		width: 96%;
		margin-left: 2%;
		height: 280rpx;
		box-shadow: darkgray 0px 0px 2px 0px;
		border-radius: 10rpx;
		margin-bottom: 30rpx;
	}

	.shop-list-style {
		width: 96%;
		margin-left: 2%;
		height: 200rpx;
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

	.button-style {
		width: 90%;
		margin-left: 5%;
		height: 150rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		position: fixed;
		bottom: 10rpx;
	}

	.button-style button {
		width: 40%;
		background-color: #49A8E7;
		color: white;
	}

	.button-space {
		width: 10%;
	}

	.description-style {
		width: 90%;
		margin-left: 5%;
		display: flex;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: darkgray 0px 0px 2px 0px;
		border-radius: 10px;
		height: 320rpx;
	}

	.description-style textarea {
		width: 96%;
		margin-top: 20rpx;
		margin-left: 2%;
		height: 280rpx;
	}

	.doller-num-style {
		width: 90%;
		height: 80rpx;
		margin-left: 5%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: darkgray 0px 0px 2px 0px;
		margin-top: 30rpx;
		border-radius: 10px;
	}

	.doller-num-style input {
		width: 90%;
		height: 100%;
	}

	.description-doller-style {
		width: 100%;
		height: 950rpx;
	}

	.release-background-style {
		width: 100%;
		height: 100%;
		position: absolute;
	}

	.content-null-style {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-title-background-style {
		width: 50%;
		height: 500rpx;
	}

	.title-context {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: lightgrey;
	}

	.not-release-image-style-background {
		width: 100%;
		height: 70%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.not-release-image-style-background image {
		width: 250rpx;
		height: 250rpx;
	}

	.click-release-style {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		z-index: 2;
		bottom: 120px;
		right: 40px;
		background-color: #49A8E7;
		color: white;
		font-size: 14px;
		border-radius: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: #49A8E7 1px 0px 5px 1px;
	}

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
</style>
