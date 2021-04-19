const Modal = {
  toggle() {
    document.querySelector('.modal-overlay').classList.toggle('active')
  }
}

const Storage = {
  get(){
    return JSON.parse(localStorage.getItem("Locale:Transactions")) || [];
  },
  set(transactions) {
    localStorage.setItem("Locale:Transactions",
    JSON.stringify(transactions));
  }
}
  Storage.get();
const Transaction = {

  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },
  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },

  incomes() {
    let income = 0;

    Transaction.all.forEach(transaction => {
      transaction.amount > 0 ? income += transaction.amount : "";
    })

    return income;
  },
  expenses() {
    let expense = 0;

    Transaction.all.forEach(transaction => {
      transaction.amount < 0 ? expense += transaction.amount : "";
    })

    return expense;
  },
  total() {
    let final = Transaction.incomes() + Transaction.expenses();

    return final;
  }
}

const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction,index);

    tr.setAttribute("draggable","true");

    tr.dataset.index = index;

    DOM.transactionContainer.appendChild(tr)
  },
  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense';

    const amount = Utils.formatCurrency(transaction.amount);

    let id = transaction.id = index;

    const html = `
    
    <td class="description"> ${transaction.description} </td>
    <td class="${CSSclass}"> ${amount} </td>
    <td class="date"> ${transaction.date} </td>
    <td>
      <img onclick="Transaction.remove(${id})" src="assets/minus.svg" alt="Remover transação">
    </td>
    
    `
    return html;
  },
  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses());
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total());
  },
  clearTransactions() {
    DOM.transactionContainer.innerHTML = "";
  }

}

const Utils = {

  formatAmount(value){
    value = Number(value) * 100;

    return Math.round(value) ;
  },

  formatDate(date){
    const splitDate = date.split("-");
    
    return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/, "");

    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
    return (signal + value);
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {

    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }

  },

  formatValues() {
    let { description, amount, date,id } = Form.getValues();
    
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);
    id= Transaction.all.length;

    return{
      id,
      description,
      amount,
      date
    }
    
  },

  validateFields() {
    const { description, amount, date } = Form.getValues();

    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === "" ){
        throw new Error("Preencha todos os campos")
      }

  },

  saveTransaction(transaction){
    Transaction.add(transaction);
  },

  clearFields(){
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    
    event.preventDefault();
    try{
      //Formatação dos dados
      const transaction = Form.formatValues();
      //Validação dos dados
      Form.validateFields();
      //Salvar
      Form.saveTransaction(transaction);
      //Limpar dados do formulario
      Form.clearFields();
      //Fechar o Modal
      Modal.toggle();

    } catch(error) {
      alert(error.message)
    }
    

    
  }
}

const App = {
  init() {

    Transaction.all.forEach((transaction,index) => {
      DOM.addTransaction(transaction,index)
    });

    DOM.updateBalance();

    Storage.set(Transaction.all)

  },

  reload() {
    DOM.clearTransactions();

    App.init();
  }
}

App.init();


/* https://jsfiddle.net/radonirinamaminiaina/zfnj5rv4/ */

/*
https://www.youtube.com/watch?v=6wn8hpUcEcM

29:32

*/