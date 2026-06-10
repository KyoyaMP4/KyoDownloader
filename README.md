# 🎬 KyoDownloader v1.2

Um script de integração direta entre o After Effects e o Python, criado para acelerar o workflow de editores de vídeo. Com ele, você baixa vídeos da internet direto para o seu projeto, sem precisar sair do After Effects. Ideal para quem produz edits, AMVs ou animações em loop e não quer perder tempo baixando mídia manualmente no navegador.

---

## ⚠️ Avisos Importantes e Regras de Uso (LEIA ANTES DE USAR)

Este projeto é de código aberto para ajudar a comunidade, mas possui diretrizes estritas. Ao baixar e utilizar o script, você concorda com os pontos abaixo:

1. **Vibe Code:** Sendo bem sincero, uma boa parte deste código foi construída na base do "vibe code" (tentativa, erro, intuição e muitos testes). Ele funciona perfeitamente para o meu workflow diário, mas pode conter algumas gambiarras de programação. Use sabendo disso!
2. **Proibido Uso Malicioso:** É estritamente proibido modificar, injetar ou utilizar este código para qualquer fim malicioso, invasão de privacidade, roubo de dados ou dano a máquinas de terceiros.
3. **Créditos Obrigatórios:** A ferramenta é aberta para estudos e melhorias. No entanto, se você modificar o código, criar um fork ou fizer uma versão própria em cima da minha base, você **DEVE** obrigatoriamente mencionar os créditos originais ao criador (**@KyoyaEditor**).
4. **Não Roube o Projeto:** Seja honesto. Não pegue o código e tome 100% dos créditos da criação para si. A comunidade se mantém viva através do respeito ao tempo e esforço dos outros.

---

## ⚙️ Pré-requisitos

Para que o script funcione na sua máquina, você precisa ter:

* Python instalado no computador (lembre-se de marcar a opção "Add Python to PATH" no instalador).
* FFmpeg e FFprobe instalados e configurados nas Variáveis de Ambiente do Windows.
* Adobe After Effects.

---

## 🚀 Como Instalar e Configurar

1. Faça o download deste repositório em formato ZIP ou clone usando o Git.
2. Extraia os arquivos em uma pasta de sua preferência.
3. Abra o terminal (ou Prompt de Comando) dentro da pasta principal do projeto.
4. Instale as bibliotecas necessárias do Python rodando o seguinte comando:

pip install -r requirements.txt

## 💻 Como Usar no After Effects

1. Abra o Adobe After Effects.
2. Vá no menu superior e clique em: File > Scripts > Run Script File... (Arquivo > Scripts > Executar Arquivo de Script...).
3. Navegue até a pasta onde você salvou o projeto, abra a pasta "App" e selecione o arquivo "KyoDownloaderV1.2.jsx".
4. O painel do KyoDownloader vai abrir na sua interface. É só colar o link e baixar direto pro seu projeto!

---
Desenvolvido por Kyo (@KyoyaEditor)
