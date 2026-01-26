function gerarSOAP() {
  const s = document.getElementById("subjetivo").value;
  document.getElementById("soapGerado").textContent = `#Demanda espontânea
#Alergias medicamentosas: nega
#Comorbidades: nega

#S:
${s}

#O:
BEG, LOC, AAA

#A:

#P:
`;
}

function copiarSOAP() {
  navigator.clipboard.writeText(document.getElementById("soapGerado").textContent);
}

function limpar() {
  document.getElementById("subjetivo").value = "";
  document.getElementById("soapGerado").textContent = "";
}

function abrirModal() {
  document.getElementById("modal").style.display = "block";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}
