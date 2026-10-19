window.SPEAKER_NOTES = [
  {
    "slide": 1,
    "title": "Mô phỏng mạng với NS-2",
    "speaker": "Long",
    "section": "Mở đầu",
    "seconds": 60,
    "paragraphs": [
      "Em chào thầy và các bạn. Nhóm em trình bày chủ đề mô phỏng mạng với NS-2, gồm mạng có dây và mạng không dây. Bài này đi từ cách xây dựng một mạng mô phỏng đến cách đọc kết quả để đánh giá hiệu năng.",
      "Câu hỏi xuyên suốt là: khi thay đổi đường truyền, hàng đợi hoặc lượng dữ liệu gửi vào mạng, thông lượng, độ trễ và mất gói thay đổi như thế nào? Mô phỏng giúp chúng ta thử các tình huống đó trong một môi trường có thể kiểm soát và lặp lại.",
      "Để dễ hình dung, ta xét một mạng mà việc tải tệp và cuộc gọi thoại diễn ra cùng lúc. Khi đường truyền bị quá tải, tệp có thể vẫn tải được nhưng cuộc gọi lại giật hoặc chậm. Vì vậy, đánh giá hiệu năng không chỉ hỏi mạng có hoạt động hay không, mà phải hỏi dịch vụ nào bị ảnh hưởng, ảnh hưởng bao nhiêu và trong điều kiện nào.",
      "Nhóm sẽ giải thích từng thành phần của kịch bản, minh họa bằng các ví dụ trong bài, rồi phân tích dữ liệu ghi lại. Em xin bắt đầu với bố cục và mục tiêu của phần trình bày."
    ],
    "cues": [
      "Chào và nhìn khán giả trước khi đọc tên chủ đề.",
      "Nhấn ba việc: dựng mạng, chạy mô phỏng, đánh giá kết quả."
    ],
    "transition": "Trước hết, mời thầy và các bạn theo dõi sáu nhóm nội dung chính."
  },
  {
    "slide": 2,
    "title": "Nội dung trình bày",
    "speaker": "Long",
    "section": "Mở đầu",
    "seconds": 65,
    "paragraphs": [
      "Bài trình bày gồm sáu nhóm nội dung. Đầu tiên là NS-2 và kiến trúc của công cụ. Tiếp theo, chúng ta tìm hiểu sáu bước chuẩn bị một mô phỏng: bộ lập lịch, ghi vết, tô-pô, giao vận, nguồn lưu lượng và thời gian chạy.",
      "Từ nền tảng đó, nhóm áp dụng vào hai ví dụ: mạng có dây và mạng không dây ad-hoc. Sau mỗi kịch bản, điều cần quan tâm là cách lấy dữ liệu ra để tính thông lượng, độ trễ, jitter và tỉ lệ chuyển gói thành công, thay vì chỉ xem hoạt ảnh.",
      "Khi theo dõi bài, thầy và các bạn có thể giữ ba câu hỏi: chúng ta đã đưa những giả định nào vào mô hình, dữ liệu đầu ra được đo bằng cách nào, và kết quả có đủ để trả lời mục tiêu ban đầu không? Ba câu hỏi này liên kết phần mã nguồn với phần phân tích, giúp tránh tình trạng chạy được chương trình nhưng chưa giải thích được kết quả.",
      "Phần cuối liên hệ kết quả với việc điều chỉnh tham số và thực hành. Mục tiêu là sau bài này, chúng ta hiểu từng khối trong một file Tcl, biết kiểm tra mô phỏng và giải thích được ý nghĩa của số liệu thu được."
    ],
    "cues": [
      "Đi theo thứ tự các ô, không đọc nguyên toàn bộ chữ trên slide."
    ],
    "transition": "Để hiểu các bước này, trước tiên em giới thiệu NS-2 là gì."
  },
  {
    "slide": 3,
    "title": "NS-2 là gì?",
    "speaker": "Long",
    "section": "Giới thiệu NS-2",
    "seconds": 110,
    "paragraphs": [
      "NS-2 là viết tắt của Network Simulator version 2, một công cụ mô phỏng mạng mã nguồn mở. Trong bài học, chúng ta dùng nó để mô tả mạng, tạo các luồng dữ liệu và quan sát phản ứng của giao thức trước những điều kiện đã đặt ra.",
      "Đặc điểm quan trọng nhất là mô phỏng sự kiện rời rạc. Chẳng hạn, gói tin được gửi ở một thời điểm rồi nhận ở thời điểm tiếp theo. Bộ mô phỏng xử lý các mốc có sự kiện, nên thời gian mô phỏng không nhất thiết trôi cùng tốc độ với đồng hồ ngoài đời.",
      "NS-2 cung cấp các mô hình cho mạng có dây, không dây, nhiều biến thể TCP, giao thức định tuyến và cơ chế hàng đợi. Điều này giúp ta giữ nguyên mạng nhưng thay một thành phần, ví dụ DropTail thành RED, để thiết kế phép so sánh có kiểm soát.",
      "Ví dụ minh họa cho sự kiện rời rạc: một gói được gửi ở thời điểm 1 giây và đến nơi ở 1,01 giây. Nếu giữa hai mốc không có sự kiện nào khác, bộ mô phỏng có thể chuyển ngay đến mốc 1,01. Nhưng nếu có một gói khác cần xử lý ở 1,005 giây, sự kiện đó phải được xử lý trước. Thứ tự thời gian được bảo toàn dù máy tính chạy nhanh hay chậm.",
      "Ta cũng cần phân biệt mô phỏng với thử nghiệm mạng thật. Trong mô phỏng, độ trễ, băng thông và cách mất gói là các quy tắc do mô hình quy định. Mô hình hữu ích khi trả lời đúng câu hỏi nghiên cứu; nếu bỏ qua một yếu tố quan trọng như cạnh tranh kênh vô tuyến, kết luận có thể không còn áp dụng được cho môi trường thực tế.",
      "Về cách sử dụng, phần xử lý chính được viết bằng C++, còn chúng ta thường cấu hình bằng OTcl trong file Tcl. TclCL liên kết hai phần này. Lợi ích là sửa kịch bản nhanh và tái lập thí nghiệm; tuy nhiên kết quả vẫn phụ thuộc vào mô hình, tham số và giả định, không tự động đại diện cho mọi mạng thực tế."
    ],
    "cues": [
      "Phân biệt thời gian mô phỏng với thời gian máy tính thực sự chạy.",
      "Không cần đọc hết danh sách giao thức."
    ],
    "transition": "Slide tiếp theo nối các thành phần đó thành một luồng làm việc hoàn chỉnh."
  },
  {
    "slide": 4,
    "title": "Kiến trúc và luồng làm việc với NS-2",
    "speaker": "Long",
    "section": "Giới thiệu NS-2",
    "seconds": 90,
    "paragraphs": [
      "Mời mọi người nhìn sơ đồ từ trên xuống. Đầu vào là file Tcl do người dùng viết. Trong đó, ta khai báo mạng có những nút nào, nối bằng đường truyền nào, dùng agent gì, phát lưu lượng ra sao và những hành động nào diễn ra tại từng thời điểm.",
      "Khi thực hiện lệnh ns với tên file kịch bản, phần OTcl phối hợp với lõi C++ để chạy mô phỏng. Các đối tượng node, link, queue và agent thực hiện vai trò tương ứng; bộ lập lịch quyết định thứ tự sự kiện, còn cơ chế trace ghi lại những sự kiện được cấu hình theo dõi.",
      "Đầu ra được tách thành hai nhánh. File chấm tr phục vụ phân tích số liệu: ta lọc các bản ghi cần thiết bằng AWK hoặc công cụ tương đương, rồi tính chỉ số và vẽ đồ thị. File chấm nam phục vụ hoạt ảnh, giúp nhìn đường đi của gói và trạng thái mạng.",
      "Có thể xem file Tcl là bản thiết kế thí nghiệm, bộ mô phỏng là nơi thực hiện thí nghiệm, trace là nhật ký, còn AWK và đồ thị là phần tổng hợp bằng chứng. Nếu thay băng thông trong Tcl, ta phải chạy lại để tạo trace mới trước khi tính toán. Chỉ sửa nhãn trên đồ thị hoặc mở lại NAM cũ sẽ không tạo ra kết quả của cấu hình mới.",
      "Hai đầu ra bổ sung cho nhau. Một hoạt ảnh chạy đúng chưa chứng minh thông lượng đã cao hoặc mất gói đã thấp; điều đó phải được tính từ dữ liệu phù hợp. Ngược lại, nếu kết quả số bất thường, NAM có thể giúp kiểm tra xem tô-pô hoặc hướng truyền đã được cấu hình đúng chưa."
    ],
    "cues": [
      "Chỉ theo đường từ .tcl xuống hai nhánh .tr và .nam.",
      "Nhấn .tr dùng đo lường, .nam dùng quan sát."
    ],
    "transition": "Từ luồng tổng thể này, em hệ thống lại các bước để viết một kịch bản."
  },
  {
    "slide": 5,
    "title": "Các bước chính trong mô phỏng mạng",
    "speaker": "Long",
    "section": "Tổng quan mục 4.4",
    "seconds": 90,
    "paragraphs": [
      "Slide liệt kê tám công việc, trong đó sáu bước đầu là phần thiết lập mô phỏng. Trong kịch bản này, nhóm ghép sáu bước với các mục theo thứ tự phân công 4.4.1 đến 4.4.6. Hai bước cuối là chạy và phân tích. Cách chia này giúp phân biệt việc mô tả thí nghiệm với việc thực hiện và đánh giá thí nghiệm.",
      "Đầu tiên, tạo đối tượng mô phỏng và bộ lập lịch. Tiếp theo, chuẩn bị file ghi vết trước khi phát sinh những sự kiện cần quan sát. Sau đó dựng tô-pô: nút mạng, đường truyền, hàng đợi, mô hình lỗi nếu có và phương thức định tuyến phù hợp.",
      "Khi có mạng, ta tạo agent nguồn và đích ở tầng giao vận. Nhưng agent chưa tự tạo ra nhu cầu truyền dữ liệu; vì vậy phải gắn thêm ứng dụng hoặc bộ sinh lưu lượng. Bước thứ sáu quy định thời gian bắt đầu, kết thúc và khoảng quan sát có ý nghĩa.",
      "Ví dụ, muốn khảo sát một luồng UDP qua đường truyền hẹp, ta cần nút nguồn và đích, đường truyền nối chúng, agent UDP và bộ nhận, nguồn CBR, lịch bắt đầu–dừng và cơ chế ghi trace. Nếu thiếu nguồn CBR thì agent chưa có dữ liệu để gửi; nếu thiếu lịch start thì ứng dụng đã tạo nhưng chưa hoạt động. Sáu bước vì vậy là các phần phụ thuộc nhau của cùng một kịch bản.",
      "Cuối cùng, chạy file bằng lệnh ns, kiểm tra đầu ra, rồi tính các chỉ số từ trace. Em phụ trách mở đầu và bộ lập lịch; Minh trình bày ghi vết; Bảo phụ trách thiết lập mạng; Thành giải thích tầng giao vận; Đạt trình bày nguồn lưu lượng và thời gian mô phỏng. Các ví dụ phía sau sẽ kết nối những phần này."
    ],
    "cues": [
      "Giải thích rõ sáu bước thiết lập cộng hai bước thực hiện, đánh giá.",
      "Giới thiệu tên người đúng phân công trong ảnh."
    ],
    "transition": "Em bắt đầu mục 4.4.1 với bộ lập lịch sự kiện, thành phần điều khiển thời gian của mô phỏng."
  },
  {
    "slide": 6,
    "title": "Bước 1 — Tạo bộ lập lịch sự kiện",
    "speaker": "Long",
    "section": "4.4.1 · Bộ lập lịch sự kiện",
    "seconds": 115,
    "paragraphs": [
      "Bộ lập lịch có thể hình dung như một danh sách công việc kèm giờ thực hiện. Các sự kiện gồm gửi gói, nhận gói hoặc bộ định thời hết hạn. NS-2 lấy sự kiện sớm nhất để xử lý, rồi chuyển đồng hồ mô phỏng đến mốc tiếp theo; không cần chờ đủ thời gian thực giữa hai mốc.",
      "Trong ba dòng chính, new Simulator tạo đối tượng mô phỏng. Lệnh at đặt công việc tại thời điểm xác định: ví dụ bắt đầu FTP ở giây 0,5 và gọi thủ tục finish ở giây 20. Lệnh run mới thực sự khởi động vòng xử lý; chỉ khai báo lịch mà không run thì các sự kiện chưa chạy.",
      "NS-2 có các cách tổ chức hàng đợi sự kiện như List, Heap và Calendar. Phần này cần hiểu nguyên lý, tránh nhầm các tên mặc định đang ghi chưa thống nhất trên slide. Khi chủ động chọn Heap, cú pháp trong tài liệu là tạo Simulator rồi gọi $ns use-scheduler Heap, trước khi lên lịch sự kiện.",
      "Điểm dễ nhầm là hàng đợi sự kiện và hàng đợi gói tin là hai thứ khác nhau. Hàng đợi sự kiện quyết định hành động nào được mô phỏng trước theo thời gian; hàng đợi gói trên link giữ các gói đang chờ đường truyền. Đổi Heap sang Calendar chủ yếu thay cách tổ chức bộ lập lịch, còn đổi DropTail sang RED thay chính sách xử lý gói và có thể làm thay đổi kết quả mạng.",
      "Khi viết lịch, cần kiểm tra sự hợp lý của các mốc. Nếu finish ở giây 20 nhưng ứng dụng lại start ở giây 25, lần chạy sẽ kết thúc trước khi ứng dụng phát. Nếu stop và finish cùng thời điểm, các gói đang truyền có thể chưa kịp tới đích. Do đó, lịch sự kiện cũng là một phần của thiết kế phép đo.",
      "Ta nên đặt mốc kết thúc rõ ràng, nhất là khi nguồn lưu lượng hoặc bộ định thời còn tiếp tục sinh sự kiện. Thủ tục finish cần đẩy dữ liệu còn trong bộ đệm ra file và đóng file để tránh thiếu bản ghi. Như vậy, bộ lập lịch trả lời câu hỏi khi nào; bước tiếp theo sẽ trả lời ghi lại điều gì."
    ],
    "cues": [
      "Lưu ý khi demo: dùng $ns use-scheduler Heap, không truyền đối tượng $sched.",
      "Không khẳng định thiếu finish luôn chạy vô hạn hoặc thiếu flush luôn làm file rỗng."
    ],
    "transition": "Em xin chuyển phần 4.4.2 cho Minh để trình bày cách ghi vết và tạo dữ liệu đánh giá."
  },
  {
    "slide": 7,
    "title": "Bước 2 — Ghi lại vết các sự kiện",
    "speaker": "Minh",
    "section": "4.4.2 · Ghi vết sự kiện",
    "seconds": 95,
    "paragraphs": [
      "Tiếp nối phần của Long, em trình bày cách ghi vết. Trace giống nhật ký của mô phỏng: ghi thời điểm và thông tin những sự kiện được theo dõi. Nhờ đó, ta có thể kiểm tra một gói được gửi, nhận hoặc loại bỏ ở đâu và sử dụng dữ liệu ấy để tính hiệu năng.",
      "Ở bên trái, lệnh open tạo file và trả về một biến đại diện cho file đang mở. trace-all nối cơ chế ghi vết với file out.tr. Tương tự, namtrace-all tạo dữ liệu cho NAM. Chữ w là chế độ ghi, vì vậy nếu dùng lại cùng tên file thì kết quả cũ có thể bị ghi đè.",
      "Ta có thể ghi nhiều sự kiện hoặc chỉ theo dõi đường truyền quan tâm. Khi phân tích một chiều từ n0 đến n1, cần phân biệt với chiều ngược lại. Cũng phải chọn đúng sự kiện tại đích hoặc tầng cần đo; cộng mọi lần gói xuất hiện dọc đường có thể đếm một gói nhiều lần.",
      "Ví dụ một gói từ máy nguồn đi qua hai router rồi đến máy đích có thể được ghi nhiều lần: vào hàng đợi, rời hàng đợi và được nhận tại mỗi chặng. Nhật ký dài không có nghĩa ứng dụng đã gửi nhiều gói tương ứng. Muốn tính số gói đến đích, ta cần chọn đúng điểm quan sát và nhận diện gói, tương tự việc theo dõi một kiện hàng qua nhiều trạm nhưng chỉ tính một lần giao thành công.",
      "Khi kết thúc, flush-trace đẩy dữ liệu còn trong bộ đệm ra file, rồi close đóng các file. NAM hỗ trợ kiểm tra trực quan; còn chỉ số trong bài được tính từ trace. Với mô phỏng dài, cần cân nhắc phạm vi ghi vết và đặt tên đầu ra theo kịch bản để giữ kết quả so sánh, tránh file lớn hoặc nhầm giữa các lần chạy."
    ],
    "cues": [
      "Chỉ ba thao tác: mở file, gắn trace, flush và close.",
      "Lưu ý khi demo: nếu chỉ trace một link, chỉ rõ file handle; muốn cả hai chiều thì cấu hình cả hai chiều."
    ],
    "transition": "Khi đã biết cách ghi dữ liệu, em xin mời Bảo trình bày phần 4.4.3: dựng mạng sẽ được mô phỏng."
  },
  {
    "slide": 8,
    "title": "Bước 3.1 — Thiết lập tô-pô mạng",
    "speaker": "Bảo",
    "section": "4.4.3 · Thiết lập mạng mô phỏng",
    "seconds": 110,
    "paragraphs": [
      "Trong mục 4.4.3, em trình bày ba thành phần: tô-pô, mô hình lỗi và định tuyến. Tô-pô là cách các nút được kết nối với nhau. Những dòng đầu tạo n0 đến n3; đây mới là các nút, chưa có đường truyền thì chúng chưa tạo thành mạng liên thông.",
      "Dòng duplex-link nối n0 với n1 bằng đường truyền hai chiều. Ba tham số cần đọc là băng thông 10 megabit mỗi giây, độ trễ lan truyền 2 mili giây và hàng đợi DropTail. Độ trễ 2 mili giây chưa phải toàn bộ trễ đầu cuối, vì gói còn có thể chờ hàng đợi và mất thời gian truyền lên đường dây.",
      "queue-limit đặt giới hạn hàng đợi cho chiều được chỉ định. Ví dụ n1 đến n2 giới hạn 20 gói thì phải có link đó từ trước; muốn cấu hình chiều ngược lại cần đặt riêng. Hàng đợi lớn có thể giữ thêm gói khi tải tăng, nhưng cũng có thể làm thời gian chờ lớn hơn.",
      "Để tách các thành phần độ trễ, giả sử một gói dài 1.000 byte đi qua link 10 megabit mỗi giây trên slide. Thời gian đưa 8.000 bit lên link là 0,8 mili giây. Cộng 2 mili giây lan truyền, ta được khoảng 2,8 mili giây cho chặng đó nếu bỏ qua thời gian chờ và các chi phí khác. Nếu link bận, thời gian chờ hàng đợi phải cộng thêm; đây là lý do băng thông và độ trễ là hai tham số khác nhau.",
      "Một tuyến nhiều chặng bị giới hạn bởi chặng có năng lực nhỏ nhất trong điều kiện tải tương ứng. Nối máy nguồn bằng link 10 megabit mỗi giây không bảo đảm luồng đạt 10 megabit mỗi giây nếu phía sau có link 2 megabit mỗi giây. Nút cổ chai cần được xác định trên toàn đường đi, không chỉ ở link đầu tiên.",
      "Các lệnh orient và queuePos chủ yếu sắp xếp hình ảnh trong NAM, không làm mạng truyền nhanh hơn. Ngoài duplex, simplex tạo một chiều, còn make-lan mô tả môi trường LAN dùng chung. Khi báo cáo, cần ghi đầy đủ các tham số này để người khác dựng lại đúng mạng và hiểu điều kiện của kết quả."
    ],
    "cues": [
      "Lưu ý khi demo: queuePos dùng hai đối số $n1 $n2, không viết $n1-$n2.",
      "Phân biệt độ trễ đường truyền với độ trễ đầu cuối."
    ],
    "transition": "Sau khi dựng đường truyền, ta xem cách mô phỏng trường hợp đường truyền có lỗi."
  },
  {
    "slide": 9,
    "title": "Bước 3.2 — Đưa mô hình lỗi vào đường truyền",
    "speaker": "Bảo",
    "section": "4.4.3 · Thiết lập mạng mô phỏng",
    "seconds": 90,
    "paragraphs": [
      "Mô hình lỗi cho phép ta chủ động tạo điều kiện truyền không hoàn hảo. Nếu không gắn mô hình lỗi vào link có dây trong ví dụ, ta chưa bổ sung cơ chế lỗi ngẫu nhiên này. Tuy nhiên, điều đó không có nghĩa mọi gói đều đến đích: hàng đợi đầy vẫn có thể làm mất gói.",
      "Đoạn mã tạo một ErrorModel rồi đặt rate bằng 0,01 và đơn vị pkt. Với cấu hình minh họa này, xác suất lỗi theo gói là một phần trăm. Đây là tham số đầu vào, không phải cam kết rằng cứ đúng một trăm gói thì chắc chắn mất một gói trong mỗi lần chạy.",
      "Biến ngẫu nhiên Uniform tham gia quyết định gói nào gặp lỗi. drop-target chỉ nơi xử lý gói bị loại; Agent/Null là đích bỏ gói trong ví dụ. Lệnh lossmodel gắn mô hình vào chiều từ n0 đến n1. Nếu nghiên cứu hai chiều, ta cần xác định rõ lỗi xảy ra ở chiều nào.",
      "Giả sử gửi 1.000 gói với xác suất lỗi 1% trong mô hình đơn giản, số lỗi kỳ vọng là khoảng 10 gói. Một lần chạy có thể cao hoặc thấp hơn con số đó. Đây là ví dụ tính từ xác suất đầu vào, không phải số liệu của bài. Khi tăng số lần chạy với các seed khác nhau, ta có thêm thông tin về mức dao động của kết quả.",
      "Mục tiêu là quan sát tác động lên thông lượng, độ trễ và cách TCP phản ứng, chẳng hạn gửi lại dữ liệu khi phát hiện mất gói. Khi so sánh, nên giữ các điều kiện khác ổn định và ghi lại hạt giống ngẫu nhiên. Mô hình lỗi đơn giản giúp tách một yếu tố, nhưng không thay thế toàn bộ các cơ chế vật lý của mạng không dây thực."
    ],
    "cues": [
      "Nhấn 1% là xác suất cấu hình, không phải số đo đã thu được.",
      "Phân biệt mất do lỗi đường truyền và mất do hàng đợi đầy."
    ],
    "transition": "Ngoài link và lỗi, các gói còn cần biết phải đi qua những nút nào để đến đích."
  },
  {
    "slide": 10,
    "title": "Bước 3.3 — Chọn thuật toán định tuyến",
    "speaker": "Bảo",
    "section": "4.4.3 · Thiết lập mạng mô phỏng",
    "seconds": 95,
    "paragraphs": [
      "Định tuyến quyết định nút kế tiếp mà gói cần đi qua để đến đích. Với mạng có dây đơn giản và tô-pô cố định, NS-2 có thể tự tính tuyến. Em xin làm rõ một chi tiết trên slide: cơ chế mặc định trong tài liệu NS-2 là Static, không nên đồng nhất nó với việc đang chạy một giao thức Link-State động.",
      "Static tính đường đi dựa trên toàn bộ tô-pô và chi phí liên kết trước khi mô phỏng bắt đầu. Nếu bài toán có thay đổi link hoặc cần nghiên cứu quá trình cập nhật tuyến, chúng ta phải chọn cơ chế phù hợp. Ví dụ DV biểu diễn định tuyến vector khoảng cách, còn Manual cho phép chủ động đặt tuyến.",
      "Đối với mạng không dây ad-hoc trong bài, các nút có thể chuyển tiếp gói cho nhau và liên kết phụ thuộc điều kiện vô tuyến hoặc chuyển động. Vì vậy, ta khai báo giao thức qua adhocRouting. AODV tìm tuyến theo nhu cầu; DSR dùng định tuyến nguồn; DSDV thuộc nhóm duy trì thông tin tuyến chủ động.",
      "Khi đường chính bị ngắt, định tuyến cần nhận biết thay đổi rồi tìm hoặc cập nhật đường thay thế. Trong khoảng chuyển tiếp, một số gói có thể chờ hoặc bị mất; vì vậy có đường dự phòng không đồng nghĩa việc chuyển tuyến diễn ra tức thì và không tổn thất. Ta cần xem cả thời gian chuyển tuyến lẫn năng lực đường dự phòng để giải thích giai đoạn sự cố.",
      "Điều cần nhớ là không có lựa chọn tốt nhất cho mọi tình huống. Khi muốn so sánh giao thức, phải giữ cùng kịch bản chuyển động và lưu lượng, rồi đo kết quả. Đến đây, mạng đã có cấu trúc và cách tìm đường; bước tiếp theo là đặt các thực thể giao vận lên các nút nguồn và đích."
    ],
    "cues": [
      "Lưu ý kiến thức: mặc định wired là Static; không đọc nguyên nhãn LS mặc định trên slide.",
      "Chỉ giới thiệu khác biệt chính của các giao thức ad-hoc."
    ],
    "transition": "Em xin chuyển cho Thành trình bày mục 4.4.4, tạo luồng TCP và UDP ở tầng giao vận."
  },
  {
    "slide": 11,
    "title": "Bước 4 — Tạo kết nối tầng giao vận",
    "speaker": "Thành",
    "section": "4.4.4 · Kết nối tầng giao vận",
    "seconds": 115,
    "paragraphs": [
      "Em tiếp tục với tầng giao vận. Trong NS-2, agent là đối tượng mô phỏng hành vi giao thức ở đầu gửi hoặc đầu nhận. Các ví dụ trên slide đều có ba thao tác: tạo agent, gắn agent vào node, rồi thiết lập quan hệ nguồn và đích bằng lệnh connect.",
      "Với TCP, phía gửi là Agent/TCP và phía nhận là TCPSink. TCP có cơ chế phản hồi và điều chỉnh việc gửi; những biến thể như Reno, NewReno, SACK hoặc Vegas khác nhau ở cách xử lý mất gói, phục hồi hoặc nhận biết tắc nghẽn. Khi báo cáo thí nghiệm, cần ghi đúng biến thể đã dùng vì chỉ đổi tên TCP cũng có thể thay đổi hành vi.",
      "Với UDP, ta tạo Agent/UDP và Agent/Null làm đích nhận trong mô hình. Chữ connect ở đây chỉ liên kết địa chỉ gửi và nhận của mô phỏng. Nó không biến UDP thành giao thức có bắt tay hoặc tự gửi lại gói mất; ứng dụng gửi bao nhiêu và khi nào sẽ do bộ sinh lưu lượng quyết định.",
      "Có thể hiểu TCP là cơ chế vừa vận chuyển vừa theo dõi phản hồi. Khi có dấu hiệu mất gói, TCP có thể truyền lại và điều chỉnh cửa sổ gửi; điều đó hỗ trợ độ tin cậy nhưng có thể làm tăng thời gian hoàn tất. UDP không tự bổ sung các cơ chế đó, nên phù hợp hay không còn tùy yêu cầu ứng dụng. Không thể kết luận UDP luôn nhanh hơn hoặc TCP luôn tốt hơn chỉ từ tên giao thức.",
      "Trong một luồng FTP, ứng dụng quyết định có dữ liệu cần gửi, TCP quyết định cách đưa dữ liệu vào mạng theo trạng thái của nó, còn link và hàng đợi quyết định quá trình chuyển tiếp. Tách ba vai trò này giúp ta hiểu vì sao cùng một ứng dụng nhưng đổi băng thông hoặc chính sách hàng đợi lại thu được thông lượng khác.",
      "Cuối slide, fid giúp phân biệt các luồng và gắn màu khi quan sát NAM. Lúc phân tích trace, mã luồng cũng hữu ích để tách dữ liệu. Chúng ta đã có đường truyền và agent, nhưng vẫn cần một ứng dụng tạo dữ liệu; đó là lý do phải thực hiện bước sinh lưu lượng tiếp theo."
    ],
    "cues": [
      "Chỉ theo ba nhóm lệnh: new, attach-agent, connect.",
      "Nhấn connect của UDP là liên kết trong mô hình, không phải bắt tay mạng."
    ],
    "transition": "Em xin mời Đạt trình bày mục 4.4.5: các ứng dụng và nguồn tạo lưu lượng cho những agent này."
  },
  {
    "slide": 12,
    "title": "Bước 5 — Tạo nguồn sinh lưu lượng",
    "speaker": "Đạt",
    "section": "4.4.5 · Nguồn sinh lưu lượng",
    "seconds": 115,
    "paragraphs": [
      "Nguồn lưu lượng mô tả dữ liệu mà ứng dụng muốn đưa vào mạng. Slide phân biệt ba cách: dùng mô hình toán học, phát lại dữ liệu lưu lượng đã ghi, hoặc tương tác với mạng thực qua emulation. Trong phạm vi bài này, chúng ta tập trung vào cách thứ nhất để dễ kiểm soát tham số.",
      "Với TCP, Application/FTP được gắn vào agent gửi và có lịch start, stop. Tốc độ dữ liệu thực sự đi qua mạng còn phụ thuộc cửa sổ TCP, phản hồi và tắc nghẽn, nên không thể coi FTP luôn phát với một tốc độ cố định. Telnet là một mô hình khác cho kiểu phát dữ liệu tương tác.",
      "Với UDP, CBR tạo lưu lượng theo tốc độ cấu hình. Ví dụ kích thước gói 1.000 byte và tốc độ 1 megabit mỗi giây tương ứng khoảng 125 gói mỗi giây, nếu xét riêng kích thước đó. Đây là tốc độ phát mục tiêu, không phải thông lượng chắc chắn nhận được ở đích khi mạng có mất gói hoặc nghẽn.",
      "Ta có thể kiểm tra cấu hình CBR bằng khoảng cách giữa hai lần phát. Với 1.000 byte và 1 megabit mỗi giây, khoảng cách lý tưởng là 8.000 chia 1.000.000, tức 0,008 giây hay 8 mili giây. Nếu giữ kích thước gói mà giảm tốc độ phát một nửa, khoảng cách tăng gấp đôi. Đây là quan hệ giữa kích thước, tốc độ và nhịp phát, chưa tính các chi phí khác của mô hình.",
      "Nguồn đều và nguồn theo đợt có thể cùng mức tải trung bình nhưng gây hàng đợi khác nhau. Chẳng hạn, phát dồn trong một khoảng ngắn có thể làm đầy hàng đợi rồi để link rảnh ở khoảng sau. Vì vậy, khi mô tả lưu lượng cần nêu cả tốc độ trung bình lẫn đặc điểm phát, thay vì chỉ ghi một con số megabit mỗi giây.",
      "Exponential và Pareto biểu diễn nguồn bật, tắt theo các khoảng thời gian, giúp mô phỏng tải có từng đợt thay vì luôn đều. Khi thực hành phải gắn nguồn vào agent và lên lịch chạy. Riêng thuộc tính kích thước của CBR, tên đúng cần dùng là packetSize_ như trong tài liệu; sau đó kiểm tra trace để xác nhận nguồn hoạt động đúng."
    ],
    "cues": [
      "Ưu tiên packetSize_ theo tài liệu; kiểm tra phiên bản và trace nếu dùng tên cũ packet_size_.",
      "Phép tính 125 gói/giây là suy ra từ tham số, không phải kết quả chạy đo."
    ],
    "transition": "Sau khi chọn cách phát lưu lượng, câu hỏi cuối cùng là nên cho mô phỏng chạy bao lâu."
  },
  {
    "slide": 13,
    "title": "Bước 6 — Xác định thời gian mô phỏng",
    "speaker": "Đạt",
    "section": "4.4.6 · Thời gian mô phỏng",
    "seconds": 95,
    "paragraphs": [
      "Thời gian mô phỏng cần đủ để quan sát hiện tượng muốn nghiên cứu. Chạy quá ngắn có thể chỉ thấy giai đoạn khởi động; chạy quá dài lại tốn thời gian xử lý và tạo trace lớn. Vì vậy, ta chọn thời gian theo mục tiêu thí nghiệm, sau đó kiểm tra xem kéo dài thêm có làm thay đổi kết luận hay không.",
      "Với TCP, lúc mới bắt đầu, cửa sổ gửi còn đang thay đổi và có thể đi qua Slow Start. Nếu chỉ lấy một đoạn rất ngắn, thông lượng trung bình có thể chịu ảnh hưởng mạnh của giai đoạn này. Cần phân biệt khoảng khởi động, khoảng đo và thời gian chờ các gói đang trên đường tới đích.",
      "Các mốc như tám đến mười RTT, mười đến một trăm giây hoặc vài trăm giây trên slide nên xem là gợi ý khởi đầu, không phải điều kiện bảo đảm hội tụ. Ví dụ RTT 40 mili giây thì mười RTT là 400 mili giây; phép nhân đó không chứng minh rằng mọi kết nối đã ổn định sau 400 mili giây.",
      "Ví dụ minh họa, ta cho ứng dụng bắt đầu ở giây 1, dừng ở giây 28 và kết thúc mô phỏng ở giây 30. Khoảng 28–30 giúp các gói còn trên đường có cơ hội đến đích, nhưng chưa chắc đủ trong mọi kịch bản. Ta phải kiểm tra trace. Nếu tính thông lượng trong 27 giây phát hay trong toàn bộ 30 giây, kết quả sẽ khác, nên khoảng đo phải được công bố rõ.",
      "Tương tự, chọn 20 giây cần được kiểm tra bằng chuỗi kết quả theo thời gian. Khi có ngẫu nhiên, ta nên chạy nhiều lần với các seed được ghi lại và xem mức biến động. Như vậy, sáu bước thiết lập đã hoàn chỉnh: từ lịch sự kiện đến thời lượng quan sát, chúng ta có thể ghép thành kịch bản thực hành."
    ],
    "cues": [
      "Nhấn thời gian gợi ý không tự bảo đảm kết quả hội tụ.",
      "Phân biệt thời gian phát, khoảng đo và thời gian kết thúc mô phỏng."
    ],
    "transition": "Em xin chuyển lại cho Bảo để áp dụng các bước vừa trình bày vào ví dụ mạng có dây."
  },
  {
    "slide": 14,
    "title": "Ví dụ mạng có dây — đọc kịch bản trước khi chạy",
    "speaker": "Bảo",
    "section": "Thực hành · Ví dụ có dây",
    "seconds": 110,
    "paragraphs": [
      "Sau phần xây dựng mô hình, em xin áp dụng vào ví dụ mạng có dây. Tô-pô gồm 11 nút: bốn máy phía khách, ba bộ định tuyến và bốn máy phía dịch vụ. Các đường truy nhập đạt 10 megabit mỗi giây, trong khi đường chính r1–r2 chỉ có 5 megabit mỗi giây nên đây là vị trí cần quan sát hiện tượng nghẽn.",
      "Bốn nhóm lưu lượng cùng sử dụng mạng là Web, FTP, VoIP và Video. Web và FTP dùng TCP; VoIP và Video dùng UDP. Chúng tạo ra những nhu cầu khác nhau: FTP cần truyền nhiều dữ liệu, còn thoại và video quan tâm cả độ trễ, độ đều đặn và khả năng nhận được gói.",
      "Điểm đáng chú ý là lịch sự cố: giây 25, đường chính bị ngắt; giây 40, đường được phục hồi. Trong khoảng giữa, định tuyến DV phải chuyển sang đường qua r3. Mỗi chặng dự phòng có tốc độ 2 megabit mỗi giây và độ trễ 30 mili giây, nên không nên hiểu cả đường hai chặng chỉ trễ 30 mili giây.",
      "Khi đường chính hoạt động, bốn loại tải chia sẻ link 5 megabit mỗi giây. Trong sự cố, chúng phải đi qua hai link dự phòng 2 megabit mỗi giây. Hai chặng nối tiếp không cộng thành 4 megabit mỗi giây: cùng một gói phải lần lượt đi qua cả hai. Riêng trễ lan truyền của hai chặng dự phòng đã là 60 mili giây, chưa tính link truy nhập, thời gian truyền và hàng đợi.",
      "Vì thế, nên chia đồ thị thành ba vùng: trước giây 25 để xem hoạt động bình thường; từ 25 đến 40 để xem chuyển tuyến và tải trên đường hẹp; sau 40 để xem phục hồi. Một giá trị trung bình cho toàn bộ 60 giây có thể che đi khoảng gián đoạn ngắn nhưng ảnh hưởng lớn đến thoại hoặc video.",
      "Bài toán so sánh DropTail với RED trên đường chính, giữ cùng kịch bản và ghép các lần chạy theo seed. Slide quy định 10 seed cho mỗi loại hàng đợi. Cách tổ chức này giúp quan sát cả trạng thái bình thường lẫn lúc sự cố, thay vì chỉ nhìn một con số trung bình."
    ],
    "cues": [
      "Chỉ đường r1–r2, rồi lần theo đường r1–r3–r2.",
      "Nhấn ba mốc: trước 25 giây, 25–40 giây và sau 40 giây."
    ],
    "transition": "Từ bảng thông số này, em chuyển sang các đoạn Tcl thể hiện đúng những thành phần vừa mô tả."
  },
  {
    "slide": 15,
    "title": "Ví dụ mạng có dây — giải thích cấu trúc Tcl",
    "speaker": "Bảo",
    "section": "Thực hành · Ví dụ có dây",
    "seconds": 100,
    "paragraphs": [
      "Ở trang này, em không đọc toàn bộ mã mà tập trung vào luồng xử lý. Hai đối số đầu vào là loại hàng đợi và seed. Nhờ vậy, cùng một kịch bản có thể chạy với DropTail hoặc RED mà không cần sửa tay nhiều vị trí. Tên trace chứa cả loại hàng đợi lẫn seed để tránh nhầm kết quả giữa các lần chạy.",
      "Sau khi tạo Simulator, chương trình thiết lập nguồn ngẫu nhiên và bật định tuyến DV. Đoạn mã còn minh họa một bộ sinh ngẫu nhiên riêng cho Video. Khi so sánh, cần giữ cách sinh tải nhất quán giữa hai cấu hình; chỉ dùng cùng một con số seed chưa đủ để chứng minh mọi chuỗi sự kiện đều giống nhau.",
      "Tiếp theo là các liên kết truy nhập, liên kết chính và hai chặng dự phòng. Biến qtype quyết định hàng đợi của đường chính. Với RED, các ngưỡng và trọng số được khai báo trước. Hai lệnh rtmodel-at đưa sự kiện ngắt và khôi phục đường vào đúng thời điểm 25 và 40 giây.",
      "DropTail thường tiếp nhận gói cho tới khi hàng đợi đầy rồi loại gói mới đến. RED dựa vào mức chiếm dụng hàng đợi trung bình và các ngưỡng để có thể loại sớm trước khi hàng đợi đầy. Ý tưởng là tạo tín hiệu tắc nghẽn sớm cho nguồn có phản hồi như TCP. Tuy nhiên, nếu ngưỡng hoặc tải không phù hợp, giảm trễ có thể đi kèm giảm thông lượng; đó chính là điều cần đo thay vì mặc định RED luôn tốt hơn.",
      "Cuối cùng, ứng dụng được lên lịch bắt đầu và thủ tục finish được gọi khi hết 60 giây. Đây là trích đoạn: phần tạo nút, cấu hình đầy đủ các nguồn và thủ tục kết thúc không xuất hiện hết. Vì vậy, muốn chạy thực tế phải dùng kịch bản hoàn chỉnh, không chép riêng đoạn này rồi coi là một chương trình đã sẵn sàng."
    ],
    "cues": [
      "Chỉ qtype, seed, tên trace rồi đến hai lệnh rtmodel-at.",
      "Không đọc từng dòng; giữ trọng tâm ở đầu vào, tô-pô và lịch sự kiện."
    ],
    "transition": "Phần mạng có dây của em đến đây là hết. Em mời bạn Thành trình bày ví dụ mạng không dây và các nút di động."
  },
  {
    "slide": 16,
    "title": "Ví dụ mạng không dây — các yếu tố cần kiểm soát",
    "speaker": "Thành",
    "section": "Thực hành · Ví dụ không dây",
    "seconds": 95,
    "paragraphs": [
      "Em tiếp nối ví dụ có dây bằng mạng ad-hoc gồm sáu nút trong vùng 600 nhân 600 mét. Khác với sơ đồ liên kết cố định ở phần trước, việc các nút trao đổi được với nhau còn phụ thuộc vị trí, mô hình truyền sóng và cấu hình vô tuyến. Nhìn hai nút gần nhau trên hình chưa đủ để khẳng định chúng luôn liên lạc trực tiếp.",
      "Kịch bản dùng MAC 802.11, mô hình lan truyền TwoRayGround và giao thức định tuyến AODV. Có hai luồng cần theo dõi: UDP/CBR từ n0 đến n3, tải đặt là 200 kilobit mỗi giây; TCP/FTP từ n1 đến n4. Node n4 là đích của FTP và cũng là một nút di động.",
      "Khi n4 hoặc n5 đổi vị trí, đường đi khả dụng có thể thay đổi. AODV có thể phải tìm hoặc sửa đường, làm phát sinh thời gian chờ và gói điều khiển. Ngoài ra, các nút dùng chung môi trường vô tuyến nên còn có tranh chấp truy nhập kênh. Đây là những yếu tố cần xem xét cùng nhau khi đọc kết quả.",
      "Khác mạng có dây với các link tách biệt, các nút không dây có thể cạnh tranh cùng tài nguyên vô tuyến. Một gói đi nhiều hop không chỉ trải qua nhiều lần chuyển tiếp mà còn có thể phải chờ truy nhập kênh nhiều lần. Khi nút di động làm đường cũ không còn dùng được, giao thức định tuyến lại cần tìm đường. Độ trễ vì vậy có thể đến từ cả hàng đợi, truy nhập kênh và quá trình tìm tuyến.",
      "Có một chi tiết cần đối chiếu: bảng tóm tắt ghi tốc độ 20 mét mỗi giây, nhưng mã ở trang sau đặt n4 là 20 và n5 là 15. Khi tái lập thí nghiệm phải theo cấu hình thực tế và ghi riêng từng nút. Thời gian mô phỏng của ví dụ là 30 giây."
    ],
    "cues": [
      "Chỉ hai cặp nguồn–đích và đánh dấu n4, n5 di động.",
      "Nói rõ chênh lệch tốc độ giữa bảng tóm tắt và mã, không lướt qua."
    ],
    "transition": "Em sẽ chỉ ra các cấu hình này được đặt ở đâu trong kịch bản Tcl ở trang tiếp theo."
  },
  {
    "slide": 17,
    "title": "Ví dụ mạng không dây — đọc mã theo từng khối",
    "speaker": "Thành",
    "section": "Thực hành · Ví dụ không dây",
    "seconds": 95,
    "paragraphs": [
      "Kịch bản không dây vẫn đi theo sáu bước đã học, nhưng phần cấu hình nút dài hơn. Khối đầu khai báo kênh, mô hình lan truyền, MAC, hàng đợi và định tuyến. Sau đó chương trình tạo bộ mô phỏng, mở trace, mở file NAM và khai báo vùng địa hình để các nút có không gian hoạt động.",
      "Lệnh node-config tập hợp các thành phần của một nút không dây. Trong ví dụ, ghi vết ở agent và router được bật, còn MAC trace được tắt. Vòng lặp tạo sáu nút, gán tọa độ ban đầu rồi tắt chuyển động ngẫu nhiên để dùng lịch di chuyển đã chỉ định. Các lệnh setdest nêu đích đến và tốc độ, không phải dịch chuyển tức thời đến đích.",
      "Phần giao vận tạo TCP và TCPSink cho n1 đến n4, rồi gắn FTP vào TCP. Luồng còn lại dùng UDP và Null, với CBR làm nguồn phát. FTP bắt đầu ở giây 1; CBR ở giây 1,5. Hai ứng dụng dừng ở giây 28, trong khi mô phỏng kết thúc ở giây 30 để dành thêm thời gian xử lý các gói còn trên mạng.",
      "Khi đọc setdest, cần tách tọa độ đích khỏi vận tốc. Ví dụ minh họa một nút cách đích 100 mét và di chuyển 20 mét mỗi giây thì cần 5 giây để tới đó nếu không bị lệnh di chuyển khác thay thế. Đây là chuyển động diễn ra theo thời gian mô phỏng. Ta đối chiếu mốc bắt đầu di chuyển với các mốc giảm PDR hoặc tăng trễ để đặt giả thuyết, rồi kiểm tra bằng trace.",
      "Thủ tục finish đẩy dữ liệu ghi vết ra file và đóng file trước khi thoát. Đường dẫn mở NAM trên slide là đường dẫn mẫu, cần sửa theo máy thực hành. Việc có một khối mã đầy đủ trên slide chưa thay thế cho kiểm tra chạy thực tế và kiểm tra các file đầu ra."
    ],
    "cues": [
      "Lần lượt chỉ node-config, setdest, hai luồng và lịch 1 / 1,5 / 28 / 30 giây.",
      "Không khẳng định mã đã chạy thành công nếu chưa có phiên demo thực tế."
    ],
    "transition": "Em đã trình bày hai lớp cấu hình và lịch di động. Tiếp theo, mời bạn Minh hướng dẫn chạy mô phỏng và đọc dữ liệu trace."
  },
  {
    "slide": 18,
    "title": "Chạy mô phỏng — kiểm tra đầu ra trước khi phân tích",
    "speaker": "Minh",
    "section": "Thực hành · Chạy và phân tích trace",
    "seconds": 100,
    "paragraphs": [
      "Sau khi có kịch bản hoàn chỉnh, bước tiếp theo là chạy và xác nhận đầu ra. Với ví dụ có dây hiện tại, lệnh chạy cần tên file, loại hàng đợi và seed, chẳng hạn ns wired.tcl DropTail 1. Ta chạy tiếp RED với cùng seed, rồi dùng AWK đọc đúng trace tương ứng. Tên file phải khớp cấu hình, tránh lấy kết quả cũ để phân tích một lần chạy mới.",
      "Vòng lặp trên slide thực hiện 10 seed cho mỗi loại hàng đợi và lưu kết quả riêng. Trước khi tổng hợp, cần kiểm tra lệnh có kết thúc bình thường không, trace có dữ liệu không và các loại sự kiện dự kiến có xuất hiện không. File tồn tại nhưng rỗng, hoặc thiếu hoàn toàn sự kiện của một luồng, đều là dấu hiệu cần kiểm tra lại.",
      "NAM giúp quan sát tô-pô, gói tin và chuyển động. Ta có thể tạm dừng ở thời điểm đứt đường để giải thích diễn biến. Tuy nhiên, hình động chỉ hỗ trợ quan sát; thông lượng, độ trễ hay mất gói vẫn phải tính từ dữ liệu ghi vết. Đồ thị theo thời gian còn giúp thấy phần biến động bị che khi chỉ báo cáo trung bình.",
      "Để so sánh có thể truy lại, mỗi kết quả nên đi kèm tên kịch bản, loại hàng đợi, seed và khoảng đo. Với 10 seed cho hai cấu hình, ta có 20 lần chạy, không phải một lần chạy rồi sao chép kết quả. Sau đó ghép kết quả cùng seed để xem chênh lệch. Nếu một lần chạy lỗi, cần xử lý rõ ràng trước khi lấy trung bình, không tự thay bằng số không.",
      "Nếu chưa thấy gói, hãy kiểm tra lịch bắt đầu ứng dụng; nếu không dừng, kiểm tra lịch finish; nếu trace thiếu, kiểm tra việc bật trace, đóng file và lỗi khi chạy. Các dấu hiệu này gợi ý hướng chẩn đoán, không xác định duy nhất một nguyên nhân."
    ],
    "cues": [
      "Đọc một lệnh chạy hoàn chỉnh với DropTail và seed 1.",
      "Tách rõ vai trò: NAM để quan sát, trace để tính chỉ số."
    ],
    "transition": "Muốn viết bộ phân tích đúng, trước hết cần hiểu một dòng trace đang mô tả sự kiện nào."
  },
  {
    "slide": 19,
    "title": "Đọc trace — phân biệt sự kiện, liên kết và đầu cuối",
    "speaker": "Minh",
    "section": "Thực hành · Chạy và phân tích trace",
    "seconds": 100,
    "paragraphs": [
      "Một gói đi qua nhiều liên kết có thể tạo ra nhiều dòng trace. Ở định dạng có dây trên slide, dấu cộng là vào hàng đợi, dấu trừ là ra hàng đợi, chữ r là nhận và chữ d là bị loại. Vì vậy, đếm tất cả các dòng r sẽ đếm cả những lần nhận tại bộ định tuyến trung gian, không phải số gói đến đích cuối.",
      "Cột from và to chỉ hai đầu của liên kết đang được ghi vết. Cột nguồn và đích ở phía sau mới mô tả địa chỉ đầu cuối. Flow ID giúp nhóm Web, FTP, VoIP và Video; UID giúp nhận ra cùng một gói qua nhiều sự kiện. Ta phải kết hợp các trường này thay vì chỉ dựa vào một ký hiệu nhận gói.",
      "Ví dụ UID 56 xuất hiện liên tiếp khi gói qua từng chặng. Còn dòng d của luồng Video cho biết một sự kiện bị loại tại r1–r2. Các gói định tuyến cũng có mặt trong trace, nên bộ phân tích phải quyết định rõ có tính chúng vào chỉ số đang đo hay không. ACK cùng flow ID với TCP sẽ được tính chung nếu không lọc riêng.",
      "Một phép kiểm tra đơn giản là chọn một UID cụ thể rồi lần theo toàn bộ các dòng của nó. Ta tìm thời điểm xuất hiện ở nguồn, các chặng trung gian và lần nhận ở đích. Nếu bộ phân tích báo nhận ba gói trong khi cả ba dòng đều là cùng UID ở ba chặng, bộ lọc đã đếm sai điểm quan sát. Cách kiểm tra thủ công một vài gói giúp phát hiện lỗi trước khi xử lý cả file.",
      "Ở trace không dây còn có tầng AGT, RTR hoặc MAC. Đo đầu cuối thường lọc tại AGT để tránh đếm nhiều tầng. Trong mẫu đang hiển thị, AGT nằm ở cột thứ tư; không được áp dụng máy móc điều kiện cột thứ ba mà chưa kiểm tra định dạng file thật."
    ],
    "cues": [
      "Lần theo UID 56 qua nhiều dòng để minh họa nguy cơ đếm trùng.",
      "Chỉ vị trí AGT ở mẫu không dây: cột thứ tư."
    ],
    "transition": "Từ cách đọc đúng sự kiện và đầu cuối, em chuyển sang tính số gửi, số nhận và thông lượng."
  },
  {
    "slide": 20,
    "title": "AWK — thông lượng, mất gói và giới hạn cách đếm",
    "speaker": "Minh",
    "section": "Thực hành · Chạy và phân tích trace",
    "seconds": 120,
    "paragraphs": [
      "Đoạn AWK bắt đầu bằng việc chỉ giữ bốn flow ID của lưu lượng cần khảo sát. Với mỗi UID, lần vào hàng đợi đầu tiên được lưu làm mốc gửi. Khi thấy gói được nhận tại một nút đầu cuối, chương trình tăng số nhận và cộng số byte. Mục đích là ghép được một lần gửi với lần nhận của cùng gói, thay vì cộng tất cả các chặng.",
      "Thông lượng ở đây lấy tổng byte nhận nhân tám, đổi sang megabit, rồi chia cho khoảng từ lần nhận đầu đến lần nhận cuối của luồng. Mẫu số này không nhất thiết bằng toàn bộ 60 giây mô phỏng. Khi so sánh hai bảng, cần dùng cùng quy ước thời gian; đồng thời xử lý trường hợp không nhận được gói hoặc chỉ có một mốc nhận.",
      "Tỉ lệ mất được tính từ số gửi trừ số nhận, chia số gửi. Số sự kiện drop lại là phép đếm riêng trên đường truyền và được chia thành ba giai đoạn. Hai đại lượng có thể khác nhau, vì còn có gói đang trên đường khi dừng, truyền lại và cách nhận diện gói. Không nên dùng chúng như hai tên gọi của cùng một phép đo.",
      "Ví dụ tính riêng để hiểu đơn vị: nếu đích nhận được 100.000 byte trong khoảng đo 2 giây, thông lượng là 100.000 nhân 8 chia 2, bằng 400.000 bit mỗi giây hay 0,4 megabit mỗi giây. Nếu cùng lượng byte đó nhưng chia cho 4 giây, kết quả chỉ còn 0,2. Vì vậy, so sánh thông lượng chỉ có ý nghĩa khi quy ước khoảng đo thống nhất.",
      "Ví dụ khác, có 1.000 gói hợp lệ gửi đi và 950 gói duy nhất nhận tại đích sau khi đã xét hết khoảng quan sát: PDR là 95%, tỉ lệ chưa nhận là 5%. Nếu đếm thêm bản ghi trung gian hoặc gói trùng, số nhận có thể sai và thậm chí vượt số gửi. Với TCP, UID gói mô phỏng cũng không tự đồng nhất với lượng dữ liệu ứng dụng duy nhất, nên cần phân biệt thông lượng gói và goodput.",
      "Bộ lọc trên slide tính chung ACK với dữ liệu TCP. Do đó, thông lượng này không đồng nghĩa với lượng dữ liệu ứng dụng hữu ích. Muốn đánh giá goodput phải lọc thêm theo mục tiêu. Các đối chiếu chi tiết với LossMonitor cũng cần trace gốc; hiện ta chỉ đang giải thích cách tính được trình bày."
    ],
    "cues": [
      "Nhấn mẫu số là khoảng nhận đầu–cuối của luồng.",
      "Phân biệt ba khái niệm: packet loss, sự kiện drop và dữ liệu hữu ích."
    ],
    "transition": "Thông lượng cho biết lượng dữ liệu nhận được; trang sau bổ sung thời gian chờ và độ đều của quá trình nhận."
  },
  {
    "slide": 21,
    "title": "AWK — độ trễ và jitter theo từng kết nối",
    "speaker": "Minh",
    "section": "Thực hành · Chạy và phân tích trace",
    "seconds": 120,
    "paragraphs": [
      "Độ trễ của một gói được tính bằng thời điểm nhận trừ thời điểm gửi đã lưu theo UID. Sau đó cộng các độ trễ hợp lệ và chia số gói nhận để lấy trung bình. Trace dùng đơn vị giây nên phép nhân một nghìn đưa kết quả sang mili giây. Đây là trung bình trên những gói nhận được, không mô tả thời gian chờ của những gói đã mất.",
      "Jitter trả lời một câu hỏi khác: độ trễ có thay đổi nhiều giữa các gói không? Hai luồng có thể cùng độ trễ trung bình nhưng một luồng đến đều, luồng kia lúc nhanh lúc chậm. Với thoại và video thời gian thực, sự không đều này khiến bên nhận cần cơ chế đệm để phát lại ổn định.",
      "Công thức trên slide lấy chênh lệch giữa khoảng cách thời gian nhận và khoảng cách thời gian gửi của hai gói liên tiếp, rồi lấy trị tuyệt đối. Giá trị J được cập nhật dần với hệ số một phần mười sáu. Trong bộ tính này, jitter trung bình là trung bình các giá trị J đã cập nhật, nên cần ghi rõ quy ước khi đối chiếu với cách tính khác.",
      "Ví dụ, gói thứ nhất gửi ở 1,000 giây và nhận ở 1,050 giây thì trễ là 50 mili giây. Gói thứ hai gửi ở 1,020 và nhận ở 1,090 thì trễ là 70 mili giây. Chênh lệch giữa hai độ trễ là 20 mili giây. Nếu J trước đó là 0, bước cập nhật J cộng một phần mười sáu của chênh lệch này sẽ cho 1,25 mili giây. J là giá trị làm mượt, không bằng ngay chênh lệch 20 mili giây.",
      "Ví dụ này chỉ minh họa phép tính. Khi áp dụng công thức kiểu RFC 3550, các mốc thời gian phải cùng đơn vị và gói được xét theo thứ tự đến trong từng luồng phù hợp. Nếu chương trình lấy trung bình các giá trị J qua cả lần chạy, đó là một phép tổng hợp bổ sung; cần phân biệt với J tại một thời điểm báo cáo.",
      "Điểm quan trọng là giữ trạng thái riêng cho từng cặp nguồn–đích trong mỗi flow ID. VoIP có nhiều cuộc gọi và hai chiều; trộn tất cả thành một chuỗi sẽ ghép nhầm các gói. Chỉ tính ở đầu cuối cũng giúp tránh việc một gói bị tính lặp theo từng chặng."
    ],
    "cues": [
      "Dùng ví dụ ngắn: cùng trễ trung bình nhưng một luồng đến đều, một luồng thất thường.",
      "Nhấn khóa gồm flow ID, nguồn và đích, không chỉ flow ID."
    ],
    "transition": "Phần trích xuất dữ liệu của em kết thúc tại đây. Em mời bạn Đạt tổng hợp các chỉ số và phân tích những kết quả trên slide."
  },
  {
    "slide": 22,
    "title": "Chọn chỉ số theo mục tiêu đánh giá",
    "speaker": "Đạt",
    "section": "Đánh giá · Chỉ số và kết quả",
    "seconds": 100,
    "paragraphs": [
      "Từ dữ liệu bạn Minh vừa trình bày, em tổng hợp các chỉ số cần xem cùng nhau. Thông lượng cho biết lượng dữ liệu nhận trong một đơn vị thời gian. Độ trễ nói về thời gian một gói đi đến đích; jitter nói về mức biến thiên của thời gian đó. Với tải tệp, thông lượng thường được chú ý nhiều; với thoại, độ trễ và jitter cũng rất quan trọng.",
      "PDR là số gói nhận chia số gói gửi, còn tỉ lệ mất là phần gửi nhưng không nhận được trong phạm vi quan sát. Hai tỉ lệ bù nhau thành một trăm phần trăm chỉ khi dùng cùng tập gói, cùng thời gian và cùng cách xử lý trùng lặp. Vì vậy, một con số PDR cao vẫn cần đi kèm định nghĩa phép đếm.",
      "Overhead định tuyến cho biết lượng gói điều khiển so với gói dữ liệu theo quy ước trên bảng. Nó giúp đánh giá chi phí tìm và duy trì đường. Số drop theo giai đoạn lại cho thấy vấn đề tập trung lúc nào, chẳng hạn trước sự cố, trong khoảng đường chính đứt hay sau khi phục hồi.",
      "Hai mạng có thể cùng PDR 95% nhưng trải nghiệm rất khác. Ở mạng thứ nhất, gói mất rải rác; ở mạng thứ hai, nhiều gói liên tiếp mất đúng lúc chuyển tuyến. Với thoại, khoảng mất liên tục có thể đáng chú ý hơn cùng số gói mất phân tán. Tương tự, độ trễ trung bình thấp vẫn có thể che một số gói trễ rất lớn, nên đồ thị theo thời gian và phân bố trễ giúp đọc kết quả đầy đủ hơn.",
      "Không có một chỉ số duy nhất đại diện cho mọi mục tiêu. Tăng thông lượng nhưng làm thoại trễ hơn chưa chắc là cải thiện phù hợp. Khi báo cáo, nên kèm cấu hình, khoảng đo, kết quả nhiều seed và mức biến động. Trung bình nhiều lần chạy hữu ích, nhưng tự nó chưa đủ để kết luận khác biệt có ý nghĩa thống kê."
    ],
    "cues": [
      "Nhóm chỉ số thành lượng dữ liệu, thời gian và độ tin cậy.",
      "Dừng một nhịp ở ý: cần đánh giá nhiều chỉ số cùng nhau."
    ],
    "transition": "Với các quy ước này, em sẽ đọc bảng kết quả và chỉ ra những đánh đổi thay vì chỉ chọn các con số tốt hơn."
  },
  {
    "slide": 23,
    "title": "Đọc kết quả — phân biệt quan sát và kết luận",
    "speaker": "Đạt",
    "section": "Đánh giá · Chỉ số và kết quả",
    "seconds": 115,
    "paragraphs": [
      "Các con số em phân tích ở đây là số liệu được trình bày trên slide. Trong repo hiện tại chưa có bộ trace gốc và kết quả từng lần chạy để kiểm chứng độc lập. Vì vậy, phần này diễn giải bảng đang có; chưa khẳng định nhóm đã tái chạy và xác nhận toàn bộ các phép đo.",
      "Ở mạng có dây, bảng ghi trung bình 10 seed. Khi chuyển DropTail sang RED, độ trễ TCP từ 43,1 xuống 32,2 mili giây, còn UDP từ 55,3 xuống 43,9. Nhưng thông lượng TCP cũng giảm từ 3,181 xuống 2,644 megabit mỗi giây. Jitter UDP giữ ở mức 1,57 mili giây, còn tỉ lệ mất TCP tăng từ 0,28 lên 0,55 phần trăm.",
      "Như vậy, bảng cho thấy giảm trễ đi cùng sự đánh đổi ở thông lượng và mất gói. Cơ chế loại gói sớm của RED là một hướng giải thích cần đối chiếu với trace. Chỉ từ bảng trung bình, ta chưa xác định đầy đủ nguyên nhân hay mức chắc chắn của khác biệt. Nhớ rằng nhóm TCP ở đây có tính cả ACK.",
      "Ta thử tính mức giảm trễ TCP: lấy 43,1 trừ 32,2, được 10,9 mili giây; chia cho mức ban đầu 43,1 thì giảm khoảng 25,3%. Trong khi đó, thông lượng giảm khoảng 16,9%. Hai phép tính cùng xuất phát từ bảng nhưng mô tả hai mặt khác nhau. Nếu ưu tiên phản hồi nhanh, giảm trễ có thể có ích; nếu ưu tiên hoàn tất truyền tệp, giảm thông lượng lại cần được xem xét.",
      "Với số liệu không dây, PDR TCP 100% chỉ nên được hiểu theo tập gói và quy tắc đếm đã dùng. Nó không có nghĩa mọi lần truyền trên đường vô tuyến đều thành công ngay lần đầu. Muốn giải thích sâu, cần kiểm tra truyền lại, thời gian hoàn tất, gói điều khiển và cách bộ phân tích nhận diện gói nhận.",
      "Ở mạng không dây, bảng ghi PDR TCP là 100 phần trăm và UDP là 33,15 phần trăm; độ trễ UDP khoảng 3,2 giây. Đây là dấu hiệu cần kiểm tra kỹ kịch bản, cách đếm và thời gian đo. TCP có truyền lại nhưng con số PDR này không chứng minh TCP luôn đạt 100 phần trăm, cũng không chứng minh di động là nguyên nhân duy nhất."
    ],
    "cues": [
      "Đọc hai cặp số độ trễ rồi một cặp thông lượng để làm rõ đánh đổi.",
      "Giữ cách nói: theo số liệu trên slide, trong kịch bản này."
    ],
    "transition": "Từ các dấu hiệu đó, em chuyển sang những tham số có thể điều chỉnh và cách kiểm chứng từng đề xuất."
  },
  {
    "slide": 24,
    "title": "Đề xuất cải tiến — đặt giả thuyết để kiểm chứng",
    "speaker": "Đạt",
    "section": "Đánh giá · Cải tiến hiệu năng",
    "seconds": 100,
    "paragraphs": [
      "Các giải pháp trên trang này nên được hiểu là giả thuyết cần thử nghiệm. Với mạng có dây, đổi sang RED hoặc điều chỉnh ngưỡng RED có thể thay đổi cách hàng đợi phản ứng khi tải tăng. Tăng giới hạn hàng đợi có thể giữ được nhiều gói hơn, nhưng cũng có nguy cơ làm thời gian chờ dài hơn. Không nên mặc định hàng đợi càng lớn càng tốt.",
      "Nếu drop tập trung trong khoảng 25 đến 40 giây, một hướng khác là xem lại năng lực đường dự phòng. Cần nhớ đường qua r3 có hai chặng; tăng riêng r1–r3 mà giữ r3–r2 ở 2 megabit mỗi giây vẫn có thể để lại nút nghẽn. Muốn đánh giá tác dụng, phải ghi rõ chặng nào được thay đổi.",
      "Với mạng không dây, slide đề xuất đổi AODV sang DSR, giảm tốc độ di động và giảm tải CBR. Mỗi thay đổi tác động đến một khía cạnh khác nhau: tìm đường, mức thay đổi tô-pô hoặc mức cạnh tranh tài nguyên. Hiệu quả của DSR phụ thuộc kịch bản; không thể suy ra nó luôn ít overhead hoặc luôn tốt hơn AODV.",
      "Một kế hoạch kiểm chứng cụ thể là giữ nguyên tô-pô, tải và lịch sự cố, chỉ đổi hàng đợi; sau đó giữ hàng đợi và chỉ đổi năng lực đường dự phòng. Với mạng không dây, thử riêng việc giảm tải, riêng việc giảm tốc độ di chuyển và riêng việc đổi giao thức trước khi kết hợp. Mỗi lượt so sánh trả lời một câu hỏi cụ thể, giúp phân biệt tác dụng của từng thay đổi.",
      "Tăng công suất phát cũng cần thận trọng vì vừa tác động khả năng kết nối vừa có thể tăng phạm vi gây nhiễu. Đoạn lệnh minh họa phải được kiểm tra theo mô hình NS-2 sử dụng. Để tìm nguyên nhân, nên đổi từng yếu tố, giữ các yếu tố còn lại ổn định, rồi mới khảo sát cấu hình kết hợp."
    ],
    "cues": [
      "Gọi các giải pháp là hướng thử nghiệm, không gọi là kết quả đã chứng minh.",
      "Chỉ cả hai chặng dự phòng khi giải thích nâng băng thông."
    ],
    "transition": "Trang tiếp theo đối chiếu các con số trước và sau, đồng thời cho thấy vì sao cần phân biệt phần trăm với điểm phần trăm."
  },
  {
    "slide": 25,
    "title": "So sánh trước–sau — đọc đúng mức cải thiện",
    "speaker": "Đạt",
    "section": "Đánh giá · Cải tiến hiệu năng",
    "seconds": 120,
    "paragraphs": [
      "Theo số liệu trên slide, mạng có dây giữ queue-limit là 50 và đổi DropTail sang RED. Độ trễ của bốn loại lưu lượng đều giảm, nhưng thông lượng FTP từ 2,944 xuống 2,405 megabit mỗi giây, tương ứng khoảng 18,3 phần trăm. Tỉ lệ mất FTP từ 0,18 lên 0,44 phần trăm, còn Video từ 1,05 lên 1,59 phần trăm.",
      "Vì thế, kết quả cần được mô tả là một sự đánh đổi, phù hợp hay không còn tùy yêu cầu dịch vụ. Ký hiệu gần bằng và ghi chú kiểm định trên slide chưa thể được xác minh khi thiếu kết quả từng seed. Khi trình bày, em chỉ nêu các mức được báo cáo, không khẳng định đã kiểm tra lại ý nghĩa thống kê.",
      "Ở mạng không dây, bảng thay đồng thời giao thức định tuyến, tốc độ di động và tải UDP. PDR UDP tăng từ 33,15 lên 65,84 phần trăm: chênh lệch đúng là 32,69 điểm phần trăm. Không nên đọc thành tăng tương đối 32,69 phần trăm. Tải đặt giảm một nửa, còn thông lượng nhận gần như giữ nguyên, nên PDR tăng không đồng nghĩa lượng dữ liệu nhận tăng gấp đôi.",
      "Để thấy vì sao phải phân biệt phần trăm và điểm phần trăm: từ 33,15% lên 65,84% là tăng 32,69 điểm phần trăm; nếu tính tương đối so với ban đầu thì tăng khoảng 98,6%. Nhưng đó là tỉ lệ giao thành công, không phải lượng dữ liệu nhận. Minh họa với cùng kích thước gói: 1.000 gói gửi ở tỉ lệ 33,15% cho kỳ vọng khoảng 331,5 gói nhận; giảm số gửi còn 500 và đạt 65,84% thì khoảng 329,2. Các số lẻ là minh họa theo tỉ lệ, không phải số đếm gói thực tế.",
      "Vì vậy, câu kết luận phù hợp là cấu hình mới trong bảng đạt tỉ lệ giao tốt hơn dưới tải phát thấp hơn, trong khi thông lượng UDP nhận gần như giữ nguyên. Nếu muốn nói mạng có khả năng chở nhiều dữ liệu hơn, cần thêm thí nghiệm giữ cùng tải đầu vào và tăng tải có kiểm soát để tìm giới hạn.",
      "Độ trễ UDP giảm khoảng 29,8 phần trăm và jitter giảm 18,4 phần trăm, nhưng độ trễ TCP tăng khoảng 25 phần trăm. Do thay ba biến cùng lúc, ta chỉ mô tả kết quả của cấu hình kết hợp; chưa tách được đóng góp riêng của DSR, giảm tốc độ hay giảm tải."
    ],
    "cues": [
      "Nhấn cách đọc: tăng 32,69 điểm phần trăm.",
      "Chỉ ba hàng thay đổi đầu vào trước khi nói đến kết quả không dây."
    ],
    "transition": "Từ phần so sánh này, em mời bạn Thành dẫn phần thực hành để nhóm kiểm tra lại quy trình trên một kịch bản chạy thực tế."
  },
  {
    "slide": 26,
    "title": "Thực hành và demo — nối mô hình với bằng chứng",
    "speaker": "Thành",
    "section": "Thực hành · Demo và tổng kết",
    "seconds": 100,
    "paragraphs": [
      "Phần thực hành giúp nối toàn bộ quy trình: chuẩn bị môi trường, xây dựng mạng, chạy mô phỏng, phân tích trace và đối chiếu cấu hình. Trước buổi demo, cần chuẩn bị kịch bản chạy được, công cụ phân tích và file đầu ra. Trong repo hiện tại, các đoạn mã nằm trong slide; chưa có sẵn bộ tệp Tcl, AWK và trace để coi là một demo đã kiểm chứng.",
      "Slide này còn chứa bài tập mạng có dây đơn giản bốn nút với nút cổ chai 2 megabit mỗi giây. Đây là bài tập thu nhỏ, khác ví dụ 11 nút ở phần trước. Nếu demo theo ví dụ đang phân tích, phải dùng r1–r2, tốc độ 5 megabit mỗi giây và lệnh có đủ loại hàng đợi cùng seed; không trộn hai cấu hình.",
      "Trình tự demo là chạy kịch bản, kiểm tra trace, mở NAM nếu đã bật ghi hoạt ảnh, rồi quan sát một sự kiện cụ thể. Sau đó dùng AWK đưa ra số liệu và giải thích cách tính. Nếu thay đổi tham số, lưu kết quả lần trước riêng để việc so sánh có thể truy lại được.",
      "Lời dẫn khi demo có thể là: trước tiên em chỉ cấu hình đầu vào và dự đoán chỗ có thể nghẽn; tiếp theo em chạy kịch bản; sau đó em mở trace hoặc kết quả phân tích để kiểm tra dự đoán. Khi thay một tham số, em nói rõ kỳ vọng trước khi chạy lại. Nếu kết quả khác kỳ vọng, em kiểm tra cấu hình, khoảng đo và dữ liệu thay vì sửa lời giải thích để khớp với con số.",
      "Với mạng không dây, cần cho thấy lịch di chuyển và đường truyền thay đổi, rồi đối chiếu với dữ liệu đầu cuối. Khi chưa chạy trực tiếp, ta trình bày đây là kế hoạch thực hành. Một demo có ý nghĩa phải cho thấy cả thao tác, đầu vào và bằng chứng đầu ra, thay vì chỉ có hình động."
    ],
    "cues": [
      "Nói rõ bài tập bốn nút khác ví dụ chính 11 nút.",
      "Nếu không có môi trường chạy, dùng lời dẫn kế hoạch demo; không kể như đã chạy."
    ],
    "transition": "Phần thực hành của em đến đây là hết. Em mời bạn Long tổng kết lại kiến thức và cùng nhóm trả lời câu hỏi."
  },
  {
    "slide": 27,
    "title": "Tổng kết — mô hình, dữ liệu và cách kết luận",
    "speaker": "Long",
    "section": "Tổng kết · Kiến thức trọng tâm",
    "seconds": 65,
    "paragraphs": [
      "Bài trình bày có ba ý chính. Thứ nhất, NS-2 mô phỏng mạng bằng các sự kiện theo thời gian. Sáu bước xây dựng kịch bản tạo nên mô hình; chạy và phân tích giúp chuyển mô hình thành kết quả có thể đánh giá.",
      "Thứ hai, NAM hỗ trợ quan sát, còn trace là cơ sở tính thông lượng, độ trễ, jitter và PDR. Muốn số liệu có ý nghĩa, phải xác định đúng đầu cuối, loại gói và khoảng thời gian đo.",
      "Nếu phải vận dụng vào một bài mới, nhóm sẽ bắt đầu bằng câu hỏi nghiên cứu, lập bảng tham số, tạo kịch bản có thể chạy lại, kiểm tra trace rồi mới tính chỉ số. Sau cùng, nhóm so sánh theo cùng quy ước và nêu rõ giới hạn. Quy trình này giúp một kết quả mô phỏng có thể được giải thích và kiểm tra, thay vì chỉ là một bảng số đẹp.",
      "Thứ ba, tối ưu luôn gắn với mục tiêu và đánh đổi. Kết luận cần giới hạn trong cấu hình đã khảo sát, có dữ liệu kiểm chứng và tránh quy nguyên nhân cho một tham số khi nhiều tham số thay đổi cùng lúc. Các tài liệu trên slide là nguồn để tiếp tục tìm hiểu."
    ],
    "cues": [
      "Nói chậm ba ý: mô hình, đo đúng, kết luận có căn cứ."
    ],
    "transition": "Phần trình bày của nhóm đến đây là hết. Em xin chuyển sang phần cảm ơn và trao đổi."
  },
  {
    "slide": 28,
    "title": "Cảm ơn và điều phối hỏi đáp",
    "speaker": "Long",
    "section": "Kết thúc · Hỏi đáp",
    "seconds": 60,
    "paragraphs": [
      "Nhóm em xin cảm ơn thầy và các bạn đã lắng nghe phần trình bày về mô phỏng và đánh giá hiệu năng mạng với NS-2. Nhóm rất mong nhận được câu hỏi và góp ý để hoàn thiện cách xây dựng thí nghiệm cũng như diễn giải kết quả.",
      "Ở phần trao đổi, em sẽ tiếp nhận câu hỏi và mời bạn phụ trách nội dung trả lời: Minh về ghi vết và phân tích, Bảo về mô hình và ví dụ có dây, Thành về kết nối và ví dụ không dây, Đạt về lưu lượng, chỉ số và đánh giá.",
      "Khi nhận câu hỏi, nhóm sẽ làm rõ người hỏi đang nói tới mô hình, cách đo hay kết luận. Chẳng hạn, câu hỏi vì sao RED giảm trễ thuộc cơ chế hàng đợi; câu hỏi vì sao PDR bằng 100% cần kiểm tra cách đếm và dữ liệu. Tách đúng loại câu hỏi giúp người phụ trách trả lời vào trọng tâm.",
      "Với câu hỏi cần dữ liệu gốc hoặc chạy lại, nhóm sẽ nói rõ phần cần kiểm chứng thay vì suy đoán. Một lần nữa, nhóm em xin cảm ơn."
    ],
    "cues": [
      "Nhìn về phía lớp, dừng và chờ câu hỏi.",
      "Nhắc lại ngắn câu hỏi trước khi chuyển cho người phụ trách."
    ],
    "transition": "Mời thầy và các bạn đặt câu hỏi; Long điều phối, người phụ trách phần liên quan trả lời."
  }
];
