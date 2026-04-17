import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORY_MAPPING, PREDEFINED_CATEGORIES } from '@/constants/categories';

interface CategorySelectorProps {
    category: string;
    subcategory: string;
    onCategoryChange: (category: string) => void;
    onSubcategoryChange: (subcategory: string) => void;

    // Custom category props (optional)
    allowCustom?: boolean;
    isCustom?: boolean;
    customCategoryName?: string;
    onCustomNameChange?: (name: string) => void;
    onIsCustomChange?: (isCustom: boolean) => void;

    disabled?: boolean;
    userCategories?: string[];
}

export default function CategorySelector({
    category,
    subcategory,
    onCategoryChange,
    onSubcategoryChange,
    allowCustom = false,
    isCustom = false,
    customCategoryName = '',
    onCustomNameChange,
    onIsCustomChange,
    disabled = false,
    userCategories = []
}: CategorySelectorProps) {

    // Derived state for subcategories
    // If custom, no subcategories by default unless we want to allow adding them (keeping it simple for now)
    const availableSubcategories = !isCustom && category && CATEGORY_MAPPING[category]
        ? CATEGORY_MAPPING[category]
        : [];

    const handleCategorySelect = (value: string) => {
        if (value === 'custom') {
            onIsCustomChange?.(true);
            onCategoryChange('custom');
        } else {
            onIsCustomChange?.(false);
            onCategoryChange(value);
        }
        onSubcategoryChange(''); // Reset subcategory
    };

    // Merge predefined with user categories
    const allCategories = Array.from(new Set([...userCategories, ...PREDEFINED_CATEGORIES]));

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Categoría</Label>
                <Select
                    value={isCustom ? 'custom' : category}
                    onValueChange={handleCategorySelect}
                    disabled={disabled}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                        {allCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                        {allowCustom && <SelectItem value="custom">Personalizado...</SelectItem>}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Subcategoría</Label>
                <Select
                    value={subcategory}
                    onValueChange={onSubcategoryChange}
                    disabled={disabled || (!category && !isCustom) || (availableSubcategories.length === 0 && !isCustom)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Opcional" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableSubcategories.map(sub => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {allowCustom && isCustom && (
                <div className="col-span-2 space-y-2">
                    <Label>Nombre de la Categoría</Label>
                    <Input
                        value={customCategoryName}
                        onChange={(e) => onCustomNameChange?.(e.target.value)}
                        placeholder="Ej: Gaming"
                        required
                    />
                </div>
            )}
        </div>
    );
}
