import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSnapshot } from "valtio";

type EFieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "time"
  | "datetime-local";

export const EField = function <
  K extends Exclude<keyof V, symbol | number>,
  V extends Record<string, any> = Record<string, any>
>(
  this: { data: V },
  {
    name,
    label,
    type = "text",
    className,
    input,
    disabled,
    readOnly,
    optional,
    options,
  }: {
    name: K;
    label?: string;
    type?: EFieldType;
    className?: string;
    disabled?: boolean;
    readOnly?: boolean;
    optional?: boolean;
    input?:
      | React.ComponentProps<"input">
      | React.ComponentProps<"textarea">
      | React.ComponentProps<"select">;
    options?: Record<string, any>;
  }
) {
  const read = useSnapshot(this.data);

  const write = this.data as any;
  return (
    <div className={className}>
      {type !== "checkbox" && (
        <Label
          htmlFor={name}
          className={cn(!label && "capitalize")}
          onClick={() => {}}
        >
          {label || name}
          {optional && (
            <span className="text-gray-500 lowercase"> (opsional)</span>
          )}
        </Label>
      )}
      {type === "text" && (
        <Input
          id={name}
          spellCheck={false}
          value={(read as any)[name]}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(disabled && "bg-muted")}
          onChange={(e) => (write[name] = e.currentTarget.value)}
          {...(input as React.ComponentProps<"input">)}
        />
      )}
      {type === "number" && (
        <Input
          id={name}
          type="number"
          value={(read as any)[name]}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(disabled && readOnly && "bg-muted")}
          onChange={(e) => (write[name] = Number(e.currentTarget.value))}
          {...(input as React.ComponentProps<"input">)}
        />
      )}
      {type === "textarea" && (
        <Textarea
          id={name}
          spellCheck={false}
          value={(read as any)[name]}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(disabled && "bg-muted")}
          onChange={(e) => (write[name] = e.currentTarget.value)}
          {...(input as React.ComponentProps<"textarea">)}
        />
      )}
      {type === "select" && (
        <>
          <br />
          <select
            id={name}
            value={(read as any)[name]}
            disabled={disabled}
            className={cn(
              "mt-1 w-full bg-white border h-[35px] px-2.5 border-gray-300 rounded-sm text-sm",
              disabled && "bg-muted"
            )}
            onChange={(e) => (write[name] = e.currentTarget.value)}
            {...(input as React.ComponentProps<"select">)}
          >
            {(options || []).map((option: { key: any; label: string }) => (
              <option key={option.key} value={option.key} className="text-sm" disabled={disabled}>
                {option.label || option.key}
              </option>
            ))}
          </select>
        </>
      )}
      {type === "checkbox" && (
        <label className="flex items-center text-gray-800 text-sm">
          <input
            type="checkbox"
            name={name}
            checked={(read as any)[name]}
            disabled={disabled}
            readOnly={readOnly}
            className="mr-2"
            onChange={(e) => (write[name] = e.currentTarget.checked)}
          />
          {label || name}
        </label>
      )}
      {type === "radio" && (
        <div className="flex flex-col">
          {(options || []).map((option: { key: any; label: string }) => (
            <label
              key={option.key}
              className="flex items-center text-gray-800 text-sm"
            >
              <input
                type="radio"
                name={name}
                value={option.key}
                checked={(read as any)[name] === option.key}
                disabled={disabled}
                readOnly={readOnly}
                className="mr-2"
                onChange={() => (write[name] = option.key)}
              />
              {option.label || option.key}
            </label>
          ))}
        </div>
      )}
      {(type === "date" || type === "time" || type === "datetime-local") && (
        <Input
          id={name}
          type={type}
          value={(read as any)[name]}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(disabled && "bg-muted")}
          onChange={(e) => (write[name] = e.currentTarget.value)}
          {...(input as React.ComponentProps<"input">)}
        />
      )}
    </div>
  );
};
