import React from "react";
import Loader from "./Loader";

const Button = ({
  children,
  variant = "primary",
  loading = false,
  onClick,
  disabled = false,
  className = "",
  color,
  style = {},
  ...props
}) => {
  const variants = {
    primary: "primary-btn",
    secondary: "secondary-btn",
    ghost: "ghost-btn",
    danger: "danger-btn",
  };

  const combinedClassName = `${variants[variant]} ${className}`.trim();
  const mergedStyle = color ? { backgroundColor: color, borderColor: color, ...style } : style;

  return (
    <button
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled || loading}
      style={mergedStyle}
      {...props}
    >
      {loading ? <Loader type="spinner" size="sm" /> : children}
    </button>
  );
};

export default Button;