require('dotenv').config();
const mongoose = require('mongoose');
const About = require('./models/About');

const seedAboutData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const aboutData = {
      title: "PropertyWave",
      subquote: "Elevating the Standard of Rental Living",
      mission: "To provide a seamless, secure, and professional platform that connects premium tenants with quality properties, ensuring a transparent and frictionless rental experience.",
      vision: "To become the premier standard in property rentals, creating an ecosystem where trust, convenience, and superior living experiences are the norm.",
      features: [
        "Advanced Property Filtering",
        "Secure Digital Wallet",
        "Automated Rental Requests",
        "Transparent Review System",
        "Dedicated Support"
      ],
      forTenant: "Find your ideal home with confidence. We offer curated listings, secure advance payments via our built-in wallet, and direct communication with verified landlords.",
      forLandlord: "Manage your properties effortlessly. Review tenant applications, process payments securely, and maintain a high-quality portfolio with our comprehensive dashboard.",
      contact: "Support: support@propertywave.com\nPhone: +880 1234 567890\nAddress: 123 Premium Avenue, Dhaka, Bangladesh",
      socialLinks: {
        facebook: "https://facebook.com/propertywave",
        twitter: "https://twitter.com/propertywave",
        linkedin: "https://linkedin.com/company/propertywave",
        instagram: "https://instagram.com/propertywave"
      }
    };

    // Replace the old one if it exists
    await About.deleteMany({});
    await About.create(aboutData);

    console.log('About data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedAboutData();
