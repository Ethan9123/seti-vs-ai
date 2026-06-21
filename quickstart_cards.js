/* SETI · Space Agencies 快速开始卡（21 张, SR.1–SR.21）
   组织模式开局：每人发 3 张、选 2 张同时结算。
   place = 上半部放置（无奖励）：orbiter 行星 / signal 星系×n / trace 发现痕迹 / none
   reward = 下半部收益（资源/分数/信号令牌/收入）
   数据取自权威 preludeCards.ts + 官方规则书；星系名与本作 SECTOR_DEFS 一致，可按名查扇区。 */
window.QUICKSTART_CARDS = [
  {srid:'SR.1',  name:'发现痕迹·黄', place:{kind:'trace'},                 reward:{vp:3,publicity:1}},
  {srid:'SR.2',  name:'发现痕迹·粉', place:{kind:'trace'},                 reward:{vp:3,publicity:1}},
  {srid:'SR.3',  name:'巴纳德星信号', place:{kind:'signal',sector:'巴纳德星',n:2}, reward:{vp:2,data:2}},
  {srid:'SR.4',  name:'比邻星信号',   place:{kind:'signal',sector:'比邻星',n:2},   reward:{vp:2,data:2}},
  {srid:'SR.5',  name:'天狼星A信号',  place:{kind:'signal',sector:'天狼星A',n:2},  reward:{vp:2,data:2}},
  {srid:'SR.6',  name:'南河三信号',   place:{kind:'signal',sector:'南河三',n:2},   reward:{vp:2,data:2}},
  {srid:'SR.7',  name:'开普勒22信号', place:{kind:'signal',sector:'开普勒22',n:2}, reward:{vp:2,data:2}},
  {srid:'SR.8',  name:'室女座61信号', place:{kind:'signal',sector:'室女座61',n:2}, reward:{vp:2,data:2}},
  {srid:'SR.9',  name:'绘架座β信号',  place:{kind:'signal',sector:'绘架座β',n:2},  reward:{vp:2,data:2}},
  {srid:'SR.10', name:'织女星信号',   place:{kind:'signal',sector:'织女星',n:1},   reward:{signalToken:1,data:1}},
  {srid:'SR.11', name:'土星轨道器',   place:{kind:'orbiter',body:'saturn'},  reward:{vp:4,publicity:2}},
  {srid:'SR.12', name:'金星轨道器',   place:{kind:'orbiter',body:'venus'},   reward:{vp:3,publicity:1,energy:1}},
  {srid:'SR.13', name:'木星轨道器',   place:{kind:'orbiter',body:'jupiter'}, reward:{vp:3,publicity:1,data:1}},
  {srid:'SR.14', name:'水星轨道器',   place:{kind:'orbiter',body:'mercury'}, reward:{vp:2,publicity:1,credits:1}},
  {srid:'SR.15', name:'天王星轨道器', place:{kind:'orbiter',body:'uranus'},  reward:{income:'card'}},
  {srid:'SR.16', name:'海王星轨道器', place:{kind:'orbiter',body:'neptune'}, reward:{data:3}},
  {srid:'SR.17', name:'火星轨道器',   place:{kind:'orbiter',body:'mars'},    reward:{vp:3,publicity:1,card:1}},
  {srid:'SR.18', name:'启动资金·甲', place:{kind:'none'},                   reward:{vp:3,credits:1,card:1}},
  {srid:'SR.19', name:'启动资金·乙', place:{kind:'none'},                   reward:{vp:3,energy:1,card:1}},
  {srid:'SR.20', name:'信号先机',     place:{kind:'none'},                   reward:{vp:4,signalToken:1,publicity:1}},
  {srid:'SR.21', name:'公关攻势',     place:{kind:'none'},                   reward:{vp:3,publicity:3}},
];
