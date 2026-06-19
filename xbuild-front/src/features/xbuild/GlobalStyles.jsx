export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}body{overflow-x:hidden;font-family:'Barlow',sans-serif;background:#f5f5f5}

      /* ---- Metron colour tokens ---- */
      :root{
        --c-primary:#e8a000;   /* yellow/gold accent  */
        --c-dark:#1a1f2e;      /* deep navy           */
        --c-dark2:#222840;
        --c-mid:#2e3450;
        --c-steel:#374260;
        --c-light:#f5f5f0;
        --c-white:#ffffff;
        --c-text:#555566;
        --c-head:#1a1f2e;
        --font-head:'Barlow Condensed',sans-serif;
        --font-body:'Barlow',sans-serif;
      }

      /* ---- Animations ---- */
      @keyframes pulse{from{opacity:0.5}to{opacity:1}}
      @keyframes loader{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
      @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
      @keyframes slideRight{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:none}}

      /* ---- Metron btn styles ---- */
      .metron-btn-primary{
        display:inline-flex;align-items:center;gap:10px;
        background:var(--c-primary);color:var(--c-dark);
        font-family:var(--font-head);font-size:14px;font-weight:800;
        letter-spacing:1.5px;text-transform:uppercase;
        padding:14px 32px;border:none;cursor:pointer;text-decoration:none;
        clip-path:polygon(0 0,calc(100% - 12px) 0,100% 100%,0 100%);
        transition:filter .2s,transform .2s;
      }
      .metron-btn-primary:hover{filter:brightness(1.12);transform:translateY(-2px)}
      .metron-btn-outline{
        display:inline-flex;align-items:center;gap:10px;
        background:transparent;color:var(--c-white);
        font-family:var(--font-head);font-size:14px;font-weight:700;
        letter-spacing:1.5px;text-transform:uppercase;
        padding:12px 30px;border:2px solid var(--c-white);cursor:pointer;text-decoration:none;
        transition:border-color .2s,background .2s,color .2s,transform .2s;
      }
      .metron-btn-outline:hover{border-color:var(--c-primary);background:var(--c-primary);color:var(--c-dark);transform:translateY(-2px)}

      /* ---- Section label / tag ---- */
      .metron-tag{
        display:inline-flex;align-items:center;gap:10px;
        font-family:var(--font-head);font-size:13px;font-weight:800;
        letter-spacing:3px;text-transform:uppercase;color:var(--c-primary);
        margin-bottom:12px;
      }
      .metron-tag::before{content:'';width:30px;height:3px;background:var(--c-primary);display:inline-block}

      /* ---- Section heading ---- */
      .metron-h2{font-family:var(--font-head);font-size:clamp(30px,3.5vw,52px);font-weight:900;line-height:1.1;color:var(--c-dark);letter-spacing:-0.5px}
      .metron-h2.light{color:#fff}
      .metron-h3{font-family:var(--font-head);font-size:22px;font-weight:800;color:var(--c-dark)}

      /* ---- Sidebar card ---- */
      .metron-sidebar-card{background:var(--c-dark);padding:32px;margin-bottom:24px}
      .metron-sidebar-card h4{font-family:var(--font-head);font-size:20px;font-weight:800;color:#fff;margin-bottom:20px;padding-bottom:14px;border-bottom:2px solid var(--c-primary)}

      /* ---- Sector list ---- */
      .sector-item{
        display:block;padding:12px 20px 12px 16px;
        border-left:3px solid transparent;
        color:#bbc;font-family:var(--font-body);font-size:14px;font-weight:600;
        cursor:pointer;transition:all .2s;text-decoration:none;
        border-bottom:1px solid rgba(255,255,255,.06);
        background:none;width:100%;text-align:left;border-right:none;border-top:none;
      }
      .sector-item:hover,.sector-item.active{border-left-color:var(--c-primary);color:#fff;background:rgba(255,255,255,.05)}
      .sector-item::after{content:'›';float:right;color:var(--c-primary)}

      /* ---- Page hero / breadcrumb ---- */
      .metron-page-hero{
        background:var(--c-dark) url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=80') center/cover no-repeat;
        background-blend-mode:multiply;
        padding:100px 0 60px;position:relative;
      }
      .metron-page-hero::after{content:'';position:absolute;bottom:0;left:0;right:0;height:4px;background:var(--c-primary)}

      /* ---- Content card ---- */
      .content-card{background:#fff;border-top:4px solid var(--c-primary);padding:40px;margin-bottom:32px;box-shadow:0 2px 20px rgba(0,0,0,.06)}

      /* ---- Accordion ---- */
      .metron-accordion{border:1px solid #e5e5e8;margin-bottom:8px}
      .metron-accordion-head{
        display:flex;justify-content:space-between;align-items:center;
        padding:18px 24px;cursor:pointer;
        font-family:var(--font-head);font-size:17px;font-weight:700;color:var(--c-dark);
        background:#fff;border:none;width:100%;text-align:left;
        transition:background .2s;
      }
      .metron-accordion-head:hover{background:#fafafa}
      .metron-accordion-head.open{background:var(--c-dark);color:#fff}
      .metron-accordion-body{padding:20px 24px;background:#fafafa;font-family:var(--font-body);color:var(--c-text);line-height:1.8;font-size:15px}

      /* ---- Stat counter box ---- */
      .stat-counter-box{border-top:3px solid var(--c-primary);padding:28px 24px;background:#fff}
      .stat-counter-box .num{font-family:var(--font-head);font-size:52px;font-weight:900;color:var(--c-primary);line-height:1}
      .stat-counter-box .lbl{font-family:var(--font-body);font-size:14px;font-weight:600;color:var(--c-text);text-transform:uppercase;letter-spacing:1px;margin-top:6px}

      /* ---- Input ---- */
      input::placeholder,textarea::placeholder{color:#aaa}
      .metron-input{
        width:100%;padding:12px 16px;border:1px solid #ddd;
        font-family:var(--font-body);font-size:14px;color:var(--c-dark);
        outline:none;transition:border-color .2s;background:#fff;
      }
      .metron-input:focus{border-color:var(--c-primary)}
      .metron-select{
        width:100%;padding:12px 16px;border:1px solid #ddd;
        font-family:var(--font-body);font-size:14px;color:var(--c-dark);
        outline:none;background:#fff;cursor:pointer;
      }

      /* ---- Brochure download btn ---- */
      .brochure-btn{
        display:flex;align-items:center;gap:16px;
        background:var(--c-dark);padding:16px 20px;margin-bottom:12px;
        color:#fff;text-decoration:none;transition:background .2s;
        font-family:var(--font-body);
      }
      .brochure-btn:hover{background:var(--c-primary);color:var(--c-dark)}
      .brochure-btn .icon{font-size:24px;flex-shrink:0}
      .brochure-btn .info small{display:block;font-size:11px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:1px}
      .brochure-btn:hover .info small{color:var(--c-dark)}
      .brochure-btn .info strong{font-size:14px;font-weight:700}

      /* ---- Responsive ---- */
      @media(max-width:1024px){
        .layout-with-sidebar{flex-direction:column!important}
        .layout-sidebar{width:100%!important;max-width:100%!important}
      }
      @media(max-width:900px){
        .desktop-nav{display:none!important}
        .mobile-menu-btn{display:block!important}
        .topbar-desktop{display:none!important}
        .navbar-actions .get-quote-btn,.navbar-actions .admin-btn,.navbar-actions .sidebar-btn{display:none!important}
        .about-grid{grid-template-columns:1fr!important;gap:40px!important}
        .projects-grid{grid-template-columns:1fr!important;grid-auto-rows:200px!important}
        .projects-grid>div{grid-column:auto!important}
        .process-steps-grid{grid-template-columns:repeat(2,1fr)!important;gap:32px 20px!important}
        .process-step-arrow{display:none!important}
        .stats-grid{grid-template-columns:1fr!important;gap:40px!important}
        .contact-grid{grid-template-columns:1fr!important;gap:40px!important}
        .footer-top-grid{grid-template-columns:1fr!important;gap:20px!important}
        .footer-bottom-grid{grid-template-columns:1fr 1fr!important;gap:32px!important}
        .news-grid{grid-template-columns:1fr!important}
        .section-padding{padding:64px 0!important}
        .hero-stat-card{min-width:50%!important;flex:none!important;border-left:none!important;border-top:1px solid rgba(255,255,255,.2)!important}
      }
      @media(max-width:480px){
        .footer-bottom-grid{grid-template-columns:1fr!important}
        .about-features-grid{grid-template-columns:1fr!important}
        .stats-counts{flex-direction:column!important;gap:24px!important}
        .hero-btns{flex-direction:column!important;gap:12px!important}
        .hero-stat-card{min-width:100%!important}
        .services-grid{grid-template-columns:1fr!important}
        .process-steps-grid{grid-template-columns:1fr!important}
        .contact-grid form{padding:24px 16px!important}
        h1,h2{word-break:break-word}
        .section-padding{padding:48px 0!important}
      }
      @media(max-width:360px){
        .metron-btn-primary,.metron-btn-outline{width:100%!important;justify-content:center!important}
      }
    `}</style>
  );
}