import { notFound } from "next/navigation";
import { LessonReader } from "@/components/learn/lesson-reader";
import { demoLessons } from "@/data/demo";

export function generateStaticParams() {
  return demoLessons.map((lesson) => ({ slug: lesson.slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = demoLessons.find((item) => item.slug === slug);
  if (!lesson) notFound();
  return <LessonReader lesson={lesson} />;
}
