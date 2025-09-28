const express = require('express');
const axios = require('axios');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

// Middleware
app.use(helmet({
    contentSecurityPolicy: false // Allow loading Strapi media
}));
app.use(compression());
app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper function to fetch from Strapi
async function fetchFromStrapi(endpoint) {
    try {
        const response = await axios.get(`${STRAPI_URL}/api${endpoint}`, {
            headers: {
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching from Strapi: ${endpoint}`, error.message);
        return null;
    }
}

// Helper function to get site settings
async function getSiteSettings() {
    const settingsData = await fetchFromStrapi('/site-setting?populate=*');
    const settings = settingsData?.data;

    // Return default values if no CMS data found
    return {
        // Contact Information
        phone: settings?.phone || '+1-234-567-8900',
        email: settings?.email || 'info@packagingequipment.com',
        businessHours: settings?.businessHours || 'Mon-Fri 8AM-5PM',
        address: settings?.address || '123 Industrial Blvd, City, State 12345',

        // Company Information
        companyName: settings?.companyName || 'Packaging Equipment Solutions',
        companyDescription: settings?.companyDescription || 'Professional packaging equipment and solutions for all your industrial needs.',

        // Footer Content
        copyrightText: settings?.copyrightText || '2024 Packaging Equipment Solutions. All rights reserved.',

        // SEO/Meta
        metaDescription: settings?.metaDescription || 'Professional packaging equipment solutions including plastic strapping, steel strapping, film wrapping, and adhesive technology.',
        metaKeywords: settings?.metaKeywords || 'packaging equipment, strapping, wrapping, industrial supplies',

        // Product Contact Section
        contactTitle: settings?.contactTitle || 'Get Quote & Information',
        contactDescription: settings?.contactDescription || 'Contact our specialists for pricing, technical specs, and availability.',
        callButtonText: settings?.callButtonText || 'Call',
        emailButtonText: settings?.emailButtonText || 'Email Inquiry',

        // Footer Text
        footerCategoriesTitle: settings?.footerCategoriesTitle || 'Categories',
        footerPagesTitle: settings?.footerPagesTitle || 'Pages',
        footerContactTitle: settings?.footerContactTitle || 'Contact Info',

        // Home Page Text
        homePageTitle: settings?.homePageTitle || 'Professional Industrial Equipment',
        homePageMetaDescription: settings?.homePageMetaDescription || 'Professional packaging equipment solutions including plastic strapping, steel strapping, film wrapping, and adhesive technology.',
        categoriesSectionTitle: settings?.categoriesSectionTitle || 'Browse Categories',
        categoriesSectionSubtitle: settings?.categoriesSectionSubtitle || 'Discover our comprehensive range of packaging solutions',
        featuredProductsSectionTitle: settings?.featuredProductsSectionTitle || 'Featured Products',
        featuredProductsSectionSubtitle: settings?.featuredProductsSectionSubtitle || 'Top-quality equipment trusted by industry leaders',
        viewAllProductsButtonText: settings?.viewAllProductsButtonText || 'View All Products',
        getQuoteButtonText: settings?.getQuoteButtonText || 'Get Quote',

        // General UI Text
        homeText: settings?.homeText || 'Home',
        storeText: settings?.storeText || 'Store',
        learnMoreText: settings?.learnMoreText || 'Learn More',
        contactUsText: settings?.contactUsText || 'Contact Us',
        productDetailsTitle: settings?.productDetailsTitle || 'Product Details',
        keyFeaturesTitle: settings?.keyFeaturesTitle || 'Key Features',
        technicalSpecificationsTitle: settings?.technicalSpecificationsTitle || 'Technical Specifications',
        featuredBadgeText: settings?.featuredBadgeText || 'Featured',
        noImageAvailableText: settings?.noImageAvailableText || 'No Image Available',
        noImageText: settings?.noImageText || 'No Image',
        professionalSolutionsText: settings?.professionalSolutionsText || 'Professional solutions',
        professionalPackagingEquipmentText: settings?.professionalPackagingEquipmentText || 'Professional packaging equipment',
        productsText: settings?.productsText || 'Products',

        // Category Page Text
        noProductsAvailableTitle: settings?.noProductsAvailableTitle || 'No Products Available',
        noProductsAvailableText: settings?.noProductsAvailableText || 'Products in this category are coming soon. Please check back later or contact us for specific equipment needs.',

        // Store Page Text
        storePageTitle: settings?.storePageTitle || 'Store - Browse All Products',
        storePageMetaDescription: settings?.storePageMetaDescription || 'Browse our complete product catalog. Filter by category and find the perfect packaging equipment for your needs.',
        searchProductsText: settings?.searchProductsText || 'Search Products',
        searchPlaceholderText: settings?.searchPlaceholderText || 'Search products...',
        allCategoriesText: settings?.allCategoriesText || 'All Categories',
        clearAllFiltersText: settings?.clearAllFiltersText || 'Clear All Filters',
        categoryText: settings?.categoryText || 'Category',
        searchResultsText: settings?.searchResultsText || 'Search Results',
        allProductsText: settings?.allProductsText || 'All Products',
        productFoundText: settings?.productFoundText || 'product',
        productsFoundText: settings?.productsFoundText || 'products',
        foundText: settings?.foundText || 'found',
        sortByDefaultText: settings?.sortByDefaultText || 'Sort by: Default',
        nameAZText: settings?.nameAZText || 'Name A-Z',
        nameZAText: settings?.nameZAText || 'Name Z-A',
        newestFirstText: settings?.newestFirstText || 'Newest First',
        noProductsFoundTitle: settings?.noProductsFoundTitle || 'No products found',
        noProductsFoundText: settings?.noProductsFoundText || 'We couldn\'t find any products matching your criteria.',

        // Contact Labels
        phoneText: settings?.phoneText || 'Phone',
        emailText: settings?.emailText || 'Email',
        hoursText: settings?.hoursText || 'Hours',

        // Hero Button Text
        heroButtonText: settings?.heroButtonText || 'View Our Products',
        heroTitle: settings?.heroTitle || 'Professional Packaging Equipment Solutions',
        heroDescription: settings?.heroDescription || 'We provide high-quality strapping, wrapping, and binding equipment for all your packaging needs. From plastic and steel strapping to film wrapping and adhesive technology.',

        // New navigation fields
        productsText: settings?.productsText || 'Termékek',
        aboutText: settings?.aboutText || 'Rólunk',
        companyMotto: settings?.companyMotto || 'Professzionális csomagolástechnikai megoldások',

        // Sidebar Text
        sidebarDepartmentText: settings?.sidebarDepartmentText || 'Shop by Category',
        sidebarWelcomeText: settings?.sidebarWelcomeText || 'Welcome',
        sidebarToggleText: settings?.sidebarToggleText || 'All',
        headerSearchPlaceholder: settings?.headerSearchPlaceholder || 'Search products',

        // Logo
        logo: settings?.logo || null
    };
}

// Helper function to build category hierarchy with all nested levels
function buildCategoryHierarchy(categories) {
    const categoryMap = new Map();
    const rootCategories = [];

    // First pass: create map of all categories
    categories.forEach(cat => {
        categoryMap.set(cat.id, {
            ...cat,
            childCategories: []
        });
    });

    // Second pass: build hierarchy
    categories.forEach(cat => {
        const category = categoryMap.get(cat.id);
        if (cat.parentCategory) {
            const parent = categoryMap.get(cat.parentCategory.id);
            if (parent) {
                parent.childCategories.push(category);
            }
        } else {
            rootCategories.push(category);
        }
    });

    return rootCategories;
}

// Helper function to recursively add category children to menu
function addCategoryChildrenRecursively(childCategories, parentMenuItemId, itemMap, visitedCategoryIds = new Set(), maxDepth = 10, currentDepth = 0) {
    // Prevent infinite recursion due to cycles or excessive depth
    if (currentDepth >= maxDepth) {
        console.warn(`Maximum menu depth (${maxDepth}) reached for parent ${parentMenuItemId}`);
        return;
    }

    childCategories.forEach((childCategory, index) => {
        console.log(`Processing category: ${childCategory.name} (ID: ${childCategory.id}) at depth ${currentDepth}`);
        console.log(`Has children:`, childCategory.childCategories ? childCategory.childCategories.length : 0);

        // Check for circular reference
        if (visitedCategoryIds.has(childCategory.id)) {
            console.warn(`Circular reference detected: category ${childCategory.id} (${childCategory.name}) already processed in this branch`);
            return;
        }

        const autoChildId = `auto-child-${parentMenuItemId}-${childCategory.id}`;
        const autoChildItem = {
            id: autoChildId,
            title: childCategory.name,
            sortOrder: index,
            linkType: 'product-category',
            customUrl: null,
            openInNewTab: false,
            isActive: true,
            cssClass: 'auto-generated',
            icon: null,
            description: childCategory.description,
            parentId: parentMenuItemId,
            children: [],
            url: `/product-category/${childCategory.slug}`
        };
        itemMap.set(autoChildId, autoChildItem);
        console.log(`Added menu item: ${autoChildItem.title} with parent: ${parentMenuItemId}`);

        // Recursively add this category's children if they exist
        if (childCategory.childCategories && childCategory.childCategories.length > 0) {
            console.log(`Recursing into ${childCategory.childCategories.length} children of ${childCategory.name}`);
            // Create a new set with the current category added for this branch
            const newVisitedIds = new Set(visitedCategoryIds);
            newVisitedIds.add(childCategory.id);

            addCategoryChildrenRecursively(
                childCategory.childCategories,
                autoChildId,
                itemMap,
                newVisitedIds,
                maxDepth,
                currentDepth + 1
            );
        }
    });
}

// Helper function to get menu configuration
async function getMenuConfiguration() {
    const [menuData, productCategoriesData] = await Promise.all([
        fetchFromStrapi('/menu-items?populate[targetPage]=true&populate[targetProductCategory]=true&populate[parentMenuItem]=true&populate[childMenuItems]=true&sort=sortOrder:asc'),
        fetchFromStrapi('/product-categories?populate=*&sort=sortOrder:asc')
    ]);

    const menuItems = menuData?.data || [];
    const allCategories = productCategoriesData?.data || [];

    // Build complete category hierarchy
    const productCategories = buildCategoryHierarchy(allCategories);

    console.log('Menu items fetched:', menuItems.length);
    menuItems.forEach(item => {
        console.log(`Menu item: ${item.title}, Parent: ${item.parentMenuItem ? item.parentMenuItem.title : 'None'}, Active: ${item.isActive}, Published: ${item.publishedAt ? 'Yes' : 'No'}`);
    });

    // Build hierarchical menu structure
    const menuTree = [];
    const itemMap = new Map();

    // First pass: create all items and map them
    menuItems.forEach(item => {
        const menuItem = {
            id: item.id,
            title: item.title,
            sortOrder: item.sortOrder,
            linkType: item.linkType,
            customUrl: item.customUrl,
            openInNewTab: item.openInNewTab,
            isActive: item.isActive,
            cssClass: item.cssClass,
            icon: item.icon,
            description: item.description,
            parentId: item.parentMenuItem?.id || null,
            children: [],
            url: getMenuItemUrl(item)
        };
        itemMap.set(item.id, menuItem);

        // If this menu item points to a product category, automatically add its child categories recursively
        if (item.linkType === 'product-category' && item.targetProductCategory) {
            const category = productCategories.find(cat => cat.id === item.targetProductCategory.id);
            if (category && category.childCategories && category.childCategories.length > 0) {
                addCategoryChildrenRecursively(category.childCategories, item.id, itemMap);
            }
        }
    });

    // Second pass: build hierarchy
    itemMap.forEach(item => {
        if (item.parentId) {
            const parent = itemMap.get(item.parentId);
            if (parent) {
                parent.children.push(item);
            }
        } else {
            menuTree.push(item);
        }
    });

    // Sort children by sortOrder
    const sortChildren = (items) => {
        items.sort((a, b) => a.sortOrder - b.sortOrder);
        items.forEach(item => {
            if (item.children.length > 0) {
                sortChildren(item.children);
            }
        });
    };
    sortChildren(menuTree);

    return menuTree;
}

// Helper function to generate URL for menu item
function getMenuItemUrl(item) {
    switch (item.linkType) {
        case 'page':
            if (item.targetPage) {
                // Special cases for about and contact pages
                if (item.targetPage.slug === 'about' || item.targetPage.slug === 'contact') {
                    return `/${item.targetPage.slug}`;
                }
                return `/page/${item.targetPage.slug}`;
            }
            return '#';
        case 'product-category':
            return item.targetProductCategory ? `/product-category/${item.targetProductCategory.slug}` : '#';
        case 'custom-url':
            return item.customUrl || '#';
        case 'no-link':
        default:
            return '#';
    }
}

// Helper function to fetch common data needed across all pages
async function getCommonPageData() {
    const [productCategoriesData, siteSettings, menuConfiguration] = await Promise.all([
        fetchFromStrapi('/product-categories?populate[parentCategory]=true&populate[image]=true&sort=sortOrder:asc'),
        getSiteSettings(),
        getMenuConfiguration()
    ]);

    const productCategories = buildCategoryHierarchy(productCategoriesData?.data || []);

    return {
        productCategories,
        siteSettings,
        menuConfiguration,
        STRAPI_URL
    };
}

// Routes

// Homepage
app.get('/', async (req, res) => {
    try {
        // Get common data
        const commonData = await getCommonPageData();

        // Get page-specific data
        const [featuredProductsData, homepageData, latestProductsData] = await Promise.all([
            fetchFromStrapi('/products?populate=*&filters[featured][$eq]=true&sort=sortOrder:asc'),
            fetchFromStrapi('/homepage?populate=*'),
            fetchFromStrapi('/products?populate=*&sort=createdAt:desc&pagination[limit]=5')
        ]);

        // Get homepage content from CMS or use defaults
        const homepage = homepageData?.data;
        const heroContent = {
            title: homepage?.heroTitle || commonData.siteSettings.heroTitle,
            description: homepage?.heroDescription || commonData.siteSettings.heroDescription,
            buttonText: homepage?.heroButtonText || commonData.siteSettings.heroButtonText,
            buttonLink: homepage?.heroButtonLink || '/store',
            backgroundImage: homepage?.heroBackgroundImage?.url || null
        };

        // Determine what to show in the main content
        const showLatestProducts = homepage?.showLatestProductsInsteadOfCategories || false;
        const latestProductsCount = homepage?.latestProductsCount || 5;

        // Configure action buttons
        const actionButtons = {
            viewAllProducts: {
                text: homepage?.viewAllProductsButtonText || commonData.siteSettings.viewAllProductsButtonText,
                link: homepage?.viewAllProductsButtonLink || '/store',
                show: homepage?.showViewAllProductsButton !== false
            },
            getQuote: {
                text: homepage?.getQuoteButtonText || commonData.siteSettings.getQuoteButtonText,
                link: homepage?.getQuoteButtonLink || '/contact',
                show: homepage?.showGetQuoteButton !== false
            }
        };

        res.render('index', {
            ...commonData,
            categories: commonData.productCategories,
            featuredProducts: featuredProductsData?.data || [],
            latestProducts: latestProductsData?.data || [],
            heroContent: heroContent,
            homepage: homepage,
            actionButtons: actionButtons,
            showLatestProducts: showLatestProducts,
            currentPageType: 'home'
        });
    } catch (error) {
        console.error('Error loading homepage:', error);
        res.status(500).send('Server Error');
    }
});

// Product Category page
app.get('/product-category/:slug', async (req, res) => {
    try {
        const [categoryData, productsData, productCategoriesData, siteSettings, menuConfiguration] = await Promise.all([
            fetchFromStrapi(`/product-categories?filters[slug][$eq]=${req.params.slug}&populate=*`),
            fetchFromStrapi(`/products?populate=*&filters[productCategory][slug][$eq]=${req.params.slug}&sort=sortOrder:asc`),
            fetchFromStrapi('/product-categories?populate[parentCategory]=true&populate[image]=true&sort=sortOrder:asc'),
            getSiteSettings(),
            getMenuConfiguration()
        ]);

        const category = categoryData?.data?.[0];
        if (!category) {
            return res.status(404).send('Product category not found');
        }

        // Filter subcategories - categories that have the current category as parent
        const allCategories = productCategoriesData?.data || [];
        const subcategories = allCategories.filter(cat => {
            // Handle both numeric and string ID comparisons
            return cat.parentCategory &&
                   (cat.parentCategory.id === category.id ||
                    String(cat.parentCategory.id) === String(category.id));
        });

        // Build the category hierarchy for the sidebar - THIS IS THE FIX
        const productCategories = buildCategoryHierarchy(productCategoriesData?.data || []);

        res.render('category', {
            category: category,
            products: productsData?.data || [],
            subcategories: subcategories,
            categories: productCategoriesData?.data || [],
            productCategories: productCategories, // Use hierarchical categories
            menuConfiguration: menuConfiguration,
            siteSettings: siteSettings,
            currentPageType: 'product-category',
            STRAPI_URL
        });
    } catch (error) {
        console.error('Error loading product category:', error);
        res.status(500).send('Server Error');
    }
});


// Product page
app.get('/product/:slug', async (req, res) => {
    try {
        const [productData, categoriesData, siteSettings, menuConfiguration] = await Promise.all([
            fetchFromStrapi(`/products?filters[slug][$eq]=${req.params.slug}&populate=*`),
            fetchFromStrapi('/product-categories?populate[parentCategory]=true&populate[image]=true&sort=sortOrder:asc'),
            getSiteSettings(),
            getMenuConfiguration()
        ]);

        const product = productData?.data?.[0];
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Build the category hierarchy for the sidebar
        const productCategories = buildCategoryHierarchy(categoriesData?.data || []);

        res.render('product', {
            product: product,
            categories: categoriesData?.data || [],
            productCategories: productCategories, // Add hierarchical categories for sidebar
            menuConfiguration: menuConfiguration,
            siteSettings: siteSettings,
            currentPageType: 'product',
            STRAPI_URL
        });
    } catch (error) {
        console.error('Error loading product:', error);
        res.status(500).send('Server Error');
    }
});

// Dynamic page handler
app.get('/page/:slug', async (req, res) => {
    try {
        const [pageData, categoriesData, siteSettings, menuConfiguration] = await Promise.all([
            fetchFromStrapi(`/pages?filters[slug][$eq]=${req.params.slug}&populate=*`),
            fetchFromStrapi('/product-categories?populate[parentCategory]=true&populate[image]=true&sort=sortOrder:asc'),
            getSiteSettings(),
            getMenuConfiguration()
        ]);

        const page = pageData?.data?.[0];
        if (!page) {
            return res.status(404).send('Page not found');
        }

        const productCategories = buildCategoryHierarchy(categoriesData?.data || []);

        res.render('page', {
            page: page,
            categories: categoriesData?.data || [],
            productCategories: productCategories,
            menuConfiguration: menuConfiguration,
            siteSettings: siteSettings,
            currentPageType: 'page',
            STRAPI_URL
        });
    } catch (error) {
        console.error('Error loading page:', error);
        res.status(500).send('Server Error');
    }
});

// About page - CMS only
app.get('/about', async (req, res) => {
    try {
        const [pageData, categoriesData, siteSettings, menuConfiguration] = await Promise.all([
            fetchFromStrapi(`/pages?filters[slug][$eq]=about&populate=*`),
            fetchFromStrapi('/product-categories?populate[parentCategory]=true&populate[image]=true&sort=sortOrder:asc'),
            getSiteSettings(),
            getMenuConfiguration()
        ]);

        const page = pageData?.data?.[0];
        if (!page) {
            return res.status(404).send('About page not found. Please create it in the CMS with slug "about".');
        }

        const productCategories = buildCategoryHierarchy(categoriesData?.data || []);

        res.render('page', {
            page: page,
            categories: categoriesData?.data || [],
            productCategories: productCategories,
            menuConfiguration: menuConfiguration,
            siteSettings: siteSettings,
            currentPageType: 'page',
            STRAPI_URL
        });
    } catch (error) {
        console.error('Error loading about page:', error);
        res.status(500).send('Server Error');
    }
});

// Contact form submission
app.post('/contact/send', express.json(), async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        // Here you would typically:
        // 1. Save to database
        // 2. Send email notification
        // 3. Send auto-response email

        // For now, just log the submission
        console.log('Contact form submission:', {
            name,
            email,
            phone,
            subject,
            message,
            timestamp: new Date().toISOString()
        });

        // Save to Strapi as a contact submission
        const submissionData = {
            name,
            email,
            phone,
            subject,
            message,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        };

        try {
            const response = await axios.post(`${STRAPI_URL}/api/contact-submissions`, {
                data: submissionData
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Contact submission saved to database:', response.data?.data?.id);
        } catch (dbError) {
            console.error('Failed to save contact submission to database:', dbError.message);
            // Continue anyway - don't fail the request if database save fails
        }

        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Contact page - CMS only
app.get('/contact', async (req, res) => {
    try {
        const [pageData, categoriesData, siteSettings, menuConfiguration] = await Promise.all([
            fetchFromStrapi(`/pages?filters[slug][$eq]=contact&populate=*`),
            fetchFromStrapi('/product-categories?populate[parentCategory]=true&populate[image]=true&sort=sortOrder:asc'),
            getSiteSettings(),
            getMenuConfiguration()
        ]);

        const page = pageData?.data?.[0];
        if (!page) {
            return res.status(404).send('Contact page not found. Please create it in the CMS with slug "contact".');
        }

        res.render('contact', {
            page: page,
            categories: categoriesData?.data || [],
            menuConfiguration: menuConfiguration,
            siteSettings: siteSettings,
            currentPageType: 'contact',
            STRAPI_URL
        });
    } catch (error) {
        console.error('Error loading contact page:', error);
        res.status(500).send('Server Error');
    }
});

// Store page
app.get('/store', async (req, res) => {
    try {
        const categoryFilter = req.query.category;
        const searchQuery = req.query.search;

        // Build product filter URL
        let filterParams = [];
        if (categoryFilter) {
            filterParams.push(`filters[productCategory][slug][$eq]=${categoryFilter}`);
        }
        if (searchQuery) {
            filterParams.push(`filters[$or][0][name][$containsi]=${encodeURIComponent(searchQuery)}`);
            filterParams.push(`filters[$or][1][description][$containsi]=${encodeURIComponent(searchQuery)}`);
            filterParams.push(`filters[$or][2][shortDescription][$containsi]=${encodeURIComponent(searchQuery)}`);
        }

        const filterString = filterParams.length > 0 ? '&' + filterParams.join('&') : '';

        const [categoriesData, productsData, allProductsData, siteSettings, menuConfiguration, storeData] = await Promise.all([
            fetchFromStrapi('/product-categories?populate[parentCategory]=true&populate[image]=true&sort=sortOrder:asc'),
            fetchFromStrapi(`/products?populate=*&sort=sortOrder:asc${filterString}`),
            fetchFromStrapi('/products?populate=productCategory&sort=sortOrder:asc'),
            getSiteSettings(),
            getMenuConfiguration(),
            fetchFromStrapi('/store?populate=*')
        ]);

        // Calculate product counts for each category
        const allProducts = allProductsData?.data || [];
        const categoryProductCounts = {};
        const totalProductCount = allProducts.length;

        // Count products per category
        allProducts.forEach(product => {
            if (product.productCategory) {
                const categorySlug = product.productCategory.slug;
                categoryProductCounts[categorySlug] = (categoryProductCounts[categorySlug] || 0) + 1;
            }
        });

        // Add product counts to categories
        const categoriesWithCounts = (categoriesData?.data || []).map(category => ({
            ...category,
            productCount: categoryProductCounts[category.slug] || 0
        }));

        // Build the category hierarchy for the sidebar
        const productCategories = buildCategoryHierarchy(categoriesData?.data || []);

        // Add product counts to hierarchical categories (for sidebar)
        const addCountsToHierarchy = (categories) => {
            return categories.map(cat => ({
                ...cat,
                productCount: categoryProductCounts[cat.slug] || 0,
                childCategories: cat.childCategories ? addCountsToHierarchy(cat.childCategories) : []
            }));
        };
        const productCategoriesWithCounts = addCountsToHierarchy(productCategories);

        // Get store content from CMS or use defaults
        const store = storeData?.data;
        const storeContent = {
            pageTitle: store?.pageTitle || siteSettings.storePageTitle,
            pageMetaDescription: store?.pageMetaDescription || siteSettings.storePageMetaDescription,
            heroTitle: store?.heroTitle || 'Browse Our Products',
            heroDescription: store?.heroDescription || 'Find the perfect packaging equipment for your needs from our comprehensive catalog.',
            heroBackgroundImage: store?.heroBackgroundImage?.url || null,
            searchSectionTitle: store?.searchSectionTitle || 'Find Products',
            searchPlaceholder: store?.searchPlaceholder || siteSettings.searchPlaceholderText,
            filterSectionTitle: store?.filterSectionTitle || 'Filter by Category',
            allCategoriesText: store?.allCategoriesText || siteSettings.allCategoriesText,
            clearFiltersText: store?.clearFiltersText || siteSettings.clearAllFiltersText,
            sortByText: store?.sortByText || 'Sort by:',
            sortOptions: store?.sortOptions || {
                default: siteSettings.sortByDefaultText,
                nameAZ: siteSettings.nameAZText,
                nameZA: siteSettings.nameZAText,
                newest: siteSettings.newestFirstText
            },
            noProductsTitle: store?.noProductsTitle || siteSettings.noProductsFoundTitle,
            noProductsDescription: store?.noProductsDescription || siteSettings.noProductsFoundText,
            showProductCounts: store?.showProductCounts !== false,
            productsPerPage: store?.productsPerPage || 12,
            enableSearch: store?.enableSearch !== false,
            enableCategoryFilter: store?.enableCategoryFilter !== false,
            enableSorting: store?.enableSorting !== false
        };

        res.render('store', {
            categories: categoriesWithCounts,
            productCategories: productCategoriesWithCounts,
            products: productsData?.data || [],
            menuConfiguration: menuConfiguration,
            currentCategory: categoryFilter || null,
            searchQuery: searchQuery || '',
            totalProductCount: totalProductCount,
            siteSettings: siteSettings,
            store: storeContent,
            currentPageType: 'store',
            STRAPI_URL
        });
    } catch (error) {
        console.error('Error loading store page:', error);
        res.status(500).send('Server Error');
    }
});

// Image proxy route
app.get('/uploads/*', async (req, res) => {
    try {
        const imagePath = req.path; // This will be /uploads/filename.jpg
        const strapiImageUrl = `${STRAPI_URL}${imagePath}`;

        const response = await axios.get(strapiImageUrl, {
            responseType: 'stream'
        });

        // Forward the content type
        res.set('Content-Type', response.headers['content-type']);

        // Pipe the image data
        response.data.pipe(res);
    } catch (error) {
        console.error('Error proxying image:', error.message);
        res.status(404).send('Image not found');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Frontend server running on port ${PORT}`);
    console.log(`Connecting to Strapi at ${STRAPI_URL}`);
});