<template>
	<view class="singer">
		<list-view @select="selectSinger" :data="singers" ref="list"></list-view>
	</view>
</template>

<script>
	import {getSingerList} from '../../api/singer'
	import Singer from '@/common/js/singer.js'
	
	import ListView from '../list-view/list-view.vue'
	import {mapMutations} from 'vuex'
	import {playlistMixin} from '@/common/js/mixin'
	
	const HOT_SINGER_LEN = 10
	const HOT_NAME = "热门";
	export default {
		components: {
			ListView
		},
		data() {
			return {
				singers:[]
			};
		},
		methods:{
			selectSinger(singer) {
				/* this.$router.push({
				  path: `/singer/${singer.id}`
				}) */
				uni.navigateTo({
					url:"/pages/singer/singerDetail",
				})
				this.setSinger(singer)
			},
			_getSingerList(){
				getSingerList().then((res)=>{
					if(res.code === this.ERR_OK){
						this.singers = this._normalizeSinger(res.data.list);
					}
				}).catch(e=>{
					console.log(e);
				})
			},
			_normalizeSinger(list){
				let map = {
					hot:{
						title: HOT_NAME,
						items:[]
					}
					
				}
				
				list.forEach((item, index)=>{
					if(index < HOT_SINGER_LEN){
						map.hot.items.push(new Singer({
							id:item.Fsinger_mid,
							name:item.Fsinger_name,
						}))
					}
					
					const key = item.Findex;	//如A， B，C ....
					if(!map[key]){
						map[key] = {
							title:key,
							items:[]
						}
					}
					map[key].items.push(new Singer({
						id:item.Fsinger_mid,
						name:item.Fsinger_name
					}))
					
				});
				
				//为了得到有序列表， 我们需要处理map
				let hot = [];
				let ret = [];
				for(let key in map){
					let val = map[key];
					if(val.title.match(/[a-zA-Z]/)){
						ret.push(val)
					}else if(val.title === HOT_NAME){
						hot.push(val)
					}
				}
				
				ret.sort((a, b)=>{//charCodeAt返回指定位置 字符 对应的 Unicode 编码
					return a.title.charCodeAt(0) - b.title.charCodeAt(0);
				})
				
				return hot.concat(ret);	//拼接数组
			},
			...mapMutations({
				setSinger:'setSinger'
			})
		},
		created() {
			console.log("singer创建")
			this._getSingerList()
		},
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 0
    bottom: 0
    width: 100%
</style>
