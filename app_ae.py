import os
import sys
import tempfile
import yt_dlp

def progresso_hook(d):
    """Sinaliza o progresso do download para o After Effects ler"""
    pasta_temp = tempfile.gettempdir()
    arquivo_progresso = os.path.join(pasta_temp, "yt_downloader_progresso.txt")
    
    if d['status'] == 'downloading':
        # Remove os caracteres especiais de cor do terminal para pegar só os números
        total_bytes = d.get('total_bytes') or d.get('total_bytes_estimate')
        downloaded_bytes = d.get('downloaded_bytes', 0)
        
        if total_bytes:
            porcentagem = int((downloaded_bytes / total_bytes) * 100)
            with open(arquivo_progresso, "w", encoding="utf-8") as f:
                f.write(f"{porcentagem}%")
                
    elif d['status'] == 'finished':
        with open(arquivo_progresso, "w", encoding="utf-8") as f:
            f.write("99%")  # Quase pronto, finalizando conversões se houver

def main():
    # 1. Configura as rotas da pasta Temp do Windows
    pasta_temp = tempfile.gettempdir()
    arquivo_comando = os.path.join(pasta_temp, "yt_downloader_comando.txt")
    arquivo_pronto = os.path.join(pasta_temp, "yt_downloader_pronto.txt")
    arquivo_erro = os.path.join(pasta_temp, "yt_downloader_erro.txt")

    # Se o After Effects ainda não gerou o comando, fecha o Python silenciosamente
    if not os.path.exists(arquivo_comando):
        sys.exit()

    try:
        # 2. Lê os dados enviados pelo After Effects
        with open(arquivo_comando, "r", encoding="utf-8") as f:
            url = f.readline().strip()
            formato = f.readline().strip()
            pasta_destino = f.readline().strip()

        # 3. Detecta onde o ffmpeg.exe está (ao lado deste executável)
        pasta_motor = os.path.dirname(sys.executable) if getattr(sys, 'frozen', False) else os.path.dirname(__file__)
        caminho_ffmpeg = os.path.join(pasta_motor, "ffmpeg.exe")

        # 4. Configura as opções do YT-DLP
        ydl_opts = {
            'ffmpeg_location': caminho_ffmpeg,
            'progress_hooks': [progresso_hook],
            'quiet': True,
            'no_warnings': True,
            'nocheckcertificate': True,
            'noplaylist': True
        }

        if formato == "audio":
            ydl_opts.update({
                'format': 'bestaudio/best',
                'outtmpl': os.path.join(pasta_destino, '%(title)s.%(ext)s'),
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
            })
        else:
            # Baixa o melhor vídeo em MP4 disponível
            ydl_opts.update({
                'format': 'bestvideo[ext=mp4][vcodec^=avc1]+bestaudio[ext=m4a]/best[ext=mp4]/best',
                'merge_output_format': 'mp4',
                'outtmpl': os.path.join(pasta_destino, '%(title)s.%(ext)s'),
                'quiet': True
            })

        # 5. Executa o Download
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            arquivo_final = ydl.prepare_filename(info)
            
            # Correção de extensão para o formato de áudio (que vira MP3 pelo pós-processador)
            if formato == "audio":
                nome_base, _ = os.path.splitext(arquivo_final)
                arquivo_final = nome_base + ".mp3"

        # 6. Avisa o After Effects que terminou enviando o caminho do arquivo baixado
        with open(arquivo_pronto, "w", encoding="utf-8") as f:
            f.write(arquivo_final)

    except Exception as e:
        # Se der qualquer erro no download, salva o motivo para debug
        with open(arquivo_erro, "w", encoding="utf-8") as f:
            f.write(str(e))

if __name__ == "__main__":
    main()