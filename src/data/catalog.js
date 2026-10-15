// Datos tomados de estructura_db.sql del repositorio real de Cyber Reinoso.

export const CATEGORIES = {
  regular: { label: 'Regular', ratePerHour: 2, className: 'PC_Regular' },
  esports: { label: 'eSports', ratePerHour: 3, className: 'PC_eSports' },
  vip: { label: 'Streaming VIP', ratePerHour: 5, className: 'PC_StreamingVIP' },
}

export const STATUS = {
  available: 'Disponible',
  busy: 'Ocupada',
  maintenance: 'Mantenimiento',
}

export const STATIONS = [
  { code: 'PC-001', category: 'regular', cpu: 'AMD Ryzen 5 8600G', gpu: 'Radeon 760M integrada', ram: '16 GB DDR5 5200', monitor: 'MSI PRO MP243L 100 Hz FHD' },
  { code: 'PC-002', category: 'regular', cpu: 'AMD Ryzen 5 8600G', gpu: 'Radeon 760M integrada', ram: '16 GB DDR5 5200', monitor: 'MSI PRO MP243L 100 Hz FHD' },
  { code: 'PC-003', category: 'regular', cpu: 'AMD Ryzen 5 8600G', gpu: 'Radeon 760M integrada', ram: '16 GB DDR5 5200', monitor: 'MSI PRO MP243L 100 Hz FHD' },
  { code: 'PC-004', category: 'regular', cpu: 'Intel Core i3-13100F', gpu: 'NVIDIA GTX 1650 4 GB', ram: '16 GB DDR4 3200', monitor: 'MSI PRO MP243L 100 Hz FHD' },
  { code: 'PC-005', category: 'esports', cpu: 'Intel Core i5-13600KF', gpu: 'NVIDIA RTX 3060 12 GB', ram: '32 GB DDR5 6000', monitor: 'ASUS TUF VG249Q5A 165 Hz' },
  { code: 'PC-006', category: 'esports', cpu: 'Intel Core i5-13600KF', gpu: 'NVIDIA RTX 4060 8 GB', ram: '32 GB DDR5 6000', monitor: 'ASUS TUF VG249Q5A 165 Hz' },
  { code: 'PC-007', category: 'esports', cpu: 'AMD Ryzen 5 7600X', gpu: 'NVIDIA RTX 4060 Ti 8 GB', ram: '32 GB DDR5 6000', monitor: 'LG UltraGear 27G523B 200 Hz', maintenance: true },
  { code: 'PC-008', category: 'esports', cpu: 'AMD Ryzen 5 7600X', gpu: 'NVIDIA RTX 4060 Ti 8 GB', ram: '32 GB DDR5 6000', monitor: 'LG UltraGear 27G523B 200 Hz' },
  { code: 'PC-009', category: 'esports', cpu: 'Intel Core i7-14700KF', gpu: 'NVIDIA RTX 4070 Super 12 GB', ram: '32 GB DDR5 6400', monitor: 'LG UltraGear 27G523B 200 Hz' },
  { code: 'PC-010', category: 'vip', cpu: 'AMD Ryzen 7 7800X3D', gpu: 'NVIDIA RTX 4080 Super 16 GB', ram: '64 GB DDR5 6000', monitor: 'Samsung Odyssey G7 240 Hz QHD' },
  { code: 'PC-011', category: 'vip', cpu: 'AMD Ryzen 9 7950X3D', gpu: 'NVIDIA RTX 4090 24 GB', ram: '64 GB DDR5 6400', monitor: 'Samsung Odyssey OLED G8 4K', maintenance: true },
  { code: 'PC-012', category: 'vip', cpu: 'Intel Core i9-14900KS', gpu: 'NVIDIA RTX 4090 24 GB', ram: '64 GB DDR5 6400', monitor: 'Samsung Odyssey OLED G8 4K' },
]

// Gamers semilla (alias, saldo y minutos acumulados reales del script SQL).
export const GAMERS = [
  { id: 2, alias: 'Maximus_27', balance: 15.5, minutes: 120 },
  { id: 3, alias: 'Jojo', balance: 25, minutes: 1500 },
  { id: 4, alias: 'flamed4rk', balance: 40, minutes: 4500 },
  { id: 5, alias: 'Dark', balance: 120, minutes: 7200 },
  { id: 6, alias: 'Wacho', balance: 5, minutes: 45 },
  { id: 7, alias: 'mzmiguelxd', balance: 30, minutes: 2100 },
  { id: 8, alias: 'RENZX', balance: 80, minutes: 6500 },
]

// Precios y stock reales; nombres genéricos para no mostrar marcas comerciales.
export const PRODUCTS = [
  { id: 1, name: 'Barra de chocolate y galleta', size: '41.5 g', price: 2.5, stock: 20, kind: 'snack' },
  { id: 2, name: 'Tortillas sabor queso', size: '45 g', price: 3, stock: 25, kind: 'snack' },
  { id: 3, name: 'Piqueo mixto', size: '100 g', price: 2, stock: 18, kind: 'snack' },
  { id: 4, name: 'Bebida energética', size: '473 ml', price: 8, stock: 12, kind: 'drink' },
  { id: 5, name: 'Energizante clásico', size: '500 ml', price: 4.5, stock: 15, kind: 'drink' },
  { id: 6, name: 'Gaseosa cola', size: '600 ml', price: 3.5, stock: 24, kind: 'drink' },
  { id: 7, name: 'Gaseosa amarilla', size: '600 ml', price: 3.5, stock: 24, kind: 'drink' },
  { id: 8, name: 'Maní picante', size: '50 g', price: 1, stock: 15, kind: 'snack' },
  { id: 9, name: 'Refresco de naranja', size: '500 ml', price: 2.5, stock: 20, kind: 'drink' },
]
