import { useState, useMemo, useCallback, useRef } from "react";
import { trpc } from "@/providers/trpc";
import { questions, sections, scaleLabels } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  ClipboardList,
  User,
  Briefcase,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Mail,
  Loader2,
  BookOpen,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Answers = Record<string, number>;
type Errors = Record<string, string>;
type RespondentData = {
  name: string;
  department: string;
  yearsWorked: string;
};

const sectionIcons: Record<string, React.ReactNode> = {
  respondent: <User className="w-5 h-5" />,
  x1: <Briefcase className="w-5 h-5" />,
  x2: <ShieldCheck className="w-5 h-5" />,
  y: <BarChart3 className="w-5 h-5" />,
};

export function QuestionnaireForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [respondent, setRespondent] = useState<RespondentData>({
    name: "",
    department: "",
    yearsWorked: "",
  });
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<Errors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredScale, setHoveredScale] = useState<{ q: number; val: number } | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const submitMutation = trpc.kuesioner.submit.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error("Gagal mengirim: " + error.message);
      setIsSubmitting(false);
    },
  });

  const totalQuestions = 48 + 3; // 48 questions + 3 respondent fields
  const answeredCount = Object.keys(answers).length + (respondent.name ? 1 : 0) + (respondent.department ? 1 : 0) + (respondent.yearsWorked ? 1 : 0);
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const x1Questions = useMemo(() => questions.filter((q) => q.code === "X1"), []);
  const x2Questions = useMemo(() => questions.filter((q) => q.code === "X2"), []);
  const yQuestions = useMemo(() => questions.filter((q) => q.code === "Y"), []);

  const handleAnswerChange = useCallback((questionNum: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [`q${questionNum}`]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`q${questionNum}`];
      return next;
    });
  }, []);

  const handleRespondentChange = useCallback((field: keyof RespondentData, value: string) => {
    setRespondent((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validateSection = (sectionIndex: number): boolean => {
    const newErrors: Errors = {};

    if (sectionIndex === 0) {
      if (!respondent.name.trim()) newErrors.name = "Nama lengkap wajib diisi";
      if (!respondent.department.trim()) newErrors.department = "Bagian wajib diisi";
      if (!respondent.yearsWorked.trim()) newErrors.yearsWorked = "Lama bekerja wajib diisi";
    }

    const sectionQuestions =
      sectionIndex === 1 ? x1Questions :
      sectionIndex === 2 ? x2Questions :
      sectionIndex === 3 ? yQuestions : [];

    sectionQuestions.forEach((q) => {
      if (!answers[`q${q.num}`]) {
        newErrors[`q${q.num}`] = "Wajib dijawab";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      if (currentSection < sections.length - 1) {
        setCurrentSection((prev) => prev + 1);
        sectionRefs.current[currentSection + 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
      sectionRefs.current[currentSection - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async () => {
    // Validate all sections
    let allValid = true;
    for (let i = 0; i < sections.length; i++) {
      if (!validateSection(i)) {
        allValid = false;
        setCurrentSection(i);
        sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
    }

    if (!allValid) {
      toast.error("Mohon lengkapi semua pertanyaan");
      return;
    }

    setIsSubmitting(true);
    submitMutation.mutate({
      name: respondent.name,
      department: respondent.department,
      yearsWorked: respondent.yearsWorked,
      answers,
    });
  };

  const handleReset = () => {
    setRespondent({ name: "", department: "", yearsWorked: "" });
    setAnswers({});
    setErrors({});
    setCurrentSection(0);
    setShowSuccess(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getAnsweredCountInSection = (sectionIndex: number) => {
    if (sectionIndex === 0) {
      return (respondent.name ? 1 : 0) + (respondent.department ? 1 : 0) + (respondent.yearsWorked ? 1 : 0);
    }
    const sq = sectionIndex === 1 ? x1Questions : sectionIndex === 2 ? x2Questions : yQuestions;
    return sq.filter((q) => answers[`q${q.num}`]).length;
  };

  const getTotalInSection = (sectionIndex: number) => {
    if (sectionIndex === 0) return 3;
    return sectionIndex === 1 ? x1Questions.length : sectionIndex === 2 ? x2Questions.length : yQuestions.length;
  };

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200 mb-4">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
          KUESIONER PENELITIAN
PENGARUH SISTEM PENGGAJIAN DAN PENGENDALIAN INTERNAL
TERHADAP PERSPEKTIF AKUNTANSI MANAJEMEN
(Studi Pada Pekerja Outsourcing di PT Geo Dipa Energi Unit Patuha 1 Bandung)

          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
          1. Kuesioner ini bertujuan untuk mengumpulkan data penelitian.
2. Isilah data diri Anda dengan lengkap dan benar.
3. Jawablah setiap pernyataan sesuai pengalaman dan persepsi Anda.
4. Tidak ada jawaban benar atau salah.
5. Kerahasiaan jawaban Anda dijamin.
6. Keterangan skala penilaian:

          </p>
        </div>

        {/* Scale Legend */}
        <Card className="mb-6 border-blue-100 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-sm text-slate-700">Keterangan Skala Penilaian</h3>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {scaleLabels.map((s) => (
                <div key={s.value} className="flex flex-col items-center text-center">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm", s.color)}>
                    {s.value}
                  </div>
                  <span className="text-xs font-semibold mt-1 text-slate-700">{s.label}</span>
                  <span className="text-[10px] text-slate-500 leading-tight">{s.full}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="mb-6 sticky top-4 z-50 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Progress Pengisian
            </span>
            <span className="text-sm font-bold text-blue-600">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2.5" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-500">
              {answeredCount} dari {totalQuestions} pertanyaan terjawab
            </span>
            <span className="text-xs text-slate-500">
              {Object.keys(answers).length}/48 jawaban
            </span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {sections.map((section, idx) => {
            const isActive = currentSection === idx;
            const answered = getAnsweredCountInSection(idx);
            const total = getTotalInSection(idx);
            const isComplete = answered === total;

            return (
              <button
                key={section.id}
                onClick={() => {
                  setCurrentSection(idx);
                  sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={cn(
                  "flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 text-left",
                  isActive
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : isComplete
                    ? "border-green-300 bg-green-50"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-colors",
                  isActive ? "bg-blue-500 text-white" : isComplete ? "bg-green-500 text-white" : "bg-slate-100 text-slate-500"
                )}>
                  {isComplete ? <CheckCircle2 className="w-4 h-4" /> : sectionIcons[section.id]}
                </div>
                <span className={cn(
                  "text-xs font-semibold text-center leading-tight",
                  isActive ? "text-blue-700" : "text-slate-700"
                )}>
                  {section.title.split(":")[0]}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  {answered}/{total}
                </span>
              </button>
            );
          })}
        </div>

        {/* Section 1: Respondent Data */}
        <div
          ref={(el) => { sectionRefs.current[0] = el; }}
          className={cn("transition-opacity duration-300", currentSection !== 0 && "hidden")}
        >
          <Card className="border-blue-200 shadow-lg shadow-blue-100/50">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{sections[0].title}</CardTitle>
                  <CardDescription className="text-blue-100">{sections[0].description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid gap-5">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    Nama Lengkap
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={respondent.name}
                    onChange={(e) => handleRespondentChange("name", e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                    className={cn("mt-1.5", errors.name && "border-red-400 ring-red-100")}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="department" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                    Bagian
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="department"
                    value={respondent.department}
                    onChange={(e) => handleRespondentChange("department", e.target.value)}
                    placeholder="Masukkan bagian/unit kerja Anda"
                    className={cn("mt-1.5", errors.department && "border-red-400 ring-red-100")}
                  />
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.department}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="yearsWorked" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    Lama Bekerja
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="yearsWorked"
                    value={respondent.yearsWorked}
                    onChange={(e) => handleRespondentChange("yearsWorked", e.target.value)}
                    placeholder="Contoh: 2 Tahun / 6 Bulan"
                    className={cn("mt-1.5", errors.yearsWorked && "border-red-400 ring-red-100")}
                  />
                  {errors.yearsWorked && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.yearsWorked}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 2: X1 */}
        <div
          ref={(el) => { sectionRefs.current[1] = el; }}
          className={cn("transition-opacity duration-300", currentSection !== 1 && "hidden")}
        >
          <QuestionSection
            section={sections[1]}
            questions={x1Questions}
            answers={answers}
            errors={errors}
            hoveredScale={hoveredScale}
            onAnswerChange={handleAnswerChange}
            onHoverScale={setHoveredScale}
            color="from-emerald-500 to-teal-600"
            icon={<Briefcase className="w-5 h-5" />}
          />
        </div>

        {/* Section 3: X2 */}
        <div
          ref={(el) => { sectionRefs.current[2] = el; }}
          className={cn("transition-opacity duration-300", currentSection !== 2 && "hidden")}
        >
          <QuestionSection
            section={sections[2]}
            questions={x2Questions}
            answers={answers}
            errors={errors}
            hoveredScale={hoveredScale}
            onAnswerChange={handleAnswerChange}
            onHoverScale={setHoveredScale}
            color="from-violet-500 to-purple-600"
            icon={<ShieldCheck className="w-5 h-5" />}
          />
        </div>

        {/* Section 4: Y */}
        <div
          ref={(el) => { sectionRefs.current[3] = el; }}
          className={cn("transition-opacity duration-300", currentSection !== 3 && "hidden")}
        >
          <QuestionSection
            section={sections[3]}
            questions={yQuestions}
            answers={answers}
            errors={errors}
            hoveredScale={hoveredScale}
            onAnswerChange={handleAnswerChange}
            onHoverScale={setHoveredScale}
            color="from-amber-500 to-orange-600"
            icon={<BarChart3 className="w-5 h-5" />}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentSection === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>

          {currentSection < sections.length - 1 ? (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Kirim Kuesioner
                </>
              )}
            </Button>
          )}
        </div>

        {/* Scale Reference at Bottom */}
        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {scaleLabels.map((s) => (
              <div key={s.value} className="flex items-center gap-1.5">
                <div className={cn("w-4 h-4 rounded-full", s.color)} />
                <span className="text-xs text-slate-600">
                  {s.value} = {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className="text-xs text-slate-400">
            Data Anda dijamin kerahasiaannya. Hanya digunakan untuk kepentingan penelitian.
          </p>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Terima Kasih!
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Kuesioner Anda telah berhasil dikirim. Data telah tersimpan dan file Excel telah dikirim ke email peneliti.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              <div className="text-sm">
                <p className="font-medium text-slate-700">File Excel</p>
                <p className="text-slate-500 text-xs">Data siap olah SPSS/SmartPLS</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Mail className="w-5 h-5 text-green-600" />
              <div className="text-sm">
                <p className="font-medium text-slate-700">Email Terkirim</p>
                <p className="text-slate-500 text-xs">File dikirim ke yudipardani50@gmail.com</p>
              </div>
            </div>
          </div>
          <Button onClick={handleReset} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
            Isi Kuesioner Baru
          </Button>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

// Question Section Component
interface QuestionSectionProps {
  section: { id: string; title: string; description: string };
  questions: typeof import("@/data/questions").questions;
  answers: Answers;
  errors: Errors;
  hoveredScale: { q: number; val: number } | null;
  onAnswerChange: (num: number, val: number) => void;
  onHoverScale: (val: { q: number; val: number } | null) => void;
  color: string;
  icon: React.ReactNode;
}

function QuestionSection({
  section,
  questions,
  answers,
  errors,
  hoveredScale,
  onAnswerChange,
  onHoverScale,
  color,
  icon,
}: QuestionSectionProps) {
  // Group questions by dimension
  const grouped = useMemo(() => {
    const groups: Record<string, typeof questions> = {};
    questions.forEach((q) => {
      if (!groups[q.dimension]) groups[q.dimension] = [];
      groups[q.dimension].push(q);
    });
    return groups;
  }, [questions]);

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className={cn("bg-gradient-to-r text-white rounded-t-lg", color)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{section.title}</CardTitle>
            <CardDescription className="text-white/80">{section.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[60px_1fr_repeat(5,60px)] gap-0 bg-slate-50 border-b border-slate-200 px-4 py-3">
          <div className="text-xs font-bold text-slate-600">No</div>
          <div className="text-xs font-bold text-slate-600">Pernyataan</div>
          {scaleLabels.map((s) => (
            <div key={s.value} className="text-center">
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto", s.color)}>
                {s.value}
              </div>
              <span className="text-[10px] font-semibold text-slate-600 mt-0.5 block">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Questions */}
        <div className="divide-y divide-slate-100">
          {Object.entries(grouped).map(([dimension, qs]) => (
            <div key={dimension}>
              {/* Dimension Header */}
              <div className="px-4 py-2 bg-slate-50/80 border-l-4 border-blue-400">
                <p className="text-xs font-semibold text-slate-500">
                  Dimensi: {dimension}
                  {qs[0]?.indicator && ` | Indikator: ${qs[0].indicator}`}
                </p>
              </div>
              {qs.map((q) => (
                <div
                  key={q.num}
                  className={cn(
                    "px-4 py-4 transition-colors",
                    errors[`q${q.num}`] ? "bg-red-50/50" : "hover:bg-slate-50/50"
                  )}
                >
                  {/* Desktop Layout */}
                  <div className="hidden md:grid grid-cols-[60px_1fr_repeat(5,60px)] gap-0 items-center">
                    <div className="text-sm font-bold text-slate-700">{q.num}</div>
                    <div className="pr-4">
                      <p className="text-sm text-slate-800 leading-relaxed">
                        Saya merasa/percaya/mengetahui bahwa {q.text}
                      </p>
                      {errors[`q${q.num}`] && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors[`q${q.num}`]}
                        </p>
                      )}
                    </div>
                    {scaleLabels.map((s) => (
                      <div key={s.value} className="flex justify-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => onAnswerChange(q.num, s.value)}
                              onMouseEnter={() => onHoverScale({ q: q.num, val: s.value })}
                              onMouseLeave={() => onHoverScale(null)}
                              className={cn(
                                "w-10 h-10 rounded-xl border-2 transition-all duration-200 flex items-center justify-center text-sm font-bold",
                                answers[`q${q.num}`] === s.value
                                  ? `${s.color} border-transparent text-white shadow-md scale-110`
                                  : hoveredScale?.q === q.num && hoveredScale?.val === s.value
                                  ? "border-slate-400 bg-slate-100 scale-105"
                                  : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                              )}
                            >
                              {s.value}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs font-medium">{s.full}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                        {q.num}
                      </span>
                      <p className="text-sm text-slate-800 leading-relaxed">
                        Saya merasa/percaya/mengetahui bahwa {q.text}
                      </p>
                    </div>
                    {errors[`q${q.num}`] && (
                      <p className="text-red-500 text-xs mb-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors[`q${q.num}`]}
                      </p>
                    )}
                    <div className="grid grid-cols-5 gap-2">
                      {scaleLabels.map((s) => {
                        const isSelected = answers[`q${q.num}`] === s.value;
                        return (
                          <button
                            key={s.value}
                            onClick={() => onAnswerChange(q.num, s.value)}
                            className={cn(
                              "flex flex-col items-center py-2 px-1 rounded-xl border-2 transition-all duration-200",
                              isSelected
                                ? `${s.color} border-transparent text-white shadow-md`
                                : "border-slate-200 hover:border-slate-400"
                            )}
                          >
                            <span className={cn("text-sm font-bold", isSelected ? "text-white" : "text-slate-700")}>
                              {s.value}
                            </span>
                            <span className={cn("text-[9px] mt-0.5", isSelected ? "text-white/80" : "text-slate-500")}>
                              {s.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
