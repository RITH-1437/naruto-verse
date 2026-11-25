/* ==========================================================================
   SHINOBI CHRONICLES — WORLD DATA
   --------------------------------------------------------------------------
   Everything the app renders lives here. Add a character by adding one object
   to CHARACTERS and (optionally) links to LINKS / BIJUU.jinchuriki.
   Coordinate system: SVG user units. `gen` is the generational row.
   ========================================================================== */

const WORLD = {
  meta: {
    title: "Shinobi Chronicles",
    subtitle: "The Naruto-Verse Lineage & Bijuu Scroll",
    canvas: { width: 4500, height: 2000 },
    rowY: { 0: 110, 1: 300, 2: 490, 3: 680, 4: 870, 5: 1060, 6: 1250, 7: 1440, 8: 1630, 9: 1850 }
  },

  eras: [
    { id: "all", label: "All Eras" },
    { id: "origin", label: "Origin / Warring States" },
    { id: "naruto", label: "Naruto (Part I)" },
    { id: "shippuden", label: "Shippuden" },
    { id: "boruto", label: "Boruto" }
  ],

  clans: [
    { id: "all", label: "All Clans" },
    { id: "Ōtsutsuki", label: "Ōtsutsuki" },
    { id: "Uchiha", label: "Uchiha" },
    { id: "Senju", label: "Senju" },
    { id: "Uzumaki", label: "Uzumaki" },
    { id: "Hyūga", label: "Hyūga" },
    { id: "Other", label: "Other / None" },
    { id: "Akatsuki", label: "Akatsuki (group)" }
  ],

  /* Organisations that behave like an extra clan filter. Members keep their
     real clan in `clan:`; these ids only drive the group filter and badges. */
  groups: {
    Akatsuki: ["nagato", "konan", "yahiko", "obito", "itachi", "kisame",
      "sasori", "deidara", "hidan", "kakuzu", "zetsu"]
  },

  auraColors: {
    gold: "#C9922B",
    purple: "#7B3B6B",
    cyan: "#3E86A0",
    none: "#6B5B45"
  },

  natures: {
    Wind: "#5E9A93", Fire: "#C0563A", Water: "#4A78A8", Earth: "#8A6A46",
    Lightning: "#C79A2E", "Yin-Yang": "#7A5A9C", Sage: "#6B8E4E",
    "Space-Time": "#9B4C6E", "All": "#8C6F3F", Weapon: "#5A5A66"
  },

  /* Each character: id, name, jp, clan, era[], title, aura, gen, x, y,
     bio, jutsu[[name, nature, type]], bijuu[] */
  characters: [
    {
      id: "kaguya", name: "Kaguya Ōtsutsuki", jp: "大筒木 かぐや", clan: "Ōtsutsuki",
      era: ["origin"], title: "Progenitor of Chakra", aura: "purple", gen: 0, x: 1350, y: 110,
      image: "", // a direct image URL (ending in .png / .jpg / .webp) or a local path like "characters/kaguya.png"
      bio: "The rabbit-eared celestial who planted the God Tree on Earth. Mother of Hagoromo and Hamura, and the origin of all chakra in the ninja world.",
      jutsu: [
        ["All-Killing Ash Bones", "All", "Kekkei Mōra", "videos/kaguya/kaguya.mp4"],
        ["Dimension Shift", "Space-Time", "Kekkei Mōra", "videos/kaguya/kaguya-demension.mp4"],   // 4th entry = skill clip (optional)
        ["Eternal Tsukuyomi", "Yin-Yang", "Genjutsu", "videos/kaguya/kaguya-tsukuyomi.mp4"]
      ], bijuu: []
    },
    {
      id: "hagoromo", name: "Hagoromo Ōtsutsuki", jp: "六道仙人", clan: "Ōtsutsuki",
      era: ["origin"], title: "Sage of the Six Paths", aura: "gold", gen: 1, x: 1050, y: 300,
      image: "characters/hogorumu.webp",
      bio: "Eldest son of Kaguya. He defeated the Ten-Tails, became the first Jinchūriki, and divided its chakra into the nine Bijuu. He founded the ninja way of harmony.",
      jutsu: [["Creation of All Things", "Yin-Yang", "Kekkei Mōra"], ["Six Paths Senjutsu", "Sage", "Senjutsu"], ["Tailed Beast Ball", "All", "Bijuu"]], bijuu: []
    },
    {
      id: "hamura", name: "Hamura Ōtsutsuki", jp: "大筒木 ハムラ", clan: "Ōtsutsuki",
      era: ["origin"], title: "Progenitor of the Moon Line", aura: "cyan", gen: 1, x: 1850, y: 300,
      bio: "Younger son of Kaguya. With Hagoromo he sealed the Ten-Tails, then watched over the moon. His descendants became the Ōtsutsuki Moon Branch and the Hyūga.",
      jutsu: [["Tenseigan", "All", "Kekkei Mōra"], ["Silver Wheel", "All", "Kekkei Mōra"]], bijuu: []
    },
    {
      id: "indra", name: "Indra Ōtsutsuki", jp: "因陀羅", clan: "Ōtsutsuki",
      era: ["origin"], title: "Progenitor of the Uchiha", aura: "purple", gen: 2, x: 650, y: 490,
      bio: "Eldest son of the Sage. Believed strength came from individual power and conflict; his chakra reincarnates through the Uchiha.",
      jutsu: [["Susanoo", "All", "Kekkei Genkai"], ["Amaterasu", "Fire", "Kekkei Genkai"]], bijuu: []
    },
    {
      id: "asura", name: "Ashura Ōtsutsuki", jp: "阿修羅", clan: "Ōtsutsuki",
      era: ["origin"], title: "Progenitor of Senju & Uzumaki", aura: "gold", gen: 2, x: 1400, y: 490,
      image: "characters/ashura.webp",
      bio: "Younger son of the Sage. Chose love, cooperation and peace. His chakra reincarnates through Hashirama and Naruto.",
      jutsu: [["Wood Release", "Yin-Yang", "Kekkei Genkai"], ["Six Paths Sage Chakra", "Sage", "Senjutsu"]], bijuu: []
    },
    {
      id: "moon_main", name: "Moon Main Branch", jp: "月の本家", clan: "Ōtsutsuki",
      era: ["origin"], title: "Ōtsutsuki of the Moon", aura: "cyan", gen: 2, x: 1750, y: 490,
      image: "characters/moon main.webp",
      bio: "The principal hereditary line of Hamura's clan, guardians of the moon realm and the Tenseigen.",
      jutsu: [["Tenseigen Chakra", "All", "Kekkei Mōra"]], bijuu: []
    },
    {
      id: "moon_side", name: "Moon Side Branch", jp: "月の分家", clan: "Ōtsutsuki",
      era: ["origin"], title: "Ōtsutsuki cadet line", aura: "cyan", gen: 2, x: 2000, y: 490,
      image: "characters/moon side.webp",
      bio: "The cadet branch of Hamura's line. From this line would eventually emerge Toneri.",
      jutsu: [["Byakugan-derived techniques", "All", "Kekkei Genkai"]], bijuu: []
    },
    {
      id: "hyuga_elder", name: "Hyūga Progenitor", jp: "日向の祖", clan: "Hyūga",
      era: ["origin"], title: "Founder of the Hyūga", aura: "cyan", gen: 2, x: 2350, y: 490,
      image: "characters/hyuga.webp",
      bio: "Ancestor of the Hyūga clan bearers of the Byakugan, descended from the Ōtsutsuki moon line.",
      jutsu: [["Byakugan", "All", "Kekkei Genkai"], ["Gentle Fist", "All", "Taijutsu"]], bijuu: []
    },
    {
      id: "tajima", name: "Tajima Uchiha", jp: "うちは タジマ", clan: "Uchiha",
      era: ["origin"], title: "Uchiha patriarch", aura: "none", gen: 3, x: 480, y: 680,
      bio: "Head of the Uchiha during the Warring States era and father of Madara, Izuna and Kagami.",
      jutsu: [["Sharingan", "All", "Kekkei Genkai"]], bijuu: []
    },
    {
      id: "butsuma", name: "Butsuma Senju", jp: "千手 仏間", clan: "Senju",
      era: ["origin"], title: "Senju patriarch", aura: "none", gen: 3, x: 1220, y: 680,
      image: "characters/batsuma.webp",
      bio: "Leader of the Senju clan in the Warring States era; father of Hashirama, Tobirama and Itama.",
      jutsu: [["Senju Taijutsu", "All", "Taijutsu"]], bijuu: []
    },
    {
      id: "ashina", name: "Ashina Uzumaki", jp: "うずまき アシナ", clan: "Uzumaki",
      era: ["origin"], title: "Uzumaki matriarch", aura: "none", gen: 3, x: 1550, y: 680,
      bio: "Fourth leader of the Uzumaki clan of the Whirlpool Village, renowned for sealing techniques and longevity.",
      jutsu: [["Adamant Sealing Style", "All", "Fūinjutsu"], ["Adamant Ghost Tunnel", "All", "Fūinjutsu"]], bijuu: []
    },
    {
      id: "fuso", name: "Fuso Uzumaki", jp: "うずまき フソ", clan: "Uzumaki",
      era: ["origin"], title: "Uzumaki of the Whirlpool", aura: "none", gen: 3, x: 1700, y: 680,
      bio: "An Uzumaki survivor whose bloodline continued through Nagato and the Rain Village.",
      jutsu: [["Sealing Techniques", "All", "Fūinjutsu"]], bijuu: []
    },
    {
      id: "madara", name: "Madara Uchiha", jp: "うちは マダラ", clan: "Uchiha",
      era: ["origin", "shippuden"], title: "Co-founder of Konoha · Ten-Tails host", aura: "purple", gen: 4, x: 180, y: 870,
      bio: "Legendary Uchiha warrior, rival of Hashirama, reincarnation of Indra. He became the Ten-Tails' Jinchūriki and cast the Infinite Tsukuyomi.",
      jutsu: [["Susanoo", "All", "Kekkei Genkai"], ["Perfect Susanoo", "All", "Kekkei Genkai"], ["Fire Release: Great Fire annihilation", "Fire", "Ninjutsu"], ["Limbo", "All", "Kekkei Mōra"]], bijuu: ["juubi"]
    },
    {
      id: "izuna", name: "Izuna Uchiha", jp: "うちは イズナ", clan: "Uchiha",
      era: ["origin"], title: "Madara's brother", aura: "none", gen: 4, x: 360, y: 870,
      image: "characters/izsuna.webp",
      bio: "Madara's beloved younger brother and equal in battle. His death drove Madara away from Konoha.",
      jutsu: [["Sharingan", "All", "Kekkei Genkai"]], bijuu: []
    },
    {
      id: "kagami", name: "Kagami Uchiha", jp: "うちは カガミ", clan: "Uchiha",
      era: ["origin"], title: "Uchiha elder", aura: "none", gen: 4, x: 560, y: 870,
      image: "characters/kamagi.webp",
      bio: "An Uchiha contemporary of Hashirama and ancestor of Shisui and Fugaku's line.",
      jutsu: [["Fire Release: Blaze Impression", "Fire", "Ninjutsu"]], bijuu: []
    },
    {
      id: "obito", name: "Obito Uchiha", jp: "うちは オビト", clan: "Uchiha",
      era: ["naruto", "shippuden"], title: "2nd Ten-Tails host · Kaguya's vessel", aura: "purple", gen: 4, x: 980, y: 870,
      image: "characters/tobi.webp",
      bio: "Presumed dead in the Third Shinobi War, rescued by Madara and groomed as his successor. He became the masked leader of Akatsuki and the Ten-Tails' Jinchūriki.",
      jutsu: [["Kamui", "Space-Time", "Kekkei Genkai"], ["Rinnegan", "All", "Kekkei Genkai"], ["Tailed Beast Ball", "All", "Bijuu"]], bijuu: ["juubi"]
    },
    {
      id: "hashirama", name: "Hashirama Senju", jp: "千手 柱間", clan: "Senju",
      era: ["origin"], title: "1st Hokage · God of Shinobi", aura: "gold", gen: 4, x: 1080, y: 870,
      bio: "Co-founder of Konohagakure and the first Hokage, wielder of Wood Release and reincarnation of Ashura.",
      jutsu: [["Wood Release", "Yin-Yang", "Kekkei Genkai"], ["True Several Thousand Hands", "Yin-Yang", "Kekkeijutsu"], ["Senjutsu", "Sage", "Senjutsu"]], bijuu: []
    },
    {
      id: "tobirama", name: "Tobirama Senju", jp: "千手 扉間", clan: "Senju",
      era: ["origin"], title: "2nd Hokage", aura: "none", gen: 4, x: 1260, y: 870,
      bio: "Hashirama's brother, architect of Konoha's institutions, inventor of the Flying Thunder God and Shadow Clone techniques.",
      jutsu: [["Flying Thunder God", "Space-Time", "Ninjutsu"], ["Water Release", "Water", "Ninjutsu"], ["Shadow Clone Jutsu", "All", "Ninjutsu"]], bijuu: []
    },
    {
      id: "itama", name: "Itama Senju", jp: "千手 板間", clan: "Senju",
      era: ["origin"], title: "Senju brother", aura: "none", gen: 4, x: 1420, y: 870,
      bio: "The fiery-tempered third Senju brother, who fell during the Warring States conflicts.",
      jutsu: [["Fire Release", "Fire", "Ninjutsu"]], bijuu: []
    },
    {
      id: "mito", name: "Mito Uzumaki", jp: "うずまき ミト", clan: "Uzumaki",
      era: ["origin"], title: "1st Jinchūriki of Kurama", aura: "gold", gen: 4, x: 1560, y: 870,
      bio: "Wife of Hashirama and the first person to seal Kurama within herself, beginning the Uzumaki line of Nine-Tails hosts.",
      jutsu: [["Adamant Sealing Style", "All", "Fūinjutsu"], ["Kurama Chakra", "All", "Bijuu"]], bijuu: ["kurama"]
    },
    {
      id: "nagato", name: "Nagato", jp: "長門", clan: "Uzumaki",
      era: ["naruto", "shippuden"], title: "Leader of Akatsuki · Pain", aura: "none", gen: 4, x: 1800, y: 870,
      bio: "An Uzumaki orphan of the Rain Village and student of Jiraiya. As Pain he wielded the Rinnegan and the Six Paths of Pain.",
      jutsu: [["Rinnegan", "All", "Kekkei Genkai"], ["Shinra Tensei", "All", "Rinnegan"], ["Chikushōdō", "All", "Rinnegan"]], bijuu: []
    },
    {
      id: "toneri", name: "Toneri Ōtsutsuki", jp: "大筒木 トネリ", clan: "Ōtsutsuki",
      era: ["boruto"], title: "Moon realm guardian", aura: "cyan", gen: 3, x: 1900, y: 680,
      bio: "The last of the Ōtsutsuki Moon Branch. He abducted Hinata in pursuit of the Byakugan and the Tenseigen.",
      jutsu: [["Tenseigen", "All", "Kekkei Mōra"], ["Golden Wheel", "All", "Kekkei Mōra"]], bijuu: []
    },
    {
      id: "hiashi", name: "Hiashi Hyūga", jp: "日向 ヒアシ", clan: "Hyūga",
      era: ["naruto", "shippuden", "boruto"], title: "Head of the Hyūga Main Branch", aura: "cyan", gen: 3, x: 2250, y: 680,
      bio: "Leader of the Hyūga main house, father of Hinata and Hanabi, and a fierce defender of the clan's secrets.",
      jutsu: [["Byakugan", "All", "Kekkei Genkai"], ["Gentle Fist", "All", "Taijutsu"], ["Air Palm", "All", "Taijutsu"]], bijuu: []
    },
    {
      id: "hizashi", name: "Hizashi Hyūga", jp: "日向 ヒザシ", clan: "Hyūga",
      era: ["naruto", "shippuden"], title: "Hyūga Side Branch", aura: "cyan", gen: 3, x: 2500, y: 680,
      bio: "Twin brother of Hiashi and father of Neji. The side branch's cursed seal bound his family to the main house.",
      jutsu: [["Byakugan", "All", "Kekkei Genkai"], ["Gentle Fist", "All", "Taijutsu"]], bijuu: []
    },
    {
      id: "fugaku", name: "Fugaku Uchiha", jp: "うちは フガク", clan: "Uchiha",
      era: ["naruto"], title: "Captain of the Konoha Police", aura: "none", gen: 5, x: 760, y: 1060,
      bio: "Father of Itachi and Sasuke, a decorated war veteran who became consumed by the Uchiha coup.",
      jutsu: [["Sharingan", "All", "Kekkei Genkai"], ["Fire Release", "Fire", "Ninjutsu"]], bijuu: []
    },
    {
      id: "mikoto", name: "Mikoto Uchiha", jp: "うちは ミコト", clan: "Uchiha",
      era: ["naruto"], title: "Uchiha matriarch", aura: "none", gen: 5, x: 900, y: 1060,
      bio: "Wife of Fugaku and mother of Itachi and Sasuke, a gentle woman who doted on her younger son.",
      jutsu: [["Shurikenjutsu", "All", "Bukijutsu"]], bijuu: []
    },
    {
      id: "shisui", name: "Shisui Uchiha", jp: "うちは シスイ", clan: "Uchiha",
      era: ["shippuden"], title: "Shisui of the Body Flicker", aura: "purple", gen: 5, x: 560, y: 1060,
      bio: "The fastest Uchiha of his generation and wielder of Kotoamatsukami. His eyes became the catalyst for Itachi's predicament.",
      jutsu: [["Kotoamatsukami", "Yin-Yang", "Kekkei Genkai"], ["Body Flicker", "All", "Ninjutsu"], ["Susanoo", "All", "Kekkei Genkai"]], bijuu: []
    },
    {
      id: "rin", name: "Rin Nohara", jp: "野原 リン", clan: "Other",
      era: ["naruto"], title: "Third Jinchūriki of Isobu", aura: "none", gen: 5, x: 1150, y: 1060,
      bio: "Teammate of Kakashi and Obito and a gifted medical ninja. She was made the Jinchūriki of the Three-Tails by Madara's plan.",
      jutsu: [["Medical Ninjutsu", "Water", "Ninjutsu"], ["Isobu's Chakra", "Water", "Bijuu"]], bijuu: ["isobu"]
    },
    {
      id: "kushina", name: "Kushina Uzumaki", jp: "うずまき クシナ", clan: "Uzumaki",
      era: ["naruto"], title: "2nd Jinchūriki of Kurama", aura: "gold", gen: 5, x: 1750, y: 1060,
      bio: "A fiery Uzumaki and mother of Naruto. Volunteered to become Kurama's next host and died sealing it into her son.",
      jutsu: [["Adamant Sealing Style", "All", "Fūinjutsu"], ["Kurama Chakra", "All", "Bijuu"]], bijuu: ["kurama"]
    },
    {
      id: "minato", name: "Minato Namikaze", jp: "波風 ミナト", clan: "Other",
      era: ["naruto"], title: "4th Hokage · Yellow Flash", aura: "gold", gen: 5, x: 1900, y: 1060,
      bio: "Konoha's fourth Hokage, master of the Flying Thunder God, and father of Naruto. He sacrificed himself to seal Kurama into his son.",
      jutsu: [["Flying Thunder God", "Space-Time", "Ninjutsu", "videos/minato/fly-thunder-god.mp4"], ["Rasengan", "Wind", "Ninjutsu"], ["Reaper Death Seal", "All", "Fūinjutsu"], ["Kurama Chakra", "All", "Bijuu"]], bijuu: []
    },
    {
      id: "jiraiya", name: "Jiraiya", jp: "自来也", clan: "Other",
      era: ["naruto", "shippuden"], title: "Legendary Sannin · Toad Sage", aura: "none", gen: 4, x: 2120, y: 870,
      image: "characters/jaraiya.webp",
      bio: "One of the Legendary Sannin, sage of Mount Myōboku and teacher of Nagato, Minato and Naruto.",
      jutsu: [["Rasengan", "Wind", "Ninjutsu"], ["Sage Mode", "Sage", "Senjutsu"], ["Fire Release: Toad Oil Flame Bullet", "Fire", "Ninjutsu"]], bijuu: []
    },
    {
      id: "orochimaru", name: "Orochimaru", jp: "大蛇丸", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "Legendary Sannin", aura: "none", gen: 5, x: 2580, y: 1060,
      bio: "A Sannin obsessed with forbidden techniques and immortality, teacher of Mitsuki and former experimenter on Sasuke.",
      jutsu: [["Snake Sage Mode", "Sage", "Senjutsu"], ["Deadly Nekrai", "All", "Ninjutsu"], ["Eight Branches Technique", "All", "Ninjutsu"]], bijuu: []
    },
    {
      id: "kabuto", name: "Kabuto Yakushi", jp: "薬師 カブト", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "Snake Sage · Orochimaru's right hand", aura: "purple", gen: 5, x: 2920, y: 1060,
      bio: "A brilliant medical ninja and spy who served Orochimaru, then consumed his remains to master Snake Sage Mode. Hidden in the shadows of the Fourth Shinobi War, he revived the fallen with Reanimation and became the vessel for Orochimaru's final form.",
      jutsu: [
        ["Chakra Scalpel", "Yin-Yang", "Medical Ninjutsu"],
        ["Snake Sage Mode", "Sage", "Senjutsu"],
        ["Parasite Reincarnation", "Yin-Yang", "Kinjutsu"],
        ["Deadly Nekrai", "All", "Ninjutsu"],
        ["White Snake Seal", "Sage", "Senjutsu"]
      ], bijuu: []
    },
    {
      id: "tsunade", name: "Tsunade", jp: "綱手", clan: "Senju",
      era: ["naruto", "shippuden", "boruto"], title: "5th Hokage · Legendary Sannin", aura: "none", gen: 5, x: 1080, y: 1060,
      image: "characters/sunade.webp",
      bio: "Granddaughter of Hashirama and Mito, the greatest medical ninja of her age and Konoha's fifth Hokage.",
      jutsu: [["Strength of a Hundred Seal", "Yin-Yang", "Ninjutsu"], ["Medical Ninjutsu", "Water", "Ninjutsu"], ["Creation Rebirth", "Yin-Yang", "Ninjutsu"]], bijuu: []
    },
    {
      id: "itachi", name: "Itachi Uchiha", jp: "うちは イタチ", clan: "Uchiha",
      era: ["naruto", "shippuden"], title: "Shadow of the Leaf · Akatsuki", aura: "purple", gen: 6, x: 700, y: 1250,
      bio: "Elder son of Fugaku. Shouldered the massacre of his clan to protect Konoha and Sasuke, and joined Akatsuki as a double agent.",
      jutsu: [["Tsukuyomi", "Yin-Yang", "Genjutsu"], ["Amaterasu", "Fire", "Kekkei Genkai"], ["Susanoo", "All", "Kekkei Genkai"], ["Totsuka Blade", "All", "Kekkei Genkai"]], bijuu: []
    },
    {
      id: "sasuke", name: "Sasuke Uchiha", jp: "うちは サスケ", clan: "Uchiha",
      era: ["naruto", "shippuden", "boruto"], title: "Shadow Hokage · Rinnegan wielder", aura: "purple", gen: 6, x: 860, y: 1250,
      bio: "Survivor of the Uchiha massacre, rival and friend of Naruto. Reincarnation of Indra and bearer of the Rinnegan.",
      jutsu: [
        ["Chidori", "Lightning", "Ninjutsu", "videos/sasuke/chidori.mp4"],
        ["Susanoo", "All", "Kekkei Genkai", "videos/sasuke/susano.mp4"],
        ["Rinnegan", "All", "Kekkei Genkai", "videos/sasuke/renegan.mp4"],
        ["Amenotejikara", "Space-Time", "Kekkei Genkai", "videos/sasuke/amenojikara.mp4"]
      ], bijuu: []
    },
    {
      id: "sakura", name: "Sakura Haruno", jp: "春野 サクラ", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "Inspector General · Medical ninja", aura: "none", gen: 6, x: 1020, y: 1250,
      bio: "Student of Tsunade, monster strength and peerless medical ninjutsu. Wife of Sasuke and mother of Sarada.",
      jutsu: [["Strength of a Hundred Seal", "Yin-Yang", "Ninjutsu"], ["Medical Ninjutsu", "Water", "Ninjutsu"], ["Super Strength", "All", "Ninjutsu"]], bijuu: []
    },
    {
      id: "kakashi", name: "Kakashi Hatake", jp: "はたけ カカシ", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "6th Hokage · Copy Ninja", aura: "none", gen: 6, x: 1270, y: 1250,
      bio: "Student of Minato, bearer of the Sharingan, and mentor to Team 7. Briefly became Konoha's sixth Hokage.",
      jutsu: [["Sharingan", "All", "Kekkei Genkai"], ["Lightning Blade (Chidori)", "Lightning", "Ninjutsu"], ["Flying Thunder God", "Space-Time", "Ninjutsu"], ["Kamui", "Space-Time", "Kekkei Genkai"]], bijuu: []
    },
    {
      id: "naruto", name: "Naruto Uzumaki", jp: "うずまき ナルト", clan: "Uzumaki",
      era: ["naruto", "shippuden", "boruto"], title: "7th Hokage · Jinchūriki", aura: "gold", gen: 6, x: 1820, y: 1250,
      bio: "Son of Minato and Kushina, host of Kurama and reincarnation of Ashura. Became the Seventh Hokage and a living legend.",
      jutsu: [["Rasenshuriken", "Wind", "Ninjutsu"], ["Shadow Clone Jutsu", "All", "Ninjutsu"], ["Sage Mode", "Sage", "Senjutsu"], ["Six Paths Sage Mode", "Sage", "Senjutsu", "videos/naruto/naruto-six-path-sage.mp4"], ["Kurama Chakra Mode", "All", "Bijuu"]], bijuu: ["kurama"]
    },
    {
      id: "hinata", name: "Hinata Hyūga", jp: "日向 ヒナタ", clan: "Hyūga",
      era: ["naruto", "shippuden", "boruto"], title: "Byakugan Princess · Hokage's wife", aura: "cyan", gen: 6, x: 2250, y: 1250,
      bio: "Daughter of Hiashi, bearer of the Byakugan and wife of Naruto. Mother of Boruto and Himawari.",
      jutsu: [["Byakugan", "All", "Kekkei Genkai"], ["Gentle Fist", "All", "Taijutsu"], ["Gentle Fist: Twin Lion Fists", "All", "Taijutsu"]], bijuu: []
    },
    {
      id: "gaara", name: "Gaara", jp: "ガアラ", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "5th Kazekage · Jinchūriki", aura: "none", gen: 6, x: 2450, y: 1250,
      bio: "Once a feared weapon of Sand, the host of Shukaku became the beloved Fifth Kazekage and a steadfast ally of Konoha.",
      jutsu: [["Sand Manipulation", "Wind", "Kekkei Genkai"], ["Tailed Beast Ball", "All", "Bijuu"], ["Sand Shield", "Wind", "Ninjutsu"]], bijuu: ["shukaku"]
    },
    {
      id: "killer_b", name: "Killer B", jp: "キラービー", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "8-tails Jinchūriki", aura: "none", gen: 6, x: 2650, y: 1250,
      image: "characters/killer_B.webp",
      bio: "The energetic rapper-host of Gyuki, cousin to the Kazekage line and the ninja who taught Naruto to befriend his Bijuu.",
      jutsu: [["Tailed Beast Ball", "All", "Bijuu"], ["Lava Release", "Fire", "Kekkei Genkai"], ["Eight-Tails Chakra", "Water", "Bijuu"]], bijuu: ["gyuki"]
    },
    {
      id: "hanabi", name: "Hanabi Hyūga", jp: "日向 ハナビ", clan: "Hyūga",
      era: ["boruto"], title: "Hyūga heiress", aura: "cyan", gen: 5, x: 2400, y: 1060,
      bio: "Younger sister of Hinata and the favoured heir of the main branch in the Boruto era.",
      jutsu: [["Byakugan", "All", "Kekkei Genkai"], ["Gentle Fist", "All", "Taijutsu"]], bijuu: []
    },
    {
      id: "neji", name: "Neji Hyūga", jp: "日向 ネジ", clan: "Hyūga",
      era: ["naruto", "shippuden"], title: "Genius of the Side Branch", aura: "cyan", gen: 5, x: 2560, y: 870,
      bio: "Prodigy of the Hyūga side branch who broke free of the cursed seal's fatalism and gave his life protecting Hinata.",
      jutsu: [["Byakugan", "All", "Kekkei Genkai"], ["Gentle Fist: Eight Trigrams", "All", "Taijutsu"], ["Rotation", "All", "Taijutsu"]], bijuu: []
    },
    {
      id: "sarada", name: "Sarada Uchiha", jp: "うちは サラダ", clan: "Uchiha",
      era: ["boruto"], title: "Sasuke & Sakura's daughter", aura: "purple", gen: 7, x: 860, y: 1440,
      bio: "Daughter of Sasuke and Sakura, a diligent student who dreams of becoming Hokage and awakened her Sharingan.",
      jutsu: [["Sharingan", "All", "Kekkei Genkai"], ["Fire Release", "Fire", "Ninjutsu"], ["Strength of a Hundred Seal", "Yin-Yang", "Ninjutsu"]], bijuu: []
    },
    {
      id: "boruto", name: "Boruto Uzumaki", jp: "うずまき ボルト", clan: "Uzumaki",
      era: ["boruto"], title: "Son of the Seventh Hokage", aura: "gold", gen: 7, x: 1820, y: 1440,
      bio: "Son of Naruto and Hinata, bearer of the Jōgan and the Karma seal, and a ninja determined to step out of his father's shadow.",
      jutsu: [["Rasengan", "Wind", "Ninjutsu"], ["Shadow Clone Jutsu", "All", "Ninjutsu"], ["Jōgan", "All", "Kekkei Mōra"], ["Karma", "All", "Ōtsutsuki"]], bijuu: []
    },
    {
      id: "himawari", name: "Himawari Uzumaki", jp: "うずまき ヒマワリ", clan: "Uzumaki",
      era: ["boruto"], title: "Daughter of the Seventh Hokage · Kurama host", aura: "gold", gen: 7, x: 1980, y: 1440,
      bio: "Gentle younger sister of Boruto, who unexpectedly inherited Kurama's chakra after Naruto's loss of the Nine-Tails.",
      jutsu: [["Byakugan", "All", "Kekkei Genkai"], ["Kurama Chakra", "All", "Bijuu"], ["Gentle Fist", "All", "Taijutsu"]], bijuu: ["kurama"]
    },
    {
      id: "kawaki", name: "Kawaki", jp: "カワキ", clan: "Other",
      era: ["boruto"], title: "Ōtsutsuki vessel", aura: "purple", gen: 7, x: 2500, y: 1440,
      bio: "A vessel created by the Ōtsutsuki, bearing the Karma seal. Raised by Konoha after being rescued from the Kara organization.",
      jutsu: [["Karma", "All", "Ōtsutsuki"], ["Flight", "All", "Kekkei Mōra"], ["Gentle Fist", "All", "Taijutsu"]], bijuu: []
    },
    {
      id: "mitsuki", name: "Mitsuki", jp: "ミツキ", clan: "Other",
      era: ["boruto"], title: "Synthetic human · Orochimaru's son", aura: "none", gen: 7, x: 2300, y: 1440,
      bio: "A synthetic human created by Orochimaru and raised as his son. Teammate of Boruto and Sarada, wielder of Sage Mode.",
      jutsu: [["Sage Mode", "Sage", "Senjutsu"], ["Snake Sage Mode", "Sage", "Senjutsu"], ["Wind Release", "Wind", "Ninjutsu"]], bijuu: []
    },
    /* --- Sand family, teachers and the next generation -------------------- */
    {
      id: "karura", name: "Karura", jp: "加流羅", clan: "Other",
      era: ["naruto", "shippuden"], title: "Rasa's wife · Gaara's mother", aura: "none", gen: 4, x: 2410, y: 870,
      bio: "A citizen of Sunagakure and wife of the Fourth Kazekage. Mother of Temari, Kankurō and Gaara, she died giving birth to her youngest. Rasa later revealed that her love lived on in the sand that protects Gaara.",
      jutsu: [["Wind Release", "Wind", "Ninjutsu"], ["Sand Manipulation", "Wind", "Kekkei Genkai"]], bijuu: []
    },
    {
      id: "chiyo", name: "Chiyo", jp: "千代", clan: "Other",
      era: ["naruto", "shippuden"], title: "Elder of Sunagakure · Puppet Master", aura: "none", gen: 5, x: 180, y: 1060,
      bio: "Sasori's grandmother, who taught him puppetry and later faced him in battle. She sealed Shukaku into Gaara as a child and atoned by sacrificing her own life to bring him back.",
      jutsu: [["Puppet Technique", "All", "Ninjutsu"], ["Human Puppet", "All", "Kinjutsu"], ["One's Own Life Reincarnation", "Yin-Yang", "Kinjutsu"], ["Poison Mist", "All", "Ninjutsu"]], bijuu: []
    },
    {
      id: "yahiko", name: "Yahiko", jp: "弥彦", clan: "Other",
      era: ["naruto", "shippuden"], title: "Co-founder of Akatsuki", aura: "none", gen: 4, x: 1700, y: 870,
      bio: "An orphan of the Hidden Rain trained by Jiraiya alongside Nagato and Konan. He founded Akatsuki with his friends, dreaming of a world without war, and his death set Pain's path in motion.",
      jutsu: [["Shurikenjutsu", "All", "Bukijutsu"], ["Fire Release", "Fire", "Ninjutsu"]], bijuu: []
    },
    {
      id: "kimimaro", name: "Kimimaro", jp: "君麻呂", clan: "Other",
      era: ["naruto", "shippuden"], title: "Last of the Kaguya · Orochimaru's blade", aura: "none", gen: 6, x: 2760, y: 1250,
      bio: "The last survivor of the Kaguya clan and Orochimaru's most devoted student. His Shikotsumyaku lets him shape his bones into weapons; he fought Sasuke's group despite a fatal illness.",
      jutsu: [["Shikotsumyaku", "All", "Kekkei Genkai"], ["Dance of the Camellia", "All", "Kekkeijutsu"], ["Bone Bullet", "All", "Kekkeijutsu"]], bijuu: []
    },
    {
      id: "shizune", name: "Shizune", jp: "静音", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "Medical ninja · Tsunade's apprentice", aura: "none", gen: 6, x: 1160, y: 1250,
      bio: "Tsunade's niece and loyal apprentice, an expert in medical ninjutsu and poisons who served as the Fifth Hokage's right hand and advisor.",
      jutsu: [["Medical Ninjutsu", "Water", "Ninjutsu"], ["Poison Mist", "All", "Ninjutsu"], ["Secret Needle Technique", "All", "Ninjutsu"]], bijuu: []
    },
    {
      id: "dan", name: "Dan Katō", jp: "加藤 ダン", clan: "Other",
      era: ["shippuden"], title: "Tsunade's beloved · Would-be Hokage", aura: "none", gen: 4, x: 2260, y: 870,
      bio: "A gifted ninja who dreamed of becoming Hokage beside Tsunade. He was killed in the Second Shinobi War, and his death shaped her lifelong fear of blood.",
      jutsu: [["Shadow Clone Jutsu", "All", "Ninjutsu"]], bijuu: []
    },
    {
      id: "nawaki", name: "Nawaki", jp: "縄樹", clan: "Senju",
      era: ["shippuden"], title: "Tsunade's brother · Aspiring Hokage", aura: "none", gen: 7, x: 1020, y: 1440,
      bio: "Tsunade's younger brother and grandson of Hashirama, who wanted to become Hokage and protect the village. He died in the First Shinobi War, inspiring her own resolve.",
      jutsu: [["Senju Taijutsu", "All", "Taijutsu"]], bijuu: []
    },
    {
      id: "shinki", name: "Shinki", jp: "砂希", clan: "Other",
      era: ["boruto"], title: "Gaara's adopted son · Iron Sand user", aura: "none", gen: 7, x: 2650, y: 1440,
      bio: "A former puppet prodigy adopted by Gaara in the Boruto era. He follows his father's path as a protector of Sunagakure, wielding iron sand in battle.",
      jutsu: [["Iron Sand", "Earth", "Kekkei Genkai"], ["Sand Manipulation", "Wind", "Ninjutsu"], ["Puppet Technique", "All", "Ninjutsu"]], bijuu: []
    },
    /* --- Sasuke's Hebi / Taka team ---------------------------------------- */
    {
      id: "karin", name: "Karin", jp: "香燐", clan: "Uzumaki",
      era: ["naruto", "shippuden"], title: "Hebi medic · Uzumaki survivor", aura: "none", gen: 6, x: 4100, y: 1250,
      bio: "An Uzumaki survivor with exceptional sensory and sealing skills. After serving Orochimaru she joined Sasuke's Hebi team as its medic, her chakra able to heal others by biting them.",
      jutsu: [["Adamant Sealing Style", "All", "Fūinjutsu"], ["Medical Ninjutsu", "Water", "Ninjutsu"], ["Sensory Ninjutsu", "All", "Ninjutsu"], ["Chakra Chains", "All", "Kekkei Genkai"]], bijuu: []
    },
    {
      id: "suigetsu", name: "Suigetsu Hōzuki", jp: "鬼灯 水月", clan: "Other",
      era: ["naruto", "shippuden"], title: "Hebi swordsman · Water Release", aura: "none", gen: 6, x: 4250, y: 1250,
      bio: "A member of the Hōzuki clan who can liquefy his body and merge with water. Hunted by Killer B for the Seven Swords, he joined Sasuke's search for Orochimaru's remains.",
      jutsu: [["Water Release", "Water", "Ninjutsu"], ["Hydration Technique", "Water", "Kekkei Genkai"], ["Kenjutsu", "All", "Bukijutsu"]], bijuu: []
    },
    {
      id: "juugo", name: "Jūgo", jp: "重吾", clan: "Other",
      era: ["naruto", "shippuden"], title: "Hebi brute · Natural energy host", aura: "none", gen: 6, x: 4400, y: 1250,
      image: "characters/jugo.webp",
      bio: "A fugitive whose body absorbed natural energy uncontrollably, driving him into violent rages. Orochimaru's experiments gave him a curse seal; he found calm as Sasuke's comrade.",
      jutsu: [["Curse Mark Transformation", "Yin-Yang", "Kekkei Genkai"], ["Natural Energy Absorption", "Sage", "Senjutsu"], ["Super Strength", "All", "Taijutsu"]], bijuu: []
    },
    /* --- Akatsuki's remaining members ------------------------------------- */
    {
      id: "zetsu", name: "Zetsu", jp: "絶", clan: "Other",
      era: ["naruto", "shippuden"], title: "Akatsuki's two-faced spy · Kaguya's will", aura: "purple", gen: 4, x: 2935, y: 870,
      bio: "One body, two minds. The white half merged with the earth as Akatsuki's eyes and later led the White Zetsu Army; the black half was Kaguya's living will, steering Madara and Obito for centuries toward the Infinite Tsukuyomi before Naruto and Sasuke sealed it away.",
      jutsu: [
        ["Camouflage Absorption", "All", "Kekkei Genkai"],
        ["Spore Invasion", "All", "Kekkei Genkai"],
        ["Plant Manipulation", "All", "Kekkeijutsu"],
        ["Kaguya's Will", "Yin-Yang", "Kekkei Mōra"],
        ["Possession", "Yin-Yang", "Kinjutsu"]
      ], bijuu: []
    },
    {
      id: "kakuzu", name: "Kakuzu", jp: "角都", clan: "Other",
      era: ["naruto", "shippuden"], title: "Akatsuki bounty hunter · Hidan's partner", aura: "none", gen: 5, x: 3100, y: 1060,
      bio: "Akatsuki's greedy bounty hunter and Hidan's partner. The Earth Grudge Fear keeps several masked hearts beating inside his stitched body, each breathing a different chakra nature. Naruto finally destroyed them all.",
      jutsu: [["Earth Grudge Fear", "All", "Kekkei Genkai"], ["Fire Release", "Fire", "Ninjutsu"], ["Lightning Release", "Lightning", "Ninjutsu"], ["Wind Release", "Wind", "Ninjutsu"]], bijuu: []
    },
    /* --- Jinchūriki hosts kept in the lower "Guest Hosts" row ------------- */
    /* ---- added with their pictures ---- */
    /* ---- Kage, Team Asuma ---- */
    {
      id: "hiruzen", name: "Hiruzen Sarutobi", jp: "猿飛 ヒルゼン", clan: "Other",
      era: ["origin", "naruto"], title: "Third Hokage · The Professor", aura: "none", gen: 3, x: 2080, y: 680,
      bio: "Student of the Second Hokage and leader of the Leaf for decades. Called the Professor for mastering every jutsu in the village, he taught the Legendary Sannin and gave his life sealing Orochimaru's arms.",
      jutsu: [["Fire Release: Fire Dragon Flame Bullet", "Fire", "Ninjutsu"], ["Summoning: Monkey King Enma", "All", "Summoning"], ["Reaper Death Seal", "All", "Fūinjutsu"], ["Shadow Shuriken", "All", "Ninjutsu"]], bijuu: []
    },
    {
      id: "danzo", name: "Danzo Shimura", jp: "志村 ダンゾウ", clan: "Other",
      era: ["naruto", "shippuden"], title: "Leader of Root · Would-be Hokage", aura: "purple", gen: 3, x: 2700, y: 680,
      bio: "Hiruzen's childhood rival and a student of Tobirama. He founded Root, the Leaf's secret intelligence unit, coveted the Hokage seat and took Shisui's eye to wield Izanagi. Sasuke killed him during the Five Kage Summit.",
      jutsu: [["Izanagi", "Yin-Yang", "Kekkei Genkai"], ["Shisui's Right Eye", "Yin-Yang", "Kekkei Genkai"], ["Wind Release: Vacuum Sphere", "Wind", "Ninjutsu"], ["Summoning: Baku", "All", "Summoning"]], bijuu: []
    },
    {
      id: "asuma", name: "Asuma Sarutobi", jp: "猿飛 アスマ", clan: "Other",
      era: ["naruto", "shippuden"], title: "Leader of Team 10 · Guardian Ninja", aura: "none", gen: 5, x: 2100, y: 1060,
      bio: "Son of the Third Hokage and a former member of the Twelve Guardian Ninja. He led Team 10 and taught Shikamaru that the young are the village's King to be protected.",
      jutsu: [["Wind Release: Flying Swallow", "Wind", "Ninjutsu"], ["Fire Release: Ash Pile Burning", "Fire", "Ninjutsu"], ["Chakra Flow Blades", "Wind", "Ninjutsu"]], bijuu: []
    },
    {
      id: "choji", name: "Chōji Akimichi", jp: "秋道 チョウジ", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "Akimichi Clan Head · Team 10", aura: "none", gen: 6, x: 2040, y: 1250,
      bio: "Shikamaru's best friend and teammate on Team 10. The Akimichi clan's body-expansion techniques let him grow to giant size, and his calorie control unlocks Butterfly Mode.",
      jutsu: [["Expansion Jutsu", "All", "Hiden"], ["Human Bullet Tank", "All", "Hiden"], ["Butterfly Mode", "Yin-Yang", "Hiden"]], bijuu: []
    },
    {
      id: "rasa", name: "Rasa", jp: "羅砂", clan: "Other",
      era: ["naruto"], title: "Fourth Kazekage", aura: "none", gen: 5, x: 2250, y: 1060,
      bio: "Leader of the Hidden Sand and father of Gaara, Temari and Kankurō. He controlled gold dust and ordered One-Tail sealed into his youngest son.",
      jutsu: [["Gold Dust", "Earth", "Kekkei Genkai"], ["Gold Dust Wave", "Earth", "Kekkei Genkai"]], bijuu: []
    },
    {
      id: "a_raikage", name: "A (Fourth Raikage)", jp: "四代目雷影 エー", clan: "Other",
      era: ["shippuden", "boruto"], title: "Fourth Raikage", aura: "none", gen: 5, x: 1400, y: 1060,
      image: "characters/a.webp",
      bio: "The hot-tempered leader of the Hidden Cloud and Killer B's sworn brother. His Lightning Release Armour makes him one of the fastest shinobi alive.",
      jutsu: [["Lightning Release Armour", "Lightning", "Ninjutsu"], ["Lightning Release: Liger Bomb", "Lightning", "Taijutsu"], ["Hell Stab", "Lightning", "Ninjutsu"]], bijuu: []
    },
    {
      id: "mei", name: "Mei Terumī", jp: "照美 メイ", clan: "Other",
      era: ["shippuden", "boruto"], title: "Fifth Mizukage", aura: "none", gen: 5, x: 1600, y: 1060,
      bio: "Leader of the Hidden Mist who ended its Bloody Mist era. She wields two kekkei genkai, Lava Release and Boil Release.",
      jutsu: [["Lava Release: Melting Apparition", "Fire", "Kekkei Genkai"], ["Boil Release: Skilled Mist", "Water", "Kekkei Genkai"], ["Water Release: Water Dragon", "Water", "Ninjutsu"]], bijuu: []
    },
    {
      id: "onoki", name: "Ōnoki", jp: "オオノキ", clan: "Other",
      era: ["origin", "shippuden"], title: "Third Tsuchikage", aura: "none", gen: 3, x: 800, y: 680,
      bio: "The long-lived leader of the Hidden Stone, who once fought Madara. He can float in the air and uses Dust Release, which breaks matter down to atoms.",
      jutsu: [["Dust Release: Detachment of the Primitive World", "All", "Kekkei Tōta"], ["Earth Release: Light Weight Rock", "Earth", "Ninjutsu"], ["Flight", "Earth", "Ninjutsu"]], bijuu: []
    },
    /* ---- Konoha 11, Sand siblings and the Boruto generation ---- */
    {
      id: "guy", name: "Might Guy", jp: "マイト・ガイ", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "Leader of Team Guy · Blue Beast", aura: "none", gen: 5, x: 1275, y: 1060,
      image: "characters/might.webp",
      bio: "Kakashi's self-declared eternal rival and the Leaf's greatest taijutsu master. He opened all Eight Gates against Madara and passed his way of hard work to Rock Lee.",
      jutsu: [["Dynamic Entry", "All", "Taijutsu"], ["Morning Peacock", "Fire", "Taijutsu"], ["Night Guy", "All", "Taijutsu"]], bijuu: []
    },
    {
      id: "kurenai", name: "Kurenai Yūhi", jp: "夕日 紅", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "Leader of Team 8 · Genjutsu Mistress", aura: "none", gen: 5, x: 2750, y: 1060,
      bio: "The Leaf's genjutsu specialist and sensei of Hinata, Kiba and Shino. She raised her daughter Mirai after Asuma's death.",
      jutsu: [["Demonic Illusion: Tree Binding Death", "Yin-Yang", "Genjutsu"], ["Flower Petal Escape", "Yin-Yang", "Genjutsu"]], bijuu: []
    },
    {
      id: "temari", name: "Temari", jp: "テマリ", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "Wind Mistress of the Sand", aura: "none", gen: 6, x: 2850, y: 1250,
      bio: "Gaara's older sister and the Sand's ambassador to the Leaf. She fights with a giant war fan and later marries Shikamaru.",
      jutsu: [["Wind Release: Cutting Whirlwind", "Wind", "Ninjutsu"], ["Summoning: Blade Dance", "Wind", "Summoning"]], bijuu: []
    },
    {
      id: "kankuro", name: "Kankurō", jp: "カンクロウ", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "Puppet Master of the Sand", aura: "none", gen: 6, x: 3000, y: 1250,
      bio: "Gaara's older brother and a master puppeteer. He later fights with Sasori's own puppets.",
      jutsu: [["Puppet Technique", "All", "Ninjutsu"], ["Black Secret Technique: Iron Maiden", "All", "Ninjutsu"]], bijuu: []
    },
    {
      id: "ino", name: "Ino Yamanaka", jp: "山中 いの", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "Team 10 · Sensory Ninja", aura: "none", gen: 6, x: 3150, y: 1250,
      bio: "Sakura's rival and best friend, and the third member of Team 10. Her clan's mind techniques let her enter and read other minds.",
      jutsu: [["Mind Body Switch", "Yin-Yang", "Hiden"], ["Mind Transmission", "Yin-Yang", "Hiden"]], bijuu: []
    },
    {
      id: "sai", name: "Sai", jp: "サイ", clan: "Other",
      era: ["shippuden", "boruto"], title: "Former Root Agent · Ink Artist", aura: "none", gen: 6, x: 3300, y: 1250,
      bio: "A Root operative who joined Team Kakashi and slowly learned to feel emotion. He brings his ink drawings to life.",
      jutsu: [["Super Beast Imitating Drawing", "Water", "Ninjutsu"], ["Ink Mist", "Water", "Ninjutsu"]], bijuu: []
    },
    {
      id: "karui", name: "Karui", jp: "カルイ", clan: "Other",
      era: ["shippuden", "boruto"], title: "Kenjutsu of the Cloud", aura: "none", gen: 6, x: 3450, y: 1250,
      bio: "A hot-headed sword fighter from the Hidden Cloud who later marries Chōji and moves to the Leaf.",
      jutsu: [["Lightning Release Sword", "Lightning", "Kenjutsu"]], bijuu: []
    },
    {
      id: "kiba", name: "Kiba Inuzuka", jp: "犬塚 キバ", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "Team 8 · Tracker", aura: "none", gen: 6, x: 3600, y: 1250,
      bio: "A brash member of Team 8 who fights alongside his ninja dog Akamaru with the Inuzuka clan's fang techniques.",
      jutsu: [["Fang Over Fang", "All", "Hiden"], ["Man Beast Clone", "All", "Hiden"]], bijuu: []
    },
    {
      id: "shino", name: "Shino Aburame", jp: "油女 シノ", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "Team 8 · Insect Host", aura: "none", gen: 6, x: 3750, y: 1250,
      bio: "A calm, logical member of Team 8 whose body hosts the Aburame clan's chakra-eating insects. He later teaches at the Academy.",
      jutsu: [["Parasitic Destruction Insects", "All", "Hiden"], ["Insect Clone", "All", "Hiden"]], bijuu: []
    },
    {
      id: "tenten", name: "Tenten", jp: "テンテン", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "Team Guy · Weapons Specialist", aura: "none", gen: 6, x: 3900, y: 1250,
      bio: "Neji's and Lee's teammate, who summons huge numbers of weapons from scrolls and never misses a target.",
      jutsu: [["Rising Twin Dragons", "All", "Ninjutsu"], ["Manipulated Tools", "All", "Ninjutsu"]], bijuu: []
    },
    {
      id: "shikadai", name: "Shikadai Nara", jp: "奈良 シカダイ", clan: "Other",
      era: ["boruto"], title: "Team 10 (new) · Nara Strategist", aura: "none", gen: 7, x: 1450, y: 1440,
      bio: "Son of Shikamaru and Temari. As lazy-seeming and sharp as his father, he leads the new Team Ino-Shika-Chō.",
      jutsu: [["Shadow Possession Jutsu", "Yin-Yang", "Hiden"], ["Shadow Imitation Shuriken", "Yin-Yang", "Hiden"]], bijuu: []
    },
    {
      id: "metal_lee", name: "Metal Lee", jp: "メタル・リー", clan: "Other",
      era: ["boruto"], title: "Taijutsu Hopeful", aura: "none", gen: 7, x: 1620, y: 1440,
      image: "characters/metal.webp",
      bio: "Rock Lee's son, who trains in taijutsu like his father but freezes up under pressure.",
      jutsu: [["Leaf Hurricane", "All", "Taijutsu"], ["Eight Gates", "All", "Taijutsu"]], bijuu: []
    },
    {
      id: "chocho", name: "Chōchō Akimichi", jp: "秋道 チョウチョウ", clan: "Other",
      era: ["boruto"], title: "Team 10 (new) · Butterfly", aura: "none", gen: 7, x: 2140, y: 1440,
      image: "characters/choco.webp",
      bio: "Daughter of Chōji and Karui. Confident and food-loving, she uses the Akimichi body-expansion techniques.",
      jutsu: [["Partial Expansion", "All", "Hiden"], ["Butterfly Mode", "Yin-Yang", "Hiden"]], bijuu: []
    },
    {
      id: "mirai", name: "Mirai Sarutobi", jp: "猿飛 ミライ", clan: "Other",
      era: ["boruto"], title: "Guardian of the Seventh Hokage", aura: "none", gen: 7, x: 2750, y: 1440,
      bio: "Daughter of Asuma and Kurenai, born after her father's death. She becomes one of the Hokage's bodyguards.",
      jutsu: [["Chakra Flow Blades", "Wind", "Ninjutsu"]], bijuu: []
    },
    {
      id: "inojin", name: "Inojin Yamanaka", jp: "山中 いのじん", clan: "Other",
      era: ["boruto"], title: "Team 10 (new) · Ink and Mind", aura: "none", gen: 7, x: 3225, y: 1440,
      bio: "Son of Sai and Ino. He combines his father's ink beasts with his mother's mind techniques.",
      jutsu: [["Super Beast Imitating Drawing", "Water", "Ninjutsu"], ["Mind Body Switch", "Yin-Yang", "Hiden"]], bijuu: []
    },
    {
      id: "konan", name: "Konan", jp: "小南", clan: "Other",
      era: ["naruto", "shippuden"], title: "Akatsuki · Angel of the Rain", aura: "none", gen: 4, x: 1960, y: 870,
      bio: "A war orphan of the Hidden Rain who trained under Jiraiya with Nagato and Yahiko. She co-founded Akatsuki and fights by turning her body into countless sheets of paper.",
      jutsu: [["Paper Shuriken", "All", "Ninjutsu"], ["Dance of the Shikigami", "All", "Ninjutsu"], ["Paper Person of God", "All", "Ninjutsu"]], bijuu: []
    },
    {
      id: "sasori", name: "Sasori", jp: "赤砂のサソリ", clan: "Other",
      era: ["naruto", "shippuden"], title: "Akatsuki · Sasori of the Red Sand", aura: "none", gen: 5, x: 360, y: 1060,
      bio: "A puppet master from the Hidden Sand who left his village and joined Akatsuki. He turned his own body into a puppet and fights with a collection of human puppets.",
      jutsu: [["Puppet Technique", "All", "Ninjutsu"], ["Human Puppet", "All", "Kinjutsu"], ["Iron Sand", "Earth", "Kekkei Genkai"]], bijuu: []
    },
    {
      id: "deidara", name: "Deidara", jp: "デイダラ", clan: "Other",
      era: ["naruto", "shippuden"], title: "Akatsuki · Explosion Artist", aura: "none", gen: 6, x: 200, y: 1250,
      image: "characters/dedara.webp",
      bio: "A rogue ninja from the Hidden Stone who joined Akatsuki. He sculpts explosive clay with the mouths on his palms and believes true art is a fleeting blast.",
      jutsu: [["Explosive Clay", "Earth", "Kekkei Genkai"], ["C4 Karura", "Earth", "Kekkei Genkai"], ["Clay Bird Flight", "Earth", "Ninjutsu"]], bijuu: []
    },
    {
      id: "hidan", name: "Hidan", jp: "飛段", clan: "Other",
      era: ["naruto", "shippuden"], title: "Akatsuki · Immortal of Jashin", aura: "none", gen: 6, x: 360, y: 1250,
      bio: "A rogue ninja from the Hidden Hot Water Village and devotee of Jashin. His ritual curse links his body to his victim's, and he cannot die from ordinary wounds.",
      jutsu: [["Jashin Curse Ritual", "Yin-Yang", "Kinjutsu"], ["Triple-Bladed Scythe", "All", "Taijutsu"]], bijuu: []
    },
    {
      id: "kisame", name: "Kisame Hoshigaki", jp: "干柿 鬼鮫", clan: "Other",
      era: ["naruto", "shippuden"], title: "Akatsuki · Tailless Tailed Beast", aura: "none", gen: 6, x: 520, y: 1250,
      image: "characters/kisume.webp",
      bio: "One of the Seven Ninja Swordsmen of the Mist and Itachi's Akatsuki partner. His living sword Samehada devours chakra, giving him vast reserves.",
      jutsu: [["Samehada", "All", "Kenjutsu"], ["Water Shark Bomb", "Water", "Ninjutsu"], ["Great Shark Water Prison", "Water", "Ninjutsu"]], bijuu: []
    },
    {
      id: "shikamaru", name: "Shikamaru Nara", jp: "奈良 シカマル", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "Strategist of the Leaf", aura: "none", gen: 6, x: 1450, y: 1250,
      bio: "A lazy-seeming genius of the Nara clan and Naruto's classmate. His shadow techniques and strategy make him the Leaf's top tactician and later the Hokage's adviser.",
      jutsu: [["Shadow Possession Jutsu", "Yin-Yang", "Hiden", "videos/shikamaru/shadow-prosession.mp4"], ["Shadow Neck Bind", "Yin-Yang", "Hiden"], ["Shadow Sewing", "Yin-Yang", "Hiden"]], bijuu: []
    },
    {
      id: "rocklee", name: "Rock Lee", jp: "ロック・リー", clan: "Other",
      era: ["naruto", "shippuden", "boruto"], title: "Master of Taijutsu", aura: "none", gen: 6, x: 1620, y: 1250,
      bio: "A Leaf ninja who cannot use ninjutsu or genjutsu, so he trained relentlessly in taijutsu alone. Neji's teammate and rival, famed for opening the Eight Gates.",
      jutsu: [["Leaf Hurricane", "All", "Taijutsu"], ["Primary Lotus", "All", "Taijutsu"], ["Eight Gates", "All", "Taijutsu", "videos/rocklee/8-gates.mp4"]], bijuu: []
    },
    {
      id: "yugito", name: "Yugito Nii", jp: "二位 ユギト", clan: "Other",
      era: ["shippuden"], title: "2-tails Jinchūriki", aura: "none", gen: 8, x: 400, y: 1630,
      image: "characters/Yugito.webp",
      bio: "Jinchūriki of Matatabi and a ninja of Kumogakure, captured by Akatsuki.",
      jutsu: [["Matatabi's Chakra", "Fire", "Bijuu"], ["Tailed Beast Ball", "All", "Bijuu"]], bijuu: ["matatabi"], compact: true
    },
    {
      id: "yagura", name: "Yagura", jp: "矢倉", clan: "Other",
      era: ["shippuden"], title: "Mizukage · 3-tails host", aura: "none", gen: 8, x: 700, y: 1630,
      bio: "The Fourth Mizukage, secretly under Madara's control and host of Isobu for many years.",
      jutsu: [["Water Release", "Water", "Ninjutsu"], ["Isobu's Chakra", "Water", "Bijuu"]], bijuu: ["isobu"], compact: true
    },
    {
      id: "roshi", name: "Rōshi", jp: "老紫", clan: "Other",
      era: ["shippuden"], title: "4-tails host", aura: "none", gen: 8, x: 1000, y: 1630,
      bio: "A wandering ninja of the Land of Earth who befriended and was bonded with Son Goku, the Four-Tails.",
      jutsu: [["Lava Release", "Fire", "Kekkei Genkai"], ["Son Goku's Chakra", "Earth", "Bijuu"]], bijuu: ["songoku"], compact: true
    },
    {
      id: "han", name: "Han", jp: "ハン", clan: "Other",
      era: ["shippuden"], title: "5-tails host", aura: "none", gen: 8, x: 1300, y: 1630,
      image: "characters/Han.webp",
      bio: "Elder brother of the Kazekage and host of Kokuo, the Five-Tails, who commanded the twin chakra natures of fire and water.",
      jutsu: [["Steam Release", "Water", "Kekkei Genkai"], ["Kokuo's Chakra", "Water", "Bijuu"]], bijuu: ["kokuo"], compact: true
    },
    {
      id: "utakata", name: "Utakata", jp: "ウタカタ", clan: "Other",
      era: ["shippuden"], title: "6-tails host", aura: "none", gen: 8, x: 1600, y: 1630,
      bio: "A gentle ninja of Kirigakure and host of Saiken, the Six-Tails, whose bubbles dissolve anything they touch.",
      jutsu: [["Soap Bubble Ninjutsu", "Water", "Ninjutsu"], ["Saiken's Chakra", "Water", "Bijuu"]], bijuu: ["saiken"], compact: true
    },
    {
      id: "fu", name: "Fū", jp: "フウ", clan: "Other",
      era: ["shippuden"], title: "7-tails host", aura: "none", gen: 8, x: 1900, y: 1630,
      bio: "A young ninja of Takigakure who carried Chōmei, the Seven-Tails, and could manipulate wind with remarkable grace.",
      jutsu: [["Wind Release", "Wind", "Ninjutsu"], ["Chōmei's Chakra", "Wind", "Bijuu"]], bijuu: ["chomei"], compact: true
    }
  ],

  /* Bijuu nodes. `x,y` place them in the spirit band below the tree. */
  bijuu: [
    { id: "shukaku", name: "Shukaku", jp: "一尾 守鶴", tails: 1, nature: "Wind", x: 300, y: 1850, color: "#C9A227",
      abilities: ["Sand Manipulation", "Wind Release", "Tailed Beast Ball", "Sand Shield"],
      jinchuriki: ["gaara"], lore: "A mischievous tanuki spirit of sand sealed into the youngest Kazekage's son." },
    { id: "matatabi", name: "Matatabi", jp: "二尾 又旅", tails: 2, nature: "Fire", x: 560, y: 1850, color: "#C0563A",
      abilities: ["Blue Flames", "Fire Release", "Tailed Beast Ball"],
      jinchuriki: ["yugito"], lore: "A two-tailed cat spirit wreathed in blue flames that devour chakra." },
    { id: "isobu", name: "Isobu", jp: "三尾 磯撫", tails: 3, nature: "Water", x: 820, y: 1850, color: "#4A78A8",
      abilities: ["Water Release", "Shell Defence", "Tailed Beast Ball"],
      jinchuriki: ["rin", "yagura"], lore: "A three-tailed turtle spirit dwelling in the lakes of the Land of Water." },
    { id: "songoku", name: "Son Goku", jp: "四尾 孫悟空", tails: 4, nature: "Earth / Lava", x: 1080, y: 1850, color: "#8A6A46",
      image: "characters/son.webp",
      abilities: ["Lava Release", "Earth Release", "Tailed Beast Ball"],
      jinchuriki: ["roshi"], lore: "A hot-tempered ape spirit whose lava burns hotter than any ordinary flame." },
    { id: "kokuo", name: "Kokuo", jp: "五尾 穆王", tails: 5, nature: "Water / Fire", x: 1340, y: 1850, color: "#7B8C9B",
      abilities: ["Steam Release", "Horn Charge", "Tailed Beast Ball"],
      jinchuriki: ["han"], lore: "A five-tailed horse spirit that wields the steam of two opposing chakra natures." },
    { id: "saiken", name: "Saiken", jp: "六尾 犀犬", tails: 6, nature: "Water", x: 1600, y: 1850, color: "#5CA0A8",
      abilities: ["Corrosive Bubbles", "Alkaline Mist", "Tailed Beast Ball"],
      jinchuriki: ["utakata"], lore: "A six-tailed slug spirit whose acidic bubbles dissolve chakra barriers." },
    { id: "chomei", name: "Chōmei", jp: "七尾 重明", tails: 7, nature: "Wind", x: 1860, y: 1850, color: "#A9A24B",
      abilities: ["Wind Release", "Dust Cloud", "Tailed Beast Ball", "Flight"],
      jinchuriki: ["fu"], lore: "A seven-tailed beetle spirit capable of flight and powder-blindness." },
    { id: "gyuki", name: "Gyūki", jp: "八尾 牛鬼", tails: 8, nature: "Water / Ink", x: 2120, y: 1850, color: "#6A5B8C",
      abilities: ["Ink Manipulation", "Tentacle Arms", "Tailed Beast Ball", "Lava Release"],
      jinchuriki: ["killer_b"], lore: "An eight-tailed octopus-cow spirit bound to the rapper of Cloud Village." },
    { id: "kurama", name: "Kurama", jp: "九尾 九喇嘛", tails: 9, nature: "Wind / Chakra", x: 2380, y: 1850, color: "#C9922B",
      image: "characters/kurama.webp",
      abilities: ["Tailed Beast Ball", "Chakra Cloak", "Wind Release", "Bijuu Bomb barrage"],
      jinchuriki: ["mito", "kushina", "naruto", "himawari"], lore: "The nine-tailed fox, once feared as the most destructive of the Bijuu, now Naruto's closest ally." },
    { id: "juubi", name: "Ten-Tails (Jūbi)", jp: "十尾", tails: 10, nature: "All Chakra", x: 2640, y: 1850, color: "#9B4C6E",
      video: "videos/TAIL-BEAST/10.mp4",
      abilities: ["Tailed Beast Ball", "Wood Release", "Infinite Tsukuyomi", "Truth-Seeking Balls"],
      jinchuriki: ["madara", "obito"], lore: "The primordial chakra tree spirit from which all nine Bijuu were split. Its complete form heralds the Infinite Tsukuyomi." }
  ],

  /* Relationships --------------------------------------------------------- */
  /* Special weapons & ninja tools. owners = character ids on the tree.
     Artwork (optional): weapons/<id>.png|webp|jpg, or image: "path".
     Clip (optional): videos/<owner>/<owner>-<word>.mp4 or clip: "path". */
  weapons: [
    { id: "samehada", name: "Samehada", jp: "鮫肌", type: "Sword", owners: ["kisame", "killer_b"],
      image: "weapons/samahada.png",
      ability: "Absorbs and devours chakra",
      lore: "One of the Seven Swords of the Mist. A living, scale-covered blade that shaves and eats its target's chakra, feeding it to the wielder it accepts." },
    { id: "kusanagi", name: "Sword of Kusanagi", jp: "草薙の剣", type: "Sword", owners: ["sasuke", "orochimaru"],
      ability: "Cuts almost anything; channels Lightning chakra",
      lore: "A straight blade that can extend and cut through nearly any material. Sasuke's version is a chokutō he charges with Chidori." },
    { id: "totsuka", name: "Totsuka Blade", jp: "十拳剣", type: "Spirit Sword", owners: ["itachi"],
      ability: "Seals anyone it pierces into an eternal genjutsu",
      lore: "An ethereal sword held by Itachi's Susanoo. Whoever it stabs is drawn into a sake jar and trapped in a dream world forever." },
    { id: "yata", name: "Yata Mirror", jp: "八咫鏡", type: "Spirit Shield", owners: ["itachi"],
      ability: "Changes its nature to nullify any attack",
      lore: "The shield of Itachi's Susanoo. Paired with the Totsuka Blade, it made him almost invincible." },
    { id: "scythe", name: "Triple-Bladed Scythe", jp: "三刃の大鎌", type: "Scythe", owners: ["hidan"],
      ability: "Draws blood for the Jashin curse ritual",
      lore: "A huge red three-bladed scythe on a long cable. One drop of the enemy's blood is all Hidan needs to begin his curse." },
    { id: "gunbai", name: "Uchiha Gunbai", jp: "うちはの軍配", type: "War Fan", owners: ["madara"],
      ability: "Reflects attacks back at the user",
      lore: "The Uchiha clan's war fan. Madara uses it to block jutsu and send them straight back, and to fan flames into firestorms." },
    { id: "kunai_ftg", name: "Flying Thunder God Kunai", jp: "飛雷神のクナイ", type: "Kunai", owners: ["minato", "tobirama"],
      clip: "videos/minato/kanai.mp4",
      ability: "Marks a point to teleport to instantly",
      lore: "Three-pronged kunai inscribed with a space-time formula. The user can teleport to any marked kunai in an instant." },
    { id: "truth_balls", name: "Truth-Seeking Balls", jp: "求道玉", type: "Chakra Orbs", owners: ["hagoromo", "naruto", "obito", "madara"],
      ability: "Shape-shifting orbs of all five natures plus Yin-Yang",
      lore: "Black orbs that float behind a Six Paths user. They can become shields, staves or projectiles and erase ninjutsu they touch." },
    { id: "enma_staff", name: "Adamantine Staff", jp: "金剛如意", type: "Staff", owners: ["hiruzen"],
      image: "weapons/adamatine.png",
      ability: "An unbreakable staff that can stretch and multiply",
      lore: "The Monkey King Enma transforms into this staff for the Third Hokage. It is nearly indestructible and can extend or split into many staves." },
    { id: "temari_fan", name: "Temari's War Fan", jp: "鉄扇", type: "War Fan", owners: ["temari"],
      image: "weapons/war-fan.png",
      ability: "Unleashes cutting wind with a single swing",
      lore: "A giant iron fan marked with moons. Opening more of them powers up Temari's wind techniques." },
    { id: "tenten_scrolls", name: "Weapon Summoning Scrolls", jp: "口寄せの巻物", type: "Ninja Tool", owners: ["tenten"],
      image: "weapons/summoning-scroll.png",
      ability: "Summons an endless rain of blades",
      lore: "Twin scrolls that Tenten unrolls around herself to call up kunai, swords and maces in mid-air." },
    { id: "gourd", name: "Sand Gourd", jp: "瓢箪", type: "Ninja Tool", owners: ["gaara"],
      ability: "Holds chakra-infused sand for defence and attack",
      lore: "The huge gourd Gaara carries on his back. Its sand moves on its own to shield him and can crush his enemies." },
    { id: "chakra_blades", name: "Chakra Blades", jp: "チャクラ刀", type: "Trench Knives", owners: ["asuma", "shikamaru"],
      clip: "videos/shikamaru/chakra-blade.mp4",
      ability: "Extend a cutting edge of Wind chakra",
      lore: "Trench knives made from chakra-conducting metal, inherited from Shikamaru's sensei. Wind chakra makes their edge far longer and sharper." },
    { id: "white_sabre", name: "White Light Chakra Sabre", jp: "白光のチャクラ刀", type: "Short Sword", owners: ["kakashi"],
      ability: "Glows white with the user's chakra",
      lore: "The tantō of Kakashi's father, the White Fang of the Leaf. Kakashi carried it in his early ANBU years." },
    { id: "clay", name: "Explosive Clay", jp: "起爆粘土", type: "Ninja Tool", owners: ["deidara"],
      ability: "Sculptures that fly, hunt and detonate",
      lore: "Clay chewed by the mouths on Deidara's palms and moulded into birds, spiders and bombs, then detonated with his signature cry." },
    { id: "seven_swords_b", name: "Seven Swords Style", jp: "七本刀", type: "Swords", owners: ["killer_b"],
      ability: "Seven blades wielded at once",
      lore: "Killer B's unique style: seven swords held in his hands, armpits, neck and mouth, swung in unpredictable rhythm." },
    { id: "kote", name: "Scientific Ninja Gauntlet", jp: "科学忍具", type: "Ninja Tool", owners: ["boruto"],
      ability: "Fires stored jutsu from scrolls",
      lore: "A gauntlet that releases jutsu stored in cartridge scrolls. Its use in the Chūnin Exams was controversial." }
  ],

  links: [
    { t: "parent", p: "kaguya", c: "hagoromo" },
    { t: "parent", p: "kaguya", c: "hamura" },
    { t: "parent", p: "hagoromo", c: "indra" },
    { t: "parent", p: "hagoromo", c: "asura" },
    { t: "parent", p: "hamura", c: "moon_main" },
    { t: "parent", p: "hamura", c: "moon_side" },
    { t: "parent", p: "hamura", c: "hyuga_elder" },
    { t: "parent", p: "moon_main", c: "toneri" },
    { t: "parent", p: "indra", c: "tajima" },
    { t: "parent", p: "tajima", c: "madara" },
    { t: "parent", p: "tajima", c: "izuna" },
    { t: "parent", p: "tajima", c: "kagami" },
    { t: "parent", p: "kagami", c: "shisui" },
    { t: "parent", p: "kagami", c: "fugaku" },
    { t: "parent", p: "fugaku", c: "itachi" },
    { t: "parent", p: "fugaku", c: "sasuke" },
    { t: "parent", p: "mikoto", c: "itachi" },
    { t: "parent", p: "mikoto", c: "sasuke" },
    { t: "parent", p: "asura", c: "butsuma" },
    { t: "parent", p: "asura", c: "ashina" },
    { t: "parent", p: "asura", c: "fuso" },
    { t: "parent", p: "butsuma", c: "hashirama" },
    { t: "parent", p: "butsuma", c: "tobirama" },
    { t: "parent", p: "butsuma", c: "itama" },
    { t: "parent", p: "ashina", c: "mito" },
    { t: "parent", p: "ashina", c: "kushina" },
    { t: "parent", p: "fuso", c: "nagato" },
    { t: "parent", p: "hashirama", c: "tsunade" },
    { t: "parent", p: "mito", c: "tsunade" },
    { t: "parent", p: "minato", c: "naruto" },
    { t: "parent", p: "kushina", c: "naruto" },
    { t: "parent", p: "hiashi", c: "hinata" },
    { t: "parent", p: "hiashi", c: "hanabi" },
    { t: "parent", p: "hizashi", c: "neji" },
    { t: "parent", p: "sasuke", c: "sarada" },
    { t: "parent", p: "sakura", c: "sarada" },
    { t: "parent", p: "naruto", c: "boruto" },
    { t: "parent", p: "naruto", c: "himawari" },
    { t: "parent", p: "hinata", c: "boruto" },
    { t: "parent", p: "hinata", c: "himawari" },
    { t: "parent", p: "orochimaru", c: "mitsuki" },

    { t: "spouse", a: "hashirama", b: "mito" },
    { t: "spouse", a: "fugaku", b: "mikoto" },
    { t: "spouse", a: "minato", b: "kushina" },
    { t: "spouse", a: "sasuke", b: "sakura" },
    { t: "spouse", a: "naruto", b: "hinata" },

    { t: "reinc", chain: ["indra", "madara", "sasuke"] },
    { t: "reinc", chain: ["asura", "hashirama", "naruto"] },

    { t: "sensei", s: "jiraiya", d: "nagato" },
    { t: "sensei", s: "jiraiya", d: "minato" },
    { t: "sensei", s: "jiraiya", d: "naruto" },
    { t: "sensei", s: "minato", d: "kakashi" },
    { t: "sensei", s: "minato", d: "obito" },
    { t: "sensei", s: "minato", d: "rin" },
    { t: "sensei", s: "kakashi", d: "naruto" },
    { t: "sensei", s: "kakashi", d: "sasuke" },
    { t: "sensei", s: "kakashi", d: "sakura" },
    { t: "sensei", s: "tsunade", d: "sakura" },
    { t: "sensei", s: "killer_b", d: "naruto" },
    { t: "sensei", s: "jiraiya", d: "konan" },
    { t: "parent", p: "hiruzen", c: "asuma" },
    { t: "parent", p: "rasa", c: "gaara" },
    { t: "sensei", s: "tobirama", d: "hiruzen" },
    { t: "sensei", s: "tobirama", d: "danzo" },
    { t: "sensei", s: "hiruzen", d: "jiraiya" },
    { t: "sensei", s: "hiruzen", d: "tsunade" },
    { t: "sensei", s: "hiruzen", d: "orochimaru" },
    { t: "sensei", s: "asuma", d: "shikamaru" },
    { t: "sensei", s: "asuma", d: "choji" },
    { t: "spouse", a: "shikamaru", b: "temari" },
    { t: "spouse", a: "sai", b: "ino" },
    { t: "spouse", a: "choji", b: "karui" },
    { t: "spouse", a: "asuma", b: "kurenai" },
    { t: "parent", p: "rasa", c: "temari" },
    { t: "parent", p: "rasa", c: "kankuro" },
    { t: "parent", p: "shikamaru", c: "shikadai" },
    { t: "parent", p: "temari", c: "shikadai" },
    { t: "parent", p: "sai", c: "inojin" },
    { t: "parent", p: "ino", c: "inojin" },
    { t: "parent", p: "choji", c: "chocho" },
    { t: "parent", p: "karui", c: "chocho" },
    { t: "parent", p: "rocklee", c: "metal_lee" },
    { t: "parent", p: "asuma", c: "mirai" },
    { t: "parent", p: "kurenai", c: "mirai" },
    { t: "sensei", s: "guy", d: "rocklee" },
    { t: "sensei", s: "guy", d: "neji" },
    { t: "sensei", s: "guy", d: "tenten" },
    { t: "sensei", s: "kurenai", d: "hinata" },
    { t: "sensei", s: "kurenai", d: "kiba" },
    { t: "sensei", s: "kurenai", d: "shino" },
    { t: "sensei", s: "asuma", d: "ino" },
    { t: "sensei", s: "orochimaru", d: "sasuke" },
    { t: "sensei", s: "orochimaru", d: "kabuto" },
    { t: "sensei", s: "danzo", d: "sai" },

    /* Sand family and the wider teacher lines */
    { t: "spouse", a: "rasa", b: "karura" },
    { t: "parent", p: "karura", c: "temari" },
    { t: "parent", p: "karura", c: "kankuro" },
    { t: "parent", p: "karura", c: "gaara" },
    { t: "parent", p: "gaara", c: "shinki" },
    { t: "sensei", s: "chiyo", d: "sasori" },
    { t: "sensei", s: "chiyo", d: "sakura" },
    { t: "sensei", s: "jiraiya", d: "yahiko" },
    { t: "sensei", s: "orochimaru", d: "kimimaro" },
    { t: "sensei", s: "tsunade", d: "shizune" },
    { t: "spouse", a: "tsunade", b: "dan" },
    { t: "parent", p: "hashirama", c: "nawaki" },
    { t: "parent", p: "mito", c: "nawaki" },

    /* Sasuke's Hebi / Taka team */
    { t: "team", a: "sasuke", b: "karin" },
    { t: "team", a: "sasuke", b: "suigetsu" },
    { t: "team", a: "sasuke", b: "juugo" },
    { t: "team", a: "karin", b: "suigetsu" },
    { t: "team", a: "karin", b: "juugo" },
    { t: "team", a: "suigetsu", b: "juugo" },

    /* Akatsuki partnerships */
    { t: "team", a: "zetsu", b: "obito" },
    { t: "team", a: "zetsu", b: "madara" },
    { t: "team", a: "hidan", b: "kakuzu" },
    { t: "team", a: "itachi", b: "kisame" },
    { t: "team", a: "sasori", b: "deidara" },
    { t: "team", a: "nagato", b: "konan" }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = WORLD;
