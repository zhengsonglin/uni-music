<script>
	export default {
		onLaunch: function () {
			console.log('App Launch')
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>
	
<style lang="stylus">
	@import "./common/stylus/variable"
	@import "./common/stylus/reset"
	@import "./common/stylus/mixin"

	body{
		background: $color-background;
		color: $color-text;
	}
</style>	
<style>
	
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';
	/*每个页面公共css */
	html, body, div, span, applet, object, iframe,
	h1, h2, h3, h4, h5, h6, p, blockquote, pre,
	a, abbr, acronym, address, big, cite, code,
	del, dfn, em, img, ins, kbd, q, s, samp,
	small, strike, strong, sub, sup, tt, var,
	b, u, i, center,
	dl, dt, dd, ol, ul, li,
	fieldset, form, label, legend,
	table, caption, tbody, tfoot, thead, tr, th, td,
	article, aside, canvas, details, embed,
	figure, figcaption, footer, header,
	menu, nav, output, ruby, section, summary,
	time, mark, audio, video, input{
	  margin: 0;
	  padding: 0;
	  border: 0;
	  font-size: 100%;
	  font-weight: normal;
	  vertical-align: baseline;
	}

	
	
</style>

