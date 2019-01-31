<template>
	<view class="page-tab">
		<view class="uni-tab-bar">
			<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view v-for="(tab,index) in tabBars" :key="tab.id" :class="['swiper-tab-list',tabIndex==index ? 'active' : '']" :id="tab.id"
				 :data-current="index" :data-active="tabIndex" @click="tapTab(index)">{{tab.name}}</view>
			</scroll-view>
			<swiper :current="tabIndex" class="swiper-box" duration="300" @change="changeTab">
				<swiper-item>
					<keep-alive><recommend v-if="tabIndex==0" :data-active="tabIndex" /></keep-alive>
				</swiper-item>
				<swiper-item :data-active="tabIndex">
					<keep-alive><singer v-if="tabIndex==1" :data-active="tabIndex"/></keep-alive>
				</swiper-item>
				<swiper-item :data-active="tabIndex">
					<keep-alive><rank v-if="tabIndex==2" :data-active="tabIndex"/></keep-alive>
				</swiper-item>
				<swiper-item :data-active="tabIndex">
					<keep-alive><search v-if="tabIndex==3" :data-active="tabIndex"/></keep-alive>
				</swiper-item>
			</swiper>
		</view>
		
	</view>
</template>

<script>
	
	import Recommend from '@/pages/components/recommend/recommend'
	import Singer from '@/pages/components/singer/singer'
	import Rank from '@/pages/components/rank/rank'
	import Search from '@/pages/components/search/search'
	//import templateArr from '@/pages/components/template.js'
	export default {
		components: {
			Recommend, Singer, Rank, Search
		},
		computed:{
		
		},
		data() {
			return {
				tabBars: [
					{
						name: '推荐',
						id: 'recommend'
					}, {
						name: '歌手',
						id: 'singer'
					}, {
						name: '排行',
						id: 'rank'
					}, {
						name: '搜索',
						id: 'search'
					},
				],
				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				newsitems: []
				
			}
		},
		onLoad: function() {
			
		},
		created() {
			
			//console.log(this.newsitems)
		},
		methods: {
			goDetail(e) {
				uni.navigateTo({
					url: '/pages/template/tabbar/detail/detail?data=' + e.title
				})
			},
			close(index1, index2) {
				uni.showModal({
					content: '是否删除本条信息？',
					success: (res) => {
						if (res.confirm) {
							this.newsitems[index1].data.splice(index2, 1);
						}
					}
				})
			},
			async changeTab(e) {
				let index = e.detail.current;
				if (this.isClickChange) {
					this.tabIndex = index;
					this.isClickChange = false;
					return;
				}
				let tabBar = await this.getElSize("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;
	
				for (let i = 0; i < index; i++) {
					let result = await this.getElSize(this.tabBars[i].id);
					width += result.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getElSize(this.tabBars[index].id),
					nowWidth = nowElement.width;
				if (width + nowWidth - tabBarScrollLeft > winWidth) {
					this.scrollLeft = width + nowWidth - winWidth;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
				this.isClickChange = false;
				this.tabIndex = index; //一旦访问data就会出问题
			},
			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select('#' + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},
			async tapTab(index) { //点击tab-bar
				if (this.tabIndex === index) {
					return false;
				} else {
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.tabIndex = index;
				}
			},
			
		}
	}
</script>

<style>

	
	.page-tab{
		height: calc(100% - 44px);
	}
	.uni-swiper-tab{
		border:none;
	}
	.uni-swiper-tab>>>div{
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
	}
	.uni-swiper-tab .swiper-tab-list{
		width: auto;
		color: rgba(255,255,255,0.5);
		flex: 1;
	}
	.uni-tab-bar .active{
		color:#ffcd32;
	}
	.uni-tab-bar>>>.list-cell .media-list{
		border:none;
	}
	.uni-tab-bar>>>.uni-list-cell-hover{
		background-color: inherit !important;
	}
	.page-tab .swiper-box .list{
		overflow:hidden;height:100%;
	}
	.page-tab .swiper-box>>>uni-swiper-item{
		background: inherit;
	}
</style>
