import { useState, useEffect } from "react";
import { FormData } from "@shared/schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface ConditionalQuestionProps {
  visible: boolean;
  questionText: string;
  fieldName: string;
  options: { value: string; label: string }[];
  formState: FormData;
  updateFormData: (field: string, value: any) => void;
}

export default function ConditionalQuestion({
  visible,
  questionText,
  fieldName,
  options,
  formState,
  updateFormData
}: ConditionalQuestionProps) {
  return (
    <div 
      className={`transition-all duration-300 overflow-hidden ${
        visible 
          ? "max-h-[200px] opacity-100 mt-6" 
          : "max-h-0 opacity-0"
      }`}
    >
      {visible && (
        <>
          <p className="font-medium mb-4">{questionText}</p>
          <div className="space-y-2">
            <RadioGroup 
              value={formState[fieldName as keyof FormData] as string || ""}
              onValueChange={(value) => updateFormData(fieldName, value)}
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <RadioGroupItem 
                    id={`${fieldName}-${option.value}`} 
                    value={option.value} 
                    className="text-[#4F7B6E] focus:ring-[#4F7B6E]"
                  />
                  <Label 
                    htmlFor={`${fieldName}-${option.value}`} 
                    className="ml-2 text-gray-700"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </>
      )}
    </div>
  );
}
