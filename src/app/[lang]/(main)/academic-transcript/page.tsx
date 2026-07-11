import type { Metadata } from "next";
import { getDictionary } from '@/components/layout/Translator';
import { SITE_URL, getBaseMetadata, getLanguageAlternates } from '@/lib/seo';
import { academicTranscript, pointConversion } from '@/lib/transcript';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','academic-transcript']);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Academic_Transcript || 'Academic Transcript'} | Faran Aiki`,
    description: dict.SEO_Academic_Transcript_Description || "Official academic transcript and course records of Muhammad Faran Aiki from the Institut Teknologi Bandung (ITB)",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Academic_Transcript || 'Academic Transcript'} | Faran Aiki`,
      description: dict.SEO_Academic_Transcript_Description || "Official academic transcript and course records of Muhammad Faran Aiki from the Institut Teknologi Bandung (ITB)",
      url: `${SITE_URL}/${lang}/academic-transcript`,
    },
    alternates: {
      canonical: `/${lang}/academic-transcript`,
      languages: getLanguageAlternates('/academic-transcript'),
    },
  };
}

export default async function AcademicTranscriptPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','academic-transcript']);

  return (
    <main className="container mx-auto px-4 md:px-6 pt-24 pb-12 max-w-4xl min-h-screen">
      <div className="space-y-6">
        <div className="flex flex-col gap-2 border-b border-theme-border pb-4">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter nav-active-gacor">
            {dict.Academic_Transcript || 'Academic Transcript'}
          </h1>
          <p className="text-[var(--text-muted)] font-medium">
            {dict.Transcript_Subtitle || 'Institut Teknologi Bandung • System and Technology Information • Cumulative GPA: '}3.94 / 4.00
          </p>
        </div>

        <div className="space-y-12">
          {academicTranscript.map((semester, idx) => (
            <section key={idx} className="space-y-4">
              <div className="flex justify-between items-end border-b border-theme-border/50 pb-2">
                <h2 className="text-xl font-bold text-foreground">
                  {dict[`Transcript_${semester.title.replace(/ /g, '_').replace('Tahap_Persiapan_Bersama', 'TPB')}`] || semester.title}
                </h2>
                <div className="text-sm font-bold text-theme-500">
                  {dict.Transcript_IP || 'GPA:'} {semester.ip.toFixed(2)} / {dict.Transcript_Passed_Credits || 'Passed Credits:'} {semester.sksLulus}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-theme-border/50 text-[var(--text-muted)]">
                      <th className="py-2 px-3 font-bold">{dict.Transcript_No || 'No'}</th>
                      <th className="py-2 px-3 font-bold">{dict.Transcript_Code || 'Code'}</th>
                      <th className="py-2 px-3 font-bold">{dict.Transcript_Course || 'Course'}</th>
                      <th className="py-2 px-3 font-bold">{dict.Transcript_Type || 'Type'}</th>
                      <th className="py-2 px-3 font-bold">{dict.Transcript_Credits || 'Credits'}</th>
                      <th className="py-2 px-3 font-bold">{dict.Transcript_Grade || 'Grade'}</th>
                      <th className="py-2 px-3 font-bold text-right">{dict.Transcript_Semester || 'Taken Semester'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semester.courses.map((course, cIdx) => (
                      <tr key={cIdx} className="border-b border-theme-border/30 hover:bg-theme-surface/30 transition-colors">
                        <td className="py-2 px-3 text-[var(--text-muted)]">{cIdx + 1}</td>
                        <td className="py-2 px-3 font-mono text-xs">{course.kode}</td>
                        <td className="py-2 px-3 font-medium text-foreground">{dict[`Course_${course.kode}` as keyof typeof dict] || course.mataKuliah}</td>
                        <td className="py-2 px-3">{dict[`Transcript_Type_${course.sifat}` as keyof typeof dict] || course.sifat}</td>
                        <td className="py-2 px-3 font-mono">{course.sks}</td>
                        <td className="py-2 px-3 font-bold text-theme-500">{course.nilai}</td>
                        <td className="py-2 px-3 font-mono text-right">{course.semesterPengambilan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl border border-theme-border bg-theme-surface/20">
          <h3 className="font-bold text-foreground mb-4">{dict.Transcript_Grade_Conversion || 'Grade Conversion'}</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(pointConversion).map(([grade, point]) => (
              <div key={grade} className="flex items-center gap-2 bg-theme-surface-strong px-3 py-1.5 rounded-lg border border-theme-border">
                <span className="font-bold text-theme-500">{grade}</span>
                <span className="text-[var(--text-muted)] text-sm">= {typeof point === 'number' ? point.toFixed(1) : (dict[`Transcript_Grade_${point}` as keyof typeof dict] || point)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
