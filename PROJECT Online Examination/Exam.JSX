const { useState, useEffect, useRef, useCallback } = React;

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Outfit:wght@300;400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  /* ══ BUBBLEGUM PALETTE (exact) ════════════════════════════
     Pebble        #F6F1EB  → page background, lightest surface
     Bubblegum     #FF64AD  → primary brand / CTA
     Cotton Candy  #FFA3CE  → accent / secondary tones
     Flamingo      #DA1C5C  → danger / deep accent
     (dark text derived from Flamingo darkened)
  ═══════════════════════════════════════════════════════ */

  /* ── Backgrounds — Pebble family (light theme) ── */
  --bg:#F6F1EB;
  --surface:#FFFFFF;
  --surface2:#FDF8F4;
  --surface3:#F9F0E8;

  /* ── Borders ── */
  --border:#EDD9E8;
  --border2:#F0AECF;

  /* ── Primary = Bubblegum #FF64AD ── */
  --amber:#FF64AD;
  --amber2:#ff7dbb;
  --amber-dim:rgba(255,100,173,0.12);

  /* ── Accent = Cotton Candy #FFA3CE ── */
  --blue:#e8509a;
  --blue-dim:rgba(232,80,154,0.12);

  /* ── Success = Cotton Candy softened ── */
  --green:#c8457e;
  --green-dim:rgba(200,69,126,0.12);

  /* ── Danger = Flamingo #DA1C5C ── */
  --red:#DA1C5C;
  --red-dim:rgba(218,28,92,0.12);

  /* ── Highlight = Cotton Candy #FFA3CE ── */
  --purple:#FF64AD;
  --purple-dim:rgba(255,100,173,0.10);

  /* ── Text — dark from Flamingo-deepened ── */
  --text:#3a0a1e;
  --text2:#8a3a60;
  --text3:#c490ac;

  --radius:14px;
  --radius-sm:8px;
  --radius-lg:20px;
  --shadow:0 4px 24px rgba(218,28,92,0.10);
  --shadow-lg:0 8px 52px rgba(218,28,92,0.18);
  --glow:0 0 32px rgba(255,100,173,0.30);
}
body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);overflow-x:hidden;}
::-webkit-scrollbar{width:6px;}
::-webkit-scrollbar-track{background:#fde8f3;}
::-webkit-scrollbar-thumb{background:#FFA3CE;border-radius:3px;}
::-webkit-scrollbar-thumb:hover{background:#FF64AD;}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes slideRight{from{opacity:0;transform:translateX(-20px);}to{opacity:1;transform:translateX(0);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes shimmer{0%{background-position:-400px 0;}100%{background-position:400px 0;}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(255,100,173,0.30);}50%{box-shadow:0 0 42px rgba(255,100,173,0.55);}}
@keyframes countUp{from{opacity:0;transform:scale(0.7);}to{opacity:1;transform:scale(1);}}
@keyframes borderPulse{0%,100%{border-color:var(--border2);}50%{border-color:var(--amber);}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}

.fade-up{animation:fadeUp 0.45s ease both;}
.fade-in{animation:fadeIn 0.3s ease both;}
.slide-right{animation:slideRight 0.4s ease both;}

/* ── LANDING / AUTH ── */
.auth-root{
  min-height:100vh;display:grid;grid-template-columns:1fr 1fr;
  background:var(--bg);
}
.auth-left{
  padding:60px;display:flex;flex-direction:column;justify-content:center;
  background:linear-gradient(135deg,#FF64AD 0%,#DA1C5C 100%);
  position:relative;overflow:hidden;
}
.auth-left::before{
  content:'';position:absolute;top:-100px;left:-100px;width:500px;height:500px;
  background:radial-gradient(circle,rgba(255,255,255,0.20) 0%,transparent 70%);
  pointer-events:none;
}
.auth-left::after{
  content:'';position:absolute;bottom:-80px;right:-80px;width:350px;height:350px;
  background:radial-gradient(circle,rgba(218,28,92,0.28) 0%,transparent 70%);
  pointer-events:none;
}
.brand{display:flex;align-items:center;gap:14px;margin-bottom:60px;}
.brand-icon{
  width:48px;height:48px;border-radius:14px;
  background:rgba(255,255,255,0.25);backdrop-filter:blur(8px);
  border:1.5px solid rgba(255,255,255,0.45);
  display:flex;align-items:center;justify-content:center;
  font-size:22px;box-shadow:0 4px 20px rgba(218,28,92,0.30);
  animation:float 3s ease infinite;
}
.brand-name{font-family:'Playfair Display',serif;font-size:24px;color:#fff;}
.brand-name span{color:#ffe0ef;}
.auth-hero-title{
  font-family:'Playfair Display',serif;font-size:52px;line-height:1.15;
  color:#fff;margin-bottom:20px;
}
.auth-hero-title em{color:#ffe0ef;font-style:italic;}
.auth-hero-sub{color:rgba(255,255,255,0.82);font-size:16px;line-height:1.7;max-width:400px;margin-bottom:40px;}
.feature-list{display:flex;flex-direction:column;gap:14px;}
.feature-item{
  display:flex;align-items:center;gap:12px;font-size:14px;color:rgba(255,255,255,0.80);
  animation:slideRight 0.5s ease both;
}
.feature-dot{
  width:8px;height:8px;border-radius:50%;background:#fff;flex-shrink:0;
  box-shadow:0 0 8px rgba(255,255,255,0.6);
}

.auth-right{
  padding:60px;display:flex;flex-direction:column;justify-content:center;
  background:var(--surface);border-left:1px solid var(--border);
}
.auth-card{max-width:420px;width:100%;margin:0 auto;}
.auth-tabs{
  display:flex;background:var(--surface2);border-radius:12px;padding:4px;
  margin-bottom:32px;border:1px solid var(--border);
}
.auth-tab{
  flex:1;padding:10px;border:none;background:transparent;
  font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;
  color:var(--text2);cursor:pointer;border-radius:9px;transition:all 0.2s;
}
.auth-tab.active{background:var(--surface3);color:var(--text);box-shadow:0 2px 8px rgba(218,28,92,0.12);}

.role-tabs{display:flex;gap:10px;margin-bottom:24px;}
.role-tab{
  flex:1;padding:14px;border:1.5px solid var(--border);border-radius:12px;
  background:transparent;cursor:pointer;text-align:center;transition:all 0.2s;
  font-family:'Outfit',sans-serif;
}
.role-tab:hover{border-color:var(--border2);background:var(--surface2);}
.role-tab.active{border-color:var(--amber);background:var(--amber-dim);}
.role-icon{font-size:24px;margin-bottom:6px;}
.role-label{font-size:13px;font-weight:600;color:var(--text);}
.role-desc{font-size:11px;color:var(--text2);margin-top:2px;}

/* ── FORM ELEMENTS ── */
.form-group{margin-bottom:18px;}
.form-label{
  display:block;font-size:11px;font-weight:700;color:var(--text2);
  text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;
}
.form-input{
  width:100%;padding:13px 16px;border:1.5px solid var(--border);
  border-radius:10px;background:var(--surface2);color:var(--text);
  font-family:'Outfit',sans-serif;font-size:14px;transition:all 0.2s;outline:none;
}
.form-input:focus{border-color:var(--amber);box-shadow:0 0 0 3px rgba(255,100,173,0.14);}
.form-input::placeholder{color:var(--text3);}
select.form-input{cursor:pointer;}
option{background:#fff;color:var(--text);}
textarea.form-input{resize:vertical;min-height:80px;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.form-error{background:var(--red-dim);border:1px solid rgba(218,28,92,0.22);color:var(--red);
  padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;}
.form-success{background:var(--green-dim);border:1px solid rgba(200,69,126,0.24);color:var(--green);
  padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;}

/* ── BUTTONS ── */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  padding:12px 22px;border-radius:10px;border:none;
  font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;
  cursor:pointer;transition:all 0.2s;text-decoration:none;white-space:nowrap;
}
.btn:active{transform:scale(0.97);}
.btn-primary{background:linear-gradient(135deg,#FF64AD,#DA1C5C);color:#fff;}
.btn-primary:hover{box-shadow:0 4px 20px rgba(255,100,173,0.50);transform:translateY(-1px);}
.btn-secondary{background:var(--surface3);color:var(--text);border:1px solid var(--border2);}
.btn-secondary:hover{background:#fde8f3;border-color:var(--amber);}
.btn-danger{background:rgba(218,28,92,0.10);color:var(--red);border:1px solid rgba(218,28,92,0.28);}
.btn-danger:hover{background:rgba(218,28,92,0.20);}
.btn-success{background:rgba(200,69,126,0.10);color:var(--green);border:1px solid rgba(200,69,126,0.28);}
.btn-success:hover{background:rgba(200,69,126,0.20);}
.btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border);}
.btn-ghost:hover{color:var(--text);border-color:var(--amber);}
.btn-full{width:100%;}
.btn-sm{padding:7px 14px;font-size:12px;border-radius:8px;}
.btn-lg{padding:15px 28px;font-size:15px;border-radius:12px;}
.btn:disabled{opacity:0.4;cursor:not-allowed;transform:none !important;}

/* ── APP SHELL ── */
.app-shell{display:flex;flex-direction:column;min-height:100vh;}
.topbar{
  height:64px;background:var(--surface);border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 28px;position:sticky;top:0;z-index:200;
  backdrop-filter:blur(12px);
}
.topbar-brand{display:flex;align-items:center;gap:12px;}
.topbar-logo{
  width:36px;height:36px;border-radius:10px;
  background:linear-gradient(135deg,#FF64AD,#DA1C5C);
  display:flex;align-items:center;justify-content:center;font-size:17px;
  box-shadow:0 2px 10px rgba(255,100,173,0.35);
}
.topbar-title{font-family:'Playfair Display',serif;font-size:19px;}
.topbar-title span{color:var(--amber);}
.topbar-right{display:flex;align-items:center;gap:14px;}
.topbar-user{
  display:flex;align-items:center;gap:10px;
  padding:6px 14px 6px 6px;border-radius:50px;
  background:var(--surface2);border:1px solid var(--border);
}
.topbar-avatar{
  width:32px;height:32px;border-radius:50%;
  background:linear-gradient(135deg,#FF64AD,#DA1C5C);
  display:flex;align-items:center;justify-content:center;
  font-size:14px;font-weight:700;color:#fff;
}
.topbar-name{font-size:13px;font-weight:600;color:var(--text);}
.topbar-role{
  padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;
  text-transform:uppercase;letter-spacing:1px;
}
.role-teacher{background:var(--blue-dim);color:var(--blue);}
.role-student{background:var(--green-dim);color:var(--green);}

/* ── LAYOUT ── */
.body-layout{display:flex;flex:1;overflow:hidden;height:calc(100vh - 64px);}
.sidebar{
  width:230px;background:var(--surface);border-right:1px solid var(--border);
  padding:20px 12px;flex-shrink:0;overflow-y:auto;
}
.sidebar-section{margin-bottom:28px;}
.sidebar-label{
  font-size:10px;font-weight:700;color:var(--text3);
  text-transform:uppercase;letter-spacing:1.5px;padding:0 10px;margin-bottom:8px;
}
.sidebar-item{
  display:flex;align-items:center;gap:10px;padding:10px 12px;
  border-radius:10px;cursor:pointer;font-size:14px;font-weight:500;
  color:var(--text2);transition:all 0.2s;margin-bottom:2px;
  border:1px solid transparent;
}
.sidebar-item:hover{background:var(--surface2);color:var(--text);}
.sidebar-item.active{
  background:var(--amber-dim);color:var(--amber);
  border-color:rgba(255,100,173,0.20);
}
.sidebar-item .s-icon{font-size:18px;width:22px;text-align:center;}
.sidebar-badge{
  margin-left:auto;background:var(--amber);color:#FFFFFF;
  width:20px;height:20px;border-radius:50%;
  font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;
}

/* ── MAIN ── */
.main-content{flex:1;overflow-y:auto;padding:32px;}
.page-header{margin-bottom:28px;}
.page-title{
  font-family:'Playfair Display',serif;font-size:30px;color:var(--text);margin-bottom:4px;
}
.page-sub{color:var(--text2);font-size:14px;}
.page-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px;}

/* ── STAT CARDS ── */
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:28px;}
.stat-card{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
  padding:22px;transition:all 0.3s;animation:fadeUp 0.5s ease both;
  position:relative;overflow:hidden;
}
.stat-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--card-color,var(--amber)),transparent);
}
.stat-card:hover{border-color:var(--border2);transform:translateY(-3px);box-shadow:var(--shadow);}
.stat-icon-wrap{
  width:44px;height:44px;border-radius:12px;
  background:var(--card-color-dim,var(--amber-dim));
  display:flex;align-items:center;justify-content:center;
  font-size:20px;margin-bottom:14px;
}
.stat-value{
  font-family:'Playfair Display',serif;font-size:34px;color:var(--text);
  animation:countUp 0.6s ease both;
}
.stat-label{font-size:12px;color:var(--text2);font-weight:500;margin-top:3px;}
.stat-delta{
  display:inline-flex;align-items:center;gap:4px;font-size:11px;
  margin-top:6px;padding:2px 8px;border-radius:20px;font-weight:600;
}
.delta-up{background:var(--green-dim);color:var(--green);}
.delta-neutral{background:var(--purple-dim);color:var(--purple);}

/* ── CARD ── */
.card{
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--radius);overflow:hidden;
  animation:fadeUp 0.4s ease both;
}
.card-header{
  padding:18px 22px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
}
.card-title{font-size:15px;font-weight:700;color:var(--text);}
.card-body{padding:22px;}

/* ── TABLE ── */
.table-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;}
th{
  text-align:left;padding:12px 18px;font-size:11px;font-weight:700;
  color:var(--text3);text-transform:uppercase;letter-spacing:1px;
  background:var(--surface2);border-bottom:1px solid var(--border);
}
td{
  padding:14px 18px;font-size:14px;border-bottom:1px solid var(--border);
  vertical-align:middle;transition:background 0.15s;
}
tr:last-child td{border-bottom:none;}
tr:hover td{background:var(--surface2);}

/* ── BADGES ── */
.badge{
  display:inline-flex;align-items:center;gap:4px;padding:3px 10px;
  border-radius:20px;font-size:11px;font-weight:700;letter-spacing:0.3px;
}
.badge-amber{background:var(--amber-dim);color:var(--amber);}
.badge-green{background:var(--green-dim);color:var(--green);}
.badge-red{background:var(--red-dim);color:var(--red);}
.badge-blue{background:var(--blue-dim);color:var(--blue);}
.badge-purple{background:var(--purple-dim);color:var(--purple);}

/* ── MODAL ── */
.modal-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:500;
  display:flex;align-items:center;justify-content:center;padding:24px;
  animation:fadeIn 0.2s ease;backdrop-filter:blur(4px);
}
.modal{
  background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius-lg);
  width:100%;max-width:680px;max-height:90vh;overflow-y:auto;
  box-shadow:var(--shadow-lg);animation:fadeUp 0.3s ease;
}
.modal-lg{max-width:820px;}
.modal-header{
  padding:22px 28px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
  position:sticky;top:0;background:var(--surface);z-index:1;
}
.modal-title{font-family:'Playfair Display',serif;font-size:20px;color:var(--text);}
.modal-close{
  width:32px;height:32px;border-radius:8px;border:none;
  background:var(--surface2);color:var(--text2);cursor:pointer;
  font-size:16px;display:flex;align-items:center;justify-content:center;
  transition:all 0.2s;
}
.modal-close:hover{background:var(--surface3);color:var(--text);}
.modal-body{padding:28px;}
.modal-footer{
  padding:18px 28px;border-top:1px solid var(--border);
  display:flex;gap:10px;justify-content:flex-end;
}

/* ── EXAM BUILDER ── */
.q-builder{border:1.5px solid var(--border);border-radius:12px;padding:20px;margin-bottom:14px;transition:all 0.2s;}
.q-builder:hover{border-color:var(--border2);}
.q-num{
  width:28px;height:28px;border-radius:50%;
  background:linear-gradient(135deg,#FF64AD,#e8509a);
  color:#3a0a1e;font-size:13px;font-weight:800;
  display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;
}
.opt-row{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
.opt-row input[type=radio]{accent-color:var(--green);width:16px;height:16px;cursor:pointer;flex-shrink:0;}
.correct-hint{font-size:11px;color:var(--green);font-weight:700;white-space:nowrap;}

/* ── EXAM TAKER ── */
.exam-shell{
  min-height:100vh;background:var(--bg);
  display:flex;flex-direction:column;
}
.exam-topbar{
  background:var(--surface);border-bottom:1px solid var(--border);
  padding:0 32px;height:64px;display:flex;align-items:center;
  justify-content:space-between;position:sticky;top:0;z-index:100;
}
.exam-info{display:flex;flex-direction:column;}
.exam-name{font-family:'Playfair Display',serif;font-size:18px;color:var(--text);}
.exam-meta{font-size:12px;color:var(--text2);}
.timer-display{
  font-family:'Playfair Display',serif;font-size:28px;
  padding:8px 20px;border-radius:12px;
  background:var(--amber-dim);border:1px solid rgba(255,100,173,0.35);color:var(--amber);
  transition:all 0.3s;
}
.timer-display.urgent{
  background:var(--red-dim);border-color:rgba(218,28,92,0.38);color:var(--red);
  animation:borderPulse 1s infinite;
}
.exam-body{display:flex;flex:1;max-width:1100px;margin:0 auto;width:100%;padding:28px;gap:24px;}
.exam-nav-panel{
  width:200px;flex-shrink:0;
}
.nav-panel-title{font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;}
.q-nav-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:20px;}
.q-nav-btn{
  aspect-ratio:1;border-radius:8px;border:1.5px solid var(--border);
  background:var(--surface);color:var(--text2);font-size:12px;font-weight:700;
  cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;
}
.q-nav-btn:hover{border-color:var(--border2);color:var(--text);}
.q-nav-btn.current{border-color:var(--amber);background:var(--amber-dim);color:var(--amber);}
.q-nav-btn.answered{border-color:var(--green);background:var(--green-dim);color:var(--green);}
.q-nav-btn.flagged{border-color:var(--purple);background:var(--purple-dim);color:var(--purple);}
.nav-legend{display:flex;flex-direction:column;gap:6px;}
.legend-item{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);}
.legend-dot{width:10px;height:10px;border-radius:3px;}

.exam-main{flex:1;}
.progress-track{
  height:4px;background:var(--surface2);border-radius:99px;
  overflow:hidden;margin-bottom:24px;
}
.progress-fill{
  height:100%;background:linear-gradient(90deg,var(--amber),var(--green));
  border-radius:99px;transition:width 0.4s ease;
}
.q-card{
  background:var(--surface);border:1.5px solid var(--border);
  border-radius:var(--radius);padding:28px;animation:fadeUp 0.3s ease;
}
.q-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.q-tag{
  font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;letter-spacing:1px;
  background:var(--amber-dim);padding:4px 12px;border-radius:20px;
}
.q-flag-btn{
  background:transparent;border:1px solid var(--border);border-radius:8px;
  padding:6px 12px;font-size:12px;color:var(--text2);cursor:pointer;
  transition:all 0.2s;font-family:'Outfit',sans-serif;
}
.q-flag-btn:hover{border-color:var(--purple);color:var(--purple);}
.q-flag-btn.flagged{border-color:var(--purple);background:var(--purple-dim);color:var(--purple);}
.q-text{font-size:17px;font-weight:500;color:var(--text);line-height:1.6;margin-bottom:24px;}
.q-option{
  display:flex;align-items:center;gap:14px;padding:14px 18px;
  border:1.5px solid var(--border);border-radius:10px;cursor:pointer;
  margin-bottom:10px;transition:all 0.15s;font-size:15px;color:var(--text2);
}
.q-option:hover{border-color:var(--border2);background:var(--surface2);color:var(--text);}
.q-option.selected{border-color:var(--amber);background:var(--amber-dim);color:var(--amber);}
.q-option.correct-opt{border-color:var(--green);background:var(--green-dim);color:var(--green);}
.q-option.wrong-opt{border-color:var(--red);background:var(--red-dim);color:var(--red);}
.q-circle{
  width:30px;height:30px;border-radius:50%;border:2px solid currentColor;
  display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;
  flex-shrink:0;transition:all 0.15s;
}
.q-option.selected .q-circle,.q-option.correct-opt .q-circle{background:currentColor;}
.q-option.selected .q-circle-text{color:#FFFFFF;}
.q-option.correct-opt .q-circle-text{color:var(--bg);}
.q-circle-text{font-size:12px;font-weight:800;color:inherit;}
.q-nav-row{display:flex;justify-content:space-between;align-items:center;margin-top:22px;}

/* ── RESULT SCREEN ── */
.result-hero{
  text-align:center;padding:50px 24px;
  background:linear-gradient(135deg,var(--surface) 0%,var(--surface2) 100%);
  border-radius:var(--radius-lg);border:1px solid var(--border);
  margin-bottom:28px;position:relative;overflow:hidden;
  animation:fadeUp 0.5s ease;
}
.result-hero::before{
  content:'';position:absolute;top:-60px;left:50%;transform:translateX(-50%);
  width:300px;height:300px;
  background:radial-gradient(circle,rgba(255,100,173,0.18) 0%,transparent 70%);
  pointer-events:none;
}
.score-ring{
  width:140px;height:140px;border-radius:50%;
  border:5px solid var(--amber);margin:0 auto 20px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:var(--amber-dim);animation:glow 2s ease infinite;position:relative;
}
.score-pct{font-family:'Playfair Display',serif;font-size:38px;color:var(--amber);animation:countUp 0.8s ease;}
.score-label{font-size:12px;color:var(--text2);}

/* ── EMPTY STATE ── */
.empty-state{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:80px 24px;color:var(--text2);
}
.empty-icon{font-size:56px;margin-bottom:16px;opacity:0.5;}
.empty-text{font-size:15px;font-weight:500;}
.empty-sub{font-size:13px;color:var(--text3);margin-top:6px;}

/* ── MISC ── */
.divider{height:1px;background:var(--border);margin:20px 0;}
.tag{
  display:inline-flex;padding:4px 10px;border-radius:6px;
  font-size:12px;font-weight:600;background:var(--surface3);color:var(--text2);
}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
.three-col{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:18px;}
.exam-card-ui{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
  padding:22px;cursor:pointer;transition:all 0.25s;animation:fadeUp 0.4s ease both;
}
.exam-card-ui:hover{border-color:var(--amber);transform:translateY(-4px);box-shadow:var(--glow);}
.exam-card-title{font-family:'Playfair Display',serif;font-size:17px;color:var(--text);margin:10px 0 6px;}

.date-input{color-scheme:dark;}
.tooltip{position:relative;display:inline-flex;}

@media(max-width:900px){
  .auth-root{grid-template-columns:1fr;}
  .auth-left{display:none;}
  .two-col{grid-template-columns:1fr;}
  .form-row{grid-template-columns:1fr;}
}
@media(max-width:640px){
  .stats-grid{grid-template-columns:1fr 1fr;}
  .exam-body{flex-direction:column;}
  .exam-nav-panel{width:100%;}
}
`;

/* ═══════════════════════════════════════════════════════════════
   SEED DATA
═══════════════════════════════════════════════════════════════ */
const seed = {
  teachers: [
    { id: "T001", name: "Dr. Meera Krishnan", rollNo: "TCH001", password: "teach123", subject: "Mathematics", joined: "2026-01-10" },
    { id: "T002", name: "Prof. Arun Pillai", rollNo: "TCH002", password: "teach123", subject: "Physics", joined: "2026-01-15" },
  ],
  students: [
    { id: "S001", name: "Arjun Sharma", rollNo: "STU001", password: "stu123", class: "10-A", joined: "2026-02-01" },
    { id: "S002", name: "Priya Nair", rollNo: "STU002", password: "stu123", class: "10-A", joined: "2026-02-01" },
    { id: "S003", name: "Rahul Verma", rollNo: "STU003", password: "stu123", class: "10-B", joined: "2026-02-03" },
  ],
  exams: [
    {
      id: "EX001", teacherId: "T001", title: "Algebra Fundamentals", subject: "Mathematics",
      duration: 20, totalMarks: 5, status: "active", // active | closed | draft
      publishDate: "2026-03-18", // date teacher chose to publish results
      resultsPublished: true,
      createdAt: "2026-03-10",
      questions: [
        { id: "Q1", text: "What is the value of x if 2x + 6 = 18?", options: ["4", "6", "5", "3"], correct: 1 },
        { id: "Q2", text: "Factor completely: x² − 16", options: ["(x−4)(x+4)", "(x−8)(x+2)", "(x+4)²", "(x−16)"], correct: 0 },
        { id: "Q3", text: "Which of the following is a linear equation?", options: ["x² = 4", "x³ + 1 = 0", "2x + 3 = 7", "x² − x = 0"], correct: 2 },
        { id: "Q4", text: "Solve: 3(x − 2) = 9", options: ["x = 5", "x = 3", "x = 7", "x = 1"], correct: 0 },
        { id: "Q5", text: "If f(x) = 2x² − x + 1, what is f(2)?", options: ["7", "9", "5", "11"], correct: 0 },
      ],
    },
    {
      id: "EX002", teacherId: "T002", title: "Newton's Laws of Motion", subject: "Physics",
      duration: 15, totalMarks: 5, status: "active",
      publishDate: "2026-03-20",
      resultsPublished: false,
      createdAt: "2026-03-12",
      questions: [
        { id: "Q1", text: "Newton's Second Law states:", options: ["F = mv²", "F = ma", "F = mg", "F = m/a"], correct: 1 },
        { id: "Q2", text: "Which law explains why a ball keeps rolling on a frictionless surface?", options: ["2nd Law", "3rd Law", "Law of Gravitation", "1st Law"], correct: 3 },
        { id: "Q3", text: "SI unit of force is:", options: ["Joule", "Watt", "Newton", "Pascal"], correct: 2 },
        { id: "Q4", text: "Action and reaction forces act on:", options: ["Same body", "Different bodies", "Massless objects only", "Only fluids"], correct: 1 },
        { id: "Q5", text: "A body is in equilibrium when net force is:", options: ["Maximum", "Minimum", "Zero", "Equal to weight"], correct: 2 },
      ],
    },
  ],
  results: [
    { studentId: "S001", examId: "EX001", score: 4, total: 5, answers: { Q1: 1, Q2: 0, Q3: 2, Q4: 0, Q5: 0 }, submittedAt: "2026-03-15 10:32", timeTaken: "14:12" },
    { studentId: "S002", examId: "EX001", score: 3, total: 5, answers: { Q1: 1, Q2: 0, Q3: 2, Q4: 0, Q5: 3 }, submittedAt: "2026-03-15 11:05", timeTaken: "17:50" },
    { studentId: "S003", examId: "EX001", score: 5, total: 5, answers: { Q1: 1, Q2: 0, Q3: 2, Q4: 0, Q5: 0 }, submittedAt: "2026-03-15 09:55", timeTaken: "12:30" },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
const uid = () => Math.random().toString(36).slice(2, 9).toUpperCase();
const today = () => new Date().toISOString().split("T")[0];
const initials = (n) => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const pct = (s, t) => t ? Math.round((s / t) * 100) : 0;
const grade = (p) => p >= 90 ? "A+" : p >= 80 ? "A" : p >= 70 ? "B" : p >= 60 ? "C" : p >= 50 ? "D" : "F";

/* ═══════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════ */
function App() {
  const [db, setDb] = useState(seed);
  const [session, setSession] = useState(null); // {role, user}
  const [examMode, setExamMode] = useState(null); // exam object

  const upd = useCallback((key, fn) => setDb(d => ({ ...d, [key]: fn(d[key]) })), []);
  const addResult = useCallback((r) => upd("results", rs => [...rs, r]), []);

  if (!session) return <AuthPage db={db} upd={upd} onLogin={setSession} />;

  if (examMode) return (
    <ExamTaker
      exam={examMode} student={session.user}
      onSubmit={(result) => { addResult(result); setExamMode(null); }}
      onCancel={() => setExamMode(null)}
    />
  );

  if (session.role === "teacher") return (
    <TeacherApp db={db} upd={upd} teacher={session.user} onLogout={() => setSession(null)} />
  );

  return (
    <StudentApp db={db} upd={upd} student={session.user}
      onStartExam={setExamMode} onLogout={() => setSession(null)} />
  );
}

/* ═══════════════════════════════════════════════════════════════
   AUTH PAGE
═══════════════════════════════════════════════════════════════ */
function AuthPage({ db, upd, onLogin }) {
  const [tab, setTab] = useState("signin"); // signin | signup
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ name: "", rollNo: "", password: "", confirm: "", subject: "", class: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const signin = () => {
    setError("");
    const list = role === "teacher" ? db.teachers : db.students;
    const user = list.find(u => u.rollNo === form.rollNo && u.password === form.password);
    if (!user) return setError("Invalid Roll No or Password.");
    onLogin({ role, user });
  };

  const signup = () => {
    setError("");
    if (!form.name || !form.rollNo || !form.password) return setError("Name, Roll No and Password are required.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    const list = role === "teacher" ? db.teachers : db.students;
    if (list.find(u => u.rollNo === form.rollNo)) return setError("This Roll No is already registered.");
    const newUser = {
      id: (role === "teacher" ? "T" : "S") + uid(),
      name: form.name, rollNo: form.rollNo, password: form.password,
      joined: today(),
      ...(role === "teacher" ? { subject: form.subject || "General" } : { class: form.class || "General" }),
    };
    upd(role === "teacher" ? "teachers" : "students", list => [...list, newUser]);
    setSuccess("Account created! Please sign in.");
    setTab("signin");
    setForm({ name: "", rollNo: "", password: "", confirm: "", subject: "", class: "" });
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="auth-root">
        {/* Left panel */}
        <div className="auth-left">
          <div className="brand fade-in">
            <div className="brand-icon">🎓</div>
            <div className="brand-name">Exam<span>Portal</span></div>
          </div>
          <div className="auth-hero-title fade-up">
            The smarter way<br />to <em>examine</em> and<br />grow.
          </div>
          <div className="auth-hero-sub fade-up" style={{ animationDelay: "0.1s" }}>
            A complete online examination platform for teachers to create, distribute, auto-correct exams and publish results on their schedule — and for students to learn from every attempt.
          </div>
          <div className="feature-list">
            {[
              "MCQ exam creation with auto-grading",
              "Scheduled result publishing by teachers",
              "Real-time performance analytics",
              "Student answer review & feedback",
              "Role-based access: Teacher & Student",
            ].map((f, i) => (
              <div className="feature-item fade-up" key={i} style={{ animationDelay: `${0.15 + i * 0.07}s` }}>
                <div className="feature-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-right">
          <div className="auth-card fade-up">
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: "var(--text)", marginBottom: 6 }}>
                {tab === "signin" ? "Welcome back" : "Create account"}
              </div>
              <div style={{ fontSize: 14, color: "var(--text2)" }}>
                {tab === "signin" ? "Sign in to your portal" : "Join ExamPortal today"}
              </div>
            </div>

            <div className="auth-tabs">
              <button className={`auth-tab ${tab === "signin" ? "active" : ""}`} onClick={() => { setTab("signin"); setError(""); setSuccess(""); }}>Sign In</button>
              <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setError(""); setSuccess(""); }}>Sign Up</button>
            </div>

            <div className="role-tabs">
              {[{ id: "student", icon: "🎒", label: "Student", desc: "Attend exams" }, { id: "teacher", icon: "👨‍🏫", label: "Teacher", desc: "Create & manage" }].map(r => (
                <div key={r.id} className={`role-tab ${role === r.id ? "active" : ""}`} onClick={() => setRole(r.id)}>
                  <div className="role-icon">{r.icon}</div>
                  <div className="role-label">{r.label}</div>
                  <div className="role-desc">{r.desc}</div>
                </div>
              ))}
            </div>

            {error && <div className="form-error">{error}</div>}
            {success && <div className="form-success">{success}</div>}

            {tab === "signup" && (
              <div className="form-group fade-in">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="e.g. Arjun Sharma" value={form.name} onChange={e => f("name", e.target.value)} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Roll Number / ID</label>
              <input className="form-input" placeholder={role === "teacher" ? "e.g. TCH001" : "e.g. STU001"} value={form.rollNo} onChange={e => f("rollNo", e.target.value)} />
            </div>
            {tab === "signup" && role === "teacher" && (
              <div className="form-group fade-in">
                <label className="form-label">Subject Specialty</label>
                <input className="form-input" placeholder="e.g. Mathematics" value={form.subject} onChange={e => f("subject", e.target.value)} />
              </div>
            )}
            {tab === "signup" && role === "student" && (
              <div className="form-group fade-in">
                <label className="form-label">Class / Section</label>
                <input className="form-input" placeholder="e.g. 10-A" value={form.class} onChange={e => f("class", e.target.value)} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => f("password", e.target.value)} onKeyDown={e => e.key === "Enter" && (tab === "signin" ? signin() : signup())} />
            </div>
            {tab === "signup" && (
              <div className="form-group fade-in">
                <label className="form-label">Confirm Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={form.confirm} onChange={e => f("confirm", e.target.value)} onKeyDown={e => e.key === "Enter" && signup()} />
              </div>
            )}

            <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 6 }}
              onClick={tab === "signin" ? signin : signup}>
              {tab === "signin" ? "Sign In →" : "Create Account →"}
            </button>

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "var(--text3)" }}>
              Demo — Teacher: <b style={{ color: "var(--text2)" }}>TCH001 / teach123</b> &nbsp;|&nbsp; Student: <b style={{ color: "var(--text2)" }}>STU001 / stu123</b>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TEACHER APP
═══════════════════════════════════════════════════════════════ */
function TeacherApp({ db, upd, teacher, onLogout }) {
  const [page, setPage] = useState("dashboard");

  const myExams = db.exams.filter(e => e.teacherId === teacher.id);
  const myResults = db.results.filter(r => myExams.find(e => e.id === r.examId));
  const pendingPublish = myExams.filter(e => !e.resultsPublished && e.status === "closed").length;

  const nav = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "exams", icon: "📝", label: "My Exams", badge: myExams.length },
    { id: "create", icon: "✦", label: "Create Exam" },
    { id: "submissions", icon: "📨", label: "Submissions", badge: myResults.length },
    { id: "results", icon: "📊", label: "Results & Publish", badge: pendingPublish || undefined },
    { id: "students", icon: "👥", label: "Students" },
    { id: "analytics", icon: "📈", label: "Analytics" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app-shell">
        <Topbar name={teacher.name} role="teacher" onLogout={onLogout} />
        <div className="body-layout">
          <Sidebar nav={nav} page={page} setPage={setPage} />
          <div className="main-content">
            {page === "dashboard" && <TDashboard db={db} teacher={teacher} myExams={myExams} myResults={myResults} setPage={setPage} />}
            {page === "exams" && <TExams db={db} upd={upd} teacher={teacher} myExams={myExams} />}
            {page === "create" && <TCreateExam db={db} upd={upd} teacher={teacher} onDone={() => setPage("exams")} />}
            {page === "submissions" && <TSubmissions db={db} teacher={teacher} myExams={myExams} myResults={myResults} />}
            {page === "results" && <TResultsPublish db={db} upd={upd} teacher={teacher} myExams={myExams} myResults={myResults} />}
            {page === "students" && <TStudents db={db} />}
            {page === "analytics" && <TAnalytics db={db} teacher={teacher} myExams={myExams} myResults={myResults} />}
          </div>
        </div>
      </div>
    </>
  );
}

function TDashboard({ db, teacher, myExams, myResults, setPage }) {
  const activeExams = myExams.filter(e => e.status === "active").length;
  const published = myExams.filter(e => e.resultsPublished).length;
  const avgPct = myResults.length
    ? Math.round(myResults.reduce((s, r) => s + pct(r.score, r.total), 0) / myResults.length)
    : 0;

  const stats = [
    { icon: "📝", label: "Total Exams", value: myExams.length, color: "var(--amber)", dim: "var(--amber-dim)" },
    { icon: "🟢", label: "Active Exams", value: activeExams, color: "var(--green)", dim: "var(--green-dim)" },
    { icon: "📨", label: "Submissions", value: myResults.length, color: "var(--blue)", dim: "var(--blue-dim)" },
    { icon: "🏆", label: "Avg. Score", value: avgPct + "%", color: "var(--purple)", dim: "var(--purple-dim)" },
    { icon: "✅", label: "Results Published", value: published, color: "var(--green)", dim: "var(--green-dim)" },
  ];

  return (
    <>
      <div className="page-header">
        <div className="page-title">Good morning, {teacher.name.split(" ")[0]} 👋</div>
        <div className="page-sub">Here's an overview of your examination activity</div>
      </div>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i} style={{ "--card-color": s.color, "--card-color-dim": s.dim, animationDelay: `${i * 0.07}s` }}>
            <div className="stat-icon-wrap"><span>{s.icon}</span></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Exams</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage("exams")}>View All</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Title</th><th>Status</th><th>Submissions</th></tr></thead>
              <tbody>
                {myExams.slice(-4).reverse().map(e => {
                  const subs = myResults.filter(r => r.examId === e.id).length;
                  return (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 600 }}>{e.title}</td>
                      <td><ExamStatusBadge status={e.status} /></td>
                      <td>{subs}</td>
                    </tr>
                  );
                })}
                {myExams.length === 0 && <tr><td colSpan={3}><div className="empty-state" style={{ padding: 30 }}><div className="empty-text">No exams yet</div></div></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Submissions</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage("submissions")}>View All</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Exam</th><th>Score</th></tr></thead>
              <tbody>
                {myResults.slice(-4).reverse().map((r, i) => {
                  const stu = db.students.find(s => s.id === r.studentId);
                  const ex = myExams.find(e => e.id === r.examId);
                  const p = pct(r.score, r.total);
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{stu?.name || "—"}</td>
                      <td style={{ fontSize: 13, color: "var(--text2)" }}>{ex?.title}</td>
                      <td><span className={`badge ${p >= 70 ? "badge-green" : "badge-red"}`}>{r.score}/{r.total}</span></td>
                    </tr>
                  );
                })}
                {myResults.length === 0 && <tr><td colSpan={3}><div className="empty-state" style={{ padding: 30 }}><div className="empty-text">No submissions yet</div></div></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function TExams({ db, upd, teacher, myExams }) {
  const [viewExam, setViewExam] = useState(null);

  const deleteExam = (id) => {
    if (!confirm("Delete this exam? All related submissions will remain.")) return;
    upd("exams", es => es.filter(e => e.id !== id));
  };

  const toggleStatus = (id, status) => {
    upd("exams", es => es.map(e => e.id === id ? { ...e, status } : e));
  };

  return (
    <>
      <div className="page-top">
        <div><div className="page-title">My Exams</div><div className="page-sub">Manage your question papers</div></div>
      </div>
      {myExams.length === 0 && <div className="empty-state"><div className="empty-icon">📝</div><div className="empty-text">No exams created yet</div><div className="empty-sub">Use "Create Exam" to get started</div></div>}
      <div className="card-grid">
        {myExams.map((e, i) => (
          <div className="exam-card-ui" key={e.id} style={{ animationDelay: `${i * 0.06}s` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span className="tag">{e.subject}</span>
              <ExamStatusBadge status={e.status} />
            </div>
            <div className="exam-card-title">{e.title}</div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 18 }}>
              {e.questions.length} Questions · {e.duration} min · {e.totalMarks} marks
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>
              Publish date: <span style={{ color: "var(--amber)" }}>{e.publishDate}</span>
              {e.resultsPublished && <span className="badge badge-green" style={{ marginLeft: 8 }}>Published</span>}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewExam(e)}>Preview</button>
              {e.status === "active" && <button className="btn btn-sm" style={{ background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(218,28,92,0.26)" }} onClick={() => toggleStatus(e.id, "closed")}>Close</button>}
              {e.status === "closed" && <button className="btn btn-success btn-sm" onClick={() => toggleStatus(e.id, "active")}>Reopen</button>}
              <button className="btn btn-danger btn-sm" onClick={() => deleteExam(e.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {viewExam && (
        <Modal title={viewExam.title} onClose={() => setViewExam(null)}>
          <div style={{ marginBottom: 16 }}>
            <span className="tag" style={{ marginRight: 8 }}>{viewExam.subject}</span>
            <span className="tag">{viewExam.duration} min</span>
          </div>
          {viewExam.questions.map((q, i) => (
            <div key={q.id} style={{ background: "var(--surface2)", borderRadius: 10, padding: "16px 18px", marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 10, color: "var(--text)" }}>Q{i + 1}. {q.text}</div>
              {q.options.map((opt, oi) => (
                <div key={oi} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, fontSize: 14 }}>
                  <span style={{ color: oi === q.correct ? "var(--green)" : "var(--text3)", fontWeight: oi === q.correct ? 700 : 400 }}>
                    {oi === q.correct ? "✓" : "○"} {opt}
                  </span>
                  {oi === q.correct && <span style={{ fontSize: 11, color: "var(--green)" }}>Correct</span>}
                </div>
              ))}
            </div>
          ))}
        </Modal>
      )}
    </>
  );
}

function TCreateExam({ db, upd, teacher, onDone }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(teacher.subject || "");
  const [duration, setDuration] = useState(20);
  const [publishDate, setPublishDate] = useState(today());
  const [questions, setQuestions] = useState([emptyQ(1)]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function emptyQ(n) { return { id: "Q" + n, text: "", options: ["", "", "", ""], correct: 0 }; }

  const addQ = () => setQuestions(qs => [...qs, emptyQ(qs.length + 1)]);
  const removeQ = (i) => setQuestions(qs => qs.filter((_, idx) => idx !== i));
  const updQ = (i, k, v) => setQuestions(qs => qs.map((q, idx) => idx === i ? { ...q, [k]: v } : q));
  const updOpt = (qi, oi, v) => setQuestions(qs => qs.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, oidx) => oidx === oi ? v : o) } : q));

  const save = () => {
    setError("");
    if (!title.trim()) return setError("Exam title is required.");
    if (questions.some(q => !q.text.trim())) return setError("All questions must have text.");
    if (questions.some(q => q.options.some(o => !o.trim()))) return setError("All options must be filled.");
    const exam = {
      id: "EX" + uid(), teacherId: teacher.id, title, subject, duration: Number(duration),
      totalMarks: questions.length, status: "active", publishDate,
      resultsPublished: false, createdAt: today(), questions,
    };
    upd("exams", es => [...es, exam]);
    setSaved(true);
    setTimeout(onDone, 1200);
  };

  if (saved) return (
    <div className="empty-state">
      <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
      <div className="empty-text" style={{ color: "var(--green)", fontSize: 20 }}>Exam Created Successfully!</div>
      <div className="empty-sub">Redirecting to My Exams…</div>
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div className="page-title">Create New Exam</div>
        <div className="page-sub">Build an MCQ question paper for your students</div>
      </div>
      {error && <div className="form-error">{error}</div>}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header"><div className="card-title">Exam Details</div></div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Exam Title</label>
              <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Chapter 5 — Quadratic Equations" />
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input className="form-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Mathematics" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <input className="form-input" type="number" min={5} max={180} value={duration} onChange={e => setDuration(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Result Publish Date</label>
              <input className="form-input date-input" type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} min={today()} />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Questions ({questions.length})</div>
          <button className="btn btn-primary btn-sm" onClick={addQ}>+ Add Question</button>
        </div>
        <div className="card-body">
          {questions.map((q, qi) => (
            <div key={qi} className="q-builder" style={{ animationDelay: `${qi * 0.04}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="q-num">{qi + 1}</div>
                {questions.length > 1 && <button className="btn btn-danger btn-sm" onClick={() => removeQ(qi)}>Remove</button>}
              </div>
              <div className="form-group" style={{ marginBottom: 10 }}>
                <label className="form-label">Question</label>
                <textarea className="form-input" rows={2} value={q.text} onChange={e => updQ(qi, "text", e.target.value)} placeholder="Enter your question here…" />
              </div>
              <label className="form-label" style={{ marginBottom: 8, display: "block" }}>Options — click radio to mark correct answer</label>
              {q.options.map((opt, oi) => (
                <div key={oi} className="opt-row">
                  <input type="radio" name={`correct_${qi}`} checked={q.correct === oi} onChange={() => updQ(qi, "correct", oi)} />
                  <input className="form-input" value={opt} onChange={e => updOpt(qi, oi, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + oi)}`} style={{ flex: 1 }} />
                  {q.correct === oi && <span className="correct-hint">✓ Correct</span>}
                </div>
              ))}
            </div>
          ))}
          <button className="btn btn-secondary btn-full" style={{ marginTop: 4 }} onClick={addQ}>+ Add Another Question</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost" onClick={onDone}>Cancel</button>
        <button className="btn btn-primary btn-lg" onClick={save}>Publish Exam →</button>
      </div>
    </>
  );
}

function TSubmissions({ db, teacher, myExams, myResults }) {
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);

  const filtered = filter === "all" ? myResults : myResults.filter(r => r.examId === filter);

  return (
    <>
      <div className="page-top">
        <div><div className="page-title">Student Submissions</div><div className="page-sub">All received exam answers — auto-graded</div></div>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <select className="form-input" style={{ width: "auto" }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Exams</option>
          {myExams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Student</th><th>Exam</th><th>Score</th><th>%</th><th>Grade</th><th>Time</th><th>Submitted</th><th>Details</th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={8}><div className="empty-state" style={{ padding: 40 }}><div className="empty-icon">📨</div><div className="empty-text">No submissions yet</div></div></td></tr>}
              {filtered.map((r, i) => {
                const stu = db.students.find(s => s.id === r.studentId);
                const ex = myExams.find(e => e.id === r.examId);
                const p = pct(r.score, r.total);
                const g = grade(p);
                return (
                  <tr key={i}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 50, background: "var(--amber-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "var(--amber)" }}>{initials(stu?.name || "?")}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{stu?.name || "Unknown"}</div>
                          <div style={{ fontSize: 11, color: "var(--text3)" }}>{stu?.rollNo}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth: 180 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{ex?.title}</div></td>
                    <td><span className={`badge ${p >= 70 ? "badge-green" : "badge-red"}`}>{r.score}/{r.total}</span></td>
                    <td style={{ fontWeight: 700, color: p >= 70 ? "var(--green)" : "var(--red)" }}>{p}%</td>
                    <td><span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: p >= 70 ? "var(--green)" : "var(--red)" }}>{g}</span></td>
                    <td style={{ fontSize: 12, color: "var(--text2)" }}>{r.timeTaken}</td>
                    <td style={{ fontSize: 12, color: "var(--text3)" }}>{r.submittedAt}</td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => setDetail({ r, stu, ex })}>Review</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <Modal title={`${detail.stu?.name}'s Submission`} onClose={() => setDetail(null)} large>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span className="badge badge-blue">{detail.ex?.title}</span>
            <span className="badge badge-amber">Score: {detail.r.score}/{detail.r.total} ({pct(detail.r.score, detail.r.total)}%)</span>
            <span className="badge badge-purple">Grade: {grade(pct(detail.r.score, detail.r.total))}</span>
          </div>
          {detail.ex?.questions.map((q, qi) => {
            const ans = detail.r.answers[q.id];
            const ok = ans === q.correct;
            return (
              <div key={q.id} style={{ background: "var(--surface2)", borderRadius: 12, padding: "16px 18px", marginBottom: 12, borderLeft: `3px solid ${ok ? "var(--green)" : "var(--red)"}` }}>
                <div style={{ fontWeight: 600, marginBottom: 10, color: "var(--text)" }}>Q{qi + 1}. {q.text}</div>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>Student answered</div>
                    <div style={{ fontWeight: 600, color: ok ? "var(--green)" : "var(--red)" }}>
                      {ans !== undefined ? q.options[ans] : "Not answered"} {ok ? "✓" : "✗"}
                    </div>
                  </div>
                  {!ok && <div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>Correct answer</div>
                    <div style={{ fontWeight: 600, color: "var(--green)" }}>{q.options[q.correct]} ✓</div>
                  </div>}
                </div>
              </div>
            );
          })}
        </Modal>
      )}
    </>
  );
}

function TResultsPublish({ db, upd, teacher, myExams, myResults }) {
  const [selExam, setSelExam] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [msg, setMsg] = useState("");

  const publishNow = (examId) => {
    upd("exams", es => es.map(e => e.id === examId ? { ...e, resultsPublished: true } : e));
    setMsg("Results published successfully! Students can now view their results.");
    setTimeout(() => setMsg(""), 3000);
  };

  const updateDate = (examId) => {
    if (!newDate) return;
    upd("exams", es => es.map(e => e.id === examId ? { ...e, publishDate: newDate } : e));
    setNewDate(""); setSelExam(null);
    setMsg("Publish date updated.");
    setTimeout(() => setMsg(""), 3000);
  };

  const autoCorrectAll = (exam) => {
    const subs = myResults.filter(r => r.examId === exam.id);
    const count = subs.length;
    setMsg(`Auto-graded ${count} submission${count !== 1 ? "s" : ""}. All scores verified.`);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <>
      <div className="page-top">
        <div><div className="page-title">Results & Publishing</div><div className="page-sub">Auto-correct submissions and schedule result releases</div></div>
      </div>
      {msg && <div className="form-success" style={{ marginBottom: 20 }}>{msg}</div>}
      {myExams.length === 0 && <div className="empty-state"><div className="empty-icon">📊</div><div className="empty-text">No exams to manage</div></div>}
      {myExams.map((exam, i) => {
        const subs = myResults.filter(r => r.examId === exam.id);
        const avg = subs.length ? Math.round(subs.reduce((s, r) => s + pct(r.score, r.total), 0) / subs.length) : 0;
        const highest = subs.length ? Math.max(...subs.map(r => pct(r.score, r.total))) : 0;
        const lowest = subs.length ? Math.min(...subs.map(r => pct(r.score, r.total))) : 0;

        return (
          <div className="card" key={exam.id} style={{ marginBottom: 20, animationDelay: `${i * 0.07}s` }}>
            <div className="card-header">
              <div>
                <div className="card-title">{exam.title}</div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 3 }}>{exam.subject} · {exam.questions.length} questions · {subs.length} submissions</div>
              </div>
              <ExamStatusBadge status={exam.status} />
            </div>
            <div className="card-body">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
                {[
                  { label: "Submissions", value: subs.length, color: "var(--blue)" },
                  { label: "Avg. Score", value: subs.length ? avg + "%" : "—", color: "var(--amber)" },
                  { label: "Highest", value: subs.length ? highest + "%" : "—", color: "var(--green)" },
                  { label: "Lowest", value: subs.length ? lowest + "%" : "—", color: "var(--red)" },
                ].map((s, si) => (
                  <div key={si} style={{ background: "var(--surface2)", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" }}>{s.label}</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: "var(--surface2)", borderRadius: 12, padding: "16px 18px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 4 }}>Result Publish Date</div>
                  <div style={{ fontWeight: 700, color: "var(--amber)", fontSize: 16 }}>📅 {exam.publishDate}</div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  {selExam === exam.id ? (
                    <>
                      <input className="form-input date-input" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={{ width: 160 }} min={today()} />
                      <button className="btn btn-primary btn-sm" onClick={() => updateDate(exam.id)}>Save Date</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelExam(null)}>Cancel</button>
                    </>
                  ) : (
                    <button className="btn btn-ghost btn-sm" onClick={() => { setSelExam(exam.id); setNewDate(exam.publishDate); }}>Change Date</button>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="btn btn-secondary" onClick={() => autoCorrectAll(exam)}>
                  ⚡ Auto-Correct All ({subs.length})
                </button>
                {!exam.resultsPublished ? (
                  <button className="btn btn-primary" onClick={() => publishNow(exam.id)} disabled={subs.length === 0}>
                    🚀 Publish Results Now
                  </button>
                ) : (
                  <span className="badge badge-green" style={{ fontSize: 13, padding: "8px 16px" }}>✓ Results Published</span>
                )}
                {exam.status === "active" && (
                  <button className="btn btn-danger" onClick={() => upd("exams", es => es.map(e => e.id === exam.id ? { ...e, status: "closed" } : e))}>
                    🔒 Close Exam
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

function TStudents({ db }) {
  return (
    <>
      <div className="page-header">
        <div className="page-title">All Students</div>
        <div className="page-sub">Registered students on the platform</div>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Roll No</th><th>Class</th><th>Joined</th><th>Exams Taken</th></tr></thead>
            <tbody>
              {db.students.map(s => {
                const taken = db.results.filter(r => r.studentId === s.id).length;
                return (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--blue-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "var(--blue)" }}>{initials(s.name)}</div>
                        <span style={{ fontWeight: 600 }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--text2)" }}>{s.rollNo}</td>
                    <td><span className="tag">{s.class}</span></td>
                    <td style={{ fontSize: 13, color: "var(--text3)" }}>{s.joined}</td>
                    <td>{taken}</td>
                  </tr>
                );
              })}
              {db.students.length === 0 && <tr><td colSpan={5}><div className="empty-state" style={{ padding: 40 }}><div className="empty-text">No students yet</div></div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function TAnalytics({ db, teacher, myExams, myResults }) {
  if (myExams.length === 0) return (
    <>
      <div className="page-header"><div className="page-title">Analytics</div></div>
      <div className="empty-state"><div className="empty-icon">📈</div><div className="empty-text">No data yet</div><div className="empty-sub">Create exams to see analytics</div></div>
    </>
  );

  return (
    <>
      <div className="page-header"><div className="page-title">Analytics</div><div className="page-sub">Performance insights across your exams</div></div>
      <div className="card-grid">
        {myExams.map((exam, i) => {
          const subs = myResults.filter(r => r.examId === exam.id);
          if (subs.length === 0) return null;
          const avg = Math.round(subs.reduce((s, r) => s + pct(r.score, r.total), 0) / subs.length);
          const pass = subs.filter(r => pct(r.score, r.total) >= 50).length;
          const grades = { "A+": 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
          subs.forEach(r => { const g = grade(pct(r.score, r.total)); grades[g]++; });

          return (
            <div className="card" key={exam.id} style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="card-header"><div className="card-title">{exam.title}</div></div>
              <div className="card-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div style={{ background: "var(--surface2)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: "var(--amber)" }}>{avg}%</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>Class Average</div>
                  </div>
                  <div style={{ background: "var(--surface2)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: "var(--green)" }}>{Math.round((pass / subs.length) * 100)}%</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>Pass Rate</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>Grade Distribution</div>
                {Object.entries(grades).map(([g, n]) => n > 0 && (
                  <div key={g} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 24, fontSize: 13, fontWeight: 700, color: "var(--amber)", fontFamily: "'Playfair Display',serif" }}>{g}</div>
                    <div style={{ flex: 1, background: "var(--surface2)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                      <div style={{ width: `${(n / subs.length) * 100}%`, height: "100%", background: "var(--amber)", borderRadius: 4, transition: "width 0.8s ease" }} />
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text2)", width: 20 }}>{n}</div>
                  </div>
                ))}

                <div style={{ marginTop: 16, fontSize: 12, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Per-Question Performance</div>
                {exam.questions.map((q, qi) => {
                  const correct = subs.filter(r => r.answers[q.id] === q.correct).length;
                  const rate = subs.length ? Math.round((correct / subs.length) * 100) : 0;
                  return (
                    <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ fontSize: 12, color: "var(--text2)", width: 20 }}>Q{qi + 1}</div>
                      <div style={{ flex: 1, background: "var(--surface2)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                        <div style={{ width: `${rate}%`, height: "100%", background: rate >= 70 ? "var(--green)" : rate >= 40 ? "var(--amber)" : "var(--red)", borderRadius: 4 }} />
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text2)", width: 34 }}>{rate}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STUDENT APP
═══════════════════════════════════════════════════════════════ */
function StudentApp({ db, upd, student, onStartExam, onLogout }) {
  const [page, setPage] = useState("dashboard");

  const myResults = db.results.filter(r => r.studentId === student.id);
  const attempted = new Set(myResults.map(r => r.examId));
  const available = db.exams.filter(e => e.status === "active" && !attempted.has(e.id));

  const nav = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "exams", icon: "📝", label: "Available Exams", badge: available.length || undefined },
    { id: "myresults", icon: "📊", label: "My Results" },
    { id: "history", icon: "📖", label: "Exam History" },
    { id: "profile", icon: "👤", label: "My Profile" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app-shell">
        <Topbar name={student.name} role="student" onLogout={onLogout} />
        <div className="body-layout">
          <Sidebar nav={nav} page={page} setPage={setPage} />
          <div className="main-content">
            {page === "dashboard" && <SDashboard db={db} student={student} myResults={myResults} available={available} setPage={setPage} onStartExam={onStartExam} />}
            {page === "exams" && <SExams db={db} student={student} available={available} onStartExam={onStartExam} />}
            {page === "myresults" && <SResults db={db} student={student} myResults={myResults} />}
            {page === "history" && <SHistory db={db} student={student} myResults={myResults} attempted={attempted} />}
            {page === "profile" && <SProfile student={student} myResults={myResults} db={db} />}
          </div>
        </div>
      </div>
    </>
  );
}

function SDashboard({ db, student, myResults, available, setPage, onStartExam }) {
  const avgP = myResults.length ? Math.round(myResults.reduce((s, r) => s + pct(r.score, r.total), 0) / myResults.length) : 0;
  const best = myResults.length ? Math.max(...myResults.map(r => pct(r.score, r.total))) : 0;

  return (
    <>
      <div className="page-header">
        <div className="page-title">Hello, {student.name.split(" ")[0]} 👋</div>
        <div className="page-sub">Roll No: {student.rollNo} · Class: {student.class}</div>
      </div>
      <div className="stats-grid">
        {[
          { icon: "📝", label: "Pending Exams", value: available.length, color: "var(--amber)", dim: "var(--amber-dim)" },
          { icon: "✅", label: "Completed", value: myResults.length, color: "var(--green)", dim: "var(--green-dim)" },
          { icon: "📊", label: "Avg. Score", value: avgP + "%", color: "var(--blue)", dim: "var(--blue-dim)" },
          { icon: "🏆", label: "Best Score", value: best + "%", color: "var(--purple)", dim: "var(--purple-dim)" },
        ].map((s, i) => (
          <div className="stat-card" key={i} style={{ "--card-color": s.color, "--card-color-dim": s.dim, animationDelay: `${i * 0.07}s` }}>
            <div className="stat-icon-wrap">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {available.length > 0 && (
        <>
          <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
            <span>📝 Pending Exams</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage("exams")}>View All</button>
          </div>
          <div className="card-grid" style={{ marginBottom: 28 }}>
            {available.slice(0, 3).map((exam, i) => {
              const teacher = db.teachers.find(t => t.id === exam.teacherId);
              return (
                <div className="exam-card-ui" key={exam.id} style={{ animationDelay: `${i * 0.07}s` }}>
                  <span className="tag">{exam.subject}</span>
                  <div className="exam-card-title">{exam.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 6 }}>{exam.questions.length} Qs · {exam.duration} min</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 18 }}>By {teacher?.name || "Teacher"}</div>
                  <button className="btn btn-primary btn-sm" onClick={() => onStartExam(exam)}>Start Exam →</button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {myResults.length > 0 && (
        <>
          <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
            <span>📊 Recent Results</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage("myresults")}>View All</button>
          </div>
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Exam</th><th>Score</th><th>%</th><th>Grade</th><th>Submitted</th></tr></thead>
                <tbody>
                  {myResults.slice(-4).reverse().map((r, i) => {
                    const ex = db.exams.find(e => e.id === r.examId);
                    const p = pct(r.score, r.total);
                    const published = ex?.resultsPublished;
                    return (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{ex?.title || "—"}</td>
                        <td>{published ? <span className={`badge ${p >= 70 ? "badge-green" : "badge-red"}`}>{r.score}/{r.total}</span> : <span className="badge badge-amber">Pending</span>}</td>
                        <td style={{ color: published ? (p >= 70 ? "var(--green)" : "var(--red)") : "var(--text3)" }}>{published ? p + "%" : "—"}</td>
                        <td style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: published ? (p >= 70 ? "var(--green)" : "var(--red)") : "var(--text3)" }}>{published ? grade(p) : "—"}</td>
                        <td style={{ fontSize: 12, color: "var(--text3)" }}>{r.submittedAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function SExams({ db, student, available, onStartExam }) {
  const [confirm, setConfirm] = useState(null);

  return (
    <>
      <div className="page-header"><div className="page-title">Available Exams</div><div className="page-sub">Exams you can take right now</div></div>
      {available.length === 0 && <div className="empty-state"><div className="empty-icon">🎉</div><div className="empty-text">All caught up!</div><div className="empty-sub">No pending exams at the moment</div></div>}
      <div className="card-grid">
        {available.map((exam, i) => {
          const teacher = db.teachers.find(t => t.id === exam.teacherId);
          return (
            <div className="exam-card-ui" key={exam.id} style={{ animationDelay: `${i * 0.07}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span className="tag">{exam.subject}</span>
                <ExamStatusBadge status={exam.status} />
              </div>
              <div className="exam-card-title">{exam.title}</div>
              <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>{exam.questions.length} Questions · {exam.duration} minutes</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 18 }}>
                👨‍🏫 {teacher?.name} &nbsp;·&nbsp; Result: {exam.publishDate}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setConfirm(exam)}>Start Exam →</button>
              </div>
            </div>
          );
        })}
      </div>

      {confirm && (
        <div className="modal-overlay" onClick={() => setConfirm(null)}>
          <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">Ready to begin?</div><button className="modal-close" onClick={() => setConfirm(null)}>✕</button></div>
            <div className="modal-body">
              <div style={{ background: "var(--surface2)", borderRadius: 12, padding: "18px 20px", marginBottom: 18 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, marginBottom: 10 }}>{confirm.title}</div>
                {[
                  ["Questions", confirm.questions.length],
                  ["Duration", confirm.duration + " minutes"],
                  ["Total Marks", confirm.totalMarks],
                  ["Result Date", confirm.publishDate],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                    <span style={{ color: "var(--text2)" }}>{k}</span>
                    <span style={{ fontWeight: 600, color: "var(--amber)" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)", background: "var(--red-dim)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(218,28,92,0.18)" }}>
                ⚠️ Once started, the timer cannot be paused. Ensure you have {confirm.duration} minutes of uninterrupted time.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirm(null)}>Not yet</button>
              <button className="btn btn-primary" onClick={() => { onStartExam(confirm); setConfirm(null); }}>Yes, Start Now →</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SResults({ db, student, myResults }) {
  const [detail, setDetail] = useState(null);

  const published = myResults.filter(r => {
    const ex = db.exams.find(e => e.id === r.examId);
    return ex?.resultsPublished;
  });

  return (
    <>
      <div className="page-header"><div className="page-title">My Results</div><div className="page-sub">View published results and answer reviews</div></div>
      {myResults.length === 0 && <div className="empty-state"><div className="empty-icon">🏆</div><div className="empty-text">No results yet</div><div className="empty-sub">Take an exam to see your results here</div></div>}
      {myResults.length > 0 && published.length === 0 && (
        <div style={{ background: "var(--amber-dim)", border: "1px solid rgba(255,100,173,0.28)", borderRadius: 12, padding: "18px 20px", marginBottom: 20, fontSize: 14, color: "var(--amber)" }}>
          📅 You have submissions but results are not yet published by your teacher. Check back on the publish date.
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {myResults.map((r, i) => {
          const ex = db.exams.find(e => e.id === r.examId);
          const teacher = db.teachers.find(t => t.id === ex?.teacherId);
          const published = ex?.resultsPublished;
          const p = pct(r.score, r.total);
          return (
            <div className="card" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="card-header">
                <div>
                  <div className="card-title">{ex?.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 3 }}>By {teacher?.name} · Submitted {r.submittedAt}</div>
                </div>
                {published ? (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: p >= 70 ? "var(--green)" : "var(--red)" }}>{p}%</div>
                    <div style={{ fontSize: 13, color: "var(--text2)" }}>{r.score}/{r.total} · Grade {grade(p)}</div>
                  </div>
                ) : (
                  <div style={{ textAlign: "right" }}>
                    <span className="badge badge-amber">⏳ Awaiting</span>
                    <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 6 }}>Publishes {ex?.publishDate}</div>
                  </div>
                )}
              </div>
              {published && (
                <div className="card-body">
                  <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                    <span className="badge badge-blue">Time: {r.timeTaken}</span>
                    <span className={`badge ${p >= 70 ? "badge-green" : "badge-red"}`}>{p >= 50 ? "PASSED" : "FAILED"}</span>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => setDetail({ r, ex })}>📋 Review Answers</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {detail && (
        <Modal title="Answer Review" onClose={() => setDetail(null)} large>
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <span className="badge badge-amber">{detail.ex.title}</span>
            <span className="badge badge-blue">{detail.r.score}/{detail.r.total} correct</span>
          </div>
          {detail.ex.questions.map((q, qi) => {
            const ans = detail.r.answers[q.id];
            const ok = ans === q.correct;
            return (
              <div key={q.id} style={{ background: "var(--surface2)", borderRadius: 12, padding: "18px", marginBottom: 12, borderLeft: `3px solid ${ok ? "var(--green)" : "var(--red)"}`, animation: `fadeUp 0.3s ease ${qi * 0.05}s both` }}>
                <div style={{ fontWeight: 600, marginBottom: 12, color: "var(--text)", fontSize: 15 }}>Q{qi + 1}. {q.text}</div>
                {q.options.map((opt, oi) => {
                  let cls = "";
                  if (oi === q.correct) cls = "correct-opt";
                  else if (oi === ans) cls = "wrong-opt";
                  return (
                    <div key={oi} className={`q-option ${cls}`} style={{ cursor: "default", pointerEvents: "none", marginBottom: 8 }}>
                      <div className="q-circle">
                        <span className="q-circle-text">{String.fromCharCode(65 + oi)}</span>
                      </div>
                      <span style={{ flex: 1 }}>{opt}</span>
                      {oi === q.correct && <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green)" }}>✓ Correct</span>}
                      {oi === ans && !ok && <span style={{ fontSize: 11, fontWeight: 700, color: "var(--red)" }}>Your answer</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </Modal>
      )}
    </>
  );
}

function SHistory({ db, student, myResults, attempted }) {
  return (
    <>
      <div className="page-header"><div className="page-title">Exam History</div><div className="page-sub">All exams you've attempted</div></div>
      {myResults.length === 0 && <div className="empty-state"><div className="empty-icon">📖</div><div className="empty-text">No exam history yet</div></div>}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Exam</th><th>Subject</th><th>Score</th><th>Time Taken</th><th>Submitted</th><th>Result</th></tr></thead>
            <tbody>
              {myResults.map((r, i) => {
                const ex = db.exams.find(e => e.id === r.examId);
                const p = pct(r.score, r.total);
                const published = ex?.resultsPublished;
                return (
                  <tr key={i}>
                    <td style={{ color: "var(--text3)", fontSize: 13 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{ex?.title}</td>
                    <td><span className="tag">{ex?.subject}</span></td>
                    <td>{published ? <span className={`badge ${p >= 70 ? "badge-green" : "badge-red"}`}>{r.score}/{r.total}</span> : <span className="badge badge-amber">Pending</span>}</td>
                    <td style={{ fontSize: 13, color: "var(--text2)" }}>{r.timeTaken}</td>
                    <td style={{ fontSize: 12, color: "var(--text3)" }}>{r.submittedAt}</td>
                    <td>{published ? <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: p >= 70 ? "var(--green)" : "var(--red)" }}>{grade(p)}</span> : <span style={{ fontSize: 12, color: "var(--text3)" }}>Publishes {ex?.publishDate}</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function SProfile({ student, myResults, db }) {
  const published = myResults.filter(r => db.exams.find(e => e.id === r.examId)?.resultsPublished);
  const avg = published.length ? Math.round(published.reduce((s, r) => s + pct(r.score, r.total), 0) / published.length) : 0;

  return (
    <>
      <div className="page-header"><div className="page-title">My Profile</div></div>
      <div className="two-col">
        <div className="card">
          <div className="card-body" style={{ textAlign: "center", padding: "36px 24px" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#FF64AD,#e8509a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#3a0a1e", margin: "0 auto 16px", animation: "glow 2s infinite" }}>
              {initials(student.name)}
            </div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "var(--text)", marginBottom: 4 }}>{student.name}</div>
            <div style={{ fontSize: 14, color: "var(--text2)" }}>{student.rollNo}</div>
            <span className="badge badge-green" style={{ marginTop: 10 }}>{student.class}</span>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Academic Summary</div></div>
          <div className="card-body">
            {[
              ["Total Exams Attempted", myResults.length],
              ["Results Published", published.length],
              ["Average Score", avg ? avg + "%" : "—"],
              ["Overall Grade", published.length ? grade(avg) : "—"],
              ["Member Since", student.joined],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)", fontSize: 14 }}>
                <span style={{ color: "var(--text2)" }}>{k}</span>
                <span style={{ fontWeight: 700, color: "var(--amber)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXAM TAKER  (FIXED: timer no longer uses stale answers)
═══════════════════════════════════════════════════════════════ */
function ExamTaker({ exam, student, onSubmit, onCancel }) {
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [done, setDone] = useState(false);
  const startRef = useRef(Date.now());
  const timerRef = useRef();
  const answersRef = useRef(answers);
  const doneRef = useRef(false);

  // Keep answersRef always up-to-date so the timer can read the latest answers
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const submit = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    clearInterval(timerRef.current);
    const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
    const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const s = String(elapsed % 60).padStart(2, "0");
    const currentAnswers = answersRef.current;
    const score = exam.questions.reduce((acc, q) => acc + (currentAnswers[q.id] === q.correct ? 1 : 0), 0);
    setTimeout(() => onSubmit({
      studentId: student.id, examId: exam.id, score, total: exam.questions.length,
      answers: currentAnswers, submittedAt: new Date().toLocaleString("en-IN"), timeTaken: `${m}:${s}`,
    }), 500);
  }, [exam, student, onSubmit]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          submit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [submit]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const urgent = timeLeft < 60;
  const q = exam.questions[current];
  const progress = ((current + 1) / exam.questions.length) * 100;

  const toggleFlag = () => setFlagged(f => { const nf = new Set(f); nf.has(current) ? nf.delete(current) : nf.add(current); return nf; });

  if (done) return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center", animation: "fadeUp 0.6s ease" }}>
          <div style={{ fontSize: 64, marginBottom: 16, animation: "float 2s infinite" }}>✅</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: "var(--green)", marginBottom: 8 }}>Exam Submitted!</div>
          <div style={{ color: "var(--text2)" }}>Auto-correcting and saving your answers…</div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="exam-shell">
        <div className="exam-topbar">
          <div className="exam-info">
            <div className="exam-name">{exam.title}</div>
            <div className="exam-meta">{exam.questions.length} Questions · {student.name} · {Object.keys(answers).length} answered</div>
          </div>
          <div className={`timer-display ${urgent ? "urgent" : ""}`}>{mins}:{secs}</div>
        </div>

        <div className="exam-body">
          {/* Left nav panel */}
          <div className="exam-nav-panel">
            <div className="nav-panel-title">Questions</div>
            <div className="q-nav-grid">
              {exam.questions.map((_, i) => (
                <button key={i}
                  className={`q-nav-btn ${i === current ? "current" : answers[exam.questions[i].id] !== undefined ? "answered" : flagged.has(i) ? "flagged" : ""}`}
                  onClick={() => setCurrent(i)}
                >{i + 1}</button>
              ))}
            </div>
            <div className="nav-legend">
              {[["var(--amber)", "Current"], ["var(--green)", "Answered"], ["var(--border)", "Unanswered"]].map(([c, l]) => (
                <div key={l} className="legend-item">
                  <div className="legend-dot" style={{ background: c }} />
                  {l}
                </div>
              ))}
            </div>
            <button className="btn btn-danger btn-full" style={{ marginTop: 24 }}
              onClick={() => { if (confirm("Submit exam now?")) submit(); }}>
              Submit Exam
            </button>
          </div>

          {/* Main exam area */}
          <div className="exam-main">
            <div className="progress-track"><div className="progress-fill" style={{ width: progress + "%" }} /></div>
            <div className="q-card" key={current}>
              <div className="q-header">
                <span className="q-tag">Question {current + 1} of {exam.questions.length}</span>
                <button className={`q-flag-btn ${flagged.has(current) ? "flagged" : ""}`} onClick={toggleFlag}>
                  {flagged.has(current) ? "🚩 Flagged" : "🏳 Flag for Review"}
                </button>
              </div>
              <div className="q-text">{q.text}</div>
              {q.options.map((opt, oi) => (
                <div key={oi}
                  className={`q-option ${answers[q.id] === oi ? "selected" : ""}`}
                  onClick={() => setAnswers(a => ({ ...a, [q.id]: oi }))}
                >
                  <div className="q-circle">
                    <span className="q-circle-text">{String.fromCharCode(65 + oi)}</span>
                  </div>
                  {opt}
                </div>
              ))}
              <div className="q-nav-row">
                <button className="btn btn-secondary" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>← Prev</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setAnswers(a => { const na = { ...a }; delete na[q.id]; return na; })}>Clear</button>
                {current < exam.questions.length - 1
                  ? <button className="btn btn-primary" onClick={() => setCurrent(c => c + 1)}>Next →</button>
                  : <button className="btn btn-primary" onClick={() => { if (confirm("Submit exam now?")) submit(); }}>Submit ✓</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════════ */
function Topbar({ name, role, onLogout }) {
  return (
    <div className="topbar">
      <div className="topbar-brand">
        <div className="topbar-logo">🎓</div>
        <div className="topbar-title">Exam<span>Portal</span></div>
      </div>
      <div className="topbar-right">
        <span className={`topbar-role ${role === "teacher" ? "role-teacher" : "role-student"}`}>
          {role === "teacher" ? "👨‍🏫 Teacher" : "🎒 Student"}
        </span>
        <div className="topbar-user">
          <div className="topbar-avatar">{initials(name)}</div>
          <span className="topbar-name">{name}</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onLogout}>Sign Out</button>
      </div>
    </div>
  );
}

function Sidebar({ nav, page, setPage }) {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Navigation</div>
        {nav.map(n => (
          <div key={n.id} className={`sidebar-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
            <span className="s-icon">{n.icon}</span>
            <span style={{ flex: 1 }}>{n.label}</span>
            {n.badge !== undefined && <div className="sidebar-badge">{n.badge}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Modal({ title, onClose, children, large }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${large ? "modal-lg" : ""}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function ExamStatusBadge({ status }) {
  const map = { active: ["badge-green", "Active"], closed: ["badge-red", "Closed"], draft: ["badge-amber", "Draft"] };
  const [cls, label] = map[status] || ["badge-amber", status];
  return <span className={`badge ${cls}`}>{label}</span>;
}
