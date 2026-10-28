import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields = [],
  initialValues = {},
  onSubmit,
  isLoading = false,
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues || {},
  });

  useEffect(() => {
    reset(initialValues || {});
  }, [initialValues, reset, open]);

  const handleFormSubmit = async (values) => {
    // Cast numeric fields
    const formatted = { ...values };
    fields.forEach((f) => {
      if (f.type === 'number' && formatted[f.name] !== undefined && formatted[f.name] !== '') {
        formatted[f.name] = Number(formatted[f.name]);
      }
    });
    await onSubmit(formatted);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          {fields.map((field) => {
            return (
              <div key={field.name} className="space-y-1.5">
                <Label htmlFor={`form-field-${field.name}`}>
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </Label>

                {field.type === 'textarea' ? (
                  <Textarea
                    id={`form-field-${field.name}`}
                    rows={field.rows || 3}
                    placeholder={field.placeholder || ''}
                    {...register(field.name, { required: field.required })}
                  />
                ) : field.type === 'select' ? (
                  <Controller
                    control={control}
                    name={field.name}
                    rules={{ required: field.required }}
                    render={({ field: selectField }) => (
                      <Select
                        value={selectField.value !== undefined ? String(selectField.value) : ''}
                        onValueChange={selectField.onChange}
                      >
                        <SelectTrigger id={`form-field-${field.name}`}>
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                          {(field.options || []).map((opt) => (
                            <SelectItem key={opt.value} value={String(opt.value)}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <Input
                    id={`form-field-${field.name}`}
                    type={field.type || 'text'}
                    placeholder={field.placeholder || ''}
                    step={field.step || undefined}
                    {...register(field.name, { required: field.required })}
                  />
                )}

                {errors[field.name] && (
                  <p className="text-xs text-destructive font-medium">Ce champ est obligatoire.</p>
                )}
              </div>
            );
          })}

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FormDialog;
