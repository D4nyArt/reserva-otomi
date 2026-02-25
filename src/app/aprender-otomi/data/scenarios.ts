export interface ScenarioElement {
    id: string;
    otomiWord: string;
    spanishWord: string;
    emoji: string; // Placeholder — will be replaced by image path later
    imageUrl?: string; // Optional uploaded image URL
    position: { x: number; y: number }; // Percentage-based positioning
}

export interface Scenario {
    id: string;
    title: string;
    subtitle: string;
    bgGradient: string; // CSS gradient for placeholder background
    bgEmoji: string; // Decorative emoji for the scene vibe
    elements: ScenarioElement[];
}

export const scenarios: Scenario[] = [
    {
        id: "familia",
        title: "Ra Ngu",
        subtitle: "La Familia",
        bgGradient: "linear-gradient(180deg, #87CEEB 0%, #F5DEB3 60%, #8B7355 100%)",
        bgEmoji: "🏠",
        elements: [
            {
                id: "padre",
                otomiWord: "Ra Dada",
                spanishWord: "Papá",
                emoji: "👨",
                position: { x: 15, y: 35 },
            },
            {
                id: "madre",
                otomiWord: "Ra Nänä",
                spanishWord: "Mamá",
                emoji: "👩",
                position: { x: 30, y: 35 },
            },
            {
                id: "hijo",
                otomiWord: "Ra T'u",
                spanishWord: "Hijo",
                emoji: "👦",
                position: { x: 50, y: 50 },
            },
            {
                id: "hija",
                otomiWord: "Ra Ntxutsi",
                spanishWord: "Hija",
                emoji: "👧",
                position: { x: 65, y: 50 },
            },
            {
                id: "abuelo",
                otomiWord: "Ra Xitä",
                spanishWord: "Abuelo",
                emoji: "👴",
                position: { x: 80, y: 30 },
            },
            {
                id: "abuela",
                otomiWord: "Ra Mexu",
                spanishWord: "Abuela",
                emoji: "👵",
                position: { x: 75, y: 55 },
            },
            {
                id: "bebe",
                otomiWord: "Ra T'olo Bätsi",
                spanishWord: "Bebé",
                emoji: "👶",
                position: { x: 42, y: 65 },
            },
            {
                id: "casa",
                otomiWord: "Ra Ngu",
                spanishWord: "Casa",
                emoji: "🏡",
                position: { x: 50, y: 12 },
            },
        ],
    },
    {
        id: "bosque",
        title: "Ra S'aye",
        subtitle: "El Bosque",
        bgGradient: "linear-gradient(180deg, #4A7C59 0%, #2D5016 40%, #1A3A0A 100%)",
        bgEmoji: "🌲",
        elements: [
            {
                id: "arbol",
                otomiWord: "Ra Za",
                spanishWord: "Árbol",
                emoji: "🌳",
                position: { x: 10, y: 25 },
            },
            {
                id: "flor",
                otomiWord: "Ra Doni",
                spanishWord: "Flor",
                emoji: "🌸",
                position: { x: 25, y: 65 },
            },
            {
                id: "pajaro",
                otomiWord: "Ra Ts'int'u",
                spanishWord: "Pájaro",
                emoji: "🐦",
                position: { x: 35, y: 20 },
            },
            {
                id: "conejo",
                otomiWord: "Ra K'uhu",
                spanishWord: "Conejo",
                emoji: "🐇",
                position: { x: 55, y: 60 },
            },
            {
                id: "venado",
                otomiWord: "Ra Phani",
                spanishWord: "Venado",
                emoji: "🦌",
                position: { x: 70, y: 40 },
            },
            {
                id: "agua",
                otomiWord: "Ra Dehe",
                spanishWord: "Agua",
                emoji: "💧",
                position: { x: 85, y: 55 },
            },
            {
                id: "piedra",
                otomiWord: "Ra Do",
                spanishWord: "Piedra",
                emoji: "🪨",
                position: { x: 45, y: 75 },
            },
            {
                id: "mariposa",
                otomiWord: "Ra Piruni",
                spanishWord: "Mariposa",
                emoji: "🦋",
                position: { x: 60, y: 15 },
            },
        ],
    },
    {
        id: "ciudad",
        title: "Ra Dängo Hnini",
        subtitle: "La Ciudad",
        bgGradient: "linear-gradient(180deg, #6B7B8D 0%, #A8B5C2 40%, #D4D4D4 100%)",
        bgEmoji: "🏙️",
        elements: [
            {
                id: "carro",
                otomiWord: "Ra Karro",
                spanishWord: "Carro",
                emoji: "🚗",
                position: { x: 20, y: 65 },
            },
            {
                id: "escuela",
                otomiWord: "Ra Ngu Mfädi",
                spanishWord: "Escuela",
                emoji: "🏫",
                position: { x: 50, y: 20 },
            },
            {
                id: "tienda",
                otomiWord: "Ra Tienda",
                spanishWord: "Tienda",
                emoji: "🏪",
                position: { x: 80, y: 25 },
            },
            {
                id: "persona",
                otomiWord: "Ra Jä'i",
                spanishWord: "Persona",
                emoji: "🧑",
                position: { x: 40, y: 50 },
            },
            {
                id: "perro",
                otomiWord: "Ra Yo",
                spanishWord: "Perro",
                emoji: "🐕",
                position: { x: 65, y: 60 },
            },
            {
                id: "sol",
                otomiWord: "Ra Hyadi",
                spanishWord: "Sol",
                emoji: "☀️",
                position: { x: 85, y: 8 },
            },
            {
                id: "mercado",
                otomiWord: "Ra Nthäi",
                spanishWord: "Mercado",
                emoji: "🏬",
                position: { x: 15, y: 30 },
            },
            {
                id: "comida",
                otomiWord: "Ra Tsidi",
                spanishWord: "Comida",
                emoji: "🍲",
                position: { x: 55, y: 75 },
            },
        ],
    },
];
