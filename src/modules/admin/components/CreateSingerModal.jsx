import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import FileUpload from "../../../components/common/FileUpload";
import { adminService } from "../services/adminService";
import { User, Mail } from "lucide-react";
import { toast } from "react-toastify";

const CreateSingerModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setAvatarFile(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSuccess = () => {
    resetForm();
    onSuccess();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    const singerRequest = { name, email };

    formData.append(
      "singerRequest",
      new Blob([JSON.stringify(singerRequest)], { type: "application/json" })
    );
    if (avatarFile) {
      formData.append("avatarFile", avatarFile);
    }

    try {
      await adminService.createSingerByAdmin(formData);
      handleSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Tạo ca sĩ mới" isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Tên ca sĩ"
          id="singer-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          Icon={User}
          required
        />
        <Input
          label="Email"
          id="singer-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          Icon={Mail}
          required
        />
        <FileUpload
          label="Ảnh đại diện"
          accept="image/*"
          onFileChange={setAvatarFile}
          previewType="image"
        />
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSingerModal;
