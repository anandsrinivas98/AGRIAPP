# Backend Reorganization Plan

## Current Issues
1. Mixed controller/route patterns (some routes have controllers, others don't)
2. Inconsistent authentication middleware usage (`auth` vs `authenticate`)
3. Services scattered without clear organization
4. No clear separation of concerns
5. Mixed API response patterns
6. Inconsistent error handling

## New Structure

```
backend/src/
├── api/                          # API layer
│   ├── controllers/              # Request handlers
│   │   ├── auth/                 # Authentication controllers
│   │   │   ├── authController.ts
│   │   │   ├── profileController.ts
│   │   │   └── index.ts
│   │   ├── farm/                 # Farm management controllers
│   │   │   ├── farmController.ts
│   │   │   ├── cropController.ts
│   │   │   └── index.ts
│   │   ├── ai/                   # AI/ML controllers
│   │   │   ├── recommendationController.ts
│   │   │   ├── yieldPredictionController.ts
│   │   │   ├── diseaseDetectionController.ts
│   │   │   └── index.ts
│   │   ├── community/            # Community features
│   │   │   ├── forumController.ts
│   │   │   ├── chatController.ts
│   │   │   └── index.ts
│   │   ├── market/               # Market data
│   │   │   ├── priceController.ts
│   │   │   ├── marketplaceController.ts
│   │   │   └── index.ts
│   │   ├── planning/             # Planning features
│   │   │   ├── calendarController.ts
│   │   │   ├── labourController.ts
│   │   │   └── index.ts
│   │   └── data/                 # Data services
│   │       ├── weatherController.ts
│   │       ├── cropGuideController.ts
│   │       └── index.ts
│   ├── routes/                   # Route definitions
│   │   ├── v1/                   # API version 1
│   │   │   ├── auth.ts
│   │   │   ├── farm.ts
│   │   │   ├── ai.ts
│   │   │   ├── community.ts
│   │   │   ├── market.ts
│   │   │   ├── planning.ts
│   │   │   ├── data.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── middleware/               # Request middleware
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   ├── rateLimit.ts
│   │   └── index.ts
│   └── validators/               # Request validation schemas
│       ├── auth.ts
│       ├── farm.ts
│       ├── ai.ts
│       └── index.ts
├── core/                         # Business logic layer
│   ├── services/                 # Business services
│   │   ├── auth/
│   │   │   ├── authService.ts
│   │   │   ├── emailService.ts
│   │   │   └── index.ts
│   │   ├── farm/
│   │   │   ├── farmService.ts
│   │   │   ├── cropService.ts
│   │   │   └── index.ts
│   │   ├── ai/
│   │   │   ├── recommendationService.ts
│   │   │   ├── yieldPredictionService.ts
│   │   │   ├── diseaseDetectionService.ts
│   │   │   └── index.ts
│   │   ├── community/
│   │   │   ├── forumService.ts
│   │   │   ├── chatService.ts
│   │   │   └── index.ts
│   │   ├── market/
│   │   │   ├── priceService.ts
│   │   │   ├── marketplaceService.ts
│   │   │   └── index.ts
│   │   ├── planning/
│   │   │   ├── calendarService.ts
│   │   │   ├── labourService.ts
│   │   │   └── index.ts
│   │   └── external/             # External API services
│   │       ├── weatherService.ts
│   │       ├── geminiService.ts
│   │       ├── vectorService.ts
│   │       └── index.ts
│   ├── repositories/             # Data access layer
│   │   ├── userRepository.ts
│   │   ├── farmRepository.ts
│   │   ├── cropRepository.ts
│   │   └── index.ts
│   └── models/                   # Domain models
│       ├── User.ts
│       ├── Farm.ts
│       ├── Crop.ts
│       └── index.ts
├── infrastructure/               # Infrastructure layer
│   ├── database/
│   │   ├── prisma.ts
│   │   └── migrations/
│   ├── cache/
│   │   ├── redis.ts
│   │   └── cacheService.ts
│   ├── storage/
│   │   ├── fileStorage.ts
│   │   └── imageProcessor.ts
│   └── external/
│       ├── emailProvider.ts
│       └── smsProvider.ts
├── shared/                       # Shared utilities
│   ├── types/                    # TypeScript types
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── farm.ts
│   │   └── index.ts
│   ├── utils/                    # Utility functions
│   │   ├── validation.ts
│   │   ├── encryption.ts
│   │   ├── dateUtils.ts
│   │   └── index.ts
│   ├── constants/                # Application constants
│   │   ├── errors.ts
│   │   ├── messages.ts
│   │   └── index.ts
│   └── config/                   # Configuration
│       ├── database.ts
│       ├── auth.ts
│       ├── external.ts
│       └── index.ts
├── scripts/                      # Utility scripts
│   ├── seed.ts
│   ├── migrate.ts
│   └── cleanup.ts
└── app.ts                        # Application entry point
```

## API Endpoint Structure

### Current Endpoints (to maintain compatibility)
- `/api/auth/*` → `/api/v1/auth/*`
- `/api/recommend` → `/api/v1/ai/recommendations`
- `/api/predict` → `/api/v1/ai/yield-predictions`
- `/api/yield-predictions` → `/api/v1/ai/yield-predictions/history`
- `/api/detect` → `/api/v1/ai/disease-detection`
- `/api/prices` → `/api/v1/market/prices`
- `/api/weather` → `/api/v1/data/weather`
- `/api/calendar` → `/api/v1/planning/calendar`
- `/api/forum` → `/api/v1/community/forum`
- `/api/labour` → `/api/v1/planning/labour`
- `/api/labour-scheduling` → `/api/v1/planning/labour-scheduling`
- `/api/chat` → `/api/v1/community/chat`
- `/api/marketplace` → `/api/v1/market/marketplace`
- `/api/chatbot` → `/api/v1/community/chatbot`
- `/api/crop-guide` → `/api/v1/data/crop-guide`

## Implementation Steps

1. Create new directory structure
2. Move and refactor controllers
3. Create proper service layer
4. Update route definitions
5. Standardize middleware
6. Update frontend API calls
7. Add backward compatibility
8. Test all endpoints
9. Update documentation

## Benefits

1. **Clear Separation of Concerns**: API, Business Logic, Data Access
2. **Consistent Patterns**: All endpoints follow same structure
3. **Better Maintainability**: Organized by feature domains
4. **Scalability**: Easy to add new features
5. **Testing**: Clear boundaries for unit/integration tests
6. **API Versioning**: Support for future API versions
7. **Type Safety**: Comprehensive TypeScript types