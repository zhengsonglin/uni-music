<template>
	<transition name="slide">
		<music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
	</transition>
</template>

<script type="text/javascript">
	import {mapGetters} from 'vuex'
	import {getSingerDetail, getSongAudioSrc} from '../api/singer'
	import MusicList from '../components/music-list/music-list'
	import {createSong} from '@/common/js/song'
	
	export default{
		data(){
			return {
				songs: []
			}
		},
		computed:{
			title(){
				return this.singer.name
			},
			bgImage(){
				return this.singer.avatar
			},
			...mapGetters([
				'singer'
			]),
		},
		methods:{
			_getDetail(){
				/* if(!this.singer.id){
					this.$router.push('/singer')
					return 
				} */
				
				getSingerDetail(this.singer.id).then((res)=>{
					if(res.code === this.ERR_OK){
					//	console.log(res.data.list)
						this.songs = this._normalizeSongs(res.data.list)
					}
				})
				
			},
			_normalizeSongs(list){
				let ret = []
				let songmids = [] 
		        list.forEach((item) => {
		          let {musicData} = item
		          
		          if (musicData.songid && musicData.albummid) {
		          	songmids.push(musicData.songmid)
		            ret.push(createSong(musicData))
		          }
		        })
		        /*getSongAudioSrc(songmids).then((res)=>{
		        	console.log(res)
		        })
		        //console.log(songmids)*/
		        return ret
			}
		},
		components:{
      		MusicList
		},
		created(){
			this._getDetail();
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>