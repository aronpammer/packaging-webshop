const StrapiUtils = require('./strapi-utils');

const defaultPages = [
  {
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
  },
  {
    title: "Contact Us",
    slug: "contact",
    content: `
      <h2>Contact Us</h2>
      <p>Get in touch with our packaging equipment experts for quotes, technical support, or consultation.</p>

      <div style="display: flex; gap: 40px; margin: 40px 0; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 300px;">
          <h3>Get in Touch</h3>

          <h4><i class="fas fa-map-marker-alt" style="color: #3498db; margin-right: 8px;"></i> Address</h4>
          <p>123 Industrial Blvd<br>City, State 12345<br>United States</p>

          <h4><i class="fas fa-phone" style="color: #3498db; margin-right: 8px;"></i> Phone</h4>
          <p><a href="tel:+1-234-567-8900">+1-234-567-8900</a></p>

          <h4><i class="fas fa-envelope" style="color: #3498db; margin-right: 8px;"></i> Email</h4>
          <p><a href="mailto:info@packagingequipment.com">info@packagingequipment.com</a></p>

          <h4><i class="fas fa-clock" style="color: #3498db; margin-right: 8px;"></i> Business Hours</h4>
          <p>Monday - Friday: 8:00 AM - 5:00 PM<br>Saturday: 9:00 AM - 2:00 PM<br>Sunday: Closed</p>
        </div>

        <div style="flex: 1; min-width: 300px;">
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
          <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
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
        <h2 style="color: white;">Ready to Improve Your Packaging Operations?</h2>
        <p style="font-size: 1.1rem; margin-bottom: 30px;">Contact our experts today for a free consultation and equipment recommendation.</p>
        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
          <a href="tel:+1-234-567-8900" style="background: rgba(255,255,255,0.2); color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
            <i class="fas fa-phone"></i> Get Free Quote
          </a>
          <a href="mailto:info@packagingequipment.com?subject=Equipment Consultation Request" style="background: white; color: #2c3e50; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
            <i class="fas fa-calendar"></i> Schedule Consultation
          </a>
        </div>
      </div>
    `,
    metaDescription: "Get in touch with our packaging equipment experts for quotes, support, and consultation.",
    showInNavigation: true,
    navigationOrder: 2,
    publishedAt: new Date().toISOString()
  }
];

async function setupDefaultPages() {
  console.log('🚀 Setting up default pages...\n');

  const strapi = new StrapiUtils();

  try {
    for (const pageData of defaultPages) {
      await strapi.createOrUpdatePage(pageData);
    }

    console.log('\n🎉 All default pages have been set up successfully!');
    console.log('📄 Visit: http://localhost:3000/about');
    console.log('📞 Visit: http://localhost:3000/contact');
    console.log('\n💡 You can now edit these pages in your Strapi admin panel.');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupDefaultPages();
}

module.exports = { setupDefaultPages, defaultPages };