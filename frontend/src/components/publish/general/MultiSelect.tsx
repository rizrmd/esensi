import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocal } from "@/lib/hooks/use-local";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: Option[];
  onChange: (selected: Option[]) => void;
  className?: string;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = "Pilih opsi...",
}: MultiSelectProps) {
  const local = useLocal(
    {
      open: false,
      inputValue: "",
    },
    async () => {
      // No initialization needed
    }
  );

  const handleSelect = (option: Option) => {
    const isSelected = selected.some((item) => item.value === option.value);
    if (isSelected) {
      onChange(selected.filter((item) => item.value !== option.value));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleRemove = (option: Option) => {
    onChange(selected.filter((item) => item.value !== option.value));
  };

  return (
    <Popover
      open={local.open}
      onOpenChange={(open) => {
        local.open = open;
        local.render();
      }}
    >
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={local.open}
          tabIndex={0}
          className={cn(
            "flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "font-normal",
            selected.length > 0 ? "h-auto" : "h-10",
            className
          )}
        >
          <div className="flex flex-grow flex-wrap gap-1">
            {selected.length > 0 ? (
              selected.map((item) => (
                <Badge
                  key={item.value}
                  className="mr-1 mb-1 gap-1"
                  variant="secondary"
                >
                  {item.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemove(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(item);
                    }}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {item.label}</span>
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <span className="ml-2 shrink-0 opacity-50">▼</span>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command className="w-full">
          <CommandInput
            placeholder={placeholder}
            value={local.inputValue}
            onValueChange={(value) => {
              local.inputValue = value;
              local.render();
            }}
          />
          <CommandEmpty>Tidak ada opsi yang sesuai.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options
              .filter((option) =>
                option.label
                  .toLowerCase()
                  .includes(local.inputValue.toLowerCase())
              )
              .map((option) => {
                const isSelected = selected.some(
                  (item) => item.value === option.value
                );

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      handleSelect(option);
                    }}
                    className={cn(
                      "flex items-center gap-2",
                      isSelected ? "font-medium bg-muted" : ""
                    )}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {isSelected ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : null}
                    </div>
                    {option.label}
                  </CommandItem>
                );
              })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
