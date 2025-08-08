// Artist Management for Admin
import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Modal from '../../../components/common/Modal';
import { Search, Plus, Edit, Trash2, User, Music } from 'lucide-react';

const ArtistManagement = () => {
  const { currentTheme } = useDarkMode();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Mock artists data
  useEffect(() => {
    const mockArtists = [
      {
        id: 1,
        name: 'Trịnh Công Sơn',
        bio: 'Nhạc sĩ, ca sĩ người Việt Nam, được mệnh danh là một trong những nhạc sĩ tài năng nhất của âm nhạc Việt Nam',
        avatar: null,
        genres: ['Folk', 'Ballad'],
        songsCount: 15,
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 1
      },
      {
        id: 2,
        name: 'Bùi Anh Tuấn',
        bio: 'Ca sĩ, nhạc sĩ Việt Nam với giọng hát nội lực và phong cách ballad lãng mạn',
        avatar: null,
        genres: ['Pop', 'Ballad'],
        songsCount: 8,
        createdAt: '2024-01-15T00:00:00Z',
        createdBy: 1
      },
      {
        id: 3,
        name: 'Soobin Hoàng Sơn',
        bio: 'Ca sĩ trẻ với phong cách âm nhạc đa dạng từ pop, R&B đến hip-hop',
        avatar: null,
        genres: ['Pop', 'R&B', 'Hip-Hop'],
        songsCount: 12,
        createdAt: '2024-02-01T00:00:00Z',
        createdBy: 1
      }
    ];

    setTimeout(() => {
      setArtists(mockArtists);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateArtist = () => {
    setSelectedArtist(null);
    setShowCreateModal(true);
  };

  const handleEditArtist = (artist) => {
    setSelectedArtist(artist);
    setShowEditModal(true);
  };

  const handleSaveArtist = (artistData) => {
    if (selectedArtist) {
      // Update existing artist
      setArtists(prev => prev.map(a => 
        a.id === selectedArtist.id 
          ? { ...selectedArtist, ...artistData, updatedAt: new Date().toISOString() }
          : a
      ));
      setShowEditModal(false);
    } else {
      // Create new artist
      const newArtist = {
        id: Date.now(),
        ...artistData,
        songsCount: 0,
        createdAt: new Date().toISOString(),
        createdBy: 1 // Current admin ID
      };
      setArtists(prev => [...prev, newArtist]);
      setShowCreateModal(false);
    }
    setSelectedArtist(null);
  };

  const handleDeleteArtist = async (artistId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ca sĩ này?')) {
      setArtists(prev => prev.filter(a => a.id !== artistId));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-music-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${currentTheme.text}`}>
            Quản lý ca sĩ
          </h1>
          <p className={`mt-2 ${currentTheme.textSecondary}`}>
            Tạo và quản lý thông tin ca sĩ trong hệ thống
          </p>
        </div>
        <Button onClick={handleCreateArtist}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm ca sĩ mới
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm theo tên ca sĩ hoặc thể loại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.map((artist) => (
          <div key={artist.id} className={`${currentTheme.bgCard} rounded-xl p-6 border ${currentTheme.border}`}>
            {/* Artist Avatar */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-br from-music-400 to-music-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  {artist.avatar ? (
                    <img src={artist.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className={`font-semibold ${currentTheme.text}`}>
                    {artist.name}
                  </h3>
                  <p className={`text-sm ${currentTheme.textSecondary} flex items-center gap-1`}>
                    <Music className="w-3 h-3" />
                    {artist.songsCount} bài hát
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditArtist(artist)}
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteArtist(artist.id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Artist Bio */}
            <p className={`text-sm ${currentTheme.textSecondary} mb-4 line-clamp-3`}>
              {artist.bio}
            </p>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {artist.genres.map((genre, index) => (
                <span
                  key={index}
                  className="bg-music-100 dark:bg-music-900/20 text-music-600 dark:text-music-400 px-2 py-1 rounded-full text-xs"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Creation Date */}
            <p className={`text-xs ${currentTheme.textMuted}`}>
              Tạo ngày: {formatDate(artist.createdAt)}
            </p>
          </div>
        ))}
      </div>

      {filteredArtists.length === 0 && (
        <div className="text-center py-12">
          <User className={`w-12 h-12 ${currentTheme.textSecondary} mx-auto mb-4`} />
          <h3 className={`text-lg font-medium ${currentTheme.text} mb-2`}>
            {searchTerm ? 'Không tìm thấy ca sĩ nào' : 'Chưa có ca sĩ nào'}
          </h3>
          <p className={`${currentTheme.textSecondary} mb-4`}>
            {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Bắt đầu bằng cách thêm ca sĩ đầu tiên'}
          </p>
          {!searchTerm && (
            <Button onClick={handleCreateArtist}>
              Thêm ca sĩ mới
            </Button>
          )}
        </div>
      )}

      {/* Create Artist Modal */}
      {showCreateModal && (
        <ArtistModal
          onSave={handleSaveArtist}
          onCancel={() => setShowCreateModal(false)}
          title="Thêm ca sĩ mới"
        />
      )}

      {/* Edit Artist Modal */}
      {showEditModal && selectedArtist && (
        <ArtistModal
          artist={selectedArtist}
          onSave={handleSaveArtist}
          onCancel={() => setShowEditModal(false)}
          title="Chỉnh sửa thông tin ca sĩ"
        />
      )}
    </div>
  );
};

// Artist Modal Component
const ArtistModal = ({ artist, onSave, onCancel, title }) => {
  const { currentTheme } = useDarkMode();
  const [formData, setFormData] = useState({
    name: artist?.name || '',
    bio: artist?.bio || '',
    genres: artist?.genres || []
  });
  const [newGenre, setNewGenre] = useState('');

  const commonGenres = ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Electronic', 'Jazz', 'Classical', 'Country', 'Folk', 'Blues'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddGenre = () => {
    if (newGenre.trim() && !formData.genres.includes(newGenre.trim())) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, newGenre.trim()]
      }));
      setNewGenre('');
    }
  };

  const handleRemoveGenre = (genreToRemove) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(genre => genre !== genreToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
            Tên ca sĩ *
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nhập tên ca sĩ"
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
            Tiểu sử
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows="4"
            placeholder="Nhập tiểu sử ca sĩ..."
            className={`w-full px-4 py-2 border rounded-lg ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} focus:ring-2 focus:ring-music-500 focus:border-music-500 resize-none`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
            Thể loại
          </label>
          <div className="flex gap-2 mb-2">
            <select
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              className={`flex-1 px-4 py-2 border rounded-lg ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} focus:ring-2 focus:ring-music-500 focus:border-music-500`}
            >
              <option value="">Chọn thể loại</option>
              {commonGenres.filter(genre => !formData.genres.includes(genre)).map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <Button type="button" onClick={handleAddGenre} variant="outline">
              Thêm
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.genres.map((genre, index) => (
              <span
                key={index}
                className="bg-music-100 dark:bg-music-900/20 text-music-600 dark:text-music-400 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {genre}
                <button
                  type="button"
                  onClick={() => handleRemoveGenre(genre)}
                  className="text-music-500 hover:text-music-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">
            {artist ? 'Cập nhật' : 'Tạo ca sĩ'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ArtistManagement;
