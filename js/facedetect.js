/* ================= FACE DETECTION (MediaPipe, on the phone) ================= */
/* Library + wasm from the CDN, the 230 KB model from our own assets – no image ever leaves the phone.
   Not available (offline, Claude viewer, old browser) → null, and the scan falls back to light/motion checks. */
const MP_VER = "0.10.14", MP_CDN = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VER}`;
let FDP = null;
function faceDetector() {
  if (!FDP)
    FDP = import(`${MP_CDN}/vision_bundle.mjs`).then(async V => {
      const files = await V.FilesetResolver.forVisionTasks(`${MP_CDN}/wasm`);
      const d = await V.FaceDetector.createFromOptions(files, { baseOptions: { modelAssetPath: "assets/models/blaze_face_short_range.tflite", delegate: "CPU" }, runningMode: "VIDEO", minDetectionConfidence: .5 });
      d.mode = "VIDEO";
      return d;
    }).catch(() => null);
  return FDP;
}
/* biggest face as a box in 0–1 coordinates of the source (video frame or image), or null */
async function detectFace(src) {
  const d = await faceDetector();
  if (!d)
    return null;
  const video = src instanceof HTMLVideoElement, mode = video ? "VIDEO" : "IMAGE";
  if (d.mode !== mode) {
    await d.setOptions({ runningMode: mode });
    d.mode = mode;
  }
  const W = video ? src.videoWidth : src.naturalWidth || src.width, H = video ? src.videoHeight : src.naturalHeight || src.height;
  const r = video ? d.detectForVideo(src, performance.now()) : d.detect(src);
  const f = (r.detections || []).sort((a, b) => b.boundingBox.width - a.boundingBox.width)[0];
  if (!f)
    return { none: true };
  const bb = f.boundingBox;
  return { x: bb.originX / W, y: bb.originY / H, w: bb.width / W, h: bb.height / H };
}
/* zoom + offset for the adjust step so the face fills the oval (eyebrows to chin ≈ oval height) */
function autoCrop(box, im) {
  const base = Math.max(240 / im.width, 282 / im.height);
  const zoom = Math.min(3.5, Math.max(1, .8 * 282 / (box.h * im.height * base)));
  return { zoom, dx: .5 - (box.x + box.w / 2), dy: .5 - (box.y + box.h * .54) };
}
