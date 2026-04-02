export const categories = [
  {
    id: 1,
    name: "Ayurvedic Care",
image: "/medicines/Categories/ayurvedic care.png",
    color: "#e8f5e9",
    accent: "#43a047",
  },
  {
    id: 2,
    name: "Diabetes",
image: "/medicines/Categories/diabetes.png",
    color: "#fce4ec",
    accent: "#e91e63",
  },
  {
    id: 3,
    name: "Explore More",
image: "/medicines/Categories/explore more.png",
    color: "#ede7f6",
    accent: "#7e57c2",
  },
  {
    id: 4,
    name: "Health Care",
image: "/medicines/Categories/health care.png",
    color: "#e3f2fd",
    accent: "#1976d2",
  },
  {
    id: 5,
    name: "Health Concern",
    image: "/src/assets/medicines/Categories/health concern.png",
    color: "#fff8e1",
    accent: "#f9a825",
  },
  {
    id: 6,
    name: "Health Food",
    image: "/src/assets/medicines/Categories/health foood.png",
    color: "#e8f5e9",
    accent: "#2e7d32",
  },
  {
    id: 7,
    name: "Heart Care",
    image: "/src/assets/medicines/Categories/heart care.png",
    color: "#fce4ec",
    accent: "#c62828",
  },
  {
    id: 8,
    name: "Mobility & Elderly",
    image: "/src/assets/medicines/Categories/Mobility and Elederly care.png",
    color: "#e8eaf6",
    accent: "#3949ab",
  },
  {
    id: 9,
    name: "Mother & Baby",
    image: "/src/assets/medicines/Categories/mother and baby.png",
    color: "#fdf3fb",
    accent: "#ab47bc",
  },
  {
    id: 10,
    name: "Sexual Wellness",
    image: "/src/assets/medicines/Categories/sexual.png",
    color: "#fff0f3",
    accent: "#f06292",
  },
  {
    id: 11,
    name: "Skin Care",
    image: "/src/assets/medicines/Categories/skin care.png",
    color: "#fffde7",
    accent: "#f57f17",
  },
  {
    id: 12,
    name: "Sports Nutrition",
    image: "/src/assets/medicines/Categories/sports nutrition.png",
    color: "#e0f7fa",
    accent: "#00838f",
  },
  {
    id: 13,
    name: "Vitamin Store",
    image: "/src/assets/medicines/Categories/vitamin store.png",
    color: "#fffde7",
    accent: "#f9a825",
  },
];

export const sampleMedicines = [

  // ── Ayurvedic Care ──
  { medicine_id: 1,  name: "Ashwagandha Capsules",     brand: "Dabur",           price: 210, mrp: 280, category: "Ayurvedic Care",   stock: 95,  image: "/src/assets/medicines/Ayurvedic/1.png", discount: 25 },
  { medicine_id: 2,  name: "Triphala Churna",           brand: "Baidyanath",      price: 120, mrp: 160, category: "Ayurvedic Care",   stock: 65,  image: "/src/assets/medicines/Ayurvedic/2.png", discount: 25 },
  { medicine_id: 3,  name: "Chyawanprash",              brand: "Dabur",           price: 260, mrp: 320, category: "Ayurvedic Care",   stock: 80,  image: "/src/assets/medicines/Ayurvedic/3.png", discount: 19 },
  { medicine_id: 4,  name: "Giloy Tablets",             brand: "Patanjali",       price: 90,  mrp: 120, category: "Ayurvedic Care",   stock: 110, image: "/src/assets/medicines/Ayurvedic/4.png", discount: 25 },
  { medicine_id: 5,  name: "Brahmi Capsules",           brand: "Himalaya",        price: 175, mrp: 220, category: "Ayurvedic Care",   stock: 70,  image: "/src/assets/medicines/Ayurvedic/5.png", discount: 20 },
  { medicine_id: 6,  name: "Shatavari Powder",          brand: "Organic India",   price: 299, mrp: 380, category: "Ayurvedic Care",   stock: 55,  image: "/src/assets/medicines/Ayurvedic/6.png", discount: 21 },

  // ── Diabetes ──
  { medicine_id: 7,  name: "Metformin 500mg",           brand: "Glycomet",        price: 35,  mrp: 48,  category: "Diabetes",         stock: 90, image: "/src/assets/medicines/diabeties/1.png" , discount: 27 },
  { medicine_id: 8,  name: "Glimepiride 1mg",           brand: "Amaryl",          price: 145, mrp: 185, category: "Diabetes",         stock: 75,  image: "/src/assets/medicines/diabeties/2.png" , discount: 22 },
  { medicine_id: 9,  name: "Insulin Glargine Pen",      brand: "Lantus",          price: 865, mrp: 980, category: "Diabetes",         stock: 40,  image: "/src/assets/medicines/diabeties/3.png" , discount: 12 },
  { medicine_id: 10, name: "Januvia 100mg",             brand: "MSD",             price: 420, mrp: 530, category: "Diabetes",         stock: 50,  image: "/src/assets/medicines/diabeties/4.png" , discount: 21 },
  { medicine_id: 11, name: "Glucometer Strips (50)",    brand: "Accu-Chek",       price: 699, mrp: 850, category: "Diabetes",         stock: 60,  image: "/src/assets/medicines/diabeties/5.png" , discount: 18 },
  { medicine_id: 12, name: "Karela Jamun Juice",        brand: "Patanjali",       price: 130, mrp: 160, category: "Diabetes",         stock: 100, image: "/src/assets/medicines/diabeties/6.png" , discount: 19 },

  // ── Explore More ──
  { medicine_id: 13, name: "Digital Thermometer",       brand: "Dr. Morepen",     price: 199, mrp: 260, category: "Explore More",     stock: 73,  image: "/src/assets/medicines/explore/1.png", discount: 23 },
  { medicine_id: 14, name: "BP Monitor",                brand: "Omron",           price: 1299,mrp: 1699,category: "Explore More",     stock: 35,  image: "/src/assets/medicines/explore/2.png", discount: 24 },
  { medicine_id: 15, name: "Pulse Oximeter",            brand: "Dr. Trust",       price: 899, mrp: 1199,category: "Explore More",     stock: 48,  image: "/src/assets/medicines/explore/3.png", discount: 25 },
  { medicine_id: 16, name: "Nebulizer Machine",         brand: "Philips",         price: 2199,mrp: 2799,category: "Explore More",     stock: 22,  image: "/src/assets/medicines/explore/4.png", discount: 21 },
  { medicine_id: 17, name: "Glucometer Device",         brand: "Accu-Chek",       price: 999, mrp: 1299,category: "Explore More",     stock: 40,  image: "/src/assets/medicines/explore/5.png", discount: 23 },
  { medicine_id: 18, name: "Heating Pad",               brand: "Medtech",         price: 549, mrp: 699, category: "Explore More",     stock: 60,  image: "/src/assets/medicines/explore/6.png", discount: 21 },

  // ── Health Care ──
  { medicine_id: 19, name: "Paracetamol 500mg",         brand: "Crocin",          price: 30,  mrp: 42,  category: "Health Care",      stock: 100, image: "/src/assets/medicines/healthconcern/7.png", discount: 29 },
  { medicine_id: 20, name: "Azithromycin 500mg",        brand: "Azee",            price: 85,  mrp: 110, category: "Health Care",      stock: 50,  image: "/src/assets/medicines/healthconcern/8.png", discount: 23 },
  { medicine_id: 21, name: "ORS Powder",                brand: "Electral",        price: 22,  mrp: 30,  category: "Health Care",      stock: 140, image: "/src/assets/medicines/healthconcern/9.png", discount: 27 },
  { medicine_id: 22, name: "Pain Relief Spray",         brand: "Moov",            price: 160, mrp: 199, category: "Health Care",      stock: 78,  image: "/src/assets/medicines/healthconcern/10.png", discount: 20 },
  { medicine_id: 23, name: "Amoxicillin 500mg",         brand: "Mox",             price: 95,  mrp: 125, category: "Health Care",      stock: 85,  image: "/src/assets/medicines/healthconcern/11.png", discount: 24 },
  { medicine_id: 24, name: "Ibuprofen 400mg",           brand: "Brufen",          price: 28,  mrp: 38,  category: "Health Care",      stock: 120, image: "/src/assets/medicines/healthconcern/12.png", discount: 26 },

  // ── Health Concern ──
{ medicine_id: 25, name: "Cetirizine 10mg",     brand: "Alerid",          price: 25,  mrp: 32,  category: "Health Concern", stock: 80,  image: "/src/assets/medicines/healthconcern/1.png", discount: 22 },
{ medicine_id: 26, name: "Digene Gel",           brand: "Abbott",          price: 118, mrp: 145, category: "Health Concern", stock: 84,  image: "/src/assets/medicines/healthconcern/2.png", discount: 19 },
{ medicine_id: 27, name: "Omeprazole 20mg",      brand: "Omez",            price: 55,  mrp: 72,  category: "Health Concern", stock: 95,  image: "/src/assets/medicines/healthconcern/3.png", discount: 24 },
{ medicine_id: 28, name: "Loperamide 2mg",       brand: "Lopamide",        price: 40,  mrp: 55,  category: "Health Concern", stock: 70,  image: "/src/assets/medicines/healthconcern/4.png", discount: 27 },
{ medicine_id: 29, name: "Vicks VapoRub",        brand: "Vicks",           price: 89,  mrp: 115, category: "Health Concern", stock: 110, image: "/src/assets/medicines/healthconcern/5.png", discount: 23 },
{ medicine_id: 30, name: "Lactulose Syrup",      brand: "Duphalac",        price: 145, mrp: 185, category: "Health Concern", stock: 60,  image: "/src/assets/medicines/healthconcern/6.png", discount: 22 },

  // ── Health Food ──
  { medicine_id: 31, name: "Protein Oats",              brand: "Saffola",         price: 249, mrp: 320, category: "Health Food",      stock: 52,  image: "/src/assets/medicines/Ayurvedic/7.png", discount: 22 },
  { medicine_id: 32, name: "Flaxseed Powder",           brand: "True Elements",   price: 199, mrp: 260, category: "Health Food",      stock: 75,  image: "/src/assets/medicines/Ayurvedic/8.png", discount: 23 },
  { medicine_id: 33, name: "Chia Seeds 250g",           brand: "Neuherbs",        price: 249, mrp: 320, category: "Health Food",      stock: 68,  image: "/src/assets/medicines/Ayurvedic/9.png", discount: 22 },
  { medicine_id: 34, name: "Apple Cider Vinegar",       brand: "WOW",             price: 299, mrp: 399, category: "Health Food",      stock: 90,  image: "/src/assets/medicines/Ayurvedic/10.png", discount: 25 },
  { medicine_id: 35, name: "Moringa Powder",            brand: "Organic India",   price: 320, mrp: 420, category: "Health Food",      stock: 45,  image: "/src/assets/medicines/Ayurvedic/11.png", discount: 24 },
  { medicine_id: 36, name: "Honey Raw 500g",            brand: "Dabur",           price: 220, mrp: 285, category: "Health Food",      stock: 100, image: "/src/assets/medicines/Ayurvedic/12.png", discount: 23 },

  // ── Heart Care ──
  { medicine_id: 37, name: "Amlodipine 5mg",            brand: "Amlong",          price: 40,  mrp: 55,  category: "Heart Care",       stock: 70, image: "/src/assets/medicines/diabeties/7.png" , discount: 27 },
  { medicine_id: 38, name: "Omega-3 Fish Oil",          brand: "Carbamide Forte", price: 499, mrp: 650, category: "Heart Care",       stock: 58, image: "/src/assets/medicines/diabeties/8.png" , discount: 23 },
  { medicine_id: 39, name: "Atorvastatin 10mg",         brand: "Atorva",          price: 85,  mrp: 110, category: "Heart Care",       stock: 80, image: "/src/assets/medicines/diabeties/9.png" , discount: 23 },
  { medicine_id: 40, name: "Aspirin 75mg",              brand: "Ecosprin",        price: 22,  mrp: 30,  category: "Heart Care",       stock: 130,image: "/src/assets/medicines/diabeties/10.png" , discount: 27 },
  { medicine_id: 41, name: "Clopidogrel 75mg",          brand: "Clopivas",        price: 95,  mrp: 125, category: "Heart Care",       stock: 65, image: "/src/assets/medicines/diabeties/11.png" , discount: 24 },
  { medicine_id: 42, name: "Coenzyme Q10 100mg",        brand: "Healthvit",       price: 599, mrp: 780, category: "Heart Care",       stock: 42, image: "/src/assets/medicines/healthconcern/1.png" , discount: 23 },

  // ── Mobility & Elderly ──
  { medicine_id: 43, name: "Calcium + D3 Tablets",      brand: "Shelcal",         price: 132, mrp: 170, category: "Mobility & Elderly", stock: 66, image: "/src/assets/medicines/mobility and elder care/1.png", discount: 22 },
  { medicine_id: 44, name: "Glucosamine 1500mg",        brand: "Osteofit",        price: 420, mrp: 550, category: "Mobility & Elderly", stock: 48, image: "/src/assets/medicines/mobility and elder care/2.png", discount: 24 },
  { medicine_id: 45, name: "Diclofenac Gel",            brand: "Voveran",         price: 75,  mrp: 99,  category: "Mobility & Elderly", stock: 90, image: "/src/assets/medicines/mobility and elder care/3.png", discount: 24 },
  { medicine_id: 46, name: "Walking Stick Foldable",    brand: "Vissco",          price: 549, mrp: 699, category: "Mobility & Elderly", stock: 30, image: "/src/assets/medicines/mobility and elder care/4.png", discount: 21 },
  { medicine_id: 47, name: "Knee Support Brace",        brand: "Tynor",           price: 399, mrp: 520, category: "Mobility & Elderly", stock: 55, image: "/src/assets/medicines/mobility and elder care/5.png", discount: 23 },
  { medicine_id: 48, name: "Vitamin D3 60K",            brand: "Calcirol",        price: 180, mrp: 240, category: "Mobility & Elderly", stock: 75, image: "/src/assets/medicines/mobility and elder care/6.png", discount: 25 },

  // ── Mother & Baby ──
  { medicine_id: 49, name: "Baby Diaper Pants (M)",     brand: "Pampers",         price: 399, mrp: 499, category: "Mother & Baby",    stock: 88,  image: "/src/assets/medicines/personal care/1.png", discount: 20 },
  { medicine_id: 50, name: "Folic Acid 5mg",            brand: "Folvite",         price: 45,  mrp: 60,  category: "Mother & Baby",    stock: 100, image: "/src/assets/medicines/personal care/2.png", discount: 25 },
  { medicine_id: 51, name: "Baby Massage Oil",          brand: "Johnson's",       price: 185, mrp: 240, category: "Mother & Baby",    stock: 95,  image: "/src/assets/medicines/personal care/3.png", discount: 23 },
  { medicine_id: 52, name: "Iron + Folic Syrup",        brand: "Feronia",         price: 95,  mrp: 125, category: "Mother & Baby",    stock: 70, image: "/src/assets/medicines/personal care/4.png", discount: 24 },
  { medicine_id: 53, name: "Baby Powder 200g",          brand: "Johnson's",       price: 155, mrp: 199, category: "Mother & Baby",    stock: 80,  image: "/src/assets/medicines/personal care/5.png", discount: 22 },
  { medicine_id: 54, name: "Prenatal Vitamins",         brand: "Pregnacare",      price: 699, mrp: 899, category: "Mother & Baby",    stock: 45,  image: "/src/assets/medicines/personal care/6.png", discount: 22 },

  // ── Sexual Wellness ──
  { medicine_id: 55, name: "Condoms Pack (10)",         brand: "Durex",           price: 180, mrp: 240, category: "Sexual Wellness",  stock: 130, image: "/src/assets/medicines/wellness/1.png", discount: 25 },
  { medicine_id: 56, name: "i-Pill Emergency",          brand: "Cipla",           price: 95,  mrp: 125, category: "Sexual Wellness",  stock: 60,  image: "/src/assets/medicines/wellness/2.png", discount: 24 },
  { medicine_id: 57, name: "Lubricant Gel",             brand: "Durex",           price: 220, mrp: 280, category: "Sexual Wellness",  stock: 75,  image: "/src/assets/medicines/wellness/3.png", discount: 21 },
  { medicine_id: 58, name: "Pregnancy Test Kit",        brand: "Prega News",      price: 55,  mrp: 75,  category: "Sexual Wellness",  stock: 110, image: "/src/assets/medicines/wellness/4.png", discount: 27 },
  { medicine_id: 59, name: "Female Condoms (3)",        brand: "Moods",           price: 150, mrp: 199, category: "Sexual Wellness",  stock: 55,  image: "/src/assets/medicines/wellness/5.png", discount: 25 },
  { medicine_id: 60, name: "Testosterone Booster",      brand: "Boldfit",         price: 599, mrp: 799, category: "Sexual Wellness",  stock: 40,  image: "/src/assets/medicines/wellness/6.png", discount: 25 },

  // ── Skin Care ──
  { medicine_id: 61, name: "Neem Face Wash",            brand: "Himalaya",        price: 85,  mrp: 105, category: "Skin Care",        stock: 100, image: "/src/assets/medicines/skin care/1.png" , discount: 19 },
  { medicine_id: 62, name: "SPF 50 Sunscreen",          brand: "Neutrogena",      price: 499, mrp: 620, category: "Skin Care",        stock: 54,  image: "/src/assets/medicines/skin care/2.png" , discount: 20 },
  { medicine_id: 63, name: "Moisturizer Cream",         brand: "Cetaphil",        price: 399, mrp: 499, category: "Skin Care",        stock: 72,  image: "/src/assets/medicines/skin care/3.png" , discount: 20 },
  { medicine_id: 64, name: "Acne Gel",                  brand: "Benzac",          price: 155, mrp: 199, category: "Skin Care",        stock: 65,  image: "/src/assets/medicines/skin care/4.png" , discount: 22 },
  { medicine_id: 65, name: "Aloe Vera Gel 200ml",       brand: "WOW",             price: 179, mrp: 230, category: "Skin Care",        stock: 90,  image: "/src/assets/medicines/skin care/5.png", discount: 22 },
  { medicine_id: 66, name: "Anti-Dandruff Shampoo",     brand: "Head & Shoulders",price: 299, mrp: 380, category: "Skin Care",        stock: 80,  image: "/src/assets/medicines/skin care/6.png", discount: 21 },

  // ── Sports Nutrition ──
  { medicine_id: 67, name: "Whey Protein 1kg",          brand: "MuscleBlaze",     price: 2199,mrp: 2799,category: "Sports Nutrition", stock: 44, image: "/src/assets/medicines/sports/1.png", discount: 21 },
  { medicine_id: 68, name: "BCAA Powder 250g",          brand: "AS-IT-IS",        price: 799, mrp: 1050,category: "Sports Nutrition", stock: 38,  image: "/src/assets/medicines/sports/2.png", discount: 24 },
  { medicine_id: 69, name: "Creatine Monohydrate",      brand: "Optimum Nutrition",price: 1299,mrp:1699, category: "Sports Nutrition", stock: 32,   image: "/src/assets/medicines/sports/3.png", discount: 23 },
  { medicine_id: 70, name: "Energy Bar (Pack of 6)",    brand: "RiteBite",        price: 299, mrp: 390, category: "Sports Nutrition", stock: 75,   image: "/src/assets/medicines/sports/4.png", discount: 23 },
  { medicine_id: 71, name: "Electrolyte Drink Mix",     brand: "Fast&Up",         price: 349, mrp: 450, category: "Sports Nutrition", stock: 60,   image: "/src/assets/medicines/sports/5.png", discount: 22 },
  { medicine_id: 72, name: "Mass Gainer 1kg",           brand: "MuscleBlaze",     price: 899, mrp: 1199,category: "Sports Nutrition", stock: 40,   image: "/src/assets/medicines/sports/6.png", discount: 25 },

  // ── Vitamin Store ──
  { medicine_id: 73, name: "Vitamin C 500mg",           brand: "Limcee",          price: 55,  mrp: 70,  category: "Vitamin Store",    stock: 120, image: "/src/assets/medicines/vitamin/1.png", discount: 21 },
  { medicine_id: 74, name: "Biotin 10mg",               brand: "HealthVit",       price: 299, mrp: 380, category: "Vitamin Store",    stock: 60,   image: "/src/assets/medicines/vitamin/2.png", discount: 21 },
  { medicine_id: 75, name: "Vitamin B12 Tablets",       brand: "Mecobal",         price: 165, mrp: 210, category: "Vitamin Store",    stock: 92,   image: "/src/assets/medicines/vitamin/3.png", discount: 21 },
  { medicine_id: 76, name: "Vitamin D3 2000IU",         brand: "HealthKart",      price: 349, mrp: 450, category: "Vitamin Store",    stock: 85,   image: "/src/assets/medicines/vitamin/4.png", discount: 22 },
  { medicine_id: 77, name: "Multivitamin Daily",        brand: "Centrum",         price: 599, mrp: 780, category: "Vitamin Store",    stock: 70,   image: "/src/assets/medicines/vitamin/5.png", discount: 23 },
  { medicine_id: 78, name: "Zinc + Vitamin C",          brand: "Zincovit",        price: 135, mrp: 175, category: "Vitamin Store",    stock: 95,   image: "/src/assets/medicines/vitamin/6.png", discount: 23 },
];