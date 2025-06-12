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

  let count = 1;
  pedidos.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <button class="fechar" onclick="cancelar('${p.id}')">×</button>
      <strong>#${String(count).padStart(3, '0')} - ${p.cliente}</strong>
      <p>${p.descricao}</p>`;

    if (p.status === "analise") {
      div.innerHTML += `<button onclick="mudarStatus('${p.id}', 'producao')">Aceitar</button>`;
    } else if (p.status === "producao") {
      div.innerHTML += `<button onclick="mudarStatus('${p.id}', 'entrega')">➜</button>`;
    }
    document.getElementById(p.status).appendChild(div);
    count++;
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
  const senha = prompt("Digite a senha para cancelar este pedido:");
  if (senha !== "123") { // Substitua "1234" pela sua senha real
    alert("Senha incorreta. Cancelamento abortado.");
    return;
  }

  await fetch(`${SUPABASE_URL}/rest/v1/pedidos?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });

  fetchPedidos();
}

async function zerarPedidos() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/pedidos?status=eq.entrega`, {
    method: "DELETE",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  fetchPedidos();
}

document.getElementById("resetBtn").addEventListener("click", async () => {
  const analise = document.getElementById("analise").children.length;
  const producao = document.getElementById("producao").children.length;
  if (analise > 1 || producao > 1) {
    alert("Só é permitido zerar quando não houver pedidos em Análise ou Produção.");
    return;
  }
  await zerarPedidos();
});

setInterval(fetchPedidos, 5000);
fetchPedidos();
