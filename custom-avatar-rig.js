/**
 * AVATAR WORLD ILLUSTRATED CHARACTER CREATOR ENGINE (v20261102_3)
 * Uses 15 custom-illustrated 2D Chibi Friend Characters in the exact art style of Danika World
 * + 20 illustrated 2D accessories + 12 illustrated interactive hand props!
 */

window.AVATAR_CREATOR_CATALOG = {
  friends: [
    {
      id: 'friend_01',
      title: '🌸 Софія (Полуничка)',
      img: 'assets/characters/friends/friend_01.png',
      skinTone: 'fair',
      hairStyle: 'twin_tails',
      hairColor: 'strawberry',
      top: 'hoodie_strawberry',
      desc: 'Ніжна подружка з рожевими хвостиками у худі з полуничкою'
    },
    {
      id: 'friend_02',
      title: '👑 Принцеса Аврора',
      img: 'assets/characters/friends/friend_02.png',
      skinTone: 'peach',
      hairStyle: 'long_waves',
      hairColor: 'lilac',
      top: 'dress_princess',
      desc: 'Казкова принцеса з лавандовими локонами та діадемою'
    },
    {
      id: 'friend_03',
      title: '🌈 Мія (Веселка)',
      img: 'assets/characters/friends/friend_03.png',
      skinTone: 'sunkissed',
      hairStyle: 'space_buns',
      hairColor: 'chocolate',
      top: 'overalls_rainbow',
      desc: 'Весела дослідниця у джинсовому комбінезоні та жовтих чобітках'
    },
    {
      id: 'friend_04',
      title: '🎧 Кіра (Геймерка)',
      img: 'assets/characters/friends/friend_04.png',
      skinTone: 'olive',
      hairStyle: 'bob_cat',
      hairColor: 'mint',
      top: 'jacket_neon',
      desc: 'Крута геймерка з м’ятним каре та котячими навушниками'
    },
    {
      id: 'friend_05',
      title: '💖 Зоя (Стильна Зірка)',
      img: 'assets/characters/friends/friend_05.png',
      skinTone: 'cocoa',
      hairStyle: 'curly_puff',
      hairColor: 'chocolate',
      top: 'dress_coral',
      desc: 'Модниця з пишними кучерями, золотими бантиками та окулярами-серденьками'
    },
    {
      id: 'friend_06',
      title: '🎨 Емма (Художниця)',
      img: 'assets/characters/friends/friend_06.png',
      skinTone: 'fair',
      hairStyle: 'braids_ginger',
      hairColor: 'ginger',
      top: 'artist_apron',
      desc: 'Творча художниця з рудими косичками, веснянками та пензликом'
    },
    {
      id: 'friend_07',
      title: '🛹 Алекс (Скейтер)',
      img: 'assets/characters/friends/friend_07.png',
      skinTone: 'peach',
      hairStyle: 'sporty_spiky',
      hairColor: 'chestnut',
      top: 'varsity_red',
      desc: 'Спортивний друг у червоному бомбері зі скейтбордом'
    },
    {
      id: 'friend_08',
      title: '🏖️ Лукас (Серфер)',
      img: 'assets/characters/friends/friend_08.png',
      skinTone: 'sunkissed',
      hairStyle: 'curly_cap',
      hairColor: 'golden',
      top: 'hoodie_beach',
      desc: 'Друг із пляжу Гандії у бірюзовому худі та бейсболці'
    },
    {
      id: 'friend_09',
      title: '🎤 Белла (Поп-Зірка)',
      img: 'assets/characters/friends/friend_09.png',
      skinTone: 'peach',
      hairStyle: 'ponytail',
      hairColor: 'golden',
      top: 'popstar_pink',
      desc: 'Співачка з високим золотистим хвостиком у блискучому костюмі'
    },
    {
      id: 'friend_10',
      title: '🧚‍♀️ Фея Стефанія',
      img: 'assets/characters/friends/friend_10.png',
      skinTone: 'fair',
      hairStyle: 'rainbow_fairy',
      hairColor: 'strawberry',
      top: 'dress_fairy',
      desc: 'Чарівна фея з крильцями метелика та зірковою паличкою'
    },
    {
      id: 'friend_11',
      title: '👓 Юкі (Академія)',
      img: 'assets/characters/friends/friend_11.png',
      skinTone: 'peach',
      hairStyle: 'hime_black',
      hairColor: 'black',
      top: 'school_blazer',
      desc: 'Розумниця-відмінниця у шкільній формі та окулярах'
    },
    {
      id: 'friend_12',
      title: '🌺 Флора (Літо)',
      img: 'assets/characters/friends/friend_12.png',
      skinTone: 'bronze',
      hairStyle: 'flower_waves',
      hairColor: 'chestnut',
      top: 'dress_sunflower',
      desc: 'Сонячна дівчинка у квітковому віночку та літній сукенці'
    },
    {
      id: 'friend_13',
      title: '🐰 Лілі (Піжамка Зайчик)',
      img: 'assets/characters/friends/friend_13.png',
      skinTone: 'fair',
      hairStyle: 'pink_curls',
      hairColor: 'strawberry',
      top: 'onesie_bunny',
      desc: 'Мила подружка у пухнастому костюмі зайчика та капцях'
    },
    {
      id: 'friend_14',
      title: '🔬 Професор Макс',
      img: 'assets/characters/friends/friend_14.png',
      skinTone: 'olive',
      hairStyle: 'scientist_curls',
      hairColor: 'black',
      top: 'lab_coat',
      desc: 'Юний винахідник і вчений у білому лабораторному халаті'
    },
    {
      id: 'friend_15',
      title: '🌹 Кармен (Іспанія)',
      img: 'assets/characters/friends/friend_15.png',
      skinTone: 'sunkissed',
      hairStyle: 'braids_rose',
      hairColor: 'ruby',
      top: 'dress_flamenco',
      desc: 'Іспанська танцівниця з Гандії з трояндою у волоссі'
    }
  ],

  skinTones: [
    { id: 'fair', title: 'Порцелянова', fill: '#ffefe2', outline: '#d9a078', defaultFriend: 'friend_01' },
    { id: 'peach', title: 'Теплий персик', fill: '#ffdfc4', outline: '#d4946a', defaultFriend: 'friend_02' },
    { id: 'sunkissed', title: 'Сонячна карамель', fill: '#f1c27d', outline: '#b87d38', defaultFriend: 'friend_03' },
    { id: 'olive', title: 'Золотиста олива', fill: '#e0ac69', outline: '#9c682b', defaultFriend: 'friend_04' },
    { id: 'bronze', title: 'Тропічна бронза', fill: '#c68642', outline: '#845018', defaultFriend: 'friend_12' },
    { id: 'cocoa', title: 'Шоколадне какао', fill: '#8d5524', outline: '#522c0a', defaultFriend: 'friend_05' }
  ],

  hairStyles: [
    { id: 'twin_tails', title: 'Два хвостики з бантиками', icon: '🎀', friendId: 'friend_01' },
    { id: 'long_waves', title: 'Довгі локони принцеси', icon: '👸', friendId: 'friend_02' },
    { id: 'space_buns', title: 'Пучки Space Buns', icon: '👧', friendId: 'friend_03' },
    { id: 'bob_cat', title: 'М’ятне каре з вушками', icon: '🎧', friendId: 'friend_04' },
    { id: 'curly_puff', title: 'Пишні афро-кучері', icon: '☁️', friendId: 'friend_05' },
    { id: 'braids_ginger', title: 'Руді косички з беретом', icon: '🎨', friendId: 'friend_06' },
    { id: 'sporty_spiky', title: 'Спортивний їжачок', icon: '⚡', friendId: 'friend_07' },
    { id: 'curly_cap', title: 'Блонд кучері з кепкою', icon: '🧢', friendId: 'friend_08' },
    { id: 'ponytail', title: 'Високий хвостик Зірки', icon: '🎤', friendId: 'friend_09' },
    { id: 'rainbow_fairy', title: 'Веселкові пасма Феї', icon: '🧚‍♀️', friendId: 'friend_10' },
    { id: 'hime_black', title: 'Рівне чорне волосся', icon: '👓', friendId: 'friend_11' },
    { id: 'flower_waves', title: 'Хвилі з квітковим вінком', icon: '🌺', friendId: 'friend_12' },
    { id: 'pink_curls', title: 'Капюшон Зайчика', icon: '🐰', friendId: 'friend_13' },
    { id: 'scientist_curls', title: 'Кучері Професора', icon: '🔬', friendId: 'friend_14' },
    { id: 'braids_rose', title: 'Косички з трояндою', icon: '🌹', friendId: 'friend_15' }
  ],

  hairColors: [
    { id: 'natural', title: 'Оригінальний колір', main: '#f6c85f', hi: '#fff1a8', shade: '#d4982a', filter: 'none' },
    { id: 'strawberry', title: 'Рожева полуниця', main: '#ff7eb6', hi: '#ffb8d8', shade: '#d64584', filter: 'hue-rotate(325deg) saturate(1.22)' },
    { id: 'lilac', title: 'Лавандова мрія', main: '#b388ff', hi: '#e1ceff', shade: '#7c4dff', filter: 'hue-rotate(255deg) saturate(1.18)' },
    { id: 'mint', title: 'М’ятна бірюза', main: '#4cd9b0', hi: '#9ef5db', shade: '#1f9e79', filter: 'hue-rotate(155deg) saturate(1.15)' },
    { id: 'golden', title: 'Сонячне золото', main: '#ffd54f', hi: '#fff59d', shade: '#f9a825', filter: 'sepia(0.18) saturate(1.25) brightness(1.04)' },
    { id: 'ruby', title: 'Рубінова вишня', main: '#e53935', hi: '#ff7961', shade: '#991513', filter: 'hue-rotate(345deg) saturate(1.3)' }
  ],

  tops: [
    { id: 'hoodie_strawberry', title: 'Худі з полуничкою та спідничка', icon: '🍓', friendId: 'friend_01' },
    { id: 'dress_princess', title: 'Лавандова сукня принцеси', icon: '👑', friendId: 'friend_02' },
    { id: 'overalls_rainbow', title: 'Джинсовий комбінезон Веселка', icon: '🌈', friendId: 'friend_03' },
    { id: 'jacket_neon', title: 'Неоновий геймерський бомбер', icon: '🎮', friendId: 'friend_04' },
    { id: 'dress_coral', title: 'Коралова святкова сукня', icon: '💖', friendId: 'friend_05' },
    { id: 'artist_apron', title: 'Фартушок та смугаста кофтинка', icon: '🎨', friendId: 'friend_06' },
    { id: 'varsity_red', title: 'Червоний спортивний бомбер', icon: '🛹', friendId: 'friend_07' },
    { id: 'hoodie_beach', title: 'Бірюзове пляжне худі', icon: '🏖️', friendId: 'friend_08' },
    { id: 'popstar_pink', title: 'Сценічний костюм Поп-Зірки', icon: '🎤', friendId: 'friend_09' },
    { id: 'dress_fairy', title: 'Сукня Феї з крильцями', icon: '🧚‍♀️', friendId: 'friend_10' },
    { id: 'school_blazer', title: 'Шкільна форма Академії', icon: '🏫', friendId: 'friend_11' },
    { id: 'dress_sunflower', title: 'Літній сарафан з ромашками', icon: '🌼', friendId: 'friend_12' },
    { id: 'onesie_bunny', title: 'Піжамка Кігурумі-Зайчик', icon: '🐰', friendId: 'friend_13' },
    { id: 'lab_coat', title: 'Білий халат Науковця', icon: '🔬', friendId: 'friend_14' },
    { id: 'dress_flamenco', title: 'Іспанська сукня Фламенко', icon: '💃', friendId: 'friend_15' }
  ],

  hats: [
    { id: 'none', title: 'Без додаткового убору', icon: '⚪', img: '' },
    { id: 'acc_crown', title: 'Золота Корона 👑', icon: '👑', img: 'assets/accessories/acc_crown.png' },
    { id: 'acc_bow_headband', title: 'Обруч з Бантиком 🎀', icon: '🎀', img: 'assets/accessories/acc_bow_headband.png' },
    { id: 'acc_flower_wreath', title: 'Квітковий Віночок 🌸', icon: '🌸', img: 'assets/accessories/acc_flower_wreath.png' },
    { id: 'acc_headphones', title: 'Геймерські Навушники 🎧', icon: '🎧', img: 'assets/accessories/acc_headphones.png' },
    { id: 'acc_glasses_heart', title: 'Рожеві Окуляри 🕶️', icon: '🕶️', img: 'assets/accessories/acc_glasses_heart.png' },
    { id: 'acc_smart_glasses', title: 'Окуляри Розумниці 👓', icon: '👓', img: 'assets/accessories/acc_smart_glasses.png' },
    { id: 'acc_cat_beanie', title: 'Шапочка з Вушками 🐱', icon: '🐱', img: 'assets/accessories/acc_cat_beanie.png' },
    { id: 'acc_artist_beret', title: 'Берет Художниці 🎨', icon: '🎨', img: 'assets/accessories/acc_artist_beret.png' },
    { id: 'acc_mermaid_tiara', title: 'Тіара Русалоньки 🧜‍♀️', icon: '🧜‍♀️', img: 'assets/accessories/acc_mermaid_tiara.png' },
    { id: 'acc_panama_hat', title: 'Панамка Gandia 👒', icon: '👒', img: 'assets/accessories/acc_panama_hat.png' },
    { id: 'acc_cap_abece', title: 'Кепка Abecé 🧢', icon: '🧢', img: 'assets/accessories/acc_cap_abece.png' },
    { id: 'acc_star_clips', title: 'Шпильки-Зірочки ✨', icon: '✨', img: 'assets/accessories/acc_star_clips.png' }
  ],

  handItems: [
    { id: 'none', title: 'Вільні ручки', icon: '✋', img: '' },
    { id: 'acc_star_wand', title: 'Чарівна Паличка ⭐', icon: '🪄', img: 'assets/accessories/acc_star_wand.png' },
    { id: 'prop_pizza_cupcake', title: 'Капкейк та Піца 🧁', icon: '🧁', img: 'assets/props/world_interactive/prop_pizza_cupcake.png' },
    { id: 'prop_smoothie_blender', title: 'Полуничний Коктейль 🍓', icon: '🥤', img: 'assets/props/world_interactive/prop_smoothie_blender.png' },
    { id: 'prop_guitar_mic', title: 'Гітара та Мікрофон 🎸', icon: '🎸', img: 'assets/props/world_interactive/prop_guitar_mic.png' },
    { id: 'prop_globe_book', title: 'Книга Пригод 📖', icon: '📖', img: 'assets/props/world_interactive/prop_globe_book.png' },
    { id: 'prop_bruno_trophy', title: 'Золотий Кубок 🏆', icon: '🏆', img: 'assets/props/world_interactive/prop_bruno_trophy.png' },
    { id: 'acc_crossbody_bag', title: 'Веселкова Сумочка 👜', icon: '👜', img: 'assets/accessories/acc_crossbody_bag.png' },
    { id: 'prop_blooming_plant', title: 'Квіточка в горщику 🌸', icon: '🌸', img: 'assets/props/world_interactive/prop_blooming_plant.png' }
  ]
};

window.renderModularAvatarSvg = function(cfg) {
  const cat = window.AVATAR_CREATOR_CATALOG;
  if (!cfg) cfg = {};

  // Find the chosen illustrated friend character
  let friendObj = cat.friends.find(f => f.id === cfg.friendId);
  if (!friendObj && cfg.top) {
    const topMatch = cat.tops.find(t => t.id === cfg.top);
    if (topMatch && topMatch.friendId) {
      friendObj = cat.friends.find(f => f.id === topMatch.friendId);
    }
  }
  if (!friendObj && cfg.hairStyle) {
    const hairMatch = cat.hairStyles.find(h => h.id === cfg.hairStyle);
    if (hairMatch && hairMatch.friendId) {
      friendObj = cat.friends.find(f => f.id === hairMatch.friendId);
    }
  }
  if (!friendObj) {
    friendObj = cat.friends[0];
  }

  const hairColObj = cat.hairColors.find(c => c.id === cfg.hairColor) || cat.hairColors[0];
  const imgFilter = (hairColObj && hairColObj.id !== 'natural' && hairColObj.filter) ? hairColObj.filter : 'none';

  const hatObj = cat.hats.find(h => h.id === cfg.hat) || cat.hats[0];
  const handObj = cat.handItems.find(i => i.id === cfg.handItem) || cat.handItems[0];

  const hatHtml = (hatObj && hatObj.img)
    ? `<img src="${hatObj.img}" alt="${hatObj.title}" class="custom-illustrated-hat-layer" draggable="false">`
    : '';

  const handHtml = (handObj && handObj.img)
    ? `<img src="${handObj.img}" alt="${handObj.title}" class="custom-illustrated-hand-layer" draggable="false">`
    : '';

  return `
    <div class="custom-illustrated-avatar-rig" data-friend-id="${friendObj.id}">
      <img src="${friendObj.img}" alt="${friendObj.title}" class="custom-illustrated-body-img" style="filter:${imgFilter};" draggable="false">
      ${hatHtml}
      ${handHtml}
    </div>
  `;
};
