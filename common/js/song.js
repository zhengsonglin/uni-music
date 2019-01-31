import {getLyric} from '@/pages/api/song'
import {Base64} from 'js-base64'

export default class Song{
	constructor({id, mid, singer, name, album, duration, image, url}){
		this.id = id
		this.mid = mid
		this.singer = singer
		this.name = name
		this.album = album
		this.duration = duration
		this.image = image
		this.url = url
	}
	
	//获取歌词
	getLyric(){
		if(this.lyric){
			return Promise.resolve(this.lyric)
		}
		return new Promise((resolve, reject)=>{
			getLyric(this.mid).then((res)=>{
				if(res.retcode === ERR_OK ){
					this.lyric = Base64.decode(res.lyric)
					resolve(this.lyric);
				}else{
					reject("no lyric")
				}
			})
		})
		
	}
}

export function createSong(musicData){
	return new Song({
		id:musicData.songid,
		mid:musicData.songmid,
		singer:filterSinger(musicData.singer),
		name:musicData.songname,
		album:musicData.albumname,
		duration:musicData.interval,
		image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    //	url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=9086461700&fromtag=46`		//qq音乐失效地址，用下面固定地址演示
    	url:`http://dl.stream.qqmusic.qq.com/C400003aAYrm3GE0Ac.m4a?vkey=2241D7A6009B4BF03774253C586C8F32AEBE75C349DE51BD1B3D50567B5941FFD46DC1CBFB05496366D1FF7342D90D9D926F3145F37B5B61&guid=9086461700&uin=811691503&fromtag=66` 
	})
}

function filterSinger(singer) {//同一首歌有多个人合唱
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
