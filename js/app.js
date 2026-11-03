    /* ==========================================================================
       1. INITIAL SEED DATA & LOCALSTORAGE
       ========================================================================== */
    const SEED_WORDS = [];
    const LISTENING_STORIES_STORAGE_KEY = 'polyglot_listening_stories';
    const PRODUCTION_HISTORY_STORAGE_KEY = 'polyglot_production_history';
    const CUSTOM_PRODUCTION_STORAGE_KEY = 'polyglot_custom_production';
    const PRODUCTION_SCENARIO_OVERRIDES_STORAGE_KEY = 'polyglot_production_scenario_overrides';
    const PRODUCTION_SCENARIOS = [
      { id: 'restaurant-order', category: 'Đời sống hằng ngày', level: 'A1', title: 'Gọi món tại nhà hàng', context: 'Bạn đang gọi món ở nhà hàng. Món bạn muốn đã hết, hãy tìm lựa chọn phù hợp và xác nhận yêu cầu ăn uống.', userRole: 'Khách hàng', aiRole: 'Nhân viên phục vụ', objective: 'Gọi được một bữa ăn phù hợp và xác nhận các yêu cầu của bạn.', tasks: ['Gọi một phần hamburger', 'Hỏi về dị ứng đậu phộng', 'Gọi một ly nước lọc'], vocabulary: ['order', 'menu', 'recommend', 'allergy', 'bill'] },
      { id: 'shopping-product', category: 'Đời sống hằng ngày', level: 'A2', title: 'Mua sắm và hỏi về sản phẩm', context: 'Bạn muốn mua một chiếc áo nhưng cần biết kích cỡ, chất liệu và chính sách đổi trả.', userRole: 'Khách mua hàng', aiRole: 'Nhân viên cửa hàng', objective: 'Chọn được sản phẩm phù hợp và hiểu rõ điều kiện đổi trả.', tasks: ['Mô tả sản phẩm cần tìm', 'Hỏi kích cỡ, chất liệu hoặc giá', 'Xác nhận chính sách đổi trả'], vocabulary: ['size', 'fit', 'price', 'exchange', 'receipt'] },
      { id: 'directions', category: 'Đời sống hằng ngày', level: 'A1', title: 'Hỏi đường đến nhà ga', context: 'Bạn đang ở một khu phố lạ và cần đến nhà ga trước giờ khởi hành.', userRole: 'Du khách', aiRole: 'Người dân địa phương', objective: 'Tìm được đường đi và xác nhận cách đến nơi nhanh nhất.', tasks: ['Hỏi đường lịch sự', 'Xác nhận phương hướng hoặc mốc địa điểm', 'Hỏi thời gian đi bộ/phương tiện'], vocabulary: ['station', 'turn', 'near', 'straight', 'minutes'] },
      { id: 'public-transport', category: 'Đời sống hằng ngày', level: 'A2', title: 'Đi phương tiện công cộng', context: 'Bạn cần mua vé xe buýt hoặc tàu đến một địa điểm nhưng chưa rõ tuyến và cách thanh toán.', userRole: 'Hành khách', aiRole: 'Nhân viên nhà ga', objective: 'Chọn đúng tuyến và mua được vé phù hợp.', tasks: ['Nêu điểm đến', 'Hỏi tuyến và giờ chạy', 'Hỏi giá vé và cách thanh toán'], vocabulary: ['ticket', 'platform', 'transfer', 'schedule', 'fare'] },
      { id: 'appointment', category: 'Đời sống hằng ngày', level: 'B1', title: 'Đặt lịch hẹn', context: 'Bạn cần đặt lịch khám hoặc dịch vụ nhưng thời gian mong muốn đã kín.', userRole: 'Người đặt lịch', aiRole: 'Nhân viên lễ tân', objective: 'Thống nhất một lịch hẹn và xác nhận thông tin cần thiết.', tasks: ['Nêu lý do và thời gian mong muốn', 'Thương lượng thời gian thay thế', 'Xác nhận tên, ngày giờ và yêu cầu chuẩn bị'], vocabulary: ['appointment', 'available', 'reschedule', 'confirm', 'convenient'] },
      { id: 'hotel-checkin', category: 'Du lịch', level: 'B1', title: 'Nhận phòng khách sạn bị thất lạc đặt chỗ', context: 'Lễ tân không tìm thấy đặt phòng của bạn dù bạn có xác nhận. Bạn cần trình bày thông tin và tìm giải pháp.', userRole: 'Khách lưu trú', aiRole: 'Nhân viên lễ tân', objective: 'Xác minh đặt phòng hoặc thống nhất chỗ ở thay thế hợp lý.', tasks: ['Mô tả vấn đề và cung cấp mã đặt phòng', 'Nêu ngày lưu trú và bằng chứng xác nhận', 'Thương lượng giải pháp nếu không tìm thấy đặt chỗ'], vocabulary: ['reservation', 'confirmation', 'booking number', 'available', 'alternative'] },
      { id: 'flight-change', category: 'Du lịch', level: 'B2', title: 'Đổi chuyến bay', context: 'Lịch trình của bạn thay đổi đột xuất. Bạn cần đổi chuyến nhưng vé có điều kiện và phí khác nhau.', userRole: 'Hành khách', aiRole: 'Nhân viên hãng bay', objective: 'Đổi chuyến phù hợp và hiểu các khoản phí, điều kiện.', tasks: ['Giải thích lý do cần đổi', 'Hỏi các chuyến thay thế và chi phí', 'Đưa ra lựa chọn và xác nhận hành trình mới'], vocabulary: ['change fee', 'departure', 'itinerary', 'fare difference', 'rebook'] },
      { id: 'lost-luggage', category: 'Du lịch', level: 'B1', title: 'Báo thất lạc hành lý', context: 'Hành lý không xuất hiện trên băng chuyền. Bạn cần báo cáo và cung cấp thông tin nhận dạng.', userRole: 'Hành khách', aiRole: 'Nhân viên hỗ trợ hành lý', objective: 'Lập báo cáo thất lạc và biết cách nhận cập nhật/bồi hoàn.', tasks: ['Mô tả vali và chuyến bay', 'Cung cấp thông tin liên lạc và thẻ hành lý', 'Hỏi quy trình giao trả và chi phí thiết yếu'], vocabulary: ['luggage', 'baggage claim', 'suitcase', 'tag', 'deliver'] },
      { id: 'travel-problem', category: 'Du lịch', level: 'C1', title: 'Xử lý sự cố hành trình nối chuyến', context: 'Chuyến đầu bị hoãn khiến bạn có nguy cơ lỡ chuyến nối. Hãy giải thích hoàn cảnh và phối hợp phương án.', userRole: 'Hành khách', aiRole: 'Nhân viên hỗ trợ sân bay', objective: 'Tìm được phương án đến nơi cuối cùng với gián đoạn thấp nhất.', tasks: ['Giải thích lịch trình và thời gian còn lại', 'Hỏi về chuyến thay thế và hỗ trợ quá cảnh', 'Đánh giá lựa chọn và xác nhận phương án'], vocabulary: ['connection', 'delay', 'rebook', 'transit', 'compensation'] },
      { id: 'introduce-yourself', category: 'Giao tiếp xã hội', level: 'A1', title: 'Làm quen tại sự kiện', context: 'Bạn tham dự một buổi gặp mặt và đứng cạnh người mới. Bắt đầu cuộc trò chuyện tự nhiên.', userRole: 'Người tham dự', aiRole: 'Khách mới quen', objective: 'Giới thiệu bản thân và duy trì cuộc trò chuyện thân thiện.', tasks: ['Chào hỏi và giới thiệu tên', 'Hỏi một câu mở về người kia hoặc sự kiện', 'Chia sẻ sở thích hoặc lý do tham dự'], vocabulary: ['meet', 'from', 'work', 'hobby', 'event'] },
      { id: 'polite-disagreement', category: 'Giao tiếp xã hội', level: 'B2', title: 'Bất đồng một cách lịch sự', context: 'Trong cuộc trò chuyện, bạn không đồng ý với một đề xuất nhưng muốn giữ không khí tích cực.', userRole: 'Người tham gia thảo luận', aiRole: 'Người đưa ra đề xuất', objective: 'Nêu quan điểm khác biệt, giải thích lý do và tìm điểm chung.', tasks: ['Thừa nhận góc nhìn của đối phương', 'Giải thích quan điểm và lý do', 'Đề xuất phương án dung hòa'], vocabulary: ['I see your point', 'however', 'concern', 'compromise', 'alternative'] },
      { id: 'invite-event', category: 'Giao tiếp xã hội', level: 'A2', title: 'Mời bạn tham dự sự kiện', context: 'Bạn muốn mời một người bạn đi xem buổi biểu diễn cuối tuần nhưng họ chưa chắc lịch.', userRole: 'Người mời', aiRole: 'Người bạn', objective: 'Đưa ra lời mời tự nhiên và thống nhất kế hoạch hoặc phương án khác.', tasks: ['Nêu sự kiện, thời gian và lý do thú vị', 'Hỏi người bạn có thể tham gia không', 'Phản hồi linh hoạt nếu họ bận'], vocabulary: ['invite', 'available', 'sounds fun', 'plan', 'another time'] },
      { id: 'teacher-clarification', category: 'Học tập', level: 'A2', title: 'Hỏi giáo viên giải thích lại', context: 'Bạn chưa hiểu một phần hướng dẫn bài học và muốn hỏi lại cụ thể trước khi làm bài.', userRole: 'Học viên', aiRole: 'Giáo viên', objective: 'Hiểu rõ yêu cầu và biết bước tiếp theo cần thực hiện.', tasks: ['Chỉ rõ phần chưa hiểu', 'Đặt câu hỏi làm rõ', 'Diễn đạt lại cách hiểu để xác nhận'], vocabulary: ['clarify', 'instruction', 'example', 'requirement', 'submit'] },
      { id: 'group-project', category: 'Học tập', level: 'B1', title: 'Phân chia dự án nhóm', context: 'Nhóm của bạn đang chậm tiến độ vì chưa thống nhất nhiệm vụ. Hãy đề xuất kế hoạch công bằng.', userRole: 'Thành viên nhóm', aiRole: 'Bạn cùng nhóm', objective: 'Thống nhất phân công và thời hạn cho dự án.', tasks: ['Nêu vấn đề tiến độ', 'Đề xuất phân chia nhiệm vụ', 'Kiểm tra nguồn lực và chốt thời hạn'], vocabulary: ['deadline', 'contribute', 'divide', 'responsible', 'progress'] },
      { id: 'presentation-question', category: 'Học tập', level: 'C1', title: 'Trả lời câu hỏi sau thuyết trình', context: 'Sau phần trình bày, một người nghe đặt câu hỏi khó về giả định và giới hạn của nghiên cứu.', userRole: 'Người thuyết trình', aiRole: 'Người nghe phản biện', objective: 'Trả lời rõ ràng, thừa nhận giới hạn hợp lý và bảo vệ lập luận.', tasks: ['Làm rõ câu hỏi nếu cần', 'Trả lời bằng bằng chứng hoặc lập luận', 'Nêu giới hạn và hướng tiếp theo'], vocabulary: ['assumption', 'evidence', 'limitation', 'methodology', 'implication'] },
      { id: 'job-interview', category: 'Công việc', level: 'B2', title: 'Phỏng vấn xin việc', context: 'Bạn đang phỏng vấn cho vị trí mong muốn. Nhà tuyển dụng hỏi về kinh nghiệm, điểm mạnh và tình huống khó.', userRole: 'Ứng viên', aiRole: 'Nhà tuyển dụng', objective: 'Trình bày sự phù hợp bằng ví dụ cụ thể và đặt câu hỏi chuyên nghiệp.', tasks: ['Tóm tắt kinh nghiệm liên quan', 'Kể ví dụ xử lý thử thách', 'Nêu lý do phù hợp và hỏi về vai trò'], vocabulary: ['experience', 'achievement', 'challenge', 'strength', 'responsibility'] },
      { id: 'negotiate-deadline', category: 'Công việc', level: 'B2', title: 'Thương lượng thời hạn công việc', context: 'Bạn nhận ra cần thêm thời gian để hoàn thành công việc đúng chất lượng. Hãy trao đổi với quản lý.', userRole: 'Nhân viên', aiRole: 'Quản lý', objective: 'Thống nhất thời hạn thực tế và kế hoạch giảm ảnh hưởng.', tasks: ['Giải thích tình trạng bằng dữ kiện', 'Đề xuất thời hạn hoặc phạm vi thay thế', 'Nêu cách cập nhật tiến độ'], vocabulary: ['extension', 'scope', 'priority', 'deliverable', 'trade-off'] },
      { id: 'customer-complaint', category: 'Công việc', level: 'C1', title: 'Xử lý khiếu nại khách hàng', context: 'Khách hàng không hài lòng vì dịch vụ không đúng cam kết và yêu cầu giải pháp ngay.', userRole: 'Nhân viên hỗ trợ', aiRole: 'Khách hàng', objective: 'Lắng nghe, nhận trách nhiệm phù hợp và thống nhất phương án khắc phục.', tasks: ['Thể hiện đã hiểu ảnh hưởng', 'Làm rõ sự việc và xin lỗi phù hợp', 'Đề xuất giải pháp cụ thể và xác nhận đồng thuận'], vocabulary: ['inconvenience', 'resolve', 'refund', 'replacement', 'follow up'] },
      { id: 'defective-product', category: 'Giải quyết vấn đề', level: 'A2', title: 'Đổi sản phẩm bị lỗi', context: 'Thiết bị mới mua không hoạt động. Bạn có hóa đơn và muốn đổi hoặc hoàn tiền.', userRole: 'Khách hàng', aiRole: 'Nhân viên cửa hàng', objective: 'Được đổi sản phẩm hoặc thống nhất phương án hoàn tiền.', tasks: ['Mô tả lỗi và thời điểm mua', 'Cung cấp hóa đơn hoặc bảo hành', 'Hỏi và chọn phương án xử lý'], vocabulary: ['defective', 'receipt', 'warranty', 'replace', 'refund'] },
      { id: 'resolve-misunderstanding', category: 'Giải quyết vấn đề', level: 'B1', title: 'Giải quyết hiểu lầm', context: 'Một người bạn nghĩ rằng bạn đã phớt lờ lời mời của họ. Bạn muốn làm rõ mà không đổ lỗi.', userRole: 'Người muốn làm rõ', aiRole: 'Người bạn', objective: 'Giải thích hiểu lầm, lắng nghe cảm xúc và khôi phục thiện chí.', tasks: ['Hỏi và nghe cách người kia hiểu sự việc', 'Giải thích ý định hoặc hoàn cảnh', 'Đề xuất bước tiếp theo tích cực'], vocabulary: ['misunderstanding', 'intend', 'actually', 'apologize', 'make it up'] },
      { id: 'urgent-help', category: 'Giải quyết vấn đề', level: 'A2', title: 'Nhờ giúp đỡ trong tình huống khẩn cấp', context: 'Bạn cần trợ giúp khẩn cấp ở nơi công cộng. Hãy diễn đạt vị trí và vấn đề thật rõ ràng.', userRole: 'Người cần giúp', aiRole: 'Người trực hỗ trợ', objective: 'Truyền đạt loại trợ giúp và vị trí để nhận hỗ trợ phù hợp.', tasks: ['Nêu rõ vấn đề khẩn cấp', 'Cung cấp vị trí và chi tiết quan trọng', 'Trả lời câu hỏi và xác nhận trợ giúp đang đến'], vocabulary: ['help', 'emergency', 'location', 'please call', 'need'] },
      { id: 'negotiate-solution', category: 'Giải quyết vấn đề', level: 'C2', title: 'Đàm phán phương án đôi bên cùng có lợi', context: 'Hai bên có ưu tiên khác nhau về chi phí và thời hạn. Tìm thỏa thuận có thể thực hiện được.', userRole: 'Người đàm phán', aiRole: 'Đối tác có ưu tiên khác', objective: 'Đạt thỏa thuận cân bằng mà không từ bỏ các điều kiện cốt lõi.', tasks: ['Làm rõ ưu tiên và giới hạn', 'Đưa ra nhiều phương án đánh đổi', 'Tóm tắt và xác nhận cam kết cụ thể'], vocabulary: ['mutual', 'constraint', 'concession', 'proposal', 'feasible'] }
    ];
    const PRODUCTION_SCENARIO_STAGE_GUIDANCE = {
      'restaurant-order': [
        {
          promptVi: 'Xin chào, cho tôi gọi một phần hamburger được không?',
          npcPrompts: {
            en: 'Hello, welcome. What can I help you with?',
            ko: '어서 오세요. 무엇을 도와드릴까요?',
            zh: '您好，欢迎光临。请问您想点什么？',
            ja: 'いらっしゃいませ。ご注文はお決まりですか。'
          },
          sampleAnswersByLanguage: {
            en: ['Hi, can I have a hamburger, please?', 'Hello, I would like to order a burger.'],
            ko: ['안녕하세요. 햄버거 하나 주세요.', '햄버거 하나 주문하고 싶어요.'],
            zh: ['你好，我想要一个汉堡。', '您好，请给我来一份汉堡。'],
            ja: ['こんにちは。ハンバーガーを一つください。', 'ハンバーガーを一つお願いします。']
          },
          requiredKeywordGroups: {
            en: [['hamburger', 'burger'], ['can i have', 'could i have', 'i would like', 'i’d like', 'i want', 'please']],
            ko: [['햄버거'], ['주세요', '주문하고 싶어요', '주문할게요']],
            zh: [['汉堡'], ['我想要', '请给我', '来一份']],
            ja: [['ハンバーガー'], ['ください', 'お願いします', '注文したい']]
          }
        },
        {
          promptVi: 'Tôi bị dị ứng với đậu phộng. Món hamburger có đậu phộng không?',
          npcPrompts: {
            en: 'Would you like to know about any ingredients or allergies?',
            ko: '알레르기가 있거나 확인하고 싶은 재료가 있나요?',
            zh: '您有过敏的食物或想确认的食材吗？',
            ja: 'アレルギーや確認したい食材はありますか。'
          },
          sampleAnswersByLanguage: {
            en: ['I am allergic to peanuts. Does the hamburger contain any?', 'I have a peanut allergy. Is it safe for me?'],
            ko: ['저는 땅콩 알레르기가 있어요. 햄버거에 땅콩이 들어가나요?', '땅콩에 알레르기가 있는데 괜찮을까요?'],
            zh: ['我对花生过敏。汉堡里有花生吗？', '我有花生过敏，这个汉堡可以吃吗？'],
            ja: ['私はピーナッツアレルギーがあります。ハンバーガーに入っていますか。', 'ピーナッツアレルギーがありますが、大丈夫ですか。']
          },
          requiredKeywordGroups: {
            en: [['allergic', 'allergy'], ['peanut', 'nuts']],
            ko: [['알레르기'], ['땅콩']],
            zh: [['过敏'], ['花生']],
            ja: [['アレルギー'], ['ピーナッツ']]
          }
        },
        {
          promptVi: 'Cho tôi một ly nước lọc, cảm ơn.',
          npcPrompts: {
            en: 'Would you like a drink with that?',
            ko: '음료도 주문하시겠어요?',
            zh: '您还需要饮料吗？',
            ja: 'お飲み物はいかがですか。'
          },
          sampleAnswersByLanguage: {
            en: ['A glass of water, please.', 'Could I have some water, please?'],
            ko: ['물 한 잔 주세요.', '물 한 잔 부탁드립니다.'],
            zh: ['请给我一杯水。', '我想要一杯水，谢谢。'],
            ja: ['お水を一杯ください。', 'お水を一杯お願いします。']
          },
          requiredKeywordGroups: {
            en: [['water'], ['please', 'can i have', 'could i have', 'i would like', 'i’d like']],
            ko: [['물'], ['주세요', '부탁드립니다']],
            zh: [['水'], ['请给我', '我想要']],
            ja: [['水'], ['ください', 'お願いします']]
          }
        }
      ]
    };
    const LISTENING_STORIES = {
      en: [
        { id: 'lost-umbrella', title: 'Chiếc ô thất lạc', level: 'Cơ bản · 1 phút', text: 'Mina walks to the station on a rainy morning. She finds a small blue umbrella beside a bench. A name is written on the handle, so Mina asks people nearby for help. An old man smiles and says the umbrella belongs to his granddaughter. He thanks Mina, and they share a warm cup of tea while they wait for the train.' },
        { id: 'little-garden', title: 'Khu vườn nhỏ', level: 'Cơ bản · 1 phút', text: 'Every Saturday, Leo visits the little garden behind his home. He waters the flowers and gives fresh vegetables to his neighbor. One morning, he sees a tiny bird under a tree. Leo makes a quiet place for it with a soft box. Soon the bird flies away, and Leo feels happy to see it free.' },
        { id: 'night-library', title: 'Thư viện buổi tối', level: 'Trung cấp · 1 phút', text: 'After work, An visits a quiet library near the river. She chooses a book about faraway places and finds a letter between its pages. The letter tells a story about two friends who built a boat together. An reads until the library closes, then walks home beneath the bright city lights, already wondering what book she will discover tomorrow.' }
      ],
      ko: [
        { id: 'warm-lunch', title: 'Bữa trưa ấm áp', level: 'Cơ bản · 1 phút', text: '오늘은 비가 오는 날입니다. 민수는 학교에 우산을 가지고 갑니다. 점심시간에 친구 수진이가 도시락을 가져오지 않았습니다. 민수는 김밥을 반으로 나누어 수진이와 함께 먹습니다. 수진이는 고맙다고 말하고 두 사람은 웃으며 이야기를 합니다.' },
        { id: 'little-dog', title: 'Chú chó nhỏ', level: 'Cơ bản · 1 phút', text: '지우는 집 앞에서 작은 강아지를 만났습니다. 강아지는 목에 파란 이름표를 하고 있었습니다. 지우는 이름표에 있는 전화번호로 전화를 했습니다. 잠시 후 주인이 와서 강아지를 안았습니다. 주인은 지우에게 감사 인사를 하고 함께 집으로 돌아갔습니다.' },
        { id: 'morning-market', title: 'Chợ buổi sáng', level: 'Trung cấp · 1 phút', text: '토요일 아침, 유나는 시장에 갔습니다. 시장에는 과일과 꽃이 가득했습니다. 유나는 할머니를 위해 사과와 따뜻한 빵을 샀습니다. 집에 돌아오는 길에 이웃을 만나 빵을 나누어 주었습니다. 작은 친절 덕분에 모두의 아침이 더 즐거워졌습니다.' }
      ],
      zh: [
        { id: 'small-umbrella', title: 'Chiếc ô nhỏ', level: 'Cơ bản · 1 phút', text: '今天早上下雨了。小林在车站看见一把蓝色的小伞。伞旁边有一张纸，上面写着一个电话号码。小林打电话找到了伞的主人。那是一位老奶奶，她高兴地说：“谢谢你！”' },
        { id: 'helpful-neighbor', title: 'Người hàng xóm tốt bụng', level: 'Cơ bản · 1 phút', text: '小王的新邻居是一位年轻的老师。一天，小王搬家时遇到了困难，邻居马上过来帮忙。他们一起把书和椅子搬进房间。晚上，小王做了一顿简单的晚饭，请邻居一起吃。从那以后，他们成了好朋友。' },
        { id: 'morning-park', title: 'Công viên buổi sáng', level: 'Trung cấp · 1 phút', text: '每天早上，林老师都会去公园散步。公园里有很多树，也有一条安静的小路。一个星期天，她遇见了一个正在画画的孩子。孩子把画送给林老师，画上有太阳、花和一只小鸟。林老师把画带回家，放在书桌旁边。' }
      ],
      ja: [
        { id: 'red-scarf', title: 'Chiếc khăn đỏ', level: 'Cơ bản · 1 phút', text: 'さくらは駅で赤いマフラーを見つけました。マフラーの近くに小さな手紙がありました。手紙には「ありがとう」と書いてありました。さくらは駅の人にマフラーを渡しました。夕方、持ち主のおばあさんが来て、とてもうれしそうに笑いました。' },
        { id: 'quiet-morning', title: 'Buổi sáng yên bình', level: 'Cơ bản · 1 phút', text: '日曜日の朝、たけしは早く起きました。窓を開けると、外から鳥の声が聞こえました。たけしはコーヒーを飲みながら、本を読みました。そのあと、近くの公園をゆっくり歩きました。空は青く、気持ちのいい一日でした。' },
        { id: 'station-flower', title: 'Bông hoa ở nhà ga', level: 'Trung cấp · 1 phút', text: '駅の前に小さな花屋があります。毎朝、店の人は花に水をあげて、店をきれいにします。ある日、男の子がお母さんの誕生日に花を買いに来ました。店の人は黄色い花を選び、やさしく包みました。男の子は笑顔で家に帰りました。' }
      ]
    };

    // Global App State
    let wordsState = JSON.parse(localStorage.getItem('polyglot_words')) || SEED_WORDS;
    let currentLang = localStorage.getItem('polyglot_lang') || 'en';
    let geminiApiKey = localStorage.getItem('polyglot_gemini_key') || '';
    let autoTTS = localStorage.getItem('polyglot_auto_tts') === 'true';
    let learningStreak = parseInt(localStorage.getItem('polyglot_streak') || '0', 10);
    let lastLearnDate = localStorage.getItem('polyglot_last_date') || '';
    let currentTab = 'vocab';
    let soundEnabled = true;
    let listeningPassageText = '';
    let listeningPassageLang = currentLang;
    let selectedListeningStoryId = '';
    let listeningLibraryCollapsed = false;
    let selectedListeningStoryLogo = '📖';
    let selectedListeningStoryLogoImage = '';
    let customListeningStories = JSON.parse(localStorage.getItem(LISTENING_STORIES_STORAGE_KEY) || '{}');
    let customProductionScenarios = JSON.parse(localStorage.getItem(CUSTOM_PRODUCTION_STORAGE_KEY) || '{}');
    let productionScenarioOverrides = JSON.parse(localStorage.getItem(PRODUCTION_SCENARIO_OVERRIDES_STORAGE_KEY) || '{}');
    let productionHistory = JSON.parse(localStorage.getItem(PRODUCTION_HISTORY_STORAGE_KEY) || '[]');
    let selectedProductionScenarioId = '';
    let activeProductionSession = null;
    let editingProductionScenarioId = '';
    let listeningWordDetailPinned = false;
    const listeningWordLookupCache = new Map();
    const listeningWordLookupRequests = new Map();
    let activeListeningWord = '';
    let listeningDetailHideTimer = null;
    let targetDeleteId = null;
    let pendingDeleteIds = [];
    const selectedWordIds = new Set();

    function syncZombieGameData() {
      if (currentTab !== 'game') return;
      const frame = document.getElementById('zombie-game-frame');
      if (!frame?.contentWindow || frame.dataset.loaded !== 'true') return;
      const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      frame.contentWindow.postMessage({
        type: 'polyglot-vocab-sync',
        lang: currentLang,
        words: wordsState
          .filter(word => word.lang === currentLang)
          .map(word => {
            const srsLevel = Math.max(0, Number(word.srsLevel) || 0);
            return {
              id: word.id,
              w: word.word,
              m: word.meaning,
              p: '',
              phonetic: word.phonetic || '',
              e: word.example || '',
              l: cefrLevels.includes(word.level) ? word.level : 'A1',
              srsLevel,
              forgotCount: Math.max(0, Number(word.forgotCount) || 0),
              selected: selectedWordIds.has(word.id)
            };
          })
      }, '*');
    }

    window.addEventListener('message', async event => {
      const frame = document.getElementById('zombie-game-frame');
      const request = event.data;
      if (event.source !== frame?.contentWindow || request?.type !== 'polyglot-synonym-check') return;
      if (typeof request.requestId !== 'string' || typeof request.input !== 'string' ||
          request.input.length > 120 || !['en', 'vi'].includes(request.mode) ||
          !Array.isArray(request.wordIds) || request.wordIds.length > 20) return;

      const targets = [];
      const originalIndexes = [];
      request.wordIds.forEach((id, index) => {
        const word = wordsState.find(item => item.lang === currentLang && String(item.id) === String(id));
        if (!word) return;
        targets.push({ wordObj: {
          word: word.word,
          meaning: request.mode === 'en' ? word.word : word.meaning
        } });
        originalIndexes.push(index);
      });

      const match = await checkAISynonymMatch(request.input, targets, request.mode === 'en' ? 'English' : 'Vietnamese');
      const matchedIndex = Number.isInteger(match) && match >= 0 && match < originalIndexes.length
        ? originalIndexes[match]
        : -1;
      if (event.source === frame.contentWindow) {
        frame.contentWindow.postMessage({
          type: 'polyglot-synonym-result',
          requestId: request.requestId,
          matchedIndex
        }, '*');
      }
    });

    // Initialize Streak UI
    function updateStreak() {
      const today = new Date().toISOString().slice(0, 10);
      if (lastLearnDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (lastLearnDate === yesterday) {
          learningStreak++;
        } else if (lastLearnDate !== '') {
          learningStreak = 1; // Reset streak if missed a day
        } else {
          learningStreak = 1; // First day
        }
        lastLearnDate = today;
        localStorage.setItem('polyglot_streak', learningStreak.toString());
        localStorage.setItem('polyglot_last_date', lastLearnDate);
      }
      document.getElementById('streak-counter').innerText = learningStreak;
    }

    /* ==========================================================================
       2. TEXT-TO-SPEECH (TTS) NATIVE AUDIO ENGINE
       ========================================================================== */
    let remoteSpeechAudio = null;
    let remoteSpeechQueue = [];
    let remoteSpeechLanguage = '';
    let remoteSpeechOnEnd = null;
    let remoteSpeechOnError = null;

    function getSpeechLanguage(langCode) {
      return { en: 'en-US', ko: 'ko-KR', zh: 'zh-CN', ja: 'ja-JP' }[langCode] || 'en-US';
    }

    function hasSpeechVoice(langCode) {
      if (!('speechSynthesis' in window)) return false;
      const language = getSpeechLanguage(langCode).toLowerCase();
      const languagePrefix = language.split('-')[0];
      return window.speechSynthesis.getVoices().some(voice =>
        voice.lang.toLowerCase() === language || voice.lang.toLowerCase().startsWith(`${languagePrefix}-`)
      );
    }

    function stopRemoteSpeech() {
      if (remoteSpeechAudio) {
        remoteSpeechAudio.pause();
        remoteSpeechAudio.onended = null;
        remoteSpeechAudio.onerror = null;
        remoteSpeechAudio = null;
      }
      remoteSpeechQueue = [];
      remoteSpeechOnEnd = null;
      remoteSpeechOnError = null;
    }

    function playRemoteSpeechChunk() {
      const text = remoteSpeechQueue.shift();
      if (!text) {
        remoteSpeechAudio = null;
        remoteSpeechOnEnd?.();
        remoteSpeechOnEnd = null;
        remoteSpeechOnError = null;
        return;
      }

      const query = new URLSearchParams({
        ie: 'UTF-8',
        client: 'tw-ob',
        tl: remoteSpeechLanguage,
        q: text
      });
      remoteSpeechAudio = new Audio(`https://translate.google.com/translate_tts?${query.toString()}`);
      remoteSpeechAudio.onended = playRemoteSpeechChunk;
      remoteSpeechAudio.onerror = () => {
        remoteSpeechQueue = [];
        remoteSpeechAudio = null;
        const onError = remoteSpeechOnError;
        remoteSpeechOnEnd = null;
        remoteSpeechOnError = null;
        onError?.();
      };
      remoteSpeechAudio.play().catch(() => {
        remoteSpeechQueue = [];
        remoteSpeechAudio = null;
        const onError = remoteSpeechOnError;
        remoteSpeechOnEnd = null;
        remoteSpeechOnError = null;
        onError?.();
      });
    }

    function speakWithRemoteVoice(text, langCode, onEnd, onError) {
      stopRemoteSpeech();
      window.speechSynthesis?.cancel();
      remoteSpeechLanguage = getSpeechLanguage(langCode);
      remoteSpeechOnEnd = onEnd;
      remoteSpeechOnError = onError;
      const characters = Array.from(text);
      while (characters.length) {
        let chunk = characters.splice(0, 180).join('');
        if (characters.length) {
          const lastSpace = chunk.lastIndexOf(' ');
          if (lastSpace > 80) {
            characters.unshift(...Array.from(chunk.slice(lastSpace + 1)));
            chunk = chunk.slice(0, lastSpace);
          }
        }
        if (chunk.trim()) remoteSpeechQueue.push(chunk.trim());
      }
      playRemoteSpeechChunk();
    }

    function speakWord(text, langCode = currentLang) {
      if (!text) return;
      if (!hasSpeechVoice(langCode) || typeof SpeechSynthesisUtterance === 'undefined') {
        speakWithRemoteVoice(text, langCode, null, () =>
          showToast('Không thể tải giọng đọc trực tuyến. Hãy kiểm tra kết nối mạng.', 'error')
        );
        return;
      }
      stopRemoteSpeech();
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getSpeechLanguage(langCode);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.voice = window.speechSynthesis.getVoices().find(voice =>
        voice.lang.toLowerCase() === utterance.lang.toLowerCase()
      ) || null;
      window.speechSynthesis.speak(utterance);
    }

    function speakCurrentFlashcard(event) {
      if (event) event.stopPropagation();
      if (fcQueue.length === 0 || !fcQueue[fcIndex]) return;
      speakWord(fcQueue[fcIndex].word, currentLang);
    }

    function speakCurrentExample(event) {
      if (event) event.stopPropagation();
      if (fcQueue.length === 0 || !fcQueue[fcIndex] || !fcQueue[fcIndex].example) return;
      speakWord(fcQueue[fcIndex].example, currentLang);
    }

    function toggleAutoTTS() {
      autoTTS = !autoTTS;
      localStorage.setItem('polyglot_auto_tts', autoTTS);
      updateAutoTTSBtn();
      showToast(autoTTS ? '🎧 Đã bật tự động đọc từ khi lật thẻ' : '🎧 Đã tắt tự động đọc từ', 'info');
    }

    function toggleAutoTTSFromCheck(checked) {
      autoTTS = checked;
      localStorage.setItem('polyglot_auto_tts', autoTTS);
      updateAutoTTSBtn();
    }

    function updateAutoTTSBtn() {
      const btn = document.getElementById('auto-tts-btn');
      const check = document.getElementById('settings-auto-tts-check');
      if (btn) {
        btn.innerHTML = autoTTS 
          ? '<i class="fa-solid fa-headset text-sm text-theme-main"></i>' 
          : '<i class="fa-solid fa-headset text-sm opacity-50"></i>';
      }
      if (check) check.checked = autoTTS;
    }

    /* ==========================================================================
       3. THEME, NAVIGATION & DYNAMIC FORM ADAPTATION
       ========================================================================== */
    function initTheme() {
      const isDark = localStorage.getItem('polyglot_dark') === 'true' || 
        (!('polyglot_dark' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.getElementById('dark-icon').className = 'fa-solid fa-sun text-sm text-amber-400';
      } else {
        document.documentElement.classList.remove('dark');
        document.getElementById('dark-icon').className = 'fa-solid fa-moon text-sm';
      }

      updateAutoTTSBtn();
      switchLanguage(currentLang, false);
    }

    function toggleDarkMode() {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('polyglot_dark', isDark);
      document.getElementById('dark-icon').className = isDark 
        ? 'fa-solid fa-sun text-sm text-amber-400' 
        : 'fa-solid fa-moon text-sm';
      window.polyglotUI?.sync();
    }

    function toggleAudio() {
      soundEnabled = !soundEnabled;
      const btn = document.getElementById('audio-toggle-btn');
      btn.innerHTML = soundEnabled 
        ? '<i class="fa-solid fa-volume-high text-sm"></i>' 
        : '<i class="fa-solid fa-volume-xmark text-sm text-rose-500"></i>';
      showToast(soundEnabled ? '🔊 Đã bật âm thanh hiệu ứng' : '🔇 Đã tắt âm thanh hiệu ứng', 'info');
    }

    function playSound(type) {
      if (!soundEnabled) return;
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'correct') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.2);
        } else if (type === 'laser') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(800, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'explode') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(120, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.25);
          gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.25);
        }
      } catch (e) {}
    }

    function saveState() {
      localStorage.setItem('polyglot_words', JSON.stringify(wordsState));
      localStorage.setItem('polyglot_lang', currentLang);
      window.polyglotUI?.sync();
    }

    function switchLanguage(lang, triggerRender = true) {
      if (lang !== currentLang) {
        discardActiveProductionSession();
        selectedProductionScenarioId = '';
        document.getElementById('production-scenario-detail').innerHTML = '<div class="flex min-h-32 items-center justify-center text-center text-sm text-slate-400">Chọn một tình huống để xem mục tiêu và bắt đầu luyện.</div>';
        document.getElementById('production-report').classList.add('hidden');
      }
      currentLang = lang;
      saveState();

      document.body.className = document.body.className
        .replace(/theme-\w+/g, '') + ` theme-${lang}`;

      const formTag = document.getElementById('form-lang-tag');
      if (formTag) formTag.innerText = lang.toUpperCase();

      updateLangIndicator(lang);
      adaptAddWordFormForLang(lang);

      if (triggerRender) {
        renderAllViews();
      }
      syncZombieGameData();
    }

    function adaptAddWordFormForLang(lang) {
      const labelWord = document.getElementById('label-input-word');
      const inputWord = document.getElementById('input-word');
      const wordTools = document.getElementById('word-input-tools');
      const phoneticWrapper = document.getElementById('phonetic-wrapper');
      const labelPhonetic = document.getElementById('label-input-phonetic');
      const phoneticTools = document.getElementById('phonetic-tools');
      const inputPhonetic = document.getElementById('input-phonetic');

      hideIPAKeyboard();
      hideKoreanKeyboard();
      hidePinyinKeyboard();

      if (lang === 'ko') {
        if (labelWord) labelWord.innerText = 'Từ vựng (Hàn / Hangul) *';
        if (inputWord) inputWord.placeholder = 'Nhập từ vựng tiếng Hàn (ví dụ: 안녕하세요)...';
        if (wordTools) {
          wordTools.innerHTML = `
            <button type="button" onclick="toggleKoreanKeyboard()" class="text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1">
              <i class="fa-solid fa-keyboard"></i> Bàn phím Hàn
            </button>
            <span class="text-slate-300">|</span>
            <button type="button" onclick="openHandwritingModal('ko')" class="text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1">
              <i class="fa-solid fa-pen-nib"></i> Viết tay
            </button>
          `;
        }
        if (phoneticWrapper) phoneticWrapper.classList.add('hidden');
      } 
      else if (lang === 'zh') {
        if (labelWord) labelWord.innerText = 'Từ vựng (Trung / Hán tự) *';
        if (inputWord) inputWord.placeholder = 'Nhập Hán tự (ví dụ: 学习)...';
        if (wordTools) {
          wordTools.innerHTML = `
            <button type="button" onclick="openHandwritingModal('zh')" class="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1">
              <i class="fa-solid fa-pen-nib"></i> Viết tay Hán tự
            </button>
          `;
        }
        if (phoneticWrapper) phoneticWrapper.classList.remove('hidden');
        if (labelPhonetic) labelPhonetic.innerText = 'Phiên âm Pinyin (Bính âm)';
        if (inputPhonetic) inputPhonetic.placeholder = 'Ví dụ: xuéxí';
        if (phoneticTools) {
          phoneticTools.innerHTML = `
            <button type="button" onclick="togglePinyinKeyboard()" class="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1">
              <i class="fa-solid fa-language"></i> Thanh Dấu Pinyin
            </button>
          `;
        }
      } 
      else if (lang === 'ja') {
        if (labelWord) labelWord.innerText = 'Từ vựng (Nhật / Kanji / Kana) *';
        if (inputWord) inputWord.placeholder = 'Nhập từ vựng (ví dụ: 学校 / こんにちは)...';
        if (wordTools) {
          wordTools.innerHTML = `
            <button type="button" onclick="openHandwritingModal('ja')" class="text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
              <i class="fa-solid fa-pen-nib"></i> Viết tay Kanji
            </button>
          `;
        }
        if (phoneticWrapper) phoneticWrapper.classList.remove('hidden');
        if (labelPhonetic) labelPhonetic.innerText = 'Furigana / Romaji';
        if (inputPhonetic) inputPhonetic.placeholder = 'Ví dụ: がっこう (Gakkou)';
        if (phoneticTools) phoneticTools.innerHTML = '';
      } 
      else {
        if (labelWord) labelWord.innerText = 'Từ vựng (Tiếng Anh) *';
        if (inputWord) inputWord.placeholder = 'Nhập từ vựng (ví dụ: Perseverance)...';
        if (wordTools) wordTools.innerHTML = '';
        if (phoneticWrapper) phoneticWrapper.classList.remove('hidden');
        if (labelPhonetic) labelPhonetic.innerText = 'Phiên âm (IPA) / Ghi chú';
        if (inputPhonetic) inputPhonetic.placeholder = 'Ví dụ: /ˌpɜː.sɪˈvɪə.rəns/';
        if (phoneticTools) {
          phoneticTools.innerHTML = `
            <button type="button" onclick="toggleIPAKeyboard()" class="text-theme-main hover:underline flex items-center gap-1">
              <i class="fa-solid fa-keyboard"></i> Bàn phím IPA
            </button>
          `;
        }
      }
    }

    function updateLangIndicator(lang) {
      const activeBtn = document.getElementById(`lang-btn-${lang}`);
      const indicator = document.getElementById('lang-indicator');
      if (!activeBtn || !indicator) return;

      positionLangIndicator(activeBtn, lang);

      const allBtns = document.querySelectorAll('.lang-tab');
      allBtns.forEach(btn => {
        if (btn.id === `lang-btn-${lang}`) {
          btn.classList.remove('text-slate-600', 'dark:text-slate-400');
          btn.classList.add('text-white');
        } else {
          btn.classList.remove('text-white');
          btn.classList.add('text-slate-600', 'dark:text-slate-400');
        }
      });
    }

    function positionLangIndicator(button, lang) {
      const indicator = document.getElementById('lang-indicator');
      if (!button || !indicator) return;
      const colorMap = { en: 'bg-blue-600', ko: 'bg-pink-600', zh: 'bg-red-600', ja: 'bg-orange-600' };
      indicator.style.left = `${button.offsetLeft}px`;
      indicator.style.width = `${button.offsetWidth}px`;
      indicator.className = `absolute top-1 bottom-1 rounded-xl transition-all duration-300 ease-out shadow-lg pointer-events-none ${colorMap[lang] || 'bg-blue-600'}`;
    }

    function previewLangIndicator(lang) {
      positionLangIndicator(document.getElementById(`lang-btn-${lang}`), lang);
    }

    function restoreLangIndicator() {
      updateLangIndicator(currentLang);
    }

    function switchNavTab(tab) {
      if (tab !== 'game') exitGameFullscreen();
      currentTab = tab;
      const zombieGameFrame = document.getElementById('zombie-game-frame');
      if (tab === 'game' && zombieGameFrame && !zombieGameFrame.hasAttribute('src')) {
        zombieGameFrame.addEventListener('load', () => {
          zombieGameFrame.dataset.loaded = 'true';
          syncZombieGameData();
          zombieGameFrame.contentWindow?.postMessage({
            type: 'polyglot-host-visibility',
            visible: currentTab === 'game'
          }, '*');
        }, { once: true });
        zombieGameFrame.src = zombieGameFrame.dataset.src;
      } else {
        syncZombieGameData();
        zombieGameFrame?.contentWindow?.postMessage({
          type: 'polyglot-host-visibility',
          visible: tab === 'game'
        }, '*');
      }
      const views = ['vocab', 'flashcards', 'listening', 'production', 'game', 'nemesis', 'vip'];
      
      views.forEach(v => {
        const viewEl = document.getElementById(`view-${v}`);
        const navBtn = document.getElementById(`nav-${v}`);
        
        if (v === tab) {
          if (viewEl) viewEl.classList.remove('hidden');
          if (navBtn) {
            navBtn.classList.add('bg-theme', 'text-white', 'shadow-md');
            navBtn.classList.remove('text-slate-600', 'dark:text-slate-300', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
          }
        } else {
          if (viewEl) viewEl.classList.add('hidden');
          if (navBtn) {
            navBtn.classList.remove('bg-theme', 'text-white', 'shadow-md');
            navBtn.classList.add('text-slate-600', 'dark:text-slate-300', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
          }
        }
      });

      if (tab === 'game') {
        resetGameUI();
      } else {
        if (gameRunning) {
          gameRunning = false;
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }
      }

      renderAllViews();
    }

    function getProductionScenarios() {
      const languageOverrides = productionScenarioOverrides[currentLang] || {};
      return [
        ...PRODUCTION_SCENARIOS.map(scenario => ({
          ...scenario,
          ...(languageOverrides[scenario.id] || {})
        })),
        ...(Array.isArray(customProductionScenarios[currentLang]) ? customProductionScenarios[currentLang] : [])
      ];
    }

    function renderProductionScenarios() {
      const list = document.getElementById('production-scenario-list');
      if (!list) return;
      const query = document.getElementById('production-search')?.value.trim().toLocaleLowerCase() || '';
      const selectedLevel = document.getElementById('production-level')?.value || 'all';
      const selectedCategory = document.getElementById('production-category')?.value || 'all';
      const scenarios = getProductionScenarios().filter(scenario =>
        (selectedLevel === 'all' || scenario.level === selectedLevel) &&
        (selectedCategory === 'all' || scenario.category === selectedCategory) &&
        (!query || `${scenario.title} ${scenario.category} ${scenario.context}`.toLocaleLowerCase().includes(query))
      );
      if (!scenarios.length) {
        list.innerHTML = '<p class="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-400 dark:border-slate-700">Không tìm thấy tình huống phù hợp.</p>';
        return;
      }

      list.innerHTML = scenarios.map(scenario => `
        <button type="button" data-production-scenario="${escapeHTML(scenario.id)}" class="w-full rounded-xl border p-3 text-left transition ${selectedProductionScenarioId === scenario.id ? 'border-theme-main bg-theme-subtle shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500'}">
          <span class="flex items-start justify-between gap-2"><span class="text-sm font-bold text-slate-800 dark:text-slate-100">${escapeHTML(scenario.title)}</span><span class="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">${escapeHTML(scenario.level)}</span></span>
          <span class="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">${escapeHTML(scenario.category)}</span>
        </button>
      `).join('');
      list.querySelectorAll('[data-production-scenario]').forEach(button => {
        button.addEventListener('click', () => selectProductionScenario(button.dataset.productionScenario));
      });

      const selected = getProductionScenarios().find(scenario => scenario.id === selectedProductionScenarioId);
      if (selected) renderProductionScenarioDetail(selected);
      else document.getElementById('production-scenario-detail').innerHTML = '<div class="flex min-h-32 items-center justify-center text-center text-sm text-slate-400">Chọn một tình huống để xem mục tiêu và bắt đầu luyện.</div>';
    }

    function getScenarioVocabulary(scenario, language = currentLang) {
      const scenarioTerms = (scenario.vocabulary || []).map(term => term.toLocaleLowerCase());
      const learnedWords = wordsState.filter(word =>
        word.lang === language &&
        (word.srsLevel || 0) < 8 &&
        scenarioTerms.some(term =>
          term.includes(word.word.toLocaleLowerCase()) ||
          word.word.toLocaleLowerCase().includes(term) ||
          (word.meaning || '').toLocaleLowerCase().includes(term)
        )
      );
      return learnedWords.slice(0, 8);
    }

    function renderProductionScenarioDetail(scenario) {
      const detail = document.getElementById('production-scenario-detail');
      const targetWords = getScenarioVocabulary(scenario);
      detail.innerHTML = `
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div><span class="rounded-full bg-theme-subtle px-2.5 py-1 text-[11px] font-bold text-theme-main">${escapeHTML(scenario.category)} · ${escapeHTML(scenario.level)}</span><p class="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Ngôn ngữ luyện tập: ${escapeHTML(getProductionLanguageName(currentLang))} · Độ khó: ${escapeHTML(({ easy: 'Dễ', normal: 'Bình thường', challenging: 'Thử thách' })[document.getElementById('production-difficulty').value] || 'Bình thường')}</p><h3 class="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">${escapeHTML(scenario.title)}</h3></div>
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-subtle text-theme-main"><i class="fa-solid fa-comments"></i></span>
        </div>
        <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">${escapeHTML(scenario.context)}</p>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-3 dark:bg-slate-800"><p class="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Vai trò của bạn</p><p class="mt-1 text-sm font-bold">${escapeHTML(scenario.userRole)}</p></div>
          <div class="rounded-xl bg-white p-3 dark:bg-slate-800"><p class="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Vai nhân vật đối thoại</p><p class="mt-1 text-sm font-bold">${escapeHTML(scenario.aiRole)}</p></div>
        </div>
        <div class="mt-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
          <p class="text-xs font-extrabold uppercase tracking-wide text-slate-400">Mục tiêu giao tiếp</p><p class="mt-1 text-sm font-semibold">${escapeHTML(scenario.objective)}</p>
          <ul class="mt-2 space-y-1">${(scenario.tasks || []).map((task, index) => `<li class="flex gap-2 text-xs text-slate-600 dark:text-slate-300"><span class="production-task-check text-slate-300" data-task-index="${index}"><i class="fa-regular fa-circle"></i></span>${escapeHTML(task)}</li>`).join('')}</ul>
          <p class="mt-3 border-t border-slate-100 pt-2 text-[11px] leading-5 text-slate-500 dark:border-slate-700 dark:text-slate-400">Đánh giá dựa trên mục tiêu, từ khóa và mẫu phản hồi được khai báo. Câu trả lời chưa đủ dữ liệu sẽ được để bạn tự đối chiếu, không tự động chấm sai.</p>
        </div>
        <div class="mt-3">
          <p class="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Cụm từ có thể hữu ích <span class="font-medium normal-case">(không bắt buộc)</span></p>
          <div class="mt-1 flex flex-wrap gap-1.5">${(scenario.vocabulary || []).map(term => `<span class="rounded-full border border-slate-200 px-2 py-1 text-[11px] text-slate-600 dark:border-slate-700 dark:text-slate-300">${escapeHTML(term)}</span>`).join('')}</div>
          ${targetWords.length ? `<p class="mt-2 text-[11px] text-theme-main"><i class="fa-solid fa-bookmark mr-1"></i>Từ trong ngân hàng để thử dùng tự nhiên: ${targetWords.map(word => `<span class="font-bold">${escapeHTML(word.word)}</span>`).join(', ')}</p>` : ''}
        </div>
        <div class="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" onclick="startProductionSession()" class="listening-accent rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm"><i class="fa-solid fa-play mr-1"></i>Bắt đầu tình huống</button>
          <button type="button" onclick="editSelectedProductionScenario()" class="rounded-xl border border-slate-300 bg-white/80 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-white dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700"><i class="fa-solid fa-pen-to-square mr-1"></i>Chỉnh sửa tình huống</button>
          <span class="text-[11px] text-slate-400">Mức độ buổi luyện: <span id="production-difficulty-label" class="font-bold"></span></span>
        </div>`;
      const difficultyLabels = { easy: 'Dễ', normal: 'Bình thường', challenging: 'Thử thách' };
      document.getElementById('production-difficulty-label').innerText = difficultyLabels[document.getElementById('production-difficulty').value] || 'Bình thường';
    }

    function selectProductionScenario(id) {
      const scenario = getProductionScenarios().find(item => item.id === id);
      if (!scenario) return;
      if (activeProductionSession && !activeProductionSession.completed &&
          (activeProductionSession.scenario.id !== id || activeProductionSession.language !== currentLang)) {
        discardActiveProductionSession();
      }
      selectedProductionScenarioId = id;
      renderProductionScenarios();
      document.getElementById('production-report').classList.add('hidden');
    }

    function editSelectedProductionScenario() {
      const scenario = getProductionScenarios().find(item => item.id === selectedProductionScenarioId);
      if (!scenario) {
        showToast('Hãy chọn tình huống cần chỉnh sửa trước.', 'warning');
        return;
      }
      if (activeProductionSession && !activeProductionSession.completed) discardActiveProductionSession();
      editingProductionScenarioId = scenario.id;
      const taskCount = scenario.tasks.length;
      const copy = PRODUCTION_OFFLINE_COPY[currentLang] || PRODUCTION_OFFLINE_COPY.en;
      const builtInGuidance = PRODUCTION_SCENARIO_STAGE_GUIDANCE[scenario.id] || [];
      const taskCountForVocabulary = Math.max(taskCount, 1);
      const vocabPerStage = Math.ceil((scenario.vocabulary || []).length / taskCountForVocabulary);
      const lines = (selector, fallback) => Array.from({ length: taskCount }, (_, index) => {
        const stage = scenario.stages?.[index] || {};
        return selector(stage, index) ?? fallback(index);
      });
      document.getElementById('production-custom-scenario-title').innerText = 'Chỉnh sửa tình huống';
      document.getElementById('production-custom-title').value = scenario.title || '';
      document.getElementById('production-custom-category').value = scenario.category || 'Đời sống hằng ngày';
      document.getElementById('production-custom-level').value = scenario.level || 'B1';
      document.getElementById('production-custom-context').value = scenario.context || '';
      document.getElementById('production-custom-objective').value = scenario.objective || '';
      document.getElementById('production-custom-user-role').value = scenario.userRole || '';
      document.getElementById('production-custom-npc-role').value = scenario.aiRole || '';
      document.getElementById('production-custom-tasks').value = scenario.tasks.join('\n');
      document.getElementById('production-custom-prompts-vi').value = lines(
        (stage, index) => stage.promptVi || scenario.taskPromptsVi?.[index] || builtInGuidance[index]?.promptVi,
        index => scenario.tasks[index]
      ).join('\n');
      document.getElementById('production-custom-npc-prompts').value = lines(
        (stage, index) => stage.npcPrompt || scenario.npcPrompts?.[index] || builtInGuidance[index]?.npcPrompts?.[currentLang],
        () => ''
      ).join('\n');
      document.getElementById('production-custom-keywords').value = lines(
        (stage, index) => (stage.keywords || scenario.taskKeywords?.[index] || scenario.vocabulary.slice(index * vocabPerStage, (index + 1) * vocabPerStage)).join(', '),
        () => ''
      ).join('\n');
      document.getElementById('production-custom-alternatives').value = lines(
        (stage, index) => [
          ...(stage.acceptableAnswers || scenario.acceptableAnswers?.[index] || [copy.alternatives[index] || copy.alternatives[2]]),
          ...(stage.sampleAnswers || []).slice(1)
        ].join(', '),
        () => ''
      ).join('\n');
      document.getElementById('production-custom-grammar-cues').value = lines(
        (stage, index) => (stage.grammarCues || scenario.taskGrammarCues?.[index] || []).join(', '),
        () => ''
      ).join('\n');
      document.getElementById('production-custom-samples').value = lines(
        (stage, index) => stage.sampleAnswers?.[0] || scenario.sampleAnswers?.[index] || builtInGuidance[index]?.sampleAnswersByLanguage?.[currentLang]?.[0] || '',
        () => ''
      ).join('\n');
      document.getElementById('production-custom-scenario-language').innerText = `Chỉnh sửa tình huống để luyện bằng ${getProductionLanguageName(currentLang)}.`;
      document.getElementById('production-custom-scenario-modal').classList.remove('hidden');
      document.getElementById('production-custom-scenario-modal').classList.add('flex');
      document.body.style.overflow = 'hidden';
      document.getElementById('production-custom-title').focus();
    }

    function getProductionLanguageName(language) {
      return { en: 'English', ko: 'Korean', zh: 'Chinese (Simplified)', ja: 'Japanese' }[language] || 'English';
    }

    function getProductionLanguageNameVi(language) {
      return { en: 'tiếng Anh', ko: 'tiếng Hàn', zh: 'tiếng Trung', ja: 'tiếng Nhật' }[language] || 'ngôn ngữ đang học';
    }

    function getProductionLanguageLocale(language) {
      return { en: 'en-US', ko: 'ko-KR', zh: 'zh-CN', ja: 'ja-JP' }[language] || 'en-US';
    }

    const PRODUCTION_OFFLINE_COPY = {
      en: {
        opening: ['Hello, welcome. What can I help you with?', 'I see. Could you tell me a little more?', 'What would you like to do next?'],
        positive: ['That makes sense. Let’s continue.', 'Thank you for explaining. What would work best for you?', 'All right, let’s confirm the next step.'],
        acceptable: ['Thanks, I understand. Could you add one more detail?', 'That could work. What else should we consider?', 'I understand your choice. Is there anything you would like to confirm?'],
        retry: ['I’m not sure I understood. Could you try saying that another way?', 'Could you share one more detail so I can help?', 'What would you like me to do about the situation?'],
        hint: ['Try: greeting + your need + one detail.', 'Try a polite question about an option, detail, or next step.', 'Try: choose an option + confirm what should happen next.'],
        samples: ['Hello, I need help with this situation. Could you check it for me?', 'Could you tell me what options are available?', 'That option works for me. Could you please confirm the next step?'],
        alternatives: ['Excuse me, I would like to ask about this, please.', 'Would you mind explaining the choices?', 'I agree with that plan. Let’s confirm it.'],
        ineffective: ['i do not know', 'i don’t know', 'no idea', 'never mind', 'nothing']
      },
      ko: {
        opening: ['안녕하세요. 무엇을 도와드릴까요?', '그렇군요. 조금 더 자세히 말씀해 주시겠어요?', '다음으로 어떻게 하고 싶으세요?'],
        positive: ['알겠습니다. 계속 이야기해 볼까요?', '설명해 주셔서 감사합니다. 어떤 방법이 좋을까요?', '좋습니다. 다음 단계를 확인해 볼게요.'],
        acceptable: ['네, 이해했습니다. 한 가지 더 말씀해 주시겠어요?', '그 방법도 괜찮겠네요. 다른 점도 확인해 볼까요?', '알겠습니다. 더 확인하고 싶은 것이 있나요?'],
        retry: ['잘 이해하지 못했어요. 다른 표현으로 말씀해 주시겠어요?', '도와드릴 수 있도록 자세한 내용을 알려 주세요.', '이 상황에서 어떻게 하고 싶으세요?'],
        hint: ['인사 + 필요한 것 + 구체적인 정보 한 가지를 말해 보세요.', '선택지나 필요한 정보를 정중하게 질문해 보세요.', '선택한 방법을 말하고 다음 단계를 확인해 보세요.'],
        samples: ['안녕하세요. 이 상황에 대해 도움이 필요합니다. 확인해 주시겠어요?', '가능한 선택지를 알려 주시겠어요?', '그 방법이 좋습니다. 다음 단계를 확인해 주시겠어요?'],
        alternatives: ['실례합니다. 이것에 대해 여쭤보고 싶습니다.', '가능한 방법을 설명해 주실 수 있나요?', '그 계획에 동의합니다. 확인해 주세요.'],
        ineffective: ['모르겠어요', '몰라요', '괜찮아요 됐어요', '아무것도 없어요']
      },
      zh: {
        opening: ['您好，请问有什么可以帮您？', '我明白了。可以再告诉我一些细节吗？', '您接下来想怎么处理？'],
        positive: ['好的，我们继续讨论。', '谢谢您说明情况。您觉得哪种办法合适？', '好，我们来确认下一步。'],
        acceptable: ['我明白了。可以再补充一个细节吗？', '这个办法可以考虑。还有什么需要确认的吗？', '好的，您还想确认什么？'],
        retry: ['我还不太明白，可以换一种说法吗？', '请再告诉我一些细节，这样我才能帮您。', '您希望怎么解决这个问题？'],
        hint: ['试试：问候 + 说明需要 + 提供一个具体信息。', '礼貌地询问一个选择、细节或下一步。', '说明选择，并确认接下来要做什么。'],
        samples: ['您好，我需要处理这个问题。可以帮我查一下吗？', '请问有哪些选择？', '这个办法可以。请帮我确认下一步。'],
        alternatives: ['不好意思，我想咨询一下这个问题。', '可以请您说明一下有哪些办法吗？', '我同意这个方案，请确认下一步。'],
        ineffective: ['不知道', '我不知道', '算了', '没什么']
      },
      ja: {
        opening: ['こんにちは。どのようなご用件でしょうか。', 'そうですか。もう少し詳しく教えていただけますか。', '次にどうしたいですか。'],
        positive: ['わかりました。続けましょう。', '説明してくださってありがとうございます。どの方法がよろしいですか。', 'では、次の手順を確認しましょう。'],
        acceptable: ['わかりました。もう一つ詳しく教えていただけますか。', 'その方法もよさそうですね。他に確認したいことはありますか。', '承知しました。他に確認することはありますか。'],
        retry: ['よくわかりませんでした。別の言い方でお願いできますか。', 'お手伝いできるよう、もう少し詳しく教えてください。', 'この状況をどのように解決したいですか。'],
        hint: ['あいさつ + 必要なこと + 具体的な情報を一つ伝えましょう。', '選択肢や必要な情報を丁寧に質問しましょう。', '選んだ方法を伝え、次の手順を確認しましょう。'],
        samples: ['こんにちは。この件について相談したいです。確認していただけますか。', 'どのような選択肢がありますか。', 'その方法でお願いします。次の手順を確認していただけますか。'],
        alternatives: ['すみません、この件について相談したいです。', '可能な方法を教えていただけますか。', 'その案に賛成です。次の手順を確認してください。'],
        ineffective: ['わかりません', '知りません', 'もういいです', '何もありません']
      }
    };

    const PRODUCTION_TERM_PATTERNS = {
      order: { ko: ['주문'], zh: ['点餐', '订单'], ja: ['注文'] },
      menu: { ko: ['메뉴'], zh: ['菜单'], ja: ['メニュー'] },
      recommend: { ko: ['추천'], zh: ['推荐'], ja: ['おすすめ'] },
      allergy: { ko: ['알레르기'], zh: ['过敏'], ja: ['アレルギー'] },
      bill: { ko: ['계산서', '계산'], zh: ['账单', '结账'], ja: ['会計', 'お会計'] },
      size: { ko: ['사이즈', '크기'], zh: ['尺码', '尺寸'], ja: ['サイズ'] },
      price: { ko: ['가격'], zh: ['价格'], ja: ['値段', '価格'] },
      exchange: { ko: ['교환'], zh: ['换货', '交换'], ja: ['交換'] },
      receipt: { ko: ['영수증'], zh: ['收据', '小票'], ja: ['レシート', '領収書'] },
      station: { ko: ['역'], zh: ['车站', '车站'], ja: ['駅'] },
      turn: { ko: ['돌다', '회전'], zh: ['转弯'], ja: ['曲がる'] },
      straight: { ko: ['직진'], zh: ['直走'], ja: ['まっすぐ'] },
      ticket: { ko: ['표', '티켓'], zh: ['票', '车票'], ja: ['切符', 'チケット'] },
      platform: { ko: ['승강장'], zh: ['站台'], ja: ['ホーム'] },
      schedule: { ko: ['시간표', '일정'], zh: ['时刻表', '时间表'], ja: ['時刻表', '予定'] },
      fare: { ko: ['요금'], zh: ['票价'], ja: ['運賃'] },
      appointment: { ko: ['예약', '약속'], zh: ['预约'], ja: ['予約', '約束'] },
      available: { ko: ['가능', '시간이 있다'], zh: ['有空', '可以'], ja: ['空いている', '可能'] },
      reschedule: { ko: ['일정을 변경', '예약 변경'], zh: ['改期', '更改预约'], ja: ['予定を変更', '予約変更'] },
      reservation: { ko: ['예약'], zh: ['预订', '预约'], ja: ['予約'] },
      confirmation: { ko: ['확인서', '확인'], zh: ['确认', '确认函'], ja: ['確認', '確認書'] },
      alternative: { ko: ['대안', '다른 방법'], zh: ['替代方案', '其他办法'], ja: ['代替案', '別の方法'] },
      flight: { ko: ['항공편', '비행기'], zh: ['航班', '飞机'], ja: ['便', '飛行機'] },
      departure: { ko: ['출발'], zh: ['出发'], ja: ['出発'] },
      fee: { ko: ['수수료', '요금'], zh: ['费用', '手续费'], ja: ['手数料', '料金'] },
      luggage: { ko: ['수하물', '짐'], zh: ['行李'], ja: ['荷物'] },
      suitcase: { ko: ['여행 가방', '캐리어'], zh: ['行李箱'], ja: ['スーツケース'] },
      deliver: { ko: ['배달', '배송'], zh: ['送到', '运送'], ja: ['届ける', '配送'] },
      clarify: { ko: ['설명', '명확'], zh: ['解释', '说明'], ja: ['説明', '確認'] },
      instruction: { ko: ['지시', '안내'], zh: ['说明', '指示'], ja: ['指示', '説明'] },
      example: { ko: ['예시', '예를'], zh: ['例子', '举例'], ja: ['例', '例えば'] },
      requirement: { ko: ['요구 사항', '조건'], zh: ['要求', '条件'], ja: ['要件', '条件'] },
      submit: { ko: ['제출'], zh: ['提交'], ja: ['提出'] },
      deadline: { ko: ['마감일', '기한'], zh: ['截止日期', '期限'], ja: ['締め切り', '期限'] },
      progress: { ko: ['진행 상황'], zh: ['进度'], ja: ['進捗'] },
      experience: { ko: ['경험'], zh: ['经验'], ja: ['経験'] },
      challenge: { ko: ['도전', '어려움'], zh: ['挑战', '困难'], ja: ['課題', '困難'] },
      strength: { ko: ['강점'], zh: ['优势'], ja: ['強み'] },
      refund: { ko: ['환불'], zh: ['退款'], ja: ['返金'] },
      replace: { ko: ['교체', '바꾸다'], zh: ['更换', '换'], ja: ['交換', '取り替える'] },
      warranty: { ko: ['보증', '보증서'], zh: ['保修', '质保'], ja: ['保証'] },
      emergency: { ko: ['응급', '긴급'], zh: ['紧急', '急救'], ja: ['緊急', '救急'] },
      location: { ko: ['위치', '장소'], zh: ['位置', '地点'], ja: ['場所', '位置'] },
      help: { ko: ['도움', '도와'], zh: ['帮助', '帮忙'], ja: ['助け', '手伝'] },
      apology: { ko: ['죄송', '사과'], zh: ['抱歉', '道歉'], ja: ['申し訳', '謝罪'] },
      compromise: { ko: ['타협'], zh: ['妥协'], ja: ['妥協'] },
      solution: { ko: ['해결', '방법'], zh: ['解决', '办法'], ja: ['解決', '方法'] }
    };

    const PRODUCTION_GRAMMAR_PATTERNS = {
      en: [
        { label: 'Yêu cầu lịch sự', pattern: /\b(could you|would you|please)\b/i },
        { label: 'Nêu lý do/kết quả', pattern: /\b(because|so|therefore)\b/i }
      ],
      ko: [
        { label: 'Yêu cầu lịch sự', pattern: /(주시겠어요|수 있을까요|주세요)/u },
        { label: 'Nêu lý do', pattern: /(때문에|그래서)/u }
      ],
      zh: [
        { label: 'Yêu cầu lịch sự', pattern: /(请问|可以.{0,8}吗|能不能)/u },
        { label: 'Nêu lý do/kết quả', pattern: /(因为|所以)/u }
      ],
      ja: [
        { label: 'Yêu cầu lịch sự', pattern: /(いただけますか|ください|でしょうか)/u },
        { label: 'Nêu lý do', pattern: /(ので|から)/u }
      ]
    };

    function updateProductionLoading(isLoading, message = '') {
      const send = document.getElementById('production-send-btn');
      const end = document.getElementById('production-end-btn');
      const status = document.getElementById('production-voice-status');
      send.disabled = isLoading;
      send.classList.toggle('opacity-50', isLoading);
      send.innerHTML = isLoading ? '<i class="fa-solid fa-spinner fa-spin"></i>' : '<i class="fa-solid fa-paper-plane"></i>';
      end.disabled = isLoading;
      end.classList.toggle('opacity-50', isLoading);
      end.classList.toggle('cursor-not-allowed', isLoading);
      status.innerText = message;
    }

    function openProductionSession() {
      if (!activeProductionSession || activeProductionSession.completed) return;
      const bodyTheme = getComputedStyle(document.body);
      const session = document.getElementById('production-session');
      session.style.setProperty('--session-gradient-a', bodyTheme.getPropertyValue('--page-gradient-a').trim());
      session.style.setProperty('--session-gradient-b', bodyTheme.getPropertyValue('--page-gradient-b').trim());
      session.style.setProperty('--session-gradient-c', bodyTheme.getPropertyValue('--page-gradient-c').trim());
      document.getElementById('production-session-modal').classList.remove('hidden');
      document.getElementById('production-session-modal').classList.add('flex');
      session.classList.remove('hidden');
      document.getElementById('production-resume-btn').classList.add('hidden');
      document.body.style.overflow = 'hidden';
      document.getElementById('production-message').focus();
    }

    function openProductionHandwriting() {
      if (!activeProductionSession || !['ko', 'zh', 'ja'].includes(activeProductionSession.language)) return;
      openHandwritingModal(activeProductionSession.language, 'production-message');
    }

    function closeProductionSession() {
      const modal = document.getElementById('production-session-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.getElementById('production-session').classList.add('hidden');
      document.getElementById('production-resume-btn').classList.toggle('hidden', !activeProductionSession || activeProductionSession.completed);
      document.body.style.overflow = '';
    }

    function discardActiveProductionSession() {
      if (!activeProductionSession) return;
      closeProductionSession();
      stopRemoteSpeech();
      window.speechSynthesis?.cancel();
      activeProductionSession = null;
      document.getElementById('production-transcript').innerHTML = '';
      document.getElementById('production-hints').classList.add('hidden');
      document.getElementById('production-stage-feedback').classList.add('hidden');
      document.getElementById('production-resume-btn').classList.add('hidden');
    }

    function openCustomProductionScenarioModal() {
      const modal = document.getElementById('production-custom-scenario-modal');
      editingProductionScenarioId = '';
      document.getElementById('production-custom-form').reset();
      document.getElementById('production-custom-scenario-title').innerText = 'Tạo tình huống riêng';
      document.getElementById('production-custom-submit').innerHTML = '<i class="fa-solid fa-floppy-disk mr-2"></i>Lưu tình huống';
      document.getElementById('production-custom-level').value = 'B1';
      document.getElementById('production-custom-scenario-language').innerText = `Thiết kế tình huống để luyện bằng ${getProductionLanguageName(currentLang)}.`;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      document.getElementById('production-custom-title').focus();
    }

    function closeCustomProductionScenarioModal() {
      const modal = document.getElementById('production-custom-scenario-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
      editingProductionScenarioId = '';
      document.querySelector('[aria-controls="production-custom-scenario-modal"]')?.focus();
    }

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        if (!document.getElementById('production-custom-scenario-modal').classList.contains('hidden')) {
          closeCustomProductionScenarioModal();
        } else if (!document.getElementById('production-session-modal').classList.contains('hidden')) {
          closeProductionSession();
        }
      }
    });

    function startProductionSession(replayScenarioId = '') {
      const scenario = getProductionScenarios().find(item => item.id === (replayScenarioId || selectedProductionScenarioId));
      if (!scenario) {
        showToast('Hãy chọn một tình huống trước.', 'warning');
        return;
      }
      if (activeProductionSession && !activeProductionSession.completed &&
          activeProductionSession.scenario.id === scenario.id &&
          activeProductionSession.language === currentLang && !replayScenarioId) {
        openProductionSession();
        return;
      }
      discardActiveProductionSession();
      stopRemoteSpeech();
      window.speechSynthesis?.cancel();
      activeProductionSession = {
        id: `production-${Date.now()}`,
        scenario,
        language: currentLang,
        level: scenario.level,
        difficulty: document.getElementById('production-difficulty').value,
        messages: [],
        objectivesCompleted: [],
        stageIndex: 0,
        stageResults: [],
        stageAttempts: [],
        hintCount: 0,
        retryCount: 0,
        sampleReveals: 0,
        usedTargetWords: [],
        startedAt: new Date().toISOString(),
        targetWords: getScenarioVocabulary(scenario).map(word => ({ word: word.word, meaning: word.meaning })),
        completed: false
      };
      document.getElementById('production-report').classList.add('hidden');
      document.getElementById('production-session-title').innerText = `${scenario.title} · ${getProductionLanguageName(activeProductionSession.language)}`;
      openProductionSession();
      document.getElementById('production-transcript').innerHTML = '';
      document.getElementById('production-hints').classList.add('hidden');
      document.getElementById('production-stage-feedback').classList.add('hidden');
      renderProductionProgress();
      updateProductionLoading(false, '');
      appendProductionMessage('npc', getProductionNpcPrompt(activeProductionSession, 0));
      renderProductionStage();
    }

    function getProductionStage(session, index = session.stageIndex) {
      const authoredStage = session.scenario.stages?.[index] || {};
      const builtInGuidance = PRODUCTION_SCENARIO_STAGE_GUIDANCE[session.scenario.id]?.[index] || {};
      const taskCount = session.scenario.tasks.length;
      const vocabPerStage = Math.ceil((session.scenario.vocabulary || []).length / taskCount);
      const vocabulary = (session.scenario.vocabulary || []).slice(index * vocabPerStage, (index + 1) * vocabPerStage);
      const copy = PRODUCTION_OFFLINE_COPY[session.language] || PRODUCTION_OFFLINE_COPY.en;
      const sampleAnswers = authoredStage.sampleAnswers?.length
        ? authoredStage.sampleAnswers
        : session.scenario.sampleAnswers?.[index] ? [session.scenario.sampleAnswers[index]]
          : builtInGuidance.sampleAnswersByLanguage?.[session.language] || [copy.samples[index] || copy.samples[2]];
      return {
        task: session.scenario.tasks[index],
        promptVi: authoredStage.promptVi || session.scenario.taskPromptsVi?.[index] || builtInGuidance.promptVi || session.scenario.tasks[index],
        npcPrompt: authoredStage.npcPrompt || session.scenario.npcPrompts?.[index] || builtInGuidance.npcPrompts?.[session.language] || '',
        keywords: authoredStage.keywords || session.scenario.taskKeywords?.[index] || vocabulary,
        acceptedAnswers: authoredStage.acceptedAnswers?.length ? authoredStage.acceptedAnswers : sampleAnswers,
        acceptableAnswers: authoredStage.acceptableAnswers?.length ? authoredStage.acceptableAnswers : [copy.alternatives[index] || copy.alternatives[2]],
        ineffectiveAnswers: authoredStage.ineffectiveAnswers || PRODUCTION_OFFLINE_COPY[session.language].ineffective,
        sampleAnswers,
        requiredKeywordGroups: authoredStage.requiredKeywordGroups || builtInGuidance.requiredKeywordGroups?.[session.language] || [],
        grammarCues: authoredStage.grammarCues || session.scenario.taskGrammarCues?.[index] || [],
        hint: authoredStage.hint || ''
      };
    }

    function getProductionNpcPrompt(session, index, outcome = '') {
      const authoredPrompt = getProductionStage(session, index).npcPrompt;
      if (authoredPrompt && !outcome) return authoredPrompt;
      const copy = PRODUCTION_OFFLINE_COPY[session.language] || PRODUCTION_OFFLINE_COPY.en;
      const lines = outcome === 'success' ? copy.positive
        : outcome === 'acceptable' ? copy.acceptable
          : outcome === 'uncertain' || outcome === 'ineffective' ? copy.retry : copy.opening;
      return lines[Math.min(index, lines.length - 1)];
    }

    function renderProductionStage() {
      const session = activeProductionSession;
      if (!session) return;
      const index = session.stageIndex;
      const total = session.scenario.tasks.length;
      document.getElementById('production-stage-title').innerText = `Bước ${Math.min(index + 1, total)} / ${total}`;
      document.getElementById('production-stage-prompt-label').innerText = `Gợi ý câu trả lời bằng tiếng Việt · Hãy viết bằng ${getProductionLanguageNameVi(session.language)}`;
      document.getElementById('production-stage-task').innerText = getProductionStage(session).promptVi || 'Hãy diễn đạt mục tiêu của bước này bằng ngôn ngữ đang học.';
      document.getElementById('production-message').disabled = index >= total;
      document.getElementById('production-send-btn').disabled = index >= total;
      document.getElementById('production-message').placeholder = index >= total ? 'Đã hoàn thành tình huống. Xem báo cáo để ôn lại.' : `Dựa vào gợi ý tiếng Việt phía trên, hãy tự viết bằng ${getProductionLanguageNameVi(session.language)}...`;
      const handwritingButton = document.getElementById('production-handwriting-btn');
      handwritingButton.classList.toggle('hidden', !['ko', 'zh', 'ja'].includes(session.language) || index >= total);
      renderProductionProgress();
    }

    function normalizeProductionText(value) {
      return value.toLocaleLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
    }

    function productionTextContains(text, phrase) {
      const normalizedText = normalizeProductionText(text);
      const normalizedPhrase = normalizeProductionText(phrase);
      if (!normalizedPhrase) return false;
      if (/[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]/u.test(normalizedPhrase)) return normalizedText.includes(normalizedPhrase);
      return (` ${normalizedText} `).includes(` ${normalizedPhrase} `);
    }

    function getProductionKeywordVariants(keyword, language) {
      const normalized = normalizeProductionText(keyword);
      const translations = PRODUCTION_TERM_PATTERNS[normalized]?.[language] || [];
      return [keyword, ...translations];
    }

    function evaluateProductionResponse(response, stage, language) {
      const matchedGrammarPatterns = [
        ...(PRODUCTION_GRAMMAR_PATTERNS[language] || []).filter(item => item.pattern.test(response)).map(item => item.label),
        ...stage.grammarCues.filter(cue => productionTextContains(response, cue))
      ];
      const result = (outcome, matchedKeywords = [], confidence = 'low') => ({
        outcome,
        matchedKeywords,
        matchedGrammarPatterns,
        confidence
      });
      const explicitIneffective = stage.ineffectiveAnswers.some(pattern => productionTextContains(response, pattern));
      if (explicitIneffective) return result('ineffective', [], 'high');
      if (stage.acceptedAnswers.some(pattern => productionTextContains(response, pattern))) {
        return result('success', [], 'high');
      }
      if (stage.acceptableAnswers.some(pattern => productionTextContains(response, pattern))) {
        return result('acceptable', [], 'high');
      }
      if (stage.requiredKeywordGroups.length) {
        const matchedGroups = stage.requiredKeywordGroups.filter(group =>
          group.some(keyword => productionTextContains(response, keyword))
        );
        const missingRequiredGroups = stage.requiredKeywordGroups.filter(group =>
          !group.some(keyword => productionTextContains(response, keyword))
        );
        const strictResult = result(missingRequiredGroups.length ? 'uncertain' : 'success', matchedGroups.flat(), missingRequiredGroups.length ? 'low' : 'high');
        strictResult.missingRequiredGroups = missingRequiredGroups;
        return strictResult;
      }
      const matchedKeywords = stage.keywords.filter(keyword =>
        getProductionKeywordVariants(keyword, language).some(variant => productionTextContains(response, variant))
      );
      if (matchedKeywords.length >= 2) return result('success', matchedKeywords, 'high');
      if (matchedKeywords.length === 1) return result('acceptable', matchedKeywords, 'medium');
      return result('uncertain', matchedKeywords);
    }

    function renderProductionStageFeedback(result, stage) {
      const panel = document.getElementById('production-stage-feedback');
      const labels = {
        success: ['Đạt mục tiêu', 'Câu trả lời khớp với tiêu chí đã khai báo.'],
        acceptable: ['Chấp nhận được', 'Câu trả lời có ý liên quan. Bạn có thể bổ sung thêm chi tiết nếu muốn.'],
        ineffective: ['Thử diễn đạt lại', 'Phản hồi này chưa cung cấp thông tin để giải quyết tình huống.'],
        uncertain: ['Chưa thể tự động kết luận', 'Câu trả lời hợp lệ có thể dùng cách diễn đạt khác. Hãy tự đối chiếu với mục tiêu và câu mẫu.']
      };
      const [title, defaultDescription] = labels[result.outcome];
      const description = result.missingRequiredGroups?.length
        ? 'Câu trả lời chưa thể hiện đủ các ý trong gợi ý. Hãy thử lại và diễn đạt đủ nội dung cần nói.'
        : defaultDescription;
      const matches = result.matchedKeywords.length ? `<p class="mt-1 text-[11px] text-slate-500">Từ khóa nhận diện: ${result.matchedKeywords.map(escapeHTML).join(', ')}</p>` : '';
      const grammarMatches = result.matchedGrammarPatterns?.length ? `<p class="mt-1 text-[11px] text-slate-500">Cấu trúc đã dùng: ${result.matchedGrammarPatterns.map(escapeHTML).join(', ')}</p>` : '';
      const missing = result.missingRequiredGroups?.length
        ? `<p class="mt-1 text-[11px] text-amber-700 dark:text-amber-300">Cần thể hiện thêm ít nhất một ý: ${result.missingRequiredGroups.map(group => group.map(escapeHTML).join(' / ')).join('; ')}</p>`
        : '';
      const actions = result.outcome === 'success' || result.outcome === 'acceptable'
        ? `<button type="button" onclick="continueProductionStage()" class="mt-3 rounded-lg bg-theme px-3 py-2 text-xs font-bold text-white">${activeProductionSession.stageIndex + 1 >= activeProductionSession.scenario.tasks.length ? 'Hoàn thành tình huống' : 'Tiếp tục'}<i class="fa-solid fa-arrow-right ml-2"></i></button>`
        : `<div class="mt-3 flex flex-wrap gap-2"><button type="button" onclick="retryProductionStage()" class="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold dark:border-slate-600">Thử trả lời lại</button><button type="button" onclick="showProductionSampleAnswers()" class="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold dark:border-slate-600">Xem câu mẫu</button></div>`;
      panel.innerHTML = `<p class="text-xs font-extrabold text-slate-800 dark:text-slate-100">${title}</p><p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">${description}</p>${matches}${grammarMatches}${missing}${actions}<div id="production-sample-answers" class="mt-3 hidden"></div>`;
      panel.classList.remove('hidden');
    }

    function appendProductionMessage(role, text) {
      if (!activeProductionSession) return;
      const message = { role, text: text.trim(), at: new Date().toISOString() };
      activeProductionSession.messages.push(message);
      const transcript = document.getElementById('production-transcript');
      const bubble = document.createElement('div');
      bubble.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'}`;
      const content = document.createElement('div');
      content.className = `max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${role === 'user' ? 'bg-theme text-white' : 'border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'}`;
      content.innerText = text;
      bubble.appendChild(content);
      transcript.appendChild(bubble);
      transcript.scrollTop = transcript.scrollHeight;
      if (role === 'npc') speakWord(text, activeProductionSession.language);
    }

    function renderProductionProgress() {
      if (!activeProductionSession) return;
      const session = activeProductionSession;
      const total = session.scenario.tasks.length;
      const done = session.objectivesCompleted.length;
      document.getElementById('production-progress').innerText = `Mục tiêu: ${done}/${total} · Lượt trả lời: ${session.messages.filter(message => message.role === 'user').length}`;
      document.querySelectorAll('#production-scenario-detail .production-task-check').forEach(element => {
        const index = Number(element.dataset.taskIndex);
        const complete = session.objectivesCompleted.includes(index);
        const selfAssessed = session.stageResults.some(result => result.index === index && result.status === 'self-assessed');
        element.classList.toggle('text-emerald-500', complete);
        element.classList.toggle('text-amber-500', selfAssessed);
        element.classList.toggle('text-slate-300', !complete);
        element.innerHTML = complete ? '<i class="fa-solid fa-circle-check"></i>' : selfAssessed ? '<i class="fa-solid fa-circle-question"></i>' : '<i class="fa-regular fa-circle"></i>';
      });
    }

    function sendProductionMessage(event) {
      event.preventDefault();
      if (!activeProductionSession || activeProductionSession.completed) return;
      const input = document.getElementById('production-message');
      const text = input.value.trim();
      if (!text) return;
      if (text.length > 1200) {
        showToast('Câu trả lời tối đa 1.200 ký tự.', 'warning');
        return;
      }
      if (activeProductionSession.messages.filter(message => message.role === 'user').length >= 20) {
        showToast('Đã đạt giới hạn 20 lượt. Kết thúc buổi luyện để xem báo cáo.', 'warning');
        return;
      }
      const session = activeProductionSession;
      const stageIndex = session.stageIndex;
      const stage = getProductionStage(session);
      const attempts = (session.stageAttempts[stageIndex] || 0) + 1;
      session.stageAttempts[stageIndex] = attempts;
      if (attempts > 1) session.retryCount++;
      input.value = '';
      appendProductionMessage('user', text);
      const result = evaluateProductionResponse(text, stage, session.language);
      result.index = stageIndex;
      result.response = text;
      result.attempt = attempts;
      session.stageResults = session.stageResults.filter(item => item.index !== stageIndex);
      session.stageResults.push(result);
      session.targetWords.forEach(item => {
        if (productionTextContains(text, item.word) && !session.usedTargetWords.includes(item.word)) session.usedTargetWords.push(item.word);
      });
      appendProductionMessage('npc', getProductionNpcPrompt(session, stageIndex, result.outcome));
      renderProductionStageFeedback(result, stage);
      renderProductionProgress();
      input.focus();
    }

    function requestProductionHint(type) {
      if (!activeProductionSession) return;
      const session = activeProductionSession;
      const stage = getProductionStage(session);
      session.hintCount++;
      const hints = document.getElementById('production-hints');
      const copy = PRODUCTION_OFFLINE_COPY[session.language] || PRODUCTION_OFFLINE_COPY.en;
      const content = type === 'vocabulary'
        ? [...stage.keywords, ...session.targetWords.map(item => item.word)].slice(0, 8).join(' · ') || 'Thử sử dụng một từ trong ngân hàng từ vựng.'
        : stage.hint || copy.hint[session.stageIndex] || copy.hint[0];
      hints.innerHTML = `<p class="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">${type === 'vocabulary' ? 'Gợi ý từ vựng' : 'Gợi ý cấu trúc câu'}</p><p class="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">${escapeHTML(content)}</p>`;
      hints.classList.remove('hidden');
    }

    function showProductionSampleAnswers() {
      if (!activeProductionSession) return;
      const session = activeProductionSession;
      if (!session.stageResults.some(item => item.index === session.stageIndex)) {
        showToast('Hãy thử tự viết câu trả lời trước khi xem mẫu.', 'info');
        return;
      }
      session.sampleReveals++;
      const panel = document.getElementById('production-sample-answers');
      if (!panel) return;
      const stage = getProductionStage(session);
      const choices = [
        { label: 'Phản hồi hiệu quả', text: stage.acceptedAnswers[0] || stage.sampleAnswers[0] },
        { label: 'Cách diễn đạt khác', text: stage.acceptableAnswers[0] || '' },
        { label: 'Phản hồi chưa hiệu quả', text: stage.ineffectiveAnswers[0] || '' }
      ].filter(choice => choice.text);
      panel.innerHTML = `<p class="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Câu trả lời mẫu · chọn để đưa vào ô viết</p><div class="mt-2 space-y-2">${choices.map(choice => `<button type="button" class="w-full rounded-lg border border-slate-200 bg-white/70 p-2 text-left text-xs leading-5 hover:border-theme-main dark:border-slate-700 dark:bg-slate-900/60" data-production-sample="${escapeHTML(choice.text)}"><span class="mb-1 block text-[9px] font-extrabold uppercase text-theme-main">${choice.label}</span>${escapeHTML(choice.text)}</button>`).join('')}</div>`;
      panel.classList.remove('hidden');
      panel.querySelectorAll('[data-production-sample]').forEach(button => button.addEventListener('click', () => {
        document.getElementById('production-message').value = button.dataset.productionSample;
        document.getElementById('production-message').focus();
      }));
    }

    function continueProductionStage() {
      const session = activeProductionSession;
      if (!session) return;
      const current = session.stageResults.find(item => item.index === session.stageIndex);
      if (!current || !['success', 'acceptable', 'self-assessed'].includes(current.outcome)) return;
      if (!session.objectivesCompleted.includes(session.stageIndex)) session.objectivesCompleted.push(session.stageIndex);
      session.stageIndex++;
      document.getElementById('production-stage-feedback').classList.add('hidden');
      document.getElementById('production-hints').classList.add('hidden');
      if (session.stageIndex < session.scenario.tasks.length) {
        appendProductionMessage('npc', getProductionNpcPrompt(session, session.stageIndex));
      } else {
        appendProductionMessage('npc', getProductionNpcPrompt(session, session.scenario.tasks.length - 1, 'success'));
        showToast('Đã đi hết các bước của tình huống. Bạn có thể kết thúc để xem báo cáo.', 'success');
      }
      renderProductionStage();
    }

    function retryProductionStage() {
      if (!activeProductionSession) return;
      document.getElementById('production-stage-feedback').classList.add('hidden');
      document.getElementById('production-message').value = '';
      document.getElementById('production-message').focus();
    }

    function finishProductionSession() {
      const session = activeProductionSession;
      if (!session || session.completed) return;
      session.completed = true;
      const report = createBasicProductionReport(session);
      const record = {
        id: session.id,
        scenarioId: session.scenario.id,
        scenarioTitle: session.scenario.title,
        category: session.scenario.category,
        level: session.level,
        language: session.language,
        completedAt: new Date().toISOString(),
        transcript: session.messages,
        report,
        hintCount: session.hintCount,
        retryCount: session.retryCount
      };
      productionHistory.unshift(record);
      productionHistory = productionHistory.slice(0, 100);
      try {
        localStorage.setItem(PRODUCTION_HISTORY_STORAGE_KEY, JSON.stringify(productionHistory));
      } catch (error) {
        console.error('Unable to save active production history:', error);
        showToast('Báo cáo tạo được nhưng không thể lưu lịch sử vào bộ nhớ trình duyệt.', 'error');
      }
      renderProductionReport(record);
      renderProductionHistory();
      activeProductionSession = null;
      closeProductionSession();
      document.getElementById('production-resume-btn').classList.add('hidden');
    }

    function createBasicProductionReport(session) {
      const taskResults = session.scenario.tasks.map((task, index) => {
        const result = session.stageResults.find(item => item.index === index);
        const status = session.objectivesCompleted.includes(index) ? (result?.status === 'self-assessed' ? 'self-assessed' : result?.outcome || 'complete') : result?.outcome || 'not-attempted';
        return {
          task,
          index,
          status,
          response: result?.response || '',
          matchedKeywords: result?.matchedKeywords || [],
          matchedGrammarPatterns: result?.matchedGrammarPatterns || []
        };
      });
      const completed = taskResults.filter(item => ['success', 'acceptable', 'self-assessed', 'complete'].includes(item.status)).length;
      const knownWords = session.targetWords || [];
      const vocabularyUsed = session.usedTargetWords || [];
      const reviewWords = knownWords.filter(item => !vocabularyUsed.includes(item.word));
      const taskCompletion = session.scenario.tasks.length ? Math.round(completed / session.scenario.tasks.length * 100) : 0;
      const vocabularyUsage = knownWords.length ? Math.round(vocabularyUsed.length / knownWords.length * 100) : 0;
      const strengths = [];
      if (completed) strengths.push(`Bạn đã hoàn thành hoặc tự xác nhận ${completed}/${session.scenario.tasks.length} mục tiêu.`);
      if (vocabularyUsed.length) strengths.push(`Bạn đã chủ động dùng ${vocabularyUsed.length} từ trong ngân hàng từ vựng.`);
      const improvementSuggestions = [];
      if (taskCompletion < 100) improvementSuggestions.push('Ôn lại các mục tiêu còn bỏ lỡ và thử một cách diễn đạt khác.');
      if (reviewWords.length) improvementSuggestions.push(`Thử chủ động dùng: ${reviewWords.map(item => item.word).join(', ')}.`);
      if (session.hintCount) improvementSuggestions.push(`Bạn đã dùng ${session.hintCount} gợi ý; thử giảm dần số gợi ý ở lần luyện sau.`);
      if (!improvementSuggestions.length) improvementSuggestions.push('Bạn đã hoàn thành mọi mục tiêu. Hãy thử tình huống ở trình độ cao hơn.');
      return {
        overallScore: taskCompletion,
        taskCompletion,
        vocabularyUsage,
        successfulTasks: completed,
        totalTasks: session.scenario.tasks.length,
        taskResults,
        strengths,
        improvementSuggestions,
        vocabularyReview: reviewWords.map(item => ({ word: item.word, meaningVi: item.meaning || '', reasonVi: 'Từ trong ngân hàng chưa được nhận diện trong câu trả lời.' })),
        usedTargetWords: vocabularyUsed,
        hintCount: session.hintCount,
        retryCount: session.retryCount,
        sampleReveals: session.sampleReveals,
        objectivesCompleted: session.objectivesCompleted
      };
    }

    function renderProductionReport(record) {
      const report = record.report || {};
      const taskResults = report.taskResults || [];
      const statusLabels = { success: 'Đạt theo tiêu chí', acceptable: 'Đạt một phần', 'self-assessed': 'Tự đánh giá đạt', complete: 'Đã hoàn thành', ineffective: 'Thử lại', uncertain: 'Tự đối chiếu', 'not-attempted': 'Chưa làm' };
      const taskCards = taskResults.map(item => `<div class="rounded-xl border border-slate-200 p-3 dark:border-slate-700"><div class="flex items-start justify-between gap-2"><p class="text-xs font-semibold">${escapeHTML(item.task)}</p><span class="shrink-0 rounded-full bg-theme-subtle px-2 py-1 text-[10px] font-bold text-theme-main">${escapeHTML(statusLabels[item.status] || 'Chưa đánh giá')}</span></div>${item.response ? `<p class="mt-2 text-xs text-slate-500">${escapeHTML(item.response)}</p>` : ''}${item.matchedKeywords?.length ? `<p class="mt-1 text-[10px] text-slate-400">Từ khóa: ${item.matchedKeywords.map(escapeHTML).join(', ')}</p>` : ''}${item.matchedGrammarPatterns?.length ? `<p class="mt-1 text-[10px] text-slate-400">Cấu trúc đã dùng: ${item.matchedGrammarPatterns.map(escapeHTML).join(', ')}</p>` : ''}</div>`).join('');
      const metrics = [
        ['Mục tiêu hoàn thành', `${report.successfulTasks ?? 0}/${report.totalTasks ?? taskResults.length}`],
        ['Từ học tập đã dùng', `${(report.usedTargetWords || []).length}`],
        ['Gợi ý đã xem', `${report.hintCount ?? record.hintCount ?? 0}`],
        ['Số lần thử lại', `${report.retryCount ?? record.retryCount ?? 0}`]
      ].map(([label, value]) => `<div class="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><p class="text-[10px] font-bold text-slate-500">${label}</p><p class="mt-1 text-lg font-extrabold text-theme-main">${value}</p></div>`).join('');
      const vocab = (report.vocabularyReview || []).map(item => `<div class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-2.5 dark:border-slate-700"><span class="text-xs"><b>${escapeHTML(item.word || '')}</b> · ${escapeHTML(item.meaningVi || '')}<span class="block text-slate-500">${escapeHTML(item.reasonVi || '')}</span></span><button type="button" data-save-production-word="${escapeHTML(item.word || '')}" data-save-production-meaning="${escapeHTML(item.meaningVi || 'Cụm từ cần ôn sau luyện tình huống')}" class="text-xs font-bold text-theme-main hover:underline">Thêm vào từ vựng</button></div>`).join('');
      const transcript = (record.transcript || []).map(message => `<div class="rounded-xl ${message.role === 'user' ? 'bg-theme text-white' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100'} px-3 py-2 text-xs"><b>${message.role === 'user' ? 'Bạn' : 'Nhân vật'}:</b> ${escapeHTML(message.text)}</div>`).join('');
      const panel = document.getElementById('production-report');
      panel.innerHTML = `<div class="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-5">
        <div class="flex flex-wrap items-start justify-between gap-3"><div><p class="text-[10px] font-extrabold uppercase tracking-wider text-theme-main">Báo cáo tự đánh giá · ${escapeHTML(record.category || '')} · ${escapeHTML(record.level || '')}</p><h3 class="mt-1 text-xl font-extrabold">${escapeHTML(record.scenarioTitle)}</h3></div><div class="rounded-2xl bg-theme-subtle px-4 py-2 text-center"><span class="block text-2xl font-black text-theme-main">${report.taskCompletion ?? report.overallScore ?? 0}%</span><span class="text-[10px] font-bold text-theme-main">mục tiêu đạt</span></div></div>
        <p class="text-xs text-slate-500">Chấm dựa trên tiêu chí/từ khóa khai báo và phần tự đánh giá của bạn; hệ thống không tự suy đoán lỗi ngữ pháp.</p>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">${metrics}</div>
        ${taskCards ? `<div><h4 class="mb-2 text-xs font-extrabold uppercase text-slate-400">Checklist mục tiêu</h4><div class="space-y-2">${taskCards}</div></div>` : ''}
        <div class="grid gap-3 sm:grid-cols-2">
          <div><h4 class="mb-2 text-xs font-extrabold uppercase text-slate-400">Điểm mạnh</h4><ul class="space-y-1 text-xs">${(report.strengths || []).map(item => `<li>✓ ${escapeHTML(item)}</li>`).join('') || '<li>Chưa có nhận xét.</li>'}</ul></div>
          <div><h4 class="mb-2 text-xs font-extrabold uppercase text-slate-400">Gợi ý cải thiện</h4><ul class="space-y-1 text-xs">${(report.improvementSuggestions || []).map(item => `<li>• ${escapeHTML(item)}</li>`).join('') || '<li>Tiếp tục luyện tập.</li>'}</ul></div>
        </div>
        ${vocab ? `<div><h4 class="mb-2 text-xs font-extrabold uppercase text-slate-400">Từ vựng chủ động & cần ôn</h4><div class="space-y-2">${vocab}</div></div>` : ''}
        <details><summary class="cursor-pointer text-xs font-bold text-theme-main">Xem lại hội thoại (${transcript.length} lượt)</summary><div class="mt-2 space-y-2">${transcript}</div></details>
        <button type="button" onclick="startProductionSession('${escapeHTML(record.scenarioId)}')" class="listening-accent rounded-xl px-4 py-2.5 text-xs font-bold text-white"><i class="fa-solid fa-rotate-right mr-1"></i>Luyện lại tình huống</button>
      </div>`;
      panel.classList.remove('hidden');
      panel.querySelectorAll('[data-save-production-word]').forEach(button => {
        button.addEventListener('click', () => saveProductionPhrase(button.dataset.saveProductionWord, button.dataset.saveProductionMeaning, record.language));
      });
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function saveProductionPhrase(wordText, meaningText, languageOverride = '') {
      const word = (wordText || '').trim();
      const meaning = (meaningText || '').trim();
      const language = languageOverride || activeProductionSession?.language || currentLang;
      if (!word || !meaning) {
        showToast('Không có đủ nội dung để thêm vào ngân hàng từ vựng.', 'warning');
        return;
      }
      if (wordsState.some(item => item.lang === language && item.word.trim().toLocaleLowerCase() === word.toLocaleLowerCase())) {
        showToast(`"${word}" đã có trong ngân hàng từ vựng.`, 'info');
        return;
      }
      wordsState.unshift({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        lang: language, word, meaning, phonetic: '', example: '', srsLevel: 0, nextReviewTime: 0, forgotCount: 0, reps: 0, ef: 2.5, interval: 0
      });
      saveState();
      renderAllViews();
      showToast(`Đã thêm "${word}" vào ngân hàng từ vựng.`, 'success');
    }

    function renderProductionHistory() {
      const container = document.getElementById('production-history');
      if (!container) return;
      const languageHistory = productionHistory.filter(item => item.language === currentLang);
      const recent = languageHistory.slice(0, 5);
      container.innerHTML = recent.length
        ? `<h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-400">Lịch sử gần đây</h3>${recent.map(item => `<button type="button" data-production-history="${escapeHTML(item.id)}" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-left text-xs hover:border-theme-main dark:border-slate-700 dark:bg-slate-800"><span class="block font-bold">${escapeHTML(item.scenarioTitle)}</span><span class="mt-1 block text-slate-500">${new Date(item.completedAt).toLocaleDateString()} · ${item.report?.overallScore ?? '—'}/100</span></button>`).join('')}`
        : '';
      const summary = document.getElementById('production-progress-summary');
      if (summary) {
        if (!languageHistory.length) {
          summary.innerHTML = '';
        } else {
          const avgCompletion = Math.round(languageHistory.reduce((total, item) => total + (item.report?.taskCompletion || 0), 0) / languageHistory.length);
          const groupBy = key => Object.entries(languageHistory.reduce((groups, item) => {
            const label = item[key] || 'Khác';
            groups[label] = groups[label] || { count: 0, success: 0 };
            groups[label].count++;
            groups[label].success += item.report?.taskCompletion || 0;
            return groups;
          }, {})).map(([label, stats]) => ({ label, count: stats.count, average: Math.round(stats.success / stats.count) }));
          const categories = groupBy('category').slice(0, 3);
          const levels = groupBy('level').sort((left, right) => left.label.localeCompare(right.label));
          summary.innerHTML = `<div class="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"><h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-400">Tiến độ · ${languageHistory.length} phiên</h3><p class="mt-2 text-xs">Tỷ lệ mục tiêu đạt trung bình <b class="text-theme-main">${avgCompletion}%</b></p><p class="mt-3 text-[10px] font-bold text-slate-400">Theo danh mục</p><div class="mt-1 space-y-1">${categories.map(item => `<p class="flex justify-between gap-2 text-[10px]"><span>${escapeHTML(item.label)} (${item.count})</span><b>${item.average}%</b></p>`).join('')}</div><p class="mt-3 text-[10px] font-bold text-slate-400">Theo trình độ</p><div class="mt-1 flex flex-wrap gap-1">${levels.map(item => `<span class="rounded-md bg-theme-subtle px-2 py-1 text-[10px] text-theme-main">${escapeHTML(item.label)} · ${item.average}%</span>`).join('')}</div></div>`;
        }
      }
      container.querySelectorAll('[data-production-history]').forEach(button => {
        button.addEventListener('click', () => {
          const record = productionHistory.find(item => item.id === button.dataset.productionHistory);
          if (record) renderProductionReport(record);
        });
      });
    }

    function downloadCustomProductionTemplate() {
      const template = {
        title: 'Gọi món tại nhà hàng',
        category: 'Đời sống hằng ngày',
        level: 'A1',
        context: 'Bạn đang gọi món tại nhà hàng và muốn gọi món phù hợp với mình.',
        objective: 'Gọi món và xác nhận yêu cầu ăn uống.',
        userRole: 'Khách hàng',
        npcRole: 'Nhân viên phục vụ',
        tasks: [
          'Gọi một phần hamburger',
          'Hỏi về dị ứng đậu phộng',
          'Gọi một ly nước lọc'
        ],
        promptsVi: [
          'Xin chào, cho tôi gọi một phần hamburger được không?',
          'Tôi bị dị ứng với đậu phộng. Món này có đậu phộng không?',
          'Cho tôi một ly nước lọc, cảm ơn.'
        ],
        npcPrompts: [
          'Hello, welcome. What can I help you with?',
          'Would you like to know about any ingredients or allergies?',
          'Would you like a drink with that?'
        ],
        keywords: [
          ['hamburger, burger', 'can I have, could I have, I would like, please'],
          ['allergic, allergy', 'peanut, nuts'],
          ['water', 'please, can I have, could I have']
        ],
        alternatives: [
          ['I would like to order a burger.'],
          ['I have a peanut allergy. Is this safe for me?'],
          ['Could I have some water, please?']
        ],
        grammarCues: [
          ['can I have, could I have'],
          ['I am allergic to'],
          ['please']
        ],
        sampleAnswers: [
          'Hi, can I have a hamburger, please?',
          'I am allergic to peanuts. Does this contain any?',
          'A glass of water, please.'
        ]
      };
      const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mau-tinh-huong-luyen-chu-dong.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }

    async function handleCustomProductionFile(event) {
      const input = event.target;
      const file = input.files?.[0];
      if (!file) return;
      if (!file.name.toLocaleLowerCase().endsWith('.json')) {
        showToast('Chỉ hỗ trợ file tình huống định dạng .json.', 'error');
        input.value = '';
        return;
      }
      if (file.size > 256 * 1024) {
        showToast('File mẫu quá lớn. Vui lòng chọn file dưới 256 KB.', 'error');
        input.value = '';
        return;
      }
      try {
        const parsed = JSON.parse(await file.text());
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new Error('File cần chứa một đối tượng tình huống JSON.');
        }
        const requiredStrings = ['title', 'context', 'objective'];
        if (requiredStrings.some(key => typeof parsed[key] !== 'string' || !parsed[key].trim())) {
          throw new Error('File cần có đủ title, context và objective.');
        }
        if (!Array.isArray(parsed.tasks) || parsed.tasks.length < 1 || parsed.tasks.length > 10 ||
            parsed.tasks.some(task => typeof task !== 'string' || !task.trim())) {
          throw new Error('tasks cần là danh sách từ 1 đến 10 mục tiêu dạng văn bản.');
        }
        const taskCount = parsed.tasks.length;
        const promptsVi = parsed.promptsVi;
        if (!Array.isArray(promptsVi) || promptsVi.length !== taskCount ||
            promptsVi.some(prompt => typeof prompt !== 'string' || !prompt.trim())) {
          throw new Error('promptsVi cần có một gợi ý tiếng Việt cho mỗi mục tiêu.');
        }
        const readLines = (value, fieldName, splitCommas = false) => {
          if (value === undefined) return Array.from({ length: taskCount }, () => []);
          if (!Array.isArray(value) || value.length !== taskCount ||
              value.some(item => !(typeof item === 'string' || (Array.isArray(item) && item.every(part => typeof part === 'string'))))) {
            throw new Error(`${fieldName} cần có một mục cho mỗi mục tiêu.`);
          }
          return value.map(item => (Array.isArray(item) ? item : (splitCommas ? item.split(',') : [item]))
            .map(part => part.trim()).filter(Boolean));
        };
        const optionalText = (key, maxLength) => {
          const value = parsed[key] ?? '';
          if (typeof value !== 'string' || value.length > maxLength) {
            throw new Error(`${key} cần là văn bản không quá ${maxLength} ký tự.`);
          }
          return value.trim();
        };
        const categoryOptions = [...document.getElementById('production-custom-category').options].map(option => option.value);
        const levelOptions = [...document.getElementById('production-custom-level').options].map(option => option.value);
        if (parsed.category && !categoryOptions.includes(parsed.category)) {
          throw new Error('category không nằm trong danh mục được hỗ trợ.');
        }
        if (parsed.level && !levelOptions.includes(parsed.level)) {
          throw new Error('level phải là A1, A2, B1, B2, C1 hoặc C2.');
        }

        const formValues = {
          'production-custom-title': optionalText('title', 100),
          'production-custom-context': optionalText('context', 1500),
          'production-custom-objective': optionalText('objective', 240),
          'production-custom-user-role': optionalText('userRole', 80),
          'production-custom-npc-role': optionalText('npcRole', 80),
          'production-custom-tasks': parsed.tasks.join('\n'),
          'production-custom-prompts-vi': promptsVi.map(prompt => prompt.trim()).join('\n'),
          'production-custom-npc-prompts': readLines(parsed.npcPrompts, 'npcPrompts').map(line => line[0] || '').join('\n'),
          'production-custom-keywords': readLines(parsed.keywords, 'keywords', true).map(line => line.join(', ')).join('\n'),
          'production-custom-alternatives': readLines(parsed.alternatives, 'alternatives', true).map(line => line.join(', ')).join('\n'),
          'production-custom-grammar-cues': readLines(parsed.grammarCues, 'grammarCues', true).map(line => line.join(', ')).join('\n'),
          'production-custom-samples': readLines(parsed.sampleAnswers, 'sampleAnswers').map(line => line[0] || '').join('\n')
        };
        for (const [id, value] of Object.entries(formValues)) {
          const field = document.getElementById(id);
          if (field.maxLength >= 0 && value.length > field.maxLength) {
            throw new Error(`${id.replace('production-custom-', '')} vượt quá giới hạn ${field.maxLength} ký tự.`);
          }
          field.value = value;
        }
        document.getElementById('production-custom-category').value = parsed.category || 'Đời sống hằng ngày';
        document.getElementById('production-custom-level').value = parsed.level || 'B1';
        showToast('Đã nhập tình huống từ file. Hãy kiểm tra nội dung rồi bấm “Lưu tình huống”.', 'success');
      } catch (error) {
        console.error('Unable to import custom production scenario:', error);
        showToast(`Không thể nhập file: ${error.message || 'JSON không đúng định dạng.'}`, 'error');
      } finally {
        input.value = '';
      }
    }

    function handleAddCustomProductionScenario(event) {
      event.preventDefault();
      const isEditing = Boolean(editingProductionScenarioId);
      const title = document.getElementById('production-custom-title').value.trim();
      const category = document.getElementById('production-custom-category').value;
      const context = document.getElementById('production-custom-context').value.trim();
      const tasks = document.getElementById('production-custom-tasks').value.split(/\r?\n/).map(task => task.trim()).filter(Boolean);
      if (!tasks.length || tasks.length > 10) {
        showToast('Hãy nhập từ 1 đến 10 mục tiêu, mỗi mục tiêu trên một dòng.', 'warning');
        return;
      }
      const taskPromptsVi = document.getElementById('production-custom-prompts-vi').value.split(/\r?\n/).map(prompt => prompt.trim());
      if (tasks.some((task, index) => !taskPromptsVi[index])) {
        showToast('Hãy nhập một gợi ý câu trả lời tiếng Việt cho từng mục tiêu.', 'warning');
        return;
      }
      const taskKeywords = document.getElementById('production-custom-keywords').value.split(/\r?\n/).map(line => line.split(',').map(term => term.trim()).filter(Boolean));
      const sampleAnswers = document.getElementById('production-custom-samples').value.split(/\r?\n/).map(answer => answer.trim());
      const acceptableAnswers = document.getElementById('production-custom-alternatives').value.split(/\r?\n/).map(line => line.split(',').map(pattern => pattern.trim()).filter(Boolean));
      if (tasks.some((task, index) => !taskKeywords[index]?.length && !sampleAnswers[index] && !acceptableAnswers[index]?.length)) {
        showToast('Mỗi mục tiêu cần có ít nhất một từ khóa, câu mẫu hoặc cụm từ được chấp nhận để kiểm tra câu trả lời.', 'warning');
        return;
      }
      const taskGrammarCues = document.getElementById('production-custom-grammar-cues').value.split(/\r?\n/).map(line => line.split(',').map(cue => cue.trim()).filter(Boolean));
      const npcPrompts = document.getElementById('production-custom-npc-prompts').value.split(/\r?\n/).map(prompt => prompt.trim());
      const scenario = {
        id: editingProductionScenarioId || `custom-production-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        category,
        level: document.getElementById('production-custom-level').value,
        language: currentLang,
        title,
        context,
        userRole: document.getElementById('production-custom-user-role').value.trim() || 'Bạn',
        aiRole: document.getElementById('production-custom-npc-role').value.trim() || 'Người đối thoại',
        objective: document.getElementById('production-custom-objective').value.trim(),
        tasks,
        taskPromptsVi,
        taskKeywords,
        taskGrammarCues,
        sampleAnswers,
        npcPrompts,
        vocabulary: [...new Set(taskKeywords.flat())],
        stages: tasks.map((task, index) => ({
          task,
          promptVi: taskPromptsVi[index],
          keywords: taskKeywords[index] || [],
          requiredKeywordGroups: taskKeywords[index]?.length ? [taskKeywords[index]] : [],
          npcPrompt: npcPrompts[index] || '',
          acceptedAnswers: sampleAnswers[index] ? [sampleAnswers[index]] : [],
          acceptableAnswers: acceptableAnswers[index] || [],
          sampleAnswers: sampleAnswers[index] ? [sampleAnswers[index]] : [],
          grammarCues: taskGrammarCues[index] || []
        }))
      };
      const existing = Array.isArray(customProductionScenarios[currentLang]) ? customProductionScenarios[currentLang] : [];
      const isCustomScenario = scenario.id.startsWith('custom-production-');
      try {
        if (isCustomScenario) {
          const updatedScenarios = isEditing
            ? existing.map(item => item.id === scenario.id ? scenario : item)
            : [...existing, scenario];
          const updated = { ...customProductionScenarios, [currentLang]: updatedScenarios };
          localStorage.setItem(CUSTOM_PRODUCTION_STORAGE_KEY, JSON.stringify(updated));
          customProductionScenarios = updated;
        } else {
          const languageOverrides = productionScenarioOverrides[currentLang] || {};
          const updated = {
            ...productionScenarioOverrides,
            [currentLang]: { ...languageOverrides, [scenario.id]: scenario }
          };
          localStorage.setItem(PRODUCTION_SCENARIO_OVERRIDES_STORAGE_KEY, JSON.stringify(updated));
          productionScenarioOverrides = updated;
        }
      } catch (error) {
        console.error('Unable to save production scenario:', error);
        showToast('Không thể lưu tình huống. Bộ nhớ trình duyệt có thể đã đầy.', 'error');
        return;
      }
      selectedProductionScenarioId = scenario.id;
      event.target.reset();
      document.getElementById('production-custom-level').value = 'B1';
      document.getElementById('production-search').value = '';
      document.getElementById('production-level').value = 'all';
      document.getElementById('production-category').value = 'all';
      closeCustomProductionScenarioModal();
      renderProductionScenarios();
      showToast(isEditing ? 'Đã cập nhật tình huống.' : 'Đã thêm tình huống riêng vào thư viện.', 'success');
    }

    function renderListeningStories() {
      const list = document.getElementById('listening-story-list');
      const count = document.getElementById('listening-story-count');
      if (!list || !count) return;

      const stories = [
        ...(LISTENING_STORIES[currentLang] || []),
        ...(Array.isArray(customListeningStories[currentLang]) ? customListeningStories[currentLang] : [])
      ];
      count.innerText = `${stories.length} truyện`;
      if (stories.length === 0) {
        list.innerHTML = '<p class="p-4 text-sm text-slate-400">Chưa có câu chuyện cho ngôn ngữ này.</p>';
        return;
      }

      let selectedStory = stories.find(story => story.id === selectedListeningStoryId);
      if (!selectedStory) {
        selectedStory = stories[0];
        selectedListeningStoryId = selectedStory.id;
      }

      listeningPassageLang = currentLang;
      listeningPassageText = selectedStory.text;
      document.getElementById('listening-story-title').innerText = selectedStory.title;
      document.getElementById('listening-story-meta').innerText = `${selectedStory.level} · Di chuột vào từ để xem nghĩa`;
      renderListeningStoryLogo(document.getElementById('listening-current-story-icon'), selectedStory);
      renderListeningPassage();

      list.innerHTML = stories.map(story => {
        const isSelected = story.id === selectedStory.id;
        return `<button type="button" onclick="selectListeningStory('${escapeHTML(story.id)}')" class="w-full rounded-2xl border p-4 text-left transition ${isSelected ? 'border-indigo-400 bg-indigo-50 shadow-md dark:border-indigo-400 dark:bg-indigo-950/50' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500 dark:hover:bg-slate-700/60'}">
          <span class="flex items-start gap-3"><span data-listening-story-logo="${escapeHTML(story.id)}" class="listening-accent flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl text-lg text-white">${getListeningStoryLogoContent(story)}</span>
          <span class="min-w-0"><span class="block text-sm font-bold text-slate-800 dark:text-slate-100">${escapeHTML(story.title)}</span><span class="mt-1 block text-xs text-slate-500 dark:text-slate-400">${escapeHTML(story.level)}</span></span></span>
        </button>`;
      }).join('');
    }

    function getListeningStoryLogoContent(story) {
      if (typeof story.logoImage === 'string' && story.logoImage.startsWith('data:image/')) {
        return `<img src="${story.logoImage}" alt="" class="h-full w-full object-cover">`;
      }
      if (typeof story.logo === 'string' && story.logo.trim()) return escapeHTML(story.logo);
      return '<i class="fa-solid fa-book-open"></i>';
    }

    function renderListeningStoryLogo(element, story) {
      if (element) element.innerHTML = getListeningStoryLogoContent(story);
    }

    function selectListeningStory(storyId) {
      const stories = [
        ...(LISTENING_STORIES[currentLang] || []),
        ...(Array.isArray(customListeningStories[currentLang]) ? customListeningStories[currentLang] : [])
      ];
      const story = stories.find(item => item.id === storyId);
      if (!story) {
        showToast('Không tìm thấy câu chuyện đã chọn.', 'error');
        return;
      }
      selectedListeningStoryId = story.id;
      listeningPassageLang = currentLang;
      listeningPassageText = story.text;
      activeListeningWord = '';
      listeningWordDetailPinned = false;
      clearTimeout(listeningDetailHideTimer);
      stopRemoteSpeech();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      document.getElementById('listening-story-title').innerText = story.title;
      document.getElementById('listening-story-meta').innerText = `${story.level} · Di chuột vào từ để xem nghĩa`;
      setListeningStatus('');
      renderListeningStories();
    }

    function saveListeningStories(stories, language = currentLang) {
      const existingStories = Array.isArray(customListeningStories[language])
        ? customListeningStories[language]
        : [];
      const updatedStories = { ...customListeningStories, [language]: [...existingStories, ...stories] };
      try {
        localStorage.setItem(LISTENING_STORIES_STORAGE_KEY, JSON.stringify(updatedStories));
      } catch (error) {
        console.error('Unable to save listening story:', error);
        showToast('Không thể lưu câu chuyện. Bộ nhớ trình duyệt có thể đã đầy.', 'error');
        return false;
      }

      customListeningStories = updatedStories;
      selectedListeningStoryId = stories[stories.length - 1].id;
      renderListeningStories();
      showToast(
        stories.length === 1
          ? `Đã thêm câu chuyện "${stories[0].title}" vào thư viện.`
          : `Đã nhập ${stories.length} câu chuyện vào thư viện.`,
        'success'
      );
      return true;
    }

    function saveListeningStory(story, language = currentLang) {
      return saveListeningStories([story], language);
    }

    function openListeningStoryModal() {
      const modal = document.getElementById('listening-story-modal');
      const languageNames = { en: 'Anh', ko: 'Hàn', zh: 'Trung', ja: 'Nhật' };
      document.getElementById('listening-story-modal-language').innerText = languageNames[currentLang] || 'Anh';
      selectedListeningStoryLogo = '📖';
      selectedListeningStoryLogoImage = '';
      document.getElementById('listening-story-logo-file').value = '';
      renderListeningStoryLogoPreview();
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.getElementById('listening-new-story-title').focus();
    }

    function selectListeningStoryLogo(logo) {
      selectedListeningStoryLogo = logo;
      selectedListeningStoryLogoImage = '';
      document.getElementById('listening-story-logo-file').value = '';
      renderListeningStoryLogoPreview();
    }

    function renderListeningStoryLogoPreview() {
      const preview = document.getElementById('listening-story-logo-preview');
      renderListeningStoryLogo(preview, {
        logo: selectedListeningStoryLogo,
        logoImage: selectedListeningStoryLogoImage
      });
      document.querySelectorAll('[data-story-logo]').forEach(button => {
        const selected = button.dataset.storyLogo === selectedListeningStoryLogo && !selectedListeningStoryLogoImage;
        button.classList.toggle('border-theme-main', selected);
        button.classList.toggle('ring-2', selected);
        button.classList.toggle('ring-theme-main', selected);
      });
    }

    function handleListeningStoryLogoFile(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      const supportedTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!supportedTypes.includes(file.type)) {
        showToast('Logo chỉ hỗ trợ định dạng PNG, JPG hoặc WEBP.', 'error');
        event.target.value = '';
        return;
      }
      if (file.size > 256 * 1024) {
        showToast('Logo vượt quá 256 KB. Hãy chọn ảnh nhỏ hơn.', 'error');
        event.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== 'string' || !reader.result.startsWith('data:image/')) {
          showToast('Không thể đọc file logo đã chọn.', 'error');
          event.target.value = '';
          return;
        }
        selectedListeningStoryLogoImage = reader.result;
        renderListeningStoryLogoPreview();
      };
      reader.onerror = () => {
        console.error('Unable to read listening story logo:', reader.error);
        showToast('Không thể đọc file logo đã chọn.', 'error');
        event.target.value = '';
      };
      reader.readAsDataURL(file);
    }

    function closeListeningStoryModal() {
      const modal = document.getElementById('listening-story-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    function handleAddListeningStory(event) {
      event.preventDefault();
      const title = document.getElementById('listening-new-story-title').value.trim();
      const level = document.getElementById('listening-new-story-level').value.trim() || 'Tự thêm';
      const text = document.getElementById('listening-new-story-text').value.trim();
      if (!title || !text) {
        showToast('Hãy nhập tên và nội dung câu chuyện.', 'warning');
        return;
      }

      const story = {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        level,
        text,
        logo: selectedListeningStoryLogo,
        ...(selectedListeningStoryLogoImage ? { logoImage: selectedListeningStoryLogoImage } : {})
      };
      if (saveListeningStory(story)) {
        event.target.reset();
        selectedListeningStoryLogo = '📖';
        selectedListeningStoryLogoImage = '';
        closeListeningStoryModal();
      }
    }

    function downloadListeningStoryTemplate(format) {
      const templates = {
        json: JSON.stringify([{
          title: 'Tên câu chuyện',
          level: 'Cơ bản',
          text: 'Nhập nội dung câu chuyện ở đây.'
        }], null, 2),
        txt: 'Nhập nội dung câu chuyện ở đây.\n'
      };
      const extension = format === 'json' ? 'json' : 'txt';
      const mimeType = format === 'json' ? 'application/json' : 'text/plain';
      const blob = new Blob([templates[extension]], { type: `${mimeType};charset=utf-8` });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mau-cau-chuyen.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }

    async function handleListeningStoryFile(event) {
      const input = event.target;
      const file = input.files?.[0];
      if (!file) return;
      const language = currentLang;
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!['txt', 'json'].includes(extension)) {
        showToast('Chỉ hỗ trợ file .txt hoặc .json.', 'error');
        input.value = '';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showToast('File quá lớn. Vui lòng chọn file dưới 2 MB.', 'error');
        input.value = '';
        return;
      }

      try {
        const content = await file.text();
        let stories;
        if (extension === 'txt') {
          stories = [{
            title: file.name.replace(/\.txt$/i, '').trim() || 'Câu chuyện mới',
            level: 'Từ file',
            text: content.trim()
          }];
        } else {
          const parsed = JSON.parse(content);
          const entries = Array.isArray(parsed) ? parsed : [parsed];
          stories = entries.map((entry, index) => {
            if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
              throw new Error(`Câu chuyện thứ ${index + 1} không đúng định dạng.`);
            }
            return {
              title: typeof entry.title === 'string' ? entry.title.trim() : '',
              level: typeof entry.level === 'string' && entry.level.trim() ? entry.level.trim() : 'Từ file',
              text: typeof entry.text === 'string' ? entry.text.trim() : (typeof entry.content === 'string' ? entry.content.trim() : ''),
              logo: typeof entry.logo === 'string' && entry.logo.length <= 16 ? entry.logo : ''
            };
          });
        }

        if (stories.length === 0 || stories.some(story => !story.title || !story.text)) {
          throw new Error('Mỗi câu chuyện trong file cần có tên (title) và nội dung (text).');
        }

        const storiesToSave = stories.map(storyData => ({
            id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            ...storyData
        }));
        if (saveListeningStories(storiesToSave, language)) closeListeningStoryModal();
      } catch (error) {
        console.error('Unable to import listening story file:', error);
        showToast(`Không thể đọc file: ${error.message || 'Định dạng không hợp lệ.'}`, 'error');
      } finally {
        input.value = '';
      }
    }

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !document.getElementById('listening-story-modal').classList.contains('hidden')) {
        closeListeningStoryModal();
      }
    });

    function toggleListeningLibrary() {
      listeningLibraryCollapsed = !listeningLibraryCollapsed;
      const libraryColumn = document.getElementById('listening-library-column');
      const workspace = document.getElementById('listening-story-workspace');
      const toggle = document.getElementById('listening-library-toggle');

      libraryColumn.classList.toggle('hidden', listeningLibraryCollapsed);
      workspace.classList.toggle('lg:col-span-2', !listeningLibraryCollapsed);
      workspace.classList.toggle('lg:col-span-3', listeningLibraryCollapsed);
      toggle.setAttribute('aria-expanded', String(!listeningLibraryCollapsed));
      toggle.title = listeningLibraryCollapsed ? 'Hiện thư viện câu chuyện' : 'Ẩn thư viện câu chuyện';
      toggle.innerHTML = `<i class="fa-solid ${listeningLibraryCollapsed ? 'fa-eye' : 'fa-eye-slash'}"></i>`;
    }

    function renderListeningPassage() {
      const passageEl = document.getElementById('listening-passage');
      const wordsEl = document.getElementById('listening-passage-words');
      const detailEl = document.getElementById('listening-word-detail');
      const terms = [...new Set(wordsState
        .filter(word => word.lang === listeningPassageLang)
        .map(word => word.word.trim())
        .filter(Boolean))]
        .sort((a, b) => b.length - a.length);

      const isEnglish = listeningPassageLang === 'en';
      const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const selectedRanges = [];
      if (terms.length > 0) {
        const alternatives = terms.map(escapeRegExp).join('|');
        const pattern = isEnglish
          ? `(^|[^\\p{L}\\p{N}])(${alternatives})(?=$|[^\\p{L}\\p{N}])`
          : `(${alternatives})`;
        const matcher = new RegExp(pattern, isEnglish ? 'giu' : 'gu');
        for (const match of listeningPassageText.matchAll(matcher)) {
          const prefix = isEnglish ? match[1] : '';
          const matchedTerm = isEnglish ? match[2] : match[1];
          const start = match.index + prefix.length;
          selectedRanges.push({ start, end: start + matchedTerm.length, term: matchedTerm });
        }
      }

      const languageMap = { en: 'en-US', ko: 'ko-KR', zh: 'zh-CN', ja: 'ja-JP' };
      const segmenter = typeof Intl.Segmenter === 'function'
        ? new Intl.Segmenter(languageMap[listeningPassageLang] || 'en-US', { granularity: 'word' })
        : null;
      const segments = segmenter
        ? [...segmenter.segment(listeningPassageText)].map(part => ({
          text: part.segment,
          index: part.index,
          isWordLike: part.isWordLike
        }))
        : [...listeningPassageText.matchAll(/[\p{L}\p{N}]+|[^\p{L}\p{N}]+/gu)].map(match => ({
          text: match[0],
          index: match.index,
          isWordLike: /^[\p{L}\p{N}]+$/u.test(match[0])
        }));
      let highlightedPassage = '';
      for (const segment of segments) {
        if (!segment.isWordLike) {
          highlightedPassage += escapeHTML(segment.text);
          continue;
        }

        const end = segment.index + segment.text.length;
        const selectedTerm = selectedRanges.find(range => range.start < end && range.end > segment.index);
        const tokenClasses = selectedTerm
          ? 'border border-amber-300 bg-amber-200/90 font-extrabold text-amber-950 shadow-sm dark:border-amber-400/50 dark:bg-amber-400/25 dark:text-amber-200'
          : 'text-slate-700 dark:text-slate-200';
        highlightedPassage += `<span role="button" tabindex="0" data-listening-word="${escapeHTML(segment.text)}" class="inline-block cursor-pointer rounded-md px-0.5 transition duration-150 hover:z-20 hover:bg-indigo-200 hover:text-indigo-950 hover:shadow-[0_0_0_3px_rgba(129,140,248,0.28)] focus:z-20 focus:bg-indigo-200 focus:text-indigo-950 focus:outline-none dark:hover:bg-indigo-400/30 dark:hover:text-indigo-100 dark:focus:bg-indigo-400/30 ${tokenClasses}">${escapeHTML(segment.text)}</span>`;
      }
      passageEl.innerHTML = highlightedPassage;
      passageEl.onclick = event => {
        const token = event.target.closest('[data-listening-word]');
        if (token) {
          event.preventDefault();
          handleListeningPassageWordActivation(token.dataset.listeningWord);
        }
      };
      passageEl.onpointerout = event => {
        if (!event.relatedTarget?.closest?.('[data-listening-word]') && !listeningWordDetailPinned) {
          clearTimeout(listeningDetailHideTimer);
          listeningDetailHideTimer = setTimeout(() => {
            if (!detailEl.matches(':hover')) renderListeningWordPlaceholder();
          }, 350);
        }
      };
      passageEl.onkeydown = event => {
        if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-listening-word]')) {
          event.preventDefault();
          handleListeningPassageWordActivation(event.target.dataset.listeningWord);
        }
      };
      passageEl.onfocusout = event => {
        if (!passageEl.contains(event.relatedTarget) && !listeningWordDetailPinned) {
          clearTimeout(listeningDetailHideTimer);
          listeningDetailHideTimer = setTimeout(() => {
            if (!detailEl.matches(':hover')) renderListeningWordPlaceholder();
          }, 350);
        }
      };
      detailEl.onpointerenter = () => clearTimeout(listeningDetailHideTimer);
      detailEl.onpointerleave = () => {
        if (!listeningWordDetailPinned) renderListeningWordPlaceholder();
      };

      const matchedTerms = [...new Set(selectedRanges.map(range => range.term))];
      wordsEl.innerHTML = matchedTerms.length > 0
        ? `<span class="mr-1 text-xs font-bold text-slate-500 dark:text-slate-400">Từ trong danh sách:</span>${matchedTerms.map(term =>
        `<span class="rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900 dark:border-amber-400/40 dark:bg-amber-400/15 dark:text-amber-200">${escapeHTML(term)}</span>`
        ).join('')}`
        : '';
      wordsEl.classList.toggle('hidden', matchedTerms.length === 0);
      renderListeningWordPlaceholder();
      listeningWordDetailPinned = false;
    }

    function renderListeningWordPlaceholder() {
      activeListeningWord = '';
      document.getElementById('listening-word-detail').innerHTML = `
        <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-900/60">
          <i class="fa-solid fa-arrow-left-long mb-2 text-indigo-400"></i>
          <p class="text-xs leading-5 text-slate-500 dark:text-slate-400">Nhấn vào một từ trong câu chuyện để xem nghĩa và ngữ pháp.</p>
        </div>`;
    }

    const KOREAN_GRAMMAR_PARTICLES = [
      { form: '께서', meaning: 'Trợ từ chủ ngữ kính ngữ' },
      { form: '에게', meaning: 'Trợ từ chỉ đối tượng nhận (cho/đến)' },
      { form: '한테', meaning: 'Trợ từ chỉ đối tượng nhận (cho/đến)' },
      { form: '에서', meaning: 'Trợ từ chỉ nơi diễn ra hành động' },
      { form: '으로', meaning: 'Trợ từ chỉ phương tiện hoặc hướng' },
      { form: '부터', meaning: 'Trợ từ chỉ điểm bắt đầu (từ)' },
      { form: '까지', meaning: 'Trợ từ chỉ điểm kết thúc (đến)' },
      { form: '처럼', meaning: 'Trợ từ so sánh (như/giống như)' },
      { form: '보다', meaning: 'Trợ từ so sánh (hơn/so với)' },
      { form: '마다', meaning: 'Trợ từ chỉ sự lặp lại (mỗi)' },
      { form: '께', meaning: 'Trợ từ kính ngữ (cho/đến)' },
      { form: '은', meaning: 'Trợ từ chủ đề (thì)' },
      { form: '는', meaning: 'Trợ từ chủ đề (thì)' },
      { form: '이', meaning: 'Trợ từ chủ ngữ' },
      { form: '가', meaning: 'Trợ từ chủ ngữ' },
      { form: '을', meaning: 'Trợ từ tân ngữ' },
      { form: '를', meaning: 'Trợ từ tân ngữ' },
      { form: '에', meaning: 'Trợ từ chỉ địa điểm, thời gian hoặc đích đến' },
      { form: '와', meaning: 'Trợ từ nối (và/cùng với)' },
      { form: '과', meaning: 'Trợ từ nối (và/cùng với)' },
      { form: '도', meaning: 'Trợ từ bổ sung (cũng)' },
      { form: '의', meaning: 'Trợ từ sở hữu (của)' },
      { form: '로', meaning: 'Trợ từ chỉ phương tiện hoặc hướng' },
      { form: '만', meaning: 'Trợ từ giới hạn (chỉ)' },
      { form: '랑', meaning: 'Trợ từ nối thân mật (và/cùng với)' },
      { form: '고', meaning: 'Đuôi liên kết (và/rồi)' }
    ];

    function analyzeKoreanWord(word) {
      const particle = KOREAN_GRAMMAR_PARTICLES.find(item =>
        word.length > item.form.length && word.endsWith(item.form)
      );
      return particle
        ? { vocabulary: word.slice(0, -particle.form.length), grammar: [particle] }
        : { vocabulary: word, grammar: [] };
    }

    function showListeningWordDetail(wordText) {
      const detailEl = document.getElementById('listening-word-detail');
      const normalizedWord = wordText.trim();
      const vocabularyWord = wordsState.find(word =>
        word.lang === listeningPassageLang &&
        word.word.trim().toLocaleLowerCase() === normalizedWord.toLocaleLowerCase()
      );
      const cacheKey = `${listeningPassageLang}:${normalizedWord.toLocaleLowerCase()}`;
      const cachedLookup = listeningWordLookupCache.get(cacheKey);
      const meaning = vocabularyWord?.meaning || cachedLookup?.meaning || '';
      const pronunciation = vocabularyWord?.phonetic || cachedLookup?.pronunciation || '';
      const koreanAnalysis = listeningPassageLang === 'ko'
        ? {
          vocabulary: vocabularyWord?.vocabularyBase || cachedLookup?.vocabularyBase || analyzeKoreanWord(normalizedWord).vocabulary,
          grammar: vocabularyWord?.grammarAnalysis || cachedLookup?.grammarAnalysis || analyzeKoreanWord(normalizedWord).grammar
        }
        : null;
      const alreadyAdded = Boolean(vocabularyWord);

      activeListeningWord = normalizedWord;
      listeningWordDetailPinned = false;
      clearTimeout(listeningDetailHideTimer);
      renderListeningWordDetail(normalizedWord, meaning, pronunciation, {
        loading: !cachedLookup && !vocabularyWord,
        pronunciationLoading: !cachedLookup && !vocabularyWord,
        alreadyAdded,
        error: cachedLookup?.error || '',
        pronunciationError: cachedLookup?.pronunciationError || '',
        koreanAnalysis
      });

      if (!cachedLookup && !listeningWordLookupRequests.has(cacheKey)) {
        const request = lookupListeningWord(normalizedWord, cacheKey, listeningPassageLang);
        listeningWordLookupRequests.set(cacheKey, request);
        request.then(() => {
          if (listeningWordLookupRequests.get(cacheKey) === request) {
            listeningWordLookupRequests.delete(cacheKey);
          }
        });
      }
    }

    function handleListeningPassageWordActivation(wordText) {
      const word = wordText.trim();
      if (listeningWordDetailPinned && activeListeningWord === word) {
        addListeningWordFromPassage(word);
        return;
      }

      showListeningWordDetail(word);
      listeningWordDetailPinned = true;
    }

    function renderListeningWordDetail(word, meaning, pronunciation, options = {}) {
      if (activeListeningWord !== word) return;
      const detailEl = document.getElementById('listening-word-detail');
      const meaningContent = options.loading
        ? '<span class="text-xs text-indigo-500 dark:text-indigo-300"><i class="fa-solid fa-spinner fa-spin mr-1"></i>API đang dịch nghĩa...</span>'
        : `<input type="text" id="listening-manual-meaning" value="${escapeHTML(meaning)}" placeholder="${escapeHTML(options.error || 'Nhập nghĩa tiếng Việt...')}" class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-indigo-900/50" aria-label="Chỉnh sửa nghĩa tiếng Việt">`;
      const addContent = options.alreadyAdded
        ? '<span class="block text-sm font-bold text-indigo-700 dark:text-indigo-300"><i class="fa-solid fa-floppy-disk mr-2"></i>Lưu phiên âm</span>'
        : `<span class="block text-sm font-bold ${meaning ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-400'}"><i class="fa-solid fa-circle-plus mr-2"></i>Ấn lần nữa vào từ vựng để thêm vào danh sách</span>`;
      const addDisabled = !options.alreadyAdded && !meaning;
      const koreanAnalysis = listeningPassageLang === 'ko' ? analyzeKoreanWord(word) : null;
      const activeKoreanAnalysis = options.koreanAnalysis || koreanAnalysis;
      const vocabularyDisplay = activeKoreanAnalysis?.vocabulary || word;
      const grammarContent = activeKoreanAnalysis
        ? `<div class="min-h-16 py-3">
            <p class="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Ngữ pháp</p>
            <label class="mb-2 block text-[11px] font-semibold text-slate-500 dark:text-slate-400" for="listening-korean-vocabulary-base">Từ gốc / phần từ vựng</label>
            <input type="text" id="listening-korean-vocabulary-base" value="${escapeHTML(activeKoreanAnalysis.vocabulary)}" placeholder="Ví dụ: 오늘" class="mb-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-indigo-900/50" aria-label="Chỉnh sửa phần từ vựng tiếng Hàn">
            <div id="listening-korean-grammar-rows" class="space-y-2">${activeKoreanAnalysis.grammar.map(particle =>
              `<div data-korean-grammar-row class="flex items-start gap-2">
                <input type="text" data-korean-grammar-form value="${escapeHTML(particle.form)}" placeholder="Mẫu ngữ pháp" class="w-24 shrink-0 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200" aria-label="Hình thức ngữ pháp">
                <input type="text" data-korean-grammar-meaning value="${escapeHTML(particle.meaning)}" placeholder="Ý nghĩa / chức năng" class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200" aria-label="Ý nghĩa ngữ pháp">
                <button type="button" data-remove-korean-grammar class="rounded-lg px-2 py-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40" aria-label="Xóa mục ngữ pháp"><i class="fa-solid fa-trash-can pointer-events-none"></i></button>
              </div>`
            ).join('')}</div>
            <button type="button" id="listening-add-korean-grammar" class="mt-2 rounded-lg px-2 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-950/40"><i class="fa-solid fa-plus mr-1"></i>Thêm mục ngữ pháp</button>
          </div>`
        : '';

      detailEl.innerHTML = `<div class="divide-y divide-slate-100 dark:divide-slate-700">
        <div class="flex min-h-16 items-center justify-between gap-2 py-3 first:pt-0">
          <div class="min-w-0"><p class="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Từ vựng</p><p class="break-words text-base font-extrabold text-indigo-700 dark:text-indigo-300">${escapeHTML(vocabularyDisplay)}</p></div>
          <button type="button" id="listening-speak-word" class="shrink-0 rounded-xl border border-indigo-200 bg-indigo-50 px-2.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-200" aria-label="Nghe phát âm từ"><i class="fa-solid fa-volume-high"></i></button>
        </div>
        ${grammarContent}
        <div class="min-h-16 py-3">
          <p class="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Nghĩa</p>
          <div class="flex min-h-6 items-center gap-2">${meaningContent}</div>
        </div>
        <div class="min-h-16 py-3">
          <p class="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Phiên âm</p>
          ${options.pronunciationLoading ? '<p class="mb-2 text-xs text-indigo-500 dark:text-indigo-300"><i class="fa-solid fa-spinner fa-spin mr-1"></i>API đang tra phiên âm...</p>' : ''}
          <input type="text" id="listening-manual-pronunciation" value="${escapeHTML(pronunciation)}" placeholder="Nhập phiên âm..." class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-indigo-900/50" aria-label="Chỉnh sửa phiên âm">
        </div>
        <div class="pt-3">
          <button type="button" id="listening-add-word-btn" ${addDisabled ? 'disabled' : ''} class="w-full rounded-xl border px-3 py-3 text-left transition ${addDisabled ? 'cursor-not-allowed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40' : 'border-indigo-200 bg-indigo-50 hover:border-indigo-400 hover:bg-indigo-100 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:hover:bg-indigo-400/20'}">${addContent}</button>
        </div>
      </div>`;
      detailEl.classList.remove('hidden');

      document.getElementById('listening-speak-word')?.addEventListener('click', () => speakWord(word, listeningPassageLang));
      document.getElementById('listening-add-word-btn')?.addEventListener('click', () =>
        saveListeningWordOrPronunciation(word, meaning, options.alreadyAdded)
      );
      document.getElementById('listening-add-korean-grammar')?.addEventListener('click', () => {
        const rows = document.getElementById('listening-korean-grammar-rows');
        const row = document.createElement('div');
        row.dataset.koreanGrammarRow = '';
        row.className = 'flex items-start gap-2';
        row.innerHTML = `
          <input type="text" data-korean-grammar-form placeholder="Mẫu ngữ pháp" class="w-24 shrink-0 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200" aria-label="Hình thức ngữ pháp">
          <input type="text" data-korean-grammar-meaning placeholder="Ý nghĩa / chức năng" class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200" aria-label="Ý nghĩa ngữ pháp">
          <button type="button" data-remove-korean-grammar class="rounded-lg px-2 py-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40" aria-label="Xóa mục ngữ pháp"><i class="fa-solid fa-trash-can pointer-events-none"></i></button>`;
        rows.appendChild(row);
        row.querySelector('[data-korean-grammar-form]').focus();
      });
      document.getElementById('listening-korean-grammar-rows')?.addEventListener('click', event => {
        const button = event.target.closest('[data-remove-korean-grammar]');
        if (button) button.closest('[data-korean-grammar-row]')?.remove();
      });
    }

    function saveListeningWordOrPronunciation(word, meaning, alreadyAdded) {
      const editedMeaning = document.getElementById('listening-manual-meaning')?.value.trim() || '';
      const pronunciation = document.getElementById('listening-manual-pronunciation')?.value.trim() || '';
      const koreanVocabularyBase = document.getElementById('listening-korean-vocabulary-base')?.value.trim() || '';
      const koreanGrammar = [...document.querySelectorAll('#listening-korean-grammar-rows > div')].map(row => ({
        form: row.querySelector('[data-korean-grammar-form]')?.value.trim() || '',
        meaning: row.querySelector('[data-korean-grammar-meaning]')?.value.trim() || ''
      })).filter(item => item.form || item.meaning);
      if (!alreadyAdded) {
        const meaningToSave = editedMeaning || meaning;
        if (!meaningToSave) {
          showToast('Hãy nhập nghĩa trước khi thêm từ vào danh sách.', 'warning');
          return;
        }
        addListeningWord(word, meaningToSave, pronunciation, koreanVocabularyBase, koreanGrammar);
        return;
      }

      const vocabularyWord = wordsState.find(item =>
        item.lang === listeningPassageLang &&
        item.word.trim().toLocaleLowerCase() === word.toLocaleLowerCase()
      );
      if (!vocabularyWord) {
        showToast('Không tìm thấy từ trong danh sách để cập nhật.', 'error');
        return;
      }

      if (!editedMeaning) {
        showToast('Nghĩa không được để trống.', 'warning');
        return;
      }

      vocabularyWord.meaning = editedMeaning;
      vocabularyWord.phonetic = pronunciation;
      if (document.getElementById('listening-korean-vocabulary-base')) {
        vocabularyWord.vocabularyBase = koreanVocabularyBase;
        vocabularyWord.grammarAnalysis = koreanGrammar;
      }
      saveState();
      const cacheKey = `${listeningPassageLang}:${word.toLocaleLowerCase()}`;
      const cachedLookup = listeningWordLookupCache.get(cacheKey);
      if (cachedLookup) {
        cachedLookup.meaning = editedMeaning;
        cachedLookup.pronunciation = pronunciation;
        if (document.getElementById('listening-korean-vocabulary-base')) {
          cachedLookup.vocabularyBase = koreanVocabularyBase;
          cachedLookup.grammarAnalysis = koreanGrammar;
        }
      }
      renderListeningWordDetail(word, editedMeaning, pronunciation, {
        alreadyAdded: true,
        koreanAnalysis: document.getElementById('listening-korean-vocabulary-base')
          ? { vocabulary: koreanVocabularyBase, grammar: koreanGrammar }
          : undefined
      });
      showToast(`Đã cập nhật thông tin cho "${word}".`, 'success');
    }

    async function lookupListeningWord(word, cacheKey, language) {
      const existingWord = wordsState.find(item =>
        item.lang === language &&
        item.word.trim().toLocaleLowerCase() === word.toLocaleLowerCase()
      );
      const sourceLanguage = { en: 'en', ko: 'ko', zh: 'zh-CN', ja: 'ja' }[language];
      try {
        const translationWord = language === 'ko' ? analyzeKoreanWord(word).vocabulary : word;
        const query = new URLSearchParams({
          q: existingWord?.vocabularyBase || translationWord,
          langpair: `${sourceLanguage}|vi`
        });
        const translationRequest = fetch(`https://api.mymemory.translated.net/get?${query.toString()}`)
          .then(async response => {
            const result = await response.json();
            if (!response.ok) throw new Error(`API dịch thất bại (${response.status}).`);
            if (result.responseStatus !== 200) {
              throw new Error(result.responseDetails || 'API dịch không tìm thấy nghĩa cho từ này.');
            }
            const translatedText = result?.responseData?.translatedText?.trim();
            if (!translatedText) throw new Error('API dịch không trả về nghĩa cho từ này.');
            const decodedTranslation = document.createElement('textarea');
            decodedTranslation.innerHTML = translatedText;
            if (!decodedTranslation.value.trim()) throw new Error('API dịch không trả về nghĩa cho từ này.');
            return decodedTranslation.value.trim();
          });
        const [translationResult, pronunciationResult] = await Promise.allSettled([
          translationRequest,
          lookupListeningPronunciation(word, language)
        ]);
        if (translationResult.status === 'rejected') throw translationResult.reason;

        const lookup = {
          meaning: existingWord?.meaning || translationResult.value,
          pronunciation: existingWord?.phonetic || (pronunciationResult.status === 'fulfilled' ? pronunciationResult.value.pronunciation : ''),
          pronunciationError: pronunciationResult.status === 'fulfilled'
            ? pronunciationResult.value.error
            : pronunciationResult.reason?.message || 'API không thể tra phiên âm.',
          error: ''
        };
        listeningWordLookupCache.set(cacheKey, lookup);
        if (activeListeningWord === word && listeningPassageLang === language) {
          const isAdded = wordsState.some(item =>
            item.lang === language &&
            item.word.trim().toLocaleLowerCase() === word.toLocaleLowerCase()
          );
          renderListeningWordDetail(word, lookup.meaning, lookup.pronunciation, {
            alreadyAdded: isAdded,
            pronunciationError: lookup.pronunciationError,
            koreanAnalysis: language === 'ko'
              ? {
                vocabulary: existingWord?.vocabularyBase || lookup.vocabularyBase || analyzeKoreanWord(word).vocabulary,
                grammar: existingWord?.grammarAnalysis || lookup.grammarAnalysis || analyzeKoreanWord(word).grammar
              }
              : undefined
          });
        }
        return lookup;
      } catch (error) {
        console.error('Listening word lookup failed:', error);
        const lookup = {
          meaning: existingWord?.meaning || '',
          pronunciation: '',
          pronunciationError: 'Không thể tra phiên âm qua API.',
          error: error.message || 'API dịch không thể tra từ này.'
        };
        if (activeListeningWord === word && listeningPassageLang === language) {
          renderListeningWordDetail(word, lookup.meaning, lookup.pronunciation, {
            alreadyAdded: Boolean(existingWord),
            error: lookup.error,
            pronunciationError: lookup.pronunciationError
          });
        }
        return lookup;
      }
    }

    async function addListeningWordFromPassage(wordText) {
      const word = wordText.trim();
      const language = listeningPassageLang;
      const existingWord = wordsState.find(item =>
        item.lang === language &&
        item.word.trim().toLocaleLowerCase() === word.toLocaleLowerCase()
      );
      if (existingWord) {
        showToast(`Từ "${word}" đã có trong danh sách.`, 'info');
        return;
      }

      const cacheKey = `${language}:${word.toLocaleLowerCase()}`;
      let lookup = listeningWordLookupCache.get(cacheKey);
      if (!lookup?.meaning) {
        let request = listeningWordLookupRequests.get(cacheKey);
        if (!request) {
          request = lookupListeningWord(word, cacheKey, language);
          listeningWordLookupRequests.set(cacheKey, request);
          request.then(() => {
            if (listeningWordLookupRequests.get(cacheKey) === request) {
              listeningWordLookupRequests.delete(cacheKey);
            }
          });
        }
        setListeningStatus(`Đang tra nghĩa để thêm "${word}"...`);
        lookup = await request;
      }

      if (language !== listeningPassageLang || listeningPassageText === '') return;
      if (!lookup?.meaning) {
        showToast(lookup?.error || `Không thể tra nghĩa từ "${word}".`, 'error');
        setListeningStatus('');
        return;
      }

      const manualPronunciation = activeListeningWord === word
        ? document.getElementById('listening-manual-pronunciation')?.value || ''
        : '';
      const manualMeaning = activeListeningWord === word
        ? document.getElementById('listening-manual-meaning')?.value.trim() || ''
        : '';
      const koreanVocabularyBase = activeListeningWord === word
        ? document.getElementById('listening-korean-vocabulary-base')?.value.trim() || ''
        : '';
      const koreanGrammar = activeListeningWord === word
        ? [...document.querySelectorAll('#listening-korean-grammar-rows > div')].map(row => ({
          form: row.querySelector('[data-korean-grammar-form]')?.value.trim() || '',
          meaning: row.querySelector('[data-korean-grammar-meaning]')?.value.trim() || ''
        })).filter(item => item.form || item.meaning)
        : [];
      addListeningWord(
        word,
        manualMeaning || lookup.meaning,
        lookup.pronunciation || manualPronunciation,
        koreanVocabularyBase,
        koreanGrammar
      );
      setListeningStatus('');
    }

    async function lookupListeningPronunciation(word, language) {
      if (language === 'en') {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (response.ok) {
          const result = await response.json();
          const pronunciation = result
            .flatMap(entry => entry.phonetics || [])
            .map(phonetic => phonetic.text)
            .find(text => typeof text === 'string' && text.trim());
          if (pronunciation) return { pronunciation, error: '' };
        }
      }

      const sourceLanguage = { ko: 'ko', zh: 'zh-CN', ja: 'ja' }[language];
      const effectiveSourceLanguage = language === 'en' ? 'en' : sourceLanguage;
      const query = new URLSearchParams({
        client: 'gtx',
        sl: effectiveSourceLanguage,
        tl: 'vi',
        dt: 't',
        q: word
      });
      query.append('dt', 'rm');
      const response = await fetch(`https://translate.google.com/translate_a/single?${query.toString()}`);
      if (!response.ok) throw new Error(`API phiên âm thất bại (${response.status}).`);
      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error('API phiên âm trả về dữ liệu không hợp lệ.');
      }
      const pronunciationCandidates = [];
      const collectPronunciations = value => {
        if (!Array.isArray(value)) return;
        if (typeof value[3] === 'string' && value[3].trim()) pronunciationCandidates.push(value[3].trim());
        value.forEach(collectPronunciations);
      };
      collectPronunciations(result?.[0]);
      const pronunciation = pronunciationCandidates.find(Boolean);
      if (!pronunciation) throw new Error('API không tìm thấy phiên âm cho từ này.');
      return { pronunciation, error: '' };
    }

    function addListeningWord(wordText, meaningText, pronunciation = '', vocabularyBase = '', grammarAnalysis = []) {
      const word = wordText.trim();
      const meaning = meaningText.trim();
      const newWord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        lang: listeningPassageLang,
        word,
        meaning,
        phonetic: pronunciation,
        ...(listeningPassageLang === 'ko'
          ? {
            vocabularyBase: vocabularyBase || analyzeKoreanWord(word).vocabulary,
            grammarAnalysis
          }
          : {}),
        example: '',
        srsLevel: 0,
        nextReviewTime: 0,
        forgotCount: 0,
        reps: 0,
        ef: 2.5,
        interval: 0
      };
      wordsState.unshift(newWord);
      saveState();
      renderAllViews();
      renderListeningPassage();
      showToast(`Đã thêm "${word}" vào danh sách từ vựng.`, 'success');
    }

    function setListeningStatus(message) {
      const status = document.getElementById('listening-status');
      status.innerText = message;
      status.classList.toggle('hidden', !message);
    }

    function playListeningPassage() {
      if (!listeningPassageText) {
        showToast('Hãy chọn một câu chuyện trước khi nghe.', 'warning');
        return;
      }
      if (!hasSpeechVoice(listeningPassageLang) || typeof SpeechSynthesisUtterance === 'undefined') {
        setListeningStatus('Đang tải giọng đọc trực tuyến...');
        speakWithRemoteVoice(listeningPassageText, listeningPassageLang, () => {
          setListeningStatus('');
        }, () => {
          setListeningStatus('Không thể tải giọng đọc. Hãy kiểm tra kết nối mạng.');
        });
        return;
      }
      stopRemoteSpeech();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(listeningPassageText);
      utterance.lang = getSpeechLanguage(listeningPassageLang);
      utterance.voice = window.speechSynthesis.getVoices().find(voice =>
        voice.lang.toLowerCase() === utterance.lang.toLowerCase()
      ) || null;
      utterance.rate = 0.85;
      utterance.onend = () => {
        setListeningStatus('');
      };
      utterance.onerror = event => {
        if (event.error === 'canceled' || event.error === 'interrupted') return;
        setListeningStatus(`Không thể phát âm thanh: ${event.error}.`);
      };
      setListeningStatus('Đang phát bài nghe...');
      window.speechSynthesis.speak(utterance);
    }

    function pauseListeningPassage() {
      if (remoteSpeechAudio) {
        if (remoteSpeechAudio.paused) {
          remoteSpeechAudio.play().catch(() => {
            setListeningStatus('Không thể tiếp tục phát âm thanh. Hãy kiểm tra kết nối mạng.');
          });
          setListeningStatus('Đang phát bài nghe...');
        } else {
          remoteSpeechAudio.pause();
          setListeningStatus('Đã tạm dừng.');
        }
        return;
      }
      if (!('speechSynthesis' in window)) {
        showToast('Trình duyệt này không hỗ trợ đọc văn bản.', 'error');
        return;
      }
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setListeningStatus('Đang phát bài nghe...');
      } else if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        setListeningStatus('Đã tạm dừng.');
      }
    }

    function stopListeningPassage() {
      stopRemoteSpeech();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setListeningStatus('');
    }

    /* ==========================================================================
       4. SRS BADGE, TIME FORMATTING & VOCAB MANAGEMENT
       ========================================================================== */
    const SRS_INTERVALS = [0, 60000, 300000, 900000, 3600000, 14400000, 43200000, 86400000, 259200000];

    function getSRSBadgeHTML(level = 0) {
      const badgeMap = {
        0: { bg: 'bg-red-500 text-white', label: 'Chưa học' },
        1: { bg: 'bg-amber-400 text-slate-900', label: 'Đã học (Lvl 1)' },
        2: { bg: 'bg-emerald-500 text-white', label: 'Lvl 2' },
        3: { bg: 'bg-blue-500 text-white', label: 'Lvl 3' },
        4: { bg: 'bg-purple-500 text-white', label: 'Lvl 4' },
        5: { bg: 'bg-pink-500 text-white', label: 'Lvl 5' },
        6: { bg: 'bg-orange-500 text-white', label: 'Lvl 6' },
        7: { bg: 'bg-cyan-500 text-white', label: 'Lvl 7' }
      };

      if (level >= 8) {
        return `<span class="inline-flex items-center justify-center w-28 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-sm"><i class="fa-solid fa-crown mr-1"></i> VIP</span>`;
      }

      const badge = badgeMap[level] || badgeMap[0];
      return `<span class="inline-flex items-center justify-center w-28 h-7 rounded-full ${badge.bg} font-bold text-xs shadow-sm">${badge.label}</span>`;
    }

    function formatNextReviewTime(nextReviewTime, srsLevel) {
      if (!nextReviewTime || srsLevel === 0) {
        return `<span class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-mono text-xs font-bold flex items-center justify-center gap-1"><i class="fa-solid fa-check text-emerald-500"></i> Sẵn sàng</span>`;
      }

      const diffMs = nextReviewTime - Date.now();
      if (diffMs <= 0) {
        return `<span class="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold flex items-center justify-center gap-1"><i class="fa-solid fa-bolt text-amber-500"></i> Ôn ngay</span>`;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (hours >= 24) {
        const days = Math.floor(hours / 24);
        return `<span class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs"><i class="fa-solid fa-clock text-blue-500 mr-1"></i>${days} ngày</span>`;
      }

      const pad = num => String(num).padStart(2, '0');
      const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

      return `<span class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-xs font-bold flex items-center justify-center gap-1"><i class="fa-solid fa-hourglass-half text-amber-500"></i> ${formatted}</span>`;
    }

    function renderVocabList() {
      const tbody = document.getElementById('vocab-table-body');
      const emptyState = document.getElementById('vocab-empty-state');
      const table = document.getElementById('vocab-table');
      if (!tbody) return;

      if (table) table.classList.toggle('min-w-[760px]', currentLang === 'ko');

      const searchVal = (document.getElementById('search-vocab-input')?.value || '').toLowerCase();
      const filterSrs = document.getElementById('filter-srs-select')?.value || 'all';

      let filtered = wordsState.filter(w => w.lang === currentLang);

      if (searchVal) {
        filtered = filtered.filter(w => 
          w.word.toLowerCase().includes(searchVal) || 
          w.meaning.toLowerCase().includes(searchVal) || 
          (w.phonetic && w.phonetic.toLowerCase().includes(searchVal)) ||
          (w.example && w.example.toLowerCase().includes(searchVal))
        );
      }

      if (filterSrs !== 'all') {
        if (filterSrs === '0') filtered = filtered.filter(w => w.srsLevel === 0);
        else if (filterSrs === '1') filtered = filtered.filter(w => w.srsLevel === 1);
        else if (filterSrs === 'reviewing') filtered = filtered.filter(w => w.srsLevel >= 1 && w.srsLevel <= 7);
        else if (filterSrs === 'vip') filtered = filtered.filter(w => w.srsLevel >= 8);
      }

      const selectedCount = document.getElementById('selected-word-count');
      if (selectedCount) selectedCount.innerText = selectedWordIds.size.toString();
      const selectVisibleCheckbox = document.getElementById('select-visible-words');
      if (selectVisibleCheckbox) {
        const selectedVisibleCount = filtered.filter(item => selectedWordIds.has(item.id)).length;
        selectVisibleCheckbox.checked = filtered.length > 0 && selectedVisibleCount === filtered.length;
        selectVisibleCheckbox.indeterminate = selectedVisibleCount > 0 && selectedVisibleCount < filtered.length;
      }

      if (filtered.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
      }

      if (emptyState) emptyState.classList.add('hidden');
      tbody.innerHTML = filtered.map(item => `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
          <td class="p-3.5 text-center">
            <input type="checkbox" value="${escapeHTML(item.id)}" ${selectedWordIds.has(item.id) ? 'checked' : ''} onchange="setWordSelected(this.value, this.checked)" aria-label="Chọn từ ${escapeHTML(item.word)}" class="rounded border-slate-300 text-rose-600 focus:ring-rose-500">
          </td>
          <td class="p-3.5">
            <div class="flex items-center gap-2.5">
              <button onclick="speakWord('${escapeHTML(item.word)}', '${item.lang}')" class="w-8 h-8 rounded-xl bg-theme-subtle text-theme-main hover:scale-105 transition flex items-center justify-center text-xs flex-shrink-0" title="Phát âm">
                <i class="fa-solid fa-volume-high"></i>
              </button>
              <div>
                <span class="font-bold text-slate-900 dark:text-white block text-base ${item.lang === 'ko' ? 'whitespace-nowrap' : ''}">${escapeHTML(item.word)}</span>
                ${item.phonetic ? `<span class="text-xs text-slate-400 italic">${escapeHTML(item.phonetic)}</span>` : ''}
              </div>
            </div>
          </td>
          <td class="p-3.5">
            <span class="font-semibold text-slate-800 dark:text-slate-200 block">${escapeHTML(item.meaning)}</span>
            ${item.example ? `<span class="text-xs text-slate-500 dark:text-slate-400 italic block mt-0.5"><i class="fa-solid fa-quote-left text-theme-main text-[10px] mr-1"></i>${escapeHTML(item.example)}</span>` : ''}
          </td>
          <td class="p-3.5 text-center">${getSRSBadgeHTML(item.srsLevel)}</td>
          <td class="p-3.5 text-center">
            <span class="next-review-timer" data-next-time="${item.nextReviewTime || 0}" data-srs-level="${item.srsLevel || 0}">
              ${formatNextReviewTime(item.nextReviewTime, item.srsLevel)}
            </span>
          </td>
          <td class="p-3.5 text-right space-x-1">
            <button onclick="openEditModal('${item.id}')" class="p-2 rounded-xl text-slate-400 hover:text-theme-main hover:bg-theme-subtle transition" title="Sửa từ vựng">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="openDeleteModal('${item.id}')" class="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition" title="Xóa từ vựng">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `).join('');
    }

    function setWordSelected(id, isSelected) {
      if (isSelected) selectedWordIds.add(id);
      else selectedWordIds.delete(id);
      updateSelectionUI();
      syncZombieGameData();
    }

    function selectVisibleWords(isSelected) {
      const visibleIds = Array.from(document.querySelectorAll('#vocab-table-body input[type="checkbox"]'))
        .map(checkbox => checkbox.value);
      visibleIds.forEach(id => {
        if (isSelected) selectedWordIds.add(id);
        else selectedWordIds.delete(id);
      });
      document.querySelectorAll('#vocab-table-body input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = isSelected;
      });
      updateSelectionUI();
      syncZombieGameData();
    }

    function updateSelectionUI() {
      const visibleCheckboxes = Array.from(document.querySelectorAll('#vocab-table-body input[type="checkbox"]'));
      const selectedVisibleCount = visibleCheckboxes.filter(checkbox => selectedWordIds.has(checkbox.value)).length;
      const selectedCount = document.getElementById('selected-word-count');
      if (selectedCount) selectedCount.innerText = selectedWordIds.size.toString();
      const selectVisibleCheckbox = document.getElementById('select-visible-words');
      if (selectVisibleCheckbox) {
        selectVisibleCheckbox.checked = visibleCheckboxes.length > 0 && selectedVisibleCount === visibleCheckboxes.length;
        selectVisibleCheckbox.indeterminate = selectedVisibleCount > 0 && selectedVisibleCount < visibleCheckboxes.length;
      }
    }

    function toggleAddWordPanel(show) {
      const layout = document.getElementById('vocab-layout');
      const hideButton = document.querySelector('#add-word-panel button[aria-controls="add-word-panel"]');
      const showButton = document.getElementById('show-add-word-panel');
      const panel = document.getElementById('add-word-panel');
      if (!layout || !panel || !hideButton || !showButton) {
        throw new Error('Không tìm thấy giao diện thêm từ vựng.');
      }

      layout.classList.toggle('vocab-form-hidden', !show);
      hideButton.setAttribute('aria-expanded', String(show));
      showButton.setAttribute('aria-expanded', String(show));
      panel.setAttribute('aria-hidden', String(!show));
      panel.inert = !show;
    }

    function handleAddWord(e) {
      e.preventDefault();
      const wordInput = document.getElementById('input-word');
      const meaningInput = document.getElementById('input-meaning');
      const phoneticInput = document.getElementById('input-phonetic');
      const exampleInput = document.getElementById('input-example');

      const word = wordInput.value.trim();
      const meaning = meaningInput.value.trim();
      const phonetic = phoneticInput ? phoneticInput.value.trim() : '';
      const example = exampleInput.value.trim();

      if (!word || !meaning) return;

      const isDuplicate = wordsState.some(w => w.lang === currentLang && w.word.toLowerCase() === word.toLowerCase());
      if (isDuplicate) {
        showToast(`⚠️ Từ "${word}" đã có trong danh sách từ vựng ${currentLang.toUpperCase()}!`, 'warning');
        return;
      }

      // Initialize with SM-2 Default Values
      const newEntry = {
        id: Date.now().toString(),
        lang: currentLang,
        word,
        meaning,
        phonetic,
        example,
        srsLevel: 0,
        nextReviewTime: 0,
        forgotCount: 0,
        reps: 0,      // SM-2: Repetitions
        ef: 2.5,      // SM-2: Easiness Factor
        interval: 0   // SM-2: Current Interval in days
      };

      wordsState.unshift(newEntry);
      saveState();

      wordInput.value = '';
      meaningInput.value = '';
      if (phoneticInput) phoneticInput.value = '';
      exampleInput.value = '';

      showToast(`✅ Đã thêm từ "${word}" vào danh sách!`, 'success');
      renderAllViews();
    }

    /* EDIT WORD MODAL HANDLERS */
    function openEditModal(id) {
      const item = wordsState.find(w => w.id === id);
      if (!item) return;

      document.getElementById('edit-word-id').value = item.id;
      document.getElementById('edit-input-word').value = item.word;
      document.getElementById('edit-input-meaning').value = item.meaning;
      document.getElementById('edit-input-phonetic').value = item.phonetic || '';
      document.getElementById('edit-input-example').value = item.example || '';

      document.getElementById('edit-word-modal').classList.remove('hidden');
    }

    function closeEditModal() {
      document.getElementById('edit-word-modal').classList.add('hidden');
    }

    function handleSaveEditWord(e) {
      e.preventDefault();
      const id = document.getElementById('edit-word-id').value;
      const word = document.getElementById('edit-input-word').value.trim();
      const meaning = document.getElementById('edit-input-meaning').value.trim();
      const phonetic = document.getElementById('edit-input-phonetic').value.trim();
      const example = document.getElementById('edit-input-example').value.trim();

      const itemIdx = wordsState.findIndex(w => w.id === id);
      if (itemIdx !== -1) {
        wordsState[itemIdx].word = word;
        wordsState[itemIdx].meaning = meaning;
        wordsState[itemIdx].phonetic = phonetic;
        wordsState[itemIdx].example = example;

        saveState();
        closeEditModal();
        showToast(`✏️ Đã cập nhật từ "${word}" thành công!`, 'success');
        renderAllViews();
      }
    }

    /* SETTINGS MODAL HANDLERS */
    function openSettingsModal() {
      document.getElementById('gemini-api-key-input').value = geminiApiKey;
      document.getElementById('settings-auto-tts-check').checked = autoTTS;
      document.getElementById('settings-modal').classList.remove('hidden');
    }

    function closeSettingsModal() {
      document.getElementById('settings-modal').classList.add('hidden');
    }

    function saveSettings() {
      geminiApiKey = document.getElementById('gemini-api-key-input').value.trim();
      localStorage.setItem('polyglot_gemini_key', geminiApiKey);
      closeSettingsModal();
      showToast('⚙️ Đã lưu cài đặt cấu hình!', 'success');
    }

    function openDeleteModal(id) {
      targetDeleteId = id;
      pendingDeleteIds = [];
      const item = wordsState.find(w => w.id === id);
      if (item) {
        document.getElementById('delete-modal-title').innerText = 'Xác nhận xóa từ vựng';
        document.getElementById('delete-modal-message').innerText = 'Bạn có chắc chắn muốn xóa từ vựng';
        document.getElementById('delete-word-target').innerText = item.word;
        document.getElementById('delete-modal-suffix').innerText = 'khỏi danh sách?';
        document.getElementById('delete-modal').classList.remove('hidden');
        document.getElementById('confirm-delete-btn').onclick = () => confirmDeleteWord();
      }
    }

    function requestBulkDelete(scope) {
      const deleteMenu = document.getElementById('vocab-delete-menu');
      if (deleteMenu) deleteMenu.open = false;

      if (scope === 'selected') {
        pendingDeleteIds = wordsState.filter(item => selectedWordIds.has(item.id)).map(item => item.id);
      } else if (scope === 'language') {
        pendingDeleteIds = wordsState.filter(item => item.lang === currentLang).map(item => item.id);
      } else if (scope === 'all') {
        pendingDeleteIds = wordsState.map(item => item.id);
      } else {
        return;
      }

      if (pendingDeleteIds.length === 0) {
        showToast(scope === 'selected' ? 'Bạn chưa chọn từ vựng nào để xóa!' : 'Không có từ vựng nào để xóa!', 'info');
        return;
      }

      const deletePrompt = scope === 'selected'
        ? `Bạn có chắc chắn muốn xóa ${pendingDeleteIds.length} từ đã chọn?`
        : scope === 'language'
          ? `Bạn có chắc chắn muốn xóa toàn bộ ${pendingDeleteIds.length} từ vựng tiếng ${currentLang.toUpperCase()}?`
          : `Bạn có chắc chắn muốn xóa toàn bộ ${pendingDeleteIds.length} từ vựng của tất cả ngôn ngữ?`;
      targetDeleteId = null;
      document.getElementById('delete-modal-title').innerText = 'Xác nhận xóa từ vựng';
      document.getElementById('delete-modal-message').innerText = deletePrompt;
      document.getElementById('delete-word-target').innerText = '';
      document.getElementById('delete-modal-suffix').innerText = 'Thao tác này không thể hoàn tác.';
      document.getElementById('delete-modal').classList.remove('hidden');
      document.getElementById('confirm-delete-btn').onclick = () => confirmBulkDelete();
    }

    function confirmBulkDelete() {
      if (pendingDeleteIds.length === 0) return;
      const idsToDelete = new Set(pendingDeleteIds);
      const deletedCount = wordsState.filter(item => idsToDelete.has(item.id)).length;
      if (deletedCount === 0) {
        closeDeleteModal();
        showToast('Không tìm thấy từ vựng để xóa!', 'info');
        return;
      }

      wordsState = wordsState.filter(item => !idsToDelete.has(item.id));
      pendingDeleteIds.forEach(id => selectedWordIds.delete(id));
      saveState();
      closeDeleteModal();
      showToast(`🗑️ Đã xóa ${deletedCount} từ vựng!`, 'info');
      renderAllViews();
    }

    function closeDeleteModal() {
      document.getElementById('delete-modal').classList.add('hidden');
      targetDeleteId = null;
      pendingDeleteIds = [];
    }

    function confirmDeleteWord() {
      if (!targetDeleteId) return;
      const item = wordsState.find(w => w.id === targetDeleteId);
      wordsState = wordsState.filter(w => w.id !== targetDeleteId);
      selectedWordIds.delete(targetDeleteId);
      saveState();
      closeDeleteModal();
      if (item) showToast(`🗑️ Đã xóa từ "${item.word}"!`, 'info');
      renderAllViews();
    }

    function resetGameUI() {
      if (gameRunning) {
        gameRunning = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      }
      gamePaused = false;
      animationFrameId = null;
      document.getElementById('game-stats')?.classList.add('hidden');
      document.getElementById('game-input-form')?.classList.add('hidden');
      document.getElementById('game-pause-btn')?.classList.add('hidden');
      document.getElementById('game-exit-btn')?.classList.add('hidden');
      const icon = document.getElementById('game-modal-icon');
      const title = document.getElementById('game-modal-title');
      const desc = document.getElementById('game-modal-desc');
      if (icon) icon.innerHTML = '<i class="fa-solid fa-meteor"></i>';
      if (title) title.innerText = 'Bắn Thiên Thạch Vũ Trụ';
      if (desc) {
        desc.innerHTML = `
          Gõ chính xác <b class="text-amber-300">Nghĩa tiếng Việt</b> (hoặc từ vựng) của thiên thạch đang rơi. <br>
          <span class="text-emerald-400 font-bold">🎮 Hỗ trợ so khớp từ đồng nghĩa gần đúng / Gõ không dấu / Gemini AI tùy chọn!</span>
        `;
      }
      const modal = document.getElementById('game-modal-overlay');
      if (modal) modal.classList.remove('hidden');
    }

    function renderNemesisList() {
      const container = document.getElementById('nemesis-grid-container');
      const emptyState = document.getElementById('nemesis-empty-state');
      const nemesisWords = wordsState.filter(w => w.lang === currentLang && (w.forgotCount || 0) >= 3);

      if (nemesisWords.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
      }

      emptyState.classList.add('hidden');
      container.innerHTML = nemesisWords.map(item => `
        <div class="p-5 rounded-3xl bg-slate-900 border-2 border-rose-600/70 text-white shadow-xl relative space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 rounded-full bg-rose-900/80 text-rose-200 text-xs font-black border border-rose-500/40">
              💀 Quên ${item.forgotCount || 3} lần
            </span>
            <div class="flex items-center gap-2">
              <button onclick="speakWord('${escapeHTML(item.word)}', '${item.lang}')" class="w-7 h-7 rounded-full bg-slate-800 text-rose-300 hover:text-white transition flex items-center justify-center text-xs">
                <i class="fa-solid fa-volume-high"></i>
              </button>
              <span class="px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                <i class="fa-solid fa-fire text-amber-400 mr-1"></i> ${item.consecutiveCorrect || 0}/3 Lần thuộc
              </span>
              <button onclick="openEditModal('${item.id}')" class="text-slate-400 hover:text-white transition text-xs">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button onclick="openDeleteModal('${item.id}')" class="text-slate-400 hover:text-rose-400 transition text-xs">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
          <div>
            <h3 class="text-2xl font-black text-rose-100">${escapeHTML(item.word)}</h3>
            <p class="text-sm font-semibold text-rose-300 mt-1">${escapeHTML(item.meaning)}</p>
            ${item.phonetic ? `<p class="text-xs text-slate-400 italic mt-0.5">${escapeHTML(item.phonetic)}</p>` : ''}
            ${item.example ? `<p class="text-xs text-slate-400 italic mt-1.5 border-t border-slate-800 pt-1.5"><i class="fa-solid fa-quote-left mr-1 text-rose-400"></i>${escapeHTML(item.example)}</p>` : ''}
          </div>
          <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>SRS Progress:</span>
            <span>${getSRSBadgeHTML(item.srsLevel)}</span>
          </div>
        </div>
      `).join('');
    }

    function renderVIPList() {
      const container = document.getElementById('vip-grid-container');
      const emptyState = document.getElementById('vip-empty-state');
      if (!container) return;

      const vipWords = wordsState.filter(w => w.lang === currentLang && w.srsLevel >= 8);

      if (vipWords.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
      }

      if (emptyState) emptyState.classList.add('hidden');
      container.innerHTML = vipWords.map(item => `
        <div class="p-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-amber-400 dark:border-amber-500/50 shadow-xl relative space-y-3 vip-glow">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-black">
              <i class="fa-solid fa-crown text-amber-500 mr-1"></i> VIP Mastered
            </span>
            <div class="flex items-center gap-2">
              <button onclick="speakWord('${escapeHTML(item.word)}', '${item.lang}')" class="w-7 h-7 rounded-full bg-amber-100 text-amber-800 hover:scale-110 transition flex items-center justify-center text-xs">
                <i class="fa-solid fa-volume-high"></i>
              </button>
              <button onclick="openEditModal('${item.id}')" class="text-slate-400 hover:text-amber-600 transition text-xs">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button onclick="openDeleteModal('${item.id}')" class="text-slate-400 hover:text-rose-500 transition text-xs">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
          <div>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white">${escapeHTML(item.word)}</h3>
            <p class="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">${escapeHTML(item.meaning)}</p>
            ${item.phonetic ? `<p class="text-xs text-slate-400 italic mt-0.5">${escapeHTML(item.phonetic)}</p>` : ''}
            ${item.example ? `<p class="text-xs text-slate-500 dark:text-slate-400 italic mt-1.5 border-t border-slate-100 dark:border-slate-700/60 pt-1.5"><i class="fa-solid fa-quote-left mr-1 text-amber-500"></i>${escapeHTML(item.example)}</p>` : ''}
          </div>
          <div class="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
            <span>Cấp độ lặp lại:</span>
            <span class="font-bold text-amber-600 dark:text-amber-400">Level ${item.srsLevel}</span>
          </div>
        </div>
      `).join('');
    }

    function updateStats() {
      const langWords = wordsState.filter(w => w.lang === currentLang);
      const total = langWords.length;
      const unlearned = langWords.filter(w => w.srsLevel === 0).length;
      const learning = langWords.filter(w => w.srsLevel >= 1 && w.srsLevel <= 7).length;
      const vip = langWords.filter(w => w.srsLevel >= 8).length;
      const nemesis = langWords.filter(w => (w.forgotCount || 0) >= 3).length;

      const totalEl = document.getElementById('stat-total-words');
      const unlearnedEl = document.getElementById('stat-unlearned-words');
      const learningEl = document.getElementById('stat-learning-words');
      const vipEl = document.getElementById('stat-vip-words');
      const vipBadge = document.getElementById('vip-badge-count');
      const nemesisBadge = document.getElementById('nemesis-badge-count');

      if (totalEl) totalEl.innerText = total;
      if (unlearnedEl) unlearnedEl.innerText = unlearned;
      if (learningEl) learningEl.innerText = learning;
      if (vipEl) vipEl.innerText = vip;
      if (vipBadge) vipBadge.innerText = vip;
      if (nemesisBadge) nemesisBadge.innerText = nemesis;
      window.polyglotUI?.sync();
    }

    function renderAllViews() {
      syncZombieGameData();
      renderVocabList();
      renderListeningStories();
      renderProductionScenarios();
      renderProductionHistory();
      updateStats();
      if (currentTab === 'vip') renderVIPList();
      if (currentTab === 'nemesis') renderNemesisList();
      if (currentTab === 'flashcards') initFlashcards();
    }

    /* ==========================================================================
       5. LANGUAGE-SPECIFIC PRESET VOCABULARY PACKS & IMPORT ENGINE
       ========================================================================== */
    let parsedImportWords = [];

    const LANGUAGE_PRESET_PACKS = {
      en: {
        oxford: {
          name: '📘 Oxford 3000 Giao Tiếp',
          items: [
            { word: 'Accomplish', meaning: 'Hoàn thành, đạt được', phonetic: '/əˈkʌm.plɪʃ/', example: 'You can accomplish anything with hard work.' },
            { word: 'Benevolent', meaning: 'Rộng lượng, nhân từ', phonetic: '/bəˈnev.əl.ənt/', example: 'The benevolent king donated his wealth.' },
            { word: 'Collaborate', meaning: 'Hợp tác, cộng tác', phonetic: '/kəˈlæb.ə.reɪt/', example: 'We will collaborate on this new project.' },
            { word: 'Diverse', meaning: 'Đa dạng, phong phú', phonetic: '/daɪˈvɜːs/', example: 'Vietnam has a diverse cultural heritage.' },
            { word: 'Enthusiasm', meaning: 'Sự nhiệt huyết', phonetic: '/ɪnˈθjuː.zi.æz.əm/', example: 'She showed endless enthusiasm for learning.' }
          ]
        },
        ielts: {
          name: '🎓 IELTS Academic Essential',
          items: [
            { word: 'Ambiguity', meaning: 'Sự mơ hồ, không rõ ràng', phonetic: '/ˌæm.bɪˈɡjuː.ə.ti/', example: 'Write clearly to avoid any ambiguity.' },
            { word: 'Comprehensive', meaning: 'Toàn diện, bao quát', phonetic: '/ˌkɒm.prɪˈhen.sɪv/', example: 'The report gives a comprehensive overview.' },
            { word: 'Deteriorate', meaning: 'Mất giá trị, xấu đi', phonetic: '/dɪˈtɪə.ri.ə.reɪt/', example: 'Air quality may deteriorate during winter.' },
            { word: 'Exacerbate', meaning: 'Làm trầm trọng thêm', phonetic: '/ɪɡˈzæs.ə.beɪt/', example: 'Heavy rain will exacerbate flooding.' },
            { word: 'Flourish', meaning: 'Phát triển hưng thịnh', phonetic: '/ˈflʌr.ɪʃ/', example: 'Small businesses can flourish online.' }
          ]
        },
        toeic: {
          name: '💼 TOEIC Chuyên Ngành Thương Mại',
          items: [
            { word: 'Negotiate', meaning: 'Đàm phán, thương lượng', phonetic: '/nəˈɡəʊ.ʃi.eɪt/', example: 'We need to negotiate a better deal.' },
            { word: 'Agenda', meaning: 'Chương trình nghị sự', phonetic: '/əˈdʒen.də/', example: 'Check the meeting agenda before joining.' },
            { word: 'Compensate', meaning: 'Bồi thường, đền bù', phonetic: '/ˈkɒm.pən.seɪt/', example: 'They will compensate for overtime work.' },
            { word: 'Incentive', meaning: 'Sự khuyến khích, động lực', phonetic: '/ɪnˈsen.tɪv/', example: 'Bonuses act as a great performance incentive.' }
          ]
        }
      },
      ko: {
        topik1: {
          name: '🇰🇷 TOPIK 1 Sơ Cấp Chuẩn',
          items: [
            { word: '학교', meaning: 'Trường học', phonetic: '', example: '학교에 갑니다 (Tôi đi đến trường).' },
            { word: '친구', meaning: 'Bạn bè', phonetic: '', example: '좋은 친구를 만났어요 (Tôi đã gặp người bạn tốt).' },
            { word: '음식', meaning: 'Món ăn, thức ăn', phonetic: '', example: '한국 음식을 좋아해요 (Tôi thích món ăn Hàn Quốc).' },
            { word: '시간', meaning: 'Thời gian', phonetic: '', example: '지금 몇 시예요? (Bây giờ là mấy giờ?).' },
            { word: '선생님', meaning: 'Thầy / Cô giáo', phonetic: '', example: '선생님, 안녕하세요! (Em chào thầy cô!).' }
          ]
        },
        topik2: {
          name: '🇰🇷 TOPIK 2 Trung Cấp',
          items: [
            { word: '경험', meaning: 'Kinh nghiệm', phonetic: '', example: '다양한 경험을 쌓았다 (Tích lũy nhiều kinh nghiệm).' },
            { word: '성공', meaning: 'Thành công', phonetic: '', example: '열심히 노력하여 성공했다 (Thành công nhờ nỗ lực).' },
            { word: '태도', meaning: 'Thái độ', phonetic: '', example: '긍정적인 태도가 중요하다 (Thái độ tích cực rất quan trọng).' },
            { word: '발전', meaning: 'Phát triển', phonetic: '', example: '기술이 빠르게 발전하고 있다 (Công nghệ phát triển nhanh chóng).' }
          ]
        },
        daily_ko: {
          name: '💬 Giao Tiếp Tiếng Hàn Hàng Ngày',
          items: [
            { word: '감사합니다', meaning: 'Xin cảm ơn', phonetic: '', example: '도와주셔서 감사합니다 (Cảm ơn vì đã giúp đỡ).' },
            { word: '죄송합니다', meaning: 'Xin lỗi', phonetic: '', example: '늦어서 죄송합니다 (Xin lỗi vì tôi đến trễ).' },
            { word: '맛있어요', meaning: 'Ngon lắm', phonetic: '', example: '이 음식 정말 맛있어요 (Món này thực sự ngon!).' },
            { word: '얼마예요', meaning: 'Bao nhiêu tiền?', phonetic: '', example: '이것은 얼마예요? (Cái này bao nhiêu tiền?).' }
          ]
        }
      },
      zh: {
        hsk1: {
          name: '🇨🇳 HSK 1 Sơ Cấp Chuẩn',
          items: [
            { word: '学习', meaning: 'Học tập', phonetic: 'xuéxí', example: '我喜欢学习汉语 (Tôi thích học tiếng Trung).' },
            { word: '朋友', meaning: 'Bạn bè', phonetic: 'péngyou', example: '他是我的好朋友 (Cậu ấy là bạn tốt của tôi).' },
            { word: '高兴', meaning: 'Vui vẻ', phonetic: 'gāoxìng', example: '很高兴认识你 (Rất vui được quen biết bạn).' },
            { word: '工作', meaning: 'Công việc / Làm việc', phonetic: 'gōngzuò', example: '你在哪里工作？ (Bạn làm việc ở đâu?).' },
            { word: '医生', meaning: 'Bác sĩ', phonetic: 'yīshēng', example: '我的爸爸是医生 (Bố tôi là bác sĩ).' }
          ]
        },
        hsk2: {
          name: '🇨🇳 HSK 2 Trung Cấp',
          items: [
            { word: '准备', meaning: 'Chuẩn bị', phonetic: 'zhǔnbèi', example: '你准备好了吗？ (Bạn đã chuẩn bị xong chưa?).' },
            { word: '帮助', meaning: 'Giúp đỡ', phonetic: 'bāngzhù', example: '谢谢你的帮助 (Cảm ơn sự giúp đỡ của bạn).' },
            { word: '介绍', meaning: 'Giới thiệu', phonetic: 'jièshào', example: '我来介绍一下 (Để tôi giới thiệu một chút).' },
            { word: '希望', meaning: 'Hy vọng', phonetic: 'xīwàng', example: '希望一切顺利 (Hy vọng mọi sự thuận lợi).' }
          ]
        },
        daily_zh: {
          name: '💬 Giao Tiếp Tiếng Trung Hàng Ngày',
          items: [
            { word: '没关系', meaning: 'Không sao đâu', phonetic: 'méi guānxi', example: '没关系，别担心 (Không sao đâu, đừng lo).' },
            { word: '再见', meaning: 'Tạm biệt', phonetic: 'zàijiàn', example: '明天再见！ (Ngày mai gặp lại!).' },
            { word: '多少钱', meaning: 'Bao nhiêu tiền?', phonetic: 'duōshao qián', example: '这个一共多少钱？ (Cái này tổng cộng bao nhiêu tiền?).' }
          ]
        }
      },
      ja: {
        n5: {
          name: '🇯🇵 JLPT N5 Sơ Cấp Chuẩn',
          items: [
            { word: '学校', meaning: 'Trường học', phonetic: 'がっこう (Gakkou)', example: '毎日学校へ行きます (Hàng ngày tôi đến trường).' },
            { word: '友達', meaning: 'Bạn bè', phonetic: 'ともだち (Tomodachi)', example: '友達と映画を見ます (Xem phim cùng bạn).' },
            { word: '食べる', meaning: 'Ăn', phonetic: 'たべる (Taberu)', example: '朝ご飯を食べます (Ăn sáng).' }
          ]
        },
        n4: {
          name: '🇯🇵 JLPT N4 Trung Cấp',
          items: [
            { word: '約束', meaning: 'Lời hứa, cuộc hẹn', phonetic: 'やくそく (Yakusoku)', example: '友達と約束があります (Có cuộc hẹn với bạn).' },
            { word: '準備', meaning: 'Chuẩn bị', phonetic: 'じゅんび (Junbi)', example: '旅行の準備をします (Chuẩn bị hành lý du lịch).' }
          ]
        }
      }
    };

    function renderPresetPacksForCurrentLang() {
      const container = document.getElementById('preset-packs-container');
      const label = document.getElementById('preset-lang-label');
      if (!container) return;

      if (label) label.innerText = currentLang.toUpperCase();
      const packObj = LANGUAGE_PRESET_PACKS[currentLang] || LANGUAGE_PRESET_PACKS['en'];

      container.innerHTML = Object.keys(packObj).map(key => {
        const pack = packObj[key];
        return `
          <button onclick="loadPresetPack('${key}')" class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 font-bold text-xs hover:border-theme hover:text-theme-main transition shadow-sm flex items-center gap-1.5">
            ${pack.name}
          </button>
        `;
      }).join('');
    }

    function loadPresetPack(packKey) {
      const packObj = LANGUAGE_PRESET_PACKS[currentLang] || LANGUAGE_PRESET_PACKS['en'];
      const pack = packObj[packKey];
      if (!pack) return;
      buildImportPreview(pack.items);
      showToast(`📦 Đã nạp danh sách gói mẫu "${pack.name}" vào bảng xem trước!`, 'info');
    }

    function openImportModal() {
      resetImportModal();
      renderPresetPacksForCurrentLang();
      document.getElementById('import-modal').classList.remove('hidden');
    }

    function closeImportModal() {
      document.getElementById('import-modal').classList.add('hidden');
      resetImportModal();
    }

    function resetImportModal() {
      parsedImportWords = [];
      document.getElementById('file-input').value = '';
      document.getElementById('import-upload-zone').classList.remove('hidden');
      document.getElementById('import-preview-zone').classList.add('hidden');
      document.getElementById('import-reset-btn').classList.add('hidden');
      document.getElementById('import-confirm-btn').disabled = true;
      document.getElementById('import-preview-tbody').innerHTML = '';
    }

    function handleDragOver(e) {
      e.preventDefault();
      document.getElementById('dropzone').classList.add('border-theme', 'bg-theme-subtle');
    }

    function handleDragLeave(e) {
      e.preventDefault();
      document.getElementById('dropzone').classList.remove('border-theme', 'bg-theme-subtle');
    }

    function handleFileDrop(e) {
      e.preventDefault();
      handleDragLeave(e);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processUploadedFile(e.dataTransfer.files[0]);
      }
    }

    function handleFileSelect(e) {
      if (e.target.files && e.target.files.length > 0) {
        processUploadedFile(e.target.files[0]);
      }
    }

    function processUploadedFile(file) {
      const fileName = file.name.toLowerCase();
      const reader = new FileReader();

      reader.onload = function (evt) {
        const content = evt.target.result;
        try {
          if (fileName.endsWith('.json')) {
            parseJSONImport(content);
          } else {
            parseCSVorTXTImport(content);
          }
        } catch (err) {
          showToast('❌ Lỗi đọc file! Vui lòng kiểm tra lại định dạng file.', 'error');
        }
      };

      reader.readAsText(file, 'UTF-8');
    }

    function parseJSONImport(jsonText) {
      const data = JSON.parse(jsonText);
      if (!Array.isArray(data)) throw new Error('JSON array required');

      const items = data.map(item => ({
        word: (item.word || item.vocab || '').toString().trim(),
        meaning: (item.meaning || item.definition || item.nghia || '').toString().trim(),
        phonetic: (item.phonetic || item.pronunciation || item.phien_am || '').toString().trim(),
        example: (item.example || item.sentence || item.vi_du || '').toString().trim()
      })).filter(item => item.word && item.meaning);

      buildImportPreview(items);
    }

    function parseCSVorTXTImport(text) {
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length === 0) {
        showToast('File trống, không tìm thấy từ vựng!', 'warning');
        return;
      }

      const firstLine = lines[0];
      let delimiter = ',';
      if (firstLine.includes('\t')) delimiter = '\t';
      else if (firstLine.includes(';')) delimiter = ';';
      else if (firstLine.includes('|')) delimiter = '|';

      const items = [];
      let startIndex = 0;

      const firstCols = firstLine.split(delimiter).map(c => c.trim().toLowerCase());
      if (firstCols[0].includes('word') || firstCols[0].includes('từ') || firstCols[0].includes('vocab')) {
        startIndex = 1;
      }

      for (let i = startIndex; i < lines.length; i++) {
        const cols = splitCSVLine(lines[i], delimiter);
        if (cols.length >= 2) {
          const word = cols[0].trim();
          const meaning = cols[1].trim();
          const phonetic = cols[2] ? cols[2].trim() : '';
          const example = cols[3] ? cols[3].trim() : '';

          if (word && meaning) {
            items.push({ word, meaning, phonetic, example });
          }
        }
      }

      buildImportPreview(items);
    }

    function splitCSVLine(line, delimiter) {
      const result = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current);
      return result.map(s => s.replace(/^["']|["']$/g, ''));
    }

    function buildImportPreview(items) {
      if (items.length === 0) {
        showToast('Không tìm thấy từ vựng hợp lệ!', 'warning');
        return;
      }

      const existingWordsMap = new Map(
        wordsState.filter(w => w.lang === currentLang)
                  .map(w => [w.word.toLowerCase(), w])
      );

      parsedImportWords = items.map(item => {
        const isDup = existingWordsMap.has(item.word.toLowerCase());
        return {
          ...item,
          isDuplicate: isDup
        };
      });

      const dupCount = parsedImportWords.filter(w => w.isDuplicate).length;
      const newCount = parsedImportWords.length - dupCount;

      document.getElementById('preview-total-count').innerText = parsedImportWords.length;
      document.getElementById('preview-new-count').innerText = `${newCount} từ mới`;
      document.getElementById('preview-dup-count').innerText = `${dupCount} từ đã có`;

      const tbody = document.getElementById('import-preview-tbody');
      tbody.innerHTML = parsedImportWords.map(item => `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
          <td class="p-2.5">
            ${item.isDuplicate 
              ? `<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 font-bold text-[10px]">ĐÃ CÓ</span>`
              : `<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold text-[10px]">TỪ MỚI</span>`
            }
          </td>
          <td class="p-2.5 font-bold text-slate-900 dark:text-white">${escapeHTML(item.word)}</td>
          <td class="p-2.5 text-slate-700 dark:text-slate-300 font-medium">${escapeHTML(item.meaning)}</td>
          <td class="p-2.5 text-slate-400 italic">
            ${escapeHTML(item.phonetic) || '-'}
            ${item.example ? `<br><span class="text-[11px] text-slate-500">${escapeHTML(item.example)}</span>` : ''}
          </td>
        </tr>
      `).join('');

      document.getElementById('import-upload-zone').classList.add('hidden');
      document.getElementById('import-preview-zone').classList.remove('hidden');
      document.getElementById('import-reset-btn').classList.remove('hidden');
      document.getElementById('import-confirm-btn').disabled = false;
    }

    function confirmImport() {
      if (parsedImportWords.length === 0) return;

      const strategy = document.getElementById('duplicate-strategy').value;
      let addedCount = 0;
      let updatedCount = 0;

      parsedImportWords.forEach(item => {
        const existingIdx = wordsState.findIndex(w => w.lang === currentLang && w.word.toLowerCase() === item.word.toLowerCase());

        if (existingIdx !== -1) {
          if (strategy === 'overwrite') {
            wordsState[existingIdx].meaning = item.meaning;
            if (item.phonetic) wordsState[existingIdx].phonetic = item.phonetic;
            if (item.example) wordsState[existingIdx].example = item.example;
            updatedCount++;
          }
        } else {
          wordsState.unshift({
            id: (Date.now() + Math.random()).toString(),
            lang: currentLang,
            word: item.word,
            meaning: item.meaning,
            phonetic: item.phonetic || '',
            example: item.example || '',
            srsLevel: 0
          });
          addedCount++;
        }
      });

      saveState();
      closeImportModal();
      showToast(`🎉 Đã nhập thành công! (+${addedCount} từ mới, cập nhật ${updatedCount} từ)`, 'success');
      renderAllViews();
    }

    function downloadSample(type) {
      if (type === 'csv') {
        const csvContent = "\uFEFFWord,Meaning,Phonetic,Example\nPerseverance,Sự kiên trì,/ˌpɜː.sɪˈvɪə.rəns/,She showed perseverance during trials.\nInnovation,Sự đổi mới,/ˌɪn.əˈveɪ.ʃən/,Technological innovation drives progress.";
        triggerFileDownload(csvContent, 'sample_vocab.csv', 'text/csv;charset=utf-utf-8;');
      } else if (type === 'json') {
        const sampleData = [
          { word: "Perseverance", meaning: "Sự kiên trì", phonetic: "/ˌpɜː.sɪˈvɪə.rəns/", example: "She showed perseverance during trials." },
          { word: "Innovation", meaning: "Sự đổi mới", phonetic: "/ˌɪn.əˈveɪ.ʃən/", example: "Technological innovation drives progress." }
        ];
        triggerFileDownload(JSON.stringify(sampleData, null, 2), 'sample_vocab.json', 'application/json');
      }
    }

    function exportVocab(format) {
      const currentLangWords = wordsState.filter(w => w.lang === currentLang);
      if (currentLangWords.length === 0) {
        showToast('Không có từ vựng nào để xuất!', 'warning');
        return;
      }

      const filename = `vocab_${currentLang}_${new Date().toISOString().slice(0,10)}`;

      if (format === 'csv') {
        let csv = "\uFEFFWord,Meaning,Phonetic,Example,SRSLevel\n";
        currentLangWords.forEach(w => {
          const escapedWord = `"${w.word.replace(/"/g, '""')}"`;
          const escapedMeaning = `"${w.meaning.replace(/"/g, '""')}"`;
          const escapedPhonetic = `"${(w.phonetic || '').replace(/"/g, '""')}"`;
          const escapedExample = `"${(w.example || '').replace(/"/g, '""')}"`;
          csv += `${escapedWord},${escapedMeaning},${escapedPhonetic},${escapedExample},${w.srsLevel || 0}\n`;
        });
        triggerFileDownload(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
      } else if (format === 'json') {
        const exportData = currentLangWords.map(({ word, meaning, phonetic, example, srsLevel }) => ({
          word, meaning, phonetic, example, srsLevel
        }));
        triggerFileDownload(JSON.stringify(exportData, null, 2), `${filename}.json`, 'application/json');
      }

      showToast(`Đã xuất ${currentLangWords.length} từ vựng về thiết bị!`, 'success');
    }

    function triggerFileDownload(content, filename, contentType) {
      const blob = new Blob([content], { type: contentType });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = url;
      downloadAnchor.download = filename;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(url);
    }

    /* ==========================================================================
       6. FLASHCARD SRS MODE & SRS RESULT LOGIC
       ========================================================================== */
    let fcIndex = 0;
    let fcQueue = [];
    let fcInitialCount = 0;
    let isFlipped = false;
    let fcFilterMode = 'due';

    function changeFlashcardMode() {
      const select = document.getElementById('flashcard-mode-select');
      if (select) fcFilterMode = select.value;
      
      const banner = document.getElementById('flashcard-mode-banner');
      const bannerText = document.getElementById('flashcard-mode-status-text');

      if (fcFilterMode === 'due' || fcFilterMode === 'reverse') {
        if (banner) {
          banner.className = 'p-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between border bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-200';
        }
        if (bannerText) {
          bannerText.innerHTML = fcFilterMode === 'reverse' 
            ? 'Đang ở chế độ <b>Ôn Đảo Ngược</b> (Có tính điểm SRS)' 
            : 'Đang ở chế độ <b>Chính Thức SRS</b> (Có tính điểm SRS)';
        }
      } else {
        if (banner) {
          banner.className = 'p-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between border bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-800 dark:text-amber-200';
        }
        if (bannerText) {
          bannerText.innerHTML = '🎮 Chế độ <b>Ôn Luyện Thuần Túy</b> (Không làm thay đổi điểm SRS của từ vựng)';
        }
      }

      initFlashcards();
    }

    function recordSRSResult(wordObj, isCorrect) {
      if (!wordObj) return;

      // SuperMemo-2 (SM-2) Initialization safeguard
      if (wordObj.ef === undefined) wordObj.ef = 2.5;
      if (wordObj.reps === undefined) wordObj.reps = 0;
      if (wordObj.interval === undefined) wordObj.interval = 0;

      if (isCorrect) {
        wordObj.srsLevel = (wordObj.srsLevel || 0) + 1;
        wordObj.reps += 1;
        
        // SM-2 Interval Calculation
        if (wordObj.reps === 1) {
          wordObj.interval = 1;
        } else if (wordObj.reps === 2) {
          wordObj.interval = 6;
        } else {
          wordObj.interval = Math.round(wordObj.interval * wordObj.ef);
        }

        // SM-2 Easiness Factor Update (Quality = 4 for Correct)
        const q = 4;
        wordObj.ef = wordObj.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        if (wordObj.ef < 1.3) wordObj.ef = 1.3;

        // Calculate next review time (Days -> MS)
        wordObj.nextReviewTime = Date.now() + (wordObj.interval * 24 * 60 * 60 * 1000);

        wordObj.consecutiveCorrect = (wordObj.consecutiveCorrect || 0) + 1;

        if ((wordObj.forgotCount || 0) >= 3) {
          if (wordObj.consecutiveCorrect >= 3) {
            wordObj.forgotCount = 0;
            wordObj.consecutiveCorrect = 0;
            showToast(`🛡️ Đã thuộc 3 lần liên tiếp! Từ "${wordObj.word}" đã được tẩy sạch khỏi Kẻ Thù Ác!`, 'success');
          } else {
            showToast(`🔥 Đã thuộc ${wordObj.consecutiveCorrect}/3 lần liên tiếp để tẩy sạch Kẻ Thù Ác! (+1 SRS)`, 'success');
          }
        } else {
          showToast(`🎉 Đã cộng +1 điểm SRS cho "${wordObj.word}"! (Hẹn ôn sau ${wordObj.interval} ngày)`, 'success');
        }
        playSound('correct');
      } else {
        wordObj.srsLevel = 1;
        wordObj.reps = 0;
        wordObj.interval = 1; // Reset interval

        // SM-2 Easiness Factor Update (Quality = 1 for Incorrect/Forgot)
        const q = 1;
        wordObj.ef = wordObj.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        if (wordObj.ef < 1.3) wordObj.ef = 1.3;

        wordObj.nextReviewTime = Date.now() + 60000; // Review again in 1 minute
        wordObj.consecutiveCorrect = 0;
        wordObj.forgotCount = (wordObj.forgotCount || 0) + 1;

        if (wordObj.forgotCount === 3) {
          showToast(`💀 Quên từ "${wordObj.word}"! Đã vào danh sách Kẻ Thù Ác và reset về mức "Đã học".`, 'error');
        } else {
          showToast(`⚠️ Quên từ "${wordObj.word}"! Tiến độ bị reset về ôn tập ngay.`, 'warning');
        }
      }

      updateStreak();
      saveState();
      updateStats();
    }

    function initFlashcards() {
      const now = Date.now();
      const langWords = wordsState.filter(w => w.lang === currentLang);

      if (fcFilterMode === 'due' || fcFilterMode === 'reverse') {
        fcQueue = langWords.filter(w => w.srsLevel === 0 || !w.nextReviewTime || w.nextReviewTime <= now);
      } else if (fcFilterMode === 'all') {
        fcQueue = [...langWords];
      } else if (fcFilterMode === 'unlearned') {
        fcQueue = langWords.filter(w => w.srsLevel === 0);
      } else if (fcFilterMode === 'nemesis') {
        fcQueue = langWords.filter(w => (w.forgotCount || 0) >= 3);
      }

      fcInitialCount = fcQueue.length;
      fcIndex = 0;
      isFlipped = false;

      const inner = document.getElementById('flashcard-inner');
      if (inner) inner.classList.remove('rotate-y-180');

      displayFlashcard();
    }

    function displayFlashcard() {
      const counterEl = document.getElementById('flashcard-counter');
      const progressBar = document.getElementById('flashcard-progress-bar');
      const nextSrsText = document.getElementById('btn-next-srs-text');
      const prevSrsText = document.getElementById('btn-prev-srs-text');

      if (fcQueue.length === 0) {
        document.getElementById('card-srs-badge').innerHTML = '<span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 text-xs font-bold"><i class="fa-solid fa-check mr-1"></i> Hoàn thành</span>';
        document.getElementById('card-front-word').innerText = 'Hoàn thành lượt ôn!';
        document.getElementById('card-front-phonetic').innerText = 'Không còn từ vựng nào trong danh mục này.';
        document.getElementById('card-back-meaning').innerText = 'Hãy đổi chế độ ôn hoặc thêm từ mới!';
        document.getElementById('card-back-phonetic-sub').innerText = '';
        document.getElementById('card-back-example-container').classList.add('hidden');
        if (counterEl) counterEl.innerText = '0 / 0';
        if (progressBar) progressBar.style.width = '100%';
        if (nextSrsText) nextSrsText.innerText = '(+1 SRS)';
        if (prevSrsText) prevSrsText.innerText = '(Reset Cấp 1)';
        return;
      }

      if (fcIndex >= fcQueue.length) fcIndex = 0;
      const currentWord = fcQueue[fcIndex];
      if (!currentWord) return;

      isFlipped = false;
      const inner = document.getElementById('flashcard-inner');
      if (inner) {
        inner.classList.remove('rotate-y-180');
        inner.classList.remove('swipe-left', 'swipe-right');
        inner.style.transition = 'transform 0.5s ease';
      }

      document.getElementById('card-srs-badge').innerHTML = getSRSBadgeHTML(currentWord.srsLevel);

      const isRev = fcFilterMode === 'reverse';
      document.getElementById('card-front-word').innerText = isRev ? currentWord.meaning : currentWord.word;
      document.getElementById('card-front-phonetic').innerText = isRev ? '(Nghĩa Tiếng Việt)' : (currentWord.phonetic || '');
      
      document.getElementById('card-back-title').innerText = isRev ? 'Từ Vựng Ngoại Ngữ' : 'Nghĩa Tiếng Việt';
      document.getElementById('card-back-meaning').innerText = isRev ? currentWord.word : currentWord.meaning;
      document.getElementById('card-back-phonetic-sub').innerText = isRev ? (currentWord.phonetic || '') : (currentWord.phonetic || '');

      const exContainer = document.getElementById('card-back-example-container');
      const exText = document.getElementById('card-back-example-text');
      if (currentWord.example) {
        exText.innerText = currentWord.example;
        exContainer.classList.remove('hidden');
      } else {
        exContainer.classList.add('hidden');
      }

      const total = fcInitialCount || fcQueue.length;
      const remaining = fcQueue.length;
      const completed = total - remaining + 1;
      if (counterEl) counterEl.innerText = `${completed} / ${total}`;
      
      const pct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
      if (progressBar) progressBar.style.width = `${pct}%`;

      if (fcFilterMode === 'due') {
        const nextLevel = (currentWord.srsLevel || 0) + 1;
        const nextLabel = nextLevel >= 8 ? 'VIP 👑' : `Level ${nextLevel}`;
        if (nextSrsText) nextSrsText.innerText = `(+1 SRS ➔ ${nextLabel})`;
        if (prevSrsText) prevSrsText.innerText = `(Reset ➔ Level 1)`;
      } else if (fcFilterMode === 'reverse') {
        if (nextSrsText) nextSrsText.innerText = `(Nhớ nghĩa ➔ +1 SRS)`;
        if (prevSrsText) prevSrsText.innerText = `(Quên ➔ Reset)`;
      } else {
        if (nextSrsText) nextSrsText.innerText = `(Chế độ Ôn Luyện - Không tác động SRS)`;
        if (prevSrsText) prevSrsText.innerText = `(Chế độ Ôn Luyện - Không tác động SRS)`;
      }
    }

    function flipFlashcard() {
      if (fcQueue.length === 0) return;
      isFlipped = !isFlipped;
      const inner = document.getElementById('flashcard-inner');
      if (isFlipped) {
        inner.classList.add('rotate-y-180');
        if (autoTTS) speakCurrentFlashcard();
      } else {
        inner.classList.remove('rotate-y-180');
      }
    }

    function evaluateFlashcard(remembered) {
      if (fcQueue.length === 0) return;
      const currentWord = fcQueue[fcIndex];
      const inner = document.getElementById('flashcard-inner');

      // Swipe animation handling
      if (inner) {
        inner.style.transition = 'all 0.3s ease-out';
        if (remembered) {
          inner.classList.add('swipe-right');
        } else {
          inner.classList.add('swipe-left');
        }
      }

      setTimeout(() => {
        if (fcFilterMode === 'due' || fcFilterMode === 'reverse') {
          if (remembered) {
            recordSRSResult(currentWord, true);
            fcQueue.splice(fcIndex, 1);
            if (fcIndex >= fcQueue.length) fcIndex = 0;
          } else {
            recordSRSResult(currentWord, false);
            const [movedWord] = fcQueue.splice(fcIndex, 1);
            fcQueue.push(movedWord);
            if (fcIndex >= fcQueue.length) fcIndex = 0;
          }
        } else {
          if (remembered) {
            showToast(`🎯 Thuộc từ "${currentWord.word}" (Ôn luyện - Không đổi SRS)`, 'info');
            playSound('correct');
            fcQueue.splice(fcIndex, 1);
            if (fcIndex >= fcQueue.length) fcIndex = 0;
          } else {
            showToast(`💡 Chưa nhớ từ "${currentWord.word}" (Ôn luyện - Không đổi SRS)`, 'info');
            const [movedWord] = fcQueue.splice(fcIndex, 1);
            fcQueue.push(movedWord);
            if (fcIndex >= fcQueue.length) fcIndex = 0;
          }
        }
        displayFlashcard();
      }, 250); // wait for animation
    }

    /* Swipe Gesture Events */
    let touchStartX = 0;
    let touchEndX = 0;
    
    const fcContainer = document.getElementById('flashcard-container');
    if (fcContainer) {
      fcContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, {passive: true});

      fcContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
      }, {passive: true});
    }

    function handleSwipeGesture() {
      if (fcQueue.length === 0 || !isFlipped) return; // Only allow swipe when card is flipped (review phase)
      
      const swipeThreshold = 50;
      const swipeDistance = touchEndX - touchStartX;
      
      if (swipeDistance > swipeThreshold) {
        evaluateFlashcard(true);  // Swipe Right = Remembered
      } else if (swipeDistance < -swipeThreshold) {
        evaluateFlashcard(false); // Swipe Left = Forgot
      }
    }

    document.addEventListener('keydown', (e) => {
      if (currentTab !== 'flashcards') return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        flipFlashcard();
      } else if (e.code === 'ArrowLeft' || e.key === '1') {
        e.preventDefault();
        evaluateFlashcard(false);
      } else if (e.code === 'ArrowRight' || e.key === '2' || e.code === 'Enter') {
        e.preventDefault();
        evaluateFlashcard(true);
      } else if (e.code === 'KeyS' || e.code === 'KeyA') {
        e.preventDefault();
        speakCurrentFlashcard();
      }
    });

    /* ==========================================================================
       7. ASTEROID DESTROYER GAME ENGINE (SMART FUZZY MATCH & GEMINI AI)
       ========================================================================== */
    let gameRunning = false;
    let gamePaused = false;
    let score = 0;
    let combo = 1;
    let hp = 3;
    let difficulty = 'medium';
    let gameFrequency = 1;
    let gameMode = 'chaos';
    let asteroids = [];
    let lasers = [];
    let particles = [];
    let spawnTimer = 0;
    let animationFrameId = null;
    let turretAngle = -Math.PI / 2;
    let isAIChecking = false;

    function getGamePool() {
      const langWords = wordsState.filter(w => w.lang === currentLang);
      if (gameMode === 'selected') {
        return langWords.filter(w => selectedWordIds.has(w.id));
      } else if (gameMode === 'unlearned') {
        return langWords.filter(w => w.srsLevel === 0);
      } else if (gameMode === 'nemesis') {
        return langWords.filter(w => (w.forgotCount || 0) >= 3);
      } else if (gameMode === 'wonderland') {
        return langWords.filter(w => w.srsLevel >= 8);
      }
      return langWords;
    }

    function updateGameHUD() {
      const hpEl = document.getElementById('game-hp-display');
      const scoreEl = document.getElementById('game-score-display');
      const comboEl = document.getElementById('game-combo-display');

      if (hpEl) hpEl.innerText = '❤️'.repeat(Math.max(0, hp)) || '💀';
      if (scoreEl) scoreEl.innerText = score;
      if (comboEl) comboEl.innerText = `x${combo}`;
    }

    function changeGameMode() {
      const select = document.getElementById('game-mode-select');
      if (select) gameMode = select.value;
      resetGameUI();
    }

    function changeGameDifficulty() {
      const select = document.getElementById('game-difficulty-select');
      if (select) difficulty = select.value;
    }

    function changeGameFrequency() {
      const input = document.getElementById('game-frequency-input');
      if (!input) return;
      const value = Number(input.value);
      if (!Number.isSafeInteger(value) || value < 1) {
        input.value = gameFrequency.toString();
        showToast('Số lượng mỗi đợt phải là số nguyên lớn hơn 0.', 'warning');
        return;
      }
      gameFrequency = value;
    }

    function togglePauseGame() {
      if (!gameRunning) return;
      gamePaused = !gamePaused;
      const btn = document.getElementById('game-pause-btn');
      if (btn) {
        btn.innerHTML = gamePaused 
          ? '<i class="fa-solid fa-play mr-1"></i> Tiếp tục' 
          : '<i class="fa-solid fa-pause mr-1"></i> Tạm dừng';
      }
      if (!gamePaused) {
        gameLoop();
      }
    }

    function startGame() {
      const pool = getGamePool();
      if (pool.length === 0) {
        const modeNames = {
          chaos: 'Chưa có từ vựng nào',
          unlearned: 'Không có từ chưa học nào',
          nemesis: 'Không có từ Kẻ Thù Ác nào',
          wonderland: 'Không có từ VIP nào',
          selected: 'Chưa có từ nào được chọn cho ngôn ngữ hiện tại'
        };
        showToast(`⚠️ ${modeNames[gameMode] || 'Danh sách rỗng'}! Hãy thêm từ vựng hoặc đổi chế độ chơi.`, 'warning');
        return;
      }

      const gameView = document.getElementById('view-game');
      if (gameView) {
        gameView.classList.remove('hidden');
        gameView.classList.add('game-fullscreen');
      }
      document.getElementById('game-stats')?.classList.remove('hidden');
      document.getElementById('game-input-form')?.classList.remove('hidden');
      document.getElementById('game-pause-btn')?.classList.remove('hidden');
      document.getElementById('game-exit-btn')?.classList.remove('hidden');

      gameRunning = true;
      gamePaused = false;
      score = 0;
      combo = 1;
      hp = 3;
      asteroids = [];
      lasers = [];
      particles = [];
      spawnTimer = 0;

      const pauseBtn = document.getElementById('game-pause-btn');
      if (pauseBtn) pauseBtn.innerHTML = '<i class="fa-solid fa-pause mr-1"></i> Tạm dừng';

      const modal = document.getElementById('game-modal-overlay');
      if (modal) modal.classList.add('hidden');

      const input = document.getElementById('game-input');
      if (input) {
        input.value = '';
        input.focus();
      }

      updateGameHUD();
      resizeCanvas();
      refreshGameAccent();
      gameShake = 0; gameFlash = 0;

      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(gameLoop);
    }

    function exitGameFullscreen() {
      resetGameUI();
      document.getElementById('view-game')?.classList.remove('game-fullscreen');
      resizeCanvas();
    }

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && document.getElementById('view-game')?.classList.contains('game-fullscreen')) {
        exitGameFullscreen();
      }
    });

    function normalizeText(str) {
      if (!str) return '';
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'd')
        .replace(/[^a-z0-9]/g, '')
        .trim();
    }

    function levenshteinDistance(a, b) {
      const matrix = [];
      for (let i = 0; i <= b.length; i++) matrix[i] = [i];
      for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
            );
          }
        }
      }
      return matrix[b.length][a.length];
    }

    function isFuzzyMatch(userInput, targetMeaning) {
      const u = normalizeText(userInput);
      const t = normalizeText(targetMeaning);
      if (!u || !t) return false;

      if (u === t || t.includes(u) || u.includes(t)) return true;

      const dist = levenshteinDistance(u, t);
      const maxLen = Math.max(u.length, t.length);
      const similarity = 1 - dist / maxLen;
      return similarity >= 0.75;
    }

    async function checkAISynonymMatch(userInput, targetAsteroids, answerLanguage = 'Vietnamese') {
      if (!targetAsteroids || targetAsteroids.length === 0) return -1;

      if (!geminiApiKey) {
        for (let idx = 0; idx < targetAsteroids.length; idx++) {
          if (isFuzzyMatch(userInput, targetAsteroids[idx].wordObj.meaning)) {
            return idx;
          }
        }
        return -1;
      }

      const candidates = targetAsteroids.map((ast, idx) => 
        `Index ${idx}: Target Word "${ast.wordObj.word}" -> Meaning "${ast.wordObj.meaning}"`
      ).join('\n');

      const systemPrompt = `You are a vocabulary quiz evaluator. The player typed an answer in ${answerLanguage}: "${userInput}".
Check if this answer is correct for any target below. Accept valid synonyms and equivalent phrasing:
${candidates}
Return JSON: {"matchedIndex": number}`;

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${geminiApiKey}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Player answer: "${userInput}"` }] }],
            generationConfig: { responseMimeType: "application/json" },
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        });

        const result = await response.json();
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const data = JSON.parse(text);
          return Number.isInteger(data.matchedIndex) && data.matchedIndex >= 0 && data.matchedIndex < targetAsteroids.length
            ? data.matchedIndex
            : -1;
        }
      } catch (err) {
        console.error("Gemini AI API error:", err);
      }

      for (let idx = 0; idx < targetAsteroids.length; idx++) {
        if (isFuzzyMatch(userInput, targetAsteroids[idx].wordObj.meaning)) {
          return idx;
        }
      }
      return -1;
    }

    let gameDpr = 1, gameAccent = '#38bdf8', gameBgCache = null, gameShake = 0, gameFlash = 0, gameFrame = 0;
    function gW() { const c = document.getElementById('game-canvas'); return c ? c.width / gameDpr : 800; }
    function gH() { const c = document.getElementById('game-canvas'); return c ? c.height / gameDpr : 450; }
    function resizeCanvas() {
      const canvasEl = document.getElementById('game-canvas');
      const containerEl = document.getElementById('game-canvas-container');
      if (!canvasEl || !containerEl) return;
      const rect = containerEl.getBoundingClientRect();
      gameDpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height || 450));
      canvasEl.width = Math.round(w * gameDpr);
      canvasEl.height = Math.round(h * gameDpr);
      gameBgCache = null;
    }
    window.addEventListener('resize', () => {
      resizeCanvas();
      updateLangIndicator(currentLang);
    });

    /* ---------- HD canvas helpers ---------- */
    const TAU = Math.PI * 2;
    const GAME_FONT = '"Plus Jakarta Sans","Noto Sans KR","Noto Sans JP","Noto Sans SC",system-ui,sans-serif';

    function hexToRgb(hex) {
      let h = String(hex || '').trim().replace('#', '');
      if (h.length === 3) h = h.split('').map(c => c + c).join('');
      if (!/^[0-9a-fA-F]{6}$/.test(h)) return { r: 56, g: 189, b: 248 };
      return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
    }
    function rgba(hex, a) {
      const c = hexToRgb(hex);
      return `rgba(${c.r},${c.g},${c.b},${a})`;
    }
    function refreshGameAccent() {
      const v = getComputedStyle(document.body).getPropertyValue('--gradient-start').trim();
      gameAccent = v || '#38bdf8';
      gameBgCache = null;
    }

    const GAME_STARS = Array.from({ length: 90 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.3 + 0.3,
      s: Math.random() * 0.00035 + 0.00008,
      p: Math.random() * TAU
    }));

    function buildGameBackdrop(W, H) {
      const c = document.createElement('canvas');
      c.width = Math.ceil(W * gameDpr);
      c.height = Math.ceil(H * gameDpr);
      const g = c.getContext('2d');
      g.scale(gameDpr, gameDpr);

      const sky = g.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#04061a');
      sky.addColorStop(0.55, '#0a0f2e');
      sky.addColorStop(1, '#170f38');
      g.fillStyle = sky;
      g.fillRect(0, 0, W, H);

      const blobs = [
        { x: 0.18, y: 0.28, r: 0.55, a: 0.30, c: gameAccent },
        { x: 0.82, y: 0.18, r: 0.50, a: 0.20, c: '#a78bfa' },
        { x: 0.55, y: 0.62, r: 0.62, a: 0.14, c: '#38bdf8' }
      ];
      blobs.forEach(b => {
        const rad = Math.max(W, H) * b.r;
        const gr = g.createRadialGradient(b.x * W, b.y * H, 0, b.x * W, b.y * H, rad);
        gr.addColorStop(0, rgba(b.c, b.a));
        gr.addColorStop(1, rgba(b.c, 0));
        g.fillStyle = gr;
        g.fillRect(0, 0, W, H);
      });

      const hz = g.createRadialGradient(W / 2, H + 40, 10, W / 2, H + 40, Math.max(W * 0.65, 260));
      hz.addColorStop(0, rgba(gameAccent, 0.38));
      hz.addColorStop(0.45, rgba(gameAccent, 0.10));
      hz.addColorStop(1, rgba(gameAccent, 0));
      g.fillStyle = hz;
      g.fillRect(0, 0, W, H);

      const vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.8);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,8,0.55)');
      g.fillStyle = vg;
      g.fillRect(0, 0, W, H);
      return c;
    }

    function drawGameBackdrop(ctx, W, H) {
      if (!gameBgCache || gameBgCache._w !== W || gameBgCache._h !== H) {
        gameBgCache = buildGameBackdrop(W, H);
        gameBgCache._w = W;
        gameBgCache._h = H;
      }
      ctx.drawImage(gameBgCache, -24, -24, W + 48, H + 48);

      const t = gameFrame * 0.03;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < GAME_STARS.length; i++) {
        const s = GAME_STARS[i];
        s.y += s.s * 16;
        if (s.y > 1) { s.y = 0; s.x = Math.random(); }
        const tw = 0.55 + 0.45 * Math.sin(t * (1 + s.r) + s.p);
        ctx.globalAlpha = tw * (0.35 + s.r * 0.35);
        ctx.fillStyle = s.r > 1.2 ? '#dbeafe' : '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawTurret(ctx, cx, cy, angle) {
      const pulse = 0.65 + 0.35 * Math.sin(gameFrame * 0.08);

      // ánh sáng nền đế
      const halo = ctx.createRadialGradient(cx, cy + 8, 6, cx, cy + 8, 90);
      halo.addColorStop(0, rgba(gameAccent, 0.45 * pulse));
      halo.addColorStop(1, rgba(gameAccent, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy + 8, 90, 0, TAU);
      ctx.fill();

      // nòng súng
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const barrel = ctx.createLinearGradient(-12, 0, 12, 0);
      barrel.addColorStop(0, '#1e293b');
      barrel.addColorStop(0.35, '#94a3b8');
      barrel.addColorStop(0.55, '#e2e8f0');
      barrel.addColorStop(1, '#334155');
      ctx.fillStyle = barrel;
      ctx.beginPath();
      ctx.roundRect(-10, -42, 20, 42, 5);
      ctx.fill();
      ctx.strokeStyle = rgba(gameAccent, 0.9);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // vòng năng lượng đầu nòng
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(-13, -48, 26, 9, 4);
      ctx.fill();
      ctx.strokeStyle = gameAccent;
      ctx.lineWidth = 2;
      ctx.stroke();
      const muzzle = ctx.createRadialGradient(0, -48, 0, 0, -48, 16);
      muzzle.addColorStop(0, `rgba(255,255,255,${0.85 * pulse})`);
      muzzle.addColorStop(1, rgba(gameAccent, 0));
      ctx.fillStyle = muzzle;
      ctx.beginPath();
      ctx.arc(0, -48, 16, 0, TAU);
      ctx.fill();
      ctx.restore();

      // đế
      const base = ctx.createLinearGradient(0, cy - 22, 0, cy + 36);
      base.addColorStop(0, '#334155');
      base.addColorStop(0.5, '#111a33');
      base.addColorStop(1, '#070b1c');
      ctx.fillStyle = base;
      ctx.beginPath();
      ctx.arc(cx, cy + 10, 34, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = rgba(gameAccent, 0.85);
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // lõi
      const core = ctx.createRadialGradient(cx - 3, cy + 2, 1, cx, cy + 5, 14);
      core.addColorStop(0, '#ffffff');
      core.addColorStop(0.35, gameAccent);
      core.addColorStop(1, rgba(gameAccent, 0.15));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy + 5, 12 + pulse * 1.5, 0, TAU);
      ctx.fill();
    }

    /* ---------- Thực thể ---------- */
    class Asteroid {
      constructor(wordObj) {
        const canvasEl = document.getElementById('game-canvas');
        const cWidth = canvasEl ? gW() : 800;
        this.wordObj = wordObj;
        this.radius = Math.max(35, Math.min(65, wordObj.word.length * 6 + 20));
        this.x = Math.random() * (cWidth - this.radius * 2) + this.radius;
        this.y = -this.radius;

        let baseSpeed = difficulty === 'easy' ? 0.6 : difficulty === 'medium' ? 1.0 : 1.6;
        this.speed = baseSpeed + Math.random() * 0.4;
        this.rotation = 0;
        this.rotSpeed = (Math.random() - 0.5) * 0.03;

        this.vertices = [];
        const numVerts = 10;
        for (let i = 0; i < numVerts; i++) {
          const angle = (i / numVerts) * TAU;
          const dist = this.radius * (0.82 + Math.random() * 0.3);
          this.vertices.push({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist });
        }
        this.craters = Array.from({ length: 4 }, () => {
          const a = Math.random() * TAU, d = Math.random() * this.radius * 0.55;
          return { x: Math.cos(a) * d, y: Math.sin(a) * d, r: this.radius * (0.1 + Math.random() * 0.14) };
        });
        this.hue = Math.random() * 30 - 15;
      }

      update() {
        this.y += this.speed;
        this.rotation += this.rotSpeed;
      }

      draw(ctx) {
        if (!ctx) return;
        const r = this.radius;
        const danger = Math.max(0, Math.min(1, (this.y - gH() * 0.62) / (gH() * 0.3)));
        const rim = danger > 0.05 ? `rgba(${Math.round(56 + 190 * danger)},${Math.round(189 - 110 * danger)},${Math.round(248 - 170 * danger)},0.95)` : rgba(gameAccent, 0.95);

        ctx.save();
        ctx.translate(this.x, this.y);

        // đuôi sáng phía trên
        const tail = ctx.createLinearGradient(0, -r * 0.3, 0, -r * 2.8);
        tail.addColorStop(0, rgba(gameAccent, 0.32));
        tail.addColorStop(1, rgba(gameAccent, 0));
        ctx.fillStyle = tail;
        ctx.beginPath();
        ctx.moveTo(-r * 0.75, -r * 0.2);
        ctx.lineTo(r * 0.75, -r * 0.2);
        ctx.lineTo(0, -r * 2.8);
        ctx.closePath();
        ctx.fill();

        // quầng sáng
        const glow = ctx.createRadialGradient(0, 0, r * 0.55, 0, 0, r * 1.9);
        glow.addColorStop(0, danger > 0.05 ? `rgba(244,63,94,${0.22 + 0.2 * danger})` : rgba(gameAccent, 0.24));
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.9, 0, TAU);
        ctx.fill();

        // thân đá (đường cong mượt)
        ctx.save();
        ctx.rotate(this.rotation);
        const v = this.vertices, n = v.length;
        const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
        const m0 = mid(v[n - 1], v[0]);
        ctx.beginPath();
        ctx.moveTo(m0.x, m0.y);
        for (let i = 0; i < n; i++) {
          const m = mid(v[i], v[(i + 1) % n]);
          ctx.quadraticCurveTo(v[i].x, v[i].y, m.x, m.y);
        }
        ctx.closePath();

        const body = ctx.createRadialGradient(-r * 0.4, -r * 0.45, r * 0.1, 0, 0, r * 1.2);
        body.addColorStop(0, `hsl(${222 + this.hue},22%,58%)`);
        body.addColorStop(0.5, `hsl(${224 + this.hue},28%,30%)`);
        body.addColorStop(1, `hsl(${230 + this.hue},40%,12%)`);
        ctx.fillStyle = body;
        ctx.fill();

        ctx.save();
        ctx.clip();
        this.craters.forEach(c => {
          ctx.fillStyle = 'rgba(8,12,30,0.42)';
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, TAU);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.14)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(c.x - 1, c.y - 1, c.r, Math.PI * 0.95, Math.PI * 1.75);
          ctx.stroke();
        });
        // bóng đổ phía dưới phải
        const shade = ctx.createLinearGradient(-r, -r, r, r);
        shade.addColorStop(0.45, 'rgba(0,0,0,0)');
        shade.addColorStop(1, 'rgba(2,4,16,0.55)');
        ctx.fillStyle = shade;
        ctx.fillRect(-r * 1.4, -r * 1.4, r * 2.8, r * 2.8);
        ctx.restore();

        ctx.strokeStyle = rim;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
        ctx.restore();

        // nhãn từ
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `700 15px ${GAME_FONT}`;
        const textWidth = ctx.measureText(this.wordObj.word).width;
        const bw = textWidth + 22, bh = 26;
        const bx = this.x - bw / 2, by = this.y - bh / 2;

        ctx.shadowColor = 'rgba(0,0,0,0.45)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;
        const pill = ctx.createLinearGradient(0, by, 0, by + bh);
        pill.addColorStop(0, 'rgba(22,30,64,0.92)');
        pill.addColorStop(1, 'rgba(8,12,34,0.92)');
        ctx.fillStyle = pill;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 13);
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = danger > 0.05 ? 'rgba(251,113,133,0.85)' : rgba(gameAccent, 0.7);
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.fillText(this.wordObj.word, this.x, this.y + 0.5);

        if (this.wordObj.phonetic) {
          ctx.font = `500 11px ${GAME_FONT}`;
          ctx.fillStyle = 'rgba(203,213,225,0.9)';
          ctx.fillText(this.wordObj.phonetic, this.x, this.y + bh / 2 + 11);
        }
        ctx.restore();
      }
    }

    class Laser {
      constructor(startX, startY, targetX, targetY) {
        this.startX = startX;
        this.startY = startY;
        this.x = startX;
        this.y = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.progress = 0;
        this.speed = 0.15;
      }

      update() {
        this.progress += this.speed;
        this.x = this.startX + (this.targetX - this.startX) * this.progress;
        this.y = this.startY + (this.targetY - this.startY) * this.progress;
      }

      draw(ctx) {
        if (!ctx) return;
        const fade = Math.max(0, 1 - this.progress * 0.6);
        // đuôi tia = đoạn cuối, đầu tia sáng nhất
        const tx = this.x - (this.x - this.startX) * 0.55;
        const ty = this.y - (this.y - this.startY) * 0.55;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        const grad = ctx.createLinearGradient(tx, ty, this.x, this.y);
        grad.addColorStop(0, rgba(gameAccent, 0));
        grad.addColorStop(1, rgba(gameAccent, 0.9 * fade));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 12;
        ctx.globalAlpha = 0.35;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(this.x, this.y); ctx.stroke();
        ctx.globalAlpha = 0.9;
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(this.x, this.y); ctx.stroke();
        const core = ctx.createLinearGradient(tx, ty, this.x, this.y);
        core.addColorStop(0, 'rgba(255,255,255,0)');
        core.addColorStop(1, `rgba(255,255,255,${fade})`);
        ctx.strokeStyle = core;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(this.x, this.y); ctx.stroke();

        const head = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 18);
        head.addColorStop(0, `rgba(255,255,255,${fade})`);
        head.addColorStop(0.4, rgba(gameAccent, 0.6 * fade));
        head.addColorStop(1, rgba(gameAccent, 0));
        ctx.fillStyle = head;
        ctx.beginPath(); ctx.arc(this.x, this.y, 18, 0, TAU); ctx.fill();
        ctx.restore();
      }
    }

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * TAU;
        const speed = Math.random() * 5 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.size = Math.random() * 3.5 + 1.8;
        this.color = ['#fbbf24', '#fb7185', '#67e8f9', '#ffffff', '#c4b5fd'][Math.floor(Math.random() * 5)];
      }

      update() {
        this.vx *= 0.97;
        this.vy = this.vy * 0.97 + 0.05;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.024;
      }

      draw(ctx) {
        if (!ctx) return;
        const a = Math.max(0, this.alpha);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        g.addColorStop(0, this.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = a * 0.55;
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size * 3, 0, TAU); ctx.fill();
        ctx.globalAlpha = a;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size * 0.55 * a + 0.4, 0, TAU); ctx.fill();
        ctx.restore();
      }
    }

    class Shockwave {
      constructor(x, y) { this.x = x; this.y = y; this.r = 8; this.alpha = 1; }
      update() { this.r += (92 - this.r) * 0.14; this.alpha -= 0.045; }
      draw(ctx) {
        const a = Math.max(0, this.alpha);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = a;
        ctx.strokeStyle = rgba(gameAccent, 0.95);
        ctx.lineWidth = 1 + 5 * a;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, TAU); ctx.stroke();
        const fl = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
        fl.addColorStop(0, 'rgba(255,255,255,0.55)');
        fl.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = fl;
        ctx.globalAlpha = a * 0.6;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, TAU); ctx.fill();
        ctx.restore();
      }
    }

    class FloatText {
      constructor(x, y, text) { this.x = x; this.y = y; this.text = text; this.alpha = 1.35; }
      update() { this.y -= 0.9; this.alpha -= 0.02; }
      draw(ctx) {
        const a = Math.max(0, Math.min(1, this.alpha));
        ctx.save();
        ctx.globalAlpha = a;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `800 20px ${GAME_FONT}`;
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(8,12,34,0.85)';
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillStyle = '#fde68a';
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
      }
    }

    function fireTurretAtAsteroid(hitIndex, isAISynonym = false) {
      if (hitIndex < 0 || hitIndex >= asteroids.length) return;

      const hitAsteroid = asteroids[hitIndex];
      const canvasEl = document.getElementById('game-canvas');
      const cWidth = canvasEl ? gW() : 800;
      const cHeight = canvasEl ? gH() : 450;

      const cannonX = cWidth / 2;
      const cannonY = cHeight - 15;

      turretAngle = Math.atan2(hitAsteroid.y - cannonY, hitAsteroid.x - cannonX);

      const barrelLength = 40;
      const muzzleX = cannonX + Math.cos(turretAngle) * barrelLength;
      const muzzleY = cannonY + Math.sin(turretAngle) * barrelLength;

      lasers.push(new Laser(muzzleX, muzzleY, hitAsteroid.x, hitAsteroid.y));
      playSound('laser');

      for (let i = 0; i < 8; i++) {
        particles.push(new Particle(muzzleX, muzzleY));
      }

      setTimeout(() => {
        for (let p = 0; p < 34; p++) {
          particles.push(new Particle(hitAsteroid.x, hitAsteroid.y));
        }
        particles.push(new Shockwave(hitAsteroid.x, hitAsteroid.y));
        particles.push(new FloatText(hitAsteroid.x, hitAsteroid.y - hitAsteroid.radius * 0.6, '+' + (100 * combo) + (combo > 1 ? ' x' + combo : '')));
        playSound('explode');

        score += 100 * combo;
        combo = Math.min(10, combo + 1);
        updateGameHUD();

        if (isAISynonym) {
          showToast(`🎯 Chấp nhận nghĩa đồng nghĩa: "${hitAsteroid.wordObj.word}" ≈ "${hitAsteroid.wordObj.meaning}"!`, 'success');
        }

        asteroids.splice(hitIndex, 1);
      }, 100);
    }

    async function handleGameFire(event) {
      event.preventDefault();
      if (!gameRunning || gamePaused || isAIChecking) return;

      const inputEl = document.getElementById('game-input');
      if (!inputEl) return;
      const rawVal = inputEl.value.trim();
      const normInput = normalizeText(rawVal);
      if (!normInput) return;

      let hitIndex = -1;

      for (let i = 0; i < asteroids.length; i++) {
        const normMeaning = normalizeText(asteroids[i].wordObj.meaning);
        const normWord = normalizeText(asteroids[i].wordObj.word);

        if (normInput === normMeaning || normInput === normWord) {
          hitIndex = i;
          break;
        }
      }

      if (hitIndex !== -1) {
        fireTurretAtAsteroid(hitIndex, false);
        inputEl.value = '';
      } else if (asteroids.length > 0) {
        isAIChecking = true;
        const aiBadge = document.getElementById('ai-checking-badge');
        if (aiBadge) aiBadge.classList.remove('hidden');

        const aiHitIndex = await checkAISynonymMatch(rawVal, asteroids);

        if (aiBadge) aiBadge.classList.add('hidden');
        isAIChecking = false;

        if (aiHitIndex >= 0 && aiHitIndex < asteroids.length) {
          fireTurretAtAsteroid(aiHitIndex, true);
          inputEl.value = '';
        } else {
          combo = 1;
          updateGameHUD();
          showToast(`❌ Nghĩa "${rawVal}" chưa chính xác!`, 'warning');
        }
      } else {
        combo = 1;
        updateGameHUD();
      }
    }

    function gameLoop() {
      if (!gameRunning || gamePaused) return;

      const canvasEl = document.getElementById('game-canvas');
      if (!canvasEl) return;
      const ctx = canvasEl.getContext('2d');
      if (!ctx) return;

      gameFrame++;
      const W = gW(), H = gH();
      ctx.setTransform(gameDpr, 0, 0, gameDpr, 0, 0);
      if (gameShake > 0.4) {
        ctx.translate((Math.random() - 0.5) * gameShake, (Math.random() - 0.5) * gameShake);
        gameShake *= 0.86;
      } else {
        gameShake = 0;
      }
      drawGameBackdrop(ctx, W, H);

      if (!isAIChecking) {
        spawnTimer++;
      }

      let baseInterval = difficulty === 'easy' ? 180 : difficulty === 'medium' ? 120 : 80;
      
      if (gameMode === 'wonderland') {
        baseInterval = Math.max(35, Math.floor(baseInterval / 2));
      }

      if (spawnTimer >= baseInterval) {
        spawnTimer = 0;
        const activePool = getGamePool();
        if (activePool.length > 0) {
          const waveWords = [...activePool];
          const spawnCount = Math.min(gameFrequency, waveWords.length);
          for (let i = 0; i < spawnCount; i++) {
            const randomIndex = Math.floor(Math.random() * waveWords.length);
            asteroids.push(new Asteroid(waveWords.splice(randomIndex, 1)[0]));
          }
        }
      }

      for (let i = asteroids.length - 1; i >= 0; i--) {
        const ast = asteroids[i];
        
        if (!isAIChecking) {
          ast.update();
        }
        
        ast.draw(ctx);

        if (ast.y - ast.radius > H) {
          asteroids.splice(i, 1);
          hp--;
          combo = 1;
          gameShake = 16;
          gameFlash = 1;
          playSound('hit');
          updateGameHUD();

          if (hp <= 0) {
            endGame();
            return;
          }
        }
      }

      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        l.update();
        l.draw(ctx);
        if (l.progress >= 1) lasers.splice(i, 1);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) particles.splice(i, 1);
      }

      const cannonX = W / 2;
      const cannonY = H - 15;

      drawTurret(ctx, cannonX, cannonY, turretAngle);

      if (gameFlash > 0.02) {
        const fl = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.max(W, H) * 0.75);
        fl.addColorStop(0, 'rgba(244,63,94,0)');
        fl.addColorStop(1, `rgba(244,63,94,${0.45 * gameFlash})`);
        ctx.fillStyle = fl;
        ctx.fillRect(-24, -24, W + 48, H + 48);
        gameFlash *= 0.9;
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    function endGame() {
      gameRunning = false;
      gamePaused = false;
      document.getElementById('game-stats')?.classList.add('hidden');
      document.getElementById('game-input-form')?.classList.add('hidden');
      document.getElementById('game-pause-btn')?.classList.add('hidden');
      document.getElementById('game-exit-btn')?.classList.add('hidden');
      const modal = document.getElementById('game-modal-overlay');
      const icon = document.getElementById('game-modal-icon');
      const title = document.getElementById('game-modal-title');
      const desc = document.getElementById('game-modal-desc');

      if (icon) icon.innerHTML = '<i class="fa-solid fa-skull text-rose-500"></i>';
      if (title) title.innerText = 'GAME OVER!';
      if (desc) {
        desc.innerHTML = `
          Bạn đã đạt tổng điểm: <b class="text-amber-400 text-lg">${score}</b>!<br>
          Game giúp bạn luyện tập phản xạ thuộc từ mượt mà hơn.
        `;
      }
      if (modal) modal.classList.remove('hidden');
    }

    /* ==========================================================================
       8. KOREAN VIRTUAL KEYBOARD, PINYIN TOOL & HANDWRITING ENGINE
       ========================================================================== */
    const KO_CONSONANTS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const KO_VOWELS = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    const PINYIN_TONES = ['ā', 'á', 'ǎ', 'à', 'ē', 'é', 'ě', 'è', 'ī', 'í', 'ǐ', 'ì', 'ō', 'ó', 'ǒ', 'ò', 'ū', 'ú', 'ǔ', 'ù', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'];

    function initSpecialKeyboards() {
      const koCons = document.getElementById('ko-consonants-list');
      const koVows = document.getElementById('ko-vowels-list');
      const pinList = document.getElementById('pinyin-tones-list');

      if (koCons) {
        koCons.innerHTML = KO_CONSONANTS.map(char => 
          `<button type="button" onclick="insertCharToWordInput('${char}')" class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold hover:bg-pink-500 hover:text-white transition text-xs flex items-center justify-center">${char}</button>`
        ).join('');
      }

      if (koVows) {
        koVows.innerHTML = KO_VOWELS.map(char => 
          `<button type="button" onclick="insertCharToWordInput('${char}')" class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold hover:bg-pink-500 hover:text-white transition text-xs flex items-center justify-center">${char}</button>`
        ).join('');
      }

      if (pinList) {
        pinList.innerHTML = PINYIN_TONES.map(char => 
          `<button type="button" onclick="insertCharToPhoneticInput('${char}')" class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold hover:bg-red-500 hover:text-white transition text-xs flex items-center justify-center">${char}</button>`
        ).join('');
      }
    }

    function toggleKoreanKeyboard() {
      const kb = document.getElementById('korean-keyboard');
      if (kb) kb.classList.toggle('hidden');
    }
    function hideKoreanKeyboard() {
      const kb = document.getElementById('korean-keyboard');
      if (kb) kb.classList.add('hidden');
    }

    function togglePinyinKeyboard() {
      const kb = document.getElementById('pinyin-keyboard');
      if (kb) kb.classList.toggle('hidden');
    }
    function hidePinyinKeyboard() {
      const kb = document.getElementById('pinyin-keyboard');
      if (kb) kb.classList.add('hidden');
    }

    function insertTextAtSelection(input, text) {
      if (!input) return;
      const start = input.selectionStart || input.value.length;
      const end = input.selectionEnd || input.value.length;
      input.value = input.value.substring(0, start) + text + input.value.substring(end);
      input.selectionStart = input.selectionEnd = start + text.length;
      input.focus();
    }

    function insertCharToWordInput(char) {
      insertTextAtSelection(document.getElementById('input-word'), char);
    }

    function insertCharToPhoneticInput(char) {
      const input = document.getElementById('input-phonetic');
      if (!input) return;
      const start = input.selectionStart || input.value.length;
      const end = input.selectionEnd || input.value.length;
      input.value = input.value.substring(0, start) + char + input.value.substring(end);
      input.selectionStart = input.selectionEnd = start + char.length;
      input.focus();
    }

    /* Canvas Handwriting Engine */
    let hwLang = 'zh';
    let isDrawingHW = false;
    let hwStrokes = [];
    let currentStroke = { x: [], y: [], t: [] };
    let hwTargetInputId = 'input-word';

    function openHandwritingModal(lang, targetInputId = 'input-word') {
      hwLang = lang;
      hwTargetInputId = targetInputId;
      const modal = document.getElementById('handwriting-modal');
      const title = document.getElementById('hw-title');

      if (title) {
        title.innerText = lang === 'zh' ? 'Bàn Phím Viết Tay Hán Tự (Tiếng Trung)' :
                          lang === 'ko' ? 'Bàn Phím Viết Tay Tiếng Hàn' : 'Bàn Phím Viết Tay Kanji';
      }

      if (modal) modal.classList.remove('hidden');
      initHWCanvas();
      clearHWCanvas();
    }

    function closeHandwritingModal() {
      const modal = document.getElementById('handwriting-modal');
      if (modal) modal.classList.add('hidden');
    }

    function initHWCanvas() {
      const canvas = document.getElementById('hw-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      canvas.onmousedown = canvas.ontouchstart = (e) => {
        e.preventDefault();
        isDrawingHW = true;
        const pos = getCanvasPos(canvas, e);
        ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#f472b6' : '#be185d';
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        currentStroke = { x: [pos.x], y: [pos.y], t: [Date.now()] };
      };

      canvas.onmousemove = canvas.ontouchmove = (e) => {
        if (!isDrawingHW) return;
        e.preventDefault();
        const pos = getCanvasPos(canvas, e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        currentStroke.x.push(pos.x);
        currentStroke.y.push(pos.y);
        currentStroke.t.push(Date.now());
      };

      canvas.onmouseup = canvas.ontouchend = (e) => {
        if (!isDrawingHW) return;
        isDrawingHW = false;
        if (currentStroke.x.length > 0) {
          hwStrokes.push([currentStroke.x, currentStroke.y, currentStroke.t]);
        }
        recognizeHandwriting();
      };
    }

    function getCanvasPos(canvas, event) {
      const rect = canvas.getBoundingClientRect();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      return {
        x: Math.round(clientX - rect.left),
        y: Math.round(clientY - rect.top)
      };
    }

    function clearHWCanvas() {
      const canvas = document.getElementById('hw-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hwStrokes = [];
      const candidatesContainer = document.getElementById('hw-candidates');
      if (candidatesContainer) {
        candidatesContainer.innerHTML = '<span class="text-xs text-slate-400 italic">Vẽ chữ để nhận diện...</span>';
      }
    }

    async function recognizeHandwriting() {
      if (hwStrokes.length === 0) return;

      const candidatesContainer = document.getElementById('hw-candidates');
      if (candidatesContainer) {
        candidatesContainer.innerHTML = '<span class="text-xs text-theme-main font-bold animate-pulse"><i class="fa-solid fa-spinner fa-spin mr-1"></i> Đang nhận diện nét...</span>';
      }

      const itcCode = hwLang === 'zh' ? 'zh-t-i0-handwrit' : hwLang === 'ko' ? 'ko-t-i0-handwrit' : 'ja-t-i0-handwrit';
      const requestData = {
        app_version: 0.4,
        api_level: "5.3.7",
        device: "5.3.7",
        input_type: 0,
        options: "enable_pre_space",
        requests: [{
          language: hwLang,
          writing_guide: { writing_area_width: 280, writing_area_height: 280 },
          ink: hwStrokes
        }]
      };

      try {
        const res = await fetch(`https://inputtools.google.com/request?itc=${itcCode}&app=mobilesearch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });

        const data = await res.json();
        if (data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]) {
          const candidates = data[1][0][1];
          renderHWCandidates(candidates);
        } else {
          if (candidatesContainer) candidatesContainer.innerHTML = '<span class="text-xs text-rose-500 font-bold">Không nhận diện được, hãy vẽ lại!</span>';
        }
      } catch (e) {
        if (candidatesContainer) candidatesContainer.innerHTML = '<span class="text-xs text-amber-500 font-bold">Cần kết nối mạng để nhận diện nét vẽ!</span>';
      }
    }

    function renderHWCandidates(candidates) {
      const container = document.getElementById('hw-candidates');
      if (!container) return;
      container.innerHTML = '';
      candidates.slice(0, 8).forEach(char => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 font-bold text-base hover:bg-theme hover:text-white transition shadow-sm';
        button.textContent = char;
        button.addEventListener('click', () => selectHWCandidate(char));
        container.appendChild(button);
      });
    }

    function selectHWCandidate(char) {
      insertTextAtSelection(document.getElementById(hwTargetInputId), char);
      clearHWCanvas();
      showToast(`Đã chọn chữ "${char}"`, 'success');
    }

    /* ==========================================================================
       9. TOAST NOTIFICATION UTILITY
       ========================================================================== */
    function showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');

      const bgMap = {
        success: 'bg-emerald-600 text-white',
        warning: 'bg-amber-500 text-white',
        error: 'bg-rose-600 text-white',
        info: 'bg-slate-800 text-white'
      };

      toast.className = `px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 transform transition-all duration-300 translate-y-5 opacity-0 ${bgMap[type] || bgMap.info}`;
      toast.innerHTML = `<span>${escapeHTML(message)}</span>`;

      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.remove('translate-y-5', 'opacity-0');
      }, 10);

      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-5');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    function escapeHTML(str) {
      if (!str) return '';
      return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
      );
    }

    /* ==========================================================================
       10. IPA PHONETIC KEYBOARD ENGINE
       ========================================================================== */
    const IPA_DATA = {
      vowels: ['ɪ', 'e', 'æ', 'ʌ', 'ɒ', 'ʊ', 'ə', 'iː', 'ɜː', 'ɑː', 'ɔː', 'uː', 'ɪə', 'eə', 'ʊə', 'eɪ', 'aɪ', 'ɔɪ', 'əʊ', 'aʊ'],
      consonants: ['p', 'b', 't', 'd', 'k', 'g', 'tʃ', 'dʒ', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h', 'm', 'n', 'ŋ', 'l', 'r', 'j', 'w'],
      marks: ['ˈ', 'ˌ', '.', '/', 'ː']
    };

    function initIPAKeyboard() {
      const vowelsContainer = document.getElementById('ipa-vowels');
      const consonantsContainer = document.getElementById('ipa-consonants');
      const marksContainer = document.getElementById('ipa-marks');

      if (vowelsContainer) {
        vowelsContainer.innerHTML = IPA_DATA.vowels.map(sym => 
          `<button type="button" onclick="insertIPASymbol('${sym}')" class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold hover:bg-theme hover:text-white dark:hover:bg-theme shadow-sm transition text-xs flex items-center justify-center">${sym}</button>`
        ).join('');
      }

      if (consonantsContainer) {
        consonantsContainer.innerHTML = IPA_DATA.consonants.map(sym => 
          `<button type="button" onclick="insertIPASymbol('${sym}')" class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold hover:bg-theme hover:text-white dark:hover:bg-theme shadow-sm transition text-xs flex items-center justify-center">${sym}</button>`
        ).join('');
      }

      if (marksContainer) {
        marksContainer.innerHTML = IPA_DATA.marks.map(sym => 
          `<button type="button" onclick="insertIPASymbol('${sym}')" class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold hover:bg-theme hover:text-white dark:hover:bg-theme shadow-sm transition text-xs flex items-center justify-center">${sym}</button>`
        ).join('');
      }
    }

    function showIPAKeyboard() {
      const kb = document.getElementById('ipa-keyboard');
      if (kb) kb.classList.remove('hidden');
    }

    function hideIPAKeyboard() {
      const kb = document.getElementById('ipa-keyboard');
      if (kb) kb.classList.add('hidden');
    }

    function toggleIPAKeyboard() {
      const kb = document.getElementById('ipa-keyboard');
      if (kb) kb.classList.toggle('hidden');
    }

    function insertIPASymbol(sym) {
      const input = document.getElementById('input-phonetic');
      if (!input) return;

      const start = input.selectionStart !== null ? input.selectionStart : input.value.length;
      const end = input.selectionEnd !== null ? input.selectionEnd : input.value.length;
      const text = input.value;

      input.value = text.substring(0, start) + sym + text.substring(end);
      input.selectionStart = input.selectionEnd = start + sym.length;
      input.focus();
    }

    /* ==========================================================================
       11. APP INITIALIZATION
       ========================================================================== */
    function initializeApp() {
      initTheme();
      initIPAKeyboard();
      initSpecialKeyboards();
      document.getElementById('streak-counter').innerText = learningStreak;
      switchNavTab('vocab');

      setInterval(() => {
        if (currentTab === 'vocab') {
          const timerElements = document.querySelectorAll('.next-review-timer');
          timerElements.forEach(el => {
            const nextTime = parseInt(el.getAttribute('data-next-time') || '0', 10);
            const level = parseInt(el.getAttribute('data-srs-level') || '0', 10);
            el.innerHTML = formatNextReviewTime(nextTime, level);
          });
        }
      }, 1000);
    }

    if (document.readyState === 'complete') initializeApp();
    else window.addEventListener('load', initializeApp, { once: true });
