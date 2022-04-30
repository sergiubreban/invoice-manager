import jsPDFInvoiceTemplate, { OutputType } from "jspdf-invoice-template";

const defaultProps = {
  outputType: OutputType.Save,
  returnJsPDFDocObject: true,
  fileName: `Invoice ${new Date().toLocaleDateString()}`,
  orientationLandscape: false,
  compress: true,
  // logo: {
  //   src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png",
  //   width: 53.33, //aspect ratio = width/height
  //   height: 26.66,
  //   margin: {
  //     top: 0, //negative or positive num, from the current position
  //     left: 0 //negative or positive num, from the current position
  //   }
  // },
  business: {
    name: "BRB CONNECT SOLUTIONS SRL",
    address: "B-dul Mihai Viteazul, 66, Ap.12 450066 Zalau, Romania",
    phone: "44695066, ROONRC.J31/453/2021",
    email: "Account: 77873009, Sort code: 04-00-75",
    email_1: "Bank / Payment insitution: Revolut Ltd",
    website: "contact@breban.ro",
  },
  contact: {
    label: "Invoice issued for:",
    name: "YLD LIMITED",
    address: "08761606",
    phone: "Registered in England and Wales",
    email: "20 old Bailey",
    otherInfo: "London EC4M7AN, England",
  },
  invoice: {
    label: "Invoice BSYLD #: ",
    num: 1,
    invDate: "Issue Date: 30/04/2022",
    invGenDate: "Due Date: 30/05/2022",
    headerBorder: false,
    tableBodyBorder: false,
    header: [
      {
        title: "#",
        style: {
          width: 10
        }
      },
      {
        title: "Service",
        style: {
          width: 80
        }
      },
      { title: "Price" },
      { title: "Quantity" },
      { title: "Unit" },
      { title: "Total" }
    ],
    table: [[
      1,
      "IT consultancy",
      500,
      8,
      "days",
      500 * 8
    ]],
    invTotalLabel: "Total:",
    invTotal: `${500 * 8}`,
    invCurrency: "GBP",
    // not
    // row1: {
    //   col1: 'VAT:',
    //   col2: '20',
    //   col3: '%',
    //   style: {
    //     fontSize: 10 //optional, default 12
    //   }
    // },
    // row2: {
    //   col1: 'SubTotal:',
    //   col2: '116,199.90',
    //   col3: 'ALL',
    //   style: {
    //     fontSize: 10 //optional, default 12
    //   }
    // },
    // invDescLabel: "Invoice Note",
    // invDesc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.",
  },
  // footer: {
  //   text: "The invoice is created on a computer and is valid without the signature and stamp.",
  // },
  pageEnable: true,
  pageLabel: "Page ",
};

const usePdf = () => {
  return { createPdf: (props?: any) => jsPDFInvoiceTemplate({ ...defaultProps, ...props, invoice: { ...defaultProps.invoice, ...props?.invoice } }) }
};

export { usePdf }
