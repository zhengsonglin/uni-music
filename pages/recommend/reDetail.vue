<template>
	<!--推荐——详情页-->
	<transition name="slide">
		<music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
	</transition>
</template>

<script>
	import MusicList from '../components/music-list/music-list'
	import {getSongList} from '../api/recommend'
	import {mapGetters,mapMutations} from 'vuex'
	
	
	export default {
		components: {
			MusicList
		},
		computed: {
			title(){
				return this.disc.dissname
			},
			bgImage(){
				return this.disc.imgurl
			},
			...mapGetters([
				'disc'
			]),
		},
		data() {
			return {
				
			}
		},
		methods: {
			_getSongList(){
				if(!this.disc.dissid){
					uni.reLaunch({
						url: '/pages/home/home'
					});
					return
				}
				getSongList(this.disc.dissid).then((res)=>{		//获取歌曲列表
					let result = JSON.parse(res.substring(13, res.length-1))
					if(result.code === this.ERR_OK){
						//this.songs = this._normalizeSongs(result.cdlist[0].songlist)
					}
				})
			},
			_normalizeSongs(list){
				let ret = []
				list.forEach((musicData)=>{
					if(musicData.songid && musicData.albumid){
						ret.push(createSong(musicData))
					}
				})
				return ret
			}
		},
		created() {
			console.log(this.disc)
			this._getSongList();
		},
		onLoad(params) {
			console.log(params)
		}
	}
</script>

<style>
</style>
