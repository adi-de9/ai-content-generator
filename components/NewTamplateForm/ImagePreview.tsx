"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { TemplateDataType } from "@/app/dashboard/_components/NewTamplate";

interface ImagePreviewProps {
    formData: {
        icon: string;
    };
    handleInputChange: (field: keyof TemplateDataType, value: string) => void;
    errors: {
        icon?: string;
    };
}

function ImagePreview({ formData, handleInputChange, errors }: ImagePreviewProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadError("");

        const formDataObj = new FormData();
        formDataObj.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formDataObj,
            });
            const data = await res.json();

            if (data.url) {
                handleInputChange("icon", data.url);
            } else {
                setUploadError(data.error || "Upload failed");
            }
        } catch (err) {
            setUploadError("Something went wrong while uploading.");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-3">
            <Label htmlFor="icon">Icon *</Label>

            {/* URL input (optional manual input) */}
            <Input
                id="icon"
                placeholder="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                value={formData.icon}
                onChange={(e) => handleInputChange("icon", e.target.value)}
                className={errors.icon ? "border-red-500" : "border border-gray-700 "}
            />
            <p className="text-xs text-slate-500">Provide a URL or upload an image below:</p>

            {/* Upload Button */}
            <div className="border border-gray-400 flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={handleFileUpload}  />
                {uploading && <p className="text-xs text-blue-600">Uploading...</p>}
            </div>

            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
            {errors.icon && <p className="text-sm text-red-600">{errors.icon}</p>}

            {/* Preview */}
            {formData.icon && (
                <div className="mt-3 rounded-lg border p-3">
                    <p className="mb-2 text-xs font-medium">Icon Preview:</p>
                    <img
                        src={formData.icon}
                        alt="Icon preview"
                        className="h-12 w-12 object-contain"
                    />
                </div>
            )}
        </div>
    );
}

export default ImagePreview;
