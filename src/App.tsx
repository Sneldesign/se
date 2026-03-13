import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft, 
  BarChart3, 
  PieChart, 
  Download, 
  Mail,
  Zap,
  Award,
  MousePointerClick,
  Info,
  Database,
  Eye,
  MessageSquare,
  Layout,
  Smartphone,
  Globe,
  Phone
} from 'lucide-react';
import { AGRIO_SECTORS, Goal, Sector, MediaTool, ToolCategory } from './data/agrioData';

const STEPS = [
  { id: 'welcome', title: 'Start' },
  { id: 'budget', title: 'Budget' },
  { id: 'sectors', title: 'Doelgroep' },
  { id: 'audience', title: 'Focus' },
  { id: 'goal', title: 'Strategie' },
  { id: 'campaign', title: 'Type' },
  { id: 'duration', title: 'Planning' },
  { id: 'results', title: 'Uw Plan' }
];

// Custom Logo Component for Sterke Erven
const SterkeErvenLogo = ({ className = "h-10 md:h-12" }: { className?: string }) => (
  <div className={`flex items-center gap-2 md:gap-3 ${className}`}>
    <div className="relative scale-75 md:scale-100">
      <div className="w-10 h-10 bg-se-yellow flex items-center justify-center transform -rotate-3">
        <span className="font-black text-se-dark text-xl leading-none">S</span>
      </div>
      <div className="absolute -bottom-1 -right-1 w-10 h-10 border-2 border-se-dark flex items-center justify-center transform rotate-3 -z-10 bg-white">
        <span className="font-black text-se-dark text-xl leading-none opacity-0">S</span>
      </div>
    </div>
    <div className="flex flex-col">
      <span className="font-black text-se-dark text-base md:text-xl tracking-tighter leading-none uppercase">Sterke Erven</span>
      <span className="text-[6px] md:text-[8px] font-black uppercase tracking-[0.4em] text-se-teal opacity-60">Media & Data</span>
    </div>
  </div>
);

// Helper for non-linear budget slider
// 0-50% maps to 200-2000, 50-100% maps to 2000-20000
const budgetToSlider = (val: number) => {
  if (val <= 2000) return ((val - 200) / 1800) * 50;
  return 50 + ((val - 2000) / 18000) * 50;
};

const sliderToBudget = (val: number) => {
  if (val <= 50) return Math.round(200 + (val / 50) * 1800);
  return Math.round(2000 + ((val - 50) / 50) * 18000);
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [calculationMessage, setCalculationMessage] = useState('');
  const [budget, setBudget] = useState<number>(1500);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [marketingGoal, setMarketingGoal] = useState<Goal>('branding');
  const [audienceFocus, setAudienceFocus] = useState<'decision_makers' | 'influencers'>('decision_makers');
  const [campaignType, setCampaignType] = useState<'launch' | 'maintenance' | 'event'>('maintenance');
  const [duration, setDuration] = useState<number>(4);

  const CALCULATION_MESSAGES = [
    "Doelgroep data analyseren...",
    "Bereik berekenen voor geselecteerde sectoren...",
    "Mediakit tools matchen met uw strategie...",
    "Optimale budgetverdeling bepalen...",
    "Uw Sterke Erven plan genereren..."
  ];

  // Calculation timer logic
  useEffect(() => {
    if (isCalculating) {
      const duration = 8000; // 8 seconds
      const interval = 50;
      const steps = duration / interval;
      let current = 0;

      const timer = setInterval(() => {
        current++;
        const progress = (current / steps) * 100;
        setCalculationProgress(progress);

        // Update messages
        const messageIndex = Math.min(
          Math.floor((progress / 100) * CALCULATION_MESSAGES.length),
          CALCULATION_MESSAGES.length - 1
        );
        setCalculationMessage(CALCULATION_MESSAGES[messageIndex]);

        if (current >= steps) {
          clearInterval(timer);
          setIsCalculating(false);
          setCurrentStep(7);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isCalculating]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep, isCalculating]);

  const recommendations = useMemo(() => {
    if (selectedSectors.length === 0 || budget <= 0) return [];

    const budgetPerSector = budget / selectedSectors.length;
    
    return selectedSectors.map(sectorId => {
      const sector = AGRIO_SECTORS.find(s => s.id === sectorId)!;
      let remainingBudget = budgetPerSector;
      const sectorTools: any[] = [];

      // Scoring logic for tools
      const scoredTools = sector.tools.map(tool => {
        let score = 0;
        
        // Goal alignment
        if (marketingGoal === 'branding' && tool.categories.includes('reach')) score += 5;
        if (marketingGoal === 'expertise' && tool.categories.includes('expertise')) score += 5;
        if (marketingGoal === 'leads' && tool.categories.includes('conversion')) score += 5;
        if (marketingGoal === 'product_launch' && (tool.type === 'website' || tool.type === 'newsletter')) score += 5;
        
        // Audience alignment
        if (audienceFocus === 'decision_makers' && (tool.type === 'print' || tool.type === 'database')) score += 3;
        if (audienceFocus === 'influencers' && (tool.type === 'website' || tool.type === 'newsletter')) score += 3;
        
        // Campaign type alignment
        if (campaignType === 'launch' && (tool.type === 'website')) score += 4;
        if (campaignType === 'maintenance' && (tool.type === 'newsletter' || tool.type === 'print')) score += 4;
        if (campaignType === 'event' && (tool.type === 'newsletter' || tool.type === 'database')) score += 4;

        return { ...tool, score };
      }).sort((a, b) => b.score - a.score);

      for (const tool of scoredTools) {
        if (remainingBudget <= 50) break;
        if (sectorTools.length >= 3) break; // Max 3 tools per sector for mobile clarity

        if (tool.priceType === 'CPM') {
          const allocation = remainingBudget * (tool.score > 8 ? 0.4 : 0.25);
          const impressions = Math.floor((allocation / tool.price) * 1000);
          if (impressions > 2000) {
            sectorTools.push({ ...tool, impressions, cost: allocation });
            remainingBudget -= allocation;
          }
        } else if (tool.priceType === 'Fixed') {
          let quantity = 1;
          if (tool.type === 'newsletter') quantity = Math.min(Math.floor(remainingBudget / tool.price), Math.ceil(duration / 2));
          if (tool.type === 'database') quantity = 1;
          
          const totalCost = quantity * tool.price;
          if (remainingBudget >= totalCost && quantity > 0) {
            sectorTools.push({ ...tool, [tool.type === 'newsletter' ? 'placements' : 'quantity']: quantity, cost: totalCost });
            remainingBudget -= totalCost;
          }
        }
      }

      return {
        sector,
        budgetAllocated: budgetPerSector - remainingBudget,
        tools: sectorTools
      };
    });
  }, [budget, selectedSectors, marketingGoal, audienceFocus, campaignType, duration]);

  const totalReach = useMemo(() => {
    return recommendations.reduce((acc, rec) => {
      const sectorReach = rec.tools.reduce((tAcc: number, tool: any) => {
        if (tool.impressions) return tAcc + tool.impressions;
        if (tool.placements) return tAcc + (tool.placements * 8000);
        if (tool.type === 'database') return tAcc + 5000;
        return tAcc + 10000;
      }, 0);
      return acc + sectorReach;
    }, 0);
  }, [recommendations]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const primaryColor: [number, number, number] = [20, 50, 50]; // se-teal approx
    
    // Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('STERKE ERVEN MEDIA VOORSTEL', 15, 25);
    
    doc.setFontSize(10);
    doc.text(`Datum: ${new Date().toLocaleDateString('nl-NL')}`, 150, 25);

    // Summary Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Samenvatting Campagne', 15, 55);
    
    autoTable(doc, {
      startY: 60,
      head: [['Onderdeel', 'Details']],
      body: [
        ['Totaal Budget', `€${budget.toLocaleString()}`],
        ['Geschat Bereik', `${totalReach.toLocaleString()}+ impressies`],
        ['Geselecteerde Sectoren', selectedSectors.map(s => AGRIO_SECTORS.find(as => as.id === s)?.name).join(', ')],
        ['Marketing Doel', marketingGoal.toUpperCase()],
        ['Looptijd', `${duration} weken`],
      ],
      theme: 'striped',
      headStyles: { fillColor: primaryColor },
    });

    // Detailed Plan
    let currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Geadviseerde Middelen', 15, currentY);
    currentY += 5;

    recommendations.forEach((rec) => {
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(rec.sector.name.toUpperCase(), 15, currentY + 10);
      
      // Attempt to add sector image to PDF
      try {
        doc.addImage(rec.sector.image, 'JPEG', 15, currentY + 15, 40, 25);
        currentY += 45;
      } catch (e) {
        currentY += 15;
      }

      const toolRows = rec.tools.map((tool: any) => [
        tool.name,
        tool.type,
        tool.impressions ? `${tool.impressions.toLocaleString()} Imp.` : `${tool.placements || tool.quantity}x`,
        `€${Math.round(tool.cost).toLocaleString()}`
      ]);

      const secondaryColor: [number, number, number] = [80, 80, 80];
      autoTable(doc, {
        startY: currentY,
        head: [['Middel', 'Type', 'Inzet', 'Kosten']],
        body: toolRows,
        theme: 'grid',
        headStyles: { fillColor: secondaryColor },
      });

      currentY = (doc as any).lastAutoTable.finalY + 10;
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Sterke Erven Keuzehulp - Agrio Uitgeverij', 15, 285);
      doc.text(`Pagina ${i} van ${pageCount}`, 180, 285);
    }

    doc.save(`Sterke_Erven_Mediavoorstel_${new Date().getTime()}.pdf`);
  };

  const nextStep = () => {
    if (currentStep === 6) {
      setIsCalculating(true);
    } else if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  const prevStep = () => currentStep > 0 && setCurrentStep(prev => prev - 1);

  const progress = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-se-beige text-se-dark font-sans selection:bg-se-yellow/30 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-se-dark/5 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <SterkeErvenLogo />
          
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-6">
              {STEPS.map((step, i) => (
                <div 
                  key={step.id} 
                  className={`flex items-center gap-2 transition-opacity ${i > currentStep ? 'opacity-20' : 'opacity-100'}`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${i === currentStep ? 'bg-se-yellow text-se-dark' : 'bg-se-dark text-white'}`}>
                    {i + 1}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{step.title}</span>
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right">
                <span className="block text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-40">Stap {currentStep + 1}/8</span>
                <div className="w-16 md:w-24 h-1 bg-se-dark/5 rounded-full mt-1 overflow-hidden">
                  <motion.div 
                    className="h-full bg-se-yellow"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16 md:pt-20 pb-24 md:pb-0 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {isCalculating && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-12"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 md:w-48 md:h-48 border-8 border-se-dark/5 border-t-se-yellow rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <SterkeErvenLogo className="scale-50 md:scale-75" />
                </div>
              </div>

              <div className="space-y-6 max-w-md w-full">
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Plan wordt samengesteld</h3>
                  <p className="text-se-teal font-black text-xs uppercase tracking-widest h-4">
                    {calculationMessage}
                  </p>
                </div>

                <div className="w-full h-4 bg-se-dark/5 rounded-full overflow-hidden border-2 border-se-dark/5">
                  <motion.div
                    className="h-full bg-se-yellow"
                    initial={{ width: 0 }}
                    animate={{ width: `${calculationProgress}%` }}
                  />
                </div>
                
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                  {Math.round(calculationProgress)}% voltooid
                </p>
              </div>
            </motion.div>
          )}

          {!isCalculating && currentStep === 0 && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex-1 flex items-center overflow-y-auto"
            >
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" 
                  alt="Dutch Farm" 
                  className="w-full h-full object-cover opacity-20 filter grayscale"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-se-beige via-transparent to-se-beige" />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center py-8">
                <div className="space-y-6 md:space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-se-yellow text-se-dark font-black text-[10px] md:text-xs uppercase tracking-widest transform -rotate-1">
                    <Database className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    97% van de boeren in beeld
                  </div>
                  <h2 className="text-4xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
                    Impact op het <br /> <span className="text-se-teal">Boerenerf</span>
                  </h2>
                  <p className="text-lg md:text-2xl text-se-dark/80 max-w-xl leading-relaxed font-medium">
                    Bereik de kern van de agrarische sector met de vertrouwde titels van Agrio.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={nextStep}
                      className="group bg-se-dark text-white px-8 py-5 md:px-10 md:py-6 font-black text-base md:text-lg uppercase tracking-widest hover:bg-se-yellow hover:text-se-dark transition-all flex items-center justify-center gap-3"
                    >
                      Start de Keuzehulp
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {[
                    { icon: Globe, title: '10 Titels', desc: 'Vakbladen & Online' },
                    { icon: Smartphone, title: 'Targeted', desc: 'Database Marketing' },
                    { icon: MessageSquare, title: 'Dialoog', desc: 'Nieuwsbrieven' },
                    { icon: Award, title: 'Expertise', desc: 'Kennispartners' }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 md:p-8 bg-white border-2 border-se-dark/5 hover:border-se-yellow transition-all group"
                    >
                      <item.icon className="w-5 h-5 md:w-8 md:h-8 mb-2 md:mb-4 text-se-teal group-hover:scale-110 transition-transform" />
                      <h4 className="font-black uppercase text-[10px] md:text-sm tracking-widest mb-1 md:mb-2">{item.title}</h4>
                      <p className="text-[8px] md:text-xs opacity-60 font-bold leading-tight">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {!isCalculating && currentStep > 0 && currentStep < 7 && (
            <motion.div 
              key="steps"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 md:px-8 py-6 md:py-12 overflow-y-auto"
            >
              {currentStep === 1 && (
                <div className="space-y-6 md:space-y-8 flex-1 flex flex-col justify-center">
                  <div className="space-y-2">
                    <span className="text-se-teal font-black text-[10px] uppercase tracking-[0.4em]">Stap 01 — Investering</span>
                    <h3 className="text-3xl md:text-6xl font-black tracking-tighter uppercase">Wat is uw budget?</h3>
                  </div>
                  
                  <div className="bg-white p-6 md:p-12 border-2 border-se-dark/5 shadow-xl shadow-se-dark/5 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-se-dark/30 text-2xl md:text-4xl font-black">€</span>
                        <input 
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
                          className="text-4xl md:text-7xl font-black tracking-tighter w-full outline-none bg-transparent border-b-4 border-se-yellow focus:border-se-teal transition-colors"
                        />
                      </div>
                      <span className="text-se-teal font-black text-[10px] uppercase tracking-widest">Totaal Budget</span>
                    </div>

                    <div className="space-y-4">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="1"
                        value={budgetToSlider(budget)}
                        onChange={(e) => setBudget(sliderToBudget(Number(e.target.value)))}
                        className="w-full h-3 bg-se-dark/5 rounded-none appearance-none cursor-pointer accent-se-yellow"
                      />
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest opacity-30">
                        <span>€200</span>
                        <span>€2.000</span>
                        <span>€20.000+</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-se-yellow/10 border-l-4 border-se-yellow">
                    <p className="text-xs md:text-sm font-medium text-se-dark/70">
                      Tip: Een gemiddelde campagne op het boerenerf start tussen de €500 en €2.500.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 md:space-y-8 flex-1 flex flex-col">
                  <div className="space-y-2">
                    <span className="text-se-teal font-black text-[10px] uppercase tracking-[0.4em]">Stap 02 — Doelgroep</span>
                    <h3 className="text-3xl md:text-6xl font-black tracking-tighter uppercase">Wie wilt u bereiken?</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 overflow-y-auto pr-2">
                    {AGRIO_SECTORS.map(sector => (
                      <button
                        key={sector.id}
                        onClick={() => {
                          setSelectedSectors(prev => 
                            prev.includes(sector.id) 
                              ? prev.filter(id => id !== sector.id)
                              : [...prev, sector.id]
                          );
                        }}
                        className={`group relative h-32 md:h-48 border-2 text-left transition-all duration-500 overflow-hidden ${
                          selectedSectors.includes(sector.id)
                            ? 'border-se-yellow'
                            : 'border-se-dark/5 hover:border-se-dark/20'
                        }`}
                      >
                        <img 
                          src={sector.image} 
                          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${selectedSectors.includes(sector.id) ? 'opacity-40' : 'opacity-10 grayscale'}`}
                          alt={sector.name}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-se-dark/80 via-se-dark/20 to-transparent" />
                        
                        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                          <div className="flex justify-between items-end">
                            <div>
                              <h4 className="text-lg md:text-2xl font-black text-white uppercase tracking-tight mb-1">{sector.name}</h4>
                              <span className="text-[8px] md:text-[10px] font-black text-white/60 uppercase tracking-widest">{sector.website}</span>
                            </div>
                            {selectedSectors.includes(sector.id) && (
                              <div className="w-8 h-8 bg-se-yellow flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-se-dark" />
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 md:space-y-8 flex-1 flex flex-col justify-center">
                  <div className="space-y-2">
                    <span className="text-se-teal font-black text-[10px] uppercase tracking-[0.4em]">Stap 03 — Focus</span>
                    <h3 className="text-3xl md:text-6xl font-black tracking-tighter uppercase">Wie beslist?</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {[
                      { id: 'decision_makers', title: 'Beslissers', desc: 'Eigenaren en bedrijfsleiders met tekenbevoegdheid.', icon: Target },
                      { id: 'influencers', title: 'Beïnvloeders', desc: 'Medewerkers en adviseurs die de keuze sturen.', icon: Users },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setAudienceFocus(item.id as any)}
                        className={`p-5 md:p-8 border-2 text-left transition-all duration-300 flex items-center gap-4 md:gap-6 ${
                          audienceFocus === item.id
                            ? 'border-se-yellow bg-se-yellow/5'
                            : 'border-se-dark/5 hover:border-se-dark/20'
                        }`}
                      >
                        <div className={`w-12 h-12 flex items-center justify-center transition-colors shrink-0 ${
                          audienceFocus === item.id ? 'bg-se-yellow text-se-dark' : 'bg-se-dark/5 text-se-dark/40'
                        }`}>
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="block font-black text-base md:text-xl uppercase tracking-tight mb-0.5">{item.title}</span>
                          <span className="text-[10px] md:text-sm text-se-dark/50 font-medium">{item.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 md:space-y-8 flex-1 flex flex-col justify-center">
                  <div className="space-y-2">
                    <span className="text-se-teal font-black text-[10px] uppercase tracking-[0.4em]">Stap 04 — Strategie</span>
                    <h3 className="text-3xl md:text-6xl font-black tracking-tighter uppercase">Wat is het doel?</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'branding', title: 'Zichtbaarheid', desc: 'Focus op maximale awareness.', icon: Eye },
                      { id: 'expertise', title: 'Autoriteit', desc: 'Focus op inhoudelijke kennis.', icon: Award },
                      { id: 'leads', title: 'Conversie', desc: 'Focus op directe respons.', icon: MousePointerClick },
                      { id: 'product_launch', title: 'Introductie', desc: 'Nieuw product op de markt.', icon: Zap },
                    ].map(goal => (
                      <button
                        key={goal.id}
                        onClick={() => setMarketingGoal(goal.id as Goal)}
                        className={`p-4 md:p-6 border-2 text-left transition-all duration-300 flex items-center gap-4 ${
                          marketingGoal === goal.id
                            ? 'border-se-yellow bg-se-yellow/5'
                            : 'border-se-dark/5 hover:border-se-dark/20'
                        }`}
                      >
                        <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-colors shrink-0 ${
                          marketingGoal === goal.id ? 'bg-se-yellow text-se-dark' : 'bg-se-dark/5 text-se-dark/40'
                        }`}>
                          <goal.icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="flex-1">
                          <span className="block font-black text-sm md:text-lg uppercase tracking-tight mb-0.5">{goal.title}</span>
                          <span className="text-[9px] md:text-xs text-se-dark/50 font-medium">{goal.desc}</span>
                        </div>
                        {marketingGoal === goal.id && <CheckCircle2 className="w-4 h-4 text-se-dark shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6 md:space-y-8 flex-1 flex flex-col justify-center">
                  <div className="space-y-2">
                    <span className="text-se-teal font-black text-[10px] uppercase tracking-[0.4em]">Stap 05 — Campagne</span>
                    <h3 className="text-3xl md:text-6xl font-black tracking-tighter uppercase">Welk type?</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'launch', title: 'Introductie', desc: 'Nieuw product of dienst.', icon: Zap },
                      { id: 'maintenance', title: 'Onderhoud', desc: 'Top-of-mind blijven.', icon: TrendingUp },
                      { id: 'event', title: 'Event/Actie', desc: 'Tijdelijke promotie.', icon: Calendar },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setCampaignType(item.id as any)}
                        className={`p-5 border-2 text-left transition-all duration-300 flex items-center gap-4 ${
                          campaignType === item.id
                            ? 'border-se-yellow bg-se-yellow/5'
                            : 'border-se-dark/5 hover:border-se-dark/20'
                        }`}
                      >
                        <div className={`w-12 h-12 flex items-center justify-center transition-colors shrink-0 ${
                          campaignType === item.id ? 'bg-se-yellow text-se-dark' : 'bg-se-dark/5 text-se-dark/40'
                        }`}>
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="block font-black text-base md:text-lg uppercase tracking-tight mb-0.5">{item.title}</span>
                          <span className="text-[10px] md:text-xs text-se-dark/50 font-medium">{item.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-6 md:space-y-8 flex-1 flex flex-col justify-center">
                  <div className="space-y-2">
                    <span className="text-se-teal font-black text-[10px] uppercase tracking-[0.4em]">Stap 06 — Planning</span>
                    <h3 className="text-3xl md:text-6xl font-black tracking-tighter uppercase">Hoe lang?</h3>
                  </div>

                  <div className="bg-white p-6 md:p-12 border-2 border-se-dark/5 shadow-xl shadow-se-dark/5 space-y-8">
                    <div className="flex justify-between items-baseline">
                      <span className="text-4xl md:text-7xl font-black tracking-tighter">{duration} Weken</span>
                      <span className="text-se-teal font-black text-[10px] uppercase tracking-widest">Looptijd</span>
                    </div>
                    <div className="space-y-4">
                      <input 
                        type="range" 
                        min="1" 
                        max="12" 
                        step="1"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full h-3 bg-se-dark/5 rounded-none appearance-none cursor-pointer accent-se-yellow"
                      />
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest opacity-30">
                        <span>1 Week</span>
                        <span>12 Weken</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {!isCalculating && currentStep === 7 && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-24 space-y-12 md:space-y-16 overflow-y-auto"
            >
              {/* Results Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b-4 md:border-b-8 border-se-dark pb-8 md:pb-12">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-se-dark bg-se-yellow px-3 py-1.5 md:px-4 md:py-2">
                    Strategisch Voorstel
                  </div>
                  <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
                    Uw Media <br /> <span className="text-se-teal">Plan</span>
                  </h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <button 
                    onClick={handleDownloadPDF}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 border-2 border-se-dark bg-white font-black uppercase tracking-widest hover:bg-se-dark hover:text-white transition-all text-[10px]"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                  <a 
                    href="tel:+31314626434"
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-se-yellow font-black uppercase tracking-widest hover:bg-se-dark hover:text-white transition-all text-[10px] shadow-xl shadow-se-yellow/20 text-se-dark"
                  >
                    <Phone className="w-4 h-4" /> Neem contact op
                  </a>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { label: 'Budget', value: `€${budget.toLocaleString()}`, icon: BarChart3, color: 'text-se-teal' },
                  { label: 'Bereik', value: `${totalReach.toLocaleString()}+`, icon: Users, color: 'text-se-dark' },
                  { label: 'Sectoren', value: selectedSectors.length, icon: PieChart, color: 'text-se-teal' },
                  { label: 'Duur', value: `${duration} Wk`, icon: Calendar, color: 'text-se-dark' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white border-2 border-se-dark/5 p-4 md:p-8 relative group hover:border-se-yellow transition-all shadow-lg shadow-se-dark/5">
                    <stat.icon className={`w-5 h-5 md:w-6 md:h-6 mb-3 md:mb-6 ${stat.color} opacity-40`} />
                    <span className="block text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{stat.label}</span>
                    <span className="text-xl md:text-3xl font-black tracking-tighter">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Detailed Recommendations */}
              <div className="space-y-12 md:space-y-16">
                {recommendations.map((rec, i) => (
                  <div key={i} className="space-y-6 md:space-y-8">
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="h-px flex-1 bg-se-dark/10" />
                      <h4 className="text-2xl md:text-5xl font-black uppercase tracking-tighter">{rec.sector.name}</h4>
                      <div className="h-px flex-1 bg-se-dark/10" />
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                      <div className="lg:col-span-1 space-y-4 md:space-y-6">
                        <div className="aspect-video bg-se-dark relative overflow-hidden">
                           <img 
                            src={rec.sector.image} 
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                            alt={rec.sector.name}
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <span className="text-se-yellow font-black text-[10px] uppercase tracking-widest mb-1">{rec.sector.website}</span>
                            <h5 className="text-xl font-black text-white uppercase tracking-tight">Sector Focus</h5>
                          </div>
                        </div>
                        <div className="p-4 md:p-6 bg-white border-2 border-se-dark/5">
                          <span className="block text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Investering</span>
                          <span className="text-2xl md:text-4xl font-black tracking-tighter">€{Math.round(rec.budgetAllocated).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="lg:col-span-2 space-y-3 md:space-y-4">
                        {rec.tools.map((tool: any, j: number) => (
                          <div key={j} className="bg-white border-2 border-se-dark/5 p-4 md:p-8 hover:border-se-yellow transition-all group">
                            <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6">
                              <div className="space-y-2 md:space-y-4 flex-1">
                                <div className="flex items-center flex-wrap gap-2 md:gap-3">
                                  <span className="text-se-teal font-black text-[10px]">0{j+1}</span>
                                  <h5 className="text-base md:text-xl font-black uppercase tracking-tight">{tool.name}</h5>
                                  <span className="px-1.5 py-0.5 bg-se-dark text-white text-[7px] md:text-[8px] font-black uppercase tracking-widest">{tool.type}</span>
                                </div>
                                <p className="text-[10px] md:text-sm text-se-dark/60 font-medium leading-relaxed">{tool.description}</p>
                                <div className="flex items-start gap-2 p-3 bg-se-beige/50 border-l-4 border-se-yellow">
                                  <Info className="w-3 h-3 text-se-teal shrink-0 mt-0.5" />
                                  <p className="text-[9px] md:text-xs italic font-serif text-se-dark/80">"{tool.socialProof}"</p>
                                </div>
                              </div>
                              <div className="flex md:flex-col gap-2 md:w-40">
                                <div className="flex-1 p-2 md:p-4 bg-se-dark/5 text-center md:text-right">
                                  <span className="block text-[7px] md:text-[9px] font-black uppercase tracking-widest opacity-40 mb-0.5">Inzet</span>
                                  <span className="text-sm md:text-lg font-black">
                                    {tool.impressions ? `${tool.impressions.toLocaleString()} Imp.` : `${tool.placements || tool.quantity}x`}
                                  </span>
                                </div>
                                <div className="flex-1 p-2 md:p-4 bg-se-yellow/10 text-center md:text-right">
                                  <span className="block text-[7px] md:text-[9px] font-black uppercase tracking-widest opacity-40 mb-0.5">Kosten</span>
                                  <span className="text-sm md:text-lg font-black">€{Math.round(tool.cost).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="bg-se-dark text-white p-8 md:p-24 text-center space-y-8 md:space-y-12 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                   <img 
                    src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=2000" 
                    alt="Farmer" 
                    className="w-full h-full object-cover opacity-10"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="relative z-10 space-y-6 md:space-y-8">
                  <h3 className="text-3xl md:text-7xl font-black tracking-tighter uppercase leading-none">Klaar voor een <br /> <span className="text-se-yellow">Sterk Erf?</span></h3>
                  <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
                    Onze media specialisten staan klaar om dit plan te verfijnen en om te zetten in een krachtige campagne.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 md:pt-8">
                    <a 
                      href="tel:+31314626434"
                      className="bg-se-yellow text-se-dark px-8 py-5 md:px-12 md:py-6 font-black uppercase tracking-widest text-sm md:text-lg hover:scale-105 transition-transform shadow-2xl shadow-se-yellow/20 flex items-center justify-center gap-3"
                    >
                      <Phone className="w-5 h-5" /> Neem contact op
                    </a>
                    <button onClick={() => setCurrentStep(0)} className="px-8 py-5 md:px-12 md:py-6 border-2 border-white/20 font-black uppercase tracking-widest text-sm md:text-lg hover:bg-white/5 transition-all">
                      Plan Aanpassen
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Fixed Bottom Navigation for Steps */}
      {!isCalculating && currentStep > 0 && currentStep < 7 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-se-dark/5 p-4 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <div className="max-w-4xl mx-auto flex gap-3">
            <button 
              onClick={prevStep}
              className="p-4 border-2 border-se-dark/10 bg-white hover:bg-se-dark/5 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextStep}
              disabled={currentStep === 2 && selectedSectors.length === 0}
              className={`flex-1 p-4 font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                (currentStep === 2 && selectedSectors.length === 0)
                  ? 'bg-se-dark/5 text-se-dark/20 cursor-not-allowed'
                  : 'bg-se-dark text-white hover:bg-se-yellow hover:text-se-dark'
              }`}
            >
              {currentStep === 6 ? 'Genereer Plan' : 'Volgende Stap'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
