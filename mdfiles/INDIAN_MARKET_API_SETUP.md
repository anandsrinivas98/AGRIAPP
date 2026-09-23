# Indian Agriculture Market Data API Setup Guide

## Quick Start

This guide will help you set up the Indian agriculture market data integration for the AgriSense marketplace.

## Prerequisites

- Node.js 16+ installed
- Internet connection for API access
- Modern web browser

## Step 1: Environment Configuration

### 1.1 Copy Environment Files

```bash
# Copy root environment file
cp .env.example .env

# Copy frontend environment file
cp frontend/.env.local.example frontend/.env.local
```

### 1.2 Configure API Access

The implementation uses **free public APIs** from the Government of India. No signup required for basic access!

#### Agmarknet API (Primary Source - ENABLED by default)

```bash
# In frontend/.env.local
NEXT_PUBLIC_AGMARKNET_ENABLED=true
NEXT_PUBLIC_AGMARKNET_API_URL=https://api.data.gov.in/resource
NEXT_PUBLIC_AGMARKNET_RESOURCE_ID=9ef84268-d588-465a-a308-a864a43d0070
NEXT_PUBLIC_AGMARKNET_API_KEY=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
```

**Note**: The API key shown above is a public demo key. For production use:
1. Visit https://data.gov.in/
2. Sign up for a free account
3. Generate your own API key
4. Replace the API key in your `.env.local` file

#### Open Government Data Platform (Secondary Source - ENABLED by default)

```bash
NEXT_PUBLIC_OGD_ENABLED=true
NEXT_PUBLIC_OGD_API_URL=https://api.data.gov.in/resource
NEXT_PUBLIC_OGD_API_KEY=
```

**Note**: OGD uses the same platform as Agmarknet. No separate signup needed.

#### eNAM API (Future Integration - DISABLED by default)

```bash
NEXT_PUBLIC_ENAM_ENABLED=false
NEXT_PUBLIC_ENAM_API_URL=https://enam.gov.in/api
NEXT_PUBLIC_ENAM_API_KEY=
```

**Note**: eNAM public API availability is being confirmed. Keep disabled for now.

## Step 2: Cache Configuration

Configure caching to optimize performance and reduce API calls:

```bash
# Enable caching (recommended)
NEXT_PUBLIC_MARKET_CACHE_ENABLED=true

# Cache TTL (Time To Live) in seconds
NEXT_PUBLIC_MARKET_CACHE_TTL_PRICES=300      # 5 minutes
NEXT_PUBLIC_MARKET_CACHE_TTL_OVERVIEW=600    # 10 minutes
NEXT_PUBLIC_MARKET_CACHE_TTL_HISTORICAL=3600 # 1 hour
NEXT_PUBLIC_MARKET_CACHE_TTL_LISTINGS=900    # 15 minutes
```

## Step 3: Fallback Configuration

Configure fallback behavior when APIs are unavailable:

```bash
# Enable fallback to cached/mock data
NEXT_PUBLIC_MARKET_FALLBACK_ENABLED=true

# Use mock data when all sources fail (for development)
NEXT_PUBLIC_MARKET_USE_MOCK_DATA=false
```

## Step 4: Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Return to root
cd ..
```

## Step 5: Start the Application

```bash
# Start frontend development server
cd frontend
npm run dev
```

The marketplace will be available at: http://localhost:3000/marketplace

## API Sources Overview

### 1. Agmarknet API

**What it provides**:
- Real-time mandi (market) prices
- Commodity arrival data
- Market yard information
- State-wise agricultural data

**Coverage**:
- 3000+ markets across India
- 300+ commodities
- Daily price updates

**Rate Limits**:
- Public API: 100 requests/hour
- With API key: 1000 requests/hour

**Data Format**: JSON

**Example Response**:
```json
{
  "records": [
    {
      "state": "Delhi",
      "market": "Azadpur",
      "commodity": "Wheat",
      "variety": "Lokwan",
      "arrival_date": "2024-12-07",
      "min_price": "2200",
      "max_price": "2400",
      "modal_price": "2300"
    }
  ]
}
```

### 2. Open Government Data (OGD) Platform

**What it provides**:
- Agricultural statistics
- Production data
- Trade information
- Historical market data

**Coverage**:
- Pan-India data
- Multiple agricultural sectors
- Historical trends

**Rate Limits**:
- 100 requests/hour (public)

**Data Format**: JSON, CSV, XML

### 3. eNAM (Future)

**What it will provide**:
- Electronic trading data
- Real-time auction prices
- Quality parameters
- Trader information

**Status**: Public API availability being confirmed

## Verification

### Test API Connection

1. Open browser console (F12)
2. Navigate to http://localhost:3000/marketplace
3. Check console for logs:
   - "Returning cached commodity prices" (if cache hit)
   - "Agmarknet API fetch error" (if API issue)

### Check Data Display

1. Navigate to "Live Prices" tab
2. Verify prices show ₹ symbol
3. Check that commodity names are displayed
4. Verify market and state information

### Verify Caching

1. Load marketplace page
2. Check browser localStorage:
   - Open DevTools → Application → Local Storage
   - Look for `agrisense_market_cache` key
3. Refresh page - should load faster from cache

## Troubleshooting

### Issue: No data displayed

**Solution**:
1. Check internet connection
2. Verify API is enabled in `.env.local`
3. Check browser console for errors
4. Try clearing cache: `localStorage.clear()`

### Issue: "API rate limit exceeded"

**Solution**:
1. Wait for rate limit to reset (1 hour)
2. Increase cache TTL to reduce API calls
3. Get your own API key from data.gov.in

### Issue: Stale data

**Solution**:
1. Click "Refresh Data" button in UI
2. Reduce cache TTL in configuration
3. Clear browser cache

### Issue: CORS errors

**Solution**:
1. Ensure you're using HTTPS URLs for APIs
2. Check if API endpoint is accessible
3. Try using a different browser

## API Rate Limit Management

### Best Practices

1. **Enable Caching**: Always keep cache enabled
2. **Appropriate TTL**: Use recommended TTL values
3. **Avoid Rapid Refresh**: Don't refresh more than once per minute
4. **Get API Key**: Register for higher rate limits

### Monitoring Usage

Check cache status in browser console:
```javascript
// In browser console
localStorage.getItem('agrisense_market_cache')
```

## Production Deployment

### Before Going Live

1. **Get Official API Keys**:
   - Visit https://data.gov.in/
   - Register for an account
   - Generate API keys
   - Update `.env.local` with production keys

2. **Optimize Cache Settings**:
   ```bash
   NEXT_PUBLIC_MARKET_CACHE_TTL_PRICES=600      # 10 minutes
   NEXT_PUBLIC_MARKET_CACHE_TTL_OVERVIEW=1800   # 30 minutes
   NEXT_PUBLIC_MARKET_CACHE_TTL_HISTORICAL=7200 # 2 hours
   ```

3. **Enable Monitoring**:
   - Set up error logging
   - Monitor API response times
   - Track cache hit rates

4. **Test Thoroughly**:
   - Test with real API keys
   - Verify all marketplace tabs
   - Test error scenarios
   - Check mobile responsiveness

## Support Resources

### Official Documentation

- **Data.gov.in**: https://data.gov.in/ogpl_apis
- **Agmarknet**: https://agmarknet.gov.in/
- **eNAM**: https://enam.gov.in/

### Community Support

- GitHub Issues: [Your repo URL]
- Documentation: See `INDIAN_MARKET_DATA_IMPLEMENTATION.md`

### API Status

Check API status:
- Data.gov.in Status: https://data.gov.in/
- Agmarknet Status: https://agmarknet.gov.in/

## Frequently Asked Questions

### Q: Do I need to pay for API access?

**A**: No! All Indian government APIs used are free for public access.

### Q: How often is data updated?

**A**: Agmarknet updates daily with mandi prices. Real-time updates depend on market reporting.

### Q: Can I use this in production?

**A**: Yes, but register for your own API key for higher rate limits and better reliability.

### Q: What if APIs are down?

**A**: The system automatically falls back to cached data or displays a user-friendly error message.

### Q: How do I add more data sources?

**A**: Follow the pattern in `agmarknetService.ts` to create new service classes for additional APIs.

### Q: Can I customize the data displayed?

**A**: Yes, modify the transformation functions in `dataTransformer.ts` to customize data presentation.

## Next Steps

1. ✅ Complete environment setup
2. ✅ Verify API connectivity
3. ⏳ Update React components (see implementation tasks)
4. ⏳ Add automated tests
5. ⏳ Deploy to production

For detailed implementation status, see `INDIAN_MARKET_DATA_IMPLEMENTATION.md`.

---

**Need Help?** Check the troubleshooting section or review the implementation documentation.
