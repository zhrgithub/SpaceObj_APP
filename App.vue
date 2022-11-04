<script>
	import sk from '@/common/StoryKeys.js'
	import api from '@/common/api.js'
	import su from '@/utils/StringUtils.js'
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			// 获取广告
			api.post({

			}, api.jdList).then(res => {
				if (res.code == 200) {
					uni.setStorage({
						key: sk.shopList,
						data: res.data
					})
				}
			})
			// 获取ip
			api.get({}, api.GET_IP).then(res => {
				var ip = su.getIp(res);
				
				console.log(ip);
				// 获取ip属地
				api.get({
					ip: ip
				}, api.ipTerritory).then(res => {
					console.log("ip属地", res);
					if (!su.isBlank(res)&&res.code == 200) {
						var ip_Territory = res.country + res.province + res.city + res.isp;
						uni.setStorage({
							key: sk.ipTerritory,
							data: ip_Territory
						})
					} else {
						uni.setStorage({
							key: sk.ipTerritory,
							data: "中国大陆"
						})
						
						uni.setStorage({
							key:sk.ip,
							data:"未知"
						})
					}
				});
			});

			// 获取设备信息
			const res = uni.getSystemInfoSync();
			uni.setStorage({
				key: sk.deviceModel,
				data: res
			})
		},
		onHide: function() {
			console.log('App Hide')
		},

	}
</script>

<style>
	/*每个页面公共css */

	* {
		font-family: "arial, helvetica, sans-serif", "宋体";
		padding: 0;
		margin: 0;
		outline: none;
		text-decoration: none;
		list-style: none;
	}
</style>
