const API = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

function getToken() {
  return localStorage.getItem("token");
}

export async function api(path, options = {}) {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = {
    ...(options.headers || {}),
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API}${path}`;
  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (networkErr) {
    // #region agent log
    fetch('http://127.0.0.1:7481/ingest/b0a2a51a-b970-481d-9e1e-538890033a31',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c7e133'},body:JSON.stringify({sessionId:'c7e133',runId:'pre-fix',hypothesisId:'B',location:'api.js:fetch',message:'Network/fetch failed',data:{url,error:String(networkErr)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    throw networkErr;
  }
  const data = await res.json().catch(() => ({}));
  // #region agent log
  fetch('http://127.0.0.1:7481/ingest/b0a2a51a-b970-481d-9e1e-538890033a31',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c7e133'},body:JSON.stringify({sessionId:'c7e133',runId:'post-fix',hypothesisId:'C',location:'api.js:response',message:'API response received',data:{url,status:res.status,ok:res.ok,error:data.error||null,hasFeatured:Array.isArray(data.featured)},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}
