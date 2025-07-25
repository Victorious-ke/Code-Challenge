// event 1 DomContentLoaded
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("my_form");
  const recordsList = document.getElementById("recordsList");


  const grossEl = document.getElementById("gross");
  const nssfEl = document.getElementById("nssf");
  const nhdfEl = document.getElementById("nhdf");
  const taxableIncomeEl = document.getElementById("taxable_income");
  const finalPayeeEl = document.getElementById("final_payee");
  const shifEl = document.getElementById("shif");
  const netPayEl = document.getElementById("net_pay");


  const basicSalaryInput = document.getElementById("basicInput");
  const benefitsInput = document.getElementById("benefitsInput");

  // Preview gross  and benefits
  const grossPreview = document.getElementById("grossPreview");
  const benefitsPreview = document.getElementById("benefitsPreview");

    // live preview of gross salary and benefits user inputs
  [basicSalaryInput, benefitsInput].forEach(input => {
    input.addEventListener("input", () => {
      const basic = Number(basicSalaryInput.value);
      const benefits = Number(benefitsInput.value);

      if (!isNaN(benefits) && benefits > 0) {
        benefitsPreview.textContent = `Preview Benefits: KES ${Math.floor(benefits)}`;
      } else {
        benefitsPreview.textContent = "";
      }

      const gross = basic + benefits;
      if (!isNaN(gross) && gross > 0) {
        grossPreview.textContent = `Preview Gross Salary: KES ${Math.floor(gross)}`;
      } else {
        grossPreview.textContent = "";
      }
    });
  });

  // event submit Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const basicSalary = Number(basicSalaryInput.value);
    const benefits = Number(benefitsInput.value);
    const grossSalary = basicSalary + benefits;

    // NSSF
    let nssf = grossSalary * 0.06;
    if (nssf > 1080) nssf = 1080;

    // NHDF 
    const nhdf = grossSalary * 0.015;

    // Taxable Income
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

    // SHIF 
    const shif = grossSalary * 0.0275;

    // Net Pay
    const netPay = grossSalary - nssf - nhdf - paye - shif;

    // Display results

    grossEl.textContent = Math.floor(grossSalary);
    nssfEl.textContent = Math.floor(nssf);
    nhdfEl.textContent = Math.floor(nhdf);
    taxableIncomeEl.textContent = Math.floor(taxableIncome);
    finalPayeeEl.textContent = Math.floor(paye);
    shifEl.textContent = Math.floor(shif);
    netPayEl.textContent = Math.floor(netPay);

    // Save record
    const record = {
      grossSalary,
      netPay,
      nssf,
      nhdf,
      paye,
      shif
    };

    fetch("http://localhost:3000/salaryRecords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record)
    }).then(() => loadSalaryRecords());
  });

  // Load all saved salary records
  function loadSalaryRecords() {
    fetch("http://localhost:3000/salaryRecords")
      .then(res => res.json())
      .then(records => {
        recordsList.innerHTML = "";
        records.forEach(record => {
          const li = document.createElement("li");
          li.innerHTML = `
          <strong>Gross:</strong> KES ${Math.round(record.grossSalary)} 
          <strong>Net Pay:</strong> KES ${Math.round(record.netPay)}
        <button data-id="${record.id}" class="delete-btn">Delete</button>
          `;
          recordsList.appendChild(li);
        });
      });
  }

  // event click Delete a record
  recordsList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.dataset.id;
      fetch(`http://localhost:3000/salaryRecords/${id}`, {
        method: "DELETE"
      }).then(() => loadSalaryRecords());
    }
  });

  // Load records on page load
  loadSalaryRecords();
});
