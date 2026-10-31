FLEX AI STUDIO — WEBSITE + AI API BACKEND

இந்த ZIP-ல்:
- public/index.html — FLEX AI STUDIO website
- server/index.js — Node.js backend
- AI Image API route + status polling
- AI Video API route + status polling
- Photo Editor / Video Editor browser tools

முக்கியம்:
இது API-connected starter project; இன்னும் public live website அல்ல. உண்மையான AI output பெற Replicate account-இல் இருந்து API token தேவை. Model usage-க்கு கட்டணம் வரலாம். API account, billing, hosting மற்றும் public launch-ஐ parent/guardian மேற்பார்வையில் அமைக்கவும். API token-ஐ chat-ல் அனுப்பாதீர்கள்; HTML-ல் சேர்க்காதீர்கள்.

Local run:
1. Node.js 20+ நிறுவவும்.
2. இந்த folder-ல் terminal திறந்து `npm install`.
3. `.env.example`-ஐ `.env` என்று copy செய்யவும்.
4. `.env`-ல் private API token சேர்க்கவும்.
5. `npm start`.
6. http://localhost:4242 திறக்கவும்.
7. API health: http://localhost:4242/api/health

Default image model: black-forest-labs/flux-schnell.
Default video model: minimax/video-01.
Model input schema/pricing மாறலாம்; public launch முன் model documentation-ஐ சரிபார்க்கவும்.
Default image model text-to-image மட்டுமே; reference image support வேண்டுமெனில் reference-image input உள்ள model-ஐ அமைக்க வேண்டும். Video model-ன் first_frame_image input-ஐயும் தேர்ந்த model-க்கு ஏற்ப உறுதிப்படுத்தவும்.

Payment:
UPI ID மட்டும் automatic payment verification செய்யாது. இந்த project-ல் real payment verification / Premium activation இப்போது disabled. அதற்கு adult/guardian-managed merchant account, gateway credentials, signed webhook, backend verification, terms/refund/privacy policy மற்றும் security review தேவை.

Public launch:
Node.js hosting-ல் deploy செய்து environment variables அமைக்க வேண்டும். HTTPS domain கிடைத்த பிறகே public website link கிடைக்கும். நான் இங்கிருந்து hosting account அல்லது API token உருவாக்க முடியாது.
