//import * as types from './mutation-types'
import {playMode} from '@/common/js/config'
import {shuffle} from '@/common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from '@/common/js/cache'

// lazy loading openid
export const getUserOpenId = async function ({commit,state}) {
	return await new Promise((resolve, reject) => {
		if (state.openid) {
			resolve(state.openid)
		} else {
			uni.login({
				success: (data) => {
					commit('login')
					setTimeout(function () { //模拟异步请求服务器获取 openid
						const openid = '123456789'
						console.log('uni.request mock openid[' + openid + ']');
						commit('setOpenid', openid)
						resolve(openid)
					}, 1000)
				},
				fail: (err) => {
					console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
					reject(err)
				}
			})
		}
	})
}

/* 相关actions */

function findIndex(list, song){
	return list.findIndex((item)=>{
		return item.id == song.id
	})
}

export const selectPlay = function({commit, state}, {list, index}){
	
	commit("setSequenceList", list)
	if(state.mode === playMode.random){
		let randomList = shuffle(list) 
		commit("setPlayList", randomList)
		index = findIndex(randomList, list[index])
	}else{
		commit("setPlayList", list)
	}
	commit("setCurrentIndex", index)
	commit("setFullScreen", true)
	commit("setPlaying", true)
}

export const randomPlay = function({commit}, {list}){
	commit("setMode", playMode.random)
	commit("setSequenceList", list)
	let randomList = shuffle(list)
	commit("setPlayList", randomList)
	commit("setCurrentIndex", 0)
	commit("setFullScreen", true)
	commit("setMode", true)
}



export const insertSong = function ({commit, state}, song) {
  let playlist = state.playList.slice()		//slice 方法不加参数可以用来生成数组的副本， 防止数组改变导致原始数组改变(引用类型)
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit("setPlayList", playlist)
  commit("setSequenceList", sequenceList)
  commit("setCurrentIndex", currentIndex)
  commit("setFullScreen", true)
  commit("setMode", true)
  
}

export const saveSearchHistory = function ({commit}, query) {
  commit("setSearchHistory", saveSearch(query))
}

export const deleteSearchHistory = function ({commit}, query) {
  commit("setSearchHistory", deleteSearch(query))
}

export const clearSearchHistory = function ({commit}) {
  commit("setSearchHistory", clearSearch())
}

export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {	//如果当前播放的是最后一首歌， 删除后播放上一首歌(即之前的倒数第二首歌)
    currentIndex--
  }

  commit("setPlayList", playlist)
  commit("setSequenceList", sequenceList)
  commit("setCurrentIndex", currentIndex)

  const playingState = playlist.length>0
  commit("setMode", playingState)
}

export const deleteSongList = function ({commit}) {
  commit("setCurrentIndex", -1)
  commit("setPlayList", [])
  commit("setSequenceList", [])
  commit("setMode", false)
}

export const savePlayHistory = function ({commit}, song) {
  commit("setPlayHistory", savePlay(song))
}

export const saveFavoriteList = function ({commit}, song) {
  commit("setFavoriteList", saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) {
  commit("setFavoriteList", deleteFavorite(song))
}
