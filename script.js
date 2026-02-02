diff --git a/script.js b/script.js
index 13918033b7402947e6e1ab458ac909b6c4a9a7f4..bc1b31d203110ecad10805e411a3fc4aea7d7508 100644
--- a/script.js
+++ b/script.js
@@ -1,95 +1,209 @@
-function gerarSOAP() {
-  const textoOriginal = document.getElementById("subjetivo").value;
-  const s = textoOriginal.toLowerCase();
-
-  let S = textoOriginal;
-  let O = "BEG, LOC, AAA\n";
-  let A = "";
-  let P = "";
-
-  if (s.includes("cefaleia") || s.includes("dor de cabeça")) {
-    S += "\nNega febre, rigidez de nuca, trauma cranioencefálico recente, síncope, crises convulsivas, paresias, parestesias, alterações visuais e dor torácica.";
-    O += "Neurológico: Glasgow 15, pupilas isocóricas e fotorreagentes, força preservada em quatro membros, sensibilidade preservada, sem déficits focais.\nAC: RCR 2T BNF SS";
-    A = "Cefaleia primária";
-    P = "Oriento repouso relativo e boa hidratação.\nOriento quanto aos sinais de alarme neurológicos, devendo procurar UPA/PA se presentes.\nEm caso de persistência dos sintomas ou surgimento de novas queixas, buscar reavaliação.";
-  }
-
-  if (!A) {
-    A = "A esclarecer";
-    P = "Oriento sinais de alarme conforme quadro clínico.\nOriento retorno se persistência ou surgimento de novas queixas.";
-  }
-
-  const soap = `#Demanda espontânea
-#Alergias medicamentosas: nega
-#Comorbidades: nega
-
-#S:
-${S}
-
-#O:
-${O}
-
-#A:
-${A}
+const queixaRegras = {
+  cefaleia: {
+    negativos: "NEGA febre, rigidez de nuca, alteração visual, síncope, convulsões, trauma cranioencefálico recente, paresias e parestesias.",
+    objetivo: "BEG, LOC, AAA, afebril.\nSV: sem alterações relevantes.\nNeurológico: Glasgow 15, pupilas isocóricas e fotorreagentes, força e sensibilidade preservadas, sem déficits focais.\nAC: RCR 2T BNF SS.",
+  },
+  "dor no ombro": {
+    negativos: "NEGA trauma recente de alta energia, perda de força distal e parestesias em membro superior.",
+    objetivo: "BEG, LOC, AAA.\nOrtopédico (ombro): inspeção sem deformidades, dor à palpação conforme queixa, amplitude de movimento limitada pela dor, testes específicos direcionados, sem sinais de instabilidade.\nSV: sem alterações relevantes.",
+  },
+  diarreia: {
+    negativos: "NEGA sangue nas fezes, vômitos incoercíveis, febre alta, sinais de desidratação importante e dor abdominal intensa.",
+    objetivo: "BEG, LOC, AAA.\nAbdome: RHA+, depressível, sem dor à palpação profunda, sem sinais de irritação peritoneal.\nPele: sem lesões, hidratação preservada.\nSV: sem alterações relevantes.",
+  },
+  abscesso: {
+    negativos: "NEGA febre persistente, calafrios e sinais sistêmicos graves.",
+    objetivo: "BEG, LOC, AAA.\nPele: abscesso descrito com localização, diâmetro, calor local, hiperemia e dor à palpação.\nSV: sem alterações relevantes.",
+  },
+};
+
+function normalizarTexto(texto) {
+  return texto
+    .toLowerCase()
+    .normalize("NFD")
+    .replace(/\p{Diacritic}/gu, "");
+}
 
-#P:
-${P}
-`;
+function buscarRegra(queixa) {
+  const termo = normalizarTexto(queixa);
+  const chaves = Object.keys(queixaRegras);
+  return chaves.find((chave) => termo.includes(chave)) || null;
+}
 
-  document.getElementById("soapGerado").textContent = soap;
+function gerarSOAP() {
+  const ambiente = document.getElementById("ambiente").value;
+  const data = document.getElementById("dataAtendimento").value;
+  const queixa = document.getElementById("queixa").value.trim();
+  const alergias = document.getElementById("alergias").value.trim() || "Nega";
+  const medicacoes = document.getElementById("medicacoes").value.trim() || "Nega";
+  const comorbidades = document.getElementById("comorbidades").value.trim() || "Nega";
+  const subjetivo = document.getElementById("subjetivo").value.trim();
+  const objetivo = document.getElementById("objetivo").value.trim();
+  const exames = document.getElementById("exames").value.trim();
+  const hipotesePrincipal = document.getElementById("hipotesePrincipal").value.trim() || "A esclarecer";
+  const hipoteseDiferencial = document.getElementById("hipoteseDiferencial").value.trim();
+  const planoExames = document.getElementById("planoExames").value.trim();
+  const planoPrescricao = document.getElementById("planoPrescricao").value.trim();
+  const planoOrientacoes = document.getElementById("planoOrientacoes").value.trim();
+
+  const regra = queixa ? buscarRegra(queixa) : null;
+  const negativos = regra ? queixaRegras[regra].negativos : "";
+  const objetivoSugerido = regra ? queixaRegras[regra].objetivo : "BEG, LOC, AAA.";
+
+  const blocoS = [
+    subjetivo,
+    negativos,
+  ].filter(Boolean).join("\n");
+
+  const blocoO = [
+    objetivo || objetivoSugerido,
+    exames ? `\n${exames}` : "",
+  ].join("\n");
+
+  const blocoA = [
+    "1. " + hipotesePrincipal,
+    hipoteseDiferencial ? `2. ${hipoteseDiferencial}` : "",
+  ].filter(Boolean).join("\n");
+
+  const blocoP = [
+    planoExames ? `1. Exames: ${planoExames}` : "1. Exames: ",
+    planoPrescricao ? `2. Prescrição: ${planoPrescricao}` : "2. Prescrição: ",
+    planoOrientacoes ? `3. Orientações: ${planoOrientacoes}` : "3. Orientações: ",
+  ].join("\n");
+
+  const cabecalho = [
+    `Ambiente: ${ambiente}`,
+    data ? `Data: ${data}` : null,
+    queixa ? `Queixa principal: ${queixa}` : null,
+  ].filter(Boolean).join("\n");
+
+  const soap = `${cabecalho}\n\n#S - Subjetivo\n#Alergias: ${alergias}.\n#MEU: ${medicacoes}.\n#Comorbidades: ${comorbidades}.\n${blocoS}\n\n#O - Objetivo\n${blocoO}\n\n#A - Avaliação\n${blocoA}\n\n#P - Plano\n${blocoP}\n`;
+
+  document.getElementById("soapGerado").textContent = soap.trim();
 }
 
 function copiarSOAP() {
-  navigator.clipboard.writeText(document.getElementById("soapGerado").textContent);
+  const texto = document.getElementById("soapGerado").textContent;
+  navigator.clipboard.writeText(texto);
 }
 
-function limpar() {
-  document.getElementById("subjetivo").value = "";
+function limparFormulario() {
+  document.querySelectorAll("input, textarea").forEach((campo) => {
+    if (campo.type === "date") {
+      campo.value = "";
+    } else {
+      campo.value = "";
+    }
+  });
   document.getElementById("soapGerado").textContent = "";
+  document.getElementById("encaminhamentoGerado").textContent = "";
+  document.getElementById("dengueResultado").textContent = "";
+  document.getElementById("pediatriaResultado").textContent = "";
 }
 
 function abrirModal() {
   document.getElementById("modal").style.display = "block";
 }
 
 function fecharModal() {
   document.getElementById("modal").style.display = "none";
 }
 
 function carregarOrientacao() {
   const tipo = document.getElementById("orientacaoSelect").value;
   const campo = document.getElementById("orientacaoTexto");
 
   const orientacoes = {
-    cefaleia: `ORIENTAÇÕES – CEFALEIA
+    cefaleia: `ORIENTAÇÕES – CEFALEIA\n\nManter repouso relativo e boa hidratação.\nEvitar jejum prolongado.\n\nProcurar atendimento imediato se houver:\n• Febre\n• Rigidez de nuca\n• Alterações visuais\n• Fraqueza ou formigamento\n• Desmaios ou convulsões`,
 
-Manter repouso relativo e boa hidratação.
-Evitar jejum prolongado.
+    dengue: `ORIENTAÇÕES – DENGUE\n\nManter hidratação vigorosa.\nNão utilizar anti-inflamatórios.\n\nProcurar atendimento imediato se houver:\n• Dor abdominal intensa\n• Vômitos persistentes\n• Sangramentos\n• Tontura ou desmaios`,
+  };
 
-Procurar atendimento imediato se houver:
-• Febre
-• Rigidez de nuca
-• Alterações visuais
-• Fraqueza ou formigamento
-• Desmaios ou convulsões
+  campo.value = orientacoes[tipo] || "";
+}
 
-Consulta em UBS – São José/SC
-Dra. Laila J. dos Santos – CRM-SC 38237`,
+function gerarEncaminhamento() {
+  const texto = document.getElementById("encaminhamentoTexto").value.trim();
+  if (!texto) {
+    document.getElementById("encaminhamentoGerado").textContent = "";
+    return;
+  }
+  const carta = `Paciente com ${texto}`;
+  document.getElementById("encaminhamentoGerado").textContent = carta;
+}
 
-    dengue: `ORIENTAÇÕES – DENGUE
+function calcularDengue() {
+  const peso = parseFloat(document.getElementById("pesoDengue").value);
+  const faixa = document.getElementById("faixaEtaria").value;
 
-Manter hidratação rigorosa.
-Não utilizar anti-inflamatórios.
+  if (!peso || peso <= 0) {
+    document.getElementById("dengueResultado").textContent = "Informe o peso para cálculo.";
+    return;
+  }
 
-Procurar atendimento imediato se houver:
-• Dor abdominal intensa
-• Vômitos persistentes
-• Sangramentos
-• Tontura ou desmaios
+  const mlPorKg = faixa === "adulto" ? 60 : 80;
+  const total = peso * mlPorKg;
+  const sais = total / 3;
+  const liquidos = total * 2 / 3;
 
-Consulta em UBS – São José/SC
-Dra. Laila J. dos Santos – CRM-SC 38237`
-  };
+  const resultado = `DILUIR 1 ENVELOPE EM 1L DE ÁGUA FILTRADA. REALIZAR HIDRATAÇÃO VIGOROSA.\nCONSUMIR APROXIMADAMENTE ${(total / 1000).toFixed(1)} L AO DIA, DOS QUAIS:\n${(sais / 1000).toFixed(1)} L - REIDRATAÇÃO COM SORO DE REIDRATAÇÃO\n${(liquidos / 1000).toFixed(1)} L - ÁGUA, SUCOS E CHÁS (SEM AÇÚCAR E CLAROS)`;
 
-  campo.value = orientacoes[tipo] || "";
+  document.getElementById("dengueResultado").textContent = resultado;
+}
+
+function calcularPediatria() {
+  const idadeMeses = parseInt(document.getElementById("idadeMeses").value, 10);
+  const peso = parseFloat(document.getElementById("pesoPediatria").value);
+
+  if (!peso || peso <= 0 || Number.isNaN(idadeMeses)) {
+    document.getElementById("pediatriaResultado").textContent = "Informe idade em meses e peso para cálculo.";
+    return;
+  }
+
+  const dipironaGotas = Math.min(Math.round(peso * 0.7), 52);
+  const ibuprofenoGotas = Math.min(Math.round(peso * 2), 40);
+  const amoxiDosePlenaMl = ((peso * 50) / 3) / 50;
+  const amoxiDoseAltaMl = ((peso * 90) / 3) / 50;
+  const azitroDia1Ml = (peso * 10) / 40;
+  const azitroDias2a5Ml = (peso * 5) / 40;
+  const cefalexinaDoseMinMl = ((peso * 25) / 4) / 50;
+  const cefalexinaDoseMaxMl = ((peso * 50) / 4) / 50;
+  const metoclopramidaGotas = Math.min(Math.round(peso * 1), 52);
+
+  let escopolaminaDose = "Consultar faixa etária.";
+  if (idadeMeses < 3) {
+    escopolaminaDose = "1,5 mg/kg/dose (máx 2 mL por dose).";
+  } else if (idadeMeses < 12) {
+    escopolaminaDose = "0,7 mg/kg/dose (máx 2 mL por dose).";
+  } else if (idadeMeses < 72) {
+    escopolaminaDose = "0,4 mg/kg/dose (máx 2 mL por dose).";
+  } else {
+    escopolaminaDose = "10-20 mg/dose (máx 2 mL por dose).";
+  }
+
+  let desloratadina = "";
+  if (idadeMeses >= 6 && idadeMeses < 12) {
+    desloratadina = "2 ml VO, 1x/dia.";
+  } else if (idadeMeses >= 12 && idadeMeses < 72) {
+    desloratadina = "2,5 ml VO, 1x/dia.";
+  } else if (idadeMeses >= 72 && idadeMeses <= 144) {
+    desloratadina = "5 ml VO, 1x/dia.";
+  } else {
+    desloratadina = "Ajustar conforme idade.";
+  }
+
+  let acetilcisteina = "";
+  if (idadeMeses >= 24 && idadeMeses < 60) {
+    acetilcisteina = "5 ml VO 12/12h.";
+  } else if (idadeMeses >= 60 && idadeMeses < 120) {
+    acetilcisteina = "5 ml VO 8/8h.";
+  } else if (idadeMeses >= 120) {
+    acetilcisteina = "10 ml VO 8/8h.";
+  } else {
+    acetilcisteina = "Ajustar conforme idade.";
+  }
+
+  const resultado = `PESO: ${peso} kg | IDADE: ${idadeMeses} meses\n\nDIPIRONA 500mg/mL: ${dipironaGotas} gotas 6/6h se dor ou febre.\nAMOXICILINA 50mg/mL: ${amoxiDosePlenaMl.toFixed(1)} mL 8/8h (50mg/kg/dia) OU ${amoxiDoseAltaMl.toFixed(1)} mL 8/8h (90mg/kg/dia).\nAZITROMICINA 200mg/5mL: ${azitroDia1Ml.toFixed(1)} mL no dia 1 e ${azitroDias2a5Ml.toFixed(1)} mL nos dias 2 a 5.\nCEFALEXINA 250mg/5mL: ${cefalexinaDoseMinMl.toFixed(1)} a ${cefalexinaDoseMaxMl.toFixed(1)} mL 6/6h.\nMETOCLOPRAMIDA 4mg/mL: ${metoclopramidaGotas} gotas 8/8h se náusea.\nESCOPOLAMINA 10mg/mL: ${escopolaminaDose}\nSIMETICONA 75mg/mL: 3 a 5 gotas 3x/dia (lactentes) | 5 a 10 gotas 3x/dia (até 12 anos).\nIBUPROFENO 50mg/mL: ${ibuprofenoGotas} gotas 8/8h por até 3 dias.\nDESLORATADINA solução pediátrica: ${desloratadina}\nACETILCISTEÍNA xarope 20mg/mL: ${acetilcisteina}\nSAIS DE REIDRATAÇÃO: diluir em água filtrada e ofertar livre demanda.`;
+
+  document.getElementById("pediatriaResultado").textContent = resultado;
 }
