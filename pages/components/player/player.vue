<template>
	<div class="player" v-show="playList.length>0">
		<transition name="normal"
			@enter="enter"
			@after-enter="afterEnter"
			@leave="leave"
			@after-leave="afterLeave">
			<div class="normal-player" v-show="fullScreen">
				<div class="background">
		          	<img width="100%" height="100%" :src="currentSong.image">
		        </div>
		        
		        <div class="top">
			        <div class="back" @click="back">
			            <i class="icon-back"></i>
			         </div>
			        <h1 class="title" v-html="currentSong.name"></h1>
			        <h2 class="subtitle" v-html="currentSong.singer"></h2>
		        </div>
		        
		        <div class="middle"
		             @touchstart.prevent="middleTouchStart"
		             @touchmove.prevent="middleTouchMove"
		             @touchend="middleTouchEnd"
		             >
		             
		          <div class="middle-l" ref="middleL">
		            <div class="cd-wrapper" ref="cdWrapper">
		              <div class="cd" :class="cdCls">
		                <img class="image" :src="currentSong.image">
		              </div>
		            </div>
		            <div class="playing-lyric-wrapper">
		              <div class="playing-lyric">{{playingLyric}}</div>
		            </div>
		          </div>
		          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
		            <div class="lyric-wrapper">
		              <div v-if="currentLyric">
		                <p ref="lyricLine"
		                   class="text"
		                   :class="{'current': currentLineNum ===index}"
		                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
		              </div>
		            </div>
		          </scroll>
		        </div>
		        
		        <div class="bottom">
		          	<div class="dot-wrapper">
		            	<span class="dot" :class="{'active':currentShow==='cd'}"></span>
		            	<span class="dot" :class="{'active':currentShow==='lyric'}"></span>
		          	</div>
		          	<div class="progress-wrapper">
		            	<span class="time time-l">{{format(currentTime)}}</span>
		            	<div class="progress-bar-wrapper">
		              		<progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
		            	</div>
		            	<span class="time time-r">{{format(currentSong.duration)}}</span>
		          	</div>
		          	<div class="operators">
		          		<!--
		            	<div class="icon i-left" @click="changeMode"> 
		              		<i :class="iconMode"></i>
		            	</div>
		            	<div class="icon i-left" :class="disableCls" @click="prev">
		              		<i  class="icon-prev"></i>
		            	</div>
		            	<div class="icon i-center" :class="disableCls" @click="togglePlaying">
		              		<i  :class="playIcon"></i>
		            	</div>
		            	<div class="icon i-right" :class="disableCls" @click="next">
		              		<i  class="icon-next"></i>
		            	</div>
		            	<div class="icon i-right">
		              		<i @click="toggleFavorite(currentSong)" class="icon" :class="getFavoriteIcon(currentSong)"></i>
		            	</div>
		            	-->
		            	<div class="icon i-left" @click="changeMode">
		            		<i :class="iconMode"></i>
		            	</div> 
		            	<div class="icon i-left" :class="disableCls" >
		            		<i class="icon-prev" @click="prev"></i>
		            	</div> 
		            	<div class="icon i-center" :class="disableCls">
		            		<i :class="playIcon" @click="togglePlaying"></i>
		            	</div> 
		            	<div class="icon i-right" :class="disableCls">
		            		<i class="icon-next" @click="next"></i>
		            	</div> 
		            	<div class="icon i-right">
		            		<i @click="toggleFavorite(currentSong)" class="icon" :class="getFavoriteIcon(currentSong)"></i>
		            	</div> 
		          	</div>
		        </div>
			</div>
		</transition>
		
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="open">
				<div class="icon">
		          	<img :class="cdCls" width="40" height="40" :src="currentSong.image">
		        </div>
		        <div class="text">
		          	<h2 class="name" v-html="currentSong.name"></h2>
		          	<p class="desc" v-html="currentSong.singer"></p>
		        </div>
		        <div class="control">
		        	<progress-circle :radius="radius" :percent="percent">
		            	<i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
		          	</progress-circle>
		        </div>
		        <div class="control" @click.stop="showPlaylist">
		          	<i class="icon-playlist"></i>
		        </div>
			</div>
		</transition>
		<play-list ref="playlist"></play-list>
		<audio :src="currentSong.url" ref="audio" @play="ready" @error="error" 
		         @ended="end"></audio>
	</div>
</template>

<script>
	import {mapGetters, mapMutations, mapActions} from 'vuex'
	import SongList from '../song-list/song-list'
	import animations from 'create-keyframe-animation'
	import {prefixStyle} from '@/common/js/dom'
	import ProgressBar from '../progress-bar/progress-bar'
	import ProgressCircle from '../progress-circle/progress-circle'
	import {playMode} from '@/common/js/config'
	import {shuffle} from '@/common/js/util'
	import LyricParser  from 'lyric-parser'  
	import playList from '../playlist/playlist'  
	import {playerMixin} from '@/common/js/mixin'


	const transform = prefixStyle('transform')
	const transitionDuration = prefixStyle('transitionDuration')
	
	export default {
		mixins:[playerMixin],
		data() {
	      return {
	        songReady: false,
	        currentTime: 0,
	        radius: 32,
	        currentLyric: null,
	        currentLineNum: 0,
	        currentShow: 'cd',
	        playingLyric: '',
	      }
	    },
	    components:{
			Scroll,
			ProgressBar,
			ProgressCircle,
			playList,
		},
		computed:{
			cdCls() {
		        return this.playing ? 'play' : 'play pause'
		    },
		    playIcon() {
		        return this.playing ? 'icon-pause' : 'icon-play'
		    },
		    /*iconMode(){
		    	return this.mode == playMode.sequence?'icon-sequence':this.mode == playMode.loop?'icon-loop':'icon-random'
		    },*/
		    miniIcon() {
		        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
		    },
		    disableCls() {	//如果播放歌曲为准备好(网络不好等)三个基本操作按钮置灰禁止操作
		        return this.songReady ? '' : 'disable'
		    },
		    percent() {		//歌曲播放比例
		        return this.currentTime / this.currentSong.duration
		    },
			...mapGetters([
				'fullScreen',
				'playing',
				'currentIndex',
			])
		},
		methods:{
			back(){
				this.setFullScreen(false)
			},
			open(){
				this.setFullScreen(true)
			},
			enter(el, done){
				const {x, y, scale} = this._getPosAndScale()
				
				let animation = {
					0:{
						transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
					},
					60:{
						transform: `translate3d(0, 0, 0) scale(1.1)`
					},
					100:{
						transform: `translate3d(0, 0, 0) scale(1)`
					}
				}
				
				animations.registerAnimation({
					name:'move',
					animation,
					presets:{
						duration:400,
						easing:'linear'
					}
				})
				
				animations.runAnimation(this.$refs.cdWrapper, 'move', done)
			},
			afterEnter(){
				animations.unregisterAnimation('move')
				this.$refs.cdWrapper.style.animation = ''
			},
			leave(el, done){
				this.$refs.cdWrapper.style.transition = 'all 0.4s'
				const {x, y, scale} = this._getPosAndScale()
				this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
				this.$refs.cdWrapper.addEventListener('transitionend', done)
			},
			afterLeave(){
				this.$refs.cdWrapper.style.animation = ''
				this.$refs.cdWrapper.style[transform] =''
			},
			togglePlaying(){
				if(!this.songReady){
					return
				}
				this.setPlayingState(!this.playing);
				if(this.currentLyric){
					this.currentLyric.togglePlay()
				}
			},
			end(){	//当前歌曲播放结束
				if(this.mode === playMode.loop){
					this.loop()
				}else{//顺序播放或随机播放
					this.next()
				}
			},
			loop(){
				this.$refs.audi.currentTime = 0 //把歌曲的播放时间设置为0
				if(this.currentLyric){
					this.currentLyric.seek(0)	//歌词重置到开始位置
				}
			},
			prev(){
				if(!this.songReady){
					return
				}
				if(this.playList.length === 1){
					this.loop()
					return
				}else{
					let index = this.currentIndex - 1
					if(index === -1){
						index = this.playList.length - 1
					}
					this.setCurrentIndex(index)
					if(!this.playing){
						this.togglePlaying()
					}
				}	
				this.songReady = false
			},
			next(){
				if(!this.songReady){
					return
				}
				if(this.playList.length === 1){
					this.loop()
					return
				}else{
					let index = this.currentIndex + 1
					if(index === this.playList.length){
						index = 0
					}
					this.setCurrentIndex(index)
					if(!this.playing){
						this.togglePlaying()
					}
				}	
				this.songReady = false
			},
			ready(){	//播放audio对应的歌曲已经加载好了
				this.songReady = true
				this.savePlayHistory(this.currentSong)
			},
			error(){	//播放audio对应的歌曲加载失败（网络延迟，url地址改变）
				this.songReady = true
			},
			updateTime(e){	//修改歌曲播放时间
				this.currentTime = e.target.currentTime
			},
			format(interval){
				interval = interval | 0
				const minute = this._pad(interval/60 | 0)
				const second = this._pad(minute%60)
				return `${minute}:${second}`
			},
			onProgressBarChange(percent) {
		        const currentTime = this.currentSong.duration * percent
		        this.$refs.audio.currentTime = currentTime
		        if (!this.playing) {
		          this.togglePlaying()
		        }
		        if (this.currentLyric) {
		           this.currentLyric.seek(currentTime * 1000)
		        }
		    },
		    getLyric(){
		    	this.currentSong.getLyric().then((lyric)=>{
		    		if (this.currentSong.lyric !== lyric) {
			            return
			        }
		    		
		    		this.currentLyric = new LyricParser(lyric, this.handleLyyric)
		    		if(this.playing){
		    			this.currentLyric.play()
		    		}
		    	}).catch(()=>{
		    		this.currentLyric = null
		    		this.playingLyric = ''
		    		this.currentLineNum = 0
		    	})
		    },
		    handleLyyric({lineNum, txt}){
		    	this.currentLineNum = lineNum
		    	if (lineNum > 5) {
		          let lineEl = this.$refs.lyricLine[lineNum - 5]
		          this.$refs.lyricList.scrollToElement(lineEl, 1000)
		        } else {
		          this.$refs.lyricList.scrollTo(0, 0, 1000)
		        }
        		this.playingLyric = txt
		    },
		    showPlaylist() {
		        this.$refs.playlist.show()
		    },
		    middleTouchStart(e){
		    	this.touch.initiated = true
		    	const touch = e.touches[0]
		    	this.touch.startX = touch.pageX
		    	this.touch.startY = touch.pageY
		    },
		    middleTouchMove(e){
		    	if(!this.touch.initiated){
		    		return
		    	}
		    	const touch = e.touches[0]
		    	const deltaX = touch.pageX - this.touch.startX
		    	const deltaY = touch.pageY - this.touch.startY
		    	if(Math.abs(deltaY) > Math.abs(deltaX)){
		    		return
		    	}
		    	
		    	const left = this.currentShow === 'cd'?0:-window.innerWidth
		    	const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
		    	this.touch.persent = Math.abs(offsetWidth/window.innerWidth)
		    	this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
		    	
		    	this.$refs.lyricList.$el.style[transitionDuration] = 0
		    	this.$refs.middleL.style.opacity = 1 - this.touch.persent
		    	this.$refs.middleL.style[transitionDuration] = 0
		    },
		    middleTouchEnd(){
		    	let offsetWidth
		    	let opacity
		    	if(this.currentShow === 'cd'){ //从右向左滑动
		    		if(this.touch.persent > 0.1){
		    			offsetWidth = -window.innerWidth
		    			opacity = 0
		    			this.currentShow = 'lyric'
		    		}else{
		    			offsetWidth = 0
		    			opacity = 1
		    		}
		    	}else{	//从左向右滑动
		    		if(this.touch.persent < 0.9){
		    			offsetWidth = 0
		    			opacity = 1
		    			this.currentShow = 'cd'
		    		}else{
		    			opacity = 0
		    			offsetWidth = -window.innerWidth
		    		}
		    	}
		    	const time = 300
		    	this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
		    	this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
		    	
		    	this.$refs.middleL.style.opacity = opacity
		    	this.$refs.middleL.style[transitionDuration] = `${time}ms`
		    },
		   /* changeMode(){
		    	const mode = (this.mode+1)%3
		    	this.setPlayMode(mode);
		    	let list = null
		    	if(mode === playMode.random){
		    		list = shuffle(list)
		    	}else{
		    		list = this.sequenceList
		    	}
		    	this.setPlayList(list)
		    	this.resetCurrentIndex(list)
		    },
		    resetCurrentIndex(list){	//当播放模式改变时，playList被改变，导致播放的当前歌曲被改变
		    	let index = list.findIndex((item)=>{
		    		return item.id === this.currentSong.id
		    	})
		    	this.setCurrentIndex(index)
		    },*/
			_pad(num, n=2){	//数字补0，默认补2个0
				let len = num.toString().length
				while(len < n){
					num = '0' + num
					len ++
				}
				return num
			},
			_getPosAndScale(){
				const targetWidth = 40		//播放器左下角小图片
				const paddingLeft = 40		//小图片中心点距离左边
				const paddingBottom = 30 	//小图片中心点距离下边
				const paddingTop = 80		//大图片最上边距离屏幕顶部距离
				const width = window.innerWidth * 0.8 	//大图片的宽度，屏幕宽度的80%
				const scale = targetWidth/width		//缩放比例
				const x = -(window.innerWidth/2 - paddingLeft)		//x坐标偏移量
				const y = window.innerHeight - paddingTop - width/2 - paddingBottom		//y坐标偏移量
				return {
					x,
					y,
					scale
				}
			},
			...mapMutations({
				setFullScreen: 'SET_FULL_SCREEN',
				/*setPlayingState: 'SET_PLAYING_STATE',
				setCurrentIndex: 'SET_CURRENT_INDEX',
				setPlayMode: 'SET_PLAY_MODE',
				setPlayList:'SET_PLAYLIST'*/
			}),
			...mapActions([
				'savePlayHistory'
			])
		},
		watch:{
			currentSong(newSong, oldSong){
				if(newSong.id === oldSong.id){	//切换播放模式后，当前歌曲的索引改变但歌曲并没有改变，不用重新播放歌曲
					return
				}
				if(this.currentLyric){		//切换歌曲，清除上一首歌曲的歌词
					this.currentLyric.stop()
				}
				if (this.currentLyric) {
		          this.currentLyric.stop()
		          this.currentTime = 0
		          this.playingLyric = ''
		          this.currentLineNum = 0
		        }
		        clearTimeout(this.timer)
		        this.timer = setTimeout(() => {
		          this.$refs.audio.play()
		          this.getLyric()
		        }, 1000)
				
			},
			playing(newPlaying) {
		        const audio = this.$refs.audio
		        this.$nextTick(() => {
		          newPlaying ? audio.play() : audio.pause()
		        })
		    },
			fullScreen(newVal) {
		        if (newVal) {
		          setTimeout(() => {
		            this.$refs.lyricList.refresh()
		          }, 20)
		        }
		    }
		},
		created(){
			this.touch = {}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable"
  @import "../../../common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>