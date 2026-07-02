"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/validations/onboarding";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getCities } from "@/lib/actions/onboarding.actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LocationStepProps {
  countries: { id: string; name: string }[];
  states: { id: string; name: string; countryId: string }[];
}

export function LocationStep({ countries, states }: LocationStepProps) {
  const { register, setValue, watch, formState: { errors } } = useFormContext<OnboardingFormData>();
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedCountryId = watch("countryId");
  const selectedStateId = watch("stateId");
  const selectedCityId = watch("cityId");

  // Filter states based on selected country
  const filteredStates = states.filter(s => s.countryId === selectedCountryId);

  useEffect(() => {
    if (selectedStateId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      getCities(selectedStateId)
        .then(data => {
          setCities(data);
          if (selectedCityId && !data.find(c => c.id === selectedCityId)) {
            setValue("cityId", "");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setCities([]);
    }
  }, [selectedStateId, setValue, selectedCityId]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Location & Address</h2>
        <p className="text-muted-foreground mt-2">Where can customers find you?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="countryId">Country *</Label>
          <Select 
            value={selectedCountryId || undefined} 
            onValueChange={(val) => {
              setValue("countryId", val, { shouldValidate: true });
              setValue("stateId", "");
              setValue("cityId", "");
            }}
          >
            <SelectTrigger id="countryId" className={errors.countryId ? "border-destructive" : ""}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.length > 0 ? (
                countries.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled>No countries available</SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.countryId && <p className="text-sm text-destructive">{errors.countryId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stateId">State *</Label>
          <Select 
            value={selectedStateId || undefined} 
            onValueChange={(val) => {
              setValue("stateId", val, { shouldValidate: true });
              setValue("cityId", "");
            }}
            disabled={!selectedCountryId}
          >
            <SelectTrigger id="stateId" className={errors.stateId ? "border-destructive" : ""}>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {filteredStates.length > 0 ? (
                filteredStates.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled>No states available</SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.stateId && <p className="text-sm text-destructive">{errors.stateId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cityId">City *</Label>
          <Select 
            value={selectedCityId || undefined} 
            onValueChange={(val) => setValue("cityId", val, { shouldValidate: true })}
            disabled={!selectedStateId || loading}
          >
            <SelectTrigger id="cityId" className={errors.cityId ? "border-destructive" : ""}>
              <SelectValue placeholder={loading ? "Loading..." : "Select city"} />
            </SelectTrigger>
            <SelectContent>
              {cities.length > 0 ? (
                cities.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled>
                  {loading ? "Loading..." : "No cities available"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.cityId && <p className="text-sm text-destructive">{errors.cityId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode *</Label>
          <Input 
            id="pincode" 
            placeholder="e.g. 110001" 
            {...register("pincode")} 
          />
          {errors.pincode && <p className="text-sm text-destructive">{errors.pincode.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="addressLine1">Address Line 1 *</Label>
          <Input 
            id="addressLine1" 
            placeholder="Street address, company name, c/o" 
            {...register("addressLine1")} 
          />
          {errors.addressLine1 && <p className="text-sm text-destructive">{errors.addressLine1.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressLine2">Address Line 2</Label>
          <Input 
            id="addressLine2" 
            placeholder="Apartment, suite, unit, building, floor, etc." 
            {...register("addressLine2")} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="landmark">Landmark</Label>
          <Input 
            id="landmark" 
            placeholder="e.g. Near Metro Station" 
            {...register("landmark")} 
          />
        </div>
      </div>
    </div>
  );
}
