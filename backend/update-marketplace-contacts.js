require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateMarketplaceContacts() {
  try {
    console.log('📞 Updating marketplace contact information...\n');

    const listings = await prisma.forumMarketplace.findMany();
    
    const contactEmails = [
      'tractor.seller@agrisense.com',
      'wheat.seeds@agrisense.com',
      'irrigation.system@agrisense.com',
      'tomatoes.farm@agrisense.com',
      'fertilizer.supplier@agrisense.com'
    ];

    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i];
      const email = contactEmails[i % contactEmails.length];
      
      await prisma.forumMarketplace.update({
        where: { id: listing.id },
        data: { 
          contactEmail: email,
          contactPhone: listing.contactPhone || `+91-987654${3210 + i}`
        }
      });
      
      console.log(`✅ Updated: ${listing.title}`);
    }

    console.log('\n✅ All marketplace listings updated with contact information!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateMarketplaceContacts();
