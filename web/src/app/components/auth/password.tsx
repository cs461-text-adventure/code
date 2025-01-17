"use client";

import { useState } from "react";

export default function PasswordInput(props: { className: string | null }) {
  //const [borderColor, setBorderColor] = useState("border-gray-300");
  const [passwordShown, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  // const handleInput = () => {
  //   setBorderColor("border-gray-300");
  // };

  return (
    <div
      className={`${props.className} flex flex-row border rounded-lg mb-2 dark:bg-black dark:border-gray-800 border-gray-300 w-full focus-within:ring-2 focus-within:ring-blue-500`}
    >
      <input
        className="p-2 dark:bg-black flex-1 rounded-lg outline-none"
        name="password"
        type={passwordShown ? "text" : "password"}
        value={password}
        onChange={handleChange}
        required
      />
      <div className="flex-none flex items-center justify-center">
        {/* Conditionally render the button only if the password field has text */}
        {password && (
          <button
            className="text-sm text-gray-500 px-3"
            type="button"
            onClick={toggleVisibility}
          >
            {passwordShown ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}
