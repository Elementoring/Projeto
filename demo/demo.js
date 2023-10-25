const numSetores = 10;
        const vagasPorSetor = 13;
        const vagasPorSetorData = [];
        const valorPorHora = 5.00;
        
        // Função para inicializar vagas para um setor específico
        function inicializarVagasParaSetor() {
            const setorData = [];
            for (let vaga = 1; vaga <= vagasPorSetor; vaga++) {
                setorData.push({
                    numero: vaga,
                    ocupada: false,
                    placa: null,
                    tempoEstacionado: 0,
                    temporizador: null,
                });
            }
            return setorData;
        }
        
        // Inicialize as vagas para todos os setores
        try {
            for (let setor = 0; setor < numSetores; setor++) {
                vagasPorSetorData.push(inicializarVagasParaSetor());
            }
        } catch (error) {
            console.error("Erro ao inicializar as vagas:", error);
        }
        
        // Função para atualizar as vagas com base no setor selecionado
        function atualizarVagas() {
            try {
                const setorSelecionado = parseInt(document.getElementById("setorSelecionado").value);
                if (isNaN(setorSelecionado) || setorSelecionado < 0 || setorSelecionado >= numSetores) {
                    throw new Error("Setor selecionado inválido.");
                }
                const vagasDiv = document.getElementById("vagasSetor");
                vagasDiv.innerHTML = "";
        
                const vagasDoSetor = vagasPorSetorData[setorSelecionado];
        
                vagasDoSetor.forEach((vaga) => {
                    const vagaDiv = document.createElement("div");
                    vagaDiv.className = `vaga ${vaga.ocupada ? "ocupada" : "disponivel"}`;
                    vagaDiv.textContent = vaga.ocupada ? `Vaga ${vaga.numero} (${vaga.placa})` : `Vaga ${vaga.numero}`;
        
                    // Adicione um temporizador embaixo da box da vaga
                    if (vaga.ocupada) {
                        const tempoEstacionadoDiv = document.createElement("div");
                        tempoEstacionadoDiv.className = "tempo-estacionado";
                        tempoEstacionadoDiv.textContent = `Tempo: ${segundosParaTempo(vaga.tempoEstacionado)}`;
                        vagaDiv.appendChild(tempoEstacionadoDiv);
                    }
        
                    vagasDiv.appendChild(vagaDiv);
                });
        
                // Atualize as opções de vagas disponíveis e ocupadas
                atualizarOpcoesVagasDisponiveis();
                atualizarOpcoesVagasOcupadas();
            } catch (error) {
                console.error("Erro ao atualizar vagas:", error);
            }
        }
        
        // Função para atualizar as opções de vagas disponíveis no dropdown
        function atualizarOpcoesVagasDisponiveis() {
            const vagasDisponiveisSelect = document.getElementById("vagasDisponiveis");
            vagasDisponiveisSelect.innerHTML = "<option disabled selected>Escolha a Vaga Disponível</option>";
            const setorSelecionado = parseInt(document.getElementById("setorSelecionado").value);
            
            vagasPorSetorData[setorSelecionado].forEach((vaga) => {
                if (!vaga.ocupada) {
                    const option = document.createElement("option");
                    option.value = vaga.numero;
                    option.textContent = `Vaga ${vaga.numero}`;
                    vagasDisponiveisSelect.appendChild(option);
                }
            });
        }
        
        // Função para atualizar as opções de vagas ocupadas no dropdown
        function atualizarOpcoesVagasOcupadas() {
            const vagasOcupadasSelect = document.getElementById("vagasOcupadas");
            vagasOcupadasSelect.innerHTML = "<option disabled selected>Escolha a Vaga Ocupada</option>";
            const setorSelecionado = parseInt(document.getElementById("setorSelecionado").value);
            
            vagasPorSetorData[setorSelecionado].forEach((vaga) => {
                if (vaga.ocupada) {
                    const option = document.createElement("option");
                    option.value = vaga.numero;
                    option.textContent = `Vaga ${vaga.numero} (${vaga.placa})`;
                    vagasOcupadasSelect.appendChild(option);
                }
            });
        
            // Habilita o dropdown se houver vagas ocupadas
            vagasOcupadasSelect.disabled = vagasOcupadasSelect.length === 1;
        }
        
        // Função para atualizar os tempos estacionados
        function atualizarTemposEstacionados() {
            const temposEstacionadosDiv = document.getElementById("temposEstacionados");
            temposEstacionadosDiv.innerHTML = "";
        
            const setorSelecionado = parseInt(document.getElementById("setorSelecionado").value);
        
            vagasPorSetorData[setorSelecionado].forEach((vaga) => {
                if (vaga.ocupada) {
                    const tempoEstacionadoDiv = document.createElement("div");
                    tempoEstacionadoDiv.textContent = `Vaga ${vaga.numero}: ${segundosParaTempo(vaga.tempoEstacionado)}`;
                    temposEstacionadosDiv.appendChild(tempoEstacionadoDiv);
                }
            });
        }
        
        function registrarEntrada() {
            try {
                const vagasDisponiveisSelect = document.getElementById("vagasDisponiveis");
                const vagaSelecionada = vagasDisponiveisSelect.value;
                const placaInput = document.getElementById("placa");
                const placa = placaInput.value;
        
                if (!vagaSelecionada || !placa) {
                    throw new Error("Selecione uma vaga e insira a placa do veículo.");
                }
        
                const tipoVeiculoSelect = document.getElementById("tipoVeiculo");
                const tipoVeiculo = tipoVeiculoSelect.value; // Captura o tipo de veículo
        
                const setorSelecionado = parseInt(document.getElementById("setorSelecionado").value);
                const vaga = vagasPorSetorData[setorSelecionado].find((v) => v.numero == vagaSelecionada);
        
                if (!vaga || vaga.ocupada) {
                    throw new Error("A vaga selecionada não está disponível.");
                }
        
                vaga.placa = placa;
                vaga.ocupada = true;
                vaga.tempoEstacionado = 0;
                vaga.temporizador = setInterval(() => {
                    vaga.tempoEstacionado++;
                    atualizarTemposEstacionados();
                }, 1000); // Inicia o temporizador para a vaga
        
                atualizarVagas();
                atualizarOpcoesVagasOcupadas();
                atualizarOpcoesVagasDisponiveis();
        
                // Limpar o campo de inserção do número da placa
                placaInput.value = "";
        
                // Calcular o valor a pagar com base no tipo de veículo
                const valorPagar = calcularValorPagar(vaga.tempoEstacionado, tipoVeiculo);

        // alert(`Veículo com placa ${vaga.placa} deixou a Vaga ${vaga.numero}. Valor a pagar: ${valorPagar}`);
    } catch (error) {
        console.error("Erro ao registrar entrada:", error);
    }
        }
        
        function registrarSaida() {
            try {
                const vagasOcupadasSelect = document.getElementById("vagasOcupadas");
                const vagaSelecionada = vagasOcupadasSelect.value;
        
                if (!vagaSelecionada) {
                    throw new Error("Selecione uma vaga ocupada para registrar a saída.");
                }
        
                const setorSelecionado = parseInt(document.getElementById("setorSelecionado").value);
                const vaga = vagasPorSetorData[setorSelecionado].find((v) => v.numero == vagaSelecionada);
        
                if (!vaga || !vaga.ocupada) {
                    throw new Error("A vaga selecionada não está ocupada.");
                }
        
                const valorPagar = calcularValorPagar(vaga.tempoEstacionado);
        
                // Remove o temporizador da vaga
                clearInterval(vaga.temporizador);
        
                alert(`${tipoVeiculo.value} com placa ${vaga.placa} deixou a Vaga ${vaga.numero}. Valor a pagar: R$ ${valorPagar}`);
                vaga.ocupada = false;
                vaga.placa = null;
                vaga.tempoEstacionado = 0;
                vaga.temporizador = null; // Limpa o temporizador
                atualizarVagas();
                atualizarOpcoesVagasOcupadas();
                atualizarOpcoesVagasDisponiveis();
                atualizarTemposEstacionados(); // Atualiza os tempos estacionados após remover o temporizador
            } catch (error) {
                console.error("Erro ao registrar saída:", error);
            }
        }
        
        
        // Função para calcular o valor a pagar com base no tempo estacionado
function calcularValorPagar(tempoEstacionado, tipoVeiculo) {
    // Valores de tarifas
    const valorPernoiteCarroMoto = 30; // Valor do pernoite de carro e moto
    const valorDiariaCarroMoto = 45;   // Valor da diária de carro e moto
    const valorPernoiteVan = 50;      // Valor do pernoite de van
    const valorDiariaVan = 65;        // Valor da diária de van

    // Valor por hora já está definido globalmente
    const horasEstacionadas = Math.ceil(tempoEstacionado / 3600);

    // Verifica se o tempo estacionado é maior ou igual a 24 horas para aplicar a diária
    if (horasEstacionadas >= 24) {
        if (tipoVeiculo === 'Van') {
            return `R$ ${valorDiariaVan.toFixed(2)} (Diária de Van)`;
        } else {
            return `R$ ${valorDiariaCarroMoto.toFixed(2)} (Diária de Carro/Moto)`;
        }
    }

    // Verifica se o tempo estacionado é maior ou igual a 12 horas para aplicar o valor do pernoite
    if (horasEstacionadas >= 12) {
        if (tipoVeiculo === 'Van') {
            return `R$ ${valorPernoiteVan.toFixed(2)} (Pernoite de Van)`;
        } else {
            return `R$ ${valorPernoiteCarroMoto.toFixed(2)} (Pernoite de Carro/Moto)`;
        }
    }

    // Se não for diária nem pernoite, calcula o valor por hora
    const valorHora = valorPorHora * Math.ceil(horasEstacionadas);
    return `R$ ${valorHora.toFixed(2)}`;
}


        
        // Função para converter segundos em formato de tempo (hh:mm:ss)
        function segundosParaTempo(segundos) {
            const horas = Math.floor(segundos / 3600);
            segundos %= 3600;
            const minutos = Math.floor(segundos / 60);
            segundos %= 60;
            return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        }
        

        // Função para reiniciar todo o sistema
function reiniciarSistema() {
    if (confirm("Tem certeza de que deseja reiniciar todo o sistema? Isso irá limpar todos os dados de vagas ocupadas e tempos estacionados.")) {
        // Limpar todos os dados de vagas ocupadas e tempos estacionados
        vagasPorSetorData.forEach((setor) => {
            setor.forEach((vaga) => {
                vaga.ocupada = false;
                vaga.placa = null;
                vaga.tempoEstacionado = 0;
                if (vaga.temporizador) {
                    clearInterval(vaga.temporizador);
                    vaga.temporizador = null;
                }
            });
        });

        // Atualizar a interface após a reinicialização
        atualizarVagas();
        atualizarOpcoesVagasOcupadas();
        atualizarOpcoesVagasDisponiveis();
        atualizarTemposEstacionados();

        alert("O sistema foi reiniciado com sucesso.");
    }
}
        // Chamada inicial para atualizar as vagas disponíveis
        atualizarVagas();
        atualizarOpcoesVagasOcupadas();
        atualizarOpcoesVagasDisponiveis();