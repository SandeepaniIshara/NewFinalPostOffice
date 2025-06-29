import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputWithLabelProps {
  label: string;
  id: string;
  placeholder: string;
  type: string;
  value: string;
  error?: string;
  className?: string;
  autoComplete?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputWithLabel({
  label,
  id,
  placeholder,
  type,
  value,
  error,
  className,
  autoComplete,
  disabled = false,
  autoFocus = false,
  required = false,
  onChange,
}: InputWithLabelProps) {
  return (
    <div className="space-y-1 w-full">
      <div className={cn("space-y-1", className)}>
        <Label htmlFor={id} className="text-sm text-muted-foreground w-1/3">
          {label}
        </Label>
        <Input
          id={id}
          name={id}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          autoFocus={autoFocus}
          required={required}
          className="w-full"
        />
      </div>
      {error && <p className="text-red-500 text-sm -mt-1">{error}</p>}
    </div>
  );
}
