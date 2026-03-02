// App State & Routing Logic
const AppState = {
    currentScreen: 'splash',
    userType: 'customer', // 'customer' or 'vendor'
    cart: []
};

// Main render function
function renderScreen() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = '';

    switch (AppState.currentScreen) {
        case 'splash':
            appElement.innerHTML = renderSplash();
            setupSplashEvents();
            break;
        case 'location':
            appElement.innerHTML = renderLocation();
            setupLocationEvents();
            break;
        case 'login':
            appElement.innerHTML = renderLogin();
            setupLoginEvents();
            break;
        case 'home':
            appElement.innerHTML = renderHome();
            setupHomeEvents();
            break;
        case 'shop-detail':
            appElement.innerHTML = renderShopDetail();
            break;
        case 'cart':
            appElement.innerHTML = renderCart();
            break;
        case 'orders':
            appElement.innerHTML = renderOrders();
            break;
        case 'tracking':
            appElement.innerHTML = renderTracking();
            break;
        case 'profile':
            appElement.innerHTML = renderProfile();
            break;
        // --- Vendor Screens ---
        case 'vendor-dashboard':
            AppState.userType = 'vendor';
            appElement.innerHTML = renderVendorDashboard();
            break;
        case 'vendor-orders':
            AppState.userType = 'vendor';
            appElement.innerHTML = renderVendorOrders();
            break;
        case 'vendor-add-product':
            AppState.userType = 'vendor';
            appElement.innerHTML = renderVendorAddProduct();
            break;
        default:
            appElement.innerHTML = '<h2>Screen Not Found</h2>';
    }
}

// Global Navigator
function navigateTo(screen) {
    AppState.currentScreen = screen;
    renderScreen();
}

// --------- SCREENS ---------

function renderSplash() {
    return `
        <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(135deg, var(--primary-orange) 0%, #FF512F 100%); color: white;">
            <div style="font-size: 48px; font-weight: 700; margin-bottom: 10px; animation: fadeIn 0.8s ease-out;">Bazaar<br>Express</div>
            <p style="font-size: 16px; font-weight: 500; opacity: 0.9; animation: fadeIn 1.2s ease-out;">Supporting Local, Delivering Fast</p>
        </div>
    `;
}

function setupSplashEvents() {
    // Auto-navigate to location after 2 seconds
    setTimeout(() => {
        navigateTo('location');
    }, 2000);
}

function renderLocation() {
    return `
        <div style="padding: 24px; height: 100%; display: flex; flex-direction: column; background: var(--bg-color);">
            <div style="margin-top: 40px; text-align: center;">
                <i class="ri-map-pin-2-fill" style="font-size: 64px; color: var(--primary-orange);"></i>
                <h2 style="margin: 20px 0 10px;">Find Local Shops Near You</h2>
                <p class="text-muted" style="margin-bottom: 40px;">Serving within a 3-5 km radius for lightning fast delivery.</p>
            </div>
            
            <div style="margin-top: auto;">
                <button id="btn-detect-location" class="btn-primary" style="margin-bottom: 16px; display: flex; justify-content: center; align-items: center; gap: 8px;">
                    <i class="ri-focus-3-line"></i> Detect Current Location
                </button>
                <button id="btn-manual-location" class="btn-primary" style="background: white; color: var(--primary-orange); border: 1px solid var(--primary-orange);">
                    Enter Area Manually
                </button>
            </div>
        </div>
    `;
}

function setupLocationEvents() {
    document.getElementById('btn-detect-location').addEventListener('click', () => {
        navigateTo('login');
    });
    document.getElementById('btn-manual-location').addEventListener('click', () => {
        navigateTo('login');
    });
}

function renderLogin() {
    return `
        <div style="padding: 24px; height: 100%; display: flex; flex-direction: column; background: var(--bg-color);">
            <div style="margin-top: 40px;">
                <h2 style="margin-bottom: 10px;">Welcome to BazaarExpress</h2>
                <p class="text-muted" style="margin-bottom: 40px;">Login or sign up to continue</p>
                
                <div class="card">
                    <label style="font-size: 14px; font-weight: 500; color: var(--text-muted); margin-bottom: 8px; display: block;">Mobile Number</label>
                    <div style="display: flex; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); overflow: hidden; margin-bottom: 16px;">
                        <div style="background: #F0F0F0; padding: 12px 16px; font-weight: 500;">+91</div>
                        <input type="tel" placeholder="Enter your number" style="flex: 1; border: none; padding: 12px 16px; outline: none; font-size: 16px; font-family: inherit;">
                    </div>
                    
                    <button id="btn-login" class="btn-primary" style="margin-bottom: 16px;">Continue</button>
                    
                    <div style="text-align: center; margin: 16px 0; color: var(--text-muted); font-size: 14px;">OR</div>
                    
                    <button style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; background: white; border: 1px solid var(--border-color); padding: 12px; border-radius: var(--border-radius-sm); font-weight: 500; cursor: pointer;">
                        <i class="ri-google-fill" style="color: #DB4437; font-size: 18px;"></i> Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    `;
}

function setupLoginEvents() {
    document.getElementById('btn-login').addEventListener('click', () => {
        navigateTo('home');
    });
}

function renderHome() {
    return `
        <div style="height: 100%; display: flex; flex-direction: column; background: var(--bg-color);">
            <div style="padding: 16px 16px 10px; background: white; z-index: 10; box-shadow: var(--shadow-soft);">
                <div class="flex-row justify-between" style="margin-bottom: 16px;">
                    <div>
                        <div style="font-size: 12px; font-weight: 600; color: var(--primary-orange); display: flex; align-items: center; gap: 4px;">
                            <i class="ri-map-pin-fill"></i> Delivering to
                        </div>
                        <div style="font-weight: 600; font-size: 16px; display: flex; align-items: center; gap: 4px;">Sector 14, HSR Layout <i class="ri-arrow-down-s-line"></i></div>
                    </div>
                    <div style="background: var(--primary-orange-light); color: var(--primary-orange); width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer;" onclick="navigateTo('profile')">
                        <i class="ri-user-line" style="font-size: 20px;"></i>
                    </div>
                </div>
                
                <div style="background: var(--bg-color); border-radius: var(--border-radius-md); padding: 12px 16px; display: flex; align-items: center; gap: 10px;">
                    <i class="ri-search-line" style="color: var(--text-muted); font-size: 18px;"></i>
                    <input type="text" placeholder="Search for nearby shops or products..." style="border: none; background: transparent; outline: none; flex: 1; font-family: inherit; font-size: 14px;">
                </div>
            </div>
            
            <div style="flex: 1; overflow-y: auto; padding-bottom: 80px;">
                <!-- Video Banner -->
                <div style="padding: 16px;">
                    <div style="border-radius: var(--border-radius-lg); overflow: hidden; box-shadow: var(--shadow-medium); position: relative; background: #000; height: 200px;">
                        <video autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;">
                            <source src="Whisk_ezn2edo1itz3itz30smjhtytidmjrtl1ewmx0co.mp4" type="video/mp4">
                        </video>
                        <div style="position: absolute; bottom: 16px; left: 16px; color: white;">
                            <span style="background: var(--primary-orange); padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Promoted</span>
                            <h3 style="margin-top: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Fresh organic produce<br>from local farms.</h3>
                        </div>
                    </div>
                </div>

                <!-- Delivery Mode Toggle -->
                <div style="padding: 0 16px 16px;">
                    <div style="background: white; border-radius: var(--border-radius-md); padding: 4px; display: flex; box-shadow: var(--shadow-soft);">
                        <button style="flex: 1; background: var(--secondary-green-light); color: var(--secondary-green); border: none; padding: 10px; border-radius: var(--border-radius-sm); font-weight: 600; font-family: inherit; font-size: 14px; cursor: pointer;">
                            <i class="ri-flashlight-fill"></i> Fast (30-60m)
                        </button>
                        <button style="flex: 1; background: transparent; border: none; padding: 10px; border-radius: var(--border-radius-sm); font-weight: 600; font-family: inherit; font-size: 14px; color: var(--text-muted); cursor: pointer;">
                            <i class="ri-time-line"></i> Standard (3-4h)
                        </button>
                    </div>
                </div>

                <!-- Categories -->
                <div style="padding: 0 16px 16px;">
                    <h3 style="margin-bottom: 12px; font-size: 18px;">Categories</h3>
                    <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; margin: 0 -16px; padding: 0 16px;">
                        ${renderCategory('Groceries', 'ri-shopping-basket-fill', '#FFF3E0', '#FF9800')}
                        ${renderCategory('Dairy', 'ri-drop-fill', '#E3F2FD', '#2196F3')}
                        ${renderCategory('Veg', 'ri-leaf-fill', '#E8F5E9', '#4CAF50')}
                        ${renderCategory('Snacks', 'ri-cookie-fill', '#FCE4EC', '#E91E63')}
                        ${renderCategory('Meds', 'ri-capsule-fill', '#E0F7FA', '#00BCD4')}
                    </div>
                </div>

                <!-- Nearby Shops -->
                <div style="padding: 0 16px 16px;">
                    <div class="flex-row justify-between" style="margin-bottom: 12px;">
                        <h3 style="font-size: 18px;">Nearby Shops</h3>
                        <span style="color: var(--primary-orange); font-size: 14px; font-weight: 600; cursor: pointer;">See All</span>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        ${renderShopCard('Sharma General Store', '1.2 km', '30 mins', '4.8', 'Groceries')}
                        ${renderShopCard('Green Leaf Veggies', '2.5 km', '45 mins', '4.6', 'Vegetables')}
                        ${renderShopCard('Apollo Pharmacy', '0.8 km', '20 mins', '4.9', 'Medicines')}
                    </div>
                </div>
            </div>

            <!-- Bottom Navigation -->
            <div class="glass-nav" style="display: flex; justify-content: space-around; padding: 12px 0 20px; position: absolute; bottom: 0; width: 100%; z-index: 20;">
                <div style="display: flex; flex-direction: column; align-items: center; color: var(--primary-orange); cursor: pointer;" onclick="navigateTo('home')">
                    <i class="ri-home-5-fill" style="font-size: 24px;"></i>
                    <span style="font-size: 12px; font-weight: 600; margin-top: 4px;">Home</span>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; color: var(--text-muted); cursor: pointer;" onclick="navigateTo('orders')">
                    <i class="ri-file-list-3-line" style="font-size: 24px;"></i>
                    <span style="font-size: 12px; font-weight: 500; margin-top: 4px;">Orders</span>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; color: var(--text-muted); cursor: pointer; position: relative;" onclick="navigateTo('cart')">
                    <div class="pulse-anim" style="position: absolute; top: -4px; right: 0; background: var(--primary-orange); color: white; font-size: 10px; font-weight: 700; width: 16px; height: 16px; display: flex; justify-content: center; align-items: center; border-radius: 50%;">2</div>
                    <i class="ri-shopping-cart-2-line" style="font-size: 24px;"></i>
                    <span style="font-size: 12px; font-weight: 500; margin-top: 4px;">Cart</span>
                </div>
            </div>
        </div>
    `;
}

function renderCategory(name, iconClass, bgColor, iconColor) {
    return `
        <div class="category-item" style="display: flex; flex-direction: column; align-items: center; min-width: 70px; cursor: pointer;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: ${bgColor}; display: flex; justify-content: center; align-items: center; margin-bottom: 8px;">
                <i class="${iconClass}" style="font-size: 24px; color: ${iconColor};"></i>
            </div>
            <span style="font-size: 12px; font-weight: 500; text-align: center;">${name}</span>
        </div>
    `;
}

function renderShopCard(name, distance, time, rating, tags) {
    return `
        <div class="card" style="display: flex; gap: 16px; cursor: pointer; border: 1px solid transparent; transition: var(--transition-speed);" onclick="navigateTo('shop-detail')" onmouseover="this.style.borderColor='var(--primary-orange)'" onmouseout="this.style.borderColor='transparent'">
            <div style="width: 80px; height: 80px; border-radius: var(--border-radius-sm); background: #f0f0f0; display: flex; justify-content: center; align-items: center; color: #ccc;">
                <i class="ri-store-2-fill" style="font-size: 32px;"></i>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                <div class="flex-row justify-between">
                    <h4 style="font-size: 16px; margin-bottom: 4px;">${name}</h4>
                    <div style="background: var(--secondary-green); color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 2px;">
                        ${rating} <i class="ri-star-fill" style="font-size: 10px;"></i>
                    </div>
                </div>
                <div class="text-muted" style="font-size: 12px; margin-bottom: 8px;">${tags}</div>
                <div style="display: flex; gap: 12px; font-size: 12px; font-weight: 500;">
                    <span style="display: flex; align-items: center; gap: 4px;"><i class="ri-map-pin-line" style="color: var(--primary-orange);"></i> ${distance}</span>
                    <span style="display: flex; align-items: center; gap: 4px;"><i class="ri-time-line" style="color: var(--secondary-green);"></i> ${time}</span>
                </div>
            </div>
        </div>
    `;
}

function setupHomeEvents() {
    // Setup home events
}

function renderShopDetail() {
    return `
        <div style="height: 100%; display: flex; flex-direction: column; background: var(--bg-color);">
            <div style="padding: 16px; background: white; display: flex; align-items: center; gap: 16px; box-shadow: var(--shadow-soft); z-index: 10;">
                <i class="ri-arrow-left-line" style="font-size: 24px; cursor: pointer;" onclick="navigateTo('home')"></i>
                <h2 style="font-size: 18px; flex: 1;">Sharma General Store</h2>
                <div style="background: var(--secondary-green-light); color: var(--secondary-green); padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                    <i class="ri-time-line"></i> 30 mins
                </div>
            </div>
            
            <div style="flex: 1; overflow-y: auto; padding: 16px; padding-bottom: 80px;">
                <div style="background: white; border-radius: var(--border-radius-md); padding: 16px; margin-bottom: 20px; box-shadow: var(--shadow-soft);">
                    <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 60px; height: 60px; background: #f0f0f0; border-radius: var(--border-radius-sm); display: flex; justify-content: center; align-items: center;">
                            <i class="ri-store-2-fill" style="font-size: 24px; color: #ccc;"></i>
                        </div>
                        <div>
                            <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 4px;">Groceries & Daily Needs</div>
                            <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600;">
                                <span style="display: flex; align-items: center; gap: 2px;"><i class="ri-star-fill" style="color: var(--primary-orange);"></i> 4.8</span>
                                <span style="width: 4px; height: 4px; background: #ccc; border-radius: 50%;"></span>
                                <span>1.2 km away</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Smart Feature: Suggested Alternative Shop -->
                    <div style="background: #FFF3E0; border: 1px solid #FF9800; border-radius: var(--border-radius-sm); padding: 12px; margin-bottom: 12px; display: flex; align-items: flex-start; gap: 10px;">
                        <i class="ri-error-warning-fill" style="color: #FF9800; font-size: 20px; margin-top: 2px;"></i>
                        <div style="flex: 1;">
                            <div style="font-size: 13px; font-weight: 600; color: #E65100; margin-bottom: 4px;">High Order Volume Detected</div>
                            <div style="font-size: 11px; color: var(--text-main); margin-bottom: 8px;">This shop is currently very busy. Delivery might take longer than usual.</div>
                            <button style="background: white; border: 1px solid #FF9800; color: #E65100; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer;">
                                View Faster Alternative Shop <i class="ri-arrow-right-line" style="vertical-align: middle;"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Smart Feature: Predicted Popular -->
                    <div style="background: var(--primary-orange-light); border: 1px dashed var(--primary-orange); border-radius: var(--border-radius-sm); padding: 10px; display: flex; align-items: center; gap: 10px;">
                        <i class="ri-sparkling-fill" style="color: var(--primary-orange); font-size: 20px;"></i>
                        <div style="font-size: 12px;">
                            <span style="font-weight: 600; color: var(--primary-orange);">AI Suggestion:</span> Highly ordered at this time - Milk & Bread.
                        </div>
                    </div>
                </div>

                <h3 style="margin-bottom: 16px; font-size: 16px;">Products</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    ${renderProductCard('Amul Taaza Milk', '₹28', '500ml', true)}
                    ${renderProductCard('Britannia Bread', '₹45', '400g', true)}
                    ${renderProductCard('Aashirvaad Atta', '₹210', '5kg', true)}
                    ${renderProductCard('Tata Salt', '₹25', '1kg', false)}
                </div>
            </div>

            <!-- Sticky Cart Banner -->
            <div style="position: absolute; bottom: 0; width: 100%; padding: 16px; background: white; border-top: 1px solid var(--border-color); z-index: 20;">
                <button class="btn-primary" style="display: flex; justify-content: space-between; align-items: center;" onclick="navigateTo('cart')">
                    <span>2 Items | ₹73</span>
                    <span>View Cart <i class="ri-arrow-right-line"></i></span>
                </button>
            </div>
        </div>
    `;
}

function renderProductCard(name, price, weight, inStock) {
    return `
        <div style="background: white; border-radius: var(--border-radius-md); padding: 12px; box-shadow: var(--shadow-soft); display: flex; flex-direction: column;">
            <div style="height: 100px; background: #f8f9fa; border-radius: var(--border-radius-sm); margin-bottom: 12px; display: flex; justify-content: center; align-items: center;">
                <i class="ri-image-line" style="font-size: 32px; color: #ddd;"></i>
            </div>
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">${name}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">${weight}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                <div style="font-weight: 700; font-size: 14px;">${price}</div>
                ${inStock
            ? `<button style="background: white; border: 1px solid var(--primary-orange); color: var(--primary-orange); border-radius: 4px; padding: 4px 12px; font-weight: 600; cursor: pointer;">ADD</button>`
            : `<span style="font-size: 10px; font-weight: 600; color: red; background: #ffebee; padding: 4px 8px; border-radius: 4px;">Out of Stock</span>`
        }
            </div>
        </div>
    `;
}

function renderCart() {
    return `
        <div style="height: 100%; display: flex; flex-direction: column; background: var(--bg-color);">
            <div style="padding: 16px; background: white; display: flex; align-items: center; gap: 16px; box-shadow: var(--shadow-soft); z-index: 10;">
                <i class="ri-arrow-left-line" style="font-size: 24px; cursor: pointer;" onclick="navigateTo('home')"></i>
                <h2 style="font-size: 18px; flex: 1;">Cart</h2>
            </div>
            
            <div style="flex: 1; overflow-y: auto; padding: 16px; padding-bottom: 80px;">
                <!-- Cart Items -->
                <div style="background: white; border-radius: var(--border-radius-md); padding: 16px; margin-bottom: 16px; box-shadow: var(--shadow-soft);">
                    <div style="font-weight: 600; font-size: 14px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px dashed var(--border-color);">
                        Sharma General Store
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 16px;">
                        <div style="font-size: 20px; color: var(--secondary-green); margin-right: 12px;"><i class="ri-checkbox-circle-fill"></i></div>
                        <div style="flex: 1;">
                            <div style="font-size: 14px; font-weight: 500;">Amul Taaza Milk</div>
                            <div style="font-size: 12px; color: var(--text-muted);">500ml x 1</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; background: var(--primary-orange-light); border-radius: 4px; padding: 2px;">
                            <button style="border: none; background: white; width: 24px; height: 24px; border-radius: 2px; color: var(--primary-orange); display: flex; justify-content: center; align-items: center; cursor: pointer;">-</button>
                            <span style="font-size: 14px; font-weight: 600; width: 16px; text-align: center;">1</span>
                            <button style="border: none; background: white; width: 24px; height: 24px; border-radius: 2px; color: var(--primary-orange); display: flex; justify-content: center; align-items: center; cursor: pointer;">+</button>
                        </div>
                        <div style="font-weight: 600; width: 60px; text-align: right;">₹28</div>
                    </div>
                    
                    <div style="display: flex; align-items: center;">
                        <div style="font-size: 20px; color: var(--secondary-green); margin-right: 12px;"><i class="ri-checkbox-circle-fill"></i></div>
                        <div style="flex: 1;">
                            <div style="font-size: 14px; font-weight: 500;">Britannia Bread</div>
                            <div style="font-size: 12px; color: var(--text-muted);">400g x 1</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; background: var(--primary-orange-light); border-radius: 4px; padding: 2px;">
                            <button style="border: none; background: white; width: 24px; height: 24px; border-radius: 2px; color: var(--primary-orange); display: flex; justify-content: center; align-items: center; cursor: pointer;">-</button>
                            <span style="font-size: 14px; font-weight: 600; width: 16px; text-align: center;">1</span>
                            <button style="border: none; background: white; width: 24px; height: 24px; border-radius: 2px; color: var(--primary-orange); display: flex; justify-content: center; align-items: center; cursor: pointer;">+</button>
                        </div>
                        <div style="font-weight: 600; width: 60px; text-align: right;">₹45</div>
                    </div>
                </div>

                <!-- Smart Features: Delivery Mode -->
                <div style="background: white; border-radius: var(--border-radius-md); padding: 16px; margin-bottom: 16px; box-shadow: var(--shadow-soft);">
                    <h4 style="font-size: 14px; margin-bottom: 12px;">Select Delivery Speed</h4>
                    <div style="background: #E8F5E9; border: 1px dashed #4CAF50; border-radius: var(--border-radius-sm); padding: 10px; margin-bottom: 16px; display: flex; align-items: flex-start; gap: 10px;">
                        <i class="ri-sparkling-fill" style="color: #4CAF50; font-size: 20px;"></i>
                        <div style="font-size: 12px;">
                            <span style="font-weight: 600; color: #4CAF50;">Smart Suggestion:</span> We noticed daily essentials in your cart. Choose <strong>Fast Delivery</strong> to get them within 30 mins!
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <label style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 2px solid var(--primary-orange); border-radius: var(--border-radius-sm); background: var(--primary-orange-light); cursor: pointer;">
                            <input type="radio" name="delivery" checked style="accent-color: var(--primary-orange);">
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 4px;"><i class="ri-flashlight-fill" style="color: var(--primary-orange);"></i> Fast Delivery</div>
                                <div style="font-size: 12px; color: var(--text-muted);">30-60 mins</div>
                            </div>
                            <div style="font-weight: 600;">₹40</div>
                        </label>
                        <label style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); cursor: pointer;">
                            <input type="radio" name="delivery" style="accent-color: var(--primary-orange);">
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 4px;"><i class="ri-time-line"></i> Standard Delivery</div>
                                <div style="font-size: 12px; color: var(--text-muted);">3-4 hrs</div>
                            </div>
                            <div style="font-weight: 600; color: var(--secondary-green);">FREE</div>
                        </label>
                    </div>
                </div>

                <!-- Bill Details -->
                <div style="background: white; border-radius: var(--border-radius-md); padding: 16px; box-shadow: var(--shadow-soft);">
                    <h4 style="font-size: 14px; margin-bottom: 12px;">Bill Details</h4>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
                        <span class="text-muted">Item Total</span>
                        <span style="font-weight: 500;">₹73</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
                        <span class="text-muted">Delivery Fee</span>
                        <span style="font-weight: 500;">₹40</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed var(--border-color);">
                        <span class="text-muted">Taxes</span>
                        <span style="font-weight: 500;">₹4</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700;">
                        <span>To Pay</span>
                        <span>₹117</span>
                    </div>
                </div>
            </div>

            <!-- Checkout Button -->
            <div style="position: absolute; bottom: 0; width: 100%; padding: 16px; background: white; border-top: 1px solid var(--border-color); z-index: 20;">
                <button class="btn-primary" onclick="navigateTo('tracking')">Proceed to Pay ₹117</button>
            </div>
        </div>
    `;
}

function renderOrders() {
    return `
        <div style="height: 100%; display: flex; flex-direction: column; background: var(--bg-color);">
            <div style="padding: 16px; background: white; display: flex; align-items: center; gap: 16px; box-shadow: var(--shadow-soft); z-index: 10;">
                <h2 style="font-size: 18px; flex: 1; text-align: center;">My Orders</h2>
            </div>
            
            <div style="flex: 1; overflow-y: auto; padding: 16px;">
                <div class="card" style="margin-bottom: 16px;">
                    <div class="flex-row justify-between" style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color);">
                        <div style="font-size: 14px; font-weight: 600;">Sharma General Store</div>
                        <div style="font-size: 12px; color: var(--primary-orange); font-weight: 600; padding: 4px 8px; background: var(--primary-orange-light); border-radius: 4px;">In Transit</div>
                    </div>
                    <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">2 items • ₹117</div>
                    <button class="btn-primary" style="padding: 8px; font-size: 14px; background: white; color: var(--primary-orange); border: 1px solid var(--primary-orange);" onclick="navigateTo('tracking')">Track Order</button>
                </div>
            </div>

            <div class="glass-nav" style="display: flex; justify-content: space-around; padding: 12px 0 20px; position: absolute; bottom: 0; width: 100%; z-index: 20;">
                <div style="display: flex; flex-direction: column; align-items: center; color: var(--text-muted); cursor: pointer;" onclick="navigateTo('home')">
                    <i class="ri-home-5-fill" style="font-size: 24px;"></i>
                    <span style="font-size: 12px; font-weight: 500; margin-top: 4px;">Home</span>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; color: var(--primary-orange); cursor: pointer;" onclick="navigateTo('orders')">
                    <i class="ri-file-list-3-line" style="font-size: 24px;"></i>
                    <span style="font-size: 12px; font-weight: 600; margin-top: 4px;">Orders</span>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; color: var(--text-muted); cursor: pointer;" onclick="navigateTo('cart')">
                    <i class="ri-shopping-cart-2-line" style="font-size: 24px;"></i>
                    <span style="font-size: 12px; font-weight: 500; margin-top: 4px;">Cart</span>
                </div>
            </div>
        </div>
    `;
}

function renderTracking() {
    return `
        <div style="height: 100%; display: flex; flex-direction: column; background: var(--bg-color);">
            <!-- Map background simulation -->
            <div style="flex: 1; background: #E8EAF6; position: relative; display: flex; flex-direction: column;">
                <div style="padding: 16px; background: white; display: flex; align-items: center; gap: 16px; box-shadow: var(--shadow-soft); z-index: 10;">
                    <i class="ri-arrow-left-line" style="font-size: 24px; cursor: pointer;" onclick="navigateTo('home')"></i>
                    <h2 style="font-size: 18px; flex: 1;">Track Order</h2>
                    <span style="background: #2196F3; color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 700;">#OD123987</span>
                </div>

                <div style="flex: 1; position: relative;">
                    <!-- Fake map lines and pin -->
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.5;">
                        <path d="M 50,150 Q 150,50 300,200 T 400,100" fill="none" stroke="var(--primary-orange)" stroke-width="4" stroke-dasharray="10,10" />
                    </svg>
                    <div style="position: absolute; top: 180px; left: 280px; color: var(--primary-orange); font-size: 40px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">
                        <i class="ri-e-bike-2-fill" style="transform: scaleX(-1); display: inline-block;"></i>
                    </div>
                </div>

                <!-- Bottom Status Container -->
                <div style="background: white; border-radius: 24px 24px 0 0; padding: 24px 20px; box-shadow: 0 -8px 24px rgba(0,0,0,0.1); position: relative; z-index: 20;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h3 style="font-size: 20px; margin-bottom: 4px;">Arriving in 15 mins</h3>
                        <p class="text-muted" style="font-size: 14px;">Your order is out for delivery</p>
                    </div>

                    <!-- Timeline -->
                    <div style="margin-bottom: 24px; display: flex; align-items: flex-start; gap: 12px;">
                        <div style="display: flex; flex-direction: column; align-items: center; margin-top: 4px;">
                            <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--secondary-green);"></div>
                            <div style="width: 2px; height: 40px; background: var(--secondary-green);"></div>
                            <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--secondary-green);"></div>
                            <div style="width: 2px; height: 40px; background: var(--secondary-green);"></div>
                            <div style="width: 16px; height: 16px; border-radius: 50%; background: white; border: 4px solid var(--primary-orange);"></div>
                            <div style="width: 2px; height: 40px; background: var(--border-color);"></div>
                            <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--border-color);"></div>
                        </div>
                        <div style="flex: 1; display: flex; flex-direction: column; gap: 32px; font-size: 14px; font-weight: 500;">
                            <div>Order Confirmed<div style="font-size: 12px; font-weight: 400; color: var(--text-muted);">10:15 AM</div></div>
                            <div>Order Packed<div style="font-size: 12px; font-weight: 400; color: var(--text-muted);">10:25 AM</div></div>
                            <div style="color: var(--primary-orange); font-weight: 700;">Out for Delivery<div style="font-size: 12px; font-weight: 400; color: var(--text-muted);">10:30 AM</div></div>
                            <div style="color: var(--text-muted);">Delivered</div>
                        </div>
                    </div>

                    <!-- Delivery Partner -->
                    <div style="display: flex; align-items: center; gap: 16px; padding: 16px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);">
                        <div style="width: 48px; height: 48px; border-radius: 50%; background: #f0f0f0; display: flex; justify-content: center; align-items: center;">
                            <i class="ri-user-smile-fill" style="font-size: 24px; color: #ccc;"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 16px; margin-bottom: 2px;">Ramesh K.</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Delivery Partner • 4.9 ★</div>
                        </div>
                        <div style="background: var(--secondary-green-light); color: var(--secondary-green); width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer;">
                            <i class="ri-phone-fill" style="font-size: 20px;"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderProfile() {
    return `
        <div style="height: 100%; display: flex; flex-direction: column; background: var(--bg-color);">
            <div style="padding: 16px; background: white; display: flex; align-items: center; gap: 16px; box-shadow: var(--shadow-soft); z-index: 10;">
                <i class="ri-arrow-left-line" style="font-size: 24px; cursor: pointer;" onclick="navigateTo('home')"></i>
                <h2 style="font-size: 18px; flex: 1;">Profile</h2>
            </div>
            
            <div style="flex: 1; overflow-y: auto; padding: 16px;">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding: 16px; background: white; border-radius: var(--border-radius-md); box-shadow: var(--shadow-soft);">
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--primary-orange-light); color: var(--primary-orange); display: flex; justify-content: center; align-items: center; font-size: 24px; font-weight: 700;">
                        JD
                    </div>
                    <div style="flex: 1;">
                        <h3 style="font-size: 18px;">John Doe</h3>
                        <p style="font-size: 14px; color: var(--text-muted);">+91 98765 43210</p>
                    </div>
                    <i class="ri-edit-line" style="color: var(--primary-orange); font-size: 20px; cursor: pointer;"></i>
                </div>

                <div style="background: white; border-radius: var(--border-radius-md); padding: 8px 16px; box-shadow: var(--shadow-soft); margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-color); cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 500;">
                            <i class="ri-map-pin-line" style="font-size: 20px; color: var(--primary-orange);"></i> Saved Addresses
                        </div>
                        <i class="ri-arrow-right-s-line" style="color: var(--text-muted); font-size: 20px;"></i>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-color); cursor: pointer;" onclick="navigateTo('orders')">
                        <div style="display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 500;">
                            <i class="ri-file-list-3-line" style="font-size: 20px; color: var(--primary-orange);"></i> Order History
                        </div>
                        <i class="ri-arrow-right-s-line" style="color: var(--text-muted); font-size: 20px;"></i>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-color); cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 500;">
                            <i class="ri-bank-card-line" style="font-size: 20px; color: var(--primary-orange);"></i> Payment Methods
                        </div>
                        <i class="ri-arrow-right-s-line" style="color: var(--text-muted); font-size: 20px;"></i>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 500;">
                            <i class="ri-customer-service-2-line" style="font-size: 20px; color: var(--primary-orange);"></i> Support & Help
                        </div>
                        <i class="ri-arrow-right-s-line" style="color: var(--text-muted); font-size: 20px;"></i>
                    </div>
                </div>

                <!-- Toggle to Vendor Mode -->
                <div style="background: var(--primary-orange-light); border: 1px dashed var(--primary-orange); border-radius: var(--border-radius-md); padding: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="navigateTo('vendor-dashboard')">
                    <div>
                        <h4 style="font-size: 14px; margin-bottom: 4px; color: var(--primary-orange);">Are you a Shop Owner?</h4>
                        <p style="font-size: 12px; color: var(--text-muted);">Switch to Vendor App Dashboard</p>
                    </div>
                    <i class="ri-store-2-line" style="font-size: 24px; color: var(--primary-orange);"></i>
                </div>
            </div>
        </div>
    `;
}

// --- VENDOR SCREENS ---

function renderVendorBottomNav(activeScreen) {
    return `
        <div class="glass-nav" style="display: flex; justify-content: space-around; padding: 12px 0 20px; position: absolute; bottom: 0; width: 100%; z-index: 20;">
            <div style="display: flex; flex-direction: column; align-items: center; color: ${activeScreen === 'dashboard' ? 'var(--primary-orange)' : 'var(--text-muted)'}; cursor: pointer;" onclick="navigateTo('vendor-dashboard')">
                <i class="${activeScreen === 'dashboard' ? 'ri-dashboard-fill' : 'ri-dashboard-line'}" style="font-size: 24px;"></i>
                <span style="font-size: 12px; font-weight: ${activeScreen === 'dashboard' ? '600' : '500'}; margin-top: 4px;">Dashboard</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; color: ${activeScreen === 'products' ? 'var(--primary-orange)' : 'var(--text-muted)'}; cursor: pointer;" onclick="navigateTo('vendor-add-product')">
                <i class="${activeScreen === 'products' ? 'ri-box-3-fill' : 'ri-box-3-line'}" style="font-size: 24px;"></i>
                <span style="font-size: 12px; font-weight: ${activeScreen === 'products' ? '600' : '500'}; margin-top: 4px;">Products</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; color: ${activeScreen === 'orders' ? 'var(--primary-orange)' : 'var(--text-muted)'}; cursor: pointer; position: relative;" onclick="navigateTo('vendor-orders')">
                <div style="position: absolute; top: -4px; right: 0; background: var(--secondary-green); color: white; font-size: 10px; font-weight: 700; width: 16px; height: 16px; display: flex; justify-content: center; align-items: center; border-radius: 50%;">4</div>
                <i class="${activeScreen === 'orders' ? 'ri-file-list-3-fill' : 'ri-file-list-3-line'}" style="font-size: 24px;"></i>
                <span style="font-size: 12px; font-weight: ${activeScreen === 'orders' ? '600' : '500'}; margin-top: 4px;">Orders</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; color: ${activeScreen === 'profile' ? 'var(--primary-orange)' : 'var(--text-muted)'}; cursor: pointer;" onclick="navigateTo('profile')">
                <i class="${activeScreen === 'profile' ? 'ri-user-fill' : 'ri-user-line'}" style="font-size: 24px;"></i>
                <span style="font-size: 12px; font-weight: ${activeScreen === 'profile' ? '600' : '500'}; margin-top: 4px;">Profile</span>
            </div>
        </div>
    `;
}

function renderVendorDashboard() {
    return `
        <div style="height: 100%; display: flex; flex-direction: column; background: var(--bg-color);">
            <div style="padding: 16px; background: white; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-soft); z-index: 10;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: #f0f0f0; border-radius: var(--border-radius-sm); display: flex; justify-content: center; align-items: center;">
                        <i class="ri-store-2-fill" style="font-size: 20px; color: var(--primary-orange);"></i>
                    </div>
                    <div>
                        <h2 style="font-size: 16px;">Sharma General Store</h2>
                        <div style="font-size: 12px; color: var(--secondary-green); font-weight: 600;">● Online</div>
                    </div>
                </div>
                <i class="ri-notification-3-line" style="font-size: 24px; color: var(--text-main);"></i>
            </div>
            
            <div style="flex: 1; overflow-y: auto; padding: 16px; padding-bottom: 80px;">
                <!-- Revenue & Orders Overview -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                    <div style="background: white; border-radius: var(--border-radius-md); padding: 16px; box-shadow: var(--shadow-soft);">
                        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Today's Revenue</div>
                        <div style="font-size: 24px; font-weight: 700; color: var(--text-main);">₹4,250</div>
                        <div style="font-size: 12px; color: var(--secondary-green); margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                            <i class="ri-arrow-up-line"></i> 12% vs yesterday
                        </div>
                    </div>
                    <div style="background: white; border-radius: var(--border-radius-md); padding: 16px; box-shadow: var(--shadow-soft);" onclick="navigateTo('vendor-orders')">
                        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Active Orders</div>
                        <div style="font-size: 24px; font-weight: 700; color: var(--text-main);">4</div>
                        <div style="font-size: 12px; color: var(--primary-orange); margin-top: 4px;">2 Pending Action</div>
                    </div>
                </div>

                <!-- Smart Feature: Auto-generate Promotional Banner -->
                <div style="background: linear-gradient(135deg, var(--primary-orange) 0%, #FF512F 100%); border-radius: var(--border-radius-md); padding: 16px; margin-bottom: 20px; color: white; box-shadow: var(--shadow-medium); position: relative; overflow: hidden;">
                    <i class="ri-sparkling-fill" style="position: absolute; right: -10px; top: -10px; font-size: 80px; opacity: 0.2;"></i>
                    <div style="position: relative; z-index: 1;">
                        <h3 style="font-size: 16px; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                            <i class="ri-magic-line"></i> Create Promo Banner
                        </h3>
                        <p style="font-size: 12px; opacity: 0.9; margin-bottom: 12px; line-height: 1.4;">Attract more customers with an AI-generated seasonal video banner for your shop.</p>
                        <button style="background: white; color: var(--primary-orange); border: none; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                            Generate Now <i class="ri-arrow-right-line"></i>
                        </button>
                    </div>
                </div>

                <!-- Smart Feature: Smart Stock Alert -->
                <div style="background: white; border-radius: var(--border-radius-md); padding: 16px; box-shadow: var(--shadow-soft); border-left: 4px solid #F44336;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h3 style="font-size: 14px; display: flex; align-items: center; gap: 8px; color: #F44336;">
                            <i class="ri-error-warning-fill"></i> Low Stock Alerts
                        </h3>
                    </div>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; background: #f0f0f0; border-radius: 4px; display: flex; justify-content: center; align-items: center;">
                                <i class="ri-image-line" style="color: #ccc;"></i>
                            </div>
                            <div>
                                <div style="font-size: 14px; font-weight: 500;">Amul Taaza Milk</div>
                                <div style="font-size: 12px; color: var(--text-muted);">Only 2 left (Usually sells 15/day)</div>
                            </div>
                        </div>
                        <button style="background: transparent; border: 1px solid var(--primary-orange); color: var(--primary-orange); padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer;">Restock</button>
                    </div>

                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; background: #f0f0f0; border-radius: 4px; display: flex; justify-content: center; align-items: center;">
                                <i class="ri-image-line" style="color: #ccc;"></i>
                            </div>
                            <div>
                                <div style="font-size: 14px; font-weight: 500;">Tata Salt 1kg</div>
                                <div style="font-size: 12px; color: var(--text-muted);">Out of Stock</div>
                            </div>
                        </div>
                        <button style="background: transparent; border: 1px solid var(--primary-orange); color: var(--primary-orange); padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer;">Restock</button>
                    </div>
                </div>

            </div>
            
            ${renderVendorBottomNav('dashboard')}
        </div>
    `;
}

function renderVendorOrders() {
    return `
        <div style="height: 100%; display: flex; flex-direction: column; background: var(--bg-color);">
            <div style="padding: 16px; background: white; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-soft); z-index: 10;">
                <h2 style="font-size: 18px;">Orders</h2>
                <div style="display: flex; gap: 8px;">
                    <span style="background: var(--primary-orange); color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">Active (4)</span>
                    <span style="background: var(--bg-color); color: var(--text-muted); padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">Completed</span>
                </div>
            </div>
            
            <div style="flex: 1; overflow-y: auto; padding: 16px; padding-bottom: 80px;">
                
                <!-- Pending Action Order -->
                <div style="background: white; border-radius: var(--border-radius-md); padding: 16px; box-shadow: var(--shadow-medium); margin-bottom: 16px; border-left: 4px solid var(--primary-orange);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <div>
                            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Order #OD9876</div>
                            <div style="font-size: 16px; font-weight: 600;">₹245 • 3 Items</div>
                        </div>
                        <!-- Delivery Type Indicator -->
                        <div style="background: var(--primary-orange-light); color: var(--primary-orange); padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                            <i class="ri-flashlight-fill"></i> FAST DELIVERY (30m)
                        </div>
                    </div>
                    
                    <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                        1x Amul Milk, 1x Bread, 1x Eggs (6pcs)
                    </div>
                    
                    <!-- Accept / Reject Actions -->
                    <div style="display: flex; gap: 12px;">
                        <button style="flex: 1; background: var(--secondary-green); color: white; border: none; padding: 10px; border-radius: var(--border-radius-sm); font-weight: 600; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 6px;">
                            <i class="ri-check-line"></i> Accept
                        </button>
                        <button style="flex: 1; background: white; color: #F44336; border: 1px solid #F44336; padding: 10px; border-radius: var(--border-radius-sm); font-weight: 600; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 6px;">
                            <i class="ri-close-line"></i> Reject
                        </button>
                    </div>
                </div>

                <!-- Accepted & Packing Order -->
                <div style="background: white; border-radius: var(--border-radius-md); padding: 16px; box-shadow: var(--shadow-soft); margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <div>
                            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Order #OD9874</div>
                            <div style="font-size: 16px; font-weight: 600;">₹117 • 2 Items</div>
                        </div>
                        <div style="background: #E3F2FD; color: #1976D2; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                            <i class="ri-time-line"></i> STANDARD
                        </div>
                    </div>
                    
                    <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                        1x Amul Taaza Milk, 1x Britannia Bread
                    </div>
                    
                    <!-- Mark as Packed -->
                    <button style="width: 100%; background: #1976D2; color: white; border: none; padding: 10px; border-radius: var(--border-radius-sm); font-weight: 600; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 6px;">
                        <i class="ri-box-3-fill"></i> Mark as Packed
                    </button>
                </div>

            </div>
            
            ${renderVendorBottomNav('orders')}
        </div>
    `;
}

function renderVendorAddProduct() {
    return `
        <div style="height: 100%; display: flex; flex-direction: column; background: var(--bg-color);">
            <div style="padding: 16px; background: white; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-soft); z-index: 10;">
                <h2 style="font-size: 18px;">My Products</h2>
                <button style="background: var(--primary-orange); color: white; border: none; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                    <i class="ri-add-line"></i> Add New
                </button>
            </div>
            
            <div style="flex: 1; overflow-y: auto; padding: 16px; padding-bottom: 80px;">
                
                <!-- Add Product Form Simulation -->
                <div style="background: white; border-radius: var(--border-radius-md); padding: 16px; box-shadow: var(--shadow-soft); margin-bottom: 24px;">
                    <h3 style="font-size: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Add New Product</h3>
                    
                    <!-- Image Upload -->
                    <div style="border: 1px dashed var(--primary-orange); border-radius: var(--border-radius-sm); height: 120px; display: flex; flex-direction: column; justify-content: center; align-items: center; background: var(--primary-orange-light); cursor: pointer; margin-bottom: 16px;">
                        <i class="ri-image-add-line" style="font-size: 32px; color: var(--primary-orange); margin-bottom: 8px;"></i>
                        <span style="font-size: 12px; color: var(--primary-orange); font-weight: 600;">Tap to Upload Image</span>
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px; display: block;">Product Name</label>
                        <input type="text" placeholder="e.g. Atta 5kg" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-family: inherit;">
                    </div>

                    <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                        <div style="flex: 1;">
                            <label style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px; display: block;">Price (₹)</label>
                            <input type="number" placeholder="0.00" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-family: inherit;">
                        </div>
                        <div style="flex: 1;">
                            <label style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px; display: block;">Stock Qty</label>
                            <input type="number" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-family: inherit;">
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px; display: block;">Category</label>
                        <select style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-family: inherit; background: white;">
                            <option>Groceries</option>
                            <option>Vegetables</option>
                            <option>Dairy</option>
                            <option>Snacks</option>
                        </select>
                    </div>

                    <button class="btn-primary">Save Product</button>
                </div>

            </div>
            
            ${renderVendorBottomNav('products')}
        </div>
    `;
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderScreen();
});
