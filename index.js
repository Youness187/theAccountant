const { app, BrowserWindow, ipcMain } = require("electron");
var fonts = {
  Almarai: {
    normal: "src/fonts/Tajawal-Medium.ttf",
    bold: "src/fonts/Tajawal-Bold.ttf",
  },
  Roboto: {
    normal: "src/fonts/Tajawal-Medium.ttf",
    bold: "src/fonts/Tajawal-Bold.ttf",
    italics: "fonts/Roboto-Italic.ttf",
    bolditalics: "fonts/Roboto-MediumItalic.ttf",
  },
};
const PdfPrinter = require("pdfmake/src/printer");
const printer = new PdfPrinter(fonts);
const fs = require("fs");
let win, aboutWin;
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    minWidth: 320,
    height: 600,
    minHeight: 508,
    darkTheme: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.maximize();
  win.loadFile("./src/index.html");
}
app.whenReady().then(createWindow);
ipcMain.on("table", (obj, { table, totale, title, date, DH }) => {
  title = title == "" ? "the-accountant-doc" : title;
  DH = DH == "" ? "....." : DH;
  var docDefinition = {
    info: {
      title: `${title}`,
      author: "the ACCOUNTANT v1.2.0",
      subject: "Younesse El-moudne© All Rights Reserved.",
    },
    footer: (page, pages) => {
      if (page !== pages) {
        return {
          text: `p ${page} of ${pages}.`,
          alignment: "center",
          fontSize: 9,
        };
      } else {
        return {
          text: `© ${date.getFullYear()}-2020 Youness El-mouden All Rights Reserved | last page.`,
          style: "cR",
        };
      }
    },
    content: [
      {
        text: [
          { text: "THE", bold: true },
          " ACCOUNTANT ",
          { text: "V1.2.0", bold: true, alignment: "right" },
        ],
        fontSize: 12,
        alignment: "left",
      },
      {
        text: [{ text: `${title}` }, { text: " المتجر: إسم ", bold: true }],
        fontSize: 12,
        margin: [0, -12, 3, 0],
        alignment: "right",
        fillColor: "#dddddd",
      },
      {
        text: [
          { text: "Date: ", bold: true },
          { text: `${date.toLocaleDateString("am")}` },
        ],
        fontSize: 12,
        margin: [0, 20, 0, 0],
        alignment: "left",
      },
      {
        text: [{ text: `${totale} ${DH}` }, { text: " المجموع:", bold: true }],
        fontSize: 12,
        margin: [0, -13, 1, 0],
        alignment: "right",
      },
      {
        margin: [0, 20, 0, 0],
        table: {
          headerRows: 1,
          widths: ["auto", 50, "*", "auto", 40],
          body: table,
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 1 : 0.5;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 1 : 0.5;
          },
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? "black" : "gray";
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length ? "black" : "gray";
          },
          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex === 0 ? "#ddd" : null;
          },
        },
      },
    ],

    defaultStyle: {
      font: "Almarai",
    },

    styles: {
      nameS: {
        alignment: "right",
        margin: [5, 0],
      },
      numberS: {
        alignment: "center",
      },
      cR: {
        font: "Roboto",
        alignment: "center",
        fontSize: 9,
        italics: true,
        color: "#727272",
      },
      th: {
        bold: true,
        margin: [0, 5],
        alignment: "center",
      },
    },
  };
  var pdfKitDoc = printer.createPdfKitDocument(docDefinition);
  pdfKitDoc.pipe(fs.createWriteStream(`${title}.pdf`));
  pdfKitDoc.end();
});
ipcMain.on("info:page", () => {
  aboutWin = new BrowserWindow({
    width: 400,
    parent: win,
    height: 400,
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  aboutWin.loadFile("./src/about.html");
  aboutWin.on("close", () => {
    aboutWin = null;
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
