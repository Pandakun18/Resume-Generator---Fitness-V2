import { useState, useRef, useEffect } from "react";
import { Plus, X, ChevronDown, ChevronUp, Download, FileText, Loader2, RotateCcw, Lock, Check, FileEdit, Zap } from "lucide-react";

/* ============================================================
   FONTS
   ============================================================ */
const OUTFIT    = '"Outfit", "Helvetica Neue", Arial, sans-serif';
const DM_SANS   = '"DM Sans", "Helvetica Neue", Arial, sans-serif';
const SPACE_G   = '"Space Grotesk", "Outfit", Arial, sans-serif';
const INTER     = '"Inter", "Helvetica Neue", Arial, sans-serif';
const RALEWAY   = '"Raleway", "Outfit", Arial, sans-serif';
const NUNITO    = '"Nunito", "Outfit", Arial, sans-serif';
const PLAYFAIR  = '"Playfair Display", Georgia, serif';

/* ============================================================
   HELPERS
   ============================================================ */
const h2r = (hex, a) => {
  const h=(hex||"#000").replace("#","");
  const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
};
const lighten = (hex, pct) => {
  const h=(hex||"#000").replace("#","");
  const r=Math.min(255,parseInt(h.slice(0,2),16)+Math.round(255*pct));
  const g=Math.min(255,parseInt(h.slice(2,4),16)+Math.round(255*pct));
  const b=Math.min(255,parseInt(h.slice(4,6),16)+Math.round(255*pct));
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
};
const hexToRtf = hex => { const h=(hex||"#000").replace("#",""); return {r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16)}; };
const rtfEsc = s => { if(s==null)return""; return String(s).replace(/\\/g,"\\\\").replace(/\{/g,"\\{").replace(/\}/g,"\\}").replace(/[\u0080-\uFFFF]/g,c=>`\\u${c.charCodeAt(0)}?`).replace(/\n/g,"\\line "); };
const dlBlob = (blob,fn) => { const u=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=u; a.download=fn; a.style.display="none"; document.body.appendChild(a); a.click(); setTimeout(()=>{a.parentNode?.removeChild(a);URL.revokeObjectURL(u);},1500); };

/* ============================================================
   DATA
   ============================================================ */
const EMPTY = {
  name:"",
  contact:{ email:"", phone:"", location:"", linkedin:"", instagram:"", website:"" },
  philosophy:"",
  specialties:[],
  experience:[],
  achievements:[],
  education:[],
  certifications:[],
  skills:[],
  awards:[],
};

const SAMPLE = {
  name:"Jade Mitchell",
  contact:{ email:"jade.mitchell@email.com", phone:"+61 423 881 204", location:"Sydney, NSW", linkedin:"linkedin.com/in/jademitchell-pt", instagram:"@jade.fit", website:"jademitchell.com.au" },
  philosophy:"I believe every client has untapped potential waiting to be unlocked. My approach combines evidence-based programming with genuine human connection — the goal isn't just a better body, it's a better relationship with movement that lasts a lifetime.",
  specialties:["Strength & Conditioning","HIIT","Weight Loss","Nutrition Coaching","Functional Movement","Pre/Post Natal Fitness","Olympic Lifting","Injury Rehabilitation"],
  experience:[
    { title:"Head Coach & Lead Personal Trainer", venue:"Peak Performance Studio", location:"Sydney, NSW", start:"Jan 2021", end:"Present", type:"Boutique Training Studio", clients:"45 active 1:1 clients",
      bullets:[
        "Lead a 6-trainer coaching team, overseeing programming, quality control, and professional development for all staff.",
        "Designed and launched a 12-week body transformation programme with a 94% completion rate across 3 cohorts of 20 clients.",
        "Grew studio's recurring revenue by 42% through introduction of semi-private small-group training sessions.",
        "Developed an in-house nutrition coaching framework now used by all trainers, reducing client churn by 31%.",
      ]},
    { title:"Senior Personal Trainer & Group Coach", venue:"F45 Training Bondi", location:"Bondi, NSW", start:"Mar 2018", end:"Dec 2020", type:"F45 Franchise", clients:"120+ sessions per month",
      bullets:[
        "Delivered 120+ high-energy group training sessions per month to an average of 22 participants per class.",
        "Ranked #2 trainer nationally in F45's annual member satisfaction survey (2020).",
        "Mentored 3 junior trainers transitioning into the F45 model, all retaining employment post-probation.",
      ]},
    { title:"Personal Trainer & Group Fitness Instructor", venue:"Anytime Fitness Surry Hills", location:"Surry Hills, NSW", start:"Feb 2016", end:"Feb 2018", type:"Commercial Gym", clients:"25 regular PT clients",
      bullets:[
        "Built a full client roster from zero within 6 months of employment through referral and studio promotions.",
        "Instructed weekly spin, HIIT, and bootcamp group classes with average attendance of 18 members.",
      ]},
  ],
  achievements:[
    { client:"Emily, 34 — lost 18kg and completed her first half marathon in 12 weeks", stat:"18kg lost" },
    { client:"Marcus, 52 — recovered from knee surgery to deadlift 120kg within 6 months", stat:"120kg PB" },
    { client:"The Boardroom Group (corporate wellness) — 92% of 40 participants improved mobility scores", stat:"92% improvement" },
  ],
  education:[
    { degree:"Certificate IV in Fitness", school:"Australian Institute of Fitness", location:"Sydney, NSW", date:"2016", notes:"AUSactive Registered Exercise Professional (REP)" },
    { degree:"Bachelor of Exercise Science (incomplete)", school:"University of Technology Sydney", location:"Sydney, NSW", date:"2014–2015", notes:"2 years completed — left to pursue professional training career" },
  ],
  certifications:[
    { name:"NASM Certified Personal Trainer (CPT)", issuer:"National Academy of Sports Medicine", date:"2024", expiry:"2026" },
    { name:"Precision Nutrition Level 1 Coach", issuer:"Precision Nutrition", date:"2022", expiry:"" },
    { name:"CrossFit Level 1 Trainer (CF-L1)", issuer:"CrossFit LLC", date:"2023", expiry:"2025" },
    { name:"Pre & Post Natal Fitness Specialist", issuer:"Australian Fitness Network", date:"2021", expiry:"" },
    { name:"Senior First Aid & CPR", issuer:"St John Ambulance", date:"2024", expiry:"2026" },
  ],
  skills:["Strength Programming","Movement Screening","Nutritional Guidance","Group Facilitation","Client Retention","Mindbody Software","Trainerize App","HIIT Circuit Design","Recovery & Mobility"],
  awards:[
    "FitAwards Australia — Personal Trainer of the Year, Sydney (2023)",
    "F45 National Member Satisfaction Survey — Ranked #2 Trainer (2020)",
    "Australian Fitness Network — Outstanding New Professional (2017)",
  ],
};

/* ============================================================
   COVER LETTER DATA
   ============================================================ */
const EMPTY_CL = {
  senderName:"", senderTitle:"", senderEmail:"", senderPhone:"",
  senderLocation:"", senderInstagram:"",
  recipientName:"", recipientTitle:"", company:"", companyAddress:"", date:"",
  opening:"", body1:"", body2:"", body3:"", closing:"",
};

const SAMPLE_CL = {
  senderName:"Jade Mitchell",
  senderTitle:"Head Coach & Lead Personal Trainer",
  senderEmail:"jade.mitchell@email.com",
  senderPhone:"+61 423 881 204",
  senderLocation:"Sydney, NSW",
  senderInstagram:"@jade.fit",
  recipientName:"Alex Nguyen",
  recipientTitle:"Studio Director",
  company:"F45 Training Double Bay",
  companyAddress:"500 New South Head Rd, Double Bay NSW 2028",
  date:"June 20, 2026",
  opening:"The energy in a room when a coach genuinely connects with their class is something you can't manufacture — and it's something I've spent ten years learning to create consistently. F45 Training Double Bay's reputation for elite coaching culture and community-first programming is exactly why I'm reaching out.",
  body1:"At Peak Performance Studio I have led a team of six trainers, grown our recurring revenue by 42% through small-group programming, and maintained a 94% completion rate across three cohorts of my flagship 12-week transformation programme. Before that, I delivered 120+ F45 sessions per month at Bondi and was ranked #2 nationally in the F45 member satisfaction survey in 2020. I know the model inside out — and I know how to make it exceptional.",
  body2:"What draws me specifically to Double Bay is the calibre of your community and the standard you've set for the brand in the Eastern Suburbs. I'm NASM certified, Precision Nutrition Level 1 qualified, and CrossFit L1 trained — and I bring a coaching philosophy built around long-term client retention, not short-term results theatre. My client Jade board speaks for itself: 18kg lost, a 120kg deadlift PB post knee surgery, 92% mobility improvement across a 40-person corporate cohort.",
  body3:"I'd love to come in, meet the team, and show you what I bring to a session. I'm available to trial at any time — just say the word.",
  closing:"Thanks for your time — I look forward to connecting.",
};

/* ============================================================
   TEMPLATES
   ============================================================ */
const TEMPLATES = [
  { id:"power",   label:"Power",   blurb:"Bold dark header, uppercase name, diagonal accent element.",   accent:"#0A1628", accent2:"#00C2B8", layout:"power",   nameFont:OUTFIT,   bodyFont:DM_SANS, swatch:["#0A1628","#00C2B8"] },
  { id:"studio",  label:"Studio",  blurb:"Split header, photo-forward, boutique studio style.",          accent:"#0F2027", accent2:"#00C2B8", layout:"studio",  nameFont:SPACE_G,  bodyFont:INTER,   swatch:["#0F2027","#06D6A0"] },
  { id:"athlete", label:"Athlete", blurb:"Dark sidebar, metrics-forward, sports coach style.",           accent:"#161D27", accent2:"#00C2B8", layout:"athlete", nameFont:RALEWAY,  bodyFont:DM_SANS, swatch:["#161D27","#00C2B8"] },
  { id:"flow",    label:"Flow",    blurb:"Teal gradient header, clean, yoga & wellness instructor.",     accent:"#007A73", accent2:"#00C2B8", layout:"flow",    nameFont:NUNITO,   bodyFont:DM_SANS, swatch:["#007A73","#00E5D4"] },
  { id:"coach",   label:"Coach",   blurb:"Professional two-column, corporate wellness & group fitness.", accent:"#0A1628", accent2:"#00C2B8", layout:"coach",   nameFont:OUTFIT,   bodyFont:INTER,   swatch:["#0A1628","#E0F7F5"] },
  { id:"circuit", label:"Circuit", blurb:"ATS-safe single column, broad fitness applications.",          accent:"#0F2027", accent2:null,       layout:"circuit", nameFont:SPACE_G,  bodyFont:INTER,   swatch:["#0F2027","#F0FFFE"] },
];

const ACCENT_PRESETS = [
  "#00C2B8","#0A1628","#007A73","#0F2027","#1A3A2A","#005F8A","#2D1B69","#333333","#C4622D","#6B1D2A"
];

/* ============================================================
   SHARED RESUME COMPONENTS
   ============================================================ */
function SpecChip({ label, accent, bodyFont, small=false }) {
  return <span style={{ fontFamily:bodyFont, fontSize:small?"7.5pt":"8.5pt", background:h2r(accent,0.1), color:accent, padding:small?"0.02in 0.08in":"0.025in 0.1in", border:`1px solid ${h2r(accent,0.25)}`, fontWeight:600, borderRadius:"3px", letterSpacing:"0.02em" }}>{label}</span>;
}

function SecHead({ children, accent, teal, bodyFont, style={} }) {
  return (
    <div style={{ marginTop:"0.18in", marginBottom:"0.08in", display:"flex", alignItems:"center", gap:"0.1in", breakAfter:"avoid", pageBreakAfter:"avoid", ...style }}>
      {teal&&<div style={{ width:"0.22in", height:"2.5px", background:teal, flexShrink:0, borderRadius:"2px" }}/>}
      <div style={{ fontFamily:bodyFont, fontSize:"8.5pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.18em", color:accent }}>{children}</div>
      <div style={{ flex:1, height:"1px", background:h2r(accent,0.15) }}/>
    </div>
  );
}

function ExpBlock({ exp, accent, teal, bodyFont, i, total }) {
  return (
    <div style={{ marginBottom:i===total-1?"0":"0.15in", breakInside:"avoid", pageBreakInside:"avoid" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:"0.15in", flexWrap:"wrap" }}>
        <div style={{ fontFamily:bodyFont, fontWeight:700, fontSize:"10.5pt", color:"#111" }}>
          {exp.title}
          {exp.venue&&<span style={{ fontWeight:400, color:"#555" }}> — {exp.venue}</span>}
          {exp.location&&<span style={{ fontWeight:400, color:"#888", fontSize:"9.5pt" }}>, {exp.location}</span>}
        </div>
        <div style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#777", whiteSpace:"nowrap", flexShrink:0 }}>{[exp.start,exp.end].filter(Boolean).join(" – ")}</div>
      </div>
      {(exp.type||exp.clients)&&<div style={{ fontFamily:bodyFont, fontSize:"9pt", color:teal||accent, fontWeight:600, marginTop:"0.02in" }}>{[exp.type,exp.clients].filter(Boolean).join("  ·  ")}</div>}
      {(exp.bullets||[]).length>0&&<ul style={{ margin:"0.04in 0 0", paddingLeft:"0.2in" }}>{exp.bullets.map((b,j)=><li key={j} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#222", marginBottom:"0.025in", lineHeight:1.6, breakInside:"avoid", pageBreakInside:"avoid" }}>{b}</li>)}</ul>}
    </div>
  );
}

/* ============================================================
   LAYOUT: POWER (bold dark header, diagonal accent)
   ============================================================ */
function LayoutPower({ data, accent, accent2, nameFont, bodyFont }) {
  const teal = accent2||"#00C2B8";
  const ci = [data.contact?.email,data.contact?.phone,data.contact?.location,data.contact?.linkedin,data.contact?.website].filter(Boolean);
  return (
    <div style={{ width:"8.5in", background:"#F7FFFE", fontFamily:bodyFont, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.22)" }}>
      <div style={{ background:accent, padding:"0.45in 0.7in 0.38in", boxSizing:"border-box", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, width:"3in", height:"100%", background:h2r(teal,0.12), clipPath:"polygon(40% 0, 100% 0, 100% 100%, 0% 100%)" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"4px", background:`linear-gradient(to right, ${teal}, ${h2r(teal,0.3)})` }}/>
        <div style={{ position:"relative" }}>
          <h1 style={{ fontFamily:nameFont, fontSize:"32pt", fontWeight:800, color:"#fff", margin:0, lineHeight:1.05, letterSpacing:"0.08em", textTransform:"uppercase" }}>{data.name||"Your Name"}</h1>
          {data.specialties?.length>0&&<div style={{ display:"flex", flexWrap:"wrap", gap:"0.05in", marginTop:"0.1in" }}>{data.specialties.slice(0,5).map((s,i)=><span key={i} style={{ fontFamily:bodyFont, fontSize:"7.5pt", background:h2r(teal,0.25), color:"rgba(255,255,255,0.95)", padding:"0.025in 0.1in", border:`1px solid ${h2r(teal,0.5)}`, fontWeight:600, borderRadius:"3px", letterSpacing:"0.04em" }}>{s}</span>)}</div>}
          <div style={{ color:"rgba(255,255,255,0.55)", fontSize:"8.5pt", marginTop:"0.1in", fontFamily:bodyFont }}>{ci.join("  ·  ")}</div>
        </div>
      </div>
      <div style={{ padding:"0.35in 0.7in 0.6in", boxSizing:"border-box" }}>
        {data.philosophy&&<div style={{ fontFamily:bodyFont, fontSize:"10pt", color:"#444", lineHeight:1.72, marginBottom:"0.18in", paddingLeft:"0.15in", borderLeft:`3px solid ${teal}`, fontStyle:"italic" }}>{data.philosophy}</div>}
        {data.experience?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont} style={{ marginTop:0 }}>Experience</SecHead>{data.experience.map((exp,i)=><ExpBlock key={i} exp={exp} accent={accent} teal={teal} bodyFont={bodyFont} i={i} total={data.experience.length}/>)}</>}
        {data.achievements?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont}>Client Results</SecHead><div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"0.1in" }}>{data.achievements.map((a,i)=><div key={i} style={{ background:h2r(teal,0.07), border:`1px solid ${h2r(teal,0.2)}`, padding:"0.1in 0.12in", borderRadius:"4px", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontFamily:nameFont, fontSize:"13pt", fontWeight:800, color:teal, lineHeight:1 }}>{a.stat}</div><div style={{ fontFamily:bodyFont, fontSize:"8pt", color:"#555", marginTop:"0.04in", lineHeight:1.4 }}>{a.client}</div></div>)}</div></>}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.4in", marginTop:"0.1in" }}>
          <div>
            {data.certifications?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont} style={{ marginTop:0 }}>Certifications</SecHead>{data.certifications.map((c,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#333", marginBottom:"0.08in", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontWeight:700, color:"#111" }}>{c.name}</div>{c.issuer&&<div style={{ color:"#666", fontSize:"8.5pt" }}>{c.issuer}</div>}<div style={{ display:"flex", gap:"0.1in", marginTop:"0.02in" }}>{c.date&&<span style={{ color:teal, fontWeight:600, fontSize:"8.5pt" }}>{c.date}</span>}{c.expiry&&<span style={{ color:"#999", fontSize:"8.5pt" }}>Exp: {c.expiry}</span>}</div></div>)}</>}
          </div>
          <div>
            {data.education?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont} style={{ marginTop:0 }}>Education</SecHead>{data.education.map((ed,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.09in", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontWeight:700 }}>{ed.degree}</div><div style={{ color:teal, fontWeight:500 }}>{ed.school}{ed.date&&<span style={{ color:"#777", fontWeight:400 }}> · {ed.date}</span>}</div>{ed.notes&&<div style={{ fontStyle:"italic", color:"#888", fontSize:"9pt" }}>{ed.notes}</div>}</div>)}</>}
            {data.skills?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont}>Skills</SecHead><div style={{ display:"flex", flexWrap:"wrap", gap:"0.05in" }}>{data.skills.map((s,i)=><SpecChip key={i} label={s} accent={accent} bodyFont={bodyFont} small={true}/>)}</div></>}
            {data.awards?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont}>Awards</SecHead>{data.awards.map((a,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#333", marginBottom:"0.05in" }}>{a}</div>)}</>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LAYOUT: STUDIO (split header, boutique studio)
   ============================================================ */
function LayoutStudio({ data, accent, accent2, nameFont, bodyFont }) {
  const teal = accent2||"#06D6A0";
  const ci = [data.contact?.email,data.contact?.phone,data.contact?.location,data.contact?.instagram].filter(Boolean);
  return (
    <div style={{ width:"8.5in", background:"#FAFFFE", fontFamily:bodyFont, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.18)" }}>
      <div style={{ display:"flex", borderBottom:`3px solid ${teal}` }}>
        <div style={{ width:"2.6in", background:accent, padding:"0.42in 0.32in", display:"flex", flexDirection:"column", justifyContent:"center", flexShrink:0 }}>
          <div style={{ fontFamily:nameFont, fontSize:"18pt", fontWeight:800, color:"#fff", lineHeight:1.15, wordBreak:"break-word", letterSpacing:"0.02em" }}>{data.name||"Your Name"}</div>
          {data.contact?.location&&<div style={{ fontFamily:bodyFont, fontSize:"8pt", color:h2r(teal,0.9), marginTop:"0.06in", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" }}>{data.contact.location}</div>}
          <div style={{ marginTop:"0.15in", borderTop:`1px solid ${h2r(teal,0.3)}`, paddingTop:"0.12in" }}>
            {ci.map((v,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8pt", color:"rgba(255,255,255,0.78)", marginBottom:"0.04in", wordBreak:"break-word" }}>{v}</div>)}
          </div>
          {data.skills?.length>0&&<div style={{ marginTop:"0.15in", borderTop:`1px solid ${h2r(teal,0.3)}`, paddingTop:"0.12in" }}>
            <div style={{ fontFamily:bodyFont, fontSize:"7pt", textTransform:"uppercase", letterSpacing:"0.18em", color:h2r(teal,0.85), fontWeight:700, marginBottom:"0.08in" }}>Skills</div>
            {data.skills.map((s,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8pt", color:"rgba(255,255,255,0.82)", marginBottom:"0.04in", display:"flex", alignItems:"center", gap:"0.07in" }}><span style={{ width:"4px", height:"4px", background:teal, borderRadius:"50%", flexShrink:0, display:"inline-block" }}/>{s}</div>)}
          </div>}
        </div>
        <div style={{ flex:1, padding:"0.38in 0.45in", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
          {data.specialties?.length>0&&<div style={{ display:"flex", flexWrap:"wrap", gap:"0.05in", marginBottom:"0.1in" }}>{data.specialties.map((s,i)=><SpecChip key={i} label={s} accent={accent} bodyFont={bodyFont}/>)}</div>}
          {data.philosophy&&<div style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#555", lineHeight:1.65, fontStyle:"italic" }}>{data.philosophy}</div>}
        </div>
      </div>
      <div style={{ padding:"0.32in 0.55in 0.6in", boxSizing:"border-box" }}>
        {data.experience?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont} style={{ marginTop:0 }}>Experience</SecHead>{data.experience.map((exp,i)=><ExpBlock key={i} exp={exp} accent={accent} teal={teal} bodyFont={bodyFont} i={i} total={data.experience.length}/>)}</>}
        {data.achievements?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont}>Client Results</SecHead><div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.1in" }}>{data.achievements.map((a,i)=><div key={i} style={{ background:h2r(teal,0.07), border:`1px solid ${h2r(teal,0.2)}`, padding:"0.1in 0.12in", borderRadius:"4px", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontFamily:nameFont, fontSize:"13pt", fontWeight:800, color:teal, lineHeight:1 }}>{a.stat}</div><div style={{ fontFamily:bodyFont, fontSize:"8pt", color:"#555", marginTop:"0.04in", lineHeight:1.4 }}>{a.client}</div></div>)}</div></>}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.4in" }}>
          <div>
            {data.certifications?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont}>Certifications</SecHead>{data.certifications.map((c,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#333", marginBottom:"0.08in", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontWeight:700 }}>{c.name}</div>{c.issuer&&<div style={{ color:"#666", fontSize:"8.5pt" }}>{c.issuer}</div>}<div style={{ display:"flex", gap:"0.1in" }}>{c.date&&<span style={{ color:teal, fontWeight:600 }}>{c.date}</span>}{c.expiry&&<span style={{ color:"#999" }}>Exp: {c.expiry}</span>}</div></div>)}</>}
          </div>
          <div>
            {data.education?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont}>Education</SecHead>{data.education.map((ed,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.09in", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontWeight:700 }}>{ed.degree}</div><div style={{ color:teal, fontWeight:500 }}>{ed.school}{ed.date&&<span style={{ color:"#777", fontWeight:400 }}> · {ed.date}</span>}</div>{ed.notes&&<div style={{ fontStyle:"italic", color:"#888", fontSize:"9pt" }}>{ed.notes}</div>}</div>)}</>}
            {data.awards?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont}>Awards</SecHead>{data.awards.map((a,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#333", marginBottom:"0.05in" }}>{a}</div>)}</>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LAYOUT: ATHLETE (dark sidebar, metrics-forward)
   ============================================================ */
function LayoutAthlete({ data, accent, accent2, nameFont, bodyFont }) {
  const teal = accent2||"#00C2B8";
  const ci = [data.contact?.email,data.contact?.phone,data.contact?.location,data.contact?.linkedin,data.contact?.instagram].filter(Boolean);
  return (
    <div style={{ width:"8.5in", background:"#F7FFFE", fontFamily:bodyFont, boxSizing:"border-box", display:"flex", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.22)" }}>
      <div style={{ width:"2.55in", background:accent, padding:"0.5in 0.3in", boxSizing:"border-box", flexShrink:0 }}>
        <div style={{ fontFamily:nameFont, fontSize:"17pt", fontWeight:800, color:"#fff", lineHeight:1.15, wordBreak:"break-word", textTransform:"uppercase", letterSpacing:"0.04em" }}>{data.name||"Your Name"}</div>
        {data.specialties?.length>0&&<div style={{ display:"flex", flexWrap:"wrap", gap:"0.04in", marginTop:"0.1in" }}>{data.specialties.slice(0,6).map((s,i)=><span key={i} style={{ fontFamily:bodyFont, fontSize:"7pt", background:h2r(teal,0.25), color:"rgba(255,255,255,0.95)", padding:"0.02in 0.08in", border:`1px solid ${h2r(teal,0.4)}`, fontWeight:600, borderRadius:"2px" }}>{s}</span>)}</div>}
        <div style={{ marginTop:"0.18in", borderTop:`1px solid ${h2r(teal,0.3)}`, paddingTop:"0.15in" }}>
          <div style={{ fontFamily:bodyFont, fontSize:"7pt", textTransform:"uppercase", letterSpacing:"0.18em", color:h2r(teal,0.85), fontWeight:700, marginBottom:"0.08in" }}>Contact</div>
          {ci.map((v,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8pt", color:"rgba(255,255,255,0.82)", marginBottom:"0.05in", wordBreak:"break-word" }}>{v}</div>)}
        </div>
        {data.certifications?.length>0&&<div style={{ marginTop:"0.18in", borderTop:`1px solid ${h2r(teal,0.3)}`, paddingTop:"0.15in" }}>
          <div style={{ fontFamily:bodyFont, fontSize:"7pt", textTransform:"uppercase", letterSpacing:"0.18em", color:h2r(teal,0.85), fontWeight:700, marginBottom:"0.08in" }}>Certifications</div>
          {data.certifications.map((c,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"7.5pt", color:"rgba(255,255,255,0.82)", marginBottom:"0.08in" }}><div style={{ fontWeight:600 }}>{c.name}</div>{c.date&&<span style={{ color:h2r(teal,0.9), fontSize:"7pt" }}>{c.date}</span>}{c.expiry&&<span style={{ color:"rgba(255,255,255,0.45)", fontSize:"7pt" }}> · Exp {c.expiry}</span>}</div>)}
        </div>}
        {data.skills?.length>0&&<div style={{ marginTop:"0.18in", borderTop:`1px solid ${h2r(teal,0.3)}`, paddingTop:"0.15in" }}>
          <div style={{ fontFamily:bodyFont, fontSize:"7pt", textTransform:"uppercase", letterSpacing:"0.18em", color:h2r(teal,0.85), fontWeight:700, marginBottom:"0.08in" }}>Skills</div>
          {data.skills.map((s,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8pt", color:"rgba(255,255,255,0.82)", marginBottom:"0.04in", display:"flex", alignItems:"center", gap:"0.06in" }}><span style={{ width:"3px", height:"10px", background:teal, flexShrink:0, borderRadius:"2px", display:"inline-block" }}/>{s}</div>)}
        </div>}
        {data.awards?.length>0&&<div style={{ marginTop:"0.18in", borderTop:`1px solid ${h2r(teal,0.3)}`, paddingTop:"0.15in" }}>
          <div style={{ fontFamily:bodyFont, fontSize:"7pt", textTransform:"uppercase", letterSpacing:"0.18em", color:h2r(teal,0.85), fontWeight:700, marginBottom:"0.08in" }}>Awards</div>
          {data.awards.map((a,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"7.5pt", color:"rgba(255,255,255,0.78)", marginBottom:"0.07in", lineHeight:1.45 }}>{a}</div>)}
        </div>}
      </div>
      <div style={{ flex:1, padding:"0.5in 0.45in 0.6in 0.4in", boxSizing:"border-box" }}>
        {data.philosophy&&<div style={{ fontFamily:bodyFont, fontSize:"10pt", color:"#555", lineHeight:1.7, marginBottom:"0.18in", paddingBottom:"0.15in", borderBottom:`1px solid ${h2r(accent,0.1)}`, fontStyle:"italic" }}>{data.philosophy}</div>}
        {data.experience?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont} style={{ marginTop:0 }}>Experience</SecHead>{data.experience.map((exp,i)=><ExpBlock key={i} exp={exp} accent={accent} teal={teal} bodyFont={bodyFont} i={i} total={data.experience.length}/>)}</>}
        {data.achievements?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont}>Client Results</SecHead><div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.1in" }}>{data.achievements.map((a,i)=><div key={i} style={{ background:h2r(teal,0.07), border:`1px solid ${h2r(teal,0.2)}`, padding:"0.1in 0.12in", borderRadius:"4px", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontFamily:nameFont, fontSize:"12pt", fontWeight:800, color:teal, lineHeight:1 }}>{a.stat}</div><div style={{ fontFamily:bodyFont, fontSize:"8pt", color:"#555", marginTop:"0.03in", lineHeight:1.4 }}>{a.client}</div></div>)}</div></>}
        {data.education?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont}>Education</SecHead>{data.education.map((ed,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.09in", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontWeight:700 }}>{ed.degree}</div><div style={{ color:teal, fontWeight:500 }}>{ed.school}{ed.date&&<span style={{ color:"#777", fontWeight:400 }}> · {ed.date}</span>}</div>{ed.notes&&<div style={{ fontStyle:"italic", color:"#888", fontSize:"9pt" }}>{ed.notes}</div>}</div>)}</>}
      </div>
    </div>
  );
}

/* ============================================================
   LAYOUT: FLOW (teal gradient header, wellness)
   ============================================================ */
function LayoutFlow({ data, accent, accent2, nameFont, bodyFont }) {
  const teal = accent2||"#00E5D4";
  const ci = [data.contact?.email,data.contact?.phone,data.contact?.location,data.contact?.instagram,data.contact?.website].filter(Boolean);
  return (
    <div style={{ width:"8.5in", background:"#FAFFFE", fontFamily:bodyFont, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.15)" }}>
      <div style={{ background:`linear-gradient(135deg, ${accent} 0%, ${lighten(accent,0.1)} 60%, ${h2r(teal,0.85)} 100%)`, padding:"0.5in 0.75in 0.38in", boxSizing:"border-box", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-20%", right:"-8%", width:"4in", height:"4in", borderRadius:"50%", background:"rgba(255,255,255,0.05)" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"3px", background:`linear-gradient(to right, ${teal}, rgba(0,229,212,0.2))` }}/>
        <div style={{ position:"relative" }}>
          <h1 style={{ fontFamily:nameFont, fontSize:"30pt", fontWeight:800, color:"#fff", margin:0, lineHeight:1.1 }}>{data.name||"Your Name"}</h1>
          {data.specialties?.length>0&&<div style={{ display:"flex", flexWrap:"wrap", gap:"0.05in", marginTop:"0.1in" }}>{data.specialties.slice(0,6).map((s,i)=><span key={i} style={{ fontFamily:bodyFont, fontSize:"7.5pt", background:"rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.95)", padding:"0.025in 0.1in", border:"1px solid rgba(255,255,255,0.3)", fontWeight:600, borderRadius:"50px" }}>{s}</span>)}</div>}
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:"8.5pt", marginTop:"0.1in", fontFamily:bodyFont }}>{ci.join("  ·  ")}</div>
        </div>
      </div>
      <div style={{ padding:"0.35in 0.75in 0.6in", boxSizing:"border-box" }}>
        {data.philosophy&&<div style={{ fontFamily:bodyFont, fontSize:"10.5pt", color:"#444", lineHeight:1.72, marginBottom:"0.2in", paddingBottom:"0.18in", borderBottom:`1px solid ${h2r(accent,0.1)}`, fontStyle:"italic", textAlign:"center" }}>{data.philosophy}</div>}
        {data.experience?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont} style={{ marginTop:0 }}>Experience</SecHead>{data.experience.map((exp,i)=><ExpBlock key={i} exp={exp} accent={accent} teal={teal} bodyFont={bodyFont} i={i} total={data.experience.length}/>)}</>}
        {data.achievements?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont}>Client Results</SecHead><div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.1in" }}>{data.achievements.map((a,i)=><div key={i} style={{ background:h2r(teal,0.08), border:`1px solid ${h2r(teal,0.25)}`, padding:"0.1in 0.12in", borderRadius:"8px", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontFamily:nameFont, fontSize:"13pt", fontWeight:800, color:accent, lineHeight:1 }}>{a.stat}</div><div style={{ fontFamily:bodyFont, fontSize:"8pt", color:"#555", marginTop:"0.04in", lineHeight:1.4 }}>{a.client}</div></div>)}</div></>}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.4in" }}>
          <div>
            {data.certifications?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont}>Certifications</SecHead>{data.certifications.map((c,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#333", marginBottom:"0.08in", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontWeight:700 }}>{c.name}</div>{c.issuer&&<div style={{ color:"#666", fontSize:"8.5pt" }}>{c.issuer}</div>}<div style={{ display:"flex", gap:"0.08in" }}>{c.date&&<span style={{ color:accent, fontWeight:600 }}>{c.date}</span>}{c.expiry&&<span style={{ color:"#999" }}>Exp: {c.expiry}</span>}</div></div>)}</>}
          </div>
          <div>
            {data.education?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont}>Education</SecHead>{data.education.map((ed,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.09in", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontWeight:700 }}>{ed.degree}</div><div style={{ color:accent, fontWeight:500 }}>{ed.school}{ed.date&&<span style={{ color:"#777", fontWeight:400 }}> · {ed.date}</span>}</div>{ed.notes&&<div style={{ fontStyle:"italic", color:"#888", fontSize:"9pt" }}>{ed.notes}</div>}</div>)}</>}
            {data.skills?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont}>Skills</SecHead><div style={{ display:"flex", flexWrap:"wrap", gap:"0.05in" }}>{data.skills.map((s,i)=><span key={i} style={{ fontFamily:bodyFont, fontSize:"8pt", background:h2r(accent,0.07), color:accent, padding:"0.02in 0.09in", border:`1px solid ${h2r(accent,0.18)}`, fontWeight:600, borderRadius:"50px" }}>{s}</span>)}</div></>}
            {data.awards?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont}>Awards</SecHead>{data.awards.map((a,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#333", marginBottom:"0.05in" }}>{a}</div>)}</>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LAYOUT: COACH (professional two-column)
   ============================================================ */
function LayoutCoach({ data, accent, accent2, nameFont, bodyFont }) {
  const teal = accent2||"#00C2B8";
  const ci = [data.contact?.email,data.contact?.phone,data.contact?.location,data.contact?.linkedin,data.contact?.website].filter(Boolean);
  return (
    <div style={{ width:"8.5in", background:"#FAFFFE", fontFamily:bodyFont, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.18)" }}>
      <div style={{ background:accent, padding:"0.42in 0.7in 0.35in", boxSizing:"border-box", position:"relative" }}>
        <div style={{ position:"absolute", bottom:0, left:0, width:"100%", height:"3px", background:`linear-gradient(to right, ${teal} 0%, ${h2r(teal,0.2)} 100%)` }}/>
        <h1 style={{ fontFamily:nameFont, fontSize:"28pt", fontWeight:800, color:"#fff", margin:0, lineHeight:1.1, letterSpacing:"0.04em" }}>{data.name||"Your Name"}</h1>
        {data.specialties?.length>0&&<div style={{ display:"flex", flexWrap:"wrap", gap:"0.05in", marginTop:"0.09in" }}>{data.specialties.slice(0,5).map((s,i)=><span key={i} style={{ fontFamily:bodyFont, fontSize:"7.5pt", background:h2r(teal,0.22), color:"rgba(255,255,255,0.95)", padding:"0.02in 0.1in", border:`1px solid ${h2r(teal,0.45)}`, fontWeight:600, borderRadius:"3px" }}>{s}</span>)}</div>}
        <div style={{ color:"rgba(255,255,255,0.55)", fontSize:"8.5pt", marginTop:"0.09in", fontFamily:bodyFont }}>{ci.join("  ·  ")}</div>
      </div>
      <div style={{ display:"flex", padding:"0.35in 0.7in 0.6in", gap:"0.45in", boxSizing:"border-box" }}>
        <div style={{ width:"2.1in", flexShrink:0 }}>
          {data.certifications?.length>0&&<><div style={{ fontFamily:bodyFont, fontSize:"7.5pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.18em", color:teal, marginBottom:"0.08in" }}>Certifications</div>{data.certifications.map((c,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8.5pt", color:"#333", marginBottom:"0.09in", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontWeight:600, color:"#111" }}>{c.name}</div>{c.issuer&&<div style={{ color:"#777", fontSize:"8pt" }}>{c.issuer}</div>}<div style={{ display:"flex", gap:"0.08in" }}>{c.date&&<span style={{ color:teal, fontWeight:600 }}>{c.date}</span>}{c.expiry&&<span style={{ color:"#999", fontSize:"8pt" }}>Exp: {c.expiry}</span>}</div></div>)}</>}
          {data.education?.length>0&&<><div style={{ fontFamily:bodyFont, fontSize:"7.5pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.18em", color:teal, marginBottom:"0.08in", marginTop:"0.18in", paddingTop:"0.15in", borderTop:`1px solid ${h2r(accent,0.1)}` }}>Education</div>{data.education.map((ed,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8.5pt", color:"#333", marginBottom:"0.1in", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontWeight:600 }}>{ed.degree}</div>{ed.school&&<div style={{ color:teal, fontWeight:500 }}>{ed.school}</div>}{ed.date&&<div style={{ color:"#777" }}>{ed.date}</div>}{ed.notes&&<div style={{ fontStyle:"italic", color:"#888", fontSize:"8pt" }}>{ed.notes}</div>}</div>)}</>}
          {data.skills?.length>0&&<><div style={{ fontFamily:bodyFont, fontSize:"7.5pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.18em", color:teal, marginBottom:"0.08in", marginTop:"0.18in", paddingTop:"0.15in", borderTop:`1px solid ${h2r(accent,0.1)}` }}>Skills</div>{data.skills.map((s,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8.5pt", color:"#444", marginBottom:"0.04in", paddingLeft:"0.09in", borderLeft:`2px solid ${h2r(teal,0.5)}` }}>{s}</div>)}</>}
          {data.awards?.length>0&&<><div style={{ fontFamily:bodyFont, fontSize:"7.5pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.18em", color:teal, marginBottom:"0.08in", marginTop:"0.18in", paddingTop:"0.15in", borderTop:`1px solid ${h2r(accent,0.1)}` }}>Awards</div>{data.awards.map((a,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8pt", color:"#444", marginBottom:"0.05in", lineHeight:1.45 }}>{a}</div>)}</>}
        </div>
        <div style={{ flex:1 }}>
          {data.philosophy&&<div style={{ fontFamily:bodyFont, fontSize:"10pt", color:"#555", lineHeight:1.7, marginBottom:"0.18in", paddingBottom:"0.15in", borderBottom:`1px solid ${h2r(accent,0.1)}`, fontStyle:"italic" }}>{data.philosophy}</div>}
          {data.experience?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont} style={{ marginTop:0 }}>Experience</SecHead>{data.experience.map((exp,i)=><ExpBlock key={i} exp={exp} accent={accent} teal={teal} bodyFont={bodyFont} i={i} total={data.experience.length}/>)}</>}
          {data.achievements?.length>0&&<><SecHead accent={accent} teal={teal} bodyFont={bodyFont}>Client Results</SecHead><div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.08in" }}>{data.achievements.map((a,i)=><div key={i} style={{ background:h2r(teal,0.07), border:`1px solid ${h2r(teal,0.2)}`, padding:"0.09in 0.1in", borderRadius:"4px", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontFamily:nameFont, fontSize:"12pt", fontWeight:800, color:teal, lineHeight:1 }}>{a.stat}</div><div style={{ fontFamily:bodyFont, fontSize:"7.5pt", color:"#555", marginTop:"0.03in", lineHeight:1.4 }}>{a.client}</div></div>)}</div></>}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LAYOUT: CIRCUIT (ATS-safe single column)
   ============================================================ */
function LayoutCircuit({ data, accent, nameFont, bodyFont }) {
  const ci = [data.contact?.email,data.contact?.phone,data.contact?.location,data.contact?.linkedin,data.contact?.website].filter(Boolean);
  const SH = ({children}) => <div style={{ fontFamily:bodyFont, fontSize:"8.5pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", color:accent, borderBottom:`1.5px solid ${h2r(accent,0.2)}`, paddingBottom:"0.04in", marginTop:"0.18in", marginBottom:"0.09in", breakAfter:"avoid", pageBreakAfter:"avoid" }}>{children}</div>;
  return (
    <div style={{ width:"8.5in", background:"#fff", fontFamily:bodyFont, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.1)", padding:"0.6in 0.85in 0.7in" }}>
      <div style={{ borderBottom:`2.5px solid ${accent}`, paddingBottom:"0.16in", marginBottom:"0.08in" }}>
        <h1 style={{ fontFamily:nameFont, fontSize:"26pt", fontWeight:800, color:accent, margin:0, lineHeight:1.1, letterSpacing:"0.04em" }}>{data.name||"Your Name"}</h1>
        {data.specialties?.length>0&&<div style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#666", marginTop:"0.06in", fontStyle:"italic" }}>{data.specialties.join("  ·  ")}</div>}
        {ci.length>0&&<div style={{ fontFamily:bodyFont, fontSize:"8.5pt", color:"#888", marginTop:"0.08in" }}>{ci.join("  ·  ")}</div>}
      </div>
      {data.philosophy&&<><SH>Training Philosophy</SH><div style={{ fontFamily:bodyFont, fontSize:"10pt", color:"#444", lineHeight:1.7 }}>{data.philosophy}</div></>}
      {data.experience?.length>0&&<><SH>Experience</SH>{data.experience.map((exp,i)=><ExpBlock key={i} exp={exp} accent={accent} teal={accent} bodyFont={bodyFont} i={i} total={data.experience.length}/>)}</>}
      {data.achievements?.length>0&&<><SH>Client Results</SH>{data.achievements.map((a,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.07in", breakInside:"avoid", pageBreakInside:"avoid" }}><span style={{ fontWeight:700, color:accent }}>{a.stat}</span> — {a.client}</div>)}</>}
      {data.certifications?.length>0&&<><SH>Certifications</SH><ul style={{ margin:0, paddingLeft:"0.2in" }}>{data.certifications.map((c,i)=><li key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.04in", breakInside:"avoid", pageBreakInside:"avoid" }}><span style={{ fontWeight:600 }}>{c.name}</span>{c.issuer&&` — ${c.issuer}`}{c.date&&<span style={{ color:accent }}> ({c.date})</span>}{c.expiry&&<span style={{ color:"#999" }}> · Exp: {c.expiry}</span>}</li>)}</ul></>}
      {data.education?.length>0&&<><SH>Education & Training</SH>{data.education.map((ed,i)=><div key={i} style={{ marginBottom:"0.09in", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontFamily:bodyFont, fontWeight:700, fontSize:"10.5pt", color:"#111" }}>{ed.degree}{ed.school&&<span style={{ fontWeight:400, color:"#666" }}> — {ed.school}</span>}</div>{ed.date&&<div style={{ fontFamily:bodyFont, fontSize:"9pt", color:accent, fontWeight:600 }}>{ed.date}</div>}{ed.notes&&<div style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#666", fontStyle:"italic" }}>{ed.notes}</div>}</div>)}</>}
      {data.skills?.length>0&&<><SH>Skills</SH><div style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333" }}>{data.skills.join("  ·  ")}</div></>}
      {data.awards?.length>0&&<><SH>Awards & Recognition</SH>{data.awards.map((a,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.04in" }}>{a}</div>)}</>}
    </div>
  );
}

/* ── Router ── */
function ResumePreview({ templateId, data, accent }) {
  const tpl = TEMPLATES.find(t=>t.id===templateId)||TEMPLATES[0];
  const props = { data, accent:accent||tpl.accent, accent2:tpl.accent2, nameFont:tpl.nameFont, bodyFont:tpl.bodyFont };
  switch(tpl.layout) {
    case "power":   return <LayoutPower {...props}/>;
    case "studio":  return <LayoutStudio {...props}/>;
    case "athlete": return <LayoutAthlete {...props}/>;
    case "flow":    return <LayoutFlow {...props}/>;
    case "coach":   return <LayoutCoach {...props}/>;
    case "circuit": return <LayoutCircuit {...props}/>;
    default:        return <LayoutPower {...props}/>;
  }
}

/* ============================================================
   EXPORT
   ============================================================ */
function exportPDF(el, name) {
  if(!el)return;
  const printCSS=`@page{size:letter;margin:0}html,body{margin:0;padding:0;background:white;-webkit-print-color-adjust:exact;print-color-adjust:exact}*{box-sizing:border-box}h1,h2,h3{page-break-after:avoid;break-after:avoid}li{page-break-inside:avoid;break-inside:avoid;orphans:3;widows:3}ul{page-break-inside:avoid;break-inside:avoid}div{-webkit-print-color-adjust:exact;print-color-adjust:exact}`;
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${(name||"Resume").replace(/[<>&"']/g,"")}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Raleway:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700;800&display=swap"><style>${printCSS}</style></head><body>${el.innerHTML}<script>(function(){if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){setTimeout(function(){window.focus();window.print();},300);})}else{setTimeout(function(){window.focus();window.print();},900);}})()</script></body></html>`;
  const w=window.open("","_blank","width=900,height=1100");
  if(!w){alert("Please allow pop-ups to print.");return;}
  w.document.open();w.document.write(html);w.document.close();
}

function exportWord(data, accent) {
  const ac=hexToRtf(accent);
  const fn=((data.name||"resume").replace(/[^a-z0-9]+/gi,"_").toLowerCase())+"_resume.rtf";
  const out=[];
  out.push(`{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat{\\fonttbl{\\f0\\fswiss\\fcharset0 Arial;}{\\f1\\froman\\fcharset0 Garamond;}}{\\colortbl;\\red17\\green17\\blue17;\\red80\\green80\\blue80;\\red${ac.r}\\green${ac.g}\\blue${ac.b};}\\paperw12240\\paperh15840\\margl1080\\margr1080\\margt1080\\margb1080\\f0\\fs22\\cf1`);
  if(data.name) out.push(`{\\pard\\ql\\sb0\\sa80\\fs44\\b\\cf3 ${rtfEsc(data.name)}\\b0\\par}`);
  if(data.specialties?.length) out.push(`{\\pard\\ql\\sb0\\sa60\\fs20\\i\\cf2 ${rtfEsc(data.specialties.join("  ·  "))}\\i0\\par}`);
  const ci=[data.contact?.email,data.contact?.phone,data.contact?.location,data.contact?.linkedin,data.contact?.instagram,data.contact?.website].filter(Boolean);
  if(ci.length) out.push(`{\\pard\\ql\\sb0\\sa200\\fs19\\cf2 ${rtfEsc(ci.join("  ·  "))}\\par}`);
  out.push(`{\\pard\\ql\\sb0\\sa200\\brdrb\\brdrs\\brdrw20\\brdrcf3\\par}`);
  if(data.philosophy) out.push(`{\\pard\\ql\\sb0\\sa200\\fs21\\i\\cf2\\keep ${rtfEsc(data.philosophy)}\\i0\\par}`);
  const sh=t=>{out.push(`{\\pard\\ql\\sb200\\sa60\\fs19\\b\\cf3\\keepn ${rtfEsc(t.toUpperCase())}\\b0\\par}`);out.push(`{\\pard\\ql\\sb0\\sa80\\brdrb\\brdrs\\brdrw10\\brdrcf3\\keepn\\par}`);};
  if(data.experience?.length){sh("Experience");data.experience.forEach(exp=>{out.push(`{\\pard\\ql\\sb80\\sa20\\fs22\\keepn\\tx9000\\tqr\\tx9000 {\\b ${rtfEsc(exp.title)}\\b0}${exp.venue?` \\u8212? ${rtfEsc(exp.venue)}`:""}${exp.location?`, ${rtfEsc(exp.location)}`:""} \\tab ${rtfEsc([exp.start,exp.end].filter(Boolean).join(" \\u8212? "))}\\par}`);if(exp.type||exp.clients)out.push(`{\\pard\\ql\\sa20\\fs20\\cf3\\keep ${rtfEsc([exp.type,exp.clients].filter(Boolean).join(" · "))}\\par}`);(exp.bullets||[]).forEach(b=>out.push(`{\\pard\\fi-280\\li360\\sa20\\fs22\\keep \\u8226? \\tab ${rtfEsc(b)}\\par}`));out.push(`{\\pard\\sb60\\par}`);})}
  if(data.achievements?.length){sh("Client Results");data.achievements.forEach(a=>{out.push(`{\\pard\\ql\\sb60\\sa20\\fs22\\keep {\\b\\cf3 ${rtfEsc(a.stat)}\\b0} \\u8212? ${rtfEsc(a.client)}\\par}`);})}
  if(data.certifications?.length){sh("Certifications");data.certifications.forEach(c=>{out.push(`{\\pard\\ql\\sb60\\sa20\\fs22\\keep {\\b ${rtfEsc(c.name)}\\b0}${c.issuer?` \\u8212? ${rtfEsc(c.issuer)}`:""}${c.date?` (${rtfEsc(c.date)})`:""}`);if(c.expiry)out.push(` Exp: ${rtfEsc(c.expiry)}`);out.push(`\\par}`);})}
  if(data.education?.length){sh("Education");data.education.forEach(ed=>{out.push(`{\\pard\\ql\\sb80\\sa20\\fs22\\keep {\\b ${rtfEsc(ed.degree)}\\b0}${ed.school?` \\u8212? ${rtfEsc(ed.school)}`:""} ${rtfEsc(ed.date||"")}\\par}`);if(ed.notes)out.push(`{\\pard\\ql\\sa40\\fs20\\i\\cf2\\keep ${rtfEsc(ed.notes)}\\i0\\par}`);out.push(`{\\pard\\sb40\\par}`);})}
  if(data.skills?.length) out.push(`{\\pard\\ql\\sb200\\sa60\\fs19\\b\\cf3\\keepn SKILLS\\b0\\par}{\\pard\\ql\\sa80\\brdrb\\brdrs\\brdrw10\\brdrcf3\\par}{\\pard\\ql\\sa120\\fs22\\cf1\\keep ${rtfEsc(data.skills.join("  ·  "))}\\par}`);
  if(data.awards?.length){sh("Awards & Recognition");data.awards.forEach(a=>out.push(`{\\pard\\fi-280\\li360\\sa20\\fs22\\keep \\u8226? \\tab ${rtfEsc(a)}\\par}`))}
  out.push("}");
  dlBlob(new Blob([out.join("\n")],{type:"application/rtf"}),fn);
}

/* ============================================================
   COVER LETTER PREVIEW — matches each PulseCV template
   ============================================================ */
function CoverLetterPreview({ templateId, cl, accent }) {
  const tpl    = TEMPLATES.find(t=>t.id===templateId)||TEMPLATES[0];
  const ac     = accent||tpl.accent;
  const teal   = tpl.accent2||"#00C2B8";
  const nf     = tpl.nameFont;
  const bf     = tpl.bodyFont;
  const layout = tpl.layout;

  const empty = !cl.senderName && !cl.company && !cl.opening;
  if(empty) return (
    <div style={{ width:"8.5in", minHeight:"11in", background:"#F7FFFE", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.18)", boxSizing:"border-box" }}>
      <div style={{ textAlign:"center", color:"#bbb", fontFamily:OUTFIT, fontSize:"11pt" }}>
        <div style={{ fontSize:"28pt", marginBottom:"0.15in" }}>✉</div>Fill in the form to preview your cover letter
      </div>
    </div>
  );

  const contactStr = [cl.senderEmail, cl.senderPhone, cl.senderLocation, cl.senderInstagram].filter(Boolean).join("  ·  ");
  const salutation = `Dear ${cl.recipientName||"Hiring Manager"},`;
  const paragraphs = [cl.opening, cl.body1, cl.body2, cl.body3].filter(Boolean);
  const closing    = cl.closing||"Thank you for your time and consideration.";

  // Sign-off — always full name
  const SignOff = ({ darkBg=false, nameColor=teal }) => (
    <div>
      <div style={{ fontFamily:bf, fontSize:"10.5pt", color:darkBg?"rgba(255,255,255,0.85)":"#1c1c1c", marginTop:"0.06in" }}>{closing}</div>
      <div style={{ fontFamily:bf, fontSize:"10.5pt", color:darkBg?"rgba(255,255,255,0.85)":"#1c1c1c", marginTop:"0.3in" }}>Sincerely,</div>
      <div style={{ fontFamily:nf, fontSize:"14pt", fontWeight:800, color:darkBg?"#fff":nameColor, marginTop:"0.28in", letterSpacing:"0.02em" }}>{cl.senderName||""}</div>
      {cl.senderTitle&&<div style={{ fontFamily:bf, fontSize:"9pt", color:darkBg?"rgba(255,255,255,0.55)":"#777", marginTop:"0.04in", fontStyle:"italic" }}>{cl.senderTitle}</div>}
    </div>
  );

  const Body = ({ pad="0.42in 0.7in 0.7in", darkBg=false, nameColor=teal }) => {
    const tc = darkBg?"rgba(255,255,255,0.9)":"#1c1c1c";
    const sc = darkBg?"rgba(255,255,255,0.55)":"#555";
    const hc = darkBg?"rgba(255,255,255,0.35)":"#999";
    return (
      <div style={{ padding:pad, boxSizing:"border-box" }}>
        {cl.date&&<div style={{ fontFamily:bf, fontSize:"9.5pt", color:sc, marginBottom:"0.2in" }}>{cl.date}</div>}
        {(cl.recipientName||cl.recipientTitle||cl.company)&&(
          <div style={{ fontFamily:bf, fontSize:"9.5pt", color:tc, lineHeight:1.7, marginBottom:"0.26in" }}>
            {cl.recipientName&&<div style={{ fontWeight:700 }}>{cl.recipientName}</div>}
            {cl.recipientTitle&&<div style={{ color:sc }}>{cl.recipientTitle}</div>}
            {cl.company&&<div style={{ color:sc }}>{cl.company}</div>}
            {cl.companyAddress&&<div style={{ color:hc }}>{cl.companyAddress}</div>}
          </div>
        )}
        <div style={{ fontFamily:bf, fontSize:"10.5pt", color:tc, marginBottom:"0.2in" }}>{salutation}</div>
        {paragraphs.map((p,i)=><p key={i} style={{ fontFamily:bf, fontSize:"10.5pt", color:tc, lineHeight:1.78, margin:"0 0 0.17in 0" }}>{p}</p>)}
        <SignOff darkBg={darkBg} nameColor={nameColor}/>
      </div>
    );
  };

  /* ── power ── */
  if(layout==="power") return (
    <div style={{ width:"8.5in", background:"#F7FFFE", fontFamily:bf, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.22)" }}>
      <div style={{ background:ac, padding:"0.45in 0.7in 0.38in", boxSizing:"border-box", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, width:"3in", height:"100%", background:h2r(teal,0.12), clipPath:"polygon(40% 0, 100% 0, 100% 100%, 0% 100%)" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"4px", background:`linear-gradient(to right, ${teal}, ${h2r(teal,0.3)})` }}/>
        <div style={{ position:"relative" }}>
          <h1 style={{ fontFamily:nf, fontSize:"28pt", fontWeight:800, color:"#fff", margin:0, lineHeight:1.05, letterSpacing:"0.08em", textTransform:"uppercase" }}>{cl.senderName||"Your Name"}</h1>
          {cl.senderTitle&&<div style={{ fontFamily:bf, fontSize:"9.5pt", color:h2r(teal,0.9), marginTop:"0.07in", fontWeight:600 }}>{cl.senderTitle}</div>}
          {contactStr&&<div style={{ color:"rgba(255,255,255,0.55)", fontSize:"8.5pt", marginTop:"0.09in", fontFamily:bf }}>{contactStr}</div>}
        </div>
      </div>
      <Body pad="0.42in 0.7in 0.7in"/>
    </div>
  );

  /* ── studio ── */
  if(layout==="studio") return (
    <div style={{ width:"8.5in", background:"#FAFFFE", fontFamily:bf, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.18)" }}>
      <div style={{ display:"flex", borderBottom:`3px solid ${teal}` }}>
        <div style={{ width:"2.6in", background:ac, padding:"0.42in 0.32in", flexShrink:0 }}>
          <div style={{ fontFamily:nf, fontSize:"17pt", fontWeight:800, color:"#fff", lineHeight:1.15, letterSpacing:"0.02em" }}>{cl.senderName||"Your Name"}</div>
          {cl.senderTitle&&<div style={{ fontFamily:bf, fontSize:"8pt", color:h2r(teal,0.9), marginTop:"0.06in", fontWeight:600 }}>{cl.senderTitle}</div>}
          <div style={{ marginTop:"0.15in", borderTop:`1px solid ${h2r(teal,0.3)}`, paddingTop:"0.12in" }}>
            {[cl.senderEmail,cl.senderPhone,cl.senderLocation,cl.senderInstagram].filter(Boolean).map((v,i)=><div key={i} style={{ fontFamily:bf, fontSize:"8pt", color:"rgba(255,255,255,0.78)", marginBottom:"0.04in" }}>{v}</div>)}
          </div>
        </div>
        <div style={{ flex:1, padding:"0.38in 0.45in", display:"flex", alignItems:"flex-end" }}>
          {contactStr&&<div style={{ fontFamily:bf, fontSize:"8.5pt", color:"#888" }}>{cl.senderTitle}</div>}
        </div>
      </div>
      <Body pad="0.42in 0.55in 0.7in"/>
    </div>
  );

  /* ── athlete ── */
  if(layout==="athlete") return (
    <div style={{ width:"8.5in", background:"#F7FFFE", fontFamily:bf, boxSizing:"border-box", display:"flex", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.22)" }}>
      <div style={{ width:"2.55in", background:ac, padding:"0.5in 0.3in", boxSizing:"border-box", flexShrink:0 }}>
        <div style={{ fontFamily:nf, fontSize:"16pt", fontWeight:800, color:"#fff", lineHeight:1.15, textTransform:"uppercase", letterSpacing:"0.04em" }}>{cl.senderName||"Your Name"}</div>
        {cl.senderTitle&&<div style={{ fontFamily:bf, fontSize:"8pt", color:h2r(teal,0.9), marginTop:"0.06in", fontWeight:600 }}>{cl.senderTitle}</div>}
        <div style={{ marginTop:"0.18in", borderTop:`1px solid ${h2r(teal,0.3)}`, paddingTop:"0.15in" }}>
          <div style={{ fontFamily:bf, fontSize:"7pt", textTransform:"uppercase", letterSpacing:"0.18em", color:h2r(teal,0.85), fontWeight:700, marginBottom:"0.08in" }}>Contact</div>
          {[cl.senderEmail,cl.senderPhone,cl.senderLocation,cl.senderInstagram].filter(Boolean).map((v,i)=><div key={i} style={{ fontFamily:bf, fontSize:"8pt", color:"rgba(255,255,255,0.82)", marginBottom:"0.05in", wordBreak:"break-word" }}>{v}</div>)}
        </div>
      </div>
      <div style={{ flex:1 }}><Body pad="0.5in 0.45in 0.7in 0.4in"/></div>
    </div>
  );

  /* ── flow ── */
  if(layout==="flow") return (
    <div style={{ width:"8.5in", background:"#FAFFFE", fontFamily:bf, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.15)" }}>
      <div style={{ background:`linear-gradient(135deg, ${ac} 0%, ${lighten(ac,0.1)} 60%, ${h2r(teal,0.85)} 100%)`, padding:"0.5in 0.75in 0.38in", boxSizing:"border-box", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-20%", right:"-8%", width:"4in", height:"4in", borderRadius:"50%", background:"rgba(255,255,255,0.05)" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"3px", background:`linear-gradient(to right, ${teal}, rgba(0,229,212,0.2))` }}/>
        <div style={{ position:"relative" }}>
          <h1 style={{ fontFamily:nf, fontSize:"28pt", fontWeight:800, color:"#fff", margin:0, lineHeight:1.1 }}>{cl.senderName||"Your Name"}</h1>
          {cl.senderTitle&&<div style={{ fontFamily:bf, fontSize:"9.5pt", color:"rgba(255,255,255,0.75)", marginTop:"0.06in", fontStyle:"italic" }}>{cl.senderTitle}</div>}
          {contactStr&&<div style={{ color:"rgba(255,255,255,0.6)", fontSize:"8.5pt", marginTop:"0.09in", fontFamily:bf }}>{contactStr}</div>}
        </div>
      </div>
      <Body pad="0.42in 0.75in 0.7in" nameColor={ac}/>
    </div>
  );

  /* ── coach ── */
  if(layout==="coach") return (
    <div style={{ width:"8.5in", background:"#FAFFFE", fontFamily:bf, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.18)" }}>
      <div style={{ background:ac, padding:"0.42in 0.7in 0.35in", boxSizing:"border-box", position:"relative" }}>
        <div style={{ position:"absolute", bottom:0, left:0, width:"100%", height:"3px", background:`linear-gradient(to right, ${teal} 0%, ${h2r(teal,0.2)} 100%)` }}/>
        <h1 style={{ fontFamily:nf, fontSize:"26pt", fontWeight:800, color:"#fff", margin:0, lineHeight:1.1, letterSpacing:"0.04em" }}>{cl.senderName||"Your Name"}</h1>
        {cl.senderTitle&&<div style={{ fontFamily:bf, fontSize:"9.5pt", color:h2r(teal,0.9), marginTop:"0.06in", fontWeight:600 }}>{cl.senderTitle}</div>}
        {contactStr&&<div style={{ color:"rgba(255,255,255,0.55)", fontSize:"8.5pt", marginTop:"0.09in", fontFamily:bf }}>{contactStr}</div>}
      </div>
      <Body pad="0.42in 0.7in 0.7in"/>
    </div>
  );

  /* ── circuit (fallback) ── */
  return (
    <div style={{ width:"8.5in", background:"#fff", fontFamily:bf, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.1)", padding:"0.6in 0.85in 0.7in" }}>
      <div style={{ borderBottom:`2.5px solid ${ac}`, paddingBottom:"0.16in", marginBottom:"0.3in" }}>
        <h1 style={{ fontFamily:nf, fontSize:"24pt", fontWeight:800, color:ac, margin:0, lineHeight:1.1 }}>{cl.senderName||"Your Name"}</h1>
        {cl.senderTitle&&<div style={{ fontFamily:bf, fontSize:"10pt", color:"#666", marginTop:"0.04in", fontStyle:"italic" }}>{cl.senderTitle}</div>}
        {contactStr&&<div style={{ fontFamily:bf, fontSize:"8.5pt", color:"#888", marginTop:"0.07in" }}>{contactStr}</div>}
      </div>
      <Body pad="0"/>
    </div>
  );
}

/* ============================================================
   COVER LETTER EXPORTS
   ============================================================ */
function exportCLPDF(el, name) {
  if(!el)return;
  const printCSS=`@page{size:letter;margin:0}html,body{margin:0;padding:0;background:white;-webkit-print-color-adjust:exact;print-color-adjust:exact}*{box-sizing:border-box}p{orphans:3;widows:3;page-break-inside:avoid;break-inside:avoid}div{-webkit-print-color-adjust:exact;print-color-adjust:exact}`;
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${(name||"Cover Letter").replace(/[<>&"']/g,"")}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Raleway:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700;800&display=swap"><style>${printCSS}</style></head><body>${el.innerHTML}<script>(function(){if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){setTimeout(function(){window.focus();window.print();},300);})}else{setTimeout(function(){window.focus();window.print();},900);}})()</script></body></html>`;
  const w=window.open("","_blank","width=900,height=1100");
  if(!w){alert("Please allow pop-ups to print.");return;}
  w.document.open();w.document.write(html);w.document.close();
}

function exportCLWord(cl, accent) {
  const ac=hexToRtf(accent);
  const fn=((cl.senderName||"cover-letter").replace(/[^a-z0-9]+/gi,"_").toLowerCase())+"_cover_letter.rtf";
  const out=[];
  out.push(`{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat{\\fonttbl{\\f0\\fswiss\\fcharset0 Arial;}}{\\colortbl;\\red17\\green17\\blue17;\\red80\\green80\\blue80;\\red${ac.r}\\green${ac.g}\\blue${ac.b};}\\paperw12240\\paperh15840\\margl1152\\margr1152\\margt1152\\margb1152\\f0\\fs22\\cf1`);
  if(cl.senderName) out.push(`{\\pard\\ql\\sb0\\sa60\\fs40\\b\\cf3 ${rtfEsc(cl.senderName)}\\b0\\par}`);
  if(cl.senderTitle) out.push(`{\\pard\\ql\\sb0\\sa40\\fs22\\i\\cf2 ${rtfEsc(cl.senderTitle)}\\i0\\par}`);
  const ci=[cl.senderEmail,cl.senderPhone,cl.senderLocation,cl.senderInstagram].filter(Boolean);
  if(ci.length) out.push(`{\\pard\\ql\\sb0\\sa240\\fs19\\cf2 ${rtfEsc(ci.join("  ·  "))}\\par}`);
  out.push(`{\\pard\\ql\\sb0\\sa240\\brdrb\\brdrs\\brdrw15\\brdrcf3\\par}`);
  if(cl.date) out.push(`{\\pard\\ql\\sb0\\sa120\\fs20\\cf2 ${rtfEsc(cl.date)}\\par}`);
  if(cl.recipientName||cl.recipientTitle||cl.company){
    out.push(`{\\pard\\ql\\sb120\\sa0\\fs21\\cf1`);
    if(cl.recipientName) out.push(`{\\b ${rtfEsc(cl.recipientName)}\\b0}\\line `);
    if(cl.recipientTitle) out.push(`${rtfEsc(cl.recipientTitle)}\\line `);
    if(cl.company) out.push(`${rtfEsc(cl.company)}\\line `);
    if(cl.companyAddress) out.push(`{\\cf2 ${rtfEsc(cl.companyAddress)}}`);
    out.push(`\\par}`);
  }
  out.push(`{\\pard\\ql\\sb240\\sa120\\fs22\\cf1 ${rtfEsc(`Dear ${cl.recipientName||"Hiring Manager"},`)}\\par}`);
  [cl.opening,cl.body1,cl.body2,cl.body3].filter(Boolean).forEach(p=>{
    out.push(`{\\pard\\ql\\sb0\\sa180\\fs22\\cf1\\keep ${rtfEsc(p)}\\par}`);
  });
  if(cl.closing) out.push(`{\\pard\\ql\\sb60\\sa120\\fs22\\cf1 ${rtfEsc(cl.closing)}\\par}`);
  out.push(`{\\pard\\ql\\sb200\\sa60\\fs22\\cf1 Sincerely,\\par}`);
  out.push(`{\\pard\\ql\\sb240\\sa0\\fs28\\b\\cf3 ${rtfEsc(cl.senderName||"")}\\b0\\par}`);
  if(cl.senderTitle) out.push(`{\\pard\\ql\\sb40\\sa0\\fs20\\i\\cf2 ${rtfEsc(cl.senderTitle)}\\i0\\par}`);
  out.push("}");
  dlBlob(new Blob([out.join("\n")],{type:"application/rtf"}),fn);
}

/* ============================================================
   COVER LETTER FORM
   ============================================================ */
function CoverLetterForm({ cl, setCl, onAutoFill }) {
  const set=(k,v)=>setCl(p=>({...p,[k]:v}));
  return (
    <div className="space-y-0">
      <Accordion title="Your Details">
        <button onClick={onAutoFill} className="w-full flex items-center justify-center gap-2 py-2 mb-1 text-xs font-bold transition-all rounded-xl" style={{ background:"#EFF9FF", border:"1px solid #99E6E2", color:"#007A73" }}>
          <Zap className="w-3.5 h-3.5"/>Auto-fill from resume
        </button>
        <div><label className={lc}>Full name</label><input className={fc} value={cl.senderName} onChange={e=>set("senderName",e.target.value)} placeholder="Jade Mitchell"/></div>
        <div><label className={lc}>Your title / position</label><input className={fc} value={cl.senderTitle} onChange={e=>set("senderTitle",e.target.value)} placeholder="Head Coach & Lead Personal Trainer"/></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className={lc}>Email</label><input className={fc} value={cl.senderEmail} onChange={e=>set("senderEmail",e.target.value)} placeholder="jade@email.com"/></div>
          <div><label className={lc}>Phone</label><input className={fc} value={cl.senderPhone} onChange={e=>set("senderPhone",e.target.value)} placeholder="+61 400 000 000"/></div>
          <div><label className={lc}>Location</label><input className={fc} value={cl.senderLocation} onChange={e=>set("senderLocation",e.target.value)} placeholder="Sydney, NSW"/></div>
          <div><label className={lc}>Instagram</label><input className={fc} value={cl.senderInstagram} onChange={e=>set("senderInstagram",e.target.value)} placeholder="@jade.fit"/></div>
        </div>
      </Accordion>
      <Accordion title="Recipient & Venue">
        <div><label className={lc}>Date</label><input className={fc} value={cl.date} onChange={e=>set("date",e.target.value)} placeholder="June 20, 2026"/></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className={lc}>Recipient name</label><input className={fc} value={cl.recipientName} onChange={e=>set("recipientName",e.target.value)} placeholder="Alex Nguyen"/></div>
          <div><label className={lc}>Their title</label><input className={fc} value={cl.recipientTitle} onChange={e=>set("recipientTitle",e.target.value)} placeholder="Studio Director"/></div>
        </div>
        <div><label className={lc}>Studio / Gym / Company</label><input className={fc} value={cl.company} onChange={e=>set("company",e.target.value)} placeholder="F45 Training Double Bay"/></div>
        <div><label className={lc}>Address <span className="normal-case font-normal text-slate-300">(optional)</span></label><input className={fc} value={cl.companyAddress} onChange={e=>set("companyAddress",e.target.value)} placeholder="500 New South Head Rd, Double Bay NSW 2028"/></div>
      </Accordion>
      <Accordion title="Letter Body">
        <p className="text-[11px] text-slate-400 -mt-1 leading-relaxed">Write each paragraph separately — the preview assembles them in order.</p>
        <div><label className={lc}>Opening paragraph</label><textarea className={fc} rows={4} value={cl.opening} onChange={e=>set("opening",e.target.value)} placeholder="Why this studio, why you — open with energy."/></div>
        <div><label className={lc}>Body paragraph 1</label><textarea className={fc} rows={4} value={cl.body1} onChange={e=>set("body1",e.target.value)} placeholder="Your strongest achievement or experience."/></div>
        <div><label className={lc}>Body paragraph 2 <span className="normal-case font-normal text-slate-300">(optional)</span></label><textarea className={fc} rows={4} value={cl.body2} onChange={e=>set("body2",e.target.value)} placeholder="Your certifications, philosophy or client results."/></div>
        <div><label className={lc}>Body paragraph 3 <span className="normal-case font-normal text-slate-300">(optional)</span></label><textarea className={fc} rows={3} value={cl.body3} onChange={e=>set("body3",e.target.value)} placeholder="Call to action / availability."/></div>
        <div><label className={lc}>Closing sentence</label><input className={fc} value={cl.closing} onChange={e=>set("closing",e.target.value)} placeholder="Thanks for your time — I look forward to connecting."/></div>
      </Accordion>
    </div>
  );
}

/* ============================================================
   FORM COMPONENTS
   ============================================================ */
const fc = "w-full px-2.5 py-1.5 text-sm border border-teal-200 rounded-lg bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all";
const lc = "block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1";

function Accordion({ title, badge, children, defaultOpen=true }) {
  const [open,setOpen]=useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button onClick={()=>setOpen(!open)} className="w-full flex items-center justify-between py-3 text-left group">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors">{title}</span>
          {badge!=null&&<span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-1.5 py-0.5 rounded-full border border-teal-200">{badge}</span>}
        </div>
        {open?<ChevronUp className="w-4 h-4 text-teal-300"/>:<ChevronDown className="w-4 h-4 text-teal-300"/>}
      </button>
      {open&&<div className="pb-4 space-y-3">{children}</div>}
    </div>
  );
}

function TagInput({ label, items, onChange, placeholder }) {
  const [val,setVal]=useState("");
  const add=()=>{const t=val.trim();if(t&&!items.includes(t)){onChange([...items,t]);setVal("");}};
  return (
    <div>
      <label className={lc}>{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((item,i)=>(
          <span key={i} className="inline-flex items-center gap-1 text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full font-bold">
            {item}<button onClick={()=>onChange(items.filter((_,j)=>j!==i))} className="text-teal-400 hover:text-red-500 transition-colors"><X className="w-3 h-3"/></button>
          </span>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input className={fc} value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"||e.key===","){e.preventDefault();add();}}} placeholder={placeholder||"Type and press Enter"}/>
        <button onClick={add} className="px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors">Add</button>
      </div>
    </div>
  );
}

function BulletInput({ label, items, onChange, placeholder }) {
  const upd=(i,v)=>onChange(items.map((x,j)=>j===i?v:x));
  const rm=(i)=>onChange(items.filter((_,j)=>j!==i));
  return (
    <div>
      {label&&<label className={lc}>{label}</label>}
      <div className="space-y-1.5">
        {items.map((item,i)=>(
          <div key={i} className="flex gap-1.5">
            <input className={fc} value={item} onChange={e=>upd(i,e.target.value)} placeholder={placeholder||"Add a point"}/>
            <button onClick={()=>rm(i)} className="px-2 text-teal-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X className="w-4 h-4"/></button>
          </div>
        ))}
        <button onClick={()=>onChange([...items,""])} className="text-xs text-teal-600 hover:text-teal-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-teal-50 transition-colors font-bold"><Plus className="w-3 h-3"/>Add point</button>
      </div>
    </div>
  );
}

/* ============================================================
   RESUME FORM
   ============================================================ */
function ResumeForm({ data, setData }) {
  const set=(path,val)=>setData(prev=>{
    const next=JSON.parse(JSON.stringify(prev));
    const parts=path.split("."); let cur=next;
    for(let i=0;i<parts.length-1;i++) cur=cur[parts[i]];
    cur[parts[parts.length-1]]=val;
    return next;
  });
  const updExp =(i,k,v)=>setData(p=>({...p,experience:p.experience.map((e,j)=>j===i?{...e,[k]:v}:e)}));
  const updAch =(i,k,v)=>setData(p=>({...p,achievements:p.achievements.map((e,j)=>j===i?{...e,[k]:v}:e)}));
  const updEdu =(i,k,v)=>setData(p=>({...p,education:p.education.map((e,j)=>j===i?{...e,[k]:v}:e)}));
  const updCert=(i,k,v)=>setData(p=>({...p,certifications:p.certifications.map((e,j)=>j===i?{...e,[k]:v}:e)}));

  return (
    <div className="space-y-0">
      <Accordion title="Personal Info">
        <div><label className={lc}>Full name</label><input className={fc} value={data.name} onChange={e=>set("name",e.target.value)} placeholder="Jade Mitchell"/></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className={lc}>Email</label><input className={fc} value={data.contact.email} onChange={e=>set("contact.email",e.target.value)} placeholder="jade@email.com"/></div>
          <div><label className={lc}>Phone</label><input className={fc} value={data.contact.phone} onChange={e=>set("contact.phone",e.target.value)} placeholder="+61 400 000 000"/></div>
          <div><label className={lc}>Location</label><input className={fc} value={data.contact.location} onChange={e=>set("contact.location",e.target.value)} placeholder="Sydney, NSW"/></div>
          <div><label className={lc}>Instagram</label><input className={fc} value={data.contact.instagram} onChange={e=>set("contact.instagram",e.target.value)} placeholder="@jade.fit"/></div>
          <div><label className={lc}>LinkedIn</label><input className={fc} value={data.contact.linkedin} onChange={e=>set("contact.linkedin",e.target.value)} placeholder="linkedin.com/in/you"/></div>
          <div><label className={lc}>Website</label><input className={fc} value={data.contact.website} onChange={e=>set("contact.website",e.target.value)} placeholder="yoursite.com.au"/></div>
        </div>
        <div><label className={lc}>Training philosophy</label><textarea className={fc} rows={3} value={data.philosophy} onChange={e=>set("philosophy",e.target.value)} placeholder="A short statement about your coaching approach and values..."/></div>
      </Accordion>

      <Accordion title="Specialties" badge={data.specialties.length}>
        <TagInput label="Specialties (press Enter to add)" items={data.specialties} onChange={v=>set("specialties",v)} placeholder="e.g. HIIT, Pilates, Strength Training..."/>
      </Accordion>

      <Accordion title="Experience" badge={data.experience.length}>
        {data.experience.map((exp,i)=>(
          <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
            <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-teal-500/60 uppercase tracking-widest">Role {i+1}</span><button onClick={()=>setData(p=>({...p,experience:p.experience.filter((_,j)=>j!==i)}))} className="text-slate-300 hover:text-red-500 transition-colors"><X className="w-4 h-4"/></button></div>
            <div><label className={lc}>Job title</label><input className={fc} value={exp.title} onChange={e=>updExp(i,"title",e.target.value)} placeholder="Head Coach & Personal Trainer"/></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className={lc}>Venue / Studio / Gym</label><input className={fc} value={exp.venue} onChange={e=>updExp(i,"venue",e.target.value)} placeholder="Peak Performance Studio"/></div>
              <div><label className={lc}>Location</label><input className={fc} value={exp.location} onChange={e=>updExp(i,"location",e.target.value)} placeholder="Sydney, NSW"/></div>
              <div><label className={lc}>Venue type</label><input className={fc} value={exp.type} onChange={e=>updExp(i,"type",e.target.value)} placeholder="Boutique Studio / Commercial Gym / F45"/></div>
              <div><label className={lc}>Client volume</label><input className={fc} value={exp.clients} onChange={e=>updExp(i,"clients",e.target.value)} placeholder="45 active 1:1 clients"/></div>
              <div><label className={lc}>Start</label><input className={fc} value={exp.start} onChange={e=>updExp(i,"start",e.target.value)} placeholder="Jan 2021"/></div>
              <div><label className={lc}>End</label><input className={fc} value={exp.end} onChange={e=>updExp(i,"end",e.target.value)} placeholder="Present"/></div>
            </div>
            <BulletInput items={exp.bullets||[]} onChange={v=>updExp(i,"bullets",v)} placeholder="Key achievement or responsibility"/>
          </div>
        ))}
        <button onClick={()=>setData(p=>({...p,experience:[...p.experience,{title:"",venue:"",location:"",type:"",clients:"",start:"",end:"",bullets:[]}]}))} className="w-full py-2 border border-dashed border-teal-200 text-teal-600 hover:bg-teal-50 hover:border-teal-400 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all"><Plus className="w-4 h-4"/>Add role</button>
      </Accordion>

      <Accordion title="Client Results" badge={data.achievements.length} defaultOpen={false}>
        <p className="text-[11px] text-slate-400 -mt-1 leading-relaxed">Showcase real client transformations and outcomes — this is your most powerful selling point.</p>
        {data.achievements.map((a,i)=>(
          <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
            <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-teal-500/60 uppercase tracking-widest">Result {i+1}</span><button onClick={()=>setData(p=>({...p,achievements:p.achievements.filter((_,j)=>j!==i)}))} className="text-slate-300 hover:text-red-500 transition-colors"><X className="w-4 h-4"/></button></div>
            <div><label className={lc}>Stat / Headline</label><input className={fc} value={a.stat} onChange={e=>updAch(i,"stat",e.target.value)} placeholder="18kg lost"/></div>
            <div><label className={lc}>Client story</label><input className={fc} value={a.client} onChange={e=>updAch(i,"client",e.target.value)} placeholder="Emily, 34 — lost 18kg in 12 weeks"/></div>
          </div>
        ))}
        <button onClick={()=>setData(p=>({...p,achievements:[...p.achievements,{client:"",stat:""}]}))} className="w-full py-2 border border-dashed border-teal-200 text-teal-600 hover:bg-teal-50 hover:border-teal-400 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all"><Plus className="w-4 h-4"/>Add result</button>
      </Accordion>

      <Accordion title="Certifications" badge={data.certifications.length} defaultOpen={false}>
        {data.certifications.map((c,i)=>(
          <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
            <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-teal-500/60 uppercase tracking-widest">Cert {i+1}</span><button onClick={()=>setData(p=>({...p,certifications:p.certifications.filter((_,j)=>j!==i)}))} className="text-slate-300 hover:text-red-500 transition-colors"><X className="w-4 h-4"/></button></div>
            <div><label className={lc}>Certification name</label><input className={fc} value={c.name} onChange={e=>updCert(i,"name",e.target.value)} placeholder="NASM Certified Personal Trainer (CPT)"/></div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-3"><label className={lc}>Issuing body</label><input className={fc} value={c.issuer} onChange={e=>updCert(i,"issuer",e.target.value)} placeholder="National Academy of Sports Medicine"/></div>
              <div className="col-span-1"><label className={lc}>Year</label><input className={fc} value={c.date} onChange={e=>updCert(i,"date",e.target.value)} placeholder="2024"/></div>
              <div className="col-span-2"><label className={lc}>Expiry <span className="normal-case font-normal text-slate-300">(optional)</span></label><input className={fc} value={c.expiry} onChange={e=>updCert(i,"expiry",e.target.value)} placeholder="2026"/></div>
            </div>
          </div>
        ))}
        <button onClick={()=>setData(p=>({...p,certifications:[...p.certifications,{name:"",issuer:"",date:"",expiry:""}]}))} className="w-full py-2 border border-dashed border-teal-200 text-teal-600 hover:bg-teal-50 hover:border-teal-400 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all"><Plus className="w-4 h-4"/>Add certification</button>
      </Accordion>

      <Accordion title="Education & Training" badge={data.education.length} defaultOpen={false}>
        {data.education.map((ed,i)=>(
          <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
            <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-teal-500/60 uppercase tracking-widest">Entry {i+1}</span><button onClick={()=>setData(p=>({...p,education:p.education.filter((_,j)=>j!==i)}))} className="text-slate-300 hover:text-red-500 transition-colors"><X className="w-4 h-4"/></button></div>
            <div><label className={lc}>Qualification</label><input className={fc} value={ed.degree} onChange={e=>updEdu(i,"degree",e.target.value)} placeholder="Certificate IV in Fitness"/></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className={lc}>Institution</label><input className={fc} value={ed.school} onChange={e=>updEdu(i,"school",e.target.value)} placeholder="Australian Institute of Fitness"/></div>
              <div><label className={lc}>Year</label><input className={fc} value={ed.date} onChange={e=>updEdu(i,"date",e.target.value)} placeholder="2016"/></div>
            </div>
            <div><label className={lc}>Notes <span className="normal-case font-normal text-slate-300">(optional)</span></label><input className={fc} value={ed.notes} onChange={e=>updEdu(i,"notes",e.target.value)} placeholder="AUSactive Registered Exercise Professional..."/></div>
          </div>
        ))}
        <button onClick={()=>setData(p=>({...p,education:[...p.education,{degree:"",school:"",location:"",date:"",notes:""}]}))} className="w-full py-2 border border-dashed border-teal-200 text-teal-600 hover:bg-teal-50 hover:border-teal-400 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all"><Plus className="w-4 h-4"/>Add entry</button>
      </Accordion>

      <Accordion title="Skills" defaultOpen={false}>
        <TagInput label="Skills (press Enter to add)" items={data.skills} onChange={v=>set("skills",v)} placeholder="Strength Programming, Mindbody, HIIT Design..."/>
      </Accordion>

      <Accordion title="Awards & Recognition" defaultOpen={false}>
        <BulletInput items={data.awards} onChange={v=>set("awards",v)} placeholder="FitAwards Australia — Personal Trainer of the Year (2023)"/>
      </Accordion>
    </div>
  );
}

/* ============================================================
   TEMPLATE CARD
   ============================================================ */
function TemplateCard({ tpl, selected, onClick }) {
  return (
    <button onClick={onClick} className={`text-left p-3 rounded-xl border-2 transition-all ${selected?"border-teal-500 bg-slate-900 shadow-lg shadow-teal-900/20":"border-slate-100 bg-white hover:border-teal-200 hover:shadow-sm"}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex gap-1">
          {tpl.swatch.map((c,i)=><div key={i} className="w-4 h-4 rounded-sm shadow-sm" style={{ background:c, border:"1px solid rgba(255,255,255,0.2)" }}/>)}
        </div>
        <span className={`text-sm font-bold ${selected?"text-white":"text-slate-800"}`}>{tpl.label}</span>
        {selected&&<Check className="w-3.5 h-3.5 text-teal-400 ml-auto"/>}
      </div>
      <p className={`text-[11px] leading-snug ${selected?"text-teal-300/80":"text-slate-400"}`}>{tpl.blurb}</p>
    </button>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function PulseCV() {
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [data, setData] = useState(SAMPLE);
  const [cl, setCl] = useState(SAMPLE_CL);
  const [tplId, setTplId] = useState("power");
  const [accentOverride, setAccentOverride] = useState(null);
  const [leftTab, setLeftTab] = useState("resume");   // "resume" | "coverletter"
  const [scale, setScale] = useState(0.75);
  const [clScale, setClScale] = useState(0.75);
  const [exporting, setExporting] = useState(null);
  const wrapRef    = useRef(null);
  const clWrapRef  = useRef(null);
  const printRef   = useRef(null);
  const clPrintRef = useRef(null);

  const tpl = TEMPLATES.find(t=>t.id===tplId)||TEMPLATES[0];
  const effectiveAccent = accentOverride||tpl.accent;

  useEffect(()=>{
    const fit=()=>{
      if(wrapRef.current){ const w=wrapRef.current.clientWidth; setScale(Math.max(0.3,Math.min(1,(w-32)/(8.5*96)))); }
      if(clWrapRef.current){ const w=clWrapRef.current.clientWidth; setClScale(Math.max(0.3,Math.min(1,(w-32)/(8.5*96)))); }
    };
    fit(); window.addEventListener("resize",fit); return()=>window.removeEventListener("resize",fit);
  },[unlocked, leftTab]);

  const handleUnlock=()=>{ if(pw==="PulseCV2026"){setUnlocked(true);setPwErr(false);}else{setPwErr(true);setPw("");} };

  // Auto-fill: name, email, phone, location, instagram only
  const handleAutoFill=()=>setCl(p=>({...p,
    senderName:      data.name||p.senderName,
    senderEmail:     data.contact?.email||p.senderEmail,
    senderPhone:     data.contact?.phone||p.senderPhone,
    senderLocation:  data.contact?.location||p.senderLocation,
    senderInstagram: data.contact?.instagram||p.senderInstagram,
    senderTitle:     data.experience?.[0]?.title||p.senderTitle||"",
  }));

  const handlePDF   =()=>{ setExporting("pdf");    try{exportPDF(printRef.current,data.name);}catch(e){alert("Export failed.");}finally{setTimeout(()=>setExporting(null),500);} };
  const handleWord  =()=>{ setExporting("word");   try{exportWord(data,effectiveAccent);}catch(e){alert("Export failed.");}finally{setTimeout(()=>setExporting(null),400);} };
  const handleCLPDF =()=>{ setExporting("clpdf");  try{exportCLPDF(clPrintRef.current,cl.senderName);}catch(e){alert("Export failed.");}finally{setTimeout(()=>setExporting(null),500);} };
  const handleCLWord=()=>{ setExporting("clword"); try{exportCLWord(cl,effectiveAccent);}catch(e){alert("Export failed.");}finally{setTimeout(()=>setExporting(null),400);} };

  /* ── PASSWORD GATE ── */
  if(!unlocked) return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background:"#0A1628" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap'); *, *::before, *::after{box-sizing:border-box;margin:0;padding:0;} body{font-family:'Outfit',sans-serif;}`}</style>
      <div className="w-full max-w-sm mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{ background:"linear-gradient(135deg,#00C2B8,#007A73)", boxShadow:"0 8px 32px rgba(0,194,184,0.35)" }}>
            <span style={{ fontSize:"28px" }}>⚡</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ letterSpacing:"0.06em" }}>PulseCV</h1>
          <p className="text-sm" style={{ color:"rgba(255,255,255,0.4)" }}>Fitness &amp; Coach Resume + Cover Letter</p>
        </div>
        <div className="overflow-hidden rounded-2xl" style={{ border:"1px solid rgba(0,194,184,0.25)", background:"rgba(255,255,255,0.04)" }}>
          <div className="px-5 py-4" style={{ borderBottom:"1px solid rgba(0,194,184,0.15)" }}>
            <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setPwErr(false);}} onKeyDown={e=>e.key==="Enter"&&handleUnlock()} autoFocus placeholder="Enter password"
              className="w-full px-3 py-2 text-sm rounded-xl border focus:outline-none transition-all"
              style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${pwErr?"#e74c3c":"rgba(0,194,184,0.3)"}`, color:"#fff" }}/>
            {pwErr&&<p className="text-xs mt-2" style={{ color:"#e74c3c" }}>Incorrect password — please try again.</p>}
          </div>
          <div className="px-5 py-3 flex justify-end" style={{ background:"rgba(255,255,255,0.02)" }}>
            <button onClick={handleUnlock} className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ background:"linear-gradient(135deg,#00C2B8,#007A73)", boxShadow:"0 4px 12px rgba(0,194,184,0.3)" }}>Unlock →</button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── MAIN EDITOR ── */
  return (
    <div className="min-h-screen w-full" style={{ background:"#EEF4F7" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Raleway:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700;800&display=swap'); *, *::before, *::after{box-sizing:border-box;} body{font-family:'Outfit',sans-serif;} .vs::-webkit-scrollbar{width:6px;} .vs::-webkit-scrollbar-track{background:transparent;} .vs::-webkit-scrollbar-thumb{background:rgba(0,194,184,0.2);border-radius:3px;} .po{position:absolute;left:-99999px;top:0;width:8.5in;pointer-events:none;}`}</style>

      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-3" style={{ background:"#0A1628", borderBottom:"2px solid #00C2B8" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#00C2B8,#007A73)" }}>
            <span style={{ fontSize:"14px" }}>⚡</span>
          </div>
          <div>
            <div className="text-sm font-bold text-white" style={{ letterSpacing:"0.06em" }}>PulseCV</div>
            <div className="text-[10px] font-semibold tracking-widest" style={{ color:"rgba(0,194,184,0.85)" }}>FITNESS &amp; COACH</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>{setData(SAMPLE);setCl(SAMPLE_CL);setTplId("power");setAccentOverride(null);setLeftTab("resume");}}
            className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ color:"rgba(255,255,255,0.5)" }}>
            <RotateCcw className="w-3.5 h-3.5"/>Sample
          </button>
          <button onClick={()=>{setData(EMPTY);setCl(EMPTY_CL);}}
            className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.1)" }}>
            <X className="w-3 h-3"/>Clear
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] min-h-[calc(100vh-49px)]">

        {/* ── LEFT PANEL — tabbed ── */}
        <aside className="bg-white vs flex flex-col" style={{ borderRight:"1px solid #E2EBF0", height:"calc(100vh - 49px)" }}>
          {/* Left tab bar */}
          <div className="flex flex-shrink-0" style={{ borderBottom:"1px solid #E2EBF0" }}>
            <button onClick={()=>setLeftTab("resume")} className="flex-1 py-2.5 text-xs font-bold tracking-widest border-b-2 transition-all"
              style={{ borderBottomColor:leftTab==="resume"?"#00C2B8":"transparent", color:leftTab==="resume"?"#0A1628":"#94A3B8", background:"transparent" }}>
              RESUME
            </button>
            <button onClick={()=>setLeftTab("coverletter")} className="flex-1 py-2.5 text-xs font-bold tracking-widest border-b-2 transition-all flex items-center justify-center gap-1.5"
              style={{ borderBottomColor:leftTab==="coverletter"?"#00C2B8":"transparent", color:leftTab==="coverletter"?"#0A1628":"#94A3B8", background:"transparent" }}>
              <FileEdit className="w-3 h-3"/>COVER LETTER
            </button>
          </div>
          {/* Left panel content */}
          <div className="flex-1 overflow-y-auto vs">
            <div className="p-5">
              {leftTab==="resume"&&<>
                <h2 className="font-bold mb-1" style={{ fontSize:"16px", color:"#0A1628" }}>Build your resume</h2>
                <p className="text-xs mb-5 leading-relaxed" style={{ color:"#94A3B8" }}>Fill in your details — the preview updates live.</p>
                <ResumeForm data={data} setData={setData}/>
              </>}
              {leftTab==="coverletter"&&<>
                <h2 className="font-bold mb-1" style={{ fontSize:"16px", color:"#0A1628" }}>Cover Letter</h2>
                <p className="text-xs mb-4 leading-relaxed" style={{ color:"#94A3B8" }}>Matches your active template and accent colour automatically.</p>
                <CoverLetterForm cl={cl} setCl={setCl} onAutoFill={handleAutoFill}/>
              </>}
            </div>
          </div>
        </aside>

        {/* ── RIGHT PANEL — always shows preview matching left tab ── */}
        <main className="flex flex-col overflow-hidden" style={{ height:"calc(100vh - 49px)" }}>

          {/* Template + accent picker — shared for both tabs */}
          <div className="px-4 pt-4 pb-3 bg-white" style={{ borderBottom:"1px solid #E2EBF0" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-widest" style={{ color:"#94A3B8" }}>TEMPLATE</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold" style={{ color:"#94A3B8" }}>Accent</span>
                <label className="relative w-6 h-6 rounded-lg overflow-hidden border border-teal-200 cursor-pointer" style={{ background:effectiveAccent }}>
                  <input type="color" value={effectiveAccent} onChange={e=>setAccentOverride(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                </label>
                <div className="flex gap-1">
                  {ACCENT_PRESETS.map(c=>{
                    const active=effectiveAccent.toLowerCase()===c.toLowerCase();
                    return <button key={c} onClick={()=>setAccentOverride(c)} title={c} className="w-4 h-4 rounded-sm border transition-transform hover:scale-110" style={{ background:c, borderColor:active?"#0A1628":"rgba(148,163,184,0.3)", outline:active?"1px solid #0A1628":"none", outlineOffset:"1px" }}/>;
                  })}
                </div>
                {accentOverride&&<button onClick={()=>setAccentOverride(null)} className="text-[10px] font-semibold underline" style={{ color:"#00C2B8" }}>Reset</button>}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {TEMPLATES.map(t=><TemplateCard key={t.id} tpl={t} selected={tplId===t.id} onClick={()=>{setTplId(t.id);setAccentOverride(null);}}/>)}
            </div>
          </div>

          {/* ── RESUME PREVIEW ── */}
          {leftTab==="resume"&&<>
            <div ref={wrapRef} className="flex-1 overflow-auto vs p-4 md:p-8" style={{ background:"#1A2332" }}>
              <div style={{ width:`${8.5*scale}in`, margin:"0 auto", paddingBottom:"2rem" }}>
                <div style={{ transform:`scale(${scale})`, transformOrigin:"top left", width:"8.5in" }}>
                  <ResumePreview templateId={tplId} data={data} accent={effectiveAccent}/>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3" style={{ background:"#0A1628", borderTop:"2px solid #00C2B8" }}>
              <div>
                <div className="text-[10px] font-bold tracking-widest" style={{ color:"rgba(0,194,184,0.5)" }}>TEMPLATE</div>
                <div className="text-sm font-bold" style={{ color:"#00C2B8", letterSpacing:"0.04em" }}>{tpl.label}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleWord} disabled={exporting!==null} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40" style={{ border:"1px solid rgba(0,194,184,0.4)", color:"rgba(255,255,255,0.8)", background:"transparent", letterSpacing:"0.06em" }}>
                  {exporting==="word"?<Loader2 className="w-4 h-4 animate-spin"/>:<FileText className="w-4 h-4"/>}WORD
                </button>
                <button onClick={handlePDF} disabled={exporting!==null} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40" style={{ background:"linear-gradient(135deg,#00C2B8,#007A73)", color:"#fff", border:"none", letterSpacing:"0.06em", boxShadow:"0 4px 12px rgba(0,194,184,0.35)" }}>
                  {exporting==="pdf"?<Loader2 className="w-4 h-4 animate-spin"/>:<Download className="w-4 h-4"/>}PDF
                </button>
              </div>
            </div>
          </>}

          {/* ── COVER LETTER PREVIEW ── */}
          {leftTab==="coverletter"&&<>
            <div ref={clWrapRef} className="flex-1 overflow-auto vs p-4 md:p-8" style={{ background:"#1A2332" }}>
              <div style={{ width:`${8.5*clScale}in`, margin:"0 auto", paddingBottom:"2rem" }}>
                <div style={{ transform:`scale(${clScale})`, transformOrigin:"top left", width:"8.5in" }}>
                  <CoverLetterPreview templateId={tplId} cl={cl} accent={effectiveAccent}/>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3" style={{ background:"#0A1628", borderTop:"2px solid #00C2B8" }}>
              <div>
                <div className="text-[10px] font-bold tracking-widest" style={{ color:"rgba(0,194,184,0.5)" }}>MATCHING</div>
                <div className="text-sm font-bold" style={{ color:"#00C2B8", letterSpacing:"0.04em" }}>{tpl.label} · Cover Letter</div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCLWord} disabled={exporting!==null} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40" style={{ border:"1px solid rgba(0,194,184,0.4)", color:"rgba(255,255,255,0.8)", background:"transparent", letterSpacing:"0.06em" }}>
                  {exporting==="clword"?<Loader2 className="w-4 h-4 animate-spin"/>:<FileText className="w-4 h-4"/>}WORD
                </button>
                <button onClick={handleCLPDF} disabled={exporting!==null} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40" style={{ background:"linear-gradient(135deg,#00C2B8,#007A73)", color:"#fff", border:"none", letterSpacing:"0.06em", boxShadow:"0 4px 12px rgba(0,194,184,0.35)" }}>
                  {exporting==="clpdf"?<Loader2 className="w-4 h-4 animate-spin"/>:<Download className="w-4 h-4"/>}PDF
                </button>
              </div>
            </div>
          </>}

        </main>
      </div>

      {/* Off-screen print areas */}
      <div ref={printRef} className="po" aria-hidden="true">
        <ResumePreview templateId={tplId} data={data} accent={effectiveAccent}/>
      </div>
      <div ref={clPrintRef} className="po" aria-hidden="true">
        <CoverLetterPreview templateId={tplId} cl={cl} accent={effectiveAccent}/>
      </div>
    </div>
  );
}
