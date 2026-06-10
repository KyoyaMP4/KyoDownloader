(function(thisObj) {
    // --- VARIÁVEIS GLOBAIS E DETECÇÃO DE PASTA ---
    $.global.idTarefaDownload = null;
    $.global.pastaDestinoSelecionada = Folder.desktop.fsName; 
    
    // Descobre onde o script .jsx está salvo para achar o app_ae.exe
    var pastaScript = new File($.fileName).parent.fsName;
    $.global.pastaMotor = pastaScript; 

    // --- FUNÇÃO DE VERIFICAÇÃO EM SEGUNDO PLANO ---
    $.global.verificarDownload = function() {
        var pastaTemp = Folder.temp.fsName; // Aponta para a pasta Temp do Windows (Sem erro de permissão!)
        
        // 1. Atualiza a Barra de Progresso
        var arquivoProgresso = new File(pastaTemp + "\\yt_downloader_progresso.txt");
        if (arquivoProgresso.exists) {
            arquivoProgresso.open("r");
            var progressoTexto = arquivoProgresso.readln();
            arquivoProgresso.close();
            
            if (progressoTexto && $.global.barraProgresso) {
                var valor = parseInt(progressoTexto.replace("%", ""));
                if (!isNaN(valor)) {
                    $.global.barraProgresso.value = valor;
                    $.global.textoProgresso.text = "Progresso: " + progressoTexto;
                } else {
                    $.global.textoProgresso.text = progressoTexto;
                }
            }
        }

        // 2. Verifica se Terminou
        var arquivoAviso = new File(pastaTemp + "\\yt_downloader_pronto.txt");
        if (arquivoAviso.exists) {
            arquivoAviso.open("r");
            var caminhoFinal = arquivoAviso.readln();
            arquivoAviso.close();
            
            // Limpa os arquivos temporários
            arquivoAviso.remove();
            if (arquivoProgresso.exists) arquivoProgresso.remove();
            var arquivoComando = new File(pastaTemp + "\\yt_downloader_comando.txt");
            if (arquivoComando.exists) arquivoComando.remove();
            
            // Importa para o AE
            var arquivoImportar = new File(caminhoFinal);
            if (arquivoImportar.exists) {
                app.project.importFile(new ImportOptions(arquivoImportar));
            }
            
            // Finaliza UI
            $.global.textoProgresso.text = "✅ Importação Concluída!";
            $.global.barraProgresso.value = 100;

            if ($.global.idTarefaDownload) {
                app.cancelTask($.global.idTarefaDownload);
                $.global.idTarefaDownload = null;
            }
        }
    };

    // --- CONSTRUÇÃO DA INTERFACE (SCRIPTUI PANEL) ---
    function criarPainelDownloader(thisObj) {
        var janela = (thisObj instanceof Panel) ? thisObj : new Window("palette", "YT Downloader V1.2", undefined, {resizeable:true});
        
        if (janela !== null) {
            janela.orientation = "column";
            janela.alignChildren = ["fill", "top"];
            janela.spacing = 10;
            janela.margins = 15;

            // GRUPO DE CONFIGURAÇÕES
            var painelPrincipal = janela.add("panel", undefined, "YT Downloader");
            painelPrincipal.orientation = "column";
            painelPrincipal.alignChildren = ["fill", "top"];
            painelPrincipal.spacing = 12;
            painelPrincipal.margins = 15;

            // Entrada de Link
            painelPrincipal.add("statictext", undefined, "Link do Vídeo/Música:");
            var campoUrl = painelPrincipal.add("edittext", undefined, "");

            // Escolha da Pasta de Destino
            var grupoPasta = painelPrincipal.add("group");
            grupoPasta.orientation = "row";
            grupoPasta.alignChildren = ["fill", "center"];
            var txtPasta = grupoPasta.add("edittext", undefined, $.global.pastaDestinoSelecionada);
            txtPasta.enabled = false; 
            var btnPasta = grupoPasta.add("button", undefined, "Pasta");
            btnPasta.preferredSize.width = 50;
            
            btnPasta.onClick = function() {
                var selecionada = Folder.selectDialog("Onde você quer salvar?");
                if (selecionada) {
                    $.global.pastaDestinoSelecionada = selecionada.fsName;
                    txtPasta.text = selecionada.fsName;
                }
            };

            // Checkbox de Formato
            var checkAudio = painelPrincipal.add("checkbox", undefined, "Baixar somente Áudio (MP3)");

            // BOTÃO PRINCIPAL
            var botaoBaixar = janela.add("button", undefined, "BAIXAR E IMPORTAR");
            botaoBaixar.alignment = ["fill", "top"];

            // ELEMENTOS DE PROGRESSO
            $.global.textoProgresso = janela.add("statictext", undefined, "");
            $.global.textoProgresso.alignment = "center";
            $.global.barraProgresso = janela.add("progressbar", undefined, 0, 100);
            $.global.barraProgresso.alignment = ["fill", "top"];
            $.global.barraProgresso.value = 0;

            // CRÉDITOS NO RODAPÉ
            var rodape = janela.add("group");
            rodape.orientation = "column";
            rodape.alignChildren = ["center", "bottom"];
            rodape.alignment = ["fill", "fill"];
            
            var creditos = rodape.add("statictext", undefined, "CODADO POR: @KyoyaEditor");
            creditos.graphics.foregroundColor = creditos.graphics.newPen(creditos.graphics.PenType.SOLID_COLOR, [0.5, 0.5, 0.5], 1);

            // AÇÃO DO BOTÃO
            botaoBaixar.onClick = function() {
                var url = campoUrl.text;
                if (url === "" || url.indexOf("http") === -1) {
                    alert("Insira um link válido do YouTube.");
                    return;
                }

                var pastaTemp = Folder.temp.fsName; 
                var pastaAtual = $.global.pastaMotor; 
                
                // Limpeza preventiva
                var arquivosLimpar = ["yt_downloader_pronto.txt", "yt_downloader_erro.txt", "yt_downloader_progresso.txt"];
                for (var i=0; i<arquivosLimpar.length; i++) {
                    var arq = new File(pastaTemp + "\\" + arquivosLimpar[i]);
                    if (arq.exists) arq.remove();
                }

                var formato = checkAudio.value ? "audio" : "video";

                // Criação do arquivo de comando na pasta Temp segura
                var arquivoComando = new File(pastaTemp + "\\yt_downloader_comando.txt");
                if (!arquivoComando.open("w")) {
                    alert("Erro crítico: Não foi possível criar os arquivos temporários.");
                    return;
                }
                arquivoComando.writeln(url);
                arquivoComando.writeln(formato);
                arquivoComando.writeln($.global.pastaDestinoSelecionada);
                arquivoComando.close();

                // Detecção do Executável
                var exePath = new File(pastaAtual + "\\KyoDownloaderV1.2.exe");
                if (!exePath.exists) {
                    alert("Erro crítico: O arquivo 'KyoDownloaderV1.2.exe' não foi encontrado ao lado deste script!\nProcurei em: " + pastaAtual);
                    return;
                }

                // Truque do Windows Explorer para burlar a segurança das novas versões (2024-2026) sem travar
                var comandoSeguro = 'explorer "' + exePath.fsName + '"';
                system.callSystem(comandoSeguro);

                // Agenda a verificação em background
                if ($.global.idTarefaDownload) {
                    app.cancelTask($.global.idTarefaDownload);
                }
                $.global.idTarefaDownload = app.scheduleTask("$.global.verificarDownload()", 500, true);

                $.global.textoProgresso.text = "Iniciando processo...";
                $.global.barraProgresso.value = 0;
                campoUrl.text = "";
            }; // Fechamento correto da função onClick!

            // Ajustes de redimensionamento automático
            janela.layout.layout(true);
            janela.layout.resize();
            janela.onResizing = janela.onResize = function() {
                this.layout.resize();
            }
        }
        return janela;
    }

    // Execução inicial
    var meuPainel = criarPainelDownloader(thisObj);
    if ((meuPainel != null) && (meuPainel instanceof Window)) {
        meuPainel.center();
        meuPainel.show();
    }

})(this);