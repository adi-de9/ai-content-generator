"use client";
import React, { useState } from 'react';
import { AlertCircle, Sparkles, Plus, Trash2, Eye, Edit } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ImagePreview from '@/components/NewTamplateForm/ImagePreview';
import { db } from '@/utils/db';
import { tamplate } from '@/utils/schema';
import { useAuth } from '@clerk/nextjs';

const categories = [
  "Writing",
  "Marketing",
  "Development",
  "Design",
  "Business",
  "Education",
  "Social Media",
  "Other"
];

type FieldType = "input" | "textarea" | "select";

interface FormField {
  label: string;
  field: FieldType;
  name: string;
  required: boolean;
}

export interface TemplateDataType {
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  aiPrompt: string;
  form: FormField[];
  createdBy: string | undefined;
  createdAt: string | undefined;
}



function NewTemplate({ onClose }: { onClose: () => boolean }) {
  const [formData, setFormData] = useState<TemplateDataType>({
    name: "",
    slug: "",
    description: "",
    icon: "",
    category: "",
    aiPrompt: "",
    form: [{ label: "", field: "input", name: "", required: false }],
    createdBy: "",
    createdAt: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const { userId } = useAuth();


  const handleInputChange = (field: keyof TemplateDataType, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFormFieldChange = (index: number, field: keyof FormField, value: any) => {
    const newForm = [...formData.form];
    newForm[index] = { ...newForm[index], [field]: value };

    // Auto-generate name from label
    if (field === "label") {
      const name = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/(^_|_$)/g, "");
      newForm[index].name = name;
    }

    setFormData((prev) => ({ ...prev, form: newForm }));
  };

  const addFormField = () => {
    setFormData((prev) => ({
      ...prev,
      form: [
        ...prev.form,
        { label: "", field: "input", name: "", required: false },
      ],
    }));
  };

  const removeFormField = (index: number) => {
    if (formData.form.length > 1) {
      setFormData((prev) => ({
        ...prev,
        form: prev.form.filter((_, i) => i !== index),
      }));
    }
  };


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Template name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.icon.trim()) newErrors.icon = "Icon URL is required";
    if (!formData.aiPrompt.trim()) newErrors.aiPrompt = "AI prompt is required";

    formData.form.forEach((field, index) => {
      if (!field.label.trim()) {
        newErrors[`form_${index}_label`] = "Field label is required";
      }
      if (!field.name.trim()) {
        newErrors[`form_${index}_name`] = "Field name is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const templateData = {
      ...formData,
      createdAt: new Date().toISOString(),
    };

    console.log("Template Data:", templateData);

    // Ensure createdBy is a proper integer for the tamplate.createdBy integer column.
    // If the value is an empty string or undefined, try to fall back to userId (if it's numeric)
    // or leave as undefined so we can handle it gracefully client-side before inserting.
    let createdByValue: number | undefined;

    // If formData.createdBy already contains a number or numeric string, coerce it.
    if (templateData.createdBy !== undefined && templateData.createdBy !== "") {
      const n = Number(templateData.createdBy as any);
      if (!Number.isNaN(n)) createdByValue = n;
    }

    // As a fallback, if Clerk's userId looks like a number (rare), use it.
    if (createdByValue === undefined && typeof userId === "string") {
      const n = Number(userId);
      if (!Number.isNaN(n)) createdByValue = n;
    }

    // If we still don't have a numeric createdBy, set to 1 as a safe default to avoid
    // inserting an empty string into an integer column. Ideally you should replace
    // this with a proper lookup of the user's subscription id on the server.
    if (createdByValue === undefined) {
      createdByValue = 1;
    }

    await db.insert(tamplate).values({
      name: templateData.name,
      slug: templateData.slug,
      description: templateData.description,
      catgory: templateData.category,
      icon: templateData.icon,
      ai_prompt: templateData.aiPrompt,
      form: JSON.stringify(templateData.form),
      createdBy: createdByValue,
      createdAt: templateData.createdAt,
    } as any);

    setSubmitted(true);

    setTimeout(() => {
      setFormData({
        name: "",
        slug: "",
        description: "",
        icon: "",
        category: "",
        aiPrompt: "",
        form: [{ label: "", field: "input", name: "", required: false }],
        createdBy: userId || "",
        createdAt: new Date().toISOString(),
      });
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Toggle Preview/Edit Mode */}
      <div className="flex w-fit gap-2 rounded-lg p-1">
        <Button
          type="button"
          onClick={() => setShowPreview(false)}
          variant={!showPreview ? "default" : "ghost"}
          size="sm"
          className="gap-1"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          type="button"
          onClick={() => setShowPreview(true)}
          variant={showPreview ? "default" : "ghost"}
          size="sm"
          className="gap-1"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
      </div>

      {showPreview ? (
        <div className="space-y-6">
          <div className="rounded-xl border-2 border-purple-200  p-6">
            <div className="mb-4 flex items-start gap-4">
              {formData.icon && (
                <img
                  src={formData.icon}
                  alt="Template icon"
                  className="h-16 w-16 object-contain"
                />
              )}
              <div className="flex-1">
                <h2 className="mb-1 text-2xl font-bold text-slate-900 dark:text-gray-100">
                  {formData.name || "Template Name"}
                </h2>
                <p className="text-sm text-slate-600">
                  {formData.description ||
                    "Template description will appear here"}
                </p>
                <div className="mt-2 inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                  {formData.category || "Category"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-gray-100">
              Fill in the details
            </h3>

            {formData.form.length > 0 && formData.form[0].label ? (
              formData.form.map((field, index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-sm font-medium">
                    {field.label || `Field ${index + 1}`}
                    {field.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </Label>
                  {field.field === "textarea" ? (
                    <Textarea
                      placeholder={`Enter ${field.label.toLowerCase() || "text"}...`}
                      rows={4}
                      disabled
                      className="bg-slate-50  border border-gray-700"
                    />
                  ) : field.field === "select" ? (
                    <Select disabled>
                      <SelectTrigger className="bg-slate-50  border border-gray-700 ">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </Select>
                  ) : (
                    <Input
                      placeholder={`Enter ${field.label.toLowerCase() || "text"}...`}
                      disabled
                      className="bg-slate-50 border-2 border-gray-700"
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm italic text-slate-400">
                No form fields added yet
              </p>
            )}

            <Button className="mt-6 w-full" size="lg" disabled>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate with AI
            </Button>
          </div>

          {formData.aiPrompt && (
            <div className="rounded-lg border bg-slate-50 p-4">
              <p className="mb-2 text-xs font-medium text-slate-600">
                AI Prompt Preview:
              </p>
              <p className="whitespace-pre-wrap text-sm text-slate-700">
                {formData.aiPrompt}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name *</Label>
            <Input
              id="name"
              placeholder="e.g., AI Blog Posts"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : "border border-gray-700"}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              placeholder="ai-blog-posts"
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              className={errors.slug ? "border-red-500" : "border border-gray-700"}
            />
            <p className="text-xs text-slate-500">
              Auto-generated from name, but you can edit it
            </p>
            {errors.slug && (
              <p className="text-sm text-red-600">{errors.slug}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="AI-powered templates that create ai blog posts that convert and engage"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className={errors.description ? "border-red-500" : "border border-gray-700"}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger
                id="category"
                className={errors.category ? "border-red-500" : "border border-gray-700"}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category}</p>
            )}
          </div>
          {/* add Icon */}
          <ImagePreview
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />

          <div className="space-y-2">
            <Label htmlFor="aiPrompt">AI Prompt *</Label>
            <Textarea
              id="aiPrompt"
              placeholder="Write a high-quality blog post about..."
              value={formData.aiPrompt}
              onChange={(e) => handleInputChange("aiPrompt", e.target.value)}
              rows={4}
              className={errors.aiPrompt ? "border-red-500" : "border border-gray-700"}
            />
            <p className="text-xs text-slate-500">
              This prompt will be sent to the AI. You can reference form fields
              in your prompt.
            </p>
            {errors.aiPrompt && (
              <p className="text-sm text-red-600">{errors.aiPrompt}</p>
            )}
          </div>

          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Form Fields *</Label>
              <Button
                type="button"
                onClick={addFormField}
                size="sm"
                variant="outline"
            
                className= "gap-1 border border-gray-300 hover:border-gray-600"
              >
                <Plus className="h-4 w-4" />
                Add Field
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Define input fields for users to fill
            </p>

            {formData.form.map((field, index) => (
              <div
                key={index}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Field {index + 1}
                  </span>
                  {formData.form.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeFormField(index)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Label *</Label>
                    <Input
                      placeholder="e.g., Blog Topic / Idea"
                      value={field.label}
                      onChange={(e) =>
                        handleFormFieldChange(index, "label", e.target.value)
                      }
                      className={
                        errors[`form_${index}_label`] ? "border-red-500" :"border border-gray-700"
                      }
                    />
                    {errors[`form_${index}_label`] && (
                      <p className="text-xs text-red-600">
                        {errors[`form_${index}_label`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Field Type *</Label>
                    <Select
                      value={field.field}
                      onValueChange={(value) =>
                        handleFormFieldChange(index, "field", value)
                      }
                      
                    >
                      <SelectTrigger className="border border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="input">Input</SelectItem>
                        <SelectItem value="textarea">Textarea</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Field Name *</Label>
                    <Input
                      placeholder="e.g., blog_topic"
                      value={field.name}
                      onChange={(e) =>
                        handleFormFieldChange(index, "name", e.target.value)
                      }
                      className={
                        errors[`form_${index}_name`] ? "border-red-500" : "border border-gray-700"
                      }
                    />
                    {errors[`form_${index}_name`] && (
                      <p className="text-xs text-red-600">
                        {errors[`form_${index}_name`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Required</Label>
                    <div className="flex h-10 items-center">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          handleFormFieldChange(
                            index,
                            "required",
                            e.target.checked,
                          )
                        }
                        className="h-4 w-4 rounded border-slate-300 text-purple-600"
                      />
                      <span className="ml-2 text-sm text-slate-600">
                        Required field
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {submitted && (
            <Alert className="border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Template created successfully! Check console for data.
              </AlertDescription>
            </Alert>
          )}

          <div className="sticky bottom-0 -mb-2 flex flex-col gap-3 pb-2 pt-4 sm:flex-row">
            <Button onClick={handleSubmit} className="flex-1" size="lg" variant={'bgColor'}>
              Create Template
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="sm:w-auto border border-gray-500"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewTemplate;
