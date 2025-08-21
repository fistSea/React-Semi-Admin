import React from "react";
import "./Loading.css";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = "medium",
  text = "加载中...",
}) => {
  const sizeMap = {
    small: 20,
    medium: 32,
    large: 48,
  };

  const spinnerSize = sizeMap[size];

  return (
    <div className="loading-container">
      <div
        className="loading-spinner"
        style={{
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`,
        }}
      />
      {text && (
        <div
          className="loading-text"
          style={{ marginTop: size === "small" ? 8 : 12 }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Loading;
