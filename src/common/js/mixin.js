import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
	computed: {
		...mapGetters([
			'playlist'
		])
	},
	mounted() {
		this.handlePlaylist(this.playlist)
	},
	activated() {
		this.handlePlaylist(this.playlist)
	},
	watch: {
		playlist(newVal) {
			this.handlePlaylist(newVal)
		}
	},
	methods: {
		handlePlaylist() {
			throw new Error('component must implement handlePlaylist method')
		}
	}
}

export const playerMixin = {
	computed: {
		iconMode() {
			return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
		},
		...mapGetters([
			'currentSong',
			'mode',
			'sequenceList',
			'favorite'
		])
	},
	methods: {
		changeMode() {         
	        const mode = (this.mode + 1) % 3        
	        this.setPlayMode(mode)
	          
	        let list = null
	        if (mode === playMode.random) {
	          list = shuffle(this.sequenceList)
	        } else {
	          list = this.sequenceList
	        }       

	        this.resetCurrentIndex(list)     
	        this.setPlaylist(list)  
	      },
	      resetCurrentIndex(list) {
	        let index = list.findIndex((item) => {
	          return item.id === this.currentSong.id
	        })
	        this.setCurrentIndex(index)
	      },
	      getFavoriteIcon(currentSong) {
	      	if (this.isFavorite(currentSong)) {
	      		return 'icon-favorite'
	      	}
	      	return 'icon-not-favorite'
	      },
	      toggleFavorite(currentSong) {
	      	if (this.isFavorite(currentSong)) {
	      		this.deleteFavoriteList(currentSong)
	      	} else {
	      		this.saveFavoriteList(currentSong)
	      	}
	      },
	      isFavorite(song) {
	      	const index = this.favorite.findIndex((item) => {
	      		return item.id === song.id
	      	})
	      	return index > -1
	      },
	      ...mapActions([
	      	'saveFavoriteList',
	      	'deleteFavoriteList'
	      ]),
	      ...mapMutations({
	       setCurrentIndex: 'SET_CURRENT_INDEX',
	       setPlayMode: 'SET_PLAY_MODE',
	       setPlaylist: 'SET_PLAYLIST'
	      })     
	}
}

export const searchMixin = {
	data() {
		return {
			query: '',
			refreshDelay: 100
		}
	},
	computed: {
		...mapGetters([
			'searchHistory'
		])
	},
	methods: {
		onQueryChange(query) {
			this.query = query
		},
		blurInput() {
			this.$refs.searchBox.blur()
		},
		addQuery(query) {
			this.$refs.searchBox.setQuery(query)
		},
		saveSearch() {
			this.saveSearchHistory(this.query)
		},
		...mapActions([
			'saveSearchHistory',
			'deleteSearchHistory'
		])
	}
}