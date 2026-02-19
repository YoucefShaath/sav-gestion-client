module.exports=[40073,e=>{"use strict";var t=e.i(56453),a=e.i(94533),i=e.i(14520),r=e.i(48819),n=e.i(35877),o=e.i(20513),s=e.i(99500),l=e.i(64358),c=e.i(92187),d=e.i(46048),p=e.i(23499),u=e.i(85095),g=e.i(26946),h=e.i(99606),m=e.i(18223),v=e.i(93695);e.i(74242);var f=e.i(30983),R=e.i(41250);let E={Received:"Reçu",Diagnostic:"Diagnostic","In Progress":"En cours",Completed:"Terminé",Delivered:"Livré"},y={"Laser Mono - Photocopieur":"Laser Mono – Photocopieur","Laser Mono - MFP":"Laser Mono – Imprimante MFP","Laser Couleur - Photocopieur":"Laser Couleur – Photocopieur","Laser Couleur - MFP":"Laser Couleur – Imprimante MFP","MFP Ink":"MFP Ink Cartouche / Bouteille",Matricielle:"Matricielle",Laptop:"Laptop","All In One":"All In One","PC Bureaux":"PC Bureaux",Serveur:"Serveur",Ecran:"Écran",Reseau:"Réseau",Other:"Autre"},x={Received:["Diagnostic"],Diagnostic:["In Progress","Received","Completed"],"In Progress":["Completed","Diagnostic"],Completed:["Delivered","In Progress"],Delivered:[]};var _=e.i(41996);async function w(e){let t=new URL(e.url,"http://localhost"),a=t.searchParams.get("id"),i=t.searchParams.get("status"),r=t.searchParams.get("category"),n=t.searchParams.get("priority"),o=t.searchParams.get("search"),s=parseInt(t.searchParams.get("page")||"1"),l=Math.min(100,parseInt(t.searchParams.get("limit")||"50")),c=(s-1)*l,d=await R.default.getConnection();try{if(a){let[e]=await d.query("SELECT * FROM tickets WHERE ticket_id = ?",[a]);if(!e.length)return Response.json({error:"Ticket introuvable."},{status:404});let t=e[0],[i]=await d.query("SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC",[a]);return t.history=i,Response.json(t)}let e=[],t=[];i&&(e.push("status = ?"),t.push(i)),r&&(e.push("hardware_category = ?"),t.push(r)),n&&(e.push("priority = ?"),t.push(n)),o&&(e.push("(client_name LIKE ? OR client_phone LIKE ? OR ticket_id LIKE ?)"),t.push(`%${o}%`,`%${o}%`,`%${o}%`));let p="SELECT * FROM tickets";e.length&&(p+=" WHERE "+e.join(" AND ")),p+=" ORDER BY FIELD(priority, 'Urgent','High','Normal','Low'), created_at DESC";let[u]=await d.query(p.replace("SELECT *","SELECT COUNT(*) as total"),t),g=u[0]?.total||0;p+=" LIMIT ? OFFSET ?",t.push(l,c);let[h]=await d.query(p,t);return Response.json({data:h,total:g,page:s,limit:l,pages:Math.ceil(g/l)})}finally{d.release()}}async function b(e){let{client_name:t,client_phone:a,client_email:i,hardware_category:r,brand:n,model:o,reference:s,serial_number:l,problem_description:c,priority:d="Normal",location:p="Reception"}=await e.json()||{},u=[];if(t&&String(t).trim()||u.push("client_name"),a&&String(a).trim()||u.push("client_phone"),r&&String(r).trim()||u.push("hardware_category"),n&&String(n).trim()||u.push("brand"),c&&String(c).trim()||u.push("problem_description"),u.length)return Response.json({errors:u,error:"Champs obligatoires manquants."},{status:422});let g=String(a).replace(/[^0-9\+]/g,"");if(!/^\+?\d{10,15}$/.test(g))return Response.json({error:"Numéro de téléphone invalide."},{status:422});let h=await R.default.getConnection();try{let e="SAV-"+new Date().toISOString().slice(2,10).replace(/-/g,"").slice(0,6)+"-",[s]=await h.query("SELECT ticket_id FROM tickets WHERE ticket_id LIKE ? ORDER BY id DESC LIMIT 1",[e+"%"]),u=1;if(s.length){let e=s[0].ticket_id,t=parseInt(e.slice(-4),10);isNaN(t)||(u=t+1)}let g=e+String(u).padStart(4,"0");await h.query(`INSERT INTO tickets (ticket_id, client_name, client_phone, client_email, hardware_category, brand, model, serial_number, problem_description, status, location, priority, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Received', ?, ?, NOW(), NOW())`,[g,t,a,i||null,r,n,o||null,l||null,c,p||null,d||"Normal"]),await h.query("INSERT INTO status_history (ticket_id, new_status, changed_at) VALUES (?, 'Received', NOW())",[g]);let[m]=await h.query("SELECT * FROM tickets WHERE ticket_id = ?",[g]),v=m[0],[f]=await h.query("SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC",[g]);return v&&(v.history=f),Response.json(v)}catch(e){return console.error(e),Response.json({error:"Erreur lors de la création du ticket."},{status:500})}finally{h.release()}}async function C(e){return Response.json({error:"Not implemented"},{status:501})}async function T(e){let t=new URL(e.url,"http://localhost"),a=t.searchParams.get("id");if(!a)return Response.json({error:"ID requis"},{status:400});let i=(await e.json()).status;if(!i)return Response.json({error:"Nouveau statut requis"},{status:400});let r=Object.fromEntries(Object.entries(E).map(([e,t])=>[t,e]));function n(e){return!e||x[e]?e:r[e]?r[e]:e}let o=n(i),s=await R.default.getConnection();try{let[e]=await s.query("SELECT status FROM tickets WHERE ticket_id = ?",[a]);if(!e.length)return Response.json({error:"Ticket introuvable."},{status:404});let r=n(e[0].status)||e[0].status;if(!x[r]||!x[r].includes(o))return Response.json({error:`Transition invalide: ${e[0].status} → ${i}`},{status:400});await s.query("UPDATE tickets SET status = ?, updated_at = NOW() WHERE ticket_id = ?",[o,a]),await s.query("INSERT INTO status_history (ticket_id, new_status, changed_at) VALUES (?, ?, NOW())",[a,o]);let[l]=await s.query("SELECT * FROM tickets WHERE ticket_id = ?",[a]),c=l[0]||null,[d]=await s.query("SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC",[a]);if(c&&(c.history=d),"Completed"===o&&c&&c.client_email&&"false"!==process.env.EMAIL_ON_COMPLETED)try{let e=t.origin||process.env.NEXT_PUBLIC_APP_URL||process.env.APP_URL||"http://localhost",a=`${e.replace(/\/$/,"")}/track/${c.ticket_id}`,i=`Votre r\xe9paration (${c.ticket_id}) est pr\xeate`,r=function(e,t=process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"){var a;let i=`FAC-${(e.ticket_id||"").replace("SAV-","")}`,r=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}),n=parseFloat(e.estimated_cost)||0,o=parseFloat(e.final_cost)||n||0,s=.19*o,l=o+s,c=`${t.replace(/\/$/,"")}/logo.jpg`;return`<!doctype html>
  <html lang="fr">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Facture ${i}</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; color: #111827; background: #fff; }
        .invoice { max-width:800px; margin:0 auto; padding:28px; }
        .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;border-bottom:3px solid #1e40af;padding-bottom:12px}
        .company{font-size:12px;color:#6b7280}
        h1{color:#1e40af;margin:0;font-size:28px}
        .section{margin-bottom:18px}
        .box{background:#f9fafb;border-radius:8px;padding:12px}
        table{width:100%;border-collapse:collapse;margin-top:8px}
        thead th{background:#1e40af;color:#fff;padding:8px 10px;font-size:11px;text-transform:uppercase}
        tbody td{padding:10px 10px;border-bottom:1px solid #e5e7eb}
        .totals{display:flex;justify-content:flex-end;margin-top:12px}
        .totals-box{width:260px}
        .total-row{display:flex;justify-content:space-between;padding:8px 0;color:#374151}
        .grand{font-weight:800;color:#1e40af;border-top:2px solid #1e40af;padding-top:10px}
        .footer{margin-top:24px;color:#9ca3af;font-size:12px;text-align:center}
        @media print{ .no-print{display:none} }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div style="display:flex;gap:16px;align-items:center">
            <img src="${c}" alt="logo" style="height:80px;object-fit:contain" />
            <div class="company">
              <strong style="color:#111827;display:block">Informatica Company</strong>
              12, chemin Sidi Yahia, locale 14<br/>Bir Mourad Ra\xefs, Alger<br/>0793 27 23 79<br/>contact@informaticacompany.com
            </div>
          </div>
          <div style="text-align:right">
            <h1>FACTURE</h1>
            <div style="color:#6b7280;margin-top:6px">${i}</div>
            <div style="color:#9ca3af;margin-top:4px">Date : ${r}</div>
          </div>
        </div>

        <div class="section" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px">
          <div class="box">
            <strong>Client</strong>
            <div style="margin-top:6px">${e.client_name||"-"}</div>
            <div style="color:#6b7280;margin-top:4px">${e.client_phone||"-"}</div>
            ${e.client_email?`<div style="color:#6b7280;margin-top:4px">${e.client_email}</div>`:""}
          </div>
          <div class="box">
            <strong>Informations ticket</strong>
            <div style="margin-top:8px">N\xb0 Ticket: <strong>${e.ticket_id||"-"}</strong></div>
            <div>Date cr\xe9ation: ${!(a=e.created_at)?"—":new Date(a).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
            <div>Priorit\xe9: ${e.priority||"-"}</div>
          </div>
        </div>

        <div class="section">
          <div style="font-size:11px;color:#1e40af;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">D\xe9tails de la prestation</div>
          <table>
            <thead>
              <tr><th>Description</th><th>Mat\xe9riel</th><th style="text-align:right">Montant HT</th></tr>
            </thead>
            <tbody>
              <tr>
                <td style="vertical-align:top">
                  <div style="font-weight:600;margin-bottom:6px">R\xe9paration / Maintenance</div>
                  <div style="color:#6b7280">${(e.problem_description||"-").replace(/\n/g,"<br/>")}</div>
                  ${e.diagnostic_notes?`<div style="margin-top:8px;color:#9ca3af">Diagnostic: ${e.diagnostic_notes}</div>`:""}
                </td>
                <td style="vertical-align:top">
                  <div>${y[e.hardware_category]||e.hardware_category||"-"}</div>
                  <div style="color:#6b7280">${[e.brand,e.model].filter(Boolean).join(" ")||"—"}</div>
                  ${e.serial_number?`<div style="color:#9ca3af;margin-top:6px">S/N: ${e.serial_number}</div>`:""}
                </td>
                <td style="text-align:right;vertical-align:top;font-weight:600">${o>0?`${o.toLocaleString("fr-DZ")} DA`:"—"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        ${o>0?`
          <div class="totals">
            <div class="totals-box">
              <div class="total-row"><span>Total HT</span><span>${o.toLocaleString("fr-DZ")} DA</span></div>
              <div class="total-row"><span>TVA (19%)</span><span>${s.toLocaleString("fr-DZ",{minimumFractionDigits:2})} DA</span></div>
              <div class="total-row grand"><span>Total TTC</span><span>${l.toLocaleString("fr-DZ",{minimumFractionDigits:2})} DA</span></div>
            </div>
          </div>
        `:""}

        ${e.technician_notes?`<div style="background:#eff6ff;border-radius:8px;padding:12px;margin-top:12px;color:#1e40af"> <strong>Notes :</strong> ${e.technician_notes}</div>`:""}

        <div class="footer">Informatica Company — 12, chemin Sidi Yahia, locale 14 — contact@informaticacompany.com</div>
      </div>
    </body>
  </html>`}(c,e),n=`<p>Bonjour ${c.client_name||"client"},</p>
          <p>Votre appareil pris en charge sous le num\xe9ro <strong>${c.ticket_id}</strong> est d\xe9sormais <strong>termin\xe9</strong>. Vous trouverez ci-dessous la facture correspondante et vous pouvez \xe9galement la consulter en ligne : <a href="${a}">${a}</a></p>`,o=`FAC-${(c.ticket_id||"").replace("SAV-","")}.html`,s=await (0,_.sendMail)({to:c.client_email,subject:i,html:n+r,attachments:[{filename:o,content:r,contentType:"text/html"}]});console.log("Status-change email (with invoice) result:",s)}catch(e){console.error("Failed to send completion email:",e)}return Response.json(c)}finally{s.release()}}async function S(e){let t=new URL(e.url,"http://localhost").searchParams.get("id");if(!t)return Response.json({error:"ID requis"},{status:400});let a=await R.default.getConnection();try{await a.beginTransaction();let[e]=await a.query("SELECT ticket_id FROM tickets WHERE ticket_id = ?",[t]);if(!e.length)return await a.rollback(),Response.json({error:"Ticket introuvable."},{status:404});return await a.query("DELETE FROM status_history WHERE ticket_id = ?",[t]),await a.query("DELETE FROM tickets WHERE ticket_id = ?",[t]),await a.commit(),Response.json({success:!0})}catch(e){return await a.rollback(),console.error("Delete ticket error:",e),Response.json({error:"Erreur lors de la suppression."},{status:500})}finally{a.release()}}e.s(["DELETE",()=>S,"GET",()=>w,"PATCH",()=>T,"POST",()=>b,"PUT",()=>C],39429);var k=e.i(39429);let P=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/tickets/route",pathname:"/api/tickets",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/sav-gestion-client/src/app/api/tickets/route.js",nextConfigOutput:"",userland:k}),{workAsyncStorage:O,workUnitAsyncStorage:A,serverHooks:D}=P;function L(){return(0,i.patchFetch)({workAsyncStorage:O,workUnitAsyncStorage:A})}async function $(e,t,i){P.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let R="/api/tickets/route";R=R.replace(/\/index$/,"")||"/";let E=await P.prepare(e,t,{srcPage:R,multiZoneDraftMode:!1});if(!E)return t.statusCode=400,t.end("Bad Request"),null==i.waitUntil||i.waitUntil.call(i,Promise.resolve()),null;let{buildId:y,params:x,nextConfig:_,parsedUrl:w,isDraftMode:b,prerenderManifest:C,routerServerContext:T,isOnDemandRevalidate:S,revalidateOnlyGenerated:k,resolvedPathname:O,clientReferenceManifest:A,serverActionsManifest:D}=E,L=(0,s.normalizeAppPath)(R),$=!!(C.dynamicRoutes[L]||C.routes[O]),I=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,w,!1):t.end("This page could not be found"),null);if($&&!b){let e=!!C.routes[O],t=C.dynamicRoutes[L];if(t&&!1===t.fallback&&!e){if(_.experimental.adapterPath)return await I();throw new v.NoFallbackError}}let N=null;!$||P.isDev||b||(N="/index"===(N=O)?"/":N);let M=!0===P.isDev||!$,F=$&&!M;D&&A&&(0,o.setManifestsSingleton)({page:R,clientReferenceManifest:A,serverActionsManifest:D});let j=e.method||"GET",q=(0,n.getTracer)(),H=q.getActiveScopeSpan(),U={params:x,prerenderManifest:C,renderOpts:{experimental:{authInterrupts:!!_.experimental.authInterrupts},cacheComponents:!!_.cacheComponents,supportsDynamicResponse:M,incrementalCache:(0,r.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:_.cacheLife,waitUntil:i.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,r)=>P.onRequestError(e,t,i,r,T)},sharedContext:{buildId:y}},W=new l.NodeNextRequest(e),B=new l.NodeNextResponse(t),V=c.NextRequestAdapter.fromNodeNextRequest(W,(0,c.signalFromNodeResponse)(t));try{let o=async e=>P.handle(V,U).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=q.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${j} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t)}else e.updateName(`${j} ${R}`)}),s=!!(0,r.getRequestMeta)(e,"minimalMode"),l=async r=>{var n,l;let c=async({previousCacheEntry:a})=>{try{if(!s&&S&&k&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await o(r);e.fetchMetrics=U.renderOpts.fetchMetrics;let l=U.renderOpts.pendingWaitUntil;l&&i.waitUntil&&(i.waitUntil(l),l=void 0);let c=U.renderOpts.collectedTags;if(!$)return await (0,u.sendResponse)(W,B,n,U.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(n.headers);c&&(t[m.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==U.renderOpts.collectedRevalidate&&!(U.renderOpts.collectedRevalidate>=m.INFINITE_CACHE)&&U.renderOpts.collectedRevalidate,i=void 0===U.renderOpts.collectedExpire||U.renderOpts.collectedExpire>=m.INFINITE_CACHE?void 0:U.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==a?void 0:a.isStale)&&await P.onRequestError(e,t,{routerKind:"App Router",routePath:R,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:S})},!1,T),t}},d=await P.handleResponse({req:e,nextConfig:_,cacheKey:N,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:k,responseGenerator:c,waitUntil:i.waitUntil,isMinimalMode:s});if(!$)return null;if((null==d||null==(n=d.value)?void 0:n.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",S?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),b&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let v=(0,g.fromNodeOutgoingHttpHeaders)(d.value.headers);return s&&$||v.delete(m.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||v.get("Cache-Control")||v.set("Cache-Control",(0,h.getCacheControlHeader)(d.cacheControl)),await (0,u.sendResponse)(W,B,new Response(d.value.body,{headers:v,status:d.value.status||200})),null};H?await l(H):await q.withPropagatedContext(e.headers,()=>q.trace(d.BaseServerSpan.handleRequest,{spanName:`${j} ${R}`,kind:n.SpanKind.SERVER,attributes:{"http.method":j,"http.target":e.url}},l))}catch(t){if(t instanceof v.NoFallbackError||await P.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:S})},!1,T),$)throw t;return await (0,u.sendResponse)(W,B,new Response(null,{status:500})),null}}e.s(["handler",()=>$,"patchFetch",()=>L,"routeModule",()=>P,"serverHooks",()=>D,"workAsyncStorage",()=>O,"workUnitAsyncStorage",()=>A],40073)}];

//# sourceMappingURL=18f6e_next_dist_esm_build_templates_app-route_d4e3727d.js.map