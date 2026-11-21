// Spieldaten: 10 Essen mit je 18 Items.
// Item-Format: "Name|Emoji|Punkte|Farbe|Bild|Darstellung"
//   Punkte      = geheime Jury-Bewertung
//   Bild        = Foto in img/ing/<Bild>.webp (leer = gezeichnete Vorschau)
//   Darstellung = wie die Zutat auf dem Essen liegt:
//     p (echtes Foto), sauce, melt (Käse), dots, kernels, dollop, crumble, chunks,
//     slices, rings, shreds, scoop (Eiskugel), patty, egg (Spiegelei), sprinkles
// combos: [[Item, Item, (Item)], Bonus, "Name"]
window.FOODS = [
  {
    id: "burger", name: "Burger", emoji: "🍔", scene: "burger",
    items: [
      "Rindfleisch-Patty|🥩|5|#5e3219|ground_beef|patty", "Cheddar|🧀|4|#f2a20c|cheddar|melt",
      "Eisbergsalat|🥬|3|#8cc84b|iceberg_lettuce|p", "Tomate|🍅|3|#e0352a|tomato|slices",
      "Bacon|🥓|4|#b8432f|bacon|p", "Rote Zwiebeln|🧅|2|#a64476|red_onion|rings",
      "Gewürzgurken|🥒|2|#7a9a3a|pickles|slices", "Jalapeños|🌶️|2|#3f8f2f|jalapeno|p",
      "Avocado|🥑|3|#9cc75a|avocado|p", "BBQ-Sauce|🍖|3|#5a2412|bbq|sauce",
      "Ketchup|🥫|2|#c8102e|ketchup|sauce", "Champignons|🍄|2|#c9b49a|mushroom|p",
      "Ananas|🍍|0|#f7d330|pineapple|rings", "Erdnussbutter|🥜|-1|#b5793a|peanut_butter|sauce",
      "Schokoriegel|🍫|-2|#4a2b17|mars|chunks", "Oreos|🍪|-3|#2a2522|oreo|p",
      "Mayo|🫙|2|#fff3d6|mayo|sauce", "Spiegelei|🍳|3|#ffffff||egg"
    ],
    combos: [
      [["Rindfleisch-Patty", "Cheddar"], 3, "Cheeseburger"],
      [["Bacon", "BBQ-Sauce"], 2, "BBQ-Bacon"],
      [["Eisbergsalat", "Tomate"], 2, "Knackig frisch"],
      [["Avocado", "Jalapeños"], 1, "Mexican Style"],
      [["Ananas", "Bacon"], 2, "Hawaii-Burger"],
      [["Rindfleisch-Patty", "Spiegelei"], 1, "Strammer Burger"]
    ]
  },
  {
    id: "pizza", name: "Pizza", emoji: "🍕", scene: "pizza",
    items: [
      "Mozzarella|🧀|5|#fffaf0|mozzarella|melt", "Tomatensoße|🍅|4|#c4301c|tomato_sauce|sauce",
      "Salami|🍕|4|#b0302a|salami|slices", "Schinken|🍖|3|#e89a95|ham|p",
      "Champignons|🍄|3|#c9b49a|mushroom|p", "Paprika|🫑|3|#e0332a|peppers|shreds",
      "Oliven|🫒|2|#2b2730|olives|rings", "Basilikum|🌿|3|#3f8f2f|basil|p",
      "Rote Zwiebeln|🧅|2|#a64476|red_onion|rings", "Peperoni|🌶️|2|#d22|chilli|p",
      "Mais|🌽|1|#f7c31b|corn|kernels", "Thunfisch|🐟|1|#c9a48a|tuna|crumble",
      "Rucola|🥬|2|#4c8a2a|rocket|p", "Knoblauch|🧄|2|#f3ead6|garlic|p",
      "Ananas|🍍|0|#f7d330|pineapple|chunks", "Spiegelei|🍳|0|#ffffff||egg",
      "Banane|🍌|-2|#f3e39a|banana|slices", "Marshmallows|🍡|-3|#fde7ef|marshmallows|chunks"
    ],
    combos: [
      [["Mozzarella", "Tomatensoße"], 3, "Margherita"],
      [["Mozzarella", "Basilikum"], 1, "Italienisch"],
      [["Schinken", "Ananas"], 2, "Hawaii"],
      [["Thunfisch", "Rote Zwiebeln"], 2, "Tonno"],
      [["Salami", "Peperoni"], 2, "Diavolo"]
    ]
  },
  {
    id: "hotdog", name: "Hot Dog", emoji: "🌭", scene: "hotdog",
    items: [
      "Senf|🟡|3|#e8b100|mustard|sauce", "Ketchup|🥫|3|#c8102e|ketchup|sauce",
      "Röstzwiebeln|🧅|3|#c27a2c|chopped_onion|crumble", "Gurkenrelish|🥒|3|#6b9a2a|relish|crumble",
      "Sauerkraut|🥬|2|#e7dca0|sauerkraut|shreds", "Käsesoße|🧀|3|#f5a300|liquid_cheese|sauce",
      "Bacon|🥓|3|#b8432f|bacon|p", "Jalapeños|🌶️|2|#3f8f2f|jalapeno|p",
      "Chili-Bohnen|🫘|3|#7a1f12|kidney_beans|chunks", "Krautsalat|🥗|2|#f1efcf|cabbage|shreds",
      "Cocktailtomaten|🍅|2|#d93a2a|cherry_tomatoes|p", "Mayo|🫙|1|#fff3d6|mayo|sauce",
      "Currypulver|🍛|2|#d98a1c|curry|dots", "Gurkenscheiben|🥒|2|#7cb342|cucumber|p",
      "Popcorn|🍿|-1|#fff1c4|popcorn|chunks", "Marshmallows|🍡|-2|#fde7ef|marshmallows|chunks",
      "Marmelade|🍓|-2|#a8123a|jam|sauce", "Schokodrops|🍫|-3|#3b2314|choc_chips|kernels"
    ],
    combos: [
      [["Senf", "Ketchup"], 2, "Klassiker"],
      [["Röstzwiebeln", "Gurkenrelish"], 2, "Dänischer Hot Dog"],
      [["Chili-Bohnen", "Käsesoße"], 2, "Chili-Cheese"],
      [["Sauerkraut", "Senf"], 2, "Deutsch"],
      [["Currypulver", "Ketchup"], 2, "Currywurst-Vibes"]
    ]
  },
  {
    id: "tacos", name: "Tacos", emoji: "🌮", scene: "taco",
    items: [
      "Hackfleisch|🥩|5|#6e3b1e|ground_beef|crumble", "Hähnchen|🍗|4|#d9a35a|chicken|chunks",
      "Guacamole|🥑|4|#86b33f|avocado|dollop", "Salsa|🍅|3|#c8321e|salsa|crumble",
      "Sauerrahm|🥛|3|#fbf8ef|sour_cream|dollop", "Cheddar|🧀|3|#f5a800|cheddar|shreds",
      "Eisbergsalat|🥬|2|#8cc84b|iceberg_lettuce|shreds", "Schwarze Bohnen|🫘|3|#2a2020|black_beans|chunks",
      "Mais|🌽|2|#f7c31b|corn|kernels", "Jalapeños|🌶️|2|#3f8f2f|jalapeno|p",
      "Koriander|🌿|2|#3f8f2f|coriander|p", "Limette|🍋|2|#8bc34a|lime|p",
      "Rote Zwiebeln|🧅|2|#a64476|red_onion|shreds", "Paprika|🫑|2|#f2b705|yellow_pepper|shreds",
      "Reis|🍚|1|#fbfaf2|rice|kernels", "Fischfilet|🐟|1|#f1e6dc|fish|chunks",
      "Oreos|🍪|-3|#2a2522|oreo|p", "Ketchup|🥫|-1|#c8102e|ketchup|sauce"
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
    id: "doener", name: "Döner", emoji: "🥙", scene: "doener",
    items: [
      "Kalbfleisch|🥩|5|#8a4a22|doner|shreds", "Hähnchen|🍗|4|#d4a256|chicken|shreds",
      "Knoblauchsoße|🧄|4|#fbf6ea|garlic_sauce|sauce", "Kräutersoße|🌿|3|#d5e3b5|parsley|sauce",
      "Scharfe Soße|🌶️|3|#d12a12|hot_sauce|sauce", "Rotkohl|🟣|2|#7b2a6b|red_cabbage|shreds",
      "Weißkraut|🥬|2|#eeeac6|cabbage|shreds", "Tomaten|🍅|2|#df3b2b|tomato|slices",
      "Gurken|🥒|2|#7cb342|cucumber|p", "Zwiebeln|🧅|2|#f2ead8|onion|rings",
      "Schafskäse|🧀|3|#fbfbf3|feta|crumble", "Salat|🥗|2|#8cc84b|iceberg_lettuce|shreds",
      "Pommes|🍟|2|#f2c14e|fries|p", "Peperoni|🫑|2|#5a9a2a|green_chili|p",
      "Mais|🌽|0|#f7c31b|corn|kernels", "Ananas|🍍|-1|#f7d330|pineapple|chunks",
      "Nutella|🍫|-3|#4a2a17|chocolate_spread|sauce", "Marshmallows|🍡|-3|#fde7ef|marshmallows|chunks"
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
    id: "sushi", name: "Sushi", emoji: "🍣", scene: "sushi",
    items: [
      "Lachs|🍣|5|#f08a5d|salmon|p", "Thunfisch|🐟|5|#b5323a|tuna_steak|p",
      "Avocado|🥑|3|#9cc75a|avocado|p", "Gurke|🥒|2|#7cb342|cucumber|p",
      "Garnele|🍤|4|#f4845f|shrimp|p", "Frischkäse|🧀|3|#fffdf6|cream_cheese|dollop",
      "Sesam|🌾|2|#f3e3b5|sesame|dots", "Wasabi|🟢|2|#8fbf3a||dollop",
      "Ingwer|🫚|2|#f4a7a7|ginger|shreds", "Sojasoße|🍶|3|#3b1d0e|soy|sauce",
      "Mango|🥭|1|#ffb300|mango|chunks", "Krabbenfleisch|🦀|3|#f3c2b3|crab|shreds",
      "Tintenfisch|🦑|2|#f3efe6|squid|rings", "Frühlingszwiebeln|🧅|2|#7cb342|spring_onion|rings",
      "Tamago (Ei)|🥚|2|#ffd54f|egg|chunks", "Ketchup|🥫|-2|#c8102e|ketchup|sauce",
      "Bratwurst|🌭|-2|#a0522d|sausage|slices", "Oreos|🍪|-3|#2a2522|oreo|p"
    ],
    combos: [
      [["Lachs", "Frischkäse"], 2, "Philadelphia-Roll"],
      [["Avocado", "Gurke"], 1, "California-Roll"],
      [["Wasabi", "Sojasoße"], 2, "Perfekter Dip"],
      [["Lachs", "Avocado"], 1, "Lachs-Avo"],
      [["Krabbenfleisch", "Gurke"], 1, "Kani-Roll"]
    ]
  },
  {
    id: "pancakes", name: "Pancakes", emoji: "🥞", scene: "pancakes",
    items: [
      "Ahornsirup|🍁|5|#9a4d15|maple|sauce", "Butter|🧈|3|#ffe27a|butter|chunks",
      "Blaubeeren|🫐|4|#3f51b5|blueberries|p", "Erdbeeren|🍓|4|#e91e63|strawberries|p",
      "Banane|🍌|3|#f3e39a|banana|slices", "Schlagsahne|🍦|3|#ffffff|whipped_cream|dollop",
      "Nutella|🍫|4|#4a2a17|chocolate_spread|sauce", "Puderzucker|❄️|2|#ffffff|icing_sugar|dots",
      "Bacon|🥓|2|#b8432f|bacon|p", "Honig|🍯|3|#f2a516|honey|sauce",
      "Zimt|🟤|2|#8d5524|cinnamon|dots", "Walnüsse|🥜|2|#b07a45|walnuts|p",
      "Kokosraspeln|🥥|1|#fbf7ef|coconut|dots", "Kiwi|🥝|1|#8bc34a|kiwi|p",
      "Senf|🟡|-2|#e8b100|mustard|sauce", "Gewürzgurken|🥒|-2|#7a9a3a|pickles|slices",
      "Thunfisch|🐟|-3|#c9a48a|tuna|crumble", "Zwiebeln|🧅|-3|#f0e6cf|onion|rings"
    ],
    combos: [
      [["Bacon", "Ahornsirup"], 3, "American Style"],
      [["Banane", "Nutella"], 2, "Schoko-Banane"],
      [["Erdbeeren", "Schlagsahne"], 2, "Erdbeer-Traum"],
      [["Butter", "Ahornsirup"], 1, "Diner-Klassiker"],
      [["Honig", "Walnüsse"], 1, "Knusper-Honig"]
    ]
  },
  {
    id: "eis", name: "Eisbecher", emoji: "🍨", scene: "sundae",
    items: [
      "Vanilleeis|🍦|4|#fff0bf|ice_cream|scoop", "Schokoeis|🍫|4|#6d4127||scoop",
      "Erdbeereis|🍓|4|#f6a3bf||scoop", "Schlagsahne|☁️|3|#ffffff|whipped_cream|dollop",
      "Schokosoße|🟫|3|#3b1d0e|choc_sauce|sauce", "Karamell|🍯|3|#d4880f|caramel|sauce",
      "Streusel|🌈|2|#ce93d8||sprinkles", "Kirsche|🍒|2|#c62828|cherry|p",
      "Oreos|🍪|3|#2a2522|oreo|p", "Kekskrümel|🍪|3|#c9945a|cookie|crumble",
      "Haselnüsse|🌰|2|#a0683a|hazelnuts|p", "Banane|🍌|2|#f3e39a|banana|slices",
      "Mango|🥭|2|#ffb300|mango|chunks", "Marshmallows|🍡|2|#fde7ef|marshmallows|chunks",
      "Ketchup|🥫|-3|#c8102e|ketchup|sauce", "Essiggurke|🥒|-3|#7a9a3a|pickles|slices",
      "Knoblauch|🧄|-3|#f3ead6|garlic|p", "Pommes|🍟|-1|#f2c14e|fries|p"
    ],
    combos: [
      [["Vanilleeis", "Schokosoße"], 2, "Coupe Dänemark"],
      [["Schlagsahne", "Kirsche"], 2, "Sahnehäubchen"],
      [["Banane", "Vanilleeis"], 2, "Bananensplit"],
      [["Karamell", "Haselnüsse"], 1, "Krokant"],
      [["Vanilleeis", "Pommes"], 2, "McFlurry-Hack"]
    ]
  },
  {
    id: "sandwich", name: "Sandwich", emoji: "🥪", scene: "sandwich",
    items: [
      "Schinken|🍖|4|#e89a95|ham|p", "Käse|🧀|4|#ffd54f|swiss_cheese|melt",
      "Salat|🥬|2|#8cc84b|iceberg_lettuce|p", "Tomate|🍅|2|#e0352a|tomato|slices",
      "Gurke|🥒|2|#7cb342|cucumber|p", "Spiegelei|🍳|2|#ffffff||egg",
      "Truthahn|🦃|4|#e6c7a4|turkey|slices", "Thunfischcreme|🐟|3|#d8c0a8|tuna|crumble",
      "Mayo|🫙|2|#fff3d6|mayo|sauce", "Senf|🟡|2|#e8b100|mustard|sauce",
      "Avocado|🥑|3|#9cc75a|avocado|p", "Bacon|🥓|4|#b8432f|bacon|p",
      "Mozzarella|⚪|3|#fbfbf3|mozzarella|slices", "Pesto|🌿|3|#4f7a28|basil|sauce",
      "Rote Bete|🟣|0|#8e244d|beetroot|slices", "Erdnussbutter|🥜|1|#b5793a|peanut_butter|sauce",
      "Marmelade|🍓|-1|#a8123a|jam|sauce", "Schokoriegel|🍫|-3|#4a2b17|mars|chunks"
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
    id: "pasta", name: "Pasta", emoji: "🍝", scene: "pasta",
    items: [
      "Tomatensoße|🍅|4|#c4301c|tomato_sauce|sauce", "Hackfleisch-Ragù|🥩|5|#7a3b20|ground_beef|crumble",
      "Parmesan|🧀|4|#fff4cf|parmesan|dots", "Basilikum|🌿|3|#3f8f2f|basil|p",
      "Knoblauch|🧄|3|#f3ead6|garlic|p", "Pesto|🟢|3|#4f7a28|basil|sauce",
      "Sahne|🥛|3|#fbf6ea|cream|sauce", "Speck|🥓|4|#e07a6a|bacon|crumble",
      "Spiegelei|🍳|2|#ffffff||egg", "Champignons|🍄|3|#c9b49a|mushroom|p",
      "Garnelen|🍤|3|#f4845f|shrimp|p", "Spinat|🥬|2|#2e6b2a|spinach|p",
      "Olivenöl|🫒|2|#c9b438|olive_oil|sauce", "Chili|🌶️|2|#d22|chilli|p",
      "Brokkoli|🥦|1|#4c8a2a|broccoli|p", "Ketchup|🥫|-1|#c8102e|ketchup|sauce",
      "Zimtzucker|🍬|-2|#a0662f|cinnamon|dots", "Erdbeerjoghurt|🍓|-3|#f6a3bf|strawberry_yogurt|dollop"
    ],
    combos: [
      [["Speck", "Spiegelei", "Parmesan"], 3, "Carbonara"],
      [["Hackfleisch-Ragù", "Tomatensoße"], 2, "Bolognese"],
      [["Knoblauch", "Olivenöl", "Chili"], 3, "Aglio e Olio"],
      [["Pesto", "Parmesan"], 1, "Genovese"],
      [["Sahne", "Champignons"], 2, "Funghi-Sahne"]
    ]
  }
];

// Items in Objekte umwandeln
(function () {
  for (const f of window.FOODS) {
    f.items = f.items.map((str, i) => {
      const [name, emoji, score, color, img, look] = str.split("|");
      return { id: i, name, emoji, score: Number(score), color, img: img || null, look: look || "p" };
    });
  }
})();
