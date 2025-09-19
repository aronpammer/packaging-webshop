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
                'Authorization': 'Bearer aa91d1478acc8539c1e4025ae2be86fd9c4cf195b62542d865b5b318e93103390371880232266a9379616abd1fa420136b08a841d22ad59cff78399e2a5af5f149d67e9e312b2df5a107c3a7270dc34951236f8e42d20da6d6af1816578a690e69e0e2618733fdeb730ae85f873c9dbe967915846696e93f635602208e490b20'
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
        emailButtonText: settings?.emailButtonText || 'Email Inquiry'
    };
}

// Routes

// Homepage
app.get('/', async (req, res) => {
    try {
        const [categoriesData, featuredProductsData, pagesData, homepageData, siteSettings] = await Promise.all([
            fetchFromStrapi('/categories?populate=image&sort=sortOrder:asc'),
            fetchFromStrapi('/products?populate=*&filters[featured][$eq]=true&sort=sortOrder:asc'),
            fetchFromStrapi('/pages?filters[showInNavigation][$eq]=true&sort=navigationOrder:asc'),
            fetchFromStrapi('/pages?filters[slug][$eq]=home&populate=*'),
            getSiteSettings()
        ]);

        // Get homepage content from CMS or use defaults
        const homePage = homepageData?.data?.[0];
        const heroContent = {
            title: homePage?.title || 'Professional Packaging Equipment Solutions',
            description: homePage?.description || 'We provide high-quality strapping, wrapping, and binding equipment for all your packaging needs. From plastic and steel strapping to film wrapping and adhesive technology.',
            buttonText: homePage?.buttonText || 'View Our Products',
            buttonLink: homePage?.buttonLink || '#categories'
        };

        res.render('index', {
            categories: categoriesData?.data || [],
            featuredProducts: featuredProductsData?.data || [],
            navPages: pagesData?.data || [],
            heroContent: heroContent,
            siteSettings: siteSettings,
            currentPageType: 'home',
            STRAPI_URL
        });
    } catch (error) {
        console.error('Error loading homepage:', error);
        res.status(500).send('Server Error');
    }
});

// Category page
app.get('/category/:slug', async (req, res) => {
    try {
        const [categoryData, productsData, categoriesData, pagesData, siteSettings] = await Promise.all([
            fetchFromStrapi(`/categories?filters[slug][$eq]=${req.params.slug}&populate=image`),
            fetchFromStrapi(`/products?populate=*&filters[category][slug][$eq]=${req.params.slug}&sort=sortOrder:asc`),
            fetchFromStrapi('/categories?populate=image&sort=sortOrder:asc'),
            fetchFromStrapi('/pages?filters[showInNavigation][$eq]=true&sort=navigationOrder:asc'),
            getSiteSettings()
        ]);

        const category = categoryData?.data?.[0];
        if (!category) {
            return res.status(404).send('Category not found');
        }

        res.render('category', {
            category: category,
            products: productsData?.data || [],
            categories: categoriesData?.data || [],
            navPages: pagesData?.data || [],
            siteSettings: siteSettings,
            currentPageType: 'category',
            STRAPI_URL
        });
    } catch (error) {
        console.error('Error loading category:', error);
        res.status(500).send('Server Error');
    }
});

// Product page
app.get('/product/:slug', async (req, res) => {
    try {
        const [productData, categoriesData, pagesData, siteSettings] = await Promise.all([
            fetchFromStrapi(`/products?filters[slug][$eq]=${req.params.slug}&populate=*`),
            fetchFromStrapi('/categories?populate=image&sort=sortOrder:asc'),
            fetchFromStrapi('/pages?filters[showInNavigation][$eq]=true&sort=navigationOrder:asc'),
            getSiteSettings()
        ]);

        const product = productData?.data?.[0];
        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('product', {
            product: product,
            categories: categoriesData?.data || [],
            navPages: pagesData?.data || [],
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
        const [pageData, categoriesData, pagesData, siteSettings] = await Promise.all([
            fetchFromStrapi(`/pages?filters[slug][$eq]=${req.params.slug}&populate=*`),
            fetchFromStrapi('/categories?populate=image&sort=sortOrder:asc'),
            fetchFromStrapi('/pages?filters[showInNavigation][$eq]=true&sort=navigationOrder:asc'),
            getSiteSettings()
        ]);

        const page = pageData?.data?.[0];
        if (!page) {
            return res.status(404).send('Page not found');
        }

        res.render('page', {
            page: page,
            categories: categoriesData?.data || [],
            navPages: pagesData?.data || [],
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
        const [pageData, categoriesData, pagesData, siteSettings] = await Promise.all([
            fetchFromStrapi(`/pages?filters[slug][$eq]=about&populate=*`),
            fetchFromStrapi('/categories?populate=image&sort=sortOrder:asc'),
            fetchFromStrapi('/pages?filters[showInNavigation][$eq]=true&sort=navigationOrder:asc'),
            getSiteSettings()
        ]);

        const page = pageData?.data?.[0];
        if (!page) {
            return res.status(404).send('About page not found. Please create it in the CMS with slug "about".');
        }

        res.render('page', {
            page: page,
            categories: categoriesData?.data || [],
            navPages: pagesData?.data || [],
            siteSettings: siteSettings,
            currentPageType: 'page',
            STRAPI_URL
        });
    } catch (error) {
        console.error('Error loading about page:', error);
        res.status(500).send('Server Error');
    }
});

// Contact page - CMS only
app.get('/contact', async (req, res) => {
    try {
        const [pageData, categoriesData, pagesData, siteSettings] = await Promise.all([
            fetchFromStrapi(`/pages?filters[slug][$eq]=contact&populate=*`),
            fetchFromStrapi('/categories?populate=image&sort=sortOrder:asc'),
            fetchFromStrapi('/pages?filters[showInNavigation][$eq]=true&sort=navigationOrder:asc'),
            getSiteSettings()
        ]);

        const page = pageData?.data?.[0];
        if (!page) {
            return res.status(404).send('Contact page not found. Please create it in the CMS with slug "contact".');
        }

        res.render('page', {
            page: page,
            categories: categoriesData?.data || [],
            navPages: pagesData?.data || [],
            siteSettings: siteSettings,
            currentPageType: 'page',
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
            filterParams.push(`filters[category][slug][$eq]=${categoryFilter}`);
        }
        if (searchQuery) {
            filterParams.push(`filters[$or][0][name][$containsi]=${encodeURIComponent(searchQuery)}`);
            filterParams.push(`filters[$or][1][description][$containsi]=${encodeURIComponent(searchQuery)}`);
            filterParams.push(`filters[$or][2][shortDescription][$containsi]=${encodeURIComponent(searchQuery)}`);
        }

        const filterString = filterParams.length > 0 ? '&' + filterParams.join('&') : '';

        const [categoriesData, productsData, pagesData, allProductsData, siteSettings] = await Promise.all([
            fetchFromStrapi('/categories?populate=image&sort=sortOrder:asc'),
            fetchFromStrapi(`/products?populate=*&sort=sortOrder:asc${filterString}`),
            fetchFromStrapi('/pages?filters[showInNavigation][$eq]=true&sort=navigationOrder:asc'),
            fetchFromStrapi('/products?populate=category&sort=sortOrder:asc'),
            getSiteSettings()
        ]);

        // Calculate product counts for each category
        const allProducts = allProductsData?.data || [];
        const categoryProductCounts = {};
        const totalProductCount = allProducts.length;

        // Count products per category
        allProducts.forEach(product => {
            if (product.category) {
                const categorySlug = product.category.slug;
                categoryProductCounts[categorySlug] = (categoryProductCounts[categorySlug] || 0) + 1;
            }
        });

        // Add product counts to categories
        const categoriesWithCounts = (categoriesData?.data || []).map(category => ({
            ...category,
            productCount: categoryProductCounts[category.slug] || 0
        }));

        res.render('store', {
            categories: categoriesWithCounts,
            products: productsData?.data || [],
            navPages: pagesData?.data || [],
            currentCategory: categoryFilter || null,
            searchQuery: searchQuery || '',
            totalProductCount: totalProductCount,
            siteSettings: siteSettings,
            currentPageType: 'store',
            STRAPI_URL
        });
    } catch (error) {
        console.error('Error loading store page:', error);
        res.status(500).send('Server Error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Frontend server running on port ${PORT}`);
    console.log(`Connecting to Strapi at ${STRAPI_URL}`);
});