export const CATEGORY_MAPPING: Record<string, string[]> = {
    "Vivienda": ["Hipoteca", "Alquiler", "Luz", "Agua", "Gas", "Internet", "Mantenimiento", "Comunidad", "Otros"],
    "Alimentación": ["Supermercado", "Restaurantes", "Comida Rápida", "Cafetería", "Otros"],
    "Transporte": ["Gasolina", "Transporte Público", "Taxi/Uber", "Mantenimiento", "Seguro", "Parking", "Otros"],
    "Servicios": ["Móvil", "Streaming", "Software", "Gimnasio", "Suscripciones", "Otros"],
    "Ocio": ["Cine", "Teatro", "Conciertos", "Videojuegos", "Hobbies", "Viajes", "Deportes", "Otros"],
    "Salud": ["Farmacia", "Médico", "Dentista", "Seguro Salud", "Gimnasio", "Psicólogo", "Otros"],
    "Educación": ["Libros", "Cursos", "Matrícula", "Material Escolar", "Clases Particulares", "Otros"],
    "Ropa": ["Ropa", "Calzado", "Accesorios", "Otros"],
    "Ahorro": ["Fondo Emergencia", "Inversión", "Jubilación", "Hucha", "Otros"],
    "Deudas": ["Préstamo", "Tarjeta Crédito", "Hipoteca", "Coche", "Otros"],
    "Otros": ["Regalos", "Donaciones", "Imprevistos", "Otros"]
};

export const CATEGORY_COLORS: Record<string, string> = {
    "Vivienda": "bg-blue-500",
    "Alimentación": "bg-green-500",
    "Transporte": "bg-yellow-500",
    "Servicios": "bg-purple-500",
    "Ocio": "bg-pink-500",
    "Salud": "bg-red-500",
    "Educación": "bg-indigo-500",
    "Ropa": "bg-orange-500",
    "Ahorro": "bg-teal-500",
    "Deudas": "bg-cyan-500",
    "Otros": "bg-gray-500"
};

export const PREDEFINED_CATEGORIES = Object.keys(CATEGORY_MAPPING);
