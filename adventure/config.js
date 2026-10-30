/* 每套装扮路程约10秒。资源文件保留原命名，显示顺序在此配置。 */
window.ADVENTURE_CONFIG = {
  "duration": 30,
  "hero": {
    "src": "",
    "label": "主角形象",
    "color": "#e3432f"
  },
  "portrait": {
    "src": "",
    "label": "主角介绍照片"
  },
  "mapBackground": {
    "src": "",
    "label": "地图背景（可选）"
  },
  "station": {
    "src": "",
    "label": "终点售票站"
  },
  "coin": {
    "src": "",
    "label": "金币"
  },
  "monster": {
    "src": "",
    "label": "怪物",
    "color": "#a65829"
  },
  "mushroom": {
    "src": "",
    "label": "变装蘑菇"
  },
  "friends": [
    {
      "src": "",
      "label": "终点伙伴 1",
      "color": "#ebba5e"
    },
    {
      "src": "",
      "label": "终点伙伴 2",
      "color": "#8baa80"
    },
    {
      "src": "",
      "label": "终点伙伴 3",
      "color": "#ad91c2"
    }
  ],
  "levels": [
    {
      "name": "西双版纳",
      "subtitle": "从曼听公园出发，穿过雨林，走进基诺山",
      "theme": [
        "#6eafff",
        "#49b94b",
        "#258b36"
      ],
      "background": {
        "src": "",
        "label": "莎1-1 · 曼听公园",
        "scene": "banna-manting"
      },
      "destination": "普洱",
      "ticketTitle": "下一站：普洱",
      "ticketText": "从西双版纳出发，下一站是普洱。带上这一程的回忆，继续出发。",
      "introTitle": "本关的初始英雄",
      "introText": "粉色长发搭配白色挂脖上衣与浅灰阔腿裤，清爽利落，轻轻松松开启热带旅程。",
      "outfits": [
        {
          "src": "assets/banna/莎1-2.png",
          "label": "莎1-2",
          "flipX": true,
          "color": "#f0f0df",
          "text": "米色棒球帽、薄荷绿套裙与白色薄外套，配上棕色挎包，把清新穿进雨林。",
          "background": {
            "src": "",
            "label": "莎1-2 · 望天树空中走廊",
            "variant": 1,
            "scene": "banna-canopy"
          },
          "frame": [
            423,
            57,
            387,
            1164
          ],
          "renderWidth": 36,
          "renderHeight": 62,
          "walkBob": true
        },
        {
          "src": "assets/banna/莎1-3.png",
          "label": "莎1-3",
          "color": "#46b877",
          "text": "灰色长外套搭配浅蓝长裤，亮眼的红色长靴，为山林旅途添上一点活力。",
          "background": {
            "src": "",
            "label": "莎1-3 · 基诺山",
            "variant": 2,
            "scene": "banna-jinuo"
          },
          "frame": [
            23,
            67,
            1052,
            1279
          ],
          "renderWidth": 66,
          "renderHeight": 62,
          "walkBob": true
        }
      ],
      "galleryTitle": "西双版纳·旅程回忆",
      "galleryText": "和这一程的伙伴，一起把此刻留下。",
      "galleryUrl": "",
      "gallery": [
        {
          "src": "",
          "label": "西双版纳 · 我们的合照",
          "text": "从曼听公园到雨林与基诺山，和伙伴们一起，把热带的风和笑容装进行囊。下一站，普洱。"
        }
      ],
      "origin": "西双版纳",
      "mapIcon": {
        "src": "",
        "label": "西双版纳 · 傣族寺塔与棕榈"
      },
      "outfitOrder": "sequential",
      "hero": {
        "src": "assets/banna/莎1-1.png",
        "label": "莎1-1",
        "flipX": true,
        "frame": [
          356,
          27,
          361,
          1380
        ],
        "renderWidth": 34,
        "renderHeight": 62,
        "walkBob": true
      },
      "portrait": {
        "src": "assets/banna/莎1-1.png",
        "label": "莎1-1",
        "frame": [
          356,
          27,
          361,
          1380
        ]
      },
      "friends": [
        {
          "src": "assets/banna/终点1-1.png",
          "label": "终点1-1",
          "frame": [
            400,
            7,
            581,
            1236
          ]
        },
        {
          "src": "assets/banna/终点1-2.png",
          "label": "终点1-2",
          "frame": [
            414,
            25,
            385,
            1232
          ]
        },
        {
          "src": "assets/banna/终点1-3.png",
          "label": "终点1-3",
          "frame": [
            336,
            13,
            697,
            1223
          ]
        }
      ],
      "photoScene": "banna-jinuo"
    },
    {
      "name": "普洱",
      "subtitle": "从普洱站出发，经过酒店，开启茶咖之旅",
      "theme": [
        "#273168",
        "#5365ad",
        "#394989"
      ],
      "background": {
        "src": "",
        "label": "普洱市区 · 普洱站与维也纳酒店",
        "scene": "puer-city"
      },
      "destination": "昆明",
      "ticketTitle": "下一站：昆明",
      "ticketText": "从普洱出发，下一站是昆明。带上这一程的回忆，继续出发。",
      "introTitle": "本关的初始英雄",
      "introText": "米色棒球帽与白色薄外套，搭配浅蓝系带上衣、蓝色阔腿裤和黑色小挎包，舒适又轻快。",
      "outfits": [
        {
          "src": "assets/puer/莎2-2.png",
          "label": "普洱第一次变装 · 莎2-2",
          "color": "#db9234",
          "text": "宽松的白色印花长袖搭配蓝色牛仔裤与米色帽子，随性自在，正适合咖啡庄园的微风。",
          "background": {
            "src": "",
            "label": "普洱咖啡庄园 · 山林咖啡树与晒豆架",
            "variant": 1,
            "scene": "puer-coffee"
          },
          "frame": [
            282,
            27,
            890,
            997
          ],
          "renderWidth": 64,
          "renderHeight": 60
        },
        {
          "src": "assets/puer/莎2-3.png",
          "label": "普洱第二次变装 · 莎2-3（双人）",
          "color": "#794fe5",
          "text": "白色印花上衣与牛仔裤组成默契双人装，骑肩伙伴带着笑容加入旅程。",
          "background": {
            "src": "",
            "label": "思茅老街 · 戴家巷与茶咖店铺",
            "variant": 2,
            "scene": "puer-old-street"
          },
          "frame": [
            349,
            6,
            629,
            1227
          ],
          "renderWidth": 56,
          "renderHeight": 66,
          "premium": true,
          "invincible": true,
          "supportTitle": "高级外援已触发",
          "supportText": "强力伙伴前来助阵！无敌状态已开启：碰撞怪物不受伤，落坑自动救援，持续至本关结束。"
        }
      ],
      "galleryTitle": "普洱·旅程回忆",
      "galleryText": "和这一程的伙伴，一起把此刻留下。",
      "galleryUrl": "",
      "gallery": [
        {
          "src": "",
          "label": "普洱 · 我们的合照",
          "text": "穿过茶咖香气与思茅老街，外援和伙伴们都到齐了。这一程的默契，带去下一站昆明。"
        }
      ],
      "origin": "普洱",
      "mapIcon": {
        "src": "",
        "label": "普洱 · 茶芽与茶杯"
      },
      "hero": {
        "src": "assets/puer/莎2-1.png",
        "label": "普洱初始形象 · 莎2-1",
        "frame": [
          344,
          43,
          462,
          1336
        ],
        "renderWidth": 48,
        "renderHeight": 60
      },
      "portrait": {
        "src": "assets/puer/莎2-1.png",
        "label": "普洱初始形象 · 莎2-1",
        "frame": [
          344,
          43,
          462,
          1336
        ],
        "renderWidth": 48,
        "renderHeight": 60
      },
      "outfitOrder": "sequential",
      "friends": [
        {
          "src": "assets/puer/终点2-1.png",
          "label": "普洱终点伙伴 1",
          "frame": [
            443,
            37,
            378,
            1188
          ]
        },
        {
          "src": "assets/puer/终点2-2.png",
          "label": "普洱终点伙伴 2",
          "frame": [
            441,
            32,
            461,
            1186
          ]
        }
      ],
      "photoScene": "puer-old-street"
    },
    {
      "name": "昆明",
      "subtitle": "从滇池晚霞出发，走进花市，再到春城庭园",
      "theme": [
        "#f9ae65",
        "#5d9f4b",
        "#377a3b"
      ],
      "background": {
        "src": "",
        "label": "昆明 · 滇池晚霞",
        "scene": "kunming-lake"
      },
      "destination": "成都",
      "ticketTitle": "下一站：成都",
      "ticketText": "从昆明出发，下一站是成都。成都是本次旅程的终点。",
      "introTitle": "本关的初始英雄",
      "introText": "粉色鲜花花环点亮浅绿短袖与蓝色牛仔裤，清新柔和，和花市的缤纷刚好相配。",
      "outfits": [
        {
          "src": "assets/kunming/莎3-1.png",
          "label": "莎3-1",
          "color": "#e55d94",
          "text": "彩色条纹外套搭配薄荷绿上衣、蓝色牛仔裤和米色棒球帽，把春城的明亮色彩穿在身上。",
          "background": {
            "src": "",
            "label": "莎3-2 · 昆明花卉市场",
            "variant": 1,
            "scene": "kunming-flowers"
          },
          "frame": [
            89,
            72,
            775,
            1326
          ],
          "renderWidth": 64,
          "renderHeight": 62,
          "walkBob": true
        },
        {
          "src": "assets/kunming/莎3-3.png",
          "label": "莎3-3",
          "color": "#419dd0",
          "text": "白色帽子、无袖上衣和垂坠阔腿裤，配上粉色长发与黑色小挎包，比个爱心继续出发。",
          "background": {
            "src": "",
            "label": "莎3-3 · 春城庭园",
            "variant": 2,
            "scene": "kunming-garden"
          },
          "frame": [
            359,
            42,
            481,
            1335
          ],
          "renderWidth": 40,
          "renderHeight": 62,
          "walkBob": true
        }
      ],
      "galleryTitle": "昆明·旅程回忆",
      "galleryText": "和这一程的伙伴，一起把此刻留下。",
      "galleryUrl": "",
      "gallery": [
        {
          "src": "",
          "label": "昆明 · 我们的合照",
          "text": "在春城的晚霞下，和伙伴们留下一张合照。云南之旅的回忆装好了，下一站，终点成都。"
        }
      ],
      "origin": "昆明",
      "mapIcon": {
        "src": "",
        "label": "昆明 · 鲜花"
      },
      "outfitOrder": "sequential",
      "hero": {
        "src": "assets/kunming/莎3-2.png",
        "label": "昆明初始英雄 · 花环装",
        "flipX": true,
        "frame": [
          485,
          5,
          531,
          1069
        ],
        "renderWidth": 48,
        "renderHeight": 62,
        "walkBob": true
      },
      "portrait": {
        "src": "assets/kunming/莎3-2.png",
        "label": "莎3-2",
        "frame": [
          485,
          5,
          531,
          1069
        ],
        "renderWidth": 48,
        "renderHeight": 62,
        "walkBob": true
      },
      "friends": [
        {
          "src": "assets/kunming/终点3-1.png",
          "label": "终点3-1",
          "frame": [
            450,
            54,
            374,
            1166
          ]
        },
        {
          "src": "assets/kunming/终点3-2.png",
          "label": "终点3-2",
          "frame": [
            178,
            52,
            958,
            1161
          ]
        },
        {
          "src": "assets/kunming/终点3-3.png",
          "label": "终点3-3",
          "frame": [
            293,
            90,
            578,
            1121
          ]
        }
      ],
      "photoScene": "kunming-lake"
    }
  ]
};
