// nav.js – role-aware navbar (pure HTML/CSS/JS + Web3)

(function () {
  const css = `
  .nav {position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid #e5e7eb}
  .nav__in {max-width:1100px;margin:0 auto;padding:10px 16px;display:flex;gap:18px;align-items:center;justify-content:space-between}
  .brand {font-weight:900;font-size:18px;letter-spacing:.3px;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;background-clip:text;color:transparent}
  .links {display:flex;gap:16px;align-items:center;flex-wrap:wrap}
  .link {color:#374151;text-decoration:none;padding:8px 10px;border-radius:10px;font-weight:600}
  .link:hover {background:#f3f4f6}
  .link--active {background:#eef2ff;color:#3730a3}
  .right {display:flex;gap:12px;align-items:center}
  .addr {font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:12px; color:#6b7280; background:#f9fafb; padding:6px 8px; border-radius:8px; border:1px solid #e5e7eb}
  .btn {border:0;background:#111;color:#fff;border-radius:8px;padding:8px 10px;font-weight:700;cursor:pointer}
  @media (max-width:740px){ .links{gap:10px} .brand{font-size:16px} }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const mount = document.getElementById('navbar');
  if (!mount) return;

  // helpers
  const shortAddr = (a) => a ? (a.slice(0,6)+'…'+a.slice(-4)) : '';
  const isActive = (href) => {
    const here = location.pathname.split('/').pop().toLowerCase();
    const file = href.split('/').pop().toLowerCase();
    return here === file;
  };

  async function init() {
    // connect wallet (non-intrusive: request accounts only if not connected yet)
    if (!window.ethereum) {
      mount.innerHTML = `<div class="nav"><div class="nav__in"><div class="brand">G4</div><div class="links"></div><div class="right"><span class="addr">No MetaMask</span></div></div></div>`;
      return;
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    // build UserManager (legacy names from contract.js)
    const web3 = new Web3(window.ethereum);
    const userMgr = new web3.eth.Contract(window.CONTRACT_ABI, window.CONTRACT_ADDRESS);

    // detect role
    let isAdmin = false;
    try {
      isAdmin = await userMgr.methods.isAdmin(account).call();
    } catch (e) {
      // fallback: if getUserRole exists and returns "Admin"
      try {
        const role = await userMgr.methods.getUserRole(account).call();
        isAdmin = (String(role).toLowerCase() === 'admin');
      } catch(_) {}
    }

    // links
    const userLinks = [
      { href: 'buy.html',        label: 'Buy Property' },
      { href: 'market.html',     label: 'Marketplace' },
      { href: 'history.html',    label: 'Transaction History' },
    ];
    const adminExtra = [
      { href: 'create.html',     label: 'Create Property' },
      { href: 'plan.html',       label: 'Distribution Plan' },
    ];
    const links = isAdmin ? userLinks.concat(adminExtra) : userLinks;

    // render
    const linksHtml = links.map(l =>
      `<a class="link ${isActive(l.href)?'link--active':''}" href="${l.href}">${l.label}</a>`
    ).join('');

    mount.innerHTML = `
      <div class="nav">
        <div class="nav__in">
          <nav class="links">${linksHtml}</nav>
          <div class="right">
            <span class="addr" title="${account}">${shortAddr(account)}</span>
          </div>
        </div>
      </div>
    `;


    // react to account / chain changes
    window.ethereum.on?.('accountsChanged', ()=>location.reload());
    window.ethereum.on?.('chainChanged', ()=>location.reload());
  }

  init().catch(err => {
    console.error('Navbar init failed', err);
    mount.innerHTML = `<div class="nav"><div class="nav__in"><div class="brand">G4</div><div class="links"></div><div class="right"><span class="addr">Error</span></div></div></div>`;
  });
})();
