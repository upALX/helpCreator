import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { FileVideo, Upload } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import {fetchFile} from '@ffmpeg/util'
import { api } from "@/lib/axios";
import { PromptSelect } from "./prompt-select";

type Status = 'waiting' | 'convert' | 'upload' | 'generate' | 'success'
const statusMessages = {
    'convert': 'Converting...',
    'generate': 'Transcribing...',
    'upload': 'Uploading...',
    'success': 'Success!!!'
}

interface VideoInputFormProps{
    onVideoUploaded: (id: string) => void
}


export function VideoInputForm(props: VideoInputFormProps){
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [status, setStatus] = useState<Status>('waiting')
    const promptInputRef = useRef<HTMLTextAreaElement>(null)

    // Creating selection preview of video
    function handleFileSelected(event: ChangeEvent<HTMLInputElement>){
        const {files} = event.currentTarget

        if (!files){
            return 
        }

        const selectedFile = files[0]

        setVideoFile(selectedFile)
    }

    async function convertVideoToAudio(video: File){
       
        console.log('Convertion was started...')

        const ffmpeg = await getFFmpeg()

        await ffmpeg?.writeFile('input.mp4', await fetchFile(video))

        console.log('Writing file...')

        ffmpeg?.on('progress', progress => {
            console.log('Convert progress: ', + Math.round(progress.progress * 100))
        })

        console.log('Try use ffmpeg...')


        await ffmpeg?.exec([
            '-i',
            'input.mp4',
            '-map',
            '0:a',
            '-b:a',
            '20k',
            '-acodec',
            'libmp3lame',
            'output.mp3' 
        ])

        const data = await ffmpeg?.readFile('output.mp3')

        const audioFileBlob = new Blob([data], {type: 'audio/mpeg'}) 
        const audioFile = new File([audioFileBlob], 'audio.mp3', {
            type: 'audio/mpeg'
        })

        console.log('Convert finished')

        return audioFile
    }

    async function handleUploadVideo(event: FormEvent<HTMLFormElement>){
        event.preventDefault()

        const prompt = promptInputRef.current?.value

        if (!videoFile){
            return 
        }

        //convert mp4 to mp3

        setStatus('convert')
        
        const audioFile = await convertVideoToAudio(videoFile)

        console.log(audioFile)
        console.log(`prompt user: ${prompt}`)

        const dataVideo = new FormData()

        dataVideo.append('file', audioFile)

        setStatus('upload')

        const response = await api.post('/video/upload', dataVideo)

        console.log(response.data)

        const videoId = response.data.video.id

        setStatus('generate')

        await api.post(`/video/${videoId}/transcription`, {
            prompt
        })

        setStatus('success')

        props.onVideoUploaded(videoId)

        console.log('Finished')
    }
    
    const previewURL = useMemo(() => {
        if (!videoFile){
            return null
        }

        return URL.createObjectURL(videoFile)
    }, [videoFile])

    return (
        <form onSubmit={handleUploadVideo} className="space-y-6">
            <label htmlFor="video" className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/10"> 
            {previewURL ?  (
                <video src={previewURL} controls={false} className="pointers-events-none absolute inset-0"/>
            ) : (
               <>
                <FileVideo className="w-4 h-4"/> Load video...
                </>
            )}

            </label>
            <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelected}/>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="transcription_prompt">Transcription prompt</Label>
              <Textarea ref={promptInputRef} disabled={status != 'waiting'} id="transcription_prompt" className="h-20 leading-relaxed resize-none" placeholder="Include keywords mentioned on the video, separated with comma (,)."></Textarea>
            </div>
            <Button data-success={status == 'success'} disabled={status != 'waiting'} type="submit" className="w-full data-[success=true]:bg-emerald-900">
                {status === 'waiting' ? (
                    <>
                        Upload video...
                        <Upload className="w-4 h-4 ml-2"/>
                    </>
                ) : statusMessages[status]}
              
            </Button>
          </form>
    )
}