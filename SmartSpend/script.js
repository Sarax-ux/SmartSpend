let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let income = Number(localStorage.getItem("income")) || 0;

function saveData() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("income", income);
}

function getTotal() {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}

function updateHome() {
    let total = getTotal();
    let remaining = income - total;

    let homeIncome = document.getElementById("homeIncome");
    let homeSpent = document.getElementById("homeSpent");
    let homeBalance = document.getElementById("homeBalance");
    let homeRemaining = document.getElementById("homeRemaining");

    if (homeIncome) homeIncome.textContent = income + " EGP";
    if (homeSpent) homeSpent.textContent = total + " EGP";
    if (homeBalance) homeBalance.textContent = remaining + " EGP";
    if (homeRemaining) homeRemaining.textContent = remaining + " EGP";
}

let saveIncome = document.getElementById("saveIncome");

if (saveIncome) {
    saveIncome.addEventListener("click", () => {
        let value = Number(document.getElementById("incomeInput").value);

        if (value > 0) {
            income = value;
            saveData();
            updateHome();
            alert("Income saved successfully!");
            document.getElementById("incomeInput").value = "";
        } else {
            alert("Please enter your income.");
        }
    });
}

function displayExpenses(list) {
    let container = document.getElementById("expenseList");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = '<p class="empty">No expenses found.</p>';
        return;
    }

    list.forEach((expense, index) => {
        container.innerHTML += `
            <div class="expense-item">
                <strong>${expense.name}</strong>
                <span>${expense.amount} EGP</span>
                <span class="category">${expense.category}</span>
                <span>${expense.date}</span>
                <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
            </div>
        `;
    });
}

function updateExpenses() {
    let total = getTotal();

    let totalSpent = document.getElementById("totalSpent");
    let expenseCount = document.getElementById("expenseCount");
    let expenseRemaining = document.getElementById("expenseRemaining");

    if (totalSpent) totalSpent.textContent = total + " EGP";
    if (expenseCount) expenseCount.textContent = expenses.length;
    if (expenseRemaining) expenseRemaining.textContent = income - total + " EGP";

    displayExpenses(expenses);
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    saveData();
    updateExpenses();
}

let expenseForm = document.getElementById("expenseForm");

if (expenseForm) {
    document.getElementById("expenseDate").valueAsDate = new Date();

    expenseForm.addEventListener("submit", (event) => {
        event.preventDefault();

        let name = document.getElementById("expenseName").value;
        let amount = Number(document.getElementById("expenseAmount").value);
        let category = document.getElementById("expenseCategory").value;
        let date = document.getElementById("expenseDate").value;

        if (name === "" || amount <= 0 || category === "" || date === "") {
            alert("Please fill all fields.");
            return;
        }

        expenses.push({
            name: name,
            amount: amount,
            category: category,
            date: date
        });

        saveData();
        updateExpenses();
        expenseForm.reset();
        document.getElementById("expenseDate").valueAsDate = new Date();

        alert("Expense added successfully!");
    });
}

let searchExpense = document.getElementById("searchExpense");

if (searchExpense) {
    searchExpense.addEventListener("input", () => {
        let search = searchExpense.value.toLowerCase();

        let result = expenses.filter((expense) => {
            return expense.name.toLowerCase().includes(search) ||
                   expense.category.toLowerCase().includes(search);
        });

        displayExpenses(result);
    });
}

function updateReports() {
    let total = getTotal();

    let reportIncome = document.getElementById("reportIncome");
    let reportSpent = document.getElementById("reportSpent");
    let reportRemaining = document.getElementById("reportRemaining");
    let reportMessage = document.getElementById("reportMessage");

    if (!reportIncome) {
        return;
    }

    reportIncome.textContent = income + " EGP";
    reportSpent.textContent = total + " EGP";
    reportRemaining.textContent = income - total + " EGP";

    if (income === 0) {
        reportMessage.textContent = "Set your income first to know how much money is left.";
    } else if (total > income) {
        reportMessage.textContent = "You spent more than your income. Try to reduce unnecessary expenses.";
    } else {
        reportMessage.textContent = "Good job! You still have " + (income - total) + " EGP remaining.";
    }

    showCategories();
}

function showCategories() {
    let container = document.getElementById("categoryReport");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    let categories = {};

    expenses.forEach((expense) => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }

        categories[expense.category] += expense.amount;
    });

    let total = getTotal();

    if (total === 0) {
        container.innerHTML = '<p class="empty">No spending data yet.</p>';
        return;
    }

    Object.keys(categories).forEach((category) => {
        let amount = categories[category];
        let percentage = amount / total * 100;

        container.innerHTML += `
            <div class="category-row">
                <div class="category-info">
                    <span>${category}</span>
                    <strong>${amount} EGP</strong>
                </div>

                <div class="category-bar">
                    <div style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    });
}

updateHome();
updateExpenses();
updateReports();
