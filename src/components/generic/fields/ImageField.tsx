"use client";

import Image from "next/image";
import {
  useRef,
  useState,
  type ChangeEventHandler,
  type DragEventHandler,
  type MouseEventHandler,
  type ReactElement,
  type RefObject,
} from "react";
import publicConfigs from "@/intermediate/public-configs.json";
import {
  commonClasses,
  errorClasses,
  ErrorMessage,
  FieldHeadings,
  validClasses,
  type CommonFieldProps,
} from "./FieldCommons.tsx";
import { Button } from "../ButtonLink.tsx";
import type { ZodType } from "zod";

type Props = CommonFieldProps & {
  validator?: ZodType;
  accept?: string;
  maxSizeMiB?: number;
};

export const ImageField = ({
  label,
  description,
  required = false,
  name,
  validator,
  accept = "image/*",
  maxSizeMiB = publicConfigs.maxLogoSizeMiB,
  errorMessages: serverSideErrorMessages,
  className,
  ...formProps
}: Props): ReactElement => {
  const ref = useRef<HTMLInputElement>(null);
  const [ errorMessage, setErrorMessage ] = useState<string | undefined>(undefined);
  const [ preview, setPreview ] = useState<string | undefined>(undefined);
  const [ isDragOver, setIsDragOver ] = useState(false);

  const ready = (refCurrent: RefObject<HTMLInputElement | null>["current"] | undefined): refCurrent is RefObject<HTMLInputElement>["current"] => {
    if (refCurrent) {
      return true;
    } else {
      alert("Page has not fully loaded yet. Please wait for a few seconds.");
      return false;
    }
  };

  const isFileValid = (files: FileList | null): { valid: boolean; message?: string; } => {
    if (!ready(ref?.current)) {
      return {
        valid: false,
      };
    }

    if (!files || files.length === 0) {
      return {
        valid: false,
      };
    }

    if (1 < files.length) { // This should not happen
      return {
        valid: false,
        message: "Cannot upload multiple files.",
      };
    }

    if (validator) {
      const { success, error } = validator.safeParse(files[0]);

      if (!success) {
        return {
          valid: false,
          message: error.issues[0].message,
        };
      }
    }

    return { valid: true };
  };

  const syncPreview = () => {
    const file = ref?.current?.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(undefined);
    }
  };

  const clearImage = (errorMessage?: string) => {
    setPreview(undefined);
    setErrorMessage(errorMessage);

    if (ref?.current) {
      ref.current.files = null;
    }
  };

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    const { valid, message } = isFileValid(evt.target.files);

    if (valid) {
      setErrorMessage(undefined);
      syncPreview();
    } else {
      clearImage(message);
    }
  };

  const onDragOver: DragEventHandler<HTMLDivElement> = (evt) => {
    evt.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave: DragEventHandler<HTMLDivElement> = (evt) => {
    evt.preventDefault();
    setIsDragOver(false);
  };

  const onDrop: DragEventHandler<HTMLDivElement> = (evt) => {
    evt.preventDefault();

    if (!ready(ref?.current)) {
      return;
    }

    setIsDragOver(false);
    const { valid, message } = isFileValid(evt.dataTransfer.files);
    if (valid) {
      ref.current.files = evt.dataTransfer.files;
      setErrorMessage(undefined);
    } else {
      clearImage(message);
    }

    syncPreview();
  };

  const onClearImageButtonClicked: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.stopPropagation();
    clearImage();
  };

  return (
    <div className={className}>
      <FieldHeadings
        label={label}
        description={description}
        required={required}
        name={name}
      />

      <div
        className={`
          ${ commonClasses }
          ${ (errorMessage || serverSideErrorMessages) ? errorClasses : validClasses }
          ${ isDragOver ? "border-blue-500 bg-blue-50" : "" }
          min-h-32 flex flex-col items-center justify-center
          cursor-pointer relative
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          ref={ref}
          type="file"
          id={name}
          name={name}
          accept={accept}
          onChange={onFileChange}
          className="hidden"
          {...formProps}
        />

        {preview ? (
          <div className="w-full h-full min-h-32">
            <Image
              src={preview}
              alt="Preview"
              width={300}
              height={200}
              className="max-w-full max-h-48 object-contain mx-auto"
              unoptimized // Since we're using data URLs for preview
            />
            <Button
              theme="none"
              onClick={onClearImageButtonClicked}
              className="absolute top-1 right-1 p-1.5 rounded-full w-fit flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
              aria-label="Remove image"
            >
              <Image src="/vendor/octicons/x.svg" alt="" width={24} height={24} decoding="async" />
            </Button>
          </div>
        ) : (
          <label htmlFor={name} className="text-center py-8 cursor-pointer">
            <div className="text-gray-400 mb-2">
              <Image src="/vendor/tabler/photo-up.svg" alt="" width={48} height={48} decoding="async" />
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                Click to upload
              </span> or drop image here.
            </div>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, WebP, GIF, SVG up to {maxSizeMiB}MB
            </p>
          </label>
        )}
      </div>

      {
        (serverSideErrorMessages && 0 < serverSideErrorMessages.length) ? (
          <ErrorMessage>
            {serverSideErrorMessages.join(" ")}
          </ErrorMessage>
        ) : errorMessage ? (
          <ErrorMessage>
            {errorMessage}
          </ErrorMessage>
        ) : <></>
      }
    </div>
  );
};
