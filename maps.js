// ====== Google Maps Integration ======

let map = null;
let userMarker = null;
let vendorMarkers = [];
let userCoords = null;
let searchAutocomplete = null;

// Initialize Google Map
function initMap(containerEl, center = { lat: 12.9716, lng: 77.5946 }, zoom = 14) {
    if (typeof google === 'undefined' || !google.maps) {
        console.warn('Google Maps API not loaded');
        return null;
    }

    map = new google.maps.Map(containerEl, {
        center: center,
        zoom: zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
            { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
            { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] }
        ]
    });

    return map;
}

// Detect user's current location
function detectUserLocation(callback) {
    if (!navigator.geolocation) {
        callback(null, 'Geolocation not supported');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            userCoords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            callback(userCoords, null);
        },
        (error) => {
            console.warn('Geolocation error:', error.message);
            // Default to Bangalore (fallback with alert)
            userCoords = { lat: 12.9716, lng: 77.5946 };
            console.log('Falling back to default coordinates:', userCoords);
            if (typeof alert !== 'undefined') {
                alert(typeof t !== 'undefined' ? t('fallback_location_msg') || 'Unable to fetch your exact location. Falling back to default.' : 'Unable to fetch your exact location. Falling back to default.');
            }
            callback(userCoords, null);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
}

// Add user location marker
function addUserMarker(coords) {
    if (!map || !google) return;

    if (userMarker) userMarker.setMap(null);

    userMarker = new google.maps.Marker({
        position: coords,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
        },
        title: t('your_location'),
        zIndex: 999
    });

    map.setCenter(coords);
}

// Add vendor markers to map
function addVendorMarkers(vendors) {
    // Clear existing markers
    vendorMarkers.forEach(m => m.setMap(null));
    vendorMarkers = [];

    if (!map || !google) return;

    const infoWindow = new google.maps.InfoWindow();

    vendors.forEach(vendor => {
        if (!vendor.location || !vendor.location.coordinates) return;

        const position = {
            lat: vendor.location.coordinates[1],
            lng: vendor.location.coordinates[0]
        };

        const marker = new google.maps.Marker({
            position: position,
            map: map,
            title: vendor.shopName || vendor.name,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="%23FF7A00"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`
                ),
                scaledSize: new google.maps.Size(36, 36)
            }
        });

        marker.addListener('click', () => {
            infoWindow.setContent(`
                <div style="font-family: 'Outfit', sans-serif; padding: 8px; min-width: 180px;">
                    <h3 style="margin: 0 0 4px; font-size: 14px; color: #1C1C1E;">${vendor.shopName || vendor.name}</h3>
                    <p style="margin: 0 0 6px; font-size: 12px; color: #8E8E93;">${vendor.address || 'Local vendor'}</p>
                    <button onclick="navigateTo('shop-detail')" style="background: #FF7A00; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; width: 100%;">
                        ${t('see_all')} ${t('products')}
                    </button>
                </div>
            `);
            infoWindow.open(map, marker);
        });

        vendorMarkers.push(marker);
    });
}

// Setup Places Autocomplete
function setupPlacesSearch(inputEl, callback) {
    if (!google || !google.maps || !google.maps.places) {
        console.warn('Google Maps Places API not available');
        return;
    }

    searchAutocomplete = new google.maps.places.Autocomplete(inputEl, {
        types: ['geocode'],
        componentRestrictions: { country: 'in' }
    });

    searchAutocomplete.addListener('place_changed', () => {
        const place = searchAutocomplete.getPlace();
        if (place.geometry) {
            const coords = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            if (map) {
                map.setCenter(coords);
                map.setZoom(15);
            }
            if (callback) callback(coords, place.formatted_address);
        }
    });
}

// Fetch nearby vendors from backend and show on map
async function loadNearbyVendors(lat, lng, radius = 5) {
    try {
        const response = await fetch(
            `http://localhost:5000/api/vendors/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
        );
        const vendors = await response.json();

        if (vendors.length === 0) {
            console.warn('No vendors returned from backend, using demo data');
            throw new Error('Empty vendors array');
        }

        addVendorMarkers(vendors);
        return vendors;
    } catch (error) {
        console.warn('Could not load vendors:', error.message);
        // Show demo vendors on map
        addVendorMarkers([
            { name: 'Sharma General Store', shopName: 'Sharma General Store', address: '1.2 km away', location: { coordinates: [lng + 0.005, lat + 0.003] } },
            { name: 'Green Leaf Veggies', shopName: 'Green Leaf Veggies', address: '2.5 km away', location: { coordinates: [lng - 0.008, lat + 0.006] } },
            { name: 'Apollo Pharmacy', shopName: 'Apollo Pharmacy', address: '0.8 km away', location: { coordinates: [lng + 0.002, lat - 0.004] } }
        ]);
        return [];
    }
}
