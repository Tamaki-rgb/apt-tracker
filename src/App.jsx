import { useState, useMemo, useEffect, createContext, useContext } from "react";

// ── Translations ──────────────────────────────────────────────────────────────
const T = {
  en: {
    appTitle: "Application Budget Tracker",
    greeting: "Hey",
    reset: "Reset",
    budget: "Budget",
    spent: "Spent",
    remaining: "Remaining",
    budgetUsed: "Budget used",
    overview: "📊 Overview",
    expenses: "💸 Expenses",
    planned: "📋 Planned",
    categories: "🏷 Categories",
    byCategory: "By Category",
    recentExpenses: "Recent Expenses",
    noExpenses: "No expenses yet. Add your first one!",
    addExpense: "+ Add Expense",
    close: "✕ Close",
    name: "Name",
    amount: "Amount",
    category: "Category",
    date: "Date",
    note: "Note",
    optional: "Optional",
    save: "Save",
    addToLog: "Add ↗",
    estimatedPlan: "Estimated plan",
    addItem: "+ Add Item",
    addToPlan: "Add to Plan",
    clickToEdit: "Click a category to rename it or change the icon.",
    changed: "changed",
    editCategory: "Edit Category",
    categoryName: "Category Name",
    icon: "Icon",
    color: "Color",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    localStorageNote: "Your data is stored only on this device",
    resetConfirm: "Delete all data and start over?",
    free: "Free",
    onboardTitle: "Application Budget Tracker",
    onboardSub: "For everyone applying abroad. Your data stays on your device.",
    whatsYourName: "What's your name?",
    namePlaceholder: "e.g. Umid",
    next: "Next →",
    totalBudget: "Your total budget for applications",
    amountPlaceholder: "e.g. 2000",
    startTracking: "Start Tracking",
    back: "← Back",
    plan: "plan",
  },
  ru: {
    appTitle: "Трекер расходов на поступление",
    greeting: "Привет",
    reset: "Сбросить",
    budget: "Бюджет",
    spent: "Потрачено",
    remaining: "Осталось",
    budgetUsed: "Использовано бюджета",
    overview: "📊 Обзор",
    expenses: "💸 Расходы",
    planned: "📋 Планы",
    categories: "🏷 Категории",
    byCategory: "По категориям",
    recentExpenses: "Последние расходы",
    noExpenses: "Расходов ещё нет. Добавь первый!",
    addExpense: "+ Добавить расход",
    close: "✕ Закрыть",
    name: "Название",
    amount: "Сумма",
    category: "Категория",
    date: "Дата",
    note: "Заметка",
    optional: "Необязательно",
    save: "Сохранить",
    addToLog: "Добавить ↗",
    estimatedPlan: "Примерный план",
    addItem: "+ Добавить",
    addToPlan: "Добавить в план",
    clickToEdit: "Нажми на категорию, чтобы переименовать или поменять иконку.",
    changed: "потрачено",
    editCategory: "Редактировать категорию",
    categoryName: "Название",
    icon: "Иконка",
    color: "Цвет",
    saveChanges: "Сохранить",
    cancel: "Отмена",
    localStorageNote: "Твои данные хранятся только на этом устройстве",
    resetConfirm: "Удалить все данные и начать заново?",
    free: "Free",
    onboardTitle: "Трекер расходов на поступление",
    onboardSub: "Для всех, кто поступает за рубеж. Данные хранятся только на твоём устройстве.",
    whatsYourName: "Как тебя зовут?",
    namePlaceholder: "Например: Умид",
    next: "Далее →",
    totalBudget: "Общий бюджет на поступление",
    amountPlaceholder: "Например: 2000",
    startTracking: "Начать отслеживание",
    back: "← Назад",
    plan: "план",
  }
};

const LangCtx = createContext({ lang: "ru", t: T.ru });
const useLang = () => useContext(LangCtx);

// ── Default data ──────────────────────────────────────────────────────────────
const DEFAULT_CATEGORIES = [
  { id: "tests",   label: { ru: "Тесты",     en: "Tests"       }, icon: "📝", color: "#6366F1" },
  { id: "courses", label: { ru: "Курсы",     en: "Courses"     }, icon: "📚", color: "#0EA5E9" },
  { id: "apps",    label: { ru: "Подача",    en: "Applications"}, icon: "🎓", color: "#8B5CF6" },
  { id: "docs",    label: { ru: "Документы", en: "Documents"   }, icon: "📄", color: "#10B981" },
  { id: "travel",  label: { ru: "Поездки",   en: "Travel"      }, icon: "✈️", color: "#F43F5E" },
  { id: "other",   label: { ru: "Прочее",    en: "Other"       }, icon: "💡", color: "#F59E0B" },
];

const DEFAULT_PLANNED = [
  { id:"p1", name:{ru:"SAT (первая попытка)",en:"SAT (first attempt)"}, category:"tests", amount:100, note:{ru:"Регистрация CollegeBoard",en:"CollegeBoard registration"} },
  { id:"p2", name:{ru:"SAT (вторая попытка)",en:"SAT (retake)"}, category:"tests", amount:100, note:{ru:"Если нужен ретейк",en:"If retake needed"} },
  { id:"p3", name:{ru:"IELTS",en:"IELTS"}, category:"tests", amount:250, note:{ru:"British Council / IDP",en:"British Council / IDP"} },
  { id:"p4", name:{ru:"Khan Academy SAT",en:"Khan Academy SAT"}, category:"courses", amount:0, note:{ru:"Бесплатно",en:"Free"} },
  { id:"p5", name:{ru:"Common App",en:"Common App"}, category:"apps", amount:0, note:{ru:"Платформа бесплатна",en:"Platform is free"} },
  { id:"p6", name:{ru:"Application fees (8–12 вузов)",en:"Application fees (8–12 schools)"}, category:"apps", amount:750, note:{ru:"~$50–80 за вуз",en:"~$50–80 per school"} },
  { id:"p7", name:{ru:"CSS Profile",en:"CSS Profile"}, category:"apps", amount:25, note:{ru:"Первый вуз + доп.",en:"First school + additional"} },
  { id:"p8", name:{ru:"Перевод документов",en:"Document translation"}, category:"docs", amount:80, note:{ru:"Нотариальный перевод",en:"Notarized translation"} },
  { id:"p9", name:{ru:"Рекомендательные письма",en:"Recommendation letters"}, category:"docs", amount:0, note:{ru:"Бесплатно",en:"Free"} },
];

const EMOJI_OPTIONS = ["📝","📚","🎓","📄","✈️","💡","💰","🏆","🔬","💻","🎯","📊","🏫","📬","🌍","🧪","🎨","🏅"];
const COLORS = ["#6366F1","#0EA5E9","#8B5CF6","#10B981","#F43F5E","#F59E0B","#EC4899","#14B8A6"];

function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : (typeof init === "function" ? init() : init); }
    catch { return typeof init === "function" ? init() : init; }
  });
  const setAndSave = (newVal) => {
    const resolved = typeof newVal === "function" ? newVal(val) : newVal;
    try { localStorage.setItem(key, JSON.stringify(resolved)); } catch {}
    setVal(resolved);
  };
  return [val, setAndSave];
}

// ── Language Toggle ───────────────────────────────────────────────────────────
function LangToggle({ lang, setLang }) {
  return (
    <button onClick={() => setLang(l => l === "ru" ? "en" : "ru")}
      style={{ background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 8, padding: "5px 12px", fontSize: 13, fontWeight: 700, color: "#6366F1", cursor: "pointer", letterSpacing: 0.5 }}>
      {lang === "ru" ? "EN" : "RU"}
    </button>
  );
}

// ── Onboarding ────────────────────────────────────────────────────────────────
function Onboarding({ onDone, lang, setLang }) {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [step, setStep] = useState(0);

  return (
    <div style={S.onboardWrap}>
      <div style={S.onboardCard}>
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:8 }}>
          <LangToggle lang={lang} setLang={setLang} />
        </div>
        <div style={S.onboardIcon}>🎓</div>
        <h2 style={S.onboardTitle}>{t.onboardTitle}</h2>
        <p style={S.onboardSub}>{t.onboardSub}</p>

        {step === 0 && <>
          <label style={S.label}>{t.whatsYourName}</label>
          <input style={S.input} placeholder={t.namePlaceholder} value={name}
            onChange={e => setName(e.target.value)} onKeyDown={e => e.key==="Enter" && name && setStep(1)} autoFocus />
          <button style={{ ...S.btnPrimary, marginTop:16 }} onClick={() => name && setStep(1)}>{t.next}</button>
        </>}

        {step === 1 && <>
          <label style={S.label}>{t.totalBudget}</label>
          <div style={{ display:"flex", gap:10 }}>
            <input style={{ ...S.input, flex:1 }} type="number" placeholder={t.amountPlaceholder}
              value={budget} onChange={e => setBudget(e.target.value)} autoFocus />
            <select style={{ ...S.input, width:90 }} value={currency} onChange={e => setCurrency(e.target.value)}>
              <option>USD</option><option>KZT</option><option>EUR</option><option>GBP</option>
            </select>
          </div>
          <button style={{ ...S.btnPrimary, marginTop:16 }} onClick={() => budget && onDone({ name:name.trim(), budget:Number(budget), currency })}
            disabled={!budget}>{t.startTracking}</button>
          <button style={S.btnGhost} onClick={() => setStep(0)}>{t.back}</button>
        </>}
      </div>
    </div>
  );
}

// ── Category Modal ────────────────────────────────────────────────────────────
function CategoryModal({ cat, lang, onSave, onClose }) {
  const { t } = useLang();
  const initLabel = typeof cat.label === "object" ? cat.label[lang] : cat.label;
  const [label, setLabel] = useState(initLabel);
  const [icon, setIcon] = useState(cat.icon);
  const [color, setColor] = useState(cat.color);

  function save() {
    const updatedLabel = typeof cat.label === "object"
      ? { ...cat.label, [lang]: label }
      : { ru: label, en: label };
    onSave({ ...cat, label: updatedLabel, icon, color });
  }

  return (
    <div style={S.modalOverlay} onClick={onClose}>
      <div style={S.modalBox} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin:"0 0 16px", fontSize:16, fontWeight:700, color:"#1E293B" }}>{t.editCategory}</h3>
        <label style={S.label}>{t.categoryName}</label>
        <input style={{ ...S.input, marginBottom:12 }} value={label} onChange={e => setLabel(e.target.value)} />
        <label style={S.label}>{t.icon}</label>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
          {EMOJI_OPTIONS.map(e => (
            <button key={e} onClick={() => setIcon(e)}
              style={{ fontSize:20, padding:"6px 10px", border: icon===e ? `2px solid ${color}` : "2px solid #E2E8F0",
                borderRadius:8, background: icon===e ? color+"15" : "#F8FAFC", cursor:"pointer" }}>{e}</button>
          ))}
        </div>
        <label style={S.label}>{t.color}</label>
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {COLORS.map(c => (
            <div key={c} onClick={() => setColor(c)}
              style={{ width:28, height:28, borderRadius:"50%", background:c, cursor:"pointer",
                border: color===c ? "3px solid #1E293B" : "3px solid transparent" }} />
          ))}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button style={S.btnPrimary} onClick={save}>{t.saveChanges}</button>
          <button style={{ ...S.btnGhost, border:"1px solid #E2E8F0", borderRadius:8, padding:"10px 16px" }} onClick={onClose}>{t.cancel}</button>
        </div>
      </div>
    </div>
  );
}

// ── Expense Row ───────────────────────────────────────────────────────────────
function ExpenseRow({ e, categories, currency, lang, onDelete }) {
  const cat = categories.find(c => c.id === e.category);
  const catLabel = cat ? (typeof cat.label === "object" ? cat.label[lang] : cat.label) : "";
  return (
    <div style={S.expenseRow}>
      <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
        <div style={{ width:38, height:38, borderRadius:9, background:(cat?.color||"#6366F1")+"18",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{cat?.icon||"💡"}</div>
        <div>
          <div style={{ fontSize:14, fontWeight:600, color:"#1E293B" }}>{e.name}</div>
          <div style={{ fontSize:12, color:"#94A3B8" }}>{e.date}{e.note ? ` · ${e.note}` : ""} · {catLabel}</div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:15, fontWeight:700, color:"#1E293B" }}>{currency} {Number(e.amount).toLocaleString()}</span>
        <button onClick={onDelete} style={{ background:"#FEE2E2", border:"none", color:"#F43F5E", width:28, height:28, borderRadius:6, cursor:"pointer", fontSize:14 }}>✕</button>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function BudgetTracker() {
  const [lang, setLang] = useLocalStorage("apt_lang", "ru");
  const t = T[lang];

  const [user, setUser] = useLocalStorage("apt_user", null);
  const [budget, setBudget] = useLocalStorage("apt_budget", 2000);
  const [expenses, setExpenses] = useLocalStorage("apt_expenses", []);
  const [categories, setCategories] = useLocalStorage("apt_categories", DEFAULT_CATEGORIES);
  const [planned, setPlanned] = useLocalStorage("apt_planned", DEFAULT_PLANNED);

  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editBudget, setEditBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [showPlannedForm, setShowPlannedForm] = useState(false);
  const [form, setForm] = useState({ name:"", category:"tests", amount:"", note:"", date:new Date().toISOString().split("T")[0] });
  const [plannedForm, setPlannedForm] = useState({ name:"", category:"tests", amount:"", note:"" });

  const currency = user?.currency || "USD";
  const spentTotal = useMemo(() => expenses.reduce((s,i) => s+Number(i.amount), 0), [expenses]);
  const remaining = budget - spentTotal;
  const pct = Math.min(100, Math.round((spentTotal/budget)*100));
  const barColor = pct<50 ? "#10B981" : pct<80 ? "#F59E0B" : "#F43F5E";
  const plannedTotal = useMemo(() => planned.reduce((s,i) => s+i.amount, 0), [planned]);

  const getCatLabel = (cat) => cat ? (typeof cat.label==="object" ? cat.label[lang] : cat.label) : "";
  const getPlannedName = (item) => typeof item.name==="object" ? item.name[lang] : item.name;
  const getPlannedNote = (item) => typeof item.note==="object" ? item.note[lang] : item.note;

  const byCategory = useMemo(() => {
    const map = {};
    categories.forEach(c => { map[c.id] = { planned:0, spent:0 }; });
    planned.forEach(i => { if(map[i.category]) map[i.category].planned += i.amount; });
    expenses.forEach(i => { if(map[i.category]) map[i.category].spent += Number(i.amount); });
    return map;
  }, [expenses, planned, categories]);

  function addExpense() {
    if(!form.name || !form.amount) return;
    setExpenses([...expenses, { ...form, id:Date.now(), amount:Number(form.amount) }]);
    setForm({ name:"", category:"tests", amount:"", note:"", date:new Date().toISOString().split("T")[0] });
    setShowForm(false);
  }

  function addPlanned() {
    if(!plannedForm.name || plannedForm.amount==="") return;
    setPlanned([...planned, { ...plannedForm, id:"u"+Date.now(), amount:Number(plannedForm.amount) }]);
    setPlannedForm({ name:"", category:"tests", amount:"", note:"" });
    setShowPlannedForm(false);
  }

  function saveCat(updated) { setCategories(categories.map(c => c.id===updated.id ? updated : c)); setEditCat(null); }
  function resetAll() { if(window.confirm(t.resetConfirm)) { localStorage.clear(); window.location.reload(); } }

  if(!user) return (
    <LangCtx.Provider value={{ lang, t }}>
      <Onboarding onDone={u => { setUser(u); setBudget(u.budget); }} lang={lang} setLang={setLang} />
    </LangCtx.Provider>
  );

  const tabs = [
    { id:"dashboard", label:t.overview },
    { id:"expenses",  label:t.expenses  },
    { id:"planned",   label:t.planned   },
    { id:"categories",label:t.categories},
  ];

  return (
    <LangCtx.Provider value={{ lang, t }}>
      {editCat && <CategoryModal cat={editCat} lang={lang} onSave={saveCat} onClose={() => setEditCat(null)} />}

      {/* Top bar */}
      <div style={S.topBar}>
        <div>
          <div style={S.topGreeting}>{t.greeting}, {user.name}</div>
          <div style={S.topTitle}>{t.appTitle}</div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <LangToggle lang={lang} setLang={setLang} />
          <button style={S.btnDanger} onClick={resetAll}>{t.reset}</button>
        </div>
      </div>

      {/* Summary */}
      <div style={S.summaryRow}>
        {[
          { label:t.budget, value: editBudget
              ? <div style={{display:"flex",gap:6}}>
                  <input style={{...S.input,padding:"4px 8px",fontSize:14,width:90}} value={budgetInput} onChange={e=>setBudgetInput(e.target.value)} autoFocus />
                  <button style={S.btnSm} onClick={()=>{if(Number(budgetInput)>0) setBudget(Number(budgetInput)); setEditBudget(false);}}>OK</button>
                </div>
              : <div style={{...S.summaryValue, cursor:"pointer"}} onClick={()=>{setBudgetInput(String(budget));setEditBudget(true);}}>
                  {currency} {budget.toLocaleString()} <span style={{fontSize:11,color:"#94A3B8"}}>✎</span>
                </div>
          },
          { label:t.spent,     value:<div style={{...S.summaryValue,color:barColor}}>{currency} {spentTotal.toLocaleString()}</div> },
          { label:t.remaining, value:<div style={{...S.summaryValue,color:remaining<0?"#F43F5E":"#10B981"}}>{currency} {remaining.toLocaleString()}</div> },
        ].map((c,i) => (
          <div key={i} style={S.summaryCard}>
            <div style={S.summaryLabel}>{c.label}</div>
            {c.value}
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={S.progressWrap}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <span style={{fontSize:12,color:"#64748B"}}>{t.budgetUsed}</span>
          <span style={{fontSize:12,fontWeight:700,color:barColor}}>{pct}%</span>
        </div>
        <div style={S.progressBg}>
          <div style={{...S.progressFill,width:`${pct}%`,background:barColor}} />
        </div>
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        {tabs.map(tab => (
          <button key={tab.id} style={{...S.tab,...(activeTab===tab.id?S.tabActive:{})}} onClick={()=>setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {activeTab==="dashboard" && <div>
        <div style={S.sectionTitle}>{t.byCategory}</div>
        <div style={S.catGrid}>
          {categories.map(cat => {
            const d = byCategory[cat.id]||{planned:0,spent:0};
            const cp = d.planned>0 ? Math.min(100,Math.round((d.spent/d.planned)*100)) : 0;
            return (
              <div key={cat.id} style={{...S.catCard,borderTop:`3px solid ${cat.color}`}}>
                <div style={{fontSize:22,marginBottom:6}}>{cat.icon}</div>
                <div style={{fontSize:13,fontWeight:600,color:"#1E293B",marginBottom:8}}>{getCatLabel(cat)}</div>
                <div style={{fontSize:18,fontWeight:700,color:cat.color}}>{currency} {d.spent}</div>
                <div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>{t.plan}: {currency} {d.planned}</div>
                {d.planned>0 && <div style={{...S.progressBg,marginTop:8,height:4}}>
                  <div style={{...S.progressFill,width:`${cp}%`,background:cat.color,height:4}} />
                </div>}
              </div>
            );
          })}
        </div>
        <div style={S.sectionTitle}>{t.recentExpenses}</div>
        {expenses.length===0
          ? <div style={S.emptyState}>{t.noExpenses}</div>
          : expenses.slice(-3).reverse().map(e => (
              <ExpenseRow key={e.id} e={e} categories={categories} currency={currency} lang={lang} onDelete={()=>setExpenses(expenses.filter(x=>x.id!==e.id))} />
            ))
        }
      </div>}

      {/* ── EXPENSES ── */}
      {activeTab==="expenses" && <div>
        <button style={S.btnAdd} onClick={()=>setShowForm(v=>!v)}>{showForm ? t.close : t.addExpense}</button>
  {showForm && <div style={S.formCard}>
          <div style={S.formGrid}>
            <div><label style={S.label}>{t.name}</label>
              <input style={S.input} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div><label style={S.label}>{t.amount} ({currency})</label>
              <input style={S.input} type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} /></div>
            <div><label style={S.label}>{t.category}</label>
              <select style={S.input} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {getCatLabel(c)}</option>)}
              </select></div>
            <div><label style={S.label}>{t.date}</label>
              <input style={S.input} type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></div>
          </div>
          <label style={S.label}>{t.note}</label>
          <input style={{...S.input,marginBottom:12}} placeholder={t.optional} value={form.note} onChange={e=>setForm({...form,note:e.target.value})} />
          <button style={S.btnPrimary} onClick={addExpense}>{t.save}</button>
        </div>}
        <div style={{marginTop:16}}>
          {expenses.length===0
            ? <div style={S.emptyState}>{t.noExpenses}</div>
            : expenses.slice().reverse().map(e=>(
                <ExpenseRow key={e.id} e={e} categories={categories} currency={currency} lang={lang} onDelete={()=>setExpenses(expenses.filter(x=>x.id!==e.id))} />
              ))
          }
        </div>
      </div>}

      {/* ── PLANNED ── */}
      {activeTab==="planned" && <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"16px 20px 12px"}}>
          <div style={{fontSize:13,color:"#64748B"}}>{t.estimatedPlan}: <strong style={{color:"#6366F1"}}>{currency} {plannedTotal}</strong></div>
          <button style={S.btnSm} onClick={()=>setShowPlannedForm(v=>!v)}>{t.addItem}</button>
        </div>
        {showPlannedForm && <div style={{...S.formCard,marginBottom:16}}>
          <div style={S.formGrid}>
            <div><label style={S.label}>{t.name}</label>
              <input style={S.input} value={plannedForm.name} onChange={e=>setPlannedForm({...plannedForm,name:e.target.value})} /></div>
            <div><label style={S.label}>{t.amount}</label>
              <input style={S.input} type="number" value={plannedForm.amount} onChange={e=>setPlannedForm({...plannedForm,amount:e.target.value})} /></div>
            <div><label style={S.label}>{t.category}</label>
              <select style={S.input} value={plannedForm.category} onChange={e=>setPlannedForm({...plannedForm,category:e.target.value})}>
                {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {getCatLabel(c)}</option>)}
              </select></div>
            <div><label style={S.label}>{t.note}</label>
              <input style={S.input} value={plannedForm.note} onChange={e=>setPlannedForm({...plannedForm,note:e.target.value})} /></div>
          </div>
          <button style={S.btnPrimary} onClick={addPlanned}>{t.addToPlan}</button>
        </div>}
        {planned.map(item => {
          const cat = categories.find(c=>c.id===item.category);
          const isDone = expenses.some(e=>e.name===getPlannedName(item));
          return (
            <div key={item.id} style={{...S.expenseRow,opacity:isDone?0.45:1}}>
              <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
                <span style={{fontSize:18}}>{cat?.icon}</span>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"#1E293B",textDecoration:isDone?"line-through":"none"}}>{getPlannedName(item)}</div>
                  {getPlannedNote(item) && <div style={{fontSize:12,color:"#94A3B8"}}>{getPlannedNote(item)}</div>}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14,fontWeight:700,color:item.amount===0?"#10B981":"#1E293B"}}>
                  {item.amount===0 ? t.free : `${currency} ${item.amount}`}
                </span>
                {!isDone && <button style={S.btnSm} onClick={()=>{
                  setForm({name:getPlannedName(item),category:item.category,amount:String(item.amount),note:getPlannedNote(item),date:new Date().toISOString().split("T")[0]});
                  setActiveTab("expenses"); setShowForm(true);
                }}>{t.addToLog}</button>}
                <button style={{...S.btnSm,background:"#FEE2E2",color:"#F43F5E"}}
                  onClick={()=>setPlanned(planned.filter(p=>p.id!==item.id))}>✕</button>
              </div>
            </div>
          );
        })}
      </div>}

      {/* ── CATEGORIES ── */}
      {activeTab==="categories" && <div>
        <div style={{fontSize:13,color:"#64748B",margin:"16px 20px 12px"}}>{t.clickToEdit}</div>
        {categories.map(cat => (
          <div key={cat.id} style={{...S.expenseRow,cursor:"pointer"}} onClick={()=>setEditCat(cat)}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:42,height:42,borderRadius:10,background:cat.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{cat.icon}</div>
              <div>
                <div style={{fontSize:15,fontWeight:600,color:"#1E293B"}}>{getCatLabel(cat)}</div>
                <div style={{fontSize:12,color:"#94A3B8"}}>{byCategory[cat.id]?.spent||0} {currency} {t.changed}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:cat.color}} />
              <span style={{fontSize:12,color:"#94A3B8"}}>→</span>
            </div>
          </div>
        ))}
      </div>}

      <div style={{textAlign:"center",padding:"32px 0 16px",fontSize:11,color:"#CBD5E1"}}>{t.localStorageNote}</div>
    </LangCtx.Provider>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  appWrap: undefined,
  topBar:       { background:"#fff",borderBottom:"1px solid #E2E8F0",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10 },
  topGreeting:  { fontSize:12,color:"#94A3B8",marginBottom:2 },
  topTitle:     { fontSize:16,fontWeight:700,color:"#1E293B" },
  summaryRow:   { display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,padding:"16px 20px 0" },
  summaryCard:  { background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:"14px 16px" },
  summaryLabel: { fontSize:11,color:"#94A3B8",textTransform:"uppercase",letterSpacing:1,marginBottom:4 },
  summaryValue: { fontSize:19,fontWeight:700,color:"#1E293B" },
  progressWrap: { background:"#fff",margin:"12px 20px 0",borderRadius:12,padding:"14px 16px",border:"1px solid #E2E8F0" },
  progressBg:   { background:"#F1F5F9",borderRadius:8,height:8,overflow:"hidden" },
  progressFill: { height:8,borderRadius:8,transition:"width .4s ease" },
  tabs:         { display:"flex",gap:4,padding:"16px 20px 0",overflowX:"auto" },
  tab:          { padding:"8px 13px",borderRadius:8,border:"1px solid #E2E8F0",background:"#fff",color:"#64748B",fontSize:12,cursor:"pointer",whiteSpace:"nowrap",fontWeight:500 },
  tabActive:    { background:"#6366F1",color:"#fff",border:"1px solid #6366F1" },
  sectionTitle: { fontSize:12,fontWeight:700,color:"#64748B",textTransform:"uppercase",letterSpacing:1,padding:"16px 20px 8px" },
  catGrid:      { display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"0 20px" },
  catCard:      { background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:"16px" },
  expenseRow:   { background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:"12px 16px",margin:"0 20px 8px",display:"flex",justifyContent:"space-between",alignItems:"center" },
  emptyState:   { textAlign:"center",color:"#94A3B8",padding:"32px",fontSize:14 },
  formCard:     { background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:"16px",margin:"12px 20px 0" },
  formGrid:     { display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 },
  label:        { fontSize:12,color:"#64748B",fontWeight:600,display:"block",marginBottom:4 },
  input:        { background:"#F8FAFC",color:"#1E293B",border:"1px solid #E2E8F0",borderRadius:8,padding:"9px 12px",fontSize:14,width:"100%",boxSizing:"border-box",outline:"none",fontFamily:"inherit" },
  btnPrimary:   { background:"#6366F1",color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",fontSize:14,fontWeight:600,cursor:"pointer",width:"100%" },
  btnGhost:     { background:"transparent",color:"#64748B",border:"none",padding:"10px 0",fontSize:14,cursor:"pointer",width:"100%",marginTop:4 },
  btnAdd:       { background:"#EEF2FF",color:"#6366F1",border:"1px solid #C7D2FE",borderRadius:8,padding:"10px 20px",fontSize:14,fontWeight:600,cursor:"pointer",margin:"16px 20px 0",width:"calc(100% - 40px)" },
  btnSm:        { background:"#F1F5F9",color:"#475569",border:"none",borderRadius:6,padding:"5px 10px",fontSize:12,fontWeight:600,cursor:"pointer" },
  btnDanger:    { background:"#FEE2E2",color:"#F43F5E",border:"none",borderRadius:8,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer" },
  onboardWrap:  { minHeight:"100vh",background:"#F8FAFC",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Inter',system-ui,sans-serif" },
  onboardCard:  { background:"#fff",border:"1px solid #E2E8F0",borderRadius:20,padding:"40px 36px",maxWidth:400,width:"100%",textAlign:"center",boxShadow:"0 4px 24px rgba(0,0,0,.06)" },
  onboardIcon:  { fontSize:48,marginBottom:12 },
  onboardTitle: { fontSize:22,fontWeight:700,color:"#1E293B",margin:"0 0 8px" },
  onboardSub:   { fontSize:14,color:"#64748B",marginBottom:24 },
  modalOverlay: { position:"fixed",inset:0,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20 },
  modalBox:     { background:"#fff",borderRadius:16,padding:"24px",maxWidth:380,width:"100%",boxShadow:"0 8px 40px rgba(0,0,0,.15)" },
};
