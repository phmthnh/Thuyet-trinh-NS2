# Mô phỏng mạng với NS-2

Bài thuyết trình về mô phỏng **mạng có dây và mạng không dây với NS-2**, gồm 28 slide và kịch bản dành cho 5 thành viên. Website hỗ trợ đọc lời thuyết trình, luyện tập theo phần được phân công và đồng bộ slide giữa màn hình chiếu với thiết bị của người nói.

**[Mở bài chiếu](https://phmthnh.github.io/Thuyet-trinh-NS2/)** · **[Mở kịch bản thuyết trình](https://phmthnh.github.io/Thuyet-trinh-NS2/speaker.html)**

## Nội dung bài thuyết trình

| Phần | Nội dung chính |
| --- | --- |
| Tổng quan | NS-2, kiến trúc C++/OTcl và quy trình mô phỏng |
| Thiết lập mô phỏng | Bộ lập lịch sự kiện, ghi vết, tô-pô mạng, mô hình lỗi và định tuyến |
| Giao vận và lưu lượng | TCP/UDP, nguồn sinh lưu lượng và thời gian mô phỏng |
| Ví dụ minh họa | Kịch bản mạng có dây và mạng không dây ad-hoc |
| Phân tích kết quả | Đọc trace, dùng AWK, tính thông lượng, mất gói, độ trễ và jitter |
| Thực hành | So sánh DropTail/RED, điều chỉnh tham số và hướng dẫn demo |

Repo chứa website thuyết trình và các đoạn mã minh họa trong slide. Các tệp `.tcl`, `.awk`, trace `.tr` và dữ liệu `.nam` chưa được lưu thành tệp riêng trong repo; chưa có trace gốc để kiểm chứng lại các bảng kết quả trong bài.

## Tính năng

- **Trình chiếu:** điều hướng bằng bàn phím, nút bấm hoặc vuốt ngang; mở toàn màn hình và liên kết đến từng slide.
- **Đọc kịch bản:** xem slide cùng lời nói, gợi ý và câu chuyển tiếp; chỉnh cỡ chữ, phóng to hoặc thu gọn phần xem trước trên điện thoại.
- **Luyện tập theo thành viên:** lọc phần phụ trách, mở mục lục hoặc nhảy trực tiếp đến slide.
- **Chỉnh lời nói:** soạn nội dung và lưu trên trình duyệt; xuất TXT, nhập/xuất bản nháp JSON để chuyển sang thiết bị khác.
- **Đồng bộ trình chiếu:** dùng hai cửa sổ trên cùng máy hoặc ghép điện thoại bằng QR/mã phòng, với quyền xem và điều khiển riêng.

## Bắt đầu sử dụng

Mở **bài chiếu** để trình bày trước lớp, hoặc mở **kịch bản thuyết trình** để luyện tập và đọc lời nói. Bật JavaScript trên trình duyệt để sử dụng các chức năng này.

### Điều khiển bài chiếu

| Phím / thao tác | Chức năng |
| --- | --- |
| `→`, `PageDown`, `Space` | Sang slide tiếp theo |
| `←`, `PageUp` | Quay lại slide trước |
| `Home` / `End` | Đến slide đầu / cuối |
| `F` | Bật / tắt toàn màn hình |
| Vuốt ngang hoặc bấm `‹` / `›` | Chuyển slide |

Có thể mở thẳng một slide bằng liên kết có số ở cuối, ví dụ: [slide 14](https://phmthnh.github.io/Thuyet-trinh-NS2/#14). Với slide dài, cuộn bên trong slide để xem hết nội dung.

Trên trang kịch bản, dùng **Lùi / Tiến**, **Đến slide** hoặc **Mục lục**. Chọn tên ở **Phần của** để tập riêng phần mình; chọn **Tất cả** để đi theo thứ tự toàn bài. Khi nhận lệnh từ máy chiếu hoặc nhảy bằng **Đến slide**, trang chuyển về chế độ tất cả.

### Trình bày với hai màn hình trên cùng máy

1. Mở trang kịch bản, chọn **⇄ Kết nối → Mở màn hình chiếu trên máy này ↗**.
2. Chọn chế độ **Extend** của Windows, rồi kéo cửa sổ bài chiếu sang màn hình thứ hai hoặc máy chiếu.
3. Nhấn **F** trong cửa sổ bài chiếu; giữ trang kịch bản ở màn hình của người nói.
4. Chuyển slide từ một trong hai cửa sổ để cửa sổ còn lại đồng bộ theo.

Hai trang cần cùng trình duyệt, cùng hồ sơ và cùng nguồn URL để đồng bộ qua `BroadcastChannel`. Mở riêng bài chiếu và trang kịch bản từ hai dấu trang cũng hỗ trợ tự ghép. Nên đóng các tab bài chiếu không dùng để tránh bắt cặp nhầm.

### Dùng điện thoại điều khiển máy chiếu

1. Trên máy tính, mở bài chiếu và chọn **⇄ → Tạo phòng · Hiện QR**.
2. Trên điện thoại, quét QR hoặc mở trang kịch bản, chọn **⇄ Kết nối** và nhập mã phòng **6 số**. Có thể dán toàn bộ liên kết ghép.
3. Đặt tên thiết bị, chọn **Gửi yêu cầu kết nối**.
4. Trên máy chiếu, đối chiếu tên thiết bị và mã xác nhận **4 số**, rồi chọn **Chấp nhận điều khiển** hoặc **Chỉ cho xem**.
5. Khi điện thoại xác nhận đã nhận slide, đóng hộp kết nối và bắt đầu trình bày. Giữ trang máy chiếu mở trong suốt buổi.

Slide và vị trí cuộn được đồng bộ giữa các thiết bị đã duyệt. Chủ phòng có thể đổi quyền, ngắt thiết bị hoặc **Khóa nhận thiết bị mới**; phòng hỗ trợ tối đa 5 thiết bị đã duyệt và 3 yêu cầu chờ. Yêu cầu chưa duyệt hết hạn sau 60 giây.

Kết nối điện thoại cần Internet và sử dụng PeerJS/WebRTC. Nếu ghép thất bại, mở **Kiểm tra mạng / TURN tùy chọn**, thử cùng Wi-Fi hoặc điểm phát sóng; có thể nhập cấu hình TURN riêng trên hai thiết bị rồi ghép lại. Kết nối phụ thuộc điều kiện mạng, đặc biệt khi WebRTC bị chặn hoặc NAT hạn chế. Cấu hình TURN chỉ lưu trong `sessionStorage` của tab.

Mã phòng giúp tìm phòng; quyền xem hoặc điều khiển được cấp tại máy chiếu. Đóng phòng hoặc tải lại máy chiếu sẽ xóa các quyền đã cấp, nên cần ghép và duyệt lại.

## Phân công nhóm

| Thành viên | Nội dung phụ trách | Slide |
| --- | --- | --- |
| Long | Bộ lập lịch sự kiện; mở đầu, tổng kết và hỏi đáp | 1–6, 27–28 |
| Minh | Ghi vết sự kiện; chạy mô phỏng, đọc trace và phân tích AWK | 7, 18–21 |
| Bảo | Tô-pô, mô hình lỗi, định tuyến và ví dụ mạng có dây | 8–10, 14–15 |
| Thành | TCP/UDP, ví dụ mạng không dây và hướng dẫn demo | 11, 16–17, 26 |
| Đạt | Nguồn lưu lượng, thời gian mô phỏng, chỉ số và cải tiến hiệu năng | 12–13, 22–25 |

Thời lượng gợi ý của kịch bản hiện tại là khoảng **45 phút 45 giây**, chưa gồm thời gian chạy demo và hỏi đáp. Đây là ước tính để luyện tập, chưa phải thời gian trình bày được bấm giờ. Các mục 4.4.1–4.4.6 trên trang kịch bản được ghép theo nội dung và phân công hiện có; repo chưa chứa giáo trình để đối chiếu.

## Chỉnh sửa và chia sẻ kịch bản

Trên trang kịch bản, chọn **Sửa** để chỉnh lời nói, gợi ý và câu chuyển tiếp của slide hiện tại. Trình soạn hỗ trợ in đậm, in nghiêng, danh sách, hoàn tác/làm lại, đếm từ và xem trước.

| Thao tác | Kết quả |
| --- | --- |
| **Lưu nội dung** | Lưu bản chỉnh sửa trong trình duyệt đang dùng |
| **Xuất bản nháp JSON** | Tải bản nháp để sao lưu hoặc chuyển sang thiết bị khác |
| **Nhập bản nháp JSON** | Gộp bản nháp vào dữ liệu hiện có; slide trùng số dùng nội dung nhập |
| **Tải toàn bộ kịch bản (.txt)** | Xuất lời nói, gợi ý và câu chuyển tiếp, bao gồm nội dung đã chỉnh |
| **Dùng lời gốc** | Khôi phục nội dung gốc của slide đang sửa |

Nội dung chỉnh trên trình duyệt không tự ghi vào GitHub hoặc đồng bộ sang thiết bị khác. Hãy xuất JSON trước khi xóa dữ liệu trình duyệt hay chuyển máy. Sau khi lời gốc trong repo được cập nhật, dùng **Sửa → Dùng lời gốc** ở từng slide nếu muốn thay bản chỉnh riêng bằng nội dung mới.

## Chạy tại máy

Cần Git để tải repo và Python 3 để mở máy chủ tĩnh. Không có bước cài npm hay build website; không cần cài NS-2 để xem bài chiếu.

```powershell
git clone https://github.com/phmthnh/Thuyet-trinh-NS2.git
cd Thuyet-trinh-NS2
python -m http.server 8766 --bind 127.0.0.1
```

- Bài chiếu: [http://127.0.0.1:8766/](http://127.0.0.1:8766/)
- Kịch bản: [http://127.0.0.1:8766/speaker.html](http://127.0.0.1:8766/speaker.html)

Giữ terminal mở khi sử dụng; nhấn `Ctrl+C` để dừng máy chủ. Mở qua HTTP để trang kịch bản tải được nội dung từ `index.html`; tránh mở trực tiếp bằng `file://`. Địa chỉ `127.0.0.1` chỉ truy cập trên máy đang chạy; khi ghép điện thoại, dùng các liên kết GitHub Pages ở đầu README.

## Cấu trúc dự án

```text
Thuyet-trinh-NS2/
├── index.html          # 28 slide và điều hướng bài chiếu
├── speaker.html        # Giao diện dành cho người thuyết trình
├── speaker.css         # Định dạng trang kịch bản trên máy tính/điện thoại
├── speaker.js          # Đọc, chỉnh sửa, nhập/xuất và điều hướng kịch bản
├── speaker-notes.js    # Lời nói, phân công, gợi ý và câu chuyển tiếp
├── sync.js             # Đồng bộ cửa sổ và ghép thiết bị qua WebRTC
├── vendor/             # PeerJS 1.5.5, qrcode-generator 1.4.4 và giấy phép
├── .github/CODEOWNERS  # Chủ sở hữu mã nguồn
└── README.md
```

Website dùng HTML, CSS và JavaScript thuần. Thư viện PeerJS và tạo QR được lưu trong `vendor/`, chỉ tải khi tạo hoặc ghép phòng; giấy phép MIT của từng thư viện nằm cùng thư mục.

Để cập nhật bài, sửa slide trong `index.html` và lời nói tương ứng trong `speaker-notes.js`. Giữ số lượng, thứ tự và nội dung hai phần khớp nhau; trang kịch bản kiểm tra số lượng slide khi tải. Nếu thay tổng số slide, cập nhật cả giới hạn trong `speaker.html` và `sync.js`.
