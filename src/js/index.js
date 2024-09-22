const loadingBtn = document.querySelector(".transactions-loading");
const searchBox = document.querySelector(".header-search");
const searchInput = document.querySelector(".header-search-input");
const transactionsBox = document.querySelector(".transactions");
const tableTag = document.getElementsByTagName("table")[0];
const headerTable = document.querySelectorAll(".header-table");
let transactions = [];
let currentFilter = "";
let sortState = {
  id: "asc", // پیش‌فرض سورت ID
  price: "asc", // پیش‌فرض سورت قیمت
  date: "asc", // پیش‌فرض سورت تاریخ
};
const instance = axios.create({
  baseURL: "http://localhost:3000",
});
loadingBtn.addEventListener("click", async () => {
  const respansAxios = await instance.get("/transactions");
  transactions = respansAxios.data;
  gnarateTransactions(transactions);
  searchBox.classList.add("header-search--active");
  loadingBtn.classList.add("transactions-loading--hidden");
  transactionsBox.classList.add("transactions--show");
});
searchInput.addEventListener("input", async (e) => {
  currentFilter = e.target.value; // فیلتر جستجو را ذخیره می‌کنیم
  const respansAxios = await instance.get(`/transactions?refId_like=${currentFilter}`);
  transactions = respansAxios.data;
  gnarateTransactions(transactions);
});
headerTable.forEach((item) => {
  item.addEventListener("click", async (e) => {
    item.classList.toggle("header-table--active");
    const dataItem = e.target.dataset.sort;
    let sortOrder = sortState[dataItem] === "asc" ? "desc" : "asc";
    let url = `/transactions?_sort=${dataItem}&_order=${sortOrder}`;
    if (currentFilter) {
      url += `&refId_like=${currentFilter}`;
    }
    const respansAxios = await instance.get(url);
    transactions = respansAxios.data;
    gnarateTransactions(transactions);

    sortState[dataItem] = sortOrder; // تغییر وضعیت برای مرتب‌سازی صعودی/نزولی
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
            <td class="${item.type == "برداشت از حساب" ? "pickeup" : ""}">${item.type}</td>
            <td>${item.price.toLocaleString()}</td>
            <td>${item.refId}</td>
            <td>
            ${new Date(item.date).toLocaleDateString("fa-IR", {dateStyle: "short"})} 
            ساعت 
            ${new Date(item.date).toLocaleTimeString("fa-IR", {timeStyle: "short"})}
            </td>
          </tr>`;
  });
}
