"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/validations/onboarding";
import { Label } from "@/components/ui/label";
import { getSubcategories } from "@/lib/actions/onboarding.actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryStepProps {
  categories: { id: string; name: string }[];
}

export function CategoryStep({ categories }: CategoryStepProps) {
  const { setValue, watch, formState: { errors } } = useFormContext<OnboardingFormData>();
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedCategoryId = watch("categoryId");
  const selectedSubcategoryId = watch("subcategoryId");

  useEffect(() => {
    if (selectedCategoryId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      getSubcategories(selectedCategoryId)
        .then(data => {
          setSubcategories(data);
          // If the currently selected subcategory is not in the new list, clear it
          if (selectedSubcategoryId && !data.find(s => s.id === selectedSubcategoryId)) {
            setValue("subcategoryId", "");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setSubcategories([]);
    }
  }, [selectedCategoryId, setValue, selectedSubcategoryId]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Category Selection</h2>
        <p className="text-muted-foreground mt-2">Help customers find you by selecting the right category.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Primary Category *</Label>
          <Select 
            value={selectedCategoryId || undefined} 
            onValueChange={(val) => setValue("categoryId", val, { shouldValidate: true })}
          >
            <SelectTrigger id="categoryId" className={errors.categoryId ? "border-destructive" : ""}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled>No categories available</SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-destructive">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subcategoryId">Subcategory</Label>
          <Select 
            value={selectedSubcategoryId || undefined} 
            onValueChange={(val) => setValue("subcategoryId", val, { shouldValidate: true })}
            disabled={!selectedCategoryId || loading}
          >
            <SelectTrigger id="subcategoryId">
              <SelectValue placeholder={loading ? "Loading..." : "Select a subcategory (optional)"} />
            </SelectTrigger>
            <SelectContent>
              {subcategories.length > 0 ? (
                subcategories.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled>
                  {loading ? "Loading..." : "No subcategories found"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.subcategoryId && (
            <p className="text-sm text-destructive">{errors.subcategoryId.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
