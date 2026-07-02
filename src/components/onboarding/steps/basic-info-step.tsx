"use client";

import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/validations/onboarding";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function BasicInfoStep() {
  const { register, formState: { errors } } = useFormContext<OnboardingFormData>();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Basic Information</h2>
        <p className="text-muted-foreground mt-2">Let&apos;s start with the essential details about your business.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Business Name *</Label>
          <Input 
            id="name" 
            placeholder="e.g. Acme Corp" 
            {...register("name")} 
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerName">Owner Name *</Label>
          <Input 
            id="ownerName" 
            placeholder="e.g. John Doe" 
            {...register("ownerName")} 
          />
          {errors.ownerName && (
            <p className="text-sm text-destructive">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input 
            id="phone" 
            type="tel"
            placeholder="Primary contact number" 
            {...register("phone")} 
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp Number</Label>
          <Input 
            id="whatsapp" 
            type="tel"
            placeholder="Optional" 
            {...register("whatsapp")} 
          />
          {errors.whatsapp && (
            <p className="text-sm text-destructive">{errors.whatsapp.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Business Email</Label>
          <Input 
            id="email" 
            type="email"
            placeholder="contact@example.com" 
            {...register("email")} 
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input 
            id="website" 
            type="url"
            placeholder="https://example.com" 
            {...register("website")} 
          />
          {errors.website && (
            <p className="text-sm text-destructive">{errors.website.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Business Description *</Label>
          <Textarea 
            id="description" 
            placeholder="Tell your customers what you do..." 
            className="min-h-[120px]"
            {...register("description")} 
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="yearEstablished">Year Established</Label>
          <Input 
            id="yearEstablished" 
            type="number"
            placeholder="e.g. 2010" 
            {...register("yearEstablished")} 
          />
          {errors.yearEstablished && (
            <p className="text-sm text-destructive">{errors.yearEstablished.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
