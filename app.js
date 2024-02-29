const sidebarToggle = document.querySelector('#sidebar-toggle');

sidebarToggle.addEventListener('click', function() {
  document.querySelector('#sidebar').classList.toggle('collapsed');
})

document.querySelector('.theme-toggle').addEventListener('click', () => {
  toggleLocalStorage();
  toggleRootClass();
})

function toggleRootClass() {
  const current = document.documentElement.getAttribute('data-bs-theme');
  const inverted = current == 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-bs-theme', inverted);
}

function toggleLocalStorage() {
  if (isLight()) {
    localStorage.removeItem('light');
  } else {
    localStorage.setItem('light', 'set');
  }
}

function isLight() {
  return localStorage.getItem('light');
}

if (isLight()) {
  toggleRootClass();
}

const listNotas = [
  {
    "empresa": "Flora Express",
    "ano": 2023,
    "notas_fiscais": [
      {
        "numero": "NF2023001",
        "data_emissao": "2024-01-29",
        "cliente": "Cliente B",
        "valor_total": 1500.00,
        "itens": [
          {"produto": "Produto 1", "quantidade": 2, "preco_unitario": 500.00},
          {"produto": "Produto 2", "quantidade": 1, "preco_unitario": 500.00}
        ],
        "pagador": "Cliente A",
        "data_cobranca": "2023-02-05",
        "data_pagamento": "2023-01-05",
        "documento_nota_fiscal": "NF2023001",
        "documento_boleto": "BOLETO2023001",
        "status_nota": "Pagamento pendente"
      },
      {
        "numero": "NF2023002",
        "data_emissao": "2023-02-10",
        "cliente": "Cliente B",
        "valor_total": 2000.00,
        "itens": [
          {"produto": "Produto 3", "quantidade": 3, "preco_unitario": 600.00},
          {"produto": "Produto 4", "quantidade": 2, "preco_unitario": 400.00}
        ],
        "pagador": "Cliente B",
        "data_cobranca": "2023-02-25",
        "data_pagamento": "2023-02-28",
        "documento_nota_fiscal": "NF2023002",
        "documento_boleto": "BOLETO2023002",
        "status_nota": "Pagamento realizado"
      },
      {
        "numero": "NF2023003",
        "data_emissao": "2023-03-15",
        "cliente": "Cliente C",
        "valor_total": 1800.00,
        "itens": [
          {"produto": "Produto 5", "quantidade": 1, "preco_unitario": 1200.00},
          {"produto": "Produto 6", "quantidade": 2, "preco_unitario": 300.00}
        ],
        "pagador": "Cliente C",
        "data_cobranca": "2023-03-30",
        "data_pagamento": "2023-04-05",
        "documento_nota_fiscal": "NF2023003",
        "documento_boleto": "BOLETO2023003",
        "status_nota": "Pagamento realizado"
      }
    ]
  }  
]

const valorTotalNotasEmitidas = document.getElementById('valor-notas-emitidas');
const notasEmitidasSemCobrana = document.getElementById('notas-sem-cobrana');
const notasEmitidasinadimplencia = document.getElementById('valor-notas-emitidas-inadimplencia');
const valorTotalNotasAVencer = document.getElementById('valor-total-notas-a-vencer');
const valorTotalNotasPagas = document.getElementById('valor-total-notas-pagas');

listNotas.map((item) => {
  // console.log(item.notas_fiscais)
  const notaFiscal = item.notas_fiscais

  somValorTotalNotas(notaFiscal)
  calcularValorTotalNotas(notaFiscal)
  calcularValorTotalNotasInadimplencia(notaFiscal)
  calcularValorTotalNotasAVencer(notaFiscal)
  calcularValorTotalNotasAPagas(notaFiscal)
})

function somValorTotalNotas(notas) {
  const valores = {
    valor1: notas[0].valor_total,
    valor2: notas[1].valor_total,
    valor3: notas[2].valor_total,
  }

  let soma = valores.valor1 + valores.valor2 + valores.valor3;

  validaCampo(valorTotalNotasEmitidas, soma)
}

function calcularValorTotalNotas(notas) {
  let valorTotal = 0;

  notas.map((nota) => {
    if (nota.pagador !== nota.cliente) {
      valorTotal += nota.valor_total;
    }
  });

  validaCampo(notasEmitidasSemCobrana, valorTotal)
}

function calcularValorTotalNotasInadimplencia(notas) {
  let valorInadimplencia = 0;

  notas.map((nota) => {
    const dataVencimento = new Date(nota.data_cobranca);
    const dataPagamento = new Date(nota.data_pagamento);

    if (dataPagamento > dataVencimento) {
      valorInadimplencia += nota.valor_total;
    }
  });

  validaCampo(notasEmitidasinadimplencia, valorInadimplencia)
}

function calcularValorTotalNotasAVencer(notas) {
  let valorNotaAVencer = 0;

  notas.map((nota) => {
    const dataCobranca = new Date(nota.data_cobranca);
    const dataEmissao = new Date(nota.data_emissao);

    if (dataCobranca > dataEmissao) {
      valorNotaAVencer += nota.valor_total;
    }
  })

  validaCampo(valorTotalNotasAVencer, valorNotaAVencer)
}

function calcularValorTotalNotasAPagas(notas) {
  let valorNotasPagas = 0;

  notas.map(nota => {
    if (nota.data_pagamento) {
      valorNotasPagas += nota.valor_total;
    }
  });
  validaCampo(valorTotalNotasPagas, valorNotasPagas)  
}

function validaCampo(campo, valor) {
  if (campo != null) return campo.innerHTML += `R$ ${valor}`
}