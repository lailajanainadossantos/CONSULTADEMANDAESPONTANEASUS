function gerarSOAP() {
  const textoOriginal = document.getElementById("subjetivo").value;
  const s = textoOriginal.toLowerCase();

  let S = textoOriginal;
  let O = "BEG, LOC, AAA\n";
  let A = "";
  let P = "";

  if (s.includes("cefaleia") || s.includes("dor de cabeça")) {
    S += "\nNega febre, rigidez de nuca, trauma cranioencefálico recente, síncope, crises convulsivas, paresias, parestesias, alterações visuais e dor torácica.";
    O += "Neurológico: Glasgow 15, pupilas isocóricas e fotorreagentes, força preservada em quatro membros, sensibilidade preservada, sem déficits focais.\nAC: RCR 2T BNF SS";
    A = "Cefaleia primária";
    P = "Oriento repouso relativo e boa hidratação.\nOriento quanto aos sinais de alarme neurológicos, devendo procurar UPA/PA se presentes.\nEm caso de persistência dos sintomas ou surgimento de novas queixas, buscar reavaliação.";
  }

  if (!A) {
    A = "A esclarecer";
    P = "Oriento sinais de alarme conforme quadro clínico.\nOriento retorno se persistência ou surgimento de novas queixas.";
  }

  const soap = `#Demanda espontânea
#Alergias medicamentosas: nega
#Comorbidades: nega

#S:
${S}

#O:
${O}

#A:
${A}

#P:
${P}
`;

  document.getElementById("soapGerado").textContent = soap;
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

function carregarOrientacao() {
  const tipo = document.getElementById("orientacaoSelect").value;
  const campo = document.getElementById("orientacaoTexto");

  const orientacoes = {
    cefaleia: `ORIENTAÇÕES – CEFALEIA

Manter repouso relativo e boa hidratação.
Evitar jejum prolongado.

Procurar atendimento imediato se houver:
• Febre
• Rigidez de nuca
• Alterações visuais
• Fraqueza ou formigamento
• Desmaios ou convulsões

Consulta em UBS – São José/SC
Dra. Laila J. dos Santos – CRM-SC 38237`,

    dengue: `ORIENTAÇÕES – DENGUE

Manter hidratação rigorosa.
Não utilizar anti-inflamatórios.

Procurar atendimento imediato se houver:
• Dor abdominal intensa
• Vômitos persistentes
• Sangramentos
• Tontura ou desmaios

Consulta em UBS – São José/SC
Dra. Laila J. dos Santos – CRM-SC 38237`
  };

  campo.value = orientacoes[tipo] || "";
}
