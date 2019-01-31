import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

//参数: 关键词、第几页、是否需要歌手搜索、每页条数
export function search(query, page, zhida, perpage) {
  //const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
	const url = "/api/searchSong"			
  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  //return jsonp(url, data, options)
	return new Promise((resolve, reject)=>{
		uni.request({
			url: url, 
			data: data,//{params:data},
			dataType: "jsonp",
			success: (res) => {
				resolve(eval(res.data))	//res.data
			}
		});
	})
}

/* 手动处理jsonp的callback */
function callback(data){
		return data
}

