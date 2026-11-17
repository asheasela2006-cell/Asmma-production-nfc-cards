const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const url2=u=>/^https?:\/\//i.test(u)?u:"https://"+u;
const at=u=>u.replace(/^@/,"");
const ICONS={
 phone:["#16a34a","Call",'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>'],
 email:["#e63946","Email",'<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><polyline points="22,6 12,13 2,6"/>'],
 whatsapp:["#25D366","WhatsApp",'<path d="M3 21l1.65-4.9A9 9 0 1 1 8 19.4L3 21z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-1.8-1-.9.7c-.9-.4-1.6-1.1-2-2l.7-.9-1-1.8z"/>'],
 telegram:["#229ED9","Telegram",'<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>'],
 instagram:["#E1306C","Instagram",'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>'],
 tiktok:["#111827","TikTok",'<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.3 2.5 2 4.2 5 4.5"/>'],
 linkedin:["#0A66C2","LinkedIn",'<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>'],
 website:["#2f6bff","Website",'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>']
};
const svg=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k][2]}</svg>`;
const badge=k=>`<span class="ic" style="background:${ICONS[k][0]}">${svg(k)}</span>`;
function links(d){const l=[];
 if(d.phone)l.push(["phone","tel:"+d.phone.replace(/\s/g,"")]);
 if(d.email)l.push(["email","mailto:"+d.email]);
 if(d.whatsapp)l.push(["whatsapp","https://wa.me/"+d.whatsapp.replace(/\D/g,"")]);
 if(d.telegram)l.push(["telegram","https://t.me/"+at(d.telegram)]);
 if(d.instagram)l.push(["instagram","https://instagram.com/"+at(d.instagram)]);
 if(d.tiktok)l.push(["tiktok","https://tiktok.com/@"+at(d.tiktok)]);
 if(d.linkedin)l.push(["linkedin",url2(d.linkedin)]);
 if(d.website)l.push(["website",url2(d.website)]);
 return l}
function cardHTML(d){
 return (d.photo?`<img src="${esc(d.photo)}" alt="" onerror="this.remove()">`:"")+
 `<h3>${esc(d.name||"Your name")}</h3><p>${esc([d.title,d.company].filter(Boolean).join(" at ")||"Job title at Company")}</p>`+
 (d.bio?`<p style="font-size:14px">${esc(d.bio)}</p>`:"")+
 `<div class="icons">${links(d).map(l=>badge(l[0])).join("")}</div>`}
function vcf(d){const L=["BEGIN:VCARD","VERSION:3.0","FN:"+(d.name||""),"ORG:"+(d.company||""),"TITLE:"+(d.title||"")];
 if(d.phone)L.push("TEL;TYPE=CELL:"+d.phone);if(d.email)L.push("EMAIL:"+d.email);
 if(d.website)L.push("URL:"+url2(d.website));if(d.bio)L.push("NOTE:"+d.bio.replace(/\n/g," "));
 L.push("END:VCARD");return L.join("\r\n")}
function dl(d){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([vcf(d)],{type:"text/vcard"}));
 a.download=(d.name||"contact").replace(/\s+/g,"-")+".vcf";a.click()}
