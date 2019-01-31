<template>
  <scroll ref="suggest" class="suggest"
          :data="result"
					:scrollbar="scrollbarObj"
          :pullUpLoad="pullUpLoadObj"
          :beforeScroll="beforeScroll"
					@pullingUp="onPullingUp"
          @beforeScroll="listScroll"
  >
		<view>
			<ul class="suggest-list">
				<li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
					<div class="icon">
						<i :class="getIconCls(item)"></i>
					</div>
					<div class="name">
						<p class="text" v-html="getDisplayName(item)"></p>
					</div>
				</li>
				<loading v-show="hasMore && !result.length" title="加载中..." align="vertical" color="#ddd"></loading>
			</ul>
			<!-- 			-->
			<div v-show="!hasMore && !result.length" class="no-result-wrapper">
				<no-result title="抱歉，暂无搜索结果"></no-result> 
			</div>

		</view>
  </scroll>
</template>

<script>
  import Scroll from '@/components/scroll/scroll.vue'
  import Loading from '@/components/loading/loading.vue'
  import NoResult from '../no-result/no-result'
  import {search} from '@/pages/api/search'
  import {createSong} from '@/common/js/song'
  import {mapMutations, mapActions} from 'vuex'
  import Singer from '@/common/js/singer'

  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
		computed:{
			scrollbarObj: function () {
				return this.scrollbar ? {fade: this.scrollbarFade} : false
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
        page: 1,
        beforeScroll: true,
        result: [],
				//scroll默认上拉加载配置
				pullUpOption:{
					pullUpLoad:true,		//ture开启默认上拉加载(需要禁用掉上面自定义的上拉加载插槽)
					pullUpLoadThreshold: -30,
					pullUpLoadMoreTxt: "上拉加载更多", 
					pullUpLoadNoMoreTxt: "没有更多数据了"
				},
				hasMore:true,
      }
    },
    methods: {
      refresh() {
        this.$refs.suggest.refresh()
      },
      search() {
					this.result = []
					this.hasMore = true
	        this.page = 1
	        this.$refs.suggest.scrollTo(0, 0)
	        search(this.query, this.page, this.showSinger, perpage).then((res) => {
						console.log(res);
		          if (res.code === this.ERR_OK) {
									setTimeout(()=>{
										this.result = this._genResult(res.data)
										this._checkMore(res.data)
										this.$refs.suggest.forceUpdate()
									},1000)
		          }
	        })
      },
      onPullingUp() {
					if (!this.hasMore) {
	          	return
	        }
	        this.page++
	        search(this.query, this.page, this.showSinger, perpage).then((res) => {
		          if (res.code === this.ERR_OK) {
								setTimeout(()=>{
		            	this.result = this.result.concat(this._genResult(res.data))
									this._checkMore(res.data)
									this.$refs.suggest.forceUpdate()
								},1000)	
		          }
	        })
      },
      listScroll() {
        	this.$emit('listScroll')
      },
      selectItem(item) {
	        if (item.type === TYPE_SINGER) {
		          const singer = new Singer({
		            	id: item.singermid,
		            	name: item.singername
		          })
		         /* this.$router.push({
		            	path: `/search/${singer.id}`
		          }) */
	          	this.setSinger(singer)
	        } else {
	          	this.insertSong(item)
	        }
	        this.$emit('select', item)
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          	return item.singername
        } else {
          	return `${item.name}-${item.singer}`
        }
      },
      getIconCls(item) {
	        if (item.type === TYPE_SINGER) {
	          	return 'icon-mine'
	        } else {
	          	return 'icon-music'
	        }
      },
      _genResult(data) {
	        let ret = []
	        if (data.zhida && data.zhida.singerid) {
	          	ret.push({...data.zhida, ...{type: TYPE_SINGER}})
	        }
	        if (data.song) {
	          	ret = ret.concat(this._normalizeSongs(data.song.list))
	        }
	        return ret
      },
      _normalizeSongs(list) {
	        let ret = []
	        list.forEach((musicData) => {
		          if (musicData.songid && musicData.albummid) {
		            	ret.push(createSong(musicData))
		          }
	        })
	        return ret
      },
      _checkMore(data) {
	        const song = data.song
	        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
	          	this.hasMore = false
	        }
      },
      ...mapMutations({
        	setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        	'insertSong'
      ])
    },
    watch: {
	      query(newQuery) {
	        	this.search(newQuery)
	      }
    },
    components: {
      	Scroll,
      	Loading,
      	NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable"
  @import "../../../common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    background: inherit
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>