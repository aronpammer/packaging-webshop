const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = 'aa91d1478acc8539c1e4025ae2be86fd9c4cf195b62542d865b5b318e93103390371880232266a9379616abd1fa420136b08a841d22ad59cff78399e2a5af5f149d67e9e312b2df5a107c3a7270dc34951236f8e42d20da6d6af1816578a690e69e0e2618733fdeb730ae85f873c9dbe967915846696e93f635602208e490b20';

async function createSiteSettings() {
    try {
        console.log('🚀 Creating Site Settings...');

        // Default site settings data
        const siteSettingsData = {
            data: {
                phone: '+1-234-567-8900',
                email: 'info@packagingequipment.com',
                businessHours: 'Mon-Fri 8AM-5PM',
                address: '123 Industrial Blvd, City, State 12345',
                companyName: 'Packaging Equipment Solutions',
                companyDescription: 'Professional packaging equipment and solutions for all your industrial needs.',
                copyrightText: '2024 Packaging Equipment Solutions. All rights reserved.',
                metaDescription: 'Professional packaging equipment solutions including plastic strapping, steel strapping, film wrapping, and adhesive technology.',
                metaKeywords: 'packaging equipment, strapping, wrapping, industrial supplies',
                contactTitle: 'Get Quote & Information',
                contactDescription: 'Contact our specialists for pricing, technical specs, and availability.',
                callButtonText: 'Call',
                emailButtonText: 'Email Inquiry'
            }
        };

        // First, check if site setting already exists
        let response;
        try {
            response = await axios.get(`${STRAPI_URL}/api/site-setting`, {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.data) {
                console.log('✅ Site Settings already exist. Updating...');

                // Update existing site settings
                await axios.put(`${STRAPI_URL}/api/site-setting`, siteSettingsData, {
                    headers: {
                        'Authorization': `Bearer ${API_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('✅ Site Settings updated successfully!');
            } else {
                throw new Error('Site Settings not found');
            }
        } catch (error) {
            if (error.response?.status === 404 || error.message === 'Site Settings not found') {
                console.log('📝 Creating new Site Settings...');

                // Create new site settings
                response = await axios.post(`${STRAPI_URL}/api/site-setting`, siteSettingsData, {
                    headers: {
                        'Authorization': `Bearer ${API_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('✅ Site Settings created successfully!');
            } else {
                throw error;
            }
        }

        // Publish the site settings
        try {
            await axios.post(`${STRAPI_URL}/api/site-setting/actions/publish`, {}, {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ Site Settings published successfully!');
        } catch (publishError) {
            console.log('ℹ️  Site Settings created but could not be auto-published. Please publish manually in the admin panel.');
        }

        console.log('\n🎉 Site Settings setup complete!');
        console.log('\nYou can now:');
        console.log('1. Go to http://localhost:1337/admin');
        console.log('2. Navigate to Content Manager → Site Setting');
        console.log('3. Edit the contact information and company details');
        console.log('4. Save and Publish your changes');

    } catch (error) {
        console.error('❌ Error creating Site Settings:', error.message);

        if (error.response?.data) {
            console.error('Details:', error.response.data);
        }

        console.log('\n💡 Make sure:');
        console.log('1. Strapi is running on http://localhost:1337');
        console.log('2. The API token is valid');
        console.log('3. The Site Setting content type is properly created');
    }
}

// Run the script
createSiteSettings();