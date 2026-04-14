/** JIS X 0401 に基づく都道府県コード順（北海道=1 〜 沖縄=47） */
const PREFECTURE_ORDER: Record<string, number> = {
  北海道: 1,
  青森県: 2,
  岩手県: 3,
  宮城県: 4,
  秋田県: 5,
  山形県: 6,
  福島県: 7,
  茨城県: 8,
  栃木県: 9,
  群馬県: 10,
  埼玉県: 11,
  千葉県: 12,
  東京都: 13,
  神奈川県: 14,
  新潟県: 15,
  富山県: 16,
  石川県: 17,
  福井県: 18,
  山梨県: 19,
  長野県: 20,
  岐阜県: 21,
  静岡県: 22,
  愛知県: 23,
  三重県: 24,
  滋賀県: 25,
  京都府: 26,
  大阪府: 27,
  兵庫県: 28,
  奈良県: 29,
  和歌山県: 30,
  鳥取県: 31,
  島根県: 32,
  岡山県: 33,
  広島県: 34,
  山口県: 35,
  徳島県: 36,
  香川県: 37,
  愛媛県: 38,
  高知県: 39,
  福岡県: 40,
  佐賀県: 41,
  長崎県: 42,
  熊本県: 43,
  大分県: 44,
  宮崎県: 45,
  鹿児島県: 46,
  沖縄県: 47,
}

/**
 * 場所名から都道府県順の番号を返す。
 * カスタム場所（PREFECTURE_ORDER に含まれない名前）は Infinity を返す。
 */
export function getPrefectureOrder(locationName: string): number {
  return PREFECTURE_ORDER[locationName] ?? Infinity
}

/**
 * Location 配列を都道府県順（北海道→沖縄）に並べ替える。
 * カスタム場所は末尾に五十音順で並ぶ。
 */
export function sortLocationsByPrefectureOrder<T extends { name: string }>(
  locations: T[]
): T[] {
  return [...locations].sort((a, b) => {
    const orderA = getPrefectureOrder(a.name)
    const orderB = getPrefectureOrder(b.name)
    if (orderA !== orderB) return orderA - orderB
    // 両方カスタム場所の場合は五十音順
    return a.name.localeCompare(b.name, 'ja')
  })
}

/**
 * items 配列を都道府県順でソートする比較関数を返す。
 * カスタム場所は常に末尾。昇順/降順は都道府県間のみ反転。
 */
export function compareByPrefectureOrder(
  nameA: string,
  nameB: string,
  dir: 'asc' | 'desc'
): number {
  const orderA = getPrefectureOrder(nameA)
  const orderB = getPrefectureOrder(nameB)

  // どちらかがカスタム場所（Infinity）なら常に末尾
  if (orderA === Infinity && orderB === Infinity) {
    return nameA.localeCompare(nameB, 'ja')
  }
  if (orderA === Infinity) return 1
  if (orderB === Infinity) return -1

  return dir === 'asc' ? orderA - orderB : orderB - orderA
}
