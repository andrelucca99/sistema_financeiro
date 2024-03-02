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
        "data_emissao": "2022-01-05",
        "cliente": "Maria Eduarda",
        "valor_total": 1500.00,
        "itens": [
          {"produto": "Produto 1", "quantidade": 2, "preco_unitario": 500.00},
          {"produto": "Produto 2", "quantidade": 1, "preco_unitario": 500.00}
        ],
        "pagador": "Cliente A",
        "data_cobranca": "2022-02-20",
        "data_pagamento": "2022-01-25",
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
        "data_cobranca": "2023-02-20",
        "data_pagamento": "2023-02-20",
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
        "data_cobranca": "2023-03-20",
        "data_pagamento": "2023-04-05",
        "documento_nota_fiscal": "NF2023003",
        "documento_boleto": "BOLETO2023003",
        "status_nota": "Pagamento realizado"
      },
      {
        "id": "04",
        "numero": "NF2023006",
        "data_emissao": "2023-02-29",
        "cliente": "Camila Martins",
        "valor_total": 1500.00,
        "itens": [
          {"produto": "Produto 1", "quantidade": 2, "preco_unitario": 500.00},
          {"produto": "Produto 2", "quantidade": 1, "preco_unitario": 500.00}
        ],
        "pagador": "Cliente A",
        "data_cobranca": "2023-03-05",
        "data_pagamento": "2023-03-07",
        "documento_nota_fiscal": "NF2023007",
        "documento_boleto": "BOLETO2023006",
        "status_nota": "Pagamento pendente"
      },
      {
        "id": "05",
        "numero": "NF2023002",
        "data_emissao": "2023-02-10",
        "cliente": "Mario Da Silva",
        "valor_total": 1500.00,
        "itens": [
          {"produto": "Produto 1", "quantidade": 2, "preco_unitario": 500.00},
          {"produto": "Produto 2", "quantidade": 1, "preco_unitario": 500.00}
        ],
        "pagador": "Cliente A",
        "data_cobranca": "2023-02-15",
        "data_pagamento": "2023-03-05",
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
  // console.log(item.ano)
  const notaFiscal = item.notas_fiscais;

  listaNotasFiscais = notaFiscal;

  valorTotalFiltrado(notaFiscal)
  calcularValorTotalNotas(notaFiscal)
  calcularValorTotalNotasInadimplencia(notaFiscal)
  calcularValorTotalNotasAVencer(notaFiscal)
  calcularValorTotalNotasAPagas(notaFiscal)
})

function valorTotalFiltrado(notas) {
  let valorTotalFiltrado = 0;

  notas.map((item) => {
    let valor = item.valor_total
    valorTotalFiltrado += valor;
  })
  validaCampo(valorTotalNotasEmitidas, valorTotalFiltrado)
  return valorTotalFiltrado;
}

function calcularValorTotalNotas(notas) {
  let valorTotal = 0;

  notas.map((nota) => {
    if (nota.pagador !== nota.cliente) {
      valorTotal += nota.valor_total;
    }
  });

  validaCampo(notasEmitidasSemCobrana, valorTotal)
  return valorTotal
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
  return valorInadimplencia;
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
  return valorNotaAVencer;
}

function calcularValorTotalNotasAPagas(notas) {
  let valorNotasPagas = 0;

  notas.map(nota => {
    if (nota.data_pagamento) {
      valorNotasPagas += nota.valor_total;
    }
  });

  validaCampo(valorTotalNotasPagas, valorNotasPagas)
  return valorNotasPagas;  
}

function validaCampo(campo, valor) {
  if (campo != null) {
    campo.innerHTML = '';
    return campo.innerHTML += `R$ ${valor}`
  }
}

const filtrarMes = document.getElementById('filtra-mes');
const filtrarAno = document.getElementById('filtra-ano');

if (filtrarMes !== null) {
  filtrarMes.addEventListener('change', () => {
    const mes = filtrarMes.value;
    filtraMes(mes, listaNotasFiscais)
  })
}

function filtraMes (mes, lista) {
  const filtraLista = lista.filter((item) => {
    const valorNotas = new Date(item.data_emissao).getMonth() + 1;

    return mes == valorNotas
  });

  validaCampo(valorTotalNotasEmitidas, valorTotalFiltrado(filtraLista))
  validaCampo(notasEmitidasSemCobrana, calcularValorTotalNotas(filtraLista))
  validaCampo(notasEmitidasinadimplencia, calcularValorTotalNotasInadimplencia(filtraLista))
  validaCampo(valorTotalNotasAVencer, calcularValorTotalNotasAVencer(filtraLista))
  validaCampo(valorTotalNotasPagas, calcularValorTotalNotasAPagas(filtraLista))
}

if (filtrarAno !== null) {
  filtrarAno.addEventListener('change', () => {
    const ano = filtrarAno.value;
    filtraAno(ano, listaNotasFiscais)
  })
}

function filtraAno (ano, lista) {
  const filtraLista = lista.filter((item) => {
    const recebeAno = new Date(item.data_emissao).getFullYear();
    return recebeAno == ano;
  })

  validaCampo(valorTotalNotasEmitidas, valorTotalFiltrado(filtraLista))
  validaCampo(notasEmitidasSemCobrana, calcularValorTotalNotas(filtraLista))
  validaCampo(notasEmitidasinadimplencia, calcularValorTotalNotasInadimplencia(filtraLista))
  validaCampo(valorTotalNotasAVencer, calcularValorTotalNotasAVencer(filtraLista))
  validaCampo(valorTotalNotasPagas, calcularValorTotalNotasAPagas(filtraLista))
}


/* Página Notas Emitidas */

const listTableBody = document.getElementById('listTableBody');
const selectMesEmissao = document.getElementById('filtro-mes-emissao')
const selectMesCobranca = document.getElementById('filtro-mes-cobranca')
const selectMesPagamento = document.getElementById('filtro-mes-pagamento')
const selectStatus = document.getElementById('filtro-status')
const btnFiltro = document.getElementById('btn-filtro')


if (selectMesEmissao !== null) {
  selectMesEmissao.addEventListener('change', () => {
    let mesEmissao = selectMesEmissao.value;
  
    filtrarMesEmissao(mesEmissao, listaNotasFiscais)
  })
}

if (selectMesCobranca !== null) {
  selectMesCobranca.addEventListener('change', () => {
    let mesCobranca = selectMesCobranca.value;
    filtrarMesCobranca(mesCobranca, listaNotasFiscais)
  })
}

if (selectMesPagamento !== null) {
  selectMesPagamento.addEventListener('change', () => {
    let mesPagamento = selectMesPagamento.value;
    filtrarMesPagamento(mesPagamento, listaNotasFiscais)
  })
}

if (selectStatus !== null) {
  selectStatus.addEventListener('change', () => {
    let status = selectStatus.value;
    filtrarStatus(status, listaNotasFiscais)
  })
}

if (btnFiltro !== null) {
  btnFiltro.addEventListener('click', () => {
    listTableBody.innerHTML = '';
  
    notasFiscais(listaNotasFiscais)
  })
}

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
  if (listTableBody !== null) {
    listTableBody.innerHTML = '';
  }

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