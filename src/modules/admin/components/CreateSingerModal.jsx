// File: src/modules/admin/components/CreateSingerModal.jsx
import React, { useState } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { adminService } from "../services/adminService";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const SingerRow = ({ singer, onUpdate, onRemove }) => {
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpdate(singer.clientId, 'avatarFile', file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
      // START-CHANGE: Sắp xếp lại layout bằng Grid
      <div className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-x-3 gap-y-2 p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
        <label className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-slate-200 dark:bg-slate-600 cursor-pointer overflow-hidden text-slate-400 hover:opacity-80 transition-opacity">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          {avatarPreview ? (
            <LazyLoadImage 
              src={avatarPreview} 
              alt="Preview" 
              className="w-full h-full object-cover" 
              effect="opacity"
              loading="lazy"
              placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNkZGQiLz48L3N2Zz4="
            />
          ) : (
            <span className="text-xs">Ảnh</span>
          )}
        </label>
        <Input placeholder="Tên ca sĩ *" value={singer.name} onChange={(e) => onUpdate(singer.clientId, 'name', e.target.value)} className="!mb-0" required />
        <Input placeholder="Email *" type="email" value={singer.email} onChange={(e) => onUpdate(singer.clientId, 'email', e.target.value)} className="!mb-0" required />
        <Button type="button" size="icon" variant="ghost" onClick={() => onRemove(singer.clientId)} className="text-red-500 flex-shrink-0">
          <Trash2 size={16} />
        </Button>
      </div>
      // END-CHANGE
  );
};

const CreateSingerModal = ({ isOpen, onClose, onSuccess }) => {
  const [singers, setSingers] = useState([{ clientId: `singer-${Date.now()}`, name: "", email: "", avatarFile: null }]);
  const [loading, setLoading] = useState(false);

  const handleAddRow = () => {
    setSingers([...singers, { clientId: `singer-${Date.now()}`, name: "", email: "", avatarFile: null }]);
  };

  const handleUpdateRow = (clientId, key, value) => {
    setSingers(singers.map(s => s.clientId === clientId ? { ...s, [key]: value } : s));
  };

  const handleRemoveRow = (clientId) => {
    if (singers.length > 1) {
      setSingers(singers.filter(s => s.clientId !== clientId));
    } else {
      toast.info("Phải có ít nhất một ca sĩ.");
    }
  };

  const resetForm = () => {
    setSingers([{ clientId: `singer-${Date.now()}`, name: "", email: "", avatarFile: null }]);
    setLoading(false);
  };

  const handleClose = () => { resetForm(); onClose(); };
  const handleSuccess = () => { resetForm(); onSuccess(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const singersRequest = {
      singers: singers.map(s => ({
        clientId: s.avatarFile ? s.avatarFile.name : s.clientId,
        name: s.name,
        email: s.email,
      }))
    };

    const formData = new FormData();
    formData.append("singersRequest", new Blob([JSON.stringify(singersRequest)], { type: "application/json" }));
    singers.forEach(s => {
      if (s.avatarFile) {
        formData.append("avatarFiles", s.avatarFile, s.avatarFile.name);
      }
    });

    try {
      await adminService.createMultipleSingersByAdmin(formData);
      handleSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
      // START-CHANGE: Thu nhỏ Modal hơn nữa
      <Modal title="Tạo ca sĩ mới" isOpen={isOpen} onClose={handleClose} size="xl">
        {/* END-CHANGE */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {singers.map(singer => (
                <SingerRow key={singer.clientId} singer={singer} onUpdate={handleUpdateRow} onRemove={handleRemoveRow} />
            ))}
          </div>
          <Button type="button" variant="outline" onClick={handleAddRow} className="w-full">
            <Plus size={16} className="mr-2" /> Thêm ca sĩ
          </Button>
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="ghost" onClick={handleClose}>Hủy</Button>
            <Button type="submit" disabled={loading}>{loading ? "Đang lưu..." : `Lưu (${singers.length}) ca sĩ`}</Button>
          </div>
        </form>
      </Modal>
  );
};

export default CreateSingerModal;