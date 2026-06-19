const form = document.getElementById("form-apontamento");
const campoData = document.getElementById("data");
const campoKmInicial = document.getElementById("km-inicial");
const campoKmFinal = document.getElementById("km-final");
const campoKmRodado = document.getElementById("km-rodado");
const campoHorasTrabalhadas = document.getElementById("horas-trabalhadas");
const campoTfm = document.getElementById("tfm");
const campoProva = document.getElementById("prova");
const campoOutraAtividade = document.getElementById("campo-outra-atividade");
const inputOutraAtividade = document.getElementById("outra-atividade");

campoData.value = new Date().toISOString().split("T")[0];

function atualizarQuilometragemRodada() {
	const kmInicial = Number(campoKmInicial.value);
	const kmFinal = Number(campoKmFinal.value);

	if (!campoKmInicial.value || !campoKmFinal.value || kmFinal < kmInicial) {
		campoKmRodado.value = "0 km";
		return;
	}

	campoKmRodado.value = `${kmFinal - kmInicial} km`;
}

campoKmInicial.addEventListener("input", atualizarQuilometragemRodada);
campoKmFinal.addEventListener("input", atualizarQuilometragemRodada);

campoHorasTrabalhadas.addEventListener("input", () => {
	campoHorasTrabalhadas.value = campoHorasTrabalhadas.value.replace(/[^0-9].*$/, "");
});

campoTfm.addEventListener("input", () => {
	campoTfm.value = campoTfm.value.replace(/\D/g, "").slice(0, 6);
});

campoProva.addEventListener("change", () => {
	const deveMostrarOutraAtividade = campoProva.value === "Outras Atividades";

	campoOutraAtividade.classList.toggle("ativo", deveMostrarOutraAtividade);
	inputOutraAtividade.required = deveMostrarOutraAtividade;

	if (!deveMostrarOutraAtividade) {
		inputOutraAtividade.value = "";
	}
});

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	const quilometragemInicial = Number(document.getElementById("km-inicial").value);
	const quilometragemFinal = Number(document.getElementById("km-final").value);

	const dados = {
		data: document.getElementById("data").value,
		tfm: document.getElementById("tfm").value,
		motorista: document.getElementById("motorista").value,
		turno: document.getElementById("turno").value,
		veiculo: document.getElementById("veiculo").value,
		horasTrabalhadas: document.getElementById("horas-trabalhadas").value,
		prova: document.getElementById("prova").value,
		outraAtividade: document.getElementById("outra-atividade").value,
		rota: document.getElementById("rota").value,
		quilometragemInicial: quilometragemInicial,
		quilometragemFinal: quilometragemFinal,
		quilometragemRodada: quilometragemFinal - quilometragemInicial,
		combustivel: document.getElementById("combustivel").value,
		litragemAbastecida: document.getElementById("litragem").value,
		observacoes: document.getElementById("observacoes").value
	};

	if (dados.quilometragemFinal < dados.quilometragemInicial) {
		alert("A quilometragem final não pode ser menor que a quilometragem inicial.");
		return;
	}

	if (!/^\d{6}$/.test(dados.tfm)) {
		alert("O TFM deve conter exatamente 6 números.");
		return;
	}

	if (!Number.isInteger(Number(dados.horasTrabalhadas))) {
		alert("O campo de horas trabalhadas deve conter apenas números inteiros.");
		return;
	}

	if (dados.prova === "Outras Atividades" && !dados.outraAtividade.trim()) {
		alert("Informe a atividade realizada.");
		return;
	}

	if (!dados.combustivel && dados.litragemAbastecida) {
		alert("Informe o combustível abastecido ou deixe a litragem em branco.");
		return;
	}

	if (dados.combustivel && !dados.litragemAbastecida) {
		alert("Informe a litragem abastecida ou selecione 'Não abasteceu'.");
		return;
	}

	try {
		console.log(dados);

		await fetch(
			"https://script.google.com/macros/s/AKfycby8yTpNMTVYo1WCusL_CB4zqjNMYwbGSl1ck0fardHFWd6LdgE5BuEdAMlZQPr-Eky7LA/exec",
			{
				method: "POST",
				mode: "no-cors",
				body: JSON.stringify(dados)
			}
		);

		alert("Apontamento salvo com sucesso!");
		form.reset();
		campoData.value = new Date().toISOString().split("T")[0];
		atualizarQuilometragemRodada();
		campoOutraAtividade.classList.remove("ativo");
		inputOutraAtividade.required = false;
	} catch (erro) {
		alert("Erro ao salvar!");
		console.error(erro);
	}
});
