import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [_, setLocation] = useLocation();

  const startForm = () => {
    setLocation("/form/1");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-4xl mx-auto p-4 md:p-6 w-full flex-1 flex flex-col">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">圖片評估問卷</h1>
          <p className="text-gray-600 mt-2">請評估各圖片並提供您的反饋</p>
        </header>

        <Card className="flex-1 flex flex-col">
          <CardContent className="flex flex-col items-center justify-center p-6 flex-1">
            <div className="max-w-lg text-center">
              <h2 className="text-xl font-semibold mb-4">歡迎參與圖片評估問卷</h2>
              
              <p className="mb-6 text-gray-600">
                本問卷將收集您對各種圖片的反應和感受。
                整個過程預計只需5分鐘左右。
              </p>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">問卷內容：</h3>
                <ul className="text-gray-600 text-left space-y-2 mb-6">
                  <li>• 您會看到多張不同的圖片</li>
                  <li>• 詢問您對每張圖片的感受</li>
                  <li>• 如有反感情緒，需評估反感程度</li>
                  <li>• 所有資料僅作研究用途</li>
                  <li>• 您的反饋將幫助我們改進內容</li>
                </ul>
              </div>
              
              <Button 
                className="bg-[#4F7B6E] hover:bg-[#3A5A51] text-white px-6 py-2"
                onClick={startForm}
              >
                開始問卷
              </Button>
            </div>
          </CardContent>
        </Card>

        <footer className="text-center text-gray-500 text-sm mt-8">
          <p>© 2025 圖片評估問卷. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
