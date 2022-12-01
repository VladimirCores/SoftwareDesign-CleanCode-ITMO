// CONST
const popap = document.getElementById("popap");
const form = document.getElementById("form");
const popapBg = document.getElementById("popapBg");

const numberInvoice = document.getElementById("numberInvoice");

const itemWorkPopap = document.getElementById("itemWorkPopap");
const itemDescPopap = document.getElementById("itemDescPopap");
const inputQtyPopap = document.getElementById("inputQtyPopap");
const inputCostPopap = document.getElementById("inputCostPopap");
const inputTotalPopap = document.getElementById("inputTotalPopap");

const btnOpenPopap = document.getElementById("btnOpenPopap");
const btnClosePopap = document.getElementById("btnClosePopap");
const btnAddItem = document.getElementById("addItemButton");

const cardInvoice = document.getElementById("cardInvoice");

const mainInputDiscount = document.getElementById("mainInputDiscount");

const mainSubtotal = document.getElementById("mainSubtotal");
const mainDiscount = document.getElementById("mainDiscount");
const mainTotal = document.getElementById("mainTotal");

const titlePopap = document.getElementById("titlePopap");
const btnDeleteItem = document.getElementById("btnDeleteItem");

let selectedInvoice = null;
let loadedItemInvoice = {};
let listInvoice = [];

const objInvoice = {
  id: "",
  title: "",
  description: "",
  cost: "",
  qty: "",
  total: "",
};

// LISTENERS
btnOpenPopap.addEventListener("click", addOurPopap);

btnClosePopap.addEventListener("click", checkingForEditingBeforeDelete);

popapBg.addEventListener("click", checkingForEditingBeforeDelete);

btnAddItem.addEventListener("click", validationOfFields);

document.addEventListener("click", (e) => {
  const editItemInvoiceButton = e.target.closest(".btnEditItem");
  const deleteItemInvoiceButton = e.target.closest("#btnDeleteItem");

  if (editItemInvoiceButton) {
    const id = editItemInvoiceButton.getAttribute("listInvoice-id");
    loadItemInvoice(listInvoice.find((item) => item.id == id));
  }

  if (deleteItemInvoiceButton && objInvoice.id) {
    deleteItemInvoice(objInvoice.id);
  }
});

[inputQtyPopap, inputCostPopap].forEach(function(input) {
  input.onkeyup = valueTotalPopap;
});

[numberInvoice, mainInputDiscount, inputQtyPopap, inputCostPopap].forEach(
  function(input) {
    input.onkeydown = inputValidationNumber;
  }
);

[mainInputDiscount].forEach(function(input) {
  input.onkeyup = discountandTotalResultTotalsInvoice;
});

[inputQtyPopap, inputCostPopap, itemWorkPopap, itemDescPopap].forEach(
  (input) => {
    input.addEventListener("keyup", () => {
      const checkingWithValueLocalstage =
        inputQtyPopap.value === loadedItemInvoice.qty &&
        inputCostPopap.value === loadedItemInvoice.cost &&
        itemWorkPopap.value === loadedItemInvoice.title &&
        itemDescPopap.value === loadedItemInvoice.description;

      const checkingInputsValue =
        inputQtyPopap.value == "" ||
        inputCostPopap.value == "" ||
        itemWorkPopap.value == "";

      if (checkingWithValueLocalstage || checkingInputsValue) {
        btnAddItem.disabled = true;
        return;
      }

      btnAddItem.disabled = false;
    });
  }
);

numberInvoice.addEventListener("keyup", saveInLocalStageInvoice);
cardInvoice.addEventListener("keyup", saveInLocalStageInvoice);
cardInvoice.addEventListener("keyup", cardValidationNumber);
mainInputDiscount.addEventListener("keyup", saveInLocalStageInvoice);

// FUNCTIONS
function addOurPopap() {
  popap.style.display = "block";

  if (selectedInvoice == null) {
    btnDeleteItem.disabled = true;
    btnAddItem.disabled = true;
    btnAddItem.innerText = "Create";
    titlePopap.innerText = "Add";
  }

  console.log("selectedInvoice when open popap", selectedInvoice);
}

function closeOurPopap() {
  popap.style.display = "none";
  form.reset();
  saveInLocalStageInvoice();
  selectedInvoice = null;
}

function validationOfFields(e) {
  e.preventDefault();

  if (
    inputQtyPopap.value == "" ||
    inputCostPopap.value == "" ||
    itemWorkPopap.value == ""
  ) {
    // alert("заполните поля Qty, Cost, Work Item!!!");
    return;
  }

  if (selectedInvoice) {
    editItemInvoice();
    selectedInvoice = null;
    console.log("selectedInvoice when edit", selectedInvoice);
    // alert("поля отредактированы");
  } else {
    objInvoice.id = Date.now();
    objInvoice.title = itemWorkPopap.value;
    objInvoice.description = itemDescPopap.value;
    objInvoice.cost = inputCostPopap.value;
    objInvoice.qty = inputQtyPopap.value;
    objInvoice.total = inputCostPopap.value * inputQtyPopap.value;

    addInvoice();
    // alert("все поля заполнены");
  }
}

function inputValidationNumber(event) {
  if ("0123456789\b".indexOf(String.fromCharCode(event.keyCode)) == -1) {
    alert("Вводить можно только числа!");
    return false;
  }
  return true;
}

function cardValidationNumber() {
  var cardCode = cardInvoice.value.replace(/[^\w]/g, "");
  cardCode = cardCode != "" ? cardCode.match(/.{1,4}/g).join(" ") : "";
  cardInvoice.value = cardCode.toUpperCase();
}

function valueTotalPopap(e) {
  if (!inputCostPopap.value) {
    inputTotalPopap.value = 0;
    // alert("заполните поля Qty, Cost, Work Item!!!");
  } else {
    inputTotalPopap.value = inputQtyPopap.value * inputCostPopap.value;
  }
}

function checkingForEditingBeforeDelete(e) {
  e.preventDefault();

  isEdited =
    inputQtyPopap.value != loadedItemInvoice.qty ||
    inputCostPopap.value != loadedItemInvoice.cost ||
    itemWorkPopap.value != loadedItemInvoice.title ||
    itemDescPopap.value != loadedItemInvoice.description;

  if (isEdited && !confirm("Выйти без сохранения?")) {
    return;
  }

  closeOurPopap();
}

function addInvoice() {
  listInvoice.push({...objInvoice });

  console.log("listInvoice", listInvoice);

  renderInvoice();
  closeOurPopap();
}

function renderInvoice() {
  clearHTMLInvoice();

  const tableInvoice = document.getElementById("tableInvoice");

  listInvoice.forEach((itemInvoice) => {
    const {
      id,
      title,
      description,
      cost,
      qty,
      total = cost * qty,
    } = itemInvoice;

    tableInvoice.innerHTML += `<div class="py-1 border-b-1 border-solid border-gray-200 hover:bg-gray-100 btnEditItem" listInvoice-id=${id} id=${id}>
        <div class="grid grid-col-4 font-normal">
            <div class="pr-8">
                <div>${title}</div>
                <div class="text-gray-888">${description}</div>
            </div>
            <div>${cost}</div>
            <div>${qty}</div>
            <div class="text-right">${total}</div>
        </div>
    </div>`;
  });

  sumResultTotalsInvoice();
  discountandTotalResultTotalsInvoice();
}

function sumResultTotalsInvoice() {
  mainSubtotal.innerHTML = listInvoice
    .map((item) => item.total)
    .reduce((prev, curr) => prev + curr, 0);
}

function discountandTotalResultTotalsInvoice() {
  mainDiscount.innerHTML = Math.floor(
    (mainSubtotal.innerHTML * mainInputDiscount.value) / 100
  );

  mainTotal.innerHTML = mainSubtotal.textContent - mainDiscount.innerHTML;
}

function loadItemInvoice(itemInvoice) {
  addOurPopap();

  const { id, title, description, cost, qty, total = cost * qty } = itemInvoice;

  loadedItemInvoice = {...itemInvoice };

  itemWorkPopap.value = title;
  itemDescPopap.value = description;
  inputCostPopap.value = cost;
  inputQtyPopap.value = qty;
  inputTotalPopap.value = total;

  objInvoice.id = id;

  btnDeleteItem.disabled = false;
  btnAddItem.innerText = "Save";
  titlePopap.innerText = "Update";

  selectedInvoice = true;
  console.log("selectedInvoice when load", selectedInvoice);
}

function editItemInvoice() {
  objInvoice.title = itemWorkPopap.value;
  objInvoice.description = itemDescPopap.value;
  objInvoice.cost = inputCostPopap.value;
  objInvoice.qty = inputQtyPopap.value;
  objInvoice.total = inputCostPopap.value * inputQtyPopap.value;

  listInvoice.map((itemInvoice) => {
    if (itemInvoice.id === objInvoice.id) {
      itemInvoice.id = objInvoice.id;
      itemInvoice.title = objInvoice.title;
      itemInvoice.description = objInvoice.description;
      itemInvoice.cost = objInvoice.cost;
      itemInvoice.qty = objInvoice.qty;
      itemInvoice.total = objInvoice.cost * objInvoice.qty;
    }
  });

  renderInvoice();
  closeOurPopap();
}

function deleteItemInvoice(id) {
  if (confirm("Удалить элемент?")) {
    alert("Элемент удален!");
    listInvoice = listInvoice.filter((itemInvoice) => itemInvoice.id !== id);
    renderInvoice();

    closeOurPopap();
  } else {
    alert("Операция прервана");
  }
}

function clearHTMLInvoice() {
  while (tableInvoice.firstChild) {
    tableInvoice.removeChild(tableInvoice.firstChild);
  }
}

function saveInLocalStageInvoice() {
  invoices = [{
    no: numberInvoice.value,
    listInvoice: listInvoice,
    discount: mainInputDiscount.value,
    iban: cardInvoice.value,
  }, ];

  localStorage.setItem("listInvoice", JSON.stringify(invoices));
}

function getInLocalStageInvoice() {
  numberInvoice.value = JSON.parse(localStorage.getItem("listInvoice"))[0].no;
  console.log("numberInvoice.value", numberInvoice.value);

  listInvoice =
    JSON.parse(localStorage.getItem("listInvoice"))[0].listInvoice || [];
  console.log("listInvoice", listInvoice);

  mainInputDiscount.value = JSON.parse(
    localStorage.getItem("listInvoice")
  )[0].discount;
  console.log("mainInputDiscount.value", mainInputDiscount.value);

  cardInvoice.value = JSON.parse(localStorage.getItem("listInvoice"))[0].iban;
  console.log("cardInvoice.value", cardInvoice.value);

  renderInvoice();
}

getInLocalStageInvoice();