/* catalog.ts — SWOT category configuration + sample content (uk).
   Ported 1:1 from the design prototype's data.jsx. */

import type {
  Category,
  CategoryKey,
  Cluster,
  FinalReport,
  SwotMap,
  VoteStats,
} from '../state/types';

/** 4 cosmic categories = 4 SWOT quadrants. */
export const CATS: Record<CategoryKey, Category> = {
  str: {
    key: 'str', planet: 'Зірки', swot: 'Сильні сторони', emoji: '⭐',
    hint: 'що давало нам сили', cssVar: 'str', glow: '255,180,0',
  },
  wek: {
    key: 'wek', planet: 'Чорні діри', swot: 'Слабкі сторони', emoji: '🕳️',
    hint: 'що забирало енергію', cssVar: 'wek', glow: '140,80,255',
  },
  opp: {
    key: 'opp', planet: 'Нові планети', swot: 'Можливості', emoji: '🪐',
    hint: 'що хочемо спробувати', cssVar: 'opp', glow: '40,224,196',
  },
  thr: {
    key: 'thr', planet: 'Метеорити', swot: 'Загрози', emoji: '☄️',
    hint: 'що нам загрожує', cssVar: 'thr', glow: '255,90,70',
  },
};

export const CAT_ORDER: CategoryKey[] = ['str', 'wek', 'opp', 'thr'];

/** Pool of anonymous teacher thoughts used to simulate the "eruption". */
export const IDEA_POOL: Record<CategoryKey, string[]> = {
  str: [
    'Сильна команда вчителів-предметників',
    'Підтримка з боку батьків та громади',
    'Власні традиції, свята й ритуали',
    'Перемоги учнів на районних олімпіадах',
    'Дружня атмосфера в колективі',
    'Досвідчені класні керівники',
    'Гарна бібліотека та читальня',
    'Стабільний розклад і дисципліна',
  ],
  wek: [
    'Застаріле обладнання в кабінетах',
    'Перевантаженість паперовою звітністю',
    'Слабкий інтернет у частині приміщень',
    'Брак мотивації в окремих учнів',
    'Мало інтерактивних дощок',
    'Втома вчителів наприкінці чверті',
    'Не вистачає психолога на повну ставку',
  ],
  opp: [
    'Грант на STEM-лабораторію',
    'Партнерство з місцевим коледжем',
    'Онлайн-курси підвищення кваліфікації',
    'Залучення випускників як менторів',
    'Шкільний медіацентр і подкаст',
    'Проєкти з енергоефективності',
    'Обмінні програми для старшокласників',
  ],
  thr: [
    'Відтік учнів до міських шкіл',
    'Повітряні тривоги та дистанційні дні',
    'Брак молодих педагогічних кадрів',
    'Скорочення фінансування',
    'Вигорання частини колективу',
    'Демографічний спад у селі',
  ],
};

/** Grouped "planets" (simulated AI response) — for the clustering phase. */
export const SAMPLE_CLUSTERS: Cluster[] = [
  { cat: 'str', title: 'Команда та люди', emoji: '⭐', percentage: 34 },
  { cat: 'str', title: 'Традиції ліцею', emoji: '🎓', percentage: 18 },
  { cat: 'wek', title: 'Інфраструктура', emoji: '🛰️', percentage: 22 },
  { cat: 'opp', title: 'Гранти та партнерства', emoji: '🪐', percentage: 16 },
  { cat: 'thr', title: 'Зовнішні ризики', emoji: '☄️', percentage: 10 },
];

/** Final "star map" — constellations by corner (2–3 planets per quadrant). */
export const STAR_MAP: SwotMap = {
  str: [
    { title: 'Команда та люди', emoji: '⭐', percentage: 40 },
    { title: 'Традиції ліцею', emoji: '🎓', percentage: 35 },
    { title: 'Сильні учні', emoji: '🌟', percentage: 25 },
  ],
  wek: [
    { title: 'Інфраструктура', emoji: '🛰️', percentage: 55 },
    { title: 'Документообіг', emoji: '🌀', percentage: 45 },
  ],
  opp: [
    { title: 'Гранти', emoji: '🪐', percentage: 50 },
    { title: 'Партнерства', emoji: '🌍', percentage: 30 },
    { title: 'Медіацентр', emoji: '📡', percentage: 20 },
  ],
  thr: [
    { title: 'Відтік учнів', emoji: '☄️', percentage: 48 },
    { title: 'Кадровий голод', emoji: '🌑', percentage: 52 },
  ],
};

/** Sample vote tally (demo + graceful fallback) — proportions and similar votes. */
export const SAMPLE_STATS: VoteStats = {
  total: 50,
  unique: 21,
  byCategory: { str: 18, wek: 12, opp: 11, thr: 9 },
  themes: [
    { text: 'Сильна команда вчителів-предметників', count: 6, cat: 'str' },
    { text: 'Застаріле обладнання в кабінетах', count: 5, cat: 'wek' },
    { text: 'Грант на STEM-лабораторію', count: 4, cat: 'opp' },
    { text: 'Відтік учнів до міських шкіл', count: 4, cat: 'thr' },
    { text: 'Підтримка з боку батьків та громади', count: 3, cat: 'str' },
  ],
};

/** TOP-3 priorities + synthesized-voice conclusion. */
export const FINAL_REPORT: FinalReport = {
  priorities: [
    'Оновити цифрову інфраструктуру кабінетів',
    'Запустити STEM-лабораторію на грантові кошти',
    'Створити програму менторства випускників',
  ],
  conclusion:
    'Аналіз завершено. Бортовий журнал сформовано. Головні пріоритети на наступний рік: ' +
    'Перше — оновити цифрову інфраструктуру кабінетів. ' +
    'Друге — запустити STEM-лабораторію на грантові кошти. ' +
    'Третє — створити програму менторства випускників. Бажаю успішного польоту, екіпаж.',
  recommendations: [
    'Скласти дорожню карту оновлення кабінетів на 12 місяців із відповідальними особами та термінами.',
    'Подати щонайменше дві грантові заявки на STEM-обладнання до кінця семестру.',
    'Запровадити щомісячні зустрічі-менторства випускників зі старшокласниками.',
    'Розробити програму підтримки вчителів та запобігання вигоранню.',
    'Покращити облаштування укриття й протоколи навчання під час повітряних тривог.',
  ],
  summary:
    'Команда вчителів — головна сила ліцею, а традиції та сильні учні підсилюють її. ' +
    'Водночас застаріла інфраструктура й перевантаженість звітністю стримують розвиток. ' +
    'Гранти, партнерства та медіацентр відкривають нові орбіти, тож фокус наступного року — ' +
    'оновлення кабінетів, запуск STEM-лабораторії та менторство, з увагою до безпеки й добробуту команди.',
  stats: SAMPLE_STATS,
};

/** Critical mass of ideas. */
export const THRESHOLD = 50;

/** Max planets the star-map/report layout supports per SWOT quadrant. */
export const MAX_PLANETS = 3;

/** Join link shown on the start screen. */
export const LINK = 'liceum-1946.space';
