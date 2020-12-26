const { ipcRenderer } = require("electron");
class App {
  constructor({
    dateSection,
    titleInput,
    muInput,
    sizeInput,
    nameInput,
    priceInput,
    htmlTable,
    trHeader,
    barTotale,
    addBtn,
    EXPORTbtn,
    searchInput,
    dh,
  }) {
    // rtl RegExp
    this.ltrChars = `A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿Ⰰ-﬜﷾-﹯﻽-￿`;
    this.rtlChars = "\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC";
    this.rtlDirCheck = new RegExp(
      "^[^" + this.ltrChars + "]*[" + this.rtlChars + "]"
    );
    // Inputs
    this.muInput = muInput;
    this.sizeInput = sizeInput;
    this.nameInput = nameInput;
    this.priceInput = priceInput;
    this.titleInput = titleInput;
    this.EXPORTbtn = EXPORTbtn;
    this.addBtn = addBtn;
    this.selectonDh = dh;
    this.searchInput = searchInput;
    // Date section
    this.dateSection = dateSection;
    this.date = new Date();
    // Html table
    this.htmlTable = htmlTable;
    this.trHeader = trHeader;
    this.barTotale = barTotale;
    // Variable
    this.title = "";
    this.items = 0;
    this.mainTotale = 0;
    this.idElements = 0;
    this.listTotles = [];
    this.isStart = true;
    this.tableArr = [
      [
        {
          text: "المجموع",
          style: "th",
        },
        {
          text: "الثمن",
          style: "th",
        },
        {
          text: "البضاعة نوع ",
          style: "th",
          alignment: "right",
          margin: [5, 5],
        },
        {
          text: "العدد",
          style: "th",
        },
        {
          text: "الكم",
          style: "th",
        },
      ],
    ];
    // Start page
    this.startPage();
  }
  startPage() {
    this.titleInput.focus();
    this.dateSection.textContent = this.date.toLocaleDateString("am");
    // Events
    this.dirInput(this.nameInput, "ar");
    this.dirInput(this.titleInput, "ar");
    this.titleInput.addEventListener("keyup", (e) => {
      this.title = this.titleInput.value;
      if (e.key == "Enter") this.muInput.focus();
    });
    this.muInput.addEventListener("keydown", (e) => {
      if (e.key == "Enter") this.sizeInput.focus();
    });
    this.sizeInput.addEventListener("keydown", (e) => {
      if (e.key == "Enter") this.nameInput.focus();
    });
    this.nameInput.addEventListener("keydown", (e) => {
      if (e.key == "Enter") this.priceInput.focus();
    });
    this.priceInput.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        this.muInput.focus();
        this.calc();
      }
    });
    this.searchInput.addEventListener("input", () => {
      this.search();
    });
    this.addBtn.addEventListener("click", () => {
      this.muInput.focus();
      this.calc();
    });
  }
  dirInput(input, defolt) {
    input.addEventListener("input", (e) => {
      if (this.rtlDirCheck.test(e.target.value)) {
        e.target.style.direction = "rtl";
      } else if (!e.target.value) {
        e.target.style.direction = defolt == "ar" ? "rtl" : "ltr";
      } else {
        e.target.style.direction = "ltr";
      }
    });
  }
  calc() {
    let totale = Number(this.sizeInput.value) * Number(this.priceInput.value);
    if (!totale) return;
    this.items++;
    this.listTotles.push(totale);
    this.createRow(totale);
    this.createObj(totale);
    this.clearInput();
  }
  createObj(totale) {
    let inName = this.nameInput.value;
    if (this.rtlDirCheck.test(inName)) {
      inName = inName.split(" ");
      inName.reverse();
      inName = inName.join("  ");
    }
    let a = [
      {
        text: `${this.numberWithCommas(totale)}`,
        style: "numberS",
      },
      {
        text: `${this.numberWithCommas(this.priceInput.value)}`,
        style: "numberS",
      },
      {
        text: `${this.nameInput.value == "" ? "----" : inName}`,
        style: "nameS",
      },
      {
        text: `${this.numberWithCommas(this.sizeInput.value)}`,
        style: "numberS",
      },
      {
        text: `${
          this.muInput.value.toLowerCase()[0] != "i" && this.muInput.value
            ? this.muInput.value.toLowerCase() == "l"
              ? "L"
              : "kg"
            : "Item"
        }`,
        style: "numberS",
      },
    ];
    this.tableArr.push(a);
  }
  createRow(totale) {
    let tr = document.createElement("tr");
    tr.classList.add("tableRawOnData");
    let tdTotale = document.createElement("td");
    tdTotale.setAttribute("data-reelNum", `${totale}`);
    tdTotale.setAttribute("data-th", "المجموع");
    tdTotale.textContent = this.numberWithCommas(totale);

    let tdPrice = document.createElement("td");
    tdPrice.setAttribute("data-reelNum", `${this.priceInput.value}`);
    tdPrice.setAttribute("data-th", "الثمن");
    tdPrice.textContent = this.numberWithCommas(this.priceInput.value);

    let tdName = document.createElement("td");
    tdName.setAttribute("data-th", "نوع البضاعة");
    tdName.textContent =
      this.nameInput.value == "" ? "----" : this.nameInput.value;
    tdName.classList.add("name", "ar", "nameOfPro");

    let tdSize = document.createElement("td");
    tdSize.setAttribute("data-reelNum", `${this.sizeInput.value}`);
    tdSize.setAttribute("data-th", "العدد");
    tdSize.textContent = this.numberWithCommas(this.sizeInput.value);

    let tdMu = document.createElement("td");
    tdMu.setAttribute("data-th", "الكم");
    tdMu.textContent =
      this.muInput.value.toLowerCase()[0] != "i" && this.muInput.value
        ? this.muInput.value.toLowerCase()[0] == "l"
          ? "L"
          : "kg"
        : "Item";
    let imgs = `<td><img src="./img/edit.svg" data-index="${this.idElements}" width="20px" alt="Edit" class="editBtns"></td><td><img src="./img/delete.svg" data-index="${this.idElements}" width="20px" class="deleteBtns" alt="Delete"></td>`;
    tr.append(tdTotale, tdPrice, tdName, tdSize, tdMu);
    tr.innerHTML += imgs;
    this.htmlTable.appendChild(tr);
    this.idElements++;
    this.deleteFun();
    this.editFun();
    this.update();
  }
  deleteFun() {
    let deleteBtns = document.querySelectorAll(".deleteBtns");
    deleteBtns[deleteBtns.length - 1].addEventListener("click", (e) => {
      this.htmlTable.removeChild(e.path[2]);
      this.listTotles[
        deleteBtns[deleteBtns.length - 1].getAttribute("data-index")
      ] = NaN;
      this.tableArr[
        parseInt(deleteBtns[deleteBtns.length - 1].getAttribute("data-index")) +
          1
      ] = false;
      this.items--;
      this.update();
    });
  }
  editFun() {
    let editBtns = document.querySelectorAll(".editBtns");
    editBtns[editBtns.length - 1].addEventListener("click", (e) => {
      this.htmlTable.removeChild(e.path[2]);
      this.listTotles[
        editBtns[editBtns.length - 1].getAttribute("data-index")
      ] = NaN;
      let tableEdit = this.tableArr[
        parseInt(editBtns[editBtns.length - 1].getAttribute("data-index")) + 1
      ];
      this.priceInput.value = tableEdit[1].text;
      this.nameInput.value =
        tableEdit[2].text == "----" ? "" : tableEdit[2].text;
      this.sizeInput.value = tableEdit[3].text;
      this.muInput.value = tableEdit[4].text;
      this.tableArr[
        parseInt(editBtns[editBtns.length - 1].getAttribute("data-index")) + 1
      ] = false;
      this.items--;
      this.update();
    });
  }
  numberWithCommas(x) {
    return Number(x).toLocaleString();
  }
  update() {
    if (this.items >= 2) {
      this.EXPORTbtn.classList.add("active");
      this.EXPORTbtn.addEventListener("click", () => {
        let dataTable = this.tableArr.filter((value) => value);
        ipcRenderer.send("table", {
          table: dataTable,
          DH: this.selectonDh.value,
          date: this.date,
          totale: this.numberWithCommas(this.mainTotale),
          title: this.title,
        });
      });
    } else {
      this.EXPORTbtn.classList.remove("active");
      this.EXPORTbtn.addEventListener("click", () => {
        return false;
      });
    }
    if (this.items) {
      this.trHeader.classList.add("on");
    } else {
      this.trHeader.classList.remove("on");
    }
    this.mainTotale = this.listTotles.reduce((a, b) => {
      return (isNaN(a) == true ? 0 : a) + (isNaN(b) == true ? 0 : b);
    });
    this.barTotale.textContent = this.numberWithCommas(this.mainTotale);
  }
  clearInput() {
    this.muInput.value = "";
    this.sizeInput.value = "";
    this.nameInput.value = "";
    this.priceInput.value = "";
  }
  search() {
    let filter = this.searchInput.value.toUpperCase();
    let tdnameOfPro = document.querySelectorAll(".tableRawOnData");
    if (!tdnameOfPro) return;
    tdnameOfPro.forEach((tr) => {
      let td = tr.getElementsByClassName("nameOfPro")[0];
      let txtValue = td.textContent;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr.style.display = "";
      } else {
        tr.style.display = "none";
      }
    });
  }
}
const dateSection = document.getElementById("dateSection");
const titleInput = document.getElementById("titleInput");
const muInput = document.getElementById("muInput");
const sizeInput = document.getElementById("sizeInput");
const nameInput = document.getElementById("nameInput");
const priceInput = document.getElementById("priceInput");
const htmlTable = document.getElementById("htmlTable");
const trHeader = document.querySelector(".trHeader");
const barTotale = document.getElementById("barTotale");
const addBtn = document.getElementById("add");
const EXPORTbtn = document.getElementById("EXPORT");
const searchInput = document.getElementById("searchInput");
const dh = document.getElementById("selecton");
const i = {
  dateSection,
  titleInput,
  muInput,
  sizeInput,
  nameInput,
  priceInput,
  htmlTable,
  trHeader,
  barTotale,
  addBtn,
  EXPORTbtn,
  searchInput,
  dh,
};
const accountant = new App(i);
let infoBtn = document.getElementById("infoBtn");
infoBtn.addEventListener("click", (e) => {
  ipcRenderer.send("info:page");
});
