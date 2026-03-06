# Frontend API Migration Guide

This guide helps you migrate from the legacy API structure to the new organized v1 API.

## 🔄 API Structure Changes

### Before (Legacy)
```typescript
// Scattered API calls
const response = await fetch('http://localhost:5000/api/yield-predictions', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### After (v1 API)
```typescript
import { API_ENDPOINTS, getDefaultHeaders, handleApiResponse } from '@/lib/config/api';

// Centralized, typed API calls
const response = await fetch(API_ENDPOINTS.AI.YIELD_PREDICTIONS, {
  headers: getDefaultHeaders()
});

const data = await handleApiResponse(response);
```

## 📁 New File Structure

### API Configuration
- `frontend/lib/config/api.ts` - Centralized API configuration
- All endpoints organized by feature modules
- Consistent error handling and response types

### Service Updates
- `frontend/lib/services/yieldPredictionService.ts` - Updated to use new API config
- `frontend/services/cropGuideService.ts` - Updated to use new API config
- All services now use centralized configuration

## 🔧 Migration Steps

### 1. Update API Calls

**Before:**
```typescript
// Hardcoded URLs and manual header management
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
});

if (!response.ok) {
  throw new Error('Request failed');
}

const result = await response.json();
```

**After:**
```typescript
import { API_ENDPOINTS, getDefaultHeaders, handleApiResponse } from '@/lib/config/api';

// Centralized configuration and error handling
const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
  method: 'POST',
  headers: getDefaultHeaders(),
  body: JSON.stringify(data)
});

const result = await handleApiResponse(response);
```

### 2. Update Service Classes

**Before:**
```typescript
class MyService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }
  
  async getData() {
    const response = await fetch(`${this.baseUrl}/api/data`, {
      headers: this.getHeaders()
    });
    // Manual error handling...
  }
}
```

**After:**
```typescript
import { API_ENDPOINTS, getDefaultHeaders, handleApiResponse } from '@/lib/config/api';

class MyService {
  async getData() {
    const response = await fetch(API_ENDPOINTS.AI.SOME_ENDPOINT, {
      headers: getDefaultHeaders()
    });
    
    return await handleApiResponse(response);
  }
}
```

### 3. Update Component API Calls

**Before:**
```typescript
// In React components
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/yield-predictions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      setError(error.message);
    }
  };
  
  fetchData();
}, []);
```

**After:**
```typescript
import { API_ENDPOINTS, getDefaultHeaders, handleApiResponse, ApiError } from '@/lib/config/api';

// In React components
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.AI.YIELD_PREDICTIONS, {
        headers: getDefaultHeaders()
      });
      
      const data = await handleApiResponse(response);
      setData(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };
  
  fetchData();
}, []);
```

## 📋 API Endpoint Mapping

### Authentication
| Legacy | New v1 API |
|--------|------------|
| `/api/auth/login` | `API_ENDPOINTS.AUTH.LOGIN` |
| `/api/auth/register` | `API_ENDPOINTS.AUTH.REGISTER` |
| `/api/auth/verify-email` | `API_ENDPOINTS.AUTH.VERIFY_EMAIL` |

### AI Services
| Legacy | New v1 API |
|--------|------------|
| `/api/yield-predictions` | `API_ENDPOINTS.AI.YIELD_PREDICTIONS` |
| `/api/recommend` | `API_ENDPOINTS.AI.CROP_RECOMMENDATIONS` |
| `/api/detect` | `API_ENDPOINTS.AI.DISEASE_DETECTION` |
| `/api/crop-guide` | `API_ENDPOINTS.AI.CROP_GUIDE` |

### Market Data
| Legacy | New v1 API |
|--------|------------|
| `/api/prices` | `API_ENDPOINTS.MARKET.PRICES` |
| `/api/weather` | `API_ENDPOINTS.MARKET.WEATHER` |
| `/api/labour` | `API_ENDPOINTS.MARKET.LABOUR_ALERTS` |

### Community
| Legacy | New v1 API |
|--------|------------|
| `/api/forum` | `API_ENDPOINTS.COMMUNITY.FORUM_POSTS` |
| `/api/chat` | `API_ENDPOINTS.COMMUNITY.CHAT` |

### Planning
| Legacy | New v1 API |
|--------|------------|
| `/api/calendar` | `API_ENDPOINTS.PLANNING.CALENDAR_TASKS` |
| `/api/labour-scheduling` | `API_ENDPOINTS.PLANNING.LABOUR_SCHEDULING` |

## 🛠️ Utility Functions

### Error Handling
```typescript
import { ApiError, handleApiResponse } from '@/lib/config/api';

try {
  const data = await handleApiResponse(response);
  // Handle success
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message, error.statusCode);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Headers Management
```typescript
import { getDefaultHeaders, getAuthHeaders } from '@/lib/config/api';

// Get headers with auth token (if available)
const headers = getDefaultHeaders();

// Get only auth headers
const authHeaders = getAuthHeaders();

// Custom headers
const customHeaders = {
  ...getDefaultHeaders(),
  'Custom-Header': 'value'
};
```

### Response Types
```typescript
import { ApiResponse, PaginatedResponse } from '@/lib/config/api';

// Standard response
interface MyData {
  id: string;
  name: string;
}

const response: ApiResponse<MyData> = await handleApiResponse(fetch(...));

// Paginated response
const paginatedResponse: PaginatedResponse<MyData> = await handleApiResponse(fetch(...));
console.log(paginatedResponse.pagination.total);
```

## 🔄 Backward Compatibility

During the migration period, both APIs are available:

```typescript
import { shouldUseLegacyAPI, API_ENDPOINTS } from '@/lib/config/api';

// Automatic fallback logic
const endpoint = shouldUseLegacyAPI('yield-predictions') 
  ? API_ENDPOINTS.LEGACY.YIELD_PREDICTIONS 
  : API_ENDPOINTS.AI.YIELD_PREDICTIONS;
```

## ✅ Migration Checklist

- [ ] Update all hardcoded API URLs to use `API_ENDPOINTS`
- [ ] Replace manual header management with `getDefaultHeaders()`
- [ ] Update error handling to use `handleApiResponse()` and `ApiError`
- [ ] Update service classes to use centralized configuration
- [ ] Update component API calls to use new structure
- [ ] Test all API integrations
- [ ] Update environment variables if needed
- [ ] Remove legacy API calls once migration is complete

## 🚀 Benefits of Migration

1. **Centralized Configuration**: All API endpoints in one place
2. **Type Safety**: TypeScript interfaces for all responses
3. **Consistent Error Handling**: Standardized error responses
4. **Better Organization**: Endpoints grouped by feature modules
5. **Easier Maintenance**: Single source of truth for API configuration
6. **Enhanced Developer Experience**: Better autocomplete and documentation

## 🔧 Development Tools

### VS Code Extensions
- **REST Client**: Test API endpoints directly in VS Code
- **Thunder Client**: Alternative API testing tool
- **TypeScript Importer**: Auto-import TypeScript modules

### Testing
```typescript
// Test API endpoints
import { API_ENDPOINTS } from '@/lib/config/api';

describe('API Endpoints', () => {
  test('should have correct yield predictions endpoint', () => {
    expect(API_ENDPOINTS.AI.YIELD_PREDICTIONS).toBe('http://localhost:5000/api/v1/ai/yield-predictions');
  });
});
```

## 📞 Support

If you encounter issues during migration:

1. Check the API documentation at `http://localhost:5000/api-docs`
2. Verify environment variables are correctly set
3. Test endpoints using the health check at `http://localhost:5000/health`
4. Review the backend logs for detailed error information
5. Use the browser's network tab to inspect API requests and responses

## 🎯 Next Steps

After completing the migration:

1. Remove legacy API dependencies
2. Update documentation
3. Add comprehensive error boundaries
4. Implement request caching where appropriate
5. Add API request logging for debugging
6. Consider implementing request retry logic
7. Add API performance monitoring