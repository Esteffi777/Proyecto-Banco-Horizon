function convertCurrency() {
    var amount = document.getElementById('amount').value;
    var currency = document.getElementById('currency').value;
    var rate = 0;

    if (currency === "EUR") {
        rate = 0.85; // Tipo de cambio ejemplo
    } else if (currency === "GBP") {
        rate = 0.75; // Tipo de cambio ejemplo
    } else {
        rate = 1; // USD
    }

    var result = amount * rate;
    document.getElementById('result').innerHTML = "Resultado: " + result.toFixed(2) + " " + currency;
}
  