// Comprehensive food data for CrowdFlow stadiums
const COMMON_ITEMS = [
  { id: 'i1', name: 'Classic Samosa (2pcs)', price: 60, originalPrice: 80, category: 'Snacks', isVeg: true, description: 'Hand-crafted crispy pastry filled with spiced potatoes and peas. Served with tangy tamarind chutney.' },
  { id: 'i2', name: 'Veg Puff', price: 45, originalPrice: 60, category: 'Snacks', isVeg: true, description: 'Golden flaky pastry filled with a savory mixed vegetable stuffing and mild Indian spices.' },
  { id: 'i3', name: 'Masala Chai', price: 30, originalPrice: 40, category: 'Beverages', isVeg: true, description: 'Slow-brewed traditional Indian tea infused with cardamom, ginger, and black pepper.' },
  { id: 'i4', name: 'Cold Coffee', price: 90, originalPrice: 120, category: 'Beverages', isVeg: true, description: 'Double-shot espresso blended with chilled milk and premium dark chocolate syrup.' },
  { id: 'i5', name: 'Veg Grill Sandwich', price: 120, originalPrice: 150, category: 'Meals', isVeg: true, description: 'Three-layered sandwich with fresh cucumber, tomatoes, and spicy mint chutney on buttered bread.' },
  { id: 'i6', name: 'Paneer Tikka Roll', price: 160, originalPrice: 200, category: 'Meals', isVeg: true, description: 'Clay-oven roasted paneer cubes marinated in yogurt and spices, wrapped in a soft handmade paratha.' },
  { id: 'i7', name: 'Chicken Dum Biryani', price: 280, originalPrice: 350, category: 'Meals', isVeg: false, description: 'Authentic Hyderabadi style biryani with long-grain basmati rice and slow-cooked tender chicken.' },
  { id: 'i8', name: 'Bottle Water (500ml)', price: 20, originalPrice: 25, category: 'Beverages', isVeg: true, description: 'Crystal clear chilled mineral water for instant hydration.' },
  { id: 'i9', name: 'Vada Pav (2pcs)', price: 70, originalPrice: 90, category: 'Snacks', isVeg: true, description: 'The legendary Mumbai burger - spicy deep-fried potato dumpling inside a soft pav bun with garlic chutney.' },
  { id: 'i10', name: 'French Fries', price: 100, originalPrice: 130, category: 'Snacks', isVeg: true, description: 'Perfectly salted, golden-brown crispy potato fries. Classic stadium companion.' },
  { id: 'i11', name: 'Coca Cola (330ml)', price: 50, originalPrice: 65, category: 'Beverages', isVeg: true, description: 'The classic refreshing sparkling soft drink served ice-cold.' },
  { id: 'i12', name: 'Cheese Pizza Slice', price: 140, originalPrice: 180, category: 'Meals', isVeg: true, description: 'Large sourdough pizza slice topped with premium tomato sauce and gooey melted mozzarella.' },
  { id: 'i13', name: 'Aloo Tikki Burger', price: 110, originalPrice: 140, category: 'Meals', isVeg: true, description: 'Home-style potato patty seasoned with Indian spices, topped with lettuce, onions, and creamy mayo.' },
  { id: 'i14', name: 'Gulab Jamun (2pcs)', price: 80, originalPrice: 100, category: 'Desserts', isVeg: true, description: 'Warm, soft berry-sized balls made of milk solids, soaked in rose-flavored sugar syrup.' },
  { id: 'i15', name: 'Butter Milk', price: 40, originalPrice: 50, category: 'Beverages', isVeg: true, description: 'Traditional spiced yogurt drink tempered with curry leaves, ginger, and green chilies.' },
  { id: 'i16', name: 'Chicken Popcorn', price: 180, originalPrice: 230, category: 'Snacks', isVeg: false, description: 'Crunchy, bite-sized pieces of premium chicken breast marinated in hot spices.' },
  { id: 'i17', name: 'Veg Hakka Noodles', price: 150, originalPrice: 190, category: 'Meals', isVeg: true, description: 'Indo-Chinese style stir-fried noodles with crisp julienned vegetables and a hint of soy sauce.' },
  { id: 'i18', name: 'Chocolate Brownie', price: 120, originalPrice: 160, category: 'Desserts', isVeg: true, description: 'Rich fudge brownie made with premium cocoa and loaded with roasted walnut chunks.' },
  { id: 'i19', name: 'Mango Lassi', price: 70, originalPrice: 90, category: 'Beverages', isVeg: true, description: 'Thick, creamy yogurt blend with Alphonso mango pulp. A perfect summer refresher.' },
  { id: 'i20', name: 'Chicken Club Sandwich', price: 190, originalPrice: 240, category: 'Meals', isVeg: false, description: 'Classic triple-decker with grilled chicken breast, fried egg, lettuce, and extra cheese.' },
  { id: 'i21', name: 'Nachos with Cheese', price: 130, originalPrice: 170, category: 'Snacks', isVeg: true, description: 'Crispy stone-ground corn chips served with a side of warm, gooey nacho cheese sauce.' },
];

export const FOOD_COURTS = [
  {
    id: 'f1',
    stadiumId: 'c1', // Narendra Modi Stadium
    name: 'Chennai Bites',
    location: 'Lower Tier A',
    sectionId: 'ne',
    crowd: 'Low',
    status: 'Open',
    rating: { taste: 4.5, hygiene: 4.8, service: 4.2 },
    onlineOrder: true,
    seatDelivery: true,
    avgTime: 12,
    offers: ['10% OFF on all items', 'Free Chai with Samosa'],
    items: COMMON_ITEMS.map(item => ({ ...item, available: Math.random() > 0.1 })),
    img: 'https://images.unsplash.com/photo-1563122870-6b0b48a0af09?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'f2',
    stadiumId: 'c1',
    name: 'Royal Grill',
    location: 'Reliance End',
    sectionId: 'north',
    crowd: 'High',
    status: 'Open',
    rating: { taste: 4.8, hygiene: 4.5, service: 4.0 },
    onlineOrder: true,
    seatDelivery: true,
    avgTime: 25,
    offers: ['Buy 1 Get 1 Free on Biryani'],
    items: COMMON_ITEMS.map(item => ({ ...item, available: Math.random() > 0.1 })),
    img: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'f3',
    stadiumId: 'c1',
    name: 'Stadium Snacks',
    location: 'Corporate Box East',
    sectionId: 'east',
    crowd: 'Medium',
    status: 'Open',
    rating: { taste: 4.2, hygiene: 4.7, service: 4.5 },
    onlineOrder: true,
    seatDelivery: false,
    avgTime: 8,
    offers: ['Combo: Burger + Drink at ₹199'],
    items: COMMON_ITEMS.map(item => ({ ...item, available: Math.random() > 0.1 })),
    img: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'f4',
    stadiumId: 'c1',
    name: 'Bolly Food',
    location: 'Lower Tier B',
    sectionId: 'se',
    crowd: 'Low',
    status: 'Open',
    rating: { taste: 4.3, hygiene: 4.2, service: 4.4 },
    onlineOrder: true,
    seatDelivery: true,
    avgTime: 15,
    offers: ['15% OFF for Online Orders'],
    items: COMMON_ITEMS.map(item => ({ ...item, available: Math.random() > 0.1 })),
    img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'f5',
    stadiumId: 'c1',
    name: 'Hyderabadi Tadka',
    location: 'Adani End',
    sectionId: 'south',
    crowd: 'Medium',
    status: 'Open',
    rating: { taste: 4.9, hygiene: 4.4, service: 4.1 },
    onlineOrder: true,
    seatDelivery: true,
    avgTime: 20,
    offers: ['Free Dessert on orders above ₹500'],
    items: COMMON_ITEMS.map(item => ({ ...item, available: Math.random() > 0.1 })),
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'f6',
    stadiumId: 'c1',
    name: 'Guccis Confectionery',
    location: 'Lower Tier C',
    sectionId: 'sw',
    crowd: 'Low',
    status: 'Open',
    rating: { taste: 4.6, hygiene: 4.9, service: 4.8 },
    onlineOrder: false,
    seatDelivery: false,
    avgTime: 5,
    offers: ['Special Baked Snacks'],
    items: COMMON_ITEMS.map(item => ({ ...item, available: Math.random() > 0.1 })),
    img: 'https://images.unsplash.com/photo-1559620192-0a2569502b48?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'f7',
    stadiumId: 'c1',
    name: 'Pizza Express',
    location: 'Corporate Box West',
    sectionId: 'west',
    crowd: 'High',
    status: 'Open',
    rating: { taste: 4.7, hygiene: 4.6, service: 3.9 },
    onlineOrder: true,
    seatDelivery: true,
    avgTime: 30,
    offers: ['2 Pizza Slices at ₹250'],
    items: COMMON_ITEMS.map(item => ({ ...item, available: Math.random() > 0.1 })),
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'f8',
    stadiumId: 'c1',
    name: 'Smoothie Bar',
    location: 'Gate 5 Concourse',
    sectionId: 'east',
    crowd: 'Low',
    status: 'Closed',
    rating: { taste: 4.4, hygiene: 4.8, service: 4.6 },
    onlineOrder: true,
    seatDelivery: false,
    avgTime: 10,
    offers: ['Natural Fruit Juices'],
    items: COMMON_ITEMS.map(item => ({ ...item, available: Math.random() > 0.1 })),
    img: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'f9',
    stadiumId: 'c1',
    name: 'Metro Meals',
    location: 'Gate 11 Entrance',
    sectionId: 'south',
    crowd: 'Medium',
    status: 'Open',
    rating: { taste: 4.1, hygiene: 4.3, service: 4.2 },
    onlineOrder: true,
    seatDelivery: true,
    avgTime: 18,
    offers: ['Indian Thali starting at ₹249'],
    items: COMMON_ITEMS.map(item => ({ ...item, available: Math.random() > 0.1 })),
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'f10',
    stadiumId: 'c1',
    name: 'Crispy Corner',
    location: 'Gate 14 Concourse',
    sectionId: 'west',
    crowd: 'Medium',
    status: 'Open',
    rating: { taste: 4.5, hygiene: 4.1, service: 4.3 },
    onlineOrder: true,
    seatDelivery: false,
    avgTime: 14,
    offers: ['10% OFF on Fried Snacks'],
    items: COMMON_ITEMS.map(item => ({ ...item, available: Math.random() > 0.1 })),
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80'
  }
];

// Fallback generator for other stadiums
export const getFoodCourts = (stadiumId) => {
  const specific = FOOD_COURTS.filter(f => f.stadiumId === stadiumId);
  if (specific.length > 0) return specific;

  // Generate generic 10 shops for others
  const names = ['Cafe Stadium', 'Arena Bites', 'Pitch Side', 'The Concession', 'Fast Track', 'Bowl & Bun', 'Heat Wave', 'Cool Zone', 'Victory Meals', 'Fan Favorites'];
  const locations = ['North Gate', 'South Gate', 'East Gate', 'West Gate', 'Level 1', 'Level 2', 'Ground Floor', 'VVIP Wing', 'General Wing', 'Media Center'];
  
  return names.map((name, i) => ({
    id: `${stadiumId}-f${i}`,
    stadiumId: stadiumId,
    name: name,
    location: locations[i],
    sectionId: ['north', 'south', 'east', 'west'][i % 4],
    crowd: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    status: Math.random() > 0.1 ? 'Open' : 'Closed',
    rating: { taste: 4 + Math.random(), hygiene: 4 + Math.random(), service: 4 + Math.random() },
    onlineOrder: true,
    seatDelivery: Math.random() > 0.4,
    avgTime: 10 + Math.floor(Math.random() * 20),
    offers: [`${Math.floor(Math.random() * 20 + 5)}% OFF on beverages`],
    items: COMMON_ITEMS.map(item => ({ ...item, available: Math.random() > 0.1 })),
    img: `https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&w=300&q=80`
  }));
};
