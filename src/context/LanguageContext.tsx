'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type Lang = 'en' | 'ti';

const translations = {
  en: {
    // Navigation
    home: 'Home',
    shop: 'Shop',
    track: 'Track Order',
    orders: 'My Orders',
    signIn: 'Sign In',
    cart: 'Cart',
    search: 'Search for products, fashion and tech...',
    
    // Hero & Home
    heroTitle: 'Global Premium Collection',
    heroSubtitle: 'Experience the next generation of e-commerce. Curated global fashion, elite electronics, and worldwide delivery.',
    exploreBtn: 'Explore Collection',
    trackBtn: 'Track Your Order',
    
    // Sections
    topRated: 'Top Rated',
    newArrivals: 'New Arrivals',
    new: 'New',
    trending: 'Trending Now',
    categoriesTitle: 'Shop By Category',
    discoverMore: 'Discover More',
    
    // Trust
    trustDelivery: 'Worldwide Shipping',
    trustDeliverySub: 'Fast, tracked delivery to your door',
    trustPayment: 'Secure Checkout',
    trustPaymentSub: 'Encrypted payments via Stripe',
    trustReturns: 'Hassle-Free Returns',
    trustReturnsSub: '14-day return policy',
    trustAI: 'Sara AI Support',
    trustAISub: 'Instant help with your shopping',
    
    // Product Detail
    viewDetails: 'View Details',
    addToCart: 'Add to Collection',
    added: '✓ Added to Cart',
    selectSize: 'Select Size',
    selectColor: 'Select Color',
    sizeGuide: 'Size Guide',
    quantity: 'Quantity',
    description: 'Description',
    defaultDescription: 'This premium item has been meticulously curated for the Azmarino global collection. Quality, durability, and contemporary style are guaranteed.',
    reviews: 'Customer Reviews',
    noReviews: 'No reviews yet for this collection piece.',
    stockIn: 'In Stock',
    stockOut: 'Out of Stock',
    related: 'You May Also Like',
    endOfCollection: 'The end of the collection.',
    featuredCollection: 'Featured Collection',
    allCollection: 'All Collection',
    all: 'All',
    noResults: 'No pieces matching your search',
    clearFilters: 'Clear Filters',
    
    // Cart
    yourSelection: 'Your Selection',
    item: 'Item',
    items: 'Items',
    emptyCart: 'Your cart is currently empty',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    total: 'Total',
    complimentary: 'Complimentary',
    checkout: 'Proceed to Checkout',
    continueShopping: 'Continue Shopping',
    size: 'Size',
    color: 'Color',
    
    // Checkout
    checkoutTitle: 'Final Confirmation',
    shippingDetails: 'Shipping Details',
    fullName: 'Full Name',
    streetAddress: 'Street Address',
    city: 'City',
    postalCode: 'Postal Code',
    country: 'Country',
    phone: 'Phone',
    orderNotes: 'Order Notes (Optional)',
    paymentMethod: 'Payment Method',
    securePayment: 'Secure Payment Gateway',
    redirectStripe: 'You will be redirected to Stripe',
    payNow: 'Pay Now',
    processing: 'Processing...',
    selections: 'Selections',
    returnToCart: 'Return to Cart',
    orderConfirmed: 'Order confirmed',
    thankYou: 'Thank you for shopping with Azmarino.',
    orderInProgress: 'Your order is now in progress. A confirmation email has been sent, and tracking details will stay visible inside your account.',
    orderReference: 'Order reference',
    viewMyOrders: 'View my orders',
    
    // Orders
    orderArchive: 'Order archive',
    ordersTitle: 'Every order, delivery update, and receipt in one polished place.',
    ordersSubtitle: 'Review your recent purchases, track fulfilment status, and jump back into the catalog whenever you are ready for the next order.',
    ordersPlaced: 'Orders placed',
    totalSpend: 'Total spend',
    ordersError: 'We could not load your orders.',
    noHistory: 'No history yet',
    emptyOrders: 'Your order gallery is still empty.',
    firstOrder: 'Once you place your first order, the full timeline and payment status will appear here automatically.',
    discoverProducts: 'Discover products',
    order: 'Order',
    placedOn: 'Placed on',
    trackingNumber: 'Tracking number',
    payment: 'Payment',
    qty: 'Quantity',
    orderTotal: 'Order total',
    trackOrder: 'Track order',
    shopAgain: 'Shop again',
    
    // Tracking
    trackingTitle: 'Logistics Tracking',
    orderNumber: 'Order Number',
    locating: 'Locating...',
    searchOrder: 'Search Order',
    status: 'Status',
    created: 'Created',
    trackingId: 'Tracking ID',
    pendingAssignment: 'Pending Assignment',
    totalValue: 'Total Value',
    trackingSupport: 'Tracking Support',
    trackingDesc: 'Orders are typically processed within 48 hours. Once shipped, you will receive an email with your official carrier tracking number.',
    realTimeUpdates: 'Real-time status updates',
    itemBreakdown: 'Full item breakdown',
    
    // Profile
    profileStudio: 'Profile Studio',
    profileTitle: 'Keep your account, delivery details, and security settings impeccably current.',
    profileSubtitle: 'Manage the essentials that make checkout faster, order updates clearer, and account recovery safer.',
    profileComplete: 'Profile complete',
    emailVerified: 'Email verified',
    accountDetails: 'Account details',
    personalInfo: 'Personal information',
    viewOrders: 'View orders',
    fullNameLabel: 'Full name',
    phoneLabel: 'Phone',
    deliveryAddress: 'Delivery address',
    savingChanges: 'Saving changes...',
    saveProfile: 'Save profile',
    security: 'Security',
    changePassword: 'Change password',
    currentPassword: 'Current password',
    newPasswordLabel: 'New password',
    confirmPasswordLabel: 'Confirm new password',
    updatingPassword: 'Updating password...',
    updatePassword: 'Update password',
    accountStatus: 'Account status',
    memberRole: 'Member role',
    verified: 'Verified',
    actionNeeded: 'Action needed',
    enterCode: 'Enter your verification code',
    digitCode: '6-digit code',
    verifying: 'Verifying...',
    verifyEmail: 'Verify email',
    sendingCode: 'Sending code...',
    resendCode: 'Resend code',
    emailVerifiedMsg: 'Your email is verified and ready for order updates.',
    quickActions: 'Quick actions',
    reviewOrders: 'Review orders',
    trackPackage: 'Track a package',
    signOut: 'Sign out',
    
    // Auth
    memberSignIn: 'Member sign in',
    loginTitle: 'Return to a calmer, more premium shopping experience.',
    loginSubtitle: 'Sign in to continue checkout, review previous orders, and keep delivery tracking tied to your account.',
    fastCheckout: 'Fast checkout',
    fastCheckoutDesc: 'Your saved details flow straight into order creation and Stripe checkout.',
    orderVisibility: 'Order visibility',
    orderVisibilityDesc: 'Track status, payment progress, and delivery information from one account hub.',
    secureAccess: 'Secure access',
    signInToAzmarino: 'Sign in to Azmarino',
    loginEmailDesc: 'Use the email address linked to your orders to keep tracking and account settings in sync.',
    signingIn: 'Signing in...',
    forgotPassword: 'Forgot your password? Request reset instructions',
    requestingReset: 'Requesting reset link...',
    newToAzmarino: 'New to Azmarino?',
    createAccount: 'Create your account',
    createMembership: 'Create membership',
    registerTitle: 'Start with an account that feels as considered as the storefront itself.',
    registerSubtitle: 'Create your Azmarino profile to save delivery details, verify your email, and keep your order history beautifully organized from the first purchase onward.',
    verificationReady: 'Verification ready',
    verificationReadyDesc: 'New accounts receive an email verification code so order updates stay secure and reliable.',
    checkoutReady: 'Checkout ready',
    checkoutReadyDesc: 'Once registered, your profile can flow straight into checkout and delivery tracking.',
    registration: 'Registration',
    registerEmailDesc: 'A few essentials are all we need to prepare your profile and send your verification code.',
    creatingAccount: 'Creating your account...',
    alreadyHaveAccount: 'Already have an account?',
    signInInstead: 'Sign in instead',
    enterEmailReset: 'Enter your email above before requesting a reset link.',
    
    // Not Found
    notFoundEyebrow: 'Page not found',
    notFoundTitle: 'The page you were looking for has moved or no longer exists.',
    notFoundSubtitle: 'Continue exploring the Azmarino catalogue, track an order, or return to the homepage to start fresh.',
    backHome: 'Back to homepage',
    browseProducts: 'Browse products',
    
    // Loading
    loadingEyebrow: 'Preparing your experience',
    loadingTitle: 'Curating the finest global selection...',
    loadingSubtitle: 'Please wait while we prepare the catalog.',
    
    // Auth & General
    email: 'Email Address',
    password: 'Password',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    
    // Footer
    footerDesc: 'Azmarino is a premier global e-commerce destination for curated high-end fashion, electronics, and lifestyle products. Designed for the modern discerning shopper.',
    navigation: 'Navigation',
    support: 'Support',
    helpCenter: 'Help Center',
    returns: 'Returns',
    allRightsReserved: 'ALL RIGHTS RESERVED.',
    
    // Categories
    categories: {
      women: 'Women',
      men: 'Men',
      shoes: 'Shoes',
      electronics: 'Electronics',
      accessories: 'Accessories',
      beauty: 'Beauty',
    },
  },
  ti: {
    // Navigation
    home: 'መበገሲ',
    shop: 'ድኳን',
    track: 'ትእዛዝ ክትትል',
    orders: 'ትእዛዛተይ',
    signIn: 'እቶ',
    cart: 'ኩረት',
    search: 'ፍርያት፣ ፋሽንን ቴክኖሎጂን ድለ...',
    
    // Hero & Home
    heroTitle: 'ዓለምለኻዊ ክብርቲ ስብስብ',
    heroSubtitle: 'ሓድሽ ወለዶ ናይ ኢንተርነት ዕዳጋ ተለማመዱ። ዝተመርጹ ዓለምለኻዊ ፋሽን፣ ዘመናዊ ኤሌክትሮኒክስ፣ ከምኡ’ውን ናብ ዝሃለኹምዎ ነብጽሕ።',
    exploreBtn: 'ስብስብ ዳህስስ',
    trackBtn: 'ትእዛዝካ ተኸታተል',
    
    // Sections
    topRated: 'ዝበለጸ ተቐባልነት',
    newArrivals: 'ሓደስቲ ዝኣተዉ',
    new: 'ሓድሽ',
    trending: 'ሕጂ ዘለዉ',
    categoriesTitle: 'ብዓይነት ድለ',
    discoverMore: 'ተወሳኺ ዳህስስ',
    
    // Trust
    trustDelivery: 'ዓለምለኻዊ መብጻሕቲ',
    trustDeliverySub: 'ቅልጡፍን ውሑስን መብጻሕቲ',
    trustPayment: 'ውሑስ ክፍሊት',
    trustPaymentSub: 'ብ Stripe ዝተሓለወ ክፍሊት',
    trustReturns: 'ቀሊል ምምላስ',
    trustReturnsSub: 'ናይ 14 መዓልቲ ናይ ምምላስ መሰል',
    trustAI: 'ሳራ AI ሓገዝ',
    trustAISub: 'ንዕዳጋኹም ቅልጡፍ ሓገዝ',
    
    // Product Detail
    viewDetails: 'ዝርዝር ርአ',
    addToCart: 'ናብ ኩረት ወስኽ',
    added: '✓ ተወሲኹ ኣሎ',
    selectSize: 'ዓቐን መረጽ',
    selectColor: 'ሕብሪ መረጽ',
    sizeGuide: 'መዐቀኒ መምርሒ',
    quantity: 'ብዝሒ',
    description: 'መግለጺ',
    defaultDescription: 'እዚ ክቡር ፍርያት ንዓለምለኻዊ ስብስብ ኣዝማሪኖ ተባሂሉ ብጥንቃቐ ዝተመርጸ እዩ። ጽሬቱ፣ ጽንዓቱ ከምኡውን ዘመናዊ ቅዲ ዝተረጋገጸ እዩ።',
    reviews: 'ናይ ዓማዊል ርእይቶ',
    noReviews: 'ነዚ ፍርያት ገና ርእይቶ ኣይተውሃቦን።',
    stockIn: 'ኣብ መኽዘን ኣሎ',
    stockOut: 'ተወዲኡ',
    related: 'ክፈትውዎ ትኽእሉ ኢኹም',
    endOfCollection: 'መወዳእታ ስብስብ።',
    featuredCollection: 'ዝተመርጸ ስብስብ',
    allCollection: 'ኩሉ ስብስብ',
    all: 'ኩሉ',
    noResults: 'ምስ ፍለጋኹም ዝመሳሰል ፍርያት ኣይተረኽበን',
    clearFilters: 'ፍልተራት ኣጽሪ',
    
    // Cart
    yourSelection: 'ዝመረጽክዎም',
    item: 'ፍርያት',
    items: 'ፍርያት',
    emptyCart: 'ኩረትካ ባዶ እዩ',
    orderSummary: 'ጥቕልል ትእዛዝ',
    subtotal: 'ንኡስ ድምር',
    shipping: 'መብጻሕቲ',
    total: 'ጠቕላላ ድምር',
    complimentary: 'ነጻ',
    checkout: 'ክፍሊት ፈጽም',
    continueShopping: 'ዕዳጋ ቀጽል',
    size: 'ዓቐን',
    color: 'ሕብሪ',
    
    // Checkout
    checkoutTitle: 'ናይ መወዳእታ ምርግጋጽ',
    shippingDetails: 'ናይ መብጻሕቲ ዝርዝር',
    fullName: 'ምሉእ ስም',
    streetAddress: 'ጎደና/ኣድራሻ',
    city: 'ከተማ',
    postalCode: 'ፖስታ ኮድ',
    country: 'ሃገር',
    phone: 'ተለፎን',
    orderNotes: 'ተወሳኺ መዘኻኸሪ (ብምርጫ)',
    paymentMethod: 'ናይ ክፍሊት መገዲ',
    securePayment: 'ውሑስ ናይ ክፍሊት ደንደስ',
    redirectStripe: 'ናብ Stripe ክትሰጋገሩ ኢኹም',
    payNow: 'ሕጂ ክፈል',
    processing: 'ይስራሕ ኣሎ...',
    selections: 'ዝተመርጹ',
    returnToCart: 'ናብ ኩረት ተመለስ',
    orderConfirmed: 'ትእዛዝ ተረጋጊጹ',
    thankYou: 'ኣብ ኣዝማሪኖ ስለ ዝሸመትኩም ነመስግን።',
    orderInProgress: 'ትእዛዝካ ኣብ መስርሕ ይርከብ ኣሎ። ናይ ምርግጋጽ ኢመይል ተላኢኹ ኣሎ፡ ናይ ምክትታል ዝርዝር ድማ ኣብ ናይ ውልቀ-መዝገብካ ክርአ ይከኣል እዩ።',
    orderReference: 'ናይ ትእዛዝ መወከሲ',
    viewMyOrders: 'ትእዛዛተይ ርአ',
    
    // Orders
    orderArchive: 'ናይ ትእዛዝ መዝገብ',
    ordersTitle: 'ኩሉ ትእዛዛት፡ ናይ መብጻሕቲ ሓበሬታን ደረሰኛታትን ኣብ ሓደ ቦታ።',
    ordersSubtitle: 'ዝገበርካዮም ዕዳጋታት ክትክታተል፡ ናይ መብጻሕቲ ኩነታት ክትፈልጥን ዝደለኻዮ ፍርያት ክትመርጽን ትኽእል።',
    ordersPlaced: 'ዝተገብሩ ትእዛዛት',
    totalSpend: 'ጠቕላላ ወጻኢ',
    ordersError: 'ትእዛዛትካ ክርከቡ ኣይከኣሉን።',
    noHistory: 'ገና ታሪኽ የለን',
    emptyOrders: 'ናይ ትእዛዝ መዝገብካ ገና ባዶ እዩ።',
    firstOrder: 'ቀዳማይ ትእዛዝ ምስ ገበርካ፡ ኩሉ ዝርዝርን ናይ ክፍሊት ኩነታትን ኣብዚ ክርአ እዩ።',
    discoverProducts: 'ፍርያት ዳህስስ',
    order: 'ትእዛዝ',
    placedOn: 'ዝተገብረሉ ዕለት',
    trackingNumber: 'መክትተሊ ቑጽሪ',
    payment: 'ክፍሊት',
    qty: 'ብዝሒ',
    orderTotal: 'ጠቕላላ ድምር',
    trackOrder: 'ትእዛዝ ተኸታተል',
    shopAgain: 'ደጊምካ ሽምት',
    
    // Tracking
    trackingTitle: 'ናይ መብጻሕቲ ምክትታል',
    orderNumber: 'ናይ ትእዛዝ ቑጽሪ',
    locating: 'ይድለ ኣሎ...',
    searchOrder: 'ትእዛዝ ድለ',
    status: 'ኩነታት',
    created: 'ዝተፈጥረሉ',
    trackingId: 'መክትተሊ መለለዪ',
    pendingAssignment: 'ገና ኣይተዋህቦን',
    totalValue: 'ጠቕላላ ዋጋ',
    trackingSupport: 'ናይ ምክትታል ሓገዝ',
    trackingDesc: 'ትእዛዛት መብዛሕትኡ ግዜ ኣብ ውሽጢ 48 ሰዓታት ይስርሑ። ምስ ተላእኩ፡ ወግዓዊ መክትተሊ ቑጽሪ ዝሓዘ ኢመይል ክበጽሓካ እዩ።',
    realTimeUpdates: 'ናይ ግዜኡ ሓበሬታ',
    itemBreakdown: 'ምሉእ ዝርዝር ፍርያት',
    
    // Profile
    profileStudio: 'ናይ ውልቀ-መዝገብ ስቱድዮ',
    profileTitle: 'ናይ ውልቀ-መዝገብካ፡ ናይ መብጻሕቲ ዝርዝርን ናይ ድሕንነት ቅጥዕታትን ብዝግባእ ዓቅቦም።',
    profileSubtitle: 'ክፍሊት ንምቅልጣፍ፡ ናይ ትእዛዝ ሓበሬታ ንምርካብን ናይ ውልቀ-መዝገብካ ንምሕላውን ዘድልዩ ነገራት ኣመሓድር።',
    profileComplete: 'ምሉእ ውልቀ-መዝገብ',
    emailVerified: 'ኢመይል ተረጋጊጹ',
    accountDetails: 'ናይ ውልቀ-መዝገብ ዝርዝር',
    personalInfo: 'ብሕታዊ ሓበሬታ',
    viewOrders: 'ትእዛዛተይ ርአ',
    fullNameLabel: 'ምሉእ ስም',
    phoneLabel: 'ተለፎን',
    deliveryAddress: 'ናይ መብጻሕቲ ኣድራሻ',
    savingChanges: 'ይዕቀብ ኣሎ...',
    saveProfile: 'ውልቀ-መዝገብ ዓቅብ',
    security: 'ድሕንነት',
    changePassword: 'ፓስወርድ ቀይር',
    currentPassword: 'ናይ ሕጂ ፓስወርድ',
    newPasswordLabel: 'ሓድሽ ፓስወርድ',
    confirmPasswordLabel: 'ሓድሽ ፓስወርድ ምርግጋጽ',
    updatingPassword: 'ፓስወርድ ይሕደስ ኣሎ...',
    updatePassword: 'ፓስወርድ ሐድስ',
    accountStatus: 'ናይ ውልቀ-መዝገብ ኩነታት',
    memberRole: 'ናይ ኣባልነት ግደ',
    verified: 'ተረጋጊጹ',
    actionNeeded: 'ተወሳኺ ስጉምቲ የድሊ',
    enterCode: 'ናይ ምርግጋጽ ኮድ ኣእቱ',
    digitCode: '6-ዲጂት ኮድ',
    verifying: 'ይረጋገጽ ኣሎ...',
    verifyEmail: 'ኢመይል ኣረጋግጽ',
    sendingCode: 'ኮድ ይስደድ ኣሎ...',
    resendCode: 'ኮድ ደጊምካ ስደድ',
    emailVerifiedMsg: 'ኢመይልካ ተረጋጊጹ እዩ፡ ንኹሉ ሓበሬታ ድማ ድሉው እዩ።',
    quickActions: 'ቅልጡፍ ስጉምትታት',
    reviewOrders: 'ትእዛዛት ርአ',
    trackPackage: 'ትእዛዝ ተኸታተል',
    signOut: 'ውጻእ',
    
    // Auth
    memberSignIn: 'ናይ ኣባል ምእታው',
    loginTitle: 'ናብ ዝለዓለ ናይ ዕዳጋ ተመኩሮ ተመለሱ።',
    loginSubtitle: 'ክፍሊት ንምቕጻል፡ ዝሓለፉ ትእዛዛት ንምርኣይን ናይ መብጻሕቲ ምክትታል ኣብ ውልቀ-መዝገብካ ንምዕቃብን እቶ።',
    fastCheckout: 'ቅልጡፍ ክፍሊት',
    fastCheckoutDesc: 'ዝተዓቀቡ ዝርዝራትካ ቀጥታ ናብ ትእዛዝ ምርቃቕን Stripe ክፍሊትን ይኣትዉ።',
    orderVisibility: 'ናይ ትእዛዝ ግልጽነት',
    orderVisibilityDesc: 'ናይ ትእዛዝ ኩነታት፡ ክፍሊትን መብጻሕትን ካብ ሓደ ማእከል ተኸታተል።',
    secureAccess: 'ውሑስ እቶት',
    signInToAzmarino: 'ናብ ኣዝማሪኖ እቶ',
    loginEmailDesc: 'ምስ ትእዛዛትካ ዝተኣሳሰረ ኢመይል ተጠቐም።',
    signingIn: 'ይእቶ ኣሎ...',
    forgotPassword: 'ፓስወርድ ረሲዕካ? ንምቕያር መምርሒ ሕተት',
    requestingReset: 'ይምሕጸን ኣሎ...',
    newToAzmarino: 'ሓድሽ ዲኻ ኣብ ኣዝማሪኖ?',
    createAccount: 'ውልቀ-መዝገብ ፍጠር',
    createMembership: 'ኣባልነት ፍጠር',
    registerTitle: 'ብዝግባእ ዝተዳለወ ውልቀ-መዝገብ ሓዝ።',
    registerSubtitle: 'ናይ መብጻሕቲ ዝርዝር ንምዕቃብ፡ ኢመይል ንምርግጋጽን ናይ ትእዛዝ ታሪኽ ንምሓዝን ውልቀ-መዝገብ ፍጠር።',
    verificationReady: 'ምርግጋጽ ድሉው',
    verificationReadyDesc: 'ሓደስቲ ኣባላት ናይ ትእዛዝ ሓበሬታ ውሑስ ንምግባር ናይ ኢመይል ምርግጋጽ ኮድ ይበጽሖም።',
    checkoutReady: 'ክፍሊት ድሉው',
    checkoutReadyDesc: 'ምስ ተመዝገብካ፡ ውልቀ-መዝገብካ ቀጥታ ናብ ክፍሊትን ምክትታልን ክሰጋገር እዩ።',
    registration: 'ምዝገባ',
    registerEmailDesc: 'ውልቀ-መዝገብካ ንምድላውን ኮድ ንምስዳድን ሒደት መሰረታዊ ነገራት ጥራይ የድልዩና።',
    creatingAccount: 'ውልቀ-መዝገብ ይፍጠር ኣሎ...',
    alreadyHaveAccount: 'ውልቀ-መዝገብ ኣሎካ ድዩ?',
    signInInstead: 'ኣብ ክንድኡ እቶ',
    enterEmailReset: 'ቅድሚ ኮድ ምሕታትካ ኢመይልካ ኣብ ላዕሊ ኣእቱ።',
    
    // Not Found
    notFoundEyebrow: 'ገጽ ኣይተረኽበን',
    notFoundTitle: 'እቲ ዝደለኻዮ ገጽ ተቐይሩ ወይ የለን።',
    notFoundSubtitle: 'ዝተፈላለዩ ፍርያት ዳህስስ፡ ትእዛዝካ ተኸታተል፡ ወይ ድማ ናብ መበገሲ ገጽ ተመለስ።',
    backHome: 'ናብ መበገሲ ተመለስ',
    browseProducts: 'ፍርያት ዳህስስ',
    
    // Loading
    loadingEyebrow: 'ንዳህሰሳኻ ነዳልዎ ኣለና',
    loadingTitle: 'ዝበለጸ ዓለምለኻዊ ስብስብ ንምርካብ...',
    loadingSubtitle: 'ዝርዝር ፍርያት ክሳብ ዝዳሎ በጃኹም ተጸበዩ።',
    
    // Auth & General
    email: 'ኢመይል ኣድራሻ',
    password: 'ፓስወርድ',
    login: 'እቶ',
    register: 'ተመዝገብ',
    logout: 'ውጻእ',
    
    // Footer
    footerDesc: 'ኣዝማሪኖ ንዝተመርጹ ላዕለዎት ፋሽን፣ ኤሌክትሮኒክስን ናብራ ፍርያትን ዝኸውን ቀዳማይ ዓለምለኻዊ ናይ ኢንተርነት ዕዳጋ እዩ። ንዘመናዊ ዓሚል ዝተዳለወ።',
    navigation: 'ደህሳስ',
    support: 'ሓገዝ',
    helpCenter: 'ማእከል ሓገዝ',
    returns: 'ምምላስ',
    allRightsReserved: 'ኩሉ መሰላት ዝተሓለወ እዩ።',
    
    // Categories
    categories: {
      women: 'ደቂ ኣንስትዮ',
      men: 'ደቂ ተባዕትዮ',
      shoes: 'ጫማ',
      electronics: 'ኤሌክትሮኒክስ',
      accessories: 'ኣክሰሰሪ',
      beauty: 'ጽባቐ',
    },
  },
} as const;

const LanguageContext = createContext<{
  lang: Lang;
  toggle: () => void;
  t: (key: string) => string;
}>({
  lang: 'en',
  toggle: () => undefined,
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') {
      return 'en';
    }

    const saved = localStorage.getItem('azmarino_lang');
    return saved === 'ti' ? 'ti' : 'en';
  });

  const toggle = () => {
    const next = lang === 'en' ? 'ti' : 'en';
    setLang(next);
    localStorage.setItem('azmarino_lang', next);
  };

  const t = (key: string) => {
    const parts = key.split('.');
    let value: any = translations[lang];

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        value = undefined;
        break;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
export type { Lang };
