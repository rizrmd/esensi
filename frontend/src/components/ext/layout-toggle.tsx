import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ItemLayout } from "@/lib/utils";
import { Grid, LayoutGrid, List } from "lucide-react";
import type { FC } from "react";

export type LayoutToggleProps = {
  layout: ItemLayout;
  onLayoutChange: (value: ItemLayout) => void;
};

export const LayoutToggle: FC<LayoutToggleProps> = ({
  layout,
  onLayoutChange,
}) => {
  return (
    <ToggleGroup
      type="single"
      value={layout}
      onValueChange={(value) => {
        if (value) onLayoutChange(value as ItemLayout);
      }}
      className="p-0"
    >
      <ToggleGroupItem
        value="grid"
        aria-label="Tampilan Ikon"
        className="cursor-pointer"
      >
        <Grid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="list"
        aria-label="Tampilan Daftar"
        className="cursor-pointer"
      >
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="compact"
        aria-label="Tampilan Daftar Ringkas"
        className="cursor-pointer"
      >
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
