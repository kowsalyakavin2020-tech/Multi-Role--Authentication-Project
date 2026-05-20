// Supplier Dashboard Stats
export const statsData = [
  {
    id: 1,
    title: "Total Products",
    value: "124",
    icon: "📦",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Overall Stock",
    value: "3,240 units",
    icon: "🏭",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Pending Vendor Requests",
    value: "8",
    icon: "🕐",
    color: "bg-yellow-500",
  },
  {
    id: 4,
    title: "Recent Activity",
    value: "5 Today",
    icon: "📈",
    color: "bg-purple-500",
  },
];

// Products Data
export const productsData = [
  {
    id: 1,
    image: "https://via.placeholder.com/50",
    name: "Wireless Mouse",
    category: "Electronics",
    stock: 150,
    price: "₹599",
    status: "Active",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/50",
    name: "USB Hub",
    category: "Electronics",
    stock: 0,
    price: "₹899",
    status: "Out of Stock",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/50",
    name: "Desk Lamp",
    category: "Furniture",
    stock: 45,
    price: "₹1,299",
    status: "Active",
  },
  {
    id: 4,
    image: "https://via.placeholder.com/50",
    name: "Keyboard",
    category: "Electronics",
    stock: 80,
    price: "₹1,499",
    status: "Active",
  },
  {
    id: 5,
    image: "https://via.placeholder.com/50",
    name: "Monitor Stand",
    category: "Furniture",
    stock: 0,
    price: "₹2,199",
    status: "Out of Stock",
  },
];

// Vendor Requests Data
export const vendorRequestsData = [
  {
    id: 1,
    vendorName: "Ravi Traders",
    product: "Wireless Mouse",
    quantity: 50,
    date: "2026-05-18",
    status: "Pending",
  },
  {
    id: 2,
    vendorName: "Kumar Enterprises",
    product: "USB Hub",
    quantity: 30,
    date: "2026-05-17",
    status: "Pending",
  },
  {
    id: 3,
    vendorName: "Sri Stores",
    product: "Desk Lamp",
    quantity: 20,
    date: "2026-05-16",
    status: "Approved",
  },
];

// Recent Activity Data
export const recentActivityData = [
  { id: 1, action: "New vendor request from Ravi Traders", time: "2 hrs ago" },
  { id: 2, action: "Product 'USB Hub' stock updated", time: "5 hrs ago" },
  { id: 3, action: "Vendor request approved for Sri Stores", time: "1 day ago" },
  { id: 4, action: "New product 'Keyboard' added", time: "2 days ago" },
];