import { FormData } from "@shared/schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegistrationPageProps {
  formState: FormData;
  updateFormData: (field: string, value: any) => void;
}

export default function RegistrationPage({ formState, updateFormData }: RegistrationPageProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">用戶註冊</h2>
      
      <div className="mb-6">
        <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          姓名
        </Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formState.name || ""}
          onChange={(e) => updateFormData("name", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F7B6E] focus:border-transparent"
          placeholder="請輸入您的姓名"
          required
        />
        {formState.name === "" && (
          <p className="text-sm text-red-600 mt-1">請輸入您的姓名</p>
        )}
      </div>
      
      <div className="mb-8">
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          選擇您的組別 (1-60)
        </Label>
        <RadioGroup 
          value={formState.userGroup || ""} 
          onValueChange={(value) => updateFormData("userGroup", value)}
        >
          <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
            {[...Array(60)].map((_, i) => {
              const groupNumber = i + 1;
              const groupValue = groupNumber.toString();
              return (
                <div key={groupValue} className="flex items-center">
                  <RadioGroupItem 
                    id={`group-${groupValue}`}
                    value={groupValue}
                    className="text-[#4F7B6E] focus:ring-[#4F7B6E]"
                  />
                  <Label htmlFor={`group-${groupValue}`} className="ml-2 text-sm text-gray-700">
                    組別 {groupValue}
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
        {formState.userGroup === "" && (
          <p className="text-sm text-red-600 mt-1">請選擇一個組別</p>
        )}
      </div>
    </div>
  );
}
