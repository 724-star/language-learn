/* ============================================================
 *  🎮 主逻辑文件 —— 学习引擎、闯关、树苗、贴纸
 *  所有数据自动保存在浏览器 localStorage 中
 * ============================================================ */

// ============================================================
//  1. 状态管理（自动存 localStorage）
// ============================================================

const STORAGE_KEY = 'langlearn_data';

function getDefaultState() {
  return {
    currentLevel: 1,           // 当前解锁到的最大关卡
    completedLevels: [],       // 已完成关卡ID数组
    waterDrops: 0,             // 水滴数量
    treeStage: 0,              // 树苗阶段 0-4（幼苗→小树→大树→开花→结果）
    stickers: [],              // 已获得贴纸ID数组
    dailyGoal: '5min',         // 每日目标：'5min' 或 '10min'
    dailyProgress: 0,          // 每日已学分钟数
    dailyDate: '',             // 记录日期（用于判断是否新的一天）
    learnedWords: [],          // 已掌握单词ID（间隔重复用）
    reviewingWords: [],        // 待复习单词ID（答错过）
    wordHistory: {},           // 每个单词的学习历史：{ id: { correct: N, wrong: N, lastSeen: timestamp } }
  };
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      // 合并默认值（防止新增字段缺失）
      const def = getDefaultState();
      for (const key in def) {
        if (!(key in data)) data[key] = def[key];
      }
      return data;
    }
  } catch (e) { console.warn('加载存档失败', e); }
  return getDefaultState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { console.warn('保存存档失败', e); }
}

let state = loadState();

// ============================================================
//  2. 页面导航
// ============================================================

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  // 更新底部导航高亮
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const navBtn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
  if (navBtn) navBtn.classList.add('active');
  // 渲染对应页面
  if (pageId === 'page-home') renderHome();
  if (pageId === 'page-levels') renderLevels();
  if (pageId === 'page-stickers') renderStickers();
}

// ============================================================
//  3. 渲染主页（成长树 + 每日目标）
// ============================================================

const TREE_STAGES = [
  { emoji: '🌱', name: '小种子',     nextWater: 10 },
  { emoji: '🌿', name: '小嫩芽',     nextWater: 25 },
  { emoji: '🌳', name: '小树苗',     nextWater: 50 },
  { emoji: '🌸', name: '开花啦',     nextWater: 80 },
  { emoji: '🍎', name: '结果实',     nextWater: Infinity },
];

function renderHome() {
  // 树苗
  const stage = state.treeStage;
  const treeInfo = TREE_STAGES[Math.min(stage, TREE_STAGES.length - 1)];
  const nextWater = treeInfo.nextWater;
  const progress = Math.min(100, (state.waterDrops / nextWater) * 100);

  document.getElementById('treeEmoji').textContent = treeInfo.emoji;
  document.getElementById('treeName').textContent = treeInfo.name;
  document.getElementById('treeProgressFill').style.width = progress + '%';
  document.getElementById('waterCount').textContent = state.waterDrops;

  // 检查是否升级树苗
  checkTreeUpgrade();

  // 每日目标
  checkDailyReset();
  const dailyGoalMinutes = state.dailyGoal === '5min' ? 5 : 10;
  const dailyProgress = Math.min(100, (state.dailyProgress / dailyGoalMinutes) * 100);
  document.getElementById('dailyGoalFill').style.width = dailyProgress + '%';
  document.getElementById('dailyGoalValue').textContent = `${state.dailyProgress}/${dailyGoalMinutes} 分钟`;

  // 更新统计数字
  document.getElementById('completedLevels').textContent = state.completedLevels.length;

  // 渲染关卡快速入口（最近3关）
  renderRecentLevels();
}

function checkTreeUpgrade() {
  while (state.treeStage < TREE_STAGES.length - 1) {
    const needed = TREE_STAGES[state.treeStage].nextWater;
    if (state.waterDrops >= needed) {
      state.treeStage++;
      saveState();
      // 升级动画
      showTreeUpgrade(state.treeStage);
    } else break;
  }
}

function showTreeUpgrade(stage) {
  const treeInfo = TREE_STAGES[stage];
  showCelebration(`🎉 树苗升级啦！现在是「${treeInfo.name}」${treeInfo.emoji}`, 2500);
}

function checkDailyReset() {
  const today = new Date().toDateString();
  if (state.dailyDate !== today) {
    state.dailyProgress = 0;
    state.dailyDate = today;
    saveState();
  }
}

function renderRecentLevels() {
  // 主页展示最近3个关卡快捷入口
  const container = document.getElementById('recentLevels');
  const available = LEVELS.filter(l => l.id <= state.currentLevel).slice(-3);
  container.innerHTML = available.map(l => {
    const isCompleted = state.completedLevels.includes(l.id);
    return `
      <div class="level-card ${isCompleted ? 'completed' : 'current'}" onclick="startLevel(${l.id})" style="flex:1;min-width:0">
        <div class="level-num">第${l.id}关</div>
        <div class="level-name">${l.name}</div>
        <div class="level-status">${isCompleted ? '✅' : '▶️'}</div>
      </div>
    `;
  }).join('');
}

// ============================================================
//  4. 渲染关卡选择页
// ============================================================

function renderLevels() {
  const grid = document.getElementById('levelGrid');
  const totalWords = WORD_BANK.length;
  const learnedCount = state.learnedWords.length;
  document.getElementById('totalWords').textContent = totalWords;
  document.getElementById('learnedWords').textContent = learnedCount;

  grid.innerHTML = LEVELS.map(l => {
    const isUnlocked = l.id <= state.currentLevel;
    const isCompleted = state.completedLevels.includes(l.id);
    const isCurrent = l.id === state.currentLevel && !isCompleted;

    return `
      <div class="level-card
        ${!isUnlocked ? 'locked' : ''}
        ${isCompleted ? 'completed' : ''}
        ${isCurrent ? 'current' : ''}
        ${isUnlocked ? '' : ''}
        onclick="${isUnlocked ? `startLevel(${l.id})` : ''}"
      >
        ${!isUnlocked ? '<div class="level-lock-icon">🔒</div>' : ''}
        <div class="level-num">${l.id}</div>
        <div class="level-name">${l.name}</div>
        <div class="level-desc">${l.desc}</div>
        <div class="level-status">
          ${isCompleted ? '✅ 已完成' : isUnlocked ? '▶️ 开始' : '🔒 未解锁'}
        </div>
      </div>
    `;
  }).join('');
}

// ============================================================
//  5. 闯关引擎
// ============================================================

let currentQuiz = {
  levelId: null,
  questions: [],
  currentIndex: 0,
  correctCount: 0,
  wrongCount: 0,
  waterEarned: 0,
  isComplete: false,
};

// 题型列表（5种）
const QUESTION_TYPES = ['image_choice', 'listen_choice', 'spell_fill', 'match_drag', 'sentence_fill'];

function startLevel(levelId) {
  const words = getLevelWords(levelId);
  if (!words || words.length === 0) return;

  // 生成10道题
  const questions = generateQuestions(words, levelId);

  currentQuiz = {
    levelId,
    questions,
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    waterEarned: 0,
    isComplete: false,
  };

  showPage('page-quiz');
  renderQuestion();
}

function generateQuestions(words, levelId) {
  const questions = [];
  const types = [...QUESTION_TYPES];

  // 从关卡单词中取10个，不足则复用
  let pool = [...words];
  while (pool.length < 10) {
    pool = pool.concat(words);
  }

  // 打乱
  pool = pool.sort(() => Math.random() - 0.5).slice(0, 10);

  // 为每个单词分配题型
  pool.forEach((word, i) => {
    const type = types[i % types.length];
    questions.push({ word, type, levelId });
  });

  // 穿插复习答错的单词
  const reviewWords = state.reviewingWords
    .map(id => WORD_BANK.find(w => w.id === id))
    .filter(Boolean)
    .filter(w => words.some(lw => lw.id === w.id)); // 只复习本关单词

  if (reviewWords.length > 0) {
    // 替换最后2题为复习题
    for (let i = 0; i < Math.min(2, reviewWords.length); i++) {
      const idx = questions.length - 1 - i;
      if (idx >= 0) {
        questions[idx] = { word: reviewWords[i], type: types[(i + 3) % types.length], levelId, isReview: true };
      }
    }
  }

  return questions.sort(() => Math.random() - 0.5); // 最终打乱顺序
}

// ============================================================
//  6. 渲染题目
// ============================================================

function renderQuestion() {
  if (currentQuiz.currentIndex >= currentQuiz.questions.length) {
    finishLevel();
    return;
  }

  const q = currentQuiz.questions[currentQuiz.currentIndex];
  const word = q.word;
  const total = currentQuiz.questions.length;
  const idx = currentQuiz.currentIndex;

  // 进度
  document.getElementById('quizProgress').textContent = `${idx + 1} / ${total}`;
  const dots = document.getElementById('quizDots');
  dots.innerHTML = Array.from({ length: total }, (_, i) => {
    let cls = 'quiz-dot';
    if (i === idx) cls += ' active';
    else if (i < idx) cls += ' correct'; // 暂时都用correct标记
    return `<div class="${cls}"></div>`;
  }).join('');

  const typeNames = {
    image_choice: '🖼️ 看图选词',
    listen_choice: '🔊 听音选义',
    spell_fill: '✍️ 拼写填空',
    match_drag: '🤝 词义配对',
    sentence_fill: '📝 句子填空',
  };

  document.getElementById('questionType').textContent = typeNames[q.type] || '答题';
  document.getElementById('questionCard').innerHTML = ''; // 清空

  // 根据题型渲染
  switch (q.type) {
    case 'image_choice': renderImageChoice(q); break;
    case 'listen_choice': renderListenChoice(q); break;
    case 'spell_fill': renderSpellFill(q); break;
    case 'match_drag': renderMatchDrag(q); break;
    case 'sentence_fill': renderSentenceFill(q); break;
  }

  // 确保卡片可见
  document.getElementById('nextBtn').classList.remove('show');
  document.getElementById('explainArea').innerHTML = '';
}

/* ---------- 题型1：看图选词 ---------- */
function renderImageChoice(q) {
  const word = q.word;
  const distractors = getDistractors(word, 3);
  const options = [word, ...distractors].sort(() => Math.random() - 0.5);

  const card = document.getElementById('questionCard');
  card.innerHTML = `
    <div class="word-emoji-display">${word.emoji}</div>
    <div class="quiz-question">选出对应的英文单词</div>
    <div class="options-grid" id="optionsGrid">
      ${options.map((opt, i) => `
        <button class="option-btn" data-id="${opt.id}" onclick="selectOption(this, ${opt.id}, ${word.id})">
          ${opt.en}
        </button>
      `).join('')}
    </div>
    <div style="text-align:center;margin-top:12px">
      <button class="hint-btn" onclick="showHint(${word.id})">💡 提示</button>
    </div>
    <div class="hint-panel" id="hintPanel">
      <div class="hint-emoji">${word.emoji}</div>
      <div class="hint-mnemonic">${word.mnemonic}</div>
      <div class="hint-syllable">📖 音节：${word.syllable}</div>
    </div>
  `;
}

/* ---------- 题型2：听音选义 ---------- */
function renderListenChoice(q) {
  const word = q.word;
  const distractors = getDistractors(word, 3);
  // 取中文释义作为选项
  const allMeanings = [word, ...distractors].sort(() => Math.random() - 0.5);

  const card = document.getElementById('questionCard');
  card.innerHTML = `
    <div style="text-align:center;margin-bottom:16px">
      <button class="option-btn" style="display:inline-flex;padding:16px 32px;font-size:24px;border-radius:50px" onclick="playWordAudio('${word.en}')">
        🔊 点击听发音
      </button>
    </div>
    <div class="quiz-question">听发音，选出正确的中文意思</div>
    <div class="options-grid" id="optionsGrid">
      ${allMeanings.map((opt, i) => `
        <button class="option-btn" data-id="${opt.id}" onclick="selectOption(this, ${opt.id}, ${word.id})">
          ${opt.zh}
        </button>
      `).join('')}
    </div>
    <div style="text-align:center;margin-top:12px">
      <button class="hint-btn" onclick="showHint(${word.id})">💡 提示</button>
    </div>
    <div class="hint-panel" id="hintPanel">
      <div class="hint-emoji">${word.emoji}</div>
      <div class="hint-mnemonic">${word.mnemonic}</div>
      <div class="hint-syllable">📖 音节：${word.syllable}</div>
    </div>
  `;

  // 自动播放发音
  setTimeout(() => playWordAudio(word.en), 500);
}

/* ---------- 题型3：拼写填空 ---------- */
function renderSpellFill(q) {
  const word = q.word;
  const en = word.en;
  // 显示中文 + 表情，给出部分字母
  const letters = en.split('');
  // 随机保留 40-60% 的字母作为提示
  const revealCount = Math.max(1, Math.floor(letters.length * 0.5));
  const positions = new Set();
  while (positions.size < revealCount) {
    positions.add(Math.floor(Math.random() * letters.length));
  }

  const card = document.getElementById('questionCard');
  card.innerHTML = `
    <div style="text-align:center">
      <span style="font-size:48px">${word.emoji}</span>
      <span style="font-size:28px;font-weight:700;margin-left:8px">${word.zh}</span>
    </div>
    <div class="quiz-question">拼出这个单词</div>
    <div class="spell-input-group" id="spellGroup">
      ${letters.map((l, i) => `
        <input type="text" class="spell-letter-box"
          maxlength="1"
          data-index="${i}"
          value="${positions.has(i) ? l : ''}"
          ${positions.has(i) ? 'readonly' : ''}
          oninput="onSpellInput(this, ${i}, ${letters.length})"
          onkeydown="onSpellKeydown(this, event)"
          style="${positions.has(i) ? 'background:#e8f5e0;border-color:#b5e48c;color:#2b2d42;font-weight:700' : ''}"
        >
      `).join('')}
    </div>
    <div style="text-align:center;color:var(--text-light);font-size:12px;margin-top:8px">
      共 ${letters.length} 个字母 · 灰色格子需要你填写
    </div>
    <div style="text-align:center;margin-top:8px">
      <button class="hint-btn" onclick="showHint(${word.id})">💡 提示</button>
    </div>
    <div class="hint-panel" id="hintPanel">
      <div class="hint-emoji">${word.emoji}</div>
      <div class="hint-mnemonic">${word.mnemonic}</div>
      <div class="hint-syllable">📖 音节：${word.syllable}</div>
    </div>
    <button class="next-btn" id="spellSubmitBtn" onclick="submitSpell(${word.id}, '${en}')">✅ 提交答案</button>
  `;

  // 自动聚焦第一个空格
  const firstEmpty = document.querySelector('.spell-letter-box:not([readonly])');
  if (firstEmpty) firstEmpty.focus();
}

/* ---------- 题型4：词义配对（点击式，不改拖拽） ---------- */
function renderMatchDrag(q) {
  const word = q.word;
  const distractors = getDistractors(word, 2);
  const pairs = [word, ...distractors].sort(() => Math.random() - 0.5);

  const card = document.getElementById('questionCard');
  card.innerHTML = `
    <div class="quiz-question">点击配对：把英文和中文连起来</div>
    <div class="match-area" id="matchArea">
      ${pairs.map((w, i) => `
        <div class="match-row">
          <div class="match-word" data-word-id="${w.id}" onclick="selectMatch('word', ${w.id})">${w.en}</div>
          <div class="match-connector">⬇</div>
          <div class="match-meaning" data-meaning-id="${w.id}" onclick="selectMatch('meaning', ${w.id})">${w.zh}</div>
        </div>
      `).join('')}
    </div>
    <div style="text-align:center;margin-top:8px">
      <span style="font-size:13px;color:var(--text-light)" id="matchStatus">先点一个英文，再点对应中文</span>
    </div>
    <div style="text-align:center;margin-top:8px">
      <button class="hint-btn" onclick="showHint(${word.id})">💡 提示</button>
    </div>
    <div class="hint-panel" id="hintPanel">
      <div class="hint-emoji">${word.emoji}</div>
      <div class="hint-mnemonic">${word.mnemonic}</div>
    </div>
  `;

  window._matchState = { selected: null, type: null, matched: new Set() };
}

/* ---------- 题型5：句子填空 ---------- */
function renderSentenceFill(q) {
  const word = q.word;
  // 找一个包含该单词的句子，没有就生成一个简单句
  let sentenceData = SENTENCE_BANK.find(s => s.answer === word.en);
  if (!sentenceData) {
    // 生成通用句子
    sentenceData = {
      sentence: `This is a {blank}.`,
      answer: word.en,
      hint: word.emoji,
      zh: `这是一个___。`
    };
  }

  const displaySentence = sentenceData.sentence.replace('{blank}', '______');
  const letters = word.en.split('');
  const revealCount = Math.max(1, Math.floor(letters.length * 0.4));
  const positions = new Set();
  while (positions.size < revealCount) {
    positions.add(Math.floor(Math.random() * letters.length));
  }

  const card = document.getElementById('questionCard');
  card.innerHTML = `
    <div style="text-align:center;font-size:16px;color:var(--text-light);margin-bottom:4px">${sentenceData.zh}</div>
    <div class="quiz-question" style="font-size:18px">
      ${displaySentence}<br>
      <span style="font-size:13px;color:var(--text-light)">${sentenceData.hint} 填入空白处的单词</span>
    </div>
    <div class="spell-input-group" id="spellGroup">
      ${letters.map((l, i) => `
        <input type="text" class="spell-letter-box"
          maxlength="1"
          data-index="${i}"
          value="${positions.has(i) ? l : ''}"
          ${positions.has(i) ? 'readonly' : ''}
          oninput="onSpellInput(this, ${i}, ${letters.length})"
          onkeydown="onSpellKeydown(this, event)"
          style="${positions.has(i) ? 'background:#e8f5e0;border-color:#b5e48c' : ''}"
        >
      `).join('')}
    </div>
    <div style="text-align:center;color:var(--text-light);font-size:12px;margin-top:4px">
      👆 填入 ${letters.length} 个字母
    </div>
    <button class="next-btn" id="spellSubmitBtn" onclick="submitSpell(${word.id}, '${word.en}')">✅ 提交答案</button>
  `;

  const firstEmpty = document.querySelector('.spell-letter-box:not([readonly])');
  if (firstEmpty) firstEmpty.focus();
}

// ============================================================
//  7. 答题交互逻辑
// ============================================================

/* 选择选项（看图选词 + 听音选义） */
function selectOption(btn, selectedId, correctId) {
  // 防止重复点击
  if (btn.classList.contains('disabled')) return;
  document.querySelectorAll('.option-btn').forEach(b => b.classList.add('disabled'));

  const isCorrect = selectedId === correctId;
  btn.classList.add(isCorrect ? 'correct' : 'wrong');

  // 同时高亮正确答案
  document.querySelectorAll('.option-btn').forEach(b => {
    if (parseInt(b.dataset.id) === correctId) b.classList.add('correct');
  });

  handleAnswer(isCorrect, correctId);
}

/* 拼写输入处理 */
function onSpellInput(input, index, total) {
  const val = input.value.toLowerCase().replace(/[^a-zA-Z]/g, '');
  input.value = val;
  if (val) {
    input.classList.add('filled');
    // 自动跳到下一个空格
    const next = document.querySelector(`.spell-letter-box[data-index="${index + 1}"]`);
    if (next && !next.readOnly) next.focus();
  } else {
    input.classList.remove('filled');
  }
}

function onSpellKeydown(input, event) {
  if (event.key === 'Backspace' && !input.value) {
    // 跳到上一个
    const prev = document.querySelector(`.spell-letter-box[data-index="${parseInt(input.dataset.index) - 1}"]`);
    if (prev) { prev.focus(); prev.value = ''; prev.classList.remove('filled'); }
  }
  if (event.key === 'Enter') {
    // 触发展开按钮
    const submitBtn = document.getElementById('spellSubmitBtn');
    if (submitBtn && submitBtn.style.display !== 'none') submitBtn.click();
  }
}

function submitSpell(wordId, correctEn) {
  const inputs = document.querySelectorAll('.spell-letter-box');
  let typed = '';
  inputs.forEach(inp => { typed += inp.value.toLowerCase(); });

  const isCorrect = typed === correctEn.toLowerCase();

  // 显示结果
  inputs.forEach((inp, i) => {
    if (correctEn[i] && inp.value.toLowerCase() === correctEn[i].toLowerCase()) {
      inp.classList.add('revealed');
    } else {
      inp.value = correctEn[i] || '';
      inp.classList.add('revealed');
    }
    inp.readOnly = true;
  });

  document.getElementById('spellSubmitBtn').style.display = 'none';
  handleAnswer(isCorrect, wordId);
}

/* 配对选择（点击式） */
function selectMatch(type, id) {
  const ms = window._matchState;
  if (!ms) return;

  // 如果已配对过，忽略
  if (ms.matched.has(id)) return;

  if (ms.selected === null) {
    // 第一次选择
    ms.selected = id;
    ms.type = type;
    // 高亮
    document.querySelectorAll('.match-word, .match-meaning').forEach(el => el.classList.remove('selected'));
    const els = type === 'word'
      ? document.querySelectorAll(`.match-word[data-word-id="${id}"]`)
      : document.querySelectorAll(`.match-meaning[data-meaning-id="${id}"]`);
    els.forEach(el => el.classList.add('selected'));
    document.getElementById('matchStatus').textContent = `已选「${type === 'word' ? '英文' : '中文'}」，请选另一项配对`;
  } else {
    // 第二次选择
    if (type === ms.type) {
      // 同类型，切换选择
      ms.selected = id;
      ms.type = type;
      document.querySelectorAll('.match-word, .match-meaning').forEach(el => el.classList.remove('selected'));
      const els = type === 'word'
        ? document.querySelectorAll(`.match-word[data-word-id="${id}"]`)
        : document.querySelectorAll(`.match-meaning[data-meaning-id="${id}"]`);
      els.forEach(el => el.classList.add('selected'));
      return;
    }

    // 配对
    const wordId = type === 'word' ? id : ms.selected;
    const meaningId = type === 'meaning' ? id : ms.selected;

    const isCorrect = wordId === meaningId;

    if (isCorrect) {
      // 配对成功
      document.querySelectorAll(`.match-word[data-word-id="${wordId}"]`).forEach(el => {
        el.classList.remove('selected');
        el.classList.add('matched');
      });
      document.querySelectorAll(`.match-meaning[data-meaning-id="${meaningId}"]`).forEach(el => {
        el.classList.remove('selected');
        el.classList.add('matched');
      });
      ms.matched.add(wordId);
      document.getElementById('matchStatus').textContent = '✅ 配对成功！继续配对吧';

      // 如果全部配对完成
      const totalPairs = document.querySelectorAll('.match-row').length;
      if (ms.matched.size >= totalPairs) {
        document.getElementById('matchStatus').textContent = '🎉 全部配对完成！';
        handleAnswer(true, wordId);
      }

      // 小庆祝音效视觉
      showMiniCelebration();
    } else {
      // 配对错误
      document.getElementById('matchStatus').textContent = '🤔 不太对，再试试其他组合';
      document.querySelectorAll('.match-word, .match-meaning').forEach(el => el.classList.remove('selected'));
      // 抖动提示
      const wrongEls = document.querySelectorAll(`.match-word[data-word-id="${wordId}"], .match-meaning[data-meaning-id="${meaningId}"]`);
      wrongEls.forEach(el => {
        el.style.animation = 'shake 0.4s ease';
        setTimeout(() => { el.style.animation = ''; }, 400);
      });
    }

    ms.selected = null;
    ms.type = null;
  }
}

// ============================================================
//  8. 答案处理 + 记忆算法
// ============================================================

function handleAnswer(isCorrect, wordId) {
  const word = WORD_BANK.find(w => w.id === wordId);
  if (!word) return;

  // 记录学习历史
  if (!state.wordHistory[wordId]) {
    state.wordHistory[wordId] = { correct: 0, wrong: 0, lastSeen: Date.now() };
  }
  const hist = state.wordHistory[wordId];
  hist.lastSeen = Date.now();

  const q = currentQuiz.questions[currentQuiz.currentIndex];

  if (isCorrect) {
    hist.correct++;
    currentQuiz.correctCount++;
    currentQuiz.waterEarned += 1; // 每答对一题得1滴水

    // 如果之前是复习单词，从复习列表移除
    state.reviewingWords = state.reviewingWords.filter(id => id !== wordId);
    // 加入已学列表
    if (!state.learnedWords.includes(wordId)) {
      state.learnedWords.push(wordId);
    }

    // 显示庆祝反馈
    showCorrectFeedback(word);

    // 显示温和提示+继续按钮
    setTimeout(() => {
      document.getElementById('explainArea').innerHTML = `
        <div class="explain-card">
          <div style="text-align:center;font-size:24px">✅ 答对啦！</div>
          <div style="text-align:center;font-size:36px;margin:8px 0">${word.emoji}</div>
          <div class="explain-word">${word.en}</div>
          <div class="explain-zh">${word.zh}</div>
          <div class="explain-mnemonic">💡 ${word.mnemonic}</div>
        </div>
      `;
      document.getElementById('nextBtn').classList.add('show');
    }, 600);
  } else {
    hist.wrong++;
    currentQuiz.wrongCount++;

    // 加入复习列表（间隔重复）
    if (!state.reviewingWords.includes(wordId)) {
      state.reviewingWords.push(wordId);
    } else {
      // 如果已经在列表里，再推一次增加频率
      state.reviewingWords.push(wordId);
    }

    // 从已学列表移除（需要重新掌握）
    state.learnedWords = state.learnedWords.filter(id => id !== wordId);

    // 温和讲解（无惩罚感）
    setTimeout(() => {
      showGentleExplain(word);
      document.getElementById('nextBtn').classList.add('show');
    }, 400);
  }

  // 更新水滴（答对加1滴）
  if (isCorrect) state.waterDrops += 1;

  // 更新每日进度
  state.dailyProgress = Math.min(
    state.dailyGoal === '5min' ? 5 : 10,
    state.dailyProgress + 0.5 // 每题约30秒
  );

  // 检查每日目标是否完成
  const goalMin = state.dailyGoal === '5min' ? 5 : 10;
  if (state.dailyProgress >= goalMin && !state._dailyGoalCompleted) {
    state._dailyGoalCompleted = true;
    setTimeout(() => showGoalCelebration(), 500);
  }

  saveState();
}

function showCorrectFeedback(word) {
  // 随机小动物庆祝
  const animals = ['🐱', '🐶', '🐰', '🦊', '🐼', '🐨', '🦁', '🐸', '🐥', '🐝'];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const msgs = ['太棒了！', '真厉害！', '好聪明！', '答对啦！', '完美！', '继续加油！'];
  const msg = msgs[Math.floor(Math.random() * msgs.length)];

  const overlay = document.getElementById('feedbackOverlay');
  document.getElementById('feedbackEmoji').textContent = word.emoji;
  document.getElementById('feedbackAnimal').textContent = animal;
  document.getElementById('feedbackText').textContent = msg;
  overlay.classList.add('show');
  setTimeout(() => overlay.classList.remove('show'), 1000);

  // 撒花效果
  showCelebration('', 800);
}

function showGentleExplain(word) {
  document.getElementById('explainArea').innerHTML = `
    <div class="explain-card">
      <div style="text-align:center;font-size:16px;color:var(--text-light);margin-bottom:8px">
        🤗 没关系，多看几遍就记住了！
      </div>
      <div class="explain-emoji">${word.emoji}</div>
      <div class="explain-word">${word.en}</div>
      <div class="explain-zh">${word.zh}</div>
      <div class="explain-mnemonic">
        🧠 <b>记忆口诀：</b>${word.mnemonic}<br>
        📖 <b>音节：</b>${word.syllable}
      </div>
    </div>
  `;
}

// ============================================================
//  9. 下一题 / 完成关卡
// ============================================================

function nextQuestion() {
  currentQuiz.currentIndex++;
  renderQuestion();
}

function finishLevel() {
  currentQuiz.isComplete = true;
  const levelId = currentQuiz.levelId;
  const correct = currentQuiz.correctCount;
  const wrong = currentQuiz.wrongCount;
  const total = currentQuiz.questions.length;
  const waterEarned = correct;

  // 标记关卡完成
  if (!state.completedLevels.includes(levelId)) {
    state.completedLevels.push(levelId);
  }

  // 解锁下一关
  if (levelId >= state.currentLevel && state.currentLevel < LEVELS.length) {
    state.currentLevel = levelId + 1;
  }

  // 检查贴纸解锁（每3关解锁一个）
  const shouldUnlockSticker = state.completedLevels.length % 3 === 0 &&
    !state.stickers.includes(Math.floor(state.completedLevels.length / 3));

  saveState();

  // 渲染完成页
  const words = getLevelWords(levelId);
  const learned = words.filter(w => state.learnedWords.includes(w.id));

  document.getElementById('questionCard').innerHTML = `
    <div class="level-complete">
      <div class="big-emoji">🎉</div>
      <div class="title">关卡 ${levelId} 完成！</div>
      <div class="subtitle">${LEVELS.find(l => l.id === levelId)?.name || ''}</div>
      <div class="stats">
        <div class="stat-item">
          <div class="stat-num" style="color:var(--green)">${correct}</div>
          <div class="stat-label">✅ 答对</div>
        </div>
        <div class="stat-item">
          <div class="stat-num" style="color:var(--accent)">${wrong}</div>
          <div class="stat-label">💪 继续练</div>
        </div>
        <div class="stat-item">
          <div class="stat-num" style="color:var(--primary)">${Math.round(correct/total*100)}%</div>
          <div class="stat-label">正确率</div>
        </div>
      </div>
      <div class="water-earned">
        💧 <span>+${waterEarned} 水滴</span>
      </div>
      <div style="margin-top:16px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="option-btn" style="background:var(--primary);color:#fff;border:none;padding:14px 28px" onclick="startLevel(${levelId + 1 > LEVELS.length ? levelId : levelId + 1})">
          ${levelId >= LEVELS.length ? '🔄 复习本关' : '▶️ 下一关'}
        </button>
        <button class="option-btn" style="border-color:var(--secondary);padding:14px 28px" onclick="showPage('page-levels')">
          📋 返回关卡
        </button>
      </div>
    </div>
  `;

  document.getElementById('quizProgress').textContent = '完成 🎉';
  document.getElementById('nextBtn').classList.remove('show');
  document.getElementById('explainArea').innerHTML = '';

  // 庆祝动画
  showCelebration('🎉 关卡通过！', 2000);

  // 如果解锁贴纸，弹窗
  if (shouldUnlockSticker) {
    setTimeout(() => showStickerUnlock(Math.floor(state.completedLevels.length / 3)), 1000);
  }
}

// ============================================================
//  10. TTS 文字转语音（浏览器内置）
// ============================================================

function playWordAudio(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.cancel(); // 取消之前的
    window.speechSynthesis.speak(utterance);
  } else {
    // 降级提示
    showToast('🔊 您的浏览器不支持语音播报');
  }
}

// ============================================================
//  11. 提示功能
// ============================================================

function showHint(wordId) {
  const panel = document.getElementById('hintPanel');
  if (panel) {
    panel.classList.toggle('show');
  }
}

// ============================================================
//  12. 庆祝动画
// ============================================================

function showCelebration(text, duration = 1000) {
  const container = document.getElementById('celebration');
  const emojis = ['🎉', '⭐', '🌸', '💖', '✨', '🎊', '🌈', '🍀', '💫', '🌟'];

  // 清空旧的
  container.innerHTML = '';

  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.className = 'celebration-emoji';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.top = (60 + Math.random() * 30) + '%';
    el.style.animationDelay = Math.random() * 0.5 + 's';
    el.style.fontSize = (24 + Math.random() * 20) + 'px';
    container.appendChild(el);
  }

  setTimeout(() => { container.innerHTML = ''; }, duration);
}

function showMiniCelebration() {
  const container = document.getElementById('celebration');
  const emojis = ['⭐', '✨', '💫'];
  for (let i = 0; i < 4; i++) {
    const el = document.createElement('div');
    el.className = 'celebration-emoji';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = (20 + Math.random() * 60) + '%';
    el.style.top = (50 + Math.random() * 20) + '%';
    el.style.animationDelay = Math.random() * 0.3 + 's';
    container.appendChild(el);
  }
  setTimeout(() => { container.innerHTML = ''; }, 1000);
}

// ============================================================
//  13. 树苗升级弹窗
// ============================================================

function showTreeUpgradePopup(stage) {
  const info = TREE_STAGES[stage];
  // 简单庆祝
  showCelebration(`🌱 → ${info.emoji}`, 2000);
}

// ============================================================
//  14. 贴纸系统
// ============================================================

const STICKERS = [
  { id: 1, emoji: '🌟', name: '新星贴纸' },
  { id: 2, emoji: '🌈', name: '彩虹贴纸' },
  { id: 3, emoji: '🦋', name: '蝴蝶贴纸' },
  { id: 4, emoji: '🌺', name: '花朵贴纸' },
  { id: 5, emoji: '🐉', name: '神龙贴纸' },
  { id: 6, emoji: '🎠', name: '旋转木马' },
  { id: 7, emoji: '🦄', name: '独角兽贴纸' },
  { id: 8, emoji: '🎪', name: '马戏团贴纸' },
  { id: 9, emoji: '🏆', name: '冠军贴纸' },
];

function renderStickers() {
  const grid = document.getElementById('stickerGrid');
  grid.innerHTML = STICKERS.map(s => {
    const unlocked = state.stickers.includes(s.id);
    return `
      <div class="sticker-item ${unlocked ? '' : 'locked'}">
        <div class="sticker-emoji">${unlocked ? s.emoji : '❓'}</div>
        <div class="sticker-name">${unlocked ? s.name : '???'}</div>
        ${unlocked ? '<div style="font-size:11px;color:#b5e48c">✅ 已收集</div>' : '<div style="font-size:11px;color:#ccc">未解锁</div>'}
      </div>
    `;
  }).join('');

  document.getElementById('stickerCount').textContent = `${state.stickers.length} / ${STICKERS.length}`;
}

function showStickerUnlock(stickerId) {
  const sticker = STICKERS.find(s => s.id === stickerId);
  if (!sticker) return;
  state.stickers.push(stickerId);
  saveState();

  const overlay = document.getElementById('stickerUnlock');
  document.getElementById('stickerUnlockEmoji').textContent = sticker.emoji;
  document.getElementById('stickerUnlockName').textContent = sticker.name;
  overlay.classList.add('show');
}

function closeStickerUnlock() {
  document.getElementById('stickerUnlock').classList.remove('show');
}

// ============================================================
//  15. 每日目标完成
// ============================================================

function showGoalCelebration() {
  document.getElementById('goalCelebration').classList.add('show');
}

function closeGoalCelebration() {
  document.getElementById('goalCelebration').classList.remove('show');
  state._dailyGoalCompleted = false;
}

// ============================================================
//  16. 目标切换
// ============================================================

function setDailyGoal(min) {
  state.dailyGoal = min === 5 ? '5min' : '10min';
  state.dailyProgress = 0;
  state._dailyGoalCompleted = false;
  saveState();
  renderHome();
  showToast(`✅ 每日目标已设为 ${min} 分钟`);
}

// ============================================================
//  17. Toast 提示
// ============================================================

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 2000);
}

// ============================================================
//  18. 初始化
// ============================================================

function initApp() {
  // 渲染首页
  renderHome();
  renderLevels();
  renderStickers();
  showPage('page-home');
}

// 页面加载完成后启动
document.addEventListener('DOMContentLoaded', initApp);
