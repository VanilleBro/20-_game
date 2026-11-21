// Spieldaten: 10 Essen mit je 18 Items.
// Item-Format: "Name|Emoji|Punkte|Farbe"  (Punkte sind die geheime Jury-Bewertung, Farbe für Schicht-Ansicht)
// combos: [[Item, Item, (Item)], Bonus, "Name"]
window.FOODS = [
  {
    id: "burger", name: "Burger", emoji: "🍔", style: "stack", top: "bun", bottom: "bun",
    items: [
      "Rindfleisch-Patty|🥩|5|#7b3f1d", "Cheddar|🧀|4|#f5b700", "Salat|🥬|3|#4caf50",
      "Tomate|🍅|3|#e53935", "Bacon|🥓|4|#c0392b", "Röstzwiebeln|🧅|3|#c98b3c",
      "Gewürzgurken|🥒|2|#6b8e23", "Spiegelei|🍳|3|#ffe082", "Jalapeños|🌶️|2|#2e7d32",
      "Avocado|🥑|3|#9ccc65", "BBQ-Sauce|🍖|3|#5d2a14", "Ketchup|🥫|2|#d32f2f",
      "Pilze|🍄|2|#a1887f", "Ananas|🍍|0|#fdd835", "Erdnussbutter|🥜|-1|#c68642",
      "Gummibärchen|🐻|-3|#ff5c9d", "Schokolade|🍫|-2|#4e342e", "Knoblauchmayo|🧄|2|#fff4dc"
    ],
    combos: [
      [["Rindfleisch-Patty", "Cheddar"], 3, "Cheeseburger-Basis"],
      [["Bacon", "BBQ-Sauce"], 2, "BBQ-Bacon"],
      [["Salat", "Tomate"], 2, "Knackig frisch"],
      [["Avocado", "Jalapeños"], 1, "Mexican Style"],
      [["Ananas", "Bacon"], 2, "Hawaii-Burger"]
    ]
  },
  {
    id: "pizza", name: "Pizza", emoji: "🍕", style: "plate",
    items: [
      "Mozzarella|🧀|5", "Tomatensoße|🍅|4", "Salami|🥩|4", "Schinken|🍖|3",
      "Champignons|🍄|3", "Paprika|🫑|3", "Oliven|🫒|2", "Basilikum|🌿|3",
      "Zwiebeln|🧅|2", "Peperoni|🌶️|2", "Mais|🌽|1", "Thunfisch|🐟|1",
      "Rucola|🥬|2", "Knoblauch|🧄|2", "Ananas|🍍|0", "Ei|🥚|0",
      "Banane|🍌|-2", "Gummiwürmer|🪱|-3"
    ],
    combos: [
      [["Mozzarella", "Tomatensoße"], 3, "Margherita"],
      [["Mozzarella", "Basilikum"], 1, "Italienisch"],
      [["Schinken", "Ananas"], 2, "Hawaii"],
      [["Thunfisch", "Zwiebeln"], 2, "Tonno"],
      [["Salami", "Peperoni"], 2, "Diavolo"]
    ]
  },
  {
    id: "hotdog", name: "Hot Dog", emoji: "🌭", style: "plate",
    items: [
      "Bratwurst|🌭|5", "Senf|🟡|3", "Ketchup|🥫|3", "Röstzwiebeln|🧅|3",
      "Gurkenrelish|🥒|3", "Sauerkraut|🥬|2", "Käsesoße|🧀|3", "Bacon|🥓|3",
      "Jalapeños|🌶️|2", "Chili con Carne|🫘|3", "Krautsalat|🥗|2", "Tomaten|🍅|2",
      "Mayo|🥚|1", "Currypulver|🍛|2", "Popcorn|🍿|-1", "Marshmallows|🍡|-2",
      "Erdbeermarmelade|🍓|-2", "Zuckerwatte|🍭|-3"
    ],
    combos: [
      [["Senf", "Ketchup"], 2, "Klassiker"],
      [["Röstzwiebeln", "Gurkenrelish"], 2, "Dänischer Hot Dog"],
      [["Chili con Carne", "Käsesoße"], 2, "Chili-Cheese"],
      [["Bratwurst", "Sauerkraut"], 2, "Deutsch"],
      [["Bratwurst", "Currypulver"], 2, "Currywurst-Vibes"]
    ]
  },
  {
    id: "tacos", name: "Tacos", emoji: "🌮", style: "plate",
    items: [
      "Hackfleisch|🥩|5", "Hähnchen|🍗|4", "Guacamole|🥑|4", "Salsa|🍅|3",
      "Sauerrahm|🥛|3", "Cheddar|🧀|3", "Eisbergsalat|🥬|2", "Schwarze Bohnen|🫘|3",
      "Mais|🌽|2", "Jalapeños|🌶️|2", "Koriander|🌿|2", "Limette|🍋|2",
      "Rote Zwiebeln|🧅|2", "Paprika|🫑|2", "Reis|🍚|1", "Fischstäbchen|🐟|-1",
      "Kaugummi|🍬|-3", "Ketchup|🥫|-1"
    ],
    combos: [
      [["Guacamole", "Salsa"], 2, "Dip-Duo"],
      [["Hackfleisch", "Cheddar"], 2, "Tex-Mex"],
      [["Koriander", "Limette"], 2, "Street-Taco"],
      [["Sauerrahm", "Jalapeños"], 1, "Feuer & Eis"],
      [["Schwarze Bohnen", "Reis"], 1, "Burrito-Füllung"]
    ]
  },
  {
    id: "doener", name: "Döner", emoji: "🥙", style: "plate",
    items: [
      "Kalbfleisch|🥩|5", "Hähnchen|🍗|4", "Knoblauchsoße|🧄|4", "Kräutersoße|🌿|3",
      "Scharfe Soße|🌶️|3", "Rotkohl|🟣|2", "Weißkraut|🥬|2", "Tomaten|🍅|2",
      "Gurken|🥒|2", "Zwiebeln|🧅|2", "Schafskäse|🧀|3", "Salat|🥗|2",
      "Pommes|🍟|2", "Peperoni|🫑|2", "Mais|🌽|0", "Ananas|🍍|-1",
      "Nutella|🍫|-3", "Gummibärchen|🐻|-3"
    ],
    combos: [
      [["Kalbfleisch", "Knoblauchsoße"], 2, "Berliner Original"],
      [["Zwiebeln", "Scharfe Soße"], 1, "Mit alles und scharf"],
      [["Schafskäse", "Tomaten"], 1, "Mediterran"],
      [["Rotkohl", "Weißkraut"], 1, "Kraut-Kombi"],
      [["Hähnchen", "Pommes"], 2, "Dürüm-Deluxe"]
    ]
  },
  {
    id: "sushi", name: "Sushi", emoji: "🍣", style: "plate",
    items: [
      "Lachs|🍣|5", "Thunfisch|🐟|5", "Avocado|🥑|3", "Gurke|🥒|2",
      "Garnele|🍤|4", "Frischkäse|🧀|3", "Sesam|🌾|2", "Wasabi|🟢|2",
      "Ingwer|🫚|2", "Sojasoße|🍶|3", "Fischrogen|🟠|3", "Aal|🐍|3",
      "Mango|🥭|1", "Tempura|🍘|2", "Nori|🍙|3", "Ketchup|🥫|-2",
      "Bratwurst|🌭|-2", "Gummibärchen|🐻|-3"
    ],
    combos: [
      [["Lachs", "Frischkäse"], 2, "Philadelphia-Roll"],
      [["Avocado", "Gurke"], 1, "California-Roll"],
      [["Wasabi", "Sojasoße"], 2, "Perfekter Dip"],
      [["Lachs", "Avocado"], 1, "Lachs-Avo"],
      [["Garnele", "Tempura"], 2, "Ebi-Tempura"]
    ]
  },
  {
    id: "pancakes", name: "Pancakes", emoji: "🥞", style: "stack", top: "pancake", bottom: "plate",
    items: [
      "Ahornsirup|🍁|5|#b5651d", "Butter|🧈|3|#ffe48a", "Blaubeeren|🫐|4|#3f51b5",
      "Erdbeeren|🍓|4|#e91e63", "Banane|🍌|3|#ffeb3b", "Schlagsahne|🍦|3|#fff8f0",
      "Nutella|🍫|4|#5d4037", "Puderzucker|❄️|2|#f5f5f5", "Bacon|🥓|2|#c0392b",
      "Honig|🍯|3|#f9a825", "Zimt|🟤|2|#8d5524", "Nüsse|🥜|2|#c68642",
      "Kokos|🥥|1|#efebe9", "Kiwi|🥝|1|#8bc34a", "Senf|🟡|-2|#fbc02d",
      "Gurken|🥒|-2|#558b2f", "Thunfisch|🐟|-3|#90a4ae", "Zwiebeln|🧅|-3|#d7ccc8"
    ],
    combos: [
      [["Bacon", "Ahornsirup"], 3, "American Style"],
      [["Banane", "Nutella"], 2, "Schoko-Banane"],
      [["Erdbeeren", "Schlagsahne"], 2, "Erdbeer-Traum"],
      [["Butter", "Ahornsirup"], 1, "Diner-Klassiker"],
      [["Honig", "Nüsse"], 1, "Knusper-Honig"]
    ]
  },
  {
    id: "eis", name: "Eisbecher", emoji: "🍨", style: "stack", top: "none", bottom: "cup",
    items: [
      "Vanilleeis|🍦|4|#fff3c4", "Schokoeis|🍫|4|#6d4c41", "Erdbeereis|🍓|4|#f48fb1",
      "Schlagsahne|☁️|3|#ffffff", "Schokosoße|🟫|3|#3e2723", "Karamell|🍯|3|#d4880f",
      "Streusel|🌈|2|#ce93d8", "Kirsche|🍒|2|#c62828", "Waffel|🧇|3|#e0a85a",
      "Keks|🍪|3|#a1683a", "Nüsse|🥜|2|#c68642", "Banane|🍌|2|#fff176",
      "Mango|🥭|2|#ffb300", "Marshmallows|🍡|2|#f8bbd0", "Ketchup|🥫|-3|#d32f2f",
      "Essiggurke|🥒|-3|#558b2f", "Knoblauch|🧄|-3|#f5f0e6", "Pommes|🍟|-1|#fbc02d"
    ],
    combos: [
      [["Vanilleeis", "Schokosoße"], 2, "Coupe Dänemark"],
      [["Schlagsahne", "Kirsche"], 2, "Sahnehäubchen"],
      [["Banane", "Vanilleeis"], 2, "Bananensplit"],
      [["Karamell", "Nüsse"], 1, "Krokant"],
      [["Vanilleeis", "Pommes"], 2, "McFlurry-Hack"]
    ]
  },
  {
    id: "sandwich", name: "Sandwich", emoji: "🥪", style: "stack", top: "toast", bottom: "toast",
    items: [
      "Schinken|🍖|4|#f48fb1", "Käse|🧀|4|#ffca28", "Salat|🥬|2|#66bb6a",
      "Tomate|🍅|2|#e53935", "Gurke|🥒|2|#7cb342", "Ei|🥚|2|#fff59d",
      "Truthahn|🦃|4|#d7a27a", "Thunfischcreme|🐟|3|#cfd8dc", "Mayo|🫙|2|#fffde7",
      "Senf|🟡|2|#fbc02d", "Avocado|🥑|3|#9ccc65", "Bacon|🥓|4|#c0392b",
      "Mozzarella|⚪|3|#fafafa", "Pesto|🌿|3|#558b2f", "Rote Bete|🟣|0|#8e244d",
      "Erdnussbutter|🥜|1|#c68642", "Marmelade|🍓|-1|#ad1457", "Gummibärchen|🐻|-3|#ff5c9d"
    ],
    combos: [
      [["Bacon", "Salat", "Tomate"], 4, "BLT"],
      [["Schinken", "Käse"], 2, "Klassiker"],
      [["Mozzarella", "Tomate", "Pesto"], 3, "Caprese"],
      [["Truthahn", "Avocado"], 1, "Club-Style"],
      [["Erdnussbutter", "Marmelade"], 3, "PB&J"]
    ]
  },
  {
    id: "pasta", name: "Pasta", emoji: "🍝", style: "plate",
    items: [
      "Tomatensoße|🍅|4", "Hackfleisch|🥩|5", "Parmesan|🧀|4", "Basilikum|🌿|3",
      "Knoblauch|🧄|3", "Pesto|🟢|3", "Sahne|🥛|3", "Speck|🥓|4",
      "Ei|🥚|2", "Pilze|🍄|3", "Garnelen|🍤|3", "Spinat|🥬|2",
      "Olivenöl|🫒|2", "Chili|🌶️|2", "Brokkoli|🥦|1", "Ketchup|🥫|-1",
      "Zimtzucker|🍬|-2", "Erdbeerjoghurt|🍓|-3"
    ],
    combos: [
      [["Speck", "Ei", "Parmesan"], 3, "Carbonara"],
      [["Hackfleisch", "Tomatensoße"], 2, "Bolognese"],
      [["Knoblauch", "Olivenöl", "Chili"], 3, "Aglio e Olio"],
      [["Pesto", "Parmesan"], 1, "Genovese"],
      [["Sahne", "Pilze"], 2, "Funghi-Sahne"]
    ]
  }
];

// Items in Objekte umwandeln
(function () {
  function hashHue(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; }
  for (const f of window.FOODS) {
    f.items = f.items.map((str, i) => {
      const [name, emoji, score, color] = str.split("|");
      return { id: i, name, emoji, score: Number(score), color: color || `hsl(${hashHue(name)},70%,55%)` };
    });
  }
})();
