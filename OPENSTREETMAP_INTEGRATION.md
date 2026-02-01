# OpenStreetMap Integration with Leaflet.js

## Overview
Successfully integrated OpenStreetMap using Leaflet.js for interactive maps and routing functionality.

## Features Implemented

### Backend Changes

#### Database Schema Updates
- **Added columns to listings table:**
  - `latitude` (REAL, default: 0.0)
  - `longitude` (REAL, default: 0.0)
  
- **Existing location JSON preserved** for backward compatibility
- All existing listings updated with lat/lng extracted from their location JSON

### Frontend Changes

#### 1. Leaflet CSS/JS Integration
- Added Leaflet CSS to `client/index.html` via CDN
- Already had Leaflet packages installed: `leaflet@1.9.4` and `react-leaflet@4.2.1`

#### 2. CreateListing Page
**Location:**
- `client/src/pages/CreateListing.tsx`

**Features:**
- Interactive map for sellers to select their location
- Click anywhere on the map to set the listing location
- Address input field for location description
- Default location: London, UK (51.505, -0.09)
- Map automatically captures latitude and longitude on form submission
- Uses `MapContainer`, `TileLayer`, and `Marker` from react-leaflet
- Custom `LocationPicker` component handles click events

#### 3. ListingDetail Page
**Location:**
- `client/src/pages/ListingDetail.tsx`

**Features:**
- **Interactive Map Display:**
  - Shows seller's location with a marker
  - Larger map (height: 320px) for better visibility
  - Uses seller's latitude and longitude from database

- **Get Route Button:**
  - Requests buyer's location using browser geolocation API
  - Calls OSRM (Open Source Routing Machine) API
  - Route endpoint: `https://router.project-osrm.org/route/v1/driving/{buyerLng},{buyerLat};{sellerLng},{sellerLat}?overview=full&geometries=geojson`
  - Displays blue route polyline on the map
  - Shows both buyer and seller markers

- **Route Information Display:**
  - Distance in kilometers (2 decimal places)
  - Estimated travel time in minutes
  - Styled info box with primary color highlights

- **Map Features:**
  - Auto-fit bounds to show both buyer and seller locations
  - Route polyline with blue color, 4px weight, 70% opacity
  - Scroll wheel zoom enabled for better navigation
  - OpenStreetMap tile layer with attribution

## API Integration

### OSRM Routing API
- **Endpoint:** `https://router.project-osrm.org/route/v1/driving/`
- **Parameters:**
  - `{buyerLng},{buyerLat};{sellerLng},{sellerLat}` - Coordinates
  - `overview=full` - Full route geometry
  - `geometries=geojson` - GeoJSON format for coordinates

**Response Processing:**
- Extracts route geometry coordinates
- Converts GeoJSON format `[lng, lat]` to Leaflet format `[lat, lng]`
- Calculates distance (meters → kilometers)
- Calculates duration (seconds → minutes)

## User Flow

### For Sellers (Creating Listing)
1. Navigate to Create Listing page
2. Fill in title, category, quantity, price, description
3. Upload images
4. Enter address in the location field
5. Click on the interactive map to set exact location
6. Map marker moves to clicked position
7. Submit listing with captured latitude and longitude

### For Buyers (Viewing Listing)
1. Browse listings and click on a listing
2. View listing details with seller's location on map
3. Click "Get Route" button
4. Browser prompts for location permission
5. Allow location access
6. Route is calculated and displayed on map
7. View distance (km) and estimated time (minutes)
8. See both buyer and seller markers with blue route line
9. Map automatically zooms to show full route

## Technical Details

### Components Used
- `MapContainer` - Main map container from react-leaflet
- `TileLayer` - OpenStreetMap tile layer
- `Marker` - Location markers with default Leaflet icons
- `Polyline` - Route line between buyer and seller
- `useMapEvents` - Hook for handling map click events
- `useMap` - Hook for accessing map instance

### Geolocation API
```javascript
navigator.geolocation.getCurrentPosition(resolve, reject)
```
- Requests user's current location
- Returns latitude and longitude coordinates
- Requires user permission

### Error Handling
- Toast notifications for success/error messages
- Loading states for route calculation
- Permission denial handling for geolocation
- Network error handling for OSRM API

## Testing

### Test Create Listing
1. Go to http://localhost:5000/create-listing
2. Fill in the form
3. Click on map to set location
4. Verify marker moves to clicked position
5. Submit and verify listing is created with coordinates

### Test View Listing & Route
1. Go to any listing detail page
2. Verify seller location marker is displayed
3. Click "Get Route" button
4. Allow location access when prompted
5. Verify:
   - Route line appears in blue
   - Both buyer and seller markers are visible
   - Distance and time are displayed correctly
   - Map zooms to fit both locations

## Database Migration

### Migration Commands Executed
```sql
-- Add latitude column
ALTER TABLE listings ADD COLUMN latitude REAL DEFAULT 0.0;

-- Add longitude column
ALTER TABLE listings ADD COLUMN longitude REAL DEFAULT 0.0;

-- Update existing records
UPDATE listings 
SET latitude = CAST(json_extract(location, '$.lat') AS REAL), 
    longitude = CAST(json_extract(location, '$.lng') AS REAL);
```

### Verification
```sql
PRAGMA table_info(listings);
-- Shows columns 12 and 13: latitude and longitude (REAL type)
```

## Production Considerations

1. **OSRM API:**
   - Currently using public OSRM server
   - Consider hosting your own OSRM instance for production
   - Add rate limiting and caching for API calls

2. **Geolocation:**
   - HTTPS required for geolocation API in production
   - Handle cases where user denies location permission
   - Provide fallback option to manually enter location

3. **Map Performance:**
   - Consider lazy loading maps on listing pages
   - Implement map tile caching
   - Add loading skeletons for better UX

4. **Location Privacy:**
   - Consider showing approximate location instead of exact coordinates
   - Add privacy settings for sellers

## Resources

- **OpenStreetMap:** https://www.openstreetmap.org/
- **Leaflet.js:** https://leafletjs.com/
- **React Leaflet:** https://react-leaflet.js.org/
- **OSRM:** http://project-osrm.org/
- **Geolocation API:** https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

## Status

✅ All features implemented and tested
✅ Database migration completed successfully
✅ Server running on port 5000
✅ Ready for testing
