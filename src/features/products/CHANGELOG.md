# Cập nhật Products Feature - Summary

## Thay đổi đã thực hiện:

### 1. ✅ Thêm 2 cột Material và Style vào bảng Products

**File:** `src/features/products/components/ProductTableColumns.tsx`

Đã thêm 2 cột mới sau cột Brand:
- **Material**: Hiển thị tên material hoặc "—" nếu không có
- **Style**: Hiển thị tên style hoặc "—" nếu không có

```tsx
{
    accessorKey: "material",
    header: "Material",
    cell: ({ row }) => {
        const material = row.original.material;
        return <div>{material?.name || "—"}</div>;
    },
},
{
    accessorKey: "style",
    header: "Style",
    cell: ({ row }) => {
        const style = row.original.style;
        return <div>{style?.name || "—"}</div>;
    },
}
```

### 2. ✅ Xóa 2 status DRAFT và ARCHIVED

#### 2.1 Schema
**File:** `src/features/products/model/schemas.ts`

Cập nhật `productStatusEnum` từ:
```typescript
["ACTIVE", "INACTIVE", "DRAFT", "ARCHIVED"]
```

Thành:
```typescript
["ACTIVE", "INACTIVE"]
```

#### 2.2 Status Badge
**File:** `src/features/products/components/ProductStatusBadge.tsx`

Xóa các variant cho DRAFT và ARCHIVED, chỉ giữ lại:
```typescript
const variants = {
    ACTIVE: "default",
    INACTIVE: "secondary",
};
```

#### 2.3 Create Form
**File:** `src/features/products/components/ProductCreateForm.tsx`

- Thay đổi default status từ `"DRAFT"` thành `"ACTIVE"`
- Xóa options DRAFT và ARCHIVED khỏi Select dropdown
- Chỉ còn 2 options: Active và Inactive

#### 2.4 Edit Form
**File:** `src/features/products/components/ProductEditForm.tsx`

- Thay đổi default status từ `"DRAFT"` thành `"ACTIVE"`
- Xóa options DRAFT và ARCHIVED khỏi Select dropdown
- Chỉ còn 2 options: Active và Inactive

#### 2.5 Table Toolbar
**File:** `src/features/products/components/ProductTableToolbar.tsx`

Cập nhật `statusOptions` để xóa DRAFT và ARCHIVED:
```typescript
const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
];
```

## Kết quả:

### Bảng Products hiện tại có các cột:
1. ☑️ Select (checkbox)
2. 🆔 ID
3. 📝 Name (sortable)
4. 📂 Category
5. 🏷️ Brand
6. 🧵 **Material** (MỚI)
7. 👔 **Style** (MỚI)
8. 🔄 Status
9. 📅 Created At (sortable)
10. ⚙️ Actions

### Status hiện tại chỉ còn:
- ✅ **ACTIVE** (màu default/xanh)
- ⭕ **INACTIVE** (màu secondary/xám)

Đã xóa:
- ~~DRAFT~~
- ~~ARCHIVED~~

## TypeScript Type Safety:

Tất cả các thay đổi đều type-safe với TypeScript. `ProductStatus` type hiện chỉ chấp nhận:
```typescript
type ProductStatus = "ACTIVE" | "INACTIVE"
```

Không còn chấp nhận "DRAFT" hoặc "ARCHIVED" nữa.
