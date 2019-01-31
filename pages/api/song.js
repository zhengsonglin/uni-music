import {commonParams} from './config'

export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

	return new Promise((resolve, reject)=>{
		uni.request({
			url: url, //仅为示例，并非真实接口地址。
			data: data,//{params:data},
			success: (res) => {
				resolve(res.data)
			}
		});
	})
	
}