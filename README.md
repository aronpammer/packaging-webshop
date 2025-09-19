# Packaging Equipment Website with Strapi CMS

A modern, professional website for packaging equipment companies built with Strapi CMS and a custom frontend. Features a clean admin interface for content management and a beautiful, responsive public website.

## 🚀 Features

- **Strapi CMS Backend**: Professional admin panel for easy content management
- **Modern Frontend**: Clean, flat design with responsive layout
- **PostgreSQL Database**: Reliable data storage
- **Docker Setup**: Easy deployment and development
- **Content Types**: Pre-configured for packaging equipment (Categories, Products)
- **Image Management**: Upload and manage product images
- **SEO Friendly**: Clean URLs and proper meta tags

## 📁 Project Structure

```
├── docker-compose.yml          # Docker services configuration
├── Dockerfile                  # Strapi container
├── src/                       # Strapi backend
│   └── api/                   # API endpoints
│       ├── category/          # Category content type
│       └── product/           # Product content type
├── frontend/                  # Frontend application
│   ├── server.js             # Express server
│   ├── views/                # EJS templates
│   └── public/               # Static assets
└── config/                   # Strapi configuration
```

## 🛠️ Quick Start

### Prerequisites
- Docker and Docker Compose installed

### 1. Start the Application

```bash
# Start all services
docker-compose up -d

# Wait for services to be ready (about 2-3 minutes)
```

### 2. Access the Applications

- **Public Website**: http://localhost:3000
- **Strapi Admin**: http://localhost:1337/admin

### 3. Set Up Admin User

1. Go to http://localhost:1337/admin
2. Create your first admin user
3. Log in to access the content management system

## 📝 Content Management

### Adding Categories

1. Go to **Content Manager** → **Categories**
2. Click **Create new entry**
3. Fill in:
   - **Name**: Category name (e.g., "Plastic Strapping")
   - **Slug**: Auto-generated URL slug
   - **Description**: Brief description
   - **Image**: Upload category image
   - **Sort Order**: Display order (lower = first)
4. **Publish** the category

### Adding Products

1. Go to **Content Manager** → **Products**
2. Click **Create new entry**
3. Fill in product details:
   - **Name**: Product name
   - **Slug**: Auto-generated URL slug
   - **Short Description**: Brief summary for product cards
   - **Description**: Full product description (rich text)
   - **Image**: Main product image
   - **Gallery**: Additional product images
   - **Category**: Select from existing categories
   - **Featured**: Check to show on homepage
   - **Sort Order**: Display order within category
4. **Publish** the product

## 🎨 Customization

### Default Categories

The system is pre-configured for packaging equipment with these categories:
- Plastic Strapping
- Steel Strapping
- Film Wrapping
- Adhesive Technology
- Rubber Binding
- Used Equipment

### Styling

- Frontend styles: `frontend/public/css/style.css`
- Modern flat design with CSS variables
- Responsive grid system
- Font Awesome icons included

### Adding Custom Content Types

1. In Strapi admin, go to **Content-Types Builder**
2. Create new Collection Type
3. Add fields as needed
4. Save and restart the server

## 🔧 Development

### Local Development (Strapi Only)

```bash
# Install dependencies
npm install

# Start in development mode
npm run develop
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Database Access

```bash
# Connect to PostgreSQL
docker-compose exec db psql -U strapi -d strapi

# Useful commands
\dt                    # List tables
\d+ categories         # Describe categories table
SELECT * FROM categories;
```

## 🔐 API Access

### Public Endpoints

- Categories: `http://localhost:1337/api/categories?populate=*`
- Products: `http://localhost:1337/api/products?populate=*`
- Featured Products: `http://localhost:1337/api/products?filters[featured][$eq]=true&populate=*`

### Authentication

Admin endpoints require JWT authentication. See Strapi documentation for API authentication.

## 🚢 Production Deployment

### Environment Variables

Create `.env` file:

```bash
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
ADMIN_JWT_SECRET=your-admin-jwt-secret
APP_KEYS=key1,key2,key3,key4
```

### Security Considerations

- Change default database passwords
- Use secure JWT secrets
- Enable HTTPS in production
- Configure proper CORS settings
- Set up proper backup strategy

## 📞 Support

For Strapi-specific questions:
- [Strapi Documentation](https://docs.strapi.io)
- [Strapi Community](https://discord.strapi.io)

## 📄 License

MIT License - see package.json for details