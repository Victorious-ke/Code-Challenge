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
  const resetBtnE1 = document.getElementById("resetBtn");
  const grossPreview = document.getElementById("grossPreview");

  const basicSalaryInput = form.querySelector("input[type='number']:nth-child(2)");
  const benefitsInput = form.querySelector("input[type='number']:nth-child(4)");

  //  Input Event for Live Gross Preview
  [basicSalaryInput, benefitsInput].forEach(input => {
    input.addEventListener("input", () => {
      const basic = Number(basicSalaryInput.value);
      const benefits = Number(benefitsInput.value);
      const gross = basic + benefits;

      grossPreview.textContent = isNaN(gross) ? "" : `Preview Gross Salary: KES ${gross.toFixed(2)}`;
    });
  });

  //  Submit event
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const basicSalary = Number(basicSalaryInput.value);
    const benefits = Number(benefitsInput.value);

    const grossSalary = basicSalary + benefits;
    
    //  nssf
    let nssf = grossSalary * 0.06;
    if (nssf > 1080) nssf = 1080;

    // nhdf
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

    // SHIF 
    const shif = grossSalary * 0.0275;

    const netPay = grossSalary - nssf - nhdf - paye - shif;

    // Display results
    grossEl.textContent = grossSalary.toFixed(2);
    nssfEl.textContent = nssf.toFixed(2);
    nhdfEl.textContent = nhdf.toFixed(2);
    taxableIncomeEl.textContent = taxableIncome.toFixed(2);
    finalPayeeEl.textContent = paye.toFixed(2);
    shifEl.textContent = shif.toFixed(2);
    netPayEl.textContent = netPay.toFixed(2);

    // Save to json-server
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

  // Delete individual record
  recordsList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.dataset.id;
      fetch(`http://localhost:3000/salaryRecords/${id}`, {
        method: "DELETE"
      }).then(() => loadSalaryRecords());
    }
  });


  loadSalaryRecords();
});
