/**
 * BMI 健康計算器 - 主程式
 * 功能：計算 BMI、基礎代謝率，並提供個人化飲食建議
 * 基於「以BMI為核心的個人化健康飲食指南」內容策略
 */

// DOM 元素
const bmiForm = document.getElementById('bmi-form');
const resultSection = document.getElementById('result-section');
const recalculateBtn = document.getElementById('recalculate-btn');

// BMI 分類標準（台灣衛福部標準）
const BMI_CATEGORIES = {
    underweight: { max: 18.5, label: '體重過輕', class: 'underweight' },
    normal: { max: 24, label: '健康體重', class: 'normal' },
    overweight: { max: 27, label: '體重過重', class: 'overweight' },
    obese: { max: Infinity, label: '肥胖', class: 'obese' }
};

// 12個健康飲食微習慣
const MICRO_HABITS = {
    group1: {
        name: '環境與心理重塑',
        habits: [
            { id: 1, title: '重新佈置廚房', desc: '將健康食物放在顯眼位置，把零食收起來' },
            { id: 10, title: '建立飲食儀式感', desc: '專心吃飯，不邊看手機邊吃' },
            { id: 11, title: '設定合理目標', desc: '循序漸進改變，避免極端節食' },
            { id: 12, title: '建立支持系統', desc: '與家人朋友分享健康目標' }
        ]
    },
    group2: {
        name: '營養素的精準升級',
        habits: [
            { id: 2, title: '全穀替換精製澱粉', desc: '每日至少1/3主食選擇糙米、燕麥等未精製全穀' },
            { id: 3, title: '蛋白質優先順序', desc: '遵循「豆＞魚＞蛋＞肉」選擇順序' },
            { id: 4, title: '增加好油攝取', desc: '以橄欖油、堅果取代動物性飽和脂肪' }
        ]
    },
    group3: {
        name: '減法生活的具體操作',
        habits: [
            { id: 6, title: '戒除含糖飲料', desc: '用無糖茶、氣泡水取代手搖飲' },
            { id: 7, title: '減少加工食品', desc: '優先選擇看得到原型的食物' },
            { id: 8, title: '減鹽策略', desc: '少用醬料，用天然香料調味' },
            { id: 9, title: '控制外食頻率', desc: '每週至少3天自己準備餐食' }
        ]
    },
    group4: {
        name: '基礎代謝的維護',
        habits: [
            { id: 5, title: '充足水分攝取', desc: '每日飲水2000-2500ml，促進代謝' }
        ]
    }
};

// 外食族指南
const EATING_OUT_GUIDE = {
    breakfast: {
        icon: '🌅',
        name: '早餐店',
        rule: '蛋白質優先，斷絕加工肉',
        recommend: '去醬蛋餅＋無糖豆漿',
        avoid: '鐵板麵＋奶茶、培根三明治'
    },
    convenience: {
        icon: '🏪',
        name: '便利商店',
        rule: '尋找原型食物與閱讀標示',
        recommend: '糙米飯糰＋海帶芽沙拉＋茶葉蛋',
        avoid: '炸雞便當、含糖飲料'
    },
    buffet: {
        icon: '🍱',
        name: '自助餐',
        rule: '實踐健康餐盤的最佳戰場',
        recommend: '1主食＋1肉＋2菜（遵循餐盤比例）',
        avoid: '炸物、糖醋、紅燒等地雷菜色'
    }
};

// 三大飲食法比較
const DIET_METHODS = {
    healthyPlate: {
        name: '健康飲食餐盤',
        icon: '🍽️',
        goal: '視覺化均衡飲食',
        suitable: '所有族群，特別是初學者',
        focus: '蔬菜水果佔1/2，全穀1/4，蛋白質1/4',
        tips: ['飯跟蔬菜一樣多', '豆魚蛋肉一掌心', '每餐水果拳頭大', '每天早晚一杯奶']
    },
    mediterranean: {
        name: '地中海飲食',
        icon: '🫒',
        goal: '預防心血管疾病、抗發炎',
        suitable: '過重族群、關注心臟健康者',
        focus: '大量蔬果、全穀、魚類、橄欖油、堅果',
        tips: ['每天攝取橄欖油', '每週至少吃2次魚', '大量新鮮蔬果', '適量紅酒（可選）']
    },
    dash: {
        name: '得舒飲食 (DASH)',
        icon: '💚',
        goal: '控制高血壓、系統性減重',
        suitable: '肥胖族群、有血壓問題者',
        focus: '高纖、高鉀鈣鎂、低鈉、低脂乳品',
        tips: ['每日鈉攝取<2300mg', '增加鉀鈣鎂攝取', '選擇低脂乳品', '限制飽和脂肪']
    }
};

// 個人化飲食建議資料庫
const DIET_RECOMMENDATIONS = {
    underweight: {
        male: {
            title: '健康增重飲食計劃',
            subtitle: '長肌肉而非長贅肉',
            note: '男性增重時應注重蛋白質攝取，搭配重量訓練效果更佳',
            nutritionStrategy: {
                calories: { direction: '+200～400 kcal/天', desc: '創造溫和的熱量盈餘，為身體提供建構組織的額外能量' },
                carbs: { range: '50-60%', desc: '作為主要能量來源，確保身體有足夠燃料，避免分解肌肉供能' },
                protein: { range: '15-25%', desc: '作為肌肉合成的關鍵原料，支持瘦體重的增加' },
                fat: { range: '25-30%', desc: '利用「好油」增加飲食的能量密度，讓食量小的用戶也能輕鬆達標' }
            },
            tips: [
                { icon: '🌾', title: '聰明增加份量', desc: '選擇「全穀、豆類、水果」作為碳水來源，每餐可多加半碗糙米飯' },
                { icon: '🥑', title: '健康油脂加倍', desc: '善用酪梨、堅果、橄欖油，不增加身體負擔輕鬆提升熱量' },
                { icon: '🥩', title: '優質蛋白充足', desc: '每餐攝取雞胸肉、牛肉、魚類等優質蛋白，支持肌肉生長' },
                { icon: '🏋️', title: '配合重量訓練', desc: '搭配阻力訓練，確保增加的是肌肉而非贅肉' }
            ],
            mythBuster: {
                title: '闢謠：增重≠亂吃',
                content: '避免只靠含糖飲料、炸物增重！這樣只會增加體脂肪和健康風險，應選擇營養密度高的原型食物'
            },
            foods: [
                { icon: '🥩', name: '牛排' },
                { icon: '🍗', name: '雞腿' },
                { icon: '🥚', name: '雞蛋' },
                { icon: '🥛', name: '牛奶' },
                { icon: '🥜', name: '堅果' },
                { icon: '🍠', name: '地瓜' },
                { icon: '🍌', name: '香蕉' },
                { icon: '🧀', name: '起司' },
                { icon: '🥑', name: '酪梨' },
                { icon: '🫒', name: '橄欖油' }
            ],
            nutrition: { calories: 2800, protein: 140, carbs: 350, fat: 90 },
            recommendedDiets: ['healthyPlate'],
            eatingOutTip: '在自助餐可額外增加「半碗糙米飯」，或選擇使用「堅果」入菜的品項'
        },
        female: {
            title: '健康增重飲食計劃',
            subtitle: '營養均衡，健康增重',
            note: '女性增重應注重營養均衡，避免過度增加脂肪，維持健美體態',
            nutritionStrategy: {
                calories: { direction: '+200～400 kcal/天', desc: '創造溫和的熱量盈餘' },
                carbs: { range: '50-60%', desc: '提供充足能量，保護肌肉不被分解' },
                protein: { range: '15-25%', desc: '支持身體修復與組織建構' },
                fat: { range: '25-30%', desc: '健康脂肪幫助荷爾蒙平衡' }
            },
            tips: [
                { icon: '🥗', title: '營養密度優先', desc: '選擇營養密度高的食物，如堅果、酪梨、優格' },
                { icon: '🍳', title: '餐餐有蛋白', desc: '每餐搭配蛋、魚、豆類等蛋白質來源' },
                { icon: '🍯', title: '健康點心加餐', desc: '正餐間加入堅果、優格等營養點心' },
                { icon: '🧘', title: '適度阻力訓練', desc: '搭配阻力訓練，塑造健美體態' }
            ],
            mythBuster: {
                title: '闢謠：增重≠亂吃',
                content: '避免只靠含糖飲料、炸物增重！選擇原型食物才能健康增重'
            },
            foods: [
                { icon: '🥑', name: '酪梨' },
                { icon: '🍳', name: '水煮蛋' },
                { icon: '🐟', name: '鮭魚' },
                { icon: '🥛', name: '豆漿' },
                { icon: '🍇', name: '葡萄' },
                { icon: '🥣', name: '燕麥' },
                { icon: '🧈', name: '花生醬' },
                { icon: '🍊', name: '柳橙' },
                { icon: '🥜', name: '堅果' },
                { icon: '🧀', name: '優格' }
            ],
            nutrition: { calories: 2200, protein: 80, carbs: 280, fat: 75 },
            recommendedDiets: ['healthyPlate'],
            eatingOutTip: '在自助餐可額外增加「半碗糙米飯」，或選擇使用「堅果」入菜的品項'
        }
    },
    normal: {
        male: {
            title: '維持健康飲食計劃',
            subtitle: '維持動態平衡，優化飲食品質',
            note: '男性維持體重時應保持蛋白質攝取，維持肌肉量，預防勝於治療',
            nutritionStrategy: {
                calories: { direction: '維持平衡', desc: '總熱量攝取約等於每日消耗，維持健康的動態平衡' },
                carbs: { range: '45-60%', desc: '提供日常活動所需的主要能量，強調來源品質' },
                protein: { range: '10-20%', desc: '滿足維持肌肉量與身體基本修復的需求' },
                fat: { range: '20-30%', desc: '維持內分泌與器官保護功能，嚴格限制壞脂肪' }
            },
            tips: [
                { icon: '🍽️', title: '健康餐盤法則', desc: '蔬菜水果佔1/2、全穀佔1/4、優質蛋白佔1/4' },
                { icon: '🌾', title: '從量轉向質', desc: '至少1/3主食選擇未精製全穀，遵循「豆>魚>蛋>肉」順序' },
                { icon: '💧', title: '充足水分', desc: '每日飲水 2000-2500ml，促進代謝' },
                { icon: '🏃', title: '規律運動', desc: '每週至少 150 分鐘中等強度運動' }
            ],
            mythBuster: null,
            foods: [
                { icon: '🍗', name: '雞胸肉' },
                { icon: '🥬', name: '深綠蔬菜' },
                { icon: '🍚', name: '糙米' },
                { icon: '🐟', name: '魚類' },
                { icon: '🥕', name: '紅蘿蔔' },
                { icon: '🍅', name: '番茄' },
                { icon: '🫘', name: '豆類' },
                { icon: '🍎', name: '蘋果' },
                { icon: '🥦', name: '花椰菜' },
                { icon: '🥒', name: '黃瓜' }
            ],
            nutrition: { calories: 2400, protein: 120, carbs: 300, fat: 70 },
            recommendedDiets: ['healthyPlate'],
            eatingOutTip: '自助餐是實踐健康餐盤的最佳場所，運用「1主食+1肉+2菜」公式夾菜'
        },
        female: {
            title: '維持健康飲食計劃',
            subtitle: '維持動態平衡，優化飲食品質',
            note: '女性應注意鐵質和鈣質的補充，維持骨骼健康與體力',
            nutritionStrategy: {
                calories: { direction: '維持平衡', desc: '總熱量攝取約等於每日消耗' },
                carbs: { range: '45-60%', desc: '提供日常活動所需能量' },
                protein: { range: '10-20%', desc: '維持身體基本修復需求' },
                fat: { range: '20-30%', desc: '維持荷爾蒙平衡' }
            },
            tips: [
                { icon: '🍽️', title: '健康餐盤法則', desc: '實踐「我的餐盤」六大口訣：飯跟蔬菜一樣多、豆魚蛋肉一掌心' },
                { icon: '🦴', title: '補充鈣質', desc: '多攝取乳製品、深綠色蔬菜補鈣，維護骨骼健康' },
                { icon: '🩸', title: '補充鐵質', desc: '適量攝取紅肉、菠菜補充鐵質，預防貧血' },
                { icon: '🌈', title: '多彩蔬果', desc: '攝取不同顏色的蔬果，獲取多種營養素' }
            ],
            mythBuster: null,
            foods: [
                { icon: '🥗', name: '綜合沙拉' },
                { icon: '🐠', name: '鯛魚' },
                { icon: '🥛', name: '優格' },
                { icon: '🥬', name: '菠菜' },
                { icon: '🫐', name: '藍莓' },
                { icon: '🥦', name: '花椰菜' },
                { icon: '🍋', name: '檸檬' },
                { icon: '🥝', name: '奇異果' },
                { icon: '🧀', name: '起司' },
                { icon: '🫘', name: '紅豆' }
            ],
            nutrition: { calories: 1800, protein: 70, carbs: 230, fat: 55 },
            recommendedDiets: ['healthyPlate'],
            eatingOutTip: '便利商店可組合「糙米飯糰＋海帶芽沙拉＋茶葉蛋」拼湊健康餐盤'
        }
    },
    overweight: {
        male: {
            title: '健康減重飲食計劃',
            subtitle: '啟動溫和減重，達成可持續的熱量赤字',
            note: '男性減重應維持足夠蛋白質攝取，避免肌肉流失，調整飲食結構而非極端節食',
            nutritionStrategy: {
                calories: { direction: '-300～500 kcal/天', desc: '創造一個中度、可持續的熱量赤字，啟動體重下降' },
                carbs: { range: '40-50%', desc: '適度降低碳水比例，特別是精製澱粉，控制血糖與脂肪堆積' },
                protein: { range: '20-30%', desc: '顯著提高蛋白質，利用其高飽足感效應，維持遵循度同時保護瘦肌肉' },
                fat: { range: '25-30%', desc: '維持足夠的好油攝取，支持代謝機能與抗發炎' }
            },
            tips: [
                { icon: '🥬', title: '高纖低能量密度', desc: '利用纖維的物理飽足感，將白飯換成糙米，確保蔬菜量大於水果' },
                { icon: '🚫', title: '斬斷惡習', desc: '優先減少含糖飲料與加工肉品，用無糖茶、氣泡水取代手搖飲' },
                { icon: '🥩', title: '高蛋白飲食', desc: '提高蛋白質比例，增加飽足感，避免肌肉流失' },
                { icon: '🏋️‍♂️', title: '增加活動量', desc: '結合有氧與重訓，提升基礎代謝率' }
            ],
            mythBuster: {
                title: '重點提醒',
                content: '最直接有效的減卡方法：用無糖茶、氣泡水取代手搖飲，每天可輕鬆減少 200-400 大卡！'
            },
            foods: [
                { icon: '🍗', name: '去皮雞肉' },
                { icon: '🥦', name: '花椰菜' },
                { icon: '🥚', name: '水煮蛋' },
                { icon: '🐟', name: '清蒸魚' },
                { icon: '🥬', name: '生菜' },
                { icon: '🍄', name: '菇類' },
                { icon: '🫑', name: '甜椒' },
                { icon: '🥒', name: '小黃瓜' },
                { icon: '🫘', name: '毛豆' },
                { icon: '🍵', name: '無糖茶' }
            ],
            nutrition: { calories: 2000, protein: 130, carbs: 200, fat: 55 },
            recommendedDiets: ['healthyPlate', 'mediterranean'],
            eatingOutTip: '早餐店將「鐵板麵+奶茶」換成「去醬蛋餅+無糖豆漿」；自助餐將「炸排骨」換成「清蒸魚或滷雞腿（去皮）」'
        },
        female: {
            title: '健康減重飲食計劃',
            subtitle: '啟動溫和減重，達成可持續的熱量赤字',
            note: '女性減重應確保營養充足，避免極端節食，循序漸進調整飲食結構',
            nutritionStrategy: {
                calories: { direction: '-300～500 kcal/天', desc: '創造可持續的熱量赤字' },
                carbs: { range: '40-50%', desc: '適度降低碳水，控制血糖' },
                protein: { range: '20-30%', desc: '提高蛋白質增加飽足感' },
                fat: { range: '25-30%', desc: '維持好油攝取' }
            },
            tips: [
                { icon: '🥗', title: '低卡高纖', desc: '多攝取蔬菜增加飽足感，纖維幫助腸道健康' },
                { icon: '⏰', title: '規律進食', desc: '定時定量，避免暴飲暴食，維持血糖穩定' },
                { icon: '🍵', title: '健康飲品', desc: '以水、無糖茶取代含糖飲料，這是最簡單的減卡方法' },
                { icon: '😴', title: '充足睡眠', desc: '每日睡眠 7-8 小時，幫助代謝與控制食慾' }
            ],
            mythBuster: {
                title: '重點提醒',
                content: '減重不等於節食！重點在調整飲食「結構」，讓減重過程更人性化、可持續'
            },
            foods: [
                { icon: '🥗', name: '沙拉' },
                { icon: '🍅', name: '番茄' },
                { icon: '🥒', name: '黃瓜' },
                { icon: '🐔', name: '雞胸肉' },
                { icon: '🍵', name: '綠茶' },
                { icon: '🥬', name: '羽衣甘藍' },
                { icon: '🍋', name: '檸檬水' },
                { icon: '🫛', name: '毛豆' },
                { icon: '🍄', name: '菇類' },
                { icon: '🐟', name: '鱈魚' }
            ],
            nutrition: { calories: 1500, protein: 75, carbs: 150, fat: 45 },
            recommendedDiets: ['healthyPlate', 'mediterranean'],
            eatingOutTip: '早餐店將「鐵板麵+奶茶」換成「去醬蛋餅+無糖豆漿」'
        }
    },
    obese: {
        male: {
            title: '系統性體重管理計劃',
            subtitle: '結合飲食模式與行為支持',
            note: '建議諮詢專業醫師或營養師，將體重管理視為需要策略與支持的長期計畫',
            nutritionStrategy: {
                calories: { direction: '-500～750 kcal/天', desc: '創造明確且較大的熱量赤字，以達成5-10%的體重下降為初步目標' },
                carbs: { range: '35-45%', desc: '採取低醣策略，嚴格控制血糖波動，促進脂肪分解' },
                protein: { range: '25-35%', desc: '最大化蛋白質攝取，這是不可妥協的策略，提供最大飽足感並保護代謝活躍的瘦組織' },
                fat: { range: '25-30%', desc: '強調以不飽和脂肪為主，嚴格控制飽和與反式脂肪，降低心血管疾病風險' }
            },
            tips: [
                { icon: '🫒', title: '地中海/得舒飲食', desc: '採用科學實證的飲食模式，強調大量蔬果、全穀、好油與低鈉' },
                { icon: '🥬', title: '高纖是物理外掛', desc: '利用高纖維食物填滿胃部，以物理方式克服飢餓感' },
                { icon: '🧠', title: '行為治療觀念', desc: '循序漸進改變習慣，避免禁忌食物心態造成報復性暴食' },
                { icon: '👨‍⚕️', title: '專業諮詢', desc: '建議就醫評估，排除代謝相關問題，制定個人化計劃' }
            ],
            mythBuster: {
                title: '心理建設',
                content: '不要完全禁止任何食物！從「把零食收起來」開始，避免因剝奪感而引發報復性暴食'
            },
            foods: [
                { icon: '🥬', name: '葉菜類' },
                { icon: '🐟', name: '清蒸魚' },
                { icon: '🥚', name: '蛋白' },
                { icon: '🍄', name: '菇類' },
                { icon: '🥒', name: '瓜類' },
                { icon: '🫘', name: '豆腐' },
                { icon: '🥕', name: '蔬菜棒' },
                { icon: '🍵', name: '無糖茶' },
                { icon: '🫒', name: '橄欖油' },
                { icon: '🥜', name: '少量堅果' }
            ],
            nutrition: { calories: 1800, protein: 120, carbs: 150, fat: 50 },
            recommendedDiets: ['mediterranean', 'dash'],
            eatingOutTip: '主菜優先選擇「魚類」，烹調方式選擇「清蒸或烘烤」，主動向店家要求「醬料減半或去醬」'
        },
        female: {
            title: '系統性體重管理計劃',
            subtitle: '結合飲食模式與行為支持',
            note: '建議諮詢專業醫師或營養師，制定個人化減重計劃，健康減重是長期過程',
            nutritionStrategy: {
                calories: { direction: '-500～750 kcal/天', desc: '創造明確的熱量赤字，以達成5-10%體重下降為初步目標' },
                carbs: { range: '35-45%', desc: '低醣策略控制血糖' },
                protein: { range: '25-35%', desc: '最大化蛋白質攝取' },
                fat: { range: '25-30%', desc: '以不飽和脂肪為主' }
            },
            tips: [
                { icon: '💚', title: '得舒/地中海飲食', desc: '採用科學實證的飲食模式，適合長期抗戰且常伴隨代謝問題者' },
                { icon: '🥗', title: '低醣原型食物', desc: '減少精緻碳水，選擇看得到原型的食物' },
                { icon: '🧘‍♀️', title: '舒壓運動', desc: '從瑜珈、散步等低強度運動開始，循序漸進' },
                { icon: '❤️', title: '愛自己', desc: '設定合理目標，這是一場馬拉松，不是百米衝刺' }
            ],
            mythBuster: {
                title: '心理建設',
                content: '循序漸進改變習慣，從「把零食收起來」開始，而非完全禁止，避免報復性暴食'
            },
            foods: [
                { icon: '🥗', name: '生菜沙拉' },
                { icon: '🐔', name: '水煮雞肉' },
                { icon: '🥦', name: '蒸蔬菜' },
                { icon: '🫛', name: '豆類' },
                { icon: '🍅', name: '番茄' },
                { icon: '🥬', name: '白菜' },
                { icon: '🧊', name: '蒟蒻' },
                { icon: '🍵', name: '花茶' },
                { icon: '🐟', name: '烤魚' },
                { icon: '🥒', name: '小黃瓜' }
            ],
            nutrition: { calories: 1400, protein: 70, carbs: 120, fat: 40 },
            recommendedDiets: ['mediterranean', 'dash'],
            eatingOutTip: '主菜優先選擇「魚類」，烹調方式選擇「清蒸或烘烤」，主動要求「醬料減半或去醬」'
        }
    }
};

/**
 * 計算 BMI
 */
function calculateBMI(weight, height) {
    const heightM = height / 100;
    return weight / (heightM * heightM);
}

/**
 * 取得 BMI 分類
 */
function getBMICategory(bmi) {
    if (bmi < BMI_CATEGORIES.underweight.max) return 'underweight';
    if (bmi < BMI_CATEGORIES.normal.max) return 'normal';
    if (bmi < BMI_CATEGORIES.overweight.max) return 'overweight';
    return 'obese';
}

/**
 * 計算基礎代謝率 (BMR) - 使用 Mifflin-St Jeor 公式
 */
function calculateBMR(weight, height, age, gender) {
    if (gender === 'male') {
        return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
        return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
}

/**
 * 計算理想體重範圍
 */
function calculateIdealWeight(height) {
    const heightM = height / 100;
    const minWeight = (18.5 * heightM * heightM).toFixed(1);
    const maxWeight = (24 * heightM * heightM).toFixed(1);
    return { min: minWeight, max: maxWeight };
}

/**
 * 更新 BMI 量表指針位置
 */
function updateGaugePointer(bmi) {
    const pointer = document.getElementById('gauge-pointer');
    let percentage;

    if (bmi < 18.5) {
        percentage = (bmi / 18.5) * 25;
    } else if (bmi < 24) {
        percentage = 25 + ((bmi - 18.5) / (24 - 18.5)) * 25;
    } else if (bmi < 27) {
        percentage = 50 + ((bmi - 24) / (27 - 24)) * 25;
    } else {
        percentage = Math.min(75 + ((bmi - 27) / 10) * 25, 100);
    }

    pointer.style.left = `${percentage}%`;
}

/**
 * 渲染營養策略表格
 */
function renderNutritionStrategy(strategyContainer, strategy) {
    strategyContainer.innerHTML = `
        <div class="strategy-grid">
            <div class="strategy-item calories">
                <div class="strategy-icon">🔥</div>
                <div class="strategy-label">熱量方向</div>
                <div class="strategy-value">${strategy.calories.direction}</div>
                <div class="strategy-desc">${strategy.calories.desc}</div>
            </div>
            <div class="strategy-item carbs">
                <div class="strategy-icon">🌾</div>
                <div class="strategy-label">碳水化合物</div>
                <div class="strategy-value">${strategy.carbs.range}</div>
                <div class="strategy-desc">${strategy.carbs.desc}</div>
            </div>
            <div class="strategy-item protein">
                <div class="strategy-icon">🥩</div>
                <div class="strategy-label">蛋白質</div>
                <div class="strategy-value">${strategy.protein.range}</div>
                <div class="strategy-desc">${strategy.protein.desc}</div>
            </div>
            <div class="strategy-item fat">
                <div class="strategy-icon">🥑</div>
                <div class="strategy-label">脂肪</div>
                <div class="strategy-value">${strategy.fat.range}</div>
                <div class="strategy-desc">${strategy.fat.desc}</div>
            </div>
        </div>
    `;
}

/**
 * 渲染推薦飲食模式
 */
function renderRecommendedDiets(container, dietKeys) {
    const dietsHtml = dietKeys.map(key => {
        const diet = DIET_METHODS[key];
        return `
            <div class="diet-method-card">
                <div class="diet-method-header">
                    <span class="diet-method-icon">${diet.icon}</span>
                    <span class="diet-method-name">${diet.name}</span>
                </div>
                <div class="diet-method-goal">${diet.goal}</div>
                <div class="diet-method-focus">${diet.focus}</div>
                <div class="diet-method-tips">
                    ${diet.tips.map(tip => `<span class="diet-tip-tag">✓ ${tip}</span>`).join('')}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = dietsHtml;
}

/**
 * 渲染外食族指南
 */
function renderEatingOutGuide(container, customTip) {
    container.innerHTML = `
        <div class="eating-out-motto">
            <span class="motto-icon">💡</span>
            <span class="motto-text">外食不是健康的敵人，「無意識的選擇」才是。</span>
        </div>
        <div class="eating-out-grid">
            ${Object.values(EATING_OUT_GUIDE).map(scene => `
                <div class="eating-out-card">
                    <div class="scene-header">
                        <span class="scene-icon">${scene.icon}</span>
                        <span class="scene-name">${scene.name}</span>
                    </div>
                    <div class="scene-rule">
                        <span class="rule-label">黃金法則：</span>${scene.rule}
                    </div>
                    <div class="scene-recommend">
                        <span class="recommend-label">✅ 推薦：</span>${scene.recommend}
                    </div>
                    <div class="scene-avoid">
                        <span class="avoid-label">❌ 避開：</span>${scene.avoid}
                    </div>
                </div>
            `).join('')}
        </div>
        ${customTip ? `
            <div class="personal-tip">
                <span class="personal-tip-icon">🎯</span>
                <span class="personal-tip-label">專屬建議：</span>
                <span class="personal-tip-text">${customTip}</span>
            </div>
        ` : ''}
    `;
}

/**
 * 渲染微習慣清單
 */
function renderMicroHabits(container) {
    const groupsHtml = Object.values(MICRO_HABITS).map(group => `
        <div class="habit-group">
            <div class="habit-group-name">${group.name}</div>
            <div class="habit-list">
                ${group.habits.map(habit => `
                    <label class="habit-item">
                        <input type="checkbox" class="habit-checkbox" data-habit-id="${habit.id}">
                        <span class="habit-checkmark"></span>
                        <div class="habit-content">
                            <div class="habit-title">${habit.title}</div>
                            <div class="habit-desc">${habit.desc}</div>
                        </div>
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="habits-intro">
            <p>循序漸進的小改變，讓健康飲食成為可持續的生活方式</p>
        </div>
        <div class="habits-grid">${groupsHtml}</div>
        <div class="habits-progress">
            <div class="progress-bar">
                <div class="progress-fill" id="habits-progress-fill"></div>
            </div>
            <div class="progress-text">已完成 <span id="habits-count">0</span>/12 個習慣</div>
        </div>
    `;

    // 綁定 checkbox 事件
    container.querySelectorAll('.habit-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateHabitsProgress);
    });
}

/**
 * 更新習慣進度
 */
function updateHabitsProgress() {
    const total = document.querySelectorAll('.habit-checkbox').length;
    const checked = document.querySelectorAll('.habit-checkbox:checked').length;
    const progressFill = document.getElementById('habits-progress-fill');
    const habitsCount = document.getElementById('habits-count');

    if (progressFill && habitsCount) {
        progressFill.style.width = `${(checked / total) * 100}%`;
        habitsCount.textContent = checked;
    }
}

/**
 * 渲染飲食建議
 */
function renderDietRecommendations(category, gender) {
    const data = DIET_RECOMMENDATIONS[category][gender];

    // 標題與副標題
    const sectionHeader = document.querySelector('.section-header');
    sectionHeader.innerHTML = `
        <h2>🍽️ ${data.title}</h2>
        <p class="diet-subtitle">${data.subtitle}</p>
        <p class="gender-note">${data.note}</p>
    `;

    // 營養策略
    const strategyContainer = document.getElementById('nutrition-strategy');
    if (strategyContainer) {
        renderNutritionStrategy(strategyContainer, data.nutritionStrategy);
    }

    // 飲食建議卡片
    const dietCards = document.getElementById('diet-recommendations');
    dietCards.innerHTML = data.tips.map(tip => `
        <div class="diet-card">
            <div class="diet-card-icon">${tip.icon}</div>
            <div class="diet-card-title">${tip.title}</div>
            <div class="diet-card-desc">${tip.desc}</div>
        </div>
    `).join('');

    // 闢謠/提醒區塊
    const mythSection = document.getElementById('myth-buster');
    if (mythSection && data.mythBuster) {
        mythSection.innerHTML = `
            <div class="myth-card">
                <span class="myth-icon">💡</span>
                <div class="myth-content">
                    <div class="myth-title">${data.mythBuster.title}</div>
                    <div class="myth-text">${data.mythBuster.content}</div>
                </div>
            </div>
        `;
        mythSection.style.display = 'block';
    } else if (mythSection) {
        mythSection.style.display = 'none';
    }

    // 營養建議數值
    const nutritionChart = document.getElementById('nutrition-chart');
    const { calories, protein, carbs, fat } = data.nutrition;
    nutritionChart.innerHTML = `
        <div class="nutrition-item">
            <div class="nutrition-label">每日熱量</div>
            <div class="nutrition-value calories">${calories}</div>
            <div class="nutrition-unit">大卡</div>
        </div>
        <div class="nutrition-item">
            <div class="nutrition-label">蛋白質</div>
            <div class="nutrition-value protein">${protein}</div>
            <div class="nutrition-unit">公克</div>
        </div>
        <div class="nutrition-item">
            <div class="nutrition-label">碳水化合物</div>
            <div class="nutrition-value carbs">${carbs}</div>
            <div class="nutrition-unit">公克</div>
        </div>
        <div class="nutrition-item">
            <div class="nutrition-label">脂肪</div>
            <div class="nutrition-value fat">${fat}</div>
            <div class="nutrition-unit">公克</div>
        </div>
    `;

    // 推薦食物
    const foodList = document.getElementById('food-list');
    foodList.innerHTML = data.foods.map(food => `
        <div class="food-item">
            <div class="food-icon">${food.icon}</div>
            <div class="food-name">${food.name}</div>
        </div>
    `).join('');

    // 推薦飲食模式
    const dietMethodsContainer = document.getElementById('diet-methods');
    if (dietMethodsContainer) {
        renderRecommendedDiets(dietMethodsContainer, data.recommendedDiets);
    }

    // 外食族指南
    const eatingOutContainer = document.getElementById('eating-out-guide');
    if (eatingOutContainer) {
        renderEatingOutGuide(eatingOutContainer, data.eatingOutTip);
    }

    // 微習慣清單
    const habitsContainer = document.getElementById('micro-habits');
    if (habitsContainer) {
        renderMicroHabits(habitsContainer);
    }
}

/**
 * 顯示結果
 */
function showResults(bmi, category, gender, idealWeight, bmr) {
    // BMI 數值
    document.getElementById('bmi-value').textContent = bmi.toFixed(1);

    // BMI 分類
    const categoryElement = document.getElementById('bmi-category');
    categoryElement.textContent = BMI_CATEGORIES[category].label;
    categoryElement.className = `bmi-category ${BMI_CATEGORIES[category].class}`;

    // 理想體重
    document.getElementById('ideal-weight').textContent = `${idealWeight.min} - ${idealWeight.max} 公斤`;

    // 基礎代謝率
    document.getElementById('bmr').textContent = `${bmr} 大卡`;

    // 更新量表指針
    updateGaugePointer(bmi);

    // 渲染飲食建議
    renderDietRecommendations(category, gender);

    // 顯示結果區塊
    resultSection.classList.remove('hidden');

    // 滾動到結果區塊
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/**
 * 表單提交處理
 */
bmiForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(bmiForm);
    const gender = formData.get('gender');
    const height = parseFloat(formData.get('height'));
    const weight = parseFloat(formData.get('weight'));
    const age = parseInt(formData.get('age'));

    // 驗證
    if (!gender) {
        alert('請選擇性別！');
        return;
    }

    // 計算
    const bmi = calculateBMI(weight, height);
    const category = getBMICategory(bmi);
    const idealWeight = calculateIdealWeight(height);
    const bmr = calculateBMR(weight, height, age, gender);

    // 顯示結果
    showResults(bmi, category, gender, idealWeight, bmr);
});

/**
 * 重新計算按鈕
 */
recalculateBtn.addEventListener('click', () => {
    resultSection.classList.add('hidden');
    bmiForm.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
