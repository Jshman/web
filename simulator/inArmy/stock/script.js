function calculateRequiredProfit() {
  var initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
  var lossPercentage = parseFloat(document.getElementById('lossPercentage').value);

  if (isNaN(initialInvestment) || isNaN(lossPercentage)) {
    alert('올바른 숫자를 입력하세요.');
    return;
  }

  var lossAmount = initialInvestment * (lossPercentage / 100);
  var remainingAmount = initialInvestment - lossAmount;
  var requiredProfitPercentage = (initialInvestment / remainingAmount - 1) * 100;

  var lossAmountElement = document.getElementById('lossAmountValue');
  lossAmountElement.textContent = `${lossAmount.toFixed(2)} 원`;

  var resultElement = document.getElementById('result');
  resultElement.innerHTML = `복구 금액(${initialInvestment.toFixed(2) - lossAmount.toFixed(2)})으로 원금을 회수하기 위해 필요한 이익률: <span class="highlight">${requiredProfitPercentage.toFixed(2)}%</span>`;
}

function setLossPercentage(lossPercentage) {
  document.getElementById('lossPercentage').value = lossPercentage;
  calculateRequiredProfit();
}
