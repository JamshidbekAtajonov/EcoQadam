export type LessonCategory = "WATER" | "DROUGHT" | "TREE_CARE" | "WASTE" | "AIR";

export type DemoLesson = {
  slug: string;
  category: LessonCategory;
  titleUz: string;
  titleEn: string;
  summaryUz: string;
  summaryEn: string;
  contentUz: string[];
  contentEn: string[];
  taskUz: string;
  taskEn: string;
  duration: number;
  progress: number;
  factValue: string;
  factUz: string;
  factEn: string;
};

export const demoLessons: DemoLesson[] = [
  {
    slug: "har-bir-tomchi-qadrli",
    category: "WATER",
    titleUz: "Har bir tomchi qadrli",
    titleEn: "Every drop matters",
    summaryUz: "Uyda va maktabda suvni tejashning oddiy, ammo kuchli usullari.",
    summaryEn: "Simple but powerful ways to save water at home and school.",
    contentUz: [
      "Xorazm quruq iqlimli hudud. Biz foydalanadigan suvning katta qismi Amudaryodan keladi, shu sabab har bir litrni oqilona ishlatish muhim.",
      "Tish yuvayotganda kranni yopish, sizib turgan jo‘mrak haqida kattalarga aytish va o‘simliklarni ertalab yoki kechqurun sug‘orish — eng oson qadamlar.",
    ],
    contentEn: [
      "Khorazm has a dry climate. Much of the water we use comes from the Amu Darya, so using every liter wisely matters.",
      "Turn off the tap while brushing, report leaking faucets, and water plants early or late in the day.",
    ],
    taskUz: "Bugun tish yuvayotganda kranni yoping va qancha vaqt suv oqmaganini o‘lchang.",
    taskEn: "Turn off the tap while brushing today and measure how long the water stayed off.",
    duration: 8,
    progress: 65,
    factValue: "15 L",
    factUz: "Bir kunda tejash mumkin",
    factEn: "Can be saved in one day",
  },
  {
    slug: "qurgoqchilikni-tushunamiz",
    category: "DROUGHT",
    titleUz: "Qurg‘oqchilikni tushunamiz",
    titleEn: "Understanding drought",
    summaryUz: "Qurg‘oqchilik nima va unga jamoa sifatida qanday moslashamiz?",
    summaryEn: "What drought is and how communities can adapt together.",
    contentUz: [
      "Qurg‘oqchilik — uzoq vaqt davomida yog‘in me’yordan kam bo‘lib, suv zaxiralari kamayadigan davr.",
      "Suvni qayta ishlatish, tuproq namligini saqlash va mahalliy sharoitga mos o‘simliklarni tanlash moslashuvning muhim usullaridir.",
    ],
    contentEn: [
      "Drought is a long period with less precipitation than normal, reducing available water.",
      "Reusing water, retaining soil moisture, and choosing locally adapted plants are key responses.",
    ],
    taskUz: "Maktab hovlisida suv tez bug‘lanadigan bitta joyni toping va yechim yozing.",
    taskEn: "Find one place in the schoolyard where water evaporates quickly and suggest a solution.",
    duration: 9,
    progress: 20,
    factValue: "2×",
    factUz: "Mulcha namlikni uzoqroq saqlaydi",
    factEn: "Mulch keeps moisture longer",
  },
  {
    slug: "yosh-daraxtga-gamxorlik",
    category: "TREE_CARE",
    titleUz: "Yosh daraxtga g‘amxo‘rlik",
    titleEn: "Caring for a young tree",
    summaryUz: "Daraxtning dastlabki yillarda yashab qolishiga yordam bering.",
    summaryEn: "Help a tree survive its crucial first years.",
    contentUz: [
      "Yangi ekilgan daraxt muntazam, ammo me’yorida sug‘orilishi kerak. Suvni tanaga emas, ildiz atrofidagi tuproqqa quying.",
      "Barg rangi, singan shoxlar, zararkunandalar va tuproq namligini har hafta kuzatish muammoni erta aniqlashga yordam beradi.",
    ],
    contentEn: [
      "A newly planted tree needs regular but measured watering. Apply water to the soil around the roots.",
      "Check leaf color, broken branches, pests, and soil moisture weekly to spot problems early.",
    ],
    taskUz: "Bitta daraxt tanlang, holatini suratga oling va barglari hamda tuprog‘ini tekshiring.",
    taskEn: "Choose one tree, photograph it, and inspect its leaves and soil.",
    duration: 10,
    progress: 0,
    factValue: "30 kun",
    factUz: "Dastlabki monitoring davri",
    factEn: "Initial monitoring period",
  },
  {
    slug: "aqlli-sugorish",
    category: "WATER",
    titleUz: "Aqlli sug‘orish",
    titleEn: "Smart irrigation",
    summaryUz: "Issiq iqlimda o‘simliklarga suvni to‘g‘ri vaqtda yetkazing.",
    summaryEn: "Deliver water to plants at the right time in a hot climate.",
    contentUz: [
      "Kunning eng issiq paytida sug‘orilgan suv tez bug‘lanadi. Ertalab yoki quyosh botgandan keyin sug‘orish samaraliroq.",
      "Tomchilatib sug‘orish suvni sekin, to‘g‘ridan-to‘g‘ri ildizga beradi va ortiqcha oqimni kamaytiradi.",
    ],
    contentEn: [
      "Water applied during the hottest hours evaporates quickly. Early morning or evening is more efficient.",
      "Drip irrigation delivers water slowly to roots and reduces runoff.",
    ],
    taskUz: "Bir o‘simlik uchun oddiy teshikli idishdan tomchilatish tajribasini rejalashtiring.",
    taskEn: "Plan a simple bottle-drip experiment for one plant.",
    duration: 7,
    progress: 0,
    factValue: "50%",
    factUz: "Suv sarfini kamaytirishi mumkin",
    factEn: "Potential water reduction",
  },
  {
    slug: "chiqindini-ajratamiz",
    category: "WASTE",
    titleUz: "Chiqindini ajratamiz",
    titleEn: "Let’s sort waste",
    summaryUz: "Qog‘oz, plastik va organik chiqindini to‘g‘ri ajrating.",
    summaryEn: "Separate paper, plastic, and organic waste correctly.",
    contentUz: [
      "Chiqindini manbada ajratish qayta ishlashni osonlashtiradi. Idishlarni bo‘shatib, imkon qadar toza holda tegishli qutiga soling.",
      "Eng yaxshi chiqindi — umuman hosil bo‘lmagan chiqindi. Bir martalik buyum o‘rniga qayta ishlatiladiganini tanlang.",
    ],
    contentEn: [
      "Sorting waste at the source makes recycling easier. Empty containers and place them in the right bin.",
      "The best waste is waste not created. Choose reusable items over disposable ones.",
    ],
    taskUz: "Bugungi chiqindilaringizni uch guruhga ajratib, og‘irligini yozib oling.",
    taskEn: "Sort today’s waste into three groups and record the weight.",
    duration: 8,
    progress: 100,
    factValue: "3 tur",
    factUz: "Ajratishni boshlash uchun yetarli",
    factEn: "Enough categories to begin",
  },
  {
    slug: "toza-havo-uchun",
    category: "AIR",
    titleUz: "Toza havo uchun",
    titleEn: "For cleaner air",
    summaryUz: "Havo sifatiga ta’sir qiladigan kundalik odatlarni biling.",
    summaryEn: "Understand daily habits that affect air quality.",
    contentUz: [
      "Transport, chiqindi yoqish va chang havoning sifatini pasaytiradi. Bu ayniqsa bolalar va keksalarning sog‘lig‘iga ta’sir qiladi.",
      "Yaqin masofaga piyoda yurish, chiqindi yoqmaslik va yashil hududlarni asrash toza havoga hissa qo‘shadi.",
    ],
    contentEn: [
      "Transport, waste burning, and dust lower air quality, especially affecting children and older people.",
      "Walking short distances, avoiding waste burning, and protecting green spaces all help.",
    ],
    taskUz: "Maktab atrofida havo sifatiga ta’sir qiladigan ikki manbani belgilang.",
    taskEn: "Identify two sources near school that may affect air quality.",
    duration: 7,
    progress: 0,
    factValue: "1 km",
    factUz: "Piyoda yurish uchun qulay masofa",
    factEn: "A walkable distance",
  },
];

export type DemoQuestion = {
  id: string;
  topic: LessonCategory;
  lessonSlug: string;
  promptUz: string;
  promptEn: string;
  optionsUz: [string, string, string, string];
  optionsEn: [string, string, string, string];
  correctIndex: number;
  explanationUz: string;
  explanationEn: string;
};

const q = (
  id: string, topic: LessonCategory, lessonSlug: string, promptUz: string, promptEn: string,
  optionsUz: [string, string, string, string], optionsEn: [string, string, string, string],
  correctIndex: number, explanationUz: string, explanationEn: string,
): DemoQuestion => ({ id, topic, lessonSlug, promptUz, promptEn, optionsUz, optionsEn, correctIndex, explanationUz, explanationEn });

export const demoQuestions: DemoQuestion[] = [
  q("q01", "WATER", "har-bir-tomchi-qadrli", "Tish yuvayotganda suvni qanday tejash mumkin?", "How can you save water while brushing?", ["Kranni yopish", "Suvni tezroq oqizish", "Issiq suv ishlatish", "Ikki kranni ochish"], ["Turn off the tap", "Increase the flow", "Use hot water", "Open two taps"], 0, "Kranni yopish bir necha litr suvni tejaydi.", "Turning off the tap saves several liters."),
  q("q02", "WATER", "har-bir-tomchi-qadrli", "Sizib turgan jo‘mrakni ko‘rsangiz nima qilasiz?", "What should you do about a leaking tap?", ["E’tibor bermayman", "Kattalarga xabar beraman", "Uni ochiq qoldiraman", "Ustiga mato qo‘yaman"], ["Ignore it", "Report it to an adult", "Leave it open", "Cover it with cloth"], 1, "Nosozlikni tez tuzatish doimiy isrofni to‘xtatadi.", "Quick repair stops continuous waste."),
  q("q03", "WATER", "har-bir-tomchi-qadrli", "Bir chelak suv qaysi ishda qayta ishlatilishi mumkin?", "How can a bucket of lightly used water be reused?", ["Ichish uchun", "O‘simlik sug‘orish uchun", "Daryoga quyish uchun", "Havoga sepish uchun"], ["For drinking", "For watering plants", "Pouring into a river", "Spraying into the air"], 1, "Zararsiz kulrang suv ayrim o‘simliklarga ishlatilishi mumkin.", "Safe greywater can be reused for some plants."),
  q("q04", "WATER", "har-bir-tomchi-qadrli", "Suv sarfini bilishning eng yaxshi yo‘li?", "What is the best way to know water use?", ["Taxmin qilish", "O‘lchash va yozish", "Boshqalardan so‘rash", "Kranni kattaroq ochish"], ["Guess", "Measure and record", "Ask someone", "Open the tap wider"], 1, "O‘lchangan ma’lumot o‘zgarishni ko‘rsatadi.", "Measured data shows change."),
  q("q05", "WATER", "har-bir-tomchi-qadrli", "Xorazmda suvni tejash nega muhim?", "Why is saving water important in Khorazm?", ["Yog‘in juda ko‘p", "Hudud quruq va suv cheklangan", "Suv ishlatilmaydi", "Faqat qishda kerak"], ["It rains constantly", "The region is dry and water is limited", "Water is unused", "It is only needed in winter"], 1, "Quruq iqlimda mavjud suvni oqilona ishlatish zarur.", "A dry climate requires careful water use."),
  q("q06", "DROUGHT", "qurgoqchilikni-tushunamiz", "Qurg‘oqchilik nima?", "What is drought?", ["Bir kunlik issiq", "Uzoq muddat yog‘in kamligi", "Kuchli shamol", "Faqat qor yog‘ishi"], ["One hot day", "A long period of low precipitation", "Strong wind", "Only snowfall"], 1, "Qurg‘oqchilik uzoq davom etadigan suv tanqisligi bilan bog‘liq.", "Drought involves prolonged water shortage."),
  q("q07", "DROUGHT", "qurgoqchilikni-tushunamiz", "Mulcha qanday yordam beradi?", "How does mulch help?", ["Tuproqni quritadi", "Namlikni saqlaydi", "Suvni ifloslaydi", "Ildizni kesadi"], ["Dries soil", "Retains moisture", "Pollutes water", "Cuts roots"], 1, "Mulcha bug‘lanishni kamaytiradi.", "Mulch reduces evaporation."),
  q("q08", "DROUGHT", "qurgoqchilikni-tushunamiz", "Moslashuv uchun qaysi o‘simlik ma’qul?", "Which plant is best for adaptation?", ["Mahalliy quruqlikka chidamli", "Faqat tropik", "Ko‘p suv talab qiladigan", "Ildizsiz"], ["Locally drought-tolerant", "Only tropical", "Water-intensive", "Rootless"], 0, "Mahalliy turlar sharoitga yaxshiroq moslashadi.", "Local species are better adapted."),
  q("q09", "DROUGHT", "qurgoqchilikni-tushunamiz", "Qurg‘oqchilikda birinchi qadam?", "What is a first drought response?", ["Suv sarfini kamaytirish", "Ko‘proq oqizish", "Chiqindi yoqish", "Barcha daraxtni kesish"], ["Reduce water use", "Use more water", "Burn waste", "Cut all trees"], 0, "Tejamkorlik mavjud zaxirani uzoqroq saqlaydi.", "Conservation makes reserves last longer."),
  q("q10", "DROUGHT", "qurgoqchilikni-tushunamiz", "Tuproq namligini qachon tekshirish kerak?", "When should soil moisture be checked?", ["Faqat yomg‘irda", "Sug‘orishdan oldin", "Hech qachon", "Daraxt qurigandan keyin"], ["Only in rain", "Before watering", "Never", "After the tree dies"], 1, "Oldindan tekshirish ortiqcha sug‘orishni oldini oladi.", "Checking first prevents overwatering."),
  q("q11", "TREE_CARE", "yosh-daraxtga-gamxorlik", "Yosh daraxtga suv qayerga quyiladi?", "Where should a young tree be watered?", ["Barg ustiga", "Ildiz atrofidagi tuproqqa", "Yo‘lga", "Tanasi tepasiga"], ["On leaves", "Soil around roots", "On the road", "Top of trunk"], 1, "Ildiz suvni tuproqdan oladi.", "Roots absorb water from soil."),
  q("q12", "TREE_CARE", "yosh-daraxtga-gamxorlik", "Qaysi belgi e’tibor talab qiladi?", "Which sign needs attention?", ["Yashil barg", "So‘lib qolgan barg", "Nam tuproq", "Yangi kurtak"], ["Green leaf", "Wilted leaf", "Moist soil", "New bud"], 1, "So‘lish suv yoki ildiz muammosini ko‘rsatishi mumkin.", "Wilting may signal water or root problems."),
  q("q13", "TREE_CARE", "yosh-daraxtga-gamxorlik", "Monitoringda nima qayd etiladi?", "What should monitoring record?", ["Faqat daraxt nomi", "Sana, holat va surat", "Faqat ob-havo", "O‘quvchi bahosi"], ["Only tree name", "Date, condition, and photo", "Only weather", "Student grade"], 1, "Bir xil ma’lumot vaqt bo‘yicha taqqoslanadi.", "Consistent data enables comparison over time."),
  q("q14", "TREE_CARE", "yosh-daraxtga-gamxorlik", "Daraxtni qancha tez-tez kuzatish ma’qul?", "How often should a young tree be checked?", ["Muntazam, kamida haftalik", "Besh yilda bir", "Faqat ekilgan kuni", "Hech qachon"], ["Regularly, at least weekly", "Every five years", "Only when planted", "Never"], 0, "Muntazam tekshiruv muammoni erta topadi.", "Regular checks catch issues early."),
  q("q15", "TREE_CARE", "yosh-daraxtga-gamxorlik", "DEAD holati nimani bildiradi?", "What does DEAD status mean?", ["Daraxt sog‘lom", "Daraxt yashab qolmagan", "Sug‘orildi", "Yangi ekildi"], ["Tree is healthy", "Tree did not survive", "It was watered", "It was newly planted"], 1, "Bu holat yashab qolish hisobiga kirmaydi.", "This status is excluded from survival."),
  q("q16", "WATER", "aqlli-sugorish", "Sug‘orish uchun eng samarali vaqt?", "What is the most efficient watering time?", ["Tush payti", "Ertalab yoki kechqurun", "Eng issiq payt", "Faqat shamolda"], ["Noon", "Morning or evening", "Hottest hour", "Only when windy"], 1, "Salqin paytda bug‘lanish kam bo‘ladi.", "Evaporation is lower in cooler hours."),
  q("q17", "WATER", "aqlli-sugorish", "Tomchilatib sug‘orishning afzalligi?", "What is a benefit of drip irrigation?", ["Suvni ildizga sekin beradi", "Butun yo‘lni ho‘llaydi", "Suvni bug‘latadi", "Ildizni quritadi"], ["Slowly delivers water to roots", "Wets the road", "Evaporates water", "Dries roots"], 0, "To‘g‘ridan-to‘g‘ri yetkazish isrofni kamaytiradi.", "Direct delivery reduces waste."),
  q("q18", "WATER", "aqlli-sugorish", "Ortiqcha sug‘orish nimaga olib keladi?", "What can overwatering cause?", ["Ildiz muammosiga", "Doim tez o‘sishga", "Havo tozalanishiga", "Chiqindi kamayishiga"], ["Root problems", "Always faster growth", "Cleaner air", "Less waste"], 0, "Haddan tashqari suv ildizga zarar berishi mumkin.", "Too much water can harm roots."),
  q("q19", "WATER", "aqlli-sugorish", "Sug‘orishdan oldin nima tekshiriladi?", "What should be checked before watering?", ["Tuproq namligi", "Plastik turi", "Havo rangi", "Daraxt raqami"], ["Soil moisture", "Plastic type", "Air color", "Tree number"], 0, "Nam tuproqqa yana suv kerak bo‘lmasligi mumkin.", "Moist soil may not need more water."),
  q("q20", "WATER", "aqlli-sugorish", "Ochiq chelakdagi suvga nima bo‘ladi?", "What happens to water in an open bucket?", ["Bug‘lanishi mumkin", "Ko‘payadi", "Muzlaydi", "Tuproqqa aylanadi"], ["It may evaporate", "It increases", "It freezes", "It becomes soil"], 0, "Issiqda ochiq suv tezroq bug‘lanadi.", "Open water evaporates faster in heat."),
  q("q21", "WASTE", "chiqindini-ajratamiz", "Qog‘oz qaysi guruhga kiradi?", "Which group does paper belong to?", ["Qayta ishlanadigan", "Suyuq", "Metall bo‘lmagan havo", "Tibbiy"], ["Recyclable", "Liquid", "Non-metal air", "Medical"], 0, "Toza qog‘oz qayta ishlanishi mumkin.", "Clean paper can be recycled."),
  q("q22", "WASTE", "chiqindini-ajratamiz", "Idishni qutiga solishdan oldin nima qilish kerak?", "What should you do before binning a container?", ["Bo‘shatish", "Suv bilan to‘ldirish", "Yoqish", "Ko‘chaga tashlash"], ["Empty it", "Fill with water", "Burn it", "Throw it outside"], 0, "Bo‘sh va toza idish saralashni osonlashtiradi.", "An empty, clean container is easier to sort."),
  q("q23", "WASTE", "chiqindini-ajratamiz", "Eng yaxshi chiqindi qaysi?", "What is the best waste?", ["Hosil bo‘lmagan", "Eng og‘ir", "Yoqilgan", "Aralash"], ["Waste not created", "The heaviest", "Burned waste", "Mixed waste"], 0, "Kamroq iste’mol chiqindini manbada kamaytiradi.", "Consuming less prevents waste at source."),
  q("q24", "WASTE", "chiqindini-ajratamiz", "Organik chiqindiga misol?", "Which is organic waste?", ["Meva po‘chog‘i", "Shisha", "Temir banka", "Batareya"], ["Fruit peel", "Glass", "Metal can", "Battery"], 0, "Oziq-ovqat qoldig‘i organik chiqindidir.", "Food scraps are organic waste."),
  q("q25", "WASTE", "chiqindini-ajratamiz", "Batareyani qayerga tashlash kerak?", "Where should a battery go?", ["Maxsus yig‘ish joyiga", "Organik qutiga", "Yerga", "Olovga"], ["Special collection point", "Organic bin", "On the ground", "Into fire"], 0, "Batareya xavfli modda saqlashi mumkin.", "Batteries may contain hazardous materials."),
  q("q26", "AIR", "toza-havo-uchun", "Havoni nima ifloslantiradi?", "What can pollute the air?", ["Chiqindi yoqish", "Daraxt ekish", "Piyoda yurish", "Saralash"], ["Burning waste", "Planting trees", "Walking", "Sorting"], 0, "Yonish zararli tutun chiqaradi.", "Burning releases harmful smoke."),
  q("q27", "AIR", "toza-havo-uchun", "Yaqin masofaga eng ekologik yo‘l?", "What is an eco-friendly way to travel nearby?", ["Piyoda yurish", "Bo‘sh mashina haydash", "Chiqindi yoqish", "Motorni ishlatib turish"], ["Walk", "Drive an empty car", "Burn waste", "Idle an engine"], 0, "Piyoda yurish chiqindi gaz chiqarmaydi.", "Walking creates no exhaust."),
  q("q28", "AIR", "toza-havo-uchun", "Daraxtlar havoga qanday yordam beradi?", "How do trees help air?", ["Changni ushlaydi", "Tutun chiqaradi", "Plastik yaratadi", "Suvni ifloslaydi"], ["Trap some dust", "Release smoke", "Create plastic", "Pollute water"], 0, "Barglar ayrim chang zarrachalarini ushlab qoladi.", "Leaves capture some dust particles."),
  q("q29", "AIR", "toza-havo-uchun", "Motorni bekor ishlatish nimaga olib keladi?", "What does engine idling do?", ["Ortiqcha chiqindi gazga", "Havoni darhol tozalaydi", "Daraxtni sug‘oradi", "Chiqindini saralaydi"], ["Creates unnecessary exhaust", "Immediately cleans air", "Waters trees", "Sorts waste"], 0, "Bekor ishlayotgan motor ham yoqilg‘i sarflaydi.", "An idling engine still burns fuel."),
  q("q30", "AIR", "toza-havo-uchun", "Havo muammosini qanday qayd etish ma’qul?", "How should an air issue be recorded?", ["Joy, vaqt va kuzatuv bilan", "Faqat taxmin bilan", "Hech kimga aytmay", "Dalilsiz"], ["With place, time, and observation", "Only by guessing", "Tell nobody", "Without evidence"], 0, "Aniq ma’lumot muammoni tushunishga yordam beradi.", "Specific data helps explain the issue."),
];

export const categoryLabels = {
  WATER: { uz: "Suv", en: "Water" },
  DROUGHT: { uz: "Qurg‘oqchilik", en: "Drought" },
  TREE_CARE: { uz: "Daraxt parvarishi", en: "Tree care" },
  WASTE: { uz: "Chiqindi", en: "Waste" },
  AIR: { uz: "Havo", en: "Air" },
} as const;

export const demoChallenges = [
  {
    slug: "7-kun-suvni-tejash",
    category: "WATER" as const,
    titleUz: "7 kun suvni tejash",
    titleEn: "Save water for 7 days",
    descriptionUz: "Har kuni bitta suv tejash odatini bajaring va belgilab boring.",
    descriptionEn: "Complete and log one water-saving habit each day.",
    durationDays: 7,
    targetValue: 105,
    unit: "L",
    joined: 128,
  },
  {
    slug: "10-kg-chiqindi-saralash",
    category: "WASTE" as const,
    titleUz: "10 kg chiqindini saralash",
    titleEn: "Sort 10 kg of waste",
    descriptionUz: "Qog‘oz, plastik va organik chiqindini ajratib, vaznini kiriting.",
    descriptionEn: "Separate paper, plastic, and organic waste and record the weight.",
    durationDays: 14,
    targetValue: 10,
    unit: "kg",
    joined: 84,
  },
  {
    slug: "daraxtni-30-kun-parvarishlash",
    category: "TREE_CARE" as const,
    titleUz: "Daraxtni 30 kun parvarishlash",
    titleEn: "Care for a tree for 30 days",
    descriptionUz: "Bitta daraxtni tanlang, sug‘oring va holatini surat bilan kuzating.",
    descriptionEn: "Choose one tree, water it, and monitor its condition with photos.",
    durationDays: 30,
    targetValue: 1,
    unit: "daraxt",
    joined: 63,
  },
  {
    slug: "mahalliy-ekologik-muammo",
    category: "AIR" as const,
    titleUz: "Mahalliy ekologik muammoni aniqlash",
    titleEn: "Identify a local environmental issue",
    descriptionUz: "Mahalla yoki maktab atrofidagi muammoni dalil va yechim bilan qayd eting.",
    descriptionEn: "Document a local issue with evidence and a possible solution.",
    durationDays: 5,
    targetValue: 1,
    unit: "hisobot",
    joined: 41,
  },
];

export const demoTrees = Array.from({ length: 20 }, (_, index) => ({
  identifier: `XAZ-${String(index + 1).padStart(3, "0")}`,
  species: ["Tut", "Qayrag‘och", "O‘rik", "Jiyda"][index % 4],
  plantedAt: `2026-${index % 2 === 0 ? "03" : "04"}-${String((index % 20) + 1).padStart(2, "0")}`,
  school: index < 10 ? "Urganch 12-maktab" : "Shovot 7-maktab",
  area: index % 2 === 0 ? "Maktab hovlisi" : "Mahalla yashil hududi",
  latitude: 41.55 + index * 0.001,
  longitude: 60.63 + index * 0.001,
  status: (index === 7 || index === 16 ? "DEAD" : index % 5 === 0 ? "NEEDS_ATTENTION" : "HEALTHY") as "HEALTHY" | "NEEDS_ATTENTION" | "DEAD",
  survived: index !== 7 && index !== 16,
  lastCheckedAt: `2026-08-${String((index % 3) + 1).padStart(2, "0")}`,
}));
