// Mỗi dòng chứa nghĩa tiếng Việt, từ Hàn, từ Trung kèm pinyin và từ Nhật kèm kana.
const starterVocabularyRows = `
người|사람|人 rén|人 ひと
tôi; mình|나|我 wǒ|私 わたし
bạn; người đối diện|너|你 nǐ|あなた
gia đình|가족|家庭 jiātíng|家族 かぞく
mẹ|어머니|妈妈 māma|母 はは
cha|아버지|爸爸 bàba|父 ちち
trẻ em|아이|孩子 háizi|子供 こども
thầy cô; giáo viên|선생님|老师 lǎoshī|先生 せんせい
học sinh|학생|学生 xuésheng|学生 がくせい
bác sĩ|의사|医生 yīshēng|医者 いしゃ
nhà|집|家 jiā|家 いえ
phòng|방|房间 fángjiān|部屋 へや
cửa ra vào|문|门 mén|ドア
cửa sổ|창문|窗户 chuānghu|窓 まど
bàn|책상|桌子 zhuōzi|机 つくえ
ghế|의자|椅子 yǐzi|椅子 いす
sách|책|书 shū|本 ほん
giấy|종이|纸 zhǐ|紙 かみ
bút chì|연필|铅笔 qiānbǐ|鉛筆 えんぴつ
chìa khóa|열쇠|钥匙 yàoshi|鍵 かぎ
điện thoại di động|휴대폰|手机 shǒujī|携帯電話 けいたいでんわ
máy tính|컴퓨터|电脑 diànnǎo|パソコン
tiền|돈|钱 qián|お金 おかね
vé|표|票 piào|切符 きっぷ
bản đồ|지도|地图 dìtú|地図 ちず
ảnh|사진|照片 zhàopiàn|写真 しゃしん
bệnh viện|병원|医院 yīyuàn|病院 びょういん
ngân hàng|은행|银行 yínháng|銀行 ぎんこう
bưu điện|우체국|邮局 yóujú|郵便局 ゆうびんきょく
thư viện|도서관|图书馆 túshūguǎn|図書館 としょかん
công viên|공원|公园 gōngyuán|公園 こうえん
siêu thị|슈퍼마켓|超市 chāoshì|スーパー
nhà hàng|식당|餐厅 cāntīng|レストラン
khách sạn|호텔|酒店 jiǔdiàn|ホテル
sân bay|공항|机场 jīchǎng|空港 くうこう
nhà ga|기차역|火车站 huǒchēzhàn|駅 えき
xe buýt|버스|公交车 gōngjiāochē|バス
taxi|택시|出租车 chūzūchē|タクシー
xe đạp|자전거|自行车 zìxíngchē|自転車 じてんしゃ
tàu điện ngầm|지하철|地铁 dìtiě|地下鉄 ちかてつ
nước|물|水 shuǐ|水 みず
trà|차|茶 chá|お茶 おちゃ
cà phê|커피|咖啡 kāfēi|コーヒー
sữa|우유|牛奶 niúnǎi|牛乳 ぎゅうにゅう
cơm|밥|米饭 mǐfàn|ご飯 ごはん
bánh mì|빵|面包 miànbāo|パン
trứng|달걀|鸡蛋 jīdàn|卵 たまご
cá|생선|鱼 yú|魚 さかな
thịt|고기|肉 ròu|肉 にく
rau|채소|蔬菜 shūcài|野菜 やさい
trái cây|과일|水果 shuǐguǒ|果物 くだもの
táo|사과|苹果 píngguǒ|りんご
chuối|바나나|香蕉 xiāngjiāo|バナナ
muối|소금|盐 yán|塩 しお
đường ăn|설탕|糖 táng|砂糖 さとう
hôm nay|오늘|今天 jīntiān|今日 きょう
hôm qua|어제|昨天 zuótiān|昨日 きのう
ngày mai|내일|明天 míngtiān|明日 あした
bây giờ|지금|现在 xiànzài|今 いま
buổi sáng|아침|早上 zǎoshang|朝 あさ
ban đêm|밤|夜晚 yèwǎn|夜 よる
cuối tuần|주말|周末 zhōumò|週末 しゅうまつ
năm nay|올해|今年 jīnnián|今年 ことし
thời gian|시간|时间 shíjiān|時間 じかん
ngày sinh nhật|생일|生日 shēngrì|誕生日 たんじょうび
thời tiết|날씨|天气 tiānqì|天気 てんき
mưa|비|雨 yǔ|雨 あめ
tuyết|눈|雪 xuě|雪 ゆき
gió|바람|风 fēng|風 かぜ
bầu trời|하늘|天空 tiānkōng|空 そら
núi|산|山 shān|山 やま
biển|바다|大海 dàhǎi|海 うみ
sông|강|河 hé|川 かわ
cây|나무|树 shù|木 き
hoa|꽃|花 huā|花 はな
ăn|먹다|吃 chī|食べる たべる
uống|마시다|喝 hē|飲む のむ
đi|가다|去 qù|行く いく
đến|오다|来 lái|来る くる
nhìn; xem|보다|看 kàn|見る みる
nghe|듣다|听 tīng|聞く きく
nói|말하다|说 shuō|話す はなす
đọc|읽다|读 dú|読む よむ
viết|쓰다|写 xiě|書く かく
mua|사다|买 mǎi|買う かう
bán|팔다|卖 mài|売る うる
đợi|기다리다|等 děng|待つ まつ
gặp|만나다|见面 jiànmiàn|会う あう
học|배우다|学习 xuéxí|学ぶ まなぶ
làm việc|일하다|工作 gōngzuò|働く はたらく
ngủ|자다|睡觉 shuìjiào|寝る ねる
đi bộ|걷다|走路 zǒulù|歩く あるく
chạy|달리다|跑 pǎo|走る はしる
giúp đỡ|돕다|帮助 bāngzhù|助ける たすける
mới|새롭다|新 xīn|新しい あたらしい
to; lớn|크다|大 dà|大きい おおきい
nhỏ|작다|小 xiǎo|小さい ちいさい
đắt|비싸다|贵 guì|高い たかい
rẻ|싸다|便宜 piányi|安い やすい
vui; vui vẻ|즐겁다|开心 kāixīn|楽しい たのしい
`.trim().split('\n');

const starterVocabulary = Object.fromEntries(['ko', 'zh', 'ja'].map((lang, index) => [
 lang, starterVocabularyRows.map(line => {
  const [meaning, ...terms] = line.split('|');
  const [word, phonetic = ''] = terms[index].split(' ');
  return { word, meaning, phonetic, example: '' };
 })
]));

function addStarterVocabulary(words) {
 const marker = 'polyglot_starter_vocabulary_v1';
 if (localStorage.getItem(marker)) return words;

 // Giữ bản ghi và tiến độ của từ đã có, kể cả khi nghĩa do người dùng sửa.
 const existing = new Set(words.map(word => word.lang + ':' + word.word.trim().normalize('NFC')));
 const newWords = Object.entries(starterVocabulary).flatMap(([lang, items]) =>
  items.filter(item => !existing.has(lang + ':' + item.word.normalize('NFC')))
   .map(item => ({ ...item, id: 'starter-v1-' + lang + '-' + item.word, lang, srsLevel: 0 }))
 );
 const updated = words.concat(newWords);
 localStorage.setItem('polyglot_words', JSON.stringify(updated));
 localStorage.setItem(marker, 'true');
 return updated;
}
