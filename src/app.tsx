import {Github, Wand2} from "lucide-react"; 
import { Button } from "./components/ui/button";
import {Separator} from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import {Label} from "./components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import { VideoInputForm } from "./components/video-input-form";
import { PromptSelect } from "./components/prompt-select";
import { useState } from "react";
import {useCompletion} from 'ai/react';

export function App() {
  const [temperature, setTemperature] = useState(0.5)
  const [videoId, setVideoId] = useState<string | null>(null)

  const {input, setInput, handleInputChange} = useCompletion({
    api: 'http://localhost:3333/completion',
    body: {
      videoId,
      temperature
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">HelpCreator</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Developed with 💜 by Alexandre</span>
        
          <Separator orientation="vertical" className="h-6"/>

          <Button variant="secondary">
            <Github className="w-4 h-4 mr-2"/> Github
          </Button>

        </div>
      </div>
      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4"> 
          <div className="grid grid-rows-2 gap-4 flex-1"> 
            <Textarea className="resize-none p-5 leading-relaxed" placeholder="Insert your prompt..." value={input} onChange={handleInputChange}/>
            <Textarea className="resize-none p-5 leading-relaxed" placeholder="Result from I.A..."/>
            <p className="text-sm text-muted-foreground">Remember: you can use the variable <code className="text-violet-400">{'{transcription}'}</code> on your prompt to add the content of  selected video transcription.</p>
          </div>
        </div>
        <aside className="w-80 space-y-6">
          
          <VideoInputForm onVideoUploaded={setVideoId}/>

          <Separator/>
          <form className="space-y-6">
          <div className="space-y-2">
              <Label>Prompt</Label>
              <PromptSelect onPromptSelected={setInput}/>
          </div>

            <div className="space-y-2">
              <Label>Model</Label>
                <Select disabled defaultValue="gpt3.5">
                  <SelectTrigger>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt3.5">
                      GPT 3.5
                    </SelectItem>
                  </SelectContent>
                </Select>
                <span className="block text-sm text-muted-foreground italic">You can customize this option in the feature!</span>
            </div>

            <Separator/>

            <div className="space-y-4">
              <Label>Temperature</Label>
                <Slider 
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={value => setTemperature(value[0])}
                />                  
                <span className="block leading-relaxed text-sm text-muted-foreground italic reading-relaxed">High values can be turn the result more creative, but with some errors of wrong information.</span>
            </div>
            
            <Separator/>

            <Button type="submit" className="w-full"> Execute <Wand2 className="w-4 h-4 ml-2"/> </Button>

          </form>
        </aside>
      </main>
    </div>
  )
}
