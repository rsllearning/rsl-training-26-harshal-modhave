import React from "react";
import { useFormContext, type RegisterOptions } from "react-hook-form";
import { getNestedErrorMessage } from "../../utils/formUtils";

export interface FormCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  name: string;
  label: React.ReactNode;
  description?: string;
  rules?: RegisterOptions;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
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
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex items-center h-5 mt-0.5">
          <input
            id={name}
            type="checkbox"
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={ariaDescribedBy || undefined}
            className={`h-4 w-4 rounded border transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              hasError
                ? "border-red-500 text-red-600 focus:ring-red-200"
                : "border-slate-300 text-blue-600 focus:ring-blue-100"
            }`}
            {...register(name, rules)}
            {...rest}
          />
        </div>
        <div className="text-sm">
          <label htmlFor={name} className="font-medium text-slate-800 cursor-pointer select-none">
            {label}
          </label>
          {description && (
            <p id={descId} className="text-xs text-slate-500 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {hasError && (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-red-600 flex items-center gap-1 mt-1 pl-7 animate-in fade-in duration-150"
        >
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
};

