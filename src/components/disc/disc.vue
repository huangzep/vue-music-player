<template>
	<transition name="slide">
		<music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
	</transition>
</template>

<script>
	import {mapGetters} from 'vuex'
	import MusicList from 'components/music-list/music-list'
	import {getSongList} from 'api/recommend'
	import {createSong} from 'common/js/song'

	export default {
		computed: {
			title() {
				return this.disc.dissname
			},
			bgImage() {
				return this.disc.imgurl
			},
			...mapGetters([
				'disc'
			])
		},
		data() {
			return {
				songs: []
			}
		},
		created() {
			this._getSongList()
		},
		methods: {
			_getSongList() {
				getSongList(this.disc.dissid).then((res) => {
					this.songs = this._normalizeSongs(res.cdlist[0].songlist)
				})
			},
			_normalizeSongs(list) {
				let ret = []
				list.forEach((musicData) => {
					if (musicData.songid && musicData.albummid) {
						ret.push(createSong(musicData))
					}
				})
				return ret
			}
		},
		components: {
			MusicList
		}
	
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.slide-enter-active, .slide-leave-active
		transition: all 0.3s

	.slide-enter, .slide-leave-to
		transform: translate3d(100%, 0, 0)
</style>