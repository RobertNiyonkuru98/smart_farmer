"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { compressImage } from "@/lib/image";

interface UploadBoxProps {
  onImageSelect: (image: string | null) => void;
  currentImage: string | null;
  accept?: string;
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function UploadBox({
  onImageSelect,
  currentImage,
  accept = "image/*",
  label = "Upload Image",
  icon: Icon = Upload,
}: UploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    try {
      const compressed = await compressImage(file);
      onImageSelect(compressed);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Error processing image. Please try another file.");
    }
  };

  const handleClear = () => {
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />

      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Uploaded preview"
            className="w-full h-64 object-cover rounded-lg border-2 border-light-border dark:border-dark-border"
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
            aria-label="Remove image"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-light-border dark:border-dark-border rounded-lg cursor-pointer hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
        >
          <Icon className="w-12 h-12 text-gray-400 mb-3" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {label}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Click to browse or drag and drop
          </span>
        </label>
      )}
    </div>
  );
}
