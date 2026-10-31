export type ProductCategory = 
  | "Vegetables"
  | "Fruits"
  | "Leafy Greens"
  | "Organic Specials"
  | "Cold-Pressed & Staples";

export type UnitType = "kg" | "500g" | "250g" | "bunch" | "dozen" | "packet" | "bottle";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  pricePerKg: number;
  availableUnits: {
    unit: UnitType;
    multiplier: number; // e.g. 0.5 for 500g, 1 for kg
    price: number;
  }[];
  currentStockKg: number;
  minThresholdKg: number;
  costPricePerKg: number;
  shelfLifeDays: number;
  hsnCode: string;
  gstRate: number; // 0 for nil-rated fresh produce, 5 or 12 for packaged
  isOrganic: boolean;
  image: string;
  originFarm: string;
  harvestDate?: string;
  featured?: boolean;
  bestSeller?: boolean;
  seasonal?: boolean;
}

export interface InventoryBatch {
  id: string;
  batchNumber: string; // e.g. B-261028-A
  productId: string;
  productName: string;
  receivedDate: string;
  expiryDate: string;
  initialQuantityKg: number;
  remainingQuantityKg: number;
  costPerKg: number;
  supplierName: string;
  purchaseOrderId?: string;
  status: "Fresh" | "Expiring Soon" | "Critical" | "Depleted" | "Expired";
}

export interface WastageRecord {
  id: string;
  date: string;
  productId: string;
  productName: string;
  batchNumber: string;
  quantityKg: number;
  estimatedLoss: number;
  reason: "Bruised / Damaged" | "Overripe / Spoiled" | "Handling Loss" | "Weight Evaporation" | "Expired";
  reportedBy: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  location: string;
  rating: number;
  primaryProduce: string[];
  lastSuppliedDate: string;
  paymentTerms: string;
  outstandingBalance: number;
  recentRates: {
    productName: string;
    ratePerKg: number;
  }[];
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantityKg: number;
  ratePerKg: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. PO-2026-089
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDate: string;
  status: "Draft" | "Sent" | "Received" | "Partially Received" | "Cancelled";
  items: PurchaseOrderItem[];
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  notes?: string;
  receivedDetails?: {
    receivedDate: string;
    receivedBy: string;
    batchNumberCreated: string;
    receivedQuantityKg: number;
  };
}

export type OrderChannel = "In-Store POS" | "Website Online";
export type OrderStatus = "New" | "Packed" | "Dispatched" | "Delivered" | "Completed" | "Cancelled";
export type PaymentStatus = "Paid" | "Pending" | "Cash on Delivery" | "Refunded";
export type PaymentMethod = "Cash" | "UPI" | "Card" | "Pay at Store" | "Cash on Delivery" | "Split";

export interface OrderItem {
  productId: string;
  productName: string;
  unit: UnitType;
  quantity: number;
  weightKg: number;
  rate: number;
  total: number;
  gstRate: number;
  gstAmount: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ORD-2026-1042 or P1/2627/000123
  channel: OrderChannel;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: {
    street: string;
    area: string;
    pincode: string;
    city: string;
  };
  deliverySlot?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  gstTotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  cashierName?: string;
  riderName?: string;
  notes?: string;
  packingWeightActualKg?: number; // Exact weigh-at-packing weight
  loyaltyPointsEarned?: number;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  tier: "Silver" | "Gold" | "Platinum";
  loyaltyPoints: number;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
  favoriteItems: string[];
}

export interface GSTEntry {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  type: "Tax Invoice" | "Bill of Supply";
  nilRatedAmount: number; // Fresh produce (0% GST)
  taxableAmount: number;  // Packaged/processed goods
  cgst: number;
  sgst: number;
  totalTax: number;
  totalInvoice: number;
}

export interface CashierShift {
  id: string;
  cashierName: string;
  startTime: string;
  endTime?: string;
  openingCash: number;
  cashSales: number;
  upiSales: number;
  cardSales: number;
  totalSales: number;
  billsCount: number;
  status: "Open" | "Closed";
}

export interface DeliveryRider {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  activeOrdersCount: number;
  status: "Available" | "On Delivery" | "Off Duty";
}

export type UserRole = 
  | "Owner"
  | "Manager"
  | "Cashier"
  | "Inventory Executive"
  | "Packing and Delivery"
  | "Accountant / CA";

export interface TomatoCrateStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  actionName: string;
  details: string;
  statImpact: string;
  isCompleted: boolean;
}
