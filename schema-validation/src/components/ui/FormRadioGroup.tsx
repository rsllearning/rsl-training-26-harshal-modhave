import React from "react";
import { useFormContext, type RegisterOptions } from "react-hook-form";
import { getNestedErrorMessage } from "../../utils/formUtils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface FormRadioGroupProps {
  name: string;
  label: string;
  options: RadioOption[];
  required?: boolean;
  description?: string;
  className?: string;
  rules?: RegisterOptions;
}

export const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  name,
  label,
  options,
  required,
  description,
  className = "",
  rules,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getNestedErrorMessage(errors, name);
  const hasError = Boolean(errorMessage);
  const errorId = `${name}-error`;
  const descId = `${name}-description`;
  const legendId = `${name}-legend`;

  return (
    <fieldset
      className={`border-0 p-0 m-0 ${className}`}
      aria-describedby={[hasError ? errorId : null, description ? descId : null]
        .filter(Boolean)
        .join(" ") || undefined}
    >
      <legend id={legendId} className="text-sm font-semibold text-slate-800 mb-1">
        {label} {required && <span className="text-red-500 font-bold" aria-hidden="true">*</span>}
      </legend>

      {description && (
        <p id={descId} className="text-xs text-slate-500 mb-2">
          {description}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        {options.map((opt) => {
          const optionId = `${name}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={optionId}
              className={`flex items-start p-3.5 rounded-lg border cursor-pointer transition-all duration-150 ${
                hasError
                  ? "border-red-300 bg-red-50/20 hover:border-red-400"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id={optionId}
                  type="radio"
                  value={opt.value}
                  className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  {...register(name, rules)}
                />
              </div>
              <div className="ml-3 text-sm">
                <span className="font-medium text-slate-900 block">{opt.label}</span>
                {opt.description && (
                  <span className="text-xs text-slate-500 block mt-0.5">{opt.description}</span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {hasError && (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-red-600 flex items-center gap-1 mt-1.5 animate-in fade-in duration-150"
        >
          <span>{errorMessage}</span>
        </p>
      )}
    </fieldset>
  );
};

