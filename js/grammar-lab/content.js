// Dữ liệu tách khỏi giao diện. ID ổn định để lịch sử học tồn tại qua các lần cập nhật.
const grammarLabContent = (() => {
 const languages = {
  en: { name:'Tiếng Anh', levels:['A1','A2','B1','B2','C1','C2'] },
  ko: { name:'Tiếng Hàn', levels:['TOPIK 1','TOPIK 2','TOPIK 3','TOPIK 4','TOPIK 5','TOPIK 6'] },
  zh: { name:'Tiếng Trung', levels:['HSK 1','HSK 2','HSK 3','HSK 4','HSK 5','HSK 6'] },
  ja: { name:'Tiếng Nhật', levels:['N5','N4','N3','N2','N1'] }
 };
 const types = {
  choice:'Trắc nghiệm', blank:'Điền từ', order:'Sắp xếp câu', detect:'Tìm lỗi sai',
  correct:'Sửa lỗi sai', transform:'Viết lại câu', translate:'Dịch sang ngoại ngữ',
  reverse:'Dịch sang tiếng Việt', context:'Chọn theo ngữ cảnh', writing:'Tự viết câu'
 };
 const exemplars = [
  {
   id:'en-present', lang:'en', level:'A1', topic:'Động từ', priority:'Core', title:'Hiện tại đơn',
   formula:'S + V(s/es) · S + do/does not + V · Do/Does + S + V?',
   essence:'Hiện tại đơn đặt câu nói vào một thói quen hoặc sự thật ổn định.',
   purpose:'Người nghe hiểu đây là việc lặp lại hoặc điều đúng nói chung.',
   usage:'Ở câu khẳng định, thêm -s/-es với he, she, it. Sau does, dùng động từ nguyên mẫu.',
   context:'Lịch học, giờ làm việc và các thói quen hằng ngày.',
   example:'She walks to work every morning.', translation:'Cô ấy đi bộ đến chỗ làm mỗi sáng.',
   error:'She go → She goes. Does she goes? → Does she go?',
   contrast:'She works on Mondays là lịch thường lệ. She is working now là việc đang diễn ra.',
   vocabulary:['school','work','book','coffee'],
   items:[
    ['choice','She ___ to school every day.',['goes'],['go','going'],'Thêm -es với she ở câu khẳng định.',1,'verb'],
    ['blank','My brother ___ (play) football after school.',['plays'],null,'Brother là ngôi thứ ba số ít.',2,'verb'],
    ['order','Sắp xếp để hỏi “Bạn có uống cà phê không?”',['Do you drink coffee?'],['coffee','you','Do','drink'],'Câu hỏi bắt đầu bằng Do.',2,'order'],
    ['detect','Từ nào sai trong “He go to work by bus”?',['go'],['He','work'],'He cần goes.',2,'verb'],
    ['correct','Sửa “Does she likes tea?”',['Does she like tea?'],null,'Sau does dùng like.',3,'verb'],
    ['transform','Đổi sang phủ định: “He reads at night.”',["He does not read at night.","He doesn't read at night."],null,'Dùng does not + read.',4,'structure'],
    ['translate','Dịch: Tôi uống nước mỗi sáng.',['I drink water every morning.','Every morning I drink water.'],null,'Dùng hiện tại đơn để nói thói quen.',4,'context'],
    ['reverse','Dịch: “The shop opens at nine.”',['Cửa hàng mở cửa lúc chín giờ.','Cửa hàng mở lúc 9 giờ.','Cửa hàng mở cửa lúc 9 giờ.'],null,'“Opens” mô tả lịch thường lệ.',4,'context'],
    ['context','Bạn nói về lịch làm việc hằng tuần. Câu nào phù hợp?',['I work on Mondays.'],['I am working right now.','I worked last Monday.'],'Chọn câu diễn tả lịch lặp lại.',3,'context'],
    ['writing','Viết một câu kể thói quen hằng ngày của một người bạn.',['My friend reads every evening.'],null,'Tự kiểm tra chủ ngữ số ít, đuôi -s và cụm thời gian.',5,'structure'],
    ['transform','Dùng các gợi ý “Mia / read / every evening” để viết một câu hoàn chỉnh.',['Mia reads every evening.','Every evening Mia reads.'],null,'Chia động từ read theo Mia và dùng cụm thời gian phù hợp.',5,'verb']
   ]
  },{
   id:'ko-particles', lang:'ko', level:'TOPIK 1', topic:'Trợ từ', priority:'Core', title:'Tân ngữ 을/를',
   formula:'Danh từ có 받침 + 을 · danh từ không có 받침 + 를',
   essence:'Trợ từ đứng sau danh từ để cho biết hành động tác động lên đối tượng nào.',
   purpose:'Đánh dấu vai trò tân ngữ trong câu, nhất là khi trật tự từ linh hoạt.',
   usage:'Chọn 을 sau phụ âm cuối và 를 sau nguyên âm.',
   context:'Nói mình đọc sách, uống nước hoặc mua đồ.',
   example:'저는 책을 읽어요.', translation:'Tôi đọc sách.',
   error:'책를 → 책을. 커피을 → 커피를.',
   contrast:'을/를 đánh dấu tân ngữ. 은/는 đánh dấu chủ đề.',
   vocabulary:['책','물','커피'],
   items:[
    ['choice','책___ 읽어요.',['을'],['를','에'],'책 có phụ âm cuối ㄱ.',1,'particle'],
    ['blank','커피___ 마셔요.',['를'],null,'커피 kết thúc bằng nguyên âm.',2,'particle'],
    ['order','Sắp xếp: Tôi uống nước.',['저는 물을 마셔요.'],['마셔요','저는','물을'],'Mẫu cơ bản là chủ đề + tân ngữ + động từ.',2,'order'],
    ['detect','Phần nào sai trong “사과을 먹어요”?',['사과을'],['먹어요'],'사과 kết thúc bằng nguyên âm.',2,'particle'],
    ['correct','Sửa “우유을 마셔요.”',['우유를 마셔요.'],null,'Dùng 를 sau 우유.',3,'particle'],
    ['transform','Thay 책 bằng 신문: “책을 읽어요.”',['신문을 읽어요.'],null,'신문 có phụ âm cuối ㄴ.',4,'particle'],
    ['translate','Dịch lịch sự: Tôi uống cà phê.',['저는 커피를 마셔요.','커피를 마셔요.','제가 커피를 마셔요.'],null,'Dùng 커피를 làm tân ngữ.',4,'structure'],
    ['reverse','Dịch: “저는 빵을 먹어요.”',['Tôi ăn bánh mì.','Mình ăn bánh mì.'],null,'빵을 là tân ngữ của 먹어요.',4,'context'],
    ['context','Bạn nói mình mua táo. Chọn câu đúng.',['사과를 사요.'],['사과에 사요.','사과하고 사요.'],'사과 là đối tượng được mua.',3,'context'],
    ['writing','Viết một câu lịch sự về thứ bạn thường uống.',['저는 물을 마셔요.'],null,'Tự kiểm tra danh từ và lựa chọn 을 hoặc 를.',5,'particle'],
    ['transform','Dùng “동생 / 책 / 읽다” để nói lịch sự: Em tôi đọc sách.',['동생은 책을 읽어요.','동생이 책을 읽어요.','제 동생은 책을 읽어요.','제 동생이 책을 읽어요.'],null,'책 cần 을. Đuôi lịch sự của 읽다 là 읽어요.',5,'structure']
   ]
  },{
   id:'zh-location', lang:'zh', level:'HSK 1', topic:'Vị trí', priority:'Core', title:'Vị trí với 在',
   formula:'Chủ ngữ + 在 + địa điểm',
   essence:'在 có thể làm động từ để nói một người hay vật có mặt ở đâu.',
   purpose:'Trả lời câu hỏi về hiện diện tại một địa điểm.',
   usage:'Đặt 在 trước nơi chốn. Phủ định dùng 不在. Hỏi nơi chốn bằng 在哪儿 hoặc 在哪里.',
   context:'Hỏi bạn đang ở đâu hoặc chỉ vị trí đồ vật.',
   example:'我在家。', translation:'Tôi ở nhà.',
   error:'我家在 dùng sai trật tự khi muốn nói “Tôi ở nhà”. Viết 我在家。',
   contrast:'我在学校 nói tôi ở trường. 我在学习 dùng 在 để chỉ hành động đang diễn ra.',
   vocabulary:['家','图书馆','学校','书'],
   items:[
    ['choice','我 ___ 家。',['在'],['是','很'],'在 nối người với địa điểm.',1,'structure'],
    ['blank','她 ___ 哪儿？',['在'],null,'在哪儿 hỏi đang ở đâu.',2,'structure'],
    ['order','Sắp xếp: Anh ấy ở trường.',['他在学校。'],['学校','他','在'],'Vị trí đứng sau 在.',2,'order'],
    ['detect','Muốn nói “Tôi ở nhà”, từ nào sai trong “我 是 家”?',['是'],['我','家'],'Dùng 在 để chỉ vị trí.',2,'context'],
    ['correct','Sửa “书桌子上在” theo nghĩa “Sách ở trên bàn”.',['书在桌子上。'],null,'在 đứng trước cụm 桌子上.',3,'order'],
    ['transform','Đổi sang phủ định: “她在学校。”',['她不在学校。'],null,'Phủ định vị trí dùng 不在.',4,'structure'],
    ['translate','Dịch: Tôi ở thư viện.',['我在图书馆。'],null,'图书馆 là thư viện.',4,'structure'],
    ['reverse','Dịch: “他在家。”',['Anh ấy ở nhà.','Anh ta ở nhà.','Cậu ấy ở nhà.'],null,'他 là anh ấy, 在家 là ở nhà.',4,'context'],
    ['context','Trả lời “你在哪儿？” khi bạn ở trường.',['我在学校。'],['我是学生。','我在学习。'],'Câu hỏi yêu cầu một địa điểm.',3,'context'],
    ['writing','Viết một câu cho biết một người đang ở đâu.',['妈妈在家。'],null,'Tự kiểm tra người + 在 + địa điểm.',5,'structure'],
    ['transform','Dùng “老师 / 学校” để viết câu nói giáo viên đang ở trường.',['老师在学校。'],null,'Đặt người trước 在 và địa điểm ở cuối.',5,'structure']
   ]
  },{
   id:'ja-object', lang:'ja', level:'N5', topic:'Trợ từ', priority:'Core', title:'Tân ngữ với を',
   formula:'Danh từ + を + động từ ngoại động',
   essence:'を đánh dấu đối tượng chính của những hành động như đọc, uống và mua.',
   purpose:'Người nghe nhận biết vật chịu tác động của động từ.',
   usage:'Viết を sau danh từ và đọc là “o”.',
   context:'Miêu tả hành động thường ngày và gọi món.',
   example:'本を読みます。', translation:'Tôi đọc sách.',
   error:'本に読みます → 本を読みます。',
   contrast:'を chỉ đối tượng hành động. で thường chỉ nơi hoặc phương tiện thực hiện.',
   vocabulary:['本','水','お茶'],
   items:[
    ['choice','水___飲みます。',['を'],['に','で'],'水 là thứ được uống.',1,'particle'],
    ['blank','本___読みます。',['を'],null,'Đánh dấu 本 bằng を.',2,'particle'],
    ['order','Sắp xếp: Tôi uống trà.',['お茶を飲みます。'],['飲みます','お茶','を'],'お茶 đứng trước を.',2,'order'],
    ['detect','Trợ từ nào sai trong “本に読みます”?',['に'],['本','読みます'],'本 là tân ngữ của 読みます.',2,'particle'],
    ['correct','Sửa “パンで食べます。” theo nghĩa “Tôi ăn bánh mì”.',['パンを食べます。'],null,'パン là thứ được ăn.',3,'particle'],
    ['transform','Thay 水 bằng 牛乳: “水を飲みます。”',['牛乳を飲みます。'],null,'Giữ を trước 飲みます.',4,'structure'],
    ['translate','Dịch lịch sự: Tôi mua sách.',['本を買います。','わたしは本を買います。','私は本を買います。'],null,'Có thể lược chủ ngữ nếu rõ ngữ cảnh.',4,'context'],
    ['reverse','Dịch: “りんごを食べます。”',['Tôi ăn táo.','Mình ăn táo.'],null,'りんご là táo, 食べます là ăn.',4,'context'],
    ['context','Bạn gọi một cốc nước. Chọn câu phù hợp.',['水をください。'],['水でください。','水にください。'],'を đánh dấu vật được yêu cầu.',3,'context'],
    ['writing','Viết một câu lịch sự nói về thứ bạn đọc hoặc ăn.',['新聞を読みます。'],null,'Tự kiểm tra danh từ, を, và động từ phù hợp.',5,'particle'],
    ['transform','Dùng “妹 / 新聞 / 読む” để viết câu lịch sự: Em gái tôi đọc báo.',['妹は新聞を読みます。','妹が新聞を読みます。','私の妹は新聞を読みます。','私の妹が新聞を読みます。'],null,'新聞 là tân ngữ của 読む. Dạng lịch sự là 読みます.',5,'structure']
   ]
  }
 ];
 const additional = [
  ['en-time','en','A1','Giới từ','Essential','Giờ với at','at + giờ cụ thể','At định vị vào một thời điểm cụ thể.','The class starts at eight.','Lớp học bắt đầu lúc tám giờ.','Không dùng on trước một giờ.','On đứng trước ngày.','en-present','The train leaves ___ seven.','at',['on','in'],'Giới từ','at nine'],
  ['en-perfect','en','B1','Thể động từ','Advanced','Hiện tại hoàn thành','S + have/has + V3','Diễn tả việc đã xảy ra có liên hệ với hiện tại.','I have lost my key.','Tôi làm mất chìa khóa và hiện vẫn chưa tìm thấy.','Không kết hợp với yesterday khi chỉ một sự việc đã kết thúc.','Quá khứ đơn có thể nêu thời điểm đã qua.','en-present','She ___ finished her homework.','has',['have','is'],'Động từ','have lost'],
  ['ko-place','ko','TOPIK 1','Trợ từ','Essential','Địa điểm 에서','Địa điểm + 에서 + hành động','에서 chỉ nơi một hành động diễn ra.','학교에서 공부해요.','Tôi học ở trường.','Tránh dùng 에서 thay cho đích đến của 가다.','에 với 가다 chỉ nơi sẽ tới.','ko-particles','도서관___ 공부해요.','에서',['에게','하고'],'Trợ từ','학교에서'],
  ['ko-past','ko','TOPIK 2','Thời gian','Essential','Đuôi quá khứ','Gốc động từ + 았/었어요','Đuôi này đặt hành động trước lúc nói.','어제 친구를 만났어요.','Hôm qua tôi gặp bạn.','Đừng giữ dạng hiện tại khi muốn diễn tả một việc đã xong hôm qua.','만나요 là hiện tại, 만났어요 là quá khứ.','ko-particles','어제 친구를 ___.','만났어요',['만나요','만나고 있어요'],'Động từ','만났어요'],
  ['zh-ma','zh','HSK 1','Câu hỏi','Essential','Câu hỏi với 吗','Câu trần thuật + 吗？','吗 biến một câu khẳng định thành câu hỏi có/không.','你是学生吗？','Bạn là học sinh phải không?','Không cần chèn 吗 vào giữa câu.','谁 hỏi danh tính, 吗 hỏi xác nhận.','zh-location','你是学生___？','吗',['在','很'],'Cấu trúc','你在家吗'],
  ['zh-guo','zh','HSK 3','Thể động từ','Advanced','Trải nghiệm với 过','S + V + 过 + O','过 cho biết từng có trải nghiệm làm việc gì trước đây.','我去过北京。','Tôi từng đến Bắc Kinh.','Không đặt 过 trước động từ trong mẫu này.','了 có thể nói việc hoàn tất, 过 nhấn trải nghiệm.','zh-location','我去___北京。','过',['就','在'],'Thể động từ','去过'],
  ['ja-place','ja','N5','Trợ từ','Essential','Địa điểm với で','Địa điểm + で + hành động','で chỉ chỗ hoạt động xảy ra.','図書館で勉強します。','Tôi học tại thư viện.','Không dùng を để chỉ địa điểm học trong mẫu này.','に dùng cho nhiều mốc hoặc đích đến.','ja-object','図書館___勉強します。','で',['を','へ'],'Trợ từ','図書館で'],
  ['ja-past','ja','N5','Thời gian','Essential','Quá khứ lịch sự','V bỏ ます + ました','ました dùng cho hành động quá khứ trong lời nói lịch sự.','昨日、映画を見ました。','Hôm qua tôi đã xem phim.','昨日 với việc đã xảy ra cần dạng quá khứ.','見ます diễn tả thói quen hoặc tương lai.','ja-object','昨日、映画を ___.','見ました',['見ます','見ません'],'Động từ','見ました']
 ];
 const lessons = exemplars.map(lesson => ({ ...lesson, prerequisites: [] }));
 for (const [id,lang,level,topic,priority,title,formula,essence,example,translation,error,contrast,prior,prompt,answer,wrong,context,recall] of additional) {
  lessons.push({ id,lang,level,topic,priority,title,formula,essence,purpose:essence,usage:formula,context,example,translation,error,contrast,
   prerequisites:[prior], vocabulary:[], items:[
    ['choice',prompt,[answer],wrong,formula,1,'structure'],
    ['reverse','Dịch: ' + example,[translation],null,essence,4,'context'],
    ['writing','Tự viết một câu áp dụng ' + title + '.',[example],null,'Đối chiếu công thức: ' + formula,5,'structure'],
    ['blank','Viết phần còn thiếu trong ví dụ trên theo mẫu: ' + prompt,[answer],null,recall + ' · ' + essence,2,'structure']
   ] });
 }
 const questions = lessons.flatMap(lesson => lesson.items.map(([type,prompt,answers,choices,explanation,skill,errorType], index) => ({
  id: lesson.id + '-' + (index + 1), lessonId:lesson.id, lang:lesson.lang, type,prompt,answers,choices,explanation,skill,errorType,
  difficulty: Math.min(3, Math.ceil(skill / 2)), vocabulary:lesson.vocabulary
 })));
 return { languages, types, lessons:lessons.map(({items,...lesson}) => lesson), questions };
})();
