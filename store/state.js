import {playMode} from '@/common/js/config'
import {loadSearch, loadPlay, loadFavorite} from '@/common/js/cache'
const state = {
	hasLogin: false,
	loginProvider: "",
	openid: null,
	disc:"",	//推荐页
	singer:{},	//歌手页
	topList:[],	//排行页
	playing:false,	//是否正在播放
	fullScreen:false,	//是否全屏播放(非后台播放)
	playList:[],	//播放列表
	sequenceList:[],	//队列播放列表， 无指定顺序的列表时， 遇上面一致
	mode:playMode.sequence,	//播放模式
	currentIndex: -1,		//当前播放歌曲的索引
	searchHistory:loadSearch(),	//从localstorage中读取数据
	playHistory:loadPlay(),		//从localstorage中读取数据
	favoriteList:loadFavorite()  //从localstorage中读取数据
}

export default state