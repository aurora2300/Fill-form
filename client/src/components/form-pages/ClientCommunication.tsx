import { FormData } from "@shared/schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ConditionalQuestion from "@/components/ConditionalQuestion";
import { getImageForPage } from "@/lib/utils";

interface ClientCommunicationProps {
  formState: FormData;
  updateFormData: (field: string, value: any) => void;
}

export default function ClientCommunication({ formState, updateFormData }: ClientCommunicationProps) {
  const showFollowUp = formState.question2 === "1"; // Show follow-up when user selects "1" (反感)
  
  // Get image based on user group
  const imageSrc = formState.userGroup 
    ? getImageForPage(formState.userGroup, 3) // This is page 3 (second form page after registration)
    : "/placeholder.jpg";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">圖片評估</h2>
      
      <div className="mb-6">
        <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden">
          <img
            src={imageSrc}
            alt="Assessment image" 
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        
        <div className="mb-6">
          <p className="font-medium mb-4">Q1: 你覺得這張圖怎樣？</p>
          <RadioGroup
            value={formState.question2 || ""}
            onValueChange={(value) => updateFormData("question2", value)}
          >
            <div className="space-y-2">
              <div className="flex items-center">
                <RadioGroupItem 
                  id="q2-0" 
                  value="0"
                  className="text-[#4F7B6E] focus:ring-[#4F7B6E]"
                />
                <Label htmlFor="q2-0" className="ml-2 text-gray-700">
                  0：正常
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem 
                  id="q2-1" 
                  value="1"
                  className="text-[#4F7B6E] focus:ring-[#4F7B6E]"
                />
                <Label htmlFor="q2-1" className="ml-2 text-gray-700">
                  1：反感
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <ConditionalQuestion
          visible={showFollowUp}
          questionText="Q2: 程度如何"
          fieldName="question2b"
          options={[
            { value: "1", label: "1：輕微反感（皺眉頭的程度，但還可忍受）" },
            { value: "2", label: "2：很反感（會想趕快把照片滑掉）" },
            { value: "3", label: "3：非常反感（噁心想吐、做惡夢、雞皮疙瘩）" }
          ]}
          formState={formState}
          updateFormData={updateFormData}
        />
      </div>
    </div>
  );
}
