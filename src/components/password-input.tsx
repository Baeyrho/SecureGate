"use client";

import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps {
  register: UseFormRegisterReturn;
  placeholder?: string;
  onFocus?: () => void;
}

export function PasswordInput({ register, placeholder = "••••••••", onFocus }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        {...register}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="input-field pr-10"
        onFocus={onFocus}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-gray-600 uppercase tracking-wider"
        tabIndex={-1}
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
