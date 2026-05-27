"use client";

import { useEffect, useState } from "react";

interface PasswordStrengthProps {
  password?: string;
}

export const PasswordStrength = ({ password = "" }: PasswordStrengthProps) => {
  const [strength, setStrength] = useState<"weak" | "fair" | "strong" | "none">("none");

  useEffect(() => {
    if (!password) {
      setStrength("none");
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) setStrength("weak");
    else if (score <= 3) setStrength("fair");
    else setStrength("strong");
  }, [password]);

  if (strength === "none") return null;

  const colors = {
    weak: "bg-red-500",
    fair: "bg-yellow-500",
    strong: "bg-green-500",
    none: "bg-gray-200",
  };

  const barWidth = strength === "weak" ? "33%" : strength === "fair" ? "66%" : "100%";

  return (
    <div className="mt-2">
      <div className="flex gap-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-300 ${colors[strength]}`} style={{ width: barWidth }}></div>
      </div>
      <p className={`text-xs mt-1 font-medium capitalize ${strength === 'weak' ? 'text-red-500' : strength === 'fair' ? 'text-yellow-600' : 'text-green-600'}`}>
        Password strength: {strength}
      </p>
    </div>
  );
};
