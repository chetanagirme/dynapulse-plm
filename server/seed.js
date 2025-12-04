const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const BOM = require('./models/BOM');
const Supplier = require('./models/Supplier');
const ECO = require('./models/ECO');
const { NCR } = require('./models/Quality');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB for seeding'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        // Clear existing data
        await Product.deleteMany({});
        await BOM.deleteMany({});
        await Supplier.deleteMany({});
        await ECO.deleteMany({});
        await NCR.deleteMany({});

        // Products
        const products = await Product.insertMany([
            {
                id: '1',
                name: 'Gaming Laptop Pro 15',
                description: 'High-performance gaming laptop with RTX 4080.',
                sku: 'GL-PRO-15',
                cost: 1200.00,
                price: 2499.99,
                status: 'Active',
                category: 'Electronics'
            },
            {
                id: '2',
                name: 'Motherboard Z790',
                description: 'Advanced motherboard for 13th gen processors.',
                sku: 'MB-Z790-X',
                cost: 150.00,
                price: 350.00,
                status: 'Active',
                category: 'Electronics'
            },
            {
                id: '3',
                name: 'OLED Screen Panel 15.6"',
                description: '4K OLED display panel with 120Hz refresh rate.',
                sku: 'PNL-OLED-15',
                cost: 200.00,
                price: 400.00,
                status: 'Active',
                category: 'Electronics'
            },
            {
                id: '4',
                name: 'Mechanical Keyboard Module',
                description: 'RGB backlit mechanical keyboard with blue switches.',
                sku: 'KB-MECH-RGB',
                cost: 45.00,
                price: 120.00,
                status: 'Active',
                category: 'Electronics'
            },
            {
                id: '5',
                name: 'M.2 SSD 2TB',
                description: 'High-speed NVMe SSD storage.',
                sku: 'SSD-M2-2TB',
                cost: 80.00,
                price: 180.00,
                status: 'Active',
                category: 'Electronics'
            },
            {
                id: '6',
                name: 'Chassis Aluminum Alloy',
                description: 'CNC machined aluminum chassis.',
                sku: 'CHS-AL-15',
                cost: 120.00,
                price: 300.00,
                status: 'Active',
                category: 'Mechanical'
            },
            {
                id: '7',
                name: 'Screw M2x4',
                description: 'Standard M2 screw for assembly.',
                sku: 'SCR-M2-4',
                cost: 0.05,
                price: 0.10,
                status: 'Active',
                category: 'Mechanical'
            }
        ]);

        // Suppliers
        await Supplier.insertMany([
            {
                id: '1',
                name: 'TechComponents Inc.',
                contactName: 'Alice Smith',
                email: 'alice@techcomponents.com',
                phone: '+1 (555) 123-4567',
                address: '123 Tech Blvd, Silicon Valley, CA',
                status: 'Approved',
                rating: 5
            },
            {
                id: '2',
                name: 'ScreenMaster Ltd.',
                contactName: 'Bob Jones',
                email: 'bob@screenmaster.com',
                phone: '+44 20 7946 0123',
                address: '456 Circuit Rd, London, UK',
                status: 'Approved',
                rating: 4
            }
        ]);

        // BOMs
        await BOM.insertMany([
            {
                id: '1',
                productId: '1', // Gaming Laptop
                name: 'Gaming Laptop BOM',
                version: '1.0',
                status: 'Approved',
                components: [
                    { id: 'c1', componentProductId: '2', quantity: 1, unit: 'pcs' }, // Motherboard
                    { id: 'c2', componentProductId: '3', quantity: 1, unit: 'pcs' }, // Screen
                    { id: 'c3', componentProductId: '4', quantity: 1, unit: 'pcs' }, // Keyboard
                    { id: 'c4', componentProductId: '5', quantity: 2, unit: 'pcs' }, // SSD x2
                    { id: 'c5', componentProductId: '6', quantity: 1, unit: 'pcs' }, // Chassis
                    { id: 'c6', componentProductId: '7', quantity: 50, unit: 'pcs' } // Screws
                ]
            }
        ]);

        // ECOs
        await ECO.insertMany([
            {
                id: '1',
                title: 'Replace Screen Panel Vendor',
                description: 'Switching to ScreenMaster Ltd for better color accuracy.',
                status: 'Pending Approval',
                priority: 'High',
                productIds: ['1'],
                initiatorId: 'u2'
            }
        ]);

        // NCRs
        await NCR.insertMany([
            {
                id: '1',
                title: 'Cracked Screen Panel',
                description: 'Batch of screens arrived with hairline cracks.',
                productId: '3',
                severity: 'Critical',
                status: 'Open',
                reportedBy: 'u2'
            }
        ]);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedData();
