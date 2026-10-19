# Thuyết trình NS-2

- [Bài chiếu](https://phmthnh.github.io/Thuyet-trinh-NS2/)
- [Kịch bản cho người thuyết trình](https://phmthnh.github.io/Thuyet-trinh-NS2/speaker.html)

Trang `speaker.html` dùng đúng 28 slide từ `index.html`. Trên điện thoại, slide nằm trên cùng, lời nói cuộn độc lập ở giữa và hai nút lùi/tiến cố định dưới cùng. Preview giữ tỉ lệ và cho cuộn trực tiếp, không thu nhỏ toàn bộ slide dài đến mức khó đọc. Khi đang ghép, vị trí cuộn slide được đồng bộ với máy chiếu. Có thể thu gọn preview để tăng diện tích đọc lời nói.

## Hai màn hình trên cùng máy

1. Mở `speaker.html`, chọn **⇄ Kết nối → Mở màn hình chiếu trên máy này**.
2. Kéo cửa sổ bài chiếu sang máy chiếu/màn hình thứ hai. Chọn chế độ mở rộng màn hình (Extend) của Windows.
3. Nhấn **F** trong cửa sổ bài chiếu để toàn màn hình. Giữ trang kịch bản ở màn hình của người nói.
4. Chuyển slide từ cửa sổ nào cũng được; cửa sổ còn lại tự theo. Chế độ này dùng BroadcastChannel, hai trang phải cùng trình duyệt, cùng hồ sơ và cùng nguồn URL.

Liên kết **Mở bài chiếu ↗** dưới preview cũng mở cửa sổ đã ghép tự động. Một tab bài chiếu mở độc lập bằng cách tự gõ URL sẽ không tự có quyền kết nối: hãy mở từ trang kịch bản hoặc ghép bằng mã/QR. Trang kiểm tra lại trạng thái thực tế của máy chiếu mỗi 1,5 giây để khôi phục khi bỏ lỡ sự kiện hoặc trở lại từ tab nền; thông điệp cũ hơn không ghi đè trạng thái mới.

## Dùng điện thoại điều khiển máy tính

1. Trên máy tính, mở bài chiếu chính tại `https://phmthnh.github.io/Thuyet-trinh-NS2/`, bấm **⇄ → Tạo phòng · Hiện QR**.
2. Quét QR bằng camera điện thoại hoặc mở `speaker.html`, chọn **⇄ Kết nối**, nhập mã phòng **6 số**. Có thể dán toàn bộ liên kết ghép.
3. Đặt tên thiết bị, bấm **Gửi yêu cầu kết nối**. Trên máy chiếu, đối chiếu tên và mã xác nhận 4 số với điện thoại, rồi chọn **Chấp nhận điều khiển** hoặc **Chỉ cho xem**. Chỉ bắt đầu trình bày khi điện thoại báo đã xác nhận slide.
4. Đóng hộp kết nối trên hai thiết bị. Điện thoại hiển thị slide và lời nói; máy tính chỉ chiếu bài thuyết trình. Chuyển trang từ điện thoại hoặc bàn phím máy tính đều đồng bộ hai chiều.
5. Giữ trang máy tính mở. Trong danh sách thiết bị, có thể đổi quyền, ngắt thiết bị hoặc **Khóa nhận thiết bị mới**. Tối đa 5 thiết bị đã duyệt và 3 yêu cầu chờ; yêu cầu chưa duyệt hết hạn sau 60 giây. Chỉ thiết bị có quyền điều khiển mới được gửi lệnh; các thiết bị đã duyệt cùng nhận slide mới.
6. Điện thoại tự thử nối lại tối đa 3 lần khi kênh bị đóng; khi trở lại trang sau khóa màn hình, gửi yêu cầu đồng bộ lại. Có nút **Kết nối lại** và trạng thái xác nhận lệnh ngay trên trang đọc. Tải lại điện thoại vẫn dùng token riêng của phiên và khôi phục quyền đã được duyệt khi bấm ghép lại. Ngắt thiết bị thu hồi token; lần ghép tiếp theo cần chủ máy chấp nhận lại. Đóng phòng hoặc tải lại máy chiếu xóa mọi quyền cũ.

GitHub Pages chỉ phục vụ các tệp tĩnh. Kết nối giữa hai thiết bị dùng PeerJS 1.5.5 với PeerJS Cloud để tìm nhau, WebRTC để gửi số slide/vị trí cuộn và qrcode-generator 1.4.4 để tạo QR tại trình duyệt (các thư viện/giấy phép MIT trong `vendor/`). Không gửi kịch bản hay bản nháp qua kênh điều khiển, không dùng camera/micro của trang. Thư viện kết nối chỉ tải khi tạo/ghép phòng; quét QR dùng ứng dụng camera sẵn có.

Cần Internet. Mạng chặn WebRTC hoặc NAT hạn chế có thể khiến ghép thất bại; các STUN/TURN công cộng mặc định không bảo đảm hoạt động trên mọi mạng. Xem **Kiểm tra mạng / TURN tùy chọn** để đọc lỗi, thử cùng Wi-Fi/điểm phát sóng, hoặc nhập URL/username/credential TURN riêng trên hai thiết bị rồi ghép lại. Thông tin TURN chỉ lưu trong `sessionStorage` của tab, không đưa vào repo; không nhập khóa quản trị của dịch vụ TURN. Không coi kênh đã mở là đồng bộ thành công: trang cần nhận đúng trạng thái và xác nhận lệnh từ máy chiếu. Nếu chưa có TURN phù hợp, không cam kết kết nối được trên mọi mạng 4G/5G hoặc mạng trường học.

Mã phòng 6 số chỉ giúp tìm phòng, không cấp quyền điều khiển. Mỗi phiên thiết bị dùng token ngẫu nhiên 128 bit được gửi trên kênh WebRTC mã hóa, và chỉ được duyệt tại máy chiếu. Chủ máy phải đối chiếu mã xác nhận/tên trước khi chấp nhận; không tự duyệt thiết bị lạ. Phòng giới hạn 20 yêu cầu kết nối/phút và số thiết bị chờ để giảm làm phiền, nhưng không thay thế hệ thống đăng nhập hay chống DDoS của máy chủ. Trang được phục vụ qua HTTPS trên Pages; không dùng đường dẫn HTML cũ đã xóa. Liên kết phòng 20 ký tự của bản trước không tương thích; tạo QR/mã mới và tải lại trang trên cả hai máy.

## Phân công

| Thành viên | Phần lý thuyết theo phân công | Slide phụ trách | Thời gian lời nói gợi ý |
| --- | --- | --- | --- |
| Long | 4.4.1: bộ lập lịch; mở đầu và tổng kết | 1–6, 27–28 | 9 phút 05 giây |
| Minh | 4.4.2: ghi vết; chạy và phân tích trace | 7, 18–21 | 7 phút 30 giây |
| Bảo | 4.4.3: mô hình mạng; ví dụ có dây | 8–10, 14–15 | 7 phút 30 giây |
| Thành | 4.4.4: TCP/UDP; ví dụ không dây và demo | 11, 16–17, 26 | 6 phút 05 giây |
| Đạt | 4.4.5–4.4.6: nguồn lưu lượng, thời gian; kết quả và cải tiến | 12–13, 22–25 | 9 phút 25 giây |

Tổng khoảng 39 phút 35 giây cho bản chi tiết; cộng thêm thời gian chạy demo và hỏi đáp. Đây là thời lượng luyện tập ước tính, chưa phải kết quả bấm giờ. Các số mục 4.4.1–4.4.6 được ghép theo sáu bước trong bài hiện có và thứ tự phân công của nhóm; repo không chứa giáo trình để đối chiếu tên từng mục.

Chọn **Phần của** để tập riêng phần một người. Chọn **Tất cả** để giữ thứ tự bài chiếu. Thanh **Đến slide** luôn hiện trên trang điều khiển; bấm số slide giữa hai nút lùi/tiến để nhập số trực tiếp. Nút **Mục lục** mở danh sách kèm phân công. Khi nhận lệnh từ máy chiếu hoặc nhảy trực tiếp, bộ lọc chuyển về tất cả để không bỏ qua slide.

## Sửa kịch bản

Nút **Sửa** mở trình soạn lời nói, gợi ý khi trình bày và câu chuyển tiếp. Chọn chữ rồi dùng **B**, **I**, **Danh sách** để chèn định dạng đơn giản; có hoàn tác/làm lại, đếm từ và xem trước. Định dạng hỗ trợ `**in đậm**`, `*in nghiêng*`, dấu backtick cho code và các dòng bắt đầu bằng `- ` cho danh sách. Nội dung được hiển thị như văn bản an toàn, không thực thi HTML người dùng nhập.

**Lưu nội dung** lưu riêng trên trình duyệt. **Xuất bản nháp JSON** xuất cả nội dung vừa chỉnh và các slide đã lưu; chuyển file này sang máy khác rồi **Nhập bản nháp JSON** để dùng tiếp. Nhập bản nháp gộp với nội dung đã có, các slide trùng số dùng dữ liệu nhập. Xuất TXT trong mục lục lấy lời nói/gợi ý/câu chuyển tiếp đã sửa. Chỉnh sửa không tự ghi vào GitHub hoặc đồng bộ sang thiết bị khác; muốn chia sẻ cần chuyển file JSON.

## Xem tại máy

Trong thư mục repo, chạy:

```powershell
python -m http.server 8766 --bind 127.0.0.1
```

Mở `http://127.0.0.1:8766/speaker.html`. Trang cần được phục vụ qua HTTP để tải bài chiếu gốc; mở trực tiếp bằng `file://` sẽ hiện hướng dẫn này. Không cần API key, tài khoản AI hoặc thư viện bên ngoài.

## Nội dung và bảo trì

- `index.html`: nội dung bài chiếu gốc, bổ sung đường dẫn kịch bản và kết nối.
- `speaker.html`, `speaker.css`, `speaker.js`: giao diện đọc và luyện tập.
- `speaker-notes.js`: 28 mục gồm người nói, phần phụ trách, lời nói chi tiết, gợi ý và câu chuyển tiếp.
- `sync.js`: kết nối hai cửa sổ và ghép điện thoại; `vendor/` chứa PeerJS cùng giấy phép.

Khi đổi số lượng/thứ tự/nội dung slide, cập nhật lời nói tương ứng. Trang kiểm tra số lượng slide để tránh trình bày nhầm sau khi thêm hoặc xóa slide. Chỉ số gói, độ trễ và thông lượng trong kịch bản được diễn giải theo bảng đang có; repo không có trace gốc để xác minh lại thí nghiệm.

Kịch bản bổ sung lưu ý cho các điểm dễ nhầm trong bài: cú pháp bộ lập lịch, định tuyến Static mặc định, trường AGT trong trace, thời gian hội tụ, cách đếm PDR và phân biệt phần trăm với điểm phần trăm. Tham khảo [NS-2 Manual](https://www.isi.edu/websites/nsnam/ns/ns-man.html), [Scheduler](https://www.isi.edu/websites/nsnam/ns/doc-stable/node31.html), [Trace](https://www.isi.edu/websites/nsnam/ns/doc/node296.html) và [RFC 3550](https://www.rfc-editor.org/rfc/rfc3550.html).

Nhánh `main` được bảo vệ: thay đổi qua pull request, chỉ `phmthnh` được merge, không cần chờ người khác review. Không tắt quy tắc để xuất bản trang kịch bản.
