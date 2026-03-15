export const LEVELS = [
    {
        name: "Counting Garden",
        width: 1500,
        skyColor: "#87CEEB",
        groundColor: "#7CFC00",
        friction: 1,
        gravityScale: 1,
        dialogue: "collect 3 apples to open the gate!",
        learningFact: "Apples are yummy and full of vitamins! 🍎",
        apples: [{ x: 400, y: -100 }, { x: 800, y: -50 }, { x: 1200, y: -150 }],
        puddles: [{ x: 300, width: 60 }],
        gates: [{ x: 1300, y: -100, required: 3 }]
    },
    {
        name: "Color Woods",
        width: 2000,
        skyColor: "#6495ED",
        groundColor: "#228B22",
        friction: 0.9,
        gravityScale: 1,
        dialogue: "find the PINK flower and bring it to the basket!",
        learningFact: "Flowers use sunlight to make their own food! 🌸",
        teddies: [{ x: 1500, y: -100 }],
        flowers: [{ x: 400, y: -50, color: '#FFC0CB' }, { x: 900, y: -50, color: '#87CEEB' }],
        baskets: [{ x: 1300, y: -40, color: '#FFC0CB' }],
        gates: [{ x: 1450, y: -100, required: 1 }], // Basket full = 1
        platforms: [{ x: 600, y: -100, w: 200 }],
        umbrellas: [{ x: 300, y: -150 }]
    },
    {
        name: "Snowy Peak",
        width: 2500,
        skyColor: "#B0C4DE",
        groundColor: "#FFFFFF",
        friction: 1.1,
        gravityScale: 1,
        dialogue: "be careful, the ice is slippery!",
        learningFact: "Snow is actually clear, not white! ❄️",
        teddies: [{ x: 2200, y: -100 }],
        puddles: [{ x: 800, width: 300 }],
        platforms: [
            { x: 500, y: -100, w: 100, shape: 'square' },
            { x: 800, y: -150, w: 100, shape: 'circle' }
        ],
        trampolines: [{ x: 1200, y: -20 }]
    },
    {
        name: "Space Adventure",
        width: 3000,
        skyColor: "#000033",
        groundColor: "#666666",
        friction: 1,
        gravityScale: 0.3,
        dialogue: "look how high we can jump in space!",
        learningFact: "Space is very quiet because there is no air! 👨‍🚀",
        teddies: [{ x: 2500, y: -400 }],
        platforms: [{ x: 400, y: -200, w: 200 }, { x: 1000, y: -400, w: 200 }]
    }
];
