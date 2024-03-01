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
        "id": "01",
        "numero": "NF2023001",
        "data_emissao": "2024-01-29",
        "cliente": "Maria Eduarda",
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
        "status_nota": "Pagamento em atraso"
      },
      {
        "id": "02",
        "numero": "NF2023002",
        "data_emissao": "2023-02-10",
        "cliente": "Carlos Silva",
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
        "id": "03",
        "numero": "NF2023003",
        "data_emissao": "2023-03-15",
        "cliente": "Roberta Ribeiro",
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
      },
      {
        "id": "04",
        "numero": "NF2023006",
        "data_emissao": "2024-02-29",
        "cliente": "Camila Martins",
        "valor_total": 1500.00,
        "itens": [
          {"produto": "Produto 1", "quantidade": 2, "preco_unitario": 500.00},
          {"produto": "Produto 2", "quantidade": 1, "preco_unitario": 500.00}
        ],
        "pagador": "Cliente A",
        "data_cobranca": "2023-02-05",
        "data_pagamento": "2023-01-05",
        "documento_nota_fiscal": "NF2023007",
        "documento_boleto": "BOLETO2023006",
        "status_nota": "Pagamento pendente"
      },
      {
        "id": "05",
        "numero": "NF2023002",
        "data_emissao": "2024-02-29",
        "cliente": "Mario Da Silva",
        "valor_total": 1500.00,
        "itens": [
          {"produto": "Produto 1", "quantidade": 2, "preco_unitario": 500.00},
          {"produto": "Produto 2", "quantidade": 1, "preco_unitario": 500.00}
        ],
        "pagador": "Cliente A",
        "data_cobranca": "2023-02-05",
        "data_pagamento": "2023-01-05",
        "documento_nota_fiscal": "NF2023004",
        "documento_boleto": "BOLETO2023005",
        "status_nota": "Pagamento pendente"
      },
    ]
  }  
]

const valorTotalNotasEmitidas = document.getElementById('valor-notas-emitidas');
const notasEmitidasSemCobrana = document.getElementById('notas-sem-cobrana');
const notasEmitidasinadimplencia = document.getElementById('valor-notas-emitidas-inadimplencia');
const valorTotalNotasAVencer = document.getElementById('valor-total-notas-a-vencer');
const valorTotalNotasPagas = document.getElementById('valor-total-notas-pagas');

let listaNotasFiscais;

listNotas.map((item) => {
  // console.log(item.notas_fiscais)
  const notaFiscal = item.notas_fiscais;

  listaNotasFiscais = notaFiscal;

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

/* Página Notas Emitidas */

const listTableBody = document.getElementById('listTableBody');
const selectMesEmissao = document.getElementById('filtro-mes-emissao')
const selectMesCobranca = document.getElementById('filtro-mes-cobranca')
const selectMesPagamento = document.getElementById('filtro-mes-pagamento')
const selectStatus = document.getElementById('filtro-status')
const btnFiltro = document.getElementById('btn-filtro')

selectMesEmissao.addEventListener('change', () => {
  let mesEmissao = selectMesEmissao.value;

  filtrarMesEmissao(mesEmissao, listaNotasFiscais)
})

selectMesCobranca.addEventListener('change', () => {
  let mesCobranca = selectMesCobranca.value;
  filtrarMesCobranca(mesCobranca, listaNotasFiscais)
})

selectMesPagamento.addEventListener('change', () => {
  let mesPagamento = selectMesPagamento.value;
  filtrarMesPagamento(mesPagamento, listaNotasFiscais)
})

selectStatus.addEventListener('change', () => {
  let status = selectStatus.value;
  filtrarStatus(status, listaNotasFiscais)
})

btnFiltro.addEventListener('click', () => {
  listTableBody.innerHTML = '';

  notasFiscais(listaNotasFiscais)
})

function filtrarMesEmissao(mes, lista) {
  const listaFiltrada = lista.filter((item) => {
    const data = new Date(item.data_emissao).getMonth() + 1;
    return mes == data;
  })

  notasFiscais(listaFiltrada)
}

function filtrarMesCobranca(mes, lista) {
  const listaFiltrada = lista.filter((item) => {
    const data = new Date(item.data_cobranca).getMonth() + 1;
    return mes == data;
  })

  notasFiscais(listaFiltrada)
}

function filtrarMesPagamento(mes, lista) {
  const listaFiltrada = lista.filter((item) => {
    const data = new Date(item.data_pagamento).getMonth() + 1;
    return mes == data;
  })

  notasFiscais(listaFiltrada)
}

function filtrarStatus(status, lista) {
  const listaFiltrada = lista.filter((item) => {
    return status == item.status_nota;
  })

  notasFiscais(listaFiltrada)
}

function notasFiscais (lista) {
  listTableBody.innerHTML = '';

  lista.forEach(item => {
    let row = `<tr>
      <td>${item.id}</td>
      <td>${item.cliente}</td>
      <td>${item.numero}</td>
      <td>${item.data_emissao}</td>
      <td>${item.data_cobranca}</td>
      <td>${item.data_pagamento}</td>
      <td>${item.valor_total}</td>
      <td>${item.documento_nota_fiscal}</td>
      <td>${item.documento_boleto}</td>
    </tr>`;
    if (listTableBody != null) return listTableBody.innerHTML += row;
  });
}

notasFiscais(listaNotasFiscais)