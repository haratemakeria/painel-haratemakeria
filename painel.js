
const SUPABASE_URL = "https://ktkpdacxvqyautkfplly.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0a3BkYWN4dnF5YXV0a2ZwbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTY1ODIsImV4cCI6MjA2NTMzMjU4Mn0.TRkSYcCX158bDLFb7lHD0ZNWKHgTBalFzdpb9UET2gk";

async function fetchPedidos() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/pedidos?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  const pedidos = await res.json();
  renderPedidos(pedidos);
}

function renderPedidos(pedidos) {
  ["analise", "producao", "entrega"].forEach(status => {
    const col = document.getElementById(status);
    col.innerHTML = `<h2>${status.charAt(0).toUpperCase() + status.slice(1)}</h2>`;
  });

  pedidos.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<strong>${p.cliente}</strong><p>${p.descricao}</p>`;

    if (p.status === "analise") {
      div.innerHTML += `<button onclick="mudarStatus('${p.id}', 'producao')">Aceitar</button>`;
    } else if (p.status === "producao") {
      div.innerHTML += `<button onclick="mudarStatus('${p.id}', 'entrega')">Avançar</button>`;
    }
    div.innerHTML += `<button onclick="cancelar('${p.id}')">Cancelar</button>`;

    document.getElementById(p.status).appendChild(div);
  });
}

async function mudarStatus(id, novoStatus) {
  await fetch(`${SUPABASE_URL}/rest/v1/pedidos?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status: novoStatus })
  });
  fetchPedidos();
}

async function cancelar(id) {
  await fetch(`${SUPABASE_URL}/rest/v1/pedidos?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  fetchPedidos();
}

setInterval(fetchPedidos, 5000);
fetchPedidos();
