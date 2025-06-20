# Cfg Management Pages - Setup Instructions

## Overview
The cfg management pages have been created in `frontend/src/pages/internal.esensi/`:

1. **manage-cfg.tsx** - List and manage configurations
2. **cfg-create.tsx** - Create new configuration
3. **cfg-edit.tsx** - Edit existing configuration

## Backend APIs Created
The following APIs have been created in `backend/src/api/internal.esensi/`:

1. **cfg-list.ts** - List configurations with search and pagination
2. **cfg-create.ts** - Create new configuration
3. **cfg-get.ts** - Get single configuration by key
4. **cfg-update.ts** - Update configuration value
5. **cfg-delete.ts** - Delete configuration

## Setup Steps

### 1. Generate APIs
Run the development server to generate the API types:
```bash
bun run dev
```

### 2. Uncomment API Calls
Once the APIs are generated, uncomment the actual API calls in the frontend pages:

**In manage-cfg.tsx:**
- Uncomment the `api.cfg_list()` call in `loadData()`
- Uncomment the `api.cfg_delete()` call in `handleDelete()`

**In cfg-create.tsx:**
- Uncomment the `api.cfg_create()` call in `handleSubmit()`

**In cfg-edit.tsx:**
- Uncomment the `api.cfg_get()` call in `loadData()`
- Uncomment the `api.cfg_update()` call in `handleSubmit()`

### 3. Add Routes
Add the routes to your router configuration:
```typescript
// Add to your internal.esensi routes
"/internal/manage-cfg": () => import("./pages/internal.esensi/manage-cfg"),
"/internal/cfg-create": () => import("./pages/internal.esensi/cfg-create"),
"/internal/cfg-edit": () => import("./pages/internal.esensi/cfg-edit"),
```

### 4. Add Menu Items
Add menu items to the internal menu bar to access the cfg management:
```typescript
// In your internal menu component
<MenuItem href="/internal/manage-cfg">Kelola Konfigurasi</MenuItem>
```

## Features

### List Page (manage-cfg.tsx)
- Search configurations by key or value
- Pagination support
- Grid layout showing key-value pairs
- Edit and delete actions
- Confirmation dialog for deletion

### Create Page (cfg-create.tsx)
- Form to create new configuration
- Key and value validation
- Preview of the configuration
- Success feedback and navigation

### Edit Page (cfg-edit.tsx)
- Edit configuration value (key is readonly)
- Before/after comparison
- Form validation
- Success feedback and navigation

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/internal/cfg/list` | POST | List configurations with search/pagination |
| `/api/internal/cfg/create` | POST | Create new configuration |
| `/api/internal/cfg/get` | POST | Get configuration by key |
| `/api/internal/cfg/update` | POST | Update configuration value |
| `/api/internal/cfg/delete` | POST | Delete configuration |

## Database Schema
The APIs work with the `cfg` table which has:
- `key` (varchar, primary key)
- `value` (varchar)

## Access Control
All pages are protected with `Role.INTERNAL` access level.
