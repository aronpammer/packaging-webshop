# Packaging Equipment E-commerce Website

A professional, modern e-commerce website for packaging equipment companies built with Strapi v5 CMS and Express.js frontend. Features comprehensive product catalog, category filtering, and fully configurable site settings through a clean admin interface.

## 🚀 Features

### Content Management
- **Strapi v5 CMS**: Latest version with improved performance and features
- **Configurable Site Settings**: Phone, email, business hours, company info - all manageable from CMS
- **Dynamic Pages**: Create and manage custom pages with navigation/footer visibility controls
- **Product Catalog**: Full-featured product management with categories, images, and rich descriptions
- **Category Management**: Organize products with custom categories and images
- **SEO Optimized**: Meta descriptions, keywords, and clean URLs

### Frontend
- **Modern Design**: Clean, professional appearance with modular CSS architecture
- **Responsive Layout**: Mobile-first design that works on all devices
- **Store with Filtering**: Advanced sidebar filtering by category with search functionality
- **Configurable Content**: All contact info, company details, and marketing copy managed via CMS
- **Performance Optimized**: Modular CSS, efficient API calls, and Docker containerization

### Technical Stack
- **Backend**: Strapi v5 CMS with PostgreSQL database
- **Frontend**: Express.js with EJS templating
- **Styling**: Modular CSS with CSS custom properties
- **Infrastructure**: Docker Compose for easy deployment
- **APIs**: RESTful APIs with population and filtering support

## 📁 Project Structure

```
├── docker-compose.yml          # Docker services (Strapi, Frontend, PostgreSQL)
├── Dockerfile                  # Strapi container configuration
├── src/                       # Strapi backend
│   └── api/                   # API endpoints and content types
│       ├── category/          # Product categories
│       ├── product/           # Products catalog
│       ├── page/             # Custom pages (About, Contact, etc.)
│       └── site-setting/     # Global site configuration
├── frontend/                  # Express.js frontend application
│   ├── server.js             # Main server with route handling
│   ├── views/                # EJS templates
│   │   ├── index.ejs         # Homepage
│   │   ├── store.ejs         # Product catalog with filtering
│   │   ├── product.ejs       # Individual product pages
│   │   ├── category.ejs      # Category listing pages
│   │   └── partials/         # Reusable components
│   └── public/css/           # Modular CSS architecture
│       ├── base/             # Variables and reset styles
│       ├── layout/           # Grid and layout systems
│       ├── components/       # Button, card, header, footer styles
│       └── pages/            # Page-specific styles
├── scripts/                   # Setup and utility scripts
│   ├── create-site-settings.js  # Populate initial site settings
│   ├── create-pages.js       # Create default pages
│   └── strapi-utils.js       # Helper functions
└── config/                   # Strapi configuration
```

## 🛠️ Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)

### 1. Clone and Start

```bash
git clone https://github.com/aronpammer/packaging-webshop.git
cd packaging-webshop

# Start all services
docker-compose up -d

# Wait for services to initialize (2-3 minutes)
```

### 2. Access Applications

- **Public Website**: http://localhost:3000
- **Strapi Admin Panel**: http://localhost:1337/admin

### 3. Initial Setup

1. **Create Admin User**: Visit http://localhost:1337/admin and create your admin account
2. **Run Setup Scripts**: Populate initial content and settings:
   ```bash
   # Add your Strapi API token to scripts/create-site-settings.js
   node scripts/create-site-settings.js
   node scripts/create-pages.js
   ```

## 📊 Content Management Guide

### Site Settings Configuration
Navigate to **Content Manager** → **Site Setting** to configure:
- **Contact Information**: Phone, email, address, business hours
- **Company Details**: Name, description, copyright text
- **SEO Settings**: Meta description, keywords
- **Product Page Content**: Contact section title and description

### Managing Products
1. **Categories First**: Create product categories with names, descriptions, and images
2. **Add Products**:
   - Basic info: name, description, category
   - Images: main product image plus gallery
   - Settings: featured status, sort order
   - SEO: custom slug and meta description

### Custom Pages
Create pages like About Us, Contact, Terms of Service:
- **Navigation Control**: `showInNavigation` - appears in main menu
- **Footer Control**: `showInFooter` - appears in footer links
- **Ordering**: Use `navigationOrder` and `footerOrder` for positioning

### Category Management
- Upload category images for better visual appeal
- Use sort order to control homepage display sequence
- Link products to categories for automatic filtering

## 🎨 Design System

### CSS Architecture
- **Modular Structure**: Separated concerns (base, layout, components, pages)
- **CSS Custom Properties**: Consistent colors, spacing, and transitions
- **Responsive Design**: Mobile-first with clean breakpoints
- **Component-Based**: Reusable button, card, and layout styles

### Key Design Principles
- **Clean & Professional**: Minimal design focused on products
- **User-Friendly**: Intuitive navigation and clear calls-to-action
- **Performance**: Optimized loading and smooth interactions
- **Accessibility**: Semantic HTML and proper contrast ratios

## 🔧 Development

### Local Development
```bash
# Backend only
npm install
npm run develop

# Frontend development
cd frontend
npm install
npm start

# Watch mode for both
docker-compose up
```

### API Integration
The frontend connects to Strapi APIs:
```javascript
// Site settings for all pages
const siteSettings = await fetchFromStrapi('/site-setting?populate=*');

// Products with category filtering
const products = await fetchFromStrapi('/products?populate=*&filters[category][slug][$eq]=' + categorySlug);

// Navigation pages
const navPages = await fetchFromStrapi('/pages?filters[showInNavigation][$eq]=true');
```

### Database Management
```bash
# Access PostgreSQL
docker-compose exec db psql -U strapi -d strapi

# Useful commands
\l                           # List databases
\dt                          # List tables
SELECT * FROM site_settings; # View site configuration
```

## 🚀 Production Deployment

### Environment Configuration
Create `.env` file with production settings:
```bash
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_HOST=your-production-db-host
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=secure_password_here
JWT_SECRET=your-secure-jwt-secret-minimum-32-chars
ADMIN_JWT_SECRET=your-admin-jwt-secret-minimum-32-chars
APP_KEYS=key1,key2,key3,key4
STRAPI_ADMIN_BACKEND_URL=https://your-admin-domain.com
```

### Security Checklist
- [ ] Change all default passwords
- [ ] Generate secure JWT secrets (32+ characters)
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up proper CORS policies
- [ ] Enable rate limiting
- [ ] Configure database backups
- [ ] Set up monitoring and logging

### Deployment Steps
1. **Build Images**: `docker-compose build --no-cache`
2. **Deploy**: Use your preferred container orchestration (Docker Swarm, Kubernetes, etc.)
3. **Database Migration**: Run initial setup scripts
4. **SSL Setup**: Configure reverse proxy (nginx, Traefik)
5. **Monitoring**: Set up health checks and logging

## 🔐 API Reference

### Public Endpoints
```bash
# Get all categories with images
GET /api/categories?populate=*

# Get products by category
GET /api/products?populate=*&filters[category][slug][$eq]=steel-strapping

# Get featured products for homepage
GET /api/products?populate=*&filters[featured][$eq]=true

# Get site settings
GET /api/site-setting?populate=*

# Get navigation pages
GET /api/pages?populate=*&filters[showInNavigation][$eq]=true
```

### Authentication
Admin API access requires Bearer token authentication. Generate API tokens in Strapi admin under **Settings** → **API Tokens**.

## 📈 Customization Guide

### Adding New Content Types
1. Use **Content-Types Builder** in Strapi admin
2. Create fields with proper relationships
3. Update frontend templates if needed
4. Add API calls in `server.js`

### Styling Customizations
- **Colors**: Modify CSS custom properties in `/css/base/variables.css`
- **Layout**: Adjust grid systems in `/css/layout/`
- **Components**: Update button, card styles in `/css/components/`
- **Pages**: Customize page-specific styles in `/css/pages/`

### Feature Extensions
- **Search**: Implement full-text search with Strapi's built-in search
- **E-commerce**: Add cart functionality and payment integration
- **Multi-language**: Use Strapi's i18n plugin for internationalization
- **Analytics**: Integrate Google Analytics or similar tracking

## 📞 Support & Resources

- **Strapi Documentation**: https://docs.strapi.io/
- **Express.js Guide**: https://expressjs.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **EJS Templating**: https://ejs.co/

## 📄 License

MIT License - Open source and free to use for commercial projects.

---

Built with ❤️ for packaging equipment professionals. Perfect for manufacturers, distributors, and service providers in the industrial packaging industry.