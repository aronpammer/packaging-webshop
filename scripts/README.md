# Scripts Documentation

This folder contains utility scripts for managing your Strapi CMS content programmatically.

## Setup

First, set your Strapi API key as an environment variable:

```bash
export STRAPI_API_KEY=your_api_key_here
```

Or create a `.env` file in the project root with:
```
STRAPI_API_KEY=your_api_key_here
STRAPI_URL=http://localhost:1337
```

## Available Scripts

### setup-default-pages.js
Creates the default About and Contact pages in your CMS.

```bash
node scripts/setup-default-pages.js
```

**Features:**
- Creates both About and Contact pages with rich content
- Updates existing pages if they already exist
- Makes pages automatically appear in navigation
- Professional styling and layout

### strapi-utils.js
Reusable utility class for interacting with Strapi API.

**Example usage:**
```javascript
const StrapiUtils = require('./strapi-utils');

const strapi = new StrapiUtils();

// Create a new page
await strapi.createPage({
  title: "Privacy Policy",
  slug: "privacy",
  content: "<p>Your privacy policy content...</p>",
  metaDescription: "Our privacy policy",
  showInNavigation: false,
  publishedAt: new Date().toISOString()
});

// Create or update a page
await strapi.createOrUpdatePage(pageData);

// Get page by slug
const page = await strapi.getPageBySlug("about");
```

### create-site-settings.js
Creates the Site Settings single type with default company information, contact details, and site-wide content.

```bash
node scripts/create-site-settings.js
```

**Features:**
- Creates Site Settings single type data
- Includes contact information (phone, email, business hours, address)
- Company details (name, description, copyright)
- SEO metadata fields
- Updates existing settings if they already exist

### create-pages.js
Legacy script for creating pages (use setup-default-pages.js instead).

## Security Notes

⚠️ **Important Security Practices:**

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Regenerate API keys** if accidentally exposed
4. **Keep API keys secure** and rotate them regularly

## Creating Custom Pages

You can easily create new pages using the utility:

```javascript
const StrapiUtils = require('./scripts/strapi-utils');

const strapi = new StrapiUtils();

await strapi.createOrUpdatePage({
  title: "Your Page Title",
  slug: "your-page-slug",
  content: "<h1>Your HTML content here</h1>",
  metaDescription: "SEO description",
  showInNavigation: true,
  navigationOrder: 3,
  publishedAt: new Date().toISOString()
});
```

## Bulk Operations

For creating multiple pages at once:

```javascript
const pages = [
  { title: "Page 1", slug: "page-1", content: "..." },
  { title: "Page 2", slug: "page-2", content: "..." }
];

for (const page of pages) {
  await strapi.createOrUpdatePage(page);
}
```