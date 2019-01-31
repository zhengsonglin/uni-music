<template>
	<view class="search">
		<div class="search-box-wrapper" @touchmove.stop>
			<search-box ref="searchBox" @query="onQueryChange"></search-box>
		</div>
		<div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
			<scroll ref="shortcut" class="shortcut" :data="shortcut">
				<div>
					<div class="hot-key">
						<h1 class="title">热门搜索</h1>
						<ul>
							<li class="item" v-for="(item, index) in hotKey" :key="index" @click="addQuery(item.k)">
								<span>{{item.k}}</span>
							</li>
						</ul>
					</div>
					<div class="search-history" v-show="searchHistory.length">
						<h1 class="title">
							<span class="text">搜索历史</span>
							<span class="clear" @click="showConfirm">
								<!-- -->
								<i class="icon-clear"></i>
							</span>
						</h1>
						<search-list @select="addQuery" :searches="searchHistory" @delete="deleteSearchHistory"></search-list>
					</div>
				</div>
			</scroll>
		</div>
		<div class="search-result" v-show="query" ref="searchResult">
			<suggest ref="suggest" @select="saveSearch" @listScroll="blurInput" :query="query"></suggest>
		</div>
		<confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
	</view>
</template>

<script>
	import Scroll from '@/components/scroll/scroll.vue'
	import SearchBox from '../search-box/search-box'
	import SearchList from '../search-list/search-list'
	import Suggest from '../suggest/suggest'
  	import Confirm from '../confirm/confirm'
  	import {getHotKey} from '../../api/search'
  	import {mapActions, mapGetters} from 'vuex'
  	import {playlistMixin, searchMixin} from '@/common/js/mixin'
	
	export default {
		mixins:[playlistMixin, searchMixin],
	 	data(){
			return {
			 	hotKey: [],
			 	query:''
			}
		},
		computed: {
		    shortcut() {
		        return this.hotKey.concat(this.searchHistory)
		    },
		    /*...mapGetters([
		    	'searchHistory'
		    ])*/
	    },
	  	components: {
		    SearchBox,
		    SearchList,
		    Suggest,
	      	Scroll,
	      	Confirm,
	  	},
		methods:{
			handlePlaylist(playlist){
				const bottom = playlist.length>0?'60px':''
				this.$refs.shortcutWrapper.style.bottom = bottom
				this.$refs.shortcut.refresh()
				this.$refs.searchResult.style.bottom = bottom
				this.$refs.suggest.refresh()
			},
			
			/*
		  	addQuery(key){
		  		this.$refs.searchBox.setQuery(key)
		  	},
		  	onQueryChange(query){	//设置query
		  		this.query = query
		  	},
		  	blurInput(){		//搜索框失去焦点
		  		this.$refs.searchBox.blur()
		  	},
		  	saveSearch(){	//保存搜索条件到本地缓存中
		  		this.saveSearchHistory(this.query)
		  	},*/
		  	showConfirm() {
		        this.$refs.confirm.show()
		    },
	      	_getHotKey() {
		        getHotKey().then((res) => {
		          	if (res.code === this.ERR_OK) {
		            	this.hotKey = res.data.hotkey.slice(0, 10)
		          	}
		        })
	      	},
	      	...mapActions([
	      	//	'saveSearchHistory',
	      	//	'deleteSearchHistory',
	      		'clearSearchHistory'
	      	])
		},
		created() {
	      	this._getHotKey()
			
	    },
	    watch:{
	    	query(newQuery){
	    		setTimeout(()=>{
	    			this.$refs.shortcut.refresh()
	    		},20)
	    	}
	    }
  	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable"
  @import "../../../common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 80px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        background: inherit
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 80px
      bottom: 0
      background: inherit
</style>
