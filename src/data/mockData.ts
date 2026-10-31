import { 
  Product, 
  InventoryBatch, 
  Supplier, 
  PurchaseOrder, 
  Order, 
  CustomerProfile, 
  DeliveryRider, 
  CashierShift, 
  WastageRecord,
  GSTEntry
} from "@/types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-tomato",
    name: "Organic Country Tomatoes (Desi)",
    slug: "organic-desi-tomatoes",
    category: "Vegetables",
    description: "Naturally vine-ripened, pesticide-free Desi tomatoes. Rich in lycopene and natural tanginess, perfect for daily Indian curries, rasam, and fresh salads.",
    pricePerKg: 60,
    availableUnits: [
      { unit: "500g", multiplier: 0.5, price: 30 },
      { unit: "kg", multiplier: 1.0, price: 60 },
      { unit: "250g", multiplier: 0.25, price: 18 }
    ],
    currentStockKg: 145,
    minThresholdKg: 30,
    costPricePerKg: 22,
    shelfLifeDays: 5,
    hsnCode: "07020000",
    gstRate: 0,
    isOrganic: true,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    originFarm: "Krishna Organic Collective, Sangli",
    harvestDate: "Yesterday morning",
    featured: true,
    bestSeller: true,
    seasonal: false,
  },
  {
    id: "prod-spinach",
    name: "Tender Green Spinach (Palak)",
    slug: "tender-green-spinach-palak",
    category: "Leafy Greens",
    description: "Crisp, broad-leaf spinach harvested at dawn from chemical-free soil. Packed with iron, folate, and vital nutrients.",
    pricePerKg: 60,
    availableUnits: [
      { unit: "bunch", multiplier: 0.25, price: 20 },
      { unit: "500g", multiplier: 0.5, price: 30 },
      { unit: "kg", multiplier: 1.0, price: 60 }
    ],
    currentStockKg: 28,
    minThresholdKg: 15,
    costPricePerKg: 24,
    shelfLifeDays: 2,
    hsnCode: "07097000",
    gstRate: 0,
    isOrganic: true,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
    originFarm: "Sahyadri Valley Greens, Junnar",
    harvestDate: "Today 5:00 AM",
    featured: true,
    bestSeller: true,
    seasonal: false,
  },
  {
    id: "prod-banana",
    name: "Natural Yelakki Small Bananas",
    slug: "natural-yelakki-bananas",
    category: "Fruits",
    description: "Naturally carbide-free ripened Yelakki table bananas. Sweet aromatic flavor with high potassium and dietary fiber.",
    pricePerKg: 60,
    availableUnits: [
      { unit: "dozen", multiplier: 1.0, price: 60 },
      { unit: "500g", multiplier: 0.5, price: 32 }
    ],
    currentStockKg: 62,
    minThresholdKg: 20,
    costPricePerKg: 28,
    shelfLifeDays: 4,
    hsnCode: "08039010",
    gstRate: 0,
    isOrganic: true,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    originFarm: "Western Ghats Orchards, Wayanad",
    harvestDate: "2 days ago",
    featured: true,
    bestSeller: true,
    seasonal: false,
  },
  {
    id: "prod-carrot",
    name: "Sweet Red Winter Carrots (Gajar)",
    slug: "sweet-red-carrots",
    category: "Vegetables",
    description: "Sweet, crunchy and deep red country carrots. Excellent for fresh cold juice, salads, and traditional slow-cooked gajar halwa.",
    pricePerKg: 70,
    availableUnits: [
      { unit: "500g", multiplier: 0.5, price: 35 },
      { unit: "kg", multiplier: 1.0, price: 70 }
    ],
    currentStockKg: 85,
    minThresholdKg: 25,
    costPricePerKg: 32,
    shelfLifeDays: 7,
    hsnCode: "07061000",
    gstRate: 0,
    isOrganic: true,
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80",
    originFarm: "Malwa Plateau Organic Trust",
    harvestDate: "3 days ago",
    featured: false,
    bestSeller: true,
    seasonal: true,
  },
  {
    id: "prod-mango",
    name: "Naturally Matured Kesar Mangoes",
    slug: "kesar-mangoes",
    category: "Fruits",
    description: "Handpicked premium GI-tagged Gir Kesar mangoes. Deep saffron pulp, rich fragrance, and chemical-free tree ripening.",
    pricePerKg: 120,
    availableUnits: [
      { unit: "kg", multiplier: 1.0, price: 120 },
      { unit: "500g", multiplier: 0.5, price: 65 }
    ],
    currentStockKg: 42,
    minThresholdKg: 20,
    costPricePerKg: 68,
    shelfLifeDays: 4,
    hsnCode: "08045020",
    gstRate: 0,
    isOrganic: true,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
    originFarm: "Gir Valley Mango Groves, Talala",
    harvestDate: "4 days ago",
    featured: true,
    bestSeller: true,
    seasonal: true,
  },
  {
    id: "prod-lemon",
    name: "Juicy Thin-Skin Kagzi Lemons",
    slug: "juicy-kagzi-lemons",
    category: "Fruits",
    description: "Bursting with aromatic vitamin C juice. Thin yellow skin and intense natural citrus aroma for refreshing summer drinks and seasoning.",
    pricePerKg: 90,
    availableUnits: [
      { unit: "250g", multiplier: 0.25, price: 25 },
      { unit: "500g", multiplier: 0.5, price: 48 },
      { unit: "kg", multiplier: 1.0, price: 90 }
    ],
    currentStockKg: 25,
    minThresholdKg: 10,
    costPricePerKg: 42,
    shelfLifeDays: 10,
    hsnCode: "08055000",
    gstRate: 0,
    isOrganic: true,
    image: "https://images.unsplash.com/photo-1536510233921-8e5043fce771?auto=format&fit=crop&w=800&q=80",
    originFarm: "Solapur Citrus Orchards",
    harvestDate: "Yesterday",
    featured: false,
    bestSeller: false,
    seasonal: false,
  },
  {
    id: "prod-coriander",
    name: "Aromatic Desi Coriander (Dhaniya)",
    slug: "desi-coriander-leaves",
    category: "Leafy Greens",
    description: "Highly fragrant native variety coriander with thin stems and intense flavour. Harvested daily with fresh roots intact.",
    pricePerKg: 80,
    availableUnits: [
      { unit: "bunch", multiplier: 0.2, price: 20 },
      { unit: "500g", multiplier: 0.5, price: 42 }
    ],
    currentStockKg: 12,
    minThresholdKg: 10,
    costPricePerKg: 30,
    shelfLifeDays: 2,
    hsnCode: "07099990",
    gstRate: 0,
    isOrganic: true,
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
    originFarm: "Pune Peri-urban Hydro-Natural",
    harvestDate: "Today early morning",
    featured: false,
    bestSeller: true,
    seasonal: false,
  },
  {
    id: "prod-onion",
    name: "Dry Cured Red Nashik Onions",
    slug: "red-nashik-onions",
    category: "Vegetables",
    description: "Firm, sun-cured pungent red onions from Lasalgaon, Nashik. Long storage life with balanced sweetness and pungency.",
    pricePerKg: 38,
    availableUnits: [
      { unit: "kg", multiplier: 1.0, price: 38 },
      { unit: "500g", multiplier: 0.5, price: 20 }
    ],
    currentStockKg: 210,
    minThresholdKg: 50,
    costPricePerKg: 19,
    shelfLifeDays: 25,
    hsnCode: "07031010",
    gstRate: 0,
    isOrganic: false,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80",
    originFarm: "Lasalgaon Mandi Direct Collective",
    harvestDate: "10 days ago",
    featured: false,
    bestSeller: true,
    seasonal: false,
  },
  {
    id: "prod-potato",
    name: "Unpolished Mountain Potatoes (Pahadi)",
    slug: "unpolished-mountain-potatoes",
    category: "Vegetables",
    description: "Low-sugar, earthy yellow potatoes grown in Himachal hill slopes. Non-sweet, crispy for frying and curries.",
    pricePerKg: 35,
    availableUnits: [
      { unit: "kg", multiplier: 1.0, price: 35 },
      { unit: "500g", multiplier: 0.5, price: 18 }
    ],
    currentStockKg: 190,
    minThresholdKg: 40,
    costPricePerKg: 16,
    shelfLifeDays: 28,
    hsnCode: "07019000",
    gstRate: 0,
    isOrganic: false,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    originFarm: "Shimla Valley Farmers Guild",
    harvestDate: "12 days ago",
    featured: false,
    bestSeller: false,
    seasonal: false,
  },
  {
    id: "prod-oil",
    name: "Wood-Pressed Cold Groundnut Oil",
    slug: "wood-pressed-groundnut-oil",
    category: "Cold-Pressed & Staples",
    description: "Traditional Vaagai Mara Chekku pressed oil from native Saurashtra peanuts. Unrefined, unbleached, retaining natural nutty aroma and tocopherols.",
    pricePerKg: 290,
    availableUnits: [
      { unit: "bottle", multiplier: 1.0, price: 290 }
    ],
    currentStockKg: 45,
    minThresholdKg: 12,
    costPricePerKg: 190,
    shelfLifeDays: 180,
    hsnCode: "15089010",
    gstRate: 5,
    isOrganic: true,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    originFarm: "Junagadh Natural Oil Mills",
    harvestDate: "Pressed 15 days ago",
    featured: true,
    bestSeller: false,
    seasonal: false,
  },
  {
    id: "prod-honey",
    name: "Raw Multi-Flora Forest Honey",
    slug: "raw-forest-honey",
    category: "Cold-Pressed & Staples",
    description: "Unfiltered, unpasteurized honey sourced ethically from tribal beekeepers in Satpura forests. Rich in natural bee pollen and enzymes.",
    pricePerKg: 350,
    availableUnits: [
      { unit: "packet", multiplier: 0.5, price: 350 }
    ],
    currentStockKg: 30,
    minThresholdKg: 8,
    costPricePerKg: 210,
    shelfLifeDays: 365,
    hsnCode: "04090000",
    gstRate: 5,
    isOrganic: true,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    originFarm: "Satpura Tribal Honey Society",
    harvestDate: "Bottled last month",
    featured: true,
    bestSeller: false,
    seasonal: false,
  },
  {
    id: "prod-ghee",
    name: "Gir Cow A2 Bilona Cultured Ghee",
    slug: "gir-cow-a2-bilona-ghee",
    category: "Cold-Pressed & Staples",
    description: "Handcrafted using Vedic Bilona method from curd churned whole milk of free-grazing indigenous Gir cows. Golden, aromatic, and easily digestible.",
    pricePerKg: 950,
    availableUnits: [
      { unit: "bottle", multiplier: 0.5, price: 950 }
    ],
    currentStockKg: 18,
    minThresholdKg: 5,
    costPricePerKg: 680,
    shelfLifeDays: 270,
    hsnCode: "04059020",
    gstRate: 12,
    isOrganic: true,
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
    originFarm: "Vrindavan Gaushala Trust, Mathura",
    harvestDate: "Prepared 2 weeks ago",
    featured: false,
    bestSeller: true,
    seasonal: false,
  }
];

export const INITIAL_BATCHES: InventoryBatch[] = [
  {
    id: "batch-101",
    batchNumber: "B-261028-A",
    productId: "prod-tomato",
    productName: "Organic Country Tomatoes (Desi)",
    receivedDate: "2026-10-28",
    expiryDate: "2026-11-02",
    initialQuantityKg: 100,
    remainingQuantityKg: 65,
    costPerKg: 22,
    supplierName: "Krishna Organic Collective",
    purchaseOrderId: "PO-2026-042",
    status: "Fresh"
  },
  {
    id: "batch-102",
    batchNumber: "B-261030-B",
    productId: "prod-tomato",
    productName: "Organic Country Tomatoes (Desi)",
    receivedDate: "2026-10-30",
    expiryDate: "2026-11-04",
    initialQuantityKg: 80,
    remainingQuantityKg: 80,
    costPerKg: 22,
    supplierName: "Krishna Organic Collective",
    purchaseOrderId: "PO-2026-048",
    status: "Fresh"
  },
  {
    id: "batch-103",
    batchNumber: "B-261029-S",
    productId: "prod-spinach",
    productName: "Tender Green Spinach (Palak)",
    receivedDate: "2026-10-29",
    expiryDate: "2026-10-31",
    initialQuantityKg: 40,
    remainingQuantityKg: 14,
    costPerKg: 24,
    supplierName: "Sahyadri Valley Greens",
    purchaseOrderId: "PO-2026-045",
    status: "Expiring Soon"
  },
  {
    id: "batch-104",
    batchNumber: "B-261027-C",
    productId: "prod-coriander",
    productName: "Aromatic Desi Coriander (Dhaniya)",
    receivedDate: "2026-10-27",
    expiryDate: "2026-10-31",
    initialQuantityKg: 20,
    remainingQuantityKg: 6,
    costPerKg: 30,
    supplierName: "Sahyadri Valley Greens",
    purchaseOrderId: "PO-2026-041",
    status: "Critical"
  },
  {
    id: "batch-105",
    batchNumber: "B-261026-M",
    productId: "prod-mango",
    productName: "Naturally Matured Kesar Mangoes",
    receivedDate: "2026-10-26",
    expiryDate: "2026-11-01",
    initialQuantityKg: 60,
    remainingQuantityKg: 24,
    costPerKg: 68,
    supplierName: "Gir Valley Mango Groves",
    purchaseOrderId: "PO-2026-039",
    status: "Expiring Soon"
  },
  {
    id: "batch-106",
    batchNumber: "B-261015-OIL",
    productId: "prod-oil",
    productName: "Wood-Pressed Cold Groundnut Oil",
    receivedDate: "2026-10-15",
    expiryDate: "2027-04-15",
    initialQuantityKg: 50,
    remainingQuantityKg: 45,
    costPerKg: 190,
    supplierName: "Junagadh Natural Oil Mills",
    purchaseOrderId: "PO-2026-031",
    status: "Fresh"
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: "sup-1",
    name: "Krishna Organic Collective",
    contactPerson: "Ramesh Patil",
    phone: "+91 98220 14890",
    location: "Sangli, Maharashtra",
    rating: 4.9,
    primaryProduce: ["Desi Tomatoes", "Green Chilies", "Brinjal", "Bottle Gourd"],
    lastSuppliedDate: "2026-10-30",
    paymentTerms: "Net 7 Days",
    outstandingBalance: 12450,
    recentRates: [
      { productName: "Organic Country Tomatoes", ratePerKg: 22 },
      { productName: "Green Chilies", ratePerKg: 45 }
    ]
  },
  {
    id: "sup-2",
    name: "Sahyadri Valley Greens",
    contactPerson: "Santosh Deshmukh",
    phone: "+91 94231 66712",
    location: "Junnar / Narayangaon",
    rating: 4.8,
    primaryProduce: ["Palak", "Methi", "Coriander", "Mint"],
    lastSuppliedDate: "2026-10-29",
    paymentTerms: "Cash on Delivery",
    outstandingBalance: 0,
    recentRates: [
      { productName: "Tender Green Spinach", ratePerKg: 24 },
      { productName: "Aromatic Desi Coriander", ratePerKg: 30 }
    ]
  },
  {
    id: "sup-3",
    name: "Gir Valley Mango Groves",
    contactPerson: "Bhaveshbhai Patel",
    phone: "+91 99042 81234",
    location: "Talala, Gujarat",
    rating: 4.95,
    primaryProduce: ["Kesar Mangoes", "Desi Papaya", "Guava"],
    lastSuppliedDate: "2026-10-26",
    paymentTerms: "Advance 50%, Net 15 Days",
    outstandingBalance: 18500,
    recentRates: [
      { productName: "Naturally Matured Kesar Mangoes", ratePerKg: 68 }
    ]
  },
  {
    id: "sup-4",
    name: "Lasalgaon Mandi Direct",
    contactPerson: "Kishore Shinde",
    phone: "+91 97654 33210",
    location: "Lasalgaon, Nashik",
    rating: 4.6,
    primaryProduce: ["Red Onions", "White Onions", "Garlic"],
    lastSuppliedDate: "2026-10-21",
    paymentTerms: "Weekly Account",
    outstandingBalance: 8400,
    recentRates: [
      { productName: "Dry Cured Red Nashik Onions", ratePerKg: 19 }
    ]
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "po-1",
    poNumber: "PO-2026-048",
    supplierId: "sup-1",
    supplierName: "Krishna Organic Collective",
    orderDate: "2026-10-29",
    expectedDate: "2026-10-30",
    status: "Received",
    items: [
      {
        productId: "prod-tomato",
        productName: "Organic Country Tomatoes (Desi)",
        quantityKg: 80,
        ratePerKg: 22,
        total: 1760
      }
    ],
    subtotal: 1760,
    gstAmount: 0,
    totalAmount: 1760,
    notes: "Batch B-261030-B received, crates graded A+ grade.",
    receivedDetails: {
      receivedDate: "2026-10-30",
      receivedBy: "Mahesh (Inventory Exec)",
      batchNumberCreated: "B-261030-B",
      receivedQuantityKg: 80
    }
  },
  {
    id: "po-2",
    poNumber: "PO-2026-049",
    supplierId: "sup-2",
    supplierName: "Sahyadri Valley Greens",
    orderDate: "2026-10-30",
    expectedDate: "2026-11-01",
    status: "Sent",
    items: [
      {
        productId: "prod-spinach",
        productName: "Tender Green Spinach (Palak)",
        quantityKg: 50,
        ratePerKg: 24,
        total: 1200
      },
      {
        productId: "prod-coriander",
        productName: "Aromatic Desi Coriander (Dhaniya)",
        quantityKg: 25,
        ratePerKg: 30,
        total: 750
      }
    ],
    subtotal: 1950,
    gstAmount: 0,
    totalAmount: 1950,
    notes: "Requires morning delivery before 6:30 AM store open."
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1001",
    orderNumber: "P1/2627/000123",
    channel: "In-Store POS",
    createdAt: "2026-10-31T11:42:00",
    customerName: "Mrs. Sunita Rao",
    customerPhone: "+91 98201 54321",
    items: [
      {
        productId: "prod-tomato",
        productName: "Organic Country Tomatoes (Desi)",
        unit: "kg",
        quantity: 1,
        weightKg: 1.25,
        rate: 60,
        total: 75,
        gstRate: 0,
        gstAmount: 0
      },
      {
        productId: "prod-spinach",
        productName: "Tender Green Spinach (Palak)",
        unit: "kg",
        quantity: 1,
        weightKg: 0.5,
        rate: 60,
        total: 30,
        gstRate: 0,
        gstAmount: 0
      },
      {
        productId: "prod-banana",
        productName: "Natural Yelakki Small Bananas",
        unit: "dozen",
        quantity: 1,
        weightKg: 0.9,
        rate: 60,
        total: 60,
        gstRate: 0,
        gstAmount: 0
      }
    ],
    subtotal: 165,
    deliveryFee: 0,
    gstTotal: 0,
    discount: 0,
    total: 165,
    status: "Completed",
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    cashierName: "Riya (Counter 1)",
    loyaltyPointsEarned: 1
  },
  {
    id: "ord-1002",
    orderNumber: "ORD-2026-1042",
    channel: "Website Online",
    createdAt: "2026-10-31T09:15:00",
    customerName: "Dr. Arvind Joshi",
    customerPhone: "+91 98450 11223",
    customerEmail: "arvind.joshi@clinic.org",
    deliveryAddress: {
      street: "Flat 402, Green Meadows, Model Colony",
      area: "Shivajinagar / Model Colony",
      pincode: "411016",
      city: "Pune"
    },
    deliverySlot: "Today: 4:00 PM - 7:00 PM",
    items: [
      {
        productId: "prod-tomato",
        productName: "Organic Country Tomatoes (Desi)",
        unit: "kg",
        quantity: 2,
        weightKg: 2.0,
        rate: 60,
        total: 120,
        gstRate: 0,
        gstAmount: 0
      },
      {
        productId: "prod-oil",
        productName: "Wood-Pressed Cold Groundnut Oil",
        unit: "bottle",
        quantity: 1,
        weightKg: 1.0,
        rate: 290,
        total: 290,
        gstRate: 5,
        gstAmount: 13.81
      },
      {
        productId: "prod-carrot",
        productName: "Sweet Red Winter Carrots (Gajar)",
        unit: "kg",
        quantity: 1,
        weightKg: 1.0,
        rate: 70,
        total: 70,
        gstRate: 0,
        gstAmount: 0
      }
    ],
    subtotal: 480,
    deliveryFee: 0,
    gstTotal: 13.81,
    discount: 20,
    total: 460,
    status: "Packed",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Cash on Delivery",
    riderName: "Vikram Jadhav",
    packingWeightActualKg: 4.02,
    loyaltyPointsEarned: 4
  },
  {
    id: "ord-1003",
    orderNumber: "ORD-2026-1043",
    channel: "Website Online",
    createdAt: "2026-10-31T10:30:00",
    customerName: "Pooja Malhotra",
    customerPhone: "+91 99220 78899",
    customerEmail: "pooja.m@gmail.com",
    deliveryAddress: {
      street: "B-12, Hermes Heritage Phase 2, Kalyani Nagar",
      area: "Kalyani Nagar",
      pincode: "411006",
      city: "Pune"
    },
    deliverySlot: "Today: 4:00 PM - 7:00 PM",
    items: [
      {
        productId: "prod-mango",
        productName: "Naturally Matured Kesar Mangoes",
        unit: "kg",
        quantity: 2,
        weightKg: 2.0,
        rate: 120,
        total: 240,
        gstRate: 0,
        gstAmount: 0
      },
      {
        productId: "prod-spinach",
        productName: "Tender Green Spinach (Palak)",
        unit: "500g",
        quantity: 1,
        weightKg: 0.5,
        rate: 30,
        total: 30,
        gstRate: 0,
        gstAmount: 0
      }
    ],
    subtotal: 270,
    deliveryFee: 40,
    gstTotal: 0,
    discount: 0,
    total: 310,
    status: "New",
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    loyaltyPointsEarned: 3
  }
];

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: "cust-1",
    name: "Mrs. Sunita Rao",
    phone: "+91 98201 54321",
    email: "sunita.rao@outlook.com",
    address: "B-601, Windsor Parkland, Aundh",
    area: "Aundh",
    tier: "Gold",
    loyaltyPoints: 340,
    totalOrders: 28,
    totalSpend: 14850,
    lastOrderDate: "Today",
    favoriteItems: ["Organic Country Tomatoes", "Palak", "Desi Bilona Ghee"]
  },
  {
    id: "cust-2",
    name: "Dr. Arvind Joshi",
    phone: "+91 98450 11223",
    email: "arvind.joshi@clinic.org",
    address: "Flat 402, Green Meadows, Model Colony",
    area: "Shivajinagar",
    tier: "Silver",
    loyaltyPoints: 125,
    totalOrders: 11,
    totalSpend: 6200,
    lastOrderDate: "Today",
    favoriteItems: ["Cold Pressed Groundnut Oil", "Country Tomatoes", "Carrots"]
  },
  {
    id: "cust-3",
    name: "Pooja Malhotra",
    phone: "+91 99220 78899",
    email: "pooja.m@gmail.com",
    address: "B-12, Hermes Heritage Phase 2, Kalyani Nagar",
    area: "Kalyani Nagar",
    tier: "Gold",
    loyaltyPoints: 480,
    totalOrders: 34,
    totalSpend: 22100,
    lastOrderDate: "Today",
    favoriteItems: ["Kesar Mangoes", "Desi Palak", "Raw Forest Honey"]
  },
  {
    id: "cust-4",
    name: "Col. Rajesh Verma",
    phone: "+91 98110 99887",
    email: "rajesh.verma@defence.in",
    address: "Bungalow 7, Koregaon Park Road 3",
    area: "Koregaon Park",
    tier: "Platinum",
    loyaltyPoints: 920,
    totalOrders: 52,
    totalSpend: 46200,
    lastOrderDate: "2 days ago",
    favoriteItems: ["Gir Cow A2 Ghee", "Organic Tomatoes", "Kagzi Lemons"]
  }
];

export const INITIAL_RIDERS: DeliveryRider[] = [
  {
    id: "rider-1",
    name: "Vikram Jadhav",
    phone: "+91 98223 44556",
    vehicleType: "Electric Scooter (Farm Story Delivery)",
    activeOrdersCount: 2,
    status: "On Delivery"
  },
  {
    id: "rider-2",
    name: "Sachin Kulkarni",
    phone: "+91 97665 11223",
    vehicleType: "Cargo EV Three-Wheeler",
    activeOrdersCount: 0,
    status: "Available"
  }
];

export const INITIAL_SHIFTS: CashierShift[] = [
  {
    id: "shift-101",
    cashierName: "Riya (Counter 1)",
    startTime: "2026-10-31T07:30:00",
    openingCash: 2000,
    cashSales: 14250,
    upiSales: 22800,
    cardSales: 11200,
    totalSales: 48250,
    billsCount: 312,
    status: "Open"
  }
];

export const INITIAL_WASTAGE: WastageRecord[] = [
  {
    id: "wst-01",
    date: "2026-10-31",
    productId: "prod-coriander",
    productName: "Aromatic Desi Coriander (Dhaniya)",
    batchNumber: "B-261027-C",
    quantityKg: 2.2,
    estimatedLoss: 176,
    reason: "Overripe / Spoiled",
    reportedBy: "Mahesh (Inventory)"
  },
  {
    id: "wst-02",
    date: "2026-10-30",
    productId: "prod-tomato",
    productName: "Organic Country Tomatoes (Desi)",
    batchNumber: "B-261028-A",
    quantityKg: 1.5,
    estimatedLoss: 90,
    reason: "Bruised / Damaged",
    reportedBy: "Mahesh (Inventory)"
  }
];

export const INITIAL_GST_ENTRIES: GSTEntry[] = [
  {
    id: "gst-1",
    invoiceNumber: "P1/2627/000123",
    date: "2026-10-31",
    customerName: "Mrs. Sunita Rao",
    type: "Bill of Supply",
    nilRatedAmount: 165,
    taxableAmount: 0,
    cgst: 0,
    sgst: 0,
    totalTax: 0,
    totalInvoice: 165
  },
  {
    id: "gst-2",
    invoiceNumber: "ORD-2026-1042",
    date: "2026-10-31",
    customerName: "Dr. Arvind Joshi",
    type: "Tax Invoice",
    nilRatedAmount: 190,
    taxableAmount: 276.19,
    cgst: 6.90,
    sgst: 6.91,
    totalTax: 13.81,
    totalInvoice: 460
  }
];
