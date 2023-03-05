<template>
	<view class="container">

		<view class="search-background-style">
			<view class="select-duration-background-select">
				时间范围：
				<picker mode="date" :value="fromDate" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uni-input">{{fromDate}}</view>
				</picker>
				至
				<picker mode="date" :value="toDate" :start="startDate" :end="endDate" @change="toBindDateChange">
					<view class="uni-input">{{toDate}}</view>
				</picker>
			</view>
			<view class="select-duration-background-select">
				类型：
				<picker @change="bindPickerChange" :value="index" :range="array">
					<view class="uni-input">{{array[index]}}</view>
				</picker>
				名称：
				<input type="text" placeholder="日志名称" confirm-type="search" @confirm="doSearch">

			</view>

		</view>

		<view class="space-line-style">

		</view>
		<view class="log-background" @click="toLogDetail">
			<view class="model-one-style">
				<view class="log-type-style">
					日志类型：业务日志
				</view>
				<view class="log-name-style">
					日志名称：用户登录
				</view>
			</view>

			<view class="model-one-style">
				<view class="log-type-style">
					用户id：001
				</view>
				<view class="log-name-style">
					2022-03-29 23:28:24
				</view>
			</view>
			<view class="model-one-style">
				<view class="log-name-style">
					类名：cn.stylefeng.guns.sys.modular.system.modular.system.modular.system.
				</view>
				<view class="log-name-style">
					方法名：about
				</view>
			</view>
			<view class="model-one-style">
				<view class="log-name-style">
					ip：192.323.23.23
				</view>

				<view class="log-name-style">
					具体内容：空指针异常
				</view>
			</view>
		</view>






	</view>
</template>

<script>
	export default {
		data() {
			return {
				fromDate: '开始时间',
				toDate: '结束时间',
				array: ['全部', '业务日志', '异常日志'],
				index: 0,
				inputText: '',

			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {

			bindDateChange: function(e) {
				this.fromDate = e.detail.value
				console.log(this.fromDate)
			},
			toBindDateChange(e) {
				this.toDate = e.detail.value;
				console.log(this.toDate)
			},

			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.index = e.detail.value
			},
			doSearch(e) {
				this.inputText = e.detail.value;
				console.log(e.detail.value)
			},
			toLogDetail(){
				uni.navigateTo({
					url:'/pages/my/logManagement/logDetail/logDetail'
				})
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

	.search-background-style {
		width: 100%;
		height: 220rpx;
		background-color: #fff;
		position: fixed;
		z-index: 1;
	}

	.select-duration-background-select {
		width: 96%;
		margin-left: 2%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		box-shadow: darkgray 0px 0px 2px 0px;
	}

	.select-duration-background-select input {
		width: 200rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
		height: 70rpx;
		border: solid 1rpx #e1e1e1;
		display: flex;
		justify-content: center;
		align-items: center;
		content: '';
	}

	.select-duration-background-select picker {
		width: 200rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
		height: 70rpx;
		border: solid 1rpx #e1e1e1;
		display: flex;
		justify-content: center;
		align-items: center;
		content: '';
	}

	.uni-input {
		color: #666;
	}

	.space-line-style {
		width: 100%;
		height: 220rpx;
	}

	/* 主体内容 */
	.log-background {
		width: 96%;
		margin-left: 2%;
		height: 300rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		box-shadow: darkgray 0px 0px 2px 0px;
	}

	.model-one-style {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 98%;
		margin-left: 1%;
		height: 75rpx;
	}

	.model-two-style {
		width: 98%;
		margin-left: 1%;
		height: 70rpx;
		align-items: center;
		display: block;
		justify-content: left;
		align-items: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.log-type-style {
		width: 50%;
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.log-name-style {
		width: 50%;
		display: block;
		justify-content: left;
		align-items: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
