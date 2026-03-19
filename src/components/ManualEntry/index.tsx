/**
 * 手动录入模块入口
 *
 * 步骤状态机：
 *   step 1 → BasicInfoForm（姓名、性别、出生日期、测试日期）
 *   step 2 → MetricsStep（指标录入 + 实时评分）
 */

import { useState } from "react";
import { BasicInfoForm, type BasicInfo } from "./BasicInfoForm";
import { MetricsStep } from "./MetricsStep";

export default function ManualEntry() {
  const [step, setStep] = useState<1 | 2>(1);
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);

  function handleBasicInfoComplete(info: BasicInfo) {
    setBasicInfo(info);
    setStep(2);
  }

  function handleBack() {
    setStep(1);
  }

  if (step === 1) {
    return <BasicInfoForm onComplete={handleBasicInfoComplete} />;
  }

  return <MetricsStep basicInfo={basicInfo!} onBack={handleBack} />;
}
