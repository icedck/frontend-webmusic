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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200/30 dark:border-indigo-800/30"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin"></div>
            </div>
          </div>
          <p className={`text-lg font-light ${currentTheme?.text || 'text-gray-700 dark:text-gray-300'} tracking-wide`}>
            Đang tải danh sách ca sĩ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10 rounded-3xl blur-3xl"></div>
          <div className={`relative ${currentTheme.bgCard} backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 shadow-xl shadow-slate-900/5`}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                  <h1 className={`text-4xl font-light tracking-tight ${currentTheme.text}`}>
                    Quản lý ca sĩ
                  </h1>
                </div>
                <p className={`text-lg ${currentTheme.textSecondary} ml-5 font-light`}>
                  Tạo và quản lý thông tin ca sĩ trong hệ thống
                </p>
              </div>
              <Button 
                onClick={handleCreateArtist}
                className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 rounded-2xl px-6 py-3 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plus className="w-5 h-5 mr-2" />
                <span className="font-medium">Thêm ca sĩ mới</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl blur opacity-50"></div>
          <div className={`relative ${currentTheme.bgCard} border border-slate-200/60 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-lg`}>
            <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Tìm kiếm theo tên ca sĩ hoặc thể loại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 bg-transparent border-0 text-base placeholder:text-slate-400 focus:ring-0"
            />
          </div>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <div key={artist.id} className="group relative">
              {/* Floating gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100"></div>
              
              <div className={`relative ${currentTheme.bgCard} backdrop-blur-sm border border-white/10 dark:border-slate-700/30 rounded-3xl p-6 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-500 group-hover:border-indigo-200/50 dark:group-hover:border-indigo-700/50`}>
                {/* Artist Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        {artist.avatar ? (
                          <img src={artist.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                        ) : (
                          <User className="w-7 h-7" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className={`text-xl font-semibold ${currentTheme.text} tracking-tight`}>
                        {artist.name}
                      </h3>
                      <p className={`text-sm ${currentTheme.textSecondary} flex items-center gap-2 font-medium`}>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <Music className="w-4 h-4" />
                        {artist.songsCount} bài hát
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={() => handleEditArtist(artist)}
                      className="w-9 h-9 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteArtist(artist.id)}
                      className="w-9 h-9 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Artist Bio */}
                <div className="mb-6">
                  <p className={`text-sm ${currentTheme.textSecondary} leading-relaxed line-clamp-3`}>
                    {artist.bio}
                  </p>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {artist.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-medium border border-indigo-200/50 dark:border-indigo-800/50 backdrop-blur-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className={`pt-4 border-t border-slate-200/60 dark:border-slate-700/60`}>
                  <p className={`text-xs ${currentTheme.textSecondary} font-medium tracking-wide`}>
                    Tạo ngày: {formatDate(artist.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredArtists.length === 0 && (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-3xl blur-lg opacity-50"></div>
              <div className={`relative w-24 h-24 ${currentTheme.bgCard} border border-slate-200/60 dark:border-slate-700/60 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <User className={`w-12 h-12 ${currentTheme.textSecondary}`} />
              </div>
            </div>
            <h3 className={`text-2xl font-light ${currentTheme.text} mb-3 tracking-tight`}>
              {searchTerm ? 'Không tìm thấy ca sĩ nào' : 'Chưa có ca sĩ nào'}
            </h3>
            <p className={`${currentTheme.textSecondary} mb-8 text-lg font-light max-w-md mx-auto`}>
              {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Bắt đầu bằng cách thêm ca sĩ đầu tiên'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={handleCreateArtist}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 rounded-2xl px-8 py-3 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
              >
                Thêm ca sĩ mới
              </Button>
            )}
          </div>
        )}

        {/* Modals */}
        {showCreateModal && (
          <ArtistModal
            onSave={handleSaveArtist}
            onCancel={() => setShowCreateModal(false)}
            title="Thêm ca sĩ mới"
          />
        )}

        {showEditModal && selectedArtist && (
          <ArtistModal
            artist={selectedArtist}
            onSave={handleSaveArtist}
            onCancel={() => setShowEditModal(false)}
            title="Chỉnh sửa thông tin ca sĩ"
          />
        )}
      </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-lg">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 rounded-3xl blur-2xl"></div>
        
        <div className={`relative ${currentTheme.bgCard} backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl shadow-slate-900/25 overflow-hidden`}>
          {/* Header */}
          <div className="relative px-8 py-6 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"></div>
            <h2 className={`relative text-2xl font-semibold ${currentTheme.text} tracking-tight`}>
              {title}
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${currentTheme.text} tracking-wide`}>
                Tên ca sĩ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên ca sĩ"
                  required
                  className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl focus:border-indigo-300 dark:focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`block text-sm font-medium ${currentTheme.text} tracking-wide`}>
                Tiểu sử
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                placeholder="Nhập tiểu sử ca sĩ..."
                className={`w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl ${currentTheme.text} focus:border-indigo-300 dark:focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 resize-none`}
              />
            </div>

            <div className="space-y-4">
              <label className={`block text-sm font-medium ${currentTheme.text} tracking-wide`}>
                Thể loại
              </label>
              
              {/* Add Genre Section */}
              <div className="flex gap-3">
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className={`flex-1 px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl ${currentTheme.text} focus:border-indigo-300 dark:focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200`}
                >
                  <option value="">Chọn thể loại</option>
                  {commonGenres.filter(genre => !formData.genres.includes(genre)).map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                <Button 
                  type="button" 
                  onClick={handleAddGenre}
                  className="px-6 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-700/50 rounded-2xl transition-all duration-200 hover:scale-105"
                >
                  Thêm
                </Button>
              </div>

              {/* Selected Genres */}
              <div className="flex flex-wrap gap-2 min-h-[2rem]">
                {formData.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="group inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium border border-indigo-200/50 dark:border-indigo-800/50 hover:from-indigo-500/20 hover:to-purple-500/20 transition-all duration-200"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => handleRemoveGenre(genre)}
                      className="w-4 h-4 text-indigo-400 hover:text-red-500 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200/60 dark:border-slate-700/60">
              <Button 
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-slate-100/70 hover:bg-slate-200/70 dark:bg-slate-800/70 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl transition-all duration-200 hover:scale-105"
              >
                Hủy
              </Button>
              <Button 
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 hover:scale-105"
              >
                {artist ? 'Cập nhật' : 'Tạo ca sĩ'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtistManagement;
