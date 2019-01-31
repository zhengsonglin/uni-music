<template>
	<view class="page-recommend">
		<scroll ref="scroll" class="scroll-list"
              :data="discList"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp"
              @click="clickItem"
      >
			<!--
			<view slot="pulldown">自定义下拉刷新</view>
			-->
			
			<!-- scroll主体 -->
			<view class="recommend">
				<view class="page-section swiper">
					<view class="page-section-spacing">
						<swiper class="swiper" :indicator-dots="swiper.indicatorDots" :autoplay="swiper.autoplay" :interval="swiper.interval"
						 :duration="swiper.duration" :circular="swiper.circular">
							<swiper-item v-for="(item, index) in recommends" :key="index">
								<view class="swiper-item">	<!-- @click="linkToPage(item.linkUrl)" -->
									<a :href="item.linkUrl" target="_blank">	
									<image @load="loadImage" :src="item.picUrl" mode="aspectFill" class="slideImg"></image>
									</a>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			
				<view class="recommend-list">
					<view class="list-title">热门歌单推荐</view>
					<ul  v-if="discList.length">
						<li @click.stop.prevent="selectItem(item)" v-for="(item, index) in discList" :key="index" class="item">
							<view class="icon">
								<image :src="item.imgurl" mode="widthFix" :lazy-load="true" class="item-img"></image>
							</view>
							<view class="text">
								<rich-text :nodes="item.creator.name" class="name"></rich-text>
								<rich-text :nodes="item.dissname" class="desc"></rich-text>
							</view>
						</li>
					</ul>
					<view class="loading-container" v-else>
						<loading title="加载中..." align="vertical" color="#ddd"></loading>
					</view>
				</view>
			</view>
				
			<!-- scroll自定义上拉加载， 注释掉可以使用默认(默认已做简单修改) -->
			<view slot="pullup">
				<view class="uni-tab-bar-loading"> 
					<uni-load-more :loadingType="loadingType" :contentText="loadingTextObj"></uni-load-more>
				</view>
			</view>
      </scroll>
	  
	</view>
</template>

<script>
	import Scroll from '@/components/scroll/scroll.vue'
	import uniLoadMore from '@/components/uni-load-more.vue'
	import Loading from '@/components/loading/loading.vue'
	import {getRecommend, getDiscList} from '@/pages/api/recommend'
	import {mapState,mapMutations} from 'vuex'
	
	export default {
		components: {
			uniLoadMore,
			Scroll,Loading
		},
		computed:{
			scrollbarObj: function () {
				return this.scrollbar ? {fade: this.scrollbarFade} : false
			},
			//scroll下拉刷新配置
			pullDownRefreshObj: function () {
				return this.pullDownOption.pullDownRefresh ? {
				  threshold: this.pullDownOption.pullDownRefreshThreshold,
				  stop: this.pullDownOption.pullDownRefreshStop
				} : false
			},
			//scroll上拉加载配置
			pullUpLoadObj: function () {
				return this.pullUpOption.pullUpLoad ? {
				  threshold: this.pullUpOption.pullUpLoadThreshold,
				  txt: {more: this.pullUpOption.pullUpLoadMoreTxt, noMore: this.pullUpOption.pullUpLoadNoMoreTxt}
				} : false
			},
		},
		data() {
			return {
				scrollbar: true,		//是否显示滚动条
				scrollbarFade: true,
				//scroll默认下拉刷新配置
				pullDownOption: {
					pullDownRefresh: true,
					pullDownRefreshThreshold: 50,
					pullDownRefreshStop: 50,
				},
				//scroll默认上拉加载配置
				pullUpOption:{
					pullUpLoad:true,		//ture开启默认上拉加载(需要禁用掉上面自定义的上拉加载插槽)
					pullUpLoadThreshold: -30,
					pullUpLoadMoreTxt: "上拉加载更多", 
					pullUpLoadNoMoreTxt: "没有更多数据了"
				},
				//自定义上拉加载组件配置
				loadingTextObj: {
					contentdown: "上拉显示更多",
					contentrefresh: "自定义正在加载 ···",
					contentnomore: "没有更多数据了"
				},
				swiper: {
					indicatorDots: true,
					autoplay: true,
					circular: true,
					interval: 2000,
					duration: 500
				},
				recommends: [],
				discList: [],
				pageNo:1,
				pageSize:20,	//每页查询20条
				loadingType:0,
				
			}
		},
		
		activated() {
			//console.log("刷新666")
			this.$refs.scroll.refresh()
		},
		methods: {
			onPullingDown() {
				this.pageNo = 1
				setTimeout(()=>{	//演示下拉效果, 延迟1s请求数据
					this._getDiscList()
				},1000)
			},
			onPullingUp(){
				this.pageNo++
				this.loadingType = 1		//如果用scroll自带的上拉加载则不需要loadingType控制属性,
				setTimeout(()=>{	//演示加载效果, 延迟1.5s请求数据
					this._getDiscList()
				},1500)
			},
			clickItem() {	
				//scroll内置的click, 如果不使用scroll默认slot可以忽略
			},
			selectItem(item){
				this.setDisc(item)
				uni.navigateTo({
					url: `/pages/recommend/reDetail`
				})
			},
			//轮播图
			_getRecommend() { 
				getRecommend().then(res => {
					//console.log(res)
					if (res.code === this.ERR_OK) {
						this.recommends = res.data.slider;
					}
				})
			},
			//推荐歌单列表
			_getDiscList() { 
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize
				}
				getDiscList(params).then(res => {
					if (res.code === this.ERR_OK) {
						let currLength = res.data.list.length
						if(currLength){// 如果有新数据
							if(this.pageNo == 1){	//下拉刷新
								this.discList = res.data.list;
							}else{	//加载更多
								this.discList = this.discList.concat(res.data.list);
							}
							this.loadingType = (currLength < this.pageSize)?2:0
						}else{// 如果没有新数据
							this.loadingType = 2
						}
						this.$refs.scroll.forceUpdate()
					}
				}) 
			},
			loadImage() {
				if (!this.checkloaded) {
					this.checkloaded = true
					this.$refs.scroll.refresh()
				}
			},
			...mapMutations({
				setDisc:'setDisc'
			})
		},
		created() {
			this._getRecommend();
			setTimeout(()=>{	//演示加载效果, 延迟1s请求数据
				this._getDiscList()
			},1000)
		},
		mounted() {
			
		},
		
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
	.page-recommend .scroll-list{
		background: inherit;
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
        padding: 10px 20px;
	}
	.recommend-list .item:first-child{
		padding-top:0;
	}
	.recommend-list .item:last-child{
		padding-bottom:0;
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
