import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { submissionService } from '../services/submissionService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { toast } from 'react-toastify';
import { Music, Upload, Tag, User as UserIcon, Type, Info, PlusCircle, Trash2 } from 'lucide-react';

const SongSubmission = () => {
  const { submissionId } = useParams();
  const isEditMode = Boolean(submissionId);
  const navigate = useNavigate();
  const { currentTheme } = useDarkMode();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    existingSingerIds: [],
    tagIds: [],
    isPremium: false,
  });
  const [audioFile, setAudioFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [newSingers, setNewSingers] = useState([]);
  const [newSingerFiles, setNewSingerFiles] = useState({});

  const [availableSingers, setAvailableSingers] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const loadInitialData = async () => {
      setPageLoading(true);
      setServerError('');
      try {
        const formOptions = await submissionService.fetchFormData();
        setAvailableSingers(Array.isArray(formOptions?.singers) ? formOptions.singers : []);
        setAvailableTags(Array.isArray(formOptions?.tags) ? formOptions.tags : []);

        if (isEditMode) {
          const submissionResponse = await submissionService.getSubmissionById(submissionId);
          const submissionData = submissionResponse.data;

          if (submissionData) {
            const approvedSingers = submissionData.singers.filter(s => s.status === 'APPROVED');
            const pendingSingers = submissionData.singers.filter(s => s.status === 'PENDING');

            setFormData({
              title: submissionData.title || '',
              description: submissionData.description || '',
              existingSingerIds: approvedSingers.map(s => String(s.id)),
              tagIds: submissionData.tags.map(t => String(t.id)),
              isPremium: submissionData.isPremium || false,
            });
            setNewSingers(pendingSingers.map(s => ({ id: s.id, name: s.name, email: s.email })));
          } else {
            setServerError("Không tìm thấy yêu cầu để chỉnh sửa.");
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setServerError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setPageLoading(false);
      }
    };
    loadInitialData();
  }, [submissionId, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (e.target.name === 'audioFile' && errors.audioFile) {
        setErrors(prev => ({ ...prev, audioFile: '' }));
      }
    }
  };

  const handleAddNewSinger = () => setNewSingers([...newSingers, { name: '', email: '' }]);
  const handleRemoveNewSinger = (index) => {
    setNewSingers(newSingers.filter((_, i) => i !== index));
    const updatedFiles = { ...newSingerFiles };
    delete updatedFiles[index];
    setNewSingerFiles(updatedFiles);
  };

  const handleNewSingerChange = (index, e) => {
    const updatedSingers = [...newSingers];
    updatedSingers[index][e.target.name] = e.target.value;
    setNewSingers(updatedSingers);
  };

  const handleNewSingerFileChange = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      setNewSingerFiles(prev => ({
        ...prev,
        [index]: e.target.files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError('');
    setErrors({});

    if (!isEditMode && !audioFile) {
      setErrors({ audioFile: "Vui lòng chọn file audio." });
      setLoading(false);
      return;
    }

    const requestDto = {
      title: formData.title,
      description: formData.description,
      existingSingerIds: formData.existingSingerIds.map(Number),
      tagIds: formData.tagIds.map(Number),
      isPremium: formData.isPremium,
      newSingers: newSingers.filter(s => s.name && s.name.trim() !== '' && s.email && s.email.trim() !== ''),
    };

    try {
      if (isEditMode) {
        await submissionService.updateSubmission(submissionId, requestDto);
        toast.success('Đã cập nhật yêu cầu thành công!');
      } else {
        const submissionFormData = new FormData();
        submissionFormData.append('submissionRequest', new Blob([JSON.stringify(requestDto)], { type: "application/json" }));
        submissionFormData.append('audioFile', audioFile);
        if (thumbnailFile) {
          submissionFormData.append('thumbnailFile', thumbnailFile);
        }

        requestDto.newSingers.forEach((singer, index) => {
          if (newSingerFiles[index]) {
            submissionFormData.append('newSingerAvatars', newSingerFiles[index]);
          }
        });

        await submissionService.createSubmission(submissionFormData);
        toast.success('Đã gửi yêu cầu thành công!');
      }
      navigate('/creator/my-submissions');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-music-500"></div></div>;

  return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold ${currentTheme.text}`}>{isEditMode ? 'Chỉnh sửa Yêu cầu' : 'Tạo Yêu cầu Đăng bài hát'}</h1>
        <p className={`${currentTheme.textSecondary}`}>{isEditMode ? 'Cập nhật thông tin cho yêu cầu của bạn.' : 'Điền đầy đủ thông tin để gửi bài hát.'}</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {serverError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">{serverError}</div>}

          <div className={`${currentTheme.bgCard} rounded-xl p-6 border ${currentTheme.border}`}>
            <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium mb-1"><Type className="w-4 h-4 mr-2" />Tên bài hát *</label>
                <Input name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium mb-1"><Info className="w-4 h-4 mr-2" />Mô tả</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className={`w-full p-2 border rounded ${currentTheme.bg} resize-y`}/>
              </div>
            </div>
          </div>

          <div className={`${currentTheme.bgCard} rounded-xl p-6 border ${currentTheme.border}`}>
            <h2 className="text-xl font-semibold mb-4">Ca sĩ & Thể loại</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium mb-1"><UserIcon className="w-4 h-4 mr-2" />Ca sĩ bạn quản lý</label>
                <select multiple name="existingSingerIds" value={formData.existingSingerIds} onChange={(e) => setFormData(p => ({...p, existingSingerIds: Array.from(e.target.selectedOptions, o => o.value)}))} className={`w-full h-32 p-2 border rounded ${currentTheme.bg}`}>
                  {availableSingers.length > 0 ? (
                      availableSingers.map(singer => <option key={singer.id} value={singer.id}>{singer.name}</option>)
                  ) : (
                      <option disabled>Bạn chưa quản lý ca sĩ nào.</option>
                  )}
                </select>
              </div>
              <div>
                <label className="flex items-center text-sm font-medium mb-1"><Tag className="w-4 h-4 mr-2" />Thể loại *</label>
                <select multiple name="tagIds" value={formData.tagIds} onChange={(e) => setFormData(p => ({...p, tagIds: Array.from(e.target.selectedOptions, o => o.value)}))} className={`w-full h-32 p-2 border rounded ${currentTheme.bg}`} required>
                  {availableTags.map(tag => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={`${currentTheme.bgCard} rounded-xl p-6 border ${currentTheme.border}`}>
            <h2 className="text-xl font-semibold mb-4">Thêm ca sĩ mới</h2>
            {newSingers.map((singer, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
                  <Input name="name" value={singer.name} onChange={(e) => handleNewSingerChange(index, e)} placeholder="Tên ca sĩ *" required />
                  <Input name="email" type="email" value={singer.email} onChange={(e) => handleNewSingerChange(index, e)} placeholder="Email liên hệ *" required />
                  <div className="flex items-center gap-2">
                    <input type="file" accept="image/*" onChange={(e) => handleNewSingerFileChange(index, e)} className="text-sm w-full file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold"/>
                    <Button type="button" variant="danger" size="icon" onClick={() => handleRemoveNewSinger(index)}><Trash2 className="w-4 h-4"/></Button>
                  </div>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={handleAddNewSinger} className="flex items-center"><PlusCircle className="w-4 h-4 mr-2"/>Thêm ca sĩ</Button>
          </div>

          <div className={`${currentTheme.bgCard} rounded-xl p-6 border ${currentTheme.border}`}>
            <h2 className="text-xl font-semibold mb-4">Tệp tin</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium mb-1"><Upload className="w-4 h-4 mr-2" />File audio *</label>
                <input type="file" name="audioFile" accept="audio/*" onChange={(e) => handleFileChange(e, setAudioFile)} className={`w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-music-100 file:text-music-700 hover:file:bg-music-200`}/>
                {errors.audioFile && <p className="text-red-500 text-sm mt-1">{errors.audioFile}</p>}
              </div>
              <div>
                <label className="flex items-center text-sm font-medium mb-1"><Music className="w-4 h-4 mr-2" />Ảnh bìa</label>
                <input type="file" name="thumbnailFile" accept="image/*" onChange={(e) => handleFileChange(e, setThumbnailFile)} className={`w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200`}/>
              </div>
            </div>
          </div>

          <div className={`${currentTheme.bgCard} rounded-xl p-6 border ${currentTheme.border}`}>
            <div className="flex items-center">
              <input type="checkbox" id="isPremium" name="isPremium" checked={formData.isPremium} onChange={handleInputChange} className="h-4 w-4 text-music-500 focus:ring-music-500 border-gray-300 rounded" />
              <label htmlFor="isPremium" className="ml-3 block text-sm font-medium">Đây là bài hát Premium</label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" disabled={loading}>{loading ? 'Đang xử lý...' : (isEditMode ? 'Lưu thay đổi' : 'Gửi yêu cầu')}</Button>
          </div>
        </form>
      </div>
  );
};

export default SongSubmission;