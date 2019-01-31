<template>
	<view class="page-header">
		<!-- #ifndef MP -->
		<!-- 固定在顶部的导航栏 -->
		<uni-nav-bar fixed="true" color="#fff" background-color="#222" @click-right="showUser" shadow="true">
			<view slot="left"></view>
			<view class="center uni-center">
				<image src="../../static/images/logo.png" mode="widthFix" class="logo"></image>Chicken Music
			</view>
			<view slot="right">
				<image src="../../static/images/user.png" mode="widthFix" class="user"></image>
			</view>
		</uni-nav-bar>
		<!-- 使用非原生导航栏后需要在页面顶部占位 -->
		<view style="height:44px;"></view>
		<!-- #endif -->
	</view>
</template>

<script>
	import uniNavBar from './uni-nav-bar.vue'
	import uniIcon from './uni-icon.vue'
	export default {
		components: {
			uniNavBar,
			uniIcon
		},
		data() {
			return {
			};
		},
		methods: {
			showUser(){
				/* uni.showToast({
					title: '用户信息'
				}) */
				uni.navigateTo({
					url:"/pages/components/user/user",
				})
			}
		}
	}
</script>

<style>
	.page-header >>>.uni-navbar-header .uni-navbar-header-btns,
	.uni-navbar-header-btns{
		width:50px !important;
		padding:0px !important;
	}
	.page-header .center{
		line-height: 44px;
		color: #ffcd32;
		font-size: 16px;
	}
	.page-header .logo{
		width:28px;
		height:29px !important;
		vertical-align: middle;
		margin-right: 10px;
	}
	.page-header .user{
		width:40px;
		height:40px;
		margin: 2px 0px;
	}
</style>
