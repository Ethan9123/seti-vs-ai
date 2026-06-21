/* az_nn.js —— AlphaZero-lite 网络的 JS 前向（policy+value）。
   权重来自 window.AZ_WEIGHTS（az_weights.js，由 az_train.py GPU 训练导出）。
   浏览器推理 + Node 自对弈共用。 */
(function(root){
  function relu(x){ return x>0?x:0; }
  function layer(inp,W,b,IN,OUT){            // W 扁平 [OUT][IN] 行主序: W[j*IN+i]
    const o=new Array(OUT);
    for(let j=0;j<OUT;j++){ let s=b[j]; const col=j*IN; for(let i=0;i<IN;i++) s+=inp[i]*W[col+i]; o[j]=s; }
    return o;
  }
  function forward(feat, W){
    W = W || root.AZ_WEIGHTS; if(!W) return null;
    const NF=W.NF, A=W.A, H1=W.H1, H2=W.H2, H3=W.H3;
    let h=layer(feat,W.fc1W,W.fc1b,NF,H1); for(let i=0;i<H1;i++)h[i]=relu(h[i]);
    h=layer(h,W.fc2W,W.fc2b,H1,H2); for(let i=0;i<H2;i++)h[i]=relu(h[i]);
    h=layer(h,W.fc3W,W.fc3b,H2,H3); for(let i=0;i<H3;i++)h[i]=relu(h[i]);
    const logits=layer(h,W.polW,W.polb,H3,A);
    const value=Math.tanh(layer(h,W.valW,W.valb,H3,1)[0]);
    let mx=-1e9; for(const x of logits) if(x>mx)mx=x;
    let s=0; const policy=logits.map(x=>{ const e=Math.exp(x-mx); s+=e; return e; });
    for(let i=0;i<policy.length;i++) policy[i]/=s;
    return { policy, value, logits };
  }
  root.AZ_NN = { forward, ready:()=>!!root.AZ_WEIGHTS };
})(typeof window!=='undefined'?window:globalThis);
