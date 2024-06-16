function calculateRequiredProfit() {
  var initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
  var lossPercentage = parseFloat(document.getElementById('lossPercentage').value);

  if (isNaN(initialInvestment) || isNaN(lossPercentage)) {
    alert('올바른 숫자를 입력하세요.');
    return;
  }

  var remainingAmount = initialInvestment * (1 - lossPercentage / 100);
  var requiredProfitPercentage = (initialInvestment / remainingAmount - 1) * 100;

  document.getElementById('result').innerText = `손해를 본 후 남은 금액으로 원금을 회수하기 위해 필요한 이익률: ${requiredProfitPercentage.toFixed(2)}%`;
}
