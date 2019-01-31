<template>
	<view class="page-recommend">
		<scroll ref="scroll" class="list" :data="recommends" :pullDown="scrollOptions.pullDown" @pullDown="refresh">
			<view class="recommend">
				<view class="page-section swiper"><!-- @touchmove.stop -->
					<view class="page-section-spacing">
						<swiper class="swiper" :indicator-dots="swiper.indicatorDots" :autoplay="swiper.autoplay" :interval="swiper.interval"
						 :duration="swiper.duration" :circular="swiper.circular">
							<swiper-item v-for="(item, index) in recommends" :key="index">
								<view class="swiper-item uni-bg-blue" @click="linkToPage(item.linkUrl)">
									<image @load="loadImage" :src="item.picUrl" mode="widthFix" class="slideImg"></image>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>

				<view class="recommend-list">
					<view class="list-title">热门歌单推荐</view>
					<ul>
						<li @click="selectItem(item)" v-for="(item, index) in discList" :key="index" class="item">
							<view class="icon">
								<image :src="item.imgurl" mode="widthFix" v-lazy="item.imgurl" class="item-img"></image>
							</view>
							<view class="text">
								<rich-text :nodes="item.creator.name" class="name"></rich-text>
								<rich-text :nodes="item.dissname" class="desc"></rich-text>
							</view>
						</li>
					</ul>
				</view>
			</view>
		</scroll>
		<!--  
		<view class="uni-tab-bar-loading"> 
		   //tab.loadingType 
			<uni-load-more :loadingType="0" :contentText="loadingText"></uni-load-more>
		</view>-->
	</view>
</template>

<script>
	import scroll from '@/components/scroll.vue'
	import uniLoadMore from '@/components/uni-load-more.vue'
	import {getRecommend, getDiscList} from '@/pages/api/recommend'

	export default {
		components: {
			uniLoadMore,
			scroll
		},
		computed:{
			bScroll(){
				return this.$refs.scroll.scroll
			}
		},
		data() {
			return {
				loadingText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				scrollOptions: {
					pullup: true, //上拉加载
					pullDown: true //下拉刷新
				},
				swiper: {
					indicatorDots: true,
					autoplay: true,
					circular: true,
					interval: 2000,
					duration: 500
				},
				recommends: [],
				discList: []
			}
		},
		
		activated() {
			//console.log("刷新666")
		},
		methods: {
			refresh() {
				console.log("刷新")
				this._getDiscList()
			},
			loadMore(e) {
				this.newsitems[e].loadingType = 1;
				setTimeout(() => {
					this.addData(e);
				}, 1200);
			},
			_getRecommend() { //轮播图

				getRecommend().then(res => {
					//console.log(res)
					if (res.code === this.ERR_OK) {
						this.recommends = res.data.slider;
					}
				})
			},
			_getDiscList() { //推荐歌单列表
				getDiscList().then(res => {
					if (res.code === this.ERR_OK) {
						this.discList = res.data.list;
						setTimeout(()=>{
							
							this.$refs.scroll.finishPullDown()
						},1000)
					}
				}) 

			},
			loadImage() {
				if (!this.checkloaded) {
					this.checkloaded = true
					this.$refs.scroll.refresh()
				}
			},
			linkToPage(url) {
				uni.navigateTo({
					url
				})
			},
			finishPullDown(){
				return false;
			}
		},
		created() {
			this._getRecommend();
			this._getDiscList();
			
		}
	}
</script>

<style>
	/* 组件css */
	.swiper .swiper-item,
	.swiper-item .slideImg {
		width: 100%;
		height: 100%;
	}
	.swiper>>>uni-swiper .uni-swiper-dot-active {
		background: #D8D8D8;
	}
	/* 页面css */
	.page-recommend{
		height: 100%;
	}
	.recommend-list .list-title{
		height: 65px;
		line-height: 65px;
		text-align: center;
		font-size: 14px;
		color: #ffcd32;
	}
	.recommend-list .item{
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;
	}
	.recommend-list .item .icon {
		flex: 0 0 60px;
		width: 60px;
		padding-right: 20px;
	}
	.item .icon .item-img{
		width:60px;
		height:60px;
	}
	.recommend-list .item .text{
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		line-height: 20px;
		overflow: hidden;
		font-size: 14px;
	}
	.item .text .name{
		margin-bottom: 10px;
		color: #fff;
	}
	.item .text .desc{
	 	 color:rgba(255,255,255,0.3);
	}
</style>
