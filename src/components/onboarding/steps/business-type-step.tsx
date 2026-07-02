"use client";

import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/validations/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { businessTypeEnum } from "@/db/schema/enums";
import { Store, Stethoscope, Factory, Briefcase, GraduationCap, Building, Plane, Utensils, Box } from "lucide-react";
import { cn } from "@/lib/utils";

const businessTypes = businessTypeEnum.enumValues;

// A simple icon mapping for the types
const iconMap: Record<string, React.ElementType> = {
  local_business: Store,
  service_provider: Briefcase,
  manufacturer: Factory,
  hotel: Building,
  restaurant: Utensils,
  doctor: Stethoscope,
  clinic: Stethoscope,
  real_estate: Building,
  education: GraduationCap,
  travel: Plane,
  online_seller: Box,
  other: Store,
};

export function BusinessTypeStep() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<OnboardingFormData>();
  
  const selectedType = watch("businessType");

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">What kind of business do you run?</h2>
        <p className="text-muted-foreground mt-2">Select the option that best describes your primary operations.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {businessTypes.map((type) => {
          const Icon = iconMap[type] || Store;
          const isSelected = selectedType === type;
          
          return (
            <Card 
              key={type}
              className={cn(
                "cursor-pointer transition-all hover:border-primary/50",
                isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border"
              )}
              onClick={() => setValue("businessType", type, { shouldValidate: true })}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full gap-3">
                <div className={cn(
                  "p-3 rounded-full",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-medium capitalize leading-tight">
                  {type.replace(/_/g, " ")}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {errors.businessType && (
        <p className="text-sm font-medium text-destructive text-center mt-4">
          {errors.businessType.message}
        </p>
      )}

      {/* Hidden input to register with react-hook-form properly */}
      <input type="hidden" {...register("businessType")} />
    </div>
  );
}
