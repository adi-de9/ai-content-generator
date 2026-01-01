"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface PROPS {
  selectedTamplates: any;
  userFormInput: any;
  loading: boolean;
}

export function FormSection({
  selectedTamplates,
  userFormInput,
  loading,
}: PROPS) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const isLoading = !selectedTamplates;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    userFormInput(formData);
  };

  return (
    <div className="h-fit w-fit rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
      {/* 🖼️ Image */}
      {isLoading ? (
        <div className="skeleton mb-4 h-[70px] w-[70px]" />
      ) : (
        selectedTamplates?.icon && (
          <Image
            src={selectedTamplates.icon}
            alt="image"
            height={70}
            width={70}
            className="mb-4"
          />
        )
      )}

      {/* 🧾 Title */}
      {isLoading ? (
        <div className="skeleton mb-3 h-6 w-48" />
      ) : (
        <h2 className="headerText mb-2 text-xl font-semibold">
          {selectedTamplates?.name}
        </h2>
      )}

      {/* 📝 Description */}
      {isLoading ? (
        <div className="mb-4 space-y-2">
          <div className="skeleton h-4 w-64" />
          <div className="skeleton h-4 w-48" />
        </div>
      ) : (
        <p className="mb-4 text-black dark:text-slate-200">
          {selectedTamplates.description}
        </p>
      )}

      {/* 🧩 Form */}
      {isLoading ? (
        <div className="mt-2 space-y-3">
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-12 w-full" />
        </div>
      ) : (
        <form className="mt-4 py-2" onSubmit={onSubmit}>
          {selectedTamplates?.form?.map((data: any) => (
            <div
              key={data?.name}
              className="grid w-full items-center gap-1.5 py-2"
            >
              <Label
                // @ts-ignore
                htmlFor={data?.name}
                className="font-bold text-black dark:text-white"
              >
                {data?.label} {data?.required ? null : "[Optional]"}
              </Label>
              {data?.field === "input" ? (
                <Input
                  type="text"
                  name={data?.name}
                  placeholder={data?.label}
                  className="shadow-lg dark:text-white"
                  onChange={handleInputChange}
                  required={data?.required}
                />
              ) : data?.field === "textarea" ? (
                <Textarea
                  name={data?.name}
                  placeholder={data?.label}
                  className="shadow-lg"
                  onChange={handleInputChange}
                  required={data?.required}
                />
              ) : null}
            </div>
          ))}

          <Button
            type="submit"
            variant={"bgColor"}
            className="mt-2 w-full py-6 text-lg"
          >
            {loading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "✨ Generate Content"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
