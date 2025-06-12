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

  let numero = 1;
  pedidos.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<strong>Pedido #${numero++} - ${p.cliente}</strong><p>${p.descricao}</p>`;

    if (p.status === "analise") {
      div.innerHTML += `<button onclick="mudarStatus('${p.id}', 'producao')" class="seta-verde">Aceitar</button>`;
    } else if (p.status === "producao") {
      div.innerHTML += `<button onclick="mudarStatus('${p.id}', 'entrega')" class="seta-verde">▶</button>`;
    } else if (p.status === "entrega") {
      div.innerHTML += `<button onclick="mudarStatus('${p.id}', 'finalizado')" class="seta-verde">▶</button>`;
    }

    if (p.status === "producao" || p.status === "entrega") {
      div.innerHTML += `<button class='btn-x' onclick="pedirSenhaECancelar('${p.id}')">X</button>`;
    }

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

async function pedirSenhaECancelar(id) {
  const senha = prompt("Digite a senha para cancelar:");
  if (senha === "1234") {
    await fetch(`${SUPABASE_URL}/rest/v1/pedidos?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
    fetchPedidos();
  } else {
    alert("Senha incorreta!");
  }
}

async function zerarPedidos() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/pedidos?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  const pedidos = await res.json();
  const emAndamento = pedidos.some(p => p.status === "analise" || p.status === "producao");
  if (emAndamento) {
    alert("Não é possível zerar: há pedidos em análise ou produção.");
    return;
  }
  for (let p of pedidos) {
    if (p.status === "entrega" || p.status === "finalizado") {
      await fetch(`${SUPABASE_URL}/rest/v1/pedidos?id=eq.${p.id}`, {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      });
    }
  }
  fetchPedidos();
}

setInterval(fetchPedidos, 5000);
fetchPedidos();
