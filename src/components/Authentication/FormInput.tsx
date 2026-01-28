import "remixicon/fonts/remixicon.css";
import React from "react";

interface FormInputProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  className?: string;
  isAvailable?: boolean | null;
  isChecking?: boolean;
  availableMessage?: string;
  unavailableMessage?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  showValue?: boolean;
}

/**
 * Reusable form input component with validation feedback
 */
export const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  minLength,
  isAvailable = null,
  isChecking = false,
  availableMessage,
  unavailableMessage,
  showToggle = false,
  onToggle,
  showValue = false,
}) => {
  // Dynamic border color based on availability
  const getBorderColor = () => {
    if (isAvailable === false) return "border-red-500 dark:border-red-500";
    if (isAvailable === true) return "border-green-500 dark:border-green-500";
    return "border-slate-200 dark:border-slate-700";
  };

  return (
    <div className="mb-3 relative group">
      <label
        htmlFor={label}
        className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
      >
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>

      <input
        id={label}
        type={showToggle && showValue ? "text" : type}
        className={`h-10 rounded-lg text-sm text-slate-900 dark:text-white border ${getBorderColor()} bg-white dark:bg-slate-900/50 px-3 block w-full outline-0 transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-500/30 group-hover:border-slate-300 dark:group-hover:border-slate-600 ${
          showToggle ? "ltr:pr-10 rtl:pl-10" : ""
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        minLength={minLength}
        aria-label={label}
        aria-required={required}
        aria-invalid={isAvailable === false}
        autoComplete={
          type === "email" ? "email" : type === "tel" ? "tel" : "off"
        }
      />

      {/* Toggle button for password fields */}
      {showToggle && onToggle && (
        <button
          className="absolute ltr:right-3 rtl:left-3 top-[25px] text-base text-slate-400 dark:text-slate-500 hover:text-purple-500 dark:hover:text-purple-400 transition-all duration-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          type="button"
          onClick={onToggle}
          aria-label={showValue ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        >
          <i className={showValue ? "ri-eye-line" : "ri-eye-off-line"}></i>
        </button>
      )}

      {/* Loading indicator */}
      {isChecking && (
        <div
          className="absolute ltr:right-3 rtl:left-3 top-[30px] text-purple-500 dark:text-purple-400"
          aria-label="جاري التحقق..."
        >
          <i className="ri-loader-4-line animate-spin text-base"></i>
        </div>
      )}

      {/* Validation messages */}
      {!isChecking && isAvailable === false && unavailableMessage && (
        <p className="text-red-500 dark:text-red-400 text-[10px] mt-1 font-medium flex items-center gap-1" role="alert">
          <i className="ri-error-warning-line text-xs"></i>
          {unavailableMessage}
        </p>
      )}

      {!isChecking && isAvailable === true && availableMessage && (
        <p className="text-green-500 dark:text-green-400 text-[10px] mt-1 font-medium flex items-center gap-1" role="status">
          <i className="ri-checkbox-circle-line text-xs"></i>
          {availableMessage}
        </p>
      )}
    </div>
  );
};
