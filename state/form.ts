"use client";
import { useCallback, useState } from "react";
import { FormState, FormValues, ValidationRules } from "@/lib/types";

type SubmitHandler<T> = () => Promise<T>;

export function useSquadForm<T>(
  initialValues: FormValues,
  validationRules: ValidationRules
) {
  const [formState, setFormState] = useState<FormState>({
    values: initialValues,
    errors: {},
    isValid: true,
    isLoading: false,
  });

  const validateField = useCallback(
    async (field: string, value: any) => {
      if (validationRules[field]) {
        const error = await validationRules[field](value);
        return error;
      }
      return null;
    },
    [validationRules]
  );

  const handleChange = useCallback(
    async (field: string, value: any) => {
      setFormState((prev) => ({
        ...prev,
        isLoading: true,
        values: { ...prev.values, [field]: value },
      }));

      const error = await validateField(field, value);

      setFormState((prev) => {
        const newErrors = { ...prev.errors, [field]: error || "" };
        const isValid = Object.values(newErrors).every((err) => !err);

        return {
          ...prev,
          errors: newErrors,
          isValid,
          isLoading: false,
        };
      });
    },
    [validateField]
  );

  const handleAddMember = (e: any) => {
    e.preventDefault();
    handleChange("members", {
      count: formState.values.members.count + 1,
      memberData: [
        ...formState.values.members.memberData,
        {
          key: null,
          permissions: {
            mask: 0,
          },
        },
      ],
    });
  };

  const onSubmit = async (handler: SubmitHandler<T>): Promise<T> => {
    setFormState((prev) => ({
      ...prev,
      isLoading: true,
    }));
    try {
      return await handler();
    } catch (error: any) {
      console.error(error);
      throw error;
    } finally {
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  return { formState, handleChange, handleAddMember, onSubmit };
}
