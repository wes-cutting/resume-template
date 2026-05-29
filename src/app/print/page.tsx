import { loadContent } from "@/content/load";
import { PrintInstructions } from "@/components/print/PrintInstructions";
import { PrintResume } from "@/components/print/PrintResume";

export default function PrintUnifiedPage() {
  const { site, positions, skills, education } = loadContent();
  return (
    <>
      <PrintInstructions label="Unified resume" />
      <PrintResume site={site} positions={positions} skills={skills} education={education} />
    </>
  );
}
