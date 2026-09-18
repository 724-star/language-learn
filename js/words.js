/* ============================================================
 *  📚 单词词库 —— 修改/新增单词请编辑这个文件
 *  格式说明：
 *    id:       唯一编号
 *    en:       英文单词
 *    zh:       中文释义
 *    emoji:    对应表情符号（用作看图选词）
 *    syllable: 音节拆分（辅助拼写）
 *    mnemonic: 谐音记忆法口诀
 *    category: 分类（animals|food|colors|daily|body|nature|actions）
 * ============================================================ */

const WORD_BANK = [
  // ===== 第1关：动物 Animals =====
  { id: 1,  en: 'cat',      zh: '猫',       emoji: '🐱', syllable: 'cat',      mnemonic: '开特——猫开会，特别热闹', category: 'animals' },
  { id: 2,  en: 'dog',      zh: '狗',       emoji: '🐶', syllable: 'dog',      mnemonic: '到哥——狗到门口叫大哥', category: 'animals' },
  { id: 3,  en: 'fish',     zh: '鱼',       emoji: '🐟', syllable: 'fish',     mnemonic: '费事——吃鱼太费事（刺多）', category: 'animals' },
  { id: 4,  en: 'bird',     zh: '鸟',       emoji: '🐦', syllable: 'bird',     mnemonic: '伯的——伯的鸟唱得真好听', category: 'animals' },
  { id: 5,  en: 'rabbit',   zh: '兔子',     emoji: '🐰', syllable: 'rab-bit',  mnemonic: '瑞比特——兔子瑞比跑得比特快', category: 'animals' },
  { id: 6,  en: 'duck',     zh: '鸭子',     emoji: '🦆', syllable: 'duck',     mnemonic: '大可——鸭子大可不必那么吵', category: 'animals' },
  { id: 7,  en: 'pig',      zh: '猪',       emoji: '🐷', syllable: 'pig',      mnemonic: '皮哥——猪皮哥最爱睡觉', category: 'animals' },
  { id: 8,  en: 'frog',     zh: '青蛙',     emoji: '🐸', syllable: 'frog',     mnemonic: '服若哥——青蛙服若哥会捉虫', category: 'animals' },
  { id: 9,  en: 'bear',     zh: '熊',       emoji: '🐻', syllable: 'bear',     mnemonic: '贝尔——熊贝尔爱吃蜂蜜', category: 'animals' },
  { id:10,  en: 'mouse',    zh: '老鼠',     emoji: '🐭', syllable: 'mouse',    mnemonic: '貌斯——老鼠貌似斯文其实很贼', category: 'animals' },

  // ===== 第2关：食物 Food =====
  { id:11,  en: 'apple',    zh: '苹果',     emoji: '🍎', syllable: 'ap-ple',   mnemonic: '阿婆——阿婆每天吃一个苹果', category: 'food' },
  { id:12,  en: 'bread',    zh: '面包',     emoji: '🍞', syllable: 'bread',    mnemonic: '不瑞的——面包不瑞的（脆）才好吃', category: 'food' },
  { id:13,  en: 'milk',     zh: '牛奶',     emoji: '🥛', syllable: 'milk',     mnemonic: '谬可——谬（没）可牛奶不行', category: 'food' },
  { id:14,  en: 'egg',      zh: '鸡蛋',     emoji: '🥚', syllable: 'egg',      mnemonic: '艾格——艾格每天吃一个鸡蛋', category: 'food' },
  { id:15,  en: 'rice',     zh: '米饭',     emoji: '🍚', syllable: 'rice',     mnemonic: '瑞斯——瑞斯（rice）是亚洲人的主食', category: 'food' },
  { id:16,  en: 'water',    zh: '水',       emoji: '💧', syllable: 'wa-ter',   mnemonic: '窝特——窝特（water）要多喝', category: 'food' },
  { id:17,  en: 'cake',     zh: '蛋糕',     emoji: '🎂', syllable: 'cake',     mnemonic: '可可——可可蛋糕最好吃', category: 'food' },
  { id:18,  en: 'banana',   zh: '香蕉',     emoji: '🍌', syllable: 'ba-na-na', mnemonic: '不拿拿——不拿拿（banana）会烂掉', category: 'food' },
  { id:19,  en: 'orange',   zh: '橙子',     emoji: '🍊', syllable: 'or-ange',  mnemonic: '奥润之——奥润之（orange）很甜', category: 'food' },
  { id:20,  en: 'candy',    zh: '糖果',     emoji: '🍬', syllable: 'can-dy',   mnemonic: '看迪——看迪（candy）糖不能多吃', category: 'food' },

  // ===== 第3关：颜色 Colors =====
  { id:21,  en: 'red',      zh: '红色',     emoji: '🔴', syllable: 'red',      mnemonic: '瑞的——瑞的（red）玫瑰最好看', category: 'colors' },
  { id:22,  en: 'blue',     zh: '蓝色',     emoji: '🔵', syllable: 'blue',     mnemonic: '不路——不路（blue）天空很蓝', category: 'colors' },
  { id:23,  en: 'green',    zh: '绿色',     emoji: '🟢', syllable: 'green',    mnemonic: '格林——格林（green）草原像地毯', category: 'colors' },
  { id:24,  en: 'yellow',   zh: '黄色',     emoji: '🟡', syllable: 'yel-low',  mnemonic: '也漏——也漏（yellow）香蕉熟透了', category: 'colors' },
  { id:25,  en: 'white',    zh: '白色',     emoji: '⚪', syllable: 'white',    mnemonic: '外特——外特（white）雪白的外墙', category: 'colors' },
  { id:26,  en: 'black',    zh: '黑色',     emoji: '⚫', syllable: 'black',    mnemonic: '布莱克——布莱克（black）夜晚很黑', category: 'colors' },
  { id:27,  en: 'pink',     zh: '粉色',     emoji: '🩷', syllable: 'pink',     mnemonic: '拼可——拼可（pink）粉色的花裙', category: 'colors' },
  { id:28,  en: 'one',      zh: '一',       emoji: '1️⃣', syllable: 'one',     mnemonic: '万——万（one）里挑一', category: 'colors' },
  { id:29,  en: 'two',      zh: '二',       emoji: '2️⃣', syllable: 'two',     mnemonic: '兔——两兔（two）傍地走', category: 'colors' },
  { id:30,  en: 'three',    zh: '三',       emoji: '3️⃣', syllable: 'three',   mnemonic: '斯瑞——三（three）个斯瑞兄弟', category: 'colors' },

  // ===== 第4关：日常用品 Daily Items =====
  { id:31,  en: 'book',     zh: '书',       emoji: '📖', syllable: 'book',     mnemonic: '不可——不可（book）一日不读', category: 'daily' },
  { id:32,  en: 'pen',      zh: '钢笔',     emoji: '🖊️', syllable: 'pen',      mnemonic: '盆——钢笔掉进了盆（pen）里', category: 'daily' },
  { id:33,  en: 'cup',      zh: '杯子',     emoji: '☕', syllable: 'cup',      mnemonic: '卡普——卡普（cup）一杯咖啡', category: 'daily' },
  { id:34,  en: 'key',      zh: '钥匙',     emoji: '🔑', syllable: 'key',      mnemonic: '可一——钥匙只有这一把（可一）', category: 'daily' },
  { id:35,  en: 'door',     zh: '门',       emoji: '🚪', syllable: 'door',     mnemonic: '到——到了门口（door）请敲门', category: 'daily' },
  { id:36,  en: 'clock',    zh: '时钟',     emoji: '🕐', syllable: 'clock',    mnemonic: '可洛克——时钟（clock）滴答可洛克', category: 'daily' },
  { id:37,  en: 'bag',      zh: '包',       emoji: '👜', syllable: 'bag',      mnemonic: '百哥——百哥（bag）背个大包', category: 'daily' },
  { id:38,  en: 'hat',      zh: '帽子',     emoji: '🎩', syllable: 'hat',      mnemonic: '哈特——哈特（hat）戴帽子很帅气', category: 'daily' },
  { id:39,  en: 'shoe',     zh: '鞋子',     emoji: '👟', syllable: 'shoe',     mnemonic: '舒——鞋子（shoe）要舒（shoe）适', category: 'daily' },
  { id:40,  en: 'chair',    zh: '椅子',     emoji: '🪑', syllable: 'chair',    mnemonic: '拆儿——椅子（chair）拆儿（chair）坏了', category: 'daily' },

  // ===== 第5关：身体与人物 Body & People =====
  { id:41,  en: 'eye',      zh: '眼睛',     emoji: '👁️', syllable: 'eye',      mnemonic: '爱——眼睛（eye）是心灵之窗', category: 'body' },
  { id:42,  en: 'ear',      zh: '耳朵',     emoji: '👂', syllable: 'ear',      mnemonic: '一耳——耳朵（ear）就是一耳', category: 'body' },
  { id:43,  en: 'nose',     zh: '鼻子',     emoji: '👃', syllable: 'nose',     mnemonic: '挪子——鼻子（nose）挪子（鼻子）', category: 'body' },
  { id:44,  en: 'mouth',    zh: '嘴巴',     emoji: '👄', syllable: 'mouth',    mnemonic: '貌斯——嘴巴（mouth）貌似小巧', category: 'body' },
  { id:45,  en: 'hand',     zh: '手',       emoji: '✋', syllable: 'hand',     mnemonic: '汉的——手（hand）是汉子的手', category: 'body' },
  { id:46,  en: 'head',     zh: '头',       emoji: '👤', syllable: 'head',     mnemonic: '海的——头（head）像大海一样大', category: 'body' },
  { id:47,  en: 'baby',     zh: '宝宝',     emoji: '👶', syllable: 'ba-by',    mnemonic: '贝比——宝宝（baby）是宝贝', category: 'body' },
  { id:48,  en: 'friend',   zh: '朋友',     emoji: '🤝', syllable: 'friend',   mnemonic: '福润的——朋友（friend）带来福气', category: 'body' },
  { id:49,  en: 'mother',   zh: '妈妈',     emoji: '👩', syllable: 'moth-er',  mnemonic: '妈惹——妈妈（mother）最伟大', category: 'body' },
  { id:50,  en: 'father',   zh: '爸爸',     emoji: '👨', syllable: 'fa-ther',  mnemonic: '发惹——爸爸（father）发工资了', category: 'body' },

  // ===== 第6关：自然 Nature =====
  { id:51,  en: 'sun',      zh: '太阳',     emoji: '☀️', syllable: 'sun',      mnemonic: '桑——太阳（sun）像桑拿一样热', category: 'nature' },
  { id:52,  en: 'moon',     zh: '月亮',     emoji: '🌙', syllable: 'moon',     mnemonic: '穆恩——月亮（moon）穆恩（月光）', category: 'nature' },
  { id:53,  en: 'star',     zh: '星星',     emoji: '⭐', syllable: 'star',     mnemonic: '斯大——星星（star）太大了', category: 'nature' },
  { id:54,  en: 'tree',     zh: '树',       emoji: '🌳', syllable: 'tree',     mnemonic: '翠——树（tree）很翠绿', category: 'nature' },
  { id:55,  en: 'flower',   zh: '花',       emoji: '🌸', syllable: 'flow-er',  mnemonic: '弗劳尔——花（flower）弗劳尔（花）', category: 'nature' },
  { id:56,  en: 'rain',     zh: '雨',       emoji: '🌧️', syllable: 'rain',     mnemonic: '瑞恩——雨（rain）瑞恩（rain）', category: 'nature' },
  { id:57,  en: 'snow',     zh: '雪',       emoji: '❄️', syllable: 'snow',     mnemonic: '斯诺——雪（snow）像斯诺克一样白', category: 'nature' },
  { id:58,  en: 'wind',     zh: '风',       emoji: '💨', syllable: 'wind',     mnemonic: '温的——风（wind）温的风', category: 'nature' },
  { id:59,  en: 'river',    zh: '河流',     emoji: '🏞️', syllable: 'riv-er',   mnemonic: '瑞沃——河流（river）瑞沃（河流）', category: 'nature' },
  { id:60,  en: 'mountain', zh: '山',       emoji: '⛰️', syllable: 'moun-tain', mnemonic: '忙挺——山（mountain）忙挺（高）', category: 'nature' },

  // ===== 第7关：动作 Actions =====
  { id:61,  en: 'run',      zh: '跑',       emoji: '🏃', syllable: 'run',      mnemonic: '软——跑（run）完腿软', category: 'actions' },
  { id:62,  en: 'jump',     zh: '跳',       emoji: '🤸', syllable: 'jump',     mnemonic: '站普——跳（jump）站普（跳跃）', category: 'actions' },
  { id:63,  en: 'eat',      zh: '吃',       emoji: '🍽️', syllable: 'eat',      mnemonic: '一特——吃（eat）一特（eat）', category: 'actions' },
  { id:64,  en: 'drink',    zh: '喝',       emoji: '🥤', syllable: 'drink',    mnemonic: '准可——喝（drink）准可（喝）', category: 'actions' },
  { id:65,  en: 'sleep',    zh: '睡觉',     emoji: '😴', syllable: 'sleep',    mnemonic: '思立普——睡觉（sleep）思立普', category: 'actions' },
  { id:66,  en: 'read',     zh: '阅读',     emoji: '📚', syllable: 'read',     mnemonic: '瑞的——阅读（read）瑞的（读书）', category: 'actions' },
  { id:67,  en: 'sing',     zh: '唱歌',     emoji: '🎤', syllable: 'sing',     mnemonic: '星——唱歌（sing）像星星一样闪亮', category: 'actions' },
  { id:68,  en: 'dance',    zh: '跳舞',     emoji: '💃', syllable: 'dance',    mnemonic: '当时——跳舞（dance）当时（跳舞）', category: 'actions' },
  { id:69,  en: 'swim',     zh: '游泳',     emoji: '🏊', syllable: 'swim',     mnemonic: '思维姆——游泳（swim）思维姆', category: 'actions' },
  { id:70,  en: 'fly',      zh: '飞',       emoji: '✈️', syllable: 'fly',      mnemonic: '福莱——飞（fly）福莱（飞翔）', category: 'actions' },
];

/* ============================================================
 *  关卡配置 —— 每关包含哪些单词
 *  修改难度：可以增减每关的单词数量、替换单词
 *  新增关卡：在下面 LEVELS 数组里新增一项
 * ============================================================ */

const LEVELS = [
  { id: 1,  name: '可爱动物 🐾',   desc: '认识可爱的小动物们',      wordIds: [1,2,3,4,5,6,7,8,9,10] },
  { id: 2,  name: '美味食物 🍎',   desc: '学会各种好吃的名字',      wordIds: [11,12,13,14,15,16,17,18,19,20] },
  { id: 3,  name: '缤纷颜色 🌈',   desc: '认识颜色和数数',          wordIds: [21,22,23,24,25,26,27,28,29,30] },
  { id: 4,  name: '生活用品 🏠',   desc: '日常用品都会说',          wordIds: [31,32,33,34,35,36,37,38,39,40] },
  { id: 5,  name: '身体人物 👨‍👩‍👧', desc: '认识自己和家人',          wordIds: [41,42,43,44,45,46,47,48,49,50] },
  { id: 6,  name: '奇妙自然 🌿',   desc: '探索大自然的万物',        wordIds: [51,52,53,54,55,56,57,58,59,60] },
  { id: 7,  name: '动起来吧 🏃',   desc: '学会各种动作的英文',      wordIds: [61,62,63,64,65,66,67,68,69,70] },
];

/* ============================================================
 *  短句库（用于跟读填空题型）
 *  每个短句：sentence 带 {blank} 占位符，answer 是填空答案
 * ============================================================ */

const SENTENCE_BANK = [
  { sentence: 'I have a {blank}.',        answer: 'cat',    hint: '🐱',  zh: '我有一只___。' },
  { sentence: 'I like to {blank}.',       answer: 'eat',    hint: '🍽️', zh: '我喜欢___。' },
  { sentence: 'The {blank} is red.',      answer: 'apple',  hint: '🍎',  zh: '___是红色的。' },
  { sentence: 'I can {blank}.',           answer: 'run',    hint: '🏃',  zh: '我会___。' },
  { sentence: 'She has a {blank}.',       answer: 'book',   hint: '📖',  zh: '她有一本___。' },
  { sentence: 'The {blank} is blue.',     answer: 'sky',    hint: '🔵',  zh: '___是蓝色的。' },
  { sentence: 'I drink {blank}.',         answer: 'milk',   hint: '🥛',  zh: '我喝___。' },
  { sentence: 'He can {blank} fast.',     answer: 'swim',   hint: '🏊',  zh: '他能___得很快。' },
  { sentence: 'The {blank} is big.',      answer: 'dog',    hint: '🐶',  zh: '___很大。' },
  { sentence: 'I see a {blank}.',         answer: 'bird',   hint: '🐦',  zh: '我看到一只___。' },
  { sentence: 'She likes to {blank}.',    answer: 'sing',   hint: '🎤',  zh: '她喜欢___。' },
  { sentence: 'This is my {blank}.',      answer: 'pen',    hint: '🖊️',  zh: '这是我的___。' },
  { sentence: 'The {blank} is yellow.',   answer: 'banana', hint: '🍌',  zh: '___是黄色的。' },
  { sentence: 'I have two {blank}.',      answer: 'hands',  hint: '✋',  zh: '我有两只___。' },
  { sentence: 'The {blank} shines.',      answer: 'sun',    hint: '☀️',  zh: '___在照耀。' },
];

/* ============================================================
 *  工具函数：根据关卡ID获取该关卡的单词列表
 * ============================================================ */

function getLevelWords(levelId) {
  const level = LEVELS.find(l => l.id === levelId);
  if (!level) return [];
  return level.wordIds.map(id => WORD_BANK.find(w => w.id === id)).filter(Boolean);
}

/* ============================================================
 *  工具函数：从词库中随机抽取 N 个不同的干扰项
 * ============================================================ */

function getDistractors(correctWord, count = 3) {
  const others = WORD_BANK.filter(w => w.id !== correctWord.id);
  const shuffled = others.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
