(() => {
  'use strict';
  const speaker = !!document.getElementById('script-body');
  const query = new URLSearchParams(location.search), $ = id => document.getElementById(id);
  const valid = n => Number.isInteger(n) && n >= 1 && n <= 28;
  const roomValid = code => /^\d{6}$/.test(code);
  const random = bytes => [...crypto.getRandomValues(new Uint8Array(bytes))].map(n => n.toString(16).padStart(2,'0')).join('');
  const roomNumber = () => String(100000 + crypto.getRandomValues(new Uint32Array(1))[0] % 900000);
  const dialog = document.createElement('dialog'); dialog.id = 'sync-dialog';
  dialog.innerHTML = `<style>
  #sync-dialog{box-sizing:border-box;color:#18352e;background:#faf9f5;border:1px solid #cad6c7;border-radius:14px;padding:24px;width:min(680px,calc(100% - 20px));max-height:94dvh;overflow:auto;font:14px/1.6 'Segoe UI',sans-serif;z-index:200}#sync-dialog::backdrop{background:#071c24bb}#sync-dialog h2{color:#18352e;font-size:22px;margin:0 35px 14px 0;border:0;padding:0}#sync-dialog h2:after{display:none}#sync-dialog h3{color:#284c38;font:600 15px 'Segoe UI',sans-serif;margin:18px 0 10px}#sync-dialog p{font:13px/1.65 'Segoe UI',sans-serif;color:#52685b;margin:10px 0}#sync-dialog label{display:block;font-weight:600;margin-top:12px}#sync-dialog input{display:block;box-sizing:border-box;width:100%;font:16px 'Segoe UI',sans-serif;padding:11px;border:1px solid #b9ccb6;border-radius:6px;background:white;color:#18352e;margin:7px 0}#sync-dialog button{font:13px 'Segoe UI',sans-serif;border:1px solid #bdcdb8;background:#e9f0e2;color:#234a36;padding:11px 14px;border-radius:7px;cursor:pointer;margin:4px 5px 4px 0;min-height:40px}#sync-dialog button:disabled{opacity:.4;cursor:default}#sync-dialog .primary{background:#235f51;color:white}#sync-close{position:absolute;right:10px;top:9px}#sync-status{padding:12px;background:#edf1e7;border-radius:7px;overflow-wrap:anywhere}#sync-link{font-size:12px!important}#sync-dialog [hidden]{display:none!important}#sync-dialog .code{font:700 36px monospace;letter-spacing:6px;color:#18352e;user-select:all}#sync-room{border:1px solid #cddbc3;border-radius:10px;padding:14px;margin:14px 0}.pair-grid{display:grid;grid-template-columns:160px 1fr;gap:18px;align-items:center}#sync-qr{background:white;padding:8px;border-radius:7px}#sync-qr svg{display:block;width:100%;height:auto}#sync-code{font:26px monospace!important;letter-spacing:5px}#sync-devices{padding:0;list-style:none;max-height:270px;overflow:auto}#sync-devices li{padding:12px 0;border-bottom:1px solid #dbe2d3}#sync-devices small{display:block;color:#6d7f63;margin:4px 0}#sync-devices .device-actions{display:flex;flex-wrap:wrap;gap:3px}#sync-devices button{padding:8px 10px;font-size:12px}#sync-challenge{font-weight:700;color:#214d39}#sync-diagnostics{white-space:pre-wrap;overflow-wrap:anywhere;font:11px/1.7 monospace;background:#edf0e7;padding:10px;border-radius:6px;max-height:170px;overflow:auto;color:#496346}#sync-dialog details{margin:14px 0}#sync-dialog summary{cursor:pointer;color:#365c45;font-weight:600}#sync-dialog .network-note{font-size:11px;color:#77816e}#sync-lock[aria-pressed=true]{background:#7a4c2b;color:#fff}@media(max-width:500px){#sync-dialog{padding:18px}.pair-grid{grid-template-columns:120px 1fr;gap:12px}#sync-dialog .code{font-size:28px;letter-spacing:3px}#sync-dialog h2{font-size:19px}}
  </style><button id="sync-close" aria-label="Đóng kết nối">×</button><h2>Kết nối màn hình chiếu</h2>
  <p id="sync-status" role="status" aria-live="polite">Chưa kết nối. Chọn cách trình chiếu bên dưới.</p>
  ${speaker ? '<button id="sync-local" class="primary">Mở màn hình chiếu trên máy này ↗</button><p>Kéo cửa sổ mới sang máy chiếu. Dùng điện thoại? Quét QR ở màn hình chiếu hoặc nhập mã 6 số bên dưới.</p><label for="sync-name">Tên thiết bị của bạn</label><input id="sync-name" maxlength="32" placeholder="Ví dụ: Điện thoại của Thành"><label for="sync-code">Mã phòng hoặc liên kết ghép</label><input id="sync-code" autocomplete="off" inputmode="numeric" spellcheck="false" placeholder="123456"><button id="sync-join" class="primary">Gửi yêu cầu kết nối</button><p id="sync-challenge" hidden></p>' : '<button id="sync-host" class="primary">Tạo phòng · Hiện QR</button><p>Điện thoại quét QR hoặc nhập mã 6 số. Mỗi thiết bị cần được bạn chấp nhận trước khi xem / điều khiển.</p>'}
  <div id="sync-room" hidden><div class="pair-grid"><div id="sync-qr" role="img" aria-label="QR mở trang kịch bản và mã phòng"></div><div><p>Mã phòng</p><p class="code" id="sync-room-code"></p><p>Quét bằng camera điện thoại, rồi gửi yêu cầu ghép.</p></div></div><label for="sync-link">Liên kết ghép điện thoại</label><input id="sync-link" readonly><button id="sync-copy">Sao chép liên kết</button><button id="sync-lock" aria-pressed="false">Khóa nhận thiết bị mới</button><h3>Thiết bị &amp; yêu cầu kết nối</h3><p>Đối chiếu tên và mã xác nhận trên điện thoại trước khi chấp nhận. Chỉ thiết bị được cấp quyền điều khiển mới chuyển / cuộn slide được.</p><ul id="sync-devices"></ul></div>
  <button id="sync-retry" hidden>Kết nối lại</button><button id="sync-stop" hidden>Ngắt kết nối / Đóng phòng</button>
  <details><summary>Kiểm tra mạng / TURN tùy chọn</summary><p>Thử cùng Wi-Fi hoặc điểm phát sóng nếu mã phòng đúng nhưng không ghép được. Mạng 4G/5G hoặc mạng chặn WebRTC có thể cần máy chủ TURN. Nếu có dịch vụ TURN riêng, nhập trên cả hai thiết bị trước khi ghép lại. Chỉ dùng tài khoản TURN ngắn hạn, không dùng khóa quản trị.</p><label for="sync-turn-url">TURN URL</label><input id="sync-turn-url" placeholder="turns:turn.example.com:443?transport=tcp" autocomplete="off"><label for="sync-turn-user">TURN username</label><input id="sync-turn-user" autocomplete="off"><label for="sync-turn-pass">TURN credential</label><input id="sync-turn-pass" type="password" autocomplete="off"><button id="sync-save-turn">Áp dụng cho phiên trình duyệt này</button><pre id="sync-diagnostics"></pre></details>
  <p class="network-note">Dùng PeerJS Cloud để ghép phòng và WebRTC mã hóa để gửi số slide / vị trí cuộn; không dùng camera hoặc micro. Mã 6 số không phải mật khẩu: quyền điều khiển chỉ có sau khi máy chiếu chấp nhận. Tối đa 5 thiết bị đã duyệt và 3 yêu cầu chờ. Mạng hạn chế có thể cần TURN riêng.</p>`;
  document.body.append(dialog);
  dialog.style.margin = 'auto';
  if (['127.0.0.1','localhost','[::1]'].includes(location.hostname)) {
    const warning = document.createElement('p');warning.textContent = 'Bản xem trước trên máy tính: điện thoại không mở được địa chỉ localhost / 127.0.0.1. Để quét QR bằng điện thoại thật, dùng trang GitHub Pages sau khi bản cập nhật được triển khai.';
    warning.style.cssText = 'background:#fff0cf;color:#76511f;padding:12px;border-radius:7px';$('sync-status').after(warning);
  }
  let peer = null, controller = null, channel = null, role = speaker ? 'controller' : 'host';
  let generation = 0, room = '', locked = false, stopped = true, accepted = false, ready = !speaker || window.ns2Ready;
  let interval, timeout, retryTimer, commandTimer, lastSeen = 0, retryCount = 0, reconnectAttempts = 0;
  let pendingState = null, pendingCommand = null, remoteUntil = 0, scrollRatio = 0, challenge = '', token = '';
  let permission = '', wakeLock, arrivals = [], roomCollisions = 0;
  const devices = new Map(), grants = new Map(), logs = [];
  const deckControls = document.createElement('style');deckControls.textContent = '.nav #sync-launch{width:auto;min-width:48px;max-width:180px;padding:0 12px;font-size:12px;border-radius:9px;white-space:nowrap}.nav #sync-launch[data-pending=true]{border-color:#f4be55;color:#f4be55}';document.head.append(deckControls);
  function log(text) {logs.push(`${new Date().toLocaleTimeString('vi-VN')} ${text}`);if (logs.length > 16) logs.shift();$('sync-diagnostics').textContent = logs.join('\n');}
  function status(text, state = 'idle', brief = '') {
    $('sync-status').textContent = text;
    if ($('sync-indicator')) {$('sync-indicator').textContent = brief || (state === 'connected' ? 'Đã đồng bộ' : state === 'pending' ? 'Đang ghép' : state === 'error' ? 'Chưa nối' : 'Tập riêng');$('sync-indicator').dataset.state = state;}
    $('sync-launch').textContent = state === 'connected' ? '⇄ Đã nối' : state === 'pending' ? '⇄ Đang ghép' : '⇄ Kết nối';
    const waiting = [...devices.values()].filter(d => d.identified && !d.permission).length;
    $('sync-launch').dataset.pending = String(waiting > 0);
    if (waiting) $('sync-launch').textContent = `⇄ Duyệt (${waiting})`;
  }
  $('sync-launch').addEventListener('click', () => dialog.showModal());$('sync-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', e => e.stopPropagation());dialog.addEventListener('touchstart',e => e.stopPropagation(),{passive:true});dialog.addEventListener('touchend',e => e.stopPropagation(),{passive:true});
  async function keepAwake() {try {if ('wakeLock' in navigator && document.visibilityState === 'visible' && !stopped && !wakeLock) {wakeLock = await navigator.wakeLock.request('screen');wakeLock.addEventListener('release',() => {wakeLock = null;});}} catch { /* Optional browser feature. */ }}
  function safeSend(conn,message) {if (!conn?.open) return false;try {conn.send(message);return true;} catch {return false;}}
  function localSend(message) {try {channel?.postMessage(message);} catch { /* Closed channel. */ }}
  function broadcastState(ack) {
    const message = {type:'state',slide:window.ns2Slide || 1,ratio:scrollRatio,ack};
    for (const entry of devices.values()) if (entry.permission) safeSend(entry.conn,message);
    localSend(message);
  }
  function applyState(message) {
    if (!valid(message.slide)) return;
    if (!ready) {pendingState = message;return;}
    remoteUntil = Date.now() + 220;
    window.dispatchEvent(new CustomEvent('ns2:remote',{detail:message.slide}));
    if (Number.isFinite(message.ratio)) {scrollRatio = Math.max(0,Math.min(1,message.ratio));window.dispatchEvent(new CustomEvent('ns2:remote-scroll',{detail:{slide:message.slide,ratio:scrollRatio}}));}
  }
  window.addEventListener('ns2:ready',() => {ready = true;if (pendingState) {applyState(pendingState);pendingState = null;}if (accepted) safeSend(controller,{type:'hello'});localSend({type:'hello'});});
  function sendCommand(slide,ratio) {
    const message = {type:'command',slide,ratio,id:random(6)};
    if (channel) localSend(message);
    if (!controller?.open || !accepted) return;
    if (permission === 'view') {safeSend(controller,{type:'hello'});status('Thiết bị chỉ có quyền xem; yêu cầu máy chiếu cấp quyền điều khiển.','connected','Chỉ xem');return;}
    pendingCommand = message;safeSend(controller,message);status('Đã gửi lệnh, đang chờ máy chiếu xác nhận…','pending','Chờ xác nhận');
    clearTimeout(commandTimer);commandTimer = setTimeout(() => {if (pendingCommand?.id === message.id) {status('Máy chiếu chưa xác nhận lệnh. Kết nối lại để đồng bộ đúng slide.','error','Chưa xác nhận');$('sync-retry').hidden = false;}},4500);
  }
  window.addEventListener('ns2:slide',e => {if (!ready || e.detail.remote || !valid(e.detail.slide)) return;scrollRatio = 0;if (role === 'host') broadcastState();else sendCommand(e.detail.slide,0);});
  window.addEventListener('ns2:scroll',e => {if (Date.now() < remoteUntil || !valid(e.detail.slide) || !Number.isFinite(e.detail.ratio)) return;scrollRatio = Math.max(0,Math.min(1,e.detail.ratio));if (role === 'host') broadcastState();else sendCommand(e.detail.slide,scrollRatio);});
  let libraryPromise;
  async function libraries() {
    if (window.Peer && window.qrcode) return;
    if (!libraryPromise) libraryPromise = Promise.all([['Peer','vendor/peerjs-1.5.5.min.js'],['qrcode','vendor/qrcode-1.4.4.js']].map(([global,src]) => new Promise((resolve,reject) => {
      if (window[global]) {resolve();return;}const script = document.createElement('script');script.src = src;script.onload = resolve;script.onerror = () => {script.remove();reject(new Error('Không tải được thư viện. Tải lại trang rồi thử lại.'));};document.head.append(script);
    }))).catch(error => {libraryPromise = null;throw error;});await libraryPromise;
  }
  function readSession(key,fallback = '') {try {return sessionStorage.getItem(key) || fallback;} catch {return fallback;}}
  function writeSession(key,value) {try {sessionStorage.setItem(key,value);} catch { /* Pairing still works without saved credentials. */ }}
  let turn = {};try {turn = JSON.parse(readSession('ns2-turn','{}'));} catch { /* Ignore corrupt configuration. */ }
  $('sync-turn-url').value = turn.url || '';$('sync-turn-user').value = turn.username || '';$('sync-turn-pass').value = turn.credential || '';
  $('sync-save-turn').addEventListener('click',() => {
    const url = $('sync-turn-url').value.trim();if (url && !/^turns?:[^\s]+$/i.test(url)) {status('TURN URL phải bắt đầu bằng turn: hoặc turns:.','error');return;}
    turn = {url,username:$('sync-turn-user').value.trim(),credential:$('sync-turn-pass').value};writeSession('ns2-turn',JSON.stringify(turn));status('Đã áp dụng TURN cho phiên này. Tạo phòng hoặc kết nối lại để sử dụng.');
  });
  function peerOptions() {return {secure:true,config:{iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun.cloudflare.com:3478'},{urls:['turn:eu-0.turn.peerjs.com:3478','turn:us-0.turn.peerjs.com:3478'],username:'peerjs',credential:'peerjsp'},...(turn.url ? [{urls:turn.url,username:turn.username,credential:turn.credential}] : [])]}};}
  function clearNetwork() {
    generation++;clearInterval(interval);clearTimeout(timeout);clearTimeout(retryTimer);clearTimeout(commandTimer);accepted = false;permission = '';pendingCommand = null;
    for (const d of devices.values()) clearTimeout(d.expiry);
    const old = peer;peer = null;controller = null;devices.clear();if (old) old.destroy();
  }
  function stop() {stopped = true;clearNetwork();grants.clear();if (channel) channel.close();channel = null;$('sync-room').hidden = true;$('sync-stop').hidden = true;$('sync-retry').hidden = true;if (wakeLock) wakeLock.release().catch(() => {});status('Đã ngắt kết nối. Thiết bị phải gửi yêu cầu mới nếu ghép lại.');}
  $('sync-stop').addEventListener('click',stop);
  function deviceList() {
    $('sync-devices').replaceChildren();if (![...devices.values()].some(d => d.identified)) {$('sync-devices').textContent = 'Chưa có thiết bị. Đang chờ yêu cầu từ điện thoại.';return;}
    for (const [id,entry] of devices) {
      if (!entry.identified) continue;
      const li = document.createElement('li'),name = document.createElement('strong'),info = document.createElement('small'),actions = document.createElement('div');
      name.textContent = entry.name;info.textContent = `${entry.permission ? entry.permission === 'control' ? 'Được điều khiển' : 'Chỉ xem' : 'Đang chờ duyệt'} · Xác nhận ${entry.challenge}`;actions.className = 'device-actions';
      function action(text,callback) {const button = document.createElement('button');button.textContent = text;button.addEventListener('click',callback);actions.append(button);}
      function grant(value) {
        if (!entry.permission && [...devices.values()].filter(d => d.permission).length >= 5) {status('Đã đủ 5 thiết bị. Ngắt một thiết bị trước khi duyệt thêm.','error');return;}
        entry.permission = value;grants.set(entry.token,{permission:value});clearTimeout(entry.expiry);safeSend(entry.conn,{type:'approved',permission:value});safeSend(entry.conn,{type:'state',slide:window.ns2Slide || 1,ratio:scrollRatio});deviceList();status('Đã kết nối. Có thể quản lý từng thiết bị bên dưới.','connected');keepAwake();
      }
      action(entry.permission ? entry.permission === 'view' ? 'Cho điều khiển' : 'Chỉ cho xem' : 'Chấp nhận điều khiển',() => grant(entry.permission === 'control' ? 'view' : 'control'));
      if (!entry.permission) action('Chỉ cho xem',() => grant('view'));
      action(entry.permission ? 'Ngắt thiết bị' : 'Từ chối',() => {grants.delete(entry.token);safeSend(entry.conn,{type:'revoked'});devices.delete(id);clearTimeout(entry.expiry);setTimeout(() => entry.conn.close(),100);deviceList();if (![...devices.values()].some(d => d.permission)) status('Không còn thiết bị đã duyệt. Phòng vẫn mở.');});
      li.append(name,info,actions);$('sync-devices').append(li);
    }
  }
  function watchICE(conn,gen) {
    const pc = conn.peerConnection;if (!pc) return;
    pc.addEventListener('iceconnectionstatechange',() => {if (gen !== generation) return;log('ICE: ' + pc.iceConnectionState);if (pc.iceConnectionState === 'failed') {status('Không mở được đường truyền WebRTC. Thử cùng Wi-Fi/điểm phát sóng hoặc cấu hình TURN rồi kết nối lại.','error','Lỗi đường truyền');$('sync-retry').hidden = false;}});
  }
  function acceptIncoming(conn,gen) {
    arrivals = arrivals.filter(t => Date.now() - t < 60000);arrivals.push(Date.now());if (arrivals.length > 20) {conn.close();return;}
    const meta = conn.metadata || {};
    if (meta.version !== 2 || !/^\d{4}$/.test(meta.challenge || '') || [...devices.values()].filter(d => !d.permission).length >= 3 || devices.size >= 8) {
      conn.on('open',() => {safeSend(conn,{type:'rejected',reason:locked ? 'Phòng đã khóa nhận thiết bị mới.' : 'Phòng chưa thể nhận thêm yêu cầu. Thử lại sau.'});setTimeout(() => conn.close(),150);});return;
    }
    // Resume tokens travel only inside the encrypted data channel, never signaling metadata.
    const entry = {conn,token:'',identified:false,name:typeof meta.name === 'string' ? meta.name.slice(0,40) : 'Thiết bị',challenge:meta.challenge,permission:'',expiry:null};devices.set(conn.connectionId,entry);
    entry.expiry = setTimeout(() => {if (!entry.permission) {devices.delete(conn.connectionId);safeSend(conn,{type:'rejected',reason:'Yêu cầu hết hạn sau 60 giây. Gửi lại và chờ máy chiếu chấp nhận.'});setTimeout(() => conn.close(),100);deviceList();}},60000);
    conn.on('open',() => {
      if (gen !== generation) return;watchICE(conn,gen);log('Kênh dữ liệu mở, đợi xác thực phiên.');safeSend(conn,{type:'identify-required'});
    });
    conn.on('data',data => {
      if (gen !== generation || devices.get(conn.connectionId) !== entry || !data || typeof data !== 'object') return;
      if (data.type === 'identify' && !entry.identified) {
        if (!/^[a-f0-9]{32}$/.test(data.token || '')) {conn.close();return;}
        const resumed = grants.get(data.token);
        if (locked && !resumed) {safeSend(conn,{type:'rejected',reason:'Phòng đã khóa nhận thiết bị mới.'});setTimeout(() => conn.close(),100);return;}
        for (const [id,old] of devices) if (old !== entry && old.token === data.token) {devices.delete(id);clearTimeout(old.expiry);old.conn.close();}
        entry.token = data.token;entry.identified = true;entry.permission = resumed?.permission || '';
        safeSend(conn,{type:entry.permission ? 'approved' : 'pending',permission:entry.permission});
        if (entry.permission) {clearTimeout(entry.expiry);safeSend(conn,{type:'state',slide:window.ns2Slide || 1,ratio:scrollRatio});}
        deviceList();status(entry.permission ? 'Đã kết nối lại thiết bị đã duyệt.' : 'Có thiết bị đang chờ bạn chấp nhận.',entry.permission ? 'connected' : 'pending');return;
      }
      if (data.type === 'ping') {safeSend(conn,{type:'pong'});return;}if (!entry.permission) return;
      if (data.type === 'hello') {safeSend(conn,{type:'state',slide:window.ns2Slide || 1,ratio:scrollRatio});return;}
      if (data.type === 'command') {
        if (entry.permission !== 'control') {safeSend(conn,{type:'state',slide:window.ns2Slide || 1,ratio:scrollRatio,ack:data.id,viewOnly:true});return;}
        if (!valid(data.slide) || !Number.isFinite(data.ratio) || data.ratio < 0 || data.ratio > 1 || typeof data.id !== 'string' || data.id.length > 32) return;
        applyState(data);broadcastState(data.id);
      }
    });
    conn.on('close',() => {clearTimeout(entry.expiry);if (gen !== generation || devices.get(conn.connectionId) !== entry) return;devices.delete(conn.connectionId);deviceList();if (![...devices.values()].some(d => d.permission)) status('Điện thoại đã ngắt. Thiết bị đã duyệt có thể tự nối lại.');});
    conn.on('error',() => log('Kênh dữ liệu thiết bị gặp lỗi.'));
  }
  function scheduleRetry(gen) {
    if (stopped || gen !== generation || !speaker || retryCount >= 3) return;
    clearTimeout(retryTimer);retryCount++;status(`Đang kết nối lại lần ${retryCount}/3…`,'pending','Đang nối lại');retryTimer = setTimeout(() => {if (gen === generation && !stopped) connectController(gen);},retryCount * 1500);
  }
  function connectController(gen) {
    if (!peer || peer.destroyed || gen !== generation || stopped) return;
    if (peer.disconnected) {try {peer.reconnect();} catch { /* Manual retry remains. */ }return;}
    const previous = controller;controller = null;previous?.close();
    const conn = peer.connect(`ns2-v2-${room}`,{reliable:true,serialization:'json',metadata:{version:2,name:$('sync-name').value.trim() || 'Điện thoại',challenge}});controller = conn;accepted = false;
    clearTimeout(timeout);timeout = setTimeout(() => {if (gen === generation && !accepted) {status(conn.open ? 'Đường truyền đã mở. Chờ máy chiếu duyệt yêu cầu trong danh sách thiết bị.' : 'Chưa mở được đường truyền. Kiểm tra mã, giữ máy chiếu mở; thử cùng Wi-Fi hoặc TURN.','error',conn.open ? 'Chờ duyệt' : 'Chưa nối');$('sync-retry').hidden = false;}},20000);
    conn.on('open',() => {if (gen !== generation || controller !== conn) return;watchICE(conn,gen);lastSeen = Date.now();safeSend(conn,{type:'identify',token});status('Đã có đường truyền. Chờ máy chiếu chấp nhận thiết bị.','pending','Chờ máy duyệt');log('Kênh WebRTC đã mở.');});
    conn.on('data',data => {
      if (gen !== generation || controller !== conn || !data || typeof data !== 'object') return;lastSeen = Date.now();
      if (data.type === 'identify-required') safeSend(conn,{type:'identify',token});
      if (data.type === 'pending') {clearTimeout(timeout);status('Đối chiếu mã xác nhận ' + challenge + ' rồi nhờ người ở máy chiếu bấm Chấp nhận.','pending','Chờ máy duyệt');}
      if (data.type === 'approved') {accepted = true;permission = data.permission;retryCount = 0;clearTimeout(timeout);safeSend(conn,{type:'hello'});log('Máy chiếu đã cấp quyền ' + permission);}
      if (data.type === 'state' && accepted) {
        if (pendingCommand && data.ack && data.ack !== pendingCommand.id) return;
        pendingCommand = null;clearTimeout(commandTimer);applyState(data);status(`Đã kết nối và xác nhận slide ${data.slide}.`,'connected',permission === 'view' ? 'Chỉ xem' : `Đã nối · ${data.slide}/28`);$('sync-retry').hidden = true;keepAwake();
      }
      if (data.type === 'rejected' || data.type === 'revoked') {stopped = true;accepted = false;clearTimeout(timeout);status(data.reason || 'Máy chiếu đã ngắt quyền thiết bị. Gửi yêu cầu mới để được duyệt.','error','Đã từ chối');$('sync-retry').hidden = false;}
    });
    conn.on('close',() => {if (gen !== generation || controller !== conn || stopped) return;accepted = false;controller = null;status('Đã mất kết nối với máy chiếu. Đang thử nối lại…','error','Mất kết nối');$('sync-retry').hidden = false;scheduleRetry(gen);});
    conn.on('error',() => {if (gen === generation) {log('Lỗi kênh dữ liệu.');status('Kênh dữ liệu gặp lỗi. Thử lại hoặc kiểm tra mạng.','error');$('sync-retry').hidden = false;}});
  }
  async function start(kind,code,preserve = false) {
    clearNetwork();const gen = generation;stopped = false;role = kind;room = code;reconnectAttempts = 0;if (!preserve) {grants.clear();locked = false;}
    $('sync-room').hidden = true;$('sync-stop').hidden = false;$('sync-retry').hidden = true;status('Đang liên hệ dịch vụ ghép phòng…','pending');log('Bắt đầu kết nối dịch vụ.');
    try {
      await libraries();if (gen !== generation) return;
      if (kind === 'controller') {const key = 'ns2-device-' + room;token = readSession(key) || random(16);writeSession(key,token);challenge = String(1000 + crypto.getRandomValues(new Uint32Array(1))[0] % 9000);$('sync-challenge').hidden = false;$('sync-challenge').textContent = 'Mã xác nhận thiết bị: ' + challenge;writeSession('ns2-device-name',$('sync-name').value.trim());}
      peer = kind === 'host' ? new Peer(`ns2-v2-${code}`,peerOptions()) : new Peer(peerOptions());
      timeout = setTimeout(() => {if (gen === generation) {status('Dịch vụ ghép phòng chưa phản hồi. Kiểm tra Internet hoặc thử lại.','error');$('sync-retry').hidden = false;}},15000);
      peer.on('open',() => {
        if (gen !== generation) return;clearTimeout(timeout);log('Đã kết nối máy chủ ghép phòng.');
        if (kind === 'controller') connectController(gen);
        else {roomCollisions = 0;const url = new URL('speaker.html',location.href);url.searchParams.set('room',code);$('sync-room').hidden = false;$('sync-room-code').textContent = code;$('sync-link').value = url.href;const qr = qrcode(0,'M');qr.addData(url.href);qr.make();$('sync-qr').innerHTML = qr.createSvgTag({scalable:true,cellSize:4,margin:16});$('sync-lock').setAttribute('aria-pressed',String(locked));deviceList();status('Phòng sẵn sàng. Quét QR trên điện thoại và chấp nhận thiết bị ở đây.');}
      });
      peer.on('connection',conn => {if (gen === generation && kind === 'host') acceptIncoming(conn,gen);else conn.close();});
      peer.on('error',error => {
        if (gen !== generation) return;log('PeerJS: ' + error.type);
        if (error.type === 'unavailable-id' && kind === 'host' && roomCollisions++ < 3) {start('host',roomNumber());return;}
        clearTimeout(timeout);status(error.type === 'peer-unavailable' ? 'Không tìm thấy phòng. Kiểm tra 6 số và chắc chắn máy chiếu đang mở phòng.' : `Không kết nối được (${error.type}). Kiểm tra mạng hoặc thử lại.`,'error');$('sync-retry').hidden = false;
      });
      peer.on('disconnected',() => {if (gen !== generation || stopped) return;log('Mất kênh ghép phòng.');if (!controller?.open && ![...devices.values()].some(d => d.conn.open && d.permission)) status('Mất dịch vụ ghép phòng. Đang thử nối lại…','pending');if (reconnectAttempts++ < 3) retryTimer = setTimeout(() => {if (gen === generation && peer?.disconnected) try {peer.reconnect();} catch { /* Manual retry. */ }},2000);});
      interval = setInterval(() => {if (gen !== generation) return;if (speaker && controller?.open) {safeSend(controller,{type:'ping'});if (accepted && Date.now() - lastSeen > 18000) {accepted = false;status('Máy chiếu không phản hồi. Thử nối lại để xác nhận đúng slide.','error','Mất phản hồi');$('sync-retry').hidden = false;}}},5000);
    } catch(error) {status(error.message,'error');$('sync-retry').hidden = false;}
  }
  $('sync-retry').addEventListener('click',() => {retryCount = 0;if (room) start(role,room,true);});
  $('sync-lock').addEventListener('click',() => {locked = !locked;$('sync-lock').setAttribute('aria-pressed',String(locked));$('sync-lock').textContent = locked ? 'Đang khóa · Bấm để mở' : 'Khóa nhận thiết bị mới';if (locked) for (const [id,d] of devices) if (!d.permission) {safeSend(d.conn,{type:'rejected',reason:'Chủ máy đã khóa phòng.'});devices.delete(id);clearTimeout(d.expiry);setTimeout(() => d.conn.close(),100);}deviceList();});
  function startLocal(id,kind) {
    if (channel) channel.close();role = kind;stopped = false;channel = new BroadcastChannel('ns2-local-' + id);
    channel.onmessage = ({data}) => {if (!data || typeof data !== 'object') return;if (data.type === 'hello' && role === 'host') broadcastState();if (data.type === 'state' && role === 'controller') {applyState(data);status('Đã đồng bộ hai cửa sổ cùng máy.','connected','Hai màn hình');}if (data.type === 'command' && role === 'host' && valid(data.slide) && Number.isFinite(data.ratio)) {applyState(data);broadcastState(data.id);}};
    if (kind === 'host') broadcastState();else localSend({type:'hello'});$('sync-stop').hidden = false;keepAwake();
  }
  if (speaker) {
    $('sync-name').value = readSession('ns2-device-name') || 'Điện thoại của tôi';
    $('sync-join').addEventListener('click',() => {let code = $('sync-code').value.trim();try {code = new URL(code).searchParams.get('room') || code;} catch { /* Plain numeric code. */ }if (!roomValid(code)) {status('Nhập mã đúng 6 số hoặc dán liên kết QR mới.','error');return;}retryCount = 0;if (channel) {channel.close();channel = null;}start('controller',code);});
    $('sync-local').addEventListener('click',() => {const id = random(10),url = new URL('index.html',location.href);url.searchParams.set('local',id);url.hash = String(window.ns2Slide || 1);const child = window.open(url.href,'_blank');if (!child) {status('Cho phép cửa sổ bật lên để mở màn hình chiếu.','error');return;}stop();startLocal(id,'controller');status('Đã mở cửa sổ chiếu, đang chờ cửa sổ sẵn sàng…','pending','Chờ cửa sổ');});
    if (roomValid(query.get('room') || '')) {$('sync-code').value = query.get('room');dialog.showModal();status('Đã nhận mã phòng từ liên kết. Đặt tên thiết bị rồi bấm Gửi yêu cầu kết nối.');}else if (query.has('room')) {dialog.showModal();status('Liên kết phòng cũ không dùng được. Tạo phòng mới để có mã 6 số và QR.','error');}
  } else {window.ns2Ready = true;$('sync-host').addEventListener('click',() => start('host',roomNumber()));const id = query.get('local');if (/^[a-f0-9]{20}$/.test(id || '')) startLocal(id,'host');}
  $('sync-copy').addEventListener('click',async () => {try {await navigator.clipboard.writeText($('sync-link').value);status('Đã sao chép liên kết ghép. Mở trên điện thoại rồi duyệt yêu cầu ở máy chiếu.');} catch {$('sync-link').select();status('Hãy sao chép liên kết đang được chọn.');}});
  document.addEventListener('visibilitychange',() => {if (document.visibilityState !== 'visible' || stopped) return;keepAwake();if (speaker && room) {if (controller?.open && accepted) safeSend(controller,{type:'hello'});else {retryCount = 0;scheduleRetry(generation);}}if (channel) localSend({type:'hello'});});
  window.addEventListener('online',() => {if (!stopped && room && speaker && !accepted) {retryCount = 0;scheduleRetry(generation);}});
  window.addEventListener('offline',() => {if (!stopped && room) status('Thiết bị mất Internet. Sẽ thử lại khi có mạng.','error','Mất Internet');});
})();
