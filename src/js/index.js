const loadingBtn = document.querySelector(".transactions-loading");
const searchBox = document.querySelector(".header-search");
const searchInput = document.querySelector(".header-search-input");
const transactionsBox = document.querySelector(".transactions");
const tableTag = document.getElementsByTagName("table")[0];
const headerTable = document.querySelectorAll(".header-table");
let transactionsAll = [];
let currentFilter = "";
let sortState = {
  id: "asc", // پیش‌فرض سورت ID
  price: "asc", // پیش‌فرض سورت قیمت
  date: "asc", // پیش‌فرض سورت تاریخ
};
const instance = axios.create({
  baseURL: "https://api.jsonbin.io/v3/b/6788b72cacd3cb34a8cc6f61",
  headers: {
    "X-Master-Key":
      "$2a$10$ru99PfuQgeJlpnCprfrIpuy18ZNVDfz3/1XlOlo.i65Ol/TKEJwy.",
  },
});
loadingBtn.addEventListener("click", async () => {
  const respansAxios = await instance.get();
  transactionsAll = respansAxios.data.record.transactions;
  gnarateTransactions(transactionsAll);
  searchBox.classList.add("header-search--active");
  loadingBtn.classList.add("transactions-loading--hidden");
  transactionsBox.classList.add("transactions--show");
});
searchInput.addEventListener("input", async (e) => {
  currentFilter = e.target.value; // فیلتر جستجو را ذخیره می‌کنیم
  // دریافت تمام داده‌ها از سرور
 
  
  // فیلتر کردن داده‌ها در سمت کلاینت
  const filteredTransactions = transactionsAll.filter((transaction) =>
    transaction.refId.includes(currentFilter)
  );
  gnarateTransactions(filteredTransactions);
});
headerTable.forEach((item) => {
  item.addEventListener("click", async (e) => {
    item.classList.toggle("header-table--active");
    const dataItem = e.target.dataset.sort; // فیلد مورد نظر برای مرتب‌سازی (مثلاً id، price، date)
    console.log(dataItem);

    // تعیین جهت مرتب‌سازی (صعودی یا نزولی)
    let sortOrder = sortState[dataItem] === "asc" ? "desc" : "asc";

    // دریافت تمام داده‌ها از سر

    // اعمال فیلتر جستجو (اگر وجود دارد)
    if (currentFilter) {
      transactionsAll = transactionsAll.filter((transaction) =>
        transaction.refId.includes(currentFilter)
      );
    }

    // مرتب‌سازی داده‌ها در سمت کلاینت
    transactionsAll.sort((a, b) => {
      if (a[dataItem] < b[dataItem]) return sortOrder === "asc" ? -1 : 1;
      if (a[dataItem] > b[dataItem]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // نمایش داده‌های مرتب‌شده
    gnarateTransactions(transactionsAll);

    // به‌روزرسانی وضعیت مرتب‌سازی
    sortState[dataItem] = sortOrder;
  });
});
function gnarateTransactions(alltransaction) {
  let tableBody = tableTag.querySelector("tbody");
  if (!tableBody) {
    tableBody = document.createElement("tbody");
    tableTag.append(tableBody);
  } else {
    tableBody.innerHTML = "";
  }
  alltransaction.forEach((item) => {
    tableBody.innerHTML += `<tr>
            <td>${item.id}</td>
            <td class="${item.type == "برداشت از حساب" ? "pickeup" : ""}">${
      item.type
    }</td>
            <td>${item.price.toLocaleString()}</td>
            <td>${item.refId}</td>
            <td>
            ${new Date(item.date).toLocaleDateString("fa-IR", {
              dateStyle: "short",
            })} 
            ساعت 
            ${new Date(item.date).toLocaleTimeString("fa-IR", {
              timeStyle: "short",
            })}
            </td>
          </tr>`;
  });
}
