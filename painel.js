// 1. Configurações básicas
const SUPABASE_URL = "https://ktkpdacxvqyautkfplly.supabase.co";
const SUPABASE_KEY = "SUA_CHAVE_AQUI";  // <- Substitua pela chave correta (anon public)
const TABELA = "pedidos";
const SENHA_PADRAO = "123";

// 2. Busca os pedidos
async function fetchPedidos() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });

  if (!res.ok) {
    console.error("Erro ao buscar pedidos:", res.status, res.statusText);
    return;
  }

  const pedidos = await res.json();
  renderPedidos(pedidos);
}

// 3. Renderiza os pedidos no painel
function renderPedidos(pedidos) {
  ["analise", "producao", "entrega"].forEach(status => {
    const col = document.getElementById(status);
    col.innerHTML = `<h2>${status.charAt(0).toUpperCase() + status.slice(1)}</h2>`;
  });

  pedidos.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between;">
        <strong>#${p.numero} - ${p.cliente}</strong>
        ${p.status !== "analise" ? `<span class="fechar" onclick="pedirSenhaECancelar('${p.id}')">✖</span>` : ""}
      </div>
      <p>${p.descricao}</p>
    `;

    if (p.status === "analise") {
      div.innerHTML += `<button onclick="mudarStatus('${p.id}', 'producao')">Aceitar</button>`;
    } else if (p.status === "producao") {
      div.innerHTML += `<button onclick="mudarStatus('${p.id}', 'entrega')">➡️</button>`;
    }

    document.getElementById(p.status).appendChild(div);
  });

  verificarBotaoZerar(pedidos);
}

// 4. Ativa/desativa botão "Zerar"
function verificarBotaoZerar(pedidos) {
  const existeAnaliseOuProducao = pedidos.some(p => p.status === "analise" || p.status === "producao");
  const btnZerar = document.getElementById("resetBtn");
  btnZerar.disabled = existeAnaliseOuProducao;
}

// 5. Altera o status do pedido
async function mudarStatus(id, novoStatus) {
  await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=eq.${id}`, {
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

// 6. Cancelamento com senha
function pedirSenhaECancelar(id) {
  const senha = prompt("Digite a senha para cancelar:");
  if (senha === SENHA_PADRAO) {
    cancelar(id);
  } else {
    alert("Senha incorreta!");
  }
}

// 7. Cancela o pedido
async function cancelar(id) {
  await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });

  fetchPedidos();
}

// 8. Zera os pedidos entregues
async function zerarPedidosEntregues() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?status=eq.entrega`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });

  const entregues = await res.json();

  for (const pedido of entregues) {
    await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=eq.${pedido.id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
  }

  fetchPedidos();
}

// 9. Liga o botão "Zerar"
document.getElementById("resetBtn").addEventListener("click", zerarPedidosEntregues);

// 10. Inicia o loop de atualização
setInterval(fetchPedidos, 5000);
fetchPedidos();
