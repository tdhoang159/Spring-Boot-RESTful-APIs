import type { ReactNode } from "react";

export const AdminPageHeader = ({ title, description, action }: { title: string; description: string; action?: ReactNode }) => (
  <div className="admin-page-header">
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
    {action}
  </div>
);

export const AdminCard = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section className={`admin-card ${className}`}>{children}</section>
);

export const AdminStatCard = ({ label, value, tone = "brand" }: { label: string; value: string | number; tone?: "brand" | "success" | "warning" | "error" }) => (
  <AdminCard className={`admin-stat admin-stat-${tone}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </AdminCard>
);

export const AdminBadge = ({ children, tone = "gray" }: { children: ReactNode; tone?: "gray" | "success" | "warning" | "error" | "brand" }) => (
  <span className={`admin-badge admin-badge-${tone}`}>{children}</span>
);

export const AdminLoading = () => <div className="admin-loading">Đang tải dữ liệu...</div>;

export const AdminEmpty = ({ message }: { message: string }) => <div className="admin-empty">{message}</div>;

export const AdminToast = ({ type, message, onClose }: { type: "success" | "error"; message: string; onClose: () => void }) => (
  <div className={`admin-toast admin-toast-${type}`}>
    <span>{message}</span>
    <button onClick={onClose}>x</button>
  </div>
);

export const AdminModal = ({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) => (
  <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
    <div className="admin-modal">
      <div className="admin-modal-header">
        <h3>{title}</h3>
        <button className="admin-icon-btn" onClick={onClose} aria-label="Đóng">x</button>
      </div>
      {children}
    </div>
  </div>
);

export const TextField = ({ label, value, onChange, required = false, type = "text" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string }) => (
  <label className="admin-field">
    <span>{label}{required ? " *" : ""}</span>
    <input value={value} onChange={(event) => onChange(event.target.value)} required={required} type={type} />
  </label>
);

export const TextAreaField = ({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) => (
  <label className="admin-field">
    <span>{label}{required ? " *" : ""}</span>
    <textarea value={value} onChange={(event) => onChange(event.target.value)} required={required} rows={4} />
  </label>
);

export const SelectField = ({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) => (
  <label className="admin-field">
    <span>{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
);
