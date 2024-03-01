let ctxInadimplencia = document.getElementsByClassName("bar-chart-inadimplencia");
let ctxReceita = document.getElementsByClassName("bar-chart-receita");

const chartGraghInadimplencia = new Chart(ctxInadimplencia, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fer', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Taxa de inadimplência - 2023',
        data: [1],
        borderWidth: 2,
        borderColor: 'rgb(14, 165, 202)',
        backgroundColor: 'rgb(62, 148, 206)',
      }
    ]
  },
  options: {
    title: {
      display: true,
      fontSize: 20,
      text: 'Gráfico de evolução da inadimplência mês a mês',
    },
    labels: {
      fontStyle: 'bold'
    }
  }
})

const chartGraghReceita = new Chart(ctxReceita, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fer', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Taxa de receita - 2023',
        data: [5,10,5,14,20,15,6,14,8,12,15,5],
        borderWidth: 2,
        borderColor: 'rgb(14, 165, 202)',
        backgroundColor: 'rgb(62, 148, 206)',
      }
    ]
  },
  options: {
    title: {
      display: true,
      fontSize: 20,
      text: 'Gráfico de evolução da receita recebida mês a mês',
    },
    labels: {
      fontStyle: 'bold'
    }
  }
})
