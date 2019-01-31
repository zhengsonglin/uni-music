<template>
  <div class="mf-loading-container" :class="align">
    <img src="./loading.gif" width="24" height="24" >
		<p class="desc" :style="{color:color}"> {{title}}</p>
  </div>
</template>
<script>
  const COMPONENT_NAME = 'loading'

  export default {
    name: COMPONENT_NAME,
		props: {
      title: {
        type: String,
        default: '正在载入...'
      },
			align:{
				type: String,
				default: 'vertical',	//水平：horizontal；垂直vertical
			},
			color:{
				type: String,
				default: '#fff'		//支持#666和red及rgb
			}
    }
  }
</script>
<style>
  .mf-loading-container{
		width: 100%;
    text-align: center;
	}
   .horizontal img, .horizontal .desc{
		 display: inline;
		 vertical-align: middle;
		 margin:0 4px;
	 }
</style>
