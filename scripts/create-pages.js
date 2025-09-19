const axios = require('axios');

// Use environment variable for API key
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_KEY = process.env.STRAPI_API_KEY;

if (!API_KEY) {
  console.error('❌ STRAPI_API_KEY environment variable is required');
  process.exit(1);
}

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

const aboutPageData = {
  data: {
    title: "About Us",
    slug: "about",
    content: `
      <h2>About Packaging Equipment Solutions</h2>

      <p>We are a leading supplier of professional packaging equipment and solutions, serving businesses across various industries for over 20 years. Our commitment to quality and service has made us the trusted choice for companies looking to optimize their packaging operations.</p>

      <p>From small businesses to large industrial operations, we provide the equipment, expertise, and support needed to enhance productivity and ensure secure packaging solutions.</p>

      <h3>Our Mission</h3>
      <p>To provide innovative, reliable packaging equipment solutions that help our customers improve efficiency, reduce costs, and ensure the safe transport of their products.</p>

      <h3>Why Choose Us?</h3>
      <ul>
        <li>Over 20 years of industry experience</li>
        <li>Comprehensive product range from trusted brands</li>
        <li>Expert technical support and consultation</li>
        <li>Professional installation and training</li>
        <li>Competitive pricing and flexible financing</li>
        <li>Fast shipping and reliable delivery</li>
      </ul>

      <h3>Our Services</h3>
      <ul>
        <li><strong>Equipment Sales:</strong> New and used packaging equipment from leading manufacturers worldwide</li>
        <li><strong>Installation & Service:</strong> Professional installation, maintenance, and repair services for all equipment</li>
        <li><strong>Training & Support:</strong> Comprehensive training programs and ongoing technical support for your team</li>
      </ul>
    `,
    metaDescription: "Learn about our company and commitment to providing professional packaging equipment solutions.",
    showInNavigation: true,
    navigationOrder: 1,
    publishedAt: new Date().toISOString()
  }
};

const contactPageData = {
  data: {
    title: "Contact Us",
    slug: "contact",
    content: `
      <h2>Contact Us</h2>
      <p>Get in touch with our packaging equipment experts for quotes, technical support, or consultation.</p>

      <div style="display: flex; gap: 40px; margin: 40px 0;">
        <div style="flex: 1;">
          <h3>Get in Touch</h3>

          <h4><i class="fas fa-map-marker-alt"></i> Address</h4>
          <p>123 Industrial Blvd<br>City, State 12345<br>United States</p>

          <h4><i class="fas fa-phone"></i> Phone</h4>
          <p><a href="tel:+1-234-567-8900">+1-234-567-8900</a></p>

          <h4><i class="fas fa-envelope"></i> Email</h4>
          <p><a href="mailto:info@packagingequipment.com">info@packagingequipment.com</a></p>

          <h4><i class="fas fa-clock"></i> Business Hours</h4>
          <p>Monday - Friday: 8:00 AM - 5:00 PM<br>Saturday: 9:00 AM - 2:00 PM<br>Sunday: Closed</p>
        </div>

        <div style="flex: 1;">
          <h3>Our Expertise</h3>
          <h4>We specialize in:</h4>
          <ul>
            <li>Plastic strapping systems and tools</li>
            <li>Steel strapping equipment and accessories</li>
            <li>Stretch film wrapping machinery</li>
            <li>Tape dispensing and sealing solutions</li>
            <li>Custom packaging system design</li>
            <li>Equipment maintenance and repair</li>
          </ul>

          <h4>Industries We Serve:</h4>
          <ul>
            <li>Manufacturing</li>
            <li>Distribution</li>
            <li>Food & Beverage</li>
            <li>Construction</li>
            <li>Logistics</li>
            <li>E-commerce</li>
          </ul>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #2c3e50, #3498db); color: white; padding: 40px; text-align: center; border-radius: 8px; margin: 40px 0;">
        <h2>Ready to Improve Your Packaging Operations?</h2>
        <p>Contact our experts today for a free consultation and equipment recommendation.</p>
        <p>
          <a href="tel:+1-234-567-8900" style="color: #white; margin-right: 20px;">📞 Get Free Quote</a>
          <a href="mailto:info@packagingequipment.com?subject=Equipment Consultation Request" style="color: white;">📅 Schedule Consultation</a>
        </p>
      </div>
    `,
    metaDescription: "Get in touch with our packaging equipment experts for quotes, support, and consultation.",
    showInNavigation: true,
    navigationOrder: 2,
    publishedAt: new Date().toISOString()
  }
};

async function createPages() {
  try {
    console.log('🚀 Creating About page...');
    const aboutResponse = await api.post('/pages', aboutPageData);
    console.log('✅ About page created successfully:', aboutResponse.data.data.attributes.title);

    console.log('🚀 Creating Contact page...');
    const contactResponse = await api.post('/pages', contactPageData);
    console.log('✅ Contact page created successfully:', contactResponse.data.data.attributes.title);

    console.log('\n🎉 All pages created successfully!');
    console.log('📄 Visit: http://localhost:3000/about');
    console.log('📞 Visit: http://localhost:3000/contact');

  } catch (error) {
    console.error('❌ Error creating pages:', error.response?.data || error.message);
  }
}

createPages();