import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type User } from "../src/generated/prisma/client";
import { demoChallenges, demoLessons, demoQuestions, demoTrees } from "../src/data/demo";
import { calculateTreeSurvival } from "../src/lib/impact";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required to seed EcoQadam.");
const prisma = new PrismaClient({ adapter: new PrismaPg(connectionString) });

async function resetDatabase() {
  await prisma.$transaction([
    prisma.impactMetric.deleteMany(),
    prisma.verification.deleteMany(),
    prisma.evidence.deleteMany(),
    prisma.dailyProgress.deleteMany(),
    prisma.challengeParticipation.deleteMany(),
    prisma.challenge.deleteMany(),
    prisma.quizAttempt.deleteMany(),
    prisma.answerOption.deleteMany(),
    prisma.question.deleteMany(),
    prisma.quiz.deleteMany(),
    prisma.lessonProgress.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.treeMonitoringRecord.deleteMany(),
    prisma.tree.deleteMany(),
    prisma.user.deleteMany(),
    prisma.role.deleteMany(),
    prisma.class.deleteMany(),
    prisma.school.deleteMany(),
    prisma.mahalla.deleteMany(),
    prisma.district.deleteMany(),
  ]);
}

async function main() {
  await resetDatabase();
  const passwordHash = await bcrypt.hash("EcoQadam123!", 12);

  const roles = await Promise.all([
    prisma.role.create({ data: { key: "STUDENT", nameUz: "O‘quvchi", nameEn: "Student" } }),
    prisma.role.create({ data: { key: "TEACHER", nameUz: "O‘qituvchi", nameEn: "Teacher" } }),
    prisma.role.create({ data: { key: "SCHOOL_ADMIN", nameUz: "Maktab administratori", nameEn: "School administrator" } }),
    prisma.role.create({ data: { key: "DISTRICT_ADMIN", nameUz: "Tuman administratori", nameEn: "District administrator" } }),
  ]);
  const role = Object.fromEntries(roles.map((item) => [item.key, item]));

  const district = await prisma.district.create({ data: { id: "district-khorazm-demo", name: "Urganch tumani", code: "URG" } });
  const [mahallaA, mahallaB] = await Promise.all([
    prisma.mahalla.create({ data: { id: "mahalla-yangi-hayot", name: "Yangi hayot", districtId: district.id } }),
    prisma.mahalla.create({ data: { id: "mahalla-bunyodkor", name: "Bunyodkor", districtId: district.id } }),
  ]);
  const [schoolA, schoolB] = await Promise.all([
    prisma.school.create({ data: { id: "school-12", name: "Urganch 12-maktab", code: "URG-12", districtId: district.id, mahallaId: mahallaA.id } }),
    prisma.school.create({ data: { id: "school-7", name: "Shovot 7-maktab", code: "SHO-07", districtId: district.id, mahallaId: mahallaB.id } }),
  ]);

  const classes = await Promise.all([
    prisma.class.create({ data: { id: "class-7a", name: "7-A", grade: 7, schoolId: schoolA.id } }),
    prisma.class.create({ data: { id: "class-8b", name: "8-B", grade: 8, schoolId: schoolA.id } }),
    prisma.class.create({ data: { id: "class-7a-b", name: "7-A", grade: 7, schoolId: schoolB.id } }),
    prisma.class.create({ data: { id: "class-8b-b", name: "8-B", grade: 8, schoolId: schoolB.id } }),
  ]);

  const firstNames = ["Aziza", "Bekzod", "Madina", "Sardor", "Nilufar", "Jasur", "Zilola", "Oybek", "Malika", "Temur", "Shahnoza", "Diyor", "Lola", "Kamron", "Sevara", "Asad", "Gulnoza", "Sanjar", "Mohira", "Abror"];
  const lastNames = ["Karimova", "Rasulov", "Sobirova", "Matyoqubov", "Yusupova"];
  const students: User[] = [];
  for (let index = 0; index < 20; index += 1) {
    const school = index < 10 ? schoolA : schoolB;
    const classRoom = classes[Math.floor(index / 5)];
    students.push(await prisma.user.create({
      data: {
        id: `student-${String(index + 1).padStart(2, "0")}`,
        name: `${firstNames[index]} ${lastNames[index % lastNames.length]}`,
        email: `student${String(index + 1).padStart(2, "0")}@ecoqadam.uz`,
        phone: `+99890${String(1000000 + index)}`,
        passwordHash,
        roleId: role.STUDENT.id,
        schoolId: school.id,
        classId: classRoom.id,
        districtId: district.id,
        lastActiveAt: new Date(`2026-08-0${(index % 3) + 1}T09:00:00Z`),
      },
    }));
  }

  const teachers = await Promise.all([
    prisma.user.create({ data: { id: "teacher-01", name: "Dilnoza Otaboyeva", email: "teacher01@ecoqadam.uz", phone: "+998901110001", passwordHash, roleId: role.TEACHER.id, schoolId: schoolA.id, classId: classes[0].id, districtId: district.id } }),
    prisma.user.create({ data: { id: "teacher-02", name: "Ulug‘bek Qodirov", email: "teacher02@ecoqadam.uz", phone: "+998901110002", passwordHash, roleId: role.TEACHER.id, schoolId: schoolA.id, classId: classes[1].id, districtId: district.id } }),
    prisma.user.create({ data: { id: "teacher-03", name: "Dilorom Jumaniyozova", email: "teacher03@ecoqadam.uz", phone: "+998901110003", passwordHash, roleId: role.TEACHER.id, schoolId: schoolB.id, classId: classes[2].id, districtId: district.id } }),
  ]);
  await prisma.user.create({ data: { id: "school-admin-01", name: "Maktab koordinatori", email: "schooladmin@ecoqadam.uz", passwordHash, roleId: role.SCHOOL_ADMIN.id, schoolId: schoolA.id, districtId: district.id } });
  await prisma.user.create({ data: { id: "district-admin-01", name: "Loyiha administratori", email: "admin@ecoqadam.uz", passwordHash, roleId: role.DISTRICT_ADMIN.id, districtId: district.id } });

  const lessons = new Map<string, string>();
  for (const [index, lesson] of demoLessons.entries()) {
    const created = await prisma.lesson.create({
      data: {
        slug: lesson.slug,
        category: lesson.category,
        order: index + 1,
        titleUz: lesson.titleUz,
        titleEn: lesson.titleEn,
        summaryUz: lesson.summaryUz,
        summaryEn: lesson.summaryEn,
        contentUz: lesson.contentUz.join("\n\n"),
        contentEn: lesson.contentEn.join("\n\n"),
        taskUz: lesson.taskUz,
        taskEn: lesson.taskEn,
        imageUrl: "/og.png",
        infographic: { steps: ["observe", "act", "measure"], factValue: lesson.factValue },
        durationMinutes: lesson.duration,
      },
    });
    lessons.set(lesson.slug, created.id);
  }

  await prisma.lessonProgress.createMany({
    data: demoLessons.slice(0, 4).map((lesson, index) => ({
      userId: students[0].id,
      lessonId: lessons.get(lesson.slug)!,
      status: index === 0 ? "IN_PROGRESS" : index === 3 ? "NOT_STARTED" : "COMPLETED",
      percent: index === 0 ? 65 : index === 3 ? 0 : 100,
      startedAt: new Date("2026-07-28T08:00:00Z"),
      completedAt: index > 0 && index < 3 ? new Date("2026-07-30T08:00:00Z") : null,
    })),
  });

  const quiz = await prisma.quiz.create({ data: { id: "quiz-adaptive", slug: "ecoqadam-adaptive", titleUz: "Eco adaptiv test", titleEn: "Eco adaptive quiz", category: "WATER" } });
  for (const [index, question] of demoQuestions.entries()) {
    await prisma.question.create({
      data: {
        id: question.id,
        quizId: quiz.id,
        topic: question.topic,
        order: index + 1,
        promptUz: question.promptUz,
        promptEn: question.promptEn,
        explanationUz: question.explanationUz,
        explanationEn: question.explanationEn,
        options: { create: question.optionsUz.map((labelUz, optionIndex) => ({ labelUz, labelEn: question.optionsEn[optionIndex], order: optionIndex + 1, isCorrect: optionIndex === question.correctIndex })) },
      },
    });
  }

  const challenges = new Map<string, string>();
  for (const challenge of demoChallenges) {
    const created = await prisma.challenge.create({ data: { slug: challenge.slug, category: challenge.category, titleUz: challenge.titleUz, titleEn: challenge.titleEn, descriptionUz: challenge.descriptionUz, descriptionEn: challenge.descriptionEn, durationDays: challenge.durationDays, targetValue: challenge.targetValue, unit: challenge.unit } });
    challenges.set(challenge.slug, created.id);
  }

  const submissionSpecs = [
    { id: "demo-participation-1", student: students[0], challenge: demoChallenges[0], days: 7, value: undefined },
    { id: "demo-participation-2", student: students[1], challenge: demoChallenges[1], days: 5, value: 2.08 },
    { id: "demo-participation-3", student: students[2], challenge: demoChallenges[2], days: 30, value: undefined },
  ];
  for (const spec of submissionSpecs) {
    const startDate = new Date("2026-07-01T00:00:00Z");
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + spec.challenge.durationDays - 1);
    await prisma.challengeParticipation.create({
      data: {
        id: spec.id,
        userId: spec.student.id,
        challengeId: challenges.get(spec.challenge.slug)!,
        startDate,
        endDate,
        status: "SUBMITTED",
        submittedAt: new Date("2026-08-02T10:00:00Z"),
        comment: "Kunlik qaydlar va rasmlar ilova qilindi.",
        dailyProgress: { create: Array.from({ length: spec.days }, (_, day) => ({ date: new Date(startDate.getTime() + day * 86400000), completed: true, value: spec.value, note: `${day + 1}-kun qaydi` })) },
        evidence: { create: [{ storageKey: `demo-${spec.id}.jpg`, url: "/og.png", filename: "eco-dalil.jpg", mimeType: "image/jpeg", caption: "Demo dalil" }] },
      },
    });
  }

  for (const tree of demoTrees) {
    const school = tree.school.includes("12-") ? schoolA : schoolB;
    await prisma.tree.create({
      data: {
        identifier: tree.identifier,
        species: tree.species,
        plantedAt: new Date(`${tree.plantedAt}T00:00:00Z`),
        schoolId: school.id,
        area: tree.area,
        latitude: tree.latitude,
        longitude: tree.longitude,
        initialPhotoUrl: "/og.png",
        lastWateredAt: new Date("2026-08-01T06:00:00Z"),
        status: tree.status,
        lastCheckedAt: new Date(`${tree.lastCheckedAt}T09:00:00Z`),
        survived: tree.survived,
        monitoring: { create: { observerId: teachers[tree.school.includes("12-") ? 0 : 2].id, status: tree.status, survived: tree.survived, checkedAt: new Date(`${tree.lastCheckedAt}T09:00:00Z`), photoUrl: "/og.png", notes: "Demo monitoring qaydi" } },
      },
    });
  }

  const months = ["2026-03-15", "2026-04-15", "2026-05-15", "2026-06-15", "2026-07-15", "2026-08-01"];
  const waterValues = [760, 1080, 1420, 1930, 2640, 3180];
  for (const [index, month] of months.entries()) {
    await prisma.impactMetric.createMany({ data: [
      { type: "WATER_SAVED_LITERS", value: waterValues[index], unit: "L", schoolId: schoolA.id, mahallaId: mahallaA.id, districtId: district.id, recordedAt: new Date(`${month}T12:00:00Z`) },
      { type: "TASKS_COMPLETED", value: 32 + index * 20, unit: "task", schoolId: schoolA.id, mahallaId: mahallaA.id, districtId: district.id, recordedAt: new Date(`${month}T12:00:00Z`) },
    ] });
  }
  await prisma.impactMetric.createMany({ data: [
    { type: "WATER_SAVED_LITERS", value: 185, unit: "L", userId: students[0].id, classId: classes[0].id, schoolId: schoolA.id, mahallaId: mahallaA.id, districtId: district.id },
    { type: "TASKS_COMPLETED", value: 8, unit: "task", userId: students[0].id, classId: classes[0].id, schoolId: schoolA.id, mahallaId: mahallaA.id, districtId: district.id },
    { type: "TREES_CARED", value: 3, unit: "tree", userId: students[0].id, classId: classes[0].id, schoolId: schoolA.id, mahallaId: mahallaA.id, districtId: district.id },
    { type: "TREE_SURVIVAL_PERCENT", value: calculateTreeSurvival(demoTrees.filter((tree) => tree.survived).length, demoTrees.length), unit: "%", districtId: district.id },
  ] });

  console.log("EcoQadam demo seeded:", { district: 1, schools: 2, classes: 4, students: students.length, teachers: teachers.length, lessons: demoLessons.length, questions: demoQuestions.length, challenges: demoChallenges.length, trees: demoTrees.length });
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => prisma.$disconnect());
