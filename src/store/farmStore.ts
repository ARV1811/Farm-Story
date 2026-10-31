import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  GSTEntry,
  UserRole,
  UnitType,
  OrderItem,
  OrderStatus,
  PaymentMethod
} from "@/types";
import { 
  INITIAL_PRODUCTS, 
  INITIAL_BATCHES, 
  INITIAL_SUPPLIERS, 
  INITIAL_PURCHASE_ORDERS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_RIDERS, 
  INITIAL_SHIFTS, 
  INITIAL_WASTAGE, 
  INITIAL_GST_ENTRIES 
} from "@/data/mockData";

export interface CartItem {
  product: Product;
  unit: UnitType;
  quantity: number;
  weightKg: number;
}

export interface HeldBill {
  id: string;
  customerName: string;
  heldAt: string;
  items: CartItem[];
  total: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  timestamp: string;
}

interface FarmState {
  // Master data
  products: Product[];
  batches: InventoryBatch[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  orders: Order[];
  customers: CustomerProfile[];
  riders: DeliveryRider[];
  shifts: CashierShift[];
  wastageRecords: WastageRecord[];
  gstEntries: GSTEntry[];

  // App & Presentation State
  activeRole: UserRole;
  isPosOffline: boolean;
  offlineSyncQueue: any[];
  heldBills: HeldBill[];
  notifications: NotificationItem[];
  tomatoCrateStep: number; // 1 to 6

  // Cart States
  customerCart: CartItem[];
  posCart: CartItem[];

  // Actions
  setRole: (role: UserRole) => void;
  addNotification: (title: string, message: string, type?: "info" | "success" | "warning") => void;
  dismissNotification: (id: string) => void;

  // Customer Cart
  addToCustomerCart: (product: Product, unit: UnitType, quantity?: number, weightKg?: number) => void;
  updateCustomerCartQty: (index: number, quantity: number) => void;
  removeFromCustomerCart: (index: number) => void;
  clearCustomerCart: () => void;
  placeCustomerOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryAddress: { street: string; area: string; pincode: string; city: string };
    deliverySlot: string;
    paymentMethod: PaymentMethod;
  }) => Order;

  // POS Operations
  addToPosCart: (product: Product, unit?: UnitType, quantity?: number, weightKg?: number) => void;
  updatePosCartItem: (index: number, quantity: number, weightKg?: number) => void;
  removeFromPosCart: (index: number) => void;
  clearPosCart: () => void;
  holdCurrentPosBill: (customerName?: string) => void;
  resumeHeldPosBill: (heldBillId: string) => void;
  togglePosOffline: (isOffline: boolean) => void;
  syncOfflineQueue: () => void;
  completePosSale: (paymentMethod: PaymentMethod, cashierName?: string) => Order;

  // Purchasing & Inventory
  createPurchaseOrder: (poData: Omit<PurchaseOrder, "id" | "poNumber" | "status">) => PurchaseOrder;
  receivePurchaseOrder: (poId: string, receivedBy: string) => void;
  recordWastage: (wastage: Omit<WastageRecord, "id" | "date">) => void;
  updateStockDirectly: (productId: string, adjustmentKg: number, reason: string) => void;

  // Orders & Delivery Fulfillment
  updateOrderStatus: (orderId: string, status: OrderStatus, options?: { riderId?: string; actualWeightKg?: number }) => void;

  // Crate of Tomatoes Interactive Journey
  runTomatoCrateStep: (stepNumber: number) => void;

  // Reset Demo
  resetAllDemoData: () => void;
}

export const useFarmStore = create<FarmState>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      batches: INITIAL_BATCHES,
      suppliers: INITIAL_SUPPLIERS,
      purchaseOrders: INITIAL_PURCHASE_ORDERS,
      orders: INITIAL_ORDERS,
      customers: INITIAL_CUSTOMERS,
      riders: INITIAL_RIDERS,
      shifts: INITIAL_SHIFTS,
      wastageRecords: INITIAL_WASTAGE,
      gstEntries: INITIAL_GST_ENTRIES,

      activeRole: "Owner",
      isPosOffline: false,
      offlineSyncQueue: [],
      heldBills: [],
      notifications: [
        {
          id: "notif-welcome",
          title: "Demo Initialized",
          message: "All 9 modules loaded with live mock data. Oldest stock sells first (FIFO).",
          type: "info",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      tomatoCrateStep: 1,

      customerCart: [],
      posCart: [],

      setRole: (role) => set({ activeRole: role }),

      addNotification: (title, message, type = "info") => {
        const notif: NotificationItem = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title,
          message,
          type,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        set((state) => ({ notifications: [notif, ...state.notifications].slice(0, 8) }));
      },

      dismissNotification: (id) => {
        set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }));
      },

      // Customer Cart Actions
      addToCustomerCart: (product, unit, quantity = 1, weightKg) => {
        set((state) => {
          const unitMultiplier = product.availableUnits.find((u) => u.unit === unit)?.multiplier || 1.0;
          const calcWeight = weightKg || unitMultiplier * quantity;
          const existingIndex = state.customerCart.findIndex(
            (item) => item.product.id === product.id && item.unit === unit
          );

          if (existingIndex > -1) {
            const updated = [...state.customerCart];
            const currentItem = updated[existingIndex];
            const newQty = currentItem.quantity + quantity;
            updated[existingIndex] = {
              ...currentItem,
              quantity: newQty,
              weightKg: unitMultiplier * newQty
            };
            return { customerCart: updated };
          } else {
            return {
              customerCart: [
                ...state.customerCart,
                { product, unit, quantity, weightKg: calcWeight }
              ]
            };
          }
        });
      },

      updateCustomerCartQty: (index, quantity) => {
        set((state) => {
          const updated = [...state.customerCart];
          if (quantity <= 0) {
            updated.splice(index, 1);
          } else {
            const item = updated[index];
            const multiplier = item.product.availableUnits.find((u) => u.unit === item.unit)?.multiplier || 1.0;
            updated[index] = { ...item, quantity, weightKg: multiplier * quantity };
          }
          return { customerCart: updated };
        });
      },

      removeFromCustomerCart: (index) => {
        set((state) => {
          const updated = [...state.customerCart];
          updated.splice(index, 1);
          return { customerCart: updated };
        });
      },

      clearCustomerCart: () => set({ customerCart: [] }),

      placeCustomerOrder: (orderData) => {
        const state = get();
        const items: OrderItem[] = state.customerCart.map((cartItem) => {
          const unitPrice = cartItem.product.availableUnits.find(u => u.unit === cartItem.unit)?.price || (cartItem.product.pricePerKg * cartItem.weightKg);
          const lineTotal = unitPrice * cartItem.quantity;
          const gstAmount = cartItem.product.gstRate > 0 ? (lineTotal * cartItem.product.gstRate) / 100 : 0;
          return {
            productId: cartItem.product.id,
            productName: cartItem.product.name,
            unit: cartItem.unit,
            quantity: cartItem.quantity,
            weightKg: cartItem.weightKg,
            rate: unitPrice,
            total: lineTotal,
            gstRate: cartItem.product.gstRate,
            gstAmount
          };
        });

        const subtotal = items.reduce((acc, i) => acc + i.total, 0);
        const deliveryFee = subtotal >= 500 ? 0 : 40;
        const gstTotal = items.reduce((acc, i) => acc + i.gstAmount, 0);
        const discount = subtotal >= 1000 ? 50 : 0;
        const total = subtotal + deliveryFee + gstTotal - discount;

        const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const loyaltyPointsEarned = Math.floor(total / 100);

        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          orderNumber,
          channel: "Website Online",
          createdAt: new Date().toISOString(),
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          customerEmail: orderData.customerEmail,
          deliveryAddress: orderData.deliveryAddress,
          deliverySlot: orderData.deliverySlot,
          items,
          subtotal,
          deliveryFee,
          gstTotal,
          discount,
          total,
          status: "New",
          paymentMethod: orderData.paymentMethod,
          paymentStatus: orderData.paymentMethod === "Cash on Delivery" ? "Cash on Delivery" : "Paid",
          loyaltyPointsEarned
        };

        // Deduct inventory stock
        const updatedProducts = state.products.map((p) => {
          const item = items.find((i) => i.productId === p.id);
          if (item) {
            return {
              ...p,
              currentStockKg: Math.max(0, p.currentStockKg - item.weightKg)
            };
          }
          return p;
        });

        // Add GST entry
        const nilRated = items.filter(i => i.gstRate === 0).reduce((sum, i) => sum + i.total, 0);
        const taxable = items.filter(i => i.gstRate > 0).reduce((sum, i) => sum + i.total, 0);
        const newGstEntry: GSTEntry = {
          id: `gst-${Date.now()}`,
          invoiceNumber: orderNumber,
          date: new Date().toISOString().split("T")[0],
          customerName: orderData.customerName,
          type: taxable > 0 ? "Tax Invoice" : "Bill of Supply",
          nilRatedAmount: nilRated,
          taxableAmount: taxable,
          cgst: gstTotal / 2,
          sgst: gstTotal / 2,
          totalTax: gstTotal,
          totalInvoice: total
        };

        set({
          orders: [newOrder, ...state.orders],
          products: updatedProducts,
          gstEntries: [newGstEntry, ...state.gstEntries],
          customerCart: []
        });

        get().addNotification(
          "Online Order Received!",
          `Order ${orderNumber} for ₹${total} placed by ${orderData.customerName}. Sent to fulfillment.`,
          "success"
        );

        return newOrder;
      },

      // POS Actions
      addToPosCart: (product, unit = "kg", quantity = 1, weightKg) => {
        set((state) => {
          const unitObj = product.availableUnits.find((u) => u.unit === unit);
          const multiplier = unitObj?.multiplier || 1.0;
          const calcWeight = weightKg !== undefined ? weightKg : multiplier * quantity;

          const existingIndex = state.posCart.findIndex(
            (item) => item.product.id === product.id && item.unit === unit
          );

          if (existingIndex > -1) {
            const updated = [...state.posCart];
            const current = updated[existingIndex];
            const newQty = current.quantity + quantity;
            const newWeight = weightKg !== undefined ? weightKg : multiplier * newQty;
            updated[existingIndex] = {
              ...current,
              quantity: newQty,
              weightKg: newWeight
            };
            return { posCart: updated };
          }

          return {
            posCart: [
              ...state.posCart,
              { product, unit, quantity, weightKg: calcWeight }
            ]
          };
        });
      },

      updatePosCartItem: (index, quantity, weightKg) => {
        set((state) => {
          const updated = [...state.posCart];
          if (quantity <= 0) {
            updated.splice(index, 1);
          } else {
            const item = updated[index];
            const multiplier = item.product.availableUnits.find((u) => u.unit === item.unit)?.multiplier || 1.0;
            updated[index] = {
              ...item,
              quantity,
              weightKg: weightKg !== undefined ? weightKg : multiplier * quantity
            };
          }
          return { posCart: updated };
        });
      },

      removeFromPosCart: (index) => {
        set((state) => {
          const updated = [...state.posCart];
          updated.splice(index, 1);
          return { posCart: updated };
        });
      },

      clearPosCart: () => set({ posCart: [] }),

      holdCurrentPosBill: (customerName = "Walk-in Guest") => {
        const state = get();
        if (state.posCart.length === 0) return;

        const total = state.posCart.reduce((sum, item) => {
          const unitPrice = item.product.availableUnits.find(u => u.unit === item.unit)?.price || (item.product.pricePerKg * item.weightKg);
          return sum + (unitPrice * item.quantity);
        }, 0);

        const heldBill: HeldBill = {
          id: `held-${Date.now()}`,
          customerName,
          heldAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          items: state.posCart,
          total
        };

        set({
          heldBills: [heldBill, ...state.heldBills],
          posCart: []
        });

        get().addNotification("Bill Held", `Bill for ${customerName} (₹${total}) held on Counter 1.`, "info");
      },

      resumeHeldPosBill: (heldBillId) => {
        const state = get();
        const bill = state.heldBills.find(b => b.id === heldBillId);
        if (!bill) return;

        set({
          posCart: bill.items,
          heldBills: state.heldBills.filter(b => b.id !== heldBillId)
        });

        get().addNotification("Bill Resumed", `Resumed held bill for ${bill.customerName}.`, "info");
      },

      togglePosOffline: (isOffline) => {
        set({ isPosOffline: isOffline });
        if (isOffline) {
          get().addNotification("POS Offline Mode", "Simulated offline billing active. Bills queued locally.", "warning");
        } else {
          get().addNotification("POS Back Online", "Internet connection restored. Ready to sync queue.", "success");
        }
      },

      syncOfflineQueue: () => {
        const state = get();
        const count = state.offlineSyncQueue.length;
        if (count === 0) return;

        // Process queue into orders
        set({
          orders: [...state.offlineSyncQueue, ...state.orders],
          offlineSyncQueue: []
        });

        get().addNotification(
          "Sync Complete",
          `Successfully synchronized ${count} offline bill${count > 1 ? "s" : ""} with central database.`,
          "success"
        );
      },

      completePosSale: (paymentMethod, cashierName = "Riya (Counter 1)") => {
        const state = get();
        const items: OrderItem[] = state.posCart.map((cartItem) => {
          const unitPrice = cartItem.product.availableUnits.find(u => u.unit === cartItem.unit)?.price || (cartItem.product.pricePerKg * cartItem.weightKg);
          const lineTotal = unitPrice * cartItem.quantity;
          const gstAmount = cartItem.product.gstRate > 0 ? (lineTotal * cartItem.product.gstRate) / 100 : 0;
          return {
            productId: cartItem.product.id,
            productName: cartItem.product.name,
            unit: cartItem.unit,
            quantity: cartItem.quantity,
            weightKg: cartItem.weightKg,
            rate: unitPrice,
            total: lineTotal,
            gstRate: cartItem.product.gstRate,
            gstAmount
          };
        });

        const subtotal = items.reduce((acc, i) => acc + i.total, 0);
        const gstTotal = items.reduce((acc, i) => acc + i.gstAmount, 0);
        const total = subtotal + gstTotal;

        const billNumber = `P1/2627/${String(Math.floor(100100 + Math.random() * 900000)).slice(-6)}`;
        const loyaltyPointsEarned = Math.floor(total / 100);

        const newSaleOrder: Order = {
          id: `pos-${Date.now()}`,
          orderNumber: billNumber,
          channel: "In-Store POS",
          createdAt: new Date().toISOString(),
          customerName: "Counter Walk-in",
          customerPhone: "+91 98000 00000",
          items,
          subtotal,
          deliveryFee: 0,
          gstTotal,
          discount: 0,
          total,
          status: "Completed",
          paymentMethod,
          paymentStatus: "Paid",
          cashierName,
          loyaltyPointsEarned
        };

        // If offline mode, put into sync queue
        if (state.isPosOffline) {
          set({
            offlineSyncQueue: [newSaleOrder, ...state.offlineSyncQueue],
            posCart: []
          });
          get().addNotification(
            "Bill Saved Offline",
            `Bill ${billNumber} saved in offline cache. Will auto-sync when online.`,
            "warning"
          );
          return newSaleOrder;
        }

        // FIFO stock deduction from oldest batches
        const updatedBatches = [...state.batches];
        const updatedProducts = state.products.map((p) => {
          const item = items.find(i => i.productId === p.id);
          if (!item) return p;

          let remainingToDeduct = item.weightKg;
          // Deduct from batches
          for (let i = 0; i < updatedBatches.length; i++) {
            if (updatedBatches[i].productId === p.id && updatedBatches[i].remainingQuantityKg > 0) {
              const deduct = Math.min(updatedBatches[i].remainingQuantityKg, remainingToDeduct);
              updatedBatches[i] = {
                ...updatedBatches[i],
                remainingQuantityKg: updatedBatches[i].remainingQuantityKg - deduct,
                status: (updatedBatches[i].remainingQuantityKg - deduct) <= 0 ? "Depleted" : updatedBatches[i].status
              };
              remainingToDeduct -= deduct;
              if (remainingToDeduct <= 0) break;
            }
          }

          return {
            ...p,
            currentStockKg: Math.max(0, p.currentStockKg - item.weightKg)
          };
        });

        // Update shift totals
        const updatedShifts = state.shifts.map((shift) => {
          if (shift.status === "Open") {
            const cashAdd = paymentMethod === "Cash" ? total : 0;
            const upiAdd = paymentMethod === "UPI" ? total : 0;
            const cardAdd = paymentMethod === "Card" ? total : 0;
            return {
              ...shift,
              cashSales: shift.cashSales + cashAdd,
              upiSales: shift.upiSales + upiAdd,
              cardSales: shift.cardSales + cardAdd,
              totalSales: shift.totalSales + total,
              billsCount: shift.billsCount + 1
            };
          }
          return shift;
        });

        // Add GST Entry
        const nilRated = items.filter(i => i.gstRate === 0).reduce((sum, i) => sum + i.total, 0);
        const taxable = items.filter(i => i.gstRate > 0).reduce((sum, i) => sum + i.total, 0);
        const newGstEntry: GSTEntry = {
          id: `gst-${Date.now()}`,
          invoiceNumber: billNumber,
          date: new Date().toISOString().split("T")[0],
          customerName: "Counter Walk-in",
          type: taxable > 0 ? "Tax Invoice" : "Bill of Supply",
          nilRatedAmount: nilRated,
          taxableAmount: taxable,
          cgst: gstTotal / 2,
          sgst: gstTotal / 2,
          totalTax: gstTotal,
          totalInvoice: total
        };

        set({
          orders: [newSaleOrder, ...state.orders],
          batches: updatedBatches,
          products: updatedProducts,
          shifts: updatedShifts,
          gstEntries: [newGstEntry, ...state.gstEntries],
          posCart: []
        });

        get().addNotification(
          "Sale Completed",
          `Bill ${billNumber} for ₹${total} printed. Stock updated via FIFO.`,
          "success"
        );

        return newSaleOrder;
      },

      // Purchasing & Receiving
      createPurchaseOrder: (poData) => {
        const state = get();
        const poNumber = `PO-2026-${String(Math.floor(100 + Math.random() * 900))}`;
        const newPO: PurchaseOrder = {
          ...poData,
          id: `po-${Date.now()}`,
          poNumber,
          status: "Sent"
        };

        set({ purchaseOrders: [newPO, ...state.purchaseOrders] });
        get().addNotification(
          "Purchase Order Created",
          `${poNumber} sent to ${poData.supplierName} for ₹${poData.totalAmount}.`,
          "info"
        );
        return newPO;
      },

      receivePurchaseOrder: (poId, receivedBy) => {
        const state = get();
        const po = state.purchaseOrders.find(p => p.id === poId);
        if (!po) return;

        const dateStr = new Date().toISOString().split("T")[0];
        const newBatches: InventoryBatch[] = [];
        const productStockIncrements: { [key: string]: number } = {};

        po.items.forEach((item, idx) => {
          const product = state.products.find(p => p.id === item.productId);
          const shelfLife = product?.shelfLifeDays || 5;
          const expiryDateObj = new Date();
          expiryDateObj.setDate(expiryDateObj.getDate() + shelfLife);

          const batchNumber = `B-${dateStr.replace(/-/g, '').slice(2)}-${String.fromCharCode(65 + idx)}`;
          newBatches.push({
            id: `batch-${Date.now()}-${idx}`,
            batchNumber,
            productId: item.productId,
            productName: item.productName,
            receivedDate: dateStr,
            expiryDate: expiryDateObj.toISOString().split("T")[0],
            initialQuantityKg: item.quantityKg,
            remainingQuantityKg: item.quantityKg,
            costPerKg: item.ratePerKg,
            supplierName: po.supplierName,
            purchaseOrderId: po.poNumber,
            status: "Fresh"
          });

          productStockIncrements[item.productId] = (productStockIncrements[item.productId] || 0) + item.quantityKg;
        });

        const updatedProducts = state.products.map(p => {
          if (productStockIncrements[p.id]) {
            return {
              ...p,
              currentStockKg: p.currentStockKg + productStockIncrements[p.id]
            };
          }
          return p;
        });

        const updatedPO: PurchaseOrder = {
          ...po,
          status: "Received",
          receivedDetails: {
            receivedDate: dateStr,
            receivedBy,
            batchNumberCreated: newBatches.map(b => b.batchNumber).join(", "),
            receivedQuantityKg: po.items.reduce((sum, i) => sum + i.quantityKg, 0)
          }
        };

        set({
          purchaseOrders: state.purchaseOrders.map(p => p.id === poId ? updatedPO : p),
          batches: [...newBatches, ...state.batches],
          products: updatedProducts
        });

        get().addNotification(
          "Goods Received & Stock Updated",
          `${po.poNumber} received by ${receivedBy}. Generated ${newBatches.length} new batch records.`,
          "success"
        );
      },

      recordWastage: (wastage) => {
        const state = get();
        const newRecord: WastageRecord = {
          ...wastage,
          id: `wst-${Date.now()}`,
          date: new Date().toISOString().split("T")[0]
        };

        // Deduct from batch and product stock
        const updatedBatches = state.batches.map(b => {
          if (b.batchNumber === wastage.batchNumber) {
            const newQty = Math.max(0, b.remainingQuantityKg - wastage.quantityKg);
            return {
              ...b,
              remainingQuantityKg: newQty,
              status: newQty === 0 ? "Depleted" : b.status
            };
          }
          return b;
        });

        const updatedProducts = state.products.map(p => {
          if (p.id === wastage.productId) {
            return {
              ...p,
              currentStockKg: Math.max(0, p.currentStockKg - wastage.quantityKg)
            };
          }
          return p;
        });

        set({
          wastageRecords: [newRecord, ...state.wastageRecords],
          batches: updatedBatches,
          products: updatedProducts
        });

        get().addNotification(
          "Wastage Logged",
          `${wastage.quantityKg} kg ${wastage.productName} written off (${wastage.reason}). Loss: ₹${wastage.estimatedLoss}.`,
          "warning"
        );
      },

      updateStockDirectly: (productId, adjustmentKg, reason) => {
        const state = get();
        set({
          products: state.products.map(p => {
            if (p.id === productId) {
              return {
                ...p,
                currentStockKg: Math.max(0, p.currentStockKg + adjustmentKg)
              };
            }
            return p;
          })
        });

        get().addNotification(
          "Stock Adjusted",
          `Adjusted stock by ${adjustmentKg > 0 ? "+" : ""}${adjustmentKg} kg for reason: "${reason}".`,
          "info"
        );
      },

      updateOrderStatus: (orderId, status, options) => {
        const state = get();
        let riderAssignedName: string | undefined;

        if (options?.riderId) {
          const rider = state.riders.find(r => r.id === options.riderId);
          if (rider) riderAssignedName = rider.name;
        }

        const updatedOrders = state.orders.map(order => {
          if (order.id === orderId) {
            return {
              ...order,
              status,
              ...(riderAssignedName && { riderName: riderAssignedName }),
              ...(options?.actualWeightKg && { packingWeightActualKg: options.actualWeightKg }),
              ...(status === "Delivered" && order.paymentMethod === "Cash on Delivery" && { paymentStatus: "Paid" as const })
            };
          }
          return order;
        });

        set({ orders: updatedOrders });
        get().addNotification(
          "Order Status Updated",
          `Order ${orderId.slice(-6)} changed to ${status}${riderAssignedName ? ` (Rider: ${riderAssignedName})` : ""}.`,
          "info"
        );
      },

      // Follow One Crate of Tomatoes Interactive Demo Runner
      runTomatoCrateStep: (stepNumber) => {
        const state = get();
        set({ tomatoCrateStep: stepNumber });

        switch (stepNumber) {
          case 1: {
            // Step 1: Order 100 kg from Krishna Organic Collective
            const po = state.createPurchaseOrder({
              supplierId: "sup-1",
              supplierName: "Krishna Organic Collective",
              orderDate: new Date().toISOString().split("T")[0],
              expectedDate: new Date().toISOString().split("T")[0],
              items: [
                {
                  productId: "prod-tomato",
                  productName: "Organic Country Tomatoes (Desi)",
                  quantityKg: 100,
                  ratePerKg: 22,
                  total: 2200
                }
              ],
              subtotal: 2200,
              gstAmount: 0,
              totalAmount: 2200,
              notes: "Demo crate order: 100 kg Desi Tomatoes from Sangli farm."
            });
            get().addNotification("Crate Step 1 Complete", `PO #${po.poNumber} created: 100 kg Desi Tomatoes ordered @ ₹22/kg.`, "success");
            break;
          }
          case 2: {
            // Step 2: Receive goods, create batch & record cost
            const openPo = state.purchaseOrders.find(p => p.supplierName.includes("Krishna") && p.status === "Sent");
            const poId = openPo ? openPo.id : state.purchaseOrders[0]?.id;
            if (poId) {
              get().receivePurchaseOrder(poId, "Mahesh (Inventory Exec)");
            }
            get().addNotification("Crate Step 2 Complete", "Batch created: B-261031-A recorded with 5-day expiry. Stock updated.", "success");
            break;
          }
          case 3: {
            // Step 3: Print labels
            get().addNotification(
              "Crate Step 3 Complete",
              "Barcode labels generated: 'ORGANIC TOMATO 500g ₹30 / 1kg ₹60 (Batch 261031-A)'. Ready for counter & web.",
              "success"
            );
            break;
          }
          case 4: {
            // Step 4: Sell in store POS & online from same live stock
            get().addToPosCart(state.products[0], "kg", 2, 2.0);
            get().completePosSale("UPI");
            get().addNotification(
              "Crate Step 4 Complete",
              "Counter sale completed: 2 kg sold from Batch 261031-A. Live stock decremented.",
              "success"
            );
            break;
          }
          case 5: {
            // Step 5: Pack, weigh, dispatch & track
            const onlineOrder = state.orders.find(o => o.channel === "Website Online" && (o.status === "New" || o.status === "Packed"));
            if (onlineOrder) {
              get().updateOrderStatus(onlineOrder.id, "Dispatched", {
                riderId: "rider-1",
                actualWeightKg: 4.15
              });
            }
            get().addNotification(
              "Crate Step 5 Complete",
              "Online order packed, weighed (4.15 kg), dispatched via Vikram Jadhav.",
              "success"
            );
            break;
          }
          case 6: {
            // Step 6: Books, profit and wastage updated
            get().addNotification(
              "Crate Step 6 Complete",
              "All books, GST registers, P&L, and Owner Dashboard updated in real-time without re-typing!",
              "success"
            );
            break;
          }
        }
      },

      // Reset everything back to original clean demo state
      resetAllDemoData: () => {
        set({
          products: INITIAL_PRODUCTS,
          batches: INITIAL_BATCHES,
          suppliers: INITIAL_SUPPLIERS,
          purchaseOrders: INITIAL_PURCHASE_ORDERS,
          orders: INITIAL_ORDERS,
          customers: INITIAL_CUSTOMERS,
          riders: INITIAL_RIDERS,
          shifts: INITIAL_SHIFTS,
          wastageRecords: INITIAL_WASTAGE,
          gstEntries: INITIAL_GST_ENTRIES,
          customerCart: [],
          posCart: [],
          heldBills: [],
          offlineSyncQueue: [],
          isPosOffline: false,
          tomatoCrateStep: 1,
          notifications: [
            {
              id: "notif-reset",
              title: "Demo Data Reset",
              message: "All products, stock, orders and registers restored to original presentation state.",
              type: "success",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        });
      }
    }),
    {
      name: "the-farm-story-storage"
    }
  )
);
