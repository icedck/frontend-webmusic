import { apiService } from './apiService'

class MusicService {
  // Songs
  async getSongs(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      const endpoint = `/songs${queryString ? `?${queryString}` : ''}`
      return await apiService.get(endpoint)
    } catch (error) {
      console.error('Get songs failed:', error)
      throw error
    }
  }

  async getSong(id) {
    try {
      return await apiService.get(`/songs/${id}`)
    } catch (error) {
      console.error('Get song failed:', error)
      throw error
    }
  }

  async createSong(songData) {
    try {
      return await apiService.post('/songs', songData)
    } catch (error) {
      console.error('Create song failed:', error)
      throw error
    }
  }

  async updateSong(id, songData) {
    try {
      return await apiService.put(`/songs/${id}`, songData)
    } catch (error) {
      console.error('Update song failed:', error)
      throw error
    }
  }

  async deleteSong(id) {
    try {
      return await apiService.delete(`/songs/${id}`)
    } catch (error) {
      console.error('Delete song failed:', error)
      throw error
    }
  }

  async uploadSong(file, metadata) {
    try {
      const formData = new FormData()
      formData.append('song', file)
      if (metadata) {
        Object.keys(metadata).forEach(key => {
          formData.append(key, metadata[key])
        })
      }
      return await apiService.upload('/songs/upload', formData)
    } catch (error) {
      console.error('Upload song failed:', error)
      throw error
    }
  }

  async likeSong(id) {
    try {
      return await apiService.post(`/songs/${id}/like`)
    } catch (error) {
      console.error('Like song failed:', error)
      throw error
    }
  }

  async unlikeSong(id) {
    try {
      return await apiService.delete(`/songs/${id}/like`)
    } catch (error) {
      console.error('Unlike song failed:', error)
      throw error
    }
  }

  async incrementPlayCount(id) {
    try {
      return await apiService.post(`/songs/${id}/play`)
    } catch (error) {
      console.error('Increment play count failed:', error)
      throw error
    }
  }

  // Playlists
  async getPlaylists(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      const endpoint = `/playlists${queryString ? `?${queryString}` : ''}`
      return await apiService.get(endpoint)
    } catch (error) {
      console.error('Get playlists failed:', error)
      throw error
    }
  }

  async getPlaylist(id) {
    try {
      return await apiService.get(`/playlists/${id}`)
    } catch (error) {
      console.error('Get playlist failed:', error)
      throw error
    }
  }

  async createPlaylist(playlistData) {
    try {
      return await apiService.post('/playlists', playlistData)
    } catch (error) {
      console.error('Create playlist failed:', error)
      throw error
    }
  }

  async updatePlaylist(id, playlistData) {
    try {
      return await apiService.put(`/playlists/${id}`, playlistData)
    } catch (error) {
      console.error('Update playlist failed:', error)
      throw error
    }
  }

  async deletePlaylist(id) {
    try {
      return await apiService.delete(`/playlists/${id}`)
    } catch (error) {
      console.error('Delete playlist failed:', error)
      throw error
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    try {
      return await apiService.post(`/playlists/${playlistId}/songs`, { songId })
    } catch (error) {
      console.error('Add song to playlist failed:', error)
      throw error
    }
  }

  async removeSongFromPlaylist(playlistId, songId) {
    try {
      return await apiService.delete(`/playlists/${playlistId}/songs/${songId}`)
    } catch (error) {
      console.error('Remove song from playlist failed:', error)
      throw error
    }
  }

  async likePlaylist(id) {
    try {
      return await apiService.post(`/playlists/${id}/like`)
    } catch (error) {
      console.error('Like playlist failed:', error)
      throw error
    }
  }

  async unlikePlaylist(id) {
    try {
      return await apiService.delete(`/playlists/${id}/like`)
    } catch (error) {
      console.error('Unlike playlist failed:', error)
      throw error
    }
  }

  // Artists/Singers
  async getArtists(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      const endpoint = `/artists${queryString ? `?${queryString}` : ''}`
      return await apiService.get(endpoint)
    } catch (error) {
      console.error('Get artists failed:', error)
      throw error
    }
  }

  async getArtist(id) {
    try {
      return await apiService.get(`/artists/${id}`)
    } catch (error) {
      console.error('Get artist failed:', error)
      throw error
    }
  }

  async createArtist(artistData) {
    try {
      return await apiService.post('/artists', artistData)
    } catch (error) {
      console.error('Create artist failed:', error)
      throw error
    }
  }

  async updateArtist(id, artistData) {
    try {
      return await apiService.put(`/artists/${id}`, artistData)
    } catch (error) {
      console.error('Update artist failed:', error)
      throw error
    }
  }

  async deleteArtist(id) {
    try {
      return await apiService.delete(`/artists/${id}`)
    } catch (error) {
      console.error('Delete artist failed:', error)
      throw error
    }
  }

  // Tags/Genres
  async getTags() {
    try {
      return await apiService.get('/tags')
    } catch (error) {
      console.error('Get tags failed:', error)
      throw error
    }
  }

  async createTag(tagData) {
    try {
      return await apiService.post('/tags', tagData)
    } catch (error) {
      console.error('Create tag failed:', error)
      throw error
    }
  }

  // Search
  async search(query, type = 'all') {
    try {
      const params = new URLSearchParams({ q: query, type })
      return await apiService.get(`/search?${params}`)
    } catch (error) {
      console.error('Search failed:', error)
      throw error
    }
  }

  // Trending/Popular
  async getTrendingSongs() {
    try {
      return await apiService.get('/songs/trending')
    } catch (error) {
      console.error('Get trending songs failed:', error)
      throw error
    }
  }

  async getPopularPlaylists() {
    try {
      return await apiService.get('/playlists/popular')
    } catch (error) {
      console.error('Get popular playlists failed:', error)
      throw error
    }
  }

  async getRecentSongs() {
    try {
      return await apiService.get('/songs/recent')
    } catch (error) {
      console.error('Get recent songs failed:', error)
      throw error
    }
  }

  async getUserLibrary() {
    try {
      return await apiService.get('/user/library')
    } catch (error) {
      console.error('Get user library failed:', error)
      throw error
    }
  }

  async getUserLikedSongs() {
    try {
      return await apiService.get('/user/liked-songs')
    } catch (error) {
      console.error('Get user liked songs failed:', error)
      throw error
    }
  }

  async getUserPlaylists() {
    try {
      return await apiService.get('/user/playlists')
    } catch (error) {
      console.error('Get user playlists failed:', error)
      throw error
    }
  }
}

export const musicService = new MusicService()
