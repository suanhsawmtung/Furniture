import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { Button } from "../ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

interface PasswordInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function PasswordInput<
    TFieldValues extends FieldValues, 
    TName extends FieldPath<TFieldValues>
>({
    field,
    placeholder,
    disabled = false,
    ...props
}: PasswordInputProps<TFieldValues, TName>) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

   return (
    <InputGroup>
        <InputGroupInput
            type={showPassword ? "text" : "password"}
            placeholder={placeholder || "Enter your password"}
            {...field}
            {...props}

        />
        <InputGroupAddon align="inline-end">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={togglePassword}
            >
                {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                ) : (
                <Eye className="h-4 w-4" />
                )}
            </Button>
        </InputGroupAddon>
    </InputGroup>
   )
}
