import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from './config'
import {shuffle} from './util'

export const playlistMixin = {
	computed:{
		...mapGetters([
			'playList'
		])
	},
	mounted(){
		this.handlePlaylist(this.playList)
	},
	activated(){
		this.handlePlaylist(this.playList)
	},
	watch:{
		playList(newVal){
			this.handlePlaylist(newVal)
		},
	},
	methods:{
		handlePlaylist(){
			throw new Error('component must implement handlePlaylist method')
		}
	}
}


export const playerMixin = {
	computed:{
		iconMode(){
			return this.mode === playMode.sequence?'icon-sequence':this.mode === playMode.loop?'icon-loop':'icon-random'
		},
		...mapGetters([
			'playList',
			'currentSong',
			'mode',
			'sequenceList',
			'favoriteList'
		])
	},
	methods:{
		changeMode(){
	    	const mode = (this.mode+1)%3
	    	this.setPlayMode(mode);
	    	let list = null
	    	if(mode === playMode.random){
	    		list = shuffle(this.sequenceList)
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
	    },
	    getFavoriteIcon(song){
	    	if(this.isFavorate(song)){
	    		return 'icon-favorite'
	    	}
	    	return 'icon-not-favorite'
	    },
	    toggleFavorite(song){
	    	if(this.isFavorate(song)){
	    		this.deleteFavoriteList(song)
	    	}else{
	    		this.saveFavoriteList(song)
	    	}
	    },
	    isFavorate(song){
	    	const index = this.favoriteList.findIndex((item)=>{
	    		return item.id === song.id
	    	})
	    	return index>-1
	    },
	    ...mapMutations({
			setPlayingState: 'SET_PLAYING_STATE',
			setCurrentIndex: 'SET_CURRENT_INDEX',
			setPlayMode: 'SET_PLAY_MODE',
			setPlayList:'SET_PLAYLIST'
		}),
		...mapActions([
      		'saveFavoriteList',
      		'deleteFavoriteList',
      	])
	}
}


export const searchMixin = {
	data(){
		return {
			query:'',
			refreshDelay:100
		}
	},
	computed:{
		...mapGetters([
	    	'searchHistory'
	    ])
	},
	methods:{
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
	  	},
	  	...mapActions([
      		'saveSearchHistory',
      		'deleteSearchHistory',
      	])
	}
}
