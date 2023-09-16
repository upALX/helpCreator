import {Github, FileVideo, Upload, Wand2} from "lucide-react"; 
import { Button } from "./components/ui/button";
import {Separator} from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import {Label} from "./components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";

export function App() {
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
            <Textarea className="resize-none p-5 leading-relaxed" placeholder="Insert your prompt..."/>
            <Textarea className="resize-none p-5 leading-relaxed" placeholder="Result from I.A..."/>
            <p className="text-sm text-muted-foreground">Remember: you can use the variable <code className="text-violet-400">{'{transcription}'}</code> on your prompt to add the content of  selected video transcription.</p>
          </div>
        </div>
        <aside className="w-80 space-y-6">
          <form className="space-y-6">
            <label htmlFor="video" className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/10"> <FileVideo className="w-4 h-4"/> Load video... </label>
            <input type="file" id="video" accept="video/mp4" className="sr-only"/>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="transcription_prompt">Transcription prompt</Label>
              <Textarea id="transcription_prompt" className="h-20 leading-relaxed resize-none" placeholder="Include keywords mentioned on the video, separated with comma (,)."></Textarea>
            </div>
            <Button type="submit" className="w-full">
              Load video...
              <Upload className="w-4 h-4 ml-2"/>
            </Button>
          </form>
          <Separator/>
          <form className="space-y-6">
          <div className="space-y-2">
              <Label>Prompt</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a prompt..."/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">
                      Titulo exemplo
                    </SelectItem>
                    <SelectItem value="description">
                      Titulo exemplo
                    </SelectItem>
                  </SelectContent>
                </Select>
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
