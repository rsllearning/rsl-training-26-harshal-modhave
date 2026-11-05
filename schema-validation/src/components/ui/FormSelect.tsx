import React from "react";
import { useFormContext, type RegisterOptions } from "react-hook-form";
import { getNestedErrorMessage } from "../../utils/formUtils";
import { AlertCircle } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  rules?: RegisterOptions;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  placeholder = "Select an option...",
  required,
  description,
  className = "",
  rules,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getNestedErrorMessage(errors, name);
  const hasError = Boolean(errorMessage);
  const errorId = `${name}-error`;
  const descId = `${name}-description`;

  const ariaDescribedBy = [
    hasError ? errorId : null,
    description ? descId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={name}
        className="text-sm font-semibold text-slate-800 flex items-center justify-between"
      >
        <span>
          {label} {required && <span className="text-red-500 font-bold" aria-hidden="true">*</span>}
        </span>
      </label>

      {description && (
        <p id={descId} className="text-xs text-slate-500">
          {description}
        </p>
      )}

      <div className="relative">
        <select
          id={name}
          aria-invalid={hasError ? "true" : "false"}
          aria-required={required}
          aria-describedby={ariaDescribedBy || undefined}
          className={`w-full appearance-none rounded-lg border px-3.5 py-2.5 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 bg-white ${
            hasError
              ? "border-red-500 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-red-200"
              : "border-slate-300 text-slate-900 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-100"
          }`}
          {...register(name, rules)}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
          {hasError ? (
            <AlertCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      {hasError && (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-red-600 flex items-center gap-1 mt-0.5 animate-in fade-in duration-150"
        >
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
};

