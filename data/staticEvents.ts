
import { Mood } from "../types";

/**
 * =============================================================================
 *  BINANCE 2026 LUMINOUS ALMANAC - DATA ENGINE
 * =============================================================================
 */

export interface StaticEventContent {
  tag: string;
  title: string;
  description: string;
  yearOfEvent: string;
  quote?: string; // Optional: Specific quote for the event
  mood?: Mood; // Optional: Override default GLORY mood
}

// =============================================================================
// 0. 哲学语录库 (The Philosophical Archive)
// =============================================================================
const PHILOSOPHICAL_QUOTES = [
  "数理之中，自有万钧之力 (Vires in Numeris)。",
  "代码即律法，共识即疆域。",
  "不信言语，只验真伪 (Don't Trust. Verify)。",
  "数学无言，却道尽万物法则。",
  "私钥在手，主权在我 (Not your keys, not your coins)。",
  "去中心化，乃通往自由之窄门。",
  "区块铭刻永恒，链上见证不朽。",
  "信任机器，而非人性。",
  "账本不可改，历史不可磨。",
  "密码学是防御强权的终极盾牌。",
  "HODL：一场关于时间的苦行。",
  "价格喧嚣，价值静水流深。",
  "人弃我取，人取我予 (Be fearful when others are greedy)。",
  "终局思维：人人皆是中本聪。",
  "星海征途，终将抵达 (WAGMI)。",
  "谦卑入局，聚沙成塔 (Stay humble. Stack sats)。",
  "与其择时而动，不如久伴长情。",
  "耐心，是穿越周期的唯一通票。",
  "这是财富转移，而非财富创造。",
  "未来已降临，只因分布未均。",
  "重塑货币，即重塑文明基石。",
  "我们不只是见证者，更是编年史家。",
  "人人皆为银行 (Be Your Own Bank)。",
  "货币自由，即人之自由。",
  "这场革命，终将去中心化。",
  "始于创世区块，归于浩瀚星辰。",
  "以代码为基石，筑数字之圣殿。",
  "Web3 是互联网的回归。"
];

// =============================================================================
// 1. 核心历史事件库 (Historical Timeline)
// =============================================================================
const HISTORICAL_EVENTS: Record<string, StaticEventContent> = {
  // --- JANUARY ---
  "0-1": { tag: "2026 序章", title: "光之启幕", description: "2026年1月1日。欢迎来到“价值自由”的元年。所有的历史，皆为序章。", yearOfEvent: "2026", quote: "让金钱像信息一样自由流动 (Freedom of Money)。", mood: "GLORY" },
  "0-2": { tag: "社区文化", title: "Do 4", description: "2023年，CZ 发布推文强调 '4'：忽略 FUD、假新闻和攻击。", yearOfEvent: "2023", quote: "忽略杂音，专注建设 (Do 4)。" },
  "0-3": { tag: "起源时刻", title: "创世区块", description: "2009年，中本聪挖出了比特币的第一个区块（Block #0）。", yearOfEvent: "2009", quote: "泰晤士报头版：旧金融秩序的挽歌。", mood: "GLORY" },
  "0-4": { tag: "流量过载", title: "暂停注册", description: "2018年，因用户量激增，币安不得不暂停新用户注册进行系统升级。", yearOfEvent: "2018", quote: "拥堵，是变革的前奏。" },
  "0-5": { tag: "每日仪式", title: "Binance WODL", description: "2022年，Crypto WODL 游戏上线。知识科普与每日打卡仪式。", yearOfEvent: "2022", quote: "懂的人，自然懂。" },
  "0-10": { tag: "社区力量", title: "Running Bitcoin", description: "2009年，Hal Finney 发布著名的 'Running bitcoin' 推文。", yearOfEvent: "2009", quote: "比特币，正如约运行 (Running bitcoin)。" },
  "0-11": { tag: "RWA 里程碑", title: "贝莱德 BUIDL", description: "2025年1月，贝莱德宣布其 BUIDL 基金支持 24/7 实时赎回 USDC。", yearOfEvent: "2025", quote: "华尔街的周末，被代码消灭了。", mood: "FUTURE" },
  "0-12": { tag: "首次转账", title: "第一笔交易", description: "2009年，中本聪向 Hal Finney 发送了 10 BTC。", yearOfEvent: "2009" },
  "0-15": { tag: "生态里程碑", title: "2.5亿用户", description: "2025年初，币安全球用户数突破 2.5 亿。", yearOfEvent: "2025", quote: "四分之一十亿，共识的新高度。" },
  "0-20": { tag: "政治宏叙事", title: "D.O.G.E. 上任", description: "2025年1月，马斯克正式领导 '政府效率部' (D.O.G.E.)。", yearOfEvent: "2025", quote: "效率，是最高的道德。", mood: "FUTURE" },
  "0-22": { tag: "慷慨精神", title: "Red Packet", description: "Crypto Red Packet（加密红包）改变了社区社交方式。", yearOfEvent: "LIFE", quote: "运气，也是实力的一部分。" },
  "0-24": { tag: "IEO 范式", title: "Launchpad 重启", description: "2019年，币安 Launchpad 上线 BitTorrent (BTT)。", yearOfEvent: "2019" },
  "0-29": { tag: "名人效应", title: "Elon 修改简介", description: "2021年，Elon Musk 将 Twitter 简介改为 #Bitcoin。", yearOfEvent: "2021", quote: "回首往事，皆是必然。" },

  // --- FEBRUARY ---
  "1-1": { tag: "生态入口", title: "Web3 钱包", description: "2024年，币安 Web3 钱包正式上线铭文市场。", yearOfEvent: "2024", quote: "不仅是存储，更是通往未来的钥匙。" }, // Downgraded to GLORY
  "1-8": { tag: "行业名梗", title: "Funds are SAFU", description: "2018年，CZ 发推承诺 'All funds are safe'。", yearOfEvent: "2018", quote: "资金安然无恙 (Funds are SAFU)。" },
  "1-10": { tag: "支付革命", title: "X 支付上线", description: "2025年2月，Elon Musk 的 X 平台正式集成加密支付功能。", yearOfEvent: "2025", quote: "万能应用，终于闭环。", mood: "FUTURE" },
  // Moved 3.12 to March section

  "1-14": { tag: "Layer 2", title: "Starknet 空投", description: "2024年，Starknet 进行大规模空投。", yearOfEvent: "2024" }, // Downgraded to GLORY
  "1-15": { tag: "品牌进化", title: "BNB Chain", description: "2022年，Binance Smart Chain (BSC) 正式更名为 BNB Chain。", yearOfEvent: "2022", quote: "超越币安，构建万物 (Build N Build)。" },
  "1-20": { tag: "去中心化", title: "Binance DEX", description: "2019年，Binance DEX 测试网正式上线。", yearOfEvent: "2019", quote: "不仅拥有财富，更掌权财富。" },

  // --- MARCH ---
  "2-5": { tag: "新起点", title: "Giggle Academy", description: "2024年，CZ 宣布启动教育项目 Giggle Academy。", yearOfEvent: "2024", quote: "让知识像空气一样自由流动。" }, // Downgraded to GLORY
  "2-11": { tag: "国家战略", title: "比特币法案", description: "2025年3月，美国参议员引入《2025 比特币法案》。", yearOfEvent: "2025", quote: "数字黄金，并入国库。" },
  "2-12": { tag: "黑天鹅", title: "3.12 暴跌", description: "2020年，受全球疫情恐慌影响，加密市场单日暴跌超 50%。", yearOfEvent: "2020", quote: "生存，乃唯一策略。", mood: "CRISIS" },
  "2-13": { tag: "技术升级", title: "Dencun 升级", description: "2024年，以太坊完成 Dencun 升级，引入 Blob 数据结构。", yearOfEvent: "2024", quote: "让扩展性不再是瓶颈。", mood: "FUTURE" },
  "2-15": { tag: "监管绿灯", title: "美债上链", description: "2025年3月，美国财政部发布指导意见，允许受监管实体在公链上发行国债代币。", yearOfEvent: "2025", quote: "国家信用的数字化。" },
  "2-18": { tag: "技术硬核", title: "Pascal 硬分叉", description: "2025年3月，BNB Chain 激活 Pascal 升级。", yearOfEvent: "2025", quote: "体验无感，技术有痕。", mood: "FUTURE" },
  "2-23": { tag: "交易心理", title: "拿不住就不富", description: "CZ 发布名言：'If you can't hold, you won't be rich.'", yearOfEvent: "CORE", quote: "拿不住，便不会富。" },
  "2-24": { tag: "心理博弈", title: "Bitcoin Button", description: "2022年，'Bitcoin Button' 游戏上线。", yearOfEvent: "2022", quote: "最后一名，才是赢家。" },
  "2-28": { tag: "审判日", title: "SBF 判决", description: "2024年，Sam Bankman-Fried 被判处 25 年监禁。", yearOfEvent: "2024", quote: "贪婪的代价，是二十五载光阴。", mood: "CRISIS" },
  "2-29": { tag: "加密生活", title: "Binance Card", description: "2020年，Binance Card 正式发布。", yearOfEvent: "2020", quote: "买咖啡，用 BNB。" },

  // --- APRIL ---
  "3-5": { tag: "资产上链", title: "RWA 万亿时刻", description: "2025年4月，BlackRock 宣布其链上代币化基金规模突破 100 亿美元。", yearOfEvent: "2025", quote: "传统金融的终点，是链上。" }, // Downgraded to GLORY
  "3-18": { tag: "合规巅峰", title: "迪拜 VASP 牌照", description: "2024年，币安获得迪拜虚拟资产监管局 (VARA) 颁发的完整 VASP 牌照。", yearOfEvent: "2024", quote: "拥抱监管，方能行稳致远。" },
  "3-19": { tag: "至暗时刻", title: "5.19 大跌", description: "2021年，市场经历剧烈回调。数百万合约用户在这一天经历了爆仓。", yearOfEvent: "2021", quote: "至暗时刻，恰是黎明伏笔。", mood: "CRISIS" },
  "3-20": { tag: "太空经济", title: "星舰支付", description: "2025年4月20日，SpaceX 宣布 Starlink 的部分增值服务接受 Dogecoin 支付。", yearOfEvent: "2025", quote: "To the Moon, literally.", mood: "FUTURE" },
  "3-22": { tag: "文化图腾", title: "比特币披萨节", description: "2010年，Laszlo Hanyecz 用 10,000 BTC 购买了两块披萨。", yearOfEvent: "2010", quote: "史上最昂贵的披萨。" },
  "3-30": { tag: "东方力量", title: "香港 ETF 上市", description: "2024年，博时、华夏等机构发行的比特币与以太坊现货 ETF 在香港交易所敲钟上市。", yearOfEvent: "2024", quote: "香江水暖，资本先行。" },

  // --- MAY ---
  "4-8": { tag: "铁三角", title: "何一 (He Yi)", description: "币安联合创始人何一，被社区尊称为“币安一姐”。", yearOfEvent: "CORE", quote: "用户至上，乃唯一信仰。" },
  "4-12": { tag: "监管对话", title: "SEC 代币化圆桌", description: "2025年5月，SEC 举行'资产上链'圆桌会议。", yearOfEvent: "2025", quote: "对话取代了诉讼。" },
  "4-14": { tag: "监管风暴", title: "SEC 起诉", description: "2023年，SEC 宣布起诉币安及 CZ。", yearOfEvent: "2023", quote: "稳住，诸君 (Steady lads)。", mood: "CRISIS" },
  "4-17": { tag: "以太坊", title: "The DAO 攻击", description: "2016年，黑客利用重入漏洞从 The DAO 盗走 360 万 ETH。", yearOfEvent: "2016", mood: "CRISIS" },
  "4-20": { tag: "人物动态", title: "CZ 新身份", description: "2025年5月，赵长鹏 (CZ) 出任吉尔吉斯斯坦总统数字资产顾问。", yearOfEvent: "2025", quote: "行者无疆，布道不止。" },
  "4-23": { tag: "主流化", title: "ETH ETF", description: "2024年，SEC 意外批准以太坊现货 ETF 的关键文件。", yearOfEvent: "2024", quote: "代码即石油，驱动未来的引擎。" }, // Downgraded to GLORY
  "4-24": { tag: "Meme 永生", title: "Doge 陨落", description: "2024年，Doge 表情包原型 Kabosu 离世。", yearOfEvent: "2024", quote: "肉身虽陨，图腾永存 (Doge Forever)。" },

  // --- JUNE ---
  "5-8": { tag: "生态里程碑", title: "两亿用户", description: "2024年，币安宣布全球注册用户突破 2 亿。", yearOfEvent: "2024", quote: "两亿星火，已成燎原之势。" },
  "5-14": { tag: "诞生之日", title: "币安成立", description: "2017年，赵长鹏 (CZ) 与团队正式创立 Binance。", yearOfEvent: "2017", quote: "交易全世界 (Exchange the world)。", mood: "GLORY" },
  "5-15": { tag: "技术融合", title: "Beacon Chain Sunset", description: "2025年（预计），BNB Beacon Chain 完成最终日落。", yearOfEvent: "2025", quote: "双链归一，大道至简。", mood: "FUTURE" },
  "5-18": { tag: "法案落地", title: "MiCA 全面生效", description: "2025年中，欧盟 MiCA 法案预计全面落地。", yearOfEvent: "2025", quote: "在规则的框架内，翩以此舞。" },
  "5-23": { tag: "绝对巨星", title: "CR7 Partnership", description: "2022年，Cristiano Ronaldo (C罗) 正式与币安建立独家 NFT 合作伙伴关系。", yearOfEvent: "2022", quote: "Forever CR7: The GOAT." },
  "5-26": { tag: "通缩机制", title: "首次 BNB 销毁", description: "2017年，币安完成了第一次 BNB 季度销毁。", yearOfEvent: "2017" },

  // --- JULY ---
  "6-01": { tag: "社区战袍", title: "The Hoodie", description: "币安的黑金 Logo 卫衣不仅仅是一件衣服，它是行业内最硬通的“社交货币”。", yearOfEvent: "LIFE", quote: "Soft Armor for Hard Builders." },
  "6-14": { tag: "八周年", title: "Be Binance", description: "[[2025年7月，币安成立八周年。]]", yearOfEvent: "2025", quote: "在一起，才是币安 (Be Together)。" },
  "6-20": { tag: "DeFi 融合", title: "X 牵手 Ripple", description: "2025年7月，Elon Musk 与 Ripple 确立了 X Payments 的底层结算合作。", yearOfEvent: "2025", quote: "社交的尽头是金融。" }, // Downgraded to GLORY
  "6-22": { tag: "国家抛售", title: "德国政府清仓", description: "2024年7月，德国政府清空了其查获的 50,000 枚比特币。", yearOfEvent: "2024", quote: "哪怕是国家，也无法撼动共识。", mood: "CRISIS" },
  "6-24": { tag: "多链互通", title: "Centrifuge V3", description: "2025年7月，RWA 协议 Centrifuge 发布 V3。", yearOfEvent: "2025", quote: "流动性无国界。" }, // Downgraded to GLORY

  // --- AUGUST ---
  "7-4": { tag: "历史转折", title: "9.4 监管", description: "2017年，中国发布《关于防范代币发行融资风险的公告》。币安果断决定'出海'。", yearOfEvent: "2017", quote: "危机，乃进化之契机。", mood: "CRISIS" },
  "7-8": { tag: "核心团队", title: "何一加入", description: "2017年8月8日，何一正式加入币安担任联合创始人兼 CMO。", yearOfEvent: "2017", quote: "重返战场，只为登顶。" },
  "7-13": { tag: "产品里程碑", title: "合约上线", description: "2019年，Binance Futures 正式上线。", yearOfEvent: "2019" },
  "7-15": { tag: "硅基文明", title: "AI 代理支付", description: "2025年8月，首个完全由 AI Agent 自主管理的加密钱包完成了一笔跨链交易。", yearOfEvent: "2025", quote: "人类无需插手。", mood: "FUTURE" },
  "7-21": { tag: "主流化", title: "Coinbase 收录 WLFI", description: "2025年8月，WLFI 稳定币被列入 Coinbase 上币路线图。", yearOfEvent: "2025", quote: "权力与资本的链上共舞。" },
  "7-24": { tag: "应用层", title: "TON 崛起", description: "2024年，Telegram 生态 (TON) 用户爆发。", yearOfEvent: "2024", quote: "从聊天窗口，通往价值网络。" },
  "7-25": { tag: "官方玩梗", title: "The Intern", description: "Binance Intern（实习生）账号是机构号人格化的典范。", yearOfEvent: "LIFE", quote: "Intern > CEO." },

  // --- SEPTEMBER ---
  "8-1": { tag: "DeFi 夏天", title: "BSC 上线", description: "2020年9月1日，Binance Smart Chain (BSC) 主网启动。", yearOfEvent: "2020", quote: "连接 CeFi 与 DeFi 的桥梁。" }, // Downgraded to GLORY
  "8-10": { tag: "善意回响", title: "Giggle 的抉择", description: "2025年9月，面对社区 Meme 币向 Giggle Academy 的捐赠，CZ 展现了开放的态度。", yearOfEvent: "2025", quote: "善意不问出处。" },
  "8-13": { tag: "扩容方案", title: "opBNB 主网", description: "2023年，opBNB 主网正式上线。", yearOfEvent: "2023", quote: "速度，即是用户体验。" }, // Downgraded to GLORY
  "8-20": { tag: "高性能链", title: "Solana Firedancer", description: "2025年9月，Solana 新一代客户端 Firedancer 主网完整上线。", yearOfEvent: "2025", quote: "不仅是快，是瞬时。", mood: "FUTURE" },
  "8-27": { tag: "传奇归来", title: "CZ 获释", description: "2024年，CZ 结束拘禁重获自由。", yearOfEvent: "2024", quote: "行者无疆，自由无界。" },
  "8-31": { tag: "创世宣言", title: "比特币白皮书", description: "2008年，中本聪发布了《比特币：一种点对点的电子现金系统》。", yearOfEvent: "2008", quote: "一种点对点的电子现金系统。" },

  // --- OCTOBER ---
  "9-4": { tag: "第一中文叙事", title: "币安人生", description: "2024年10月4日，Binance Life (币安人生) 诞生于 BNB Chain。", yearOfEvent: "2024", quote: "人生由我，币安相随。" },
  "9-6": { tag: "大事件", title: "FTX 崩塌前夕", description: "2022年，CZ 发推表示决定清算账面上的 FTT 代币。", yearOfEvent: "2022", quote: "光明磊落，不与暗室为谋。", mood: "CRISIS" },
  "9-8": { tag: "科技向善", title: "Binance Charity", description: "2018年，币安慈善基金会成立。", yearOfEvent: "2018", quote: "善意上链，爱无损耗。" },
  "9-12": { tag: "社交进化", title: "Binance Square", description: "2022年，Binance Feed（后更名为 Square）上线。", yearOfEvent: "2022", quote: "从交易，到生活。" },
  "9-14": { tag: "巨头入局", title: "贝莱德自研", description: "2025年10月，CEO Larry Fink 透露贝莱德正在开发专有的资产代币化技术堆栈。", yearOfEvent: "2025", quote: "消除中介，直连价值。", mood: "FUTURE" },
  "9-17": { tag: "数据主权", title: "Greenfield", description: "2023年10月，BNB Greenfield 主网正式上线。", yearOfEvent: "2023", quote: "让数据回归所有者。", mood: "FUTURE" },
  "9-20": { tag: "文化官方化", title: "币安人生", description: "2025年10月，Binance Futures 上线 'Binance Life' 永续合约。", yearOfEvent: "2025", quote: "人生由我，币安相随 (Life is Binance)。" },
  "9-21": { tag: "新时代", title: "Richard Teng", description: "2023年，币安与美国监管达成和解，CZ 辞任 CEO，Richard Teng 接棒。", yearOfEvent: "2023", quote: "是时候翻开新的一页了。" }, // Downgraded to GLORY (Maturity, not Crisis)
  "9-28": { tag: "上市里程碑", title: "Securitize 上市", description: "2025年10月，RWA 龙头 Securitize 宣布通过 SPAC 方式上市。", yearOfEvent: "2025", quote: "代币化企业，登陆纳斯达克。" },
  "9-30": { tag: "全球峰会", title: "迪拜区块链周", description: "2024年10月，币安区块链周在迪拜举行。", yearOfEvent: "2024", quote: "动量所在，即是未来。" },

  // --- NOVEMBER ---
  "10-4": { tag: "AI 进化", title: "Grok 钱包", description: "2025年11月，xAI 旗下的 Grok 3.0 模型发布，内置了非托管加密钱包。", yearOfEvent: "2025", quote: "硅基生命的第一笔私房钱。", mood: "FUTURE" },
  "10-6": { tag: "宏观转向", title: "政治觉醒", description: "2024年美国大选，加密选民首次成为关键力量。", yearOfEvent: "2024", quote: "选票，即另一种形式的共识。" },
  "10-8": { tag: "实体落地", title: "DePIN 爆发", description: "2025年11月，DePIN 网络覆盖设备突破 5000 万台。", yearOfEvent: "2025", quote: "代码构建网络，硬件连接世界。", mood: "FUTURE" },
  "10-11": { tag: "顶级掠食者", title: "MicroStrategy", description: "2024年，MicroStrategy 持续加仓。", yearOfEvent: "2024", quote: "这不是赌博，这是数学上的必然。" },
  "10-12": { tag: "创始人", title: "中本聪隐退", description: "2010年，中本聪发布了最后一个帖子后彻底消失。", yearOfEvent: "2010", quote: "火种已播，我将归隐。" },
  "10-18": { tag: "长期主义", title: "HODL", description: "2013年，GameKyuubi 在论坛醉酒发帖 'I AM HODLING'。", yearOfEvent: "2013", quote: "无论涨跌，我将坚守 (I AM HODLING)。" },
  "10-23": { tag: "技术路线", title: "Lean Ethereum", description: "2025年11月，Vitalik 确立了 'Lean Ethereum' 路线图。", yearOfEvent: "2025", quote: "做减法，是为了无限的加法。", mood: "FUTURE" },

  // --- DECEMBER ---
  "11-1": { tag: "巨鲸更名", title: "Strategy 诞生", description: "2025年12月，MicroStrategy 正式更名为 'Strategy'。", yearOfEvent: "2025", quote: "名字越短，信仰越深。" },
  "11-3": { tag: "精神图腾", title: "迪拜的 '4'", description: "2025年12月，Binance Blockchain Week 重返迪拜。", yearOfEvent: "2025", quote: "Ignore FUD, Keep Building." },
  "11-4": { tag: "金融未来", title: "代币化超越 AI", description: "2025年12月，BlackRock CEO Larry Fink 预言：'资产代币化 (Tokenization) 的影响将超越 AI'。", yearOfEvent: "2025", quote: "万物皆可 Token。", mood: "FUTURE" },
  "11-5": { tag: "社区守护者", title: "Binance Angels", description: "12月5日是国际志愿者日。", yearOfEvent: "LIFE", quote: "因为热爱，所以守护。" },
  "11-15": { tag: "时代交接", title: "何一宣言", description: "2025年底，联席 CEO 何一发出霸气宣言：'CZ is history, I am the future'。", yearOfEvent: "2025", quote: "历史值得铭记，未来更可期。" },
  "11-20": { tag: "支付革命", title: "Binance Pay", description: "2025年（趋势），Binance Pay 在全球商户覆盖率突破新高。", yearOfEvent: "2025", quote: "支付，如呼吸般自然。" },
  "11-25": { tag: "终极里程碑", title: "3亿用户", description: "2025年12月，币安宣布全球用户突破 3 亿。", yearOfEvent: "2025", quote: "三百兆星光，汇聚成河。", mood: "GLORY" },
  "11-26": { tag: "能源革命", title: "特斯拉挖矿", description: "2025年底，特斯拉宣布其 Megapack 储能网络利用多余太阳能进行比特币挖矿。", yearOfEvent: "2025", quote: "能源货币化 (Monetizing Energy)。", mood: "FUTURE" },
  "11-30": { tag: "性能极致", title: "Fermi 硬分叉", description: "2025年底，BNB Chain 发布 Fermi 版本。", yearOfEvent: "2025", quote: "唯快不破。", mood: "FUTURE" }
};

// =============================================================================
// 2. 全量知识库 (The Grand Archive)
// =============================================================================
// UPDATED: Manually added CRISIS mood to Dark Forest items; others default to GLORY
const KNOWLEDGE_BASE: StaticEventContent[] = [
  // --- 01. 警示录 (The Dark Forest) ---
  { tag: "警示录", title: "门头沟时刻", description: "2014年，当时占据全球 70% 交易量的 Mt. Gox 宣布破产。", yearOfEvent: "HISTORY", quote: "永远不要把鸡蛋放在别人的篮子里。", mood: "CRISIS" },
  { tag: "警示录", title: "跨链劫案", description: "2021年，Poly Network 遭黑客攻击，损失 6.1 亿美元。", yearOfEvent: "HISTORY", quote: "代码虽无眠，人性有缝隙。", mood: "CRISIS" },
  { tag: "警示录", title: "浪人陨落", description: "2022年，Axie Infinity 的侧链 Ronin 验证节点遭入侵。", yearOfEvent: "HISTORY", quote: "中心化的代价是安全。", mood: "CRISIS" },
  { tag: "警示录", title: "死亡螺旋", description: "2022年5月，算法稳定币 UST 脱锚，LUNA 代币在 48 小时内归零。", yearOfEvent: "HISTORY", quote: "不要试图用左脚踩右脚上天。", mood: "CRISIS" },
  { tag: "警示录", title: "虫洞危机", description: "2022年，Solana 跨链桥 Wormhole 遭攻击。", yearOfEvent: "HISTORY", quote: "跨链桥，是黑暗森林中最脆弱的吊桥。", mood: "CRISIS" },
  { tag: "警示录", title: "Bitfinex 惊魂", description: "2016年，Bitfinex 遭黑客攻击，损失 12 万枚 BTC。", yearOfEvent: "HISTORY", quote: "信誉是最后的储备金。", mood: "CRISIS" },
  { tag: "警示录", title: "The DAO", description: "2016年，基于以太坊的去中心化风投基金 The DAO 遭重入攻击。", yearOfEvent: "HISTORY", quote: "代码即法律？还是共识即法律？", mood: "CRISIS" },

  // --- 02. 硬核技术 (The Machinery) ---
  { tag: "技术底座", title: "UTXO 模型", description: "Unspent Transaction Output。比特币的记账方式。", yearOfEvent: "TECH", quote: "每一枚比特币，都是历史交易的余烬。" },
  { tag: "扩容方案", title: "ZK-SNARKs", description: "零知识简洁非交互式知识论证。隐私与扩容的圣杯。", yearOfEvent: "TECH", quote: "数学是唯一不需要信任的信任。" },
  { tag: "扩容方案", title: "Danksharding", description: "以太坊的终极分片方案。", yearOfEvent: "TECH", quote: "让大象起舞，让数据分流。" },
  { tag: "经济模型", title: "无常损失", description: "Impermanent Loss：向 AMM 提供流动性的风险。", yearOfEvent: "TECH", quote: "所谓无常，皆是由于价格的偏离。" },
  { tag: "基础设施", title: "内存池 (Mempool)", description: "交易被广播但尚未打包进区块的等待区。", yearOfEvent: "TECH", quote: "在上链之前，所有交易都在这里屏息以待。" },
  { tag: "密码学", title: "默克尔树", description: "Merkle Tree：一种哈希二叉树结构。", yearOfEvent: "TECH", quote: "一叶知秋，一树知链。" },
  { tag: "新范式", title: "模块化区块链", description: "Modular Blockchain：执行、结算、共识和数据可用性层拆分。", yearOfEvent: "TECH", quote: "像乐高积木一样重构信任。" },
  { tag: "共识机制", title: "权益证明 (PoS)", description: "Proof of Stake：通过质押代币来获得记账权。", yearOfEvent: "TECH", quote: "资本的共识。" },
  { tag: "技术底座", title: "智能合约", description: "Smart Contract：部署在区块链上的自动执行程序。", yearOfEvent: "TECH", quote: "Code is Law." },

  // --- 03. 先驱之声 (The Philosophers) ---
  { tag: "先驱之声", title: "中本聪的预言", description: "“如果那个该死的想吃就吃，想穿就穿的东西（法币）不曾出现，我们本不需要这些。”", yearOfEvent: "VOICE", quote: "传统货币的根本问题，在于信任。" },
  { tag: "先驱之声", title: "尼克·萨博", description: "Nick Szabo，智能合约之父。", yearOfEvent: "VOICE", quote: "Trusted third parties are security holes." },
  { tag: "先驱之声", title: "安德烈亚斯", description: "Andreas Antonopoulos。“投资教育，而不是投机。”", yearOfEvent: "VOICE", quote: "Your mind is the wallet no one can hack." },
  { tag: "先驱之声", title: "维塔利克", description: "Vitalik Buterin。“建立一个擅长做一件事的协议：作为底层的安全层。”", yearOfEvent: "VOICE", quote: "以太坊：世界计算机。" },
  { tag: "先驱之声", title: "哈尔·芬尼", description: "Hal Finney，比特币第一位接收者。", yearOfEvent: "VOICE", quote: "Running bitcoin." },
  { tag: "先驱之声", title: "CZ 的坚持", description: "“如果你因为 FUD 而恐慌抛售，你可能不适合这个行业。”", yearOfEvent: "VOICE", quote: "Ignore FUD." },

  // --- 04. 生态考古 (The Origins) ---
  { tag: "DeFi 创世", title: "Uniswap 诞生", description: "2018年，Hayden Adams 部署了 Uniswap V1。", yearOfEvent: "ORIGIN", quote: "独角兽，始于几行代码。" },
  { tag: "NFT 鼻祖", title: "CryptoPunks", description: "2017年，Larva Labs 免费发放了 10,000 个像素头像。", yearOfEvent: "ORIGIN", quote: "朋克精神，永不过时。" },
  { tag: "稳定币", title: "Tether (USDT)", description: "Realcoin 更名为 Tether。", yearOfEvent: "ORIGIN", quote: "流动性的血管。" },
  { tag: "预言机", title: "Chainlink", description: "Sergey Nazarov 提出了去中心化预言机网络。", yearOfEvent: "ORIGIN", quote: "真相，是连接现实的接口。" },
  { tag: "DeFi 基石", title: "MakerDAO", description: "DeFi 的中央银行。", yearOfEvent: "ORIGIN", quote: "无需许可的稳定性。" },
  { tag: "借贷协议", title: "Aave", description: "前身是 ETHLend。", yearOfEvent: "ORIGIN", quote: "让资金在区块间无缝流转。" },
  { tag: "NFT 市场", title: "OpenSea", description: "曾是 NFT 领域的绝对霸主。", yearOfEvent: "ORIGIN", quote: "数字海洋的领航员。" },

  // --- 05. 2026 前沿概念与文化 (The Frontier & Culture) ---
  { tag: "精神图腾", title: "数字 4", description: "源自 CZ 的推文。忽略 FUD，专注建设。", yearOfEvent: "CULTURE", quote: "4. Ignore FUD." },
  { tag: "社区神话", title: "币安天使", description: "他们不是员工，没有薪水，却比任何人都更爱护这个平台。", yearOfEvent: "CULTURE", quote: "因热爱而聚，为信仰而战。" },
  { tag: "Meme 文化", title: "Giggle Academy", description: "CZ 的个人教育项目。不发币、全免费。", yearOfEvent: "CULTURE", quote: "让教育平权。" },
  { tag: "行业俚语", title: "币安人生", description: "Binance Life：指一种全职投入加密货币、以交易所为家的生活状态。", yearOfEvent: "CULTURE" },
  { tag: "Meme 文化", title: "D.O.G.E.", description: "Department of Government Efficiency。马斯克领导的政府部门。", yearOfEvent: "CULTURE" },
  { tag: "机器经济", title: "Agentic Economy", description: "2026年，大量链上交易将由 AI 机器人产生。", yearOfEvent: "CONCEPT", quote: "硅基生命的 GDP。" },
  { tag: "金融融合", title: "RWA 爆发", description: "美债、房地产上链成为常态。", yearOfEvent: "CONCEPT" },
  { tag: "支付革命", title: "PayFi", description: "DeFi 的下一个演进形态。利用链上资金的时间价值。", yearOfEvent: "CONCEPT" },
  { tag: "去中心化科学", title: "DeSci", description: "用 DAO 来资助长寿研究、太空探索等前沿科学。", yearOfEvent: "CONCEPT", quote: "科学属于全人类。" },
  { tag: "政治概念", title: "加密选民", description: "指在选举中根据候选人对加密货币态度进行投票的群体。", yearOfEvent: "CONCEPT", quote: "选票即共识。" },
  { tag: "用户体验", title: "Chain Abstraction", description: "链抽象：用户不再知道自己在用哪条链。", yearOfEvent: "CONCEPT", quote: "忘掉链，只看路。" },
  { tag: "金融哲学", title: "原子结算", description: "Atomic Settlement：交易即清算。", yearOfEvent: "CONCEPT", quote: "时间就是金钱，字面意义上。" },

  // --- Legacy Basic Concepts ---
  { tag: "核心原理", title: "去中心化", description: "网络不由单一实体控制。", yearOfEvent: "CONCEPT" },
  { tag: "技术底层", title: "区块链", description: "一个只能追加、不可篡改的分布式账本。", yearOfEvent: "CONCEPT" },
  { tag: "共识机制", title: "工作量证明", description: "PoW：通过消耗算力解决数学难题来竞争记账权。", yearOfEvent: "CONCEPT" },
  { tag: "资产安全", title: "私钥", description: "一串随机生成的字符，代表了对钱包内资产的绝对控制权。", yearOfEvent: "CONCEPT", quote: "私钥在手，主权在我 (Not your keys, not your coins)。" },
  { tag: "投资策略", title: "DYOR", description: "Do Your Own Research：在投资前做好自己的研究。", yearOfEvent: "CONCEPT", quote: "不信言语，只验真伪。" },
  { tag: "市场心理", title: "FUD", description: "Fear, Uncertainty, Doubt：恐惧、不确定和怀疑。", yearOfEvent: "CONCEPT" },
  { tag: "未来趋势", title: "AI x Crypto", description: "当生产力 (AI) 遇到生产关系 (Crypto)。", yearOfEvent: "CONCEPT" },
  { tag: "DeFi", title: "AMM", description: "自动做市商：DEX 的核心机制。", yearOfEvent: "CONCEPT" },
  { tag: "Web3", title: "DAO", description: "去中心化自治组织：没有 CEO，规则写入代码。", yearOfEvent: "CONCEPT" },
  { tag: "经济模型", title: "减半", description: "比特币每四年产出减半的机制。", yearOfEvent: "CONCEPT" },
  { tag: "技术前沿", title: "账户抽象", description: "ERC-4337 标准。", yearOfEvent: "CONCEPT", quote: "让区块链技术隐于无形。" },
  { tag: "扩容方案", title: "Layer 2", description: "在主链之上构建的协议层。", yearOfEvent: "CONCEPT" },
  { tag: "数据层", title: "预言机", description: "Oracle：连接区块链与现实世界的桥梁。", yearOfEvent: "CONCEPT" },
  { tag: "隐私计算", title: "零知识证明", description: "Zero-Knowledge Proof。", yearOfEvent: "CONCEPT", quote: "于无声处，听惊雷。" }
];

// =============================================================================
// 3. 确定性混淆算法
// =============================================================================
export const getEventContent = (month: number, day: number): StaticEventContent => {
  const key = `${month}-${day}`;
  let content: StaticEventContent;

  // A. 优先匹配真实历史
  if (HISTORICAL_EVENTS[key]) {
    content = { ...HISTORICAL_EVENTS[key] };
  } else {
    // B. 知识库补全
    const dayOfYear = month * 31 + day;
    const seed = dayOfYear * 137;
    const index = seed % KNOWLEDGE_BASE.length;
    content = { ...KNOWLEDGE_BASE[index] };
  }

  // C. 确定性铭文注入 (Deterministic Quote Injection)
  if (!content.quote) {
    const dayOfYear = month * 31 + day;
    const quoteSeed = dayOfYear * 149;
    const quoteIndex = quoteSeed % PHILOSOPHICAL_QUOTES.length;
    content.quote = PHILOSOPHICAL_QUOTES[quoteIndex];
  }

  // D. 默认情绪注入 (Default Mood Injection)
  if (!content.mood) {
    content.mood = 'GLORY';
  }

  return content;
};
