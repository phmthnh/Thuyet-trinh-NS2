(() => {
  'use strict';
  const isSpeaker = !!document.getElementById('script-body');
  const query = new URLSearchParams(location.search);
  let peer, connection, channel, timer, heartbeat, lastMessage = 0, role = '', receiving = false;
  const random = () => [...crypto.getRandomValues(new Uint8Array(10))].map(n => n.toString(16).padStart(2,'0')).join('');
  const valid = n => Number.isInteger(n) && n >= 1 && n <= 28;
  const roomValid = code => /^[a-f0-9]{20}$/.test(code);
  const dialog = document.createElement('dialog');
  dialog.id = 'sync-dialog';
  dialog.innerHTML = `<style>
  #sync-dialog{box-sizing:border-box;color:#18352e;background:#faf9f5;border:1px solid #cad6c7;border-radius:14px;padding:24px;width:min(540px,calc(100% - 24px));max-height:90dvh;overflow:auto;font:15px/1.6 'Segoe UI',sans-serif;z-index:200}
  #sync-dialog::backdrop{background:#071c24bb}#sync-dialog h2{color:#18352e;font-size:23px;margin:0 35px 14px 0;border:0;padding:0}#sync-dialog h2:after{display:none}#sync-dialog p{font:14px/1.65 'Segoe UI',sans-serif;color:#52685b;margin:12px 0}#sync-dialog label{display:block;font-weight:600;margin-top:18px}#sync-dialog input{display:block;box-sizing:border-box;width:100%;font:16px monospace;padding:12px;border:1px solid #b9ccb6;border-radius:6px;background:white;color:#18352e;margin:8px 0}#sync-dialog button{font:14px 'Segoe UI',sans-serif;border:1px solid #bdcdb8;background:#e9f0e2;color:#234a36;padding:11px 15px;border-radius:7px;cursor:pointer;margin:5px 5px 5px 0}#sync-dialog button:disabled{opacity:.4;cursor:default}#sync-dialog .primary{background:#235f51;color:white}#sync-close{position:absolute;right:12px;top:12px}#sync-status{padding:12px;background:#edf1e7;border-radius:7px;overflow-wrap:anywhere}#sync-link{font-size:12px!important}#sync-dialog [hidden]{display:none!important}#sync-dialog a{color:#235f51}#sync-dialog .code{font:18px monospace;letter-spacing:1px;user-select:all;color:#18352e}
  </style><button id="sync-close" aria-label="Đóng kết nối">×</button><h2>Hai màn hình · Điện thoại</h2>
  <p id="sync-status" role="status" aria-live="polite">Chưa kết nối. Chọn cách trình chiếu bên dưới.</p>
  ${isSpeaker ? '<button id="sync-local" class="primary">Mở cửa sổ chiếu trên máy này ↗</button><p>Kéo cửa sổ mới sang màn hình máy chiếu, rồi nhấn F để toàn màn hình. Hai cửa sổ tự đồng bộ.</p><label for="sync-code">Mã phòng trên máy đang chiếu</label><input id="sync-code" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Dán mã hoặc liên kết ghép điện thoại"><button id="sync-join" class="primary">Ghép điện thoại</button>' : '<button id="sync-host" class="primary">Tạo phòng cho điện thoại</button><p>Mở liên kết bên dưới trên điện thoại, hoặc vào speaker.html rồi nhập mã phòng. Giữ trang chiếu này mở.</p>'}
  <div id="sync-room" hidden><p>Mã phòng (chỉ chia sẻ cho người điều khiển):</p><p class="code" id="sync-room-code"></p><label for="sync-link">Liên kết mở trên điện thoại</label><input id="sync-link" readonly><button id="sync-copy">Sao chép liên kết</button></div>
  <button id="sync-stop" hidden>Ngắt kết nối / Đóng phòng</button>
  <p>Điện thoại và máy tính cần Internet. Phòng dùng PeerJS Cloud để tìm nhau, sau đó gửi số slide qua WebRTC. Không dùng camera/micro. Nếu mạng chặn WebRTC, thử cùng Wi-Fi hoặc điểm phát sóng; chế độ hai cửa sổ cùng máy vẫn dùng được.</p>`;
  document.body.append(dialog);
  const $ = id => document.getElementById(id);
  const status = text => { $('sync-status').textContent = text; $('sync-launch').textContent = text.startsWith('Đã kết nối') ? '⇄ Đã nối' : '⇄ Kết nối'; };
  $('sync-launch').addEventListener('click', () => dialog.showModal());
  $('sync-close').addEventListener('click', () => dialog.close());
  // Prevent deck keyboard shortcuts and swipe gestures from stealing dialog input.
  dialog.addEventListener('keydown', e => e.stopPropagation());
  dialog.addEventListener('touchstart', e => e.stopPropagation(), {passive:true});
  dialog.addEventListener('touchend', e => e.stopPropagation(), {passive:true});
  function apply(slide) {
    if (!valid(slide)) return;
    receiving = true;
    window.dispatchEvent(new CustomEvent('ns2:remote', {detail:slide}));
    receiving = false;
  }
  function send(message) {
    if (connection?.open) connection.send(message);
    if (channel) channel.postMessage(message);
  }
  function stop() {
    clearTimeout(timer); clearInterval(heartbeat);
    if (peer) peer.destroy();
    connection = null; peer = null;
    if (channel) channel.close(); channel = null; role = '';
    $('sync-room').hidden = true; $('sync-stop').hidden = true;
    status('Đã ngắt kết nối. Có thể tạo phòng hoặc ghép lại.');
  }
  $('sync-stop').addEventListener('click', stop);
  function receive(data) {
    if (!data || typeof data !== 'object') return;
    if (data.type === 'hello' && role === 'host') {
      lastMessage = Date.now(); send({type:'state',slide:window.ns2Slide || 1});
    } else if (data.type === 'ping') { send({type:'pong'}); }
    else if (data.type === 'pong') { lastMessage = Date.now(); status('Đã kết nối. Chuyển slide trên điện thoại hoặc máy tính để đồng bộ.'); }
    else if ((data.type === 'command' && role === 'host') || (data.type === 'state' && role === 'controller')) {
      if (!valid(data.slide)) return;
      lastMessage = Date.now(); apply(data.slide);
      if (role === 'host') send({type:'state',slide:data.slide});
    }
  }
  window.addEventListener('ns2:slide', e => {
    if (receiving || e.detail.remote || !valid(e.detail.slide)) return;
    send({type:role === 'host' ? 'state' : 'command',slide:e.detail.slide});
  });
  let libraryPromise;
  function loadPeer() {
    if (window.Peer) return Promise.resolve();
    if (!libraryPromise) libraryPromise = new Promise((resolve,reject) => {
      const script = document.createElement('script'); script.src = 'vendor/peerjs-1.5.5.min.js';
      script.onload = resolve; script.onerror = () => {libraryPromise = null; script.remove(); reject(new Error('Không tải được thư viện kết nối. Hãy tải lại trang.'));}; document.head.append(script);
    });
    return libraryPromise;
  }
  function bind(conn) {
    connection = conn;
    conn.on('open', () => {
      clearTimeout(timer); lastMessage = Date.now(); $('sync-stop').hidden = false;
      status('Đã kết nối. Chuyển slide trên điện thoại hoặc máy tính để đồng bộ.');
      send(role === 'host' ? {type:'state',slide:window.ns2Slide || 1} : {type:'hello'});
      clearInterval(heartbeat);
      heartbeat = setInterval(() => {
        if (!conn.open) return;
        if (Date.now() - lastMessage > 20000) status('Mất phản hồi. Mở lại điện thoại rồi ghép lại nếu slide chưa đồng bộ.');
        conn.send({type:'ping'});
      }, 5000);
    });
    conn.on('data', receive);
    conn.on('close', () => { clearInterval(heartbeat); if (connection === conn) connection = null; status(role === 'host' ? 'Điện thoại đã ngắt. Có thể ghép lại bằng cùng mã phòng.' : 'Đã ngắt khỏi máy chiếu. Nhấn Ghép điện thoại để nối lại.'); });
    conn.on('error', () => status('Kết nối gặp lỗi. Hãy ngắt rồi ghép lại.'));
  }
  async function start(remoteRole, code) {
    stop(); role = remoteRole; $('sync-stop').hidden = false;
    status('Đang kết nối dịch vụ ghép phòng…');
    try {
      await loadPeer();
      if (role !== remoteRole) return;
      peer = remoteRole === 'host' ? new Peer(`ns2-${code}`) : new Peer();
      const thisPeer = peer;
      timer = setTimeout(() => { if (peer === thisPeer && !connection?.open) status('Chưa kết nối sau 20 giây. Kiểm tra Internet, mã phòng hoặc đổi mạng rồi ghép lại.'); }, 20000);
      peer.on('open', () => {
        if (peer !== thisPeer) return;
        if (remoteRole === 'controller') bind(peer.connect(`ns2-${code}`, {reliable:true}));
        else {
          clearTimeout(timer);
          $('sync-room').hidden = false; $('sync-room-code').textContent = code;
          const url = new URL('speaker.html', location.href); url.searchParams.set('room', code);
          $('sync-link').value = url.href;
          status('Phòng đã sẵn sàng. Mở liên kết trên điện thoại rồi nhấn Ghép điện thoại.');
        }
      });
      peer.on('connection', conn => {
        if (remoteRole !== 'host' || connection?.open) {conn.close(); return;}
        bind(conn);
      });
      peer.on('error', err => {clearTimeout(timer); status(err.type === 'peer-unavailable' ? 'Không tìm thấy phòng. Máy chiếu cần tạo phòng và giữ trang mở.' : 'Không kết nối được WebRTC: ' + err.type + '. Kiểm tra mạng rồi thử lại.');});
      peer.on('disconnected', () => status('Đã mất kết nối dịch vụ ghép phòng. Nếu chưa ghép được, hãy tạo phòng lại.'));
    } catch (error) { status(error.message); }
  }
  if (isSpeaker) {
    $('sync-join').addEventListener('click', () => {
      let code = $('sync-code').value.trim().toLowerCase();
      try { code = new URL(code).searchParams.get('room') || code; } catch { /* Plain room code. */ }
      if (!roomValid(code)) {status('Mã phòng cần 20 ký tự. Hãy sao chép mã hoặc toàn bộ liên kết từ máy chiếu.'); return;}
      start('controller', code);
    });
    $('sync-local').addEventListener('click', () => {
      const id = random();
      const url = new URL('index.html', location.href); url.searchParams.set('local',id); url.hash = String(window.ns2Slide || 1);
      const child = window.open(url.href, '_blank');
      if (!child) {status('Trình duyệt chặn cửa sổ mới. Cho phép cửa sổ bật lên rồi thử lại.'); return;}
      stop(); role = 'controller'; channel = new BroadcastChannel(`ns2-local-${id}`); channel.onmessage = e => receive(e.data);
      $('sync-stop').hidden = false;
      status('Đã mở cửa sổ chiếu. Kéo sang màn hình thứ hai; hai cửa sổ sẽ đồng bộ khi chuyển trang.');
    });
    if (roomValid(query.get('room') || '')) {
      $('sync-code').value = query.get('room'); dialog.showModal();
      status('Đã nhận mã phòng. Nhấn Ghép điện thoại để bắt đầu điều khiển.');
    }
  } else {
    $('sync-host').addEventListener('click', () => start('host', random()));
    if (roomValid(query.get('local') || '')) {
      role = 'host'; channel = new BroadcastChannel(`ns2-local-${query.get('local')}`);
      channel.onmessage = e => receive(e.data);
      send({type:'state',slide:window.ns2Slide || 1});
      $('sync-stop').hidden = false;
    }
  }
  $('sync-copy').addEventListener('click', async () => {
    try {await navigator.clipboard.writeText($('sync-link').value); status('Đã sao chép liên kết. Gửi hoặc mở liên kết trên điện thoại.');}
    catch {$('sync-link').select(); status('Hãy sao chép liên kết trong ô đã chọn.');}
  });
})();
