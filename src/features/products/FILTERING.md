# Product Filtering Feature

## Tổng quan

Đã thêm khả năng lọc (filter) sản phẩm theo **Category**, **Brand**, **Material**, và **Style** vào bảng products, tương tự như filter Status hiện có.

## Các thay đổi đã thực hiện

### 1. ProductTableColumns.tsx

**Thêm `filterFn` cho 4 cột:**
- Category
- Brand  
- Material
- Style

```tsx
filterFn: (row, _id, value) => {
    const entity = row.original.category; // hoặc brand, material, style
    if (!entity) return false;
    return value.includes(entity.id.toString());
}
```

FilterFn này:
- Kiểm tra xem entity có tồn tại không
- So sánh ID của entity với các giá trị được chọn trong filter
- Return `true` nếu ID nằm trong danh sách filter

### 2. ProductTableToolbar.tsx

**Thêm imports:**
```tsx
import { useCategories, useBrands, useMaterials, useStyles } from "../hooks";
import { useMemo } from "react";
```

**Fetch dữ liệu cho filter options:**
```tsx
const { data: categoriesData } = useCategories();
const { data: brandsData } = useBrands();
const { data: materialsData } = useMaterials();
const { data: stylesData } = useStyles();
```

**Tạo filter options với useMemo:**
```tsx
const categoryOptions = useMemo(
    () => categoriesData?.contents.map((cat) => ({
        label: cat.name,
        value: cat.id.toString(),
    })) ?? [],
    [categoriesData]
);
// Tương tự cho brand, material, style
```

**Thêm 4 DataTableFacetedFilter mới:**
```tsx
{table.getColumn("category") && (
    <DataTableFacetedFilter
        column={table.getColumn("category")}
        title="Category"
        options={categoryOptions}
    />
)}
// Tương tự cho brand, material, style
```

**Cải thiện layout:**
- Thay `space-x-2` bằng `gap-2 flex-wrap` để filters hiển thị đẹp hơn khi có nhiều

### 3. ProductsTable.tsx

**Thêm helper function:**
```tsx
const getFilterIds = (filterId: string): number[] | undefined => {
    const filterValue = columnFilters.find((f) => f.id === filterId)?.value as string[] | undefined;
    return filterValue?.map((id) => Number(id));
};
```

**Cập nhật useProducts call:**
```tsx
const { data, isLoading } = useProducts({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortBy: sorting[0]?.id,
    sortDir: sorting[0]?.desc ? "desc" : "asc",
    status: columnFilters.find((f) => f.id === "status")?.value as string[],
    search: columnFilters.find((f) => f.id === "name")?.value as string,
    categoryIds: getFilterIds("category"),
    brandIds: getFilterIds("brand"),
    materialIds: getFilterIds("material"),
    styleIds: getFilterIds("style"),
});
```

### 4. API - index.ts

**Cập nhật GetProductsParams interface:**
```typescript
export interface GetProductsParams {
    page: number;
    size: number;
    sortBy?: string;
    sortDir?: SortDirection;
    search?: string;
    status?: string[];
    categoryIds?: number[];
    brandIds?: number[];
    materialIds?: number[];  // MỚI
    styleIds?: number[];     // MỚI
}
```

**Thêm query parameters:**
```typescript
if (params.materialIds?.length) {
    params.materialIds.forEach((id) => queryParams.append("materialIds", id.toString()));
}
if (params.styleIds?.length) {
    params.styleIds.forEach((id) => queryParams.append("styleIds", id.toString()));
}
```

## Cách sử dụng

### Frontend (đã hoàn thành)

Người dùng có thể:
1. Click vào nút filter bên cạnh search box
2. Chọn một hoặc nhiều categories/brands/materials/styles
3. Bảng sẽ tự động filter theo lựa chọn
4. Click "Reset" để xóa tất cả filters

### Backend (cần cập nhật)

⚠️ **LƯU Ý QUAN TRỌNG:**

Backend hiện tại chỉ hỗ trợ:
- ✅ `categoryIds`
- ✅ `brandIds`

Backend CẦN CẬP NHẬT để hỗ trợ:
- ❌ `materialIds`
- ❌ `styleIds`

**Cần thêm vào Backend Controller:**

```java
@GetMapping
public ApiResponse<?> getAllProducts(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) List<String> status,
        @RequestParam(required = false) List<Long> categoryIds,
        @RequestParam(required = false) List<Long> brandIds,
        @RequestParam(required = false) List<Long> materialIds,  // THÊM DÒNG NÀY
        @RequestParam(required = false) List<Long> styleIds,     // THÊM DÒNG NÀY
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "DESC") String sortDir
) {
    // Logic xử lý filter materialIds và styleIds
}
```

## Lợi ích

✅ **User Experience:**
- Dễ dàng tìm sản phẩm theo nhiều tiêu chí
- Filter có thể kết hợp (AND operation)
- UI nhất quán với filter hiện có

✅ **Performance:**
- Data được cache với React Query (5 phút)
- useMemo tránh re-render không cần thiết
- Filter options chỉ fetch một lần

✅ **Type Safety:**
- TypeScript đảm bảo type safety
- FilterFn có kiểu dữ liệu chính xác

## Testing

### Kiểm tra filters hoạt động:

1. **Category filter:**
   - Mở filter Category
   - Chọn một hoặc nhiều categories
   - Kiểm tra bảng chỉ hiển thị products thuộc categories đã chọn

2. **Brand filter:**
   - Tương tự như Category

3. **Material filter:**
   - ⚠️ Hiện tại sẽ gửi request lên backend nhưng backend chưa hỗ trợ
   - Cần cập nhật backend trước khi test

4. **Style filter:**
   - ⚠️ Tương tự Material

5. **Multi-filter:**
   - Chọn Category + Brand cùng lúc
   - Kết quả phải thỏa mãn CẢ HAI điều kiện

6. **Reset:**
   - Click "Reset" phải xóa tất cả filters
   - Bảng hiển thị lại toàn bộ products

## Các bước tiếp theo

### Backend cần làm:

1. ✅ Thêm `materialIds` parameter vào ProductController
2. ✅ Thêm `styleIds` parameter vào ProductController  
3. ✅ Cập nhật ProductService để filter theo materialIds
4. ✅ Cập nhật ProductService để filter theo styleIds
5. ✅ Cập nhật ProductRepository/Specification nếu cần

### Frontend (tùy chọn):

- Có thể thêm loading state khi fetch filter options
- Có thể thêm error handling nếu API fails
- Có thể thêm "No results" message khi filter không có kết quả
