const sidebarToggle = document.querySelector('#sidebar-toggle');

sidebarToggle.addEventListener('click', function() {
  document.querySelector('#sidebar').classList.toggle('collapsed');
});

document.querySelector('.theme-toggle').addEventListener('click', () => {
  toggleLocalStorage();
  toggleRootClass();
});

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

const notasEmitidasSemCobrana = document.getElementById('notas-sem-cobrana');
const valorTotalNotasPagas = document.getElementById('valor-total-notas-pagas');
const valorTotalNotasEmitidas = document.getElementById('valor-notas-emitidas');
const valorTotalNotasAVencer = document.getElementById('valor-total-notas-a-vencer');
const notasEmitidasinadimplencia = document.getElementById('valor-notas-emitidas-inadimplencia');

let listaNotasFiscais;
let anoNotasFiscais;

document.addEventListener('DOMContentLoaded', () => {
  const url = 'dados.json';

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erro ao carregar arquivo JSON');
      }

      return response.json();
    })
    .then((data) => {
      const notaFiscal = data.notas_fiscais;
      
      anoNotasFiscais = data.ano
      listaNotasFiscais = notaFiscal;

      calcularvalorTotalFiltrado(notaFiscal);
      calcularValorTotalNotas(notaFiscal);
      calcularValorTotalNotasInadimplencia(notaFiscal);
      calcularValorTotalNotasAVencer(notaFiscal);
      calcularValorTotalNotasAPagas(notaFiscal);
      notasFiscais(notaFiscal);
    })
    .catch((error) => {
      console.error('Erro: ', + error.message);
    });
})

function calcularvalorTotalFiltrado(notas) {
  let valorTotalFiltrado = 0;

  notas.map((item) => {
    let valor = item.valor_total;
    valorTotalFiltrado += valor;
  })
  validaCampo(valorTotalNotasEmitidas, valorTotalFiltrado);
  return valorTotalFiltrado;
}

function calcularValorTotalNotas(notas) {
  let valorTotal = 0;

  notas.map((nota) => {
    if (nota.pagador !== nota.cliente) {
      valorTotal += nota.valor_total;
    }
  });

  validaCampo(notasEmitidasSemCobrana, valorTotal);
  return valorTotal;
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

  validaCampo(notasEmitidasinadimplencia, valorInadimplencia);
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

  validaCampo(valorTotalNotasAVencer, valorNotaAVencer);
  return valorNotaAVencer;
}

function calcularValorTotalNotasAPagas(notas) {
  let valorNotasPagas = 0;

  notas.map(nota => {
    if (nota.data_pagamento) {
      valorNotasPagas += nota.valor_total;
    }
  });

  validaCampo(valorTotalNotasPagas, valorNotasPagas);
  return valorNotasPagas;  
}

function validaCampo(campo, valor) {
  if (campo != null) {
    campo.innerHTML = '';
    return campo.innerHTML += `R$ ${valor}`;
  }
}

const filtrarMes = document.getElementById('filtra-mes');
const filtrarAno = document.getElementById('filtra-ano');
const filtrarTrimestre = document.getElementById('filtra-trimestre');

function filtraMes (mes, lista) {
  const filtraLista = lista.filter((item) => {
    const valorNotas = new Date(item.data_emissao).getMonth() + 1;

    return mes == valorNotas;
  });

  validaCampo(valorTotalNotasEmitidas, calcularvalorTotalFiltrado(filtraLista));
  validaCampo(notasEmitidasSemCobrana, calcularValorTotalNotas(filtraLista));
  validaCampo(notasEmitidasinadimplencia, calcularValorTotalNotasInadimplencia(filtraLista));
  validaCampo(valorTotalNotasAVencer, calcularValorTotalNotasAVencer(filtraLista));
  validaCampo(valorTotalNotasPagas, calcularValorTotalNotasAPagas(filtraLista));
}

function filtraAno (ano, lista) {
  const filtraLista = lista.filter((item) => {
    const recebeAno = new Date(item.data_emissao).getFullYear();
    return recebeAno == ano;
  })

  validaCampo(valorTotalNotasEmitidas, calcularvalorTotalFiltrado(filtraLista));
  validaCampo(notasEmitidasSemCobrana, calcularValorTotalNotas(filtraLista));
  validaCampo(notasEmitidasinadimplencia, calcularValorTotalNotasInadimplencia(filtraLista));
  validaCampo(valorTotalNotasAVencer, calcularValorTotalNotasAVencer(filtraLista));
  validaCampo(valorTotalNotasPagas, calcularValorTotalNotasAPagas(filtraLista));
}

validaSeletor(filtrarMes, filtraMes);
validaSeletor(filtrarAno, filtraAno);

if (filtrarTrimestre !== null) {
  filtrarTrimestre.addEventListener('change', () => {
    const trimestre = parseInt(filtrarTrimestre.value);
    filtraPorTrimestre(listaNotasFiscais, anoNotasFiscais, trimestre);
  })
}

function filtraPorTrimestre (lista, ano, trimestre) {
  if (!lista) return []

  const filtraLista = lista.filter((fatura) => {
    const dataEmissao = new Date(fatura.data_emissao);
    const anoFatura = dataEmissao.getFullYear();
    const trimestreFatura = Math.floor((dataEmissao.getMonth() + 3) / 3);

    const resultado = anoFatura === ano && trimestreFatura === trimestre
    
    return resultado;
  })

  validaCampo(valorTotalNotasEmitidas, calcularvalorTotalFiltrado(filtraLista));
  validaCampo(notasEmitidasSemCobrana, calcularValorTotalNotas(filtraLista));
  validaCampo(notasEmitidasinadimplencia, calcularValorTotalNotasInadimplencia(filtraLista));
  validaCampo(valorTotalNotasAVencer, calcularValorTotalNotasAVencer(filtraLista));
  validaCampo(valorTotalNotasPagas, calcularValorTotalNotasAPagas(filtraLista));
}

/* Página Notas Emitidas */

const btnFiltro = document.getElementById('btn-filtro');
const selectStatus = document.getElementById('filtro-status');
const listTableBody = document.getElementById('listTableBody');
const selectMesEmissao = document.getElementById('filtro-mes-emissao');
const selectMesCobranca = document.getElementById('filtro-mes-cobranca');
const selectMesPagamento = document.getElementById('filtro-mes-pagamento');

function validaSeletor(seletor, funcaoFiltro) {
  if (seletor !== null) {
    seletor.addEventListener('change', () => {
      funcaoFiltro(seletor.value, listaNotasFiscais);
    });
  }
}

if (btnFiltro !== null) {
  btnFiltro.addEventListener('click', () => {
    listTableBody.innerHTML = '';
  
    notasFiscais(listaNotasFiscais);
  });
}

function converterDataParaMes (data) {
  return new Date(data).getMonth() + 1;
}

function filtrarMesEmissao(mes, lista) {
  const listaFiltrada = lista.filter((item) => {
    const mesEmissao = converterDataParaMes(item.data_emissao); 
    return mes == mesEmissao;
  });

  notasFiscais(listaFiltrada);
}

function filtrarMesCobranca(mes, lista) {
  const listaFiltrada = lista.filter((item) => {
    const mesCobranca = converterDataParaMes(item.data_cobranca); 
    return mes == mesCobranca;
  });

  notasFiscais(listaFiltrada);
}

function filtrarMesPagamento(mes, lista) {
  const listaFiltrada = lista.filter((item) => {
    const mesPagamento = converterDataParaMes(item.data_pagamento); 
    return mes == mesPagamento;
  });

  notasFiscais(listaFiltrada);
}

function filtrarStatus(status, lista) {
  const listaFiltrada = lista.filter((item) => {
    return status == item.status_nota;
  });

  notasFiscais(listaFiltrada);
}

validaSeletor(selectMesEmissao, filtrarMesEmissao);
validaSeletor(selectMesCobranca, filtrarMesCobranca);
validaSeletor(selectMesPagamento, filtrarMesPagamento);
validaSeletor(selectStatus, filtrarStatus);

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
