require("dotenv").config();
const express=require("express"),helmet=require("helmet"),rateLimit=require("express-rate-limit"),path=require("path");
const app=express();
app.use(helmet({contentSecurityPolicy:false}));
app.use(express.static(path.join(__dirname,"..","public")));
app.use(express.json({limit:"18mb"}));
app.use(rateLimit({windowMs:60000,limit:20}));
const TOKEN=process.env.REPLICATE_API_TOKEN;
const IMAGE_MODEL=process.env.REPLICATE_IMAGE_MODEL||"black-forest-labs/flux-schnell";
const VIDEO_MODEL=process.env.REPLICATE_VIDEO_MODEL||"minimax/video-01";
function ready(res){if(!TOKEN||TOKEN.includes("PASTE_")){res.status(503).json({error:"AI provider is not configured. Add a private Replicate API token to the server .env file."});return false}return true}
async function create(model,input){
 const r=await fetch(`https://api.replicate.com/v1/models/${model}/predictions`,{method:"POST",headers:{Authorization:`Bearer ${TOKEN}`,"Content-Type":"application/json",Prefer:"wait=5"},body:JSON.stringify({input})});
 const d=await r.json().catch(()=>({}));
 if(!r.ok){const e=new Error(typeof d.detail==="string"?d.detail:"AI provider rejected the request");e.status=r.status;throw e}return d;
}
app.get("/api/health",(_,res)=>res.json({ok:true,aiConfigured:!!TOKEN&&!TOKEN.includes("PASTE_"),imageModel:IMAGE_MODEL,videoModel:VIDEO_MODEL,paymentConfigured:false}));
app.post("/api/generate/image",async(req,res)=>{
 if(!ready(res))return;
 const {prompt,aspectRatio="1:1",referenceImage}=req.body||{};
 if(typeof prompt!=="string"||!prompt.trim()||prompt.length>2500)return res.status(400).json({error:"Enter a prompt (up to 2500 characters)."});
 if(!["1:1","16:9","9:16","4:5"].includes(aspectRatio))return res.status(400).json({error:"Unsupported aspect ratio."});
 if(referenceImage)return res.status(400).json({error:"The default image model is text-to-image. Configure a reference-image model before using reference uploads."});
 try{const d=await create(IMAGE_MODEL,{prompt:prompt.trim(),aspect_ratio:aspectRatio,output_format:"webp"});res.status(202).json({id:d.id,status:d.status})}
 catch(e){res.status(e.status||502).json({error:e.message})}
});
app.post("/api/generate/video",async(req,res)=>{
 if(!ready(res))return;
 const {prompt,referenceImage}=req.body||{};
 if(typeof prompt!=="string"||!prompt.trim()||prompt.length>2500)return res.status(400).json({error:"Enter a prompt (up to 2500 characters)."});
 try{
  const input={prompt:prompt.trim()};
  if(referenceImage){
   if(typeof referenceImage!=="string"||!referenceImage.startsWith("data:image/")||referenceImage.length>12000000)return res.status(400).json({error:"Reference image is invalid or too large."});
   input.first_frame_image=referenceImage;
  }
  const d=await create(VIDEO_MODEL,input);res.status(202).json({id:d.id,status:d.status});
 }catch(e){res.status(e.status||502).json({error:e.message})}
});
app.get("/api/predictions/:id",async(req,res)=>{
 if(!ready(res))return;
 if(!/^[a-zA-Z0-9_-]{5,100}$/.test(req.params.id))return res.status(400).json({error:"Invalid prediction ID."});
 try{
  const r=await fetch(`https://api.replicate.com/v1/predictions/${encodeURIComponent(req.params.id)}`,{headers:{Authorization:`Bearer ${TOKEN}`}});
  const d=await r.json().catch(()=>({}));
  if(!r.ok)return res.status(r.status).json({error:"Could not retrieve generation status."});
  res.json({id:d.id,status:d.status,output:d.output,error:d.error});
 }catch(_){res.status(502).json({error:"AI provider temporarily unavailable."})}
});
app.get("/api/payments/status",(_,res)=>res.json({configured:false,message:"Real payment verification is not enabled in this starter."}));
app.listen(Number(process.env.PORT||4242),()=>console.log("FLEX AI STUDIO backend running"));
