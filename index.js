document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("my_form");
  const recordsList = document.getElementById("recordsList");
  const grossEl = document.getElementById("gross");
  const nssfEl = document.getElementById("nssf");
  const nhdfEl = document.getElementById("nhdf");
  const taxableIncomeEl = document.getElementById("taxable_income");
  const finalPayeeEl = document.getElementById("final_payee");
  const nhifEl = document.getElementById("sha");
  const netPayEl = document.getElementById("net_pay");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll("input[type='number']");
    const basicSalary = Number(inputs[0].value);
    const benefits = Number(inputs[1].value);

    const grossSalary = basicSalary + benefits;

    let nssf = grossSalary * 0.06;
    if (nssf > 1080) nssf = 1080;

    const nhdf = grossSalary * 0.015;
    const taxableIncome = grossSalary - nssf - nhdf;

    // PAYE bands
    let paye = 0;
    if (taxableIncome <= 24000) {
      paye = taxableIncome * 0.1;
    } else if (taxableIncome <= 32333) {
      paye = 2400 + (taxableIncome - 24000) * 0.25;
    } else {
      paye = 2400 + (8333 * 0.25) + (taxableIncome - 32333) * 0.3;
    }

    // sha calculatiobs
    let sha = 0;
    if (grossSalary <= 5999) nhif = 150;
    else if (grossSalary <= 7999) sha = 300;
    else if (grossSalary <= 11999) sha = 400;
    else if (grossSalary <= 14999) sha = 500;
    else if (grossSalary <= 19999) sha = 600;
    else if (grossSalary <= 24999) sha = 750;
    else if (grossSalary <= 29999) sha = 850;
    else if (grossSalary <= 34999) sha = 900;
    else if (grossSalary <= 39999) sha = 950;
    else if (grossSalary <= 44999) sha = 1000;
    else if (grossSalary <= 49999) sha = 1100;
    else sha = 1200;

    const netPay = grossSalary - nssf - nhdf - paye - sha;

    // Display results
    grossEl.textContent = grossSalary.toFixed(2);
    nssfEl.textContent = nssf.toFixed(2);
    nhdfEl.textContent = nhdf.toFixed(2);
    taxableIncomeEl.textContent = taxableIncome.toFixed(2);
    finalPayeeEl.textContent = paye.toFixed(2);
    nhifEl.textContent = nhif.toFixed(2);
    netPayEl.textContent = netPay.toFixed(2);

    // Save to json-server
    const record = {
      grossSalary,
      netPay,
      nssf,
      nhdf,
      paye,
      sha
    };

    fetch("http://localhost:3000/salaryRecords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record)
    })
      .then(() => loadSalaryRecords());
  });

  function loadSalaryRecords() {
    fetch("http://localhost:3000/salaryRecords")
      .then((res) => res.json())
      .then((records) => {
        recordsList.innerHTML = "";
        records.forEach((record) => {
          const li = document.createElement("li");
          li.innerHTML = `
            <strong>Gross:</strong> KES ${record.grossSalary.toFixed(2)},
            <strong>Net Pay:</strong> KES ${record.netPay.toFixed(2)}
            <button data-id="${record.id}" class="delete-btn">Delete</button>
          `;
          recordsList.appendChild(li);
        });
      });
  }

  recordsList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.dataset.id;
      fetch(`http://localhost:3000/salaryRecords/${id}`, {
        method: "DELETE"
      }).then(() => loadSalaryRecords());
    }
  });

  // Load on page load
  loadSalaryRecords();
});
