/* Voice clips: app/assets/audio/<ID>.mp3. ADUR = duration in seconds (the timeline uses it).
   AUD stays empty in development (clips are fetched); tools/build.py fills it with base64 for the single-file build. */
const AUDIO_BASE = "assets/audio/";
const AUD = {};
const ADUR = { "A01": 2.84, "A02": 3.64, "A03": 3.13, "A04": 3.92, "A05": 3.2, "A06": 2.99, "A07": 1.12, "A08_dance": 1.08, "A08_friends": 0.94, "A08_garden": 2.95, "A08_grand": 1.3, "A08_own": 2.99, "A08_travel": 2.88, "A09": 3.56, "B01": 2.05, "B02": 2.34, "B03": 1.44, "B04": 1.08, "B05": 4.9, "B06": 2.81, "B07": 1.15, "B08_cycle": 1.98, "B08_dance": 2.66, "B08_friends": 3.49, "B08_garden": 1.87, "B08_grand": 1.62, "B08_hike": 1.66, "B08_own": 2.66, "B08_travel": 2.52, "B09": 3.89, "B10": 1.73, "C_hike": 3.6, "F_cycle": 1.84, "F_dance": 1.51, "F_friends": 1.33, "K_A_f": 1.55, "K_A_m": 1.51, "K_B_f": 1.94, "K_B_m": 1.98, "O01": 5.33, "O02": 2.41, "O03": 3.71 };
