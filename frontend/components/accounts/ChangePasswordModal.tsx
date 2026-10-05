import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (oldPass: string, newPass: string) => void;
}

export default function ChangePasswordModal({ isOpen, onClose, onSubmit }: PasswordModalProps) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    onSubmit(formData.oldPassword, formData.newPassword);
    setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-[var(--radius-card)] w-full max-w-sm overflow-hidden shadow-elevated">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-primary">
          <h2 className="text-lg font-bold text-accent">Đổi mật khẩu</h2>
          <button type="button" onClick={onClose} className="text-accent hover:text-primary-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Mật khẩu cũ *</label>
            <input 
              required
              type="password" 
              className="w-full px-3 py-2 border border-border rounded-[var(--radius-control)] focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              value={formData.oldPassword}
              onChange={e => setFormData({...formData, oldPassword: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Mật khẩu mới *</label>
            <input 
              required
              type="password" 
              className="w-full px-3 py-2 border border-border rounded-[var(--radius-control)] focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              value={formData.newPassword}
              onChange={e => setFormData({...formData, newPassword: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Xác nhận mật khẩu mới *</label>
            <input 
              required
              type="password" 
              className="w-full px-3 py-2 border border-border rounded-[var(--radius-control)] focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              value={formData.confirmPassword}
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-muted bg-cream-200 hover:bg-cream-300 rounded-[var(--radius-control)] font-medium transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary text-accent hover:bg-primary-hover rounded-[var(--radius-control)] font-bold transition-colors"
            >
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
