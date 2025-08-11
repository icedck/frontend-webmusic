import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { submissionService } from '../services/submissionService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import FileUpload from '../../../components/common/FileUpload';
import MultiSelect from '../../../components/common/MultiSelect';
import { toast } from 'react-toastify';
import { User as UserIcon, Mail, PlusCircle, Trash2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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

  const [existingFiles, setExistingFiles] = useState({ audio: null, thumbnail: null });
  const [audioFile, setAudioFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [newSingers, setNewSingers] = useState([]);
  const [newSingerFiles, setNewSingerFiles] = useState({});

  const [availableSingers, setAvailableSingers] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setPageLoading(true);
      try {
        const formOptions = await submissionService.fetchFormData();
        setAvailableSingers(Array.isArray(formOptions?.singers) ? formOptions.singers : []);
        setAvailableTags(Array.isArray(formOptions?.tags) ? formOptions.tags : []);

        if (isEditMode) {
          const submissionResponse = await submissionService.getSubmissionById(submissionId);
          const submissionData = submissionResponse.data;

          if (submissionData) {
            const existingSingers = submissionData.singers.filter(s => s.status !== 'PENDING' || s.creatorId !== submissionData.creatorId);
            const pendingSingers = submissionData.singers.filter(s => s.status === 'PENDING' && s.creatorId === submissionData.creatorId);

            setFormData({
              title: submissionData.title || '',
              description: submissionData.description || '',
              existingSingerIds: existingSingers.map(s => s.id),
              tagIds: submissionData.tags.map(t => t.id),
              isPremium: submissionData.isPremium || false,
            });

            setExistingFiles({
              audio: submissionData.filePath,
              thumbnail: submissionData.thumbnailPath,
            });
            setNewSingers(pendingSingers.map(s => ({ id: s.id, name: s.name, email: s.email })));
          } else {
            toast.error("Không tìm thấy yêu cầu để chỉnh sửa.");
            navigate('/creator/my-submissions');
          }
        }
      } catch (error) {
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setPageLoading(false);
      }
    };
    loadInitialData();
  }, [submissionId, isEditMode, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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

  const handleNewSingerFileChange = (index, file) => {
    setNewSingerFiles(prev => ({
      ...prev,
      [index]: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isEditMode && !audioFile) {
      toast.error("Vui lòng chọn file audio.");
      setLoading(false);
      return;
    }

    const requestDto = {
      ...formData,
      newSingers: newSingers.filter(s => s.name?.trim() && s.email?.trim()),
    };

    const submissionFormData = new FormData();
    submissionFormData.append('submissionRequest', new Blob([JSON.stringify(requestDto)], { type: "application/json" }));
    if (audioFile) submissionFormData.append('audioFile', audioFile);
    if (thumbnailFile) submissionFormData.append('thumbnailFile', thumbnailFile);

    try {
      if (isEditMode) {
        await submissionService.updateSubmission(submissionId, submissionFormData);
        toast.success('Đã cập nhật yêu cầu thành công!');
      } else {
        Object.values(newSingerFiles).forEach(file => {
          submissionFormData.append('newSingerAvatars', file);
        });
        await submissionService.createSubmission(submissionFormData);
        toast.success('Đã gửi yêu cầu thành công!');
      }
      navigate('/creator/my-submissions');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-music-500"></div></div>;

  return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className={`text-3xl font-bold ${currentTheme.text}`}>{isEditMode ? 'Chỉnh sửa Yêu cầu' : 'Tạo Yêu cầu Đăng bài hát'}</h1>
          <p className={`${currentTheme.textSecondary}`}>{isEditMode ? 'Cập nhật thông tin cho yêu cầu của bạn.' : 'Điền đầy đủ thông tin để gửi bài hát.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`p-8 rounded-xl border ${currentTheme.border} ${currentTheme.bgCard} space-y-6`}>
            <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>
            <Input name="title" label="Tên bài hát *" value={formData.title} onChange={handleInputChange} required />
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mô tả</label>
              <textarea id="description" name="description" rows={4} placeholder="Giới thiệu ngắn về bài hát..." value={formData.description} onChange={handleInputChange} className={`w-full p-2 border rounded-lg ${currentTheme.bg} ${currentTheme.border} focus:border-music-500 focus:ring-music-500`} />
            </div>
          </div>

          <div className={`p-8 rounded-xl border ${currentTheme.border} ${currentTheme.bgCard} space-y-6`}>
            <h2 className="text-xl font-semibold">Ca sĩ & Thể loại</h2>
            <MultiSelect label="Ca sĩ bạn quản lý" options={availableSingers} selected={formData.existingSingerIds} onChange={(ids) => setFormData({...formData, existingSingerIds: ids})} placeholder="Chọn từ danh sách ca sĩ..."/>
            <MultiSelect label="Thể loại *" options={availableTags} selected={formData.tagIds} onChange={(ids) => setFormData({...formData, tagIds: ids})} placeholder="Chọn thể loại..."/>
          </div>

          <div className={`p-8 rounded-xl border ${currentTheme.border} ${currentTheme.bgCard} space-y-6`}>
            <h2 className="text-xl font-semibold">Thêm ca sĩ mới (nếu cần)</h2>
            <div className="space-y-4">
              {newSingers.map((singer, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${currentTheme.border} space-y-4`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                      <div className="md:col-span-2 space-y-4">
                        <Input label="Tên ca sĩ" value={singer.name} name="name" onChange={(e) => handleNewSingerChange(index, e)} Icon={UserIcon} placeholder="Tên ca sĩ mới" />
                        <Input label="Email liên hệ" value={singer.email} name="email" type="email" onChange={(e) => handleNewSingerChange(index, e)} Icon={Mail} placeholder="Email ca sĩ" />
                      </div>
                      <div className="md:col-span-1">
                        <FileUpload label="Ảnh đại diện" accept="image/*" onFileChange={(file) => handleNewSingerFileChange(index, file)} previewType="image"/>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="button" variant="danger" size="sm" onClick={() => handleRemoveNewSinger(index)}><Trash2 className="w-4 h-4 mr-2"/>Xóa ca sĩ này</Button>
                    </div>
                  </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={handleAddNewSinger} className="flex items-center"><PlusCircle className="w-4 h-4 mr-2"/>Thêm ca sĩ mới</Button>
          </div>

          <div className={`p-8 rounded-xl border ${currentTheme.border} ${currentTheme.bgCard} space-y-6`}>
            <h2 className="text-xl font-semibold">Tệp tin {isEditMode && '(Chỉ chọn nếu muốn thay đổi)'}</h2>
            <FileUpload label={`File audio ${!isEditMode ? '*' : ''}`} accept="audio/*" onFileChange={setAudioFile} fileName={existingFiles.audio?.split('/').pop()} />
            <FileUpload label="Ảnh bìa" accept="image/*" onFileChange={setThumbnailFile} previewType="image" existingFileUrl={existingFiles.thumbnail ? `${API_BASE_URL}${existingFiles.thumbnail}` : null} fileName={existingFiles.thumbnail?.split('/').pop()} />
          </div>

          <div className={`p-8 rounded-xl border ${currentTheme.border} ${currentTheme.bgCard}`}>
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="isPremium" className="font-medium text-slate-900 dark:text-slate-100">Bài hát Premium</label>
                <p className="text-sm text-slate-500 dark:text-slate-400">Chỉ người dùng Premium mới có thể nghe.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="isPremium" name="isPremium" checked={formData.isPremium} onChange={handleInputChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-music-300 dark:peer-focus:ring-music-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-music-600"></div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/creator/my-submissions')}>Hủy</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Đang xử lý...' : (isEditMode ? 'Lưu thay đổi' : 'Gửi yêu cầu')}</Button>
          </div>
        </form>
      </div>
  );
};

export default SongSubmission;