import yt_dlp

def baixar_midia(url, formato):
    # Configuração base: o nome do arquivo será o título do vídeo
    ydl_opts = {
        'outtmpl': '%(title)s.%(ext)s',
    }

    if formato == 'audio':
        print("\n🎧 Configurando para baixar apenas o Áudio (MP3)...")
        ydl_opts.update({
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192', # Qualidade do MP3 (192kbps)
            }],
        })
    else:
        print("\n🎬 Configurando para baixar o Vídeo (MP4 em alta qualidade)...")
        ydl_opts.update({
            'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            'merge_output_format': 'mp4',
        })

    # Bloco para executar o download
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        print("\n✅ Download concluído com sucesso!")
    except Exception as e:
        print(f"\n❌ Ocorreu um erro: {e}")

if __name__ == "__main__":
    print("=== 🚀 Downloader do YouTube ===")
    link = input("Cole o link do vídeo: ")
    escolha = input("Deseja baixar Vídeo (V) ou Áudio (A)? ").strip().lower()

    if escolha == 'a':
        baixar_midia(link, 'audio')
    elif escolha == 'v':
        baixar_midia(link, 'video')
    else:
        print("Opção inválida. Digite 'V' para vídeo ou 'A' para áudio.")