export const dictionaries = {
  uz: {
    home: "Bosh sahifa",
    learn: "O‘rganish",
    quiz: "Test",
    act: "Harakat",
    dashboard: "Natijalar",
    profile: "Profil",
    verify: "Tekshirish",
    trees: "Daraxtlar",
    greeting: "Salom",
    continue: "Davom etish",
    viewAll: "Barchasini ko‘rish",
    weeklyGoal: "Haftalik maqsad",
  },
  en: {
    home: "Home",
    learn: "Learn",
    quiz: "Quiz",
    act: "Act",
    dashboard: "Dashboard",
    profile: "Profile",
    verify: "Verify",
    trees: "Trees",
    greeting: "Hello",
    continue: "Continue",
    viewAll: "View all",
    weeklyGoal: "Weekly goal",
  },
} as const;

export type Locale = keyof typeof dictionaries;
export type TranslationKey = keyof (typeof dictionaries)["uz"];
