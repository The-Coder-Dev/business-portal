"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingFormData, onboardingFormSchema } from "@/lib/validations/onboarding";
import { submitBusinessRegistration } from "@/lib/actions/onboarding.actions";
import { WizardProgress } from "./wizard-progress";
import { BusinessTypeStep } from "./steps/business-type-step";
import { BasicInfoStep } from "./steps/basic-info-step";
import { CategoryStep } from "./steps/category-step";
import { LocationStep } from "./steps/location-step";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface OnboardingWizardProps {
  categories: { id: string; name: string }[];
  countries: { id: string; name: string }[];
  states: { id: string; name: string; countryId: string }[];
}

const DRAFT_KEY = "business_onboarding_draft";
const STEPS = ["Business Type", "Basic Info", "Category", "Location"];

export function OnboardingWizard({ categories, countries, states }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const methods = useForm<OnboardingFormData>({
    // @ts-expect-error ZodResolver type mismatch
    resolver: zodResolver(onboardingFormSchema),
    mode: "onTouched",
    defaultValues: {
      businessType: undefined,
      name: "",
      ownerName: "",
      phone: "",
      whatsapp: "",
      email: "",
      website: "",
      description: "",
      yearEstablished: undefined,
      categoryId: "",
      subcategoryId: "",
      countryId: "",
      stateId: "",
      cityId: "",
      pincode: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      serviceAreas: [],
    },
  });

  const { watch, trigger, reset } = methods;

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        reset(parsed);
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
    setIsLoaded(true);
  }, [reset]);

  // Save draft on change
  useEffect(() => {
    if (!isLoaded) return;
    const subscription = watch((value) => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch, isLoaded]);

  const handleNext = async () => {
    // Validate current step
    let fieldsToValidate: (keyof OnboardingFormData)[] = [];
    if (currentStep === 0) {
      fieldsToValidate = ["businessType"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["name", "ownerName", "phone", "whatsapp", "email", "website", "description", "yearEstablished"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["categoryId", "subcategoryId"];
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      await submitBusinessRegistration(data);
      localStorage.removeItem(DRAFT_KEY);
      toast.success("Business submitted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <Card className="w-full shadow-lg border-primary/10">
      <CardContent className="pt-6 p-10">
        <WizardProgress currentStep={currentStep} steps={STEPS} />
        
        <div className="mt-8 min-h-[400px] gap-y-10 P-14">
          <FormProvider {...methods}>
            {/* @ts-expect-error handleSubmit inference mismatch */}
            <form id="onboarding-form" className="mt-20" onSubmit={methods.handleSubmit(onSubmit)}>
              {currentStep === 0 && <BusinessTypeStep />}
              {currentStep === 1 && <BasicInfoStep />}
              {currentStep === 2 && <CategoryStep categories={categories} />}
              {currentStep === 3 && <LocationStep countries={countries} states={states} />}
            </form>
          </FormProvider>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6 bg-muted/30">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0 || isSubmitting}
        >
          Back
        </Button>
        
        {currentStep < STEPS.length - 1 ? (
          <Button onClick={handleNext}>
            Continue
          </Button>
        ) : (
          <Button 
            type="submit" 
            form="onboarding-form" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Registration"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
