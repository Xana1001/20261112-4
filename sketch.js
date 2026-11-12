// 宣告全域變數，用來存放靜止、走路、施法與特效四種圖片精靈圖檔物件
let stopSpriteSheet;
let walkSpriteSheet;
let magicSpriteSheet;
let effectSpriteSheet;

// 宣告陣列，分別用來存放切割後的各狀態動畫幀
let stopFrames = [];
let walkFrames = [];
let magicFrames = [];
let effectFrames = [];

// 設定靜止狀態圖片精靈的相關常數 ('1/stop/stop.png')
const STOP_TOTAL_FRAMES = 10;                          // 靜止圖片精靈內總共有 10 張圖 [cite: 8]
const STOP_SHEET_WIDTH = 1385;                         // 靜止圖片精靈總寬度為 1385 像素 [cite: 8]
const STOP_SHEET_HEIGHT = 212;                         // 靜止圖片精靈總高度為 212 像素 [cite: 8]
const STOP_FRAME_WIDTH = STOP_SHEET_WIDTH / STOP_TOTAL_FRAMES; // 單張靜止圖片寬度 (1385 / 10 = 138.5) [cite: 8]
const STOP_FRAME_HEIGHT = STOP_SHEET_HEIGHT;           // 單張靜止圖片高度 (212) [cite: 8]

// 設定走路狀態圖片精靈的相關常數 ('1/walk/walk.png')
const WALK_TOTAL_FRAMES = 9;                           // 走路圖片精靈內總共有 9 張圖 [cite: 8]
const WALK_SHEET_WIDTH = 1246;                         // 走路圖片精靈總寬度為 1246 像素 [cite: 8]
const WALK_SHEET_HEIGHT = 198;                         // 走路圖片精靈總高度為 198 像素 [cite: 8]
const WALK_FRAME_WIDTH = WALK_SHEET_WIDTH / WALK_TOTAL_FRAMES; // 單張走路圖片寬度 (1246 / 9 ≈ 138.44) [cite: 8]
const WALK_FRAME_HEIGHT = WALK_SHEET_HEIGHT;           // 單張走路圖片高度 (198) [cite: 8]

// 設定施法狀態圖片精靈的相關常數 ('1/magic1/magic1.png')
const MAGIC_TOTAL_FRAMES = 4;                          // 施法圖片精靈內總共有 4 張圖 [cite: 8]
const MAGIC_SHEET_WIDTH = 1039;                        // 施法圖片精靈總寬度為 1039 像素 [cite: 8]
const MAGIC_SHEET_HEIGHT = 146;                        // 施法圖片精靈總高度為 146 像素 [cite: 8]
const MAGIC_FRAME_WIDTH = MAGIC_SHEET_WIDTH / MAGIC_TOTAL_FRAMES; // 單張施法圖片寬度 (1039 / 4 = 259.75) [cite: 8]
const MAGIC_FRAME_HEIGHT = MAGIC_SHEET_HEIGHT;         // 單張施法圖片高度 (146) [cite: 8]

// 設定魔法特效圖片精靈的相關常數 ('1/magic1_effect/magic1_effect.png')
const EFFECT_TOTAL_FRAMES = 5;                         // 特效圖片精靈內總共有 5 張圖 [cite: 8]
const EFFECT_SHEET_WIDTH = 740;                        // 特效圖片精靈總寬度為 740 像素 [cite: 8]
const EFFECT_SHEET_HEIGHT = 19;                        // 特效圖片精靈總高度為 19 像素 [cite: 8]
const EFFECT_FRAME_WIDTH = EFFECT_SHEET_WIDTH / EFFECT_TOTAL_FRAMES; // 單張特效圖片寬度 (740 / 5 = 148) [cite: 8]
const EFFECT_FRAME_HEIGHT = EFFECT_SHEET_HEIGHT;       // 單張特效圖片高度 (19) [cite: 8]

// 宣告角色狀態與控制變數
let currentState = 'stop';    // 目前角色狀態：'stop' 為靜止，'walk' 為走路，'magic' 為施法 [cite: 8]
let facingDirection = 1;      // 角色面向方向：1 代表朝右（預設），-1 代表朝左（水平翻轉） [cite: 8]
let charCenterX;              // 角色中心的 X 軸座標位置 [cite: 8]
let moveSpeed = 5;            // 角色左右移動的速度（每畫格移動的像素數） [cite: 8]

// 宣告角色動畫播放速度控制變數
let currentFrame = 0;         // 目前播放到第幾張圖片的索引值 [cite: 8]
let animationSpeed = 6;       // 動畫切換速度（每經過幾個畫格切換下一張圖，數字越小越快） [cite: 8]

// 宣告魔法特效物件陣列（支援畫面同時存在多個飛行的魔法特效）
let magicEffects = [];
let effectSpeed = 12;         // 魔法特效飛行的水平速度（每畫格移動的像素數） [cite: 8]
let effectAnimSpeed = 4;      // 魔法特效自身動畫切換速度 [cite: 8]

// preload() 函式會在 setup() 之前執行，確保所有外部圖片資源載入完成
function preload() {
  // 載入靜止狀態的圖片精靈檔案
  stopSpriteSheet = loadImage('1/stop/stop.png');
  // 載入走路狀態的圖片精靈檔案
  walkSpriteSheet = loadImage('1/walk/walk.png');
  // 載入施法狀態的圖片精靈檔案 ('1/magic1/magic1.png')
  magicSpriteSheet = loadImage('1/magic1/magic1.png');
  // 載入魔法特效的圖片精靈檔案 (對應 1/magic1_effect/magic1_effect.png)
  effectSpriteSheet = loadImage('1/magic1_effect/magic1_effect.png');
}

// setup() 函式在程式啟動時執行一次，用來初始化畫布、切割圖片與設定初始位置
function setup() {
  // 建立一個符合目前瀏覽器視窗寬高的全螢幕畫布
  let canvas = createCanvas(windowWidth, windowHeight);
  // 強制將畫布設定為區塊元素並固定貼齊視窗左上角，確保畫布底部與螢幕最底部完全貼合 [cite: 8]
  canvas.style('display', 'block');
  canvas.position(0, 0);
  
  // 初始化角色1的中心 X 座標在整個畫布寬度的 2/3 位置 [cite: 8]
  charCenterX = (width * 2) / 3;
  
  // 切割靜止圖片精靈成 10 張獨立的圖片 [cite: 8]
  for (let i = 0; i < STOP_TOTAL_FRAMES; i++) {
    let sx = i * STOP_FRAME_WIDTH;
    stopFrames.push(stopSpriteSheet.get(sx, 0, STOP_FRAME_WIDTH, STOP_FRAME_HEIGHT));
  }
  
  // 切割走路圖片精靈成 9 張獨立的圖片 [cite: 8]
  for (let i = 0; i < WALK_TOTAL_FRAMES; i++) {
    let sx = i * WALK_FRAME_WIDTH;
    walkFrames.push(walkSpriteSheet.get(sx, 0, WALK_FRAME_WIDTH, WALK_FRAME_HEIGHT));
  }
  
  // 切割施法圖片精靈成 4 張獨立的圖片 [cite: 8]
  for (let i = 0; i < MAGIC_TOTAL_FRAMES; i++) {
    let sx = i * MAGIC_FRAME_WIDTH;
    magicFrames.push(magicSpriteSheet.get(sx, 0, MAGIC_FRAME_WIDTH, MAGIC_FRAME_HEIGHT));
  }
  
  // 切割魔法特效圖片精靈成 5 張獨立的圖片 [cite: 8]
  for (let i = 0; i < EFFECT_TOTAL_FRAMES; i++) {
    let sx = i * EFFECT_FRAME_WIDTH;
    effectFrames.push(effectSpriteSheet.get(sx, 0, EFFECT_FRAME_WIDTH, EFFECT_FRAME_HEIGHT));
  }
}

// keyPressed() 是 p5.js 內建事件，當鍵盤按鍵被按下的瞬間觸發一次
function keyPressed() {
  // 當按下空白鍵（key === ' ' 或 keyCode === 32），且目前不是正在施法中 [cite: 8]
  if ((key === ' ' || keyCode === 32) && currentState !== 'magic') {
    // 切換為施法狀態，並將施法動畫從第 0 張開始播放 [cite: 8]
    setCharacterState('magic', facingDirection);
  }
}

// draw() 函式會不斷重複執行，負責處理鍵盤操作、更新位置與繪製動畫
function draw() {
  // 設定背景顏色為天空色 (Sky Blue 的 RGB 色碼) [cite: 8]
  background(135, 206, 235);
  
  // 計算角色1顯示在畫布上的目標高度：設定為整個畫布高度的 1/3 [cite: 8]
  let targetHeight = height / 3;
  
  // 依據目前狀態（靜止、走路或施法）選擇對應的圖片陣列與單張原始尺寸 [cite: 8]
  let activeFrames, activeTotalFrames, activeFrameWidth, activeFrameHeight;
  if (currentState === 'magic') {
    activeFrames = magicFrames;
    activeTotalFrames = MAGIC_TOTAL_FRAMES;
    activeFrameWidth = MAGIC_FRAME_WIDTH;
    activeFrameHeight = MAGIC_FRAME_HEIGHT;
  } else if (currentState === 'walk') {
    activeFrames = walkFrames;
    activeTotalFrames = WALK_TOTAL_FRAMES;
    activeFrameWidth = WALK_FRAME_WIDTH;
    activeFrameHeight = WALK_FRAME_HEIGHT;
  } else {
    activeFrames = stopFrames;
    activeTotalFrames = STOP_TOTAL_FRAMES;
    activeFrameWidth = STOP_FRAME_WIDTH;
    activeFrameHeight = STOP_FRAME_HEIGHT;
  }
  
  // 計算縮放比例：播放出來的目標高度 除以 目前狀態原圖單張高度 [cite: 8]
  let scaleRatio = targetHeight / activeFrameHeight;
  
  // 依照原圖高度與播放高度的縮放比例，等比例計算播放出來的目標寬度 [cite: 8]
  let targetWidth = activeFrameWidth * scaleRatio;
  
  // 只有在「非施法狀態」時，才允許左右方向鍵控制角色移動（確保施法動作完整執行一次） [cite: 8]
  if (currentState !== 'magic') {
    if (keyIsDown(RIGHT_ARROW)) {
      // 切換為走路狀態並設定面向右邊 [cite: 8]
      setCharacterState('walk', 1);
      // 計算畫布最右端的中心 X 邊界 [cite: 8]
      let maxRightX = width - (targetWidth / 2);
      // 往右移動至畫布最右端即停止移動（走路動畫繼續顯示） [cite: 8]
      if (charCenterX < maxRightX) {
        charCenterX = min(charCenterX + moveSpeed, maxRightX);
      }
    } else if (keyIsDown(LEFT_ARROW)) {
      // 切換為走路狀態並設定面向左邊（圖片轉向） [cite: 8]
      setCharacterState('walk', -1);
      // 計算畫布最左端的中心 X 邊界 [cite: 8]
      let minLeftX = targetWidth / 2;
      // 往左移動至畫布最左端即停止移動（走路動畫繼續顯示） [cite: 8]
      if (charCenterX > minLeftX) {
        charCenterX = max(charCenterX - moveSpeed, minLeftX);
      }
    } else {
      // 當左右方向鍵都沒有被按下時，切換回靜止狀態（維持最後面向的方向） [cite: 8]
      setCharacterState('stop', facingDirection);
    }
  }
  
  // 確保角色位置始終保持在畫布左右邊界內 [cite: 8]
  charCenterX = constrain(charCenterX, targetWidth / 2, width - targetWidth / 2);
  
  // 計算角色1左上角繪製的 Y 座標：畫布最底部 height 減去角色高度 targetHeight，確保最底端精準貼齊螢幕最底部 [cite: 8]
  let charTopY = height - targetHeight;
  
  // 確保索引值不超過目前狀態的總張數 [cite: 8]
  currentFrame = currentFrame % activeTotalFrames;
  
  // 繪製角色1 [cite: 8]
  if (activeFrames.length > 0) {
    push();
    // 將畫布原點移動到角色的水平中心與頂端位置 (charCenterX, charTopY) [cite: 8]
    translate(charCenterX, charTopY);
    // 依據面向方向進行水平縮放：1 為正常朝右，-1 為水平鏡像翻轉朝左 [cite: 8]
    scale(facingDirection, 1);
    // 設定圖片繪製基準點為左上角 (CORNER) [cite: 8]
    imageMode(CORNER);
    // 在 X = -targetWidth/2、Y = 0 繪製角色，使圖片最底端精準落在螢幕最底部 (height) [cite: 8]
    image(activeFrames[currentFrame], -targetWidth / 2, 0, targetWidth, targetHeight);
    pop();
  }
  
  // 更新角色動畫畫格 [cite: 8]
  if (frameCount % animationSpeed === 0) {
    if (currentState === 'magic') {
      // 若為施法狀態，只播放一次（不循環） [cite: 8]
      if (currentFrame < MAGIC_TOTAL_FRAMES - 1) {
        // 尚未播到最後一張（第 4 張）時，繼續往下一張推進 [cite: 8]
        currentFrame++;
      } else {
        // 4 張施法圖片全部播放完畢後，產生魔法特效圖片 [cite: 8]
        spawnMagicEffect(targetWidth, targetHeight);
        // 施法完成後，將角色切回靜止狀態 [cite: 8]
        setCharacterState('stop', facingDirection);
      }
    } else {
      // 靜止與走路狀態則維持無限循環播放 [cite: 8]
      currentFrame = (currentFrame + 1) % activeTotalFrames;
    }
  }
  
  // 更新並繪製所有正在飛行中的魔法特效 [cite: 8]
  updateAndDrawMagicEffects();
}

// 產生魔法特效的函式 [cite: 8]
function spawnMagicEffect(charWidth, charHeight) {
  // 依據角色高度比例計算特效的顯示高度（依照原圖 146 與 19 的比例換算，讓特效與角色尺寸協調） [cite: 8]
  let effectHeight = charHeight * (EFFECT_FRAME_HEIGHT / MAGIC_FRAME_HEIGHT);
  // 依照特效原圖寬高比等比例計算特效顯示寬度 [cite: 8]
  let effectWidth = EFFECT_FRAME_WIDTH * (effectHeight / EFFECT_FRAME_HEIGHT);
  
  // 設定特效產生的起始 X 座標（從角色面向的前方邊緣發射） [cite: 8]
  let startX = charCenterX + facingDirection * (charWidth * 0.35);
  // 設定特效的中心 Y 座標（位於角色腰部／手部高度，並隨螢幕高度自適應） [cite: 8]
  let startY = height - (charHeight * 0.45);
  
  // 將新的特效物件加入陣列中 [cite: 8]
  magicEffects.push({
    x: startX,                  // 特效中心 X 座標 [cite: 8]
    y: startY,                  // 特效中心 Y 座標 [cite: 8]
    dir: facingDirection,       // 飛行方向：1 往右，-1 往左 [cite: 8]
    width: effectWidth,         // 特效顯示寬度 [cite: 8]
    height: effectHeight,       // 特效顯示高度 [cite: 8]
    frame: 0                    // 特效目前播放的圖片索引 (0 ~ 4) [cite: 8]
  });
}

// 更新並繪製所有魔法特效的函式 [cite: 8]
function updateAndDrawMagicEffects() {
  // 使用反向迴圈遍歷陣列，方便在特效飛出邊界時安全移除 [cite: 8]
  for (let i = magicEffects.length - 1; i >= 0; i--) {
    let eff = magicEffects[i];
    
    // 依據特效方向更新 X 座標（往右增加，往左減少） [cite: 8]
    eff.x += eff.dir * effectSpeed;
    
    // 更新特效自身的 5 張精靈動畫幀 [cite: 8]
    if (frameCount % effectAnimSpeed === 0) {
      eff.frame = (eff.frame + 1) % EFFECT_TOTAL_FRAMES;
    }
    
    // 繪製特效圖片 [cite: 8]
    if (effectFrames.length > 0) {
      push();
      // 移動畫布原點至特效中心 [cite: 8]
      translate(eff.x, eff.y);
      // 若角色面向左邊（dir === -1），特效圖片也水平翻轉朝左飛行 [cite: 8]
      scale(eff.dir, 1);
      // 以中心點對齊繪製特效圖片 [cite: 8]
      imageMode(CENTER);
      image(effectFrames[eff.frame], 0, 0, eff.width, eff.height);
      pop();
    }
    
    // 檢查邊界消失條件： [cite: 8]
    // 當面向右邊 (dir === 1)，移動至畫布最右端 (eff.x - eff.width / 2 >= width) 即消失不見 [cite: 8]
    // 當面向左邊 (dir === -1)，移動至畫布最左端 (eff.x + eff.width / 2 <= 0) 即消失不見 [cite: 8]
    if (eff.dir === 1 && (eff.x - eff.width / 2 >= width)) {
      magicEffects.splice(i, 1);
    } else if (eff.dir === -1 && (eff.x + eff.width / 2 <= 0)) {
      magicEffects.splice(i, 1);
    }
  }
}

// 輔助函式：用來安全切換角色狀態與面向方向，避免切換圖片組時發生索引值溢位 [cite: 8]
function setCharacterState(newState, newDirection) {
  facingDirection = newDirection;
  // 只有當狀態真正改變時，才將動畫幀索引歸零 [cite: 8]
  if (currentState !== newState) {
    currentState = newState;
    currentFrame = 0;
  }
}

// windowResized() 是 p5.js 的內建事件，當瀏覽器視窗大小改變（或旋轉手機螢幕）時會自動觸發 [cite: 8]
function windowResized() {
  // 記錄縮放前的畫布寬度比例，讓視窗改變大小時角色能保持相對位置 [cite: 8]
  let widthRatio = charCenterX / width;
  // 重新調整畫布尺寸以符合最新的視窗寬高 [cite: 8]
  resizeCanvas(windowWidth, windowHeight);
  // 依據新的畫布寬度更新角色的 X 座標 [cite: 8]
  charCenterX = width * widthRatio;
}