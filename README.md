# Thuyết trình NS-2

- [Bài chiếu](https://phmthnh.github.io/Thuyet-trinh-NS2/)
- [Kịch bản cho người thuyết trình](https://phmthnh.github.io/Thuyet-trinh-NS2/speaker.html) — có sau khi nhánh chứa trang này được merge và GitHub Pages triển khai thành công.

Trang `speaker.html` dùng đúng 28 slide từ `index.html`. Trên điện thoại, slide nằm trên cùng, lời nói cuộn độc lập ở giữa và hai nút lùi/tiến cố định dưới cùng. Bấm phóng to để đọc các slide nhiều mã nguồn. Các nút điều khiển slide trong trang kịch bản, không điều khiển từ xa máy đang chiếu.

## Phân công

| Thành viên | Phần lý thuyết theo phân công | Slide phụ trách | Thời gian lời nói gợi ý |
| --- | --- | --- | --- |
| Long | 4.4.1: bộ lập lịch; mở đầu và tổng kết | 1–6, 27–28 | 9 phút 05 giây |
| Minh | 4.4.2: ghi vết; chạy và phân tích trace | 7, 18–21 | 7 phút 30 giây |
| Bảo | 4.4.3: mô hình mạng; ví dụ có dây | 8–10, 14–15 | 7 phút 30 giây |
| Thành | 4.4.4: TCP/UDP; ví dụ không dây và demo | 11, 16–17, 26 | 6 phút 05 giây |
| Đạt | 4.4.5–4.4.6: nguồn lưu lượng, thời gian; kết quả và cải tiến | 12–13, 22–25 | 9 phút 25 giây |

Tổng khoảng 39 phút 35 giây cho bản chi tiết; cộng thêm thời gian chạy demo và hỏi đáp. Đây là thời lượng luyện tập ước tính, chưa phải kết quả bấm giờ. Các số mục 4.4.1–4.4.6 được ghép theo sáu bước trong bài hiện có và thứ tự phân công của nhóm; repo không chứa giáo trình để đối chiếu tên từng mục.

Chọn **Phần của** để tập riêng phần một người. Chọn **Tất cả** để giữ thứ tự bài chiếu. Nút **Phân công & slide** mở danh sách và cho phép nhảy đến trang bất kỳ. Có thể tăng/giảm cỡ chữ, sửa lời nói trên trình duyệt và tải toàn bộ kịch bản thành `.txt`. Chỉnh sửa chỉ lưu trên trình duyệt đang dùng, không tự đồng bộ sang thiết bị khác hay sửa repository.

## Xem tại máy

Trong thư mục repo, chạy:

```powershell
python -m http.server 8766 --bind 127.0.0.1
```

Mở `http://127.0.0.1:8766/speaker.html`. Trang cần được phục vụ qua HTTP để tải bài chiếu gốc; mở trực tiếp bằng `file://` sẽ hiện hướng dẫn này. Không cần API key, tài khoản AI hoặc thư viện bên ngoài.

## Nội dung và bảo trì

- `index.html`: bài chiếu gốc, giữ nguyên.
- `speaker.html`, `speaker.css`, `speaker.js`: giao diện đọc và luyện tập.
- `speaker-notes.js`: 28 mục gồm người nói, phần phụ trách, lời nói chi tiết, gợi ý và câu chuyển tiếp.

Khi đổi số lượng/thứ tự/nội dung slide, cập nhật lời nói tương ứng. Trang kiểm tra số lượng slide để tránh trình bày nhầm sau khi thêm hoặc xóa slide. Chỉ số gói, độ trễ và thông lượng trong kịch bản được diễn giải theo bảng đang có; repo không có trace gốc để xác minh lại thí nghiệm.

Kịch bản bổ sung lưu ý cho các điểm dễ nhầm trong bài: cú pháp bộ lập lịch, định tuyến Static mặc định, trường AGT trong trace, thời gian hội tụ, cách đếm PDR và phân biệt phần trăm với điểm phần trăm. Tham khảo [NS-2 Manual](https://www.isi.edu/websites/nsnam/ns/ns-man.html), [Scheduler](https://www.isi.edu/websites/nsnam/ns/doc-stable/node31.html), [Trace](https://www.isi.edu/websites/nsnam/ns/doc/node296.html) và [RFC 3550](https://www.rfc-editor.org/rfc/rfc3550.html).

Nhánh `main` được bảo vệ: thay đổi phải qua pull request và người duyệt trong `CODEOWNERS`. Không tắt quy tắc để xuất bản trang kịch bản.
