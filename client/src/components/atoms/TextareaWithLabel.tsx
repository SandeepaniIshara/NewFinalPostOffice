import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextareaWithLabelProps {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  error?: string;
  autoComplete?: string;
  rows?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function TextareaWithLabel({
  label,
  id,
  placeholder,
  value,
  error,
  autoComplete,
  rows,
  disabled = false,
  autoFocus = false,
  required = false,
  onChange,
}: TextareaWithLabelProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm text-muted-foreground">
        {label}
      </Label>
      <Textarea
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        autoComplete={autoComplete}
        disabled={disabled}
        autoFocus={autoFocus}
        required={required}
        className="w-full"
      />
      {error && <p className="text-red-500 text-sm px-2">{error}</p>}
    </div>
  );
}
