import jsonp from '../../common/js/jsonp.js'
import {commonParams, options} from './config'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {//当前json会覆盖commonParams中相同部分
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, options)
}

export function getSingerDetail(singerId) { //获取歌手详情页——歌曲列表
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })
  return jsonp(url, data, options)
}

export function getSongAudioSrc(songmids){
	const url = "/api/getSongAudioSrc"
	//const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
	
	let songtype = []
	songmids.forEach((item)=>{
		songtype.push(0)
	})
	
	const data = Object.assign({}, commonParams, {
		 "g_tk": 5381,
		 "uin": 0,
		 "format": "json",
		 "platform": "h5",
		 "needNewCode": 1
	})
	
	const data2 = Object.assign({
		"module": "vkey.GetVkeyServer",
		"method": "CgiGetVkey",
	}, {
		"param": {
			"guid": "9086461700",
			"songmid": songmids,
			"songtype":songtype,
			"uin": "0",
			"loginflag": 0,
			"platform": "23"
		}
	})
	
	var fd = new FormData()
	fd.append('comm', data)
	fd.append('url_mid', data2)

	return new Promise((resolve, reject)=>{
		uni.request({
			url: url, //仅为示例，并非真实接口地址。
			data: fd,//{params:data},
			success: (res) => {
				resolve(res.data)
			}
		});
	})

}


