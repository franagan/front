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

export const PREDEFINED_CATEGORIES = Object.keys(CATEGORY_MAPPING);
