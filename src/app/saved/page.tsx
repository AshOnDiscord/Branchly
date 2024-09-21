import SkillCard from "@/components/SkillCard";

export default function page() {
  return (
    <main className="grid h-full auto-rows-max grid-cols-3 gap-8 bg-indigo-50 px-12 py-8">
      <SkillCard />
      <SkillCard />
      <SkillCard />
      <SkillCard />
      <SkillCard />
      <SkillCard />
      <SkillCard />
    </main>
  );
}
