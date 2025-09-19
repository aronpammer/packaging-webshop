const axios = require('axios');

class StrapiUtils {
  constructor() {
    this.STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
    this.API_KEY = process.env.STRAPI_API_KEY || 'aa91d1478acc8539c1e4025ae2be86fd9c4cf195b62542d865b5b318e93103390371880232266a9379616abd1fa420136b08a841d22ad59cff78399e2a5af5f149d67e9e312b2df5a107c3a7270dc34951236f8e42d20da6d6af1816578a690e69e0e2618733fdeb730ae85f873c9dbe967915846696e93f635602208e490b20';

    this.api = axios.create({
      baseURL: `${this.STRAPI_URL}/api`,
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async createPage(pageData) {
    try {
      const response = await this.api.post('/pages', { data: pageData });
      console.log(`✅ Page "${pageData.title}" created successfully`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error creating page "${pageData.title}":`, error.response?.data || error.message);
      throw error;
    }
  }

  async updatePage(id, pageData) {
    try {
      const response = await this.api.put(`/pages/${id}`, { data: pageData });
      console.log(`✅ Page "${pageData.title}" updated successfully`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating page "${pageData.title}":`, error.response?.data || error.message);
      throw error;
    }
  }

  async getPageBySlug(slug) {
    try {
      const response = await this.api.get(`/pages?filters[slug][$eq]=${slug}`);
      return response.data.data[0] || null;
    } catch (error) {
      console.error(`❌ Error fetching page with slug "${slug}":`, error.response?.data || error.message);
      return null;
    }
  }

  async createOrUpdatePage(pageData) {
    try {
      const existingPage = await this.getPageBySlug(pageData.slug);

      if (existingPage) {
        console.log(`📝 Page "${pageData.title}" already exists, updating...`);
        return await this.updatePage(existingPage.id, pageData);
      } else {
        console.log(`🆕 Creating new page "${pageData.title}"...`);
        return await this.createPage(pageData);
      }
    } catch (error) {
      console.error(`❌ Error creating/updating page "${pageData.title}":`, error.message);
      throw error;
    }
  }

  async createCategory(categoryData) {
    try {
      const response = await this.api.post('/categories', { data: categoryData });
      console.log(`✅ Category "${categoryData.name}" created successfully`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error creating category "${categoryData.name}":`, error.response?.data || error.message);
      throw error;
    }
  }

  async createProduct(productData) {
    try {
      const response = await this.api.post('/products', { data: productData });
      console.log(`✅ Product "${productData.name}" created successfully`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error creating product "${productData.name}":`, error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = StrapiUtils;