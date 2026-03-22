import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Stage1ProblemDefinition from './components/Stage1ProblemDefinition';
import Stage2ResponseVariables from './components/Stage2ResponseVariables';
import Stage3FactorsLevels from './components/Stage3FactorsLevels';
import Stage4DesignRecommendation from './components/Stage4DesignRecommendation';
import Stage5ExecutionPlanning from './components/Stage5ExecutionPlanning';
import Stage6AnalysisEngine from './components/Stage6AnalysisEngine';
import Stage7Conclusions from './components/Stage7Conclusions';
import WizardContainer from './components/WizardContainer';
import TutorialSection from './components/TutorialSection';
import type {
  ProblemDefinition,
  ResponseVariable,
  Factor,
  DesignRecommendation,
  ExecutionPlan,
  ExperimentResults,
  Conclusions,
  StageValidation,
} from './types';

/* ── Stage metadata ─────────────────────────────── */
const STAGES = [
  { id: 1, name: 'Problem Definition',   desc: 'Define your objective',        icon: '🎯' },
  { id: 2, name: 'Response Variables',   desc: 'What you will measure',        icon: '📊' },
  { id: 3, name: 'Factors & Levels',     desc: 'Variables to manipulate',      icon: '⚙️' },
  { id: 4, name: 'Design Selection',     desc: 'Choose an experiment design',  icon: '🔬' },
  { id: 5, name: 'Execution Planning',   desc: 'Plan your experiment',         icon: '📋' },
  { id: 6, name: 'Analysis Engine',      desc: 'Analyse your results',         icon: '📈' },
  { id: 7, name: 'Conclusions',          desc: 'Insights & next steps',        icon: '✅' },
] as const;

const TOTAL = STAGES.length;

/* ── Quick‑tips per stage ───────────────────────── */
const TIPS: Record<number, string> = {
  1: 'A clear problem statement is the single most important pre‑experimental step. Be specific about what success looks like.',
  2: 'Identify all measurable outcomes. Consider both primary responses and secondary indicators.',
  3: 'List controllable factors first. For each, specify realistic ranges you can safely test.',
  4: 'The recommended design balances statistical power against resource cost. Review assumptions before proceeding.',
  5: 'Always randomise run order unless there are strong constraints. Document every deviation during execution.',
  6: 'Enter data run‑by‑run. Statistical significance alone does not imply practical significance.',
  7: 'Compare findings against your original objective. Define concrete next steps whether successful or not.',
};

/* ── Component ──────────────────────────────────── */
const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [showWizard,   setShowWizard]   = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  /* experiment state */
  const [prob,   setProb]   = useState<ProblemDefinition>({ processDescription: '', objective: 'screening', objectiveDescription: '' });
  const [vars,   setVars]   = useState<ResponseVariable[]>([]);
  const [facts,  setFacts]  = useState<Factor[]>([]);
  const [design, setDesign] = useState<DesignRecommendation | null>(null);
  const [plan,   setPlan]   = useState<ExecutionPlan | null>(null);
  const [results,setResults]= useState<ExperimentResults | null>(null);
  const [concl,  setConcl]  = useState<Conclusions | null>(null);

  /* ── validation ─────────────────────────────── */
  const isValid = (s: number): boolean => {
    switch (s) {
      case 1: return !!prob.processDescription && !!prob.objective && !!prob.objectiveDescription;
      case 2: return vars.length > 0 && vars.every(v => v.name && v.measurementMethod);
      case 3: return facts.length > 0 && facts.every(f => f.name && f.levels.length >= 2);
      case 4: return design !== null;
      case 5: return plan !== null;
      case 6: return results !== null;
      case 7: return concl !== null;
      default: return false;
    }
  };
  const isAccessible = (s: number) => s === 1 || isValid(s - 1);

  const completedCount = STAGES.filter(s => isValid(s.id)).length;
  const pct = Math.round((completedCount / TOTAL) * 100);

  /* ── wizard handlers ────────────────────────── */
  const onWizardComplete = (rec: DesignRecommendation) => {
    setDesign(rec);
    setShowWizard(false);
    setCurrentStage(4);
  };

  /* ── stage renderer ─────────────────────────── */
  const renderStage = () => {
    const noop = (_v: StageValidation) => {};
    switch (currentStage) {
      case 1: return <Stage1ProblemDefinition   data={prob}    onUpdate={setProb}    onValidationChange={noop} />;
      case 2: return <Stage2ResponseVariables   data={vars}    onUpdate={setVars}    onValidationChange={noop} />;
      case 3: return <Stage3FactorsLevels       data={facts}   onUpdate={setFacts}   onValidationChange={noop} />;
      case 4: return (
        <Stage4DesignRecommendation
          data={design}
          problemDefinition={prob}
          responseVariables={vars}
          factors={facts}
          onUpdate={setDesign}
          onValidationChange={noop}
        />
      );
      case 5: return (
        <Stage5ExecutionPlanning
          design={design}
          factors={facts}
          data={plan}
          onUpdate={setPlan}
          onValidationChange={noop}
        />
      );
      case 6: return (
        <Stage6AnalysisEngine
          design={design}
          factors={facts}
          responseVariables={vars}
          data={results}
          onUpdate={setResults}
          onValidationChange={noop}
        />
      );
      case 7: return (
        <Stage7Conclusions
          problemDefinition={prob}
          design={design}
          results={results}
          data={concl}
          onUpdate={setConcl}
          onValidationChange={noop}
        />
      );
      default: return null;
    }
  };

  const cur = STAGES.find(s => s.id === currentStage)!;

  /* ── Wizard / Tutorial overlays ─────────────── */
  if (showWizard) return (
    <div className="min-h-screen flex flex-col">
      <Header currentStage={currentStage} totalStages={TOTAL} pct={pct} />
      <div className="container" style={{ paddingTop: 24, paddingBottom: 24, flex: 1 }}>
        <button className="btn btn-secondary btn-sm mb-4" onClick={() => setShowWizard(false)}>
          ← Back to Navigator
        </button>
        <WizardContainer onComplete={onWizardComplete} onCancel={() => setShowWizard(false)} />
      </div>
      <Footer />
    </div>
  );

  if (showTutorial) return (
    <div className="min-h-screen flex flex-col">
      <Header currentStage={currentStage} totalStages={TOTAL} pct={pct} />
      <div className="container" style={{ paddingTop: 24, paddingBottom: 24, flex: 1 }}>
        <button className="btn btn-secondary btn-sm mb-4" onClick={() => setShowTutorial(false)}>
          ← Back to Navigator
        </button>
        <TutorialSection />
      </div>
      <Footer />
    </div>
  );

  /* ── Main layout ─────────────────────────────── */
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentStage={currentStage} totalStages={TOTAL} pct={pct} />

      <div className="app-layout">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <p className="sidebar-title">Experiment Stages</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              {completedCount} of {TOTAL} complete — {pct}%
            </p>
            <div className="progress-track" style={{ marginTop: 8 }}>
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Desktop vertical steps */}
          <nav className="sidebar-steps" aria-label="Experiment stages">
            {STAGES.map(stage => {
              const access = isAccessible(stage.id);
              const valid  = isValid(stage.id);
              const isCur  = stage.id === currentStage;
              let cls = 'step-item';
              if (isCur)  cls += ' active';
              else if (valid) cls += ' completed';
              else if (!access) cls += ' disabled';
              return (
                <div
                  key={stage.id}
                  className={cls}
                  onClick={() => access && setCurrentStage(stage.id)}
                  role="button"
                  tabIndex={access ? 0 : -1}
                  onKeyDown={e => e.key === 'Enter' && access && setCurrentStage(stage.id)}
                  title={!access ? `Complete stage ${stage.id - 1} first` : stage.desc}
                >
                  <div className="step-number">
                    {valid && !isCur ? '✓' : stage.id}
                  </div>
                  <div className="step-label">
                    <div className="step-name">{stage.name}</div>
                    <div className="step-desc">{stage.desc}</div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Mobile horizontal pills */}
          <div className="sidebar-steps-mobile" aria-label="Experiment stages">
            {STAGES.map(stage => {
              const access = isAccessible(stage.id);
              const valid  = isValid(stage.id);
              const isCur  = stage.id === currentStage;
              let cls = 'step-pill';
              if (isCur)  cls += ' active';
              else if (valid) cls += ' completed';
              else if (!access) cls += ' disabled';
              return (
                <button
                  key={stage.id}
                  className={cls}
                  onClick={() => access && setCurrentStage(stage.id)}
                  disabled={!access}
                  title={stage.desc}
                >
                  {stage.icon} {stage.name}
                </button>
              );
            })}
          </div>

          {/* Quick actions */}
          <div className="sidebar-actions">
            <button className="btn btn-secondary btn-sm w-full" onClick={() => setShowTutorial(true)}>
              📚 DOE Tutorial
            </button>
            <button className="btn btn-ghost btn-sm w-full" onClick={() => setShowWizard(true)}>
              🧙 Quick Wizard
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="main-content">

          {/* Stage header bar */}
          <div className="stage-header">
            <div className="stage-badge">{cur.id}</div>
            <div className="stage-info">
              <h2>{cur.icon} {cur.name}</h2>
              <p>{cur.desc}</p>
            </div>
          </div>

          {/* Validation warning */}
          {!isValid(currentStage) && (
            <div className="alert alert-warning mb-4" role="alert">
              <span>⚠️</span>
              <div>
                <strong>Requirements for Stage {currentStage}:</strong>
                <div style={{ marginTop: 2 }}>
                  {currentStage === 1 && 'Complete the process description, select an objective, and describe your specific goal.'}
                  {currentStage === 2 && 'Add at least one response variable with a name and measurement method.'}
                  {currentStage === 3 && 'Add at least two factors, each with at least two levels.'}
                  {currentStage >= 4 && 'Complete all previous stages to unlock this one.'}
                </div>
              </div>
            </div>
          )}

          {/* Stage component */}
          <div className="card stage-card">
            <div className="card-body">
              {renderStage()}
            </div>
          </div>

          {/* Navigation row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentStage(s => Math.max(1, s - 1))}
              disabled={currentStage === 1}
            >
              ← Previous
            </button>

            <span style={{ fontSize: 13, color: '#888' }}>
              Stage {currentStage} / {TOTAL}
            </span>

            <button
              className="btn btn-primary"
              onClick={() => setCurrentStage(s => Math.min(TOTAL, s + 1))}
              disabled={currentStage === TOTAL}
            >
              {currentStage === TOTAL ? '🎉 Complete' : 'Next →'}
            </button>
          </div>

          {/* Quick tip */}
          <div style={{
            marginTop: 16,
            padding: '12px 16px',
            background: 'var(--yellow-subtle)',
            borderLeft: '3px solid var(--yellow)',
            borderRadius: 8,
            fontSize: 13,
            color: '#555',
            lineHeight: 1.6,
          }}>
            <strong style={{ color: '#333' }}>💡 Tip: </strong>
            {TIPS[currentStage]}
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default App;
