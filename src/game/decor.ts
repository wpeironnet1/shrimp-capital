export type DecorSlot = 'floor-left' | 'floor-center' | 'floor-right' | 'wall-left' | 'wall-center' | 'wall-right' | 'ceiling' | 'corner';
export type DecorCategory = 'Office Furniture' | 'Finance Props' | 'Executive Decor' | 'Wall Street Jokes';
export type DecorItem = { id: string; name: string; category: DecorCategory; slot: DecorSlot; price: number; unlockLevel: number; icon: string; buff?: string };

export const decorSlots: DecorSlot[] = ['floor-left','floor-center','floor-right','wall-left','wall-center','wall-right','ceiling','corner'];

export const decorItems: DecorItem[] = [
  { id:'desk', name:'Tiny Analyst Desk', category:'Office Furniture', slot:'floor-left', price:35, unlockLevel:1, icon:'briefcase' },
  { id:'chair', name:'Rolling Office Chair', category:'Office Furniture', slot:'floor-right', price:25, unlockLevel:2, icon:'business' },
  { id:'filing', name:'Filing Cabinet', category:'Office Furniture', slot:'corner', price:45, unlockLevel:3, icon:'file-tray-full' },
  { id:'meeting', name:'Micro Meeting Table', category:'Office Furniture', slot:'floor-center', price:70, unlockLevel:4, icon:'people' },
  { id:'copier', name:'Quarterly Report Copier', category:'Office Furniture', slot:'corner', price:85, unlockLevel:5, icon:'copy' },
  { id:'banker-lamp', name:"Banker's Lamp", category:'Office Furniture', slot:'floor-left', price:60, unlockLevel:3, icon:'bulb' },
  { id:'coffee-cart', name:'Earnings Call Coffee Cart', category:'Office Furniture', slot:'floor-right', price:90, unlockLevel:6, icon:'cafe' },
  { id:'water-cooler', name:'Liquidity Cooler', category:'Office Furniture', slot:'corner', price:75, unlockLevel:5, icon:'water' },
  { id:'trash', name:'Office Trash Can', category:'Office Furniture', slot:'corner', price:30, unlockLevel:2, icon:'trash' },
  { id:'conference-phone', name:'Conference Call Phone', category:'Office Furniture', slot:'floor-center', price:80, unlockLevel:6, icon:'call' },

  { id:'ticker', name:'Shell Street Ticker', category:'Finance Props', slot:'wall-center', price:120, unlockLevel:6, icon:'pulse', buff:'+1% sale value' },
  { id:'terminal', name:'Mini Market Terminal', category:'Finance Props', slot:'floor-center', price:145, unlockLevel:7, icon:'desktop', buff:'+1% event value' },
  { id:'chart', name:'Up-And-To-The-Right Chart', category:'Finance Props', slot:'wall-left', price:80, unlockLevel:4, icon:'trending-up' },
  { id:'pnl', name:'P&L Board', category:'Finance Props', slot:'wall-right', price:95, unlockLevel:5, icon:'stats-chart' },
  { id:'bull', name:'Tiny Bull Statue', category:'Finance Props', slot:'floor-right', price:180, unlockLevel:9, icon:'trophy' },
  { id:'briefcase', name:'Gold Briefcase', category:'Finance Props', slot:'floor-left', price:130, unlockLevel:8, icon:'briefcase' },
  { id:'vault', name:'Vault Door Facade', category:'Finance Props', slot:'wall-right', price:220, unlockLevel:12, icon:'lock-closed' },
  { id:'earnings', name:'EARNINGS CALL Sign', category:'Finance Props', slot:'wall-center', price:110, unlockLevel:6, icon:'megaphone' },
  { id:'abacus', name:'Mini Abacus', category:'Finance Props', slot:'floor-right', price:75, unlockLevel:5, icon:'apps' },
  { id:'clipboard', name:'Compliance Clipboard', category:'Finance Props', slot:'floor-left', price:70, unlockLevel:5, icon:'clipboard' },
  { id:'clock', name:'Brass Wall Clock', category:'Finance Props', slot:'wall-right', price:120, unlockLevel:7, icon:'time' },
  { id:'whiteboard', name:'Strategy Whiteboard', category:'Finance Props', slot:'wall-left', price:130, unlockLevel:8, icon:'easel' },
  { id:'aum-display', name:'AUM Counter Display', category:'Finance Props', slot:'wall-center', price:165, unlockLevel:10, icon:'speedometer' },

  { id:'nameplate', name:'Gold CEO Nameplate', category:'Executive Decor', slot:'floor-center', price:170, unlockLevel:10, icon:'ribbon' },
  { id:'mahogany', name:'Mahogany Panel', category:'Executive Decor', slot:'wall-left', price:240, unlockLevel:14, icon:'albums' },
  { id:'brass-rail', name:'Brass Railing', category:'Executive Decor', slot:'floor-center', price:260, unlockLevel:15, icon:'remove' },
  { id:'velvet-rope', name:'Red Velvet Rope', category:'Executive Decor', slot:'floor-right', price:190, unlockLevel:13, icon:'git-commit' },
  { id:'skyline', name:'Aquarium Skyline Mural', category:'Executive Decor', slot:'wall-center', price:320, unlockLevel:18, icon:'business' },
  { id:'ceo-portrait', name:'Shrimp CEO Portrait', category:'Executive Decor', slot:'wall-left', price:210, unlockLevel:12, icon:'person' },
  { id:'private-bank', name:'PRIVATE AQUATIC BANK Sign', category:'Executive Decor', slot:'wall-right', price:420, unlockLevel:22, icon:'cash' },
  { id:'chandelier', name:'Executive Light Rig', category:'Executive Decor', slot:'ceiling', price:350, unlockLevel:20, icon:'sunny' },
  { id:'private-equity', name:'PRIVATE EQUITY PRAWNS Plaque', category:'Executive Decor', slot:'wall-left', price:280, unlockLevel:16, icon:'podium' },
  { id:'shell-street-logo', name:'SHELL STREET CAPITAL Logo', category:'Executive Decor', slot:'wall-center', price:300, unlockLevel:17, icon:'shield-checkmark' },
  { id:'safe', name:'Tiny Executive Safe', category:'Executive Decor', slot:'corner', price:250, unlockLevel:14, icon:'lock-closed' },

  { id:'visor-rack', name:'Green Accountant Visor Rack', category:'Wall Street Jokes', slot:'wall-left', price:95, unlockLevel:5, icon:'glasses' },
  { id:'calculator', name:'Desk Calculator', category:'Wall Street Jokes', slot:'floor-left', price:55, unlockLevel:3, icon:'calculator' },
  { id:'ledger', name:'Tax Ledger Stack', category:'Wall Street Jokes', slot:'floor-right', price:65, unlockLevel:4, icon:'book' },
  { id:'buy-dip', name:'BUY THE DIP Sign', category:'Wall Street Jokes', slot:'wall-center', price:90, unlockLevel:5, icon:'arrow-down-circle' },
  { id:'compliance-sign', name:'COMPLIANCE IS WATCHING', category:'Wall Street Jokes', slot:'wall-right', price:100, unlockLevel:7, icon:'eye' },
  { id:'liquidity-plaque', name:'LIQUIDITY POOL Plaque', category:'Wall Street Jokes', slot:'floor-center', price:70, unlockLevel:5, icon:'water' },
  { id:'espresso', name:'Analyst Espresso Machine', category:'Wall Street Jokes', slot:'corner', price:140, unlockLevel:8, icon:'cafe' },
  { id:'opening-bell', name:'Opening Bell', category:'Wall Street Jokes', slot:'wall-center', price:160, unlockLevel:9, icon:'notifications' },
  { id:'ticker-tape', name:'Ticker Tape Ribbon', category:'Wall Street Jokes', slot:'wall-right', price:85, unlockLevel:6, icon:'receipt' },
];
