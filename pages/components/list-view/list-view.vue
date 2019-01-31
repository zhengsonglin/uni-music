<template>
	<view class="listview">
		<scroll @scroll="scroll"
          :listen-scroll="listenScroll"
          :probe-type="probeType"
          :data="data"
          class="listview"
          ref="listview">
			<ul v-if="data.length">
			  <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
				<h2 class="list-group-title">{{group.title}}</h2>
				<uL>
				  <li @click="selectItem(item)" v-for="(item,sIndex) in group.items" :key="sIndex" class="list-group-item">
					<img class="avatar" v-lazy="item.avatar">
					<span class="name">{{item.name}}</span>
				  </li>
				</uL>
			  </li>
			</ul>
			<div class="loading-container" v-else>
			  <loading title="加载中..." align="vertical" color="#ddd"></loading>
			</div>
		</scroll>
		<!-- ABCD导航栏 -->
		<div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart($event)" @touchmove.stop.prevent="onShortcutTouchMove"
			 @touchend.stop>
		  <ul>
			<li v-for="(item, index) in shortcutList" :key="index" :data-index="index" class="item"
				:class="{'current':currentIndex===index}">{{item}}
			</li>
		  </ul>
		</div>
		<!-- 固定头部的标题 -->
		<div class="list-fixed" ref="fixed" v-show="fixedTitle">
		  <div class="fixed-title">{{fixedTitle}} </div>
		</div>
	</view>
</template>

<script>
	import Scroll from '@/components/scroll/scroll.vue'
	import Loading from '@/components/loading/loading.vue'
	import {getData,addClass,removeClass} from '@/common/js/dom'
	
	const EVENT_SELECT = 'select'
	const ACTIVE_CLS = 'index-list-item_active'
  
	const TITLE_HEIGHT = 30
	const ANCHOR_HEIGHT = 18

	export default {
		name: "listView",
		components: {
			Scroll, Loading
		},
		props: {
			title: {
				type: String,
				default: ''
			},
			data: {
				type: Array,
				default: function(){
					return []
				}
			}
		},
		data() {
			return {
				currentIndex: 0,
				scrollY: -1,
				diff: -1
			};
		},
		methods: {
			selectItem(item) {
				this.$emit(EVENT_SELECT, item)
			},
			onShortcutTouchStart(e) {
				let anchorIndex = getData(e.target, 'index')
				let firstTouch = e.touches[0]
				this.touch.y1 = firstTouch.pageY
				this.touch.anchorIndex = anchorIndex

				this._scrollTo(anchorIndex)
			},
			onShortcutTouchMove(e) {
				let firstTouch = e.touches[0]
				this.touch.y2 = firstTouch.pageY
				
				let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;		//跨度index值, 可能为负数
				let anchorIndex = parseInt(this.touch.anchorIndex) + delta;		//最终的index

				this._scrollTo(anchorIndex)
			},
			refresh() {
				this.$refs.listview.refresh()
			},
			scroll(pos) {
				this.scrollY = pos.y
			},
			_calculateHeight() {
				this.listHeight = []
				const list = this.$refs.listGroup
				let height = 0
				this.listHeight.push(height)
				for (let i = 0; i < list.length; i++) {
				  let item = list[i]
				  height += item.clientHeight
				  this.listHeight.push(height)
				}
			   
			},
			_scrollTo(index) {
				if (!index && index !== 0) {
				  return
				}
				if (index < 0) {
				  index = 0
				} else if (index > this.listHeight.length - 2) {
				  index = this.listHeight.length - 2
				}
				
				this.scrollY = -this.listHeight[index]
				this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
			}
			
		},
		created() {
			this.probeType = 3
			this.listenScroll = true
			this.listHeight = []
			this.touch = {}
		},
		mounted() {
			setTimeout(() => {
				this._calculateHeight()
			}, 20)
		},
		computed: {
			shortcutList() {
				return this.data.map((group) => {
				  return group.title.substr(0, 1)
				})
			},
			fixedTitle() {
				if (this.scrollY > 0) {
				  return ''
				}
				return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
			}
		},
		watch: {
			data() {
				setTimeout(() => {
				  this._calculateHeight()
				}, 20)
			},
			scrollY(newY) {
				const listHeight = this.listHeight
				// 当滚动到顶部，newY>0
				if (newY > 0) {
				  this.currentIndex = 0
				  return
				}
				// 在中间部分滚动
				for (let i = 0; i < listHeight.length - 1; i++) {
				  let height1 = listHeight[i]
				  let height2 = listHeight[i + 1]
				  if (-newY >= height1 && -newY < height2) {
					this.currentIndex = i
					this.diff = height2 + newY
					return
				  }
				}
				// 当滚动到底部，且-newY大于最后一个元素的上限
				this.currentIndex = listHeight.length - 2
			},
			diff(newVal) {
				let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
				if (this.fixedTop === fixedTop) {
				  return
				}
				this.fixedTop = fixedTop
				this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
			}
		}
	}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable"	
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      z-index: 10
      top: 0px
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

<style>
	.listView .index-list-content{
		background: #222;
	}
	.loading-container{
		margin-top:50px;
	}
</style>

