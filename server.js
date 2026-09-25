import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import {fileURLToPath} from "node:url";

dotenv.config();
const app=express();
const __dirname=path.dirname(fileURLToPath(import.meta.url));
app.use(express.json());
app.use(express.static(__dirname));

// Adapter boundary: the browser never receives broker credentials.
// Wire this adapter to an authorized broker API/connector when deployed.
async function getBrokerSnapshot(){
  return {connected:false,source:"not_configured",message:"Broker data adapter is not configured. Keep credentials server-side."};
}

app.get("/api/health",(req,res)=>res.json({ok:true,time:new Date().toISOString()}));
app.get("/api/portfolio",async(req,res)=>{try{res.json(await getBrokerSnapshot())}catch(e){res.status(502).json({error:"broker_unavailable"})}});
app.get("/api/positions",async(req,res)=>{try{res.json(await getBrokerSnapshot())}catch(e){res.status(502).json({error:"broker_unavailable"})}});
app.get("/api/quotes",async(req,res)=>{res.status(501).json({error:"quotes_adapter_not_configured"})});

const port=Number(process.env.PORT||3000);
app.listen(port,()=>console.log("Trading dashboard server listening on "+port));
