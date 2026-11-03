(() => {
  if (document.documentElement.dataset.uxArticleReady) return;
  document.documentElement.dataset.uxArticleReady = 'true';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const figures = [...document.querySelectorAll('[data-animation]')];
  let allPaused = reduced.matches;
  function setMotion(figure, paused) {
    figure.classList.toggle('is-paused', paused);
    const button = figure.querySelector('[data-motion]');
    if (button) { button.textContent = paused ? '▶' : 'Ⅱ'; button.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation'); button.title = paused ? 'Play animation' : 'Pause animation'; button.setAttribute('aria-pressed', String(paused)); }
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.classList.toggle('is-offscreen', !entry.isIntersecting);
  }), { threshold: 0.08 });
  figures.forEach(figure => {
    setMotion(figure, allPaused);
    observer.observe(figure);
    figure.querySelector('[data-motion]')?.addEventListener('click', () => {
      setMotion(figure, !figure.classList.contains('is-paused'));
      syncAllButton();
    });
    figure.querySelector('[data-replay]')?.addEventListener('click', () => {
      const animated = figure.querySelectorAll('*');
      animated.forEach(el => el.style.animationName = 'none');
      void figure.offsetWidth;
      animated.forEach(el => el.style.removeProperty('animation-name'));
      setMotion(figure, false); syncAllButton();
    });
  });
  const allButton = null;
  function syncAllButton() { allPaused = reduced.matches; }
  reduced.addEventListener('change', event => { figures.forEach(f => setMotion(f, event.matches)); syncAllButton(); });
  document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('ux-motion-paused', document.hidden));
  const articleDisclosure = document.querySelector('.article-disclosure');
  function revealLinkedSection() {
    const id = location.hash.slice(1);
    const section = id && document.getElementById(id);
    if (section && articleDisclosure?.contains(section)) { articleDisclosure.open = true; requestAnimationFrame(() => section.scrollIntoView()); }
  }
  window.addEventListener('hashchange', revealLinkedSection);
  revealLinkedSection();

  const traceDemo = document.querySelector('.reasoning-demo');
  const traceViewport = traceDemo.querySelector('.trace-viewport');
  const traceStatus = document.getElementById('trace-status');
  const processingButton = document.getElementById('play-processing');
  const messages = {
    raw: 'Agents produce long explanations. The goals and possible issues are still embedded in the prose.',
    extract: 'Extract a goal and identify possible issues. Connect them to the agent’s persona traits.',
    organize: 'Group related goals across runs, keeping the persona traits, possible issues, and source excerpts connected. Open a source record to inspect the reasoning.'
  };
  let processingTimer = null;
  function stopProcessing() {
    clearTimeout(processingTimer); processingTimer = null;
    processingButton.textContent = '▶'; processingButton.setAttribute('aria-label', 'Play transformation');
  }
  function showTrace(stage) {
    traceDemo.dataset.traceStage = stage;
    traceDemo.querySelector('.raw-records').hidden = stage === 'organize';
    traceDemo.querySelector('.organized-records').hidden = stage !== 'organize';
    document.querySelectorAll('[data-trace]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.trace === stage)));
    traceViewport.scrollTop = 0;
    traceStatus.textContent = messages[stage];
  }
  function playProcessing() {
    if (processingTimer) { stopProcessing(); return; }
    showTrace('raw'); processingButton.textContent = 'Ⅱ'; processingButton.setAttribute('aria-label', 'Pause transformation');
    processingTimer = setTimeout(() => {
      showTrace('extract');
      processingTimer = setTimeout(() => { showTrace('organize'); processingTimer = setTimeout(() => { processingTimer = null; playProcessing(); }, 6500); }, 6500);
    }, 5000);
  }
  processingButton.addEventListener('click', () => { processingSeen = true; playProcessing(); });
  document.querySelectorAll('[data-trace]').forEach(button => button.addEventListener('click', () => {
    processingSeen = true; stopProcessing(); showTrace(button.dataset.trace);
  }));
  allButton?.addEventListener('click', () => { if (allPaused) stopProcessing(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopProcessing(); });
  reduced.addEventListener('change', event => { if (event.matches) stopProcessing(); });
  let processingSeen = false;
  new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) { stopProcessing(); return; }
    if (!processingSeen && !reduced.matches && !allPaused && !processingTimer) playProcessing();
  }), {threshold: 0.35}).observe(traceDemo);

  const editScene = document.querySelector('.edit-scene');
  const apply = document.getElementById('apply-edit');
  const replay = document.getElementById('replay-step');
  const reset = document.getElementById('reset-edit');
  const result = document.querySelector('.replay-result');
  function editState(state) {
    editScene.dataset.editState = state;
    const edited = state !== 'original';
    replay.disabled = !edited; apply.disabled = edited;
    result.hidden = state !== 'replayed';
    document.getElementById('edit-label').textContent = state === 'original' ? 'ORIGINAL SNAPSHOT' : state === 'edited' ? 'PROPOSED EDIT' : 'ONE-STEP REPLAY';
    document.getElementById('edit-title').textContent = state === 'original' ? 'The purchase controls are out of view.' : state === 'edited' ? 'The action is now visible on the card.' : 'The next action changes. The question remains.';
    document.getElementById('edit-description').textContent = state === 'original' ? 'Apply the proposed edit to make the action available on the font card.' : state === 'edited' ? 'Replay the illustrated next step to compare the original and modified snapshots.' : 'The agent now plans to add Alaska to the cart. Read both the action comparison and the issue assessment below.';
  }
  apply?.addEventListener('click', () => editState('edited'));
  replay?.addEventListener('click', () => {
    if (editScene.dataset.editState === 'replayed') {
      editScene.dataset.editState = 'edited'; void editScene.offsetWidth;
    }
    editState('replayed');
  });
  reset?.addEventListener('click', () => editState('original'));

  const datasets = {
    overall: { values: [2.625, 2.875], sd: [.916, .835], note: 'Eight participants · Error bars: ±1 SD · Assisted conditions only' },
    first: { values: [3.000, 3.250], sd: [.816, .957], note: 'Four participants per condition-order group · Error bars: ±1 SD' },
    second: { values: [2.250, 2.500], sd: [.957, .577], note: 'Four participants per condition-order group · Error bars: ±1 SD' }
  };
  function chart(key) {
    const data = datasets[key]; const base = 260; const unit = 43;
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 335" aria-hidden="true"><text x="35" y="30" font-family="ui-monospace,monospace" font-size="11" fill="#62676c">MEAN NUMBER OF SEEDED ISSUES</text>';
    for (let i=0; i<=5; i++) {
      const y=base-i*unit;
      svg += `<line x1="80" x2="755" y1="${y}" y2="${y}" stroke="${i ? '#ddddD6' : '#333'}" stroke-width="1"/><text x="54" y="${y+4}" font-family="ui-monospace,monospace" font-size="12" fill="#555">${i}</text>`;
    }
    data.values.forEach((v,i) => {
      const x=245+i*310, y=base-v*unit, top=base-(v+data.sd[i])*unit, bottom=base-(v-data.sd[i])*unit;
      svg+=`<rect x="${x-70}" y="${y}" width="140" height="${v*unit}" fill="${i ? '#c77979' : '#50aaa7'}"/><path d="M${x} ${top}V${bottom}M${x-12} ${top}H${x+12}M${x-12} ${bottom}H${x+12}" fill="none" stroke="#333" stroke-width="2"/><text x="${x+24}" y="${top-9}" font-family="Schibsted Grotesk,Arial,sans-serif" font-size="20" fill="#1b1f24">${v.toFixed(3)}</text><text x="${x}" y="290" text-anchor="middle" font-family="Schibsted Grotesk,Arial,sans-serif" font-size="17" fill="#1b1f24">${i ? 'UXCascade' : 'Human report'}</text><text x="${x}" y="313" text-anchor="middle" font-family="ui-monospace,monospace" font-size="11" fill="#62676c">SD ${data.sd[i].toFixed(3)}</text>`;
    });
    svg+='</svg>';
    const el=document.getElementById('study-chart');
    if (!el) return;
    el.innerHTML=svg;
    el.setAttribute('aria-label', `${key === 'overall' ? 'Overall' : key === 'first' ? 'Condition used first' : 'Condition used second'}. Mean seeded issues identified: human report ${data.values[0].toFixed(3)}, SD ${data.sd[0].toFixed(3)}; UXCascade ${data.values[1].toFixed(3)}, SD ${data.sd[1].toFixed(3)}.`);
    document.getElementById('chart-note').textContent=data.note;
    document.getElementById('chart-mobile-summary').innerHTML = `<span>Human report <b>${data.values[0].toFixed(3)} ± ${data.sd[0].toFixed(3)}</b></span><span>UXCascade <b>${data.values[1].toFixed(3)} ± ${data.sd[1].toFixed(3)}</b></span>`;
  }
  document.querySelectorAll('[data-order]').forEach(button => button.addEventListener('click',()=>{
    document.querySelectorAll('[data-order]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    chart(button.dataset.order);
  }));
  chart('overall');
  document.getElementById('copy-citation')?.addEventListener('click', async () => {
    const status=document.getElementById('copy-status');
    try { await navigator.clipboard.writeText(document.querySelector('#citation code').textContent); status.textContent='Copied'; }
    catch { status.textContent='Select and copy the citation above.'; }
  });
})();
