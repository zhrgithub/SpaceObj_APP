<template>
	<view class="container" v-if="online==1">
		<view class="shop-list-style" @click="editAdvertise(item)" v-for="(item,idx) in list" :key="idx">
			<view class="commodity-image-description-background-style">
				<view class="commodity-image-background-style">
					<image :src="item.jdAdImageLink" mode=""></image>
				</view>
				<view class="description-background-style">
					<view class="title-description-style">
						{{item.jdAdName}}
					</view>
					<view class="store-description-style">
						商家：{{item.jdAdStoreName}}
					</view>

					<view class="discount-description-style">
						优惠卷：{{item.jdAdCoupon}}
					</view>

					<view class="price-good-diss-style">
						<view class="price-num-style">
							价格：￥{{item.jdAdPrice}}
						</view>
						<view class="good-diss-style">
							好评：{{item.jdAdCommentNum}}万+
						</view>
					</view>

				</view>
			</view>
		</view>

		<view class="click-release-style" @click="addAdvertise">添加</view>
		<uni-popup ref="popup" background-color="#fff">
			<view class="need-description-budget-style">
				广告表单
			</view>
			<view class="scroll-item-line-two-style"></view>
			<view class="description-doller-style">

				<view class="doller-num-style">
					<view class="title-context-style">
						商品超链接：
					</view>
					<input :value="jdAdHyperlink" @input="setAdHyperlink">
				</view>
				<view class="doller-num-style">
					<view class="title-context-style">
						图片超链接：
					</view>
					<input :value="jdAdImageLink" @input="setAdImageLink">
				</view>
				<view class="doller-num-style">
					<view class="title-context-style">
						商品名称：
					</view>
					<input :value="jdAdName" @input="setAdName">
				</view>
				<view class="doller-num-style">
					<view class="title-context-style">
						商店名称：
					</view>
					<input :value="jdAdStoreName" @input="setAdStoreName">
				</view>
				<view class="doller-num-style">
					<view class="title-context-style">
						优惠券描述：
					</view>
					<input :value="jdAdCoupon" @input="setAdCoupon">
				</view>

				<view class="doller-num-style">
					<view class="title-context-style">
						价格：
					</view>
					<input :value="jdAdPrice" @input="setAdPrice">
				</view>
				<view class="doller-num-style">
					<view class="title-context-style">
						好评数量：
					</view>
					<input :value="jdAdCommentNum" @input="setAdCommentNum">
				</view>

				<view class="button-style">
					<button @click="del">删除</button>
					<view class="button-space"></view>
					<button @click="submit">保存</button>
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
				list: [],
				jdAdCommentNum: null, //商品评论数量
				jdAdCoupon: null, //优惠券描述
				jdAdHyperlink: null, //商品超链接
				jdAdId: null, //商品id
				jdAdImageLink: null, //商品图片链接
				jdAdName: null, //商品名称
				jdAdPrice: null, //商品价格
				jdAdStoreName: null, //商家名称
				operationType: null, //操作类型：0表示修改，1表示新增，默认为null
				online:0,
			}
		},
		created() {
			that = this;
		},
		onShow() {
			
			var otherInfo = uni.getStorageSync(sk.otherInfo);
			
			that.online = otherInfo.online;
			if(that.online==0){
				uni.switchTab({
					url: '/pages/project/project'
				})
			}
			
			that.loadList();
		},
		methods: {
			setAdHyperlink(e) {
				that.jdAdHyperlink = e.detail.value;
			},
			setAdImageLink(e) {
				that.jdAdImageLink = e.detail.value;
			},
			setAdName(e) {
				that.jdAdName = e.detail.value;
			},
			setAdStoreName(e) {
				that.jdAdStoreName = e.detail.value;
			},
			setAdCoupon(e) {
				that.jdAdCoupon = e.detail.value;
			},
			setAdPrice(e) {
				that.jdAdPrice = e.detail.value;
			},
			setAdCommentNum(e) {
				that.jdAdCommentNum = e.detail.value;
			},
			loadList() {
				api.post({

				}, api.jdList).then(res => {
					that.list = res.data;
					
				});
			},
			editAdvertise(e) {
				that.jdAdCommentNum = e.jdAdCommentNum;
				that.jdAdCoupon = e.jdAdCoupon;
				that.jdAdHyperlink = e.jdAdHyperlink;
				that.jdAdId = e.jdAdId;
				that.jdAdImageLink = e.jdAdImageLink;
				that.jdAdName = e.jdAdName;
				that.jdAdPrice = e.jdAdPrice;
				that.jdAdStoreName = e.jdAdStoreName;

				// 设置成修改的操作类型
				that.operationType = 0;

				this.$refs.popup.open('bottom')

			},
			addAdvertise() {
				// 设置成添加的操作类型
				that.operationType = 1;
				that.jdAdCommentNum = '';
				that.jdAdCoupon = '';
				that.jdAdHyperlink = '';
				that.jdAdId = '';
				that.jdAdImageLink = '';
				that.jdAdName = '';
				that.jdAdPrice = '';
				that.jdAdStoreName = '';
				this.$refs.popup.open('bottom')
			},
			del() {
				this.$refs.popup.close();
				api.post({
					jdAdId: that.jdAdId
				}, api.jdDeleteAdvertise).then(res => {
					if (res.code == 200) {
						that.loadList();
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
					}
				});
				
				
			},
			submit() {
				// 判断是新增还是修改
				var operationType = that.operationType;
				if (that.jdAdHyperlink.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '商品超链接不为空'
					})
					return;
				}

				if (that.jdAdImageLink.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '图片超链接不为空'
					})
					return;
				}
				if (that.jdAdName.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '商品名称不为空'
					})
					return;
				}
				if (that.jdAdStoreName.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '商家名称不为空'
					})
					return;
				}
				if (that.jdAdCoupon.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '优惠卷描述不为空'
					})
					return;
				}
				if (that.jdAdPrice == '') {
					uni.showToast({
						icon: 'none',
						title: '商品价格不为空'
					})
					return;
				}
				if (that.jdAdCommentNum.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '商品好评数不为空'
					})
					return;
				}
				if (operationType == 0) {
					that.update();
				} else {
					that.add();
				}
				this.$refs.popup.close();


			},

			add() {
				api.post({
					jdAdHyperlink: that.jdAdHyperlink,
					jdAdImageLink: that.jdAdImageLink,
					jdAdName: that.jdAdName,
					jdAdStoreName: that.jdAdStoreName,
					jdAdCoupon: that.jdAdCoupon,
					jdAdPrice: that.jdAdPrice,
					jdAdCommentNum: that.jdAdCommentNum,
				}, api.jdSaveAdvertise).then(res => {
					if (res.code == 200) {
						that.loadList();
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
					}
				});
			},
			update() {
				if (that.jdAdId == '') {
					uni.showToast({
						icon: 'none',
						title: '商品id不为空'
					})
					return;
				}
				api.post({
					jdAdId: that.jdAdId,
					jdAdHyperlink: that.jdAdHyperlink,
					jdAdImageLink: that.jdAdImageLink,
					jdAdName: that.jdAdName,
					jdAdStoreName: that.jdAdStoreName,
					jdAdCoupon: that.jdAdCoupon,
					jdAdPrice: that.jdAdPrice,
					jdAdCommentNum: that.jdAdCommentNum,
				}, api.jdUpdateAdvertise).then(res => {
					if (res.code == 200) {
						that.loadList();
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
					}
				});
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
	.discount-description-style{
		font-size: 12px;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		color: black;
		white-space: nowrap;
	}


	.shop-list-style {
		width: 96%;
		margin-left: 2%;
		height: 200rpx;
		box-shadow: darkgray 0px 0px 2px 0px;
		border-radius: 10rpx;
		margin-top: 20px;
		margin-bottom: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;

	}

	.commodity-image-description-background-style {
		width: 98%;
		margin-left: 1%;
		height: 98%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 2.5%;
		height: 90%;
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
		width: 50%;
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.good-diss-style {
		width: 50%;
		font-size: 12px;
		color: grey;
		display: flex;
		justify-content: right;
		align-items: center;
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
		font-size: 15px;
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

	.description-doller-style {
		width: 100%;
		height: 900rpx;
	}

	.doller-num-style {
		width: 90%;
		height: 80rpx;
		margin-left: 5%;
		display: flex;
		align-items: center;
		justify-content: center;

		margin-top: 30rpx;

	}


	.doller-num-style input {
		width: 70%;
		box-shadow: darkgray 0px 0px 2px 0px;
		border-radius: 10rpx;
		height: 80rpx;
	}

	.title-context-style {
		width: 30%;
	}

	.button-style {
		width: 90%;
		margin-left: 5%;
		height: 150rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.button-style button {
		width: 40%;
		background-color: #49A8E7;
		color: white;
	}

	.button-space {
		width: 10%;
	}
</style>
