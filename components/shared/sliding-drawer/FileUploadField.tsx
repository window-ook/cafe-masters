'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { TOAST_ERROR } from '@/utils/constants/messages';
import { useUIStore } from '@/stores';
import { toast } from 'react-toastify';
import Image from 'next/image';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export interface IFileUploadField {
  onFileSelectAction: (file: File | null) => void;
  disabled?: boolean;
}

export default function FileUploadField({
  onFileSelectAction,
  disabled = false,
}: IFileUploadField) {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 검증
  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(TOAST_ERROR.UPLOAD_IMAGE_SIZE);
      return false;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(TOAST_ERROR.UPLOAD_IMAGE_TYPE);
      return false;
    }

    return true;
  };

  // 파일 처리
  const handleFile = (file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    onFileSelectAction(file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = e => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // 파일 삭제
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onFileSelectAction(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 드래그 앤 드롭 이벤트
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) handleFile(files[0]);
  };

  // 파일 선택 이벤트
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleFile(files[0]);
  };

  // 클릭하여 파일 선택
  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {/* 업로드 존 */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 transition-colors ${isDragging ? 'border-main bg-main/10' : 'hover:border-main border-gray-300'} ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />

        {!selectedFile ? (
          <>
            <svg
              className="h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p
              className={`text-sm ${isDarkTheme ? 'text-white' : 'text-text-primary'} text-center`}
            >
              파일을 끌어다 놓거나 클릭하여 업로드
            </p>
            <p
              className={`text-xs ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
            >
              최대 2MB, JPG/PNG/WebP/GIF
            </p>
          </>
        ) : (
          <div className="flex w-full items-center gap-4">
            {/* 미리보기 */}
            {previewUrl && (
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                <Image
                  src={previewUrl}
                  alt="업로드 이미지 미리보기"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* 파일 정보 */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>

            {/* 삭제 버튼 */}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              disabled={disabled}
              className="flex-shrink-0 rounded-full p-2 transition-colors hover:bg-gray-100"
              aria-label="이미지 삭제"
            >
              <svg
                className="h-5 w-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
