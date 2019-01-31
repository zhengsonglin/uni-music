import jsonp from '@/common/js/jsonp'
//import axios from 'axios'

import {
	commonParams,
	options
} from './config'

export function getRecommend() { //获取推荐——轮播图数据
	const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

	const data = Object.assign({}, commonParams, {
		platform: 'h5',
		uin: 0,
		needNewCode: 1
	})

	return jsonp(url, data, options)
}


export function getDiscList({pageNo=1, pageSize=15}) { //推荐——详情页
	//var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
	var	url = 'http://172.17.221.77:9999/api/getDiscList'	//本地nginx代理的地址，然后转向music正真地址
		url = '/api/getDiscList'
		
	let startIndex = (pageNo - 1) * pageSize,
		endIndex = pageNo * pageSize - 1;
	const data = Object.assign({}, commonParams, {
		platform: 'yqq',
		hostUin: 0,
		sin: startIndex,		//起始条, 从0开始，
		ein: endIndex,	//结束条
		sortId: 5,
		needNewCode: 0,
		categoryId: 10000000,
		rnd: Math.random(),
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

export function getSongList(disstid) { //推荐详情页获取歌曲列表
	//const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
	const url = '/api/getSongList'

	const data = Object.assign({}, commonParams, {
		disstid,
		type: 1,
		json: 1,
		utf8: 1,
		onlysong: 0,
		platform: 'yqq',
		hostUin: 0,
		needNewCode: 0
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

