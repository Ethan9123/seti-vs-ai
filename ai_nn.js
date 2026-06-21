/* ai_nn.js —— SETI 神经网络 AI（共享模块：浏览器推理 + Node 训练共用）
   一个小型 MLP：状态特征 → 每种主行动类型的 Q 值(≈该行动导向胜利的概率)。
   权重来自 window.AI_WEIGHTS（ai_weights.js，由自对弈训练导出）。*/
(function(root){
  const TYPES = ['launch','orbit','land','scan','analyze','card','research','move','pass'];

  // 从玩家 pi 的视角提取归一化特征向量
  function features(G, pi){
    const p=G.players[pi], q=G.players[1-pi];
    const tc=x=>x.techs.probe.length+x.techs.tele.length+x.techs.comp.length;
    const inc=x=>{const c={credit:0,energy:0,card:0};x.incomeCards.forEach(t=>c[t.type]++);return c;};
    const ic=inc(p), qic=inc(q);
    const onPlanet = p.probes.some(pr=>pr.ring>=0 && G.rings[pr.ring][((pr.pos%8)+8)%8] && ['mercury','venus','mars','jupiter','saturn','uranus','neptune'].includes(G.rings[pr.ring][((pr.pos%8)+8)%8]))?1:0;
    const compFull = p.computer.filter(s=>!s.lower).every(s=>s.filled)?1:0;
    const sumTok=x=>{ let s=0; const t=x.alienTokens||{}; for(const k in t)s+=t[k]; return s; };
    const aliensDisc = G.aliens? G.aliens.filter(a=>a.revealed).length : 0;
    const f=[
      G.round/5,
      p.vp/120, q.vp/120, (p.vp-q.vp)/60,
      p.credits/15, p.energy/15, p.publicity/10, p.data/6, p.hand.length/8,
      q.credits/15, q.energy/15, q.publicity/10, q.data/6, q.hand.length/8,
      p.techs.probe.length/4, p.techs.tele.length/4, p.techs.comp.length/4,
      q.techs.probe.length/4, q.techs.tele.length/4, q.techs.comp.length/4,
      p.orbiters/6, p.landers/6, p.sectorWins/8,
      q.orbiters/6, q.landers/6, q.sectorWins/8,
      p.traces.land/5, p.traces.win/5, p.traces.analyze/5,
      q.traces.land/5, q.traces.win/5, q.traces.analyze/5,
      ic.credit/8, ic.energy/8, ic.card/8,
      p.completedMissions/6, p.endgameCards.length/6,
      p.probes.length/2, q.probes.length/2,
      onPlanet, compFull,
      p.org?1:0,
      // —— 新版机制特征 ——
      q.org?1:0,
      (p.alienPowers?p.alienPowers.length:0)/3, (q.alienPowers?q.alienPowers.length:0)/3,
      sumTok(p)/12, sumTok(q)/12,
      (p.alienSpecies?p.alienSpecies.length:0)/2,
      (p.trigMissions?p.trigMissions.length:0)/4, (q.trigMissions?q.trigMissions.length:0)/4,
      aliensDisc/2,
      Object.keys(p.markedSectors||{}).length/8, Object.keys(q.markedSectors||{}).length/8,
      (p.probeLimit||1)/2,
      (p.pendingMoves||0)/5,
      p.alienMsgDone?1:0,
    ];
    return f;
  }
  const NF = 56; // 特征数（与上面一致）

  function relu(x){return x>0?x:0;}
  function sigmoid(x){return 1/(1+Math.exp(-x));}

  // 前向：feat(NF) -> h1(H1) -> h2(H2) -> out(TYPES) 经 sigmoid
  function forward(feat, W){
    W = W || root.AI_WEIGHTS;
    if(!W) return null;
    const {W1,b1,W2,b2,W3,b3,H1,H2,A}=W;
    const h1=new Array(H1).fill(0);
    for(let j=0;j<H1;j++){ let s=b1[j]; const col=j*NF; for(let i=0;i<NF;i++) s+=feat[i]*W1[col+i]; h1[j]=relu(s); }
    const h2=new Array(H2).fill(0);
    for(let j=0;j<H2;j++){ let s=b2[j]; const col=j*H1; for(let i=0;i<H1;i++) s+=h1[i]*W2[col+i]; h2[j]=relu(s); }
    const out=new Array(A).fill(0);
    for(let j=0;j<A;j++){ let s=b3[j]; const col=j*H2; for(let i=0;i<H2;i++) s+=h2[i]*W3[col+i]; out[j]=sigmoid(s); }
    return {h1,h2,out};
  }

  // 在可行行动类型里选 Q 最大者（推理用）
  function pickType(G, pi, feasibleTypes){
    const W=root.AI_WEIGHTS; if(!W) return null;
    const r=forward(features(G,pi),W); if(!r) return null;
    let best=null,bv=-1;
    for(const t of feasibleTypes){ const idx=TYPES.indexOf(t); if(idx<0)continue; const v=r.out[idx]; if(v>bv){bv=v;best=t;} }
    return best;
  }

  root.AI_NN = { TYPES, NF, features, forward, pickType, relu, sigmoid };
})(typeof window!=='undefined'?window:globalThis);
