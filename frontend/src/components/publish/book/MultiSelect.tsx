import * as React from "react";
import { X } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocal } from "@/lib/hooks/use-local";

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
  placeholder = "Pilih opsi..."
}: MultiSelectProps) {
  const local = useLocal({
    open: false,
    inputValue: "",
  }, async () => {
    // No initialization needed
  });

  const handleSelect = (option: Option) => {
    const isSelected = selected.some((item) => item.value === option.value);
    
    if (isSelected) {
      // Remove from selection
      onChange(selected.filter((item) => item.value !== option.value));
    } else {
      // Add to selection
      onChange([...selected, option]);
    }
  };

  const handleRemove = (option: Option) => {
    onChange(selected.filter((item) => item.value !== option.value));
  };

  return (
    <Popover open={local.open} onOpenChange={(open) => {
      local.open = open;
      local.render();
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={local.open}
          className={cn(
            "w-full justify-between font-normal",
            selected.length > 0 ? "h-auto" : "",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 w-full">
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
          <span className="opacity-50 ml-2">▼</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
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
              .filter(option => 
                option.label.toLowerCase().includes(local.inputValue.toLowerCase())
              )
              .map((option) => {
                const isSelected = selected.some((item) => item.value === option.value);
                
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option)}
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
                )
              })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}