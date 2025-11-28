# Product Helper Entities API Usage

This document explains how to use the API functions and hooks for fetching brands, categories, materials, and styles in the product feature.

## Overview

The product creation and editing forms require data from several helper entities:
- **Categories** - Product categories (e.g., Jackets, Coats)
- **Brands** - Product brands (e.g., Nike, Adidas)
- **Materials** - Material types (e.g., Leather, Denim)
- **Styles** - Style types (e.g., Bomber, Biker)

## API Functions

### Categories

```typescript
import { getCategories, type GetCategoriesParams } from '@/features/products/api';

// Fetch categories with default params (ACTIVE only)
const categoriesResponse = await getCategories();

// Fetch with custom params
const categoriesResponse = await getCategories({
  page: 0,
  size: 50,
  search: 'jacket',
  status: ['ACTIVE', 'INACTIVE'],
  sortBy: 'name',
  sortDir: 'asc'
});

// Response structure
// {
//   contents: Category[],
//   page: number,
//   size: number,
//   totalPages: number,
//   totalElements: number
// }
```

### Brands

```typescript
import { getBrands, type GetBrandsParams } from '@/features/products/api';

const brandsResponse = await getBrands({
  page: 0,
  size: 100,
  status: 'ACTIVE' // Note: string, not array
});
```

### Materials

```typescript
import { getMaterials, type GetMaterialsParams } from '@/features/products/api';

const materialsResponse = await getMaterials({
  status: ['ACTIVE']
});
```

### Styles

```typescript
import { getStyles, type GetStylesParams } from '@/features/products/api';

const stylesResponse = await getStyles({
  status: 'ACTIVE' // Note: string, not array
});
```

## React Hooks

For React components, use the custom hooks which integrate with React Query:

### useCategories

```typescript
import { useCategories } from '@/features/products/hooks';

function MyComponent() {
  const { data, isLoading, error } = useCategories();
  
  // data.contents contains the array of categories
  const categories = data?.contents ?? [];
  
  return (
    <select>
      {categories.map(category => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
```

### Other Hooks

All hooks follow the same pattern:

```typescript
import { 
  useCategories,
  useBrands,
  useMaterials,
  useStyles 
} from '@/features/products/hooks';

// All hooks accept optional parameters
const { data: categoriesData } = useCategories({ search: 'leather' });
const { data: brandsData } = useBrands({ size: 50 });
const { data: materialsData } = useMaterials();
const { data: stylesData } = useStyles();
```

## Default Behavior

All hooks have sensible defaults:
- **Status**: Only `ACTIVE` entities are fetched by default
- **Size**: 100 items per page (suitable for dropdowns)
- **Stale Time**: 5 minutes (entities change less frequently than products)

## Type Definitions

```typescript
// Category
type Category = {
  id: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Brand
type Brand = {
  id: number;
  name: string;
  logoUrl?: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Material
type Material = {
  id: number;
  name: string;
  description?: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Style
type Style = {
  id: number;
  name: string;
  description?: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string | null;
  updatedAt?: string | null;
}
```

## Example: Product Form

See `ProductCreateForm.tsx` and `ProductEditForm.tsx` for complete examples of how to use these hooks in a form context.

```typescript
import { useCategories, useBrands, useMaterials, useStyles } from '@/features/products/hooks';

export function ProductForm() {
  // Fetch all helper entities
  const { data: categoriesResponse } = useCategories();
  const { data: brandsResponse } = useBrands();
  const { data: materialsResponse } = useMaterials();
  const { data: stylesResponse } = useStyles();

  // Extract contents (handle undefined)
  const categories = categoriesResponse?.contents ?? [];
  const brands = brandsResponse?.contents ?? [];
  const materials = materialsResponse?.contents ?? [];
  const styles = stylesResponse?.contents ?? [];

  // Use in your form...
}
```
