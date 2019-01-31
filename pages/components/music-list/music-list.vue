<template>
	<div class="music-list">
	    <div class="back" @click="back">
	      	<i class="icon-back"></i>
	    </div>
	    <h1 class="title" v-html="title"></h1>
	    <div class="bg-image" :style="bgStyle" ref="bgImage">
	    	<div class="play-wrapper">
	    		<div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
	    			<i class="icon-play"></i>
	    			<span class="text">随机播放全部</span>
	    		</div>
	    	</div>
	      	<div class="filter" ref="filter"></div>	<!--给图片加一个透明度遮罩-->
	    </div>
	   	<div class="bg-layer" ref="layer"></div>
	    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
	    	<div class="song-list-wrapper">
	    		<song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
	    	</div>
	    	<div class="loading-container" v-show="!songs.length">
	    		<!-- <loading></loading> -->
	    	</div>
	    </scroll>
	</div>
</template>

<script>
	import Scroll from '@/components/scroll/scroll.vue'
	import SongList from '../song-list/song-list'
	import {prefixStyle} from '@/common/js/dom.js'
	
	import {mapActions} from 'vuex'
	import {playlistMixin} from '@/common/js/mixin'
	import Loading from '@/components/loading/loading.vue'
	
	const RESERVED_HRIGHT = 40;	//头部高度
	const transform = prefixStyle('transform')
	const backdrop = prefixStyle('backdrop-filter')
	
	export default{
		mixins:[playlistMixin],
		props:{
			bgImage:{
				type:String,
				default:''
			},
			songs:{
				type:Array,
				default:function(){
					return []
				}
			},
			title:{
				type:String,
				default:''
			},
			rank: {
		        type: Boolean,
		        default: false
		    }
		},
		data(){
			return {
				scrollY:0
			}
		},
		computed:{
			bgStyle(){
				return `background-image:url(${this.bgImage})`
			}
		},
		components:{
			Scroll,
			SongList,
			Loading
		},
		methods:{
			handlePlaylist(playlist){
				const bottom = playlist.length>0?'60px':''
				this.$refs.list.$el.style.bottom = bottom
				this.$refs.list.refresh()
			},
			back() {
		        this.$router.back()
		    },
		    scroll(pos){
		    	this.scrollY = pos.y
		    },
		    selectItem(item, index){
		    	this.selectPlay({
		    		list:this.songs,
		    		index:index
		    	})
		    },
		    random(){
		    	this.randomPlay({
		    		list:this.songs
		    	})
		    },
		    ...mapActions([
		    	'selectPlay',
		    	'randomPlay'
		    ])
		},
		watch:{
			scrollY(newY){	//newY, 当newY为0时，向上移为负值， 向下移为正值
				let translateY = Math.max(this.maxTranslateY, newY)
				let zIndex = 0
				let scale = 1	//设置图片的缩放比例
				let blur = 0 
				
				this.$refs.layer.style[transform] = `translateY(${translateY}px)`	//这里的transform为变量， 代表浏览器支持的供应商
				
				if(newY < this.maxTranslateY){	//向上滚动到最大值之后
					zIndex = 10
					this.$refs.bgImage.style.paddingTop = 0
					this.$refs.bgImage.style.height = `${RESERVED_HRIGHT}px`
					this.$refs.playBtn.style.display = 'none'
				}else{
					this.$refs.bgImage.style.paddingTop = '70%'
					this.$refs.bgImage.style.height = '0px'
					this.$refs.playBtn.style.display = ''
				}
				
				const precent = Math.abs(newY / this.imageHeight)
				if(newY>0){
					scale = 1 + precent
					zIndex = 10
				}else{
					blur = Math.min(20*precent, 20)
				}
				this.$refs.filter.style[backdrop] = `blur(${blur}px)`		//ios设置高斯模糊， 安卓无效， backdrop为变量
				this.$refs.bgImage.style[transform] = `scale(${scale})`		//transform同上，为变量
				
				this.$refs.bgImage.style.zIndex = zIndex
			}
			
		},
		created(){
			this.probeType = 3
			this.listenScroll = true
		},
		mounted(){
			console.log(this.songs);
			this.imageHeight = this.$refs.bgImage.clientHeight		//图片的高度
			this.maxTranslateY = -this.imageHeight + RESERVED_HRIGHT		//向上移动的最大高度， 不能完全移到顶部
			this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable"	
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0     
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      overflow: visible;
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>