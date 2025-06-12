<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Painel de Pedidos - Hara Temakeria</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body { background-color: #f8f9fa; }
    .kanban-column {
      background-color: #ffffff;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 10px;
      min-height: 400px;
    }
    .kanban-card {
      background-color: #f1f1f1;
      border-radius: 5px;
      padding: 10px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container mt-4">
    <h2 class="text-center mb-4">Painel de Pedidos - Hara Temakeria</h2>
    <div class="row">
      <div class="col-md-4">
        <h5 class="text-center">Análise</h5>
        <div class="kanban-column" id="analise">
          <div class="kanban-card">
            <strong>Pedido #001</strong><br>
            Temaki de Salmão<br>
            <button class="btn btn-success btn-sm mt-2" onclick="mover('producao', this)">Aceitar</button>
            <button class="btn btn-danger btn-sm mt-2">Cancelar</button>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <h5 class="text-center">Produção</h5>
        <div class="kanban-column" id="producao"></div>
      </div>
      <div class="col-md-4">
        <h5 class="text-center">Pronto para Entrega</h5>
        <div class="kanban-column" id="pronto"></div>
      </div>
    </div>
  </div>
  <script>
    function mover(destino, btn) {
      const card = btn.closest('.kanban-card');
      document.getElementById(destino).appendChild(card);
      card.querySelector('.btn-success').remove(); // remove botão "Aceitar"
    }
  </script>
</body>
</html>